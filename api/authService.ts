import { buildApiUrl } from "./http";

export interface LoginPayload {
  email: string;
  senha: string;
  recaptchaToken: string;
}

async function parseErrorMessage(response: Response) {
  try {
    const data: unknown = await response.json();

    if (data && typeof data === "object") {
      if ("message" in data && typeof data.message === "string") {
        return data.message;
      }

      if ("error" in data && typeof data.error === "string") {
        return data.error;
      }
    }
  } catch {
    return `Erro ao autenticar (status ${response.status})`;
  }

  return `Erro ao autenticar (status ${response.status})`;
}

export async function login(payload: LoginPayload): Promise<unknown> {
  const response = await fetch(buildApiUrl("/api/v1/auth/login"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await parseErrorMessage(response));
  }

  try {
    return await response.json();
  } catch {
    return null;
  }
}