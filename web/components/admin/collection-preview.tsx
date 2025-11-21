"use client";

import * as React from "react";
import Image from "next/image";
import { Collection, Product } from "@/types";
import { Monitor, Tablet, Smartphone, MessageCircle } from "lucide-react";

interface CollectionPreviewProps {
    formData: Partial<Collection>;
    thumbnailUrl: string;
    coverImages: string[];
    galleryImages: string[];
    selectedProducts: Product[];
}

type DeviceType = "desktop" | "tablet" | "mobile";

export function CollectionPreview({
    formData,
    thumbnailUrl,
    coverImages,
    galleryImages,
    selectedProducts,
}: CollectionPreviewProps) {
    const [device, setDevice] = React.useState<DeviceType>("desktop");

    const deviceWidths = {
        desktop: "w-full",
        tablet: "w-[768px]",
        mobile: "w-[375px]",
    };

    const deviceClass = deviceWidths[device];

    return (
        <div className="flex flex-col h-full border-l border-gray-200 bg-gray-50">
            {/* Fixed Header */}
            <div className="flex-shrink-0 bg-white border-b border-gray-200 px-4 py-3 z-10">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-900">Preview</h3>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setDevice("desktop")}
                            className={`p-2 rounded ${
                                device === "desktop"
                                    ? "bg-burgundy-100 text-burgundy-600"
                                    : "text-gray-400 hover:text-gray-600"
                            }`}
                            title="Desktop"
                        >
                            <Monitor className="h-4 w-4" />
                        </button>
                        <button
                            type="button"
                            onClick={() => setDevice("tablet")}
                            className={`p-2 rounded ${
                                device === "tablet"
                                    ? "bg-burgundy-100 text-burgundy-600"
                                    : "text-gray-400 hover:text-gray-600"
                            }`}
                            title="Tablet"
                        >
                            <Tablet className="h-4 w-4" />
                        </button>
                        <button
                            type="button"
                            onClick={() => setDevice("mobile")}
                            className={`p-2 rounded ${
                                device === "mobile"
                                    ? "bg-burgundy-100 text-burgundy-600"
                                    : "text-gray-400 hover:text-gray-600"
                            }`}
                            title="Mobile"
                        >
                            <Smartphone className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-4">
                <div className="flex justify-center">
                    <div
                        className={`${deviceClass} transition-all duration-300 bg-white shadow-lg overflow-hidden`}
                    >
                    {/* Metadata Section */}
                    <div className="p-4 bg-gray-50 border-b">
                        <div className="space-y-2 text-xs">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-500">Trạng thái:</span>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    formData.status === 'active' 
                                        ? 'bg-green-100 text-green-700' 
                                        : 'bg-gray-100 text-gray-700'
                                }`}>
                                    {formData.status === 'active' ? 'Đang hiển thị' : 'Ẩn'}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-500">Slug:</span>
                                <span className="font-mono text-gray-700">{formData.slug || 'auto-generate'}</span>
                            </div>
                            {formData.tags && formData.tags.length > 0 && (
                                <div className="pt-2 border-t">
                                    <span className="text-gray-500 block mb-2">Tags (max 3 hiển thị trên card):</span>
                                    <div className="flex flex-wrap gap-2">
                                        {formData.tags.map((tag: string, index: number) => (
                                            <span key={index} className="group relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-white via-white to-white/95 text-burgundy-700 shadow-lg border-2 border-burgundy-100 hover:border-burgundy-200 transition-all">
                                                <span className="inline-block w-1.5 h-1.5 rounded-full bg-gradient-to-r from-burgundy-500 to-orange-500"></span>
                                                <span>{tag}</span>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                            <div className="flex items-center justify-between">
                                <span className="text-gray-500">Số sản phẩm:</span>
                                <span className="font-semibold text-burgundy-700">{selectedProducts.length}</span>
                            </div>
                        </div>
                    </div>

                    {/* Cover Banner */}
                    {(coverImages.length > 0 || thumbnailUrl) && (
                        <div className="relative w-full h-64 bg-gray-200">
                            <Image
                                src={coverImages[0] || thumbnailUrl}
                                alt="Cover"
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                                <h1 className="text-2xl md:text-3xl font-serif font-bold">
                                    {formData.name || "Tên bộ sưu tập"}
                                </h1>
                                {formData.description && (
                                    <p className="mt-2 text-sm opacity-90">{formData.description}</p>
                                )}
                                {/* Tags preview in overlay - Modern Design */}
                                {formData.tags && formData.tags.length > 0 && (
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {formData.tags.slice(0, 3).map((tag: string, index: number) => (
                                            <span key={index} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-white via-white to-white/95 backdrop-blur-md text-burgundy-700 shadow-xl border-2 border-white/60">
                                                <span className="inline-block w-1.5 h-1.5 rounded-full bg-gradient-to-r from-burgundy-500 to-orange-500 animate-pulse"></span>
                                                <span>{tag}</span>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Story Section */}
                    {formData.story && (
                        <div className="p-6 border-b">
                            <h2 className="text-lg font-serif font-bold text-center mb-3">
                                Câu chuyện bộ sưu tập
                            </h2>
                            <p className="text-sm text-gray-700 whitespace-pre-line text-center">
                                {formData.story.length > 200
                                    ? `${formData.story.substring(0, 200)}...`
                                    : formData.story}
                            </p>
                        </div>
                    )}

                    {/* Gallery Section */}
                    {galleryImages.length > 0 && (
                        <div className="p-6 border-b">
                            <h2 className="text-lg font-serif font-bold text-center mb-4">Hình ảnh</h2>
                            <div
                                className={`grid gap-2 ${
                                    device === "mobile"
                                        ? "grid-cols-2"
                                        : device === "tablet"
                                        ? "grid-cols-3"
                                        : "grid-cols-4"
                                }`}
                            >
                                {galleryImages.slice(0, 4).map((img, idx) => (
                                    <div key={idx} className="relative aspect-square">
                                        <Image
                                            src={img}
                                            alt={`Gallery ${idx + 1}`}
                                            fill
                                            className="object-cover rounded"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Products Section */}
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-serif font-bold">
                                Sản phẩm ({selectedProducts.length})
                            </h2>
                            {formData.messengerLink && (
                                <button className="inline-flex items-center gap-1 bg-burgundy-600 text-white px-3 py-1 rounded-full text-xs">
                                    <MessageCircle className="h-3 w-3" />
                                    Liên hệ
                                </button>
                            )}
                        </div>

                        {selectedProducts.length > 0 ? (
                            <div
                                className={`grid gap-4 ${
                                    device === "mobile"
                                        ? "grid-cols-1"
                                        : device === "tablet"
                                        ? "grid-cols-2"
                                        : "grid-cols-3"
                                }`}
                            >
                                {selectedProducts.slice(0, 6).map((product) => (
                                    <div key={product.id} className="group">
                                        <div className="relative aspect-[3/4] bg-gray-100 rounded overflow-hidden">
                                            <Image
                                                src={product.images[0]}
                                                alt={product.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="mt-2">
                                            <h3 className="text-xs font-medium line-clamp-1">{product.name}</h3>
                                            {product.primaryColor && (
                                                <p className="text-xs text-gray-500">{product.primaryColor}</p>
                                            )}
                                            <p className="text-sm font-semibold text-burgundy-900 mt-1">
                                                {new Intl.NumberFormat("vi-VN", {
                                                    style: "currency",
                                                    currency: "VND",
                                                }).format(product.price)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 bg-gray-50 rounded">
                                <p className="text-sm text-gray-500">Chưa chọn sản phẩm nào</p>
                            </div>
                        )}
                    </div>

                    {/* CTA Section */}
                    {formData.messengerLink && selectedProducts.length > 0 && (
                        <div className="p-6 bg-burgundy-50 text-center border-t">
                            <h3 className="text-base font-serif font-bold mb-2">
                                Quan tâm đến bộ sưu tập {formData.name || "này"}?
                            </h3>
                            <p className="text-xs text-gray-700 mb-3">
                                Liên hệ ngay với chúng tôi để được tư vấn chi tiết
                            </p>
                            <button className="inline-flex items-center gap-2 bg-burgundy-600 text-white px-4 py-2 rounded-full text-sm">
                                <MessageCircle className="h-4 w-4" />
                                Liên hệ ngay
                            </button>
                        </div>
                    )}

                    {/* Empty State */}
                    {!thumbnailUrl && coverImages.length === 0 && (
                        <div className="p-12 text-center text-gray-400">
                            <p>Preview sẽ hiển thị khi bạn upload ảnh và điền thông tin</p>
                        </div>
                    )}
                    </div>
                </div>
            </div>
        </div>
    );
}

