/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ShieldCheck, MapPin, Sparkles, Globe } from "lucide-react";
import { OneBharatLogo } from "./OneBharatLogo";

interface SplashIntroProps {
  onComplete: () => void;
}

export const SplashIntro: React.FC<SplashIntroProps> = ({ onComplete }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRingRef = useRef<SVGSVGElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const bgOverlayRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Initial State Setting
      gsap.set(".splash-letter", { opacity: 0, y: 30, scale: 0.8 });
      gsap.set(".splash-circle", { transformOrigin: "50% 50%", scale: 0, opacity: 0 });
      gsap.set(".tech-ray", { drawSVG: "0%", opacity: 0, scale: 0 });
      
      // 2. Main Timeline creation
      const tl = gsap.timeline({
        onComplete: () => {
          // Smoothly slide out container
          gsap.to(containerRef.current, {
            y: "-100%",
            duration: 1.1,
            ease: "power4.inOut",
            onComplete: () => {
              setIsDismissed(true);
              onComplete();
            }
          });
        }
      });

      // Step A: Background pulse and glow entering
      tl.to(bgOverlayRef.current, {
        opacity: 0.95,
        duration: 0.8,
        ease: "power2.out"
      });

      // Step B: Central emblem circle scales up & spins
      tl.to(".splash-circle-outer", {
        scale: 1,
        opacity: 1,
        duration: 1.2,
        ease: "elastic.out(1, 0.6)",
        rotation: 360,
      }, "-=0.4");

      tl.to(".splash-circle-inner", {
        scale: 1,
        opacity: 1,
        duration: 1.0,
        ease: "back.out(1.7)",
        rotation: -180,
      }, "-=0.9");

      // Step C: Map pin in center pop
      tl.to(".splash-pin", {
        scale: 1,
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "bounce.out",
        startAt: { scale: 0, y: -20 }
      }, "-=0.5");

      // Step D: Tricolor glowing rings orbit animation
      tl.to(".splash-ring-orange", { strokeDashoffset: 0, duration: 1.4, ease: "power1.inOut" }, "-=0.8");
      tl.to(".splash-ring-green", { strokeDashoffset: 0, duration: 1.4, ease: "power1.inOut" }, "-=1.2");

      // Step E: ONEBHARAT Letters Stagger Reveal
      tl.to(".splash-letter", {
        opacity: 1,
        y: 0,
        scale: 1,
        stagger: 0.08,
        duration: 0.8,
        ease: "back.out(2)"
      }, "-=0.8");

      // Step F: Subtitle & Badges Fade In
      tl.fromTo(subtitleRef.current, 
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
        "-=0.3"
      );

      tl.fromTo(badgeRef.current,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.5)" },
        "-=0.2"
      );

      // Step G: Lingering hold before sliding out
      tl.to({}, { duration: 1.2 }); // Wait state
      
    }, containerRef);

    return () => ctx.revert();
  }, [onComplete]);

  if (isDismissed) return null;

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-950 select-none overflow-hidden"
    >
      {/* Background Interactive Star/Grid Overlay */}
      <div 
        ref={bgOverlayRef}
        className="absolute inset-0 bg-radial-grid opacity-0 pointer-events-none transition-opacity duration-1000"
        style={{
          backgroundImage: "radial-gradient(circle at center, rgba(30, 41, 59, 0.85) 0%, rgba(3, 7, 18, 1) 100%)"
        }}
      />

      {/* Cyberpunk Geometric BG Lines */}
      <div className="absolute inset-0 opacity-10 flex items-center justify-center pointer-events-none">
        <svg width="100%" height="100%" className="absolute inset-0">
          <circle cx="50%" cy="50%" r="200" fill="none" stroke="#FF6B00" strokeWidth="1" strokeDasharray="5 10" className="animate-spin-slow" />
          <circle cx="50%" cy="50%" r="350" fill="none" stroke="#22C55E" strokeWidth="0.5" strokeDasharray="20 40" />
          <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#475569" strokeWidth="0.5" strokeDasharray="10 10" />
          <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#475569" strokeWidth="0.5" strokeDasharray="10 10" />
        </svg>
      </div>

      {/* Skipping/Fast Forward Control */}
      <button 
        type="button"
        onClick={() => {
          setIsDismissed(true);
          onComplete();
        }}
        className="absolute top-6 right-6 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-gray-400 hover:text-white border border-slate-800 rounded-xl text-xs font-mono tracking-wider transition-all shadow-md flex items-center gap-1.5"
      >
        Skip Intro <Sparkles className="w-3.5 h-3.5 text-[#FF6B00]" />
      </button>

      {/* LOGO CONTAINER */}
      <div className="relative flex flex-col items-center justify-center">
        
        {/* Animated Vector Logo Ring Emblem */}
        <div className="relative w-36 h-36 mb-6">
          
          {/* Saffron & Green Orbit Rings */}
          <svg 
            ref={logoRingRef}
            className="absolute inset-0 w-full h-full -rotate-90" 
            viewBox="0 0 100 100"
          >
            {/* Saffron Outer Arc */}
            <circle 
              cx="50" 
              cy="50" 
              r="45" 
              fill="none" 
              stroke="#FF6B00" 
              strokeWidth="2.5" 
              strokeDasharray="283" 
              strokeDashoffset="283"
              className="splash-ring-orange opacity-80"
              strokeLinecap="round"
            />
            {/* Green Inner Arc */}
            <circle 
              cx="50" 
              cy="50" 
              r="38" 
              fill="none" 
              stroke="#22C55E" 
              strokeWidth="2" 
              strokeDasharray="239" 
              strokeDashoffset="239"
              className="splash-ring-green opacity-80"
              strokeLinecap="round"
            />
          </svg>

          {/* Central Layer: Saffron Glowing Shield Circle */}
          <div className="splash-circle splash-circle-outer absolute inset-3 bg-gradient-to-tr from-orange-600 to-amber-500 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(255,107,0,0.4)]">
            
            {/* Inner Ring Layer: Rotating Ashok Chakra Dots */}
            <div className="splash-circle splash-circle-inner absolute inset-1 border-2 border-white/20 border-dashed rounded-full flex items-center justify-center bg-slate-950/40 overflow-hidden">
              
              {/* Custom Image Logo */}
              <div className="splash-pin absolute transform flex items-center justify-center drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] w-16 h-16 rounded-2xl overflow-hidden border border-white/10 bg-[#0F172A]">
                <OneBharatLogo className="w-full h-full animate-pulse" />
              </div>

            </div>
          </div>

          {/* Sparkles / Glowing star behind emblem */}
          <Sparkles className="absolute -top-3 -right-3 w-7 h-7 text-amber-400 animate-pulse" />
        </div>

        {/* TYPOGRAPHY: BRAND ONEBHARAT */}
        <div 
          ref={textRef} 
          className="flex items-center gap-1.5 justify-center font-sans font-black text-4xl tracking-tight text-white mb-2"
        >
          {["O", "n", "e", "B", "h", "a", "r", "a", "t"].map((char, index) => (
            <span 
              key={index} 
              className={`splash-letter inline-block ${
                index >= 3 ? "text-[#FF6B00]" : "text-white"
              }`}
            >
              {char}
            </span>
          ))}
        </div>

        {/* SUBTITLE AND LOCATION FOCUS */}
        <div 
          ref={subtitleRef} 
          className="text-center space-y-1"
        >
          <p className="text-xs uppercase font-mono tracking-[0.25em] text-gray-400">
            India Civic Super-Platform
          </p>
          <div className="flex items-center justify-center gap-1 text-[11px] font-semibold text-emerald-400 font-mono bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 w-fit mx-auto mt-2">
            <Globe className="w-3.5 h-3.5 animate-spin-slow" />
            <span>Active: Sonpur & Hajipur, Bihar</span>
          </div>
        </div>

        {/* BADGES & DIGITAL IDENTITY VERIFICATION LOGO */}
        <div 
          ref={badgeRef}
          className="mt-10 flex items-center gap-4 text-gray-500 border-t border-slate-900 pt-6"
        >
          <div className="flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>DigiLocker Linked</span>
          </div>
          <div className="h-4 w-[1px] bg-slate-800" />
          <div className="flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider">
            <Globe className="w-4 h-4 text-orange-500" />
            <span>NIC Smart Core 2.0</span>
          </div>
        </div>

      </div>
    </div>
  );
};
