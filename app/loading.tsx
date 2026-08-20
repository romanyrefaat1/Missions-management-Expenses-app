"use client";

import React from "react";

const WORD = "Missiono";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center overflow-hidden bg-background">
      {/* Brand glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl"
      />

      <div className="relative flex flex-col items-center">
        {/* Logo */}
        <div className="relative h-[92px] w-[92px]">
          <div
            aria-hidden="true"
            className="absolute inset-2 rounded-full bg-primary/10 blur-2xl"
          />

          <Chevron top={0} delay="0s" />
          <Chevron top={23} delay="0.1s" />
          <Chevron top={46} delay="0.2s" />
        </div>

        {/* Missiono */}
        <div className="mt-5 flex font-heading text-4xl font-semibold tracking-tight text-foreground">
          {WORD.split("").map((character, index) => (
            <span
              key={`${character}-${index}`}
              className="missiono-letter"
              style={{
                animationDelay: `${index * 0.045}s`,
              }}
            >
              {character}
            </span>
          ))}
        </div>

        {/* Loading bar */}
        <div className="mt-7 h-1 w-24 overflow-hidden rounded-full bg-primary/10">
          <div className="missiono-progress h-full w-1/2 rounded-full bg-primary" />
        </div>
      </div>

      <style>{`
        .missiono-chevron {
          position: absolute;
          left: 0;
          width: 92px;
          height: 38px;
          animation: missiono-chevron 2.8s
            cubic-bezier(0.65, 0, 0.35, 1)
            infinite;
          will-change: transform, opacity;
        }

        .missiono-letter {
          display: inline-block;
          opacity: 0;
          animation: missiono-letter 2.8s
            cubic-bezier(0.22, 1, 0.36, 1)
            infinite;
          will-change: transform, opacity;
        }

        .missiono-progress {
          animation: missiono-progress 2.8s ease-in-out infinite;
          will-change: transform;
        }

        @keyframes missiono-chevron {
          0%,
          10% {
            transform: translateX(0) rotate(0deg);
            opacity: 0.3;
          }

          25% {
            transform: translateX(-7px) rotate(-3deg);
            opacity: 0.75;
          }

          45% {
            transform: translateX(-14px) rotate(-7deg);
            opacity: 1;
          }

          65% {
            transform: translateX(-5px) rotate(-2deg);
            opacity: 0.85;
          }

          82%,
          100% {
            transform: translateX(0) rotate(0deg);
            opacity: 0.3;
          }
        }

        @keyframes missiono-letter {
          0%,
          24% {
            opacity: 0;
            transform: translateY(7px);
          }

          37% {
            opacity: 1;
            transform: translateY(0);
          }

          78% {
            opacity: 1;
            transform: translateY(0);
          }

          94%,
          100% {
            opacity: 0;
            transform: translateY(-4px);
          }
        }

        @keyframes missiono-progress {
          0% {
            transform: translateX(-120%);
          }

          50% {
            transform: translateX(100%);
          }

          100% {
            transform: translateX(220%);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .missiono-chevron,
          .missiono-letter,
          .missiono-progress {
            animation: none !important;
          }

          .missiono-chevron {
            opacity: 1 !important;
            transform: none !important;
          }

          .missiono-letter {
            opacity: 1 !important;
            transform: none !important;
          }

          .missiono-progress {
            transform: translateX(0) !important;
          }
        }
      `}</style>
    </div>
  );
}

function Chevron({
  top,
  delay,
}: {
  top: number;
  delay: string;
}) {
  return (
    <div
      className="missiono-chevron"
      style={{
        top,
        animationDelay: delay,
      }}
    >
      <svg
        viewBox="0 0 64 26"
        width="100%"
        height="100%"
        aria-hidden="true"
      >
        <path
          d="M4 22 L32 4 L60 22"
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}