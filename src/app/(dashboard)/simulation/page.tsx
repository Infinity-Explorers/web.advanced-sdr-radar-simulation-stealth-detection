"use client";

import React, { useEffect, useRef, useState } from "react";

interface Target {
  id: string;
  name: string;
  type: string;
  rangeKm: number;
  azimuthDeg: number;
  speedMs: number;
  rcsM2: number;
  isStealth: boolean;
}

export default function SimulationPage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // SDR Controls State
  const [maxRangeKm, setMaxRangeKm] = useState<number>(100);
  const [sweepSpeed, setSweepSpeed] = useState<number>(1.5); // rpm factor
  const [gainDb, setGainDb] = useState<number>(45);
  const [showGrids, setShowGrids] = useState<boolean>(true);
  const [jammingNoise, setJammingNoise] = useState<boolean>(false);
  const [selectedTarget, setSelectedTarget] = useState<Target | null>(null);

  const targets: Target[] = [
    { id: "T-01", name: "GHOST-01 (F-35)", type: "Stealth Fighter", rangeKm: 35, azimuthDeg: 42, speedMs: 480, rcsM2: 0.001, isStealth: true },
    { id: "T-02", name: "SHADOW-99 (B-2)", type: "Low-Obs Bomber", rangeKm: 72, azimuthDeg: 140, speedMs: 250, rcsM2: 0.0001, isStealth: true },
    { id: "T-03", name: "CIV-884", type: "Airbus A350", rangeKm: 58, azimuthDeg: 285, speedMs: 240, rcsM2: 12.0, isStealth: false },
    { id: "T-04", name: "DRONE-ALPHA", type: "Reaper UAV", rangeKm: 22, azimuthDeg: 205, speedMs: 90, rcsM2: 0.05, isStealth: false },
    { id: "T-05", name: "HYPER-FLIGHT", type: "Hypersonic Glider", rangeKm: 85, azimuthDeg: 330, speedMs: 1800, rcsM2: 0.02, isStealth: true },
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let angleRad = 0;
    let animationId: number;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      const cX = width / 2;
      const cY = height / 2;
      const radius = Math.min(cX, cY) - 20;

      // Subtle phosphor decay (trailing sweep effect)
      ctx.fillStyle = "rgba(11, 15, 25, 0.12)";
      ctx.fillRect(0, 0, width, height);

      // Draw Grid & Range Rings
      if (showGrids) {
        ctx.strokeStyle = "rgba(0, 229, 255, 0.15)";
        ctx.lineWidth = 1;

        // Outer Scope Ring
        ctx.beginPath();
        ctx.arc(cX, cY, radius, 0, Math.PI * 2);
        ctx.stroke();

        // Intermediate Range Rings (4 rings)
        [0.25, 0.5, 0.75].forEach((frac) => {
          ctx.beginPath();
          ctx.arc(cX, cY, radius * frac, 0, Math.PI * 2);
          ctx.stroke();

          // Range Label
          ctx.fillStyle = "rgba(0, 229, 255, 0.5)";
          ctx.font = "10px monospace";
          ctx.fillText(`${(maxRangeKm * frac).toFixed(0)} km`, cX + 5, cY - radius * frac + 12);
        });

        // Crosshairs
        ctx.beginPath();
        ctx.moveTo(cX - radius, cY);
        ctx.lineTo(cX + radius, cY);
        ctx.moveTo(cX, cY - radius);
        ctx.lineTo(cX, cY + radius);
        ctx.stroke();

        // Azimuth ticks (every 30 deg)
        for (let a = 0; a < 360; a += 30) {
          const rad = (a * Math.PI) / 180;
          const x1 = cX + (radius - 8) * Math.sin(rad);
          const y1 = cY - (radius - 8) * Math.cos(rad);
          const x2 = cX + radius * Math.sin(rad);
          const y2 = cY - radius * Math.cos(rad);
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();

          ctx.fillStyle = "rgba(0, 255, 136, 0.7)";
          ctx.font = "9px monospace";
          const tx = cX + (radius + 10) * Math.sin(rad) - 8;
          const ty = cY - (radius + 10) * Math.cos(rad) + 3;
          ctx.fillText(`${a}°`, tx, ty);
        }
      }

      // Jamming noise effect
      if (jammingNoise) {
        for (let i = 0; i < 200; i++) {
          const r = Math.random() * radius;
          const a = Math.random() * Math.PI * 2;
          const nx = cX + r * Math.cos(a);
          const ny = cY + r * Math.sin(a);
          ctx.fillStyle = `rgba(255, 51, 102, ${Math.random() * 0.4})`;
          ctx.fillRect(nx, ny, 2, 2);
        }
      }

      // Sweep Beam Line & Gradient Sector
      angleRad = (angleRad + (0.015 * sweepSpeed)) % (Math.PI * 2);
      const sweepX = cX + radius * Math.sin(angleRad);
      const sweepY = cY - radius * Math.cos(angleRad);

      // Sector Gradient (Phosphor beam cone)
      const sectorGradient = ctx.createConicGradient(angleRad - Math.PI / 2, cX, cY);
      sectorGradient.addColorStop(0, "rgba(0, 255, 136, 0.25)");
      sectorGradient.addColorStop(0.1, "rgba(0, 255, 136, 0.05)");
      sectorGradient.addColorStop(0.2, "transparent");

      ctx.fillStyle = sectorGradient;
      ctx.beginPath();
      ctx.moveTo(cX, cY);
      ctx.arc(cX, cY, radius, angleRad - Math.PI / 2 - 0.4, angleRad - Math.PI / 2);
      ctx.fill();

      // Main Sweep Line
      ctx.strokeStyle = "#00FF88";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cX, cY);
      ctx.lineTo(sweepX, sweepY);
      ctx.stroke();

      // Render Targets
      targets.forEach((t) => {
        if (t.rangeKm > maxRangeKm) return;
        const targetRad = (t.azimuthDeg * Math.PI) / 180;
        const distRatio = t.rangeKm / maxRangeKm;
        const tx = cX + radius * distRatio * Math.sin(targetRad);
        const ty = cY - radius * distRatio * Math.cos(targetRad);

        // Angle difference from sweep
        const sweepDeg = (angleRad * 180) / Math.PI;
        let diffDeg = Math.abs(sweepDeg - t.azimuthDeg);
        if (diffDeg > 180) diffDeg = 360 - diffDeg;

        // If sweep line hits target azimuth, illuminate blip brightly
        const isIlluminated = diffDeg < 15;

        ctx.save();
        if (t.isStealth) {
          ctx.fillStyle = isIlluminated ? "#FF3366" : "rgba(255, 51, 102, 0.6)";
          ctx.strokeStyle = "#FF3366";
        } else {
          ctx.fillStyle = isIlluminated ? "#00FF88" : "rgba(0, 255, 136, 0.6)";
          ctx.strokeStyle = "#00FF88";
        }

        // Draw Blip
        ctx.beginPath();
        ctx.arc(tx, ty, isIlluminated ? 5 : 3.5, 0, Math.PI * 2);
        ctx.fill();

        if (isIlluminated) {
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(tx, ty, 10, 0, Math.PI * 2);
          ctx.stroke();

          // Target Label
          ctx.fillStyle = "#F8FAFC";
          ctx.font = "10px monospace";
          ctx.fillText(`${t.id} (${t.rangeKm}km)`, tx + 12, ty + 4);
        }
        ctx.restore();
      });

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationId);
  }, [maxRangeKm, sweepSpeed, gainDb, showGrids, jammingNoise]);

  return (
    <div className="flex flex-col gap-6 font-mono">
      {/* Header Info */}
      <div className="flex justify-between items-center bg-[#161F33]/80 p-4 rounded-xl border border-[#00E5FF]/20">
        <div>
          <h1 className="text-base font-bold text-[#F8FAFC] tracking-wider uppercase">
            REAL-TIME PLAN POSITION INDICATOR (PPI) RADAR SCOPE
          </h1>
          <p className="text-xs text-[#94A3B8]">
            SDR Digital Receiver Stream — 10.0 GHz X-Band FMCW Radar
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="px-3 py-1 rounded bg-[#00FF88]/10 text-[#00FF88] border border-[#00FF88]/30">
            SWEEP: {(sweepSpeed * 24).toFixed(0)} RPM
          </span>
          <span className="px-3 py-1 rounded bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/30">
            RANGE: {maxRangeKm} KM
          </span>
        </div>
      </div>

      {/* Main Interactive Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* PPI Scope Canvas Container */}
        <div className="lg:col-span-2 bg-[#161F33]/80 border border-[#00E5FF]/20 rounded-xl p-6 flex flex-col items-center justify-center relative shadow-[0_0_30px_rgba(0,229,255,0.05)]">
          <canvas
            ref={canvasRef}
            width={540}
            height={540}
            className="rounded-full border border-[#00E5FF]/30 shadow-[0_0_20px_rgba(0,255,136,0.15)] bg-[#0B0F19]"
          />

          {/* Overlay Status Bar */}
          <div className="absolute bottom-4 left-6 right-6 flex justify-between text-[11px] text-[#94A3B8] bg-[#0B0F19]/90 px-4 py-2 rounded-lg border border-[#00E5FF]/20">
            <span>AZIMUTH RESOLUTION: 0.5°</span>
            <span>PRF: 2500 Hz</span>
            <span>RECEIVER GAIN: {gainDb} dB</span>
          </div>
        </div>

        {/* Tactical Control Panel */}
        <div className="flex flex-col gap-5">
          <div className="bg-[#161F33]/80 border border-[#00E5FF]/20 rounded-xl p-5 flex flex-col gap-4">
            <h3 className="text-xs font-bold text-[#F8FAFC] uppercase tracking-wider border-b border-[#00E5FF]/20 pb-2">
              SDR Receiver Parameters
            </h3>

            {/* Range Scale */}
            <div className="flex flex-col gap-1.5 text-xs">
              <div className="flex justify-between text-[#94A3B8]">
                <span>MAX RANGE SCALE</span>
                <span className="text-[#00E5FF] font-bold">{maxRangeKm} KM</span>
              </div>
              <input
                type="range"
                min="50"
                max="200"
                step="25"
                value={maxRangeKm}
                onChange={(e) => setMaxRangeKm(Number(e.target.value))}
                className="accent-[#00E5FF]"
              />
            </div>

            {/* Sweep Speed */}
            <div className="flex flex-col gap-1.5 text-xs">
              <div className="flex justify-between text-[#94A3B8]">
                <span>ANTENNA ROTATION SPEED</span>
                <span className="text-[#00FF88] font-bold">{(sweepSpeed * 24).toFixed(0)} RPM</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="3"
                step="0.5"
                value={sweepSpeed}
                onChange={(e) => setSweepSpeed(Number(e.target.value))}
                className="accent-[#00FF88]"
              />
            </div>

            {/* Receiver Gain */}
            <div className="flex flex-col gap-1.5 text-xs">
              <div className="flex justify-between text-[#94A3B8]">
                <span>RF FRONTEND GAIN</span>
                <span className="text-[#F8FAFC] font-bold">{gainDb} dB</span>
              </div>
              <input
                type="range"
                min="20"
                max="70"
                value={gainDb}
                onChange={(e) => setGainDb(Number(e.target.value))}
                className="accent-purple-400"
              />
            </div>

            {/* Toggles */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#00E5FF]/10">
              <button
                onClick={() => setShowGrids(!showGrids)}
                className={`py-2 px-3 text-[11px] rounded font-bold border transition-all ${
                  showGrids
                    ? "bg-[#00E5FF]/10 text-[#00E5FF] border-[#00E5FF]/40"
                    : "bg-gray-800 border-gray-700 text-gray-400"
                }`}
              >
                AZIMUTH GRIDS
              </button>

              <button
                onClick={() => setJammingNoise(!jammingNoise)}
                className={`py-2 px-3 text-[11px] rounded font-bold border transition-all ${
                  jammingNoise
                    ? "bg-[#FF3366]/20 text-[#FF3366] border-[#FF3366] animate-pulse"
                    : "bg-gray-800 border-gray-700 text-gray-400"
                }`}
              >
                NOISE JAMMING
              </button>
            </div>
          </div>

          {/* Active Track Selection */}
          <div className="bg-[#161F33]/80 border border-[#00E5FF]/20 rounded-xl p-5 flex flex-col gap-3">
            <h3 className="text-xs font-bold text-[#F8FAFC] uppercase tracking-wider border-b border-[#00E5FF]/20 pb-2">
              Select Active Radar Track
            </h3>

            <div className="flex flex-col gap-2">
              {targets.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTarget(t)}
                  className={`p-2.5 rounded-lg border text-left text-xs transition-all flex justify-between items-center ${
                    selectedTarget?.id === t.id
                      ? "bg-[#00E5FF]/15 border-[#00E5FF] text-[#F8FAFC]"
                      : "bg-[#0B0F19]/60 border-[#00E5FF]/10 text-[#94A3B8] hover:border-[#00E5FF]/30 hover:text-[#F8FAFC]"
                  }`}
                >
                  <div>
                    <div className="font-bold text-[#F8FAFC]">{t.name}</div>
                    <div className="text-[10px] text-[#94A3B8]">
                      Az: {t.azimuthDeg}° | R: {t.rangeKm} km
                    </div>
                  </div>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                      t.isStealth ? "bg-[#FF3366]/20 text-[#FF3366]" : "bg-[#00FF88]/20 text-[#00FF88]"
                    }`}
                  >
                    {t.rcsM2} $m^2$
                  </span>
                </button>
              ))}
            </div>

            {selectedTarget && (
              <div className="p-3 bg-[#0B0F19] rounded-lg border border-[#00E5FF]/30 text-xs flex flex-col gap-1 mt-1">
                <div className="text-[#00E5FF] font-bold">TRACK DETAILS: {selectedTarget.id}</div>
                <div className="text-[#94A3B8]">Type: {selectedTarget.type}</div>
                <div className="text-[#94A3B8]">Speed: {selectedTarget.speedMs} m/s</div>
                <div className="text-[#94A3B8]">Estimated RCS: {selectedTarget.rcsM2} $m^2$</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
