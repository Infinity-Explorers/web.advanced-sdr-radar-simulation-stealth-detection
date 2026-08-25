"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

interface Target {
  id: string;
  callsign: string;
  type: "Stealth Fighter" | "Bomber" | "Commercial" | "Hypersonic" | "UAV";
  range: number; // km
  azimuth: number; // deg
  altitude: number; // m
  velocity: number; // m/s
  rcs: number; // m^2
  detected: boolean;
  snr: number; // dB
}

export default function DashboardPage() {
  const [sdrActive, setSdrActive] = useState(true);
  const [pulseCompression, setPulseCompression] = useState(true);
  const [cfarThreshold, setCfarThreshold] = useState(14); // dB
  const [activeTab, setActiveTab] = useState<"all" | "stealth" | "detected">("all");

  const [targets, setTargets] = useState<Target[]>([
    { id: "TRK-0101", callsign: "GHOST-01", type: "Stealth Fighter", range: 42.8, azimuth: 45, altitude: 11200, velocity: 520, rcs: 0.001, detected: true, snr: 16.4 },
    { id: "TRK-0102", callsign: "SHADOW-99", type: "Bomber", range: 88.3, azimuth: 135, altitude: 14500, velocity: 280, rcs: 0.0001, detected: false, snr: 7.2 },
    { id: "TRK-0103", callsign: "AIR-404", type: "Commercial", range: 65.0, azimuth: 270, altitude: 9800, velocity: 240, rcs: 10.0, detected: true, snr: 34.1 },
    { id: "TRK-0104", callsign: "HYPER-X", type: "Hypersonic", range: 115.2, azimuth: 310, altitude: 28000, velocity: 1950, rcs: 0.05, detected: true, snr: 19.8 },
    { id: "TRK-0105", callsign: "DRONE-SWARM-A", type: "UAV", range: 18.5, azimuth: 195, altitude: 1500, velocity: 65, rcs: 0.01, detected: true, snr: 22.5 },
  ]);

  // Simulate real-time update
  useEffect(() => {
    const interval = setInterval(() => {
      setTargets((prev) =>
        prev.map((t) => {
          const deltaAzimuth = (t.velocity / (t.range * 1000)) * (180 / Math.PI) * 0.1;
          const newAzimuth = (t.azimuth + deltaAzimuth) % 360;
          const noise = (Math.random() - 0.5) * 0.4;
          const newSnr = Math.max(0, +(t.snr + noise).toFixed(1));
          return {
            ...t,
            azimuth: +newAzimuth.toFixed(1),
            snr: newSnr,
            detected: newSnr >= cfarThreshold,
          };
        })
      );
    }, 1000);
    return () => clearInterval(interval);
  }, [cfarThreshold]);

  const filteredTargets = targets.filter((t) => {
    if (activeTab === "stealth") return t.rcs <= 0.01;
    if (activeTab === "detected") return t.detected;
    return true;
  });

  const totalTargets = targets.length;
  const detectedCount = targets.filter((t) => t.detected).length;
  const stealthCount = targets.filter((t) => t.rcs <= 0.01).length;

  return (
    <div className="flex flex-col gap-6 font-mono">
      {/* Top Banner Status */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#161F33]/80 border border-[#00E5FF]/30 p-4 rounded-xl flex flex-col justify-between shadow-[0_0_15px_rgba(0,229,255,0.05)]">
          <div className="text-[10px] text-[#94A3B8] uppercase tracking-wider">SDR CORE STATUS</div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xl font-bold text-[#F8FAFC]">
              {sdrActive ? "ONLINE" : "STANDBY"}
            </span>
            <span className={`w-3 h-3 rounded-full ${sdrActive ? "bg-[#00FF88] shadow-[0_0_10px_#00FF88]" : "bg-red-500"}`} />
          </div>
          <div className="text-[10px] text-[#00E5FF] mt-2">10.0 GHz X-Band FMCW</div>
        </div>

        <div className="bg-[#161F33]/80 border border-[#00E5FF]/30 p-4 rounded-xl flex flex-col justify-between shadow-[0_0_15px_rgba(0,229,255,0.05)]">
          <div className="text-[10px] text-[#94A3B8] uppercase tracking-wider">TRACKED TARGETS</div>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-bold text-[#00FF88]">{detectedCount} / {totalTargets}</span>
            <span className="text-xs text-[#94A3B8]">({stealthCount} Low-Obs)</span>
          </div>
          <div className="text-[10px] text-[#94A3B8] mt-2">CFAR Detection Rate: {((detectedCount / totalTargets) * 100).toFixed(0)}%</div>
        </div>

        <div className="bg-[#161F33]/80 border border-[#00E5FF]/30 p-4 rounded-xl flex flex-col justify-between shadow-[0_0_15px_rgba(0,229,255,0.05)]">
          <div className="text-[10px] text-[#94A3B8] uppercase tracking-wider">CFAR SENSITIVITY</div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-2xl font-bold text-[#00E5FF]">{cfarThreshold} dB</span>
            <input
              type="range"
              min="6"
              max="24"
              value={cfarThreshold}
              onChange={(e) => setCfarThreshold(Number(e.target.value))}
              className="w-24 accent-[#00E5FF]"
            />
          </div>
          <div className="text-[10px] text-[#94A3B8] mt-2">OS-CFAR Noise Estimation</div>
        </div>

        <div className="bg-[#161F33]/80 border border-[#00E5FF]/30 p-4 rounded-xl flex flex-col justify-between shadow-[0_0_15px_rgba(0,229,255,0.05)]">
          <div className="text-[10px] text-[#94A3B8] uppercase tracking-wider">PULSE COMPRESSION</div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-lg font-bold text-[#F8FAFC]">{pulseCompression ? "CHIRP 20MHz" : "OFF"}</span>
            <button
              onClick={() => setPulseCompression(!pulseCompression)}
              className={`px-3 py-1 text-xs rounded border transition-all ${
                pulseCompression
                  ? "bg-[#00FF88]/20 border-[#00FF88] text-[#00FF88]"
                  : "bg-gray-800 border-gray-600 text-gray-400"
              }`}
            >
              TOGGLE
            </button>
          </div>
          <div className="text-[10px] text-[#00FF88] mt-2">Range Res: {pulseCompression ? "7.5 m" : "150 m"}</div>
        </div>
      </div>

      {/* Main Grid: Realtime Threat Matrix & Quick Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Targets Table */}
        <div className="lg:col-span-2 bg-[#161F33]/80 border border-[#00E5FF]/20 rounded-xl p-5 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-[#00E5FF]/20 pb-3">
            <div>
              <h2 className="text-sm font-bold text-[#F8FAFC] tracking-wider uppercase flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#00FF88]" />
                Target Tracking Matrix
              </h2>
              <p className="text-[11px] text-[#94A3B8]">Real-time kinematic state & Radar Cross Section (RCS)</p>
            </div>

            <div className="flex items-center gap-1 text-xs bg-[#0B0F19] p-1 rounded-lg border border-[#00E5FF]/20">
              <button
                onClick={() => setActiveTab("all")}
                className={`px-3 py-1 rounded-md transition-all ${activeTab === "all" ? "bg-[#00E5FF]/20 text-[#00E5FF]" : "text-[#94A3B8]"}`}
              >
                ALL ({targets.length})
              </button>
              <button
                onClick={() => setActiveTab("stealth")}
                className={`px-3 py-1 rounded-md transition-all ${activeTab === "stealth" ? "bg-[#FF3366]/20 text-[#FF3366]" : "text-[#94A3B8]"}`}
              >
                STEALTH ({stealthCount})
              </button>
              <button
                onClick={() => setActiveTab("detected")}
                className={`px-3 py-1 rounded-md transition-all ${activeTab === "detected" ? "bg-[#00FF88]/20 text-[#00FF88]" : "text-[#94A3B8]"}`}
              >
                DETECTED ({detectedCount})
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#00E5FF]/10 text-[#94A3B8] uppercase text-[10px]">
                  <th className="py-2.5 px-3">Track ID</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Range (km)</th>
                  <th className="py-2.5 px-3">Azimuth</th>
                  <th className="py-2.5 px-3">Speed (m/s)</th>
                  <th className="py-2.5 px-3">RCS ($m^2$)</th>
                  <th className="py-2.5 px-3">SNR</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredTargets.map((t) => (
                  <tr key={t.id} className="border-b border-[#00E5FF]/10 hover:bg-[#0B0F19]/60 transition-colors">
                    <td className="py-3 px-3 font-semibold text-[#00E5FF]">{t.id}</td>
                    <td className="py-3 px-3 text-[#F8FAFC]">
                      <div>{t.callsign}</div>
                      <div className="text-[10px] text-[#94A3B8]">{t.type}</div>
                    </td>
                    <td className="py-3 px-3 text-[#F8FAFC]">{t.range} km</td>
                    <td className="py-3 px-3 text-[#F8FAFC]">{t.azimuth}°</td>
                    <td className="py-3 px-3 text-[#F8FAFC]">{t.velocity} m/s</td>
                    <td className="py-3 px-3">
                      <span className={`font-mono ${t.rcs <= 0.001 ? "text-[#FF3366] font-bold" : "text-[#94A3B8]"}`}>
                        {t.rcs} $m^2$
                      </span>
                    </td>
                    <td className="py-3 px-3 text-[#00FF88]">{t.snr} dB</td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                          t.detected
                            ? "bg-[#00FF88]/10 text-[#00FF88] border-[#00FF88]/30"
                            : "bg-[#FF3366]/10 text-[#FF3366] border-[#FF3366]/30 animate-pulse"
                        }`}
                      >
                        {t.detected ? "LOCKED" : "UNRESOLVED"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions & Live Tactical Radar Preview */}
        <div className="flex flex-col gap-6">
          <div className="bg-[#161F33]/80 border border-[#00E5FF]/20 rounded-xl p-5 flex flex-col gap-4">
            <h3 className="text-sm font-bold text-[#F8FAFC] uppercase tracking-wider border-b border-[#00E5FF]/20 pb-2">
              SDR Tactical Controls
            </h3>
            
            <div className="flex flex-col gap-3">
              <button
                onClick={() => setSdrActive(!sdrActive)}
                className={`w-full py-2.5 px-4 rounded-lg font-bold text-xs uppercase tracking-wider transition-all border ${
                  sdrActive
                    ? "bg-[#FF3366]/10 text-[#FF3366] border-[#FF3366]/40 hover:bg-[#FF3366]/20"
                    : "bg-[#00FF88]/10 text-[#00FF88] border-[#00FF88]/40 hover:bg-[#00FF88]/20"
                }`}
              >
                {sdrActive ? "EMERGENCY SDR MUTE" : "START RADAR EMISSION"}
              </button>

              <Link
                href="/simulation"
                className="w-full py-2.5 px-4 rounded-lg font-bold text-xs uppercase tracking-wider text-center bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/40 hover:bg-[#00E5FF]/20 transition-all"
              >
                OPEN REAL-TIME PPI SCOPE →
              </Link>

              <Link
                href="/analytics"
                className="w-full py-2.5 px-4 rounded-lg font-bold text-xs uppercase tracking-wider text-center bg-[#161F33] text-[#F8FAFC] border border-[#00E5FF]/20 hover:border-[#00E5FF]/50 transition-all"
              >
                DOPPLER FFT ANALYTICS →
              </Link>
            </div>
          </div>

          <div className="bg-[#161F33]/80 border border-[#00E5FF]/20 rounded-xl p-5 flex flex-col gap-3">
            <div className="flex justify-between items-center text-xs">
              <span className="text-[#94A3B8] font-bold uppercase">STEALTH THREAT ALERTS</span>
              <span className="text-[10px] text-[#FF3366] px-2 py-0.5 rounded bg-[#FF3366]/10 border border-[#FF3366]/30">HIGH ALERT</span>
            </div>
            
            <div className="p-3 bg-[#0B0F19] rounded-lg border border-[#FF3366]/30 flex flex-col gap-1 text-xs">
              <div className="flex justify-between font-bold text-[#FF3366]">
                <span>SHADOW-99 (B-2 Spirit)</span>
                <span>RCS: 0.0001 $m^2$</span>
              </div>
              <p className="text-[11px] text-[#94A3B8]">
                Low Observable return below current CFAR threshold. Pulse Doppler integration required to unmask.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
