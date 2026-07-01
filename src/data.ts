/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Complaint, ComplaintCategory, ComplaintPriority, ComplaintStatus } from "./types";

export const MOCK_CITIZEN = {
  id: "user-101",
  name: "Niket Raj",
  email: "niketrajkvs@gmail.com",
  phone: "+91 98765 43210",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
  score: 840, // Citizen Civic Score out of 1000
  achievements: [
    {
      id: "ach-1",
      title: "Civic Guardian",
      description: "Reported 5 complaints that were successfully resolved.",
      icon: "ShieldAlert",
      dateEarned: "2026-04-12"
    },
    {
      id: "ach-2",
      title: "Spotless Ward",
      description: "Contributed to cleanliness in Ward 12 by reporting bulk waste dumping.",
      icon: "Sparkles",
      dateEarned: "2026-05-20"
    },
    {
      id: "ach-3",
      title: "Community Pillar",
      description: "Earned 50+ community upvotes on reported issues.",
      icon: "Users",
      dateEarned: "2026-06-15"
    }
  ],
  savedLocations: [
    {
      id: "loc-home",
      label: "Home",
      address: "Sonpur Harihar Nath Mandir Road, Sonpur, Saran, Bihar",
      lat: 25.6985,
      lng: 85.1722
    },
    {
      id: "loc-office",
      label: "Office",
      address: "Hajipur Cinema Road, near Gandhi Setu, Hajipur, Vaishali, Bihar",
      lat: 25.6850,
      lng: 85.2150
    }
  ]
};

export const MOCK_OFFICERS = [
  {
    id: "off-201",
    name: "Inspector Rajesh Singh",
    department: "Roads & Highways Division, Saran",
    badgeNumber: "OB-ROAD-SAR-542",
    rating: 4.8,
    resolvedCount: 142,
    assignedCount: 8,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200"
  },
  {
    id: "off-202",
    name: "Engineer Amit Verma",
    department: "Saran Electricity & Streetlights Board",
    badgeNumber: "OB-ELEC-SAR-911",
    rating: 4.6,
    resolvedCount: 98,
    assignedCount: 4,
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200"
  },
  {
    id: "off-203",
    name: "Officer Manoj Yadav",
    department: "Sonpur-Hajipur Swachhata & Waste Division",
    badgeNumber: "OB-WASTE-SAR-221",
    rating: 4.5,
    resolvedCount: 215,
    assignedCount: 12,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200"
  },
  {
    id: "off-204",
    name: "Director Sharda Devi",
    department: "Saran District Water & Sanitation Commission",
    badgeNumber: "OB-WAT-SAR-403",
    rating: 4.9,
    resolvedCount: 74,
    assignedCount: 3,
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200"
  }
];

