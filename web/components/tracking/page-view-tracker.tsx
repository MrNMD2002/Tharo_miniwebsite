"use client";

import { usePageView } from "@/hooks/use-tracking";

export function PageViewTracker() {
    usePageView();
    return null;
}

