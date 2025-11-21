import fs from "fs/promises";
import path from "path";
import { Collection } from "@/types";

const COLLECTIONS_FILE_PATH = path.join(process.cwd(), "data", "collections.json");

export async function getCollections(): Promise<Collection[]> {
    try {
        const data = await fs.readFile(COLLECTIONS_FILE_PATH, "utf-8");
        return JSON.parse(data);
    } catch (error) {
        console.error("Error reading collections data:", error);
        return [];
    }
}

export async function getCollectionById(id: string): Promise<Collection | undefined> {
    const collections = await getCollections();
    return collections.find((c) => c.id === id);
}

export async function getCollectionBySlug(slug: string): Promise<Collection | undefined> {
    const collections = await getCollections();
    return collections.find((c) => c.slug === slug);
}

export async function createCollection(collection: Omit<Collection, "id">): Promise<Collection> {
    const collections = await getCollections();
    
    // Generate ID: c + number
    const maxId = collections.reduce((max, c) => {
        const num = parseInt(c.id.replace("c", ""));
        return num > max ? num : max;
    }, 0);
    const newId = `c${maxId + 1}`;
    
    const newCollection = { ...collection, id: newId };
    collections.push(newCollection);
    await fs.writeFile(COLLECTIONS_FILE_PATH, JSON.stringify(collections, null, 2), "utf-8");
    return newCollection;
}

export async function updateCollection(id: string, updates: Partial<Collection>): Promise<Collection | null> {
    const collections = await getCollections();
    const index = collections.findIndex((c) => c.id === id);
    if (index === -1) return null;

    const updatedCollection = { ...collections[index], ...updates, id }; // Preserve ID
    collections[index] = updatedCollection;
    await fs.writeFile(COLLECTIONS_FILE_PATH, JSON.stringify(collections, null, 2), "utf-8");
    return updatedCollection;
}

export async function deleteCollection(id: string): Promise<boolean> {
    const collections = await getCollections();
    const filteredCollections = collections.filter((c) => c.id !== id);
    if (filteredCollections.length === collections.length) return false;

    await fs.writeFile(COLLECTIONS_FILE_PATH, JSON.stringify(filteredCollections, null, 2), "utf-8");
    return true;
}

