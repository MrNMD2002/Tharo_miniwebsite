import { NextResponse } from "next/server";
import { getHeroData, updateHeroData } from "@/lib/content";
import { revalidatePath } from "next/cache";

export async function GET() {
    try {
        const data = await getHeroData();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        await updateHeroData(body);
        revalidatePath("/"); // Revalidate the home page
        return NextResponse.json({ success: true, data: body });
    } catch (error) {
        return NextResponse.json({ error: "Failed to update data" }, { status: 500 });
    }
}
