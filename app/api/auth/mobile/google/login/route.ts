// app/api/mobile/google-login/route.ts
import { OAuth2Client } from "google-auth-library";
import { signIn } from "@/auth";
import { NextResponse, NextRequest } from "next/server";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function POST(req: NextRequest) {
  try {
    const { idToken } = await req.json();

    // 1. Verify the ID Token with Google
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      return NextResponse.json(
        { error: "Invalid Google Token" },
        { status: 401 }
      );
    }

    // 2. Log into Auth.js using the verified email
    // We use the 'credentials' provider as a bridge
    await signIn("credentials", {
      isGoogleLogin: "true", // Custom flag for your authorize function
      name: payload.name,
      email: payload.email,
      image: payload.picture,
      locale: payload.locale,
      redirect: false,
    });

    // 3. Extract the session cookie Auth.js just created
    const sessionCookieName =
      process.env.NODE_ENV === "production"
        ? "__Secure-authjs.session-token"
        : "authjs.session-token";

    const token = req.cookies.get(sessionCookieName)?.value;

    return NextResponse.json({
      success: true,
      token: token,
      user: {
        name: payload.name,
        email: payload.email,
        image: payload.picture,
      },
    });
  } catch (error) {
    console.error("Google Exchange Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
