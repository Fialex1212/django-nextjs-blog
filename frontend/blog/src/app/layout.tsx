import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Blog",
  description: "Blog app using Django&Next.js",
};

// export const metadata: Metadata = {
//   metadataBase: new URL(siteMetadata.url),
//   alternates: {
//       canonical: '/',
//   },
//   verification: {
//       google: siteMetadata.googleVerification,
//   },
//   title: siteMetadata.title,
//   description: siteMetadata.description,
//   openGraph: {
//       url: siteMetadata.url,
//       siteName: siteMetadata.name,
//       locale: "uk_UA",
//       type: "website",
//       images: {
//           url: siteMetadata.image.url,
//           width: 500,
//           height: 500,
//           alt: siteMetadata.image.alt,
//       },
//   },
//   robots: {
//       index: true,
//       follow: false,
//       nocache: true,
//       googleBot: {
//           index: true,
//           follow: false,
//           noimageindex: true,
//           "max-video-preview": -1,
//           "max-image-preview": "large",
//           "max-snippet": -1,
//       },
//   },
//   twitter: {
//       card: "summary_large_image",
//       title: siteMetadata.title,
//       description: siteMetadata.description,
//       images: siteMetadata.image.url,
//   },
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-300`}
      >
        <Toaster theme="dark" richColors position="top-center" />
        {children}
      </body>
    </html>
  );
}
