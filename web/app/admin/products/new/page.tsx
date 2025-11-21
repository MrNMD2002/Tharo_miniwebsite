"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { MediaUploader } from "@/components/admin/media-uploader";
import { Toast } from "@/components/ui/toast-custom";
import { Collection } from "@/types";

export default function NewProductPage() {
    const router = useRouter();
    const [isSaving, setIsSaving] = React.useState(false);
    const [toast, setToast] = React.useState({ isVisible: false, message: "", type: "success" as "success" | "error" });
    const [collections, setCollections] = React.useState<Collection[]>([]);
    const [existingProducts, setExistingProducts] = React.useState<any[]>([]);
    const [duplicateWarning, setDuplicateWarning] = React.useState<string>("");

    const [formData, setFormData] = React.useState({
        name: "",
        price: 0,
        originalPrice: 0,
        description: "",
        images: [] as string[],
        videoUrl: "",
        shopeeLink: "",
        tiktokLink: "",
        zaloLink: "",
        material: "",
        slug: "",
        status: "in-stock",
        isActive: true, // Default: hiện sản phẩm
        collectionId: "", // Empty = Không thuộc BST nào
        primaryColor: "",
        colors: [] as string[],
        sizes: [] as string[],
        sortOrder: 999,
        createdAt: new Date().toISOString(),
    });

    // Temporary input states for arrays
    const [colorInput, setColorInput] = React.useState("");
    const [sizeInput, setSizeInput] = React.useState("");

    // Fetch collections and existing products for duplicate check
    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const [collectionsRes, productsRes] = await Promise.all([
                    fetch("/api/collections"),
                    fetch("/api/products")
                ]);
                
                if (collectionsRes.ok) {
                    const data = await collectionsRes.json();
                    setCollections(data.filter((c: Collection) => c.status === "active"));
                }
                
                if (productsRes.ok) {
                    const data = await productsRes.json();
                    setExistingProducts(data);
                }
            } catch (error) {
                console.error("Failed to fetch data:", error);
            }
        };
        fetchData();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        if (name === "price" || name === "originalPrice" || name === "sortOrder") {
            const numericValue = Number(value.replace(/\D/g, ""));
            setFormData((prev) => ({ ...prev, [name]: numericValue }));
        } else if (name === "name") {
            const slug = value
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/đ/g, "d")
                .replace(/[^a-z0-9\s-]/g, "")
                .trim()
                .replace(/\s+/g, "-");
            
            // Check for duplicate product name
            const trimmedValue = value.trim().toLowerCase();
            const duplicate = existingProducts.find(
                (p) => p.name.trim().toLowerCase() === trimmedValue
            );
            
            if (duplicate && trimmedValue) {
                setDuplicateWarning(`⚠️ Sản phẩm "${duplicate.name}" đã tồn tại! Vui lòng chọn tên khác.`);
            } else {
                setDuplicateWarning("");
            }
            
            setFormData((prev) => ({ ...prev, name: value, slug }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleImagesChange = (urls: string[]) => {
        setFormData((prev) => ({ ...prev, images: urls.slice(0, 5) })); // Max 5 images
    };

    const addColor = () => {
        if (colorInput.trim()) {
            setFormData((prev) => ({
                ...prev,
                colors: [...prev.colors, colorInput.trim()],
            }));
            setColorInput("");
        }
    };

    const removeColor = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            colors: prev.colors.filter((_, i) => i !== index),
        }));
    };

    const addSize = () => {
        if (sizeInput.trim()) {
            setFormData((prev) => ({
                ...prev,
                sizes: [...prev.sizes, sizeInput.trim()],
            }));
            setSizeInput("");
        }
    };

    const removeSize = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            sizes: prev.sizes.filter((_, i) => i !== index),
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Check for duplicate name
        if (duplicateWarning) {
            setToast({ isVisible: true, message: "Không thể lưu! Tên sản phẩm đã tồn tại.", type: "error" });
            return;
        }
        
        setIsSaving(true);
        try {
            const response = await fetch("/api/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error("Failed to create product");

            setToast({ isVisible: true, message: "Đã thêm sản phẩm mới!", type: "success" });
            setTimeout(() => router.push("/admin/products"), 1500);
        } catch (error) {
            console.error("Error creating product:", error);
            setToast({ isVisible: true, message: "Có lỗi xảy ra khi thêm sản phẩm", type: "error" });
        } finally {
            setIsSaving(false);
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("vi-VN").format(price);
    };

    return (
        <div className="max-w-4xl mx-auto">
            <Toast
                isVisible={toast.isVisible}
                message={toast.message}
                type={toast.type}
                onClose={() => setToast((prev) => ({ ...prev, isVisible: false }))}
            />
            <h1 className="text-2xl font-serif font-bold text-burgundy-900 mb-6">Thêm sản phẩm mới</h1>

            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 shadow rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Tên sản phẩm */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Tên sản phẩm *</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className={`mt-1 block w-full rounded-md shadow-sm focus:border-burgundy-500 focus:ring-burgundy-500 sm:text-sm border p-2 ${
                                duplicateWarning ? "border-red-500 bg-red-50" : "border-gray-300"
                            }`}
                        />
                        {duplicateWarning && (
                            <div className="mt-2 flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
                                <svg className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-red-800">Tên bị trùng!</p>
                                    <p className="text-sm text-red-700 mt-1">{duplicateWarning}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Slug */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Slug (URL)</label>
                        <input
                            type="text"
                            name="slug"
                            value={formData.slug}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-burgundy-500 focus:ring-burgundy-500 sm:text-sm border p-2 bg-gray-50"
                        />
                    </div>

                    {/* Giá */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Giá bán (VND) *</label>
                        <input
                            type="text"
                            name="price"
                            value={formatPrice(formData.price)}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-burgundy-500 focus:ring-burgundy-500 sm:text-sm border p-2"
                        />
                    </div>

                    {/* Giá gốc */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Giá gốc (VND)</label>
                        <input
                            type="text"
                            name="originalPrice"
                            value={formatPrice(formData.originalPrice)}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-burgundy-500 focus:ring-burgundy-500 sm:text-sm border p-2"
                        />
                        <p className="mt-1 text-xs text-gray-500">Để hiển thị giá sale</p>
                    </div>

                    {/* Bộ sưu tập */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Bộ sưu tập</label>
                        <select
                            name="collectionId"
                            value={formData.collectionId}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-burgundy-500 focus:ring-burgundy-500 sm:text-sm border p-2"
                        >
                            <option value="">Không thuộc BST nào</option>
                            {collections.map((collection) => (
                                <option key={collection.id} value={collection.id}>
                                    {collection.name}
                                </option>
                            ))}
                        </select>
                        <p className="mt-1 text-xs text-gray-500">
                            Chọn "Không thuộc BST nào" nếu sản phẩm là standalone
                        </p>
                    </div>

                    {/* Thứ tự sắp xếp */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Thứ tự hiển thị</label>
                        <input
                            type="number"
                            name="sortOrder"
                            value={formData.sortOrder}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-burgundy-500 focus:ring-burgundy-500 sm:text-sm border p-2"
                        />
                        <p className="mt-1 text-xs text-gray-500">Số nhỏ hơn hiển thị trước</p>
                    </div>

                    {/* Chất liệu */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Chất liệu</label>
                        <input
                            type="text"
                            name="material"
                            value={formData.material}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-burgundy-500 focus:ring-burgundy-500 sm:text-sm border p-2"
                        />
                    </div>

                    {/* Màu chủ đạo */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Màu chủ đạo</label>
                        <input
                            type="text"
                            name="primaryColor"
                            value={formData.primaryColor}
                            onChange={handleChange}
                            placeholder="Ví dụ: Hồng phấn"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-burgundy-500 focus:ring-burgundy-500 sm:text-sm border p-2"
                        />
                        <p className="mt-1 text-xs text-gray-500">Hiển thị trên product card</p>
                    </div>

                    {/* Trạng thái */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Trạng thái</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-burgundy-500 focus:ring-burgundy-500 sm:text-sm border p-2"
                        >
                            <option value="in-stock">Còn hàng</option>
                            <option value="new">Mới</option>
                            <option value="pre-order">Pre-order</option>
                            <option value="limited">Giới hạn</option>
                        </select>
                    </div>

                    {/* Hiển thị trên site */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Hiển thị trên site</label>
                        <label className="inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.isActive}
                                onChange={(e) => setFormData((prev) => ({ ...prev, isActive: e.target.checked }))}
                                className="sr-only peer"
                            />
                            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-burgundy-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                            <span className="ms-3 text-sm font-medium text-gray-700">
                                {formData.isActive ? "Hiện" : "Ẩn"}
                            </span>
                        </label>
                        <p className="mt-1 text-xs text-gray-500">
                            {formData.isActive ? "Sản phẩm sẽ hiển thị trên trang chủ và trang sản phẩm" : "Sản phẩm sẽ bị ẩn trên site (chỉ admin thấy)"}
                        </p>
                    </div>
                </div>

                {/* Mô tả */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Mô tả</label>
                    <textarea
                        name="description"
                        rows={4}
                        value={formData.description}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-burgundy-500 focus:ring-burgundy-500 sm:text-sm border p-2"
                    />
                </div>

                {/* Màu sắc có sẵn */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Màu sắc có sẵn</label>
                    <div className="flex gap-2 mb-2">
                        <input
                            type="text"
                            value={colorInput}
                            onChange={(e) => setColorInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addColor())}
                            placeholder="Nhập màu và nhấn Enter"
                            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-burgundy-500 focus:ring-burgundy-500 sm:text-sm border p-2"
                        />
                        <Button type="button" onClick={addColor}>Thêm</Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {formData.colors.map((color, index) => (
                            <span
                                key={index}
                                className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-burgundy-50 text-burgundy-700"
                            >
                                {color}
                                <button
                                    type="button"
                                    onClick={() => removeColor(index)}
                                    className="hover:text-burgundy-900"
                                >
                                    ×
                                </button>
                            </span>
                        ))}
                    </div>
                </div>

                {/* Size có sẵn */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Size có sẵn</label>
                    <div className="flex gap-2 mb-2">
                        <input
                            type="text"
                            value={sizeInput}
                            onChange={(e) => setSizeInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSize())}
                            placeholder="Nhập size và nhấn Enter (S, M, L...)"
                            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-burgundy-500 focus:ring-burgundy-500 sm:text-sm border p-2"
                        />
                        <Button type="button" onClick={addSize}>Thêm</Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {formData.sizes.map((size, index) => (
                            <span
                                key={index}
                                className="inline-flex items-center gap-1 px-3 py-1 rounded-md text-sm bg-burgundy-50 text-burgundy-700 border border-burgundy-200"
                            >
                                {size}
                                <button
                                    type="button"
                                    onClick={() => removeSize(index)}
                                    className="hover:text-burgundy-900"
                                >
                                    ×
                                </button>
                            </span>
                        ))}
                    </div>
                </div>

                {/* Hình ảnh */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Hình ảnh sản phẩm (Max 5 ảnh)</label>
                    <MediaUploader
                        value={formData.images}
                        onChange={handleImagesChange}
                        maxFiles={5}
                    />
                </div>

                {/* Video URL */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Link Video (1 video)</label>
                    <input
                        type="text"
                        name="videoUrl"
                        value={formData.videoUrl}
                        onChange={handleChange}
                        placeholder="https://..."
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-burgundy-500 focus:ring-burgundy-500 sm:text-sm border p-2"
                    />
                    <p className="mt-1 text-xs text-gray-500">Link video từ server hoặc CDN</p>
                </div>

                {/* Links */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Link Shopee</label>
                        <input
                            type="text"
                            name="shopeeLink"
                            value={formData.shopeeLink}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-burgundy-500 focus:ring-burgundy-500 sm:text-sm border p-2"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Link TikTok</label>
                        <input
                            type="text"
                            name="tiktokLink"
                            value={formData.tiktokLink}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-burgundy-500 focus:ring-burgundy-500 sm:text-sm border p-2"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Link Zalo</label>
                        <input
                            type="text"
                            name="zaloLink"
                            value={formData.zaloLink}
                            onChange={handleChange}
                            placeholder="https://zalo.me/..."
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-burgundy-500 focus:ring-burgundy-500 sm:text-sm border p-2"
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-4 pt-6 border-t">
                    <Button type="button" variant="outline" onClick={() => router.back()}>
                        Hủy
                    </Button>
                    <Button type="submit" disabled={isSaving} className="bg-burgundy-800 hover:bg-burgundy-900 text-white">
                        {isSaving ? "Đang lưu..." : "Lưu sản phẩm"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
