import type { Metadata } from "next";
import "./globals.css";
import { MenuProvider } from "@/contexts/MenuContext";
import { CartProvider } from "@/contexts/CartContext";

export const metadata: Metadata = {
  title: "Menu - Projeto Next.js",
  description: "Projeto Menu criado com Next.js e Tailwind CSS",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-sans">
        <MenuProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </MenuProvider>
      </body>
    </html>
  );
}
