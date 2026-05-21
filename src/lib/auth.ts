import { cookies } from "next/headers";
import { prisma } from "./prisma";
import * as crypto from "crypto";

const SESSION_COOKIE = "atsumaru_session";
const SESSION_SECRET = process.env.SESSION_SECRET || "dev-secret-change-in-production";

function hashToken(token: string): string {
  return crypto.createHmac("sha256", SESSION_SECRET).update(token).digest("hex");
}

export function generateSessionToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export async function createSession(userId: string): Promise<string> {
  const token = generateSessionToken();
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, `${userId}:${hashToken(token)}:${token}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });
  return token;
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE);
  if (!sessionCookie) return null;

  const parts = sessionCookie.value.split(":");
  if (parts.length !== 3) return null;

  const [userId, hash, token] = parts;
  if (hashToken(token) !== hash) return null;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, username: true, email: true, avatar: true, bio: true, reputation: true, createdAt: true },
  });

  return user;
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}
