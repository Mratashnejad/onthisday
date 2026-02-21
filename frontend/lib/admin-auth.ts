export const ADMIN_TOKEN_KEY = "otd_admin_access_token";
const ADMIN_TOKEN_MAX_AGE_SECONDS = 60 * 60 * 12; // 12 hours

function getCookie(name: string): string | null {
  if (typeof document === "undefined") {
    return null;
  }

  const cookies = document.cookie.split(";").map((item) => item.trim());
  const target = cookies.find((item) => item.startsWith(`${name}=`));
  if (!target) {
    return null;
  }

  return decodeURIComponent(target.slice(name.length + 1));
}

export function getAdminTokenFromStorage(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(ADMIN_TOKEN_KEY) ?? getCookie(ADMIN_TOKEN_KEY);
}

export function setAdminTokenInStorage(token: string): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(ADMIN_TOKEN_KEY, token);
  document.cookie = `${ADMIN_TOKEN_KEY}=${encodeURIComponent(token)}; Path=/; Max-Age=${ADMIN_TOKEN_MAX_AGE_SECONDS}; SameSite=Lax`;
}

export function clearAdminTokenFromStorage(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(ADMIN_TOKEN_KEY);
  document.cookie = `${ADMIN_TOKEN_KEY}=; Path=/; Max-Age=0; SameSite=Lax`;
}
