"use client";

import Image from "next/image";
import Link from "next/link";
import { Hero } from "@/components/sections/hero";
import { Footer } from "@/components/layout/footer";
import { Collection, Product } from "@/types";

interface FullHomePreviewProps {
    heroData: {
        title: string;
        subtitle: string;
        ctaText: string;
        ctaLink: string;
        imageUrl: string;
        imagePosition?: "top" | "center" | "bottom";
    };
    collections: Collection[];
    products: Product[];
}

export function FullHomePreview({ heroData, collections, products }: FullHomePreviewProps) {
    return (
        <main>
            {/* Hero Section */}
            <Hero {...heroData} />

            {/* Collections Section */}
            {collections.length > 0 && (
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
                            {collections.map((collection) => (
                                <div
                                    key={collection.id}
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
                                </div>
                            ))}
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

            {/* Products Section */}
            {products.length > 0 && (
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
                            {products.map((product) => (
                                <div key={product.id} className="group relative">
                                    {/* Fixed aspect ratio image */}
                                    <div className="w-full overflow-hidden rounded-2xl bg-gray-100 shadow-md hover:shadow-xl transition-all duration-500 relative aspect-[3/4]">
                                        <Image
                                            src={product.images[0]}
                                            alt={product.name}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                    </div>
                                    {/* Fixed height info section */}
                                    <div className="mt-6 flex justify-between items-start" style={{ minHeight: '80px' }}>
                                        <div className="flex-1 pr-4">
                                            <h3 className="text-base font-medium text-gray-900 group-hover:text-burgundy-800 transition-colors line-clamp-2">
                                                {product.name}
                                            </h3>
                                            <div className="mt-2 min-h-[1.25rem]">
                                                {product.material && product.material.trim() !== '' && product.material !== '0' ? (
                                                    <p className="text-sm text-gray-500 truncate">{product.material}</p>
                                                ) : (
                                                    <p className="text-sm text-transparent select-none" aria-hidden="true">-</p>
                                                )}
                                            </div>
                                        </div>
                                        <p className="text-base font-semibold text-burgundy-800 flex-shrink-0 whitespace-nowrap">
                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Empty State */}
            {collections.length === 0 && products.length === 0 && (
                <div className="flex items-center justify-center min-h-[400px] text-gray-400">
                    Chọn bộ sưu tập và sản phẩm để xem preview trang chủ
                </div>
            )}

            {/* Footer */}
            <Footer />
        </main>
    );
}
