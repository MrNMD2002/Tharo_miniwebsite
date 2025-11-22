import { CollectionsPageClient } from "./client";
import { getCollections as fetchCollections } from "@/lib/collections";
import { getProducts as fetchProducts } from "@/lib/products";

async function getCollections() {
    try {
        return await fetchCollections();
    } catch (error) {
        console.error('Error fetching collections:', error);
        return [];
    }
}

async function getProducts() {
    try {
        return await fetchProducts();
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
}

export default async function CollectionsPage() {
    const [collections, products] = await Promise.all([
        getCollections(),
        getProducts()
    ]);
    
    // Only show active collections
    const activeCollections = collections.filter((c: any) => c.status === 'active');

    return (
        <CollectionsPageClient 
            collections={activeCollections} 
            products={products}
        />
    );
}
