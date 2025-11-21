import { MetadataRoute } from "next";
import { COLLECTIONS, PRODUCTS } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = "https://tharo.vn";

    const collectionUrls = COLLECTIONS.map((collection) => ({
        url: `${baseUrl}/collections/${collection.slug}`,
        lastModified: new Date(),
    }));

    const productUrls = PRODUCTS.map((product) => ({
        url: `${baseUrl}/products/${product.slug}`,
        lastModified: new Date(),
    }));

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
        },
        {
            url: `${baseUrl}/collections`,
            lastModified: new Date(),
        },
        {
            url: `${baseUrl}/lookbook`,
            lastModified: new Date(),
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: new Date(),
        },
        ...collectionUrls,
        ...productUrls,
    ];
}
