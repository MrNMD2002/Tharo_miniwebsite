/**
 * COLOR MAPPING - Parent-Child Relationship
 * 
 * Rule 1: Parent color → Match ALL children in group
 * Rule 2: Child color → Match EXACT only
 * 
 * Example:
 * - Select "Hồng" → Shows: Hồng, Hồng phấn, Hồng đất, Hồng nude
 * - Select "Hồng phấn" → Shows: Hồng phấn ONLY
 */

export type ColorMapping = {
    parent: string;
    children: string[];
};

/**
 * Define color groups
 * Add more groups as needed
 */
export const COLOR_GROUPS: ColorMapping[] = [
    {
        parent: "Hồng",
        children: [
            "Hồng",
            "Hồng phấn",
            "Hồng Phấn", // Case variations
            "Hồng đất",
            "Hồng nude",
            "Hồng pastel",
            "Hồng san hô"
        ]
    },
    {
        parent: "Đỏ",
        children: [
            "Đỏ",
            "Đỏ truyền thống",
            "Đỏ đô",
            "Đỏ burgundy",
            "Đỏ tía"
        ]
    },
    {
        parent: "Vàng",
        children: [
            "Vàng",
            "Vàng kim",
            "Vàng gold",
            "Vàng nghệ",
            "Vàng nhạt"
        ]
    },
    {
        parent: "Xanh",
        children: [
            "Xanh",
            "Xanh cổ điển",
            "Xanh dương",
            "Xanh ngọc",
            "Xanh navy",
            "Xanh pastel"
        ]
    },
    {
        parent: "Tím",
        children: [
            "Tím",
            "Tím than",
            "Tím nhạt",
            "Tím lavender"
        ]
    },
    {
        parent: "Trắng",
        children: [
            "Trắng",
            "Trắng ngà",
            "Trắng kem"
        ]
    },
    {
        parent: "Be",
        children: [
            "Be",
            "Be nhạt",
            "Be sữa"
        ]
    },
    // Standalone colors (no children, not in any group)
    {
        parent: "Đa sắc",
        children: ["Đa sắc"]
    },
    {
        parent: "Đen",
        children: ["Đen"]
    }
];

/**
 * Get all colors that should match when a color is selected
 * 
 * @param selectedColor - The color selected by user
 * @returns Array of colors to match (including the selected one)
 */
export function getMatchingColors(selectedColor: string): string[] {
    if (!selectedColor || selectedColor === "all") {
        return [];
    }

    // Normalize for comparison (trim whitespace)
    const normalized = selectedColor.trim();

    // Check if selected color is a parent
    const parentGroup = COLOR_GROUPS.find(group => group.parent === normalized);
    if (parentGroup) {
        // Parent selected → Return ALL children in group
        return parentGroup.children;
    }

    // Check if selected color is a child
    const isChild = COLOR_GROUPS.some(group => 
        group.children.some(child => child === normalized)
    );

    if (isChild) {
        // Child selected → Return EXACT match only
        return [normalized];
    }

    // Unknown color → Exact match only (fallback)
    return [normalized];
}

/**
 * Check if a color belongs to any group
 * 
 * @param color - Color to check
 * @returns true if color is in any group, false otherwise
 */
export function isColorInGroup(color: string): boolean {
    const normalized = color.trim();
    return COLOR_GROUPS.some(group => 
        group.children.some(child => child === normalized)
    );
}

/**
 * Get parent color for a child color
 * 
 * @param childColor - Child color to find parent for
 * @returns Parent color name or null if not found
 */
export function getParentColor(childColor: string): string | null {
    const normalized = childColor.trim();
    const group = COLOR_GROUPS.find(g => 
        g.children.some(child => child === normalized)
    );
    return group ? group.parent : null;
}

/**
 * Get all unique colors from products
 * Returns both parent and child colors that exist in products
 * 
 * @param products - Array of products
 * @returns Sorted array of unique colors (parents first, then children)
 */
export function getUniqueColorsFromProducts(products: Array<{ primaryColor?: string }>): string[] {
    // Collect all colors from products
    const productColors = new Set<string>();
    products.forEach(product => {
        if (product.primaryColor && product.primaryColor.trim() !== '' && product.primaryColor !== '0') {
            productColors.add(product.primaryColor.trim());
        }
    });

    // Separate into parents and children
    const parents: string[] = [];
    const children: string[] = [];

    productColors.forEach(color => {
        // Check if this color is a parent
        const isParent = COLOR_GROUPS.some(group => group.parent === color);
        
        if (isParent) {
            parents.push(color);
        } else {
            // Check if we should show the parent instead
            const parent = getParentColor(color);
            if (parent) {
                // Add parent if not already added
                if (!parents.includes(parent)) {
                    parents.push(parent);
                }
                // Also add the specific child color
                children.push(color);
            } else {
                // Standalone color
                children.push(color);
            }
        }
    });

    // Sort both arrays
    parents.sort();
    children.sort();

    // Return parents first, then children (for better UX)
    return [...new Set([...parents, ...children])];
}

