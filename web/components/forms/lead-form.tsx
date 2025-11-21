"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function LeadForm() {
    const [submitted, setSubmitted] = React.useState(false);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Mock submission
        setTimeout(() => {
            setSubmitted(true);
        }, 1000);
    };

    if (submitted) {
        return (
            <div className="rounded-lg bg-burgundy-50 p-8 text-center">
                <h3 className="text-xl font-serif font-bold text-burgundy-900">
                    Cảm ơn bạn đã đăng ký!
                </h3>
                <p className="mt-2 text-burgundy-700">
                    Tharo sẽ liên hệ với bạn sớm nhất để xác nhận lịch hẹn.
                </p>
                <Button
                    variant="outline"
                    className="mt-6"
                    onClick={() => setSubmitted(false)}
                >
                    Đặt lịch khác
                </Button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label
                    htmlFor="name"
                    className="block text-sm font-medium leading-6 text-burgundy-900"
                >
                    Họ và tên
                </label>
                <div className="mt-2">
                    <input
                        type="text"
                        name="name"
                        id="name"
                        required
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-burgundy-600 sm:text-sm sm:leading-6"
                    />
                </div>
            </div>

            <div>
                <label
                    htmlFor="phone"
                    className="block text-sm font-medium leading-6 text-burgundy-900"
                >
                    Số điện thoại
                </label>
                <div className="mt-2">
                    <input
                        type="tel"
                        name="phone"
                        id="phone"
                        required
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-burgundy-600 sm:text-sm sm:leading-6"
                    />
                </div>
            </div>

            <div>
                <label
                    htmlFor="date"
                    className="block text-sm font-medium leading-6 text-burgundy-900"
                >
                    Ngày dự kiến thử áo
                </label>
                <div className="mt-2">
                    <input
                        type="date"
                        name="date"
                        id="date"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-burgundy-600 sm:text-sm sm:leading-6"
                    />
                </div>
            </div>

            <div>
                <label
                    htmlFor="message"
                    className="block text-sm font-medium leading-6 text-burgundy-900"
                >
                    Lời nhắn (Mẫu áo quan tâm, size...)
                </label>
                <div className="mt-2">
                    <textarea
                        id="message"
                        name="message"
                        rows={4}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-burgundy-600 sm:text-sm sm:leading-6"
                    />
                </div>
            </div>

            <Button type="submit" className="w-full bg-burgundy-800 hover:bg-burgundy-900 text-white">
                Đặt lịch ngay
            </Button>
        </form>
    );
}
