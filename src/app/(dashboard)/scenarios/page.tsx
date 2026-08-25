"use client";

import React, { useState } from "react";
import Link from "next/link";

interface Scenario {
  id: string;
  name: string;
  category: "Stealth" | "Electronic Attack" | "Low Altitude" | "Maritime";
  difficulty: "MODERATE" | "HIGH" | "EXTREME";
  description: string;
  targetsCount: number;
  environment: string;
  jammingActive: boolean;
}

export default function ScenariosPage() {
  const [selectedScenario, setSelectedScenario] = useState<string>("SCN-01");

  const scenarios: Scenario[] = [
    {
      id: "SCN-01",
      name: "Stealth Penetration Strike",
      category: "Stealth",
      difficulty: "EXTREME",
      description: "Low-observable 5th gen stealth fighters approaching under heavy ground clutter. Test CFAR sensitivity and Pulse Integration.",
      targetsCount: 3,
      environment: "Heavy Ground Clutter, Rain Attenuation",
      jammingActive: false,
    },
    {
      id: "SCN-02",
      name: "Stand-off Noise & Spot Jamming",
      category: "Electronic Attack",
      difficulty: "HIGH",
      description: "Active EW aircraft transmitting high-power spot jamming noise across X-Band spectrum. Test Frequency Agility.",
      targetsCount: 5,
      environment: "Dense Standoff Jamming Strobe",
      jammingActive: true,
    },
    {
      id: "SCN-03",
      name: "Swarm UAV Incursion",
      category: "Low Altitude",
      difficulty: "MODERATE",
      description: "Multiple micro-UAVs operating at low velocity and small RCS. Requires Moving Target Indicator (MTI) filtering.",
      targetsCount: 12,
      environment: "Urban Micro-Doppler Environment",
      jammingActive: false,
    },
    {
      id: "SCN-04",
      name: "Hypersonic Glide Vehicle Track",
      category: "Stealth",
      difficulty: "EXTREME",
      description: "Mach 7+ plasma-sheathed glide target at high altitude. Doppler tracking across extreme frequency shifts.",
      targetsCount: 1,
      environment: "Stratospheric Low Noise",
      jammingActive: false,
    },
  ];

  const current = scenarios.find((s) => s.id === selectedScenario) || scenarios[0];

  return (
    <div className="flex flex-col gap-6 font-mono">
      <div className="flex justify-between items-center bg-[#161F33]/80 p-4 rounded-xl border border-[#00E5FF]/20">
        <div>
          <h1 className="text-base font-bold text-[#F8FAFC] tracking-wider uppercase">
            RADAR MISSION SCENARIOS & PRESETS
          </h1>
          <p className="text-xs text-[#94A3B8]">
            Tactical Environment Presets for SDR DSP Benchmarking & Stealth Detection Testing
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Scenario List */}
        <div className="flex flex-col gap-3">
          {scenarios.map((s) => (
            <button
              key={s.id}
              onClick={() => setSelectedScenario(s.id)}
              className={`p-4 rounded-xl border text-left transition-all flex flex-col gap-2 ${
                selectedScenario === s.id
                  ? "bg-[#00E5FF]/15 border-[#00E5FF] shadow-[0_0_15px_rgba(0,229,255,0.15)]"
                  : "bg-[#161F33]/80 border-[#00E5FF]/20 hover:border-[#00E5FF]/40"
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-[#00E5FF]">{s.id}</span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded font-bold border ${
                    s.difficulty === "EXTREME"
                      ? "bg-[#FF3366]/20 text-[#FF3366] border-[#FF3366]/40"
                      : s.difficulty === "HIGH"
                      ? "bg-amber-500/20 text-amber-400 border-amber-500/40"
                      : "bg-[#00FF88]/20 text-[#00FF88] border-[#00FF88]/40"
                  }`}
                >
                  {s.difficulty}
                </span>
              </div>
              <div className="text-sm font-bold text-[#F8FAFC]">{s.name}</div>
              <div className="text-xs text-[#94A3B8] line-clamp-2">{s.description}</div>
            </button>
          ))}
        </div>

        {/* Selected Scenario Details & Launch Action */}
        <div className="lg:col-span-2 bg-[#161F33]/80 border border-[#00E5FF]/20 rounded-xl p-6 flex flex-col justify-between gap-6">
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-start border-b border-[#00E5FF]/20 pb-4">
              <div>
                <div className="text-xs text-[#00E5FF] font-bold uppercase">{current.category} MISSION</div>
                <h2 className="text-xl font-bold text-[#F8FAFC]">{current.name}</h2>
              </div>
              <span className="text-xs bg-[#0B0F19] px-3 py-1.5 rounded-lg border border-[#00E5FF]/30 text-[#00FF88]">
                {current.targetsCount} TARGETS INCLUDED
              </span>
            </div>

            <p className="text-sm text-[#94A3B8] leading-relaxed">{current.description}</p>

            <div className="grid grid-cols-2 gap-4 mt-2">
              <div className="bg-[#0B0F19] p-3 rounded-lg border border-[#00E5FF]/20 text-xs">
                <div className="text-[#94A3B8] text-[10px] uppercase">ENVIRONMENTAL CONDITIONS</div>
                <div className="text-[#F8FAFC] font-semibold mt-1">{current.environment}</div>
              </div>
              <div className="bg-[#0B0F19] p-3 rounded-lg border border-[#00E5FF]/20 text-xs">
                <div className="text-[#94A3B8] text-[10px] uppercase">ELECTRONIC COUNTERMEASURES</div>
                <div className="text-[#F8FAFC] font-semibold mt-1">
                  {current.jammingActive ? "ACTIVE NOISE JAMMING" : "NONE (CLEAN RF)"}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 pt-4 border-t border-[#00E5FF]/20">
            <Link
              href="/simulation"
              className="flex-1 py-3 px-4 rounded-xl bg-[#00FF88]/20 text-[#00FF88] border border-[#00FF88]/40 hover:bg-[#00FF88]/30 transition-all font-bold text-center text-xs tracking-wider uppercase shadow-[0_0_20px_rgba(0,255,136,0.15)]"
            >
              LAUNCH SCENARIO IN PPI SCOPE →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
