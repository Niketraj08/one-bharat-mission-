/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from "react";
import { Complaint, ComplaintCategory, ComplaintPriority, ComplaintStatus, UserRole, CitizenProfile } from "../types";
import { INITIAL_COMPLAINTS, MOCK_CITIZEN } from "../data";

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  complaints: Complaint[];
  setComplaints: React.Dispatch<React.SetStateAction<Complaint[]>>;
  addComplaint: (complaint: Omit<Complaint, "id" | "createdAt" | "updatedAt" | "upvotes" | "timeline">) => Complaint;
  upvoteComplaint: (id: string) => void;
  updateComplaintStatus: (id: string, status: ComplaintStatus, notes: string, officerName: string, photo?: string) => void;
  submitFeedback: (id: string, rating: number, feedback: string) => void;
  citizenProfile: CitizenProfile;
  setCitizenProfile: React.Dispatch<React.SetStateAction<CitizenProfile>>;
  notifications: { id: string; title: string; message: string; time: string; read: boolean; type: "info" | "success" | "warning" | "alert" }[];
  addNotification: (title: string, message: string, type: "info" | "success" | "warning" | "alert") => void;
  markNotificationsAsRead: () => void;
  markNotificationAsRead: (id: string) => void;
  activeCity: string;
  setActiveCity: (city: string) => void;
  selectedComplaintId: string | null;
  setSelectedComplaintId: (id: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<UserRole>(() => {
    const saved = localStorage.getItem("onebharat_role");
    return (saved as UserRole) || UserRole.CITIZEN;
  });

  const [complaints, setComplaints] = useState<Complaint[]>(() => {
    const saved = localStorage.getItem("onebharat_complaints");
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Complaint[];
        const missing = INITIAL_COMPLAINTS.filter(c => !parsed.some(p => p.id === c.id));
        if (missing.length > 0) {
          return [...parsed, ...missing];
        }
        return parsed;
      } catch (e) {
        console.error("Error parsing local complaints, reloading defaults", e);
      }
    }
    return INITIAL_COMPLAINTS;
  });

  const [citizenProfile, setCitizenProfile] = useState<CitizenProfile>(() => {
    const saved = localStorage.getItem("onebharat_citizen_profile");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error parsing profile, reloading defaults", e);
      }
    }
    return MOCK_CITIZEN;
  });

  const [notifications, setNotifications] = useState<
    { id: string; title: string; message: string; time: string; read: boolean; type: "info" | "success" | "warning" | "alert" }[]
  >(() => {
    return [
      {
        id: "not-1",
        title: "Welcome to OneBharat 2.0",
        message: "Your profile has been fully synchronized with India's Smart Cities database.",
        time: "Just Now",
        read: true,
        type: "success"
      },
      {
        id: "not-2",
        title: "Complaint Resolved!",
        message: "MCD Electrical Division has fixed the defunct streetlights at Defence Colony.",
        time: "2 Hours Ago",
        read: true,
        type: "info"
      },
      {
        id: "not-3",
        title: "Heavy Rainfall Warning",
        message: "NDMA warning: Avoid low-lying underpasses in Western Suburbs due to logging.",
        time: "5 Hours Ago",
        read: true,
        type: "alert"
      }
    ];
  });

  const [activeCity, setActiveCity] = useState("All India");
  const [selectedComplaintId, setSelectedComplaintId] = useState<string | null>(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem("onebharat_role", role);
  }, [role]);

  useEffect(() => {
    localStorage.setItem("onebharat_complaints", JSON.stringify(complaints));
  }, [complaints]);

  useEffect(() => {
    localStorage.setItem("onebharat_citizen_profile", JSON.stringify(citizenProfile));
  }, [citizenProfile]);

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    addNotification(
      `Switched View: ${newRole}`,
      `You are now viewing the application as a ${newRole === UserRole.CITIZEN ? "Citizen" : newRole === UserRole.OFFICER ? "Ward Officer" : "Nodal Admin"}.`,
      "info"
    );
  };

  const addNotification = (title: string, message: string, type: "info" | "success" | "warning" | "alert") => {
    const randomSuffix = Math.random().toString(36).substring(2, 9);
    const newNotif = {
      id: `not-${Date.now()}-${randomSuffix}`,
      title,
      message,
      time: "Just Now",
      read: false,
      type
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const markNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const addComplaint = (newCompData: Omit<Complaint, "id" | "createdAt" | "updatedAt" | "upvotes" | "timeline">) => {
    const timeStr = new Date().toISOString();
    const id = `OB-${Math.floor(1000 + Math.random() * 9000)}-${newCompData.location.state.substring(0, 3).toUpperCase()}`;

    // Auto-predicting priorities & duplicates if category matches
    let adjustedPriority = newCompData.priority;
    if (newCompData.category === ComplaintCategory.FLOOD || newCompData.category === ComplaintCategory.SEWAGE_OVERFLOW) {
      adjustedPriority = ComplaintPriority.EMERGENCY;
    }

    const newComplaint: Complaint = {
      ...newCompData,
      id,
      priority: adjustedPriority,
      upvotes: 0,
      createdAt: timeStr,
      updatedAt: timeStr,
      timeline: [
        {
          id: "t-" + Date.now() + "-1",
          status: ComplaintStatus.SUBMITTED,
          date: timeStr,
          notes: `Complaint filed successfully by ${newCompData.isAnonymous ? "Anonymous Citizen" : newCompData.userName}. AI assigned to department: '${newCompData.department}' with High Priority.`,
          updatedBy: "OneBharat AI engine"
        }
      ]
    };

    setComplaints((prev) => [newComplaint, ...prev]);

    // Update citizen profile score and achievements on filing!
    setCitizenProfile((prev) => {
      const updatedScore = Math.min(1000, prev.score + 20); // Get 20 points for filing civic issue
      return {
        ...prev,
        score: updatedScore
      };
    });

    addNotification(
      "Civic Action Lodged",
      `Issue filed as ${id}. Thank you for making our city safer. Civic Score: +20 points!`,
      "success"
    );

    return newComplaint;
  };

  const upvoteComplaint = (id: string) => {
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const alreadyUpvoted = c.hasUpvoted;
          const delta = alreadyUpvoted ? -1 : 1;
          return {
            ...c,
            upvotes: c.upvotes + delta,
            hasUpvoted: !alreadyUpvoted
          };
        }
        return c;
      })
    );
  };

  const updateComplaintStatus = (id: string, status: ComplaintStatus, notes: string, officerName: string, photo?: string) => {
    const timeStr = new Date().toISOString();
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const newEvent = {
            id: "t-" + Date.now(),
            status,
            date: timeStr,
            notes,
            updatedBy: officerName,
            evidencePhoto: photo
          };
          return {
            ...c,
            status,
            updatedAt: timeStr,
            timeline: [...c.timeline, newEvent]
          };
        }
        return c;
      })
    );

    // Send notifications to citizen
    const targetComp = complaints.find((c) => c.id === id);
    if (targetComp) {
      addNotification(
        `Update on ${id}`,
        `Your complaint about ${targetComp.category} is now '${status}': ${notes}`,
        status === ComplaintStatus.RESOLVED ? "success" : "info"
      );
    }
  };

  const submitFeedback = (id: string, rating: number, feedback: string) => {
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          return {
            ...c,
            status: ComplaintStatus.CLOSED,
            citizenRating: rating,
            citizenFeedback: feedback,
            timeline: [
              ...c.timeline,
              {
                id: "t-" + Date.now(),
                status: ComplaintStatus.CLOSED,
                date: new Date().toISOString(),
                notes: `Citizen rated resolution ${rating}/5 stars. Feedback: "${feedback}". Case resolved and archived.`,
                updatedBy: "Citizen Portal"
              }
            ]
          };
        }
        return c;
      })
    );

    // Boost score for feedback
    setCitizenProfile((prev) => ({
      ...prev,
      score: Math.min(1000, prev.score + 15)
    }));

    addNotification(
      "Feedback Submitted",
      "Case closed. Your civic feedback helps optimize officer routing performance.",
      "success"
    );
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        complaints,
        setComplaints,
        addComplaint,
        upvoteComplaint,
        updateComplaintStatus,
        submitFeedback,
        citizenProfile,
        setCitizenProfile,
        notifications,
        addNotification,
        markNotificationsAsRead,
        markNotificationAsRead,
        activeCity,
        setActiveCity,
        selectedComplaintId,
        setSelectedComplaintId
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
