"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { RealtimeAnalytics } from "@/types";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF6B9D', '#8E44AD'];

export default function DashboardPage() {
    const { data: analytics, isLoading } = useQuery<RealtimeAnalytics>({
        queryKey: ["analytics", "dashboard"],
        queryFn: async () => {
            const response = await fetch("/api/analytics/realtime");
            if (!response.ok) throw new Error("Failed to fetch analytics");
            return response.json();
        },
        refetchInterval: 30000, // Refresh every 30 seconds
        refetchOnWindowFocus: false,
    });

    if (isLoading || !analytics) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-burgundy-900"></div>
            </div>
        );
    }

    // Calculate conversion rate
    const totalViews = analytics.totalPageViewsWeek;
    const totalClicks = analytics.totalCtaClicksWeek;
    const conversionRate = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : "0.0";

    // Prepare data for charts
    const dataViews = analytics.last7DaysSeries.map((day) => ({
        name: new Date(day.date).toLocaleDateString("en-US", { weekday: "short" }),
        views: day.pageViews,
    }));

    // Map CTA by channel to match old structure (capitalize first letter)
    const dataCTA = analytics.ctaByChannel.map((item) => ({
        name: item.channel.charAt(0).toUpperCase() + item.channel.slice(1),
        clicks: item.clicks,
    }));

    // Map traffic sources for pie chart
    const dataTraffic = analytics.trafficSources.map((item) => ({
        name: item.source.charAt(0).toUpperCase() + item.source.slice(1),
        value: item.count,
    }));
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-serif font-bold text-burgundy-900">Dashboard Analytics</h1>
                <p className="text-sm text-gray-500">Updates every 30 seconds</p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Stat Cards - REAL DATA */}
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Views (Week)</dt>
                        <dd className="mt-1 text-3xl font-semibold text-gray-900">
                            {analytics.totalPageViewsWeek.toLocaleString()}
                        </dd>
                    </div>
                </div>
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <dt className="text-sm font-medium text-gray-500 truncate">Total CTA Clicks</dt>
                        <dd className="mt-1 text-3xl font-semibold text-gray-900">
                            {analytics.totalCtaClicksWeek.toLocaleString()}
                        </dd>
                    </div>
                </div>
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <dt className="text-sm font-medium text-gray-500 truncate">Conversion Rate</dt>
                        <dd className="mt-1 text-3xl font-semibold text-gray-900">
                            {conversionRate}%
                        </dd>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Views Chart - REAL DATA */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Page Views (Last 7 Days)</h3>
                    <div className="h-80">
                        {dataViews.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart
                                    data={dataViews}
                                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="views" stroke="#8884d8" activeDot={{ r: 8 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-500">
                                Chưa có dữ liệu
                            </div>
                        )}
                    </div>
                </div>

                {/* CTA Chart - REAL DATA */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">CTA Clicks by Channel</h3>
                    <div className="h-80">
                        {dataCTA.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={dataCTA}
                                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="clicks" fill="#82ca9d" />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-500">
                                Chưa có dữ liệu CTA clicks
                            </div>
                        )}
                    </div>
                </div>

                {/* Traffic Source - REAL DATA */}
                <div className="bg-white p-6 rounded-lg shadow lg:col-span-2">
                    <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Traffic Sources</h3>
                    <div className="h-80 w-full flex justify-center">
                        {dataTraffic.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={dataTraffic}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={(props: any) => {
                                            const percent = props.percent || 0;
                                            return `${props.name} ${(percent * 100).toFixed(0)}%`;
                                        }}
                                        outerRadius={100}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {dataTraffic.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-500">
                                Chưa có dữ liệu traffic
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
