import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { RowDataPacket } from "mysql2";

export async function GET() {
  try {
    const db = await connectDB();
    const [rows] = await db.execute<RowDataPacket[]>("SELECT * FROM schools");
    return NextResponse.json(rows, { status: 200 });
  } catch (err: any) {
    console.error("DB Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
