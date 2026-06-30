import React from "react";

interface OneBharatLogoProps {
  className?: string;
}

export const OneBharatLogo: React.FC<OneBharatLogoProps> = ({ className = "w-full h-full" }) => {
  return (
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
      id="onebharat-svg-logo"
    >
      {/* Background container */}
      <rect width="100" height="100" rx="20" fill="#0F172A" />
      
      {/* Blue/Teal neural network grid inside/around the upper head of the pin */}
      <g stroke="#0E4E75" strokeWidth="0.5" opacity="0.8">
        <line x1="50" y1="20" x2="35" y2="28" />
        <line x1="50" y1="20" x2="65" y2="28" />
        <line x1="35" y1="28" x2="30" y2="40" />
        <line x1="65" y1="28" x2="70" y2="40" />
        <line x1="30" y1="40" x2="35" y2="55" />
        <line x1="70" y1="40" x2="65" y2="55" />
        <line x1="35" y1="55" x2="50" y2="65" />
        <line x1="65" y1="55" x2="50" y2="65" />
        
        {/* Inner network lines in blue */}
        <line x1="50" y1="20" x2="50" y2="35" />
        <line x1="35" y1="28" x2="42" y2="38" />
        <line x1="65" y1="28" x2="58" y2="38" />
        <line x1="30" y1="40" x2="45" y2="45" />
        <line x1="70" y1="40" x2="55" y2="45" />
        <line x1="35" y1="55" x2="48" y2="50" />
        <line x1="65" y1="55" x2="52" y2="50" />
        
        {/* Nodes for blue network */}
        <circle cx="50" cy="20" r="1.5" fill="#0E4E75" />
        <circle cx="35" cy="28" r="1.5" fill="#0E4E75" />
        <circle cx="65" cy="28" r="1.5" fill="#0E4E75" />
        <circle cx="30" cy="40" r="1.5" fill="#0E4E75" />
        <circle cx="70" cy="40" r="1.5" fill="#0E4E75" />
        <circle cx="35" cy="55" r="1.5" fill="#0E4E75" />
        <circle cx="65" cy="55" r="1.5" fill="#0E4E75" />
      </g>

      {/* Main Orange Map Pin Outline */}
      <path 
        d="M50 82C50 82 22 55.4 22 38C22 22.5 34.5 10 50 10C65.5 10 78 22.5 78 38C78 55.4 50 82 50 82Z" 
        stroke="#FF6B00" 
        strokeWidth="3.5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />

      {/* Inner Pin Frame / Ring */}
      <circle cx="50" cy="38" r="22" stroke="#FF6B00" strokeWidth="2.5" />

      {/* Gold/Yellow Gradient and Glow definitions */}
      <defs>
        <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFF2CC" />
          <stop offset="40%" stopColor="#FFD966" />
          <stop offset="100%" stopColor="#FF6B00" />
        </radialGradient>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Orange Pentagonal Central Network */}
      {/* Lines connecting outer pentagon nodes to center */}
      <g stroke="#FF6B00" strokeWidth="1.5" opacity="0.9">
        <line x1="50" y1="38" x2="50" y2="24" /> {/* Top Node */}
        <line x1="50" y1="38" x2="63.3" y2="33.7" /> {/* Right-Top Node */}
        <line x1="50" y1="38" x2="58.2" y2="49.3" /> {/* Right-Bottom Node */}
        <line x1="50" y1="38" x2="41.8" y2="49.3" /> {/* Left-Bottom Node */}
        <line x1="50" y1="38" x2="36.7" y2="33.7" /> {/* Left-Top Node */}

        {/* Outer Pentagon Lines */}
        <line x1="50" y1="24" x2="63.3" y2="33.7" />
        <line x1="63.3" y1="33.7" x2="58.2" y2="49.3" />
        <line x1="58.2" y1="49.3" x2="41.8" y2="49.3" />
        <line x1="41.8" y1="49.3" x2="36.7" y2="33.7" />
        <line x1="36.7" y1="33.7" x2="50" y2="24" />
      </g>

      {/* Center glowing node */}
      <circle cx="50" cy="38" r="5" fill="url(#centerGlow)" filter="url(#glow)" />

      {/* Outer 5 pentagon nodes */}
      <circle cx="50" cy="24" r="3" fill="#FF8C00" stroke="#FFF" strokeWidth="0.5" />
      <circle cx="63.3" cy="33.7" r="3" fill="#FF8C00" stroke="#FFF" strokeWidth="0.5" />
      <circle cx="58.2" cy="49.3" r="3" fill="#FF8C00" stroke="#FFF" strokeWidth="0.5" />
      <circle cx="41.8" cy="49.3" r="3" fill="#FF8C00" stroke="#FFF" strokeWidth="0.5" />
      <circle cx="36.7" cy="33.7" r="3" fill="#FF8C00" stroke="#FFF" strokeWidth="0.5" />

      {/* Ground/Base curve of the pin representing stability */}
      <path d="M30 87C42 84 58 84 70 87" stroke="#FF6B00" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
};
