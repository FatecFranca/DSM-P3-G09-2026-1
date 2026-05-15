import type { Metadata }
  from "next";

import {
  Inter,
  Rajdhani
} from "next/font/google";

import "./globals.css";

import {
  LayoutWrapper
} from "@/components/layoutWrapper";

const inter = Inter({
  weight: ["300", "400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-inter",
});

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-rajdhani",
});

export const metadata: Metadata = {
  title: "Auto Stock Control",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html
      lang="pt-BR"
      className={`
        ${inter.variable}
        ${rajdhani.variable}
      `}
    >

      <body
        className={`
          ${inter.className}
          text-zinc-300
          antialiased
        `}
      >

        <LayoutWrapper>

          {children}

        </LayoutWrapper>

      </body>

    </html>
  );
}