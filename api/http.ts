export const getApiBaseUrl = () =>
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "";

export const buildApiUrl = (path: string) => `${getApiBaseUrl()}${path}`;