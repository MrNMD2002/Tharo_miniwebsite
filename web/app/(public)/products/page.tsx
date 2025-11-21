"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Product, Collection } from "@/types";
import { Button } from "@/components/ui/button";
import { getMatchingColors, getUniqueColorsFromProducts } from "@/lib/color-mapping";
import { usePageView, trackCTAClick } from "@/hooks/use-tracking";

export default function ProductsPage() {
    // Track page view
    usePageView();
    const [products, setProducts] = React.useState<Product[]>([]);
    const [collections, setCollections] = React.useState<Collection[]>([]);
    const [filteredProducts, setFilteredProducts] = React.useState<Product[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    
    // Filter & Sort states
    const [sortBy, setSortBy] = React.useState<"newest" | "oldest" | "collection" | "manual">("manual");
    const [filterColor, setFilterColor] = React.useState<string>("all");
    const [filterCollection, setFilterCollection] = React.useState<string>("all");
    
    // Pagination states
    const [currentPage, setCurrentPage] = React.useState(1);
    const [itemsPerPage, setItemsPerPage] = React.useState(12);

    // Fetch products and collections
    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const [productsRes, collectionsRes] = await Promise.all([
                    fetch("/api/products"),
                    fetch("/api/collections")
                ]);
                
                if (productsRes.ok) {
                    const productsData = await productsRes.json();
                    // Only show active products for public view
                    const activeProducts = productsData.filter((p: Product) => p.isActive !== false);
                    setProducts(activeProducts);
                    setFilteredProducts(activeProducts);
                }
                
                if (collectionsRes.ok) {
                    const collectionsData = await collectionsRes.json();
                    // Only show active collections
                    setCollections(collectionsData.filter((c: Collection) => c.status === "active"));
                }
            } catch (error) {
                console.error("Failed to fetch data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    // Get unique colors from all products
    // Uses color-mapping to show parent colors when children exist
    const availableColors = React.useMemo(() => {
        return getUniqueColorsFromProducts(products);
    }, [products]);

    // Apply filters and sorting
    React.useEffect(() => {
        let filtered = [...products];

        // Filter by color using parent-child mapping
        // If parent selected → Match all children in group
        // If child selected → Match exact only
        if (filterColor !== "all") {
            const matchingColors = getMatchingColors(filterColor);
            filtered = filtered.filter((p) => {
                if (!p.primaryColor) return false;
                const normalizedProductColor = p.primaryColor.trim();
                // Check if product color matches any of the matching colors
                return matchingColors.some(color => color === normalizedProductColor);
            });
        }

        // Filter by collection
        if (filterCollection !== "all") {
            filtered = filtered.filter((p) => p.collectionId === filterCollection);
        }

        // Sort
        if (sortBy === "newest") {
            filtered.sort((a, b) => {
                const dateA = new Date(a.createdAt || "2024-01-01").getTime();
                const dateB = new Date(b.createdAt || "2024-01-01").getTime();
                return dateB - dateA; // Newest first
            });
        } else if (sortBy === "oldest") {
            filtered.sort((a, b) => {
                const dateA = new Date(a.createdAt || "2024-01-01").getTime();
                const dateB = new Date(b.createdAt || "2024-01-01").getTime();
                return dateA - dateB; // Oldest first
            });
        } else if (sortBy === "collection") {
            filtered.sort((a, b) => {
                const collA = a.collectionId || "zzz";
                const collB = b.collectionId || "zzz";
                return collA.localeCompare(collB);
            });
        } else if (sortBy === "manual") {
            filtered.sort((a, b) => {
                const orderA = a.sortOrder || 999;
                const orderB = b.sortOrder || 999;
                return orderA - orderB;
            });
        }

        setFilteredProducts(filtered);
        setCurrentPage(1); // Reset to first page when filters change
    }, [products, sortBy, filterColor, filterCollection]);

    // Pagination
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentProducts = filteredProducts.slice(startIndex, endIndex);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    if (isLoading) {
        return (
            <div className="bg-cream-50 min-h-screen py-16 sm:py-24 flex items-center justify-center">
                <div className="text-burgundy-700">Đang tải sản phẩm...</div>
            </div>
        );
    }

    return (
        <div className="bg-cream-50 min-h-screen py-16 sm:py-24">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                {/* Header */}
                <div className="text-center">
                    <h1 className="text-3xl font-serif font-bold tracking-tight text-burgundy-900 sm:text-4xl">
                        Tất Cả Sản Phẩm
                    </h1>
                    <p className="mt-4 text-lg leading-8 text-burgundy-700">
                        Khám phá vẻ đẹp truyền thống qua từng thiết kế Áo Dài Tharo.
                    </p>
                </div>

                {/* Filters & Sorting */}
                <div className="mt-10 border-b border-burgundy-200 pb-6">
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                        <div className="flex flex-wrap gap-4">
                        {/* Sort by */}
                        <div className="flex items-center gap-2">
                            <label className="text-sm font-medium text-burgundy-900">Sắp xếp:</label>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as any)}
                                className="rounded-md border-burgundy-300 text-sm focus:border-burgundy-500 focus:ring-burgundy-500 px-3 py-2"
                            >
                                <option value="manual">Thứ tự mặc định</option>
                                <option value="newest">Mới nhất</option>
                                <option value="oldest">Cũ nhất</option>
                                <option value="collection">Theo bộ sưu tập</option>
                            </select>
                        </div>

                        {/* Filter by collection */}
                        <div className="flex items-center gap-2">
                            <label className="text-sm font-medium text-burgundy-900">Bộ sưu tập:</label>
                            <select
                                value={filterCollection}
                                onChange={(e) => setFilterCollection(e.target.value)}
                                className="rounded-md border-burgundy-300 text-sm focus:border-burgundy-500 focus:ring-burgundy-500 px-3 py-2"
                            >
                                <option value="all">Tất cả</option>
                                {collections.map((collection) => (
                                    <option key={collection.id} value={collection.id}>
                                        {collection.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Filter by color */}
                        {availableColors.length > 0 && (
                            <div className="flex items-center gap-2">
                                <label className="text-sm font-medium text-burgundy-900">Màu sắc:</label>
                                <select
                                    value={filterColor}
                                    onChange={(e) => setFilterColor(e.target.value)}
                                    className="rounded-md border-burgundy-300 text-sm focus:border-burgundy-500 focus:ring-burgundy-500 px-3 py-2"
                                >
                                    <option value="all">Tất cả</option>
                                    {availableColors.map((color) => (
                                        <option key={color} value={color}>
                                            {color}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>

                    {/* Items per page */}
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-burgundy-900">Hiển thị:</label>
                        <select
                            value={itemsPerPage}
                            onChange={(e) => {
                                setItemsPerPage(Number(e.target.value));
                                setCurrentPage(1);
                            }}
                            className="rounded-md border-burgundy-300 text-sm focus:border-burgundy-500 focus:ring-burgundy-500 px-3 py-2"
                        >
                            <option value={8}>8 sản phẩm</option>
                            <option value={12}>12 sản phẩm</option>
                            <option value={24}>24 sản phẩm</option>
                            <option value={48}>48 sản phẩm</option>
                        </select>
                    </div>
                </div>
                
                {/* Active Filters & Clear All */}
                {(filterColor !== "all" || filterCollection !== "all" || sortBy !== "manual") && (
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                        <span className="text-sm text-burgundy-700 font-medium">Đang lọc:</span>
                        
                        {sortBy !== "manual" && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs bg-burgundy-100 text-burgundy-800">
                                {sortBy === "newest" ? "Mới nhất" : sortBy === "oldest" ? "Cũ nhất" : "Theo BST"}
                            </span>
                        )}
                        
                        {filterCollection !== "all" && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs bg-burgundy-100 text-burgundy-800">
                                BST: {collections.find(c => c.id === filterCollection)?.name}
                            </span>
                        )}
                        
                        {filterColor !== "all" && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs bg-burgundy-100 text-burgundy-800">
                                Màu: {filterColor}
                            </span>
                        )}
                        
                        <button
                            onClick={() => {
                                setSortBy("manual");
                                setFilterColor("all");
                                setFilterCollection("all");
                            }}
                            className="ml-2 text-xs text-burgundy-600 hover:text-burgundy-800 underline"
                        >
                            Xóa tất cả bộ lọc
                        </button>
                    </div>
                )}
            </div>

                {/* Results count */}
                <div className="mt-6 text-sm text-burgundy-700">
                    Hiển thị {startIndex + 1}–{Math.min(endIndex, filteredProducts.length)} trong tổng số {filteredProducts.length} sản phẩm
                </div>

                {/* Product Grid */}
                <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                    {currentProducts.map((product) => (
                        <ProductCard key={product.id} product={product} collections={collections} />
                    ))}
                </div>

                {/* Empty state */}
                {currentProducts.length === 0 && (
                    <div className="mt-10 text-center text-burgundy-600">
                        Không tìm thấy sản phẩm nào phù hợp với bộ lọc của bạn.
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="mt-12 flex items-center justify-center gap-2">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-3 py-1 rounded-md text-sm font-medium text-burgundy-700 hover:bg-burgundy-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            ← Trước
                        </button>

                        <div className="flex gap-1">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                                // Show first, last, current, and adjacent pages
                                if (
                                    page === 1 ||
                                    page === totalPages ||
                                    (page >= currentPage - 1 && page <= currentPage + 1)
                                ) {
                                    return (
                                        <button
                                            key={page}
                                            onClick={() => handlePageChange(page)}
                                            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                                                page === currentPage
                                                    ? "bg-burgundy-800 text-white"
                                                    : "text-burgundy-700 hover:bg-burgundy-100"
                                            }`}
                                        >
                                            {page}
                                        </button>
                                    );
                                } else if (page === currentPage - 2 || page === currentPage + 2) {
                                    return (
                                        <span key={page} className="px-2 py-1 text-burgundy-400">
                                            ...
                                        </span>
                                    );
                                }
                                return null;
                            })}
                        </div>

                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 rounded-md text-sm font-medium text-burgundy-700 hover:bg-burgundy-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Sau →
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

// Product Card Component
function ProductCard({ product, collections }: { product: Product; collections: Collection[] }) {
    const collection = collections.find((c) => c.id === product.collectionId);
    const collectionName = collection?.name || "";

    return (
        <div className="group relative">
            <Link href={`/products/${product.slug}`}>
                {/* Image with 3:4 aspect ratio */}
                <div className="aspect-[3/4] w-full overflow-hidden rounded-lg bg-gray-100 relative">
                    <Image
                        src={product.images[0] || "/placeholder-product.jpg"}
                        alt={product.name}
                        width={400}
                        height={533}
                        className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                    
                    {/* Status Badge */}
                    {product.status === "new" && (
                        <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded-md font-medium shadow-md">
                            Mới
                        </div>
                    )}
                    {product.status === "limited" && (
                        <div className="absolute top-2 left-2 bg-purple-600 text-white text-xs px-2 py-1 rounded-md font-medium shadow-md">
                            Giới hạn
                        </div>
                    )}
                    {product.status === "pre-order" && (
                        <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-md font-medium shadow-md">
                            Đặt trước
                        </div>
                    )}
                </div>

                {/* Product Info - Fixed height structure */}
                <div className="mt-4 flex flex-col" style={{ minHeight: '140px' }}>
                    {/* Product Name - Always 2 lines */}
                    <h3 className="text-sm font-medium text-burgundy-900 group-hover:text-burgundy-700 transition-colors line-clamp-2 min-h-[2.5rem]">
                        {product.name}
                    </h3>
                    
                    {/* Price & Color - Always same height */}
                    <div className="mt-2 flex items-start justify-between min-h-[2.5rem]">
                        <div className="flex flex-col justify-start">
                            <p className="text-base font-semibold text-burgundy-900">
                                {new Intl.NumberFormat("vi-VN").format(product.price)}₫
                            </p>
                            {/* Reserve space for original price */}
                            <div className="min-h-[1rem]">
                                {product.originalPrice && product.originalPrice > 0 && product.originalPrice > product.price && (
                                    <p className="text-xs text-gray-500 line-through">
                                        {new Intl.NumberFormat("vi-VN").format(product.originalPrice)}₫
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="flex-shrink-0">
                            {product.primaryColor && product.primaryColor.trim() !== '' && product.primaryColor !== '0' ? (
                                <span className="text-xs text-burgundy-600 bg-burgundy-50 px-2 py-1 rounded whitespace-nowrap">
                                    {product.primaryColor}
                                </span>
                            ) : (
                                <span className="text-xs invisible select-none" aria-hidden="true">-</span>
                            )}
                        </div>
                    </div>

                    {/* Metadata - Always same height */}
                    <div className="mt-auto space-y-1">
                        <div className="min-h-[1.25rem]">
                            {collectionName && collectionName.trim() !== '' && collectionName !== '0' ? (
                                <p className="text-xs text-burgundy-500 truncate">{collectionName}</p>
                            ) : (
                                <p className="text-xs text-transparent select-none">-</p>
                            )}
                        </div>
                        <div className="min-h-[1.25rem]">
                            {product.material && product.material.trim() !== '' && product.material !== '0' ? (
                                <p className="text-xs text-gray-500 truncate">{product.material}</p>
                            ) : (
                                <p className="text-xs text-transparent select-none">-</p>
                            )}
                        </div>
                    </div>
                </div>
            </Link>

            {/* Contact Button */}
            <Button
                size="sm"
                variant="outline"
                className="mt-3 w-full border-burgundy-300 text-burgundy-700 hover:bg-burgundy-50"
                onClick={(e) => {
                    e.preventDefault();
                    // Track CTA click with product ID
                    trackCTAClick("messenger", product.id);
                    // Pre-filled message with product details
                    const message = encodeURIComponent(
                        `Xin chào Tharo! Tôi quan tâm sản phẩm: ${product.name} - Giá: ${new Intl.NumberFormat("vi-VN").format(product.price)}₫`
                    );
                    // Using Tharo Page ID: 100089059418106
                    window.open(`https://m.me/100089059418106?text=${message}`, "_blank");
                }}
            >
                Liên hệ
            </Button>
        </div>
    );
}
