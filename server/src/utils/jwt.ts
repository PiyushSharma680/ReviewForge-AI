import jwt from 'jsonwebtoken';
import { getRequiredEnv } from '../config/env.js';

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

export const generateAccessToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, getRequiredEnv('JWT_SECRET'), { expiresIn: JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'] });
};

export const generateRefreshToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, getRequiredEnv('REFRESH_TOKEN_SECRET'), { expiresIn: REFRESH_TOKEN_EXPIRES_IN as jwt.SignOptions['expiresIn'] });
};

export const verifyAccessToken = (token: string): TokenPayload => {
  return jwt.verify(token, getRequiredEnv('JWT_SECRET')) as TokenPayload;
};

export const verifyRefreshToken = (token: string): TokenPayload => {
  return jwt.verify(token, getRequiredEnv('REFRESH_TOKEN_SECRET')) as TokenPayload;
};
