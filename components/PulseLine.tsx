"use client";

export default function PulseLine({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1000 90"
      preserveAspectRatio="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M0 45 H300 L330 45 L350 8 L372 82 L392 20 L410 45 H460 L480 45 L500 45 H700 L720 45 L740 8 L762 82 L782 20 L800 45 H1000"
        fill="none"
        stroke="url(#pulseGradient)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1000}
        strokeDasharray="1000"
        className="animate-pulseline"
      />
      <defs>
        <linearGradient id="pulseGradient" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#22D3EE" stopOpacity="0" />
          <stop offset="15%" stopColor="#5EEAD4" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#34D399" stopOpacity="0.9" />
          <stop offset="85%" stopColor="#5EEAD4" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#22D3EE" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}
