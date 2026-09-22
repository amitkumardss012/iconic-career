import type { UserSafe } from "@/lib/services/user"

const SESSION_COOKIE_KEY = "iconic_session"
const SESSION_STORAGE_KEY = "iconic_session"
const TOKEN_COOKIE_KEY = "iconic_token"
const TOKEN_STORAGE_KEY = "iconic_token"

export interface AuthSessionUser {
  id: number
  name: string
  email: string
  phone?: string | null
  role: "ADMIN" | "STUDENT"
  token?: string
}

/**
 * Persist user session and official JWT token to cookies and localStorage for seamless route protection
 */
export function saveClientSession(user: AuthSessionUser, token?: string): void {
  if (typeof window === "undefined") return

  try {
    const userWithToken: AuthSessionUser = {
      ...user,
      ...(token ? { token } : {}),
    }

    const data = JSON.stringify(userWithToken)
    const encoded = encodeURIComponent(data)

    // Cookie valid for 7 days
    document.cookie = `${SESSION_COOKIE_KEY}=${encoded}; path=/; max-age=604800; SameSite=Lax`
    localStorage.setItem(SESSION_STORAGE_KEY, data)

    if (token || user.token) {
      const activeToken = token || user.token
      if (activeToken) {
        document.cookie = `${TOKEN_COOKIE_KEY}=${encodeURIComponent(activeToken)}; path=/; max-age=604800; SameSite=Lax`
        localStorage.setItem(TOKEN_STORAGE_KEY, activeToken)
      }
    }
  } catch (err) {
    console.error("Failed to save user session:", err)
  }
}

/**
 * Retrieve active user session from cookie or localStorage
 */
export function getClientSession(): AuthSessionUser | null {
  if (typeof window === "undefined") return null

  try {
    // 1. Try reading from cookie
    const match = document.cookie.match(new RegExp(`(^|;)\\s*${SESSION_COOKIE_KEY}=([^;]+)`))
    if (match && match[2]) {
      const parsed = JSON.parse(decodeURIComponent(match[2]))
      if (parsed && typeof parsed === "object" && parsed.id) {
        return parsed as AuthSessionUser
      }
    }

    // 2. Fallback to localStorage
    const stored = localStorage.getItem(SESSION_STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      if (parsed && typeof parsed === "object" && parsed.id) {
        return parsed as AuthSessionUser
      }
    }
  } catch {
    return null
  }

  return null
}

/**
 * Retrieve active JWT token from cookie or localStorage
 */
export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null

  try {
    // 1. Try cookie
    const match = document.cookie.match(new RegExp(`(^|;)\\s*${TOKEN_COOKIE_KEY}=([^;]+)`))
    if (match && match[2]) {
      return decodeURIComponent(match[2])
    }

    // 2. Fallback to localStorage
    const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY)
    if (storedToken) return storedToken

    // 3. Fallback to session object
    const session = getClientSession()
    return session?.token || null
  } catch {
    return null
  }
}

/**
 * Clear user session & JWT token from cookie and localStorage
 */
export function clearClientSession(): void {
  if (typeof window === "undefined") return

  try {
    document.cookie = `${SESSION_COOKIE_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`
    document.cookie = `${TOKEN_COOKIE_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`
    localStorage.removeItem(SESSION_STORAGE_KEY)
    localStorage.removeItem(TOKEN_STORAGE_KEY)
  } catch (err) {
    console.error("Failed to clear user session:", err)
  }
}

