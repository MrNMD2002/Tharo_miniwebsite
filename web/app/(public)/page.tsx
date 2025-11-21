import { Hero } from "@/components/sections/hero";
import Link from "next/link";
import Image from "next/image";
import { getHeroData, getLandingPageData } from "@/lib/content";
import { getProducts } from "@/lib/products";
import { getCollections } from "@/lib/collections";
import { PageViewTracker } from "@/components/tracking/page-view-tracker";

export default async function Home() {
    const heroData = await getHeroData();
    const landingPageData = await getLandingPageData();
    const allProducts = await getProducts();
    const allCollections = await getCollections();

    // Get featured collections or fallback to all active collections
    let displayCollections;
    if (landingPageData.featuredCollections.length > 0) {
        // Use featured collections in the specified order
        displayCollections = landingPageData.featuredCollections
            .map(id => allCollections.find(c => c.id === id))
            .filter((c): c is NonNullable<typeof c> => c !== undefined && c.status === "active");
    } else {
        // Fallback: show all active collections
        displayCollections = allCollections.filter(c => c.status === "active");
    }

    // Filter only active products for public display
    const activeProducts = allProducts.filter(p => p.isActive !== false);

    // Get featured products or fallback to latest 3
    let displayProducts;
    if (landingPageData.featuredProducts.length > 0) {
        // Use featured products in the specified order, but only show active ones
        const featuredActiveProducts = landingPageData.featuredProducts
            .map(id => activeProducts.find(p => p.id === id))
            .filter((p): p is NonNullable<typeof p> => p !== undefined);
        
        // If featured products are inactive, fill with latest active products
        if (featuredActiveProducts.length < landingPageData.featuredProducts.length && activeProducts.length > 0) {
            const neededCount = Math.min(3, activeProducts.length);
            const latestActive = activeProducts.slice(-neededCount).reverse();
            displayProducts = [...new Set([...featuredActiveProducts, ...latestActive])].slice(0, 3);
        } else {
            displayProducts = featuredActiveProducts.slice(0, 3);
        }
    } else {
        // Fallback: show latest 3 active products
        displayProducts = activeProducts.slice(-3).reverse();
    }

    return (
        <main>
            <PageViewTracker />
            <Hero {...heroData} />

            {/* Collections Section */}
            {displayCollections.length > 0 && (
                <section className="relative bg-gradient-to-b from-cream-50 to-cream-100 py-20 sm:py-28">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-serif font-bold tracking-tight text-burgundy-900 sm:text-5xl mb-4">
                                Bộ Sưu Tập
                            </h2>
                            <p className="mx-auto mt-4 max-w-2xl text-lg text-burgundy-700">
                                Khám phá các bộ sưu tập áo dài đặc biệt của Tharo.
                            </p>
                            <div className="mt-6 h-1 w-24 bg-burgundy-800 mx-auto rounded-full"></div>
                        </div>

                        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                            {displayCollections.map((collection) => (
                                <Link
                                    key={collection.id}
                                    href={`/collections/${collection.slug}`}
                                    className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
                                >
                                    <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden relative h-80">
                                        <Image
                                            src={collection.thumbnailUrl}
                                            alt={collection.name}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                        />

                                        {/* Gradient Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-burgundy-900/80 via-burgundy-900/20 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500" />

                                        {/* Content */}
                                        <div className="absolute inset-0 p-6 flex flex-col justify-end">
                                            <h3 className="text-2xl font-serif font-bold text-white mb-2 transform transition-transform duration-500 group-hover:translate-y-0 translate-y-2">
                                                {collection.name}
                                            </h3>
                                            {collection.description && (
                                                <p className="text-cream-100 text-sm line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                                                    {collection.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        <div className="mt-16 text-center">
                            <Link
                                href="/collections"
                                className="inline-flex items-center gap-2 rounded-full border-2 border-burgundy-800 bg-burgundy-800 px-8 py-3 text-center font-medium text-white hover:bg-transparent hover:text-burgundy-800 transition-all duration-300 shadow-lg hover:shadow-xl"
                            >
                                Xem tất cả bộ sưu tập
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </Link>
                        </div>
                    </div>

                    {/* Wave Divider */}
                    <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
                        <svg className="relative block w-full h-20" viewBox="0 0 1200 120" preserveAspectRatio="none">
                            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-white"></path>
                        </svg>
                    </div>
                </section>
            )}

            {/* New Arrivals */}
            {displayProducts.length > 0 && (
                <section className="relative bg-white py-20 sm:py-28">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-serif font-bold tracking-tight text-burgundy-900 sm:text-5xl mb-4">
                                Sản Phẩm Nổi Bật
                            </h2>
                            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
                                Những thiết kế được chọn lọc từ Tharo.
                            </p>
                            <div className="mt-6 h-1 w-24 bg-burgundy-800 mx-auto rounded-full"></div>
                        </div>

                        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                            {displayProducts.map((product) => (
                                <div key={product.id} className="group relative">
                                    {/* Fixed height image container */}
                                    <div className="w-full overflow-hidden rounded-2xl bg-gray-100 shadow-md hover:shadow-xl transition-all duration-500 relative aspect-[3/4]">
                                        <Image
                                            src={product.images[0]}
                                            alt={product.name}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                    </div>
                                    {/* Fixed height info container */}
                                    <div className="mt-6 flex justify-between items-start" style={{ minHeight: '80px' }}>
                                        <div className="flex-1 pr-4">
                                            <h3 className="text-base font-serif font-semibold text-gray-900 group-hover:text-burgundy-800 transition-colors line-clamp-2">
                                                <Link href={`/products/${product.slug}`}>
                                                    <span aria-hidden="true" className="absolute inset-0" />
                                                    {product.name}
                                                </Link>
                                            </h3>
                                            <div className="mt-2 min-h-[1.25rem]">
                                                {product.material && product.material.trim() !== '' && product.material !== '0' ? (
                                                    <p className="text-sm text-gray-500 truncate">{product.material}</p>
                                                ) : (
                                                    <p className="text-sm text-transparent select-none" aria-hidden="true">-</p>
                                                )}
                                            </div>
                                        </div>
                                        <p className="text-base font-serif font-semibold text-burgundy-800 flex-shrink-0 whitespace-nowrap">
                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-16 text-center">
                            <Link
                                href="/products"
                                className="inline-flex items-center gap-2 rounded-full border-2 border-burgundy-800 bg-transparent px-8 py-3 text-center font-medium text-burgundy-800 hover:bg-burgundy-800 hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl"
                            >
                                Xem tất cả sản phẩm
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </Link>
                        </div>
                    </div>
                </section>
            )}
        </main>
    );
}
