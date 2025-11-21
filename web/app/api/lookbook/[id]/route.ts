import { NextRequest, NextResponse } from "next/server";
import { getLookbookImageById, updateLookbookImage, deleteLookbookImage } from "@/lib/lookbook";

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const params = await context.params;
        const image = await getLookbookImageById(params.id);
        if (!image) {
            return NextResponse.json(
                { error: "Lookbook image not found" },
                { status: 404 }
            );
        }
        return NextResponse.json(image);
    } catch (error) {
        console.error("Error fetching lookbook image:", error);
        return NextResponse.json(
            { error: "Failed to fetch lookbook image" },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const params = await context.params;
        const body = await request.json();
        const updatedImage = await updateLookbookImage(params.id, body);
        if (!updatedImage) {
            return NextResponse.json(
                { error: "Lookbook image not found" },
                { status: 404 }
            );
        }
        return NextResponse.json(updatedImage);
    } catch (error) {
        console.error("Error updating lookbook image:", error);
        return NextResponse.json(
            { error: "Failed to update lookbook image" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const params = await context.params;
        const success = await deleteLookbookImage(params.id);
        if (!success) {
            return NextResponse.json(
                { error: "Lookbook image not found" },
                { status: 404 }
            );
        }
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting lookbook image:", error);
        return NextResponse.json(
            { error: "Failed to delete lookbook image" },
            { status: 500 }
        );
    }
}

