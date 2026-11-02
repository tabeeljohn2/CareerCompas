const API = process.env.NEXT_PUBLIC_API_BASE_URL;
const TOKEN_KEY = "careercompas_token";

export function getToken(): string | null {
  return typeof window === "undefined" ? null : localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
  window.dispatchEvent(new Event("auth-change")); // tells the navbar to update
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
  window.dispatchEvent(new Event("auth-change"));
}

export async function authRequest(
  mode: "login" | "register",
  email: string,
  password: string
): Promise<string> {
  const res = await fetch(`${API}/api/auth/${mode}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      typeof data.detail === "string" ? data.detail : "Something went wrong. Please try again."
    );
  }
  return data.access_token as string;
}