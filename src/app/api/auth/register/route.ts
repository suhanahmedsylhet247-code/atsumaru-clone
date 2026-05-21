import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/auth";
import bcryptjs from "bcryptjs";

export async function POST(request: Request) {
  const body = await request.json();
  const { username, email, password } = body;

  if (!username || !email || !password) {
    return Response.json({ error: "All fields are required" }, { status: 400 });
  }

  if (password.length < 8) {
    return Response.json({ error: "Password must be at least 8 characters" }, { status: 400 });
  }

  const existing = await prisma.user.findFirst({
    where: { OR: [{ username }, { email }] },
  });

  if (existing) {
    return Response.json({ error: "Username or email already taken" }, { status: 409 });
  }

  const passwordHash = await bcryptjs.hash(password, 12);

  const user = await prisma.user.create({
    data: { username, email, passwordHash },
  });

  await createSession(user.id);

  return Response.json({ user: { id: user.id, username: user.username } });
}
