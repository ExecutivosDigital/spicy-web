"use client";
import { LoadingOverlay } from "@/components/loading-overlay";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <LoadingOverlay />
      {children}
    </>
  );
}
