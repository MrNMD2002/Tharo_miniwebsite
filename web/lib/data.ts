import { Product, Collection } from "@/types";

// NOTE: Do NOT import lib/collections or lib/products directly in client components
// They use fs/promises which only works server-side
// Use API routes (/api/collections, /api/products) for client-side data fetching

// Legacy static data for reference/fallback only
// DO NOT USE - kept for backward compatibility
export const COLLECTIONS: Collection[] = [
    {
        id: "c1",
        name: "Nàng",
        slug: "nang",
        description: "Vẻ đẹp dịu dàng, thanh thoát của người phụ nữ Việt.",
        thumbnailUrl: "https://images.unsplash.com/photo-1583391733958-27751555211c?q=80&w=2070&auto=format&fit=crop",
        status: "active",
    },
    {
        id: "c2",
        name: "San",
        slug: "san",
        description: "Sự sang trọng, quý phái trong từng đường nét.",
        thumbnailUrl: "https://images.unsplash.com/photo-1552168324-d612d77725e3?q=80&w=2070&auto=format&fit=crop",
        status: "active",
    },
    {
        id: "c3",
        name: "Hoa",
        slug: "hoa",
        description: "Rực rỡ như những đóa hoa mùa xuân.",
        thumbnailUrl: "https://images.unsplash.com/photo-1529139574466-a302d2d3f524?q=80&w=1888&auto=format&fit=crop",
        status: "active",
    },
];

export const PRODUCTS: Product[] = [
    {
        id: "1",
        name: "Áo Dài Lụa Tơ Tằm - Hồng Phấn",
        slug: "ao-dai-lua-to-tam-hong-phan",
        price: 1200000,
        originalPrice: 1500000,
        description: "Thiết kế truyền thống với chất liệu lụa tơ tằm cao cấp, mềm mại và thoáng mát. Màu hồng phấn nhẹ nhàng tôn lên vẻ nữ tính.",
        material: "Lụa tơ tằm",
        images: [
            "https://images.unsplash.com/photo-1583391733958-27751555211c?q=80&w=2070&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1552168324-d612d77725e3?q=80&w=2000&auto=format&fit=crop",
        ],
        collectionId: "c1",
        status: "in-stock",
        shopeeLink: "https://shopee.vn",
        tiktokLink: "https://tiktok.com",
    },
    {
        id: "2",
        name: "Áo Dài Gấm - Đỏ Đô",
        slug: "ao-dai-gam-do-do",
        price: 1800000,
        description: "Chất liệu gấm sang trọng với họa tiết chìm tinh tế. Màu đỏ đô quyến rũ, phù hợp cho các dịp lễ tết.",
        material: "Gấm",
        images: [
            "https://images.unsplash.com/photo-1583391733958-27751555211c?q=80&w=2000&auto=format&fit=crop",
        ],
        collectionId: "c2",
        status: "in-stock",
    },
    {
        id: "3",
        name: "Áo Dài Cách Tân - Xanh Ngọc",
        slug: "ao-dai-cach-tan-xanh-ngoc",
        price: 950000,
        description: "Thiết kế cách tân trẻ trung với tà ngắn và tay lỡ. Màu xanh ngọc tươi mát.",
        material: "Lụa hàn",
        images: [
            "https://images.unsplash.com/photo-1529139574466-a302d2d3f524?q=80&w=2000&auto=format&fit=crop",
        ],
        collectionId: "c1",
        status: "new",
    },
    {
        id: "4",
        name: "Áo Dài Nhung - Tím Huế",
        slug: "ao-dai-nhung-tim-hue",
        price: 2100000,
        description: "Vẻ đẹp cổ điển và quý phái với chất liệu nhung the. Màu tím Huế mộng mơ.",
        material: "Nhung the",
        images: [
            "https://images.unsplash.com/photo-1552168324-d612d77725e3?q=80&w=2000&auto=format&fit=crop",
        ],
        collectionId: "c2",
        status: "pre-order",
    },
    {
        id: "5",
        name: "Áo Dài Linen - Trắng Tinh Khôi",
        slug: "ao-dai-linen-trang",
        price: 850000,
        description: "Chất liệu Linen mộc mạc, thân thiện với làn da. Màu trắng tinh khôi phù hợp chụp ảnh kỷ yếu.",
        material: "Linen",
        images: [
            "https://images.unsplash.com/photo-1583391733958-27751555211c?q=80&w=2000&auto=format&fit=crop",
        ],
        collectionId: "c3",
        status: "in-stock",
    },
    {
        id: "6",
        name: "Áo Dài Thêu Tay - Hoa Sen",
        slug: "ao-dai-theu-tay-hoa-sen",
        price: 3200000,
        description: "Tác phẩm nghệ thuật với họa tiết hoa sen thêu tay tỉ mỉ trên nền lụa cao cấp.",
        material: "Lụa tơ tằm",
        images: [
            "https://images.unsplash.com/photo-1552168324-d612d77725e3?q=80&w=2070&auto=format&fit=crop",
        ],
        collectionId: "c2",
        status: "limited",
    },
    {
        id: "7",
        name: "Áo Dài 4 Tà - Vàng Mơ",
        slug: "ao-dai-4-ta-vang-mo",
        price: 1450000,
        description: "Thiết kế 4 tà tạo độ bồng bềnh, thướt tha khi di chuyển. Màu vàng mơ rạng rỡ.",
        material: "Voan tơ",
        images: [
            "https://images.unsplash.com/photo-1529139574466-a302d2d3f524?q=80&w=2000&auto=format&fit=crop",
        ],
        collectionId: "c1",
        status: "in-stock",
    },
    {
        id: "8",
        name: "Áo Dài Dáng Suông - Cam Đất",
        slug: "ao-dai-dang-suong-cam-dat",
        price: 980000,
        description: "Dáng suông thoải mái, che khuyết điểm tốt. Màu cam đất trendy.",
        material: "Lụa đũi",
        images: [
            "https://images.unsplash.com/photo-1583391733958-27751555211c?q=80&w=2000&auto=format&fit=crop",
        ],
        collectionId: "c3",
        status: "in-stock",
    },
    {
        id: "9",
        name: "Áo Dài Cưới - Đỏ Truyền Thống",
        slug: "ao-dai-cuoi-do",
        price: 4500000,
        description: "Thiết kế lộng lẫy cho ngày trọng đại. Kết cườm và đính đá thủ công.",
        material: "Gấm/Lụa",
        images: [
            "https://images.unsplash.com/photo-1552168324-d612d77725e3?q=80&w=2000&auto=format&fit=crop",
        ],
        collectionId: "c2",
        status: "pre-order",
    },
    {
        id: "10",
        name: "Áo Dài Cô Ba - Họa Tiết Gạch Bông",
        slug: "ao-dai-co-ba-gach-bong",
        price: 1100000,
        description: "Phong cách Retro Cô Ba Sài Gòn với họa tiết gạch bông kinh điển.",
        material: "Lụa nhật",
        images: [
            "https://images.unsplash.com/photo-1529139574466-a302d2d3f524?q=80&w=2000&auto=format&fit=crop",
        ],
        collectionId: "c3",
        status: "in-stock",
    },
];
