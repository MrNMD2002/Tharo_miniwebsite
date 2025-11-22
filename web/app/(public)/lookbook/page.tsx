import Image from "next/image";
import { getLookbookImages as fetchLookbookImages } from "@/lib/lookbook";

async function getLookbookImages() {
    try {
        const data = await fetchLookbookImages();
        // Only return active images, sorted by order
        return data
            .filter((img: any) => img.status === 'active')
            .sort((a: any, b: any) => a.order - b.order);
    } catch (error) {
        console.error('Error fetching lookbook images:', error);
        return [];
    }
}

export default async function LookbookPage() {
    const lookbookImages = await getLookbookImages();

    return (
        <div className="bg-cream-50 py-16 sm:py-24">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center mb-16">
                    <h2 className="text-3xl font-serif font-bold tracking-tight text-burgundy-900 sm:text-4xl">
                        Lookbook
                    </h2>
                    <p className="mt-4 text-lg leading-8 text-burgundy-700">
                        Những khoảnh khắc đẹp nhất cùng Tharo.
                    </p>
                </div>

                {lookbookImages.length > 0 ? (
                    <div className="columns-1 gap-5 sm:columns-2 lg:columns-3 xl:columns-4 space-y-5">
                        {lookbookImages.map((image: any) => (
                            <div key={image.id} className="break-inside-avoid group">
                                <div className="relative overflow-hidden rounded-lg">
                                    <Image
                                        src={image.imageUrl}
                                        alt={image.title || `Lookbook ${image.id}`}
                                        width={400}
                                        height={600}
                                        className="w-full object-cover hover:scale-105 transition-transform duration-300"
                                    />
                                    {(image.title || image.description) && (
                                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            {image.title && (
                                                <h3 className="text-white font-semibold text-sm">
                                                    {image.title}
                                                </h3>
                                            )}
                                            {image.description && (
                                                <p className="text-white/90 text-xs mt-1">
                                                    {image.description}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <p className="text-gray-500 text-lg">
                            Lookbook đang được cập nhật...
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
