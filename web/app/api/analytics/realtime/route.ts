import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { AnalyticsEvent, RealtimeAnalytics } from "@/types";

const ANALYTICS_FILE_PATH = path.join(process.cwd(), "data", "analytics-events.json");

async function readEvents(): Promise<AnalyticsEvent[]> {
    try {
        const data = await fs.readFile(ANALYTICS_FILE_PATH, "utf-8");
        return JSON.parse(data);
    } catch {
        return [];
    }
}

function getStartOfWeek(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    return new Date(d.setDate(diff));
}

function formatDate(date: Date): string {
    return date.toISOString().split("T")[0]; // YYYY-MM-DD
}

export async function GET() {
    try {
        const events = await readEvents();
        const now = new Date();
        
        // Calculate date ranges
        const weekStart = getStartOfWeek(now);
        weekStart.setHours(0, 0, 0, 0);
        
        const sevenDaysAgo = new Date(now);
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        sevenDaysAgo.setHours(0, 0, 0, 0);
        
        const fiveMinutesAgo = new Date(now);
        fiveMinutesAgo.setMinutes(fiveMinutesAgo.getMinutes() - 5);

        // Filter events for this week
        const weekEvents = events.filter((e) => {
            const eventDate = new Date(e.timestamp);
            return eventDate >= weekStart;
        });

        // Filter events for last 7 days
        const last7DaysEvents = events.filter((e) => {
            const eventDate = new Date(e.timestamp);
            return eventDate >= sevenDaysAgo;
        });

        // Filter events for last 5 minutes
        const last5MinEvents = events.filter((e) => {
            const eventDate = new Date(e.timestamp);
            return eventDate >= fiveMinutesAgo;
        });

        // Calculate totals for the week
        const totalPageViewsWeek = weekEvents.filter((e) => e.eventType === "page_view").length;
        const totalProductViewsWeek = weekEvents.filter((e) => e.eventType === "product_view").length;
        const totalCtaClicksWeek = weekEvents.filter((e) => e.eventType === "cta_click").length;
        const uniqueVisitorsWeek = new Set(weekEvents.map((e) => e.sessionId)).size;

        // Calculate last 7 days series
        const last7DaysSeries: RealtimeAnalytics["last7DaysSeries"] = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            const dateStr = formatDate(date);
            
            const dayStart = new Date(date);
            dayStart.setHours(0, 0, 0, 0);
            const dayEnd = new Date(date);
            dayEnd.setHours(23, 59, 59, 999);
            
            const dayEvents = last7DaysEvents.filter((e) => {
                const eventDate = new Date(e.timestamp);
                return eventDate >= dayStart && eventDate <= dayEnd;
            });
            
            last7DaysSeries.push({
                date: dateStr,
                pageViews: dayEvents.filter((e) => e.eventType === "page_view").length,
                productViews: dayEvents.filter((e) => e.eventType === "product_view").length,
                ctaClicks: dayEvents.filter((e) => e.eventType === "cta_click").length,
            });
        }

        // Calculate CTA by channel
        const ctaEvents = weekEvents.filter((e) => e.eventType === "cta_click");
        const ctaByChannelMap = new Map<string, number>();
        ctaEvents.forEach((e) => {
            const channel = e.channel || "unknown";
            ctaByChannelMap.set(channel, (ctaByChannelMap.get(channel) || 0) + 1);
        });
        const ctaByChannel = Array.from(ctaByChannelMap.entries())
            .map(([channel, clicks]) => ({ channel, clicks }))
            .sort((a, b) => b.clicks - a.clicks);

        // Calculate traffic sources
        const trafficSourcesMap = new Map<string, number>();
        weekEvents.forEach((e) => {
            const source = e.channel || "unknown";
            trafficSourcesMap.set(source, (trafficSourcesMap.get(source) || 0) + 1);
        });
        const trafficSources = Array.from(trafficSourcesMap.entries())
            .map(([source, count]) => ({ source, count }))
            .sort((a, b) => b.count - a.count);

        // Calculate active users in last 5 minutes
        const activeUsersLast5Min = new Set(last5MinEvents.map((e) => e.sessionId)).size;

        const analytics: RealtimeAnalytics = {
            activeUsersLast5Min,
            totalPageViewsWeek,
            totalProductViewsWeek,
            totalCtaClicksWeek,
            uniqueVisitorsWeek,
            last7DaysSeries,
            ctaByChannel,
            trafficSources,
        };

        return NextResponse.json(analytics);
    } catch (error) {
        console.error("Error fetching realtime analytics:", error);
        return NextResponse.json(
            { error: "Failed to fetch analytics" },
            { status: 500 }
        );
    }
}

