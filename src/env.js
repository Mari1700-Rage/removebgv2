// Environment variable configuration and validation
const getEnvVar = (key, defaultValue = undefined) => {
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key];
  }
  if (defaultValue !== undefined) {
    return defaultValue;
  }
  throw new Error(`${key} environment variable is required but not set`);
};

const env = {
  NEXT_PUBLIC_APP_URL: getEnvVar('NEXT_PUBLIC_APP_URL', 'http://localhost:3000'),
  NEXT_PUBLIC_IMAGE_DOMAIN: getEnvVar('NEXT_PUBLIC_IMAGE_DOMAIN', 'localhost'),
  NEXT_PUBLIC_MODEL_ID: getEnvVar('NEXT_PUBLIC_MODEL_ID', 'briaai/RMBG-1.4'),
};

// Validate environment variables format
if (typeof window === 'undefined') { // Only run on server-side
  if (!env.NEXT_PUBLIC_APP_URL.startsWith('http')) {
    throw new Error('NEXT_PUBLIC_APP_URL must be a valid URL starting with http:// or https://');
  }

  if (!env.NEXT_PUBLIC_MODEL_ID.includes('/')) {
    throw new Error('NEXT_PUBLIC_MODEL_ID must be in the format "owner/model-name"');
  }
}

export default env; 