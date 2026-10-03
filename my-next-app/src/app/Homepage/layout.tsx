import type { Metadata } from "next";
import localFont from "next/font/local";
import { Navbar } from "@/components/navbar/page";
import { Footer } from "@/components/footer/page";
import "../globals.css";

const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "TechHire",
  description: "The best IAAS platform for your business.",
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
      <>
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
        </>
  )
}