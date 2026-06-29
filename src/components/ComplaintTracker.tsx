/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Complaint, ComplaintStatus, ComplaintPriority } from "../types";
import { googleSignIn, getAccessToken } from "../lib/firebaseAuth";
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
  ChevronRight,
  Mail,
  Send,
  CheckCircle2,
  RefreshCw
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
  
  const [sendingConfirmMail, setSendingConfirmMail] = useState(false);
  const [confirmMailSent, setConfirmMailSent] = useState(false);

  const comp = complaints.find((c) => c.id === complaintId);

  const handleGmailConfirmation = async () => {
    if (!comp) return;
    setSendingConfirmMail(true);
    try {
      let token = await getAccessToken();
      if (!token) {
        const authRes = await googleSignIn();
        if (authRes) {
          token = authRes.accessToken;
        }
      }

      if (!token) {
        addNotification("Authorization Required", "Please connect your Google account to authorize secure mail sending.", "warning");
        setSendingConfirmMail(false);
        return;
      }

      const officerEmail = comp.location.address.includes("Sonpur") ? "sonpur.warden@gmail.com" : "hajipur.corporator@gmail.com";
      const subjectLine = `[CIVIC STATUS CONFIRMATION] Ticket ${comp.id} - ${comp.title}`;
      const bodyText = `Dear Ward Officer / Nodal Supervisor,

I am writing to seek an official progress confirmation and status validation for the following active complaint in your ward division:

📌 TICKET REFERENCE: ${comp.id}
📍 LOCATION: ${comp.location.address}
🏢 ASSIGNED DEPT: ${comp.department}
🚨 CURRENT STATUS: ${comp.status} (Priority: ${comp.priority})

Details of the Complaint:
"${comp.description}"

Please review the progress of this ticket, confirm whether dispatch crews are actively deployed, and verify the expected resolution completion timeframe.

Best regards,
OneBharat Citizen Verification`;

      const emailLines = [
        `To: ${officerEmail}`,
        "Content-Type: text/html; charset=utf-8",
        "MIME-Version: 1.0",
        `Subject: ${subjectLine}`,
        "",
        `<div style="font-family: sans-serif; color: #334155; line-height: 1.6; max-width: 600px; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
          <h2 style="color: #FF6B00; margin-top: 0; font-size: 20px;">🇮🇳 OneBharat Civic Status Handshake</h2>
          <p style="font-size: 13px; font-weight: bold; color: #475569;">Official status verification query regarding registered grievance.</p>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 15px 0;" />
          <div style="background-color: #f8fafc; padding: 15px; border-radius: 10px; margin-bottom: 20px; border-left: 4px solid #FF6B00;">
            ${bodyText.replace(/\n/g, "<br />")}
          </div>
          <p style="font-size: 11px; color: #64748b; margin-top: 35px; border-t: 1px solid #f1f5f9; padding-top: 15px;">
            This email was sent securely using your authorized Google Workspace OAuth configuration.
          </p>
        </div>`
      ];

      const emailStr = emailLines.join("\r\n");
      const base64Safe = btoa(unescape(encodeURIComponent(emailStr)))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");

      const sendRes = await fetch(
        "https://gmail.googleapis.com/gmail/v1/users/me/messages/send",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ raw: base64Safe }),
        }
      );

      if (!sendRes.ok) {
        throw new Error("API request failed");
      }

      setConfirmMailSent(true);
      addNotification("Email Handshake Sent", `Status query successfully delivered to ${officerEmail}.`, "success");
    } catch (err) {
      console.error("Gmail confirm error:", err);
      addNotification("Failed to transmit", "Handshake failed. Ensure permissions are granted.", "warning");
    } finally {
      setSendingConfirmMail(false);
    }
  };

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

          {/* GMAIL HANDSHAKE & CONFIRMATION BOX */}
          <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl p-5 shadow-lg space-y-3.5 relative overflow-hidden">
            <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-32 h-32 bg-red-500/10 rounded-full blur-2xl pointer-events-none"></div>
            
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2.5">
              <div className="p-1.5 bg-red-500/10 text-red-400 rounded-lg">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-sans font-bold text-sm">Gmail Handshake</h4>
                <p className="text-[9px] font-mono text-[#FF6B00] uppercase font-bold tracking-wider">Verify & Confirm Ticket</p>
              </div>
            </div>

            <p className="text-[11px] text-gray-300 leading-relaxed">
              Triggers a secure Google Workspace mail dispatch. Sends an official verification query to the dispatcher desk to request an urgent on-site field assessment.
            </p>

            {confirmMailSent ? (
              <div className="p-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl flex items-center gap-2 text-xs font-bold font-sans">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Handshake delivered to desk!</span>
              </div>
            ) : (
              <button
                onClick={handleGmailConfirmation}
                disabled={sendingConfirmMail}
                className="w-full py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-red-800/50 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-red-600/15 cursor-pointer disabled:opacity-50"
              >
                {sendingConfirmMail ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Encrypting & Dispatching...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm via Gmail</span>
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            )}
          </div>

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
