"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { Product } from "@/types";
import { Toast } from "@/components/ui/toast-custom";

export default function ProductsPage() {
    const [products, setProducts] = React.useState<Product[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [toast, setToast] = React.useState({ isVisible: false, message: "", type: "success" as "success" | "error" });
    const [filter, setFilter] = React.useState<"all" | "active" | "inactive">("all");

    const fetchProducts = async () => {
        try {
            const response = await fetch("/api/products");
            if (response.ok) {
                const data = await response.json();
                setProducts(data);
            }
        } catch (error) {
            console.error("Failed to fetch products:", error);
        } finally {
            setIsLoading(false);
        }
    };

    React.useEffect(() => {
        fetchProducts();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) return;

        try {
            const response = await fetch(`/api/products/${id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                setToast({ isVisible: true, message: "Đã xóa sản phẩm thành công", type: "success" });
                fetchProducts(); // Refresh list
            } else {
                throw new Error("Failed to delete");
            }
        } catch (error) {
            console.error("Error deleting product:", error);
            setToast({ isVisible: true, message: "Có lỗi xảy ra khi xóa", type: "error" });
        }
    };

    const handleToggleActive = async (product: Product) => {
        const newIsActive = product.isActive === false ? true : false;
        
        try {
            const response = await fetch(`/api/products/${product.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...product, isActive: newIsActive }),
            });

            if (response.ok) {
                setToast({ 
                    isVisible: true, 
                    message: newIsActive ? "Đã hiện sản phẩm trên site" : "Đã ẩn sản phẩm khỏi site", 
                    type: "success" 
                });
                fetchProducts(); // Refresh list
            } else {
                throw new Error("Failed to toggle");
            }
        } catch (error) {
            console.error("Error toggling product:", error);
            setToast({ isVisible: true, message: "Có lỗi xảy ra", type: "error" });
        }
    };

    // Filter products based on selected filter
    const filteredProducts = React.useMemo(() => {
        if (filter === "all") return products;
        if (filter === "active") return products.filter(p => p.isActive !== false);
        if (filter === "inactive") return products.filter(p => p.isActive === false);
        return products;
    }, [products, filter]);

    if (isLoading) return <div className="p-6">Đang tải dữ liệu...</div>;

    return (
        <div>
            <Toast
                isVisible={toast.isVisible}
                message={toast.message}
                type={toast.type}
                onClose={() => setToast((prev) => ({ ...prev, isVisible: false }))}
            />
            <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl font-serif font-bold text-burgundy-900">Quản lý Sản phẩm</h1>
                    <Button asChild className="bg-burgundy-800 hover:bg-burgundy-900 text-white">
                        <Link href="/admin/products/new">
                            <Plus className="mr-2 h-4 w-4" />
                            Thêm sản phẩm
                        </Link>
                    </Button>
                </div>
                
                {/* Filter Dropdown */}
                <div className="flex items-center gap-4">
                    <label className="text-sm font-medium text-gray-700">Lọc theo:</label>
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value as "all" | "active" | "inactive")}
                        className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                    >
                        <option value="all">Tất cả ({products.length})</option>
                        <option value="active">Đang hiển thị ({products.filter(p => p.isActive !== false).length})</option>
                        <option value="inactive">Đã ẩn ({products.filter(p => p.isActive === false).length})</option>
                    </select>
                </div>
            </div>

            <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Sản phẩm
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Giá
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Trạng thái
                            </th>
                            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Hiển thị
                            </th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Hành động
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredProducts.map((product) => (
                            <tr key={product.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="h-10 w-10 flex-shrink-0">
                                            <img className="h-10 w-10 rounded-full object-cover" src={product.images[0]} alt="" />
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                            <div className="text-sm text-gray-500">{product.collectionId}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                        {product.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                    <button
                                        onClick={() => handleToggleActive(product)}
                                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                                            product.isActive !== false
                                                ? "bg-green-100 text-green-800 hover:bg-green-200"
                                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                        }`}
                                        title={product.isActive !== false ? "Click để ẩn sản phẩm" : "Click để hiện sản phẩm"}
                                    >
                                        {product.isActive !== false ? (
                                            <>
                                                <Eye className="h-3.5 w-3.5" />
                                                <span>Hiện</span>
                                            </>
                                        ) : (
                                            <>
                                                <EyeOff className="h-3.5 w-3.5" />
                                                <span>Ẩn</span>
                                            </>
                                        )}
                                    </button>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <Link href={`/admin/products/${product.id}`} className="text-indigo-600 hover:text-indigo-900 mr-4 inline-block">
                                        <Pencil className="h-4 w-4" />
                                    </Link>
                                    <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-900 inline-block">
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
