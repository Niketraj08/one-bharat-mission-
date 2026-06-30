/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum ComplaintCategory {
  ROAD_DAMAGE = "Road Damage",
  STREET_LIGHT = "Street Light",
  GARBAGE = "Garbage",
  WATER_LEAKAGE = "Water Leakage",
  DRAINAGE = "Drainage",
  ELECTRICITY = "Electricity",
  TRANSFORMER = "Transformer",
  ILLEGAL_PARKING = "Illegal Parking",
  BROKEN_FOOTPATH = "Broken Footpath",
  TRAFFIC_SIGNAL = "Traffic Signal",
  ANIMAL_RESCUE = "Animal Rescue",
  TREE_FALLEN = "Tree Fallen",
  CONSTRUCTION_WASTE = "Construction Waste",
  NOISE_POLLUTION = "Noise Pollution",
  PUBLIC_TOILET = "Public Toilet",
  FLOOD = "Flood",
  SEWAGE_OVERFLOW = "Sewage Overflow",
  ILLEGAL_DUMPING = "Illegal Dumping",
  GOVT_PROPERTY_DAMAGE = "Government Property Damage",
  WATER_LOGGING = "Water Logging",
  OTHERS = "Others"
}

export enum ComplaintPriority {
  LOW = "Low",
  MEDIUM = "Medium",
  HIGH = "High",
  EMERGENCY = "Emergency"
}

export enum ComplaintStatus {
  SUBMITTED = "Submitted",
  DISPATCHED = "Dispatched",
  IN_PROGRESS = "In Progress",
  RESOLVED = "Resolved",
  CLOSED = "Closed"
}

export enum UserRole {
  CITIZEN = "Citizen",
  OFFICER = "Officer",
  ADMIN = "Admin"
}

export interface LocationData {
  latitude: number;
  longitude: number;
  address: string;
  ward: string;
  district: string;
  state: string;
}

export interface TimelineEvent {
  id: string;
  status: ComplaintStatus;
  date: string;
  notes: string;
  updatedBy: string;
  evidencePhoto?: string;
}

export interface Complaint {
  id: string;
  category: ComplaintCategory | string;
  title: string;
  description: string;
  voiceDescription?: string; // Base64 or mock voice indicator
  priority: ComplaintPriority;
  status: ComplaintStatus;
  location: LocationData;
  images: string[]; // Base64 or placeholder URLs
  video?: string; // Optional mock video URL or base64 indicator
  createdAt: string;
  updatedAt: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  isAnonymous: boolean;
  upvotes: number;
  hasUpvoted?: boolean;
  department: string;
  officerId?: string;
  officerName?: string;
  officerContact?: string;
  timeline: TimelineEvent[];
  citizenRating?: number;
  citizenFeedback?: string;
  duplicateOf?: string; // ID of duplicate if detected
}

export interface CitizenProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  score: number; // Citizen Civic Score
  achievements: {
    id: string;
    title: string;
    description: string;
    icon: string;
    dateEarned: string;
  }[];
  savedLocations: {
    id: string;
    label: string;
    address: string;
    lat: number;
    lng: number;
  }[];
}

export interface OfficerProfile {
  id: string;
  name: string;
  department: string;
  badgeNumber: string;
  rating: number;
  resolvedCount: number;
  assignedCount: number;
  avatar: string;
}
