import { useEffect, useRef } from "react";

// Generate or retrieve session ID
function getSessionId(): string {
    if (typeof window === "undefined") return "";
    
    let sessionId = sessionStorage.getItem("tharo_session_id");
    if (!sessionId) {
        sessionId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        sessionStorage.setItem("tharo_session_id", sessionId);
    }
    return sessionId;
}

interface TrackEventParams {
    eventType: "page_view" | "product_view" | "cta_click";
    url?: string;
    referrer?: string;
    productId?: string;
}

async function trackEvent(params: TrackEventParams): Promise<void> {
    try {
        const sessionId = getSessionId();
        const url = params.url || window.location.href;
        const referrer = params.referrer || document.referrer;
        
        await fetch("/api/track", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                sessionId,
                eventType: params.eventType,
                url,
                referrer,
                productId: params.productId,
            }),
        });
    } catch (error) {
        // Silently fail - don't break user experience
        console.error("Failed to track event:", error);
    }
}

// Hook for automatic page view tracking
export function usePageView() {
    const hasTracked = useRef(false);

    useEffect(() => {
        if (!hasTracked.current) {
            trackEvent({ eventType: "page_view" });
            hasTracked.current = true;
        }
    }, []);
}

// Hook for product view tracking
export function useProductView(productId: string) {
    const hasTracked = useRef(false);

    useEffect(() => {
        if (productId && !hasTracked.current) {
            trackEvent({ 
                eventType: "product_view",
                productId,
            });
            hasTracked.current = true;
        }
    }, [productId]);
}

// Function for CTA click tracking
export function trackCTAClick(channel?: string, productId?: string): void {
    trackEvent({
        eventType: "cta_click",
        productId,
    });
}

