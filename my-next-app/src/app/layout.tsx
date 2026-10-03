"use client";
import localFont from "next/font/local";
import "./globals.css";

// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
import { SessionProvider } from "next-auth/react";
import { SocketProvider } from "@/contexts/SocketProvider";
import { Session } from "next-auth";
import { Toaster } from "@/components/ui/toaster";
import { LoadingProvider } from '@/context/loading-context';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({
  children,
  session,
}: Readonly<{
  children: React.ReactNode;
  session: Session | null;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <LoadingProvider>
          <SessionProvider session={session}>
            <main className="flex-grow">
              <SocketProvider>
                {children}
                {/* <ToastContainer position="top-right" autoClose={3000} /> */}
              </SocketProvider>
            </main>
            <Toaster />
          </SessionProvider>
        </LoadingProvider>
      </body>
    </html>
  );
}
