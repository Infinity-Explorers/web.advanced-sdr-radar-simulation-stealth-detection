"use client";

import React, { useEffect, useRef, useState } from "react";

export default function AnalyticsPage() {
  const fftCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const rcsCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const [fftSize, setFftSize] = useState<number>(2048);
  const [selectedTarget, setSelectedTarget] = useState<string>("F-35 Stealth Fighter");
  const [dopplerShiftHz, setDopplerShiftHz] = useState<number>(34666); // 10GHz @ 520m/s -> fd = 2*v*f0/c

  // Realtime FFT spectrum canvas animation
  useEffect(() => {
    const canvas = fftCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let phase = 0;

    const drawFFT = () => {
      phase += 0.05;
      const width = canvas.width;
      const height = canvas.height;

      ctx.fillStyle = "#0B0F19";
      ctx.fillRect(0, 0, width, height);

      // Draw Grid
      ctx.strokeStyle = "rgba(0, 229, 255, 0.1)";
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Base Thermal Noise Floor (-95 dBm)
      ctx.beginPath();
      ctx.strokeStyle = "rgba(0, 255, 136, 0.7)";
      ctx.lineWidth = 1.5;

      const numPoints = 128;
      const step = width / numPoints;

      for (let i = 0; i <= numPoints; i++) {
        const x = i * step;
        let y = height - 35 + (Math.sin(i * 0.4 + phase) * 4 + (Math.random() - 0.5) * 8);

        // Primary Target Doppler Peak
        const targetIdx = 78;
        if (Math.abs(i - targetIdx) < 8) {
          const gaussian = Math.exp(-Math.pow(i - targetIdx, 2) / 6);
          y -= 140 * gaussian;
        }

        // Secondary Clutter Peak
        const clutterIdx = 30;
        if (Math.abs(i - clutterIdx) < 5) {
          const gaussian = Math.exp(-Math.pow(i - clutterIdx, 2) / 4);
          y -= 45 * gaussian;
        }

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Peak Annotations
      ctx.fillStyle = "#00FF88";
      ctx.font = "10px monospace";
      ctx.fillText("TARGET DOPPLER PEAK (+34.6 kHz)", (78 * step) - 60, height - 195);

      ctx.fillStyle = "#00E5FF";
      ctx.fillText("GROUND CLUTTER (0 Hz)", (30 * step) - 40, height - 90);

      animId = requestAnimationFrame(drawFFT);
    };

    drawFFT();

    return () => cancelAnimationFrame(animId);
  }, [fftSize, dopplerShiftHz]);

  // RCS Aspect Angle Polar Plot
  useEffect(() => {
    const canvas = rcsCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const cX = w / 2;
    const cY = h / 2;
    const r = Math.min(cX, cY) - 25;

    ctx.fillStyle = "#0B0F19";
    ctx.fillRect(0, 0, w, h);

    // Polar Rings
    ctx.strokeStyle = "rgba(0, 229, 255, 0.15)";
    ctx.lineWidth = 1;
    [0.3, 0.6, 0.9].forEach((frac) => {
      ctx.beginPath();
      ctx.arc(cX, cY, r * frac, 0, Math.PI * 2);
      ctx.stroke();
    });

    // Angle Lines
    for (let a = 0; a < 360; a += 45) {
      const rad = (a * Math.PI) / 180;
      ctx.beginPath();
      ctx.moveTo(cX, cY);
      ctx.lineTo(cX + r * Math.cos(rad), cY + r * Math.sin(rad));
      ctx.stroke();
    }

    // RCS Profile shape (Nose-on stealth vs Side-broadside RCS spike)
    ctx.beginPath();
    ctx.strokeStyle = "#FF3366";
    ctx.fillStyle = "rgba(255, 51, 102, 0.15)";
    ctx.lineWidth = 2;

    for (let a = 0; a <= 360; a += 2) {
      const rad = (a * Math.PI) / 180;
      // Low nose-on (0 deg), high broadside (90, 270 deg)
      const baseRcs = 0.05 + 0.85 * Math.pow(Math.abs(Math.sin(rad)), 3);
      const radiusPoint = r * Math.min(0.95, baseRcs);
      const px = cX + radiusPoint * Math.cos(rad);
      const py = cY + radiusPoint * Math.sin(rad);

      if (a === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }, [selectedTarget]);

  return (
    <div className="flex flex-col gap-6 font-mono">
      {/* Top Title Banner */}
      <div className="flex justify-between items-center bg-[#161F33]/80 p-4 rounded-xl border border-[#00E5FF]/20">
        <div>
          <h1 className="text-base font-bold text-[#F8FAFC] tracking-wider uppercase">
            DOPPLER FFT & RADAR CROSS SECTION (RCS) ANALYTICS
          </h1>
          <p className="text-xs text-[#94A3B8]">
            Spectral Signal Processing, Pulse Doppler Integration & Target Micro-Doppler Signatures
          </p>
        </div>

        <div className="flex gap-2">
          {[1024, 2048, 4096].map((size) => (
            <button
              key={size}
              onClick={() => setFftSize(size)}
              className={`px-3 py-1 text-xs rounded border transition-all ${
                fftSize === size
                  ? "bg-[#00FF88]/20 border-[#00FF88] text-[#00FF88]"
                  : "bg-gray-800 border-gray-700 text-gray-400"
              }`}
            >
              FFT {size}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Doppler Spectrum & RCS Polar Model */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Doppler Spectrum Canvas */}
        <div className="bg-[#161F33]/80 border border-[#00E5FF]/20 rounded-xl p-5 flex flex-col gap-4">
          <div className="flex justify-between items-center border-b border-[#00E5FF]/20 pb-2">
            <h2 className="text-xs font-bold text-[#F8FAFC] uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00FF88]" />
              Real-time Doppler Spectrum (FFT)
            </h2>
            <span className="text-[10px] text-[#00E5FF]">Sampling: 100 MSps</span>
          </div>

          <div className="relative flex justify-center">
            <canvas
              ref={fftCanvasRef}
              width={500}
              height={260}
              className="w-full rounded-lg border border-[#00E5FF]/20 bg-[#0B0F19]"
            />
          </div>

          <div className="grid grid-cols-3 gap-3 text-xs bg-[#0B0F19] p-3 rounded-lg border border-[#00E5FF]/10">
            <div>
              <div className="text-[10px] text-[#94A3B8]">RADIAL VELOCITY</div>
              <div className="text-sm font-bold text-[#00FF88]">+520.0 m/s</div>
            </div>
            <div>
              <div className="text-[10px] text-[#94A3B8]">DOPPLER FREQUENCY</div>
              <div className="text-sm font-bold text-[#00E5FF]">+34.66 kHz</div>
            </div>
            <div>
              <div className="text-[10px] text-[#94A3B8]">SIGNAL SNR</div>
              <div className="text-sm font-bold text-[#F8FAFC]">16.4 dB</div>
            </div>
          </div>
        </div>

        {/* RCS Polar Aspect Plot */}
        <div className="bg-[#161F33]/80 border border-[#00E5FF]/20 rounded-xl p-5 flex flex-col gap-4">
          <div className="flex justify-between items-center border-b border-[#00E5FF]/20 pb-2">
            <h2 className="text-xs font-bold text-[#F8FAFC] uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FF3366]" />
              Stealth RCS Aspect Angle Polar Model ($m^2$)
            </h2>
            <select
              value={selectedTarget}
              onChange={(e) => setSelectedTarget(e.target.value)}
              className="bg-[#0B0F19] text-[#00E5FF] text-xs border border-[#00E5FF]/30 rounded px-2 py-1"
            >
              <option value="F-35 Stealth Fighter">F-35 (0.001 m² Nose)</option>
              <option value="B-2 Spirit">B-2 Spirit (0.0001 m² Nose)</option>
              <option value="Airliner">Airliner (10.0 m²)</option>
            </select>
          </div>

          <div className="relative flex justify-center">
            <canvas
              ref={rcsCanvasRef}
              width={260}
              height={260}
              className="rounded-full border border-[#00E5FF]/20 bg-[#0B0F19]"
            />
          </div>

          <div className="p-3 bg-[#0B0F19] rounded-lg border border-[#FF3366]/30 text-xs flex justify-between items-center">
            <div>
              <span className="text-[#FF3366] font-bold">NOSE-ON ASPECT (0°): </span>
              <span className="text-[#F8FAFC]">0.0010 $m^2$ (-30 dBsm)</span>
            </div>
            <div>
              <span className="text-[#00E5FF] font-bold">BROADSIDE ASPECT (90°): </span>
              <span className="text-[#F8FAFC]">0.8500 $m^2$ (-0.7 dBsm)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
