
// frontend/lib/api/client.ts

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not configured.");
}

export class ApiError extends Error {
  status: number;
  details?: unknown;

  constructor(
    message: string,
    status: number,
    details?: unknown
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined | null>;
}

function buildUrl(
  endpoint: string,
  params?: RequestOptions["params"]
) {
  const url = new URL(
    endpoint,
    API_URL.endsWith("/")
      ? API_URL
      : `${API_URL}/`
  );

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value));
      }
    });
  }

  return url.toString();
}

async function parseResponse(response: Response) {
  const contentType = response.headers.get("content-type");

  if (contentType?.includes("application/json")) {
    return response.json();
  }

  return response.text();
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const {
    params,
    headers,
    ...fetchOptions
  } = options;

  const response = await fetch(
    buildUrl(endpoint, params),
    {
      ...fetchOptions,
      headers: {
        "Content-Type": "application/json",
        ...headers
      },
      cache: "no-store"
    }
  );

  const data = await parseResponse(response);

  if (!response.ok) {
    const message =
      typeof data === "object" &&
      data !== null &&
      "detail" in data
        ? String(
            (data as { detail: unknown }).detail
          )
        : `API request failed with status ${response.status}`;

    throw new ApiError(
      message,
      response.status,
      data
    );
  }

  return data as T;
}

export function apiGet<T>(
  endpoint: string,
  params?: RequestOptions["params"]
) {
  return apiRequest<T>(endpoint, {
    method: "GET",
    params
  });
}

export function apiPost<T>(
  endpoint: string,
  body?: unknown
) {
  return apiRequest<T>(endpoint, {
    method: "POST",
    body: body !== undefined
      ? JSON.stringify(body)
      : undefined
  });
}

export function apiPut<T>(
  endpoint: string,
  body?: unknown
) {
  return apiRequest<T>(endpoint, {
    method: "PUT",
    body: body !== undefined
      ? JSON.stringify(body)
      : undefined
  });
}

export function apiDelete<T>(
  endpoint: string
) {
  return apiRequest<T>(endpoint, {
    method: "DELETE"
  });
}

