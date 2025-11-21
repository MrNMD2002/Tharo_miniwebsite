"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    ShoppingBag,
    Layers,
    FileText,
    LogOut,
    BookOpen,
    BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { QueryProvider } from "@/components/providers/query-provider";

const navigation = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
    { name: "Content", href: "/admin/content", icon: FileText },
    { name: "About Page", href: "/admin/about", icon: BookOpen },
    { name: "Products", href: "/admin/products", icon: ShoppingBag },
    { name: "Collections", href: "/admin/collections", icon: Layers },
    { name: "Lookbook", href: "/admin/lookbook", icon: FileText },
];

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    // Don't show sidebar on login page
    if (pathname === "/admin/login") {
        return <>{children}</>;
    }

    return (
        <QueryProvider>
            <div className="flex min-h-screen bg-gray-100">
                {/* Sidebar */}
                <div className="hidden md:flex md:w-64 md:flex-col">
                    <div className="flex flex-col flex-grow border-r border-gray-200 bg-white pt-5 pb-4 overflow-y-auto">
                        <div className="flex items-center flex-shrink-0 px-4">
                            <h1 className="font-script text-3xl text-burgundy-800">Tharo Admin</h1>
                        </div>
                        <div className="mt-5 flex-grow flex flex-col">
                            <nav className="flex-1 px-2 space-y-1 bg-white">
                                {navigation.map((item) => {
                                    const isActive = pathname.startsWith(item.href);
                                    return (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            className={cn(
                                                isActive
                                                    ? "bg-burgundy-50 text-burgundy-900"
                                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                                                "group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                                            )}
                                        >
                                            <item.icon
                                                className={cn(
                                                    isActive ? "text-burgundy-500" : "text-gray-400 group-hover:text-gray-500",
                                                    "mr-3 flex-shrink-0 h-6 w-6"
                                                )}
                                                aria-hidden="true"
                                            />
                                            {item.name}
                                        </Link>
                                    );
                                })}
                            </nav>
                        </div>
                        <div className="flex-shrink-0 border-t border-gray-200">
                            <Link href="/" className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900">
                                <span className="ml-3">Back to Site</span>
                            </Link>
                            <button
                                onClick={() => {
                                    document.cookie = "auth=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
                                    window.location.href = "/admin/login";
                                }}
                                className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50"
                            >
                                <LogOut className="mr-3 h-5 w-5" />
                                <span className="ml-3">Logout</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main content */}
                <div className="flex flex-col flex-1">
                    <main className="flex-1 relative overflow-y-auto focus:outline-none">
                        <div className="py-6">
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                                {children}
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </QueryProvider>
    );
}
