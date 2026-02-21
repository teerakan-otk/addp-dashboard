import { cookies } from "next/headers";

export async function apiGet<T>(
  url: string,
  tokenName: string,
  options?: RequestInit,
): Promise<T> {
  const cookieStore = await cookies();
  const token = cookieStore.get(tokenName)?.value;

  try {
    const res = await fetch(url, {
      ...options,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(options?.headers || {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!res.ok) {
      throw new Error(`Error ${res.status}`);
    }

    return res.json();
  } catch (error) {
    throw new Error("Service unavailable");
  }
}

type BodyType =
  | Record<string, unknown>
  | FormData
  | URLSearchParams
  | Blob
  | ArrayBuffer
  | string
  | null
  | undefined;

export async function apiPost<T>(
  url: string,
  tokenName: string,
  body?: BodyType,
  options?: RequestInit,
): Promise<T> {
  const cookieStore = await cookies();
  const token = cookieStore.get(tokenName)?.value;

  let finalBody: BodyInit | undefined;
  let headers: HeadersInit = { ...(options?.headers || {}) };

  // 🔥 จัดการ body ตาม type
  if (body instanceof FormData) {
    finalBody = body;
    // ❗ ห้าม set Content-Type เอง เดี๋ยว boundary พัง
  } else if (body instanceof URLSearchParams) {
    finalBody = body;
    headers["Content-Type"] = "application/x-www-form-urlencoded";
  } else if (
    typeof body === "string" ||
    body instanceof Blob ||
    body instanceof ArrayBuffer
  ) {
    finalBody = body as BodyInit;
  } else if (body && typeof body === "object") {
    finalBody = JSON.stringify(body);
    headers["Content-Type"] = "application/json";
  }

  try {
    const res = await fetch(url, {
      ...options,
      method: "POST",
      headers: {
        ...headers,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: finalBody,
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Error ${res.status}: ${errorText}`);
    }

    return res.json();
  } catch {
    throw new Error("Service unavailable");
  }
}
