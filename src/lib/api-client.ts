export type ApiErrorPayload = {
  error?: {
    code?: string;
    message?: string;
    details?: unknown;
  };
};

export type ApiSuccessPayload<T> = {
  data: T;
};

export class ApiRequestError extends Error {
  status: number;
  code?: string;
  details?: unknown;

  constructor(status: number, message: string, code?: string, details?: unknown) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    ...init,
    headers: {
      "content-type": "application/json",
      ...init?.headers,
    },
  });

  const payload = (await response.json().catch(() => null)) as (Partial<ApiSuccessPayload<T>> & ApiErrorPayload) | null;

  if (!response.ok) {
    throw new ApiRequestError(response.status, payload?.error?.message ?? "Request gagal diproses.", payload?.error?.code, payload?.error?.details);
  }

  return payload?.data as T;
}
