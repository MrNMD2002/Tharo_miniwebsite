import type { Metadata } from "next";
import { Montserrat, Playfair_Display, Pinyon_Script } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const pinyonScript = Pinyon_Script({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pinyon-script",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Tharo - We focus on Ao Dai",
    template: "%s | Tharo",
  },
  description: "Thương hiệu Áo Dài thiết kế cao cấp, trẻ trung và hiện đại. Tôn vinh vẻ đẹp phụ nữ Việt.",
  openGraph: {
    title: "Tharo - We focus on Ao Dai",
    description: "Thương hiệu Áo Dài thiết kế cao cấp, trẻ trung và hiện đại.",
    url: "https://tharo.vn",
    siteName: "Tharo",
    images: [
      {
        url: "https://images.unsplash.com/photo-1550920753-0a7d2b326969?q=80&w=2070&auto=format&fit=crop",
        width: 1200,
        height: 630,
      },
    ],
    locale: "vi_VN",
    type: "website",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body
        className={`${montserrat.variable} ${playfair.variable} ${pinyonScript.variable} font-sans antialiased bg-cream-50 text-burgundy-900`}
      >
        {children}
      </body>
    </html>
  );
}
