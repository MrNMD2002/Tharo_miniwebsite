import { NextRequest, NextResponse } from "next/server";
import { getLookbookImages, createLookbookImage } from "@/lib/lookbook";

export async function GET() {
    try {
        const images = await getLookbookImages();
        return NextResponse.json(images);
    } catch (error) {
        console.error("Error fetching lookbook images:", error);
        return NextResponse.json(
            { error: "Failed to fetch lookbook images" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const newImage = await createLookbookImage(body);
        return NextResponse.json(newImage, { status: 201 });
    } catch (error) {
        console.error("Error creating lookbook image:", error);
        return NextResponse.json(
            { error: "Failed to create lookbook image" },
            { status: 500 }
        );
    }
}

