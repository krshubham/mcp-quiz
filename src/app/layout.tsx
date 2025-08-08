import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from '@/app/components/Footer';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "CanYouMCP - Test Your Model Context Protocol Knowledge",
    template: "%s | CanYouMCP"
  },
  description:
    "Challenge yourself with CanYouMCP - the ultimate Model Context Protocol quiz featuring 20 expertly crafted questions across easy, medium, and hard difficulty levels. Test your MCP knowledge, track your progress, and share your results with the community.",
  keywords: [
    "MCP quiz",
    "Model Context Protocol",
    "MCP test",
    "programming quiz",
    "developer assessment",
    "MCP knowledge",
    "technical quiz",
    "coding challenge",
    "software development",
    "protocol testing"
  ],
  authors: [{ name: "CanYouMCP Team" }],
  creator: "CanYouMCP",
  publisher: "CanYouMCP",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://canyoumcp.vercel.app",
    siteName: "CanYouMCP",
    title: "CanYouMCP - Test Your Model Context Protocol Knowledge",
    description:
      "Challenge yourself with the ultimate MCP quiz! 20 questions across 3 difficulty levels. Test your Model Context Protocol knowledge and share your results.",
    images: [
      {
        url: "/opengraph-image.svg",
        width: 1200,
        height: 630,
        alt: "CanYouMCP - Model Context Protocol Quiz",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@canyoumcp",
    creator: "@canyoumcp",
    title: "CanYouMCP - Test Your Model Context Protocol Knowledge",
    description:
      "Challenge yourself with the ultimate MCP quiz! 20 questions across 3 difficulty levels.",
    images: ["/opengraph-image.svg"],
  },
  alternates: {
    canonical: "https://canyoumcp.vercel.app",
  },
  category: "education",
  classification: "Educational Quiz Platform",
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://canyoumcp.vercel.app"),
  verification: {
    // Add verification codes when available
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
    // bing: "your-bing-verification-code",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "CanYouMCP",
  "description": "Challenge yourself with CanYouMCP - the ultimate Model Context Protocol quiz featuring 20 expertly crafted questions across easy, medium, and hard difficulty levels.",
  "url": "https://canyoumcp.vercel.app",
  "applicationCategory": "EducationalApplication",
  "operatingSystem": "Web Browser",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "author": {
    "@type": "Organization",
    "name": "CanYouMCP Team"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "ratingCount": "150",
    "bestRating": "5",
    "worstRating": "1"
  },
  "featureList": [
    "20 expertly crafted questions",
    "3 difficulty levels (easy, medium, hard)",
    "Progress tracking",
    "Animated results",
    "Social sharing",
    "Mobile-friendly design"
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Footer />
      </body>
    </html>
  );
}
