import fs from "fs/promises";
import path from "path";

const HERO_FILE_PATH = path.join(process.cwd(), "data", "hero.json");
const LANDING_PAGE_FILE_PATH = path.join(process.cwd(), "data", "landing-page.json");

export interface HeroData {
    title: string;
    subtitle: string;
    ctaText: string;
    ctaLink: string;
    imageUrl: string;
    imagePosition?: "top" | "center" | "bottom";
}

export interface LandingPageData {
    featuredCollections: string[];  // Collection IDs in display order
    featuredProducts: string[];     // Product IDs in display order
}

export async function getHeroData(): Promise<HeroData> {
    try {
        const data = await fs.readFile(HERO_FILE_PATH, "utf-8");
        return JSON.parse(data);
    } catch (error) {
        console.error("Error reading hero data:", error);
        // Return default data if file doesn't exist or fails to read
        return {
            title: "Vẻ đẹp Áo Dài Việt",
            subtitle: "Tôn vinh nét đẹp truyền thống trong hơi thở hiện đại.",
            ctaText: "Xem Bộ Sưu Tập",
            ctaLink: "/collections",
            imageUrl: "https://images.unsplash.com/photo-1550920753-0a7d2b326969?q=80&w=2070&auto=format&fit=crop",
            imagePosition: "center",
        };
    }
}

export async function updateHeroData(newData: HeroData): Promise<void> {
    try {
        await fs.writeFile(HERO_FILE_PATH, JSON.stringify(newData, null, 2), "utf-8");
    } catch (error) {
        console.error("Error writing hero data:", error);
        throw new Error("Failed to update hero data");
    }
}

export async function getLandingPageData(): Promise<LandingPageData> {
    try {
        const data = await fs.readFile(LANDING_PAGE_FILE_PATH, "utf-8");
        return JSON.parse(data);
    } catch (error) {
        console.error("Error reading landing page data:", error);
        // Return default empty data
        return {
            featuredCollections: [],
            featuredProducts: [],
        };
    }
}

export async function updateLandingPageData(newData: LandingPageData): Promise<void> {
    try {
        await fs.writeFile(LANDING_PAGE_FILE_PATH, JSON.stringify(newData, null, 2), "utf-8");
    } catch (error) {
        console.error("Error writing landing page data:", error);
        throw new Error("Failed to update landing page data");
    }
}
