/**
 * TEST CASES for Color Mapping
 * 
 * Run these tests to verify parent-child color filtering works correctly
 */

import { getMatchingColors, getParentColor, isColorInGroup } from '../color-mapping';

// Mock console for cleaner output
const originalLog = console.log;

describe('Color Mapping Tests', () => {
    
    beforeAll(() => {
        console.log = jest.fn();
    });

    afterAll(() => {
        console.log = originalLog;
    });

    describe('getMatchingColors', () => {
        
        test('Parent "Hồng" should return ALL children in Hồng group', () => {
            const result = getMatchingColors("Hồng");
            expect(result).toContain("Hồng");
            expect(result).toContain("Hồng phấn");
            expect(result).toContain("Hồng Phấn"); // Case variation
            expect(result).toContain("Hồng đất");
            expect(result).toContain("Hồng nude");
            expect(result.length).toBeGreaterThan(1);
        });

        test('Child "Hồng phấn" should return EXACT match only', () => {
            const result = getMatchingColors("Hồng phấn");
            expect(result).toEqual(["Hồng phấn"]);
            expect(result.length).toBe(1);
        });

        test('Parent "Đỏ" should return ALL children in Đỏ group', () => {
            const result = getMatchingColors("Đỏ");
            expect(result).toContain("Đỏ");
            expect(result).toContain("Đỏ truyền thống");
            expect(result).toContain("Đỏ đô");
            expect(result.length).toBeGreaterThan(1);
        });

        test('Child "Đỏ truyền thống" should return EXACT match only', () => {
            const result = getMatchingColors("Đỏ truyền thống");
            expect(result).toEqual(["Đỏ truyền thống"]);
            expect(result.length).toBe(1);
        });

        test('Parent "Vàng" should return ALL children', () => {
            const result = getMatchingColors("Vàng");
            expect(result).toContain("Vàng");
            expect(result).toContain("Vàng kim");
            expect(result).toContain("Vàng gold");
            expect(result.length).toBeGreaterThan(1);
        });

        test('Child "Vàng kim" should return EXACT match only', () => {
            const result = getMatchingColors("Vàng kim");
            expect(result).toEqual(["Vàng kim"]);
        });

        test('Standalone color "Đa sắc" should return itself only', () => {
            const result = getMatchingColors("Đa sắc");
            expect(result).toEqual(["Đa sắc"]);
        });

        test('Unknown color should return exact match (fallback)', () => {
            const result = getMatchingColors("Màu Không Tồn Tại");
            expect(result).toEqual(["Màu Không Tồn Tại"]);
        });

        test('"all" should return empty array', () => {
            const result = getMatchingColors("all");
            expect(result).toEqual([]);
        });

        test('Empty string should return empty array', () => {
            const result = getMatchingColors("");
            expect(result).toEqual([]);
        });

        test('Whitespace handling', () => {
            const result = getMatchingColors(" Hồng phấn ");
            expect(result).toEqual(["Hồng phấn"]);
        });
    });

    describe('getParentColor', () => {
        
        test('Should return parent for child color', () => {
            expect(getParentColor("Hồng phấn")).toBe("Hồng");
            expect(getParentColor("Đỏ truyền thống")).toBe("Đỏ");
            expect(getParentColor("Vàng kim")).toBe("Vàng");
        });

        test('Should return parent for parent color (itself in group)', () => {
            expect(getParentColor("Hồng")).toBe("Hồng");
            expect(getParentColor("Đỏ")).toBe("Đỏ");
        });

        test('Should return null for unknown color', () => {
            expect(getParentColor("Màu Không Tồn Tại")).toBeNull();
        });
    });

    describe('isColorInGroup', () => {
        
        test('Should return true for colors in groups', () => {
            expect(isColorInGroup("Hồng")).toBe(true);
            expect(isColorInGroup("Hồng phấn")).toBe(true);
            expect(isColorInGroup("Đỏ truyền thống")).toBe(true);
            expect(isColorInGroup("Vàng kim")).toBe(true);
        });

        test('Should return true for standalone colors', () => {
            expect(isColorInGroup("Đa sắc")).toBe(true);
        });

        test('Should return false for unknown colors', () => {
            expect(isColorInGroup("Màu Không Tồn Tại")).toBe(false);
        });
    });
});

// Manual test examples (for console testing)
export function runManualTests() {
    console.log("\n=== MANUAL COLOR MAPPING TESTS ===\n");

    console.log("1. Parent 'Hồng' → All children:");
    console.log(getMatchingColors("Hồng"));
    console.log("Expected: ['Hồng', 'Hồng phấn', 'Hồng Phấn', 'Hồng đất', 'Hồng nude', ...]");

    console.log("\n2. Child 'Hồng phấn' → Exact only:");
    console.log(getMatchingColors("Hồng phấn"));
    console.log("Expected: ['Hồng phấn']");

    console.log("\n3. Parent 'Đỏ' → All children:");
    console.log(getMatchingColors("Đỏ"));
    console.log("Expected: ['Đỏ', 'Đỏ truyền thống', 'Đỏ đô', ...]");

    console.log("\n4. Child 'Đỏ truyền thống' → Exact only:");
    console.log(getMatchingColors("Đỏ truyền thống"));
    console.log("Expected: ['Đỏ truyền thống']");

    console.log("\n5. Standalone 'Đa sắc' → Itself:");
    console.log(getMatchingColors("Đa sắc"));
    console.log("Expected: ['Đa sắc']");

    console.log("\n=== FILTERING EXAMPLE ===\n");
    
    const mockProducts = [
        { id: "1", name: "Product 1", primaryColor: "Hồng" },
        { id: "2", name: "Product 2", primaryColor: "Hồng phấn" },
        { id: "3", name: "Product 3", primaryColor: "Hồng Phấn" },
        { id: "4", name: "Product 4", primaryColor: "Hồng đất" },
        { id: "5", name: "Product 5", primaryColor: "Đỏ truyền thống" },
        { id: "6", name: "Product 6", primaryColor: "Vàng kim" },
    ];

    console.log("Mock products:", mockProducts.map(p => `${p.name}: ${p.primaryColor}`));

    console.log("\n--- Filter by 'Hồng' (parent) ---");
    const hongMatches = getMatchingColors("Hồng");
    const hongFiltered = mockProducts.filter(p => 
        hongMatches.some(color => color === p.primaryColor)
    );
    console.log("Matching colors:", hongMatches);
    console.log("Filtered products:", hongFiltered.map(p => `${p.name}: ${p.primaryColor}`));
    console.log("Expected: Products 1, 2, 3, 4 (all Hồng variants)");

    console.log("\n--- Filter by 'Hồng phấn' (child) ---");
    const hongPhanMatches = getMatchingColors("Hồng phấn");
    const hongPhanFiltered = mockProducts.filter(p => 
        hongPhanMatches.some(color => color === p.primaryColor)
    );
    console.log("Matching colors:", hongPhanMatches);
    console.log("Filtered products:", hongPhanFiltered.map(p => `${p.name}: ${p.primaryColor}`));
    console.log("Expected: Product 2 ONLY (exact 'Hồng phấn')");

    console.log("\n=== END TESTS ===\n");
}

// Export for use in browser console or Node
if (typeof window !== 'undefined') {
    (window as any).testColorMapping = runManualTests;
}

