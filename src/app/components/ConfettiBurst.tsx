"use client";

import React, { useMemo } from "react";

type Intensity = "low" | "medium" | "high" | "ultra";

interface ConfettiBurstProps {
  intensity?: Intensity;
  emojis?: string[];
  durationMs?: number; // how long the animation lasts (each particle animates independently)
}

const defaultEmojis = ["🎉", "✨", "💥", "🎊", "⭐️", "🪄", "🔥"]; 

const ConfettiBurst: React.FC<ConfettiBurstProps> = ({
  intensity = "medium",
  emojis = defaultEmojis,
  durationMs = 3200,
}) => {
  const count = useMemo(() => {
    switch (intensity) {
      case "low":
        return 30;
      case "medium":
        return 60;
      case "high":
        return 100;
      case "ultra":
        return 160;
      default:
        return 60;
    }
  }, [intensity]);

  // Precompute particle styles/props for consistent render
  const particles = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => {
      const left = Math.random() * 100; // vw
      const rotate = Math.random() * 720 - 360; // -360deg..360deg
      const delay = Math.random() * 0.8; // s
      const fall = 0.9 + Math.random() * 0.8; // s multiplier for duration
      const size = 16 + Math.round(Math.random() * 12); // px
      const emoji = emojis[i % emojis.length];
      const xSway = Math.random() * 40 - 20; // px sway amplitude
      return { left, rotate, delay, fall, size, emoji, xSway };
    });
  }, [count, emojis]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-40 overflow-hidden"
      style={{ contain: "layout paint size" }}
    >
      <style jsx>{`
        @keyframes fall {
          0% { transform: translate3d(0, -10%, 0) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          100% { transform: translate3d(var(--x-sway), 110vh, 0) rotate(var(--rot)); opacity: 0; }
        }
      `}</style>
      {particles.map((p, idx) => (
        <span
          key={idx}
          className="absolute will-change-transform select-none"
          style={{
            left: `${p.left}vw`,
            top: `-10vh`,
            fontSize: `${p.size}px`,
            animation: `fall ${(durationMs / 1000) * p.fall}s linear ${p.delay}s forwards`,
            transform: `translate3d(0, -10%, 0)` as any,
            // CSS vars for keyframes
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            "--rot": `${p.rotate}deg`,
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            "--x-sway": `${p.xSway}px`,
          }}
        >
          {p.emoji}
        </span>
      ))}
    </div>
  );
};

export default ConfettiBurst;
