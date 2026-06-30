import React from "react";
import { OneBharatLogo } from "./OneBharatLogo";
import { 
  Github, 
  ExternalLink, 
  Award, 
  Terminal 
} from "lucide-react";

export const AboutPage: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12" id="about-page-container">
      {/* HEADER SECTION */}
      <div className="text-center space-y-2">
        <h2 className="font-sans font-black text-2xl md:text-3xl uppercase tracking-tight text-slate-900">
          About <span className="text-[#FF6B00]">OneBharat</span>
        </h2>
        <p className="text-xs text-gray-500 font-mono tracking-wider uppercase">
          India's Decentralized Civic Redressal & Dispatch Core
        </p>
      </div>

      {/* CORE PRODUCT CARD */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
        <div className="md:col-span-4 flex flex-col items-center justify-center bg-slate-50 border border-slate-100 rounded-2xl p-6 space-y-4">
          <div className="w-24 h-24 shadow-md rounded-2xl overflow-hidden">
            <OneBharatLogo className="w-full h-full" />
          </div>
          <div className="text-center">
            <h3 className="font-sans font-bold text-sm text-slate-800">OneBharat Core</h3>
            <p className="text-[10px] font-mono text-[#FF6B00] uppercase font-bold mt-0.5">v2.1.0-Release</p>
          </div>
        </div>

        <div className="md:col-span-8 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <h4 className="font-sans font-extrabold text-sm text-slate-900 uppercase tracking-wider">
              Empowering Saran & Vaishali Municipalities
            </h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              OneBharat provides a high-fidelity digital gateway for citizens of Saran, Sonpur, and Hajipur to submit, localize, and track civic grievances directly. Our advanced spatial routing engine dispatches verified tickets to Nodal Ward Officers with sub-meter telemetry coordinates.
            </p>
            <p className="text-xs text-gray-600 leading-relaxed">
              By automating dispatch SLA tracking, municipal administrations gain full visual control over streetlights, road damages, broken water infrastructure, and waste management with high-contrast D3 reporting widgets.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="p-3 bg-orange-50 border border-orange-100 rounded-xl text-center">
              <span className="block font-sans font-black text-lg text-[#FF6B00]">100%</span>
              <span className="block text-[9px] font-mono text-gray-500 uppercase">Accountability</span>
            </div>
            <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-center">
              <span className="block font-sans font-black text-lg text-emerald-600">Sub-Meter</span>
              <span className="block text-[9px] font-mono text-gray-500 uppercase">GPS Accuracy</span>
            </div>
            <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-center">
              <span className="block font-sans font-black text-lg text-blue-600">2-Sec</span>
              <span className="block text-[9px] font-mono text-gray-500 uppercase">Auto-Dispatch</span>
            </div>
          </div>
        </div>
      </div>

      {/* DEVELOPER SECTION (CREDIT FOR NIKET RAJ) */}
      <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden">
        {/* Subtle glowing backgrounds */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF6B00]/10 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -z-10" />

        <div className="flex flex-col md:flex-row gap-6 items-start justify-between">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-800 border border-slate-700 rounded-full">
                <Award className="w-3.5 h-3.5 text-[#FF6B00]" />
                <span className="text-[9px] font-mono uppercase tracking-wider text-slate-300 font-bold">Lead Architect & Developer</span>
              </div>
              <h3 className="font-sans font-black text-2xl md:text-3xl tracking-tight text-white">
                Niket Raj
              </h3>
              <p className="text-xs font-mono text-gray-400">
                Full Stack Developer & Systems Designer
              </p>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed max-w-lg">
              Designed, Engineered & Crafted by <strong className="text-white">Niket Raj</strong>, OneBharat is built on robust responsive patterns with a particular focus on Indian municipal system design. It represents high craftsmanship in interactive civic dashboards, audio-visual report processing, and local database synchronizers.
            </p>

            <div className="flex flex-wrap gap-2.5 pt-2">
              <a 
                href="https://github.com/Niketraj08" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-1.5 px-4 py-2 bg-[#FF6B00] hover:bg-orange-600 text-white font-bold rounded-xl text-xs transition-all shadow-lg shadow-orange-500/10 cursor-pointer"
                id="dev-github-link"
              >
                <Github className="w-4 h-4" />
                <span>GitHub Profile</span>
              </a>
              <div className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs font-mono text-gray-300">
                <Terminal className="w-4 h-4 text-orange-400" />
                <span>@Niketraj08</span>
              </div>
            </div>
          </div>

          {/* Core metadata card */}
          <div className="w-full md:w-72 bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-3 flex-shrink-0">
            <h5 className="text-[10px] font-mono uppercase tracking-wider text-[#FF6B00] font-black border-b border-slate-800 pb-2">
              Developer Info Card
            </h5>
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Developer</span>
                <span className="font-bold text-white">Niket Raj</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Role</span>
                <span className="font-mono text-orange-400">Full Stack Developer</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Codebase</span>
                <span className="font-mono text-emerald-400">Clean & Robust TS</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">GitHub Handle</span>
                <a 
                  href="https://github.com/Niketraj08" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="font-mono text-blue-400 hover:underline flex items-center gap-0.5"
                >
                  @Niketraj08 <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
