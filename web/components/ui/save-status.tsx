import { SaveStatus } from "@/hooks/use-auto-save";
import { Check, AlertCircle, Loader2, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface SaveStatusIndicatorProps {
    status: SaveStatus;
    error?: string | null;
    lastSavedAt?: Date | null;
    className?: string;
}

export function SaveStatusIndicator({ 
    status, 
    error, 
    lastSavedAt,
    className 
}: SaveStatusIndicatorProps) {
    if (status === 'idle' && !lastSavedAt) {
        return null;
    }

    const getStatusConfig = () => {
        switch (status) {
            case 'saving':
                return {
                    icon: Loader2,
                    text: 'Đang lưu...',
                    className: 'text-blue-600 bg-blue-50 border-blue-200',
                    iconClassName: 'animate-spin',
                };
            case 'saved':
                return {
                    icon: Check,
                    text: 'Đã lưu',
                    className: 'text-green-600 bg-green-50 border-green-200',
                    iconClassName: '',
                };
            case 'error':
                return {
                    icon: AlertCircle,
                    text: error || 'Lỗi khi lưu',
                    className: 'text-red-600 bg-red-50 border-red-200',
                    iconClassName: '',
                };
            case 'idle':
                if (lastSavedAt) {
                    const timeAgo = getTimeAgo(lastSavedAt);
                    return {
                        icon: Clock,
                        text: `Đã lưu ${timeAgo}`,
                        className: 'text-gray-600 bg-gray-50 border-gray-200',
                        iconClassName: '',
                    };
                }
                return null;
        }
    };

    const config = getStatusConfig();
    if (!config) return null;

    const Icon = config.icon;

    return (
        <div
            className={cn(
                'inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium border transition-all',
                config.className,
                className
            )}
        >
            <Icon className={cn('h-4 w-4', config.iconClassName)} />
            <span>{config.text}</span>
        </div>
    );
}

function getTimeAgo(date: Date): string {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) {
        return 'vài giây trước';
    }
    
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
        return `${minutes} phút trước`;
    }
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
        return `${hours} giờ trước`;
    }
    
    return date.toLocaleDateString('vi-VN');
}

