import { NextResponse } from "next/server";
import { getProductById, updateProduct, deleteProduct } from "@/lib/products";
import { moveProductBetweenCollections, removeProductFromCollection } from "@/lib/sync-helpers";
import { revalidatePath } from "next/cache";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        const product = await getProductById(id);
        if (!product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }
        return NextResponse.json(product);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
    }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        const body = await request.json();

        // Get old product to check if collection changed
        const oldProduct = await getProductById(id);

        const updatedProduct = await updateProduct(id, body);
        if (!updatedProduct) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        // Sync collection if it changed
        if (oldProduct && oldProduct.collectionId !== updatedProduct.collectionId) {
            await moveProductBetweenCollections(
                updatedProduct.id,
                oldProduct.collectionId,
                updatedProduct.collectionId
            );
        }

        revalidatePath("/admin/products");
        revalidatePath("/products");
        revalidatePath(`/products/${updatedProduct.slug}`);
        revalidatePath("/");
        return NextResponse.json(updatedProduct);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        // Get product before deleting to know which collection to update
        const product = await getProductById(id);

        const success = await deleteProduct(id);
        if (!success) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        // Remove from collection
        if (product) {
            await removeProductFromCollection(product.id, product.collectionId);
        }

        revalidatePath("/admin/products");
        revalidatePath("/products");
        revalidatePath("/");
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
    }
}
