import { auth, signIn } from "@/auth"; // Tu configuración de Auth.js
import { NextResponse, NextRequest } from "next/server";
import { AuthError } from "next-auth";
import jwt from "jsonwebtoken";

export async function GET(request: NextRequest) {
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

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      return NextResponse.json({ error: result.error }, { status: 401 });
    }

    const cookieStore = request.cookies;
    const sessionCookieName =
      process.env.NODE_ENV === "production"
        ? "__Secure-authjs.session-token"
        : "authjs.session-token";

    const token = cookieStore.get(sessionCookieName)?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Authentication failed" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      token: token,
    });
  } catch (error) {
    console.error("Login error:", error);
    if (error instanceof AuthError) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
