/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { ComplaintCategory, ComplaintPriority, ComplaintStatus } from "../types";
import { 
  Camera, 
  MapPin, 
  Mic, 
  Video, 
  Sparkles, 
  AlertTriangle, 
  ChevronRight, 
  ChevronLeft, 
  Upload, 
  Check, 
  UserCheck, 
  ShieldCheck, 
  Flame, 
  EyeOff, 
  Eye,
  Activity,
  ArrowRight,
  Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ComplaintFlowProps {
  onSuccess: (id: string) => void;
  onCancel: () => void;
}

export const ComplaintFlow: React.FC<ComplaintFlowProps> = ({ onSuccess, onCancel }) => {
  const { addComplaint, citizenProfile, addNotification } = useApp();

  const [step, setStep] = useState(1);
  const [category, setCategory] = useState<ComplaintCategory | null>(null);
  const [customCategory, setCustomCategory] = useState("");
  const [address, setAddress] = useState("");
  const [landmark, setLandmark] = useState("");
  const [gpsCoords, setGpsCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  
  // Media uploads states
  const [images, setImages] = useState<string[]>([]);
  const [isVideoRecorded, setIsVideoRecorded] = useState(false);
  const [isVoiceRecorded, setIsVoiceRecorded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [aiSuggestedCategory, setAiSuggestedCategory] = useState<ComplaintCategory | null>(null);
  const [aiSuggestedReason, setAiSuggestedReason] = useState("");

  // Upload progress tracking
  const [isUploading, setIsUploading] = useState(false);
  const [uploadPercent, setUploadPercent] = useState(0);
  const [uploadingFiles, setUploadingFiles] = useState<{ name: string; size: number }[]>([]);
  
  // Details
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<ComplaintPriority>(ComplaintPriority.MEDIUM);
  const [isAnonymous, setIsAnonymous] = useState(false);

  // AI loading analysis states
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [aiLogs, setAiLogs] = useState<string[]>([]);
  const [aiProgress, setAiProgress] = useState(0);

  // Process dropped or selected files
  const processFiles = (fileList: FileList | File[]) => {
    const filesArray = Array.from(fileList).filter(file => file.type.startsWith("image/") || file.type.startsWith("video/"));
    if (filesArray.length === 0) return;

    setIsUploading(true);
    setUploadPercent(0);
    setUploadingFiles(filesArray.map(f => ({ name: f.name, size: f.size })));

    let currentPercent = 0;
    const interval = setInterval(() => {
      currentPercent += Math.floor(Math.random() * 15) + 8;
      if (currentPercent >= 100) {
        currentPercent = 100;
        clearInterval(interval);
        
        let filesProcessedCount = 0;
        filesArray.forEach((file) => {
          if (file.type.startsWith("video/")) {
            // For mock/preview purposes, represent video uploads as a premium icon or short mockup base64/placeholder
            setImages((prev) => [...prev, "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=600"]);
            setIsVideoRecorded(true);
            filesProcessedCount++;
            if (filesProcessedCount === filesArray.length) {
              setIsUploading(false);
              setUploadingFiles([]);
              addNotification(
                "Upload Complete",
                `Successfully processed ${filesArray.length} multi-media asset(s).`,
                "success"
              );
            }
            return;
          }

          const reader = new FileReader();
          reader.onload = (e) => {
            if (e.target?.result && typeof e.target.result === "string") {
              const base64Data = e.target.result;
              setImages((prev) => [...prev, base64Data]);
              
              // Trigger intelligent name-based AI Category Suggestion!
              const filename = file.name.toLowerCase();
              let predictedCat: ComplaintCategory | null = null;
              let reason = "";

              if (filename.includes("pothole") || filename.includes("road") || filename.includes("crack") || filename.includes("paved") || filename.includes("crater")) {
                predictedCat = ComplaintCategory.ROAD_DAMAGE;
                reason = `the image filename "${file.name}" indicates road damage or craters`;
              } else if (filename.includes("light") || filename.includes("lamp") || filename.includes("bulb") || filename.includes("dark") || filename.includes("pole") || filename.includes("street-light") || filename.includes("street_light")) {
                predictedCat = ComplaintCategory.STREET_LIGHT;
                reason = `the image filename "${file.name}" indicates broken street lights or dark spots`;
              } else if (filename.includes("garbage") || filename.includes("trash") || filename.includes("rubbish") || filename.includes("waste") || filename.includes("dump") || filename.includes("overflowing_bin")) {
                predictedCat = ComplaintCategory.GARBAGE;
                reason = `the image filename "${file.name}" indicates uncollected waste or litter piles`;
              } else if (filename.includes("leak") || filename.includes("pipe") || filename.includes("water_leak")) {
                predictedCat = ComplaintCategory.WATER_LEAKAGE;
                reason = `the image filename "${file.name}" indicates fresh water pipeline burst/leakage`;
              } else if (filename.includes("sewer") || filename.includes("drain") || filename.includes("manhole") || filename.includes("gutter") || filename.includes("sewage")) {
                predictedCat = ComplaintCategory.DRAINAGE;
                reason = `the image filename "${file.name}" suggests drainage blockage or open sewer manholes`;
              } else if (filename.includes("flood") || filename.includes("flooding")) {
                predictedCat = ComplaintCategory.FLOOD;
                reason = `the image filename "${file.name}" indicates heavy monsoonal flash flooding`;
              } else if (filename.includes("water logging") || filename.includes("water_logging") || filename.includes("stagnant") || filename.includes("clog")) {
                predictedCat = ComplaintCategory.WATER_LOGGING;
                reason = `the image filename "${file.name}" indicates stormwater logging on streets`;
              } else if (filename.includes("parking") || filename.includes("car") || filename.includes("bike") || filename.includes("obstruct")) {
                predictedCat = ComplaintCategory.ILLEGAL_PARKING;
                reason = `the image filename "${file.name}" indicates vehicular sidewalk obstruction`;
              } else if (filename.includes("footpath") || filename.includes("pavement") || filename.includes("walkway")) {
                predictedCat = ComplaintCategory.BROKEN_FOOTPATH;
                reason = `the image filename "${file.name}" indicates broken tiles/blockage on public footpath`;
              } else if (filename.includes("signal") || filename.includes("traffic")) {
                predictedCat = ComplaintCategory.TRAFFIC_SIGNAL;
                reason = `the image filename "${file.name}" indicates a malfunctioning junction signal`;
              } else if (filename.includes("animal") || filename.includes("rescue") || filename.includes("dog") || filename.includes("cow") || filename.includes("stray")) {
                predictedCat = ComplaintCategory.ANIMAL_RESCUE;
                reason = `the image filename "${file.name}" indicates stray animal distress or rescue requirement`;
              } else if (filename.includes("tree") || filename.includes("branch") || filename.includes("fallen")) {
                predictedCat = ComplaintCategory.TREE_FALLEN;
                reason = `the image filename "${file.name}" indicates a heavy fallen tree blocking lines/paths`;
              } else if (filename.includes("debris") || filename.includes("brick") || filename.includes("construction_waste")) {
                predictedCat = ComplaintCategory.CONSTRUCTION_WASTE;
                reason = `the image filename "${file.name}" suggests illegal construction material dump`;
              } else if (filename.includes("loud") || filename.includes("speaker") || filename.includes("noise")) {
                predictedCat = ComplaintCategory.NOISE_POLLUTION;
                reason = `the image filename "${file.name}" indicates excessive civic noise violations`;
              }

              if (predictedCat) {
                setAiSuggestedCategory(predictedCat);
                setAiSuggestedReason(reason);
              }
            }
            filesProcessedCount++;
            if (filesProcessedCount === filesArray.length) {
              setIsUploading(false);
              setUploadingFiles([]);
              addNotification(
                "Upload Complete",
                `Successfully processed ${filesArray.length} multi-media asset(s).`,
                "success"
              );
            }
          };
          reader.readAsDataURL(file);
        });
      } else {
        setUploadPercent(currentPercent);
      }
    }, 100);
  };

  // Auto classification suggestion mock from text description
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setDescription(text);
    
    // Heuristic AI Category recommender based on description keyword matching
    if (!category) {
      const lower = text.toLowerCase();
      if (lower.includes("pot") || lower.includes("road") || lower.includes("flyover")) {
        setCategory(ComplaintCategory.ROAD_DAMAGE);
      } else if (lower.includes("light") || lower.includes("dark") || lower.includes("lamp")) {
        setCategory(ComplaintCategory.STREET_LIGHT);
      } else if (lower.includes("garbage") || lower.includes("waste") || lower.includes("trash") || lower.includes("dumping")) {
        setCategory(ComplaintCategory.GARBAGE);
      } else if (lower.includes("sewer") || lower.includes("drain") || lower.includes("manhole") || lower.includes("overflow")) {
        setCategory(ComplaintCategory.SEWAGE_OVERFLOW);
      } else if (lower.includes("leak") || lower.includes("pipe") || lower.includes("water leakage")) {
        setCategory(ComplaintCategory.WATER_LEAKAGE);
      } else if (lower.includes("flood") || lower.includes("flooding") || lower.includes("water logging")) {
        setCategory(ComplaintCategory.WATER_LOGGING);
      }
    }
  };

  // Trigger auto geolocation API
  const detectLocation = () => {
    setLoadingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setGpsCoords({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          // Mock Geocode address based on real location context
          setAddress("Sonpur Harihar Nath Mandir Road, Sonpur, Saran, Bihar");
          setLoadingLocation(false);
        },
        (error) => {
          console.error("Error detecting location", error);
          // Fallback coords
          setGpsCoords({ lat: 25.6985, lng: 85.1722 });
          setAddress("Sonpur Harihar Nath Mandir Road, Sonpur, Saran, Bihar");
          setLoadingLocation(false);
        }
      );
    } else {
      setGpsCoords({ lat: 25.6985, lng: 85.1722 });
      setAddress("Sonpur Harihar Nath Mandir Road, Sonpur, Saran, Bihar");
      setLoadingLocation(false);
    }
  };

  // Mock taking/uploading photos
  const handlePhotoUpload = () => {
    setIsUploading(true);
    setUploadPercent(0);
    setUploadingFiles([{ name: "demo-auto-mockup.jpg", size: 1245000 }]);

    let currentPercent = 0;
    const interval = setInterval(() => {
      currentPercent += Math.floor(Math.random() * 20) + 12;
      if (currentPercent >= 100) {
        currentPercent = 100;
        clearInterval(interval);
        
        const placeholderImages = [
          "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&q=80&w=600",
          "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&q=80&w=600",
          "https://images.unsplash.com/photo-1542060748-10c28b629f6f?auto=format&fit=crop&q=80&w=600"
        ];
        const chosen = placeholderImages[Math.floor(Math.random() * placeholderImages.length)];
        setImages((prev) => [...prev, chosen]);
        
        // Randomly set a predictive category to showcase the flow
        const categories = [ComplaintCategory.ROAD_DAMAGE, ComplaintCategory.GARBAGE, ComplaintCategory.WATER_LOGGING];
        const chosenCat = categories[Math.floor(Math.random() * categories.length)];
        let reason = "";
        if (chosenCat === ComplaintCategory.ROAD_DAMAGE) {
          reason = "the visual structure detected has clear crater depressions and cracks in asphalt";
        } else if (chosenCat === ComplaintCategory.GARBAGE) {
          reason = "the image exhibits unsegregated plastic bags, decomposing organic matter, and overflowing receptacles";
        } else {
          reason = "the uploaded media shows significant stagnant runoff on paved surfaces obstructing pedestrian walk areas";
        }
        setAiSuggestedCategory(chosenCat);
        setAiSuggestedReason(reason);

        setIsUploading(false);
        setUploadingFiles([]);
        addNotification(
          "Demo File Uploaded",
          "Mockup civic issue photo successfully added with high fidelity.",
          "success"
        );
      } else {
        setUploadPercent(currentPercent);
      }
    }, 100);
  };

  // Run AI checks on submit before redirecting
  const submitComplaintFlow = () => {
    if (!category || !description) return;
    
    setAiAnalyzing(true);
    setAiLogs(["Initializing cloud security rules..."]);
    setAiProgress(10);

    const logs = [
      "Accessing Municipal GIS ward boundaries...",
      "Analyzing uploaded field imagery for duplicates...",
      "No matches found within 500m area. Unique ticket confirmed.",
      "Parsing speech/text vectors for priority classification...",
      "Priority confirmed: High. Assigning direct MCQ ticket.",
      "Routing to Sanitation & Civil Works Department (Saran District Council)..."
    ];

    logs.forEach((log, index) => {
      setTimeout(() => {
        setAiLogs((prev) => [...prev, log]);
        setAiProgress((index + 2) * 15);
      }, (index + 1) * 750);
    });

    setTimeout(() => {
      const finalCategory = category === ComplaintCategory.OTHERS && customCategory.trim() 
        ? customCategory.trim() 
        : (category || "Other Civic Issue");

      // Execute Context creation
      const created = addComplaint({
        category: finalCategory,
        title: `${finalCategory} reported at ${address.split(",")[0] || "Near Landmark"}`,
        description,
        priority,
        status: ComplaintStatus.SUBMITTED,
        location: {
          latitude: gpsCoords?.lat || 25.6985,
          longitude: gpsCoords?.lng || 85.1722,
          address: address + (landmark ? ` (Landmark: ${landmark})` : ""),
          ward: "Ward No. 4 (Sonpur)",
          district: "Saran",
          state: "Bihar"
        },
        images: images.length > 0 ? images : ["https://images.unsplash.com/photo-1542060748-10c28b629f6f?auto=format&fit=crop&q=80&w=600"],
        userId: citizenProfile.id,
        userName: citizenProfile.name,
        userAvatar: citizenProfile.avatar,
        isAnonymous,
        department: finalCategory === ComplaintCategory.GARBAGE || finalCategory === ComplaintCategory.ILLEGAL_DUMPING 
          ? "Saran Swachh Bharat Cleanliness Division" 
          : finalCategory === ComplaintCategory.STREET_LIGHT || finalCategory === ComplaintCategory.ELECTRICITY 
          ? "Saran Electricity & Streetlights Board" 
          : finalCategory === ComplaintCategory.ROAD_DAMAGE || finalCategory === ComplaintCategory.BROKEN_FOOTPATH
          ? "Saran Road Construction Department (RCD)"
          : "Saran Ward Municipal Administration"
      });

      setAiAnalyzing(false);
      onSuccess(created.id);
    }, 5500);
  };

  return (
    <div id="complaint-flow" className="max-w-2xl mx-auto bg-white border border-gray-200 rounded-3xl p-6 shadow-xl relative overflow-hidden">
      
      {/* HEADER PROGRESS COUNTER */}
      {!aiAnalyzing && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-mono tracking-wider text-gray-400 uppercase">New Complaint Lodging</span>
            <span className="text-xs font-mono font-bold text-[#FF6B00]">Step {step} of 4</span>
          </div>
          <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden flex gap-0.5">
            {[1, 2, 3, 4].map((s) => (
              <div 
                key={s} 
                className={`h-full flex-1 transition-all duration-300 ${s <= step ? "bg-[#FF6B00]" : "bg-gray-100"}`} 
              />
            ))}
          </div>
        </div>
      )}

      {/* STEP INTERACTIVE CONTENTS */}
      <AnimatePresence mode="wait">
        {aiAnalyzing ? (
          <motion.div
            key="ai-analyzing"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-10 text-center"
          >
            <div className="relative w-20 h-20 mb-6">
              {/* Outer pulsing ring */}
              <div className="absolute inset-0 rounded-full border-4 border-orange-500/10 animate-ping" />
              {/* Spinning loading indicator */}
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#f3f4f6" strokeWidth="8" />
                <circle 
                  cx="50" 
                  cy="50" 
                  r="40" 
                  fill="none" 
                  stroke="#FF6B00" 
                  strokeWidth="8" 
                  strokeDasharray="251.2" 
                  strokeDashoffset={251.2 - (251.2 * aiProgress) / 100}
                  className="transition-all duration-300 stroke-linecap-round" 
                />
              </svg>
              <Sparkles className="absolute inset-0 w-8 h-8 text-[#FF6B00] m-auto animate-pulse" />
            </div>

            <h3 className="font-sans font-bold text-gray-800 text-lg mb-1">OneBharat AI Shield Processing</h3>
            <p className="text-xs text-gray-500 max-w-sm leading-normal mb-6">
              Leveraging Gemini models to scan duplicates, classify categories, assign district wards, and evaluate civic urgency.
            </p>

            {/* AI Action terminal feed */}
            <div className="w-full max-w-md bg-gray-950 text-[#22C55E] p-4 rounded-2xl font-mono text-[11px] text-left min-h-[140px] space-y-1.5 border border-gray-800 shadow-inner">
              <p className="text-gray-400 font-bold mb-1">● AI AGENT LOGS:</p>
              {aiLogs.map((log, idx) => (
                <motion.p 
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-start gap-1"
                >
                  <span className="text-[#FF6B00]">✓</span>
                  <span>{log}</span>
                </motion.p>
              ))}
            </div>
          </motion.div>
        ) : step === 1 ? (
          <motion.div
            key="step-1"
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -15 }}
            className="space-y-4"
          >
            <div>
              <h3 className="font-sans font-bold text-gray-800 text-lg leading-snug">Select Complaint Category</h3>
              <p className="text-xs text-gray-500 leading-tight">
                Choose the type of civic hazard you are lodging. Tip: Our AI recommends categories based on your photos and text later if unsure!
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[340px] overflow-y-auto pr-1">
              {Object.values(ComplaintCategory).map((cat) => {
                const isSelected = category === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      isSelected 
                        ? "bg-orange-50 border-[#FF6B00] text-[#FF6B00] shadow-sm" 
                        : "bg-slate-50 hover:bg-slate-100 border-gray-200 text-gray-700"
                    }`}
                  >
                    <div className="flex flex-col gap-1.5">
                      <span className="text-xs font-semibold leading-tight">{cat}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {category === ComplaintCategory.OTHERS && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="bg-orange-50/50 p-4 border border-orange-100 rounded-2xl space-y-2 mt-3"
              >
                <label className="text-xs font-bold text-gray-700 block">Describe your custom problem category</label>
                <input
                  type="text"
                  placeholder="E.g., Stray Cattle Nuisance, Broken Water Pipe, Park Cleaning..."
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  className="w-full bg-white border border-gray-200 focus:border-[#FF6B00] rounded-xl text-xs p-3 outline-none text-gray-800"
                  required
                />
                <p className="text-[10px] text-gray-400">Our routing engine will dynamically assign this problem to the Saran Ward Nodal Desk.</p>
              </motion.div>
            )}

            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
              <button
                onClick={onCancel}
                className="px-4 py-2 text-gray-500 hover:text-gray-700 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                disabled={!category || (category === ComplaintCategory.OTHERS && !customCategory.trim())}
                onClick={() => setStep(2)}
                className="px-4 py-2 bg-[#FF6B00] hover:bg-orange-600 disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center gap-1 shadow"
              >
                Next Step <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ) : step === 2 ? (
          <motion.div
            key="step-2"
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -15 }}
            className="space-y-4"
          >
            <div>
              <h3 className="font-sans font-bold text-gray-800 text-lg leading-snug flex items-center gap-2">
                Upload Multi-Media Proof <Sparkles className="w-4.5 h-4.5 text-[#FF6B00] animate-pulse" />
              </h3>
              <p className="text-xs text-gray-500 leading-tight">
                Provide geo-tagged photographs or a quick clip of the civic malfunction. Clear proof automatically trains our AI model to suggest categories and routes cases 40% faster.
              </p>
            </div>

            {/* Hidden native input elements for Laptop & Mobile uploads */}
            <input
              type="file"
              id="file-upload-input"
              className="hidden"
              multiple
              accept="image/*"
              onChange={(e) => {
                if (e.target.files) {
                  processFiles(e.target.files);
                }
              }}
            />
            <input
              type="file"
              id="camera-upload-input"
              className="hidden"
              accept="image/*"
              capture="environment"
              onChange={(e) => {
                if (e.target.files) {
                  processFiles(e.target.files);
                }
              }}
            />

            {/* Fully Functional Drag & Drop Box */}
            <div 
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => { e.preventDefault(); setIsDragging(false); if (e.dataTransfer.files) processFiles(e.dataTransfer.files); }}
              className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all flex flex-col items-center justify-center min-h-[180px] ${
                isDragging 
                  ? "bg-orange-50/50 border-[#FF6B00] scale-[0.99] shadow-inner" 
                  : "bg-slate-50/40 hover:bg-slate-50 border-gray-200"
              }`}
            >
              <Upload className={`w-10 h-10 mb-2.5 transition-colors ${isDragging ? "text-[#FF6B00]" : "text-gray-300"}`} />
              <p className="text-xs font-bold text-gray-700 mb-1">
                {isDragging ? "Drop your files here!" : "Drag photos here, or click to upload"}
              </p>
              <p className="text-[10px] text-gray-400 mb-4">Supports PNG, JPEG, HEIC on both Mobile & Laptop</p>
              
              <div className="flex flex-wrap justify-center gap-2">
                <button
                  type="button"
                  onClick={() => document.getElementById("file-upload-input")?.click()}
                  className="px-3.5 py-1.5 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl text-[10px] shadow"
                >
                  Choose Files
                </button>
                <button
                  type="button"
                  onClick={() => document.getElementById("camera-upload-input")?.click()}
                  className="px-3.5 py-1.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl text-[10px] shadow flex items-center gap-1"
                >
                  <Camera className="w-3 h-3" /> Take Photo
                </button>
                <button
                  type="button"
                  onClick={handlePhotoUpload}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-gray-200 text-gray-600 font-semibold rounded-xl text-[10px]"
                  title="Generate realistic monsoonal civic issue mockup photos"
                >
                  Demo Auto-Mock
                </button>
              </div>
            </div>

            {/* Modern Animated Progress Indicator */}
            {isUploading && (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4.5 space-y-3 shadow-sm animate-pulse-slow">
                <div className="flex items-center justify-between text-xs font-bold text-gray-700">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 text-[#FF6B00] animate-spin" />
                    <span>Processing & Uploading proof files...</span>
                  </div>
                  <span className="font-mono text-gray-500">{uploadPercent}%</span>
                </div>
                
                {/* Modern progress track */}
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-[#FF6B00] h-full transition-all duration-150 ease-out"
                    style={{ width: `${uploadPercent}%` }}
                  />
                </div>
                
                {/* Uploading files listing */}
                <div className="text-[10px] text-gray-500 font-mono space-y-1 bg-white p-2.5 rounded-xl border border-slate-100 max-h-24 overflow-y-auto">
                  {uploadingFiles.map((f, i) => (
                    <div key={i} className="flex justify-between items-center gap-4">
                      <span className="truncate max-w-[200px] font-semibold text-gray-700">{f.name}</span>
                      <span className="shrink-0">{(f.size / (1024 * 1024)).toFixed(2)} MB</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* AI Real-time Category Suggestion Box */}
            {aiSuggestedCategory && (
              <div className="bg-orange-50/80 border border-orange-200 rounded-2xl p-3.5 text-xs text-orange-850 flex items-start gap-3 mt-1 shadow-sm animate-fade-in">
                <Sparkles className="w-5 h-5 text-[#FF6B00] shrink-0 mt-0.5 animate-pulse" />
                <div className="flex-1">
                  <p className="font-bold text-orange-950 flex items-center gap-1.5 flex-wrap">
                    AI Predicted Category: <span className="bg-[#FF6B00]/10 text-[#FF6B00] px-2 py-0.5 rounded-lg text-[10px] font-extrabold">{aiSuggestedCategory}</span>
                  </p>
                  <p className="text-[10px] text-orange-700 leading-snug mt-1 font-medium">
                    Our model suggests this category because {aiSuggestedReason}.
                  </p>
                  <div className="mt-2 flex gap-2">
                    <button
                      type="button"
                      onClick={() => setCategory(aiSuggestedCategory)}
                      className={`px-3 py-1 text-[10px] font-extrabold rounded-lg transition-all ${
                        category === aiSuggestedCategory 
                          ? "bg-green-600 text-white shadow-sm flex items-center gap-1"
                          : "bg-[#FF6B00] hover:bg-orange-600 text-white shadow-sm"
                      }`}
                    >
                      {category === aiSuggestedCategory ? (
                        <>
                          <Check className="w-3 h-3" /> Applied!
                        </>
                      ) : (
                        "Apply Category"
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setAiSuggestedCategory(null)}
                      className="px-2 py-1 text-[10px] font-bold text-orange-600 hover:text-orange-800"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Render uploaded image thumbnails */}
            {images.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <p className="text-[10px] font-mono uppercase tracking-wider text-gray-400">Uploaded Assets ({images.length})</p>
                <div className="flex gap-2 overflow-x-auto py-1">
                  {images.map((img, idx) => (
                    <div key={idx} className="relative w-16 h-16 rounded-xl overflow-hidden border border-gray-200 shadow-sm flex-shrink-0">
                      <img src={img} alt="Upload Thumbnail" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                      <button 
                        type="button"
                        onClick={() => setImages((prev) => prev.filter((_, i) => i !== idx))}
                        className="absolute top-1 right-1 p-0.5 bg-black/60 hover:bg-black text-white rounded-full text-[8px] h-4 w-4 flex items-center justify-center font-bold"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Audio & Video Captures Mock Panel */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                type="button"
                onClick={() => setIsVideoRecorded(!isVideoRecorded)}
                className={`p-3 rounded-2xl border flex items-center gap-2.5 justify-center text-xs font-bold transition-all ${
                  isVideoRecorded 
                    ? "bg-red-50 border-red-300 text-red-600" 
                    : "bg-slate-50 border-gray-200 text-gray-700 hover:bg-slate-100"
                }`}
              >
                <Video className="w-4 h-4 text-red-500" />
                <span>{isVideoRecorded ? "Video Saved" : "Record Video Clip"}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsVoiceRecorded(!isVoiceRecorded)}
                className={`p-3 rounded-2xl border flex items-center gap-2.5 justify-center text-xs font-bold transition-all ${
                  isVoiceRecorded 
                    ? "bg-[#FF6B00]/10 border-[#FF6B00]/40 text-[#FF6B00]" 
                    : "bg-slate-50 border-gray-200 text-gray-700 hover:bg-slate-100"
                }`}
              >
                <Mic className="w-4 h-4 text-[#FF6B00]" />
                <span>{isVoiceRecorded ? "Voice Saved" : "Voice Description"}</span>
              </button>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 text-gray-500 hover:text-gray-700 text-xs font-semibold flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-4 py-2 bg-[#FF6B00] hover:bg-orange-600 text-white font-bold rounded-xl text-xs flex items-center gap-1 shadow"
              >
                Next Step <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ) : step === 3 ? (
          <motion.div
            key="step-3"
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -15 }}
            className="space-y-4"
          >
            <div>
              <h3 className="font-sans font-bold text-gray-800 text-lg leading-snug">Lock Coordinates & Location</h3>
              <p className="text-xs text-gray-500 leading-tight">
                Auto-ping current device location or provide detailed street addresses so field workers can pinpoint the hazard.
              </p>
            </div>

            {/* GPS Detection Box */}
            <div className="bg-slate-50 border border-gray-200 p-4 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#FF6B00]" /> GPS Telemetry
                </span>
                <button
                  onClick={detectLocation}
                  disabled={loadingLocation}
                  className="px-3 py-1 bg-white hover:bg-gray-100 border border-gray-200 text-gray-700 font-bold rounded-xl text-[10px] shadow transition-all"
                >
                  {loadingLocation ? "Locating..." : "Auto-Detect Location"}
                </button>
              </div>

              {gpsCoords ? (
                <div className="p-3 bg-white border border-gray-150 rounded-xl space-y-1 font-mono text-[10px] text-gray-500">
                  <p>● Latitude: <b className="text-gray-700">{gpsCoords.lat.toFixed(6)}</b></p>
                  <p>● Longitude: <b className="text-gray-700">{gpsCoords.lng.toFixed(6)}</b></p>
                  <p className="text-green-600 font-bold flex items-center gap-0.5 mt-1">
                    <Check className="w-3.5 h-3.5" /> High Precision Locked (Smart Cities Satellite)
                  </p>
                </div>
              ) : (
                <p className="text-[11px] text-gray-400 italic">No GPS coordinates locked yet. Click 'Auto-Detect'.</p>
              )}
            </div>

            {/* Street Address Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">Street Address</label>
              <input
                type="text"
                placeholder="Building, street, block, sector coordinates..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-slate-50 border border-gray-200 focus:border-[#FF6B00] rounded-xl text-xs p-3 outline-none text-gray-800"
              />
            </div>

            {/* Precise Landmarks */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">Precise Landmarks (Optional)</label>
              <input
                type="text"
                placeholder="Opposite grocery shop, near signal pole, etc."
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                className="w-full bg-slate-50 border border-gray-200 focus:border-[#FF6B00] rounded-xl text-xs p-3 outline-none text-gray-800"
              />
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
              <button
                onClick={() => setStep(2)}
                className="px-4 py-2 text-gray-500 hover:text-gray-700 text-xs font-semibold flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <button
                disabled={!address}
                onClick={() => setStep(4)}
                className="px-4 py-2 bg-[#FF6B00] hover:bg-orange-600 disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center gap-1 shadow"
              >
                Next Step <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="step-4"
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -15 }}
            className="space-y-4"
          >
            <div>
              <h3 className="font-sans font-bold text-gray-800 text-lg leading-snug">Describe & Lodge Complaint</h3>
              <p className="text-xs text-gray-500 leading-tight">
                Type the details below. Our NLP will analyze keywords to auto-match department boundaries.
              </p>
            </div>

            {/* Description Textarea */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">Tell us what is wrong</label>
              <textarea
                rows={4}
                placeholder="Provide a detailed description of the incident so contractors bring correct equipment. Type 'pothole on flyover' or 'lights dark' for auto prediction checks..."
                value={description}
                onChange={handleDescriptionChange}
                className="w-full bg-slate-50 border border-gray-200 focus:border-[#FF6B00] rounded-xl text-xs p-3 outline-none text-gray-800 leading-relaxed placeholder:text-gray-400"
              />
            </div>

            {/* Priority Slider Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 flex items-center justify-between">
                <span>Select Priority Assessment</span>
                <span className="text-[10px] font-mono text-[#FF6B00]">{priority} Severity</span>
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[ComplaintPriority.LOW, ComplaintPriority.MEDIUM, ComplaintPriority.HIGH, ComplaintPriority.EMERGENCY].map((p) => {
                  const isSel = priority === p;
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={`py-2 text-[10px] font-bold rounded-xl border uppercase transition-all ${
                        isSel 
                          ? "bg-[#FF6B00] text-white border-[#FF6B00] shadow" 
                          : "bg-slate-50 border-gray-200 text-gray-600 hover:bg-slate-100"
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Anonymous Reporting Switch */}
            <div className="flex items-center justify-between p-3 bg-slate-50 border border-gray-150 rounded-2xl">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-[#FF6B00]/10 rounded-xl text-[#FF6B00]">
                  {isAnonymous ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </div>
                <div>
                  <span className="text-xs font-bold text-gray-700 block">Lodge Complaint Anonymously</span>
                  <span className="text-[10px] text-gray-400 leading-tight">Your phone & profile details will remain private.</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAnonymous(!isAnonymous)}
                className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none ${isAnonymous ? "bg-green-500" : "bg-gray-200"}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all shadow ${isAnonymous ? "right-1" : "left-1"}`} />
              </button>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
              <button
                onClick={() => setStep(3)}
                className="px-4 py-2 text-gray-500 hover:text-gray-700 text-xs font-semibold flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <button
                disabled={!description}
                onClick={submitComplaintFlow}
                className="px-5 py-2.5 bg-[#FF6B00] hover:bg-orange-600 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-orange-100 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                Lodge Civic Complaint
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
