"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Product } from "@/types";
import Image from "next/image";
import { usePageView, useProductView, trackCTAClick } from "@/hooks/use-tracking";

interface ProductDetailClientProps {
    product: Product;
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
    const [selectedMediaIndex, setSelectedMediaIndex] = React.useState(0);
    const [copied, setCopied] = React.useState(false);
    const [isZoomed, setIsZoomed] = React.useState(false);

    // Track page view and product view
    usePageView();
    useProductView(product.id);

    // Combine images and video (max 6 media total)
    const mediaItems = React.useMemo(() => {
        const items: Array<{ type: "image" | "video"; url: string }> = [];
        
        // Add up to 5 images
        const imagesToAdd = product.images.slice(0, 5);
        imagesToAdd.forEach((url) => {
            items.push({ type: "image", url });
        });

        // Add video if exists and we have room
        if (product.videoUrl && items.length < 6) {
            items.push({ type: "video", url: product.videoUrl });
        }

        return items;
    }, [product.images, product.videoUrl]);

    const handleCopyInfo = () => {
        const textToCopy = `Tôi quan tâm sản phẩm: ${product.name}
Giá: ${new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(product.price)}
Link: ${window.location.href}`;
        
        navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleContactMessenger = () => {
        // Track CTA click
        trackCTAClick(product.id);
        
        // Prepare message text
        const productName = encodeURIComponent(product.name);
        const productPrice = encodeURIComponent(
            new Intl.NumberFormat("vi-VN").format(product.price) + "₫"
        );
        const productUrl = encodeURIComponent(window.location.href);
        
        // Pre-filled message for Messenger
        const message = encodeURIComponent(
            `Xin chào Tharo! Tôi quan tâm sản phẩm: ${product.name} - Giá: ${new Intl.NumberFormat("vi-VN").format(product.price)}₫`
        );
        
        // Open Facebook Messenger with pre-filled text
        // Using Page ID: 100089059418106
        window.open(`https://m.me/100089059418106?text=${message}`, "_blank");
    };

    const currentMedia = mediaItems[selectedMediaIndex];

    return (
        <div className="bg-cream-50">
            <div className="pt-6 pb-16 sm:pb-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="lg:grid lg:grid-cols-[120px_1fr_1fr] lg:gap-x-8">
                        {/* Thumbnail Gallery - Left Side (Desktop) */}
                        <div className="hidden lg:block">
                            <div className="flex flex-col gap-4 sticky top-6">
                                {mediaItems.map((media, index) => (
                                    <button
                                        key={index}
                                        className={cn(
                                            "relative aspect-[3/4] w-full overflow-hidden rounded-md bg-gray-100 cursor-pointer transition-all",
                                            selectedMediaIndex === index
                                                ? "ring-2 ring-burgundy-500 ring-offset-2"
                                                : "opacity-70 hover:opacity-100"
                                        )}
                                        onClick={() => setSelectedMediaIndex(index)}
                                    >
                                        {media.type === "image" ? (
                                            <Image
                                                src={media.url}
                                                alt={`Thumbnail ${index + 1}`}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="relative w-full h-full flex items-center justify-center bg-black">
                                                <video
                                                    src={media.url}
                                                    className="w-full h-full object-cover"
                                                />
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                                    <svg
                                                        className="w-8 h-8 text-white"
                                                        fill="currentColor"
                                                        viewBox="0 0 20 20"
                                                    >
                                                        <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                                                    </svg>
                                                </div>
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Main Media Display */}
                        <div className="lg:col-span-1">
                            <div className="aspect-[3/4] w-full overflow-hidden rounded-lg bg-gray-100 relative">
                                {currentMedia?.type === "image" ? (
                                    <div
                                        className="relative w-full h-full cursor-zoom-in"
                                        onMouseEnter={() => setIsZoomed(true)}
                                        onMouseLeave={() => setIsZoomed(false)}
                                    >
                                        <Image
                                            src={currentMedia.url}
                                            alt={product.name}
                                            fill
                                            className={cn(
                                                "object-cover transition-transform duration-300",
                                                isZoomed ? "scale-[1.15]" : "scale-100"
                                            )}
                                            priority
                                        />
                                    </div>
                                ) : currentMedia?.type === "video" ? (
                                    <video
                                        src={currentMedia.url}
                                        controls
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        Không có hình ảnh
                                    </div>
                                )}
                            </div>

                            {/* Thumbnail Gallery - Mobile Horizontal Scroll */}
                            <div className="mt-4 lg:hidden">
                                <div className="flex gap-3 overflow-x-auto pb-2">
                                    {mediaItems.map((media, index) => (
                                        <button
                                            key={index}
                                            className={cn(
                                                "relative aspect-[3/4] w-20 flex-shrink-0 overflow-hidden rounded-md bg-gray-100 cursor-pointer transition-all",
                                                selectedMediaIndex === index
                                                    ? "ring-2 ring-burgundy-500"
                                                    : "opacity-70"
                                            )}
                                            onClick={() => setSelectedMediaIndex(index)}
                                        >
                                            {media.type === "image" ? (
                                                <Image
                                                    src={media.url}
                                                    alt={`Thumbnail ${index + 1}`}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="relative w-full h-full bg-black flex items-center justify-center">
                                                    <svg
                                                        className="w-6 h-6 text-white"
                                                        fill="currentColor"
                                                        viewBox="0 0 20 20"
                                                    >
                                                        <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                                                    </svg>
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Product Info Panel */}
                        <div className="mt-10 lg:col-span-1 lg:mt-0">
                            <h1 className="text-3xl font-serif font-bold tracking-tight text-burgundy-900">
                                {product.name}
                            </h1>

                            {/* Price */}
                            <div className="mt-4">
                                <div className="flex items-baseline gap-3">
                                    <p className="text-3xl font-semibold tracking-tight text-burgundy-900">
                                        {new Intl.NumberFormat("vi-VN").format(product.price)}₫
                                    </p>
                                    {product.originalPrice && product.originalPrice > 0 && product.originalPrice > product.price && (
                                        <p className="text-xl text-gray-500 line-through">
                                            {new Intl.NumberFormat("vi-VN").format(product.originalPrice)}₫
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Description */}
                            <div className="mt-6">
                                <h3 className="text-sm font-medium text-gray-900">Mô tả</h3>
                                <div className="mt-2 space-y-2 text-base text-gray-700">
                                    <p>{product.description}</p>
                                </div>
                            </div>

                            {/* Material */}
                            {product.material && (
                                <div className="mt-6">
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-sm font-medium text-gray-900">Chất liệu:</h3>
                                        <span className="text-gray-700">{product.material}</span>
                                    </div>
                                </div>
                            )}

                            {/* Colors */}
                            {product.colors && product.colors.length > 0 && (
                                <div className="mt-6">
                                    <h3 className="text-sm font-medium text-gray-900 mb-2">Màu sắc có sẵn:</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {product.colors.map((color) => (
                                            <span
                                                key={color}
                                                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-burgundy-50 text-burgundy-700 border border-burgundy-200"
                                            >
                                                {color}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Sizes */}
                            {product.sizes && product.sizes.length > 0 && (
                                <div className="mt-6">
                                    <h3 className="text-sm font-medium text-gray-900 mb-2">Size có sẵn:</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {product.sizes.map((size) => (
                                            <span
                                                key={size}
                                                className="inline-flex items-center justify-center w-12 h-12 rounded-md text-sm font-medium bg-white border-2 border-burgundy-200 text-burgundy-900 hover:border-burgundy-400 transition-colors"
                                            >
                                                {size}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="mt-10 flex flex-col gap-3">
                                {/* Copy Info Button */}
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="w-full border-burgundy-300 text-burgundy-700 hover:bg-burgundy-50"
                                    onClick={handleCopyInfo}
                                >
                                    {copied ? (
                                        <>
                                            <Check className="mr-2 h-5 w-5" />
                                            Đã sao chép!
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="mr-2 h-5 w-5" />
                                            Sao chép thông tin
                                        </>
                                    )}
                                </Button>

                                {/* Contact Button */}
                                <Button
                                    size="lg"
                                    className="w-full bg-burgundy-800 hover:bg-burgundy-900 text-white text-lg h-14"
                                    onClick={handleContactMessenger}
                                >
                                    <MessageCircle className="mr-2 h-5 w-5" />
                                    Liên hệ mua ngay
                                </Button>

                                <p className="text-xs text-center text-gray-500">
                                    *Nhấn nút để mở Facebook Messenger và nhận tư vấn trực tiếp từ Tharo
                                </p>

                                {/* Additional Links */}
                                <div className="grid grid-cols-2 gap-3 mt-4">
                                    {product.shopeeLink && (
                                        <Button variant="outline" asChild className="w-full">
                                            <a href={product.shopeeLink} target="_blank" rel="noopener noreferrer">
                                                🛒 Shopee
                                            </a>
                                        </Button>
                                    )}
                                    {product.tiktokLink && (
                                        <Button variant="outline" asChild className="w-full">
                                            <a href={product.tiktokLink} target="_blank" rel="noopener noreferrer">
                                                🎵 TikTok
                                            </a>
                                        </Button>
                                    )}
                                </div>
                            </div>

                            {/* Status Badge */}
                            {product.status && product.status !== "in-stock" && (
                                <div className="mt-6">
                                    <span
                                        className={cn(
                                            "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium",
                                            product.status === "new" && "bg-green-100 text-green-800",
                                            product.status === "pre-order" && "bg-yellow-100 text-yellow-800",
                                            product.status === "limited" && "bg-red-100 text-red-800"
                                        )}
                                    >
                                        {product.status === "new" && "🆕 Mới"}
                                        {product.status === "pre-order" && "📅 Pre-order"}
                                        {product.status === "limited" && "⭐ Giới hạn"}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
