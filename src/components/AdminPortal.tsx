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
import { jsPDF } from "jspdf";

interface AdminPortalProps {
  onSelectComplaint: (id: string) => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ onSelectComplaint }) => {
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
    if (format === "csv") {
      try {
        const csvRows = [];
        const headers = ["Ticket ID", "Category", "Title", "Priority", "Status", "District", "Ward", "Date Created", "Upvotes"];
        csvRows.push(headers.join(","));

        for (const item of complaints) {
          const values = [
            item.id,
            `"${(item.category || "").replace(/"/g, '""')}"`,
            `"${(item.title || "").replace(/"/g, '""')}"`,
            item.priority,
            item.status,
            `"${(item.location?.district || "").replace(/"/g, '""')}"`,
            `"${(item.location?.ward || "").replace(/"/g, '""')}"`,
            item.createdAt,
            item.upvotes
          ];
          csvRows.push(values.join(","));
        }

        const csvContent = csvRows.join("\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `OneBharat_Admin_Audit_${activeDistrict}_${activeWard.replace(/\s+/g, "_")}.csv`);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        addNotification(
          "CSV Export Complete",
          `Filtered GIS database successfully exported as CSV.`,
          "success"
        );
      } catch (err) {
        console.error("CSV Export Failed:", err);
        addNotification("CSV Export Failed", "Something went wrong during export.", "error");
      }
    } else if (format === "pdf") {
      try {
        const doc = new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: "a4"
        });

        let y = 15;

        // Top brand orange bar
        doc.setFillColor(255, 107, 0); // #FF6B00
        doc.rect(15, y, 180, 4, "F");
        y += 12;

        // Header Text
        doc.setFont("helvetica", "bold");
        doc.setFontSize(22);
        doc.setTextColor(15, 23, 42); // slate-900
        doc.text("ONEBHARAT CIVIC DESK", 15, y);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(100, 116, 139); // slate-500
        doc.text("STATE ADMINISTRATION AUDIT REPORT", 15, y + 5);

        // Right side header
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(255, 107, 0);
        doc.text("MUNICIPAL OPERATIONS INDEX", 195, y, { align: "right" });

        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(100, 116, 139);
        doc.text(`Generated: ${new Date().toLocaleString()}`, 195, y + 5, { align: "right" });

        y += 18;

        // Section: Parameters
        doc.setFillColor(248, 250, 252); // slate-50
        doc.rect(15, y, 180, 16, "F");
        
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(15, 23, 42);
        doc.text(`Selected District: ${activeDistrict}`, 20, y + 6);
        doc.text(`Selected Ward: ${activeWard}`, 20, y + 11);

        doc.setFont("helvetica", "normal");
        doc.text(`Active Nodal Officers: 18 Regional Officers`, 110, y + 6);
        doc.text(`Status: Live Sandbox Environment`, 110, y + 11);

        y += 24;

        // Section: Metrics
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.setTextColor(15, 23, 42);
        doc.text("Key Performance Indicators (KPIs)", 15, y);
        y += 6;

        doc.setDrawColor(226, 232, 240);
        doc.line(15, y, 195, y);
        y += 6;

        // Draw 4 metric cards
        const totalLive = complaints.filter(c => c.status !== ComplaintStatus.CLOSED).length;
        const totalResolved = complaints.filter(c => c.status === ComplaintStatus.RESOLVED || c.status === ComplaintStatus.CLOSED).length;
        const resolvedPct = complaints.length > 0 ? Math.round((totalResolved / complaints.length) * 100) : 100;

        doc.setFillColor(241, 245, 249); // slate-100
        doc.rect(15, y, 40, 18, "F");
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(100, 116, 139);
        doc.text("TOTAL TICKETS", 18, y + 5);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.setTextColor(255, 107, 0);
        doc.text(`${complaints.length}`, 18, y + 13);

        doc.setFillColor(241, 245, 249);
        doc.rect(60, y, 40, 18, "F");
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(100, 116, 139);
        doc.text("ACTIVE QUEUE", 63, y + 5);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.setTextColor(15, 23, 42);
        doc.text(`${totalLive} Live`, 63, y + 13);

        doc.setFillColor(241, 245, 249);
        doc.rect(105, y, 40, 18, "F");
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(100, 116, 139);
        doc.text("RESOLVED RATE", 108, y + 5);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.setTextColor(34, 197, 94);
        doc.text(`${resolvedPct}%`, 108, y + 13);

        doc.setFillColor(241, 245, 249);
        doc.rect(150, y, 45, 18, "F");
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(100, 116, 139);
        doc.text("CIVIC SATISFACTION", 153, y + 5);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.setTextColor(59, 130, 246);
        doc.text(`${GENERAL_STATS.satisfactionRate}`, 153, y + 13);

        y += 28;

        // Section: Detailed Complaint Register
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.setTextColor(15, 23, 42);
        doc.text("Current Operations Complaint Registry", 15, y);
        y += 6;

        doc.line(15, y, 195, y);
        y += 4;

        // Table headers
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8.5);
        doc.setTextColor(100, 116, 139);
        doc.text("ID", 15, y);
        doc.text("Category", 35, y);
        doc.text("Location / Ward", 75, y);
        doc.text("Priority", 130, y);
        doc.text("Status", 155, y);
        doc.text("Upvotes", 180, y);
        y += 4;

        doc.setDrawColor(241, 245, 249);
        doc.line(15, y, 195, y);
        y += 5;

        // Table rows
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(51, 65, 85);

        const limitRows = complaints.slice(0, 15); // Show first 15 records in the main PDF audit
        for (const comp of limitRows) {
          doc.setFont("helvetica", "bold");
          doc.text(comp.id, 15, y);
          doc.setFont("helvetica", "normal");
          doc.text(comp.category.substring(0, 20), 35, y);
          doc.text(`${comp.location.ward || "Ward 4"}`, 75, y);
          doc.text(comp.priority, 130, y);
          doc.text(comp.status, 155, y);
          doc.text(`${comp.upvotes}`, 180, y);

          y += 6;
          doc.line(15, y - 2, 195, y - 2);

          if (y > 270) {
            doc.addPage();
            y = 20;
            // Draw table headers again on new page
            doc.setFont("helvetica", "bold");
            doc.setFontSize(8.5);
            doc.setTextColor(100, 116, 139);
            doc.text("ID", 15, y);
            doc.text("Category", 35, y);
            doc.text("Location / Ward", 75, y);
            doc.text("Priority", 130, y);
            doc.text("Status", 155, y);
            doc.text("Upvotes", 180, y);
            y += 4;
            doc.line(15, y - 2, 195, y - 2);
            doc.setFont("helvetica", "normal");
            doc.setFontSize(8);
            doc.setTextColor(51, 65, 85);
          }
        }

        // Footer block
        const footerY = Math.max(y + 10, 280);
        doc.setDrawColor(226, 232, 240);
        doc.line(15, footerY - 5, 195, footerY - 5);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.setTextColor(255, 107, 0);
        doc.text("Crafted with ❤️ by Niket Raj", 15, footerY);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(7.5);
        doc.setTextColor(148, 163, 184); // slate-400
        doc.text("NIC Smart Core | OneBharat State Administration Platform", 195, footerY, { align: "right" });

        doc.save(`OneBharat_Admin_Audit_${activeDistrict}.pdf`);

        addNotification(
          "Audit PDF Downloaded",
          `Beautiful PDF report with state statistics downloaded successfully!`,
          "success"
        );
      } catch (err) {
        console.error("PDF generation failed:", err);
        addNotification(
          "Download Failed",
          "Could not compile PDF document. Please try again.",
          "error"
        );
      }
    }
  };

  // Filter complaints based on search
  const adminFilteredComplaints = complaints.filter(c => {
    const matchesSearch = 
      c.id.toLowerCase().includes(adminSearch.toLowerCase()) ||
      c.category.toLowerCase().includes(adminSearch.toLowerCase()) ||
      c.title.toLowerCase().includes(adminSearch.toLowerCase()) ||
      (c.location?.ward || "").toLowerCase().includes(adminSearch.toLowerCase());

    const matchesWard = activeWard === "All Wards" || c.location?.ward === activeWard;

    return matchesSearch && matchesWard;
  });

  return (
    <div id="admin-portal" className="space-y-6">
      
      {/* FILTER CONTROLS & COMMAND BAR */}
      <div className="flex flex-col lg:flex-row gap-3 justify-between items-stretch lg:items-center bg-white p-4 border border-gray-200 rounded-2xl shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 flex-1">
          <div className="flex items-center gap-2 text-[#FF6B00]">
            <Layers className="w-5 h-5 shrink-0" />
            <h3 className="font-sans font-bold text-gray-800 text-sm whitespace-nowrap">National Administrative Grid</h3>
          </div>
          
          <div className="flex flex-wrap gap-2 w-full">
            <select
              value={activeDistrict}
              onChange={(e) => setActiveDistrict(e.target.value)}
              className="flex-1 min-w-[120px] bg-slate-50 hover:bg-slate-100 text-gray-700 border border-gray-200 rounded-xl px-2.5 py-1.5 text-xs outline-none focus:border-[#FF6B00]"
            >
              <option value="Saran">Saran District (Sonpur-Hajipur)</option>
              <option value="Patna">Patna District</option>
              <option value="Muzaffarpur">Muzaffarpur District</option>
            </select>

            <select
              value={activeWard}
              onChange={(e) => setActiveWard(e.target.value)}
              className="flex-1 min-w-[120px] bg-slate-50 hover:bg-slate-100 text-gray-700 border border-gray-200 rounded-xl px-2.5 py-1.5 text-xs outline-none focus:border-[#FF6B00]"
            >
              <option value="All Wards">All Administrative Wards</option>
              <option value="Ward No. 4">Ward No. 4 (Sonpur / Hajipur)</option>
              <option value="Ward No. 12">Ward No. 12 (Hajipur Civil Lines)</option>
              <option value="Ward No. 8">Ward No. 8 (Sonpur Bazaar)</option>
            </select>
          </div>
        </div>

        <div className="flex gap-2 justify-stretch items-center mt-2 lg:mt-0">
          <button
            onClick={() => exportReport("csv")}
            className="flex-1 px-4 py-2 bg-slate-50 hover:bg-slate-100 border border-gray-200 text-gray-700 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4 text-gray-500" /> Export CSV
          </button>
          <button
            onClick={() => exportReport("pdf")}
            className="flex-1 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer whitespace-nowrap shadow-md"
          >
            <FileText className="w-4 h-4 text-[#FF6B00]" /> PDF Audit Report
          </button>
        </div>
      </div>

      {/* KPI METRIC CARDS GRID */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
          <p className="text-[10px] uppercase font-mono tracking-wider text-gray-400">Total Registered</p>
          <h4 className="font-sans font-bold text-gray-800 text-xl mt-1">112,317</h4>
          <span className="text-[10px] font-semibold text-green-600 block mt-1">↑ 14.2% YoY growth</span>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
          <p className="text-[10px] uppercase font-mono tracking-wider text-gray-400">Active Queue</p>
          <h4 className="font-sans font-bold text-gray-800 text-xl mt-1">
            {complaints.filter(c => c.status !== ComplaintStatus.CLOSED).length} Live
          </h4>
          <span className="text-[10px] font-semibold text-orange-600 block mt-1">94% dispatch rate</span>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
          <p className="text-[10px] uppercase font-mono tracking-wider text-gray-400">Resolutions</p>
          <h4 className="font-sans font-bold text-[#FF6B00] text-xl mt-1">98,112</h4>
          <span className="text-[10px] font-semibold text-green-600 block mt-1 font-mono">✓ 87.2% overall rate</span>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
          <p className="text-[10px] uppercase font-mono tracking-wider text-gray-400">Response Speed</p>
          <h4 className="font-sans font-bold text-blue-600 text-xl mt-1">{GENERAL_STATS.avgResolutionTime}</h4>
          <span className="text-[10px] font-semibold text-blue-600 block mt-1 font-mono">↓ 15.4h decrease</span>
        </div>

        <div className="col-span-2 md:col-span-3 lg:col-span-1 bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
          <p className="text-[10px] uppercase font-mono tracking-wider text-gray-400">Satisfaction Score</p>
          <h4 className="font-sans font-bold text-green-600 text-xl mt-1">{GENERAL_STATS.satisfactionRate}</h4>
          <span className="text-[10px] font-semibold text-green-600 block mt-1 font-mono">★ 4.8 / 5 average star</span>
        </div>
      </div>

      {/* MAIN DATA TABLES & CUSTOM SVG CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* DEPARTMENTAL OUTCOMES & ANALYTICS */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-3xl p-5 shadow-sm space-y-5">
          <div className="flex justify-between items-center">
            <h3 className="font-sans font-bold text-gray-800 text-base">Department Resolution Index</h3>
            <span className="text-[10px] font-mono text-gray-400">Quarterly audit review</span>
          </div>

          <div className="overflow-x-auto -mx-5 px-5">
            <table className="w-full text-left border-collapse text-xs text-gray-700 min-w-[500px]">
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
        <div className="bg-white border border-gray-200 rounded-3xl p-5 shadow-sm flex flex-col justify-between space-y-4">
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

          <div className="pt-4 border-t border-gray-150 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <span className="text-[10px] font-mono text-gray-400">Server Status: <b className="text-green-600">Active</b></span>
            <button
              onClick={() => {
                addNotification("Permissions Synced", "All department key scopes synchronized successfully.", "info");
              }}
              className="text-[11px] font-semibold text-[#FF6B00] hover:underline self-start sm:self-auto cursor-pointer"
            >
              Configure Access Roles
            </button>
          </div>
        </div>

      </div>

      {/* RESPONSIVE LIVE COMPLAINT REGISTRY & SINGLE-TICKET INSPECTION PANEL */}
      <div className="bg-white border border-gray-200 rounded-3xl p-5 shadow-sm space-y-5">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <div>
            <h3 className="font-sans font-bold text-gray-800 text-base">State Grievance Registry</h3>
            <p className="text-[11px] text-gray-400">Search and filter live records, inspect details, and trigger target ticket PDFs</p>
          </div>
          
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by ID, Category or Title..."
              value={adminSearch}
              onChange={(e) => setAdminSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-1.5 bg-slate-50 border border-gray-200 focus:border-[#FF6B00] rounded-xl text-xs outline-none focus:ring-1 focus:ring-[#FF6B00]/20 transition-all text-gray-800"
            />
          </div>
        </div>

        {adminFilteredComplaints.length === 0 ? (
          <div className="text-center py-10 text-gray-400 text-xs">
            No complaints found matching "{adminSearch}" in {activeWard}.
          </div>
        ) : (
          <>
            {/* Desktop / Tablet Table View (hidden on mobile, shown on sm and up) */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs text-gray-700 min-w-[700px]">
                <thead>
                  <tr className="border-b border-gray-150 text-gray-400 font-mono text-[10px] uppercase">
                    <th className="pb-3 pl-2">ID</th>
                    <th className="pb-3">Grievance & Title</th>
                    <th className="pb-3">Ward</th>
                    <th className="pb-3 text-center">Priority</th>
                    <th className="pb-3 text-center">Status</th>
                    <th className="pb-3 text-center">Upvotes</th>
                    <th className="pb-3 text-right pr-2">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {adminFilteredComplaints.map((c) => {
                    const statusColors = 
                      c.status === ComplaintStatus.RESOLVED || c.status === ComplaintStatus.CLOSED
                        ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                        : c.status === ComplaintStatus.IN_PROGRESS
                        ? "bg-blue-50 text-blue-700 border-blue-100"
                        : "bg-orange-50 text-orange-700 border-orange-100";

                    const priorityColors =
                      c.priority === ComplaintPriority.EMERGENCY || c.priority === ComplaintPriority.HIGH
                        ? "bg-red-50 text-red-700 border-red-150"
                        : "bg-slate-100 text-slate-700 border-slate-200";

                    return (
                      <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3 pl-2 font-mono font-bold text-[#FF6B00]">{c.id}</td>
                        <td className="py-3">
                          <div className="font-semibold text-gray-900">{c.category}</div>
                          <div className="text-gray-400 text-[10px] truncate max-w-xs">{c.title}</div>
                        </td>
                        <td className="py-3 font-mono text-[10px] text-gray-500">{c.location?.ward || "Ward No. 4"}</td>
                        <td className="py-3 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${priorityColors}`}>
                            {c.priority}
                          </span>
                        </td>
                        <td className="py-3 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${statusColors}`}>
                            {c.status}
                          </span>
                        </td>
                        <td className="py-3 text-center font-bold text-gray-800">{c.upvotes}</td>
                        <td className="py-3 text-right pr-2">
                          <button
                            onClick={() => onSelectComplaint(c.id)}
                            className="px-2.5 py-1 bg-[#FF6B00]/10 hover:bg-[#FF6B00] text-[#FF6B00] hover:text-white rounded-lg text-[10px] font-bold tracking-wide transition-all cursor-pointer inline-flex items-center gap-1 border border-[#FF6B00]/20"
                          >
                            Inspect & PDF <ChevronRight className="w-3 h-3" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View (shown on mobile, hidden on sm and up) */}
            <div className="block sm:hidden space-y-3.5">
              {adminFilteredComplaints.map((c) => {
                const statusColors = 
                  c.status === ComplaintStatus.RESOLVED || c.status === ComplaintStatus.CLOSED
                    ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                    : c.status === ComplaintStatus.IN_PROGRESS
                    ? "bg-blue-50 text-blue-700 border-blue-100"
                    : "bg-orange-50 text-orange-700 border-orange-100";

                const priorityColors =
                  c.priority === ComplaintPriority.EMERGENCY || c.priority === ComplaintPriority.HIGH
                    ? "bg-red-50 text-red-700 border-red-150"
                    : "bg-slate-100 text-slate-700 border-slate-200";

                return (
                  <div key={c.id} className="p-3.5 bg-slate-50 border border-slate-200/60 rounded-xl space-y-2.5">
                    <div className="flex justify-between items-center">
                      <span className="font-mono font-bold text-[#FF6B00] text-xs">{c.id}</span>
                      <span className="text-[10px] text-gray-500 font-mono">{c.location?.ward || "Ward No. 4"}</span>
                    </div>

                    <div className="space-y-0.5">
                      <div className="font-bold text-gray-800 text-xs">{c.category}</div>
                      <p className="text-[11px] text-gray-500 line-clamp-2">{c.title}</p>
                    </div>

                    <div className="flex flex-wrap gap-1.5 items-center justify-between pt-1 border-t border-slate-200/50">
                      <div className="flex gap-1">
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold border ${priorityColors}`}>
                          {c.priority}
                        </span>
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold border ${statusColors}`}>
                          {c.status}
                        </span>
                      </div>
                      <span className="text-[10px] text-gray-500">Upvotes: <b className="text-gray-800">{c.upvotes}</b></span>
                    </div>

                    <button
                      onClick={() => onSelectComplaint(c.id)}
                      className="w-full py-1.5 bg-[#FF6B00] hover:bg-orange-600 text-white rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 shadow-sm"
                    >
                      Inspect & Download Ticket PDF <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

    </div>
  );
};
