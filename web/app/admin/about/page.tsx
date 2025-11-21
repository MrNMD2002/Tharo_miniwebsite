"use client";

import React from 'react';
import { useAutoSave } from '@/hooks/use-auto-save';
import { SaveStatusIndicator } from '@/components/ui/save-status';
import { AboutPagePreview } from '@/components/admin/about-page-preview';
import { AboutPageData, CoreValueItem } from '@/types';
import { Button } from '@/components/ui/button';
import { GripVertical, Trash2, Plus, Eye, EyeOff } from 'lucide-react';

export default function AdminAboutPageCMS() {
    const [formData, setFormData] = React.useState<AboutPageData | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);
    
    // Load data
    React.useEffect(() => {
        fetch('/api/about-page')
            .then(res => res.json())
            .then(data => {
                setFormData(data);
                setIsLoading(false);
            })
            .catch(err => {
                console.error('Failed to load:', err);
                setIsLoading(false);
            });
    }, []);
    
    // Auto-save
    const { status, error, manualSave } = useAutoSave({
        data: formData,
        onSave: async (data) => {
            const response = await fetch('/api/about-page', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            
            if (!response.ok) {
                throw new Error('Failed to save');
            }
        },
        debounceMs: 1000,
    });
    
    // Handle section field changes
    const handleSectionChange = (section: keyof Omit<AboutPageData, 'updatedAt'>, field: string, value: any) => {
        setFormData(prev => {
            if (!prev) return prev;
            return {
                ...prev,
                [section]: {
                    ...prev[section],
                    [field]: value,
                },
            };
        });
    };
    
    // Core Values CRUD
    const handleAddValue = () => {
        setFormData(prev => {
            if (!prev) return prev;
            const newValue: CoreValueItem = {
                id: `value-${Date.now()}`,
                text: '',
                order: prev.coreValues.items.length + 1,
            };
            return {
                ...prev,
                coreValues: {
                    ...prev.coreValues,
                    items: [...prev.coreValues.items, newValue],
                },
            };
        });
    };
    
    const handleUpdateValue = (id: string, text: string) => {
        setFormData(prev => {
            if (!prev) return prev;
            return {
                ...prev,
                coreValues: {
                    ...prev.coreValues,
                    items: prev.coreValues.items.map(item =>
                        item.id === id ? { ...item, text } : item
                    ),
                },
            };
        });
    };
    
    const handleDeleteValue = (id: string) => {
        setFormData(prev => {
            if (!prev) return prev;
            return {
                ...prev,
                coreValues: {
                    ...prev.coreValues,
                    items: prev.coreValues.items.filter(item => item.id !== id),
                },
            };
        });
    };
    
    const handleMoveValue = (id: string, direction: 'up' | 'down') => {
        setFormData(prev => {
            if (!prev) return prev;
            const items = [...prev.coreValues.items].sort((a, b) => a.order - b.order);
            const index = items.findIndex(item => item.id === id);
            
            if (index === -1) return prev;
            if (direction === 'up' && index === 0) return prev;
            if (direction === 'down' && index === items.length - 1) return prev;
            
            const newIndex = direction === 'up' ? index - 1 : index + 1;
            [items[index], items[newIndex]] = [items[newIndex], items[index]];
            
            // Update order
            const reorderedItems = items.map((item, idx) => ({
                ...item,
                order: idx + 1,
            }));
            
            return {
                ...prev,
                coreValues: {
                    ...prev.coreValues,
                    items: reorderedItems,
                },
            };
        });
    };
    
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-gray-500">Loading...</p>
            </div>
        );
    }
    
    if (!formData) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-red-600">Error loading data</p>
            </div>
        );
    }
    
    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">About Page CMS</h1>
                    <p className="text-gray-600 mt-1">Edit "Về Tharo" page content</p>
                </div>
                <div className="flex items-center gap-4">
                    <SaveStatusIndicator status={status} error={error} />
                    <Button 
                        onClick={manualSave}
                        disabled={status === 'saving'}
                        className="bg-burgundy-600 hover:bg-burgundy-700 text-white"
                    >
                        {status === 'saving' ? 'Đang lưu...' : 'Lưu ngay'}
                    </Button>
                </div>
            </div>
            
            {/* Main Layout: 2 Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* LEFT: Edit Form */}
                <div className="space-y-6">
                    
                    {/* Hero Section */}
                    <div className="bg-white rounded-lg shadow p-6 border-2 border-burgundy-100">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900">Hero Banner</h2>
                                <p className="text-xs text-gray-500 mt-1">Banner đầu trang với thiết kế đẹp mắt</p>
                            </div>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.hero.isVisible}
                                    onChange={(e) => handleSectionChange('hero', 'isVisible', e.target.checked)}
                                    className="w-4 h-4 text-burgundy-600 rounded focus:ring-burgundy-500"
                                />
                                <span className="text-sm text-gray-700 flex items-center gap-1">
                                    {formData.hero.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                    Visible
                                </span>
                            </label>
                        </div>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    value={formData.hero.title}
                                    onChange={(e) => handleSectionChange('hero', 'title', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Subtitle
                                </label>
                                <input
                                    type="text"
                                    value={formData.hero.subtitle}
                                    onChange={(e) => handleSectionChange('hero', 'subtitle', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Background Color
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="color"
                                        value={formData.hero.backgroundColor}
                                        onChange={(e) => handleSectionChange('hero', 'backgroundColor', e.target.value)}
                                        className="w-20 h-10 rounded border border-gray-300"
                                    />
                                    <input
                                        type="text"
                                        value={formData.hero.backgroundColor}
                                        onChange={(e) => handleSectionChange('hero', 'backgroundColor', e.target.value)}
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                                        placeholder="#8B1538"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Story Section */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-gray-900">Story</h2>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.story.isVisible}
                                    onChange={(e) => handleSectionChange('story', 'isVisible', e.target.checked)}
                                    className="w-4 h-4 text-burgundy-600 rounded focus:ring-burgundy-500"
                                />
                                <span className="text-sm text-gray-700 flex items-center gap-1">
                                    {formData.story.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                    Visible
                                </span>
                            </label>
                        </div>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Heading
                                </label>
                                <input
                                    type="text"
                                    value={formData.story.heading}
                                    onChange={(e) => handleSectionChange('story', 'heading', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Content
                                </label>
                                <textarea
                                    value={formData.story.content}
                                    onChange={(e) => handleSectionChange('story', 'content', e.target.value)}
                                    rows={12}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-burgundy-500 text-sm leading-relaxed"
                                    placeholder="Nhập nội dung... (Enter để xuống dòng mới)"
                                    style={{ fontFamily: 'inherit' }}
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    💡 <strong>Tip:</strong> Mỗi dòng mới (Enter) = 1 đoạn văn riêng biệt. Đoạn văn sẽ tự động có căn lề đầu dòng trong preview.
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    {/* Mission Section */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-gray-900">Mission</h2>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.mission.isVisible}
                                    onChange={(e) => handleSectionChange('mission', 'isVisible', e.target.checked)}
                                    className="w-4 h-4 text-burgundy-600 rounded focus:ring-burgundy-500"
                                />
                                <span className="text-sm text-gray-700 flex items-center gap-1">
                                    {formData.mission.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                    Visible
                                </span>
                            </label>
                        </div>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Heading
                                </label>
                                <input
                                    type="text"
                                    value={formData.mission.heading}
                                    onChange={(e) => handleSectionChange('mission', 'heading', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Content
                                </label>
                                <textarea
                                    value={formData.mission.content}
                                    onChange={(e) => handleSectionChange('mission', 'content', e.target.value)}
                                    rows={12}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-burgundy-500 text-sm leading-relaxed"
                                    placeholder="Nhập nội dung... (Enter để xuống dòng mới)"
                                    style={{ fontFamily: 'inherit' }}
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    💡 <strong>Tip:</strong> Dùng • hoặc - ở đầu dòng để tạo bullet point. Đoạn văn thường sẽ có căn lề đầu dòng.
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    {/* Core Values Section */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-gray-900">Core Values</h2>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.coreValues.isVisible}
                                    onChange={(e) => handleSectionChange('coreValues', 'isVisible', e.target.checked)}
                                    className="w-4 h-4 text-burgundy-600 rounded focus:ring-burgundy-500"
                                />
                                <span className="text-sm text-gray-700 flex items-center gap-1">
                                    {formData.coreValues.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                    Visible
                                </span>
                            </label>
                        </div>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Heading
                                </label>
                                <input
                                    type="text"
                                    value={formData.coreValues.heading}
                                    onChange={(e) => handleSectionChange('coreValues', 'heading', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                                />
                            </div>
                            
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <label className="text-sm font-medium text-gray-700">
                                        Items ({formData.coreValues.items.length})
                                    </label>
                                    <Button 
                                        onClick={handleAddValue} 
                                        size="sm"
                                        className="bg-burgundy-600 hover:bg-burgundy-700 text-white"
                                    >
                                        <Plus className="w-4 h-4 mr-1" />
                                        Add Value
                                    </Button>
                                </div>
                                
                                <div className="space-y-2">
                                    {formData.coreValues.items.length === 0 && (
                                        <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-md">
                                            No values yet. Click "Add Value" to create one.
                                        </div>
                                    )}
                                    
                                    {formData.coreValues.items
                                        .sort((a, b) => a.order - b.order)
                                        .map((item, index) => (
                                            <div key={item.id} className="flex items-start gap-2 p-3 bg-gray-50 rounded-md group">
                                                <div className="flex flex-col gap-1 mt-2">
                                                    <button
                                                        onClick={() => handleMoveValue(item.id, 'up')}
                                                        disabled={index === 0}
                                                        className="text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                                                    >
                                                        <GripVertical className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                
                                                <span className="flex-shrink-0 w-6 text-center text-sm text-gray-500 mt-2">
                                                    {index + 1}.
                                                </span>
                                                
                                                <textarea
                                                    value={item.text}
                                                    onChange={(e) => handleUpdateValue(item.id, e.target.value)}
                                                    rows={2}
                                                    placeholder="Enter value text..."
                                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-burgundy-500 text-sm"
                                                />
                                                
                                                <button
                                                    onClick={() => handleDeleteValue(item.id)}
                                                    className="flex-shrink-0 p-2 text-red-600 hover:bg-red-50 rounded-md mt-1"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    
                </div>
                
                {/* RIGHT: Live Preview */}
                <div className="lg:sticky lg:top-6 h-fit">
                    <AboutPagePreview data={formData} />
                </div>
            </div>
        </div>
    );
}

