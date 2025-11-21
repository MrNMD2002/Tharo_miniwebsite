import { NextResponse } from "next/server";
import { getCollectionById, updateCollection, deleteCollection } from "@/lib/collections";
import { revalidatePath } from "next/cache";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        const collection = await getCollectionById(id);
        if (!collection) {
            return NextResponse.json({ error: "Collection not found" }, { status: 404 });
        }
        return NextResponse.json(collection);
    } catch (error) {
        console.error("Error fetching collection:", error);
        return NextResponse.json({ error: "Failed to fetch collection" }, { status: 500 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        const body = await request.json();
        const updatedCollection = await updateCollection(id, body);
        
        if (!updatedCollection) {
            return NextResponse.json({ error: "Collection not found" }, { status: 404 });
        }
        
        // Revalidate pages
        revalidatePath("/admin/collections");
        revalidatePath("/collections");
        revalidatePath(`/collections/${updatedCollection.slug}`);
        
        return NextResponse.json(updatedCollection);
    } catch (error) {
        console.error("Error updating collection:", error);
        return NextResponse.json({ error: "Failed to update collection" }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        const success = await deleteCollection(id);
        
        if (!success) {
            return NextResponse.json({ error: "Collection not found" }, { status: 404 });
        }
        
        // Revalidate pages
        revalidatePath("/admin/collections");
        revalidatePath("/collections");
        
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting collection:", error);
        return NextResponse.json({ error: "Failed to delete collection" }, { status: 500 });
    }
}

