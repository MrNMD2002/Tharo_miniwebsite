import { Button } from "@/components/ui/button";
import Link from "next/link";

interface HeroProps {
    title?: string;
    subtitle?: string;
    ctaText?: string;
    ctaLink?: string;
    imageUrl?: string;
}

export function Hero({
    title = "Vẻ đẹp Áo Dài Việt",
    subtitle = "Tôn vinh nét đẹp truyền thống trong hơi thở hiện đại.",
    ctaText = "Xem Bộ Sưu Tập",
    ctaLink = "/collections",
    imageUrl = "https://images.unsplash.com/photo-1550920753-0a7d2b326969?q=80&w=2070&auto=format&fit=crop", // Placeholder
    imagePosition = "center",
}: HeroProps & { imagePosition?: "top" | "center" | "bottom" }) {
    const positionClasses = {
        top: "object-top",
        center: "object-center",
        bottom: "object-bottom",
    };

    return (
        <div className="relative isolate overflow-hidden py-24 sm:py-32">
            {imageUrl && (
                <>
                    <img
                        src={imageUrl}
                        alt="Tharo Ao Dai"
                        className={`absolute inset-0 -z-20 h-full w-full object-cover ${positionClasses[imagePosition] || "object-center"}`}
                    />
                    <div className="absolute inset-0 -z-10 bg-black/30" />
                </>
            )}
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                    <h1 className="font-script text-5xl font-bold tracking-tight text-white sm:text-7xl">
                        {title}
                    </h1>
                    <p className="mt-6 text-lg leading-8 text-cream-100 font-sans">
                        {subtitle}
                    </p>
                    <div className="mt-10 flex items-center justify-center gap-x-4">
                        <Link 
                            href={ctaLink}
                            className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white overflow-hidden rounded-full transition-all duration-300 ease-out hover:scale-105"
                        >
                            {/* Animated gradient background */}
                            <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-burgundy-600 via-burgundy-700 to-burgundy-900 group-hover:from-burgundy-500 group-hover:via-burgundy-600 group-hover:to-burgundy-800 transition-all duration-300"></span>
                            
                            {/* Shine effect */}
                            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                            
                            {/* Border glow */}
                            <span className="absolute inset-0 w-full h-full rounded-full ring-2 ring-white/30 group-hover:ring-white/60 transition-all duration-300"></span>
                            
                            {/* Text */}
                            <span className="relative flex items-center gap-2 font-serif">
                                {ctaText}
                                <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
