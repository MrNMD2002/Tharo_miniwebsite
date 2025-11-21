import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { MessageCircle } from "lucide-react";
import { PageViewTracker } from "@/components/tracking/page-view-tracker";

interface PageProps {
    params: Promise<{
        slug: string;
    }>;
}

async function getCollections() {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001';
        const response = await fetch(`${baseUrl}/api/collections`, {
            cache: 'no-store',
        });
        
        if (!response.ok) throw new Error('Failed to fetch collections');
        return await response.json();
    } catch (error) {
        console.error('Error fetching collections:', error);
        return [];
    }
}

async function getProducts() {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001';
        const response = await fetch(`${baseUrl}/api/products`, {
            cache: 'no-store',
        });
        
        if (!response.ok) throw new Error('Failed to fetch products');
        return await response.json();
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
}

export default async function CollectionDetailPage({ params }: PageProps) {
    const { slug } = await params;
    const collections = await getCollections();
    const collection = collections.find((c: any) => c.slug === slug);

    if (!collection) {
        notFound();
    }

    // Only show active collections
    if (collection.status !== "active") {
        notFound();
    }

    const allProducts = await getProducts();
    // Only show active products in collection
    const products = allProducts.filter((p: any) => 
        collection.productIds && collection.productIds.includes(p.id) && p.isActive !== false
    );

    // Messenger CTA text - Generic message for collection page
    const genericMessengerMessage = encodeURIComponent("Xin chào Tharo, tôi đến từ website của bạn, hãy tư vấn cho tôi thêm");
    const messengerLink = `https://m.me/100089059418106?text=${genericMessengerMessage}`;

    return (
        <div className="bg-cream-50">
            <PageViewTracker />
            {/* Cover Banner / Slideshow */}
            {collection.coverImages && collection.coverImages.length > 0 && (
                <div className="relative w-full h-[50vh] md:h-[60vh] overflow-hidden">
                    <Image
                        src={collection.coverImages[0]}
                        alt={collection.name}
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 text-white">
                        <div className="max-w-7xl mx-auto">
                            <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tight">
                                BST {collection.name}
                            </h1>
                            {collection.description && (
                                <p className="mt-4 text-lg md:text-xl max-w-2xl">
                                    {collection.description}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Story Section */}
            {collection.story && (
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                    <div className="prose prose-burgundy max-w-none">
                        <h2 className="text-2xl md:text-3xl font-serif font-bold text-burgundy-900 text-center mb-6">
                            Câu chuyện bộ sưu tập
                        </h2>
                        <div className="text-gray-700 leading-relaxed whitespace-pre-line text-center">
                            {collection.story}
                        </div>
                    </div>
                </div>
            )}

            {/* Gallery Section */}
            {collection.galleryImages && collection.galleryImages.length > 0 && (
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                    <h2 className="text-2xl md:text-3xl font-serif font-bold text-burgundy-900 text-center mb-8">
                        Hình ảnh
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {collection.galleryImages.map((img: string, idx: number) => (
                            <div key={idx} className="relative aspect-square overflow-hidden rounded-lg">
                                <Image
                                    src={img}
                                    alt={`${collection.name} gallery ${idx + 1}`}
                                    fill
                                    className="object-cover hover:scale-110 transition-transform duration-300"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Products Section */}
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl md:text-3xl font-serif font-bold text-burgundy-900">
                        Sản phẩm ({products.length})
                    </h2>
                    {collection.messengerLink && (
                        <a
                            href={messengerLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-burgundy-600 text-white px-6 py-3 rounded-full hover:bg-burgundy-700 transition-colors shadow-md"
                        >
                            <MessageCircle className="h-5 w-5" />
                            <span className="font-medium">Liên hệ</span>
                        </a>
                    )}
                </div>

                {products.length > 0 ? (
                    <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                        {products.map((product: any) => (
                            <Link key={product.id} href={`/products/${product.slug}`} className="group">
                                {/* Fixed aspect ratio image */}
                                <div className="aspect-[3/4] w-full overflow-hidden rounded-lg bg-gray-200 relative">
                                    <Image
                                        src={product.images[0]}
                                        alt={product.name}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    {product.status === "new" && (
                                        <span className="absolute top-2 left-2 bg-burgundy-600 text-white text-xs px-2 py-1 rounded">
                                            Mới
                                        </span>
                                    )}
                                </div>
                                {/* Fixed height info section */}
                                <div className="mt-4" style={{ minHeight: '110px' }}>
                                    <h3 className="text-sm font-medium text-burgundy-900 group-hover:text-burgundy-600 transition-colors line-clamp-2 min-h-[2.5rem]">
                                        {product.name}
                                    </h3>
                                    <div className="mt-1 min-h-[1.25rem]">
                                        {product.primaryColor && product.primaryColor.trim() !== '' && product.primaryColor !== '0' ? (
                                            <p className="text-xs text-gray-500 truncate">
                                                {product.primaryColor}
                                            </p>
                                        ) : (
                                            <p className="text-xs text-transparent select-none" aria-hidden="true">-</p>
                                        )}
                                    </div>
                                    <div className="mt-2 flex items-baseline gap-2">
                                        <p className="text-lg font-semibold text-burgundy-900">
                                            {new Intl.NumberFormat("vi-VN", {
                                                style: "currency",
                                                currency: "VND",
                                            }).format(product.price)}
                                        </p>
                                        {product.originalPrice && product.originalPrice > 0 && product.originalPrice > product.price && (
                                            <p className="text-sm text-gray-500 line-through">
                                                {new Intl.NumberFormat("vi-VN", {
                                                    style: "currency",
                                                    currency: "VND",
                                                }).format(product.originalPrice)}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-white rounded-lg shadow-sm">
                        <p className="text-gray-500 text-lg">
                            Sản phẩm đang được cập nhật...
                        </p>
                        {collection.messengerLink && (
                            <a
                                href={messengerLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 mt-6 bg-burgundy-600 text-white px-6 py-3 rounded-full hover:bg-burgundy-700 transition-colors"
                            >
                                <MessageCircle className="h-5 w-5" />
                                <span className="font-medium">Liên hệ để biết thêm chi tiết</span>
                            </a>
                        )}
                    </div>
                )}
            </div>

            {/* CTA Section */}
            {collection.messengerLink && products.length > 0 && (
                <div className="bg-burgundy-50 border-t border-burgundy-100">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 text-center">
                        <h3 className="text-2xl font-serif font-bold text-burgundy-900 mb-4">
                            Quan tâm đến bộ sưu tập {collection.name}?
                        </h3>
                        <p className="text-burgundy-700 mb-6">
                            Liên hệ ngay với chúng tôi để được tư vấn chi tiết
                        </p>
                        <a
                            href={messengerLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-burgundy-600 text-white px-8 py-4 rounded-full hover:bg-burgundy-700 transition-colors shadow-lg text-lg font-medium"
                        >
                            <MessageCircle className="h-6 w-6" />
                            <span>Liên hệ ngay</span>
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
}
