"use client";

import React from "react";

export default function DocumentationPage() {
  return (
    <div className="flex flex-col gap-6 font-mono max-w-5xl">
      <div className="bg-[#161F33]/80 p-5 rounded-xl border border-[#00E5FF]/20 flex flex-col gap-2">
        <h1 className="text-lg font-bold text-[#F8FAFC] tracking-wider uppercase">
          RADAR DIGITAL TWIN ARCHITECTURE & DSP SPECIFICATIONS
        </h1>
        <p className="text-xs text-[#94A3B8]">
          Software Defined Radar (SDR) Signal Processing Pipeline, Radar Equations & Stealth Target Detection Theory
        </p>
      </div>

      {/* Radar Range Equation Card */}
      <div className="bg-[#161F33]/80 border border-[#00E5FF]/20 rounded-xl p-6 flex flex-col gap-4">
        <h2 className="text-sm font-bold text-[#00E5FF] uppercase tracking-wider border-b border-[#00E5FF]/20 pb-2">
          1. Fundamental Radar Range Equation
        </h2>
        <p className="text-xs text-[#94A3B8] leading-relaxed">
          The maximum detection range R_max of a radar system operating against a stealth target with Radar Cross Section \(\sigma\) is defined as:
        </p>
        <div className="bg-[#0B0F19] p-4 rounded-lg border border-[#00E5FF]/30 text-center font-bold text-[#00FF88] text-sm overflow-x-auto">
          {"R_max = [ (P_t * G_t * G_r * λ² * σ) / ((4π)³ * P_min * L) ] ^ (1/4)"}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs pt-2 text-[#94A3B8]">
          <div className="bg-[#0B0F19] p-2.5 rounded border border-[#00E5FF]/10">
            <span className="text-[#00E5FF] font-bold">P_t:</span> Peak Power (kW)
          </div>
          <div className="bg-[#0B0F19] p-2.5 rounded border border-[#00E5FF]/10">
            <span className="text-[#00E5FF] font-bold">G_t, G_r:</span> Antenna Gain (dB)
          </div>
          <div className="bg-[#0B0F19] p-2.5 rounded border border-[#00E5FF]/10">
            <span className="text-[#00E5FF] font-bold">λ:</span> Wavelength (3cm X-Band)
          </div>
          <div className="bg-[#0B0F19] p-2.5 rounded border border-[#00E5FF]/10">
            <span className="text-[#FF3366] font-bold">σ:</span> Target RCS (m²)
          </div>
        </div>
      </div>

      {/* DSP Pipeline Architecture */}
      <div className="bg-[#161F33]/80 border border-[#00E5FF]/20 rounded-xl p-6 flex flex-col gap-4">
        <h2 className="text-sm font-bold text-[#00FF88] uppercase tracking-wider border-b border-[#00E5FF]/20 pb-2">
          2. SDR DSP Signal Processing Pipeline
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#0B0F19] p-4 rounded-lg border border-[#00E5FF]/20 flex flex-col gap-2">
            <div className="text-xs font-bold text-[#00E5FF]">STAGE 1: RF FRONTEND & I/Q</div>
            <p className="text-[11px] text-[#94A3B8]">
              10.0 GHz RF downconversion to intermediate frequency (IF), followed by Quadrature I/Q sampling at 100 MSps.
            </p>
          </div>

          <div className="bg-[#0B0F19] p-4 rounded-lg border border-[#00E5FF]/20 flex flex-col gap-2">
            <div className="text-xs font-bold text-[#00FF88]">STAGE 2: PULSE COMPRESSION</div>
            <p className="text-[11px] text-[#94A3B8]">
              Matched filtering with Linear Frequency Modulation (LFM) chirp yielding 7.5m range resolution and high processing gain.
            </p>
          </div>

          <div className="bg-[#0B0F19] p-4 rounded-lg border border-[#00E5FF]/20 flex flex-col gap-2">
            <div className="text-xs font-bold text-[#FF3366]">STAGE 3: CFAR & TRACKING</div>
            <p className="text-[11px] text-[#94A3B8]">
              Ordered-Statistic CFAR (OS-CFAR) adaptive thresholding prevents false alarms while unmasking low-observable targets.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
