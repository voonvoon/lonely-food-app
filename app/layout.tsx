import localFont from "next/font/local";
import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/nav/Navbar";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import { Toaster } from 'react-hot-toast';


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

export const metadata: Metadata = {
  title: "The Lonely Food App",
  description: "A food ordering app to satisfy your cravings.",
    icons: {
    icon: "/food-logo.svg", // Add this line for the favicon
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <SessionProvider session={session}>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <Toaster />
          <Navbar />
          {children}
        </body>
      </html>
    </SessionProvider>
  );
}
