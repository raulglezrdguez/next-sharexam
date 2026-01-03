import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "../../../lib/db";
import Diagram from "../../../lib/models/diagram.model";
import { CreateDiagramInput } from "../../../lib/types/diagram";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const author = searchParams.get("author");
    const publicOnly = searchParams.get("public") === "true";

    const query: { public?: boolean; author?: string } = {};

    if (publicOnly) {
      query.public = true;
    } else if (author) {
      query.author = author;
    } else {
      // Si no es público y no especifica autor, mostrar solo los del usuario autenticado
      query.author = session.user.id;
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

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: CreateDiagramInput = await request.json();
    await dbConnect();

    const newDiagram = new Diagram({
      ...body,
      author: session.user.id,
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
