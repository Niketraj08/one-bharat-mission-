/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { ComplaintStatus, ComplaintPriority } from "../types";
import { 
  BarChart, 
  FileText, 
  Users, 
  MapPin, 
  TrendingUp, 
  Clock, 
  Settings, 
  Layers, 
  Download, 
  CheckCircle, 
  AlertTriangle, 
  ChevronRight,
  ShieldAlert,
  Search,
  Filter,
  Sparkles
} from "lucide-react";
import { GENERAL_STATS } from "../data";

export const AdminPortal: React.FC = () => {
  const { complaints, addNotification } = useApp();

  const [activeDistrict, setActiveDistrict] = useState("Saran");
  const [activeWard, setActiveWard] = useState("All Wards");
  const [adminSearch, setAdminSearch] = useState("");

  const auditLogs = [
    { time: "10:12:30", type: "AI_ROUTE", text: "Ticket OB-9031 assigned to Sonpur / Hajipur Municipal division under Director Sharda Devi" },
    { time: "09:44:15", type: "CITIZEN_VOTE", text: "Citizen upvoted OB-7492-SAR pothole case (Current: 84 upvotes)" },
    { time: "08:15:00", type: "RESOLVED", text: "Officer Rajesh Singh completed patch-up on Gandak Bridge Road. Verification uploaded." },
    { time: "07:30:12", type: "DUPLICATE_CHECK", text: "AI duplicate detector evaluated 3 sewage reports on Sonpur Road. Confirmed unique." },
    { time: "Yesterday", type: "SECURITY", text: "State admin audit: Role permissions reviewed for 18 district coordinators" }
  ];

  const exportReport = (format: string) => {
    addNotification(
      "Report Export Scheduled",
      `Compiling full GIS database & resolution audit trail into ${format.toUpperCase()}. Downloader ready in 15 seconds.`,
      "success"
    );
  };

  // Filter audit records or complaints for display
  const adminFilteredComplaints = complaints.filter(c => 
    c.id.toLowerCase().includes(adminSearch.toLowerCase()) ||
    c.category.toLowerCase().includes(adminSearch.toLowerCase()) ||
    c.title.toLowerCase().includes(adminSearch.toLowerCase())
  );

  return (
    <div id="admin-portal" className="space-y-6">
      
      {/* FILTER CONTROLS & COMMAND BAR */}
      <div className="flex flex-col md:flex-row gap-3 justify-between items-center bg-white p-4 border border-gray-200 rounded-2xl shadow-sm">
        <div className="flex flex-wrap gap-2 items-center">
          <Layers className="w-5 h-5 text-[#FF6B00]" />
          <h3 className="font-sans font-bold text-gray-800 text-sm mr-2">National Administrative Grid</h3>
          
          <select
            value={activeDistrict}
            onChange={(e) => setActiveDistrict(e.target.value)}
            className="bg-slate-50 hover:bg-slate-100 text-gray-700 border border-gray-200 rounded-xl px-3 py-1.5 text-xs outline-none focus:border-[#FF6B00]"
          >
            <option value="Saran">Saran District (Sonpur-Hajipur)</option>
            <option value="Patna">Patna District</option>
            <option value="Muzaffarpur">Muzaffarpur District</option>
          </select>

          <select
            value={activeWard}
            onChange={(e) => setActiveWard(e.target.value)}
            className="bg-slate-50 hover:bg-slate-100 text-gray-700 border border-gray-200 rounded-xl px-3 py-1.5 text-xs outline-none focus:border-[#FF6B00]"
          >
            <option value="All Wards">All Administrative Wards</option>
            <option value="Ward No. 4">Ward No. 4 (Sonpur / Hajipur)</option>
            <option value="Ward No. 12">Ward No. 12 (Hajipur Civil Lines)</option>
            <option value="Ward No. 8">Ward No. 8 (Sonpur Bazaar)</option>
          </select>
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          <button
            onClick={() => exportReport("csv")}
            className="flex-1 md:flex-initial px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-gray-200 text-gray-700 font-bold rounded-xl text-xs flex items-center justify-center gap-1 transition-all"
          >
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>
          <button
            onClick={() => exportReport("pdf")}
            className="flex-1 md:flex-initial px-3 py-1.5 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1 transition-all"
          >
            <FileText className="w-3.5 h-3.5" /> PDF Audit
          </button>
        </div>
      </div>

      {/* KPI METRIC CARDS GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
          <p className="text-[10px] uppercase font-mono tracking-wider text-gray-400">Total Registered</p>
          <h4 className="font-sans font-bold text-gray-800 text-xl mt-1">112,317</h4>
          <span className="text-[10px] font-semibold text-green-600 block mt-1">↑ 14.2% YoY growth</span>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
          <p className="text-[10px] uppercase font-mono tracking-wider text-gray-400">Active Queue</p>
          <h4 className="font-sans font-bold text-gray-800 text-xl mt-1">{complaints.filter(c=>c.status !== ComplaintStatus.CLOSED).length} Live</h4>
          <span className="text-[10px] font-semibold text-orange-600 block mt-1">94% dispatch rate</span>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
          <p className="text-[10px] uppercase font-mono tracking-wider text-gray-400">Resolutions</p>
          <h4 className="font-sans font-bold text-[#FF6B00] text-xl mt-1">98,112</h4>
          <span className="text-[10px] font-semibold text-green-600 block mt-1">✓ 87.2% overall rate</span>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
          <p className="text-[10px] uppercase font-mono tracking-wider text-gray-400">Response Speed</p>
          <h4 className="font-sans font-bold text-blue-600 text-xl mt-1">{GENERAL_STATS.avgResolutionTime}</h4>
          <span className="text-[10px] font-semibold text-blue-600 block mt-1">↓ 15.4h decrease</span>
        </div>

        <div className="col-span-2 lg:col-span-1 bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
          <p className="text-[10px] uppercase font-mono tracking-wider text-gray-400">Satisfaction Score</p>
          <h4 className="font-sans font-bold text-green-600 text-xl mt-1">{GENERAL_STATS.satisfactionRate}</h4>
          <span className="text-[10px] font-semibold text-green-600 block mt-1">★ 4.8 / 5 average star</span>
        </div>
      </div>

      {/* MAIN DATA TABLES & CUSTOM SVG CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* DEPARTMENTAL OUTCOMES & ANALYTICS */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-3xl p-5 shadow-sm space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-sans font-bold text-gray-800 text-base">Department Resolution Index</h3>
            <span className="text-[10px] font-mono text-gray-400">Quarterly audit review</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs text-gray-700">
              <thead>
                <tr className="border-b border-gray-150 text-gray-400 font-mono text-[10px] uppercase">
                  <th className="pb-2.5 font-semibold">Nodal Division</th>
                  <th className="pb-2.5 font-semibold text-center">Avg Speed</th>
                  <th className="pb-2.5 font-semibold text-center">Resolution</th>
                  <th className="pb-2.5 font-semibold text-right">Perform Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="py-3 font-semibold text-gray-800">Public Works Department (PWD)</td>
                  <td className="py-3 text-center font-mono">14.8h</td>
                  <td className="py-3 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <span className="font-semibold">92.4%</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    </div>
                  </td>
                  <td className="py-3 text-right font-bold text-green-600">4.8 / 5</td>
                </tr>
                <tr>
                  <td className="py-3 font-semibold text-gray-800">Solid Waste Management</td>
                  <td className="py-3 text-center font-mono">8.2h</td>
                  <td className="py-3 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <span className="font-semibold">96.8%</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    </div>
                  </td>
                  <td className="py-3 text-right font-bold text-green-600">4.9 / 5</td>
                </tr>
                <tr>
                  <td className="py-3 font-semibold text-gray-800">Electrical & Street Lighting</td>
                  <td className="py-3 text-center font-mono">11.1h</td>
                  <td className="py-3 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <span className="font-semibold">89.1%</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    </div>
                  </td>
                  <td className="py-3 text-right font-bold text-amber-500">4.5 / 5</td>
                </tr>
                <tr>
                  <td className="py-3 font-semibold text-gray-800">Water Supply & Hydraulics</td>
                  <td className="py-3 text-center font-mono">22.4h</td>
                  <td className="py-3 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <span className="font-semibold">84.2%</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    </div>
                  </td>
                  <td className="py-3 text-right font-bold text-amber-500">4.2 / 5</td>
                </tr>
                <tr>
                  <td className="py-3 font-semibold text-gray-800">Disaster Management Hub</td>
                  <td className="py-3 text-center font-mono">2.4h</td>
                  <td className="py-3 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <span className="font-semibold">99.2%</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    </div>
                  </td>
                  <td className="py-3 text-right font-bold text-green-600">4.9 / 5</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* CUSTOM SVG COMPLAINT CATEGORY BAR CHART */}
          <div className="pt-4 border-t border-gray-150">
            <h4 className="text-xs font-semibold text-gray-800 mb-3 flex items-center gap-1">
              <BarChart className="w-4 h-4 text-[#FF6B00]" /> Volume by Complaint Category
            </h4>
            
            <div className="space-y-2">
              {GENERAL_STATS.categoryBreakdown.map((cat, index) => {
                const percentage = (cat.count / 3410) * 100; // max category Roads
                return (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between text-[11px] font-mono text-gray-500">
                      <span>{cat.name}</span>
                      <span className="font-bold text-gray-700">{cat.count} tickets</span>
                    </div>
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-1000" 
                        style={{ width: `${percentage}%`, backgroundColor: cat.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* SECURE AUDIT LOG & COMPLAINTS LIVE STREAM (RIGHT COLUMN) */}
        <div className="bg-white border border-gray-200 rounded-3xl p-5 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <h3 className="font-sans font-bold text-gray-800 text-base">District Security & Audit Trail</h3>
              <p className="text-[11px] text-gray-400">Live transaction stream & state logs</p>
            </div>

            <div className="space-y-3">
              {auditLogs.map((log, idx) => {
                const logTypeColor = 
                  log.type === "SECURITY" 
                    ? "bg-red-50 text-red-700 border-red-100" 
                    : log.type === "RESOLVED" 
                    ? "bg-green-50 text-green-700 border-green-100" 
                    : "bg-blue-50 text-blue-700 border-blue-100";

                return (
                  <div key={idx} className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl space-y-1.5">
                    <div className="flex justify-between items-center text-[10px] font-mono text-gray-400">
                      <span className={`px-2 py-0.5 rounded uppercase border font-bold text-[8px] ${logTypeColor}`}>
                        {log.type}
                      </span>
                      <span>{log.time}</span>
                    </div>
                    <p className="text-xs text-gray-700 leading-normal">{log.text}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 mt-6 border-t border-gray-150 flex items-center justify-between">
            <span className="text-[10px] font-mono text-gray-400">Server Status: <b className="text-green-600">Active</b></span>
            <button
              onClick={() => {
                addNotification("Permissions Synced", "All department key scopes synchronized successfully.", "info");
              }}
              className="text-[11px] font-semibold text-[#FF6B00] hover:underline"
            >
              Configure Access Roles
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
