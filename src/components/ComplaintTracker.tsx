/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Complaint, ComplaintStatus, ComplaintPriority } from "../types";
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  ThumbsUp, 
  Share2, 
  CheckCircle, 
  AlertTriangle,
  Star,
  MessageSquare,
  ShieldCheck,
  Award,
  ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ComplaintTrackerProps {
  complaintId: string;
  onBack: () => void;
  onViewOnMap: () => void;
}

export const ComplaintTracker: React.FC<ComplaintTrackerProps> = ({ complaintId, onBack, onViewOnMap }) => {
  const { complaints, upvoteComplaint, submitFeedback, addNotification } = useApp();

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  const comp = complaints.find((c) => c.id === complaintId);

  if (!comp) {
    return (
      <div className="text-center py-16 bg-white border border-gray-200 rounded-3xl p-6">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-3" />
        <h4 className="font-sans font-bold text-gray-700 text-sm">Complaint ID Not Found</h4>
        <p className="text-xs text-gray-400 mt-1">
          The tracking ticket <b>{complaintId}</b> does not exist or has been archived.
        </p>
        <button
          onClick={onBack}
          className="mt-4 px-4 py-2 bg-gray-900 text-white font-bold rounded-xl text-xs"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const handleUpvote = () => {
    upvoteComplaint(comp.id);
    addNotification("Voted!", "Your vote signals urgent attention to local ward administrators.", "info");
  };

  const handleRatingSubmit = () => {
    submitFeedback(comp.id, rating, comment);
    setRatingSubmitted(true);
    addNotification("Rating Recorded", "Thank you for validating field work quality.", "success");
  };

  const isResolved = comp.status === ComplaintStatus.RESOLVED;
  const isClosed = comp.status === ComplaintStatus.CLOSED;

  return (
    <div id="complaint-tracker" className="max-w-3xl mx-auto space-y-6">
      
      {/* HEADER BANNER */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center bg-white p-4 border border-gray-200 rounded-3xl shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 bg-slate-50 hover:bg-slate-100 text-gray-600 rounded-full transition-all border border-gray-150"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-gray-400">{comp.id}</span>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                comp.priority === ComplaintPriority.EMERGENCY 
                  ? "bg-red-50 text-red-600 border border-red-100" 
                  : "bg-blue-50 text-blue-600 border border-blue-100"
              }`}>
                {comp.priority} Priority
              </span>
            </div>
            <h3 className="font-sans font-bold text-gray-800 text-base leading-tight mt-1 truncate max-w-sm sm:max-w-md">
              {comp.title}
            </h3>
          </div>
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={onViewOnMap}
            className="flex-1 sm:flex-initial px-3.5 py-2 bg-blue-50 hover:bg-blue-100 border border-blue-100 text-blue-700 font-bold rounded-xl text-xs flex items-center justify-center gap-1 transition-all"
          >
            <MapPin className="w-4 h-4" /> View on Map
          </button>
          <button
            onClick={handleUpvote}
            className={`flex-1 sm:flex-initial px-3.5 py-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
              comp.hasUpvoted 
                ? "bg-orange-50 text-[#FF6B00] border-orange-200" 
                : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
            }`}
          >
            <ThumbsUp className="w-4 h-4" />
            <span>{comp.upvotes} Upvotes</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* PROGRESS TIMELINE (LEFT/TOP) */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-3xl p-5 shadow-sm space-y-6">
          <h4 className="font-sans font-bold text-gray-800 text-sm flex items-center gap-2 border-b border-gray-100 pb-3">
            <Clock className="w-5 h-5 text-[#FF6B00]" /> Live Dispatch Timeline
          </h4>

          {/* Timeline Node Chain */}
          <div className="relative border-l border-gray-100 pl-6 ml-3.5 space-y-6 pb-2">
            {comp.timeline.map((event, idx) => {
              const isLatest = idx === comp.timeline.length - 1;
              const nodeColors = 
                event.status === ComplaintStatus.RESOLVED || event.status === ComplaintStatus.CLOSED
                  ? "bg-green-500 border-white text-white ring-4 ring-green-100" 
                  : event.status === ComplaintStatus.IN_PROGRESS 
                  ? "bg-amber-500 border-white text-white ring-4 ring-amber-100" 
                  : "bg-blue-500 border-white text-white ring-4 ring-blue-100";

              return (
                <div key={event.id} className="relative">
                  {/* Circle indicator node */}
                  <span className={`absolute -left-[37px] top-0.5 flex items-center justify-center w-5.5 h-5.5 rounded-full border-2 font-mono text-[9px] ${nodeColors}`}>
                    {idx + 1}
                  </span>

                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[10px] font-mono text-gray-400">
                      <span className="font-bold text-gray-700">{event.status}</span>
                      <span>{new Date(event.date).toLocaleDateString()} {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed bg-slate-50/60 p-2.5 rounded-xl border border-slate-100/60">
                      {event.notes}
                    </p>

                    {/* Uploaded Verification photo if exists */}
                    {event.evidencePhoto && (
                      <div className="relative mt-2 rounded-xl overflow-hidden max-h-40 w-full border border-gray-150">
                        <img 
                          src={event.evidencePhoto} 
                          alt="Field Evidence Upload" 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover" 
                        />
                        <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur px-2 py-0.5 rounded text-[8px] text-white font-mono uppercase tracking-wider">
                          Verification Photo
                        </div>
                      </div>
                    )}

                    <div className="text-[9px] font-mono text-gray-400 flex items-center gap-1.5 mt-1">
                      <User className="w-3.5 h-3.5 text-[#FF6B00]" />
                      <span>Updated By: <b className="text-gray-600">{event.updatedBy}</b></span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* COMPLAINT DETAILS & RATING BOX (RIGHT/BOTTOM) */}
        <div className="space-y-4">
          
          {/* ASSIGNED OFFICER INFO */}
          {comp.officerName ? (
            <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm space-y-3">
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">Assigned Ward Officer</span>
              <div className="flex items-center gap-3">
                <img 
                  src={comp.category === "Street Light" ? "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200" : "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200"} 
                  alt={comp.officerName} 
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-full object-cover border border-gray-200" 
                />
                <div>
                  <h4 className="font-sans font-bold text-gray-800 text-sm">{comp.officerName}</h4>
                  <p className="text-[10px] font-mono text-gray-400 leading-none mt-0.5">{comp.department}</p>
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t border-gray-100">
                <a
                  href={`tel:${comp.officerContact}`}
                  className="flex-1 py-1.5 bg-slate-50 hover:bg-slate-100 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 flex items-center justify-center gap-1"
                >
                  <Phone className="w-3.5 h-3.5 text-green-500" /> Dial Officer
                </a>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">Assigned Ward Officer</span>
              <p className="text-xs text-gray-400 italic mt-2">
                Ai is parsing municipal coordinates to route this complaint directly to the correct Ward Engineer. Check back in 10 minutes.
              </p>
            </div>
          )}

          {/* CITIZEN CLOSE & SURVEY PORTAL */}
          {isResolved && !comp.citizenRating && (
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-5 shadow-sm space-y-4">
              <div>
                <h4 className="font-sans font-bold text-green-900 text-sm flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-green-600" /> Quality Verification Survey
                </h4>
                <p className="text-[11px] text-green-700 leading-normal mt-1">
                  The ward engineer reported this case resolved. Please rate the quality of the asphalt/electrical repair below to officially close the ticket.
                </p>
              </div>

              {/* Stars selection */}
              <div className="flex gap-1.5 justify-center py-2 border-y border-green-150">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className="p-0.5 hover:scale-115 transition-transform"
                  >
                    <Star className={`w-7 h-7 ${star <= rating ? "text-amber-500 fill-current" : "text-gray-300"}`} />
                  </button>
                ))}
              </div>

              {/* Feedback comment input */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-green-800 block">Additional Notes / Comments</label>
                <textarea
                  rows={2}
                  placeholder="Provide brief notes on resolution quality..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full bg-white border border-green-200 focus:border-[#FF6B00] rounded-xl text-xs p-2.5 outline-none text-gray-800 placeholder:text-gray-400"
                />
              </div>

              <button
                onClick={handleRatingSubmit}
                className="w-full py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl text-xs shadow-md transition-all"
              >
                Confirm Repair & Archive
              </button>
            </div>
          )}

          {/* ARCHIVED COMPLAINT RATING STATUS */}
          {(comp.citizenRating || ratingSubmitted) && (
            <div className="bg-slate-50 border border-gray-200 rounded-2xl p-4 shadow-sm text-center space-y-2">
              <Award className="w-8 h-8 text-amber-500 mx-auto" />
              <h4 className="font-sans font-bold text-gray-800 text-xs">Official Case Closed</h4>
              <p className="text-[10px] text-gray-400">
                Citizen rated resolution: <b>{comp.citizenRating || rating}/5 stars</b>
              </p>
              {comp.citizenFeedback && (
                <p className="text-[11px] italic text-gray-500 bg-white p-2 border border-gray-100 rounded-lg">
                  "{comp.citizenFeedback}"
                </p>
              )}
            </div>
          )}

          {/* BASIC METRICS CARD */}
          <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm space-y-2 text-xs text-gray-600 font-mono text-[11px]">
            <p>● Lodged Date: <b>{new Date(comp.createdAt).toLocaleDateString()}</b></p>
            <p>● Ward boundaries: <b>{comp.location.ward}</b></p>
            <p>● State coordinates: <b>{comp.location.state}</b></p>
            <p>● Anonymous Filing: <b>{comp.isAnonymous ? "Yes (Private)" : "No (Public)"}</b></p>
          </div>

        </div>

      </div>

    </div>
  );
};
