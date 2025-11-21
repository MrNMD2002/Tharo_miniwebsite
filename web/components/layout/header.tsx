"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, X, Home, Package, Image as ImageIcon, Info, ChevronRight, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

const navigation = [
    { name: "Trang chủ", href: "/", icon: Home },
    { name: "Bộ sưu tập", href: "/collections", icon: Package },
    { name: "Sản phẩm", href: "/products", icon: Package },
    { name: "Lookbook", href: "/lookbook", icon: ImageIcon },
    { name: "Về Tharo", href: "/about", icon: Info },
];

export function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
    const pathname = usePathname();

    // Close menu when clicking outside
    React.useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [mobileMenuOpen]);

    return (
        <header className="sticky top-0 z-50 w-full border-b border-burgundy-100 bg-cream-50/80 backdrop-blur-md">
            <nav
                className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8"
                aria-label="Global"
            >
                <div className="flex lg:flex-1">
                    <Link href="/" className="-m-1.5 p-1.5">
                        <span className="sr-only">Tharo</span>
                        <h1 className="font-script text-3xl text-burgundy-800">Tharo</h1>
                    </Link>
                </div>
                <div className="flex lg:hidden">
                    <button
                        type="button"
                        className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-burgundy-900 hover:bg-burgundy-50 transition-colors"
                        onClick={() => setMobileMenuOpen(true)}
                    >
                        <span className="sr-only">Open main menu</span>
                        <Menu className="h-6 w-6" aria-hidden="true" />
                    </button>
                </div>
                <div className="hidden lg:flex lg:gap-x-12">
                    {navigation.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className="text-sm font-semibold leading-6 text-burgundy-900 hover:text-burgundy-600 transition-colors"
                        >
                            {item.name}
                        </Link>
                    ))}
                </div>
                <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                    <Button variant="outline" size="sm" className="hidden">
                        Login
                    </Button>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            {/* Mobile Menu Drawer - Nike Style */}
            <div
                className={cn(
                    "fixed inset-y-0 right-0 z-50 w-full sm:max-w-sm bg-white shadow-2xl lg:hidden transition-transform duration-300 ease-in-out flex flex-col",
                    mobileMenuOpen ? "translate-x-0" : "translate-x-full"
                )}
            >
                {/* Header - Fixed */}
                <div className="flex-shrink-0 bg-white px-6 py-5 flex items-center justify-between border-b border-gray-100">
                    <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                        <h1 className="font-script text-3xl text-burgundy-800">Tharo</h1>
                    </Link>
                    <button
                        type="button"
                        className="rounded-full p-1.5 text-gray-500 hover:bg-gray-100 transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        <span className="sr-only">Close menu</span>
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto">
                    {/* Main Navigation */}
                    <nav className="py-4">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={cn(
                                        "flex items-center justify-between px-6 py-4 text-lg font-medium transition-colors border-l-4",
                                        isActive
                                            ? "border-burgundy-600 bg-burgundy-50 text-burgundy-900"
                                            : "border-transparent text-gray-900 hover:bg-gray-50"
                                    )}
                                >
                                    <span>{item.name}</span>
                                    <ChevronRight className={cn(
                                        "h-5 w-5 transition-all",
                                        isActive ? "text-burgundy-600 translate-x-1" : "text-gray-400"
                                    )} />
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Divider */}
                    <div className="mx-6 border-t border-gray-200"></div>

                    {/* Brand Story Section */}
                    <div className="px-6 py-6">
                        <div className="bg-gradient-to-br from-burgundy-50 to-orange-50 rounded-2xl p-6 border border-burgundy-100">
                            <h3 className="text-lg font-serif font-bold text-burgundy-900 mb-2">
                                Về Tharo
                            </h3>
                            <p className="text-sm text-burgundy-700 mb-4 leading-relaxed">
                                Khám phá vẻ đẹp áo dài truyền thống Việt Nam với những thiết kế tinh tế, 
                                kết hợp giữa nét cổ điển và hiện đại.
                            </p>
                            <Link
                                href="/about"
                                onClick={() => setMobileMenuOpen(false)}
                                className="inline-flex items-center gap-2 text-sm font-semibold text-burgundy-700 hover:text-burgundy-900 transition-colors"
                            >
                                <span>Tìm hiểu thêm</span>
                                <ChevronRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Footer - Fixed */}
                <div className="flex-shrink-0 border-t border-gray-100 bg-white">
                    {/* Contact Button */}
                    <div className="px-6 py-4">
                        <a
                            href={`https://m.me/100089059418106?text=${encodeURIComponent("Xin chào Tharo, tôi đến từ website của bạn, hãy tư vấn cho tôi thêm")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 w-full bg-burgundy-600 text-white rounded-full px-6 py-3.5 font-semibold hover:bg-burgundy-700 active:scale-98 transition-all"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <MessageCircle className="h-5 w-5" />
                            <span>Liên hệ tư vấn</span>
                        </a>
                    </div>

                    {/* Quick Links */}
                    <div className="px-6 pb-6 pt-2 space-y-3">
                        <Link
                            href="/collections"
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex items-center gap-3 text-sm text-gray-700 hover:text-burgundy-700 transition-colors"
                        >
                            <Package className="h-4 w-4" />
                            <span>Bộ sưu tập</span>
                        </Link>
                        <Link
                            href="/lookbook"
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex items-center gap-3 text-sm text-gray-700 hover:text-burgundy-700 transition-colors"
                        >
                            <ImageIcon className="h-4 w-4" />
                            <span>Lookbook</span>
                        </Link>
                        <a
                            href={`https://m.me/100089059418106?text=${encodeURIComponent("Xin chào Tharo, tôi biết đến bạn từ website, hãy tư vấn cho tôi")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 text-sm text-gray-700 hover:text-burgundy-700 transition-colors"
                        >
                            <MessageCircle className="h-4 w-4" />
                            <span>Messenger</span>
                        </a>
                    </div>

                    {/* Copyright */}
                    <div className="px-6 py-4 border-t border-gray-100">
                        <p className="text-xs text-center text-gray-500">
                            © 2025 Tharo. Áo dài truyền thống Việt Nam.
                        </p>
                    </div>
                </div>
            </div>
        </header>
    );
}
