import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

import { auth } from "@/auth";
import dbConnect from "../../../../lib/db";
import { User, Diagram } from "../../../../lib/models";
import { UpdateDiagramInput } from "../../../../lib/types/diagram";
import { UpdateDiagramValidationSchema } from "../../../../lib/validations/diagram.validation";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();

    let token = null;
    if (!session) {
      token = await getToken({
        req: request,
        secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
        salt: process.env.NODE_ENV === "production" ? "__Secure-authjs.session-token" : "authjs.session-token",
      });
    }

    const user = session?.user || token;

    if (!user || !user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const { id } = await params;

    const diagram = await Diagram.findById(id).populate("author", "name email");

    if (!diagram) {
      return NextResponse.json({ error: "Diagram not found" }, { status: 404 });
    }

    // Solo el autor o diagramas públicos pueden ver
    if (diagram.author._id.toString() !== user.id && !diagram.public) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(diagram);
  } catch (error) {
    console.error("Error fetching diagram:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();

    let token = null;
    if (!session) {
      token = await getToken({
        req: request,
        secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
        salt: process.env.NODE_ENV === "production" ? "__Secure-authjs.session-token" : "authjs.session-token",
      });
    }

    const user = session?.user || token;

    if (!user || !user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: UpdateDiagramInput = await request.json();

    // Validate the input
    const validationResult = UpdateDiagramValidationSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validationResult.error.issues },
        { status: 400 }
      );
    }

    await dbConnect();

    const { id } = await params;

    const diagram = await Diagram.findById(id);

    if (!diagram) {
      return NextResponse.json({ error: "Diagram not found" }, { status: 404 });
    }

    // Solo el autor puede modificar
    if (diagram.author.toString() !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Update the diagram fields
    if (body.title !== undefined) diagram.title = body.title;
    if (body.description !== undefined) diagram.description = body.description;
    if (body.public !== undefined) diagram.public = body.public;
    if (body.result !== undefined) diagram.result = body.result;
    if (body.nodes !== undefined) diagram.nodes = body.nodes;
    if (body.edges !== undefined) diagram.edges = body.edges;
    if (body.viewport !== undefined) diagram.viewport = body.viewport;

    await diagram.save();

    const updatedDiagram = await Diagram.findById(id).populate(
      "author",
      "name email"
    );

    return NextResponse.json(updatedDiagram);
  } catch (error) {
    console.error("Error updating diagram:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();

    let token = null;
    if (!session) {
      token = await getToken({
        req: request,
        secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
        salt: process.env.NODE_ENV === "production" ? "__Secure-authjs.session-token" : "authjs.session-token",
      });
    }

    const user = session?.user || token;

    if (!user || !user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const { id } = await params;

    const diagram = await Diagram.findById(id);

    if (!diagram) {
      return NextResponse.json({ error: "Diagram not found" }, { status: 404 });
    }

    // Solo el autor puede eliminar
    if (diagram.author.toString() !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await Diagram.findByIdAndDelete(id);

    return NextResponse.json({ message: "Diagram deleted successfully" });
  } catch (error) {
    console.error("Error deleting diagram:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
