import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const name = formData.get("name")?.toString() ?? "";
    const address = formData.get("address")?.toString() ?? "";
    const city = formData.get("city")?.toString() ?? "";
    const state = formData.get("state")?.toString() ?? "";
    const contact = formData.get("contact")?.toString() ?? "";
    const email_id = formData.get("email_id")?.toString() ?? "";

    let imagePath = "";
    const image = formData.get("image") as File | null;
    if (image && typeof (image as any).arrayBuffer === "function") {
      const arrayBuffer = await (image as any).arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const uploadDir = path.join(process.cwd(), "public", "schoolImages");
      await fs.promises.mkdir(uploadDir, { recursive: true });
      const filename = `${Date.now()}-${(image as any).name}`;
      const filepath = path.join(uploadDir, filename);
      await fs.promises.writeFile(filepath, buffer);
      imagePath = `/schoolImages/${filename}`;
    }

    const db = await connectDB();
    await db.execute(
      "INSERT INTO schools (name, address, city, state, contact, image, email_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [name, address, city, state, contact, imagePath, email_id]
    );

    return NextResponse.json({ message: "School added successfully!" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || String(error) }, { status: 500 });
  }
}
