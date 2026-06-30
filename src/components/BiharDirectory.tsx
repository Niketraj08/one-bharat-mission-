import React, { useState, useMemo } from "react";
import { 
  Search, 
  Phone, 
  MapPin, 
  Building2, 
  Globe, 
  Shield, 
  HeartPulse, 
  Flame, 
  Zap, 
  ExternalLink, 
  BookOpen, 
  AlertCircle, 
  Filter, 
  PhoneCall,
  Check,
  Building,
  Activity,
  User,
  Info
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Types for Bihar master directory
interface EmergencyContact {
  service: string;
  number: string;
  description: string;
  category: "critical" | "utility" | "social";
  icon: React.ReactNode;
}

interface DistrictInfo {
  name: string;
  headquarters: string;
  division: string;
  subdivisions: number;
  blocks: number;
  dmContact: string;
  spContact: string;
  municipalContact: string;
  portalUrl: string;
}

interface DepartmentInfo {
  name: string;
  abbreviation: string;
  nodalOfficer: string;
  contact: string;
  email: string;
  responsibility: string;
}

interface EssentialFacility {
  name: string;
  type: "hospital" | "police" | "fire" | "electricity" | "municipal";
  district: string;
  contact: string;
  address: string;
}

export const BiharDirectory: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSubTab, setActiveSubTab] = useState<"emergencies" | "districts" | "departments" | "facilities">("emergencies");
  const [selectedDivision, setSelectedDivision] = useState<string>("All");
  const [selectedFacilityType, setSelectedFacilityType] = useState<string>("All");
  const [copiedNumber, setCopiedNumber] = useState<string | null>(null);

  // Copy-to-clipboard feedback helper
  const handleCopy = (num: string) => {
    navigator.clipboard.writeText(num);
    setCopiedNumber(num);
    setTimeout(() => setCopiedNumber(null), 2000);
  };

  // State-wide emergencies dataset
  const stateEmergencies: EmergencyContact[] = [
    {
      service: "Bihar Integrated Emergency Number",
      number: "112",
      description: "Unified number for instant Police, Fire, and Ambulance dispatch across Bihar.",
      category: "critical",
      icon: <Shield className="w-5 h-5 text-red-500" />
    },
    {
      service: "Ambulance Response Services",
      number: "102",
      description: "State Health Society 24x7 Ambulance network for critical medical emergencies.",
      category: "critical",
      icon: <HeartPulse className="w-5 h-5 text-emerald-500" />
    },
    {
      service: "Fire Force Control Room",
      number: "101",
      description: "Direct link to state municipal fire service dispatchers and safety controllers.",
      category: "critical",
      icon: <Flame className="w-5 h-5 text-orange-500" />
    },
    {
      service: "Bihar Electricity Helpline (NBPDCL / SBPDCL)",
      number: "1912",
      description: "Unified power outage, broken cable, transformer malfunction, and meter complaint desk.",
      category: "utility",
      icon: <Zap className="w-5 h-5 text-amber-500" />
    },
    {
      service: "Disaster Management Authority Bihar",
      number: "0612-2217305",
      description: "Floods, earthquakes, extreme weather events, and emergency structural rescue helpline.",
      category: "critical",
      icon: <AlertCircle className="w-5 h-5 text-rose-500" />
    },
    {
      service: "Women Helpline (State Women Commission)",
      number: "181",
      description: "Immediate safety, domestic counseling, protective shelter, and legal aid desk.",
      category: "social",
      icon: <User className="w-5 h-5 text-purple-500" />
    },
    {
      service: "Child Helpline Bihar",
      number: "1098",
      description: "Child protection, missing children reports, and adolescent trauma rescue desk.",
      category: "social",
      icon: <Activity className="w-5 h-5 text-pink-500" />
    },
    {
      service: "CM Helpline / Public Grievance Nodal",
      number: "1800-345-6268",
      description: "Unified platform for direct public grievances under Jan Shikayat Grievance Act.",
      category: "social",
      icon: <BookOpen className="w-5 h-5 text-blue-500" />
    },
    {
      service: "Cyber Crime Helpline Cell",
      number: "1930",
      description: "Report online banking frauds, identity theft, or social harassment to Bihar Cyber Police.",
      category: "critical",
      icon: <Shield className="w-5 h-5 text-slate-500" />
    }
  ];

  // Bihar Districts comprehensive dataset (All 38 Districts)
  const districtsData: DistrictInfo[] = [
    { name: "Araria", headquarters: "Araria", division: "Purnia", subdivisions: 2, blocks: 9, dmContact: "06453-222001", spContact: "06453-222131", municipalContact: "06453-222045", portalUrl: "https://araria.nic.in" },
    { name: "Arwal", headquarters: "Arwal", division: "Magadh", subdivisions: 1, blocks: 5, dmContact: "06337-228111", spContact: "06337-228114", municipalContact: "06337-228119", portalUrl: "https://arwal.nic.in" },
    { name: "Aurangabad", headquarters: "Aurangabad", division: "Magadh", subdivisions: 2, blocks: 11, dmContact: "06186-223116", spContact: "06186-223115", municipalContact: "06186-223405", portalUrl: "https://aurangabad.bih.nic.in" },
    { name: "Banka", headquarters: "Banka", division: "Bhagalpur", subdivisions: 1, blocks: 11, dmContact: "06424-222301", spContact: "06424-222102", municipalContact: "06424-222350", portalUrl: "https://banka.nic.in" },
    { name: "Begusarai", headquarters: "Begusarai", division: "Munger", subdivisions: 5, blocks: 18, dmContact: "06243-222002", spContact: "06243-230200", municipalContact: "06243-223110", portalUrl: "https://begusarai.nic.in" },
    { name: "Bhagalpur", headquarters: "Bhagalpur", division: "Bhagalpur", subdivisions: 3, blocks: 16, dmContact: "0641-2400112", spContact: "0641-2400115", municipalContact: "0641-2401014", portalUrl: "https://bhagalpur.nic.in" },
    { name: "Bhojpur", headquarters: "Ara", division: "Patna", subdivisions: 3, blocks: 14, dmContact: "06182-248701", spContact: "06182-248705", municipalContact: "06182-248710", portalUrl: "https://bhojpur.nic.in" },
    { name: "Buxar", headquarters: "Buxar", division: "Patna", subdivisions: 2, blocks: 11, dmContact: "06183-226011", spContact: "06183-226015", municipalContact: "06183-226019", portalUrl: "https://buxar.nic.in" },
    { name: "Darbhanga", headquarters: "Darbhanga", division: "Darbhanga", subdivisions: 3, blocks: 18, dmContact: "06272-240201", spContact: "06272-240203", municipalContact: "06272-240405", portalUrl: "https://darbhanga.nic.in" },
    { name: "East Champaran", headquarters: "Motihari", division: "Tirhut", subdivisions: 6, blocks: 27, dmContact: "06252-242900", spContact: "06252-242907", municipalContact: "06252-242915", portalUrl: "https://eastchamparan.nic.in" },
    { name: "Gaya", headquarters: "Gaya", division: "Magadh", subdivisions: 4, blocks: 24, dmContact: "0631-2222600", spContact: "0631-2222200", municipalContact: "0631-2220261", portalUrl: "https://gaya.nic.in" },
    { name: "Gopalganj", headquarters: "Gopalganj", division: "Saran", subdivisions: 2, blocks: 14, dmContact: "06156-224401", spContact: "06156-224403", municipalContact: "06156-224420", portalUrl: "https://gopalganj.nic.in" },
    { name: "Jamui", headquarters: "Jamui", division: "Munger", subdivisions: 1, blocks: 10, dmContact: "06345-222003", spContact: "06345-222005", municipalContact: "06345-222010", portalUrl: "https://jamui.nic.in" },
    { name: "Jehanabad", headquarters: "Jehanabad", division: "Magadh", subdivisions: 1, blocks: 7, dmContact: "06114-223001", spContact: "06114-223003", municipalContact: "06114-223015", portalUrl: "https://jehanabad.nic.in" },
    { name: "Kaimur", headquarters: "Bhabua", division: "Patna", subdivisions: 2, blocks: 11, dmContact: "06189-223202", spContact: "06189-223204", municipalContact: "06189-223210", portalUrl: "https://kaimur.nic.in" },
    { name: "Katihar", headquarters: "Katihar", division: "Purnia", subdivisions: 3, blocks: 16, dmContact: "06452-242401", spContact: "06452-242405", municipalContact: "06452-242410", portalUrl: "https://katihar.nic.in" },
    { name: "Khagaria", headquarters: "Khagaria", division: "Munger", subdivisions: 2, blocks: 7, dmContact: "06244-222001", spContact: "06244-222004", municipalContact: "06244-222015", portalUrl: "https://khagaria.nic.in" },
    { name: "Kishanganj", headquarters: "Kishanganj", division: "Purnia", subdivisions: 1, blocks: 7, dmContact: "06456-222401", spContact: "06456-222405", municipalContact: "06456-222415", portalUrl: "https://kishanganj.nic.in" },
    { name: "Lakhisarai", headquarters: "Lakhisarai", division: "Munger", subdivisions: 1, blocks: 7, dmContact: "06346-232102", spContact: "06346-232105", municipalContact: "06346-232111", portalUrl: "https://lakhisarai.nic.in" },
    { name: "Madhepura", headquarters: "Madhepura", division: "Kosi", subdivisions: 2, blocks: 11, dmContact: "06476-222001", spContact: "06476-222005", municipalContact: "06476-222020", portalUrl: "https://madhepura.nic.in" },
    { name: "Madhubani", headquarters: "Madhubani", division: "Darbhanga", subdivisions: 5, blocks: 21, dmContact: "06276-222248", spContact: "06276-222222", municipalContact: "06276-222212", portalUrl: "https://madhubani.nic.in" },
    { name: "Munger", headquarters: "Munger", division: "Munger", subdivisions: 3, blocks: 9, dmContact: "06344-222401", spContact: "06344-222405", municipalContact: "06344-222412", portalUrl: "https://munger.nic.in" },
    { name: "Muzaffarpur", headquarters: "Muzaffarpur", division: "Tirhut", subdivisions: 2, blocks: 16, dmContact: "0621-2212101", spContact: "0621-2212105", municipalContact: "0621-2212120", portalUrl: "https://muzaffarpur.nic.in" },
    { name: "Nalanda", headquarters: "Biharsharif", division: "Patna", subdivisions: 3, blocks: 20, dmContact: "06112-235201", spContact: "06112-235203", municipalContact: "06112-235211", portalUrl: "https://nalanda.nic.in" },
    { name: "Nawada", headquarters: "Nawada", division: "Magadh", subdivisions: 2, blocks: 14, dmContact: "06324-212201", spContact: "06324-212205", municipalContact: "06324-212210", portalUrl: "https://nawada.nic.in" },
    { name: "Patna", headquarters: "Patna", division: "Patna", subdivisions: 6, blocks: 23, dmContact: "0612-2219545", spContact: "0612-2219406", municipalContact: "0612-2200634", portalUrl: "https://patna.nic.in" },
    { name: "Purnia", headquarters: "Purnia", division: "Purnia", subdivisions: 4, blocks: 14, dmContact: "06454-242301", spContact: "06454-242305", municipalContact: "06454-242315", portalUrl: "https://purnea.nic.in" },
    { name: "Rohtas", headquarters: "Sasaram", division: "Patna", subdivisions: 3, blocks: 19, dmContact: "06184-222201", spContact: "06184-222203", municipalContact: "06184-222212", portalUrl: "https://rohtas.nic.in" },
    { name: "Saharsa", headquarters: "Saharsa", division: "Kosi", subdivisions: 2, blocks: 10, dmContact: "06478-223401", spContact: "06478-223405", municipalContact: "06478-223415", portalUrl: "https://saharsa.nic.in" },
    { name: "Samastipur", headquarters: "Samastipur", division: "Darbhanga", subdivisions: 4, blocks: 20, dmContact: "06274-222300", spContact: "06274-222303", municipalContact: "06274-222312", portalUrl: "https://samastipur.nic.in" },
    { name: "Saran", headquarters: "Chhapra", division: "Saran", subdivisions: 3, blocks: 20, dmContact: "06152-243201", spContact: "06152-243202", municipalContact: "06152-245104", portalUrl: "https://saran.nic.in" },
    { name: "Sheikhpura", headquarters: "Sheikhpura", division: "Munger", subdivisions: 1, blocks: 6, dmContact: "06341-223101", spContact: "06341-223103", municipalContact: "06341-223112", portalUrl: "https://sheikhpura.nic.in" },
    { name: "Sheohar", headquarters: "Sheohar", division: "Tirhut", subdivisions: 1, blocks: 5, dmContact: "06222-257201", spContact: "06222-257203", municipalContact: "06222-257211", portalUrl: "https://sheohar.nic.in" },
    { name: "Sitamarhi", headquarters: "Sitamarhi", division: "Tirhut", subdivisions: 3, blocks: 17, dmContact: "06226-250316", spContact: "06226-250242", municipalContact: "06226-250320", portalUrl: "https://sitamarhi.nic.in" },
    { name: "Siwan", headquarters: "Siwan", division: "Saran", subdivisions: 2, blocks: 19, dmContact: "06154-242001", spContact: "06154-242005", municipalContact: "06154-242012", portalUrl: "https://siwan.nic.in" },
    { name: "Supaul", headquarters: "Supaul", division: "Kosi", subdivisions: 4, blocks: 11, dmContact: "06473-224001", spContact: "06473-224005", municipalContact: "06473-224015", portalUrl: "https://supaul.nic.in" },
    { name: "Vaishali", headquarters: "Hajipur", division: "Tirhut", subdivisions: 3, blocks: 16, dmContact: "06224-272201", spContact: "06224-272205", municipalContact: "06224-272535", portalUrl: "https://vaishali.nic.in" },
    { name: "West Champaran", headquarters: "Bettiah", division: "Tirhut", subdivisions: 3, blocks: 18, dmContact: "06254-242601", spContact: "06254-242605", municipalContact: "06254-242615", portalUrl: "https://westchamparan.nic.in" }
  ];

  // Key state departments
  const departmentsData: DepartmentInfo[] = [
    {
      name: "Road Construction Department",
      abbreviation: "RCD BIHAR",
      nodalOfficer: "Shri Sandeep Kumar Pudakalkatti (Secretary)",
      contact: "0612-2215456",
      email: "secy-rcd-bih@nic.in",
      responsibility: "Saran-Sonpur Highway repairs, pothole clearing, major road projects, bridge infrastructure."
    },
    {
      name: "Urban Development & Housing Department",
      abbreviation: "UDHD BIHAR",
      nodalOfficer: "Shri Anand Kishor (Principal Secretary)",
      contact: "0612-2215580",
      email: "urban-bih@nic.in",
      responsibility: "Waste water treatment, solid waste management, park layouts, public streetlights, municipal acts."
    },
    {
      name: "Public Health Engineering Department",
      abbreviation: "PHED BIHAR",
      nodalOfficer: "Shri Jitendra Srivastav (Secretary)",
      contact: "0612-2217592",
      email: "secy-phed-bih@nic.in",
      responsibility: "Har Ghar Nal Ka Jal supply, clean drinking water filtration, public handpumps repair."
    },
    {
      name: "North Bihar Power Distribution Company",
      abbreviation: "NBPDCL",
      nodalOfficer: "Shri Prabhakar (Managing Director)",
      contact: "1800-345-6198",
      email: "md.nbpdcl@gmail.com",
      responsibility: "Power transmission grid, rural electrification, transformer maintenance in North Bihar districts."
    },
    {
      name: "Health Department Bihar",
      abbreviation: "SHSB",
      nodalOfficer: "Shri Mangal Pandey (Hon'ble Minister / Secretary)",
      contact: "0612-2215306",
      email: "statehealth_society@yahoo.co.in",
      responsibility: "Primary health centers, Sadar Hospital management, ambulance deployment, epidemic monitoring."
    },
    {
      name: "Home Department (Bihar Police)",
      abbreviation: "BIP",
      nodalOfficer: "Director General of Police (DGP Control)",
      contact: "0612-2217833",
      email: "dgp-bih@nic.in",
      responsibility: "Law enforcement, community policing, crime prevention, local Thana administration."
    }
  ];

  // Essential Local Facilities
  const essentialFacilities: EssentialFacility[] = [
    { name: "Sadar Hospital Chhapra", type: "hospital", district: "Saran", contact: "06152-243205", address: "Hospital Road, Chhapra town, Saran" },
    { name: "Sadar Hospital Hajipur", type: "hospital", district: "Vaishali", contact: "06224-272202", address: "Near Ramashish Chowk, Hajipur, Vaishali" },
    { name: "Patna Medical College & Hospital (PMCH)", type: "hospital", district: "Patna", contact: "0612-2300080", address: "Ashok Rajpath, Patna" },
    { name: "Chhapra Town Police Station (Thana)", type: "police", district: "Saran", contact: "06152-232231", address: "Municipality Chowk, Chhapra" },
    { name: "Sonpur Police Thana", type: "police", district: "Saran", contact: "06152-250221", address: "Near Railway Station Rd, Sonpur" },
    { name: "Hajipur Town Police Thana", type: "police", district: "Vaishali", contact: "06224-272505", address: "Gandhi Chowk Thana Road, Hajipur" },
    { name: "Chhapra Municipal Fire Station", type: "fire", district: "Saran", contact: "06152-243101", address: "Prabhunath Nagar, Chhapra" },
    { name: "Hajipur Fire Station Office", type: "fire", district: "Vaishali", contact: "06224-260555", address: "Industrial Area, Hajipur" },
    { name: "Saran Electricity Urban Substation", type: "electricity", district: "Saran", contact: "06152-222340", address: "Dak Bungalow Road, Chhapra" },
    { name: "Vaishali Grid Substation NBPDCL", type: "electricity", district: "Vaishali", contact: "06224-274112", address: "Hajipur Urban Power Grid, Hajipur" },
    { name: "Chhapra Nagar Nigam Office", type: "municipal", district: "Saran", contact: "06152-242045", address: "Nagar Nigam Complex, Chhapra" },
    { name: "Hajipur Nagar Parishad Office", type: "municipal", district: "Vaishali", contact: "06224-272535", address: "Santhu Chowk Municipal Rd, Hajipur" }
  ];

  // Unique divisions for district filter
  const divisions = useMemo(() => {
    const list = new Set(districtsData.map(d => d.division));
    return ["All", ...Array.from(list).sort()];
  }, [districtsData]);

  // Filtering Districts
  const filteredDistricts = useMemo(() => {
    return districtsData.filter(d => {
      const matchQuery = 
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.headquarters.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.division.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchDiv = selectedDivision === "All" || d.division === selectedDivision;
      return matchQuery && matchDiv;
    });
  }, [districtsData, searchQuery, selectedDivision]);

  // Filtering State Emergencies
  const filteredEmergencies = useMemo(() => {
    return stateEmergencies.filter(e => 
      e.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.number.includes(searchQuery) ||
      e.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [stateEmergencies, searchQuery]);

  // Filtering Departments
  const filteredDepartments = useMemo(() => {
    return departmentsData.filter(d => 
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.abbreviation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.nodalOfficer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.responsibility.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [departmentsData, searchQuery]);

  // Filtering Essential Facilities
  const filteredFacilities = useMemo(() => {
    return essentialFacilities.filter(f => {
      const matchQuery = 
        f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.address.toLowerCase().includes(searchQuery.toLowerCase());

      const matchType = selectedFacilityType === "All" || f.type === selectedFacilityType;
      return matchQuery && matchType;
    });
  }, [essentialFacilities, searchQuery, selectedFacilityType]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12" id="bihar-directory-container">
      {/* GLOWING HERO HEADER */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#FF6B00]/10 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -z-10" />

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-800 border border-slate-700 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-300 font-bold">Official Bihar Government Master Directory</span>
            </div>
            <h2 className="font-sans font-black text-2xl md:text-3xl uppercase tracking-tight text-white leading-none">
              Govt Portal & <span className="text-[#FF6B00]">Emergency Directory</span>
            </h2>
            <p className="text-xs text-gray-400 leading-relaxed max-w-2xl">
              Access real-time administrative databases across all 38 districts of Bihar. Connect with nodal departments, DM desks, SP controls, emergency responders, and municipal desks with a single click.
            </p>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex flex-col justify-center items-center text-center flex-shrink-0 w-full md:w-56">
            <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block mb-1">State Control Room</span>
            <span className="text-2xl font-sans font-black text-[#FF6B00] block tracking-tight">112 / 102</span>
            <p className="text-[9px] text-gray-400 mt-1">24x7 Command Response Bridge</p>
          </div>
        </div>
      </div>

      {/* SEARCH CONTROL BAR */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row justify-between gap-3 items-center">
        <div className="relative w-full md:flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search districts, subdivision, department, office type or telephone numbers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-gray-200 focus:border-[#FF6B00] rounded-xl text-xs pl-10 pr-4 py-3 outline-none text-gray-800 transition-all font-sans"
          />
        </div>

        {/* Quick Clear Button */}
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-[10px] font-bold transition-all cursor-pointer"
          >
            Clear Search
          </button>
        )}
      </div>

      {/* SUB-TABS INTERACTIVE CONTROLLER */}
      <div className="flex border-b border-gray-200 overflow-x-auto whitespace-nowrap scrollbar-hide pb-0.5 gap-2">
        <button
          onClick={() => { setActiveSubTab("emergencies"); setSelectedDivision("All"); }}
          className={`px-4 py-2.5 rounded-t-xl font-sans text-xs font-bold transition-all flex items-center gap-1.5 border-b-2 cursor-pointer ${
            activeSubTab === "emergencies"
              ? "border-[#FF6B00] text-[#FF6B00] bg-orange-50/20"
              : "border-transparent text-gray-500 hover:text-slate-900"
          }`}
        >
          <Shield className="w-4 h-4" />
          Emergency Helplines
        </button>

        <button
          onClick={() => { setActiveSubTab("districts"); }}
          className={`px-4 py-2.5 rounded-t-xl font-sans text-xs font-bold transition-all flex items-center gap-1.5 border-b-2 cursor-pointer ${
            activeSubTab === "districts"
              ? "border-[#FF6B00] text-[#FF6B00] bg-orange-50/20"
              : "border-transparent text-gray-500 hover:text-slate-900"
          }`}
        >
          <Building2 className="w-4 h-4" />
          Districts Information (38)
        </button>

        <button
          onClick={() => { setActiveSubTab("departments"); setSelectedDivision("All"); }}
          className={`px-4 py-2.5 rounded-t-xl font-sans text-xs font-bold transition-all flex items-center gap-1.5 border-b-2 cursor-pointer ${
            activeSubTab === "departments"
              ? "border-[#FF6B00] text-[#FF6B00] bg-orange-50/20"
              : "border-transparent text-gray-500 hover:text-slate-900"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          State Departments
        </button>

        <button
          onClick={() => { setActiveSubTab("facilities"); setSelectedDivision("All"); }}
          className={`px-4 py-2.5 rounded-t-xl font-sans text-xs font-bold transition-all flex items-center gap-1.5 border-b-2 cursor-pointer ${
            activeSubTab === "facilities"
              ? "border-[#FF6B00] text-[#FF6B00] bg-orange-50/20"
              : "border-transparent text-gray-500 hover:text-slate-900"
          }`}
        >
          <Building className="w-4 h-4" />
          Essential Civic Facilities
        </button>
      </div>

      {/* CORE DISPLAY DECKS */}
      <div className="min-h-[400px]">
        <AnimatePresence mode="wait">
          {/* 1. EMERGENCIES SUB-TAB */}
          {activeSubTab === "emergencies" && (
            <motion.div
              key="emergencies"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {filteredEmergencies.length > 0 ? (
                filteredEmergencies.map((e, idx) => (
                  <div
                    key={idx}
                    className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:border-orange-200 transition-all flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl">
                          {e.icon}
                        </div>
                        <span className={`text-[8px] font-mono font-black uppercase px-2 py-0.5 rounded ${
                          e.category === "critical"
                            ? "bg-red-50 text-red-600 border border-red-100"
                            : e.category === "utility"
                            ? "bg-amber-50 text-amber-600 border border-amber-100"
                            : "bg-blue-50 text-blue-600 border border-blue-100"
                        }`}>
                          {e.category} response
                        </span>
                      </div>

                      <h4 className="font-sans font-black text-xs text-slate-800 leading-tight uppercase">
                        {e.service}
                      </h4>
                      <p className="text-[11px] text-gray-500 leading-relaxed">
                        {e.description}
                      </p>
                    </div>

                    <div className="flex gap-2 pt-2 border-t border-slate-50">
                      <a
                        href={`tel:${e.number.replace(/[^0-9]/g, "")}`}
                        className="flex-1 py-2 bg-[#FF6B00] hover:bg-orange-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-orange-500/10 cursor-pointer"
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span>Call {e.number}</span>
                      </a>
                      <button
                        onClick={() => handleCopy(e.number)}
                        className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-600 text-xs flex items-center justify-center transition-all cursor-pointer"
                        title="Copy number"
                      >
                        {copiedNumber === e.number ? (
                          <Check className="w-3.5 h-3.5 text-green-600 font-bold" />
                        ) : (
                          <span className="font-mono text-[10px] font-bold px-1">COPY</span>
                        )}
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12 bg-white rounded-3xl border border-dashed border-gray-200 text-gray-400">
                  <p className="text-xs italic">No matching emergencies found.</p>
                </div>
              )}
            </motion.div>
          )}

          {/* 2. DISTRICTS INFO SUB-TAB */}
          {activeSubTab === "districts" && (
            <motion.div
              key="districts"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {/* Division Filter */}
              <div className="flex flex-wrap gap-1.5 items-center bg-slate-50 border border-slate-100 p-2 rounded-2xl">
                <span className="text-[10px] font-mono uppercase font-black text-slate-400 px-2">Filter by Division:</span>
                {divisions.map((div, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedDivision(div)}
                    className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                      selectedDivision === div
                        ? "bg-[#FF6B00] text-white"
                        : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {div}
                  </button>
                ))}
              </div>

              {/* District Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredDistricts.length > 0 ? (
                  filteredDistricts.map((d, idx) => (
                    <div
                      key={idx}
                      className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:border-orange-100 transition-all space-y-4"
                    >
                      <div className="flex justify-between items-start border-b border-slate-50 pb-2">
                        <div>
                          <h4 className="font-sans font-black text-sm text-slate-800 uppercase tracking-tight">
                            {d.name}
                          </h4>
                          <span className="text-[9px] font-mono font-bold text-[#FF6B00] uppercase tracking-wider">
                            {d.division} Division
                          </span>
                        </div>
                        <a
                          href={d.portalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-400 hover:text-slate-600 flex items-center justify-center transition-all"
                          title="Official Portal"
                        >
                          <Globe className="w-3.5 h-3.5" />
                        </a>
                      </div>

                      {/* District Metrics */}
                      <div className="grid grid-cols-2 gap-2 text-[10px] font-mono bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <div>
                          <span className="text-gray-400 block uppercase">Headquarters</span>
                          <span className="font-bold text-slate-700 uppercase flex items-center gap-0.5">
                            <MapPin className="w-3 h-3 text-[#FF6B00]" />
                            {d.headquarters}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-400 block uppercase">Subdivisions / Blocks</span>
                          <span className="font-bold text-slate-700">
                            {d.subdivisions} Sub / {d.blocks} Blocks
                          </span>
                        </div>
                      </div>

                      {/* Contacts Deck */}
                      <div className="space-y-2.5 pt-1">
                        {/* DM Contact */}
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-gray-500 font-sans">DM Office</span>
                          <div className="flex items-center gap-1.5 font-mono text-slate-800 font-bold">
                            <span>{d.dmContact}</span>
                            <a
                              href={`tel:${d.dmContact}`}
                              className="p-1 bg-orange-50 hover:bg-orange-100 text-[#FF6B00] rounded-lg transition-all"
                              title="Call Office"
                            >
                              <Phone className="w-3 h-3" />
                            </a>
                          </div>
                        </div>

                        {/* SP Contact */}
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-gray-500 font-sans">SP / SSP Office</span>
                          <div className="flex items-center gap-1.5 font-mono text-slate-800 font-bold">
                            <span>{d.spContact}</span>
                            <a
                              href={`tel:${d.spContact}`}
                              className="p-1 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-all"
                              title="Call Police"
                            >
                              <Phone className="w-3 h-3" />
                            </a>
                          </div>
                        </div>

                        {/* Municipal Helpline */}
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-gray-500 font-sans">Municipal Desk</span>
                          <div className="flex items-center gap-1.5 font-mono text-slate-800 font-bold">
                            <span>{d.municipalContact}</span>
                            <a
                              href={`tel:${d.municipalContact}`}
                              className="p-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-lg transition-all"
                              title="Call Civic Desk"
                            >
                              <Phone className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12 bg-white rounded-3xl border border-dashed border-gray-200 text-gray-400">
                    <p className="text-xs italic">No districts matching your query.</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* 3. DEPARTMENTS SUB-TAB */}
          {activeSubTab === "departments" && (
            <motion.div
              key="departments"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {filteredDepartments.length > 0 ? (
                filteredDepartments.map((d, idx) => (
                  <div
                    key={idx}
                    className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:border-orange-100 transition-all flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <span className="text-[9px] font-mono font-black uppercase bg-slate-900 text-white px-2 py-0.5 rounded">
                          {d.abbreviation}
                        </span>
                        <span className="text-[10px] text-gray-400 font-mono">BIHAR GOVERNMENT</span>
                      </div>

                      <h4 className="font-sans font-black text-sm text-slate-800 leading-tight uppercase">
                        {d.name}
                      </h4>

                      <p className="text-xs text-gray-600 leading-relaxed bg-slate-50 border border-slate-100 p-3 rounded-xl italic">
                        "{d.responsibility}"
                      </p>

                      <div className="space-y-1.5 pt-1 text-xs">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Nodal Head / Secretary</span>
                          <span className="font-bold text-slate-800">{d.nodalOfficer}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Nodal Email</span>
                          <span className="font-mono text-blue-600 underline text-[11px]">{d.email}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-3 border-t border-slate-50">
                      <a
                        href={`tel:${d.contact}`}
                        className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <PhoneCall className="w-3.5 h-3.5 text-[#FF6B00]" />
                        <span>Call Desk {d.contact}</span>
                      </a>
                      <button
                        onClick={() => handleCopy(d.contact)}
                        className="p-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-slate-600 text-xs flex items-center justify-center transition-all cursor-pointer"
                        title="Copy Contact"
                      >
                        {copiedNumber === d.contact ? (
                          <Check className="w-3.5 h-3.5 text-green-600 font-bold" />
                        ) : (
                          <span className="font-mono text-[9px] font-black px-1">COPY</span>
                        )}
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12 bg-white rounded-3xl border border-dashed border-gray-200 text-gray-400">
                  <p className="text-xs italic">No matching departments found.</p>
                </div>
              )}
            </motion.div>
          )}

          {/* 4. ESSENTIAL FACILITIES SUB-TAB */}
          {activeSubTab === "facilities" && (
            <motion.div
              key="facilities"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {/* Type Filter */}
              <div className="flex flex-wrap gap-1.5 items-center bg-slate-50 border border-slate-100 p-2 rounded-2xl">
                <span className="text-[10px] font-mono uppercase font-black text-slate-400 px-2">Facility Categories:</span>
                {[
                  { id: "All", label: "All Facilities" },
                  { id: "hospital", label: "Hospitals", icon: <HeartPulse className="w-3 h-3 text-emerald-500" /> },
                  { id: "police", label: "Police Thana", icon: <Shield className="w-3 h-3 text-blue-500" /> },
                  { id: "fire", label: "Fire Station", icon: <Flame className="w-3 h-3 text-orange-500" /> },
                  { id: "electricity", label: "Power Substation", icon: <Zap className="w-3 h-3 text-amber-500" /> },
                  { id: "municipal", label: "Municipal Councils", icon: <Building className="w-3 h-3 text-purple-500" /> }
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedFacilityType(item.id)}
                    className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                      selectedFacilityType === item.id
                        ? "bg-[#FF6B00] text-white"
                        : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>

              {/* Facilities Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredFacilities.length > 0 ? (
                  filteredFacilities.map((f, idx) => {
                    const badgeColors = 
                      f.type === "hospital"
                        ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                        : f.type === "police"
                        ? "bg-blue-50 text-blue-600 border-blue-100"
                        : f.type === "fire"
                        ? "bg-orange-50 text-orange-600 border-orange-100"
                        : f.type === "electricity"
                        ? "bg-amber-50 text-amber-600 border-amber-100"
                        : "bg-purple-50 text-purple-600 border-purple-100";

                    return (
                      <div
                        key={idx}
                        className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:border-orange-100 transition-all flex flex-col justify-between space-y-4"
                      >
                        <div className="space-y-2">
                          <div className="flex justify-between items-start">
                            <span className={`text-[8px] font-mono font-black uppercase px-2 py-0.5 rounded border ${badgeColors}`}>
                              {f.type}
                            </span>
                            <span className="text-[10px] text-gray-400 font-mono flex items-center gap-0.5">
                              <MapPin className="w-3 h-3 text-red-500" /> {f.district} District
                            </span>
                          </div>

                          <h4 className="font-sans font-black text-xs text-slate-800 leading-tight uppercase pt-1">
                            {f.name}
                          </h4>

                          <p className="text-[10px] font-sans text-gray-500 flex items-center gap-1">
                            <span>Address: {f.address}</span>
                          </p>
                        </div>

                        <div className="flex gap-2 pt-2 border-t border-slate-50">
                          <a
                            href={`tel:${f.contact}`}
                            className="flex-1 py-2 bg-[#FF6B00] hover:bg-orange-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-orange-500/10 cursor-pointer"
                          >
                            <PhoneCall className="w-3.5 h-3.5" />
                            <span>Call {f.contact}</span>
                          </a>
                          <button
                            onClick={() => handleCopy(f.contact)}
                            className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-600 text-xs flex items-center justify-center transition-all cursor-pointer"
                            title="Copy Contact"
                          >
                            {copiedNumber === f.contact ? (
                              <Check className="w-3.5 h-3.5 text-green-600 font-bold" />
                            ) : (
                              <span className="font-mono text-[9px] font-black px-1">COPY</span>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="col-span-full text-center py-12 bg-white rounded-3xl border border-dashed border-gray-200 text-gray-400">
                    <p className="text-xs italic">No local facilities match your filters.</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* DISPATCH GUIDANCE INFO */}
      <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 flex gap-3 items-start">
        <Info className="w-5 h-5 text-[#FF6B00] flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h5 className="font-sans font-bold text-xs text-slate-800 uppercase tracking-wide">
            How to use the Integrated Bihar Grievance Core
          </h5>
          <p className="text-[11px] text-gray-600 leading-relaxed">
            All details above originate from public Bihar state department portals (including <a href="https://state.bihar.gov.in" target="_blank" rel="noopener noreferrer" className="text-[#FF6B00] hover:underline font-bold inline-flex items-center gap-0.5">bihar.gov.in <ExternalLink className="w-2.5 h-2.5" /></a>). For quick utility corrections (water tap leaks, power cable failure, garbage dumps) we advise reporting directly via the <strong>File Complaint</strong> page first, which auto-routes the ticket to district nodal engineers. Use direct dial for rapid manual follow-ups or emergency rescues.
          </p>
        </div>
      </div>
    </div>
  );
};
