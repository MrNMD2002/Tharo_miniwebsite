/**
 * Shared About Page Components
 * Used by both Public page and Admin Preview
 */

import Image from "next/image";
import { AboutPageData } from "@/types";

// Hero Section
export function AboutHeroSection({ 
    title, 
    subtitle, 
    backgroundImage, 
    backgroundColor 
}: AboutPageData['hero']) {
    return (
        <div 
            className="relative py-20 md:py-32"
            style={{ backgroundColor: backgroundColor || '#8B1538' }}
        >
            {backgroundImage && (
                <div className="absolute inset-0">
                    <Image 
                        src={backgroundImage} 
                        alt={title}
                        fill
                        className="object-cover opacity-40"
                    />
                </div>
            )}
            <div className="relative mx-auto max-w-7xl px-6 lg:px-8 text-center">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-6">
                    {title}
                </h1>
                <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
                    {subtitle}
                </p>
            </div>
        </div>
    );
}

// Story Section
export function AboutStorySection({ heading, content }: AboutPageData['story']) {
    return (
        <section className="py-16 md:py-24 bg-cream-50">
            <div className="mx-auto max-w-4xl px-6 lg:px-8">
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-burgundy-900 mb-8 text-center">
                    {heading}
                </h2>
                <div className="prose prose-lg max-w-none">
                    {content.split('\n').map((paragraph, index) => (
                        paragraph.trim() && (
                            <p key={index} className="text-gray-700 mb-4 leading-relaxed">
                                {paragraph}
                            </p>
                        )
                    ))}
                </div>
            </div>
        </section>
    );
}

// Mission Section
export function AboutMissionSection({ heading, content }: AboutPageData['mission']) {
    return (
        <section className="py-16 md:py-24 bg-white">
            <div className="mx-auto max-w-4xl px-6 lg:px-8">
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-burgundy-900 mb-8 text-center">
                    {heading}
                </h2>
                <div className="prose prose-lg max-w-none">
                    {content.split('\n').map((paragraph, index) => (
                        paragraph.trim() && (
                            <p key={index} className="text-gray-700 mb-4 leading-relaxed">
                                {paragraph}
                            </p>
                        )
                    ))}
                </div>
            </div>
        </section>
    );
}

// Core Values Section
export function AboutCoreValuesSection({ heading, items }: AboutPageData['coreValues']) {
    return (
        <section className="py-16 md:py-24 bg-burgundy-50">
            <div className="mx-auto max-w-4xl px-6 lg:px-8">
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-burgundy-900 mb-12 text-center">
                    {heading}
                </h2>
                <div className="space-y-6">
                    {items
                        .sort((a, b) => a.order - b.order)
                        .map((item, index) => (
                            <div 
                                key={item.id} 
                                className="flex gap-4 items-start bg-white p-6 rounded-lg shadow-sm"
                            >
                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-burgundy-600 text-white flex items-center justify-center font-bold">
                                    {index + 1}
                                </div>
                                <p className="text-gray-700 text-lg leading-relaxed flex-1">
                                    {item.text}
                                </p>
                            </div>
                        ))}
                </div>
            </div>
        </section>
    );
}

// Complete About Page Layout (for preview)
export function AboutPageLayout({ data }: { data: AboutPageData }) {
    return (
        <div className="min-h-screen">
            {data.hero.isVisible && <AboutHeroSection {...data.hero} />}
            {data.story.isVisible && <AboutStorySection {...data.story} />}
            {data.mission.isVisible && <AboutMissionSection {...data.mission} />}
            {data.coreValues.isVisible && <AboutCoreValuesSection {...data.coreValues} />}
        </div>
    );
}

