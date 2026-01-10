import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

import { auth } from "@/auth";
import dbConnect from "../../../lib/db";
import { User, Diagram } from "../../../lib/models";
import { CreateDiagramInput } from "../../../lib/types/diagram";
import { CreateDiagramValidationSchema } from "../../../lib/validations/diagram.validation";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    let token = null;
    if (!session) {
      token = await getToken({
        req: request,
        secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
        salt:
          process.env.NODE_ENV === "production"
            ? "__Secure-authjs.session-token"
            : "authjs.session-token",
      });
    }

    const user = session?.user || token;

    await dbConnect();

    if (!user || !user.id) {
      const diagrams = await Diagram.find({ public: true })
        .populate("author", "name email")
        .sort({ updatedAt: -1 })
        .lean();

      return NextResponse.json({ diagrams, totalCount: diagrams.length });
    }

    const { searchParams } = new URL(request.url);
    const author = searchParams.get("author");
    const publicOnly = searchParams.get("public") === "true";

    const query: { public?: boolean; author?: string } = {};

    if (publicOnly) {
      query.public = true;
    } else if (author) {
      query.author = author;
    } else {
      query.author = user.id as string;
    }

    const diagrams = await Diagram.find(query)
      .populate("author", "name email")
      .sort({ updatedAt: -1 })
      .lean();

    return NextResponse.json({ diagrams, totalCount: diagrams.length });
  } catch (error) {
    console.error("Error fetching diagrams:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    let token = null;
    if (!session) {
      token = await getToken({
        req: request,
        secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
        salt:
          process.env.NODE_ENV === "production"
            ? "__Secure-authjs.session-token"
            : "authjs.session-token",
      });
    }

    const user = session?.user || token;

    if (!user || !user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: CreateDiagramInput = await request.json();

    // Validate the input
    const validationResult = CreateDiagramValidationSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validationResult.error.issues },
        { status: 400 }
      );
    }

    await dbConnect();

    const newDiagram = new Diagram({
      ...body,
      author: user.id as string,
    });

    await newDiagram.save();
    await newDiagram.populate("author", "name email");

    return NextResponse.json(newDiagram, { status: 201 });
  } catch (error) {
    console.error("Error creating diagram:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
