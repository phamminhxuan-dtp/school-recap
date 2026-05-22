import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "School Recap ✨",
  description: "Spotify Wrapped for students",
  openGraph: {
    title: "School Recap ✨",
    description: "Nhìn lại hành trình một năm học 📚",
    siteName: "School Recap",
  },
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