import fs from "fs/promises";
import path from "path";
import { LookbookImage } from "@/types";

const LOOKBOOK_FILE_PATH = path.join(process.cwd(), "data", "lookbook.json");

export async function getLookbookImages(): Promise<LookbookImage[]> {
    try {
        const data = await fs.readFile(LOOKBOOK_FILE_PATH, "utf-8");
        const images = JSON.parse(data);
        // Sort by order
        return images.sort((a: LookbookImage, b: LookbookImage) => a.order - b.order);
    } catch (error) {
        console.error("Error reading lookbook data:", error);
        return [];
    }
}

export async function getLookbookImageById(id: string): Promise<LookbookImage | undefined> {
    const images = await getLookbookImages();
    return images.find((img) => img.id === id);
}

export async function createLookbookImage(image: Omit<LookbookImage, "id">): Promise<LookbookImage> {
    const images = await getLookbookImages();
    
    // Generate ID: lb + number
    const maxId = images.reduce((max, img) => {
        const num = parseInt(img.id.replace("lb", ""));
        return num > max ? num : max;
    }, 0);
    const newId = `lb${maxId + 1}`;
    
    const newImage = { ...image, id: newId };
    images.push(newImage);
    await fs.writeFile(LOOKBOOK_FILE_PATH, JSON.stringify(images, null, 2), "utf-8");
    return newImage;
}

export async function updateLookbookImage(id: string, updates: Partial<LookbookImage>): Promise<LookbookImage | null> {
    const images = await getLookbookImages();
    const index = images.findIndex((img) => img.id === id);
    if (index === -1) return null;

    const updatedImage = { ...images[index], ...updates, id }; // Preserve ID
    images[index] = updatedImage;
    await fs.writeFile(LOOKBOOK_FILE_PATH, JSON.stringify(images, null, 2), "utf-8");
    return updatedImage;
}

export async function deleteLookbookImage(id: string): Promise<boolean> {
    const images = await getLookbookImages();
    const filteredImages = images.filter((img) => img.id !== id);
    if (filteredImages.length === images.length) return false;

    await fs.writeFile(LOOKBOOK_FILE_PATH, JSON.stringify(filteredImages, null, 2), "utf-8");
    return true;
}

