/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState } from "react";
import { gsap } from "gsap";
import { AppProvider, useApp } from "./context/AppContext";
import { UserRole, ComplaintStatus } from "./types";
import { CitizenDashboard } from "./components/CitizenDashboard";
import { ComplaintFlow } from "./components/ComplaintFlow";
import { ComplaintTracker } from "./components/ComplaintTracker";
import { OfficerPortal } from "./components/OfficerPortal";
import { AdminPortal } from "./components/AdminPortal";
import { InteractiveMap } from "./components/InteractiveMap";
import { SplashIntro } from "./components/SplashIntro";
import { 
  MapPin, 
  Bell, 
  User, 
  LogOut, 
  Menu, 
  X, 
  ShieldCheck, 
  LayoutDashboard, 
  Map, 
  UserSquare, 
  Settings, 
  CheckCircle,
  AlertTriangle,
  Globe,
  PlusCircle,
  HelpCircle,
  Mail,
  Eye,
  EyeOff,
  Shield,
  Lock,
  Building2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

function AppContent() {
  const { 
    role, 
    setRole, 
    notifications, 
    markNotificationsAsRead, 
    markNotificationAsRead,
    selectedComplaintId, 
    setSelectedComplaintId 
  } = useApp();

  const [isAuthenticated, setIsAuthenticated] = useState(true);
  
  const [userName, setUserName] = useState(() => {
    const saved = localStorage.getItem("onebharat_user_name");
    if (!saved) {
      localStorage.setItem("onebharat_user_name", "Niket Raj");
      return "Niket Raj";
    }
    return saved;
  });

  const [showApiKey, setShowApiKey] = useState(false);

  // Navigation / Workspace tab state
  const [activeTab, setActiveTab] = useState<"dashboard" | "lodge" | "map" | "track" | "officer" | "admin">("dashboard");
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Synchronize active tab with selected user role
  React.useEffect(() => {
    if (role === UserRole.CITIZEN) {
      setActiveTab("dashboard");
    } else if (role === UserRole.OFFICER) {
      setActiveTab("officer");
    } else {
      setActiveTab("admin");
    }
  }, [role]);

  // GSAP Entrance animation for the layout and branding logo
  React.useEffect(() => {
    if (isAuthenticated) {
      const ctx = gsap.context(() => {
        gsap.fromTo(".app-logo-box", 
          { scale: 0, rotation: -180 },
          { scale: 1, rotation: 0, duration: 1.2, ease: "elastic.out(1, 0.65)", delay: 0.2 }
        );
        gsap.fromTo(".app-title-text", 
          { opacity: 0, x: -20 },
          { opacity: 1, x: 0, duration: 0.6, ease: "power2.out", delay: 0.4 }
        );
        gsap.fromTo(".app-subtitle-text", 
          { opacity: 0, x: -20 },
          { opacity: 1, x: 0, duration: 0.6, ease: "power2.out", delay: 0.5 }
        );
        gsap.fromTo(".nav-btn-item", 
          { opacity: 0, y: -10 },
          { opacity: 1, y: 0, stagger: 0.08, duration: 0.5, ease: "back.out(1.5)", delay: 0.4 }
        );
        gsap.fromTo(".right-control-item", 
          { opacity: 0, x: 20 },
          { opacity: 1, x: 0, stagger: 0.08, duration: 0.5, ease: "power2.out", delay: 0.5 }
        );
      });
      return () => ctx.revert();
    }
  }, [isAuthenticated]);

  const handleLoginSuccess = (name: string, selectedRole: UserRole) => {
    localStorage.setItem("onebharat_user_name", name);
    setUserName(name);
    setRole(selectedRole);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("onebharat_user_name");
    localStorage.removeItem("onebharat_complaints");
    localStorage.removeItem("onebharat_role");
    localStorage.removeItem("onebharat_citizen_profile");
    setIsAuthenticated(false);
    window.location.reload();
  };

  const handleBellClick = () => {
    setShowNotifDropdown(!showNotifDropdown);
    if (!showNotifDropdown) {
      markNotificationsAsRead();
    }
  };

  // Nav items based on role
  const getNavItems = () => {
    if (role === UserRole.CITIZEN) {
      return [
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
        { id: "lodge", label: "File Complaint", icon: PlusCircle },
        { id: "map", label: "Interactive Map", icon: Map }
      ];
    } else if (role === UserRole.OFFICER) {
      return [
        { id: "officer", label: "My Assignments", icon: UserSquare },
        { id: "map", label: "Interactive Map", icon: Map }
      ];
    } else {
      return [
        { id: "admin", label: "Nodal Analytics", icon: LayoutDashboard },
        { id: "map", label: "Interactive Map", icon: Map }
      ];
    }
  };

  // Handle direct complaint tracking route
  const handleSelectComplaint = (id: string) => {
    setSelectedComplaintId(id);
    setActiveTab("track");
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      
      {/* GLOBAL HIGH-CONTRAST TOP BAR */}
      <header className="bg-slate-900 text-white sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          
          {/* LOGO AREA */}
          <div className="flex items-center gap-3">
            <button 
              className="md:hidden p-1 rounded hover:bg-slate-800 text-gray-300"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="w-6 h-6" />
            </button>

            <div 
              className="flex items-center gap-2.5 cursor-pointer"
              onClick={() => {
                setActiveTab("dashboard");
                setSelectedComplaintId(null);
              }}
            >
              <div className="app-logo-box w-9 h-9 bg-slate-800 rounded-xl flex items-center justify-center shadow-lg overflow-hidden border border-slate-700">
                <img src="/src/assets/images/onebharat_logo_1782755871364.jpg" alt="OneBharat Logo" className="app-logo-img w-full h-full object-cover animate-pulse" />
              </div>
              <div className="hidden sm:block text-left">
                <h1 className="app-title-text font-black text-sm uppercase tracking-tight leading-none text-white">OneBharat</h1>
                <span className="app-subtitle-text text-[9px] font-mono tracking-widest text-[#FF6B00] uppercase block mt-0.5">India Civic Core</span>
              </div>
            </div>
          </div>

          {/* DESKTOP INTEGRATED NAVIGATION */}
          <nav className="hidden md:flex items-center gap-1.5">
            {getNavItems().map((item) => {
              const Icon = item.icon;
              const isSelected = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as any);
                    setSelectedComplaintId(null);
                  }}
                  className={`nav-btn-item px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    isSelected 
                      ? "bg-[#FF6B00] text-white shadow-md shadow-orange-500/10" 
                      : "text-gray-300 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* RIGHT CONTROLS: NOTIFICATIONS, PROFILE */}
          <div className="flex items-center gap-3">

            {/* NOTIFICATION BELL WITH DROPDOWN */}
            <div className="right-control-item relative">
              <button
                onClick={handleBellClick}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-gray-300 hover:text-white rounded-xl transition-all relative border border-slate-700"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#FF6B00] text-white text-[9px] font-mono font-bold rounded-full flex items-center justify-center animate-bounce">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Dynamic Notification List Dropdown */}
              <AnimatePresence>
                {showNotifDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-3 w-80 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 p-4 text-gray-800"
                  >
                    <div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-100">
                      <h4 className="font-sans font-bold text-xs">Live Smart Audit Logs</h4>
                      <button 
                        onClick={() => setShowNotifDropdown(false)}
                        className="text-[10px] font-semibold text-[#FF6B00] hover:underline"
                      >
                        Dismiss
                      </button>
                    </div>

                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {notifications.map((notif) => {
                        const typeIcons = 
                          notif.type === "success" 
                            ? "text-green-500" 
                            : notif.type === "alert" 
                            ? "text-red-500" 
                            : "text-[#FF6B00]";

                        return (
                          <div key={notif.id} className="p-2 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
                            <div className="flex justify-between text-[9px] font-mono text-gray-400">
                              <span className="font-bold flex items-center gap-1">
                                <span className={`w-1.5 h-1.5 rounded-full ${typeIcons === "text-green-500" ? "bg-green-500" : typeIcons === "text-red-500" ? "bg-red-500" : "bg-orange-500"}`} />
                                {notif.title}
                              </span>
                              <span>{notif.time}</span>
                            </div>
                            <p className="text-[11px] text-gray-600 leading-normal">{notif.message}</p>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* QUICK ROLE SELECTOR FOR TESTING */}
            <div className="hidden md:flex items-center bg-slate-800/80 rounded-xl p-1 border border-slate-700/60 select-none mr-2">
              <button
                onClick={() => setRole(UserRole.CITIZEN)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all tracking-wider cursor-pointer ${
                  role === UserRole.CITIZEN 
                    ? "bg-[#FF6B00] text-white shadow-sm" 
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Citizen
              </button>
              <button
                onClick={() => setRole(UserRole.OFFICER)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all tracking-wider cursor-pointer ${
                  role === UserRole.OFFICER 
                    ? "bg-[#FF6B00] text-white shadow-sm" 
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Officer
              </button>
              <button
                onClick={() => setRole(UserRole.ADMIN)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all tracking-wider cursor-pointer ${
                  role === UserRole.ADMIN 
                    ? "bg-[#FF6B00] text-white shadow-sm" 
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Admin
              </button>
            </div>

            {/* USER PROFILE INFO DROPDOWN BUTTON */}
            <div className="right-control-item flex items-center gap-2 border-l border-slate-800 pl-3">
              <div className="text-right hidden lg:block">
                <p className="text-xs font-bold leading-none text-white">{userName}</p>
                <span className="text-[9px] font-mono text-[#FF6B00] uppercase font-bold mt-0.5">
                  {role === UserRole.CITIZEN ? "Verified Citizen" : role === UserRole.OFFICER ? "Ward Officer" : "District Admin"}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-gray-300 hover:text-red-400 rounded-xl transition-all border border-slate-700 cursor-pointer"
                title="Reset State & Reload"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>
      </header>

      {/* MOBILE NAV MENU */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-slate-900 border-b border-slate-800 text-white py-4 px-4 space-y-4 z-30"
          >
            {/* Mobile Nav Links */}
            <div className="flex flex-col gap-2">
              {getNavItems().map((item) => {
                const Icon = item.icon;
                const isSelected = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id as any);
                      setSelectedComplaintId(null);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all ${
                      isSelected 
                        ? "bg-[#FF6B00] text-white" 
                        : "text-gray-300 hover:text-white hover:bg-slate-800"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Mobile Role Switcher */}
            <div className="border-t border-slate-800 pt-3.5 space-y-2">
              <p className="text-[10px] font-mono tracking-wider uppercase text-gray-400 px-1">Switch View Role</p>
              <div className="grid grid-cols-3 gap-1.5 bg-slate-800 rounded-xl p-1 border border-slate-700">
                <button
                  onClick={() => { setRole(UserRole.CITIZEN); setMobileMenuOpen(false); }}
                  className={`py-2 rounded-lg text-[10px] font-bold uppercase transition-all text-center cursor-pointer ${role === UserRole.CITIZEN ? "bg-[#FF6B00] text-white" : "text-gray-400 hover:text-white"}`}
                >
                  Citizen
                </button>
                <button
                  onClick={() => { setRole(UserRole.OFFICER); setMobileMenuOpen(false); }}
                  className={`py-2 rounded-lg text-[10px] font-bold uppercase transition-all text-center cursor-pointer ${role === UserRole.OFFICER ? "bg-[#FF6B00] text-white" : "text-gray-400 hover:text-white"}`}
                >
                  Officer
                </button>
                <button
                  onClick={() => { setRole(UserRole.ADMIN); setMobileMenuOpen(false); }}
                  className={`py-2 rounded-lg text-[10px] font-bold uppercase transition-all text-center cursor-pointer ${role === UserRole.ADMIN ? "bg-[#FF6B00] text-white" : "text-gray-400 hover:text-white"}`}
                >
                  Admin
                </button>
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

      {/* CORE FRAMEWORK STAGE */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab + (selectedComplaintId || "")}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            {activeTab === "dashboard" && role === UserRole.CITIZEN && (
              <CitizenDashboard 
                onNewComplaint={() => setActiveTab("lodge")} 
                onSelectComplaint={handleSelectComplaint} 
              />
            )}

            {activeTab === "lodge" && role === UserRole.CITIZEN && (
              <ComplaintFlow 
                onSuccess={(id) => handleSelectComplaint(id)} 
                onCancel={() => setActiveTab("dashboard")} 
              />
            )}

            {activeTab === "map" && <InteractiveMap />}

            {activeTab === "officer" && role === UserRole.OFFICER && (
              <OfficerPortal onSelectComplaint={handleSelectComplaint} />
            )}

            {activeTab === "admin" && role === UserRole.ADMIN && (
              <AdminPortal />
            )}

            {activeTab === "track" && selectedComplaintId && (
              <ComplaintTracker 
                complaintId={selectedComplaintId} 
                onBack={() => setActiveTab(role === UserRole.CITIZEN ? "dashboard" : role === UserRole.OFFICER ? "officer" : "admin")} 
                onViewOnMap={() => {
                  setActiveTab("map");
                }}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* ADDITIONAL COHESIVE ROOT PANEL - DISTRICT AUDIT & FIREBASE CONFIG */}
      <footer className="bg-slate-100 border-t border-gray-200 py-8 px-4 mt-auto">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          
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
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-600 bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-100 self-start">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
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
                    className="p-1 hover:bg-gray-200 text-gray-500 hover:text-[#FF6B00] rounded transition-all flex items-center gap-1 cursor-pointer animate-pulse"
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
      </footer>

      {/* INTEGRATED FLOATING TOASTS NOTIFICATIONS RENDER */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full">
        <AnimatePresence>
          {notifications
            .filter((notif) => !notif.read)
            .slice(0, 2)
            .map((notif) => (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, x: 50, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 50, scale: 0.95 }}
                className="p-3.5 bg-gray-900 text-white rounded-2xl shadow-xl flex items-start gap-3 pointer-events-auto border border-gray-800 relative group"
              >
                {notif.type === "alert" ? (
                  <div className="p-1.5 bg-red-500/20 text-red-400 rounded-lg flex-shrink-0 animate-pulse">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                ) : (
                  <div className="p-1.5 bg-green-500/20 text-green-400 rounded-lg flex-shrink-0">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                )}
                
                <div className="flex-1 pr-6">
                  <h5 className="text-xs font-bold font-sans">{notif.title}</h5>
                  <p className="text-[10px] text-gray-400 leading-normal mt-0.5">{notif.message}</p>
                </div>

                {/* Dismiss Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    markNotificationAsRead(notif.id);
                  }}
                  className="absolute top-2 right-2 p-1 text-gray-500 hover:text-white rounded-lg hover:bg-gray-800 transition-colors"
                  aria-label="Dismiss alert"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            ))}
        </AnimatePresence>
      </div>

    </div>
  );
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <AppProvider>
      {showSplash ? (
        <SplashIntro onComplete={() => setShowSplash(false)} />
      ) : (
        <AppContent />
      )}
    </AppProvider>
  );
}
