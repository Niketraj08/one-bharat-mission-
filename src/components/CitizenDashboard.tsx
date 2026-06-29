/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
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
  Compass
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
    submitFeedback,
    notifications,
    addNotification 
  } = useApp();

  const [activeTab, setActiveTab] = useState<"all" | "my" | "upvoted" | "emergency">("all");
  const [sosModalOpen, setSosModalOpen] = useState(false);
  const [voiceModalOpen, setVoiceModalOpen] = useState(false);
  const [voiceRecording, setVoiceRecording] = useState(false);
  const [voiceText, setVoiceText] = useState("");
  const [feedbackCompId, setFeedbackCompId] = useState<string | null>(null);
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState("");

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
      setVoiceText("The drainage pipe near Sahebganj Market Chowk has completely choked and dark sewer water is overflowing into the main lane. It smells horrible and is attracting insects.");
    }, 3500);
  };

  const handleShare = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`https://onebharat.gov.in/track/${id}`);
    addNotification("Share link copied", "Complaint tracking link copied to clipboard.", "success");
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
        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] uppercase font-mono tracking-wider text-gray-400">Civic Score</p>
              <h4 className="font-sans font-bold text-[#FF6B00] text-lg">{citizenProfile.score} / 1000</h4>
            </div>
            <Award className="w-7 h-7 text-amber-500" />
          </div>
          
          <div>
            {/* Visual Progress bar */}
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden mt-2 mb-1.5">
              <div 
                className="h-full bg-gradient-to-r from-orange-500 to-green-500" 
                style={{ width: `${(citizenProfile.score / 1000) * 100}%` }}
              />
            </div>
            <p className="text-[10px] text-gray-400 leading-tight">
              Top 8% in Sonpur-Hajipur! You earned +35 score points this week by assisting and rating.
            </p>
          </div>
        </div>
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
        </div>

        <button
          onClick={onNewComplaint}
          className="w-full md:w-auto px-4 py-2 bg-[#FF6B00] hover:bg-orange-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow transition-all"
        >
          <Plus className="w-4 h-4" />
          File New Complaint
        </button>
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

      {/* LIVE COMPLAINTS FEED / BENTO CARDS */}
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
                className="bg-white hover:bg-slate-50/50 border border-gray-200 hover:border-gray-300 rounded-2xl p-4 shadow-sm hover:shadow transition-all cursor-pointer flex flex-col justify-between gap-3 group relative overflow-hidden"
              >
                {/* Visual Glow Indicator for Emergency */}
                {comp.priority === ComplaintPriority.EMERGENCY && (
                  <div className="absolute top-0 left-0 w-full h-1 bg-red-500" />
                )}

                <div>
                  {/* Category, Date & Priority */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono tracking-wider text-gray-400">{comp.id}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold border ${priorityColors}`}>
                      {comp.priority}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-sans font-bold text-gray-800 text-sm group-hover:text-[#FF6B00] transition-colors line-clamp-1">
                    {comp.title}
                  </h3>
                  <p className="text-xs text-gray-500 leading-normal line-clamp-2 mt-1">
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

    </div>
  );
};
