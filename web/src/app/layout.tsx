import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Pearlsport — Northern Uganda Sports Coverage",
    template: "%s | Pearlsport",
  },
  description:
    "Northern Uganda's premier sports news platform covering football, athletics, basketball, boxing and rugby across Lira, Lango and beyond.",
  keywords: ["sports", "football", "Uganda", "Lira", "Lango", "athletics"],
  openGraph: {
    siteName: "Pearlsport",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`} data-scroll-behavior="smooth">
      <body className="min-h-full flex flex-col overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
