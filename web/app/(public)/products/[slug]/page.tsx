import * as React from "react";
import { notFound } from "next/navigation";
import { getProducts } from "@/lib/products";
import { Button } from "@/components/ui/button";
import { Check, Copy, ShoppingBag, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import ProductDetailClient from "./client";

interface PageProps {
    params: Promise<{
        slug: string;
    }>;
}

export default async function ProductDetailPage({ params }: PageProps) {
    const { slug } = await params;
    const products = await getProducts();
    const product = products.find((p) => p.slug === slug);

    if (!product) {
        return notFound();
    }

    return <ProductDetailClient product={product} />;
}
