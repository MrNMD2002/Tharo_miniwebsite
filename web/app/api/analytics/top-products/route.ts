import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { AnalyticsEvent, Product } from "@/types";

const ANALYTICS_FILE_PATH = path.join(process.cwd(), "data", "analytics-events.json");
const PRODUCTS_FILE_PATH = path.join(process.cwd(), "data", "products.json");

async function readEvents(): Promise<AnalyticsEvent[]> {
    try {
        const data = await fs.readFile(ANALYTICS_FILE_PATH, "utf-8");
        return JSON.parse(data);
    } catch {
        return [];
    }
}

async function readProducts(): Promise<Product[]> {
    try {
        const data = await fs.readFile(PRODUCTS_FILE_PATH, "utf-8");
        return JSON.parse(data);
    } catch {
        return [];
    }
}

function getDateRange(range: string): { start: Date; end: Date } {
    const now = new Date();
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    
    let start = new Date();
    
    switch (range) {
        case "week":
            start.setDate(now.getDate() - 7);
            break;
        case "month":
            start.setMonth(now.getMonth() - 1);
            break;
        case "year":
            start.setFullYear(now.getFullYear() - 1);
            break;
        case "today":
            start.setHours(0, 0, 0, 0);
            break;
        default: // all time
            start = new Date(0);
    }
    
    start.setHours(0, 0, 0, 0);
    return { start, end };
}

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const range = searchParams.get("range") || "week"; // week, month, year, all
        const limit = parseInt(searchParams.get("limit") || "10");

        const events = await readEvents();
        const products = await readProducts();
        
        const { start, end } = getDateRange(range);

        // Filter product_view events within date range
        const productViews = events.filter((e) => {
            if (e.eventType !== "product_view" || !e.productId) return false;
            const eventDate = new Date(e.timestamp);
            return eventDate >= start && eventDate <= end;
        });

        // Count views per product
        const viewCounts = new Map<string, number>();
        productViews.forEach((e) => {
            const count = viewCounts.get(e.productId!) || 0;
            viewCounts.set(e.productId!, count + 1);
        });

        // Sort by views and get top products
        const sortedProducts = Array.from(viewCounts.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, limit);

        // Enrich with product details
        const topProducts = sortedProducts.map(([productId, views]) => {
            const product = products.find((p) => p.id === productId);
            return {
                productId,
                productName: product?.name || "Unknown Product",
                productImage: product?.images?.[0] || "",
                productPrice: product?.price || 0,
                productSlug: product?.slug || "",
                views,
            };
        });

        return NextResponse.json({
            range,
            totalProducts: topProducts.length,
            topProducts,
        });
    } catch (error) {
        console.error("Error fetching top products:", error);
        return NextResponse.json(
            { error: "Failed to fetch top products" },
            { status: 500 }
        );
    }
}

