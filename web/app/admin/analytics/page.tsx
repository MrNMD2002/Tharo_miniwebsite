"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { RealtimeAnalytics } from "@/types";
import { Activity, TrendingUp, MousePointerClick, Users, BarChart3, Trophy } from "lucide-react";
import { TopProducts } from "@/components/analytics/top-products";

type DateRange = "today" | "week" | "month" | "year" | "all";

export default function AnalyticsPage() {
    const [dateRange, setDateRange] = React.useState<DateRange>("week");
    const { data: analytics, isLoading, error } = useQuery<RealtimeAnalytics>({
        queryKey: ["analytics", "realtime"],
        queryFn: async () => {
            const response = await fetch("/api/analytics/realtime");
            if (!response.ok) throw new Error("Failed to fetch analytics");
            return response.json();
        },
        refetchInterval: 5000, // Refetch every 5 seconds
        refetchOnWindowFocus: false,
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-burgundy-900"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800">Không thể tải dữ liệu analytics. Vui lòng thử lại.</p>
            </div>
        );
    }

    if (!analytics) return null;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-serif font-bold text-burgundy-900">
                        Realtime Analytics
                    </h1>
                    <p className="text-sm text-gray-600 mt-1">
                        Dữ liệu cập nhật mỗi 5 giây
                    </p>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Activity className="h-4 w-4 animate-pulse text-green-600" />
                    <span>Live</span>
                </div>
            </div>

            {/* Active Users Card */}
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-green-100 text-sm font-medium mb-1">
                            Người dùng hoạt động
                        </p>
                        <p className="text-4xl font-bold">
                            {analytics.activeUsersLast5Min}
                        </p>
                        <p className="text-green-100 text-xs mt-1">
                            Trong 5 phút qua
                        </p>
                    </div>
                    <div className="bg-white/20 rounded-full p-4">
                        <Users className="h-8 w-8" />
                    </div>
                </div>
            </div>

            {/* Week Totals Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-gray-600">Lượt xem trang</h3>
                        <TrendingUp className="h-5 w-5 text-blue-600" />
                    </div>
                    <p className="text-3xl font-bold text-gray-900">
                        {analytics.totalPageViewsWeek.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Tuần này</p>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-gray-600">Xem sản phẩm</h3>
                        <BarChart3 className="h-5 w-5 text-purple-600" />
                    </div>
                    <p className="text-3xl font-bold text-gray-900">
                        {analytics.totalProductViewsWeek.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Tuần này</p>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-gray-600">Click CTA</h3>
                        <MousePointerClick className="h-5 w-5 text-orange-600" />
                    </div>
                    <p className="text-3xl font-bold text-gray-900">
                        {analytics.totalCtaClicksWeek.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Tuần này</p>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-gray-600">Người dùng</h3>
                        <Users className="h-5 w-5 text-green-600" />
                    </div>
                    <p className="text-3xl font-bold text-gray-900">
                        {analytics.uniqueVisitorsWeek.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Độc nhất tuần này</p>
                </div>
            </div>

            {/* Last 7 Days Chart */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">
                        7 ngày qua
                    </h3>
                    
                    {/* Legend - Chú giải */}
                    <div className="flex items-center gap-4 text-xs">
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                            <span className="text-gray-600 font-medium">Lượt xem trang</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                            <span className="text-gray-600 font-medium">Xem sản phẩm</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                            <span className="text-gray-600 font-medium">Click CTA</span>
                        </div>
                    </div>
                </div>
                <div className="space-y-4">
                    {analytics.last7DaysSeries.map((day, index) => {
                        const maxValue = Math.max(
                            ...analytics.last7DaysSeries.map((d) => 
                                d.pageViews + d.productViews + d.ctaClicks
                            )
                        );
                        const totalDay = day.pageViews + day.productViews + day.ctaClicks;
                        const percentage = maxValue > 0 ? (totalDay / maxValue) * 100 : 0;

                        return (
                            <div key={index}>
                                <div className="flex items-center justify-between text-sm mb-2">
                                    <span className="text-gray-600 font-medium">
                                        {new Date(day.date).toLocaleDateString("vi-VN", {
                                            weekday: "short",
                                            month: "short",
                                            day: "numeric",
                                        })}
                                    </span>
                                    <div className="flex gap-3 text-xs">
                                        {/* Page Views */}
                                        <div className="flex items-center gap-1.5 bg-blue-50 px-2.5 py-1.5 rounded-md border border-blue-200">
                                            <TrendingUp className="h-4 w-4 text-blue-600" />
                                            <span className="font-semibold text-blue-700">
                                                {day.pageViews}
                                            </span>
                                            <span className="text-blue-600 text-[10px] uppercase font-medium">
                                                Views
                                            </span>
                                        </div>
                                        
                                        {/* Product Views */}
                                        <div className="flex items-center gap-1.5 bg-purple-50 px-2.5 py-1.5 rounded-md border border-purple-200">
                                            <BarChart3 className="h-4 w-4 text-purple-600" />
                                            <span className="font-semibold text-purple-700">
                                                {day.productViews}
                                            </span>
                                            <span className="text-purple-600 text-[10px] uppercase font-medium">
                                                Products
                                            </span>
                                        </div>
                                        
                                        {/* CTA Clicks */}
                                        <div className="flex items-center gap-1.5 bg-orange-50 px-2.5 py-1.5 rounded-md border border-orange-200">
                                            <MousePointerClick className="h-4 w-4 text-orange-600" />
                                            <span className="font-semibold text-orange-700">
                                                {day.ctaClicks}
                                            </span>
                                            <span className="text-orange-600 text-[10px] uppercase font-medium">
                                                Clicks
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-orange-500 rounded-full transition-all duration-300"
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* CTA by Channel & Traffic Sources */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* CTA by Channel */}
                <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        CTA theo kênh
                    </h3>
                    {analytics.ctaByChannel.length > 0 ? (
                        <div className="space-y-3">
                            {analytics.ctaByChannel.map((item, index) => {
                                const maxCount = analytics.ctaByChannel[0]?.clicks || 1;
                                const percentage = (item.clicks / maxCount) * 100;

                                return (
                                    <div key={index}>
                                        <div className="flex items-center justify-between text-sm mb-1">
                                            <span className="text-gray-700 capitalize font-medium">
                                                {item.channel}
                                            </span>
                                            <span className="text-gray-900 font-semibold">
                                                {item.clicks}
                                            </span>
                                        </div>
                                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-orange-500 rounded-full transition-all duration-300"
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-sm">Chưa có dữ liệu</p>
                    )}
                </div>

                {/* Traffic Sources */}
                <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Nguồn truy cập
                    </h3>
                    {analytics.trafficSources.length > 0 ? (
                        <div className="space-y-3">
                            {analytics.trafficSources.map((item, index) => {
                                const maxCount = analytics.trafficSources[0]?.count || 1;
                                const percentage = (item.count / maxCount) * 100;

                                return (
                                    <div key={index}>
                                        <div className="flex items-center justify-between text-sm mb-1">
                                            <span className="text-gray-700 capitalize font-medium">
                                                {item.source}
                                            </span>
                                            <span className="text-gray-900 font-semibold">
                                                {item.count}
                                            </span>
                                        </div>
                                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-blue-500 rounded-full transition-all duration-300"
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-sm">Chưa có dữ liệu</p>
                    )}
                </div>
            </div>

            {/* Top Products Section */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="bg-burgundy-100 rounded-full p-2">
                            <Trophy className="h-6 w-6 text-burgundy-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                                Top Sản Phẩm Được Xem Nhiều Nhất
                            </h3>
                            <p className="text-sm text-gray-500">Xếp hạng theo lượt xem</p>
                        </div>
                    </div>

                    {/* Date Range Filter */}
                    <div className="flex gap-2">
                        {[
                            { value: "today" as DateRange, label: "Hôm nay" },
                            { value: "week" as DateRange, label: "Tuần" },
                            { value: "month" as DateRange, label: "Tháng" },
                            { value: "year" as DateRange, label: "Năm" },
                            { value: "all" as DateRange, label: "Tất cả" },
                        ].map((range) => (
                            <button
                                key={range.value}
                                onClick={() => setDateRange(range.value)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                    dateRange === range.value
                                        ? "bg-burgundy-600 text-white shadow-md"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                            >
                                {range.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Top Products List */}
                <TopProducts dateRange={dateRange} />
            </div>
        </div>
    );
}

