"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePageView } from "@/hooks/use-tracking";
import { Package } from "lucide-react";

function getProductCount(collectionId: string, products: any[]): number {
    return products.filter((p: any) => p.collectionId === collectionId && p.isActive !== false).length;
}

export function CollectionsPageClient({ 
    collections, 
    products 
}: { 
    collections: any[]; 
    products: any[];
}) {
    usePageView(); // Track page view

    return (
        <div className="bg-cream-50 py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                {/* Header */}
                <div className="mx-auto max-w-2xl text-center mb-16">
                    <h2 className="text-4xl font-serif font-bold tracking-tight text-burgundy-900 sm:text-5xl mb-4">
                        Bộ Sưu Tập
                    </h2>
                    <p className="text-lg leading-8 text-burgundy-700">
                        Khám phá những câu chuyện được kể qua tà áo dài.
                    </p>
                </div>

                {/* Collections Grid */}
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {collections.map((collection: any) => {
                        const productCount = getProductCount(collection.id, products);
                        const tags = collection.tags || [];

                        return (
                            <article key={collection.id} className="group relative">
                                <Link href={`/collections/${collection.slug}`} className="block">
                                    {/* Image Container */}
                                    <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-gray-100 shadow-lg">
                                        <Image
                                            src={collection.thumbnailUrl}
                                            alt={collection.name}
                                            fill
                                            className="object-cover transition-all duration-500 group-hover:scale-105"
                                        />
                                        
                                        {/* Gradient Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                                        
                                        {/* Tags - Top Left (Max 3 tags) - Modern Design */}
                                        {tags.length > 0 && (
                                            <div className="absolute top-4 left-4 flex flex-wrap gap-2 max-w-[calc(100%-8rem)]">
                                                {tags.slice(0, 3).map((tag: string, index: number) => (
                                                    <span 
                                                        key={`${tag}-${index}`}
                                                        className="group relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-white via-white to-white/95 backdrop-blur-md text-burgundy-700 shadow-xl border-2 border-white/60 hover:border-burgundy-200 hover:shadow-2xl hover:scale-105 transition-all duration-200"
                                                    >
                                                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-gradient-to-r from-burgundy-500 to-orange-500 animate-pulse"></span>
                                                        <span className="relative z-10">{tag}</span>
                                                        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-burgundy-50/40 to-orange-50/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 -z-10"></div>
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                        
                                        {/* Product Count - Top Right */}
                                        {productCount > 0 && (
                                            <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/90 backdrop-blur-sm text-burgundy-700 shadow-md">
                                                <Package className="h-3.5 w-3.5" />
                                                {productCount}
                                            </div>
                                        )}
                                        
                                        {/* Content - Bottom */}
                                        <div className="absolute bottom-0 left-0 right-0 p-6">
                                            <h3 className="text-2xl font-serif font-bold text-white mb-2 group-hover:text-amber-200 transition-colors">
                                                {collection.name}
                                            </h3>
                                            <p className="text-sm text-white/90 line-clamp-2 mb-4">
                                                {collection.description}
                                            </p>
                                            
                                            {/* CTA Button */}
                                            <div className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-white/20 backdrop-blur-sm px-5 py-2.5 rounded-full border border-white/30 group-hover:bg-white/30 group-hover:border-white/50 transition-all shadow-lg">
                                                <span>Khám phá ngay</span>
                                                <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </div>
                                        </div>
                                        
                                        {/* Shine Effect on Hover */}
                                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                                        </div>
                                    </div>
                                </Link>
                            </article>
                        );
                    })}
                </div>
                
                {/* Empty State */}
                {collections.length === 0 && (
                    <div className="text-center mt-10 py-12">
                        <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">Bộ sưu tập đang được cập nhật...</p>
                    </div>
                )}
            </div>
        </div>
    );
}

