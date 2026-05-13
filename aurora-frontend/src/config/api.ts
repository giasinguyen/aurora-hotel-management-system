export const getApiBaseUrl = (): string => {
  const runtimeBaseUrl =
    typeof window !== "undefined" ? window._env_?.VITE_API_BASE_URL : undefined;

  return runtimeBaseUrl || import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
};
