import fs from "fs/promises";
import path from "path";
import { Product } from "@/types";

const PRODUCTS_FILE_PATH = path.join(process.cwd(), "data", "products.json");

export async function getProducts(): Promise<Product[]> {
    try {
        const data = await fs.readFile(PRODUCTS_FILE_PATH, "utf-8");
        return JSON.parse(data);
    } catch (error) {
        console.error("Error reading products data:", error);
        return [];
    }
}

export async function getProductById(id: string): Promise<Product | undefined> {
    const products = await getProducts();
    return products.find((p) => p.id === id);
}

export async function createProduct(product: Omit<Product, "id">): Promise<Product> {
    const products = await getProducts();
    const newProduct = { ...product, id: Date.now().toString() };
    products.push(newProduct);
    await fs.writeFile(PRODUCTS_FILE_PATH, JSON.stringify(products, null, 2), "utf-8");
    return newProduct;
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
    const products = await getProducts();
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) return null;

    const updatedProduct = { ...products[index], ...updates };
    products[index] = updatedProduct;
    await fs.writeFile(PRODUCTS_FILE_PATH, JSON.stringify(products, null, 2), "utf-8");
    return updatedProduct;
}

export async function deleteProduct(id: string): Promise<boolean> {
    const products = await getProducts();
    const filteredProducts = products.filter((p) => p.id !== id);
    if (filteredProducts.length === products.length) return false;

    await fs.writeFile(PRODUCTS_FILE_PATH, JSON.stringify(filteredProducts, null, 2), "utf-8");
    return true;
}
