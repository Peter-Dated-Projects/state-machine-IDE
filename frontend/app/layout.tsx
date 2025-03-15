import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@radix-ui/themes/styles.css";
import "./globals.css";
import { Theme } from "@radix-ui/themes";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "State Machine Editor",
  description: "nodes and edges for your projects lol",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{ height: "100%" }}>
      <body
        className={`${geistSans.variable} ${geistMono.variable}`}
        style={{ height: "100%", margin: 0 }}
      >
        <Theme
          accentColor="mint"
          appearance="dark"
          grayColor="auto"
          panelBackground="solid"
          radius="large"
          scaling="100%"
        >
          {children}
          {/* <ThemePanel /> */}
          {/* lol testing cool     */}
        </Theme>
      </body>
    </html>
  );
}
