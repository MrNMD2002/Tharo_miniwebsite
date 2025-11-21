import { getAboutPageData } from '@/lib/about-page';
import { HeroSection } from '@/components/about/hero-section';
import { StorySection } from '@/components/about/story-section';
import { MissionSection } from '@/components/about/mission-section';
import { CoreValuesSection } from '@/components/about/core-values-section';
import { PageViewTracker } from '@/components/tracking/page-view-tracker';
import Link from 'next/link';

export default async function AboutPage() {
    const data = await getAboutPageData();
    
    // Check how many main content sections are visible
    const visibleSections = [
        data.story.isVisible,
        data.mission.isVisible,
        data.coreValues.isVisible
    ].filter(Boolean).length;
    
    // Determine layout based on visibility
    const showTwoColumnLayout = data.story.isVisible && data.mission.isVisible;
    
    return (
        <div className="bg-cream-50">
            <PageViewTracker />
            {/* Hero Section */}
            {data.hero.isVisible && (
                <HeroSection {...data.hero} />
            )}
            
            {/* Main Content Area */}
            {visibleSections > 0 && (
                <section className="py-16 md:py-24">
                    <div className="max-w-7xl mx-auto px-6 lg:px-8">
                        {/* Two Column Layout (Story + Mission side by side) */}
                        {showTwoColumnLayout ? (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 auto-rows-fr">
                                {/* Left Column - Story */}
                                {data.story.isVisible && (
                                    <div className="bg-white rounded-2xl shadow-lg p-8 lg:p-10 flex flex-col h-full">
                                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-burgundy-900 mb-8">
                                            {data.story.heading}
                                        </h2>
                                        <div className="prose prose-lg max-w-none">
                                            {data.story.content.split('\n').map((paragraph, index) => {
                                                const trimmedParagraph = paragraph.trim();
                                                if (!trimmedParagraph) return null;
                                                
                                                const isSignature = /^[\-–—]\s*.+\s*[\-–—]$/.test(trimmedParagraph);
                                                
                                                if (isSignature) {
                                                    return (
                                                        <p key={index} className="text-gray-600 leading-relaxed mt-8 mb-6 text-center italic font-medium">
                                                            {trimmedParagraph}
                                                        </p>
                                                    );
                                                }
                                                
                                                return (
                                                    <p key={index} className="text-gray-700 leading-relaxed mb-6 text-justify" style={{ textIndent: '2rem' }}>
                                                        {trimmedParagraph}
                                                    </p>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                                
                                {/* Right Column - Mission + Core Values */}
                                <div className="flex flex-col gap-8 h-full">
                                    {/* Mission */}
                                    {data.mission.isVisible && (
                                        <div className="bg-white rounded-2xl shadow-lg p-8 lg:p-10 flex flex-col flex-1">
                                            <h2 className="text-3xl md:text-4xl font-serif font-bold text-burgundy-900 mb-8">
                                                {data.mission.heading}
                                            </h2>
                                            <div className="prose prose-lg max-w-none">
                                                {data.mission.content.split('\n').map((paragraph, index) => {
                                                    const trimmedParagraph = paragraph.trim();
                                                    if (!trimmedParagraph) return null;
                                                    
                                                    const isSignature = /^[\-–—]\s*.+\s*[\-–—]$/.test(trimmedParagraph);
                                                    if (isSignature) {
                                                        return (
                                                            <p key={index} className="text-gray-600 leading-relaxed mt-8 mb-6 text-center italic font-medium">
                                                                {trimmedParagraph}
                                                            </p>
                                                        );
                                                    }
                                                    
                                                    const isBullet = /^[•✓✔\-*]\s/.test(trimmedParagraph);
                                                    if (isBullet) {
                                                        return (
                                                            <p key={index} className="text-gray-700 leading-relaxed mb-3 flex items-start gap-2">
                                                                <span className="text-burgundy-600 flex-shrink-0 mt-1">✓</span>
                                                                <span className="flex-1">{trimmedParagraph.replace(/^[•✓✔\-*]\s/, '')}</span>
                                                            </p>
                                                        );
                                                    }
                                                    
                                                    return (
                                                        <p key={index} className="text-gray-700 leading-relaxed mb-6 text-justify" style={{ textIndent: '2rem' }}>
                                                            {trimmedParagraph}
                                                        </p>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                    
                                    {/* Core Values (in right column) */}
                                    {data.coreValues.isVisible && data.coreValues.items.length > 0 && (
                                        <div className="bg-white rounded-2xl shadow-lg p-8 lg:p-10 flex flex-col">
                                            <h2 className="text-3xl md:text-4xl font-serif font-bold text-burgundy-900 mb-8">
                                                {data.coreValues.heading}
                                            </h2>
                                            <div className="space-y-4">
                                                {data.coreValues.items
                                                    .sort((a, b) => a.order - b.order)
                                                    .map((item) => (
                                                        <div 
                                                            key={item.id} 
                                                            className="flex items-start gap-3 text-gray-700 leading-relaxed"
                                                        >
                                                            <span className="flex-shrink-0 text-burgundy-600 mt-0.5">✓</span>
                                                            <span className="flex-1">{item.text}</span>
                                                        </div>
                                                    ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            /* Fallback: Single Column Layout (when only 1 section visible) */
                            <div className="max-w-4xl mx-auto space-y-8">
                                {data.story.isVisible && (
                                    <div className="bg-white rounded-2xl shadow-lg p-8 lg:p-10">
                                        <StorySection {...data.story} />
                                    </div>
                                )}
                                
                                {data.mission.isVisible && (
                                    <div className="bg-white rounded-2xl shadow-lg p-8 lg:p-10">
                                        <MissionSection {...data.mission} />
                                    </div>
                                )}
                                
                                {data.coreValues.isVisible && (
                                    <div className="bg-white rounded-2xl shadow-lg p-8 lg:p-10">
                                        <CoreValuesSection {...data.coreValues} />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </section>
            )}
            
            {/* Static CTA Section (not editable) */}
            <div className="bg-burgundy-900">
                <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="text-3xl font-serif font-bold tracking-tight text-white sm:text-4xl">
                            Sẵn sàng khám phá bộ sưu tập của chúng tôi?
                        </h2>
                        <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-burgundy-100">
                            Hãy để Tharo đồng hành cùng bạn trong những dịp đặc biệt
                        </p>
                        <div className="mt-10 flex items-center justify-center gap-x-6">
                            <Link
                                href="/products"
                                className="rounded-full bg-white px-6 py-3 text-base font-semibold text-burgundy-900 shadow-sm hover:bg-burgundy-50 transition-colors"
                            >
                                Xem sản phẩm
                            </Link>
                            <Link
                                href={`https://m.me/100089059418106?text=${encodeURIComponent("Xin chào Tharo, tôi đến từ website của bạn, hãy tư vấn cho tôi thêm")}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-base font-semibold leading-7 text-white hover:text-burgundy-100 transition-colors"
                            >
                                Liên hệ <span aria-hidden="true">→</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
