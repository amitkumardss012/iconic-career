import { scryptSync, randomBytes, timingSafeEqual } from "node:crypto"
import jwt, { type JwtPayload as BaseJwtPayload, type SignOptions } from "jsonwebtoken"
import { ENV } from "@/config/env"

const JWT_SECRET = ENV.JWT_SECRET || "iconic-career-jwt-super-secret-key-2026-production"
const JWT_ISSUER = "the-iconic-career"
const JWT_AUDIENCE = "the-iconic-career-portal"

export interface UserJwtPayload extends BaseJwtPayload {
  id: number
  email: string
  name: string
  role: "ADMIN" | "STUDENT"
}

/**
 * Sign a standard JSON Web Token using official jsonwebtoken library
 */
export function signJwtToken(
  payload: { id: number; email: string; name: string; role: "ADMIN" | "STUDENT" },
  expiresIn: SignOptions["expiresIn"] = "7d"
): string {
  const options: SignOptions = {
    expiresIn,
    issuer: JWT_ISSUER,
    audience: JWT_AUDIENCE,
    subject: String(payload.id),
  }

  return jwt.sign(payload, JWT_SECRET, options)
}

/**
 * Verify and decode a JSON Web Token with strict issuer and audience validation
 */
export function verifyJwtToken(token: string): UserJwtPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
    })

    if (typeof decoded === "object" && decoded && "id" in decoded) {
      return decoded as UserJwtPayload
    }
    return null
  } catch {
    return null
  }
}


/**
 * Hash a plain text password using scrypt with a cryptographically secure random salt
 */
export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex")
  const derivedKey = scryptSync(password, salt, 64)
  return `${salt}:${derivedKey.toString("hex")}`
}

/**
 * Verify a plain text password against a stored salt:hash string
 */
export function verifyPassword(password: string, storedHash: string): boolean {
  try {
    // If the stored hash is not yet salted (e.g. legacy plain text during initial seed)
    if (!storedHash.includes(":")) {
      return password === storedHash
    }

    const [salt, key] = storedHash.split(":")
    if (!salt || !key) return false

    const keyBuffer = Buffer.from(key, "hex")
    const derivedKey = scryptSync(password, salt, 64)

    return timingSafeEqual(keyBuffer, derivedKey)
  } catch {
    return false
  }
}

