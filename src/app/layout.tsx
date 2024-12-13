import { Inter } from "next/font/google";
import './globals.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import React from "react";
import Header from "@/components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "Du lịch",
    description: "hehe",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <body className={inter.className}>
        <Header />
            {children}
        </body>
        </html>
    );
}
