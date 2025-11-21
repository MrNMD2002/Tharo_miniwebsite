"use client";

import * as React from "react";
import { CheckCircle, XCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ToastProps {
    message: string;
    type?: "success" | "error";
    isVisible: boolean;
    onClose: () => void;
}

export function Toast({ message, type = "success", isVisible, onClose }: ToastProps) {
    React.useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                onClose();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [isVisible, onClose]);

    if (!isVisible) return null;

    return (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 fade-in duration-300">
            <div
                className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border min-w-[300px]",
                    type === "success"
                        ? "bg-white border-green-200 text-green-800"
                        : "bg-white border-red-200 text-red-800"
                )}
            >
                {type === "success" ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                )}
                <p className="text-sm font-medium flex-1">{message}</p>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                    <X className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}
