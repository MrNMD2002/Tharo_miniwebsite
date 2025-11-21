import { NextResponse } from "next/server";
import { getProducts, createProduct } from "@/lib/products";
import { addProductToCollection } from "@/lib/sync-helpers";
import { revalidatePath } from "next/cache";

export async function GET() {
    try {
        const products = await getProducts();
        return NextResponse.json(products);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const newProduct = await createProduct(body);

        // Sync with collection
        await addProductToCollection(newProduct.id, newProduct.collectionId);

        revalidatePath("/admin/products");
        revalidatePath("/products");
        revalidatePath("/");
        return NextResponse.json(newProduct, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
    }
}
