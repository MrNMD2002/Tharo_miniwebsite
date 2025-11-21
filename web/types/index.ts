export type Collection = {
    id: string;
    name: string;
    slug: string;
    description?: string; // Mô tả ngắn
    story?: string; // Story SEO - câu chuyện bộ sưu tập (dài, tối ưu SEO)
    thumbnailUrl: string; // Ảnh thumbnail chính
    coverImages?: string[]; // Cover Banner / Slideshow (max 5 ảnh)
    galleryImages?: string[]; // Gallery Images (max 5 ảnh)
    messengerLink?: string; // Link Messenger Page
    productIds?: string[]; // Danh sách product IDs gán vào collection
    tags?: string[]; // Tags for collection (VD: "Xuân Hè", "Limited Edition", "Premium")
    status: "active" | "inactive"; // Changed from "draft" to "inactive"
    createdAt?: string; // ISO timestamp
    updatedAt?: string; // ISO timestamp
};

export type Product = {
    id: string;
    name: string;
    slug: string;
    price: number;
    originalPrice?: number;
    description: string;
    material?: string;
    sizeChart?: string; // URL or HTML content
    colors?: string[]; // Màu sắc có sẵn
    primaryColor?: string; // Màu chủ đạo để hiển thị trên card
    sizes?: string[]; // Size có sẵn
    tags?: string[];
    images: string[]; // Array of image URLs (max 5)
    videoUrl?: string; // Video URL (1 video max)
    status: "active" | "draft" | "in-stock" | "new" | "pre-order" | "limited";
    isActive?: boolean; // true = hiện trên site, false = ẩn (chỉ admin thấy)
    shopeeLink?: string;
    tiktokLink?: string;
    lazadaLink?: string;
    zaloLink?: string;
    collectionId?: string;
    sortOrder?: number; // Thứ tự sắp xếp thủ công
    createdAt?: string; // Để sort theo mới nhất
};

export type Lead = {
    id: string;
    name: string;
    phone: string;
    message?: string;
    type: "consultation" | "fitting";
    createdAt: string; // ISO Date
};

export type HeroBanner = {
    id: string;
    title: string;
    subtitle?: string;
    imageUrl: string;
    ctaText?: string;
    ctaLink?: string;
    order: number;
    status: "active" | "inactive";
};

export type LookbookImage = {
    id: string;
    imageUrl: string;
    title?: string;
    description?: string;
    order: number; // Thứ tự hiển thị
    status: "active" | "inactive";
    createdAt?: string;
};

export type AboutPageData = {
    hero: {
        title: string;
        subtitle: string;
        backgroundImage: string;
        backgroundColor: string;
        isVisible: boolean;
    };
    story: {
        heading: string;
        content: string;
        isVisible: boolean;
    };
    mission: {
        heading: string;
        content: string;
        isVisible: boolean;
    };
    coreValues: {
        heading: string;
        items: CoreValueItem[];
        isVisible: boolean;
    };
    updatedAt: string;
};

export type CoreValueItem = {
    id: string;
    text: string;
    order: number;
};

// Analytics Types
export type AnalyticsEvent = {
    id: string;
    sessionId: string;
    eventType: "page_view" | "product_view" | "cta_click";
    url: string;
    referrer: string;
    timestamp: string; // ISO timestamp
    channel?: string; // organic, social, direct, referral
    productId?: string; // For product_view events
    userAgent?: string;
    ip?: string;
};

export type RealtimeAnalytics = {
    activeUsersLast5Min: number;
    totalPageViewsWeek: number;
    totalProductViewsWeek: number;
    totalCtaClicksWeek: number;
    uniqueVisitorsWeek: number;
    last7DaysSeries: Array<{
        date: string; // ISO timestamp
        pageViews: number;
        productViews: number;
        ctaClicks: number;
    }>;
    ctaByChannel: Array<{
        channel: string;
        clicks: number;
    }>;
    trafficSources: Array<{
        source: string;
        count: number;
    }>;
};

export type TopProduct = {
    productId: string;
    productName: string;
    productImage: string;
    productPrice: number;
    productSlug: string;
    views: number;
};

export type TopProductsResponse = {
    range: "today" | "week" | "month" | "year" | "all";
    totalProducts: number;
    topProducts: TopProduct[];
};
