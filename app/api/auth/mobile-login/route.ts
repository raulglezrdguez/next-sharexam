import { auth } from "@/auth"; // Tu configuración de Auth.js
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(request: Request) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "No session found" }, { status: 401 });
  }

  // 1. Creamos un token que la App pueda usar (expira en 30 días, por ejemplo)
  const mobileToken = jwt.sign(
    { sub: session.user?.id, email: session.user?.email },
    process.env.AUTH_SECRET!,
    { expiresIn: "30d" }
  );

  // 2. Definimos el esquema de tu app (configurado en app.json de Expo)
  const REDIRECT_URI = "exp://127.0.0.1:8081/--/auth-callback";
  // En producción sería: "com.tuapp://auth-callback"

  // 3. Redirigimos de vuelta a la App con el token
  return NextResponse.redirect(`${REDIRECT_URI}?token=${mobileToken}`);
}
