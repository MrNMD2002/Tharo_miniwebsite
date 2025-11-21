import { NextResponse } from "next/server";
import { getLandingPageData, updateLandingPageData } from "@/lib/content";
import { revalidatePath } from "next/cache";

export async function GET() {
    try {
        const data = await getLandingPageData();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error fetching landing page data:", error);
        return NextResponse.json({ error: "Failed to fetch landing page data" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        await updateLandingPageData(body);

        // Revalidate home page to reflect changes
        revalidatePath("/");

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error updating landing page data:", error);
        return NextResponse.json({ error: "Failed to update landing page data" }, { status: 500 });
    }
}
