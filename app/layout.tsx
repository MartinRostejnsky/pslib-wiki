import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import {ClerkProvider} from "@clerk/nextjs";
import AppSidebar from "@/components/sidebar/AppSidebar";
import {SidebarInset, SidebarProvider} from "@/components/ui/sidebar";
import {dark} from "@clerk/themes";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Create Next App",
    description: "Generated by create next app",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ClerkProvider
            appearance={{
                baseTheme: dark
            }}>
            <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased dark bg-background`}
            >
            <SidebarProvider>
                <AppSidebar/>
                <SidebarInset>
                    {children}
                </SidebarInset>
            </SidebarProvider>
            </body>
            </html>
        </ClerkProvider>
    );
}
