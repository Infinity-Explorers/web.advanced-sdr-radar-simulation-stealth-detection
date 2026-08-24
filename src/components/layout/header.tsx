"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Header() {
  const pathname = usePathname();

  const navItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Scenarios", href: "/scenarios" },
    { label: "Simulation", href: "/simulation" },
    { label: "Analytics", href: "/analytics" },
    { label: "History", href: "/history" },
    { label: "Documentation", href: "/documentation" },
  ];

  return (
    <header className="h-16 border-b border-[#00E5FF]/20 bg-[#161F33]/90 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-50 shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
      {/* Brand & System Status */}
      <div className="flex items-center gap-3">
        <div className="relative flex items-center justify-center">
          <div className="w-3.5 h-3.5 rounded-full bg-[#00FF88] animate-ping opacity-75" />
          <div className="absolute w-2.5 h-2.5 rounded-full bg-[#00FF88] shadow-[0_0_10px_#00FF88]" />
        </div>
        <Link href="/dashboard" className="flex flex-col">
          <span className="font-mono font-bold text-sm tracking-wider uppercase text-[#F8FAFC]">
            RADAR DIGITAL TWIN
          </span>
          <span className="font-mono text-[10px] text-[#00E5FF] tracking-widest uppercase">
            SDR & STEALTH DETECTION
          </span>
        </Link>
      </div>

      {/* Navigation Bar */}
      <nav className="flex items-center gap-1 font-mono text-xs">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3 py-1.5 rounded-md transition-all uppercase tracking-wide font-medium ${
                isActive
                  ? "bg-[#00FF88]/10 text-[#00FF88] border border-[#00FF88]/40 shadow-[0_0_12px_rgba(0,255,136,0.2)]"
                  : "text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#0B0F19]/50"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Telemetry Status Indicator */}
      <div className="flex items-center gap-4 font-mono text-xs">
        <div className="hidden lg:flex items-center gap-3 text-[11px] text-[#94A3B8] bg-[#0B0F19]/60 px-3 py-1 rounded-md border border-[#00E5FF]/20">
          <span>
            FREQ: <span className="text-[#00E5FF] font-semibold">10.0 GHz</span>
          </span>
          <span className="text-zinc-700">|</span>
          <span>
            GAIN: <span className="text-[#00FF88] font-semibold">45 dB</span>
          </span>
        </div>

        <span className="px-2.5 py-1 rounded text-[11px] font-semibold tracking-wider bg-[#00FF88]/10 text-[#00FF88] border border-[#00FF88]/30 shadow-[0_0_8px_rgba(0,255,136,0.2)]">
          GRID ONLINE
        </span>
      </div>
    </header>
  );
}
