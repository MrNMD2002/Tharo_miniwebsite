import { NextResponse } from "next/server";
import { getCollections, createCollection } from "@/lib/collections";
import { revalidatePath } from "next/cache";

export async function GET() {
    try {
        const collections = await getCollections();
        return NextResponse.json(collections);
    } catch (error) {
        console.error("Error fetching collections:", error);
        return NextResponse.json({ error: "Failed to fetch collections" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        
        // Validation
        if (!body.name || !body.slug) {
            return NextResponse.json(
                { error: "Name and slug are required" },
                { status: 400 }
            );
        }
        
        const newCollection = await createCollection(body);
        
        // Revalidate pages
        revalidatePath("/admin/collections");
        revalidatePath("/collections");
        
        return NextResponse.json(newCollection, { status: 201 });
    } catch (error) {
        console.error("Error creating collection:", error);
        return NextResponse.json({ error: "Failed to create collection" }, { status: 500 });
    }
}

