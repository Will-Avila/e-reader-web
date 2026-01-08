import type { Metadata } from "next";
import { VT323, Roboto, Merriweather, Open_Sans } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const vt323 = VT323({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-vt323',
});

const roboto = Roboto({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-roboto',
});

const merriweather = Merriweather({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-merriweather',
});

const openSans = Open_Sans({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-opensans',
});

export const metadata: Metadata = {
  title: "PixelReader",
  description: "Leitor de EPUB minimalista",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${vt323.variable} ${roboto.variable} ${merriweather.variable} ${openSans.variable} antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
