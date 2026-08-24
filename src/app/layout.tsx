import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Radar Digital Twin - SDR Simulation & Stealth Detection",
  description: "Advanced Software-Defined Radio Radar Simulation & Counter-Stealth Detection Grid",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#0B0F19] text-[#F8FAFC] min-h-screen antialiased selection:bg-[#00FF88]/30 selection:text-[#00FF88]">
        {children}
      </body>
    </html>
  );
}
