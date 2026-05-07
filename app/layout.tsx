import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const nabuImage =
  "https://res.cloudinary.com/dcmj7quyv/image/upload/v1778150171/Frame_8_qxwqha.png";
  

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
    default: "Nabu",
    template: "%s | Nabu",
  },
  description:
    "Nabu is a home companion robot designed to support everyday routines, demos, setup, and household assistance.",
  applicationName: "Nabu",
  openGraph: {
    title: "Nabu",
    description:
      "Meet Nabu, the home companion robot designed for everyday household support.",
    siteName: "Nabu",
    images: [
      {
        url: nabuImage,
        alt: "Nabu home companion robot branding",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nabu",
    description:
      "Meet Nabu, the home companion robot designed for everyday household support.",
    images: [nabuImage],
  },
  icons: {
    icon: nabuImage,
    shortcut: nabuImage,
    apple: nabuImage,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body id="page-top" className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
