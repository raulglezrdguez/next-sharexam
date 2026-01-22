// app/api/mobile/google-login/route.ts
import { OAuth2Client } from "google-auth-library";
import { signIn } from "@/auth";
import { NextResponse, NextRequest } from "next/server";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function POST(req: NextRequest) {
  try {
    const { idToken } = await req.json();

    const ticket = await client.verifyIdToken({
      idToken,
      audience: [
        process.env.GOOGLE_CLIENT_ID || "",
        process.env.ANDROID_CLIENT_ID || "",
        // process.env.IOS_CLIENT_ID || "",
      ],
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      return NextResponse.json(
        { error: "Invalid Google Token" },
        { status: 401 },
      );
    }

    await signIn("credentials", {
      isGoogleLogin: "true",
      name: payload.name,
      email: payload.email,
      image: payload.picture,
      locale: payload.locale,
      redirect: false,
    });

    const sessionCookieName =
      process.env.NODE_ENV === "production"
        ? "__Secure-authjs.session-token"
        : "authjs.session-token";

    const token = req.cookies.get(sessionCookieName)?.value;

    return NextResponse.json({
      success: true,
      token: token,
      user: {
        id: payload.sub,
        name: payload.name,
        email: payload.email,
        image: payload.picture,
      },
    });
  } catch (error) {
    console.error("Google Exchange Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
