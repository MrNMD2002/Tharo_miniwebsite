"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash, X, Search, Eye, EyeOff } from "lucide-react";
import { Collection, Product } from "@/types";
import { Toast } from "@/components/ui/toast-custom";
import { MediaUploader } from "@/components/admin/media-uploader";
import { CollectionPreview } from "@/components/admin/collection-preview";
import Image from "next/image";

export default function CollectionsAdminPage() {
    const [collections, setCollections] = React.useState<Collection[]>([]);
    const [products, setProducts] = React.useState<Product[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [toast, setToast] = React.useState({ isVisible: false, message: "", type: "success" as "success" | "error" });
    
    // Search & Filter states
    const [searchTerm, setSearchTerm] = React.useState("");
    const [statusFilter, setStatusFilter] = React.useState<"all" | "active" | "inactive">("all");
    
    // Modal states
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [editingCollection, setEditingCollection] = React.useState<Collection | null>(null);
    const [isSaving, setIsSaving] = React.useState(false);
    const [duplicateWarning, setDuplicateWarning] = React.useState<string>("");
    
    // Form state - Extended with new fields
    const [formData, setFormData] = React.useState({
        name: "",
        slug: "",
        description: "",
        story: "",
        thumbnailUrl: "",
        messengerLink: "https://m.me/100089059418106",
        productIds: [] as string[],
        status: "active" as "active" | "inactive",
        tags: [] as string[],
    });
    
    const [thumbnailImages, setThumbnailImages] = React.useState<string[]>([]);
    const [coverImages, setCoverImages] = React.useState<string[]>([]);
    const [galleryImages, setGalleryImages] = React.useState<string[]>([]);
    const [tagInput, setTagInput] = React.useState("");

    const fetchCollections = async () => {
        try {
            const response = await fetch("/api/collections");
            if (response.ok) {
                const data = await response.json();
                setCollections(data);
            }
        } catch (error) {
            console.error("Failed to fetch collections:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await fetch("/api/products");
            if (response.ok) {
                const data = await response.json();
                setProducts(data);
            }
        } catch (error) {
            console.error("Failed to fetch products:", error);
        }
    };

    React.useEffect(() => {
        fetchCollections();
        fetchProducts();
    }, []);

    const handleOpenModal = (collection?: Collection) => {
        setDuplicateWarning(""); // Reset duplicate warning
        setTagInput(""); // Reset tag input
        if (collection) {
            setEditingCollection(collection);
            setFormData({
                name: collection.name,
                slug: collection.slug,
                description: collection.description || "",
                story: collection.story || "",
                thumbnailUrl: collection.thumbnailUrl,
                messengerLink: collection.messengerLink || "https://m.me/tharo.aodai",
                productIds: collection.productIds || [],
                status: collection.status,
                tags: collection.tags || [],
            });
            setThumbnailImages([collection.thumbnailUrl]);
            setCoverImages(collection.coverImages || []);
            setGalleryImages(collection.galleryImages || []);
        } else {
            setEditingCollection(null);
            setFormData({
                name: "",
                slug: "",
                description: "",
                story: "",
                thumbnailUrl: "",
                messengerLink: "https://m.me/100089059418106",
                productIds: [],
                status: "active",
                tags: [],
            });
            setThumbnailImages([]);
            setCoverImages([]);
            setGalleryImages([]);
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingCollection(null);
        setDuplicateWarning(""); // Reset duplicate warning
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        
        if (name === "name") {
            // Auto-generate slug from name
            const slug = value
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/đ/g, "d")
                .replace(/[^a-z0-9\s-]/g, "")
                .trim()
                .replace(/\s+/g, "-");
            
            // Check for duplicate collection name (exclude current editing collection)
            const trimmedValue = value.trim().toLowerCase();
            const duplicate = collections.find(
                (c) => c.name.trim().toLowerCase() === trimmedValue && 
                       c.id !== editingCollection?.id // Exclude current editing collection
            );
            
            if (duplicate && trimmedValue) {
                setDuplicateWarning(`⚠️ Bộ sưu tập "${duplicate.name}" đã tồn tại! Vui lòng chọn tên khác.`);
            } else {
                setDuplicateWarning("");
            }
            
            setFormData((prev) => ({ ...prev, name: value, slug }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleThumbnailChange = (urls: string[]) => {
        setThumbnailImages(urls);
        if (urls.length > 0) {
            setFormData((prev) => ({ ...prev, thumbnailUrl: urls[0] }));
        } else {
            setFormData((prev) => ({ ...prev, thumbnailUrl: "" }));
        }
    };

    const handleProductToggle = (productId: string) => {
        setFormData((prev) => {
            const isSelected = prev.productIds.includes(productId);
            return {
                ...prev,
                productIds: isSelected
                    ? prev.productIds.filter((id) => id !== productId)
                    : [...prev.productIds, productId],
            };
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Check for duplicate name
        if (duplicateWarning) {
            setToast({
                isVisible: true,
                message: "Không thể lưu! Tên bộ sưu tập đã tồn tại.",
                type: "error",
            });
            return;
        }
        
        // Validation
        if (!formData.thumbnailUrl || thumbnailImages.length === 0) {
            setToast({
                isVisible: true,
                message: "Vui lòng upload ảnh thumbnail!",
                type: "error",
            });
            return;
        }
        
        setIsSaving(true);

        try {
            const now = new Date().toISOString();
            const payload = {
                ...formData,
                coverImages,
                galleryImages,
                createdAt: editingCollection?.createdAt || now,
                updatedAt: now,
            };

            const url = editingCollection
                ? `/api/collections/${editingCollection.id}`
                : "/api/collections";
            
            const method = editingCollection ? "PUT" : "POST";
            
            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!response.ok) throw new Error("Failed to save collection");

            setToast({
                isVisible: true,
                message: editingCollection ? "Đã cập nhật bộ sưu tập!" : "Đã thêm bộ sưu tập mới!",
                type: "success",
            });
            
            handleCloseModal();
            fetchCollections();
        } catch (error) {
            console.error("Error saving collection:", error);
            setToast({
                isVisible: true,
                message: "Có lỗi xảy ra khi lưu",
                type: "error",
            });
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!window.confirm(`Bạn có chắc muốn xóa "${name}"?`)) return;

        try {
            const response = await fetch(`/api/collections/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) throw new Error("Failed to delete");

            setToast({
                isVisible: true,
                message: "Đã xóa bộ sưu tập!",
                type: "success",
            });
            
            fetchCollections();
        } catch (error) {
            console.error("Error deleting collection:", error);
            setToast({
                isVisible: true,
                message: "Có lỗi xảy ra khi xóa",
                type: "error",
            });
        }
    };

    const toggleStatus = async (collection: Collection) => {
        try {
            const newStatus = collection.status === "active" ? "inactive" : "active";
            const response = await fetch(`/api/collections/${collection.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...collection,
                    status: newStatus,
                    updatedAt: new Date().toISOString(),
                }),
            });

            if (!response.ok) throw new Error("Failed to update status");

            setToast({
                isVisible: true,
                message: `Đã ${newStatus === "active" ? "kích hoạt" : "vô hiệu hóa"} bộ sưu tập!`,
                type: "success",
            });
            
            fetchCollections();
        } catch (error) {
            console.error("Error updating status:", error);
            setToast({
                isVisible: true,
                message: "Có lỗi xảy ra",
                type: "error",
            });
        }
    };

    // Filter collections
    const filteredCollections = collections.filter((col) => {
        const matchesSearch = col.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "all" || col.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    // Get product count for each collection
    const getProductCount = (productIds?: string[]) => {
        if (!productIds) return 0;
        return productIds.length;
    };

    // Format timestamp
    const formatDate = (isoString?: string) => {
        if (!isoString) return "N/A";
        return new Date(isoString).toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    return (
        <div className="p-8">
            <Toast
                isVisible={toast.isVisible}
                message={toast.message}
                type={toast.type}
                onClose={() => setToast({ ...toast, isVisible: false })}
            />

            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-serif font-bold text-burgundy-900">
                    Quản lý Bộ Sưu Tập
                </h1>
                <Button onClick={() => handleOpenModal()}>
                    <Plus className="mr-2 h-4 w-4" />
                    Thêm BST
                </Button>
            </div>

            {/* Search & Filter */}
            <div className="mb-6 flex gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo tên..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-burgundy-500 focus:border-burgundy-500"
                    />
                </div>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
                    className="px-4 py-2 border border-gray-300 rounded-md focus:ring-burgundy-500 focus:border-burgundy-500"
                >
                    <option value="all">Tất cả trạng thái</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </select>
            </div>

            {isLoading ? (
                <div className="text-center py-10">
                    <p className="text-gray-500">Đang tải...</p>
                </div>
            ) : (
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <div className="inline-block min-w-full align-middle">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Bộ sưu tập
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Slug
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Số SP
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Trạng thái
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Ngày tạo
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Cập nhật
                                        </th>
                                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                            <span className="sr-only">Actions</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {filteredCollections.map((collection) => (
                                        <tr key={collection.id}>
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                                                <div className="flex items-center">
                                                    <div className="h-10 w-10 flex-shrink-0 relative">
                                                        <Image
                                                            className="h-10 w-10 rounded-full object-cover"
                                                            src={collection.thumbnailUrl}
                                                            alt={collection.name}
                                                            width={40}
                                                            height={40}
                                                        />
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="font-medium text-gray-900">{collection.name}</div>
                                                        <div className="text-gray-500 text-xs">ID: {collection.id}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                {collection.slug}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                    {getProductCount(collection.productIds)} SP
                                                </span>
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                <button
                                                    onClick={() => toggleStatus(collection)}
                                                    className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold leading-5 ${
                                                        collection.status === "active"
                                                            ? "bg-green-100 text-green-800"
                                                            : "bg-gray-100 text-gray-800"
                                                    }`}
                                                >
                                                    {collection.status === "active" ? (
                                                        <><Eye className="h-3 w-3" /> Active</>
                                                    ) : (
                                                        <><EyeOff className="h-3 w-3" /> Inactive</>
                                                    )}
                                                </button>
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                {formatDate(collection.createdAt)}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                {formatDate(collection.updatedAt)}
                                            </td>
                                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 flex gap-2 justify-end">
                                                <button
                                                    onClick={() => handleOpenModal(collection)}
                                                    className="text-burgundy-600 hover:text-burgundy-900"
                                                >
                                                    <Edit className="h-4 w-4 inline" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(collection.id, collection.name)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    <Trash className="h-4 w-4 inline" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {filteredCollections.length === 0 && !isLoading && (
                <div className="text-center py-10 text-gray-500">
                    Không tìm thấy bộ sưu tập nào.
                </div>
            )}

            {/* Modal - Create/Edit Form with Preview */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-7xl w-full h-[95vh] flex flex-col overflow-hidden">
                        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                            <h2 className="text-xl font-serif font-bold text-burgundy-900">
                                {editingCollection ? "Chỉnh sửa BST" : "Thêm BST mới"}
                            </h2>
                            <button
                                onClick={handleCloseModal}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <div className="flex flex-1 overflow-hidden">
                            {/* Form Section - Left */}
                            <form onSubmit={handleSubmit} className="flex-1 p-6 space-y-6 overflow-y-auto">
                            {/* Basic Info */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                                    Thông tin cơ bản
                                </h3>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Tên bộ sưu tập *
                                        </label>
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

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Slug (URL)
                                        </label>
                                        <input
                                            type="text"
                                            name="slug"
                                            value={formData.slug}
                                            onChange={handleChange}
                                            required
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-burgundy-500 focus:ring-burgundy-500 sm:text-sm border p-2 bg-gray-50"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Mô tả ngắn
                                    </label>
                                    <textarea
                                        name="description"
                                        rows={2}
                                        value={formData.description}
                                        onChange={handleChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-burgundy-500 focus:ring-burgundy-500 sm:text-sm border p-2"
                                        placeholder="Mô tả ngắn gọn về bộ sưu tập..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Story SEO (Câu chuyện bộ sưu tập)
                                    </label>
                                    <textarea
                                        name="story"
                                        rows={6}
                                        value={formData.story}
                                        onChange={handleChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-burgundy-500 focus:ring-burgundy-500 sm:text-sm border p-2"
                                        placeholder="Câu chuyện dài về cảm hứng, ý nghĩa, thông điệp của bộ sưu tập... Tối ưu SEO với từ khóa phù hợp."
                                    />
                                    <p className="mt-1 text-xs text-gray-500">
                                        Đoạn văn dài giải thích cảm hứng, ý nghĩa, câu chuyện thương hiệu. Tối ưu cho SEO Google.
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Trạng thái
                                    </label>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-burgundy-500 focus:ring-burgundy-500 sm:text-sm border p-2"
                                    >
                                        <option value="active">Active (hiển thị client)</option>
                                        <option value="inactive">Inactive (ẩn)</option>
                                    </select>
                                </div>

                                {/* Tags Input */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Tags (Nhãn) 🏷️
                                    </label>
                                    <div className="flex gap-2 mb-2">
                                        <input
                                            type="text"
                                            value={tagInput}
                                            onChange={(e) => setTagInput(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    const trimmed = tagInput.trim();
                                                    if (trimmed && !formData.tags.includes(trimmed)) {
                                                        setFormData((prev) => ({
                                                            ...prev,
                                                            tags: [...prev.tags, trimmed]
                                                        }));
                                                        setTagInput("");
                                                    }
                                                }
                                            }}
                                            placeholder="Nhập tag và nhấn Enter (VD: Xuân Hè, Limited Edition, Premium...)"
                                            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-burgundy-500 focus:ring-burgundy-500 sm:text-sm border p-2"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const trimmed = tagInput.trim();
                                                if (trimmed && !formData.tags.includes(trimmed)) {
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        tags: [...prev.tags, trimmed]
                                                    }));
                                                    setTagInput("");
                                                }
                                            }}
                                            className="px-4 py-2 bg-burgundy-600 text-white rounded-md hover:bg-burgundy-700 transition-colors text-sm font-medium"
                                        >
                                            Thêm
                                        </button>
                                    </div>
                                    {formData.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-md border border-gray-200">
                                            {formData.tags.map((tag, index) => (
                                                <span
                                                    key={index}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-burgundy-100 text-burgundy-700 rounded-full text-sm font-medium"
                                                >
                                                    {tag}
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setFormData((prev) => ({
                                                                ...prev,
                                                                tags: prev.tags.filter((_, i) => i !== index)
                                                            }));
                                                        }}
                                                        className="hover:bg-burgundy-200 rounded-full p-0.5 transition-colors"
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                    <p className="mt-1 text-xs text-gray-500">
                                        Tags giúp phân loại và hiển thị đẹp hơn trên trang bộ sưu tập. VD: "Xuân Hè", "Limited Edition", "Premium", "Bestseller"...
                                    </p>
                                </div>
                            </div>

                            {/* Media Section */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                                    Ảnh & Media
                                </h3>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Thumbnail (Ảnh đại diện) *
                                    </label>
                                    <MediaUploader
                                        value={thumbnailImages}
                                        onChange={handleThumbnailChange}
                                        maxFiles={1}
                                    />
                                    <p className="mt-1 text-xs text-gray-500">1 ảnh, tối đa 2MB, JPG/PNG/WebP</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Cover Banner / Slideshow
                                    </label>
                                    <MediaUploader
                                        value={coverImages}
                                        onChange={setCoverImages}
                                        maxFiles={5}
                                    />
                                    <p className="mt-1 text-xs text-gray-500">
                                        1-5 ảnh cho banner/slideshow trang detail. Tối đa 2MB/ảnh, JPG/PNG/WebP
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Gallery Images
                                    </label>
                                    <MediaUploader
                                        value={galleryImages}
                                        onChange={setGalleryImages}
                                        maxFiles={5}
                                    />
                                    <p className="mt-1 text-xs text-gray-500">
                                        Tối đa 5 ảnh gallery. Tối đa 2MB/ảnh, JPG/PNG/WebP
                                    </p>
                                </div>
                            </div>

                            {/* Product Assignment */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                                    Gán Sản Phẩm ({formData.productIds.length} sản phẩm)
                                </h3>
                                
                                <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-md">
                                    {products.length === 0 ? (
                                        <p className="p-4 text-sm text-gray-500">Chưa có sản phẩm nào.</p>
                                    ) : (
                                        <div className="divide-y divide-gray-200">
                                            {products.map((product) => (
                                                <label
                                                    key={product.id}
                                                    className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.productIds.includes(product.id)}
                                                        onChange={() => handleProductToggle(product.id)}
                                                        className="h-4 w-4 text-burgundy-600 focus:ring-burgundy-500 border-gray-300 rounded"
                                                    />
                                                    <div className="relative h-12 w-12 flex-shrink-0">
                                                        <Image
                                                            src={product.images[0]}
                                                            alt={product.name}
                                                            fill
                                                            className="object-cover rounded"
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-sm font-medium text-gray-900">{product.name}</p>
                                                        <p className="text-xs text-gray-500">
                                                            {new Intl.NumberFormat("vi-VN", {
                                                                style: "currency",
                                                                currency: "VND",
                                                            }).format(product.price)}
                                                        </p>
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Messenger Link CTA */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                                    Liên hệ & CTA
                                </h3>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Link Messenger Page
                                    </label>
                                    <input
                                        type="url"
                                        name="messengerLink"
                                        value={formData.messengerLink}
                                        onChange={handleChange}
                                        placeholder="https://m.me/100089059418106"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-burgundy-500 focus:ring-burgundy-500 sm:text-sm border p-2"
                                    />
                                    <p className="mt-1 text-xs text-gray-500">
                                        Khi khách click "Liên hệ", Messenger sẽ mở với text: 
                                        <span className="italic">
                                            {` "Tôi muốn xem sản phẩm thuộc bộ sưu tập ${formData.name || "[Tên BST]"}"`}
                                        </span>
                                    </p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-end gap-3 pt-4 border-t sticky bottom-0 bg-white">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleCloseModal}
                                    disabled={isSaving}
                                >
                                    Hủy
                                </Button>
                                <Button type="submit" disabled={isSaving}>
                                    {isSaving ? "Đang lưu..." : editingCollection ? "Cập nhật" : "Tạo mới"}
                                </Button>
                            </div>
                        </form>

                        {/* Preview Section - Right */}
                        <div className="flex-1 overflow-hidden">
                            <CollectionPreview
                                formData={formData}
                                thumbnailUrl={thumbnailImages[0] || ""}
                                coverImages={coverImages}
                                galleryImages={galleryImages}
                                selectedProducts={products.filter((p) => formData.productIds.includes(p.id))}
                            />
                        </div>
                    </div>
                    </div>
                </div>
            )}
        </div>
    );
}
