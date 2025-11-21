interface StorySectionProps {
    heading: string;
    content: string;
}

export function StorySection({ heading, content }: StorySectionProps) {
    return (
        <section className="py-16 md:py-24 bg-white">
            <div className="max-w-4xl mx-auto px-6">
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-burgundy-900 mb-8 text-center">
                    {heading}
                </h2>
                <div className="prose prose-lg max-w-none">
                    {content.split('\n').map((paragraph, index) => {
                        const trimmedParagraph = paragraph.trim();
                        if (!trimmedParagraph) return null;
                        
                        // Check if it's a signature line (e.g., "- Tharo-", "- THARO -")
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
        </section>
    );
}

