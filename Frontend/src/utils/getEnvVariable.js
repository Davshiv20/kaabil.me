export const getEnvVariable = (key, defaultValue = undefined) => {
    const value = import.meta.env[key];
    if (value === undefined) {
      if (defaultValue !== undefined) {
        return defaultValue;
      }
      throw new Error(`Environment variable ${key} is not set.`);
    }
    return value;
  };