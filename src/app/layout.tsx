import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Script from 'next/script'; // Import komponen Script

const plusJakartaSans = Plus_Jakarta_Sans({ 
  subsets: ["latin"], 
  variable: '--font-plus-jakarta-sans',
});

export const metadata: Metadata = {
  title: "Welcome to dieHantar",
  description: "Your Sultan Super App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Tambahkan skrip reCAPTCHA di sini */}
        <Script 
          src="https://www.google.com/recaptcha/api.js"
          strategy="beforeInteractive"
        />
      </head>
      <body className={`${plusJakartaSans.variable} font-sans bg-zinc-950`}>
        <div className="w-full max-w-[450px] mx-auto bg-white min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
