const unsafeValues = new Set([
  'your_github_client_id',
  'your_github_client_secret',
  'your_openai_api_key',
  'your_gemini_api_key',
]);

export const getRequiredEnv = (name: string): string => {
  const value = process.env[name]?.trim();
  const isProd = process.env.NODE_ENV === 'production';
  if (!value || (isProd && unsafeValues.has(value))) {
    throw new Error(`Missing or invalid required environment variable: ${name}`);
  }
  return value;
};

export const validateRuntimeEnvironment = (): void => {
  const required = [
    'MONGODB_URI',
    'REDIS_URL',
    'JWT_SECRET',
    'REFRESH_TOKEN_SECRET',
    'CLIENT_URL',
  ];

  const isProd = process.env.NODE_ENV === 'production';

  const missing = required.filter((name) => {
    const value = process.env[name]?.trim();
    return !value || (isProd && unsafeValues.has(value));
  });

  if (missing.length > 0) {
    throw new Error(`Missing required environment variable(s): ${missing.join(', ')}`);
  }
};
