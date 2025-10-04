import { Locked } from "@/components/locked";
import { ContextProviders } from "@/context/ContextProviders";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Spicy",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${poppins.variable}`}>
        <ContextProviders>
          {children} <Locked />
          <Toaster
            position="top-center"
            toastOptions={{ duration: 5000, className: "z-[1000000]" }}
          />
        </ContextProviders>
      </body>
    </html>
  );
}
