import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const db = await connectDB();
    const [result] = await db.execute("DELETE FROM schools WHERE id = ?", [
      params.id,
    ]);

    return NextResponse.json(
      { message: `School with id ${params.id} deleted` },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("DB Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
