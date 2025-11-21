import { CollectionsPageClient } from "./client";

async function getCollections() {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001';
        const response = await fetch(`${baseUrl}/api/collections`, {
            cache: 'no-store',
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch collections');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error fetching collections:', error);
        return [];
    }
}

async function getProducts() {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001';
        const response = await fetch(`${baseUrl}/api/products`, {
            cache: 'no-store',
        });
        
        if (!response.ok) {
            return [];
        }
        
        return await response.json();
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
