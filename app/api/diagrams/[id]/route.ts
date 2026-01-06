import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "../../../../lib/db";
import { User, Diagram } from "../../../../lib/models";
import { UpdateDiagramInput } from "../../../../lib/types/diagram";

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const diagram = await Diagram.findById(params.id).populate(
      "author",
      "name email"
    );

    if (!diagram) {
      return NextResponse.json({ error: "Diagram not found" }, { status: 404 });
    }

    // Solo el autor o diagramas públicos pueden ver
    if (diagram.author._id.toString() !== session.user.id && !diagram.public) {
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

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: UpdateDiagramInput = await request.json();
    await dbConnect();

    const diagram = await Diagram.findById(params.id);

    if (!diagram) {
      return NextResponse.json({ error: "Diagram not found" }, { status: 404 });
    }

    // Solo el autor puede modificar
    if (diagram.author.toString() !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    Object.assign(diagram, body);
    await diagram.save();
    await diagram.populate("author", "name email");

    return NextResponse.json(diagram);
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

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const diagram = await Diagram.findById(params.id);

    if (!diagram) {
      return NextResponse.json({ error: "Diagram not found" }, { status: 404 });
    }

    // Solo el autor puede eliminar
    if (diagram.author.toString() !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await Diagram.findByIdAndDelete(params.id);

    return NextResponse.json({ message: "Diagram deleted successfully" });
  } catch (error) {
    console.error("Error deleting diagram:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
