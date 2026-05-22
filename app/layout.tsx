import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "School Recap",
  description: "Cùng nhìn lại hành trình học tập của bạn ~",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}