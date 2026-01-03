import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose"; // Usamos 'jose' porque funciona en el Edge Runtime de Next.js

export async function proxy(request: NextRequest) {
  const token = request.headers.get("authorization")?.split(" ")[1];

  // Si la ruta es de API y trae un token de móvil
  if (request.nextUrl.pathname.startsWith("/api/protected-data") && token) {
    try {
      const secret = new TextEncoder().encode(process.env.AUTH_SECRET);
      await jwtVerify(token, secret);
      return NextResponse.next(); // Token válido, adelante
    } catch {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 });
    }
  }

  // Aquí puedes dejar que Auth.js maneje la sesión web normal
  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"], // Aplica a todas las rutas de API
};
