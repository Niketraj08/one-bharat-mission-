import React, { useState } from "react";
import { UserRole } from "../types";
import { 
  Shield, 
  Fingerprint, 
  ScanFace, 
  Lock, 
  Building2, 
  Key, 
  UserSquare, 
  Users, 
  Check, 
  Smartphone, 
  AlertCircle, 
  ArrowRight 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface WelcomeAuthProps {
  onLoginSuccess: (name: string, selectedRole: UserRole) => void;
}

export const WelcomeAuth: React.FC<WelcomeAuthProps> = ({ onLoginSuccess }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.CITIZEN);
  
  // Citizen States
  const [citizenPhone, setCitizenPhone] = useState("9876543210");
  const [citizenName, setCitizenName] = useState("Niket Raj");
  const [citizenOtp, setCitizenOtp] = useState("1947");
  const [otpSent, setOtpSent] = useState(false);
  const [faceScanning, setFaceScanning] = useState(false);
  const [faceComplete, setFaceComplete] = useState(false);

  // Officer States
  const [officerBadge, setOfficerBadge] = useState("OB-OFF-882");
  const [officerCode, setOfficerCode] = useState("8825");

  // Admin States
  const [adminEmail, setAdminEmail] = useState("nodal.bihar@onebharat.gov.in");
  const [adminPassword, setAdminPassword] = useState("••••••••");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCitizenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!citizenPhone || !citizenName) {
      setError("Please fill in your name and active phone number.");
      return;
    }
    setError("");
    if (!otpSent) {
      setIsLoading(true);
      setTimeout(() => {
        setOtpSent(true);
        setIsLoading(false);
      }, 800);
    } else {
      if (citizenOtp !== "1947") {
        setError("Invalid secure OTP. Use demo OTP '1947'.");
        return;
      }
      setIsLoading(true);
      setTimeout(() => {
        onLoginSuccess(citizenName, UserRole.CITIZEN);
        setIsLoading(false);
      }, 1000);
    }
  };

  const startFaceScan = () => {
    setFaceScanning(true);
    setFaceComplete(false);
    setTimeout(() => {
      setFaceScanning(false);
      setFaceComplete(true);
      onLoginSuccess("Niket Raj (Biometric Secured)", UserRole.CITIZEN);
    }, 2400);
  };

  const handleOfficerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!officerBadge || !officerCode) {
      setError("Badge number and verification PIN are required.");
      return;
    }
    if (officerCode !== "8825") {
      setError("Invalid credentials. Use PIN '8825'.");
      return;
    }
    setError("");
    setIsLoading(true);
    setTimeout(() => {
      onLoginSuccess(`Officer ${officerBadge.replace("OB-OFF-", "#")}`, UserRole.OFFICER);
      setIsLoading(false);
    }, 1000);
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminEmail || !adminPassword) {
      setError("Official email and security key are required.");
      return;
    }
    setError("");
    setIsLoading(true);
    setTimeout(() => {
      onLoginSuccess("Bihar State Director", UserRole.ADMIN);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div id="welcome-onboarding-auth" className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-2 min-h-[540px]">
        
        {/* BRANDING & SLIDES (LEFT PANEL) */}
        <div className="bg-slate-950 p-8 flex flex-col justify-between text-white relative overflow-hidden">
          {/* Accent Glow */}
          <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-64 h-64 rounded-full bg-orange-600/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-64 h-64 rounded-full bg-emerald-600/10 blur-3xl" />

          {/* Header */}
          <div className="z-10 flex items-center gap-2.5">
            <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg border border-slate-800">
              <img src="/src/assets/images/onebharat_logo_1782755871364.jpg" alt="OneBharat Logo" className="w-full h-full object-cover rounded-lg" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold tracking-wider text-white flex items-center gap-1 uppercase">
                OneBharat <span className="text-[#FF6B00] text-xs font-mono">Civic</span>
              </h2>
              <p className="text-[9px] text-gray-400 font-mono tracking-widest uppercase">Bihar Digital Desk</p>
            </div>
          </div>

          {/* Core App Information Graphics */}
          <div className="z-10 my-8 space-y-6">
            <div className="space-y-2">
              <span className="px-2 py-0.5 text-[9px] bg-orange-500/15 text-orange-400 rounded-full border border-orange-500/30 font-mono font-bold uppercase tracking-wider">
                State Grievance Network
              </span>
              <h1 className="text-2xl font-bold tracking-tight font-sans text-gray-100 leading-tight">
                Empowering Citizens, <br />
                Unifying Municipalities.
              </h1>
              <p className="text-xs text-gray-400 leading-relaxed max-w-sm">
                A seamless state-level digital platform connecting Sonpur Ward Centrals and the Hajipur Corporator Regional Cell for quick administrative action.
              </p>
            </div>

            <div className="space-y-2.5 pt-4 border-t border-slate-900">
              <div className="flex items-start gap-2.5">
                <div className="p-1 bg-slate-900 text-orange-500 rounded mt-0.5">
                  <Shield className="w-3.5 h-3.5" />
                </div>
                <p className="text-[11px] text-gray-300">
                  <strong className="text-gray-100">National Sandbox Secure</strong>: Direct digital signature protocols for authenticated grievances.
                </p>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="p-1 bg-slate-900 text-emerald-400 rounded mt-0.5">
                  <Building2 className="w-3.5 h-3.5" />
                </div>
                <p className="text-[11px] text-gray-300">
                  <strong className="text-gray-100">Nodal Agency Routing</strong>: Automatic geographic allocation from SARAN-Vaishali Hub to active units.
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="z-10 text-[10px] text-gray-500 font-mono flex items-center justify-between border-t border-slate-900 pt-4">
            <span>Bihar Dept of IT & e-Gov</span>
            <span>v2.4 (Active Sandbox)</span>
          </div>
        </div>

        {/* AUTHENTICATION CONTROL (RIGHT PANEL) */}
        <div className="p-8 flex flex-col justify-between bg-white relative">
          <div>
            {/* Header / Tabs Selector */}
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-gray-800 font-sans tracking-tight">System Gateway</h3>
                <p className="text-xs text-gray-500">Select your authorization channel to gain system access</p>
              </div>

              {/* Roles Selection Nav */}
              <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-2xl border border-gray-200">
                <button
                  type="button"
                  onClick={() => { setSelectedRole(UserRole.CITIZEN); setError(""); }}
                  className={`py-2 rounded-xl text-[10px] font-bold uppercase transition-all flex flex-col items-center gap-1 cursor-pointer ${
                    selectedRole === UserRole.CITIZEN 
                      ? "bg-[#FF6B00] text-white shadow-md" 
                      : "text-gray-600 hover:text-gray-900 hover:bg-slate-200/50"
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Citizen</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setSelectedRole(UserRole.OFFICER); setError(""); }}
                  className={`py-2 rounded-xl text-[10px] font-bold uppercase transition-all flex flex-col items-center gap-1 cursor-pointer ${
                    selectedRole === UserRole.OFFICER 
                      ? "bg-[#FF6B00] text-white shadow-md" 
                      : "text-gray-600 hover:text-gray-900 hover:bg-slate-200/50"
                  }`}
                >
                  <UserSquare className="w-3.5 h-3.5" />
                  <span>Officer</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setSelectedRole(UserRole.ADMIN); setError(""); }}
                  className={`py-2 rounded-xl text-[10px] font-bold uppercase transition-all flex flex-col items-center gap-1 cursor-pointer ${
                    selectedRole === UserRole.ADMIN 
                      ? "bg-[#FF6B00] text-white shadow-md" 
                      : "text-gray-600 hover:text-gray-900 hover:bg-slate-200/50"
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Admin</span>
                </button>
              </div>
            </div>

            {/* Error Notification Banner */}
            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl flex items-start gap-2 text-[11px] font-medium leading-normal animate-pulse">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Core Authentication Interface Forms */}
            <div className="mt-6">
              <AnimatePresence mode="wait">
                {/* 1. CITIZEN SIGN-IN CHANNEL */}
                {selectedRole === UserRole.CITIZEN && (
                  <motion.div
                    key="citizen-panel"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.18 }}
                  >
                    <form onSubmit={handleCitizenSubmit} className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold font-mono text-gray-500 uppercase tracking-wide">Full Name</label>
                        <input
                          type="text"
                          required
                          value={citizenName}
                          onChange={(e) => setCitizenName(e.target.value)}
                          className="w-full px-3.5 py-2.5 text-xs border border-gray-200 rounded-xl focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] outline-none transition-all font-sans text-gray-800"
                          placeholder="e.g. Niket Raj"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold font-mono text-gray-500 uppercase tracking-wide">Mobile Number</label>
                        <div className="relative">
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-mono font-semibold text-gray-400">+91</span>
                          <input
                            type="tel"
                            required
                            pattern="[0-9]{10}"
                            value={citizenPhone}
                            onChange={(e) => setCitizenPhone(e.target.value)}
                            className="w-full pl-12 pr-3.5 py-2.5 text-xs border border-gray-200 rounded-xl focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] outline-none transition-all font-mono text-gray-800"
                            placeholder="Enter 10 digit number"
                          />
                        </div>
                      </div>

                      {otpSent && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="space-y-1.5"
                        >
                          <div className="flex justify-between items-center">
                            <label className="text-[10px] font-bold font-mono text-gray-500 uppercase tracking-wide">Enter One-Time PIN</label>
                            <span className="text-[9px] font-mono font-bold text-orange-500 bg-orange-50 px-1.5 py-0.5 rounded border border-orange-100">DEMO OTP: 1947</span>
                          </div>
                          <div className="relative">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                              <Smartphone className="w-4 h-4" />
                            </span>
                            <input
                              type="text"
                              required
                              pattern="[0-9]{4}"
                              maxLength={4}
                              value={citizenOtp}
                              onChange={(e) => setCitizenOtp(e.target.value)}
                              className="w-full pl-10 pr-3.5 py-2.5 text-xs border border-orange-200 bg-orange-50/10 rounded-xl focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] outline-none transition-all font-mono tracking-widest font-bold text-gray-800 text-center"
                              placeholder="••••"
                            />
                          </div>
                        </motion.div>
                      )}

                      <div className="pt-2 flex flex-col gap-2.5">
                        <button
                          type="submit"
                          disabled={isLoading}
                          className="w-full py-2.5 bg-[#FF6B00] hover:bg-orange-600 disabled:bg-orange-400 text-white font-sans font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md shadow-orange-600/10 cursor-pointer"
                        >
                          {isLoading ? (
                            <span>Processing...</span>
                          ) : otpSent ? (
                            <>
                              <span>Verify & Launch Platform</span>
                              <Check className="w-4 h-4" />
                            </>
                          ) : (
                            <>
                              <span>Generate Verification OTP</span>
                              <ArrowRight className="w-4 h-4" />
                            </>
                          )}
                        </button>

                        {!otpSent && (
                          <button
                            type="button"
                            disabled={faceScanning}
                            onClick={startFaceScan}
                            className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-sans font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer disabled:opacity-50"
                          >
                            {faceScanning ? (
                              <div className="flex items-center gap-1.5">
                                <ScanFace className="w-4 h-4 animate-spin text-orange-400" />
                                <span className="font-mono text-[10px] animate-pulse">BIOMETRIC HANDSHAKE ACTIVE...</span>
                              </div>
                            ) : (
                              <>
                                <Fingerprint className="w-4 h-4 text-orange-400" />
                                <span>Demo Aadhaar Fingerprint Scan</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </form>
                  </motion.div>
                )}

                {/* 2. OFFICER SIGN-IN CHANNEL */}
                {selectedRole === UserRole.OFFICER && (
                  <motion.div
                    key="officer-panel"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.18 }}
                  >
                    <form onSubmit={handleOfficerSubmit} className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold font-mono text-gray-500 uppercase tracking-wide">Officer Badge ID</label>
                        <div className="relative">
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                            <UserSquare className="w-4 h-4" />
                          </span>
                          <input
                            type="text"
                            required
                            value={officerBadge}
                            onChange={(e) => setOfficerBadge(e.target.value)}
                            className="w-full pl-10 pr-3.5 py-2.5 text-xs border border-gray-200 rounded-xl focus:border-[#FF6B00] outline-none transition-all font-mono font-semibold uppercase text-gray-800"
                            placeholder="e.g. OB-OFF-882"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center">
                          <label className="text-[10px] font-bold font-mono text-gray-500 uppercase tracking-wide">Verification Passcode PIN</label>
                          <span className="text-[9px] font-mono font-bold text-orange-500 bg-orange-50 px-1.5 py-0.5 rounded border border-orange-100">DEMO PIN: 8825</span>
                        </div>
                        <div className="relative">
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                            <Key className="w-4 h-4" />
                          </span>
                          <input
                            type="password"
                            required
                            maxLength={4}
                            value={officerCode}
                            onChange={(e) => setOfficerCode(e.target.value)}
                            className="w-full pl-10 pr-3.5 py-2.5 text-xs border border-gray-200 rounded-xl focus:border-[#FF6B00] outline-none transition-all font-mono tracking-widest text-gray-800 text-center"
                            placeholder="••••"
                          />
                        </div>
                      </div>

                      <div className="pt-2">
                        <button
                          type="submit"
                          disabled={isLoading}
                          className="w-full py-2.5 bg-slate-900 hover:bg-slate-850 disabled:bg-slate-800 text-white font-sans font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
                        >
                          {isLoading ? (
                            <span>Authorizing...</span>
                          ) : (
                            <>
                              <span>Verify Desk Credentials</span>
                              <Lock className="w-4 h-4 text-orange-400" />
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}

                {/* 3. STATE ADMIN SIGN-IN CHANNEL */}
                {selectedRole === UserRole.ADMIN && (
                  <motion.div
                    key="admin-panel"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.18 }}
                  >
                    <form onSubmit={handleAdminSubmit} className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold font-mono text-gray-500 uppercase tracking-wide">Official Email Address</label>
                        <input
                          type="email"
                          required
                          value={adminEmail}
                          onChange={(e) => setAdminEmail(e.target.value)}
                          className="w-full px-3.5 py-2.5 text-xs border border-gray-200 rounded-xl focus:border-[#FF6B00] outline-none transition-all font-sans text-gray-800"
                          placeholder="name@onebharat.gov.in"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center">
                          <label className="text-[10px] font-bold font-mono text-gray-500 uppercase tracking-wide">Security Handshake Key</label>
                          <span className="text-[9px] font-mono font-bold text-orange-500 bg-orange-50 px-1.5 py-0.5 rounded border border-orange-100">DEMO: click submit</span>
                        </div>
                        <input
                          type="password"
                          required
                          value={adminPassword}
                          onChange={(e) => setAdminPassword(e.target.value)}
                          className="w-full px-3.5 py-2.5 text-xs border border-gray-200 rounded-xl focus:border-[#FF6B00] outline-none transition-all text-gray-800"
                          placeholder="Enter token key"
                        />
                      </div>

                      <div className="pt-2">
                        <button
                          type="submit"
                          disabled={isLoading}
                          className="w-full py-2.5 bg-[#FF6B00] hover:bg-orange-600 disabled:bg-orange-400 text-white font-sans font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md shadow-orange-600/10 cursor-pointer"
                        >
                          {isLoading ? (
                            <span>Syncing Database...</span>
                          ) : (
                            <>
                              <span>Verify Nodal Clearances</span>
                              <Check className="w-4 h-4" />
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Quick Demo Access Note */}
          <div className="mt-8 border-t border-gray-100 pt-4 text-center">
            <p className="text-[10px] text-gray-400 font-medium">
              Demo sandbox mode active. Click any tab above to try respective dashboards.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
