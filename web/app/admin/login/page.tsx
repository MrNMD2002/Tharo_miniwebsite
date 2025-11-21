"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
    const router = useRouter();
    const [password, setPassword] = React.useState("");
    const [error, setError] = React.useState("");

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === "admin123") { // Mock password
            document.cookie = "auth=true; path=/";
            router.push("/admin/dashboard");
        } else {
            setError("Sai mật khẩu!");
        }
    };

    return (
        <div className="flex min-h-screen flex-col justify-center py-12 sm:px-6 lg:px-8 bg-cream-50">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-serif font-bold tracking-tight text-burgundy-900">
                    Đăng nhập Admin
                </h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form className="space-y-6" onSubmit={handleLogin}>
                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Mật khẩu
                            </label>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-burgundy-500 focus:outline-none focus:ring-burgundy-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        {error && <p className="text-red-600 text-sm">{error}</p>}

                        <div>
                            <Button type="submit" className="w-full bg-burgundy-800 hover:bg-burgundy-900 text-white">
                                Đăng nhập
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
