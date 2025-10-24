import type { Metadata } from "next";
import { Pixelify_Sans } from "next/font/google";
import "./globals.css";
import AuthProvider from "./authprovider";
import Navbar from "./navbar";

const globalFont = Pixelify_Sans({ subsets: ["latin"]});

export const metadata: Metadata = {
  title: "Survival of the Fittest",
  description: "sotf",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={globalFont.className}>
        <AuthProvider>
          <Navbar/>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
