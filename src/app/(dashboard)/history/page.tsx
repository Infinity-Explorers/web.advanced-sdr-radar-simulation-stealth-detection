"use client";

import React, { useState } from "react";

interface AuditLog {
  id: string;
  timestamp: string;
  event: string;
  targetId: string;
  severity: "CRITICAL" | "WARNING" | "INFO";
  details: string;
  snrDb: number;
}

export default function HistoryPage() {
  const [filterSeverity, setFilterSeverity] = useState<string>("ALL");

  const logs: AuditLog[] = [
    { id: "LOG-9021", timestamp: "22:44:12.084", event: "STEALTH TARGET LOCK", targetId: "TRK-0101", severity: "CRITICAL", details: "OS-CFAR detected target GHOST-01 at 42.8km. SNR 16.4 dB exceeds 14dB threshold.", snrDb: 16.4 },
    { id: "LOG-9020", timestamp: "22:43:58.411", event: "JAMMING STROBE DETECTED", targetId: "SYSTEM", severity: "WARNING", details: "Broadband noise strobe identified in azimuth sector 130°-145°.", snrDb: 28.2 },
    { id: "LOG-9019", timestamp: "22:42:15.920", event: "PULSE COMPRESSION ENGAGED", targetId: "SYSTEM", severity: "INFO", details: "20MHz LFM Chirp activated. Range resolution upgraded from 150m to 7.5m.", snrDb: 0.0 },
    { id: "LOG-9018", timestamp: "22:40:02.155", event: "LOW-OBS B-2 RETURN UNMASKED", targetId: "TRK-0102", severity: "CRITICAL", details: "Coherent Pulse Doppler Integration (128 pulses) unmasked RCS 0.0001 m² target.", snrDb: 11.8 },
    { id: "LOG-9017", timestamp: "22:38:44.801", event: "SDR GAIN AUTO-ADJUST", targetId: "SYSTEM", severity: "INFO", details: "Frontend gain increased to 45 dB due to low ambient noise floor.", snrDb: 0.0 },
  ];

  const filtered = logs.filter((l) => (filterSeverity === "ALL" ? true : l.severity === filterSeverity));

  return (
    <div className="flex flex-col gap-6 font-mono">
      <div className="flex justify-between items-center bg-[#161F33]/80 p-4 rounded-xl border border-[#00E5FF]/20">
        <div>
          <h1 className="text-base font-bold text-[#F8FAFC] tracking-wider uppercase">
            AUDIT & DETECTION LOGS HISTORY
          </h1>
          <p className="text-xs text-[#94A3B8]">
            Telemetry Event Log, Target Track History & SDR DSP Signal Detections
          </p>
        </div>

        <div className="flex gap-2">
          {["ALL", "CRITICAL", "WARNING", "INFO"].map((s) => (
            <button
              key={s}
              onClick={() => setFilterSeverity(s)}
              className={`px-3 py-1 text-xs rounded border transition-all ${
                filterSeverity === s
                  ? "bg-[#00E5FF]/20 border-[#00E5FF] text-[#00E5FF]"
                  : "bg-gray-800 border-gray-700 text-gray-400"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-[#161F33]/80 border border-[#00E5FF]/20 rounded-xl p-5 flex flex-col gap-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#00E5FF]/20 text-[#94A3B8] uppercase text-[10px]">
                <th className="py-3 px-3">Log ID</th>
                <th className="py-3 px-3">Timestamp</th>
                <th className="py-3 px-3">Event Type</th>
                <th className="py-3 px-3">Target / Source</th>
                <th className="py-3 px-3">Severity</th>
                <th className="py-3 px-3">SNR</th>
                <th className="py-3 px-3">Event Details</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((log) => (
                <tr key={log.id} className="border-b border-[#00E5FF]/10 hover:bg-[#0B0F19]/60 transition-colors">
                  <td className="py-3 px-3 font-bold text-[#00E5FF]">{log.id}</td>
                  <td className="py-3 px-3 text-[#94A3B8]">{log.timestamp}</td>
                  <td className="py-3 px-3 font-semibold text-[#F8FAFC]">{log.event}</td>
                  <td className="py-3 px-3 text-[#00FF88]">{log.targetId}</td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        log.severity === "CRITICAL"
                          ? "bg-[#FF3366]/20 text-[#FF3366] border-[#FF3366]/40"
                          : log.severity === "WARNING"
                          ? "bg-amber-500/20 text-amber-400 border-amber-500/40"
                          : "bg-[#00E5FF]/20 text-[#00E5FF] border-[#00E5FF]/40"
                      }`}
                    >
                      {log.severity}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-[#F8FAFC]">{log.snrDb > 0 ? `${log.snrDb} dB` : "-"}</td>
                  <td className="py-3 px-3 text-[#94A3B8]">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
