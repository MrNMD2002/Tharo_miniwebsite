"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { ImagePlus, X, Loader2 } from "lucide-react";
import Image from "next/image";

interface MediaUploaderProps {
    value: string[];
    onChange: (value: string[]) => void;
    maxFiles?: number;
    disabled?: boolean;
}

export function MediaUploader({
    value,
    onChange,
    maxFiles = 1,
    disabled,
}: MediaUploaderProps) {
    const [isUploading, setIsUploading] = React.useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const onDrop = async (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();

        const files = e.dataTransfer.files;
        if (!files || files.length === 0) return;

        if (value.length + files.length > maxFiles) {
            alert(`Bạn chỉ có thể upload tối đa ${maxFiles} ảnh.`);
            return;
        }

        await uploadFiles(files);
    };

    const validateFile = (file: File): { valid: boolean; error?: string } => {
        // Check file type: JPG, PNG, WebP
        const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
        if (!allowedTypes.includes(file.type)) {
            return {
                valid: false,
                error: `File "${file.name}" không đúng định dạng. Chỉ chấp nhận JPG, PNG, WebP.`,
            };
        }

        // Check file size: max 2MB
        const maxSize = 2 * 1024 * 1024; // 2MB in bytes
        if (file.size > maxSize) {
            return {
                valid: false,
                error: `File "${file.name}" quá lớn (${(file.size / 1024 / 1024).toFixed(2)}MB). Tối đa 2MB.`,
            };
        }

        return { valid: true };
    };

    const uploadFiles = async (files: FileList) => {
        // Validate all files first
        const filesArray = Array.from(files);
        for (const file of filesArray) {
            const validation = validateFile(file);
            if (!validation.valid) {
                alert(validation.error);
                return;
            }
        }

        setIsUploading(true);
        const formData = new FormData();
        filesArray.forEach((file) => {
            formData.append("file", file);
        });

        try {
            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Upload failed");
            }

            const data = await response.json();
            onChange([...value, ...data.urls]);
        } catch (error) {
            console.error("Upload error:", error);
            alert("Có lỗi xảy ra khi upload ảnh.");
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;
        await uploadFiles(files);
    };

    const handleRemove = (urlToRemove: string) => {
        onChange(value.filter((url) => url !== urlToRemove));
    };

    return (
        <div>
            <div className="mb-4 flex items-center gap-4 flex-wrap">
                {value.map((url) => (
                    <div key={url} className="relative w-[200px] h-[200px] rounded-md overflow-hidden border border-gray-200 group">
                        <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={() => handleRemove(url)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                        <Image
                            fill
                            className="object-cover"
                            alt="Image"
                            src={url}
                        />
                    </div>
                ))}
            </div>
            {value.length < maxFiles && (
                <div
                    onDragOver={onDragOver}
                    onDrop={onDrop}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-10 text-center hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                >
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        multiple={maxFiles > 1}
                        onChange={handleUpload}
                        disabled={disabled || isUploading}
                    />
                    <div className="flex flex-col items-center justify-center gap-2 text-gray-500">
                        {isUploading ? (
                            <Loader2 className="h-10 w-10 animate-spin text-burgundy-600" />
                        ) : (
                            <ImagePlus className="h-10 w-10 text-gray-400" />
                        )}
                        <p className="text-sm font-medium">
                            {isUploading ? "Đang upload..." : "Kéo thả ảnh vào đây hoặc click để chọn"}
                        </p>
                        <p className="text-xs text-gray-400">
                            (Tối đa {maxFiles} ảnh)
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
