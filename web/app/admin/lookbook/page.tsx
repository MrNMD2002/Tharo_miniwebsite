"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash, X, Eye, EyeOff } from "lucide-react";
import { LookbookImage } from "@/types";
import { Toast } from "@/components/ui/toast-custom";
import { MediaUploader } from "@/components/admin/media-uploader";
import Image from "next/image";

export default function LookbookAdminPage() {
    const [images, setImages] = React.useState<LookbookImage[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [toast, setToast] = React.useState({ isVisible: false, message: "", type: "success" as "success" | "error" });
    
    // Modal states
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [editingImage, setEditingImage] = React.useState<LookbookImage | null>(null);
    const [isSaving, setIsSaving] = React.useState(false);
    
    // Form state
    const [formData, setFormData] = React.useState({
        title: "",
        description: "",
        imageUrl: "",
        order: 1,
        status: "active" as "active" | "inactive",
    });
    
    const [uploadedImages, setUploadedImages] = React.useState<string[]>([]);

    const fetchImages = async () => {
        try {
            const response = await fetch("/api/lookbook");
            if (response.ok) {
                const data = await response.json();
                setImages(data);
            }
        } catch (error) {
            console.error("Failed to fetch lookbook images:", error);
        } finally {
            setIsLoading(false);
        }
    };

    React.useEffect(() => {
        fetchImages();
    }, []);

    const handleOpenModal = (image?: LookbookImage) => {
        if (image) {
            setEditingImage(image);
            setFormData({
                title: image.title || "",
                description: image.description || "",
                imageUrl: image.imageUrl,
                order: image.order,
                status: image.status,
            });
            setUploadedImages([image.imageUrl]);
        } else {
            setEditingImage(null);
            const maxOrder = images.reduce((max, img) => Math.max(max, img.order), 0);
            setFormData({
                title: "",
                description: "",
                imageUrl: "",
                order: maxOrder + 1,
                status: "active",
            });
            setUploadedImages([]);
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingImage(null);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (urls: string[]) => {
        setUploadedImages(urls);
        if (urls.length > 0) {
            setFormData((prev) => ({ ...prev, imageUrl: urls[0] }));
        } else {
            setFormData((prev) => ({ ...prev, imageUrl: "" }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validation
        if (!formData.imageUrl || uploadedImages.length === 0) {
            setToast({
                isVisible: true,
                message: "Vui lòng upload ảnh!",
                type: "error",
            });
            return;
        }
        
        setIsSaving(true);

        try {
            const now = new Date().toISOString();
            const payload = {
                ...formData,
                order: Number(formData.order),
                createdAt: editingImage?.createdAt || now,
            };

            const url = editingImage
                ? `/api/lookbook/${editingImage.id}`
                : "/api/lookbook";
            
            const method = editingImage ? "PUT" : "POST";
            
            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!response.ok) throw new Error("Failed to save image");

            setToast({
                isVisible: true,
                message: editingImage ? "Đã cập nhật ảnh!" : "Đã thêm ảnh mới!",
                type: "success",
            });
            
            handleCloseModal();
            fetchImages();
        } catch (error) {
            console.error("Error saving image:", error);
            setToast({
                isVisible: true,
                message: "Có lỗi xảy ra khi lưu",
                type: "error",
            });
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string, title: string) => {
        if (!window.confirm(`Bạn có chắc muốn xóa "${title || 'ảnh này'}"?`)) return;

        try {
            const response = await fetch(`/api/lookbook/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) throw new Error("Failed to delete");

            setToast({
                isVisible: true,
                message: "Đã xóa ảnh!",
                type: "success",
            });
            
            fetchImages();
        } catch (error) {
            console.error("Error deleting image:", error);
            setToast({
                isVisible: true,
                message: "Có lỗi xảy ra khi xóa",
                type: "error",
            });
        }
    };

    const toggleStatus = async (image: LookbookImage) => {
        try {
            const newStatus = image.status === "active" ? "inactive" : "active";
            const response = await fetch(`/api/lookbook/${image.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...image,
                    status: newStatus,
                }),
            });

            if (!response.ok) throw new Error("Failed to update status");

            setToast({
                isVisible: true,
                message: `Đã ${newStatus === "active" ? "kích hoạt" : "ẩn"} ảnh!`,
                type: "success",
            });
            
            fetchImages();
        } catch (error) {
            console.error("Error updating status:", error);
            setToast({
                isVisible: true,
                message: "Có lỗi xảy ra",
                type: "error",
            });
        }
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
                <div>
                    <h1 className="text-3xl font-serif font-bold text-burgundy-900">
                        Quản lý Lookbook
                    </h1>
                    <p className="text-gray-600 mt-1">Những khoảnh khắc đẹp nhất cùng Tharo</p>
                </div>
                <Button onClick={() => handleOpenModal()}>
                    <Plus className="mr-2 h-4 w-4" />
                    Thêm ảnh
                </Button>
            </div>

            {isLoading ? (
                <div className="text-center py-10">
                    <p className="text-gray-500">Đang tải...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {images.map((image) => (
                        <div key={image.id} className="bg-white rounded-lg shadow-md overflow-hidden group">
                            <div className="relative aspect-[3/4]">
                                <Image
                                    src={image.imageUrl}
                                    alt={image.title || "Lookbook"}
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => toggleStatus(image)}
                                        className={`p-2 rounded-full ${
                                            image.status === "active"
                                                ? "bg-green-500 hover:bg-green-600"
                                                : "bg-gray-500 hover:bg-gray-600"
                                        } text-white shadow-md`}
                                        title={image.status === "active" ? "Ẩn" : "Hiển thị"}
                                    >
                                        {image.status === "active" ? (
                                            <Eye className="h-4 w-4" />
                                        ) : (
                                            <EyeOff className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                                <div className="absolute top-2 left-2">
                                    <span className="bg-burgundy-600 text-white text-xs px-2 py-1 rounded">
                                        #{image.order}
                                    </span>
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="font-semibold text-gray-900 truncate">
                                    {image.title || "Untitled"}
                                </h3>
                                {image.description && (
                                    <p className="text-sm text-gray-500 truncate mt-1">
                                        {image.description}
                                    </p>
                                )}
                                <div className="flex gap-2 mt-4">
                                    <button
                                        onClick={() => handleOpenModal(image)}
                                        className="flex-1 px-3 py-2 bg-burgundy-600 text-white text-sm rounded hover:bg-burgundy-700 transition-colors"
                                    >
                                        <Edit className="h-3 w-3 inline mr-1" />
                                        Sửa
                                    </button>
                                    <button
                                        onClick={() => handleDelete(image.id, image.title || "")}
                                        className="px-3 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                                    >
                                        <Trash className="h-3 w-3 inline" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {images.length === 0 && !isLoading && (
                <div className="text-center py-20 bg-white rounded-lg shadow-sm">
                    <p className="text-gray-500 text-lg">Chưa có ảnh nào trong Lookbook.</p>
                    <Button onClick={() => handleOpenModal()} className="mt-4">
                        <Plus className="mr-2 h-4 w-4" />
                        Thêm ảnh đầu tiên
                    </Button>
                </div>
            )}

            {/* Modal - Create/Edit Form */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
                            <h2 className="text-xl font-serif font-bold text-burgundy-900">
                                {editingImage ? "Chỉnh sửa ảnh" : "Thêm ảnh mới"}
                            </h2>
                            <button
                                onClick={handleCloseModal}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Ảnh Lookbook *
                                </label>
                                <MediaUploader
                                    value={uploadedImages}
                                    onChange={handleImageChange}
                                    maxFiles={1}
                                />
                                <p className="mt-1 text-xs text-gray-500">1 ảnh, tối đa 2MB, JPG/PNG/WebP</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Tiêu đề (Tùy chọn)
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="Ví dụ: Áo Dài Truyền Thống"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-burgundy-500 focus:ring-burgundy-500 sm:text-sm border p-2"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Mô tả (Tùy chọn)
                                </label>
                                <textarea
                                    name="description"
                                    rows={3}
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Mô tả ngắn về ảnh này..."
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-burgundy-500 focus:ring-burgundy-500 sm:text-sm border p-2"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Thứ tự hiển thị
                                    </label>
                                    <input
                                        type="number"
                                        name="order"
                                        value={formData.order}
                                        onChange={handleChange}
                                        min="1"
                                        required
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-burgundy-500 focus:ring-burgundy-500 sm:text-sm border p-2"
                                    />
                                    <p className="mt-1 text-xs text-gray-500">Số nhỏ hơn hiển thị trước</p>
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
                                        <option value="active">Active (hiển thị)</option>
                                        <option value="inactive">Inactive (ẩn)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-4 border-t">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleCloseModal}
                                    disabled={isSaving}
                                >
                                    Hủy
                                </Button>
                                <Button type="submit" disabled={isSaving}>
                                    {isSaving ? "Đang lưu..." : editingImage ? "Cập nhật" : "Thêm mới"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

