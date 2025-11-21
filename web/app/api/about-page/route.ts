import { NextResponse } from 'next/server';
import { getAboutPageData, updateAboutPageData } from '@/lib/about-page';
import { revalidatePath } from 'next/cache';

/**
 * GET /api/about-page
 * Fetch About Page data
 */
export async function GET() {
    try {
        const data = await getAboutPageData();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching about page:', error);
        return NextResponse.json(
            { error: 'Failed to fetch about page data' },
            { status: 500 }
        );
    }
}

/**
 * PUT /api/about-page
 * Update About Page data
 */
export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const updatedData = await updateAboutPageData(body);
        
        // Revalidate about page
        revalidatePath('/about');
        
        return NextResponse.json(updatedData);
    } catch (error) {
        console.error('Error updating about page:', error);
        return NextResponse.json(
            { error: 'Failed to update about page data' },
            { status: 500 }
        );
    }
}

