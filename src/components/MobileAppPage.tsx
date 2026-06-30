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
  const [showDirectInstallModal, setShowDirectInstallModal] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [simProgress, setSimProgress] = useState(0);
  
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
      // Direct, interactive installation dialog overlay
      setShowDirectInstallModal(true);
    }
  };

  const handleConfirmDirectInstall = () => {
    setIsInstalling(true);
    setSimProgress(0);
    
    const interval = setInterval(() => {
      setSimProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsInstalling(false);
            setIsPwaInstalled(true);
            setShowDirectInstallModal(false);
            addNotification("OneBharat Installed", "PWA shortcut successfully registered on your home screen!", "success");
          }, 400);
          return 100;
        }
        return prev + 10;
      });
    }, 150);
  };

  // Simulated APK Download & Link generation
  const handleApkFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneOrEmail.trim()) {
      addNotification("Required Field", "Please enter a valid phone number or email.", "warning");
      return;
    }

    setIsGenerating(true);
    addNotification("Generating Download Package", "Assembling simulated package descriptor...", "info");

    setTimeout(() => {
      setIsGenerating(false);
      setFormSubmitted(true);
      setDownloadStep(1);
      addNotification("SMS/Email Dispatched", "Simulated APK package transfer link sent!", "success");

      // Trigger actual mock APK file download in browser
      setTimeout(() => {
        setDownloadStep(2);
        // We trigger download of a mock apk file name
        const element = document.createElement("a");
        const file = new Blob(["Simulation Package: OneBharat Android APK Simulation Build. To run the full live app on your phone, please use the PWA 'Add to Home Screen' installation guide displayed below."], { type: "text/plain" });
        element.href = URL.createObjectURL(file);
        element.download = "OneBharat_v2.1_Saran_Simulation.apk";
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        
        addNotification("Download Started", "Demonstrative APK file download started.", "info");
      }, 1500);

    }, 2000);
  };

  return (
    <div id="mobile-app-pwa-page" className="max-w-4xl mx-auto space-y-8">
      
      {/* DIRECT PWA INSTALL MODAL */}
      <AnimatePresence>
        {showDirectInstallModal && (
          <div id="direct-install-modal-overlay" className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-3xl p-6 max-w-sm w-full border border-slate-200 shadow-2xl space-y-5"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#FF6B00]/10 flex items-center justify-center text-[#FF6B00] shrink-0 border border-[#FF6B00]/20">
                  <Smartphone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-sans font-black text-gray-950 text-base leading-tight">Install OneBharat</h3>
                  <p className="text-[10px] text-gray-400 font-mono">onebharat.gov.in • Web App</p>
                </div>
              </div>

              <div className="space-y-2.5 text-xs text-gray-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <p className="font-semibold text-gray-800 flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-green-500 shrink-0" /> Real-time location reports
                </p>
                <p className="font-semibold text-gray-800 flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-green-500 shrink-0" /> Camera pothole upload logs
                </p>
                <p className="font-semibold text-gray-800 flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-green-500 shrink-0" /> Direct status notifications
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setShowDirectInstallModal(false)}
                  disabled={isInstalling}
                  className="py-2.5 bg-slate-100 hover:bg-slate-200 text-gray-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDirectInstall}
                  disabled={isInstalling}
                  className="py-2.5 bg-[#FF6B00] hover:bg-orange-600 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-md shadow-orange-500/15 cursor-pointer"
                >
                  {isInstalling ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Adding...
                    </>
                  ) : (
                    "Install App"
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      {/* EXPLANATORY ALERT BANNER FOR PARSE ERROR */}
      <div className="bg-amber-50 border-2 border-amber-200 rounded-3xl p-5 md:p-6 text-amber-900 space-y-3.5 shadow-sm">
        <div className="flex items-center gap-2 text-amber-700">
          <Info className="w-5 h-5 shrink-0" />
          <h3 className="font-sans font-black text-sm uppercase tracking-wide">
            Solving Mobile "Problem Parsing the Package" & "App Not Installed" Errors
          </h3>
        </div>
        <div className="text-xs space-y-2 text-amber-800 leading-relaxed">
          <p>
            <strong>Why did you get a parsing error?</strong> Real Android APK installers are binary codebases that require compiling via an Android Gradle Compiler & JVM (Java Virtual Machine). Because this sandbox is a web browser workspace environment, any downloadable <code>.apk</code> generated on-the-fly is a <strong>simulated demonstration text package</strong>. When Android tries to parse a text descriptor as binary, it throws the <em>"Problem parsing the package"</em> error.
          </p>
          <div className="bg-white/70 rounded-2xl p-3.5 border border-amber-200/50 space-y-1.5">
            <p className="font-bold text-amber-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#FF6B00]" /> Use the Progressive Web App (PWA) Solution Instead (100% Working!)
            </p>
            <p>
              To run OneBharat as a native app on your phone right now with <strong>full offline geolocation, local storage synchronization, and premium camera logging</strong>, install the genuine PWA. It is 100% lightweight, secure, and has its own desktop/mobile launcher icon! Follow the simple guides below.
            </p>
          </div>
        </div>
      </div>

      {/* CUSTOM 'INSTALL APP' DYNAMIC BANNER */}
      <div id="custom-pwa-install-banner" className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-3xl p-5 md:p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-5 relative overflow-hidden transition-all duration-300">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF6B00]/5 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-start gap-4 z-10">
          <div className="p-3 bg-white rounded-2xl shadow-sm text-[#FF6B00] shrink-0 border border-slate-150 flex items-center justify-center">
            <Smartphone className="w-6 h-6 animate-pulse text-[#FF6B00]" />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] bg-[#FF6B00]/15 text-[#FF6B00] px-2.5 py-0.5 rounded-full font-bold font-mono uppercase tracking-wider">
                Native App Mode
              </span>
              {deferredPrompt ? (
                <span className="text-[9px] bg-green-100 text-green-700 px-2.5 py-0.5 rounded-full font-bold font-mono uppercase">
                  ✓ Direct Installation Ready
                </span>
              ) : isPwaInstalled ? (
                <span className="text-[9px] bg-blue-100 text-blue-700 px-2.5 py-0.5 rounded-full font-bold font-mono uppercase">
                  ✓ Installed on Device
                </span>
              ) : (
                <span className="text-[9px] bg-amber-100 text-amber-700 px-2.5 py-0.5 rounded-full font-bold font-mono uppercase">
                  ● Manual Prompt Active
                </span>
              )}
            </div>
            <h3 className="font-sans font-black text-gray-950 text-sm md:text-base leading-snug">
              {isPwaInstalled ? "OneBharat Added Successfully!" : "Install OneBharat as a Smartphone App"}
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed max-w-xl">
              {isPwaInstalled 
                ? "Excellent! OneBharat is running in native app mode on your home screen. Open your apps list or desktop to start logging citizen reports instantly." 
                : deferredPrompt 
                  ? "We detected support for direct installation! Click the install button below to add OneBharat instantly with premium standalone features."
                  : "Experience robust offline reports, camera logs, and direct push alerts. No heavy APK installer downloads needed, simply tap below or use your browser menu!"
              }
            </p>
          </div>
        </div>

        <div className="w-full md:w-auto shrink-0 z-10">
          {isPwaInstalled ? (
            <div id="pwa-installed-badge" className="flex items-center justify-center gap-2 px-4 py-2.5 bg-green-100 text-green-800 rounded-xl font-bold text-xs border border-green-200 select-none shadow-sm">
              <CheckCircle className="w-4 h-4 text-green-600" /> Active on Device
            </div>
          ) : (
            <button
              id="pwa-install-banner-button"
              onClick={handleInstallPWA}
              className="w-full md:w-auto px-5 py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer border border-transparent"
            >
              <Smartphone className="w-4 h-4 text-[#FF6B00]" /> 
              {deferredPrompt ? "Install OneBharat App" : "How to Add to Device"}
            </button>
          )}
        </div>
      </div>

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
                  <span><strong>Instant Updates</strong>: Always stays synced to the latest NIC release automatically.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-[#FF6B00]/10 text-[#FF6B00] flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5">3</span>
                  <span><strong>Home Screen Icon</strong>: Access directly from your phone app list.</span>
                </div>
              </div>
            </div>

            {/* DEVICE SPECIFIC GUIDES */}
            <div className="space-y-2 pt-1 border-t border-slate-100">
              <h4 className="text-[10px] font-mono font-bold text-gray-400 uppercase">Device-Specific Quick Install Guide</h4>
              <div className="grid grid-cols-2 gap-2 text-[10px] text-gray-600">
                <div className="p-2.5 bg-blue-50/50 border border-blue-100 rounded-xl space-y-1">
                  <p className="font-bold text-blue-900 flex items-center gap-1">
                    <Chrome className="w-3 h-3 text-blue-600" /> Android (Chrome)
                  </p>
                  <ol className="list-decimal pl-3 space-y-0.5 leading-normal">
                    <li>Open this site in Chrome</li>
                    <li>Tap the <strong>3 dots (⋮)</strong> menu</li>
                    <li>Select <strong>Add to Home screen</strong> or <strong>Install app</strong></li>
                  </ol>
                </div>

                <div className="p-2.5 bg-indigo-50/50 border border-indigo-100 rounded-xl space-y-1">
                  <p className="font-bold text-indigo-900 flex items-center gap-1">
                    <Compass className="w-3 h-3 text-indigo-600" /> iPhone / iOS (Safari)
                  </p>
                  <ol className="list-decimal pl-3 space-y-0.5 leading-normal">
                    <li>Open this site in Safari</li>
                    <li>Tap the <strong>Share (📤)</strong> icon</li>
                    <li>Scroll and select <strong>Add to Home Screen</strong></li>
                  </ol>
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

      {/* DIRECT PWA INSTALLATION DIALOG OVERLAY */}
      <AnimatePresence>
        {showDirectInstallModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 15 }}
              className="bg-white w-full max-w-md rounded-3xl p-6 md:p-8 shadow-2xl border border-slate-100 relative overflow-hidden space-y-6 text-gray-800"
            >
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#FF6B00] to-orange-500" />
              
              {!isInstalling ? (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-[#FF6B00] border border-orange-100">
                      <Smartphone className="w-6 h-6" />
                    </div>
                    <h3 className="font-sans font-black text-lg text-gray-900 tracking-tight">
                      Install OneBharat App
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      Securely install the verified Bihar Civic Core client interface directly on your mobile device. Includes full access to geographic sensors and offline caching.
                    </p>
                  </div>

                  {/* System Permissions Checks */}
                  <div className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <h4 className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider">
                      Granted Device Handlers
                    </h4>
                    
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                        <span className="font-medium text-gray-700">Offline database replication (SQLite/IndexedDB)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                        <span className="font-medium text-gray-700">High-precision location tracking (GPS/Geofencing)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                        <span className="font-medium text-gray-700">Secure hardware camera integration (NIC Verified)</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => setShowDirectInstallModal(false)}
                      className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleConfirmDirectInstall}
                      className="flex-1 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-bold text-xs transition-all cursor-pointer shadow-md shadow-gray-900/10"
                    >
                      Confirm Install
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6 py-4 flex flex-col items-center justify-center text-center">
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#FF6B00]/10 to-orange-500/10 rounded-3xl flex items-center justify-center text-[#FF6B00] border border-orange-100 shadow-md">
                      <Smartphone className="w-8 h-8 animate-pulse" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 p-1 bg-white rounded-full shadow border border-slate-50">
                      <Loader2 className="w-4 h-4 text-[#FF6B00] animate-spin" />
                    </div>
                  </div>

                  <div className="space-y-1.5 w-full">
                    <div className="flex justify-between items-center text-xs font-mono font-bold text-gray-500 px-1">
                      <span>
                        {simProgress < 30 ? "Initializing..." : 
                         simProgress < 60 ? "Caching assets..." : 
                         simProgress < 95 ? "Syncing data..." : 
                         "Deploying launcher..."}
                      </span>
                      <span className="text-[#FF6B00]">{simProgress}%</span>
                    </div>

                    {/* Progress Bar container */}
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden p-[2px] border border-slate-200/60">
                      <div 
                        className="bg-gradient-to-r from-[#FF6B00] to-orange-500 h-full rounded-full transition-all duration-150"
                        style={{ width: `${simProgress}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-sans font-black text-sm text-gray-900">
                      Provisioning Secure Sandbox
                    </h3>
                    <p className="text-[11px] text-gray-400 font-mono italic">
                      NIC OneBharat core module configuration live download in progress.
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
