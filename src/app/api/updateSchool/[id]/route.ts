import { connectDB } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const db = await connectDB();

    await db.execute(
      `UPDATE schools 
       SET name=?, address=?, city=?, state=?, contact=?, email_id=?, image=?
       WHERE id=?`,
      [
        body.name,
        body.address,
        body.city,
        body.state,
        body.contact,
        body.email_id,
        body.image,
        params.id,
      ]
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
