"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { TopProductsResponse } from "@/types";
import Link from "next/link";
import Image from "next/image";
import { TrendingUp, Eye, Award, Medal, Trophy, Crown } from "lucide-react";

interface TopProductsProps {
    dateRange: string;
}

export function TopProducts({ dateRange }: TopProductsProps) {
    const { data, isLoading } = useQuery<TopProductsResponse>({
        queryKey: ["analytics", "top-products", dateRange],
        queryFn: async () => {
            const response = await fetch(`/api/analytics/top-products?range=${dateRange}&limit=10`);
            if (!response.ok) throw new Error("Failed to fetch top products");
            return response.json();
        },
        refetchInterval: 30000, // Refresh every 30 seconds
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-burgundy-900"></div>
            </div>
        );
    }

    if (!data || data.topProducts.length === 0) {
        return (
            <div className="text-center py-12 text-gray-500">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>Chưa có dữ liệu sản phẩm được xem</p>
                <p className="text-sm mt-2">Dữ liệu sẽ hiển thị khi có người xem sản phẩm</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {data.topProducts.map((product, index) => (
                <Link
                    key={product.productId}
                    href={`/products/${product.productSlug}`}
                    className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200 hover:border-burgundy-500 hover:shadow-md transition-all group"
                >
                    {/* Rank Badge with Icon */}
                    <div className="flex-shrink-0">
                        <div
                            className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold ${
                                index === 0
                                    ? "bg-gradient-to-br from-yellow-400 to-yellow-600 text-white shadow-lg"
                                    : index === 1
                                    ? "bg-gradient-to-br from-gray-300 to-gray-500 text-white shadow-md"
                                    : index === 2
                                    ? "bg-gradient-to-br from-orange-400 to-orange-600 text-white shadow-md"
                                    : "bg-gradient-to-br from-gray-200 to-gray-400 text-gray-700"
                            }`}
                        >
                            {index === 0 ? (
                                <Crown className="h-7 w-7" />
                            ) : index === 1 ? (
                                <Trophy className="h-6 w-6" />
                            ) : index === 2 ? (
                                <Medal className="h-6 w-6" />
                            ) : (
                                <Award className="h-5 w-5" />
                            )}
                        </div>
                        {/* Rank Number */}
                        <div className="text-center mt-1">
                            <span className={`text-xs font-bold ${
                                index < 3 ? "text-burgundy-600" : "text-gray-500"
                            }`}>
                                #{index + 1}
                            </span>
                        </div>
                    </div>

                    {/* Product Image */}
                    <div className="flex-shrink-0 w-16 h-16 relative rounded-lg overflow-hidden">
                        {product.productImage ? (
                            <Image
                                src={product.productImage}
                                alt={product.productName}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                        ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-400 text-xs">No Image</span>
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 truncate group-hover:text-burgundy-600 transition-colors">
                            {product.productName}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                            {new Intl.NumberFormat("vi-VN", {
                                style: "currency",
                                currency: "VND",
                            }).format(product.productPrice)}
                        </p>
                    </div>

                    {/* Views Count - IMPROVED */}
                    <div className="flex-shrink-0 text-right">
                        <div className="bg-blue-50 rounded-lg px-4 py-3 border border-blue-200">
                            <div className="flex items-center justify-center gap-2 mb-1">
                                <Eye className="h-6 w-6 text-blue-600" />
                                <span className="font-bold text-2xl text-blue-700">
                                    {product.views}
                                </span>
                            </div>
                            <p className="text-xs text-blue-600 font-medium text-center uppercase tracking-wide">
                                Lượt xem
                            </p>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
}

