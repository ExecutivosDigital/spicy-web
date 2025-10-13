import { PaymentSheet } from "@/components/paymentSheet";
import { ContextProviders } from "@/context/ContextProviders";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import Script from "next/script";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Models Club",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <Script id="ms_clarity" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "tkzbxgby5m");
        `}
        </Script>
      </head>
      <body className={`${poppins.variable}`}>
        <ContextProviders>
          <div className="flex h-[100svh] flex-1 flex-col overflow-hidden bg-neutral-900">
            {children}
            <PaymentSheet />
          </div>
          <Toaster
            position="top-center"
            toastOptions={{ duration: 5000, className: "z-[1000000]" }}
          />
        </ContextProviders>
      </body>
    </html>
  );
}
