/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Complaint, ComplaintStatus, ComplaintPriority } from "../types";
import { 
  Briefcase, 
  CheckCircle, 
  AlertTriangle, 
  Upload, 
  MapPin, 
  Navigation, 
  Compass, 
  ChevronRight, 
  FileText, 
  TrendingUp, 
  User, 
  Clock, 
  CheckSquare, 
  Camera,
  Star
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface OfficerPortalProps {
  onSelectComplaint: (id: string) => void;
}

export const OfficerPortal: React.FC<OfficerPortalProps> = ({ onSelectComplaint }) => {
  const { complaints, updateComplaintStatus, addNotification } = useApp();

  const [selectedCase, setSelectedCase] = useState<Complaint | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState("");
  const [uploadedEvidence, setUploadedEvidence] = useState("");
  const [dailyChecklist, setDailyChecklist] = useState([
    { id: "task-1", label: "Cold-asphalt mix inspection at Gandak Bridge Road, Sonpur", done: true },
    { id: "task-2", label: "Verify electrical cables underground feed at Sonpur Bazar", done: true },
    { id: "task-3", label: "Dispatch sanitation suction truck to Hajipur Cinema Road", done: false },
    { id: "task-4", label: "Submit weekly dewatering pump logs to ward commissioner", done: false }
  ]);

  // Filter complaints assigned to our mock officers (Ramesh Shinde or Kavita Rao)
  const assignedCases = complaints.filter(
    (c) => c.status !== ComplaintStatus.CLOSED && c.status !== ComplaintStatus.RESOLVED
  );

  // Stats
  const activeCount = assignedCases.length;
  const completedCount = complaints.filter((c) => c.status === ComplaintStatus.RESOLVED || c.status === ComplaintStatus.CLOSED).length;

  const handleTaskToggle = (id: string) => {
    setDailyChecklist((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
    addNotification("Task Updated", "Your daily checklist has been updated locally.", "info");
  };

  // Handle status update
  const handleUpdateStatus = (status: ComplaintStatus) => {
    if (!selectedCase) return;
    
    // Auto populate default note if empty
    const finalNote = resolutionNotes || `Field team evaluated. Status updated to: ${status}. Equipment assigned and scheduled.`;
    
    updateComplaintStatus(
      selectedCase.id,
      status,
      finalNote,
      "Inspector Ramesh Shinde", // Mock Officer Name
      uploadedEvidence || "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=600"
    );

    addNotification(
      "Dispatch Record Saved",
      `Ticket ${selectedCase.id} updated to ${status}. Notification sent to reporter.`,
      "success"
    );

    setSelectedCase(null);
    setResolutionNotes("");
    setUploadedEvidence("");
  };

  // Mock snapping evidence photo
  const handleCameraSnap = () => {
    const snaps = [
      "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1517059224940-d4af9eec41b7?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=600"
    ];
    setUploadedEvidence(snaps[Math.floor(Math.random() * snaps.length)]);
  };

  return (
    <div id="officer-portal" className="space-y-6">
      
      {/* HEADER STATISTICS BAR */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 p-4 rounded-2xl shadow-sm">
          <p className="text-[10px] uppercase font-mono tracking-wider text-gray-400">Assigned Tasks</p>
          <h3 className="text-2xl font-bold text-gray-800 mt-1">{activeCount} Cases</h3>
          <p className="text-xs text-gray-400 mt-1">Pending immediate dispatch or repair</p>
        </div>

        <div className="bg-white border border-gray-200 p-4 rounded-2xl shadow-sm">
          <p className="text-[10px] uppercase font-mono tracking-wider text-gray-400">My Resolutions</p>
          <h3 className="text-2xl font-bold text-green-600 mt-1">{completedCount} Closed</h3>
          <p className="text-xs text-gray-400 mt-1">This quarter resolution total</p>
        </div>

        <div className="bg-white border border-gray-200 p-4 rounded-2xl shadow-sm">
          <p className="text-[10px] uppercase font-mono tracking-wider text-gray-400">Avg Resolution Speed</p>
          <h3 className="text-2xl font-bold text-blue-600 mt-1">11.4 Hrs</h3>
          <p className="text-xs text-gray-400 mt-1">Top 5% speed in MCQ district</p>
        </div>

        <div className="bg-white border border-gray-200 p-4 rounded-2xl shadow-sm">
          <p className="text-[10px] uppercase font-mono tracking-wider text-gray-400">Citizen Rating Score</p>
          <div className="flex items-center gap-1.5 mt-1">
            <h3 className="text-2xl font-bold text-amber-500">4.9</h3>
            <div className="flex text-amber-400">
              <Star className="w-4 h-4 fill-current" />
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-1">Based on 115 feedback surveys</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* ASSIGNED COMPLAINTS SECTION (LEFT COLUMN) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-sans font-bold text-gray-800 text-base flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-[#FF6B00]" /> Live Ward Assignments
            </h3>
            <span className="text-xs font-mono bg-[#FF6B00]/10 text-[#FF6B00] px-2.5 py-0.5 rounded-full font-bold">
              {assignedCases.length} active
            </span>
          </div>

          <div className="space-y-3">
            {assignedCases.length > 0 ? (
              assignedCases.map((comp) => {
                const isSelected = selectedCase?.id === comp.id;
                const priorityColors = 
                  comp.priority === ComplaintPriority.EMERGENCY 
                    ? "text-red-600 bg-red-50 border-red-100" 
                    : comp.priority === ComplaintPriority.HIGH 
                    ? "text-orange-600 bg-orange-50 border-orange-100" 
                    : "text-blue-600 bg-blue-50 border-blue-100";

                return (
                  <div
                    key={comp.id}
                    onClick={() => {
                      setSelectedCase(comp);
                      setResolutionNotes("");
                      setUploadedEvidence("");
                    }}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected 
                        ? "bg-slate-50 border-[#FF6B00] shadow" 
                        : "bg-white border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-[10px] font-mono text-gray-400">{comp.id}</span>
                          <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded uppercase border ${priorityColors}`}>
                            {comp.priority}
                          </span>
                        </div>
                        <h4 className="font-sans font-bold text-gray-800 text-sm">{comp.title}</h4>
                        <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{comp.description}</p>
                      </div>

                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        comp.status === ComplaintStatus.IN_PROGRESS 
                          ? "bg-amber-100 text-amber-700" 
                          : comp.status === ComplaintStatus.DISPATCHED 
                          ? "bg-blue-100 text-blue-700" 
                          : "bg-gray-100 text-gray-700"
                      }`}>
                        {comp.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-[10px] text-gray-400 font-mono mt-3 pt-2.5 border-t border-gray-100">
                      <MapPin className="w-3.5 h-3.5 text-[#FF6B00]" />
                      <span className="truncate">{comp.location.address}</span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
                <CheckCircle className="w-10 h-10 text-green-500 mx-auto mb-2" />
                <h4 className="font-sans font-bold text-gray-700 text-sm">All Assignments Resolved</h4>
                <p className="text-xs text-gray-400 mt-0.5">Check daily task board or sync dashboard for new tickets.</p>
              </div>
            )}
          </div>
        </div>

        {/* WORK BENCH DETAILS & SUBMISSION (RIGHT COLUMN) */}
        <div className="space-y-4">
          <AnimatePresence mode="wait">
            {selectedCase ? (
              <motion.div
                key={`workbench-${selectedCase.id}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4"
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-mono text-gray-400">{selectedCase.id}</span>
                    <button 
                      onClick={() => setSelectedCase(null)}
                      className="text-gray-400 hover:text-gray-600 text-xs font-semibold"
                    >
                      Close Bench
                    </button>
                  </div>
                  <h3 className="font-sans font-bold text-gray-800 text-sm leading-snug">{selectedCase.title}</h3>
                  <p className="text-xs text-gray-500 line-clamp-3 mt-1 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    {selectedCase.description}
                  </p>
                </div>

                {/* Progress Status Selectors */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700 block">Transition Status</label>
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      onClick={() => handleUpdateStatus(ComplaintStatus.DISPATCHED)}
                      className={`py-1.5 rounded-lg border text-[10px] font-bold uppercase ${
                        selectedCase.status === ComplaintStatus.DISPATCHED 
                          ? "bg-blue-50 border-blue-400 text-blue-700" 
                          : "bg-white text-gray-600 hover:bg-slate-50"
                      }`}
                    >
                      Dispatch
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(ComplaintStatus.IN_PROGRESS)}
                      className={`py-1.5 rounded-lg border text-[10px] font-bold uppercase ${
                        selectedCase.status === ComplaintStatus.IN_PROGRESS 
                          ? "bg-amber-50 border-amber-400 text-amber-700" 
                          : "bg-white text-gray-600 hover:bg-slate-50"
                      }`}
                    >
                      In Progress
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(ComplaintStatus.RESOLVED)}
                      className={`py-1.5 rounded-lg border text-[10px] font-bold uppercase ${
                        selectedCase.status === ComplaintStatus.RESOLVED 
                          ? "bg-green-50 border-green-400 text-green-700" 
                          : "bg-green-600 text-white hover:bg-green-700"
                      }`}
                    >
                      Resolve Case
                    </button>
                  </div>
                </div>

                {/* Upload Proof / Verify Photo Area */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700 block">Resolution Proof Photograph</label>
                  <div className="flex gap-2 items-center">
                    <button
                      onClick={handleCameraSnap}
                      className="flex-1 py-3 border-2 border-dashed border-gray-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-gray-600 flex flex-col items-center justify-center gap-1 transition-all"
                    >
                      <Camera className="w-5 h-5 text-gray-400" />
                      <span>Take verification photo</span>
                    </button>

                    {uploadedEvidence && (
                      <div className="w-14 h-14 rounded-xl overflow-hidden border border-gray-200 shadow-sm flex-shrink-0">
                        <img src={uploadedEvidence} alt="Evidence Proof" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Resolution Summary Text box */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700 block">Work Logs / Resolution Notes</label>
                  <textarea
                    rows={3}
                    placeholder="Enter concrete dispatch details or asphalt mix details for the ward logs..."
                    value={resolutionNotes}
                    onChange={(e) => setResolutionNotes(e.target.value)}
                    className="w-full bg-slate-50 border border-gray-200 focus:border-[#FF6B00] rounded-xl text-xs p-2.5 outline-none text-gray-800 placeholder:text-gray-400"
                  />
                </div>

                {/* Tracking trigger */}
                <button
                  onClick={() => onSelectComplaint(selectedCase.id)}
                  className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs flex items-center justify-center gap-1"
                >
                  <FileText className="w-3.5 h-3.5" />
                  View Full Case History
                </button>
              </motion.div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4">
                <h4 className="font-sans font-bold text-gray-800 text-sm flex items-center gap-1.5">
                  <CheckSquare className="w-4 h-4 text-[#FF6B00]" /> Daily Field Checklist
                </h4>
                <p className="text-[11px] text-gray-400 leading-normal">
                  Toggle completed field checks as you complete rounds across Sonpur-Hajipur Ward No. 4.
                </p>

                <div className="space-y-2.5">
                  {dailyChecklist.map((task) => (
                    <div 
                      key={task.id}
                      onClick={() => handleTaskToggle(task.id)}
                      className="flex items-start gap-2.5 cursor-pointer hover:bg-slate-50 p-1.5 rounded-lg transition-all"
                    >
                      <input
                        type="checkbox"
                        checked={task.done}
                        readOnly
                        className="mt-0.5 accent-[#FF6B00]"
                      />
                      <span className={`text-xs leading-normal ${task.done ? "text-gray-400 line-through" : "text-gray-700"}`}>
                        {task.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>

      </div>

    </div>
  );
};
