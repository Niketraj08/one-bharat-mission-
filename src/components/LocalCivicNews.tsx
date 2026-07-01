import React, { useState, useEffect } from "react";
import { 
  Search, 
  Newspaper, 
  ExternalLink, 
  Sparkles, 
  RefreshCw, 
  Calendar, 
  MapPin, 
  CheckCircle, 
  AlertTriangle,
  Info
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface GroundingChunk {
  web?: {
    title: string;
    uri: string;
  };
}

interface NewsResult {
  text: string;
  chunks: GroundingChunk[];
  isDemo?: boolean;
}

export const LocalCivicNews: React.FC = () => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<NewsResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<string>("general");

  const presets = [
    {
      id: "general",
      label: "📢 General Announcements",
      query: "latest municipal announcements and civic development Sonepur Saran Bihar"
    },
    {
      id: "infrastructure",
      label: "🚧 Roads & Infra Updates",
      query: "Sonepur Saran Bihar road repairs development water drainage construction news"
    },
    {
      id: "disaster",
      label: "💧 River Levels & Monsoon Safety",
      query: "Gandak Ganga river water levels Sonepur flood safety reports Saran Bihar"
    },
    {
      id: "sanitation",
      label: "🧹 Sanitation & Waste Management",
      query: "Sonepur Saran solid waste management public health sanitation drive"
    }
  ];

  const fetchNews = async (searchQuery: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/civic-news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery }),
      });

      if (!response.ok) {
        throw new Error("Failed to retrieve grounded search results from server.");
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred while fetching civic news.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch general announcements on first load
    const defaultPreset = presets.find(p => p.id === "general");
    if (defaultPreset) {
      fetchNews(defaultPreset.query);
    }
  }, []);

  const handlePresetClick = (presetId: string, searchQuery: string) => {
    setSelectedPreset(presetId);
    setQuery("");
    fetchNews(searchQuery);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setSelectedPreset("");
    fetchNews(query);
  };

  // Simple Markdown to HTML parser supporting bold, list items, and line breaks
  const renderMarkdown = (text: string) => {
    const lines = text.split("\n");
    return lines.map((line, index) => {
      let trimmed = line.trim();
      
      // Check headers
      if (trimmed.startsWith("###")) {
        return (
          <h4 key={index} className="text-sm font-bold text-gray-800 mt-4 mb-2 flex items-center gap-1.5 font-sans tracking-tight">
            {trimmed.replace("###", "").trim()}
          </h4>
        );
      }
      if (trimmed.startsWith("##")) {
        return (
          <h3 key={index} className="text-base font-black text-[#FF6B00] mt-5 mb-2 font-sans tracking-tight uppercase border-b border-orange-100 pb-1">
            {trimmed.replace("##", "").trim()}
          </h3>
        );
      }
      if (trimmed.startsWith("#")) {
        return (
          <h2 key={index} className="text-lg font-black text-slate-900 mt-6 mb-3 font-sans tracking-tight border-l-4 border-[#FF6B00] pl-2">
            {trimmed.replace("#", "").trim()}
          </h2>
        );
      }

      // Check list items
      const isListItem = trimmed.startsWith("-") || trimmed.startsWith("*");
      const isNumberedItem = /^\d+\./.test(trimmed);

      if (isListItem) {
        const itemText = trimmed.substring(1).trim();
        return (
          <li key={index} className="ml-5 list-disc text-xs text-gray-650 leading-relaxed py-0.5">
            {parseInlineStyle(itemText)}
          </li>
        );
      }

      if (isNumberedItem) {
        const itemText = trimmed.replace(/^\d+\./, "").trim();
        const numberMatch = trimmed.match(/^\d+\./);
        const number = numberMatch ? numberMatch[0] : "";
        return (
          <div key={index} className="flex gap-2 text-xs text-gray-650 leading-relaxed py-1 items-start">
            <span className="font-mono font-bold text-[#FF6B00] bg-orange-50 px-1.5 py-0.5 rounded text-[10px] min-w-[20px] text-center">
              {number.replace(".", "")}
            </span>
            <div className="flex-1 pt-0.5">{parseInlineStyle(itemText)}</div>
          </div>
        );
      }

      if (trimmed === "") {
        return <div key={index} className="h-2" />;
      }

      return (
        <p key={index} className="text-xs text-gray-650 leading-relaxed mb-1.5">
          {parseInlineStyle(trimmed)}
        </p>
      );
    });
  };

  // Helper to parse bold markdown **text** inside lines
  const parseInlineStyle = (text: string) => {
    const parts = text.split(/\*\*([\s\S]*?)\*\*/g);
    if (parts.length === 1) return text;
    
    return parts.map((part, i) => {
      if (i % 2 === 1) {
        return <strong key={i} className="font-bold text-gray-900">{part}</strong>;
      }
      
      // Also look for italics *text*
      const italicParts = part.split(/\*([\s\S]*?)\*/g);
      if (italicParts.length > 1) {
        return italicParts.map((subPart, subIdx) => {
          if (subIdx % 2 === 1) {
            return <em key={subIdx} className="italic text-gray-800">{subPart}</em>;
          }
          return subPart;
        });
      }
      
      return part;
    });
  };

  const getSourceCitations = () => {
    if (!result || !result.chunks || result.chunks.length === 0) return [];
    
    // Filter out unique web references
    const uniqueCitations: { title: string; uri: string }[] = [];
    const seenUris = new Set<string>();

    result.chunks.forEach(chunk => {
      if (chunk.web && chunk.web.uri && !seenUris.has(chunk.web.uri)) {
        seenUris.add(chunk.web.uri);
        uniqueCitations.push({
          title: chunk.web.title || "External Source Information",
          uri: chunk.web.uri
        });
      }
    });

    return uniqueCitations;
  };

  const citations = getSourceCitations();

  return (
    <div id="local-civic-news-panel" className="bg-slate-50 rounded-2xl border border-gray-200 p-5 space-y-6">
      {/* HEADER HERO */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 rounded-xl p-5 text-white relative overflow-hidden shadow-md">
        <div className="absolute right-0 top-0 w-32 h-32 bg-white/5 rounded-full blur-xl pointer-events-none" />
        <div className="absolute -left-10 -bottom-10 w-44 h-44 bg-[#FF6B00]/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] bg-[#FF6B00] text-white font-mono font-black uppercase px-2 py-0.5 rounded-full tracking-wider animate-pulse flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" /> Grounded Search
              </span>
              <span className="text-[10px] bg-white/10 text-blue-200 font-mono font-bold px-2 py-0.5 rounded-full uppercase">
                Saran District Network
              </span>
            </div>
            <h2 className="font-sans font-black text-xl text-white tracking-tight flex items-center gap-2">
              <Newspaper className="w-5 h-5 text-blue-300" /> Grounded Local Civic Desk
            </h2>
            <p className="text-xs text-blue-100 max-w-xl leading-normal">
              Access verified news, public notices, river level bulletins, and development activities fetched in real-time from government portals and web sources using Google Search Grounding.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-black/20 p-2.5 rounded-xl border border-white/10 self-start md:self-auto">
            <div className="text-right">
              <p className="text-[10px] font-mono text-blue-300 uppercase tracking-widest font-bold">Portal Jurisdiction</p>
              <p className="text-xs font-sans font-extrabold text-white">Sonepur Municipal Desk</p>
            </div>
            <MapPin className="w-5 h-5 text-[#FF6B00]" />
          </div>
        </div>
      </div>

      {/* SEARCH AND FILTER FORM */}
      <div className="space-y-3 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search local civic announcements (e.g., Sonepur road repairs, water supply timing)..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/40 font-medium text-gray-800 text-xs transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 text-white font-bold rounded-xl text-xs transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
            Grounded Query
          </button>
        </form>

        {/* PRESET CHIPS */}
        <div className="space-y-1.5 pt-1">
          <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest font-bold">Select Preset Grounded Stream</p>
          <div className="flex flex-wrap gap-1.5">
            {presets.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => handlePresetClick(preset.id, preset.query)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all border cursor-pointer ${
                  selectedPreset === preset.id
                    ? "bg-blue-50 border-blue-200 text-blue-700 shadow-sm"
                    : "bg-slate-50 hover:bg-slate-100 border-gray-200 text-gray-600"
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* RENDER CONTENT OR LOADING */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white rounded-xl border border-gray-200 p-8 text-center space-y-4 shadow-sm"
          >
            <div className="relative w-12 h-12 mx-auto">
              <div className="absolute inset-0 border-4 border-blue-200 rounded-full" />
              <div className="absolute inset-0 border-4 border-t-blue-600 rounded-full animate-spin" />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-bold text-gray-700 flex items-center justify-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#FF6B00] animate-pulse" /> Querying Google Search Grounding...
              </p>
              <p className="text-[11px] text-gray-400 max-w-sm mx-auto leading-relaxed">
                Consulting official state portals, regional municipal notices, and Saran administrative reports for up-to-the-minute updates.
              </p>
            </div>
          </motion.div>
        ) : error ? (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-red-50 border border-red-200 rounded-xl p-5 text-red-800 space-y-3"
          >
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <h4 className="text-xs font-black uppercase tracking-tight">Search Grounding Interrupted</h4>
            </div>
            <p className="text-xs leading-relaxed">{error}</p>
            <button
              onClick={() => {
                const activeP = presets.find(p => p.id === selectedPreset) || presets[0];
                fetchNews(query || activeP.query);
              }}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-[10px] uppercase shadow"
            >
              Retry Connection
            </button>
          </motion.div>
        ) : result ? (
          <motion.div
            key="result"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-5"
          >
            {/* THE AI GROUNDED SUMMARY CARD */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-5 shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                    <Sparkles className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-gray-800 uppercase tracking-tight">AI Generated News Dossier</h3>
                    <p className="text-[10px] text-gray-400 font-mono">Last Grounded Search: {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                  </div>
                </div>

                {result.isDemo && (
                  <span className="text-[9px] bg-amber-50 border border-amber-200 text-amber-700 px-2 py-0.5 rounded-full font-mono font-bold uppercase tracking-wider flex items-center gap-1">
                    <Info className="w-3.5 h-3.5" /> Demo Mode
                  </span>
                )}
              </div>

              {/* ARTICLE MARKDOWN RENDER */}
              <div className="prose prose-sm max-w-none text-slate-700 space-y-3">
                {renderMarkdown(result.text)}
              </div>
            </div>

            {/* SIDE CITATIONS PANEL */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm space-y-4 self-start">
              <div className="border-b border-gray-100 pb-2">
                <h4 className="text-xs font-black text-gray-800 uppercase tracking-tight flex items-center gap-1.5">
                  <CheckCircle className="w-4.5 h-4.5 text-blue-600" /> Google Grounding Sources
                </h4>
                <p className="text-[10px] text-gray-400 leading-normal">
                  Click on the links below to view the official source bulletins on Bihar administrative networks.
                </p>
              </div>

              {citations.length > 0 ? (
                <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
                  {citations.map((cite, index) => (
                    <a
                      key={index}
                      href={cite.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-blue-50/40 hover:border-blue-200 transition-all group"
                    >
                      <div className="flex items-start gap-2.5 justify-between">
                        <div className="space-y-1">
                          <p className="text-[11px] font-bold text-gray-700 leading-snug group-hover:text-blue-600 transition-colors">
                            {cite.title}
                          </p>
                          <span className="text-[9px] font-mono text-gray-400 block truncate max-w-[180px] uppercase tracking-wider">
                            {new URL(cite.uri).hostname}
                          </span>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 text-gray-400 group-hover:text-blue-600 flex-shrink-0 mt-0.5" />
                      </div>
                    </a>
                  ))}
                </div>
              ) : (
                <div className="p-4 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-center text-gray-400 text-xs italic">
                  No explicit external source citation URIs listed in grounding metadata.
                </div>
              )}

              {/* RE-VERIFICATION NOTES */}
              <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-2">
                <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-[10px] text-blue-800 leading-relaxed font-medium">
                  <strong>Verification SLA:</strong> The OneBharat automated parser references public portals like <em>state.bihar.gov.in</em> and <em>saran.nic.in</em> to fetch official district notices. Cross-reference files using SECURE QR code on your certificate.
                </p>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};
