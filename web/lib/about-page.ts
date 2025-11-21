import fs from 'fs/promises';
import path from 'path';
import { AboutPageData } from '@/types';

const DATA_FILE = path.join(process.cwd(), 'data', 'about-page.json');

/**
 * Get About Page data
 */
export async function getAboutPageData(): Promise<AboutPageData> {
    try {
        const fileContent = await fs.readFile(DATA_FILE, 'utf-8');
        return JSON.parse(fileContent);
    } catch (error) {
        console.error('Error reading about-page.json:', error);
        // Return default data if file doesn't exist
        return getDefaultAboutPageData();
    }
}

/**
 * Update About Page data
 */
export async function updateAboutPageData(data: AboutPageData): Promise<AboutPageData> {
    try {
        const updatedData = {
            ...data,
            updatedAt: new Date().toISOString(),
        };
        
        await fs.writeFile(DATA_FILE, JSON.stringify(updatedData, null, 2), 'utf-8');
        return updatedData;
    } catch (error) {
        console.error('Error writing about-page.json:', error);
        throw new Error('Failed to update about page data');
    }
}

/**
 * Default About Page data (fallback)
 */
function getDefaultAboutPageData(): AboutPageData {
    return {
        hero: {
            title: "Về Tharo - Nơi Áo Dài Truyền Thống Gặp Gỡ Hiện Đại",
            subtitle: "Chúng tôi tôn vinh vẻ đẹp truyền thống Việt Nam qua từng đường kim mũi chỉ",
            backgroundImage: "",
            backgroundColor: "#8B1538",
            isVisible: true,
        },
        story: {
            heading: "Câu chuyện của chúng tôi",
            content: "Tharo được thành lập với niềm đam mê mãnh liệt về áo dài Việt Nam...",
            isVisible: true,
        },
        mission: {
            heading: "Sứ mệnh của chúng tôi",
            content: "Sứ mệnh của Tharo là bảo tồn và phát triển áo dài Việt Nam...",
            isVisible: true,
        },
        coreValues: {
            heading: "Giá trị cốt lõi",
            items: [],
            isVisible: true,
        },
        updatedAt: new Date().toISOString(),
    };
}

