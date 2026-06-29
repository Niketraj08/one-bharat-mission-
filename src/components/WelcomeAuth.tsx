/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { UserRole } from "../types";
import { 
  Shield, 
  Sparkles, 
  Fingerprint, 
  MapPin, 
  ArrowRight, 
  ChevronRight, 
  Smartphone, 
  Mail, 
  CheckCircle2,
  ScanFace,
  Lock,
  Building2,
  Key,
  Eye,
  EyeOff
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface WelcomeAuthProps {
  onLoginSuccess: (name: string, role: UserRole) => void;
}

export const WelcomeAuth: React.FC<WelcomeAuthProps> = ({ onLoginSuccess }) => {
  const [slide, setSlide] = useState(1);
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.CITIZEN);
  const [loginMethod, setLoginMethod] = useState<"phone" | "google" | "face" | null>(null);
  const [phone, setPhone] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [faceScanning, setFaceScanning] = useState(false);
  const [faceComplete, setFaceComplete] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);

  // Officer States
  const [officerBadge, setOfficerBadge] = useState("OB-OFF-882");
  const [officerPin, setOfficerPin] = useState("1234");

  // Admin States
  const [adminId, setAdminId] = useState("BIHAR-NODAL-77");
  const [adminPass, setAdminPass] = useState("9988");

  const triggerOtpSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;
    setOtpSent(true);
  };

  const handleOtpVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode) return;
    onLoginSuccess("Arjun Mehta", selectedRole);
  };

  const triggerFaceBiometric = () => {
    setFaceScanning(true);
    setFaceComplete(false);
    setTimeout(() => {
      setFaceScanning(false);
      setFaceComplete(true);
      setTimeout(() => {
        onLoginSuccess("Arjun Mehta", selectedRole);
      }, 1000);
    }, 3200);
  };

  const handleOfficerLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!officerBadge || !officerPin) return;
    onLoginSuccess("Officer Ramesh Kumar", UserRole.OFFICER);
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminId || !adminPass) return;
    onLoginSuccess("Nodal Director Sinha", UserRole.ADMIN);
  };

  return (
    <div id="welcome-onboarding-auth" className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center py-12 px-4 gap-6 max-w-6xl mx-auto">
      <div className="max-w-4xl w-full bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-2 min-h-[540px]">
        
        {/* BRANDING & SLIDES (LEFT PANEL) */}
        <div className="bg-gradient-to-br from-slate-900 to-gray-950 p-8 text-white flex flex-col justify-between relative overflow-hidden">
          {/* Subtle Glowing Accents */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-orange-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-600/10 rounded-full blur-3xl" />

          {/* Logo Heading */}
          <div className="flex items-center gap-2 z-10">
            <div className="w-9 h-9 bg-slate-800 rounded-xl flex items-center justify-center shadow-lg overflow-hidden border border-slate-700">
              <img src="/src/assets/images/onebharat_logo_1782755871364.jpg" alt="OneBharat Logo" className="w-full h-full object-cover animate-pulse" />
            </div>
            <div>
              <h2 className="font-sans font-extrabold text-base leading-none tracking-tight">OneBharat</h2>
              <span className="text-[9px] font-mono tracking-widest text-[#FF6B00] uppercase block mt-0.5">Civic Super Platform</span>
            </div>
          </div>

          {/* Slider Slides */}
          <div className="my-6 z-10 space-y-5">
            <AnimatePresence mode="wait">
              {slide === 1 ? (
                <motion.div
                  key="slide-1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-2.5"
                >
                  <span className="text-[10px] uppercase font-mono tracking-widest text-[#FF6B00] font-black bg-[#FF6B00]/10 px-2.5 py-1 rounded-full border border-[#FF6B00]/20">
                    Bihar Civic Network
                  </span>
                  <h1 className="font-sans font-black text-2xl leading-tight">Empowering Sonpur & Hajipur.</h1>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    The leading public infrastructure where residents instantly register, track, and resolve local road damage, solar streetlights, water-logging, and sewage issues.
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="slide-2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-2.5"
                >
                  <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-400 font-black bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                    AI Automated Dispatch
                  </span>
                  <h1 className="font-sans font-black text-2xl leading-tight">Smart Resolution Engine</h1>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Our AI models automatically verify field evidence photos, fetch precise GPS locations, assess risk urgency, and dispatch local municipal field workers in under 5 minutes.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* HIGH-IMPACT LIVE CIVIC STATS (FOR SONPUR-HAJIPUR) */}
            <div className="grid grid-cols-2 gap-2 bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800/80 backdrop-blur-sm shadow-inner">
              <div className="space-y-0.5">
                <span className="text-[9px] font-mono uppercase tracking-wider text-gray-500 block">Active Sectors</span>
                <p className="text-xs font-bold text-white leading-tight">Sonpur & Hajipur</p>
              </div>
              <div className="space-y-0.5">
                <span className="text-[9px] font-mono uppercase tracking-wider text-[#FF6B00] block">Average Dispatch</span>
                <p className="text-xs font-bold text-emerald-400 leading-tight">4.2 Minutes</p>
              </div>
              <div className="space-y-0.5 mt-2 pt-2 border-t border-slate-900">
                <span className="text-[9px] font-mono uppercase tracking-wider text-gray-500 block">Verified Residents</span>
                <p className="text-xs font-bold text-white leading-tight">14,290+ Active</p>
              </div>
              <div className="space-y-0.5 mt-2 pt-2 border-t border-slate-900">
                <span className="text-[9px] font-mono uppercase tracking-wider text-gray-500 block">Resolution Rate</span>
                <p className="text-xs font-bold text-white leading-tight">98.4% Checked</p>
              </div>
            </div>

            {/* REAL-TIME LIVE DISPATCH TICKER */}
            <div className="bg-slate-900/50 p-2.5 rounded-xl border border-slate-800/40 font-mono text-[9px] space-y-1.5 shadow-md">
              <div className="flex items-center justify-between text-gray-500 border-b border-slate-950 pb-1">
                <span>🟢 LIVE RESOLUTION STREAM</span>
                <span className="animate-pulse text-[#FF6B00]">● ACTIVE</span>
              </div>
              <div className="space-y-1">
                <p className="text-gray-300 truncate">
                  <span className="text-amber-500 font-bold">[DISPATCHED]</span> Water drain blockage cleared near Town Club, Hajipur
                </p>
                <p className="text-gray-400 truncate">
                  <span className="text-emerald-500 font-bold">[RESOLVED]</span> 5 defect solar lights fixed on Harihar Nath Road, Sonpur
                </p>
              </div>
            </div>
          </div>

          {/* Indicator & Control */}
          <div className="flex justify-between items-center z-10 border-t border-gray-800 pt-4">
            <div className="flex gap-1.5">
              {[1, 2].map((s) => (
                <button
                  key={s}
                  onClick={() => setSlide(s)}
                  className={`h-1.5 rounded-full transition-all ${s === slide ? "w-6 bg-[#FF6B00]" : "w-1.5 bg-gray-700"}`}
                />
              ))}
            </div>

            <button
              onClick={() => setSlide(slide === 1 ? 2 : 1)}
              className="text-xs font-semibold text-gray-400 hover:text-white flex items-center gap-1"
            >
              Next Feature <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* AUTHENTICATION CONTROL (RIGHT PANEL) */}
        <div className="p-8 flex flex-col justify-center bg-white relative">
          
          {/* Role Selector Tabs (Only show when not in the middle of cellular/face login) */}
          {loginMethod === null && (
            <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-2xl mb-6 border border-slate-200">
              <button
                onClick={() => setSelectedRole(UserRole.CITIZEN)}
                className={`py-2 text-[10px] font-bold rounded-xl transition-all cursor-pointer ${selectedRole === UserRole.CITIZEN ? "bg-[#FF6B00] text-white shadow-sm" : "text-gray-500 hover:text-gray-800"}`}
              >
                🇮🇳 Citizen
              </button>
              <button
                onClick={() => setSelectedRole(UserRole.OFFICER)}
                className={`py-2 text-[10px] font-bold rounded-xl transition-all cursor-pointer ${selectedRole === UserRole.OFFICER ? "bg-indigo-600 text-white shadow-sm" : "text-gray-500 hover:text-gray-800"}`}
              >
                🏢 Officer
              </button>
              <button
                onClick={() => setSelectedRole(UserRole.ADMIN)}
                className={`py-2 text-[10px] font-bold rounded-xl transition-all cursor-pointer ${selectedRole === UserRole.ADMIN ? "bg-slate-900 text-white shadow-sm" : "text-gray-500 hover:text-gray-800"}`}
              >
                👑 Admin
              </button>
            </div>
          )}

          <AnimatePresence mode="wait">
            {selectedRole === UserRole.OFFICER ? (
              <motion.div
                key="officer-auth"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-5"
              >
                <div>
                  <h3 className="font-sans font-extrabold text-gray-800 text-xl leading-tight flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-indigo-600" />
                    Officer Command Gate
                  </h3>
                  <p className="text-xs text-gray-500 leading-tight">Access assignments, dispatch alerts, and coordinate directly with Sonpur & Hajipur municipal divisions.</p>
                </div>

                <form onSubmit={handleOfficerLogin} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-700">GP-UID Ward Badge ID</label>
                    <input
                      type="text"
                      required
                      placeholder="OB-OFF-882"
                      value={officerBadge}
                      onChange={(e) => setOfficerBadge(e.target.value)}
                      className="w-full bg-slate-50 border border-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl text-xs p-3 outline-none text-gray-800 font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-700">Secure Pin Passcode</label>
                    <input
                      type="password"
                      required
                      placeholder="••••"
                      value={officerPin}
                      onChange={(e) => setOfficerPin(e.target.value)}
                      className="w-full bg-slate-50 border border-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl text-xs p-3 outline-none text-gray-800 tracking-widest font-mono"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    Authorize Officer Portal <Shield className="w-4 h-4" />
                  </button>
                </form>

                <div className="bg-indigo-50/60 border border-indigo-100 p-3 rounded-xl">
                  <p className="text-[10px] text-indigo-600 leading-relaxed">
                    <strong>💡 Developer Demo Mode:</strong> Use Badge ID <strong>OB-OFF-882</strong> and PIN <strong>1234</strong> to simulate officer dashboard access.
                  </p>
                </div>
              </motion.div>
            ) : selectedRole === UserRole.ADMIN ? (
              <motion.div
                key="admin-auth"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-5"
              >
                <div>
                  <h3 className="font-sans font-extrabold text-gray-800 text-xl leading-tight flex items-center gap-2">
                    <Shield className="w-5 h-5 text-slate-900" />
                    Nodal Admin Headquarters
                  </h3>
                  <p className="text-xs text-gray-500 leading-tight">Supervise GIS-tracked complaints, allocate emergency funds, and monitor municipal department SLA rates.</p>
                </div>

                <form onSubmit={handleAdminLogin} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-700">District Nodal Admin ID</label>
                    <input
                      type="text"
                      required
                      placeholder="BIHAR-NODAL-77"
                      value={adminId}
                      onChange={(e) => setAdminId(e.target.value)}
                      className="w-full bg-slate-50 border border-gray-200 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 rounded-xl text-xs p-3 outline-none text-gray-800 font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-700">Nodal Secure Passcode</label>
                    <input
                      type="password"
                      required
                      placeholder="••••"
                      value={adminPass}
                      onChange={(e) => setAdminPass(e.target.value)}
                      className="w-full bg-slate-50 border border-gray-200 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 rounded-xl text-xs p-3 outline-none text-gray-800 tracking-widest font-mono"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-slate-900 hover:bg-black text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    Establish Secure Admin Link <Key className="w-4 h-4" />
                  </button>
                </form>

                <div className="bg-slate-100 border border-slate-200 p-3 rounded-xl">
                  <p className="text-[10px] text-slate-700 leading-relaxed">
                    <strong>💡 Developer Demo Mode:</strong> Use Admin ID <strong>BIHAR-NODAL-77</strong> and Passcode <strong>9988</strong> to launch the district supervisor suite.
                  </p>
                </div>
              </motion.div>
            ) : loginMethod === null ? (
              <motion.div
                key="choose-auth"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="font-sans font-extrabold text-gray-800 text-xl leading-tight">Secure Civic Gateway</h3>
                  <p className="text-xs text-gray-500 leading-tight">Verify identity securely using DigiLocker linked cellular networks or advanced biometrics.</p>
                </div>

                <div className="space-y-2.5">
                  <button
                    onClick={() => setLoginMethod("phone")}
                    className="w-full p-3 border border-gray-200 hover:border-[#FF6B00] rounded-2xl text-left flex items-center justify-between group transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-orange-50 text-[#FF6B00] rounded-xl group-hover:scale-105 transition-transform">
                        <Smartphone className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-gray-800 block">DigiLocker OTP Login</span>
                        <span className="text-[10px] text-gray-400">Receive standard text OTP instantly</span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <button
                    onClick={triggerFaceBiometric}
                    className="w-full p-3 border border-gray-200 hover:border-green-500 rounded-2xl text-left flex items-center justify-between group transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-green-50 text-green-600 rounded-xl group-hover:scale-105 transition-transform">
                        <ScanFace className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-gray-800 block">FRT Face Authentication</span>
                        <span className="text-[10px] text-gray-400">Biometric facial verification scan</span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <button
                    onClick={() => onLoginSuccess("Arjun Mehta")}
                    className="w-full p-3 border border-gray-200 hover:border-blue-500 rounded-2xl text-left flex items-center justify-between group transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl group-hover:scale-105 transition-transform">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-gray-800 block">Continue with Google SSO</span>
                        <span className="text-[10px] text-gray-400">Link verified gmail credentials</span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

                <div className="text-center">
                  <p className="text-[10px] text-gray-400 max-w-xs mx-auto">
                    By proceeding, you authorize OneBharat to verify and record civic reports within designated GIS ward boundaries under IT rules 2021.
                  </p>
                </div>
              </motion.div>
            ) : loginMethod === "phone" ? (
              <motion.div
                key="phone-auth"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div>
                  <button 
                    onClick={() => { setLoginMethod(null); setOtpSent(false); }}
                    className="text-[10px] font-mono text-[#FF6B00] hover:underline"
                  >
                    ← Back to Methods
                  </button>
                  <h3 className="font-sans font-extrabold text-gray-800 text-lg leading-tight mt-1">DigiLocker Cellular Link</h3>
                  <p className="text-xs text-gray-400">DigiLocker handles standard OTP verification securely.</p>
                </div>

                <AnimatePresence mode="wait">
                  {!otpSent ? (
                    <motion.form
                      key="phone-form"
                      onSubmit={triggerOtpSend}
                      className="space-y-4"
                    >
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-700">Enter Phone Number</label>
                        <input
                          type="tel"
                          required
                          placeholder="+91 98765-43210"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full bg-slate-50 border border-gray-200 focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] rounded-xl text-xs p-3 outline-none text-gray-800"
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full py-2.5 bg-[#FF6B00] hover:bg-orange-600 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                      >
                        Transmit OTP <ArrowRight className="w-4 h-4" />
                      </button>
                    </motion.form>
                  ) : (
                    <motion.form
                      key="otp-form"
                      onSubmit={handleOtpVerify}
                      className="space-y-4"
                    >
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-700">Verify Verification Code (OTP)</label>
                        <input
                          type="text"
                          required
                          maxLength={6}
                          placeholder="Enter 6-digit OTP code"
                          value={otpCode}
                          onChange={(e) => setOtpCode(e.target.value)}
                          className="w-full bg-slate-50 border border-gray-200 focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] rounded-xl text-xs p-3 outline-none text-center tracking-widest font-bold text-gray-800"
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full py-2.5 bg-[#FF6B00] hover:bg-orange-600 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                      >
                        Verify & Establish Link <Shield className="w-4 h-4" />
                      </button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </motion.div>
            ) : (
              <motion.div
                key="face-auth"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6 text-center"
              >
                <div>
                  <button 
                    onClick={() => { setLoginMethod(null); setFaceScanning(false); }}
                    className="text-[10px] font-mono text-[#FF6B00] hover:underline block text-left"
                  >
                    ← Back to Methods
                  </button>
                  <h3 className="font-sans font-extrabold text-gray-800 text-lg leading-tight mt-1">FRT Face Recognition Biometrics</h3>
                  <p className="text-xs text-gray-400">Verifying biometric vectors against UIDAI Aadhaar Vault</p>
                </div>

                {/* Simulated Camera Scanner UI */}
                <div className="relative w-44 h-44 mx-auto rounded-full overflow-hidden border-4 border-gray-100 bg-slate-950 flex items-center justify-center">
                  <div className="absolute inset-4 rounded-full border border-dashed border-gray-500/40" />
                  
                  {/* Pulse scan horizontal line */}
                  {faceScanning && (
                    <motion.div 
                      className="absolute left-0 right-0 h-1.5 bg-green-500/80 shadow-[0_0_8px_#22c55e]"
                      animate={{ y: [-70, 70, -70] }}
                      transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    />
                  )}

                  {faceComplete ? (
                    <div className="z-10 text-center text-green-500 space-y-1">
                      <CheckCircle2 className="w-10 h-10 mx-auto fill-current bg-white rounded-full" />
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider block">Identity Verified</span>
                    </div>
                  ) : faceScanning ? (
                    <div className="z-10 text-center text-gray-400 animate-pulse space-y-1">
                      <ScanFace className="w-10 h-10 mx-auto text-green-500" />
                      <span className="text-[10px] font-mono tracking-wider block">Mapping Vectors...</span>
                    </div>
                  ) : (
                    <button 
                      onClick={triggerFaceBiometric}
                      className="z-10 text-center text-gray-400 hover:text-[#FF6B00] transition-colors space-y-1.5"
                    >
                      <ScanFace className="w-12 h-12 mx-auto text-gray-600 hover:text-[#FF6B00] transition-colors animate-pulse" />
                      <span className="text-[10px] font-mono tracking-wider block font-bold">Initiate Camera Scan</span>
                    </button>
                  )}
                </div>

                <div className="text-[10px] text-gray-400">
                  <p>UIDAI FaceRD Protocol 2.4. Secure end-to-end sandbox channels.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

      </div>

      {/* ADDITIONAL LANDING PAGE CARDS - CITIZEN DIRECTORY & FIREBASE CREDENTIALS */}
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
        
        {/* CARD 1: NATIONAL CIVIC PROTOCOL */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-orange-50 text-[#FF6B00] rounded-xl">
                <Shield className="w-4 h-4" />
              </div>
              <h4 className="font-sans font-bold text-xs text-gray-800 uppercase tracking-wider">
                Civic Protocol
              </h4>
            </div>
            <p className="text-[11px] text-gray-500 leading-relaxed">
              OneBharat utilizes secure national database protocols to instantly dispatch civic notifications and verification tickets to municipal desk officers.
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-600 bg-emerald-50 px-2 py-1.5 rounded-lg border border-emerald-100 self-start">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span>Database Secured</span>
          </div>
        </div>

        {/* CARD 2: FIREBASE SECURE SYSTEM GATEWAY (SHOW/HIDE API KEY) */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-orange-50 text-[#FF6B00] rounded-xl">
                <Lock className="w-4 h-4" />
              </div>
              <h4 className="font-sans font-bold text-xs text-gray-800 uppercase tracking-wider">
                Sandbox Credentials
              </h4>
            </div>
            <p className="text-[11px] text-gray-500 leading-relaxed">
              OneBharat operates on a secure Firebase database backend. View the verified system credentials below:
            </p>
          </div>

          <div className="space-y-1.5 bg-slate-50 p-2.5 rounded-xl border border-gray-200 font-mono text-[9px] text-gray-600 relative">
            <p className="text-gray-400">PROJECT ID:</p>
            <p className="font-bold text-gray-700 truncate">striped-inquiry-419615</p>
            
            <div className="border-t border-gray-200/60 my-1.5 pt-1.5">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">API KEY:</span>
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="p-1 hover:bg-gray-200 text-gray-500 hover:text-[#FF6B00] rounded transition-all flex items-center gap-1 cursor-pointer"
                  title={showApiKey ? "Hide Key" : "Show Key"}
                >
                  {showApiKey ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5" />
                      <span className="text-[8px] font-bold">Hide</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5" />
                      <span className="text-[8px] font-bold">Show</span>
                    </>
                  )}
                </button>
              </div>
              <p className="font-bold text-gray-800 tracking-tight font-mono truncate mt-0.5 select-all">
                {showApiKey ? "AIzaSyBPOws4NoxcGK-HjHCiCQY89H-84sjOgVM" : "••••••••••••••••••••••••••••••••••••"}
              </p>
            </div>
          </div>
        </div>

        {/* CARD 3: BIHAR DISTRICT SUPER-NETWORK DIRECTORY */}
        <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl p-5 shadow-lg space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-slate-800 text-[#FF6B00] rounded-xl">
                <Building2 className="w-4 h-4" />
              </div>
              <h4 className="font-sans font-bold text-xs text-orange-400 uppercase tracking-wider">
                Nodal Ward Dispatch
              </h4>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Unified dispatch routers connect Sonpur Ward Central with the Hajipur Regional Corporator Cell to ensure instant local crew mobilization.
            </p>
          </div>
          <div className="flex items-center justify-between text-[10px] font-mono text-gray-400 border-t border-slate-800 pt-2">
            <span>Saran-Vaishali Hub</span>
            <span className="text-[#FF6B00] font-bold">98.4% SLA</span>
          </div>
        </div>

      </div>

    </div>
  );
};
