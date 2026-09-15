import React, { createContext, useContext, useState } from 'react';
import {
  Complaint,
  ComplaintCategory,
  ComplaintMessage,
  ComplaintStatus,
  PriorityLevel,
  TechnicianContact,
  UserProfile,
  UserRole,
} from '../types';
import { INITIAL_COMPLAINTS, INITIAL_USER } from '../data/mockData';

export type UserTab = 'HELP_SUPPORT' | 'PROFILE';

export type ScreenView =
  | 'USER_MAIN'          // Contains User tabs (Help & Support / Profile)
  | 'CATEGORY_SELECT'
  | 'RAISE_COMPLAINT'
  | 'COMPLAINT_DETAIL'
  | 'ADMIN_HOME'
  | 'AUTH';

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  user: UserProfile;
  setUser: (user: UserProfile) => void;
  userTab: UserTab;
  setUserTab: (tab: UserTab) => void;
  currentScreen: ScreenView;
  setCurrentScreen: (screen: ScreenView) => void;
  complaints: Complaint[];
  selectedCategory: ComplaintCategory | null;
  setSelectedCategory: (cat: ComplaintCategory | null) => void;
  activeComplaintId: string | null;
  setActiveComplaintId: (id: string | null) => void;
  activeComplaint: Complaint | undefined;

  // Actions
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  createComplaint: (data: {
    title: string;
    description: string;
    priority: PriorityLevel;
    customProblemDetails?: string;
  }) => string;
  sendUserReply: (complaintId: string, text: string) => void;
  sendAdminReply: (
    complaintId: string,
    replyText: string,
    technicianShared?: TechnicianContact,
    newStatus?: ComplaintStatus
  ) => void;
  switchRole: (newRole: UserRole) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>('END_USER');
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [userTab, setUserTab] = useState<UserTab>('HELP_SUPPORT');
  const [currentScreen, setCurrentScreen] = useState<ScreenView>('USER_MAIN');
  const [complaints, setComplaints] = useState<Complaint[]>(INITIAL_COMPLAINTS);
  const [selectedCategory, setSelectedCategory] = useState<ComplaintCategory | null>(null);
  const [activeComplaintId, setActiveComplaintId] = useState<string | null>(INITIAL_COMPLAINTS[0]?.id ?? null);

  const activeComplaint = complaints.find((c) => c.id === activeComplaintId);

  const switchRole = (newRole: UserRole) => {
    setRole(newRole);
    if (newRole === 'END_USER') {
      setCurrentScreen('USER_MAIN');
    } else {
      setCurrentScreen('ADMIN_HOME');
    }
  };

  const updateUserProfile = (updated: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...updated }));
  };

  const createComplaint = (data: {
    title: string;
    description: string;
    priority: PriorityLevel;
    customProblemDetails?: string;
  }): string => {
    const newId = `INV-${Math.floor(10000 + Math.random() * 90000)}`;
    const timeString = 'Just now';

    const newComplaint: Complaint = {
      id: newId,
      title: data.title,
      categoryId: selectedCategory ? selectedCategory.id : 'cat-other-problem',
      categoryName: selectedCategory ? selectedCategory.title : 'Other Problem / Not Listed',
      customProblemDetails: data.customProblemDetails,
      description: data.description,
      priority: data.priority,
      status: 'PENDING_ADMIN_REPLY',
      createdAt: timeString,
      customerName: user.name,
      customerPhone: user.phone,
      customerAddress: user.address,
      messages: [
        {
          id: `msg-${Date.now()}`,
          senderRole: 'END_USER',
          senderName: user.name,
          text: data.customProblemDetails
            ? `Problem Details: ${data.customProblemDetails}\n\nNotes: ${data.description}`
            : data.description,
          timestamp: timeString,
        },
      ],
    };

    setComplaints((prev) => [newComplaint, ...prev]);
    setActiveComplaintId(newId);
    setCurrentScreen('COMPLAINT_DETAIL');
    return newId;
  };

  const sendUserReply = (complaintId: string, text: string) => {
    if (!text.trim()) return;
    const timeString = 'Just now';
    const newMsg: ComplaintMessage = {
      id: `msg-${Date.now()}`,
      senderRole: 'END_USER',
      senderName: user.name,
      text: text.trim(),
      timestamp: timeString,
    };

    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id !== complaintId) return c;
        return {
          ...c,
          status: c.status === 'RESOLVED' ? 'PENDING_ADMIN_REPLY' : c.status,
          messages: [...c.messages, newMsg],
        };
      })
    );
  };

  const sendAdminReply = (
    complaintId: string,
    replyText: string,
    technicianShared?: TechnicianContact,
    newStatus?: ComplaintStatus
  ) => {
    if (!replyText.trim() && !technicianShared) return;
    const timeString = 'Just now';

    const newMsg: ComplaintMessage = {
      id: `msg-${Date.now()}`,
      senderRole: 'ADMIN',
      senderName: 'INVERGY Admin Support',
      text: replyText.trim(),
      timestamp: timeString,
      technicianShared,
    };

    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id !== complaintId) return c;

        const updatedStatus = newStatus || (technicianShared ? 'REPAIR_REPLACEMENT_IN_PROGRESS' : 'ADMIN_REPLIED');

        return {
          ...c,
          status: updatedStatus,
          sharedTechnician: technicianShared || c.sharedTechnician,
          messages: [...c.messages, newMsg],
        };
      })
    );
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        user,
        setUser,
        userTab,
        setUserTab,
        currentScreen,
        setCurrentScreen,
        complaints,
        selectedCategory,
        setSelectedCategory,
        activeComplaintId,
        setActiveComplaintId,
        activeComplaint,
        updateUserProfile,
        createComplaint,
        sendUserReply,
        sendAdminReply,
        switchRole,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
