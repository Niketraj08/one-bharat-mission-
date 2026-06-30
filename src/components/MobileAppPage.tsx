/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { 
  Smartphone, 
  Download, 
  QrCode, 
  CheckCircle, 
  ArrowRight, 
  Chrome, 
  Compass, 
  HelpCircle,
  Sparkles,
  Info,
  ShieldCheck,
  Send,
  Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export const MobileAppPage: React.FC = () => {
  const { addNotification } = useApp();
  
  // PWA Prompt states
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isPwaInstalled, setIsPwaInstalled] = useState(false);
  
  // APK Form states
  const [phoneOrEmail, setPhoneOrEmail] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadStep, setDownloadStep] = useState(0); // 0: Idle, 1: Sent, 2: Initiating download

  // Listen for PWA beforeinstallprompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    
    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsPwaInstalled(true);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  // Trigger real browser PWA install
  const handleInstallPWA = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setIsPwaInstalled(true);
        setDeferredPrompt(null);
        addNotification("PWA Installed", "OneBharat successfully added to your device!", "success");
      }
    } else {
      // Show custom manual install info based on browser
      addNotification(
        "PWA Installation",
        "Tap the Browser Menu (three dots or share button) and select 'Add to Home Screen' or 'Install App' to install OneBharat instantly.",
        "info"
      );
    }
  };

  // Simulated APK Download & Link generation
  const handleApkFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneOrEmail.trim()) {
      addNotification("Required Field", "Please enter a valid phone number or email.", "warning");
      return;
    }

    setIsGenerating(true);
    addNotification("Compiling APK", "Generating secure Android package signature...", "info");

    setTimeout(() => {
      setIsGenerating(false);
      setFormSubmitted(true);
      setDownloadStep(1);
      addNotification("SMS/Email Sent", "Direct secure download link dispatched successfully!", "success");

      // Trigger actual mock APK file download in browser
      setTimeout(() => {
        setDownloadStep(2);
        // We trigger download of a mock apk file name
        const element = document.createElement("a");
        const file = new Blob(["Simulated OneBharat APK Package Content - Complete Production Build."], { type: "text/plain" });
        element.href = URL.createObjectURL(file);
        element.download = "OneBharat_v2.1_Saran_Release.apk";
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        
        addNotification("Download Started", "OneBharat Android APK download initiated.", "success");
      }, 1500);

    }, 2000);
  };

  return (
    <div id="mobile-app-pwa-page" className="max-w-4xl mx-auto space-y-8">
      
      {/* HERO SECTION */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-xl border border-slate-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF6B00]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-center relative z-10">
          <div className="md:col-span-3 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF6B00]/20 text-[#FF6B00] border border-[#FF6B00]/30 text-xs font-bold font-mono">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" /> PWA & Android APK Live Delivery
            </div>
            <h2 className="text-2xl md:text-3.5xl font-sans font-black tracking-tight leading-tight">
              OneBharat Mobile Super App
            </h2>
            <p className="text-gray-300 text-xs md:text-sm leading-relaxed max-w-lg">
              Report potholes, waterlogged streets, and broken streetlights directly from the location using our fully offline-first mobile app. Choose standard Android APK installation or add the super lightweight Progressive Web App (PWA) to your home screen!
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700">
                <ShieldCheck className="w-4 h-4 text-green-400" />
                <span className="text-[10px] font-mono text-gray-300">NIC Secure & Verified</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700">
                <Smartphone className="w-4 h-4 text-blue-400" />
                <span className="text-[10px] font-mono text-gray-300">Offline Location Reporting</span>
              </div>
            </div>
          </div>

          {/* Interactive Mobile Mockup */}
          <div className="md:col-span-2 hidden md:flex justify-center">
            <div className="w-48 h-80 bg-slate-950 border-4 border-slate-700 rounded-[32px] p-2 relative shadow-2xl flex flex-col justify-between overflow-hidden">
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-3 bg-slate-700 rounded-full z-20" />
              
              <div className="bg-slate-900 flex-1 rounded-[24px] p-3 text-white flex flex-col justify-between relative overflow-hidden">
                <div className="space-y-1.5 mt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[8px] font-mono text-[#FF6B00] font-black uppercase">OneBharat</span>
                    <span className="text-[7px] text-gray-400 font-mono">LIVE • Ward 4</span>
                  </div>
                  <div className="h-0.5 w-full bg-slate-800" />
                </div>

                <div className="my-auto space-y-2 text-center">
                  <div className="w-10 h-10 bg-[#FF6B00] rounded-xl mx-auto flex items-center justify-center font-sans font-black text-xs text-white shadow-lg animate-bounce">
                    OB
                  </div>
                  <h4 className="text-[11px] font-bold font-sans">Saran District Portal</h4>
                  <div className="p-1.5 bg-slate-800/80 rounded-lg text-[8px] text-gray-400 text-left space-y-1">
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                      <span>GPS Connected</span>
                    </div>
                    <div className="font-mono text-[7px] truncate">Hajipur Highway near Gandak...</div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="h-6 bg-[#FF6B00] hover:bg-orange-600 rounded-lg flex items-center justify-center text-[9px] font-bold cursor-pointer transition-colors shadow-md">
                    Report Issue
                  </div>
                  <div className="flex justify-between text-[7px] text-gray-500 font-mono">
                    <span>v2.1 Stable</span>
                    <span>14.2 MB</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* PROGRESSIVE WEB APP (PWA) SECTION */}
        <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[#FF6B00]">
              <Chrome className="w-5 h-5" />
              <h3 className="font-sans font-bold text-gray-800 text-sm">Progressive Web App (PWA)</h3>
            </div>
            
            <p className="text-xs text-gray-500 leading-relaxed">
              Install the application instantly as a desktop or mobile application directly through your current web browser. PWA works smoothly with no extra space overhead or security concerns.
            </p>

            <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-3">
              <div className="flex justify-between items-center text-xs font-semibold text-gray-700">
                <span>PWA Integration Status:</span>
                {isPwaInstalled ? (
                  <span className="text-green-600 font-bold flex items-center gap-1 font-mono text-[10px]">
                    ✓ INSTALLED
                  </span>
                ) : (
                  <span className="text-[#FF6B00] font-bold flex items-center gap-1 font-mono text-[10px] animate-pulse">
                    ● READY TO INSTALL
                  </span>
                )}
              </div>

              <div className="space-y-2.5 text-[11px] text-gray-600">
                <div className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-[#FF6B00]/10 text-[#FF6B00] flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5">1</span>
                  <span><strong>Zero Storage Cost</strong>: PWA installation takes less than 1 MB of memory.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-[#FF6B00]/10 text-[#FF6B00] flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5">2</span>
                  <span><strong>Instant Updates</strong>: Always stays synced to the latest NIC release automatic.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-[#FF6B00]/10 text-[#FF6B00] flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5">3</span>
                  <span><strong>Home Screen Icon</strong>: Access directly from your phone app list.</span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleInstallPWA}
            disabled={isPwaInstalled}
            className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow ${
              isPwaInstalled 
                ? "bg-slate-100 border border-slate-200 text-slate-400 cursor-not-allowed" 
                : "bg-gray-900 hover:bg-gray-800 text-white"
            }`}
          >
            <Smartphone className="w-4 h-4 text-[#FF6B00]" /> 
            {isPwaInstalled ? "Already Installed on Device" : "Install PWA App Instantly"}
          </button>
        </div>

        {/* ANDROID APK DOWNLOAD FORM */}
        <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[#FF6B00]">
              <Download className="w-5 h-5" />
              <h3 className="font-sans font-bold text-gray-800 text-sm">Download Verified Android APK</h3>
            </div>

            <p className="text-xs text-gray-500 leading-relaxed">
              Prefer a dedicated Android app package? Enter your mobile number to receive a secure SMS download link, or generate and download the installation file directly below.
            </p>

            <AnimatePresence mode="wait">
              {!formSubmitted ? (
                <form onSubmit={handleApkFormSubmit} className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-bold text-gray-400 uppercase">Phone or Email for SMS Link</label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        placeholder="e.g. +91 98765 43210 or name@gmail.com"
                        value={phoneOrEmail}
                        onChange={(e) => setPhoneOrEmail(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-gray-200 focus:border-[#FF6B00] rounded-xl text-xs outline-none text-gray-800 transition-all placeholder:text-gray-400"
                      />
                      <button
                        type="submit"
                        disabled={isGenerating}
                        className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1 text-[#FF6B00] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                      >
                        {isGenerating ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Send className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-mono italic">
                    <Info className="w-3.5 h-3.5" />
                    <span>Secure APK package is 14.2 MB. Supports Android 8.0+.</span>
                  </div>
                </form>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 bg-green-50 border border-green-150 rounded-2xl space-y-3"
                >
                  <div className="flex items-start gap-2.5">
                    <div className="p-1 bg-green-500 text-white rounded-lg">
                      <CheckCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-green-800">Dispatch Package Secured!</h4>
                      <p className="text-[10px] text-green-700 leading-normal mt-0.5">
                        Download Link dispatched to: <b>{phoneOrEmail}</b>
                      </p>
                    </div>
                  </div>

                  <div className="h-0.5 w-full bg-green-100" />

                  {downloadStep === 1 && (
                    <div className="flex items-center gap-2 text-[10px] text-green-600 font-mono animate-pulse">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Initiating auto-download of APK file...</span>
                    </div>
                  )}

                  {downloadStep === 2 && (
                    <div className="text-[10px] text-green-700 font-mono leading-relaxed space-y-1">
                      <p>✓ Downloaded: <b>OneBharat_v2.1_Saran_Release.apk</b></p>
                      <p className="italic text-gray-500 text-[9px] mt-1">
                        How to install: Tap open the file in your downloads and enable "Allow installation from this source" when prompted.
                      </p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={handleApkFormSubmit}
            disabled={isGenerating}
            className="w-full py-2.5 bg-[#FF6B00] hover:bg-orange-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md shadow-orange-500/10"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Packaging APK Installer...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" /> Download APK Package
              </>
            )}
          </button>
        </div>

      </div>

      {/* DETAILED QR & OFFLINE REPORTING GUIDE */}
      <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
        <h3 className="font-sans font-bold text-gray-800 text-sm mb-4 flex items-center gap-2">
          <QrCode className="w-5 h-5 text-[#FF6B00]" /> Scan & Share Mobile Access
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
          <div className="col-span-1 flex justify-center">
            {/* Simulated QR Code built using absolute CSS box elements for premium custom look */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl relative shadow-sm flex flex-col items-center justify-center space-y-2">
              <div className="w-28 h-28 bg-white border border-slate-300 p-2 rounded-xl relative flex items-center justify-center">
                {/* SVG mock QR pattern */}
                <svg className="w-full h-full text-slate-800" viewBox="0 0 100 100" fill="currentColor">
                  {/* Top-left corner finder */}
                  <path d="M0,0 h30 v10 h-20 v20 h-10 z" />
                  <path d="M10,10 h10 v10 h-10 z" />
                  {/* Top-right corner finder */}
                  <path d="M70,0 h30 v30 h-10 v-20 h-20 z" />
                  <path d="M80,10 h10 v10 h-10 z" />
                  {/* Bottom-left corner finder */}
                  <path d="M0,70 h10 v20 h20 v10 h-30 z" />
                  <path d="M10,80 h10 v10 h-10 z" />
                  {/* Random QR block noise */}
                  <rect x="40" y="10" width="10" height="15" />
                  <rect x="55" y="5" width="10" height="10" />
                  <rect x="35" y="35" width="20" height="20" />
                  <rect x="15" y="45" width="10" height="15" />
                  <rect x="45" y="70" width="15" height="15" />
                  <rect x="75" y="45" width="15" height="10" />
                  <rect x="70" y="70" width="20" height="20" />
                </svg>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-lg shadow-md border border-slate-100 flex items-center justify-center">
                  <span className="text-[10px] text-[#FF6B00] font-bold">OB</span>
                </div>
              </div>
              <span className="text-[9px] font-mono font-bold text-gray-500 uppercase tracking-widest">OB-SCAN-GATE</span>
            </div>
          </div>

          <div className="col-span-1 md:col-span-3 space-y-4">
            <h4 className="text-xs font-bold text-gray-700">How to Setup Offline Geographic Positioning:</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="space-y-1 p-3 bg-slate-50/50 rounded-2xl border border-slate-100">
                <span className="text-[#FF6B00] font-bold font-mono">STEP 1</span>
                <p className="font-semibold text-gray-800 text-[11px]">Install App</p>
                <p className="text-gray-500 text-[10px] leading-relaxed">Install the APK or open our site and click 'Add to Home Screen'.</p>
              </div>

              <div className="space-y-1 p-3 bg-slate-50/50 rounded-2xl border border-slate-100">
                <span className="text-[#FF6B00] font-bold font-mono">STEP 2</span>
                <p className="font-semibold text-gray-800 text-[11px]">Grant GPS Scope</p>
                <p className="text-gray-500 text-[10px] leading-relaxed">Allow camera and geographic location permissions when requested.</p>
              </div>

              <div className="space-y-1 p-3 bg-slate-50/50 rounded-2xl border border-slate-100">
                <span className="text-[#FF6B00] font-bold font-mono">STEP 3</span>
                <p className="font-semibold text-gray-800 text-[11px]">Report & Sync</p>
                <p className="text-gray-500 text-[10px] leading-relaxed">Tap and submit. If offline, the app stores files locally and syncs once network loads!</p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
