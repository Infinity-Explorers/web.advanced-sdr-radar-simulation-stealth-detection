"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Sidebar() {
  const pathname = usePathname();

  const links = [
    { label: "Dashboard", href: "/dashboard", desc: "System Status & Overview" },
    { label: "Scenarios", href: "/scenarios", desc: "Mission Presets & Targets" },
    { label: "Simulation", href: "/simulation", desc: "Realtime PPI Radar Scope" },
    { label: "Analytics", href: "/analytics", desc: "Doppler FFT & Stealth RCS" },
    { label: "History", href: "/history", desc: "Audit & Detection Logs" },
    { label: "Documentation", href: "/documentation", desc: "Architecture & Specs" },
  ];

  return (
    <aside className="w-64 bg-[#161F33]/80 border-r border-[#00E5FF]/20 p-4 flex flex-col justify-between font-mono text-xs text-[#94A3B8] min-h-[calc(100vh-4rem)]">
      <div className="flex flex-col gap-4">
        <div className="text-[10px] tracking-widest text-[#00E5FF] uppercase font-semibold px-2">
          OPERATIONAL MODULES
        </div>

        <nav className="flex flex-col gap-1.5">
          {links.map((link) => {
            const isActive = pathname === link.href || pathname?.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`p-2.5 rounded-lg transition-all flex flex-col gap-0.5 border ${
                  isActive
                    ? "bg-[#00FF88]/10 text-[#00FF88] border-[#00FF88]/40 shadow-[0_0_10px_rgba(0,255,136,0.15)]"
                    : "border-transparent hover:bg-[#0B0F19]/60 hover:text-[#F8FAFC]"
                }`}
              >
                <div className="flex justify-between items-center font-bold tracking-wide uppercase">
                  <span>{link.label}</span>
                  <span className="text-[10px]">{isActive ? "●" : "→"}</span>
                </div>
                <span className="text-[10px] text-[#94A3B8] font-normal">{link.desc}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Info Box */}
      <div className="p-3 rounded-lg bg-[#0B0F19]/80 border border-[#00E5FF]/20 flex flex-col gap-1 text-[11px]">
        <div className="flex items-center justify-between text-[#00FF88] font-semibold">
          <span>SDR DSP CORE</span>
          <span className="text-[9px] px-1 rounded bg-[#00FF88]/20 text-[#00FF88]">ACTIVE</span>
        </div>
        <div className="text-[#94A3B8] text-[10px]">Sampling: 100.0 MSps</div>
        <div className="text-[#94A3B8] text-[10px]">FFT Size: 4096 Points</div>
      </div>
    </aside>
  );
}
