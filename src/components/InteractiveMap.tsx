/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect, useRef } from "react";
import { useApp } from "../context/AppContext";
import { Complaint, ComplaintCategory, ComplaintPriority, ComplaintStatus } from "../types";
import { 
  MapPin, 
  Layers, 
  Eye, 
  EyeOff, 
  Search, 
  Navigation, 
  Compass, 
  AlertTriangle, 
  ThumbsUp, 
  Clock, 
  ChevronRight,
  Sparkles,
  Award
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export const InteractiveMap: React.FC = () => {
  const { complaints, upvoteComplaint, selectedComplaintId, setSelectedComplaintId } = useApp();
  
  // States for map customization
  const [mapMode, setMapMode] = useState<"standard" | "satellite" | "dark" | "google">("google");
  const [showHeatMap, setShowHeatMap] = useState(false);
  const [showBoundaries, setShowBoundaries] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedPriority, setSelectedPriority] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [zoomedComplaint, setZoomedComplaint] = useState<Complaint | null>(null);
  const [showRoute, setShowRoute] = useState(false);
  
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const googleMapsUrl = useMemo(() => {
    const baseQuery = zoomedComplaint 
      ? `${zoomedComplaint.location.address}, Sonpur, Hajipur, Bihar, India` 
      : "Sonpur, Hajipur, Bihar, India";
    return `https://maps.google.com/maps?q=${encodeURIComponent(baseQuery)}&t=k&z=15&ie=UTF8&iwloc=&output=embed`;
  }, [zoomedComplaint]);

  // User Current Location (Simulation Center)
  const userLoc = { lat: 25.6980, lng: 85.1725, label: "Your Location (Sonpur, Saran, Bihar)" };

  // Sync external selections
  useEffect(() => {
    if (selectedComplaintId) {
      const found = complaints.find(c => c.id === selectedComplaintId);
      if (found) {
        setZoomedComplaint(found);
        setShowRoute(false);
      }
    }
  }, [selectedComplaintId, complaints]);

  // Coordinates translation into percentage on SVG container
  // Handcrafted bounding boxes for Sonpur & Hajipur, Bihar
  const getCoordinatesPercent = (lat: number, lng: number) => {
    // Center of Sonpur / Hajipur: Lat 25.6900, Lng 85.1950
    const centerLat = 25.6900;
    const centerLng = 85.1950;
    
    // Scale factors to map approximately 0.05 degrees of span across 100% of map container
    let x = 50 + (lng - centerLng) * 1400;
    let y = 55 - (lat - centerLat) * 1400;

    // Keep safe inside bounds (15% to 85% so nothing is truncated)
    x = Math.max(15, Math.min(85, x));
    y = Math.max(15, Math.min(85, y));

    return { x, y };
  };

  const filteredComplaints = useMemo(() => {
    return complaints.filter((c) => {
      const matchCat = selectedCategory === "All" || c.category === selectedCategory;
      const matchPrio = selectedPriority === "All" || c.priority === selectedPriority;
      const matchSearch = searchQuery === "" || 
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.location.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.id.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchPrio && matchSearch;
    });
  }, [complaints, selectedCategory, selectedPriority, searchQuery]);

  const unresolvedComplaints = useMemo(() => {
    return complaints.filter((c) => {
      return (
        c.status === ComplaintStatus.SUBMITTED ||
        c.status === ComplaintStatus.DISPATCHED ||
        c.status === ComplaintStatus.IN_PROGRESS
      );
    });
  }, [complaints]);

  // Handle Marker click
  const handleMarkerClick = (comp: Complaint) => {
    setZoomedComplaint(comp);
    setSelectedComplaintId(comp.id);
    setShowRoute(false);
  };

  // Categories list
  const categories = ["All", ...Object.values(ComplaintCategory)];

  // Department boundaries mock SVG overlays for Sonpur & Hajipur wards
  const boundaryZones = [
    { name: "Ward No. 4 (Sonpur Nagar Panchayat)", points: "15,20 40,15 55,40 30,60 12,45", color: "rgba(255, 107, 0, 0.15)" },
    { name: "Ward No. 12 (Hajipur Civil Lines)", points: "45,10 80,5 90,30 65,40 50,25", color: "rgba(59, 130, 246, 0.1)" },
    { name: "Ward No. 8 (Sonpur Bazaar Division)", points: "20,55 50,50 60,75 30,85", color: "rgba(34, 197, 94, 0.1)" }
  ];

  return (
    <div id="onebharat-interactive-map" className="relative flex flex-col md:flex-row h-[680px] bg-gray-950 rounded-2xl overflow-hidden border border-gray-800 shadow-2xl">
      
      {/* MAP STAGE (LEFT/TOP) */}
      <div className="relative flex-1 bg-[#0b0f19] overflow-hidden select-none" ref={mapContainerRef}>
        
        {/* Dynamic Vector Map Background */}
        {mapMode !== "google" ? (
          <div className="absolute inset-0 w-full h-full">
            {/* Base Grid Styling depending on mapMode */}
            <div className={`absolute inset-0 transition-all duration-700 ${
              mapMode === "dark" 
                ? "bg-[#0b0f19] opacity-100" 
                : mapMode === "satellite" 
                ? "bg-[#0c1322] opacity-90 contrast-125 saturate-50" 
                : "bg-slate-900 opacity-95"
            }`}>
              {/* Grid Pattern Lines */}
              <svg width="100%" height="100%" className="absolute inset-0 opacity-15">
                <defs>
                  <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#374151" strokeWidth="1" />
                    <circle cx="0" cy="0" r="1.5" fill="#FF6B00" />
                  </pattern>
                  <radialGradient id="heat-glow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#FF6B00" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="#FF6B00" stopOpacity="0" />
                  </radialGradient>
                  <radialGradient id="heat-glow-critical" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#EF4444" stopOpacity="0.75" />
                    <stop offset="45%" stopColor="#F97316" stopOpacity="0.4" />
                    <stop offset="80%" stopColor="#EAB308" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#EF4444" stopOpacity="0" />
                  </radialGradient>
                  <radialGradient id="heat-glow-high" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#F97316" stopOpacity="0.65" />
                    <stop offset="50%" stopColor="#F59E0B" stopOpacity="0.3" />
                    <stop offset="85%" stopColor="#EAB308" stopOpacity="0.1" />
                    <stop offset="100%" stopColor="#F97316" stopOpacity="0" />
                  </radialGradient>
                  <radialGradient id="heat-glow-medium" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#EAB308" stopOpacity="0.55" />
                    <stop offset="60%" stopColor="#3B82F6" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#EAB308" stopOpacity="0" />
                  </radialGradient>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid-pattern)" />
              </svg>

              {/* Stylized Simulated Vector Roads, Coastlines, Landmarks */}
              <svg width="100%" height="100%" className="absolute inset-0">
                {/* Coastline */}
                <path d="M -50,150 Q 80,220 180,410 T 250,700" fill="none" stroke="#1e293b" strokeWidth="40" strokeLinecap="round" className="opacity-40" />
                <path d="M -50,150 Q 80,220 180,410 T 250,700" fill="none" stroke="#3b82f6" strokeWidth="6" className="opacity-25" />
                
                {/* National Highways Vector */}
                <path d="M 10,10 L 900,600" fill="none" stroke="#475569" strokeWidth="4" className="opacity-40" />
                <path d="M 50,450 Q 300,100 800,200" fill="none" stroke="#475569" strokeWidth="3" className="opacity-40" />
                <path d="M 400,-50 L 410,750" fill="none" stroke="#475569" strokeWidth="4" className="opacity-30" />

                {/* Sub-roads networks */}
                <path d="M 120,80 C 180,180 220,100 350,120" fill="none" stroke="#334155" strokeWidth="1.5" className="opacity-40" />
                <path d="M 220,380 C 340,320 280,450 500,420" fill="none" stroke="#334155" strokeWidth="1.5" className="opacity-40" />
                <path d="M 50,220 C 120,290 180,210 260,330" fill="none" stroke="#334155" strokeWidth="1.5" className="opacity-40" />

                {/* Administrative Boundaries Overlay */}
                {showBoundaries && boundaryZones.map((zone, idx) => (
                  <g key={idx} className="transition-all duration-500">
                    <polygon 
                      points={zone.points.split(" ").map(p => {
                        const [x, y] = p.split(",");
                        return `${parseFloat(x)}%,${parseFloat(y)}%`;
                      }).join(" ")}
                      fill={zone.color} 
                      stroke="#ff6b00" 
                      strokeWidth="1.5" 
                      strokeDasharray="6,4"
                      className="opacity-60"
                    />
                  </g>
                ))}

                 {/* Heat Map Dense Zones for Unresolved Complaints */}
                {showHeatMap && unresolvedComplaints.map((c, idx) => {
                  const { x, y } = getCoordinatesPercent(c.location.latitude, c.location.longitude);
                  const gradientId = 
                    c.priority === ComplaintPriority.EMERGENCY 
                      ? "url(#heat-glow-critical)" 
                      : c.priority === ComplaintPriority.HIGH 
                      ? "url(#heat-glow-high)" 
                      : "url(#heat-glow-medium)";
                      
                  const radius = 
                    c.priority === ComplaintPriority.EMERGENCY 
                      ? 65 
                      : c.priority === ComplaintPriority.HIGH 
                      ? 48 
                      : 35;
                      
                  return (
                    <g key={`heat-${c.id}-${idx}`}>
                      {/* Innermost core hot spot */}
                      <circle 
                        cx={`${x}%`} 
                        cy={`${y}%`} 
                        r={radius * 0.3} 
                        fill={c.priority === ComplaintPriority.EMERGENCY ? "#EF4444" : "#F97316"}
                        opacity="0.3"
                        className="animate-ping"
                        style={{ animationDuration: "2s" }}
                      />
                      {/* Medium glow region */}
                      <circle 
                        cx={`${x}%`} 
                        cy={`${y}%`} 
                        r={radius} 
                        fill={gradientId}
                        className="animate-pulse"
                        style={{ animationDuration: `${3 + idx % 3}s` }}
                      />
                    </g>
                  );
                })}

                {/* Route Path Animation if triggered */}
                {showRoute && zoomedComplaint && (
                  <motion.path
                    d={`M 50,55 Q ${getCoordinatesPercent(zoomedComplaint.location.latitude, zoomedComplaint.location.longitude).x - 10}%,${getCoordinatesPercent(zoomedComplaint.location.latitude, zoomedComplaint.location.longitude).y + 15}% ${getCoordinatesPercent(zoomedComplaint.location.latitude, zoomedComplaint.location.longitude).x}%,${getCoordinatesPercent(zoomedComplaint.location.latitude, zoomedComplaint.location.longitude).y}%`}
                    fill="none"
                    stroke="#FF6B00"
                    strokeWidth="4.5"
                    strokeLinecap="round"
                    initial={{ strokeDasharray: "1000", strokeDashoffset: "1000" }}
                    animate={{ strokeDashoffset: "0" }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="shadow-lg filter drop-shadow-[0_0_8px_rgba(255,107,0,0.8)]"
                  />
                )}
              </svg>

              {/* Satellite Terrain Grid Textures */}
              {mapMode === "satellite" && (
                <div className="absolute inset-0 bg-radial from-transparent to-black/80 pointer-events-none mix-blend-overlay" />
              )}
            </div>
          </div>
        ) : (
          <iframe
            src={googleMapsUrl}
            width="100%"
            height="100%"
            className="absolute inset-0 w-full h-full border-0 z-0"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer"
          ></iframe>
        )}

        {/* COMPASS ROSACE & SCALE */}
        <div className="absolute bottom-5 left-5 flex items-center space-x-3 pointer-events-none z-10">
          <div className="p-1.5 bg-gray-900/90 border border-gray-800 rounded-full text-[#FF6B00] animate-spin-slow">
            <Compass className="w-5 h-5" />
          </div>
          <div className="text-[10px] font-mono text-gray-400 bg-gray-900/80 px-2 py-0.5 rounded border border-gray-800">
            Scale: 1 : 12,500m
          </div>
        </div>

        {/* TOP FLOATING SEARCH BAR & FILTERS */}
        <div className="absolute top-4 left-4 right-4 flex flex-col sm:flex-row gap-2 z-10">
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Search live complaints, ward IDs, or streets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-900/90 hover:bg-gray-900 border border-gray-800 focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] text-white pl-9 pr-4 py-2 rounded-xl text-xs backdrop-blur-md outline-none transition-all placeholder:text-gray-500"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-gray-900/90 hover:bg-gray-900 text-white border border-gray-800 rounded-xl px-3 py-1.5 text-xs outline-none focus:border-[#FF6B00] backdrop-blur-md"
            >
              <option value="All">All Categories</option>
              {Object.values(ComplaintCategory).map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="bg-gray-900/90 hover:bg-gray-900 text-white border border-gray-800 rounded-xl px-3 py-1.5 text-xs outline-none focus:border-[#FF6B00] backdrop-blur-md"
            >
              <option value="All">All Priorities</option>
              {Object.values(ComplaintPriority).map((prio) => (
                <option key={prio} value={prio}>{prio}</option>
              ))}
            </select>
          </div>
        </div>

        {/* RIGHT MAP TYPE / LAYER TOGGLES */}
        <div className="absolute right-4 top-16 sm:top-4 flex flex-col gap-2 z-10">
          {/* Map Style Controls */}
          <div className="bg-gray-900/95 border border-gray-800 rounded-xl p-1 backdrop-blur-md flex flex-col gap-1">
            <button
              onClick={() => setMapMode("google")}
              className={`p-2 rounded-lg text-xs transition-all ${mapMode === "google" ? "bg-[#FF6B00] text-white" : "text-gray-400 hover:text-white"}`}
              title="Real Google Map"
            >
              <Compass className="w-4 h-4 mx-auto text-emerald-400" />
              <span className="text-[8px] block mt-0.5 font-medium">Google</span>
            </button>
            <button
              onClick={() => setMapMode("dark")}
              className={`p-2 rounded-lg text-xs transition-all ${mapMode === "dark" ? "bg-[#FF6B00] text-white" : "text-gray-400 hover:text-white"}`}
              title="Dark Theme"
            >
              <Layers className="w-4 h-4 mx-auto" />
              <span className="text-[8px] block mt-0.5 font-medium">Dark</span>
            </button>
            <button
              onClick={() => setMapMode("satellite")}
              className={`p-2 rounded-lg text-xs transition-all ${mapMode === "satellite" ? "bg-[#FF6B00] text-white" : "text-gray-400 hover:text-white"}`}
              title="Satellite Mode"
            >
              <Eye className="w-4 h-4 mx-auto" />
              <span className="text-[8px] block mt-0.5 font-medium">Sat</span>
            </button>
          </div>

          {/* Map Layer Overlays */}
          <div className="bg-gray-900/95 border border-gray-800 rounded-xl p-1.5 backdrop-blur-md flex flex-col gap-1.5 text-center">
            <button
              onClick={() => {
                const nextVal = !showHeatMap;
                setShowHeatMap(nextVal);
                if (nextVal && mapMode === "google") {
                  setMapMode("dark");
                }
              }}
              className={`p-2 rounded-lg text-[9px] transition-all flex flex-col items-center justify-center ${showHeatMap ? "bg-amber-600/30 text-[#FF6B00] border border-[#FF6B00]/40" : "text-gray-400 hover:text-white"}`}
            >
              <Sparkles className="w-4 h-4 mb-0.5" />
              Heatmap
            </button>
            <button
              onClick={() => setShowBoundaries(!showBoundaries)}
              className={`p-2 rounded-lg text-[9px] transition-all flex flex-col items-center justify-center ${showBoundaries ? "bg-blue-600/30 text-blue-400 border border-blue-500/40" : "text-gray-400 hover:text-white"}`}
            >
              <Layers className="w-4 h-4 mb-0.5" />
              Wards
            </button>
          </div>
        </div>

        {/* STATIC USER MARKER */}
        {mapMode !== "google" && (
          <div 
            className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none"
            style={{ left: "50%", top: "55%" }}
          >
            <div className="relative flex items-center justify-center">
              <div className="absolute w-12 h-12 bg-blue-500/20 rounded-full animate-ping" />
              <div className="absolute w-6 h-6 bg-blue-500/40 rounded-full animate-pulse" />
              <div className="w-3.5 h-3.5 bg-blue-500 border-2 border-white rounded-full shadow-lg" />
              <div className="absolute -top-7 whitespace-nowrap bg-gray-900 text-[9px] text-gray-300 font-mono px-2 py-0.5 rounded border border-gray-800 shadow">
                You
              </div>
            </div>
          </div>
        )}

        {/* RENDERING ANIMATED INCIDENT PINS */}
        {mapMode !== "google" && filteredComplaints.map((comp) => {
          const { x, y } = getCoordinatesPercent(comp.location.latitude, comp.location.longitude);
          const isSelected = zoomedComplaint?.id === comp.id;
          
          // Custom marker color mapping based on priority
          const pinColor = 
            comp.priority === ComplaintPriority.EMERGENCY 
              ? "text-red-500" 
              : comp.priority === ComplaintPriority.HIGH 
              ? "text-orange-500" 
              : comp.priority === ComplaintPriority.MEDIUM 
              ? "text-yellow-500" 
              : "text-blue-500";

          return (
            <div
              key={comp.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-30 transition-all duration-300"
              style={{ left: `${x}%`, top: `${y}%` }}
              onClick={() => handleMarkerClick(comp)}
            >
              <div className="relative group">
                {/* Active pulse ring around high priority/emergency markers */}
                {(comp.priority === ComplaintPriority.EMERGENCY || comp.priority === ComplaintPriority.HIGH) && (
                  <div className={`absolute -inset-2.5 rounded-full animate-ping opacity-25 ${
                    comp.priority === ComplaintPriority.EMERGENCY ? "bg-red-500" : "bg-orange-500"
                  }`} />
                )}

                <motion.div
                  whileHover={{ scale: 1.3 }}
                  animate={isSelected ? { scale: [1, 1.3, 1.1], y: -5 } : { scale: 1, y: 0 }}
                  className={`relative p-1 bg-gray-900 border ${isSelected ? "border-[#FF6B00] shadow-[0_0_12px_rgba(255,107,0,0.6)]" : "border-gray-800"} rounded-full shadow-md`}
                >
                  <MapPin className={`w-5 h-5 ${pinColor} fill-current`} />
                </motion.div>

                {/* Micro Label */}
                <div className="absolute left-1/2 transform -translate-x-1/2 mt-1 px-1.5 py-0.5 bg-gray-950/95 text-[8px] font-mono text-gray-300 border border-gray-800 rounded shadow opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200">
                  {comp.id}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* DETAIL DRAWER / POPUP SIDEBAR (RIGHT/BOTTOM) */}
      <div className="w-full md:w-[320px] bg-gray-900 border-t md:border-t-0 md:border-l border-gray-800 flex flex-col text-white h-[260px] md:h-full z-10 shadow-2xl">
        <AnimatePresence mode="wait">
          {zoomedComplaint ? (
            <motion.div 
              key={zoomedComplaint.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col h-full overflow-y-auto p-4"
            >
              {/* Header Info */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono ${
                    zoomedComplaint.priority === ComplaintPriority.EMERGENCY 
                      ? "bg-red-500/15 text-red-400 border border-red-500/30 animate-pulse" 
                      : zoomedComplaint.priority === ComplaintPriority.HIGH 
                      ? "bg-orange-500/15 text-orange-400 border border-orange-500/30"
                      : "bg-blue-500/15 text-blue-400 border border-blue-500/30"
                  }`}>
                    {zoomedComplaint.priority} Priority
                  </span>
                  <p className="text-[10px] font-mono text-gray-400 mt-1">{zoomedComplaint.id}</p>
                </div>
                
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium ${
                  zoomedComplaint.status === ComplaintStatus.RESOLVED 
                    ? "bg-green-500/15 text-green-400" 
                    : zoomedComplaint.status === ComplaintStatus.IN_PROGRESS 
                    ? "bg-amber-500/15 text-amber-400"
                    : "bg-gray-500/15 text-gray-400"
                }`}>
                  {zoomedComplaint.status}
                </span>
              </div>

              {/* Title & Category */}
              <h3 className="font-sans font-semibold text-sm leading-tight text-white mb-1">
                {zoomedComplaint.title}
              </h3>
              <p className="text-xs font-mono text-[#FF6B00] mb-3">{zoomedComplaint.category}</p>

              {/* Image Thumbnail */}
              {zoomedComplaint.images && zoomedComplaint.images.length > 0 && (
                <div className="relative h-28 w-full rounded-xl overflow-hidden mb-3 border border-gray-800">
                  <img
                    src={zoomedComplaint.images[0]}
                    alt={zoomedComplaint.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Location Address */}
              <div className="mb-3">
                <p className="text-[10px] uppercase font-mono tracking-wider text-gray-400 mb-0.5">Location</p>
                <p className="text-xs text-gray-300 leading-relaxed bg-gray-950/60 p-2 rounded-lg border border-gray-800/80">
                  {zoomedComplaint.location.address}
                </p>
              </div>

              {/* Engagement Stats */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                <button
                  onClick={() => upvoteComplaint(zoomedComplaint.id)}
                  className={`flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                    zoomedComplaint.hasUpvoted 
                      ? "bg-[#FF6B00] text-white border-[#FF6B00]" 
                      : "bg-gray-950/40 text-gray-300 border-gray-800 hover:bg-gray-800"
                  }`}
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>{zoomedComplaint.upvotes} Upvotes</span>
                </button>

                <button
                  onClick={() => setShowRoute(!showRoute)}
                  className={`flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                    showRoute 
                      ? "bg-blue-600 text-white border-blue-500" 
                      : "bg-gray-950/40 text-gray-300 border-gray-800 hover:bg-gray-800"
                  }`}
                >
                  <Navigation className="w-3.5 h-3.5 animate-pulse" />
                  <span>{showRoute ? "Cancel" : "Navigate"}</span>
                </button>
              </div>

              {/* Navigation Directions Simulation if route active */}
              {showRoute && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="bg-blue-950/30 border border-blue-900/40 rounded-xl p-3 mb-4 text-xs text-blue-300"
                >
                  <div className="flex items-center gap-1.5 font-bold mb-1 font-mono">
                    <Navigation className="w-3.5 h-3.5 rotate-45" />
                    <span>ROUTE LAUNCHED</span>
                  </div>
                  <p className="text-[11px] text-gray-300 mb-2">Distance: 2.1 km | Est. Time: 6 mins via Sonpur Bridge Road</p>
                  <div className="space-y-1.5 font-mono text-[10px]">
                    <p className="text-[#FF6B00]">● Step 1: Head south on Bajrang Chowk toward Gandak Bridge Rd (0.5 km)</p>
                    <p className="text-gray-400">● Step 2: Turn right onto Sonpur Station Rd (1.2 km)</p>
                    <p className="text-gray-400">● Step 3: Arrive at Sonpur-Hajipur Incident Site (0.4 km)</p>
                  </div>
                </motion.div>
              )}

              {/* Footer timeline jump */}
              <div className="mt-auto pt-3 border-t border-gray-800 flex justify-between items-center">
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-gray-400">
                  <Clock className="w-3.5 h-3.5 text-[#FF6B00]" />
                  <span>Updated 3h ago</span>
                </div>
                <button
                  onClick={() => {
                    // This can be used in app to trigger parent full details modal
                    const modalBtn = document.getElementById(`view-btn-${zoomedComplaint.id}`);
                    if (modalBtn) modalBtn.click();
                  }}
                  className="text-xs text-[#FF6B00] hover:underline flex items-center font-semibold"
                >
                  Full Details <ChevronRight className="w-3 h-3 ml-0.5" />
                </button>
              </div>
            </motion.div>
          ) : showHeatMap ? (
            <motion.div
              key="heatmap-analyst"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col h-full overflow-y-auto p-4 space-y-4"
            >
              {/* Heatmap Analyst Panel */}
              <div className="flex items-center gap-2 border-b border-gray-800 pb-2">
                <Sparkles className="w-5 h-5 text-[#FF6B00] animate-pulse" />
                <div>
                  <h4 className="text-[9px] font-bold uppercase tracking-wider text-gray-400">Hotspot Analytics</h4>
                  <h3 className="text-xs font-black text-white">Infrastructure Planner</h3>
                </div>
              </div>

              {/* Density Metrics */}
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 text-xs space-y-1.5">
                <div className="flex justify-between font-mono">
                  <span className="text-amber-400">Unresolved Issues:</span>
                  <span className="font-bold text-white">{unresolvedComplaints.length}</span>
                </div>
                <div className="flex justify-between font-mono">
                  <span className="text-red-400">Critical Hotspots:</span>
                  <span className="font-bold text-white">
                    {unresolvedComplaints.filter(c => c.priority === ComplaintPriority.EMERGENCY || c.priority === ComplaintPriority.HIGH).length}
                  </span>
                </div>
                <div className="text-[10px] text-amber-300/80 leading-normal pt-1">
                  High-density hotspots identified based on cluster proximity and complaint frequency.
                </div>
              </div>

              {/* Recommended Infrastructure Allocation */}
              <div className="space-y-2">
                <p className="text-[10px] uppercase font-mono tracking-wider text-gray-400">Recommended Allocation</p>
                <div className="space-y-1.5">
                  {(() => {
                    const roadDamageCount = unresolvedComplaints.filter(c => c.category === ComplaintCategory.ROAD_DAMAGE || c.category === ComplaintCategory.BROKEN_FOOTPATH).length;
                    const waterCount = unresolvedComplaints.filter(c => c.category === ComplaintCategory.WATER_LOGGING || c.category === ComplaintCategory.DRAINAGE || c.category === ComplaintCategory.SEWAGE_OVERFLOW || c.category === ComplaintCategory.FLOOD).length;
                    const electricityCount = unresolvedComplaints.filter(c => c.category === ComplaintCategory.ELECTRICITY || c.category === ComplaintCategory.TRANSFORMER || c.category === ComplaintCategory.STREET_LIGHT).length;
                    const garbageCount = unresolvedComplaints.filter(c => c.category === ComplaintCategory.GARBAGE || c.category === ComplaintCategory.ILLEGAL_DUMPING || c.category === ComplaintCategory.CONSTRUCTION_WASTE).length;

                    return (
                      <>
                        {roadDamageCount > 0 && (
                          <div className="flex items-center justify-between p-2 rounded-lg bg-gray-950/40 border border-gray-800 text-[11px]">
                            <span className="text-gray-300 font-mono">🚚 Asphalt Patchers</span>
                            <span className="text-[#FF6B00] font-black">{Math.ceil(roadDamageCount / 2)} Units</span>
                          </div>
                        )}
                        {waterCount > 0 && (
                          <div className="flex items-center justify-between p-2 rounded-lg bg-gray-950/40 border border-gray-800 text-[11px]">
                            <span className="text-gray-300 font-mono">🌊 High-capacity Pumps</span>
                            <span className="text-blue-400 font-black">{Math.ceil(waterCount / 2)} Units</span>
                          </div>
                        )}
                        {electricityCount > 0 && (
                          <div className="flex items-center justify-between p-2 rounded-lg bg-gray-950/40 border border-gray-800 text-[11px]">
                            <span className="text-gray-300 font-mono">🪜 Grid Utility Trucks</span>
                            <span className="text-yellow-400 font-black">{Math.ceil(electricityCount / 2)} Units</span>
                          </div>
                        )}
                        {garbageCount > 0 && (
                          <div className="flex items-center justify-between p-2 rounded-lg bg-gray-950/40 border border-gray-800 text-[11px]">
                            <span className="text-gray-300 font-mono">♻️ Sanitation Crews</span>
                            <span className="text-green-400 font-black">{Math.ceil(garbageCount / 2)} Teams</span>
                          </div>
                        )}
                        {unresolvedComplaints.length === 0 && (
                          <div className="text-xs text-gray-400 italic py-2 text-center">
                            No active unresolved complaints. All clear!
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    const alertDiv = document.createElement('div');
                    alertDiv.className = "fixed bottom-5 right-5 bg-green-600 text-white font-bold text-xs px-4 py-3 rounded-xl shadow-2xl z-50 animate-bounce";
                    alertDiv.innerText = "🚨 Rapid Infrastructure Units successfully routed to top hotspots!";
                    document.body.appendChild(alertDiv);
                    setTimeout(() => alertDiv.remove(), 4000);
                  }}
                  className="w-full py-2 bg-[#FF6B00] hover:bg-orange-600 text-white text-xs font-black rounded-xl transition-all shadow-md active:scale-95 cursor-pointer text-center flex items-center justify-center gap-1.5"
                >
                  <Award className="w-4 h-4 text-white" />
                  Route Infrastructure Units
                </button>
                
                <div className="text-[9px] text-gray-500 font-mono text-center">
                  Data syncs live with State Nodal Agencies
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-6 text-gray-500">
              <Compass className="w-10 h-10 text-gray-700 mb-3 animate-spin-slow" />
              <h4 className="text-sm font-semibold text-gray-300 mb-1">Interactive Map Hub</h4>
              <p className="text-xs text-gray-500">
                Click any marker on the map or select an issue to inspect details, dispatch status, upvote counts, or initiate GPS navigation routing.
              </p>
            </div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
};
