import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CircuitLens — Visual circuit debugger",
  description:
    "Visual debugging for physical circuits. A workspace for beginner breadboard circuits.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
