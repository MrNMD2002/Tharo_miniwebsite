import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import { mkdir } from "fs/promises";

export async function POST(request: Request) {
    const formData = await request.formData();
    const files = formData.getAll("file") as File[];

    if (!files || files.length === 0) {
        return NextResponse.json({ error: "No files received." }, { status: 400 });
    }

    const urls: string[] = [];
    const uploadDir = path.join(process.cwd(), "public/uploads");

    try {
        await mkdir(uploadDir, { recursive: true });
    } catch (e) {
        // Ignore if exists
    }

    for (const file of files) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const filename = Date.now() + "_" + file.name.replaceAll(" ", "_");
        const filepath = path.join(uploadDir, filename);

        await writeFile(filepath, buffer);
        urls.push(`/uploads/${filename}`);
    }

    return NextResponse.json({ urls });
}
