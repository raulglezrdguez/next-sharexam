import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import localFont from "next/font/local";
import { Providers } from "./providers";
import { Toaster } from "@/components/ui/sonner";

const geist = localFont({
  src: "../public/fonts/Geist.ttf",
});
const geistMono = localFont({
  src: "../public/fonts/GeistMono.ttf",
});

export const metadata: Metadata = {
  title: "Sharexam",
  description: "Professional community for sharing exams",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geist.className} ${geistMono.className} antialiased`}>
        <Providers>
          <Navbar />
          {children}
          <Toaster position="top-center" richColors duration={3000} />
        </Providers>
      </body>
    </html>
  );
}
