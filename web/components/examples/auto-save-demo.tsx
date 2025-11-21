"use client";

/**
 * AUTO-SAVE DEMO COMPONENT
 * 
 * This is an example showing how to use auto-save in admin forms.
 * Copy this pattern to your actual forms.
 */

import * as React from "react";
import { useAutoSave } from "@/hooks/use-auto-save";
import { SaveStatusIndicator } from "@/components/ui/save-status";

interface DemoFormData {
    name: string;
    price: number;
    description: string;
}

export function AutoSaveDemo() {
    // 1. Form state
    const [formData, setFormData] = React.useState<DemoFormData>({
        name: "",
        price: 0,
        description: "",
    });

    // 2. Auto-save hook
    const { status, error, lastSavedAt, manualSave } = useAutoSave({
        data: formData,
        onSave: async (data) => {
            // Simulate API call
            console.log('Saving:', data);
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Simulate random error (10% chance)
            if (Math.random() < 0.1) {
                throw new Error('Simulated error');
            }
            
            console.log('Saved successfully!');
        },
        debounceMs: 1000,
    });

    // 3. Handle input changes
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'price' ? Number(value) : value,
        }));
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
            {/* Header with save status */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                    Auto-Save Demo
                </h2>
                <SaveStatusIndicator 
                    status={status} 
                    error={error}
                    lastSavedAt={lastSavedAt}
                />
            </div>

            {/* Instructions */}
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
                <h3 className="font-semibold text-blue-900 mb-2">
                    📝 Hướng dẫn:
                </h3>
                <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Gõ vào các field bên dưới</li>
                    <li>• Dừng gõ 1 giây → Tự động lưu</li>
                    <li>• Xem status indicator góc phải trên</li>
                    <li>• Không cần bấm nút "Lưu"</li>
                </ul>
            </div>

            {/* Form fields */}
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tên sản phẩm
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Nhập tên sản phẩm..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Giá
                    </label>
                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        placeholder="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mô tả
                    </label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Nhập mô tả..."
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            {/* Manual save button (optional) */}
            <div className="mt-6 pt-6 border-t border-gray-200">
                <button
                    onClick={manualSave}
                    disabled={status === 'saving'}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                    {status === 'saving' ? 'Đang lưu...' : 'Lưu ngay (Manual)'}
                </button>
                <p className="mt-2 text-sm text-gray-500">
                    Hoặc đợi 1 giây sau khi dừng gõ để tự động lưu
                </p>
            </div>

            {/* Current data display */}
            <div className="mt-6 p-4 bg-gray-50 rounded-md">
                <h3 className="font-semibold text-gray-900 mb-2">
                    Current Data:
                </h3>
                <pre className="text-sm text-gray-700 overflow-auto">
                    {JSON.stringify(formData, null, 2)}
                </pre>
            </div>
        </div>
    );
}

