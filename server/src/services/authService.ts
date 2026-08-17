import { User, IUser } from '../models/User.js';
import { ApiError } from '../utils/apiError.js';
import { getRequiredEnv } from '../config/env.js';
import { createHmac, randomBytes, timingSafeEqual } from 'crypto';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '../utils/jwt.js';

export interface RegisterDTO {
  name: string;
  email: string;
  password?: string;
  githubId?: string;
  googleId?: string;
  avatar?: string;
  role?: 'admin' | 'developer' | 'owner';
}

export interface LoginDTO {
  email: string;
  password: string;
}

interface GitHubProfile {
  githubId: string;
  email: string;
  name: string;
  username: string;
  avatar: string;
  accessToken: string;
}

interface GitHubOAuthState {
  returnTo: string;
  nonce: string;
  expiresAt: number;
}

interface GitHubTokenResponse {
  access_token?: string;
  error?: string;
  error_description?: string;
}

interface GitHubUserResponse {
  id: number;
  login: string;
  name: string | null;
  email: string | null;
  avatar_url: string;
}

interface GitHubEmailResponse {
  email: string;
  primary: boolean;
  verified: boolean;
}

export class AuthService {
  static async register(dto: RegisterDTO) {
    const existingUser = await User.findOne({ email: dto.email });
    if (existingUser) {
      throw ApiError.badRequest('User with this email already exists');
    }

    const user = await User.create({
      name: dto.name,
      email: dto.email,
      password: dto.password,
      githubId: dto.githubId,
      googleId: dto.googleId,
      avatar: dto.avatar,
      role: dto.role || 'developer',
    });

    const accessToken = generateAccessToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    const refreshToken = generateRefreshToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    user.refreshToken = refreshToken;
    await user.save();

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        githubUsername: user.githubUsername,
      },
      accessToken,
      refreshToken,
    };
  }

  static async login(dto: LoginDTO) {
    const user = await User.findOne({ email: dto.email }).select('+password');
    if (!user) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    const isMatch = await user.comparePassword(dto.password);
    if (!isMatch) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    const accessToken = generateAccessToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    const refreshToken = generateRefreshToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    user.refreshToken = refreshToken;
    await user.save();

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        githubUsername: user.githubUsername,
      },
      accessToken,
      refreshToken,
    };
  }

  static async refreshTokens(token: string) {
    try {
      const decoded = verifyRefreshToken(token);
      const user = await User.findById(decoded.userId).select('+refreshToken');

      if (!user || user.refreshToken !== token) {
        throw ApiError.unauthorized('Invalid refresh token');
      }

      const accessToken = generateAccessToken({
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
      });

      const newRefreshToken = generateRefreshToken({
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
      });

      user.refreshToken = newRefreshToken;
      await user.save();

      return { accessToken, refreshToken: newRefreshToken };
    } catch (error) {
      throw ApiError.unauthorized('Invalid or expired refresh token');
    }
  }

  static async logout(userId: string): Promise<void> {
    await User.findByIdAndUpdate(userId, { $unset: { refreshToken: 1 } });
  }

  static createGitHubAuthorizationUrl(returnTo: string): string {
    const clientUrl = new URL(getRequiredEnv('CLIENT_URL'));
    const targetUrl = new URL(returnTo);
    if (targetUrl.origin !== clientUrl.origin || targetUrl.pathname !== '/auth/github/callback') {
      throw ApiError.badRequest('Invalid GitHub OAuth return URL');
    }

    const state: GitHubOAuthState = {
      returnTo: targetUrl.toString(),
      nonce: randomBytes(16).toString('hex'),
      expiresAt: Date.now() + 10 * 60 * 1000,
    };
    const encodedState = Buffer.from(JSON.stringify(state)).toString('base64url');
    const signature = createHmac('sha256', getRequiredEnv('JWT_SECRET'))
      .update(encodedState)
      .digest('base64url');
    const query = new URLSearchParams({
      client_id: getRequiredEnv('GITHUB_CLIENT_ID'),
      redirect_uri: getRequiredEnv('GITHUB_CALLBACK_URL'),
      scope: 'read:user user:email repo',
      state: `${encodedState}.${signature}`,
    });

    return `https://github.com/login/oauth/authorize?${query.toString()}`;
  }

  static verifyGitHubState(state: string): GitHubOAuthState {
    const [encodedState, suppliedSignature] = state.split('.');
    if (!encodedState || !suppliedSignature) {
      throw ApiError.unauthorized('Invalid GitHub OAuth state');
    }

    const expectedSignature = createHmac('sha256', getRequiredEnv('JWT_SECRET'))
      .update(encodedState)
      .digest('base64url');
    const supplied = Buffer.from(suppliedSignature);
    const expected = Buffer.from(expectedSignature);
    if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) {
      throw ApiError.unauthorized('Invalid GitHub OAuth state');
    }

    try {
      const parsed = JSON.parse(Buffer.from(encodedState, 'base64url').toString('utf8')) as GitHubOAuthState;
      if (!parsed.returnTo || !parsed.expiresAt || parsed.expiresAt < Date.now()) {
        throw new Error('Expired state');
      }
      return parsed;
    } catch {
      throw ApiError.unauthorized('Invalid or expired GitHub OAuth state');
    }
  }

  static async authenticateWithGitHubCode(code: string): Promise<ReturnType<typeof AuthService.handleGitHubAuth>> {
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: getRequiredEnv('GITHUB_CLIENT_ID'),
        client_secret: getRequiredEnv('GITHUB_CLIENT_SECRET'),
        code,
        redirect_uri: getRequiredEnv('GITHUB_CALLBACK_URL'),
      }),
    });
    const tokenData = (await tokenResponse.json()) as GitHubTokenResponse;
    if (!tokenResponse.ok || !tokenData.access_token) {
      throw ApiError.unauthorized(tokenData.error_description || tokenData.error || 'GitHub authorization failed');
    }

    const headers = {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${tokenData.access_token}`,
      'X-GitHub-Api-Version': '2022-11-28',
    };
    const [profileResponse, emailResponse] = await Promise.all([
      fetch('https://api.github.com/user', { headers }),
      fetch('https://api.github.com/user/emails', { headers }),
    ]);
    if (!profileResponse.ok || !emailResponse.ok) {
      throw ApiError.unauthorized('Unable to retrieve the GitHub account profile');
    }

    const profile = (await profileResponse.json()) as GitHubUserResponse;
    const emails = (await emailResponse.json()) as GitHubEmailResponse[];
    const verifiedEmail = emails.find((email) => email.primary && email.verified)?.email
      || emails.find((email) => email.verified)?.email
      || profile.email;
    if (!verifiedEmail) {
      throw ApiError.badRequest('GitHub did not return a verified email address');
    }

    return AuthService.handleGitHubAuth({
      githubId: profile.id.toString(),
      email: verifiedEmail,
      name: profile.name || profile.login,
      username: profile.login,
      avatar: profile.avatar_url,
      accessToken: tokenData.access_token,
    });
  }

  static async handleGitHubAuth(githubProfile: GitHubProfile) {
    let user = await User.findOne({
      $or: [{ githubId: githubProfile.githubId }, { email: githubProfile.email }],
    });

    if (!user) {
      user = await User.create({
        name: githubProfile.name || githubProfile.username,
        email: githubProfile.email,
        githubId: githubProfile.githubId,
        githubUsername: githubProfile.username,
        githubAccessToken: githubProfile.accessToken,
        avatar: githubProfile.avatar,
        role: 'developer',
      });
    } else {
      user.githubId = githubProfile.githubId;
      user.githubUsername = githubProfile.username;
      user.githubAccessToken = githubProfile.accessToken;
      if (githubProfile.avatar) user.avatar = githubProfile.avatar;
      await user.save();
    }

    const accessToken = generateAccessToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    const refreshToken = generateRefreshToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    user.refreshToken = refreshToken;
    await user.save();

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        githubUsername: user.githubUsername,
      },
      accessToken,
      refreshToken,
    };
  }
}
