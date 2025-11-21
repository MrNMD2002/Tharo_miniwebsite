import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { AnalyticsEvent } from "@/types";

const ANALYTICS_FILE_PATH = path.join(process.cwd(), "data", "analytics-events.json");

// Bot detection patterns
const BOT_PATTERNS = [
    /bot/i,
    /crawl/i,
    /spider/i,
    /slurp/i,
    /baidu/i,
    /bing/i,
    /google/i,
    /yahoo/i,
    /yandex/i,
    /headless/i,
    /phantom/i,
    /selenium/i,
    /preview/i,
];

function isBot(userAgent: string): boolean {
    return BOT_PATTERNS.some((pattern) => pattern.test(userAgent));
}

function detectChannel(referrer: string): string {
    if (!referrer) return "direct";
    
    try {
        const refUrl = new URL(referrer);
        const hostname = refUrl.hostname.toLowerCase();
        
        // Social media - Vietnam specific
        if (hostname.includes("facebook") || hostname.includes("fb.com") || hostname.includes("fbclid")) return "facebook";
        if (hostname.includes("zalo") || hostname.includes("zaloapp")) return "zalo";
        if (hostname.includes("tiktok") || hostname.includes("bytedance")) return "tiktok";
        if (hostname.includes("instagram")) return "instagram";
        if (hostname.includes("youtube")) return "youtube";
        if (hostname.includes("twitter") || hostname.includes("t.co")) return "twitter";
        if (hostname.includes("linkedin")) return "linkedin";
        
        // Messaging apps
        if (hostname.includes("messenger") || hostname.includes("m.me")) return "messenger";
        
        // E-commerce platforms
        if (hostname.includes("shopee")) return "shopee";
        if (hostname.includes("lazada")) return "lazada";
        if (hostname.includes("tiki")) return "tiki";
        
        // Search engines
        if (hostname.includes("google")) return "google";
        if (hostname.includes("bing")) return "bing";
        if (hostname.includes("yahoo")) return "yahoo";
        if (hostname.includes("coccoc")) return "coccoc";
        
        // Referral (other websites)
        return "referral";
    } catch {
        return "direct";
    }
}

async function readEvents(): Promise<AnalyticsEvent[]> {
    try {
        const data = await fs.readFile(ANALYTICS_FILE_PATH, "utf-8");
        return JSON.parse(data);
    } catch {
        return [];
    }
}

async function writeEvents(events: AnalyticsEvent[]): Promise<void> {
    await fs.writeFile(ANALYTICS_FILE_PATH, JSON.stringify(events, null, 2), "utf-8");
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { sessionId, eventType, url, referrer, productId } = body;

        // Validate required fields
        if (!sessionId || !eventType || !url) {
            return NextResponse.json(
                { error: "Missing required fields: sessionId, eventType, url" },
                { status: 400 }
            );
        }

        // Get user agent and check for bots
        const userAgent = request.headers.get("user-agent") || "";
        if (isBot(userAgent)) {
            // Silently ignore bot traffic
            return NextResponse.json({ success: true, filtered: true });
        }

        // Get IP (for unique visitor tracking)
        const ip = request.headers.get("x-forwarded-for") || 
                   request.headers.get("x-real-ip") || 
                   "unknown";

        // Detect channel from referrer
        const channel = detectChannel(referrer || "");

        // Create event
        const event: AnalyticsEvent = {
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            sessionId,
            eventType,
            url,
            referrer: referrer || "",
            timestamp: new Date().toISOString(),
            channel,
            productId: productId || undefined,
            userAgent,
            ip: ip.split(",")[0].trim(), // Take first IP if multiple
        };

        // Read existing events
        const events = await readEvents();

        // Add new event
        events.push(event);

        // Keep only last 10,000 events to prevent file bloat
        const trimmedEvents = events.slice(-10000);

        // Write back
        await writeEvents(trimmedEvents);

        return NextResponse.json({ success: true, eventId: event.id });
    } catch (error) {
        console.error("Error tracking event:", error);
        return NextResponse.json(
            { error: "Failed to track event" },
            { status: 500 }
        );
    }
}

