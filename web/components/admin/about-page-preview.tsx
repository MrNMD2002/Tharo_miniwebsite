"use client";

import { AboutPageData } from '@/types';
import { HeroSection } from '@/components/about/hero-section';
import { StorySection } from '@/components/about/story-section';
import { MissionSection } from '@/components/about/mission-section';
import { CoreValuesSection } from '@/components/about/core-values-section';

interface AboutPagePreviewProps {
    data: AboutPageData | null;
}

export function AboutPagePreview({ data }: AboutPagePreviewProps) {
    if (!data) {
        return (
            <div className="border rounded-lg bg-gray-50 p-8 text-center">
                <p className="text-gray-500">Loading preview...</p>
            </div>
        );
    }
    
    // Check how many main content sections are visible
    const visibleSections = [
        data.story.isVisible,
        data.mission.isVisible,
        data.coreValues.isVisible
    ].filter(Boolean).length;
    
    // Determine layout based on visibility
    const showTwoColumnLayout = data.story.isVisible && data.mission.isVisible;
    
    return (
        <div className="border rounded-lg overflow-hidden bg-white shadow-lg">
            <div className="bg-gray-800 px-4 py-2 flex items-center gap-2">
                <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <p className="text-sm text-gray-300 ml-2">Live Preview</p>
            </div>
            
            <div className="max-h-[calc(100vh-200px)] overflow-y-auto bg-cream-50">
                {/* Hero Section */}
                {data.hero.isVisible && (
                    <HeroSection {...data.hero} />
                )}
                
                {/* Main Content Area */}
                {visibleSections > 0 && (
                    <div className="py-8">
                        <div className="max-w-7xl mx-auto px-4">
                            {/* Two Column Layout */}
                            {showTwoColumnLayout ? (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 auto-rows-fr">
                                    {/* Left - Story */}
                                    {data.story.isVisible && (
                                        <div className="bg-white rounded-lg shadow p-6 flex flex-col h-full">
                                            <h2 className="text-2xl font-serif font-bold text-burgundy-900 mb-4">
                                                {data.story.heading}
                                            </h2>
                                            <div className="prose max-w-none text-sm">
                                                {data.story.content.split('\n').map((paragraph, index) => {
                                                    const trimmed = paragraph.trim();
                                                    if (!trimmed) return null;
                                                    
                                                    const isSignature = /^[\-–—]\s*.+\s*[\-–—]$/.test(trimmed);
                                                    if (isSignature) {
                                                        return <p key={index} className="text-gray-600 mt-4 mb-3 text-center italic font-medium text-xs">{trimmed}</p>;
                                                    }
                                                    
                                                    return <p key={index} className="text-gray-700 mb-3 text-justify text-xs" style={{ textIndent: '1.5rem' }}>{trimmed}</p>;
                                                })}
                                            </div>
                                        </div>
                                    )}
                                    
                                    {/* Right - Mission + Values */}
                                    <div className="flex flex-col gap-4 h-full">
                                        {data.mission.isVisible && (
                                            <div className="bg-white rounded-lg shadow p-6 flex flex-col flex-1">
                                                <h2 className="text-2xl font-serif font-bold text-burgundy-900 mb-4">
                                                    {data.mission.heading}
                                                </h2>
                                                <div className="prose max-w-none text-sm">
                                                    {data.mission.content.split('\n').map((paragraph, index) => {
                                                        const trimmed = paragraph.trim();
                                                        if (!trimmed) return null;
                                                        
                                                        const isSignature = /^[\-–—]\s*.+\s*[\-–—]$/.test(trimmed);
                                                        if (isSignature) {
                                                            return <p key={index} className="text-gray-600 mt-4 mb-3 text-center italic font-medium text-xs">{trimmed}</p>;
                                                        }
                                                        
                                                        const isBullet = /^[•✓✔\-*]\s/.test(trimmed);
                                                        if (isBullet) {
                                                            return (
                                                                <p key={index} className="text-gray-700 mb-2 flex items-start gap-2 text-xs">
                                                                    <span className="text-burgundy-600 flex-shrink-0">✓</span>
                                                                    <span>{trimmed.replace(/^[•✓✔\-*]\s/, '')}</span>
                                                                </p>
                                                            );
                                                        }
                                                        
                                                        return <p key={index} className="text-gray-700 mb-3 text-justify text-xs" style={{ textIndent: '1.5rem' }}>{trimmed}</p>;
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                        
                                        {data.coreValues.isVisible && data.coreValues.items.length > 0 && (
                                            <div className="bg-white rounded-lg shadow p-6 flex flex-col">
                                                <h2 className="text-2xl font-serif font-bold text-burgundy-900 mb-4">
                                                    {data.coreValues.heading}
                                                </h2>
                                                <div className="space-y-2">
                                                    {data.coreValues.items.sort((a, b) => a.order - b.order).map((item) => (
                                                        <div key={item.id} className="flex items-start gap-2 text-gray-700 text-xs">
                                                            <span className="text-burgundy-600 flex-shrink-0">✓</span>
                                                            <span className="flex-1">{item.text}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                /* Single Column Fallback */
                                <div className="max-w-4xl mx-auto space-y-6">
                                    {data.story.isVisible && (
                                        <div className="bg-white rounded-lg shadow p-6">
                                            <StorySection {...data.story} />
                                        </div>
                                    )}
                                    {data.mission.isVisible && (
                                        <div className="bg-white rounded-lg shadow p-6">
                                            <MissionSection {...data.mission} />
                                        </div>
                                    )}
                                    {data.coreValues.isVisible && (
                                        <div className="bg-white rounded-lg shadow p-6">
                                            <CoreValuesSection {...data.coreValues} />
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}
                
                {/* Show message if no sections visible */}
                {!data.hero.isVisible && !data.story.isVisible && !data.mission.isVisible && !data.coreValues.isVisible && (
                    <div className="p-12 text-center text-gray-500">
                        <p>Không có section nào được hiển thị</p>
                        <p className="text-sm mt-2">Bật visibility để xem preview</p>
                    </div>
                )}
            </div>
        </div>
    );
}

