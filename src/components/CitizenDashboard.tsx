/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { gsap } from "gsap";
import { useApp } from "../context/AppContext";
import { Complaint, ComplaintCategory, ComplaintPriority, ComplaintStatus } from "../types";
import { 
  Plus, 
  MapPin, 
  ThumbsUp, 
  Award, 
  ShieldAlert, 
  Zap, 
  CloudSun, 
  Volume2, 
  TrendingUp, 
  CheckCircle, 
  AlertTriangle, 
  MessageSquare, 
  Share2, 
  Filter, 
  PhoneCall, 
  X,
  Star,
  Users,
  Compass,
  Twitter,
  RefreshCw,
  Wrench,
  Truck,
  FileText,
  Activity,
  ChevronRight,
  Lock,
  Unlock,
  BookOpen,
  Check
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface CitizenDashboardProps {
  onNewComplaint: () => void;
  onSelectComplaint: (id: string) => void;
}

export const CitizenDashboard: React.FC<CitizenDashboardProps> = ({ onNewComplaint, onSelectComplaint }) => {
  const { 
    complaints, 
    upvoteComplaint, 
    citizenProfile, 
    setCitizenProfile,
    submitFeedback,
    notifications,
    addNotification 
  } = useApp();

  const myComplaints = complaints.filter(c => c.userId === citizenProfile.id || c.userId === "user-101");

  const [activeTab, setActiveTab] = useState<"all" | "my" | "upvoted" | "emergency" | "hero">("my");
  // Quiz states
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuizQ, setCurrentQuizQ] = useState(0);
  const [selectedQuizAns, setSelectedQuizAns] = useState<number | null>(null);
  const [quizFinished, setQuizFinished] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizUnlockedBadge, setQuizUnlockedBadge] = useState(false);

  // Certificate Modal State
  const [selectedBadgeCert, setSelectedBadgeCert] = useState<any | null>(null);

  const getCivicLevel = (score: number) => {
    if (score <= 300) {
      return {
        level: 1,
        title: "Local Sentinel",
        color: "from-amber-600 to-amber-700 text-amber-100",
        bg: "bg-amber-50 border-amber-200 text-amber-800",
        min: 0,
        max: 300,
        badgeName: "Bronze Badge"
      };
    } else if (score <= 500) {
      return {
        level: 2,
        title: "Civic Sentinel",
        color: "from-slate-500 to-slate-700 text-slate-100",
        bg: "bg-slate-50 border-slate-200 text-slate-800",
        min: 301,
        max: 500,
        badgeName: "Silver Badge"
      };
    } else if (score <= 700) {
      return {
        level: 3,
        title: "Community Guardian",
        color: "from-yellow-500 to-yellow-600 text-yellow-100",
        bg: "bg-yellow-50 border-yellow-200 text-yellow-800",
        min: 501,
        max: 700,
        badgeName: "Gold Badge"
      };
    } else if (score <= 850) {
      return {
        level: 4,
        title: "Saran Champion",
        color: "from-cyan-500 to-blue-600 text-cyan-100",
        bg: "bg-cyan-50 border-cyan-200 text-cyan-800",
        min: 701,
        max: 850,
        badgeName: "Diamond Badge"
      };
    } else {
      return {
        level: 5,
        title: "Sonpur Civic Hero",
        color: "from-orange-500 to-emerald-600 text-white",
        bg: "bg-orange-50 border-orange-200 text-orange-800",
        min: 851,
        max: 1000,
        badgeName: "Platinum Hero Shield"
      };
    }
  };

  // Computed stats for dynamic badge unlocking
  const feedbackGivenCount = myComplaints.filter(c => c.citizenRating !== undefined).length;
  const totalUpvotesOnMyReports = myComplaints.reduce((sum, c) => sum + c.upvotes, 0);
  const hasGpsCoords = myComplaints.some(c => c.location && c.location.latitude && c.location.latitude !== 0);

  const dynamicBadges = [
    {
      id: "badge-first-responder",
      title: "First Responder",
      description: "Reported your first civic hazard on the Sonepur site.",
      icon: "ShieldAlert",
      criteria: "Report at least 1 complaint",
      isUnlocked: myComplaints.length >= 1,
      dateEarned: myComplaints.length >= 1 ? "2026-06-20" : null,
      color: "bg-orange-500/10 text-orange-500 border-orange-500/30",
      flavor: "Awarded to citizens who take the first step towards public safety in Sonpur."
    },
    {
      id: "badge-feedback-crusader",
      title: "Feedback Crusader",
      description: "Rated and closed resolved municipal complaints to verify contractor work quality.",
      icon: "MessageSquare",
      criteria: "Submit feedback/rating on 1 resolved issue",
      isUnlocked: feedbackGivenCount >= 1,
      dateEarned: feedbackGivenCount >= 1 ? "2026-06-25" : null,
      color: "bg-green-500/10 text-green-500 border-green-500/30",
      flavor: "Honors collaborative citizens who verify that field works are resolved completely."
    },
    {
      id: "badge-eagle-eye",
      title: "Eagle Eye GPS",
      description: "Attached high-precision satellite telemetry coordinates to an active complaint.",
      icon: "Compass",
      criteria: "Lock live GPS coordinates",
      isUnlocked: hasGpsCoords || myComplaints.length >= 1,
      dateEarned: "2026-06-28",
      color: "bg-blue-500/10 text-blue-500 border-blue-500/30",
      flavor: "Awarded for providing precise spatial telemetry, guiding field workers with sub-meter accuracy."
    },
    {
      id: "badge-community-catalyst",
      title: "Community Catalyst",
      description: "Gained significant citizen support and upvotes on reported neighborhood problems.",
      icon: "ThumbsUp",
      criteria: "Earn 5+ community upvotes on your reports",
      isUnlocked: totalUpvotesOnMyReports >= 5 || citizenProfile.score >= 800,
      dateEarned: "2026-06-15",
      color: "bg-indigo-500/10 text-indigo-500 border-indigo-500/30",
      flavor: "Recognizes reports that voice collective neighborhood concerns, organizing community support."
    },
    {
      id: "badge-civic-scholar",
      title: "Civic Scholar",
      description: "Passed the Sonpur Interactive Civic Knowledge Module with a perfect score.",
      icon: "BookOpen",
      criteria: "Score 3/3 in Sonepur Civic Quiz",
      isUnlocked: quizUnlockedBadge || citizenProfile.score >= 865,
      dateEarned: quizUnlockedBadge ? new Date().toISOString().split('T')[0] : null,
      color: "bg-amber-500/10 text-[#FF6B00] border-amber-500/30",
      flavor: "Celebrates absolute familiarity with local administrative hierarchy, bypasses normal triage SLAs."
    },
    {
      id: "badge-sonpur-savior",
      title: "Saran Sentinel",
      description: "Achieved the prestigious level of Saran Champion by building a high reputation.",
      icon: "Zap",
      criteria: "Reach a Civic Score of 850+",
      isUnlocked: citizenProfile.score >= 850,
      dateEarned: citizenProfile.score >= 850 ? new Date().toISOString().split('T')[0] : null,
      color: "bg-purple-500/10 text-purple-500 border-purple-500/30",
      flavor: "The ultimate civic milestone. Earned by elite reporters who act as active eyes and ears of Saran district."
    }
  ];

  const renderBadgeIcon = (iconName: string, className: string = "w-6 h-6") => {
    switch (iconName) {
      case "ShieldAlert":
        return <ShieldAlert className={className} />;
      case "MessageSquare":
        return <MessageSquare className={className} />;
      case "Compass":
        return <Compass className={className} />;
      case "ThumbsUp":
        return <ThumbsUp className={className} />;
      case "BookOpen":
        return <BookOpen className={className} />;
      case "Zap":
        return <Zap className={className} />;
      case "Award":
        return <Award className={className} />;
      default:
        return <Award className={className} />;
    }
  };
  const [sosModalOpen, setSosModalOpen] = useState(false);
  const [voiceModalOpen, setVoiceModalOpen] = useState(false);
  const [voiceRecording, setVoiceRecording] = useState(false);
  const [voiceText, setVoiceText] = useState("");
  const [feedbackCompId, setFeedbackCompId] = useState<string | null>(null);
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState("");

  const [trackingCompId, setTrackingCompId] = useState<string>("");

  useEffect(() => {
    if (myComplaints.length > 0 && !trackingCompId) {
      setTrackingCompId(myComplaints[0].id);
    }
  }, [myComplaints, trackingCompId]);

  const triggerRefresh = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    // 1. Rotate the refresh button
    gsap.to(".refresh-icon-spin", {
      rotation: "+=360",
      duration: 0.8,
      ease: "power2.inOut"
    });

    // 2. Play a premium stagger fade/slide up on all complaint cards
    gsap.fromTo(".complaint-card-animate", 
      { opacity: 0, y: 30, scale: 0.95 },
      { 
        opacity: 1, 
        y: 0, 
        scale: 1, 
        duration: 0.6, 
        stagger: 0.05, 
        ease: "power3.out" 
      }
    );
    
    addNotification("Dashboard Refreshed", "Fetched latest reports in Sonpur and Hajipur sectors.", "success");
  };

  // Trigger stagger animation on initial mount and when changing active tabs
  useEffect(() => {
    gsap.fromTo(".complaint-card-animate", 
      { opacity: 0, y: 30, scale: 0.95 },
      { 
        opacity: 1, 
        y: 0, 
        scale: 1, 
        duration: 0.7, 
        stagger: 0.06, 
        ease: "power3.out",
        delay: 0.1
      }
    );
  }, [activeTab]);

  // Weather indicator (Sonpur-Hajipur Local Simulation)
  const weather = { temp: "30°C", condition: "Scattered Monsoon Rains", humidity: "85%", wind: "12 km/h" };

  // Filter complaints
  const filteredList = complaints.filter((c) => {
    if (activeTab === "all") return true;
    if (activeTab === "my") return c.userId === citizenProfile.id || c.userId === "user-101";
    if (activeTab === "upvoted") return c.hasUpvoted;
    if (activeTab === "emergency") return c.priority === ComplaintPriority.EMERGENCY;
    return true;
  });

  // Handle upvoting
  const handleUpvote = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    upvoteComplaint(id);
    addNotification("Voted!", "Your upvote signals public urgency to assigned ward contractors.", "info");
  };

  // Trigger SOS Alert
  const triggerSos = () => {
    setSosModalOpen(false);
    addNotification(
      "EMERGENCY SOS TRANSMITTED",
      "GPS coords, profile & medical IDs sent to Saran District Crisis Room. Emergency unit arriving in 4-6 minutes.",
      "alert"
    );
  };

  // Handle Voice simulated recording
  const startVoiceRecording = () => {
    setVoiceRecording(true);
    setVoiceText("");
    setTimeout(() => {
      setVoiceRecording(false);
      setVoiceText("The drainage pipe near Sonpur Bazar Chowk has completely choked and dark sewer water is overflowing into the main lane. It smells horrible and is attracting insects.");
    }, 3500);
  };

  const handleShare = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`https://onebharat.gov.in/track/${id}`);
    addNotification("Share link copied", "Complaint tracking link copied to clipboard.", "success");
  };

  const handlePostOnTwitter = (comp: Complaint, e: React.MouseEvent) => {
    e.stopPropagation();
    const text = encodeURIComponent(`📢 Civic Alert in Sonpur/Hajipur, Bihar!\n📌 Title: ${comp.title}\n📍 Location: ${comp.location.address}\n🏢 Status: ${comp.status}\nReported via OneBharat 🇮🇳`);
    const url = `https://twitter.com/intent/tweet?text=${text}`;
    window.open(url, "_blank");
    addNotification("Twitter Opened", "Redirecting you to Twitter with the post draft.", "success");
  };

  return (
    <div id="citizen-dashboard" className="space-y-6">
      
      {/* EMERGENCY SOS BANNER & QUICK INFO GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Urgent Emergency Banner */}
        <div className="lg:col-span-2 bg-gradient-to-r from-red-600 to-amber-600 rounded-2xl p-4 text-white shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-white/20 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">CIVIC CRITICAL</span>
              <span className="w-2 h-2 rounded-full bg-white animate-ping" />
            </div>
            <h3 className="font-sans font-bold text-lg leading-tight mb-1">
              Active Monsoon Safety Portal
            </h3>
            <p className="text-xs text-white/90 leading-normal max-w-sm">
              Keep distances from open gutters and reported electric short-circuits. Report emergency drainage leaks instantly for fast action.
            </p>
          </div>

          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setSosModalOpen(true)}
              className="px-4 py-2 bg-white text-red-600 hover:bg-red-50 font-bold rounded-xl text-xs shadow transition-all flex items-center gap-1.5"
            >
              <ShieldAlert className="w-4 h-4 text-red-500" />
              Emergency SOS
            </button>
            <button
              onClick={() => setVoiceModalOpen(true)}
              className="px-4 py-2 bg-black/30 hover:bg-black/40 text-white font-semibold rounded-xl text-xs transition-all flex items-center gap-1.5"
            >
              <Volume2 className="w-4 h-4" />
              Voice Lodging
            </button>
          </div>
        </div>

        {/* Dynamic Weather & Ward Widget */}
        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] uppercase font-mono tracking-wider text-gray-400">Current Ward</p>
              <h4 className="font-sans font-bold text-gray-800 text-sm">Ward No. 4, Sonpur / Hajipur</h4>
            </div>
            <CloudSun className="w-7 h-7 text-[#FF6B00]" />
          </div>
          
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
            <div>
              <span className="text-xl font-bold text-gray-800">{weather.temp}</span>
              <span className="text-[11px] text-gray-500 block">{weather.condition}</span>
            </div>
            <div className="text-[10px] text-right font-mono text-gray-400">
              <p>Humidity: {weather.humidity}</p>
              <p>Wind: {weather.wind}</p>
            </div>
          </div>
        </div>

        {/* Civic Score Meter Card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm flex flex-col justify-between group hover:border-orange-200 transition-all">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] uppercase font-mono tracking-wider text-gray-400">Civic Tier</p>
              <div className="flex items-center gap-1.5">
                <span className="font-sans font-black text-gray-800 text-sm">
                  {getCivicLevel(citizenProfile.score).title}
                </span>
                <span className="text-[10px] font-mono text-gray-450">
                  ({citizenProfile.score} pts)
                </span>
              </div>
            </div>
            <Award className="w-7 h-7 text-amber-500 group-hover:scale-110 transition-transform" />
          </div>
          
          <div className="mt-2">
            {/* Visual Progress bar */}
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden mb-1.5">
              <div 
                className="h-full bg-gradient-to-r from-orange-500 to-green-500 transition-all duration-1000" 
                style={{ width: `${(citizenProfile.score / 1000) * 100}%` }}
              />
            </div>
            <button
              onClick={() => setActiveTab("hero")}
              className="text-[10px] text-[#FF6B00] font-bold hover:underline flex items-center gap-0.5 text-left"
            >
              Check Civic Badges & Level Progress →
            </button>
          </div>
        </div>
      </div>

      {/* COMPLAINT PROCESS TRACKER WIDGET (KAHA KAT PROCESS HUA) */}
      <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl p-5 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-800 pb-3">
          <div className="space-y-0.5">
            <h4 className="font-sans font-black text-xs text-[#FF6B00] uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-orange-500 animate-pulse" />
              Real-time Complaint Tracker & Progress Check
            </h4>
            <p className="text-[11px] text-gray-400">
              Check where your filed tickets have reached in the municipal dispatch hierarchy.
            </p>
          </div>

          {myComplaints.length > 0 ? (
            <select
              value={trackingCompId}
              onChange={(e) => setTrackingCompId(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-white text-xs px-3 py-1.5 rounded-xl font-medium focus:border-[#FF6B00] outline-none cursor-pointer max-w-xs"
            >
              {myComplaints.map(c => (
                <option key={c.id} value={c.id} className="bg-slate-900 text-white">
                  [{c.id}] {c.title.slice(0, 30)}...
                </option>
              ))}
            </select>
          ) : (
            <span className="text-[10px] bg-slate-800 text-gray-400 px-2 py-1 rounded font-mono">No complaints filed yet</span>
          )}
        </div>

        {(() => {
          const selectedTrackingComp = complaints.find(c => c.id === trackingCompId);
          if (selectedTrackingComp) {
            return (
              <div className="space-y-4 animate-fade-in">
                {/* 4-Step Visual Progress Bar */}
                <div className="relative pt-2 pb-1">
                  {/* Connecting Background Line */}
                  <div className="absolute top-[22px] left-[10%] right-[10%] h-1 bg-slate-800 rounded-full z-0" />
                  
                  {/* Connecting Active Fill Line based on status */}
                  <div 
                    className="absolute top-[22px] left-[10%] h-1 bg-gradient-to-r from-orange-500 to-green-500 rounded-full z-0 transition-all duration-1000" 
                    style={{ 
                      width: 
                        selectedTrackingComp.status === ComplaintStatus.SUBMITTED ? "0%" :
                        selectedTrackingComp.status === ComplaintStatus.DISPATCHED ? "26%" :
                        selectedTrackingComp.status === ComplaintStatus.IN_PROGRESS ? "56%" :
                        "80%" // Resolved/Closed
                    }}
                  />

                  {/* Progress Nodes */}
                  <div className="grid grid-cols-4 relative z-10">
                    {/* Node 1: Submitted */}
                    <div className="flex flex-col items-center text-center">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                        selectedTrackingComp.status === ComplaintStatus.SUBMITTED 
                          ? "bg-[#FF6B00] text-white ring-4 ring-orange-500/20 animate-pulse" 
                          : "bg-orange-500 text-white"
                      }`}>
                        <FileText className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-bold mt-1.5 block">Submitted</span>
                      <span className="text-[8px] text-gray-400 block font-mono">Ticket Created</span>
                    </div>

                    {/* Node 2: Dispatched */}
                    {(() => {
                      const isActive = selectedTrackingComp.status === ComplaintStatus.DISPATCHED;
                      const isPassed = [ComplaintStatus.DISPATCHED, ComplaintStatus.IN_PROGRESS, ComplaintStatus.RESOLVED, ComplaintStatus.CLOSED].includes(selectedTrackingComp.status);
                      return (
                        <div className="flex flex-col items-center text-center">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                            isActive 
                              ? "bg-blue-500 text-white ring-4 ring-blue-500/20 animate-pulse" 
                              : isPassed 
                              ? "bg-blue-600 text-white" 
                              : "bg-slate-800 text-slate-500"
                          }`}>
                            <Truck className="w-4 h-4" />
                          </div>
                          <span className={`text-[10px] font-bold mt-1.5 block ${isPassed ? "text-blue-400" : "text-gray-500"}`}>Dispatched</span>
                          <span className="text-[8px] text-gray-400 block font-mono">Ward Assigned</span>
                        </div>
                      );
                    })()}

                    {/* Node 3: In Progress */}
                    {(() => {
                      const isActive = selectedTrackingComp.status === ComplaintStatus.IN_PROGRESS;
                      const isPassed = [ComplaintStatus.IN_PROGRESS, ComplaintStatus.RESOLVED, ComplaintStatus.CLOSED].includes(selectedTrackingComp.status);
                      return (
                        <div className="flex flex-col items-center text-center">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                            isActive 
                              ? "bg-amber-500 text-white ring-4 ring-amber-500/20 animate-pulse" 
                              : isPassed 
                              ? "bg-amber-600 text-white" 
                              : "bg-slate-800 text-slate-500"
                          }`}>
                            <Wrench className="w-4 h-4" />
                          </div>
                          <span className={`text-[10px] font-bold mt-1.5 block ${isPassed ? "text-amber-400" : "text-gray-500"}`}>In Progress</span>
                          <span className="text-[8px] text-gray-400 block font-mono">Repair Underway</span>
                        </div>
                      );
                    })()}

                    {/* Node 4: Resolved */}
                    {(() => {
                      const isPassed = [ComplaintStatus.RESOLVED, ComplaintStatus.CLOSED].includes(selectedTrackingComp.status);
                      return (
                        <div className="flex flex-col items-center text-center">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                            isPassed 
                              ? "bg-green-500 text-white ring-4 ring-green-500/20 animate-pulse" 
                              : "bg-slate-800 text-slate-500"
                          }`}>
                            <CheckCircle className="w-4 h-4" />
                          </div>
                          <span className={`text-[10px] font-bold mt-1.5 block ${isPassed ? "text-green-400" : "text-gray-500"}`}>Resolved</span>
                          <span className="text-[8px] text-gray-400 block font-mono">Verified & Closed</span>
                        </div>
                      );
                    })()}
                  </div>
                </div>

                {/* Current Action details summary */}
                <div className="bg-slate-950 border border-slate-850 p-3 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-mono uppercase bg-slate-800 text-[#FF6B00] px-2 py-0.5 rounded font-bold">
                        Latest Activity Logs
                      </span>
                      <span className="text-[10px] text-gray-400 font-mono">
                        {new Date(selectedTrackingComp.updatedAt || selectedTrackingComp.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-300 leading-relaxed italic">
                      "{selectedTrackingComp.timeline[selectedTrackingComp.timeline.length - 1]?.notes || "Complaint registered. AI dispatch engine routing ticket."}"
                    </p>
                  </div>

                  <button
                    onClick={() => onSelectComplaint(selectedTrackingComp.id)}
                    className="w-full sm:w-auto px-4 py-1.5 bg-[#FF6B00] hover:bg-orange-600 text-white font-bold rounded-xl text-[11px] flex items-center justify-center gap-1 shadow-md shadow-orange-500/10 transition-all cursor-pointer whitespace-nowrap"
                  >
                    Open Audit Timeline <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          } else {
            return (
              <div className="text-center py-6 bg-slate-950/40 rounded-xl border border-slate-800/50">
                <p className="text-xs text-gray-400 italic">No complaints selected. Choose a complaint from the dropdown above to view real-time process tracker.</p>
              </div>
            );
          }
        })()}
      </div>

      {/* SEARCH AND TAB NAV PANEL */}
      <div className="flex flex-col md:flex-row gap-3 justify-between items-center bg-white p-3 border border-gray-200 rounded-2xl shadow-sm">
        <div className="flex gap-1.5 overflow-x-auto w-full md:w-auto">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
              activeTab === "all" ? "bg-[#FF6B00] text-white" : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            All Community Issues ({complaints.length})
          </button>
          <button
            onClick={() => setActiveTab("my")}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
              activeTab === "my" ? "bg-[#FF6B00] text-white" : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            My Filed Reports
          </button>
          <button
            onClick={() => setActiveTab("upvoted")}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
              activeTab === "upvoted" ? "bg-[#FF6B00] text-white" : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            Upvoted Issues
          </button>
          <button
            onClick={() => setActiveTab("emergency")}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
              activeTab === "emergency" ? "bg-red-500 text-white" : "text-red-500 hover:bg-red-50"
            }`}
          >
            Critical Emergencies
          </button>
          <button
            onClick={() => setActiveTab("hero")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === "hero" ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow font-bold" : "text-amber-750 hover:bg-amber-50/60"
            }`}
          >
            <Award className="w-3.5 h-3.5 animate-pulse" /> Civic Hero Center 🌟
          </button>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            onClick={triggerRefresh}
            className="p-2 text-gray-400 hover:text-[#FF6B00] hover:bg-orange-50 border border-gray-200 hover:border-orange-200 rounded-xl transition-all shadow-sm bg-white flex items-center justify-center cursor-pointer"
            title="Refresh Dashboard"
          >
            <RefreshCw className="refresh-icon-spin w-4 h-4" />
          </button>
          
          <button
            onClick={onNewComplaint}
            className="w-full md:w-auto px-4 py-2 bg-[#FF6B00] hover:bg-orange-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            File New Complaint
          </button>
        </div>
      </div>

      {/* RESOLUTION RATING MODAL (TRIGGERED IF COMPLAINT RESOLVED & RATING NOT SUBMITTED) */}
      {complaints.filter(c => c.status === ComplaintStatus.RESOLVED && !c.citizenRating && (c.userId === citizenProfile.id || c.userId === "user-101")).map((comp) => (
        <motion.div 
          key={`rating-alert-${comp.id}`}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-green-50 border border-green-200 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-green-500/10 rounded-xl text-green-600">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-green-700 bg-green-200/40 px-2 py-0.5 rounded">RESOLVED</span>
              <h4 className="font-sans font-bold text-green-900 text-sm mt-1">Verify and Close Complaint: {comp.id}</h4>
              <p className="text-xs text-green-700 mt-0.5">{comp.title}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setFeedbackCompId(comp.id)}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl text-xs shadow-md transition-all"
            >
              Confirm & Rate
            </button>
          </div>
        </motion.div>
      ))}

      {/* LIVE COMPLAINTS FEED OR CIVIC HERO PROGRESS PANEL */}
      {activeTab === "hero" ? (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          className="space-y-6"
        >
          {/* PROFILE CARD & LEVEL STATS */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 rounded-2xl p-6 text-white shadow-xl border border-slate-850 relative overflow-hidden">
            {/* Background decorative circles */}
            <div className="absolute -right-12 -top-12 w-48 h-48 bg-[#FF6B00]/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img
                    src={citizenProfile.avatar}
                    alt={citizenProfile.name}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-[#FF6B00] shadow-md"
                  />
                  <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full p-1.5 shadow border border-slate-900">
                    <Award className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <h3 className="font-sans font-black text-lg text-white leading-tight">
                    {citizenProfile.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] bg-white/10 text-orange-400 font-mono font-bold px-2 py-0.5 rounded-full uppercase border border-orange-500/20">
                      Tier: {getCivicLevel(citizenProfile.score).title}
                    </span>
                    <span className="text-xs text-gray-350 font-mono">
                      Civic Score: <b>{citizenProfile.score} / 1000</b>
                    </span>
                  </div>
                </div>
              </div>

              {/* Next Level Progression Bar */}
              <div className="flex-1 max-w-md bg-white/5 border border-white/10 p-4 rounded-xl space-y-2">
                <div className="flex justify-between text-xs text-gray-350 font-medium">
                  <span>Current Tier ({getCivicLevel(citizenProfile.score).title})</span>
                  <span>
                    {citizenProfile.score < 1000 
                      ? `Next: ${getCivicLevel(citizenProfile.score + 150).title}` 
                      : "Max Tier!"}
                  </span>
                </div>
                
                {/* Custom Level Meter Bar */}
                {(() => {
                  const levelData = getCivicLevel(citizenProfile.score);
                  const currentScoreOffset = citizenProfile.score - levelData.min;
                  const totalLevelRange = Math.max(1, levelData.max - levelData.min);
                  const percent = Math.min(100, Math.max(0, (currentScoreOffset / totalLevelRange) * 100));
                  return (
                    <div className="space-y-1">
                      <div className="h-2.5 w-full bg-white/15 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-orange-500 via-amber-400 to-emerald-500 rounded-full transition-all duration-1000"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <div className="flex justify-between items-center text-[10px] font-mono text-gray-400">
                        <span>Min: {levelData.min} pts</span>
                        <span>{percent.toFixed(0)}% Progress to Next Tier</span>
                        <span>Max: {levelData.max} pts</span>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>

          {/* BADGES GALLERY DIRECTORY */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-sans font-bold text-gray-800 text-base">Digital 'Civic Hero' Badges</h3>
                <p className="text-xs text-gray-500">Your official achievements based on reported issues, ratings, and participation in Sonpur.</p>
              </div>
              <span className="text-xs font-mono font-bold bg-orange-50 text-[#FF6B00] border border-orange-100 px-2.5 py-1 rounded-full">
                Unlocked: {dynamicBadges.filter(b => b.isUnlocked).length} / {dynamicBadges.length}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {dynamicBadges.map((badge) => {
                return (
                  <motion.div
                    key={badge.id}
                    whileHover={{ y: -3 }}
                    onClick={() => {
                      if (badge.isUnlocked) {
                        setSelectedBadgeCert(badge);
                      } else {
                        addNotification(
                          "Badge Locked",
                          `To unlock this badge: ${badge.criteria}`,
                          "warning"
                        );
                      }
                    }}
                    className={`p-4 rounded-2xl border transition-all relative overflow-hidden flex flex-col justify-between min-h-[140px] ${
                      badge.isUnlocked 
                        ? "bg-white border-orange-200 hover:border-orange-400 cursor-pointer shadow-sm hover:shadow" 
                        : "bg-gray-50/70 border-gray-200 opacity-65"
                    }`}
                  >
                    <div>
                      {/* Top status */}
                      <div className="flex justify-between items-start mb-2">
                        <div className={`p-2 rounded-xl border ${
                          badge.isUnlocked ? badge.color : "bg-gray-100 text-gray-400 border-gray-200"
                        }`}>
                          {renderBadgeIcon(badge.icon, "w-5 h-5")}
                        </div>
                        {badge.isUnlocked ? (
                          <span className="text-[9px] bg-green-50 text-green-700 font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5">
                            <CheckCircle className="w-2.5 h-2.5 text-green-600" /> Unlocked
                          </span>
                        ) : (
                          <span className="text-[9px] bg-gray-100 text-gray-500 font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5">
                            <Lock className="w-2.5 h-2.5" /> Locked
                          </span>
                        )}
                      </div>

                      <h4 className="font-sans font-bold text-gray-800 text-xs">{badge.title}</h4>
                      <p className="text-[10px] text-gray-500 leading-normal mt-1 line-clamp-2">
                        {badge.description}
                      </p>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-[9px] font-mono text-gray-400">
                        {badge.isUnlocked ? `Earned: ${badge.dateEarned || "June 2026"}` : `Req: ${badge.criteria}`}
                      </span>
                      {badge.isUnlocked ? (
                        <span className="text-[10px] text-[#FF6B00] font-bold hover:underline flex items-center gap-0.5">
                          Certificate ↗
                        </span>
                      ) : (
                        <span className="text-[10px] text-gray-450 font-medium">
                          Locked
                        </span>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* INTERACTIVE QUIZ & SCORE BOOST CARD */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* INTERACTIVE LOCAL CIVIC QUIZ PANEL */}
            <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-amber-50 rounded-xl text-amber-500">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-sans font-bold text-gray-800 text-sm">Sonepur Interactive Civic Quiz</h4>
                    <p className="text-[10px] text-gray-500">Test your municipal knowledge & secure +25 pts + "Civic Scholar" Badge!</p>
                  </div>
                </div>
                <span className="text-[10px] bg-orange-50 text-[#FF6B00] font-mono font-bold px-2 py-1 rounded">
                  Reward: +25 Points
                </span>
              </div>

              {!quizStarted && !quizFinished ? (
                <div className="text-center py-6 space-y-3">
                  <Compass className="w-12 h-12 text-orange-200 mx-auto animate-spin" style={{ animationDuration: "12s" }} />
                  <h5 className="font-sans font-bold text-gray-750 text-xs font-semibold">Ready to earn the Civic Scholar Badge?</h5>
                  <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
                    Prove your familiarity with Sonepur local development procedures, rivers boundary management, and ward coordination. You must answer 3/3 correct to pass.
                  </p>
                  <button
                    onClick={() => {
                      setQuizStarted(true);
                      setCurrentQuizQ(0);
                      setSelectedQuizAns(null);
                      setQuizScore(0);
                    }}
                    className="px-5 py-2 bg-[#FF6B00] hover:bg-orange-600 text-white font-bold rounded-xl text-xs shadow transition-all cursor-pointer"
                  >
                    Start Smart Civic Quiz
                  </button>
                </div>
              ) : quizStarted ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-[10px] font-mono text-gray-400">
                    <span>QUESTION {currentQuizQ + 1} OF 3</span>
                    <span>SCORE: {quizScore}/3</span>
                  </div>

                  {/* Question header */}
                  <h5 className="font-sans font-bold text-gray-800 text-xs leading-snug">
                    {currentQuizQ === 0 && "Q1: What is the historical confluence where Sonpur is located, celebrated annually during the Sonepur Harihar Kshetra Mela?"}
                    {currentQuizQ === 1 && "Q2: How does the Sonpur Citizen Portal (sonpur.site.je) direct your complaint to local field contractors?"}
                    {currentQuizQ === 2 && "Q3: What is the target SLA response window for emergency electrical or sewage logging hazards reported on this system?"}
                  </h5>

                  {/* Options */}
                  <div className="space-y-2">
                    {(currentQuizQ === 0 
                      ? ["Ganga and Yamuna Rivers", "Gandak and Ganga Rivers", "Kosi and Son Rivers", "Phalgu and Punpun Rivers"] 
                      : currentQuizQ === 1 
                      ? ["By printing reports in local newspapers", "Using high-precision sat-ping telemetry GPS coordinates", "Sending physical mail to Patna headquarters", "Manual log verification on notice boards"] 
                      : ["15 to 30 Days processing", "4 to 8 Hours dispatch SLA window", "3 Months budget clearance window", "Immediate solution next fiscal year"]
                    ).map((option, idx) => {
                      const isSelected = selectedQuizAns === idx;
                      return (
                        <button
                          key={idx}
                          onClick={() => setSelectedQuizAns(idx)}
                          className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-center justify-between ${
                            isSelected 
                              ? "bg-orange-50 border-[#FF6B00] font-bold text-orange-950" 
                              : "bg-slate-50 hover:bg-slate-100 border-gray-200 text-gray-700"
                          }`}
                        >
                          <span>{String.fromCharCode(65 + idx)}) {option}</span>
                          {isSelected && <span className="w-2 h-2 rounded-full bg-[#FF6B00]" />}
                        </button>
                      );
                    })}
                  </div>

                  {/* Quiz action button */}
                  <div className="flex justify-end pt-2">
                    <button
                      disabled={selectedQuizAns === null}
                      onClick={() => {
                        // Check if answer is correct (all B / index 1 are correct!)
                        const isCorrect = selectedQuizAns === 1;
                        const nextScore = isCorrect ? quizScore + 1 : quizScore;
                        setQuizScore(nextScore);

                        if (currentQuizQ < 2) {
                          setCurrentQuizQ(currentQuizQ + 1);
                          setSelectedQuizAns(null);
                        } else {
                          setQuizStarted(false);
                          setQuizFinished(true);
                          
                          // Check if passed (3/3)
                          if (nextScore === 3) {
                            setQuizUnlockedBadge(true);
                            setCitizenProfile(prev => ({
                              ...prev,
                              score: Math.min(1000, prev.score + 25)
                            }));
                            addNotification(
                              "Quiz Cleared!",
                              "Perfect 3/3! You secured +25 Civic Points and unlocked the 'Civic Scholar' Badge.",
                              "success"
                            );
                          } else {
                            addNotification(
                              "Quiz Completed",
                              `You scored ${nextScore}/3. Answer 3/3 correct to unlock the badge.`,
                              "warning"
                            );
                          }
                        }
                      }}
                      className="px-4 py-2 bg-[#FF6B00] hover:bg-orange-600 disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center gap-1 shadow transition-all cursor-pointer"
                    >
                      {currentQuizQ < 2 ? "Next Question" : "Finish Quiz"}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 space-y-4">
                  {quizScore === 3 ? (
                    <div className="space-y-2">
                      <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      </div>
                      <h5 className="font-sans font-bold text-green-800 text-xs">Congratulations! Perfect Score 3/3</h5>
                      <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
                        Excellent civic prowess. You have unlocked the **Civic Scholar Badge** and earned **+25 Civic Reputation points**! Your reports now bypass standard queue filters.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
                        <X className="w-6 h-6" />
                      </div>
                      <h5 className="font-sans font-bold text-red-800 text-xs">Score: {quizScore}/3</h5>
                      <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
                        To unlock the prestigious Civic Scholar digital credential, you must score a perfect 3/3. Give it another shot!
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={() => {
                        setQuizFinished(false);
                        setQuizStarted(true);
                        setCurrentQuizQ(0);
                        setSelectedQuizAns(null);
                        setQuizScore(0);
                      }}
                      className="px-4 py-2 border border-[#FF6B00] text-[#FF6B00] hover:bg-orange-50 font-bold rounded-xl text-xs transition-all cursor-pointer"
                    >
                      {quizScore === 3 ? "Re-take Quiz" : "Try Again"}
                    </button>
                    {quizScore === 3 && (
                      <button
                        onClick={() => setActiveTab("my")}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-all cursor-pointer"
                      >
                        File Fast-Track Complaint
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* HOW TO BOOST SCORE CARD */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4">
              <h4 className="font-sans font-extrabold text-xs text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-[#FF6B00]" /> Civic Reputation Guide
              </h4>
              <p className="text-[11px] text-gray-500 leading-normal">
                Build your ranking in Sonepur Ward No. 4 and earn high dispatch priority for your reports.
              </p>

              <div className="space-y-3 pt-2">
                {[
                  { title: "Report a New Defect", reward: "+20 Pts", desc: "Attach high-precision GPS coordinate pin.", done: myComplaints.length >= 1 },
                  { title: "Upvote Neighborhood Alert", reward: "+5 Pts", desc: "Help officers triage critical local reports.", done: complaints.some(c => c.hasUpvoted) },
                  { title: "Submit Resolution Feedback", reward: "+15 Pts", desc: "Verify speed & work quality with rating.", done: feedbackGivenCount >= 1 },
                  { title: "Complete Local Knowledge", reward: "+25 Pts", desc: "Clear Sonepur Interactive Quiz module.", done: quizUnlockedBadge || citizenProfile.score >= 865 }
                ].map((item, idx) => (
                  <div key={idx} className="flex justify-between items-start gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-150">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${item.done ? "bg-green-500" : "bg-[#FF6B00]"}`} />
                        <span className="font-sans font-bold text-gray-700 text-xs">{item.title}</span>
                      </div>
                      <p className="text-[9px] text-gray-400 mt-0.5">{item.desc}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] font-mono font-bold bg-white px-1.5 py-0.5 border rounded block text-slate-600">
                        {item.reward}
                      </span>
                      {item.done ? (
                        <span className="text-[8px] text-green-600 font-bold mt-1 block">Earned ✓</span>
                      ) : (
                        <span className="text-[8px] text-gray-400 mt-1 block">Active</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredList.length > 0 ? (
            filteredList.map((comp) => {
              const hasStatusResolved = comp.status === ComplaintStatus.RESOLVED;
              const priorityColors = 
                comp.priority === ComplaintPriority.EMERGENCY 
                  ? "text-red-600 bg-red-50 border-red-100" 
                  : comp.priority === ComplaintPriority.HIGH 
                  ? "text-orange-600 bg-orange-50 border-orange-100" 
                  : "text-blue-600 bg-blue-50 border-blue-100";

              return (
                <motion.div
                  key={comp.id}
                  layoutId={`card-${comp.id}`}
                  onClick={() => onSelectComplaint(comp.id)}
                  className="complaint-card-animate bg-white hover:bg-slate-50/50 border border-gray-200 hover:border-gray-300 rounded-2xl p-4 shadow-sm hover:shadow transition-all cursor-pointer flex flex-col justify-between gap-3 group relative overflow-hidden w-full min-w-0 break-words"
                >
                  {/* Visual Glow Indicator for Emergency */}
                  {comp.priority === ComplaintPriority.EMERGENCY && (
                    <div className="absolute top-0 left-0 w-full h-1 bg-red-500" />
                  )}

                  <div className="min-w-0 w-full overflow-hidden break-words">
                    {/* Category, Date & Priority */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono tracking-wider text-gray-400">{comp.id}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold border ${priorityColors}`}>
                        {comp.priority}
                      </span>
                    </div>

                    {/* Title & Description */}
                    <h3 className="font-sans font-bold text-gray-800 text-sm group-hover:text-[#FF6B00] transition-colors break-words line-clamp-2">
                      {comp.title}
                    </h3>
                    <p className="text-xs text-gray-500 leading-normal line-clamp-2 mt-1 break-words">
                      {comp.description}
                    </p>
                  </div>

                  {/* Ward & Department Tags */}
                  <div className="flex items-center gap-1 text-gray-400 text-[10px] bg-slate-50 px-2 py-1.5 rounded-lg border border-slate-100 font-mono">
                    <MapPin className="w-3.5 h-3.5 text-[#FF6B00]" />
                    <span className="truncate">{comp.location.address}</span>
                  </div>

                  {/* Footer Action Buttons & Status */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => handleUpvote(comp.id, e)}
                        className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                          comp.hasUpvoted 
                            ? "bg-orange-50 text-[#FF6B00] border-orange-200" 
                            : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>{comp.upvotes}</span>
                      </button>

                      <button
                        onClick={(e) => handleShare(comp.id, e)}
                        className="p-1.5 bg-white hover:bg-gray-50 text-gray-500 border border-gray-200 rounded-xl transition-all"
                        title="Copy Share Link"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={(e) => handlePostOnTwitter(comp, e)}
                        className="p-1.5 bg-sky-50 hover:bg-sky-100 text-sky-500 border border-sky-100 rounded-xl transition-all"
                        title="Post on Twitter / X"
                      >
                        <Twitter className="w-3.5 h-3.5 fill-current" />
                      </button>
                    </div>

                    {/* Status indicator */}
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                      comp.status === ComplaintStatus.RESOLVED 
                        ? "bg-green-100 text-green-700" 
                        : comp.status === ComplaintStatus.IN_PROGRESS 
                        ? "bg-amber-100 text-amber-700" 
                        : comp.status === ComplaintStatus.DISPATCHED 
                        ? "bg-blue-100 text-blue-700" 
                        : "bg-gray-100 text-gray-700"
                    }`}>
                      {comp.status}
                    </span>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="col-span-2 text-center py-12 bg-white rounded-2xl border border-gray-200 shadow-inner">
              <Compass className="w-12 h-12 text-gray-300 mx-auto mb-3 animate-spin-slow" />
              <h4 className="font-sans font-bold text-gray-700 text-sm">No Active Reports in Tab</h4>
              <p className="text-xs text-gray-400 max-w-sm mx-auto mt-1">
                Select 'All Community Issues' or change your priority filter criteria to fetch complaints.
              </p>
            </div>
          )}
        </div>
      )}

      {/* SOS CONFIRMATION MODAL */}
      <AnimatePresence>
        {sosModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-gray-200 rounded-2xl p-6 max-w-md w-full shadow-2xl relative"
            >
              <button 
                onClick={() => setSosModalOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-600 animate-pulse mb-4">
                  <ShieldAlert className="w-8 h-8" />
                </div>
                <h3 className="font-sans font-bold text-gray-800 text-lg mb-1">Trigger OneBharat Emergency SOS</h3>
                <p className="text-xs text-gray-500 mb-4 leading-normal">
                  You are about to launch a municipal emergency SOS packet. This broadcasts your live GPS, registered cellular ID, and profile directly to the Municipal Disaster Room.
                </p>

                <div className="bg-red-50 border border-red-100 p-3 rounded-xl text-left mb-6 font-mono text-[11px] text-red-700">
                  <p className="font-bold">BROADCAST INFO:</p>
                  <p>● Latitude: 25.6980 N | Longitude: 85.1725 E</p>
                  <p>● Ward: No. 4, Sonpur / Hajipur, Bihar</p>
                  <p>● Citizen: Arjun Mehta (+91 98765 43210)</p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setSosModalOpen(false)}
                    className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl text-xs transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={triggerSos}
                    className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs shadow-md shadow-red-200 transition-all flex items-center justify-center gap-1.5"
                  >
                    <PhoneCall className="w-4 h-4" />
                    Transmit SOS
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* VOICE COMPLAINT SUBMISSION MODAL */}
      <AnimatePresence>
        {voiceModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-gray-200 rounded-2xl p-6 max-w-lg w-full shadow-2xl relative"
            >
              <button 
                onClick={() => setVoiceModalOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center">
                <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center text-white mb-4 ${
                  voiceRecording ? "bg-red-600 animate-ping" : "bg-[#FF6B00]"
                }`}>
                  <Volume2 className="w-8 h-8" />
                </div>
                <h3 className="font-sans font-bold text-gray-800 text-lg mb-1">AI Voice Complaint Capture</h3>
                <p className="text-xs text-gray-500 mb-6 leading-normal">
                  Tap 'Start Speaking' and state your issue in English, Hindi, or local dialect. OneBharat's AI will parse your spoken voice, auto-categorize the problem, select priority, and locate coordinates.
                </p>

                <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl min-h-[100px] flex flex-col justify-center items-center text-center mb-6">
                  {voiceRecording ? (
                    <div className="space-y-2">
                      <span className="text-xs text-red-600 font-bold tracking-wider animate-pulse uppercase">Recording... Speak Now</span>
                      <div className="flex gap-1 justify-center">
                        <div className="w-1 h-4 bg-red-600 animate-bounce" style={{ animationDelay: "0.1s" }} />
                        <div className="w-1 h-6 bg-red-600 animate-bounce" style={{ animationDelay: "0.2s" }} />
                        <div className="w-1 h-3 bg-red-600 animate-bounce" style={{ animationDelay: "0.3s" }} />
                        <div className="w-1 h-5 bg-red-600 animate-bounce" style={{ animationDelay: "0.4s" }} />
                      </div>
                    </div>
                  ) : voiceText ? (
                    <div className="text-left w-full">
                      <span className="text-[10px] font-bold text-[#FF6B00] uppercase block mb-1">AI Transcription Output</span>
                      <p className="text-xs text-gray-700 italic leading-relaxed">"{voiceText}"</p>
                      
                      <div className="mt-3 grid grid-cols-2 gap-2 text-[10px] font-mono text-gray-500 pt-2.5 border-t border-gray-100">
                        <p>● Detected Category: <b className="text-gray-700">Sewage Overflow</b></p>
                        <p>● Confidence Score: <b className="text-green-600">98.4%</b></p>
                      </div>
                    </div>
                  ) : (
                    <span className="text-xs text-gray-400">Microphone input idle. Ready to stream audio packet.</span>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setVoiceText("");
                      setVoiceModalOpen(false);
                    }}
                    className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl text-xs transition-all"
                  >
                    Close
                  </button>
                  <button
                    onClick={startVoiceRecording}
                    disabled={voiceRecording}
                    className="flex-1 px-4 py-2 bg-[#FF6B00] hover:bg-orange-600 disabled:opacity-50 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                  >
                    <Volume2 className="w-4 h-4" />
                    {voiceRecording ? "Speaking..." : "Start Speaking"}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* RATING SUBMISSION MODAL */}
      <AnimatePresence>
        {feedbackCompId && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-gray-200 rounded-2xl p-6 max-w-md w-full shadow-2xl relative"
            >
              <button 
                onClick={() => setFeedbackCompId(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center">
                <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-3">
                  <Star className="w-6 h-6 fill-current" />
                </div>
                <h3 className="font-sans font-bold text-gray-800 text-base mb-1">Rate Complaint Resolution</h3>
                <p className="text-xs text-gray-500 mb-4">
                  Please review the field verification upload for case <b>{feedbackCompId}</b> and rate the work quality.
                </p>

                {/* Rating Stars Selection */}
                <div className="flex gap-1.5 justify-center mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setFeedbackRating(star)}
                      className="p-1 rounded-full hover:scale-110 transition-transform"
                    >
                      <Star className={`w-8 h-8 ${star <= feedbackRating ? "text-amber-400 fill-current" : "text-gray-200"}`} />
                    </button>
                  ))}
                </div>

                <div className="mb-4">
                  <textarea
                    rows={3}
                    placeholder="Provide additional details or notes about the resolution speed or quality..."
                    value={feedbackComment}
                    onChange={(e) => setFeedbackComment(e.target.value)}
                    className="w-full bg-slate-50 border border-gray-200 focus:border-[#FF6B00] rounded-xl text-xs p-3 outline-none text-gray-800 placeholder:text-gray-400"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setFeedbackCompId(null)}
                    className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl text-xs transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (feedbackCompId) {
                        submitFeedback(feedbackCompId, feedbackRating, feedbackComment);
                        setFeedbackCompId(null);
                        setFeedbackComment("");
                        setFeedbackRating(5);
                      }
                    }}
                    className="flex-1 px-4 py-2 bg-[#FF6B00] hover:bg-orange-600 text-white font-bold rounded-xl text-xs shadow-md transition-all"
                  >
                    Verify & Close Case
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CERTIFICATE OF VALOR MODAL */}
      <AnimatePresence>
        {selectedBadgeCert && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white border-8 border-amber-100 rounded-3xl p-6 max-w-xl w-full shadow-2xl relative overflow-hidden"
              style={{ backgroundImage: 'radial-gradient(circle at top right, rgba(255,107,0,0.02), transparent)' }}
            >
              {/* Gold Ribbon decoration */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-400 to-yellow-600 text-white flex items-center justify-center font-serif text-[11px] font-bold shadow-md transform rotate-45 translate-x-8 -translate-y-8 origin-center">
                OFFICIAL
              </div>

              <button 
                onClick={() => setSelectedBadgeCert(null)}
                className="absolute top-4 left-4 text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-150 z-20"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center space-y-6 pt-4 relative">
                
                {/* Header credentials */}
                <div className="space-y-1">
                  <span className="text-[9px] tracking-widest font-mono font-bold text-gray-400 uppercase block">
                    OneBharat State Grievance Network
                  </span>
                  <span className="text-[10px] tracking-widest font-sans font-bold text-[#FF6B00] uppercase block">
                    Sonepur Municipal Administration, Saran District
                  </span>
                </div>

                {/* Main Crest icon */}
                <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-yellow-500 text-white rounded-full flex items-center justify-center mx-auto shadow-lg shadow-amber-500/20">
                  {renderBadgeIcon(selectedBadgeCert.icon, "w-8 h-8")}
                </div>

                {/* Certificate title */}
                <div className="space-y-1.5">
                  <h4 className="font-serif font-bold text-gray-800 text-lg tracking-wide uppercase">
                    Certificate of Civic Excellence
                  </h4>
                  <p className="text-[11px] text-gray-400 italic font-serif">This official digital token of honor is presented to</p>
                </div>

                {/* Citizen Name */}
                <div className="space-y-1 py-1 border-y border-dashed border-amber-200 max-w-md mx-auto">
                  <h3 className="font-sans font-black text-slate-800 text-xl tracking-tight uppercase">
                    {citizenProfile.name}
                  </h3>
                  <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Citizen ID: {citizenProfile.id}</p>
                </div>

                {/* Citation */}
                <div className="max-w-md mx-auto space-y-3">
                  <p className="text-xs text-gray-600 leading-relaxed font-serif">
                    "For outstanding civic vigilance and proactive reporting. By securing the <strong className="text-slate-800">{selectedBadgeCert.title}</strong> credential, this citizen has actively assisted local Sonepur Ward Officers in locating, auditing, and resolving key neighborhood hazards."
                  </p>
                  
                  <p className="text-[10px] text-gray-400 font-mono italic">
                    {selectedBadgeCert.flavor}
                  </p>
                </div>

                {/* Footer seal, signatures & QR */}
                <div className="grid grid-cols-3 items-end gap-2 pt-4 max-w-lg mx-auto">
                  {/* Signature 1 */}
                  <div className="text-center space-y-1 border-t border-gray-100 pt-2.5">
                    <span className="font-serif text-[11px] italic text-slate-800 block">Saran S. P.</span>
                    <span className="text-[8px] text-gray-400 uppercase block font-mono">Nodal Ward Director</span>
                  </div>

                  {/* QR code simulation */}
                  <div className="flex flex-col items-center">
                    <div className="w-14 h-14 bg-slate-50 border-2 border-amber-100 rounded-lg p-1 flex items-center justify-center">
                      {/* Styled Vector QR Code block */}
                      <div className="grid grid-cols-4 gap-0.5 w-full h-full">
                        {[...Array(16)].map((_, i) => (
                          <div 
                            key={i} 
                            className={`rounded-sm ${(i % 3 === 0 || i % 5 === 2 || i === 0 || i === 3 || i === 12 || i === 15) ? "bg-slate-800" : "bg-transparent"}`} 
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-[7px] text-gray-400 font-mono mt-1 uppercase tracking-widest">VERIFIED TOKEN</span>
                  </div>

                  {/* Signature 2 */}
                  <div className="text-center space-y-1 border-t border-gray-100 pt-2.5">
                    <span className="font-serif text-[11px] italic text-slate-800 block">Niket Raj</span>
                    <span className="text-[8px] text-gray-400 uppercase block font-mono">Super-App Architect</span>
                  </div>
                </div>

                {/* Social Share actions */}
                <div className="flex gap-2 justify-center pt-4 border-t border-dashed border-gray-100">
                  <button
                    onClick={() => {
                      addNotification(
                        "Certificate Downloaded",
                        `Successfully generated high-resolution security certificate token for ${selectedBadgeCert.title}.`,
                        "success"
                      );
                      setSelectedBadgeCert(null);
                    }}
                    className="px-4 py-1.5 bg-slate-900 hover:bg-black text-white font-bold rounded-xl text-xs flex items-center gap-1 shadow transition-all cursor-pointer"
                  >
                    Download Digital Copy
                  </button>
                  <button
                    onClick={() => {
                      const text = encodeURIComponent(`📢 Proud to earn the '${selectedBadgeCert.title}' digital credential on the official Sonepur Citizen Portal (sonpur.site.je)! Join me in keeping Sonpur clean and hazard-free. 🇮🇳`);
                      window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
                      addNotification("Social Shared", "Opened Twitter share dialogue.", "success");
                    }}
                    className="px-4 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-600 font-bold border border-sky-200 rounded-xl text-xs flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <Twitter className="w-3.5 h-3.5 fill-current" /> Share Badge
                  </button>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
