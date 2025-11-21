"use client";

import * as React from "react";
import { Hero } from "@/components/sections/hero";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { MediaUploader } from "@/components/admin/media-uploader";
import { Toast } from "@/components/ui/toast-custom";
import { Collection, Product } from "@/types";
import { FullHomePreview } from "@/components/admin/home-preview";

type TabType = "hero" | "collections" | "products";

export default function ContentManagerPage() {
    const [activeTab, setActiveTab] = React.useState<TabType>("hero");
    const [isSaving, setIsSaving] = React.useState(false);
    const [toast, setToast] = React.useState({ isVisible: false, message: "", type: "success" as "success" | "error" });

    // Hero data
    const [heroData, setHeroData] = React.useState({
        title: "",
        subtitle: "",
        ctaText: "",
        ctaLink: "",
        imageUrl: "",
        imagePosition: "center" as "top" | "center" | "bottom",
    });

    // Landing page data
    const [featuredCollectionIds, setFeaturedCollectionIds] = React.useState<string[]>([]);
    const [featuredProductIds, setFeaturedProductIds] = React.useState<string[]>([]);

    // Available items
    const [allCollections, setAllCollections] = React.useState<Collection[]>([]);
    const [allProducts, setAllProducts] = React.useState<Product[]>([]);

    const [isLoading, setIsLoading] = React.useState(true);

    // Fetch all data on mount
    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const [heroRes, landingPageRes, collectionsRes, productsRes] = await Promise.all([
                    fetch("/api/content/hero"),
                    fetch("/api/content/landing-page"),
                    fetch("/api/collections"),
                    fetch("/api/products"),
                ]);

                if (heroRes.ok) {
                    const data = await heroRes.json();
                    setHeroData({ ...data, imagePosition: data.imagePosition || "center" });
                }

                if (landingPageRes.ok) {
                    const data = await landingPageRes.json();
                    setFeaturedCollectionIds(data.featuredCollections || []);
                    setFeaturedProductIds(data.featuredProducts || []);
                }

                if (collectionsRes.ok) {
                    const data = await collectionsRes.json();
                    setAllCollections(data.filter((c: Collection) => c.status === "active"));
                }

                if (productsRes.ok) {
                    const data = await productsRes.json();
                    setAllProducts(data);
                }
            } catch (error) {
                console.error("Failed to fetch data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleHeroChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setHeroData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (urls: string[]) => {
        if (urls.length > 0) {
            setHeroData((prev) => ({ ...prev, imageUrl: urls[0] }));
        } else {
            setHeroData((prev) => ({ ...prev, imageUrl: "" }));
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            if (activeTab === "hero") {
                const response = await fetch("/api/content/hero", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(heroData),
                });
                if (!response.ok) throw new Error("Failed to save hero");
            } else {
                const response = await fetch("/api/content/landing-page", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        featuredCollections: featuredCollectionIds,
                        featuredProducts: featuredProductIds,
                    }),
                });
                if (!response.ok) throw new Error("Failed to save landing page");
            }

            setToast({ isVisible: true, message: "Đã lưu thay đổi thành công!", type: "success" });
        } catch (error) {
            console.error("Error saving data:", error);
            setToast({ isVisible: true, message: "Có lỗi xảy ra khi lưu thay đổi.", type: "error" });
        } finally {
            setIsSaving(false);
        }
    };

    const toggleCollection = (id: string) => {
        setFeaturedCollectionIds(prev =>
            prev.includes(id) ? prev.filter(cid => cid !== id) : [...prev, id]
        );
    };

    const toggleProduct = (id: string) => {
        setFeaturedProductIds(prev =>
            prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]
        );
    };

    const moveItem = (array: string[], fromIndex: number, toIndex: number) => {
        const newArray = [...array];
        const [removed] = newArray.splice(fromIndex, 1);
        newArray.splice(toIndex, 0, removed);
        return newArray;
    };

    if (isLoading) {
        return <div className="p-6">Đang tải dữ liệu...</div>;
    }

    return (
        <div className="h-full flex flex-col">
            <Toast
                isVisible={toast.isVisible}
                message={toast.message}
                type={toast.type}
                onClose={() => setToast((prev) => ({ ...prev, isVisible: false }))}
            />

            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-serif font-bold text-burgundy-900">
                    Quản lý Nội dung Landing Page
                </h1>
                <Button onClick={handleSave} disabled={isSaving} className="bg-burgundy-800 hover:bg-burgundy-900 text-white">
                    {isSaving ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
                    ) : (
                        <Save className="mr-2 h-4 w-4" />
                    )}
                    {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
                </Button>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-8">
                    <button
                        onClick={() => setActiveTab("hero")}
                        className={`${activeTab === "hero"
                            ? "border-burgundy-800 text-burgundy-900"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                    >
                        Hero Banner
                    </button>
                    <button
                        onClick={() => setActiveTab("collections")}
                        className={`${activeTab === "collections"
                            ? "border-burgundy-800 text-burgundy-900"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                    >
                        Bộ Sưu Tập Nổi Bật
                        {featuredCollectionIds.length > 0 && (
                            <span className="ml-2 bg-burgundy-100 text-burgundy-800 py-0.5 px-2 rounded-full text-xs">
                                {featuredCollectionIds.length}
                            </span>
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab("products")}
                        className={`${activeTab === "products"
                            ? "border-burgundy-800 text-burgundy-900"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                    >
                        Sản Phẩm Nổi Bật
                        {featuredProductIds.length > 0 && (
                            <span className="ml-2 bg-burgundy-100 text-burgundy-800 py-0.5 px-2 rounded-full text-xs">
                                {featuredProductIds.length}
                            </span>
                        )}
                    </button>
                </nav>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto">
                {activeTab === "hero" && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Hero Editor */}
                        <div className="bg-white shadow rounded-lg p-6">
                            <h2 className="text-lg font-medium text-gray-900 mb-4">Chỉnh sửa Hero Banner</h2>
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                                        Tiêu đề chính
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        id="title"
                                        value={heroData.title}
                                        onChange={handleHeroChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-burgundy-500 focus:ring-burgundy-500 sm:text-sm border p-2"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="subtitle" className="block text-sm font-medium text-gray-700">
                                        Mô tả phụ
                                    </label>
                                    <textarea
                                        name="subtitle"
                                        id="subtitle"
                                        rows={3}
                                        value={heroData.subtitle}
                                        onChange={handleHeroChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-burgundy-500 focus:ring-burgundy-500 sm:text-sm border p-2"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Ảnh nền
                                    </label>
                                    <MediaUploader
                                        value={heroData.imageUrl ? [heroData.imageUrl] : []}
                                        onChange={handleImageChange}
                                        maxFiles={1}
                                    />
                                    <div className="mt-2">
                                        <label htmlFor="imagePosition" className="block text-sm font-medium text-gray-700 mb-1">
                                            Vị trí trọng tâm ảnh
                                        </label>
                                        <select
                                            id="imagePosition"
                                            name="imagePosition"
                                            value={heroData.imagePosition}
                                            onChange={handleHeroChange}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-burgundy-500 focus:ring-burgundy-500 sm:text-sm border p-2"
                                        >
                                            <option value="top">Trên cùng (Top)</option>
                                            <option value="center">Giữa (Center)</option>
                                            <option value="bottom">Dưới cùng (Bottom)</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="ctaText" className="block text-sm font-medium text-gray-700">
                                            Nút CTA Text
                                        </label>
                                        <input
                                            type="text"
                                            name="ctaText"
                                            id="ctaText"
                                            value={heroData.ctaText}
                                            onChange={handleHeroChange}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-burgundy-500 focus:ring-burgundy-500 sm:text-sm border p-2"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="ctaLink" className="block text-sm font-medium text-gray-700">
                                            Nút CTA Link
                                        </label>
                                        <input
                                            type="text"
                                            name="ctaLink"
                                            id="ctaLink"
                                            value={heroData.ctaLink}
                                            onChange={handleHeroChange}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-burgundy-500 focus:ring-burgundy-500 sm:text-sm border p-2"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Hero Preview */}
                        <div className="flex flex-col">
                            <h2 className="text-lg font-medium text-gray-900 mb-4">Live Preview</h2>
                            <div className="flex-1 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden bg-gray-50 relative">
                                <div className="absolute inset-0 overflow-y-auto">
                                    <div className="transform scale-100 origin-top-left w-full">
                                        <FullHomePreview
                                            heroData={heroData}
                                            collections={featuredCollectionIds
                                                .map(id => allCollections.find(c => c.id === id))
                                                .filter((c): c is Collection => c !== undefined)
                                            }
                                            products={featuredProductIds
                                                .map(id => allProducts.find(p => p.id === id))
                                                .filter((p): p is Product => p !== undefined)
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "collections" && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Collections Editor */}
                        <div className="bg-white shadow rounded-lg p-6 overflow-y-auto">
                            <h2 className="text-lg font-medium text-gray-900 mb-4">
                                Chọn Bộ Sưu Tập Hiển Thị trên Trang Chủ
                            </h2>
                            <p className="text-sm text-gray-600 mb-6">
                                Chọn các bộ sưu tập bạn muốn hiển thị. Kéo thả để sắp xếp thứ tự.
                            </p>

                            <div className="space-y-3">
                                {/* Selected Collections (can reorder) */}
                                {featuredCollectionIds.length > 0 && (
                                    <div className="mb-6">
                                        <h3 className="text-sm font-medium text-gray-900 mb-3">
                                            Đã chọn ({featuredCollectionIds.length})
                                        </h3>
                                        <div className="space-y-2">
                                            {featuredCollectionIds.map((id, index) => {
                                                const collection = allCollections.find(c => c.id === id);
                                                if (!collection) return null;

                                                return (
                                                    <div
                                                        key={id}
                                                        className="flex items-center gap-3 p-3 bg-burgundy-50 border border-burgundy-200 rounded-lg"
                                                    >
                                                        <div className="flex gap-2">
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    if (index > 0) {
                                                                        setFeaturedCollectionIds(moveItem(featuredCollectionIds, index, index - 1));
                                                                    }
                                                                }}
                                                                disabled={index === 0}
                                                                className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                                                            >
                                                                ↑
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    if (index < featuredCollectionIds.length - 1) {
                                                                        setFeaturedCollectionIds(moveItem(featuredCollectionIds, index, index + 1));
                                                                    }
                                                                }}
                                                                disabled={index === featuredCollectionIds.length - 1}
                                                                className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                                                            >
                                                                ↓
                                                            </button>
                                                        </div>
                                                        <span className="text-sm font-medium text-burgundy-900 mr-2">#{index + 1}</span>
                                                        <img
                                                            src={collection.thumbnailUrl}
                                                            alt={collection.name}
                                                            className="w-12 h-12 object-cover rounded"
                                                        />
                                                        <div className="flex-1">
                                                            <p className="font-medium text-gray-900">{collection.name}</p>
                                                            <p className="text-sm text-gray-500 line-clamp-1">{collection.description}</p>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => toggleCollection(id)}
                                                            className="text-red-600 hover:text-red-800 px-3 py-1 text-sm"
                                                        >
                                                            Xóa
                                                        </button>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Available Collections */}
                                <h3 className="text-sm font-medium text-gray-900 mb-3">Bộ sưu tập có sẵn</h3>
                                {allCollections.filter(c => !featuredCollectionIds.includes(c.id)).map((collection) => (
                                    <div
                                        key={collection.id}
                                        className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                                    >
                                        <img
                                            src={collection.thumbnailUrl}
                                            alt={collection.name}
                                            className="w-12 h-12 object-cover rounded"
                                        />
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900">{collection.name}</p>
                                            <p className="text-sm text-gray-500 line-clamp-1">{collection.description}</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => toggleCollection(collection.id)}
                                            className="bg-burgundy-800 text-white px-4 py-2 rounded hover:bg-burgundy-900 text-sm"
                                        >
                                            Thêm
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Collections Preview */}
                        <div className="flex flex-col">
                            <h2 className="text-lg font-medium text-gray-900 mb-4">Live Preview</h2>
                            <div className="flex-1 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden bg-gray-50 relative">
                                <div className="absolute inset-0 overflow-y-auto">
                                    <div className="transform scale-100 origin-top-left w-full">
                                        <FullHomePreview
                                            heroData={heroData}
                                            collections={featuredCollectionIds
                                                .map(id => allCollections.find(c => c.id === id))
                                                .filter((c): c is Collection => c !== undefined)
                                            }
                                            products={featuredProductIds
                                                .map(id => allProducts.find(p => p.id === id))
                                                .filter((p): p is Product => p !== undefined)
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "products" && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Products Editor */}
                        <div className="bg-white shadow rounded-lg p-6 overflow-y-auto">
                            <h2 className="text-lg font-medium text-gray-900 mb-4">
                                Chọn Sản Phẩm Hiển Thị trên Trang Chủ
                            </h2>
                            <p className="text-sm text-gray-600 mb-6">
                                Chọn 3 sản phẩm bạn muốn hiển thị. Kéo thả để sắp xếp thứ tự.
                            </p>

                            <div className="space-y-3">
                                {/* Selected Products */}
                                {featuredProductIds.length > 0 && (
                                    <div className="mb-6">
                                        <h3 className="text-sm font-medium text-gray-900 mb-3">
                                            Đã chọn ({featuredProductIds.length}/3)
                                        </h3>
                                        <div className="space-y-2">
                                            {featuredProductIds.map((id, index) => {
                                                const product = allProducts.find(p => p.id === id);
                                                if (!product) return null;

                                                return (
                                                    <div
                                                        key={id}
                                                        className="flex items-center gap-3 p-3 bg-burgundy-50 border border-burgundy-200 rounded-lg"
                                                    >
                                                        <div className="flex gap-2">
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    if (index > 0) {
                                                                        setFeaturedProductIds(moveItem(featuredProductIds, index, index - 1));
                                                                    }
                                                                }}
                                                                disabled={index === 0}
                                                                className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                                                            >
                                                                ↑
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    if (index < featuredProductIds.length - 1) {
                                                                        setFeaturedProductIds(moveItem(featuredProductIds, index, index + 1));
                                                                    }
                                                                }}
                                                                disabled={index === featuredProductIds.length - 1}
                                                                className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                                                            >
                                                                ↓
                                                            </button>
                                                        </div>
                                                        <span className="text-sm font-medium text-burgundy-900 mr-2">#{index + 1}</span>
                                                        <img
                                                            src={product.images[0]}
                                                            alt={product.name}
                                                            className="w-12 h-12 object-cover rounded"
                                                        />
                                                        <div className="flex-1">
                                                            <p className="font-medium text-gray-900">{product.name}</p>
                                                            <p className="text-sm text-gray-500">
                                                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                                                            </p>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => toggleProduct(id)}
                                                            className="text-red-600 hover:text-red-800 px-3 py-1 text-sm"
                                                        >
                                                            Xóa
                                                        </button>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Available Products */}
                                <h3 className="text-sm font-medium text-gray-900 mb-3">Sản phẩm có sẵn</h3>
                                {allProducts.filter(p => !featuredProductIds.includes(p.id)).map((product) => (
                                    <div
                                        key={product.id}
                                        className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                                    >
                                        <img
                                            src={product.images[0]}
                                            alt={product.name}
                                            className="w-12 h-12 object-cover rounded"
                                        />
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900">{product.name}</p>
                                            <p className="text-sm text-gray-500">
                                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => toggleProduct(product.id)}
                                            disabled={featuredProductIds.length >= 3}
                                            className="bg-burgundy-800 text-white px-4 py-2 rounded hover:bg-burgundy-900 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Thêm
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Products Preview */}
                        <div className="flex flex-col">
                            <h2 className="text-lg font-medium text-gray-900 mb-4">Live Preview</h2>
                            <div className="flex-1 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden bg-gray-50 relative">
                                <div className="absolute inset-0 overflow-y-auto">
                                    <div className="transform scale-100 origin-top-left w-full">
                                        <FullHomePreview
                                            heroData={heroData}
                                            collections={featuredCollectionIds
                                                .map(id => allCollections.find(c => c.id === id))
                                                .filter((c): c is Collection => c !== undefined)
                                            }
                                            products={featuredProductIds
                                                .map(id => allProducts.find(p => p.id === id))
                                                .filter((p): p is Product => p !== undefined)
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
