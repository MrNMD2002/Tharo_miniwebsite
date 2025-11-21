import { CoreValueItem } from "@/types";

interface CoreValuesSectionProps {
    heading: string;
    items: CoreValueItem[];
}

export function CoreValuesSection({ heading, items }: CoreValuesSectionProps) {
    // Sort by order
    const sortedItems = [...items].sort((a, b) => a.order - b.order);
    
    return (
        <section className="py-16 md:py-24 bg-white">
            <div className="max-w-5xl mx-auto px-6">
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-burgundy-900 mb-12">
                    {heading}
                </h2>
                <div className="space-y-4">
                    {sortedItems.map((item) => (
                        <div 
                            key={item.id} 
                            className="flex items-start gap-3 text-gray-700 leading-relaxed"
                        >
                            <span className="flex-shrink-0 text-burgundy-600 text-lg mt-0.5">✓</span>
                            <span className="flex-1">{item.text}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

