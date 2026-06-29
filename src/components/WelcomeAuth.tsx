/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
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
  ScanFace
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface WelcomeAuthProps {
  onLoginSuccess: (name: string) => void;
}

export const WelcomeAuth: React.FC<WelcomeAuthProps> = ({ onLoginSuccess }) => {
  const [slide, setSlide] = useState(1);
  const [loginMethod, setLoginMethod] = useState<"phone" | "google" | "face" | null>(null);
  const [phone, setPhone] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [faceScanning, setFaceScanning] = useState(false);
  const [faceComplete, setFaceComplete] = useState(false);

  const triggerOtpSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;
    setOtpSent(true);
  };

  const handleOtpVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode) return;
    onLoginSuccess("Arjun Mehta");
  };

  const triggerFaceBiometric = () => {
    setFaceScanning(true);
    setFaceComplete(false);
    setTimeout(() => {
      setFaceScanning(false);
      setFaceComplete(true);
      setTimeout(() => {
        onLoginSuccess("Arjun Mehta");
      }, 1000);
    }, 3200);
  };

  return (
    <div id="welcome-onboarding-auth" className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-2 min-h-[540px]">
        
        {/* BRANDING & SLIDES (LEFT PANEL) */}
        <div className="bg-gradient-to-br from-slate-900 to-gray-950 p-8 text-white flex flex-col justify-between relative overflow-hidden">
          {/* Subtle Glowing Accents */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-orange-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-600/10 rounded-full blur-3xl" />

          {/* Logo Heading */}
          <div className="flex items-center gap-2 z-10">
            <div className="w-9 h-9 bg-gradient-to-tr from-orange-500 to-amber-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20">
              <MapPin className="w-5 h-5 text-white fill-current" />
            </div>
            <div>
              <h2 className="font-sans font-extrabold text-base leading-none tracking-tight">OneBharat</h2>
              <span className="text-[9px] font-mono tracking-widest text-[#FF6B00] uppercase block mt-0.5">Civic Super Platform</span>
            </div>
          </div>

          {/* Slider Slides */}
          <div className="my-8 z-10">
            <AnimatePresence mode="wait">
              {slide === 1 ? (
                <motion.div
                  key="slide-1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-3"
                >
                  <span className="text-[10px] uppercase font-mono tracking-wider text-[#FF6B00] font-bold">One Nation. One Platform.</span>
                  <h1 className="font-sans font-black text-2xl leading-tight">Every Civic Problem, Solved.</h1>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    The digital public infrastructure where citizens register, monitor, and instantly resolve road, waste, lighting, and sewage hazards directly with district authorities.
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="slide-2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-3"
                >
                  <span className="text-[10px] uppercase font-mono tracking-wider text-blue-400 font-bold">AI SHIELD ENGINE</span>
                  <h1 className="font-sans font-black text-2xl leading-tight">Smart Automated Dispatching</h1>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Our machine learning networks analyze field proof photographs, auto-detect coordinates, predict priority severity, and dispatch correct repair crews automatically in under 4 minutes.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
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
          
          <AnimatePresence mode="wait">
            {loginMethod === null ? (
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
    </div>
  );
};
