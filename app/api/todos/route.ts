import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Todo from "@/models/Todo";

// Hjälper oss mappa Mongo _id -> id (string) & plocka ut createdAt
function toDTO(doc: any) {
  return { id: String(doc._id), text: doc.text, createdAt: doc.createdAt };
}

export async function GET() {
  try {
    await connectDB();
    const docs = await Todo.find().sort({ createdAt: -1 }).lean();
    const todos = docs.map(toDTO);
    return NextResponse.json({ todos });
  } catch (error) {
    console.error("GET /api/todos error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch todos",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { text } = await req.json();
    if (!text || !text.trim()) {
      return NextResponse.json({ error: "text required" }, { status: 400 });
    }
    await connectDB();
    const created = await Todo.create({ text: text.trim() });
    return NextResponse.json({ todo: toDTO(created) }, { status: 201 });
  } catch (error) {
    console.error("POST /api/todos error:", error);
    return NextResponse.json(
      {
        error: "Failed to create todo",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