export const INITIAL_COMPLAINTS: Complaint[] = [
  {
    id: "OB-7492-SAR",
    category: ComplaintCategory.ROAD_DAMAGE,
    title: "Deep Potholes on Sonpur-Hajipur Highway near Gandak Bridge",
    description: "Extremely deep and dangerous potholes have developed right on the main Sonpur-Hajipur National Highway near the Gandak Bridge turnoff. Two-wheelers lose balance easily at night. Heavy vehicle flow is constantly breaking the asphalt further. Immediate hot-mix or asphalt patching is needed.",
    priority: ComplaintPriority.HIGH,
    status: ComplaintStatus.IN_PROGRESS,
    location: {
      latitude: 25.6942,
      longitude: 85.1855,
      address: "Sonpur-Hajipur Highway, Near Gandak Bridge, Sonpur, Saran, Bihar",
      ward: "Ward No. 4 (Sonpur)",
      district: "Saran",
      state: "Bihar"
    },
    images: [
      "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&q=80&w=600"
    ],
    createdAt: "2026-06-25T08:30:00Z",
    updatedAt: "2026-06-28T14:45:00Z",
    userId: "user-999",
    userName: "Vikram Malhotra",
    userAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100",
    isAnonymous: false,
    upvotes: 84,
    hasUpvoted: true,
    department: "Saran Road Construction Department (RCD)",
    officerId: "off-201",
    officerName: "Inspector Rajesh Singh",
    officerContact: "+91 94312 88761",
    timeline: [
      {
        id: "t-1",
        status: ComplaintStatus.SUBMITTED,
        date: "2026-06-25T08:30:00Z",
        notes: "Complaint successfully filed by Citizen. AI Categorization confirmed 'Road Damage' with 98% confidence. Automatically forwarded to Saran RCD Roads Division.",
        updatedBy: "OneBharat AI"
      },
      {
        id: "t-2",
        status: ComplaintStatus.DISPATCHED,
        date: "2026-06-26T10:15:00Z",
        notes: "Assigned to Ward Engineer Inspector Rajesh Singh for field inspection and maintenance dispatch.",
        updatedBy: "RCD Saran Admin"
      },
      {
        id: "t-3",
        status: ComplaintStatus.IN_PROGRESS,
        date: "2026-06-28T14:45:00Z",
        notes: "Maintenance team dispatched with hot asphalt mix. Scheduled repair to commence during off-peak hours tonight to minimize highway traffic congestion.",
        updatedBy: "Inspector Rajesh Singh",
        evidencePhoto: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=600"
      }
    ]
  },
  {
    id: "OB-1933-SAR",
    category: ComplaintCategory.STREET_LIGHT,
    title: "Defunct Solar Street Lights at Sonpur Bazar Chowk",
    description: "Five newly-installed solar streetlights at Sonpur Bazar Chowk have stopped working. The entire commercial and residential intersection is completely pitch dark after 7 PM, creating a major safety hazard for families and market shoppers.",
    priority: ComplaintPriority.HIGH,
    status: ComplaintStatus.RESOLVED,
    location: {
      latitude: 25.6985,
      longitude: 85.1722,
      address: "Sonpur Bazar Chowk, Main Road, Sonpur, Saran, Bihar",
      ward: "Ward No. 8 (Sonpur Bazar)",
      district: "Saran",
      state: "Bihar"
    },
    images: [
      "https://images.unsplash.com/photo-1509023464722-18d996393ca8?auto=format&fit=crop&q=80&w=600"
    ],
    createdAt: "2026-06-23T20:10:00Z",
    updatedAt: "2026-06-27T17:30:00Z",
    userId: "user-101",
    userName: "Niket Raj",
    userAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100",
    isAnonymous: false,
    upvotes: 42,
    hasUpvoted: false,
    department: "Sonpur Nagar Panchayat (Nagar Nigam)",
    officerId: "off-202",
    officerName: "Engineer Amit Verma",
    officerContact: "+91 94311 00234",
    timeline: [
      {
        id: "t-11",
        status: ComplaintStatus.SUBMITTED,
        date: "2026-06-23T20:10:00Z",
        notes: "Complaint filed by Niket Raj. AI Priority Analysis marked as High due to commercial crowd safety risk.",
        updatedBy: "OneBharat AI"
      },
      {
        id: "t-12",
        status: ComplaintStatus.DISPATCHED,
        date: "2026-06-24T09:00:00Z",
        notes: "Assigned to Nagar Panchayat Electrical & Solar Board crew led by Engineer Amit Verma.",
        updatedBy: "Sonpur Nagar Panchayat Dispatcher"
      },
      {
        id: "t-13",
        status: ComplaintStatus.IN_PROGRESS,
        date: "2026-06-25T11:20:00Z",
        notes: "Crew inspected the panels and found water logging inside the solar battery storage case which tripped the control cards.",
        updatedBy: "Engineer Amit Verma"
      },
      {
        id: "t-14",
        status: ComplaintStatus.RESOLVED,
        date: "2026-06-27T17:30:00Z",
        notes: "Battery boxes replaced and sealed with waterproof rubber gaskets. All 5 solar streetlights are fully charged and verified functional at 100% capacity.",
        updatedBy: "Engineer Amit Verma",
        evidencePhoto: "https://images.unsplash.com/photo-1517059224940-d4af9eec41b7?auto=format&fit=crop&q=80&w=600"
      }
    ],
    citizenRating: 5,
    citizenFeedback: "Very professional response! Amit Verma's team diagnosed the water log issue and replaced the battery systems with better waterproofing. Sonpur Bazar is safe and glowing again!"
  },
  {
    id: "OB-4820-SAR",
    category: ComplaintCategory.GARBAGE,
    title: "Massive Garbage Dumping near Sonpur Municipal Ground Entrance",
    description: "Several commercial trucks and local food stalls are dumping heavy organic waste, plastic bags, and construction debris directly next to the Municipal Ground entrance on Sonpur Main Road. It's causing an unbearable smell and attracting packs of stray dogs, blocking walkers.",
    priority: ComplaintPriority.MEDIUM,
    status: ComplaintStatus.SUBMITTED,
    location: {
      latitude: 25.6965,
      longitude: 85.1762,
      address: "Municipal Ground Eastern Gate, Main Road, Sonpur, Saran, Bihar",
      ward: "Ward No. 4 (Sonpur)",
      district: "Saran",
      state: "Bihar"
    },
    images: [
      "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&q=80&w=600"
    ],
    createdAt: "2026-06-29T06:15:00Z",
    updatedAt: "2026-06-29T06:15:00Z",
    userId: "user-102",
    userName: "Ananya Hegde",
    userAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100",
    isAnonymous: false,
    upvotes: 18,
    hasUpvoted: false,
    department: "Saran Swachh Bharat Cleanliness Wing",
    timeline: [
      {
        id: "t-21",
        status: ComplaintStatus.SUBMITTED,
        date: "2026-06-29T06:15:00Z",
        notes: "Complaint filed. AI Scan triggered. Automatically routed to Sonpur Swachhata Solid Waste Management wing.",
        updatedBy: "OneBharat AI"
      }
    ]
  },
  {
    id: "OB-9031-SAR",
    category: ComplaintCategory.DRAINAGE,
    title: "Open Drain Overflowing Near Town Club Hajipur",
    description: "The main drainage conduit has been choked near Town Club Hajipur, forcing black sludge and unhygienic sewage to overflow onto the pedestrian walkway. Schoolchildren use this path daily, posing a major cholera/dengue hazard.",
    priority: ComplaintPriority.EMERGENCY,
    status: ComplaintStatus.DISPATCHED,
    location: {
      latitude: 25.6880,
      longitude: 85.2215,
      address: "Town Club Road, near Gandhi Setu, Hajipur, Vaishali, Bihar",
      ward: "Ward No. 12 (Hajipur Civil Lines)",
      district: "Vaishali",
      state: "Bihar"
    },
    images: [
      "https://images.unsplash.com/photo-1542060748-10c28b629f6f?auto=format&fit=crop&q=80&w=600"
    ],
    createdAt: "2026-06-29T09:00:00Z",
    updatedAt: "2026-06-29T09:30:00Z",
    userId: "user-881",
    userName: "Zoya Merchant",
    isAnonymous: true,
    upvotes: 56,
    hasUpvoted: false,
    department: "Hajipur Municipal Corporation (Nagar Parishad)",
    officerId: "off-204",
    officerName: "Director Sharda Devi",
    officerContact: "+91 94308 55432",
    timeline: [
      {
        id: "t-31",
        status: ComplaintStatus.SUBMITTED,
        date: "2026-06-29T09:00:00Z",
        notes: "Emergency complaint registered anonymously. Emergency protocol activated by AI due to public health risk.",
        updatedBy: "OneBharat AI"
      },
      {
        id: "t-32",
        status: ComplaintStatus.DISPATCHED,
        date: "2026-06-29T09:30:00Z",
        notes: "Assigned to Sanitation Emergency Response Team under Dir. Sharda Devi. Super-sucker vacuum machine and desilting crew dispatched.",
        updatedBy: "Nagar Parishad Control Hub"
      }
    ]
  },
  {
    id: "OB-2201-SAR",
    category: ComplaintCategory.WATER_LOGGING,
    title: "Severe Monsoonal Flooding at Sonpur Junction Underpass",
    description: "The main railway junction underpass is flooded with 3.5 feet of stagnant stormwater. Auto-rickshaws and bikes are submerged, causing complete gridlock from Sonpur Bazar to the Railway Colony.",
    priority: ComplaintPriority.EMERGENCY,
    status: ComplaintStatus.IN_PROGRESS,
    location: {
      latitude: 25.7025,
      longitude: 85.1685,
      address: "Railway Station Western Underpass Road, Sonpur, Saran, Bihar",
      ward: "Ward No. 8 (Sonpur Bazaar)",
      district: "Saran",
      state: "Bihar"
    },
    images: [
      "https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&q=80&w=600"
    ],
    createdAt: "2026-06-28T16:00:00Z",
    updatedAt: "2026-06-29T08:00:00Z",
    userId: "user-103",
    userName: "Sanjay Swamy",
    isAnonymous: false,
    upvotes: 112,
    hasUpvoted: true,
    department: "Saran District Disaster Management Authority (DDMA)",
    timeline: [
      {
        id: "t-41",
        status: ComplaintStatus.SUBMITTED,
        date: "2026-06-28T16:00:00Z",
        notes: "Emergency water logging incident filed. Priority automated to Critical due to key transportation node blockade.",
        updatedBy: "OneBharat AI"
      },
      {
        id: "t-42",
        status: ComplaintStatus.DISPATCHED,
        date: "2026-06-28T18:30:00Z",
        notes: "Assigned to Disaster Management Water Pump Division. Local traffic redirected via flyover.",
        updatedBy: "DDMA Saran Control"
      },
      {
        id: "t-43",
        status: ComplaintStatus.IN_PROGRESS,
        date: "2026-06-29T08:00:00Z",
        notes: "Two heavy-duty 50HP diesel suction pumps deployed at the underpass. Team actively removing heavy garbage plastics and silt choking the discharge pipes.",
        updatedBy: "Pump Lead Manoj Yadav"
      }
    ]
  },
  {
    id: "OB-5521-SAR",
    category: ComplaintCategory.ANIMAL_RESCUE,
    title: "Injured Stray Cow Stranded on Sonpur Academy Road",
    description: "A stray bull was struck by a fast vehicle and is sitting on the road with an injured front leg near Sonpur Academy entrance. The animal is in immense pain and blocking morning school bus access. Needs professional veterinary ambulance rescue.",
    priority: ComplaintPriority.MEDIUM,
    status: ComplaintStatus.RESOLVED,
    location: {
      latitude: 25.6912,
      longitude: 85.1795,
      address: "Sonpur Academy High School Gate, Sonpur, Saran, Bihar",
      ward: "Ward No. 4 (Sonpur)",
      district: "Saran",
      state: "Bihar"
    },
    images: [
      "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=600"
    ],
    createdAt: "2026-06-24T14:20:00Z",
    updatedAt: "2026-06-25T11:10:00Z",
    userId: "user-101",
    userName: "Niket Raj",
    isAnonymous: false,
    upvotes: 35,
    hasUpvoted: true,
    department: "Saran Government Veterinary Wing & Gau-Sewa NGO",
    timeline: [
      {
        id: "t-51",
        status: ComplaintStatus.SUBMITTED,
        date: "2026-06-24T14:20:00Z",
        notes: "Complaint filed and assigned to Veterinary response network.",
        updatedBy: "OneBharat AI"
      },
      {
        id: "t-52",
        status: ComplaintStatus.DISPATCHED,
        date: "2026-06-24T15:30:00Z",
        notes: "Veterinary Rescue Ambulance dispatched from Town Animal Hospital Saran.",
        updatedBy: "Saran Vet Hub"
      },
      {
        id: "t-53",
        status: ComplaintStatus.RESOLVED,
        date: "2026-06-25T11:10:00Z",
        notes: "The injured bull was safely bandaged, given pain relief, and loaded into the veterinary trailer. It has been transferred to the Saran Gaushala Rescue Sanctuary for complete recovery. Road blockage cleared.",
        updatedBy: "Veterinary Officer Dr. Sinha",
        evidencePhoto: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=600"
      }
    ],
    citizenRating: 5,
    citizenFeedback: "Heartfelt thanks to Dr. Sinha and Saran Gaushala volunteers! They came within 1.5 hours, treated the cow with wonderful gentleness, and safely relocated him. Magnificent work!"
  },
  {
    id: "OB-1102-SAR",
    category: ComplaintCategory.TRANSFORMER,
    title: "Continuous Sparking and Smoking Electric Transformer at Sonpur Girls High School",
    description: "The primary 250 KVA distribution transformer situated right next to the entrance of Sonpur Girls High School is sparking heavily and emitting black smoke during peak load hours. The local wire insulation is completely burnt out, presenting a high electrocution risk during rain showers. Immediate high-tension maintenance is required.",
    priority: ComplaintPriority.EMERGENCY,
    status: ComplaintStatus.IN_PROGRESS,
    location: {
      latitude: 25.6928,
      longitude: 85.1740,
      address: "Sonpur Girls High School Road, Ward No. 3, Sonpur, Saran, Bihar",
      ward: "Ward No. 3 (Sonpur Central)",
      district: "Saran",
      state: "Bihar"
    },
    images: [
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=600"
    ],
    createdAt: "2026-06-29T05:00:00Z",
    updatedAt: "2026-06-29T10:15:00Z",
    userId: "user-112",
    userName: "Ramesh Sharma",
    userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100",
    isAnonymous: false,
    upvotes: 145,
    hasUpvoted: false,
    department: "Bihar State Power Holding Company Limited (BSPHCL)",
    officerId: "off-202",
    officerName: "Engineer Amit Verma",
    officerContact: "+91 94311 00234",
    timeline: [
      {
        id: "t-61",
        status: ComplaintStatus.SUBMITTED,
        date: "2026-06-29T05:00:00Z",
        notes: "Emergency transformer ticket lodged. Priority automated to Critical due to location proximity to the educational school gate.",
        updatedBy: "OneBharat AI"
      },
      {
        id: "t-62",
        status: ComplaintStatus.DISPATCHED,
        date: "2026-06-29T06:30:00Z",
        notes: "BSPHCL Sonpur substation alerted. Assigned to Subdivisional Power Officer Amit Verma.",
        updatedBy: "Saran Power Dispatch"
      },
      {
        id: "t-63",
        status: ComplaintStatus.IN_PROGRESS,
        date: "2026-06-29T10:15:00Z",
        notes: "Emergency repair van dispatched. Linemen have temporarily disconnected the spark-prone bypass switch to avert immediate hazard while parts are fetched.",
        updatedBy: "Engineer Amit Verma"
      }
    ]
  },
  {
    id: "OB-8032-VSH",
    category: ComplaintCategory.WATER_LEAKAGE,
    title: "Major Drinking Water Pipeline Rupture on Hajipur Station Road",
    description: "A primary 6-inch underground cast-iron drinking water pipeline has burst right beneath the main asphalt lane near the Hajipur Station round-about. Thousands of liters of pressurized treated water are gushing out hourly, flooding the nearby vegetable market stalls and causing severe water pressure drops in Ward 9 households.",
    priority: ComplaintPriority.HIGH,
    status: ComplaintStatus.SUBMITTED,
    location: {
      latitude: 25.6815,
      longitude: 85.2110,
      address: "Station Road, Outer Circle Bypass, Hajipur, Vaishali, Bihar",
      ward: "Ward No. 9 (Hajipur Railway Circle)",
      district: "Vaishali",
      state: "Bihar"
    },
    images: [
      "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=600"
    ],
    createdAt: "2026-06-29T10:45:00Z",
    updatedAt: "2026-06-29T10:45:00Z",
    userId: "user-101",
    userName: "Niket Raj",
    userAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100",
    isAnonymous: false,
    upvotes: 68,
    hasUpvoted: false,
    department: "Vaishali Municipal Water & Sanitation Wing",
    timeline: [
      {
        id: "t-71",
        status: ComplaintStatus.SUBMITTED,
        date: "2026-06-29T10:45:00Z",
        notes: "Water leakage incident registered with geographic coordinates. Routed to PHED Department.",
        updatedBy: "OneBharat AI"
      }
    ]
  },
  {
    id: "OB-4491-VSH",
    category: ComplaintCategory.TREE_FALLEN,
    title: "Centennial Banyan Tree Fallen Across Hajipur Bypass Road Corridor",
    description: "A massive, century-old Banyan tree fell during yesterday evening's torrential monsoonal storm, entirely blocking both lanes of the Hajipur Bypass Road. The blockage has forced all highway vehicles to make long and congested detours through residential lanes, threatening minor structural damage to surrounding telephone and fiber cable lines.",
    priority: ComplaintPriority.HIGH,
    status: ComplaintStatus.RESOLVED,
    location: {
      latitude: 25.6872,
      longitude: 85.2195,
      address: "Bypass Main Road, Near Sector 3, Hajipur, Vaishali, Bihar",
      ward: "Ward No. 12 (Hajipur Civil Lines)",
      district: "Vaishali",
      state: "Bihar"
    },
    images: [
      "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=600"
    ],
    createdAt: "2026-06-28T19:30:00Z",
    updatedAt: "2026-06-29T09:00:00Z",
    userId: "user-301",
    userName: "Gaurav Sen",
    isAnonymous: false,
    upvotes: 95,
    hasUpvoted: true,
    department: "Hajipur Forest & Municipal Cleanliness Joint Taskforce",
    officerId: "off-204",
    officerName: "Director Sharda Devi",
    officerContact: "+91 94308 55432",
    timeline: [
      {
        id: "t-81",
        status: ComplaintStatus.SUBMITTED,
        date: "2026-06-28T19:30:00Z",
        notes: "Fallen tree complaint filed. Emergency dispatch issued.",
        updatedBy: "OneBharat AI"
      },
      {
        id: "t-82",
        status: ComplaintStatus.DISPATCHED,
        date: "2026-06-28T20:15:00Z",
        notes: "Forest department tree cutters and JCB earthmovers dispatched to the site.",
        updatedBy: "Nagar Parishad Operations"
      },
      {
        id: "t-83",
        status: ComplaintStatus.RESOLVED,
        date: "2026-06-29T09:00:00Z",
        notes: "Heavy limbs sawed and cleared. The trunk has been moved off the road shoulder. Telephone cables have been safety-spliced by linemen. Traffic is fully restored.",
        updatedBy: "Director Sharda Devi"
      }
    ],
    citizenRating: 4,
    citizenFeedback: "Good response time despite the severe stormy night. The crew cut the massive branches methodically and ensured minimal traffic impact by early morning. Thank you Sharda Devi."
  }
];

export const GENERAL_STATS = {
  activeCount: 1205,
  resolvedCount: 9812,
  avgResolutionTime: "12.8 Hours", // Down from 48h
  satisfactionRate: "95.6%",
  stateAnalytics: [
    { state: "Bihar (Saran)", total: 11017, active: 410, resolved: 10607, speed: "11.2h" },
    { state: "Bihar (Patna)", total: 28100, active: 850, resolved: 27250, speed: "14.6h" },
    { state: "Bihar (Muzaffarpur)", total: 14000, active: 440, resolved: 13560, speed: "15.8h" },
    { state: "Bihar (Gaya)", total: 9100, active: 202, resolved: 8898, speed: "16.1h" }
  ],
  categoryBreakdown: [
    { name: "Road Damage", count: 3410, color: "#FF6B00" },
    { name: "Street Light", count: 2105, color: "#FACC15" },
    { name: "Garbage", count: 2900, color: "#22C55E" },
    { name: "Water Logging", count: 1840, color: "#3B82F6" },
    { name: "Drainage & Sewage", count: 1540, color: "#A855F7" },
    { name: "Others", count: 1100, color: "#6B7280" }
  ]
};
