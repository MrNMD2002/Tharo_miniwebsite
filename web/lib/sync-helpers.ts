import { getCollectionById, updateCollection } from "./collections";

/**
 * Add a product to a collection's productIds array
 */
export async function addProductToCollection(
    productId: string,
    collectionId: string | undefined
): Promise<void> {
    if (!collectionId) return;

    try {
        const collection = await getCollectionById(collectionId);
        if (!collection) {
            console.warn(`Collection ${collectionId} not found`);
            return;
        }

        const productIds = collection.productIds || [];

        // Only add if not already present
        if (!productIds.includes(productId)) {
            await updateCollection(collectionId, {
                productIds: [...productIds, productId],
                updatedAt: new Date().toISOString(),
            });
        }
    } catch (error) {
        console.error(`Error adding product ${productId} to collection ${collectionId}:`, error);
        throw error;
    }
}

/**
 * Remove a product from a collection's productIds array
 */
export async function removeProductFromCollection(
    productId: string,
    collectionId: string | undefined
): Promise<void> {
    if (!collectionId) return;

    try {
        const collection = await getCollectionById(collectionId);
        if (!collection) {
            console.warn(`Collection ${collectionId} not found`);
            return;
        }

        const productIds = collection.productIds || [];
        const updatedProductIds = productIds.filter((id) => id !== productId);

        // Only update if there was a change
        if (updatedProductIds.length !== productIds.length) {
            await updateCollection(collectionId, {
                productIds: updatedProductIds,
                updatedAt: new Date().toISOString(),
            });
        }
    } catch (error) {
        console.error(`Error removing product ${productId} from collection ${collectionId}:`, error);
        throw error;
    }
}

/**
 * Move a product from one collection to another
 */
export async function moveProductBetweenCollections(
    productId: string,
    oldCollectionId: string | undefined,
    newCollectionId: string | undefined
): Promise<void> {
    // If collections are the same, do nothing
    if (oldCollectionId === newCollectionId) return;

    try {
        // Remove from old collection
        if (oldCollectionId) {
            await removeProductFromCollection(productId, oldCollectionId);
        }

        // Add to new collection
        if (newCollectionId) {
            await addProductToCollection(productId, newCollectionId);
        }
    } catch (error) {
        console.error(`Error moving product ${productId} between collections:`, error);
        throw error;
    }
}
