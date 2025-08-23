// Helper to get environment variables safely
const getEnvVar = (key, defaultValue = undefined, { required = true } = {}) => {
  if (typeof process !== "undefined" && process.env && process.env[key]) {
    return process.env[key];
  }
  if (defaultValue !== undefined) {
    return defaultValue;
  }
  if (required) {
    throw new Error(`${key} environment variable is required but not set`);
  }
  return undefined;
};

// Public variables → safe for frontend
export const publicEnv = {
  NEXT_PUBLIC_APP_URL: getEnvVar("NEXT_PUBLIC_APP_URL", "http://localhost:3000"),
  NEXT_PUBLIC_IMAGE_DOMAIN: getEnvVar("NEXT_PUBLIC_IMAGE_DOMAIN", "localhost"),
};

// Private variables → only for backend
export const privateEnv = {
  REMOVE_BG_API_KEY: getEnvVar("REMOVE_BG_API_KEY"), // Remove.bg API key
};

// Validate server-side
if (typeof window === "undefined") {
  if (!publicEnv.NEXT_PUBLIC_APP_URL.startsWith("http")) {
    throw new Error(
      "NEXT_PUBLIC_APP_URL must start with http:// or https://"
    );
  }
}
