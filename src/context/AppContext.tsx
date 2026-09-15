import React, { createContext, useContext, useState } from 'react';
import {
  Complaint,
  ComplaintCategory,
  ComplaintMessage,
  ComplaintStatus,
  PriorityLevel,
  UserProfile,
  UserRole,
} from '../types';
import {
  AVAILABLE_EMPLOYEES,
  INITIAL_COMPLAINTS,
  INITIAL_USER,
} from '../data/mockData';

export type ScreenView =
  | 'AUTH'
  | 'USER_HOME'
  | 'CATEGORY_SELECT'
  | 'RAISE_COMPLAINT'
  | 'COMPLAINT_DETAIL'
  | 'ADMIN_HOME'
  | 'ADMIN_DETAIL'
  | 'EMPLOYEE_HOME'
  | 'EMPLOYEE_DETAIL';

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  user: UserProfile;
  setUser: (user: UserProfile) => void;
  currentScreen: ScreenView;
  setCurrentScreen: (screen: ScreenView) => void;
  complaints: Complaint[];
  selectedCategory: ComplaintCategory | null;
  setSelectedCategory: (cat: ComplaintCategory | null) => void;
  activeComplaintId: string | null;
  setActiveComplaintId: (id: string | null) => void;
  activeComplaint: Complaint | undefined;

  // Actions
  registerAndLogin: (profile: UserProfile) => void;
  createComplaint: (data: {
    title: string;
    description: string;
    priority: PriorityLevel;
    deviceModel: string;
    serialNumber: string;
  }) => string;
  sendUserReply: (complaintId: string, text: string) => void;
  sendAdminReply: (
    complaintId: string,
    replyText: string,
    assignEmployeeId?: string,
    approveReplacement?: boolean,
    replacementPartName?: string
  ) => void;
  submitEmployeeResolution: (
    complaintId: string,
    data: {
      diagnosticNotes: string;
      actionTaken: string;
      replacementDone: boolean;
      markCompleted: boolean;
    }
  ) => void;
  switchRoleAndNavigate: (newRole: UserRole) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>('END_USER');
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [currentScreen, setCurrentScreen] = useState<ScreenView>('USER_HOME');
  const [complaints, setComplaints] = useState<Complaint[]>(INITIAL_COMPLAINTS);
  const [selectedCategory, setSelectedCategory] = useState<ComplaintCategory | null>(null);
  const [activeComplaintId, setActiveComplaintId] = useState<string | null>(INITIAL_COMPLAINTS[0]?.id ?? null);

  const activeComplaint = complaints.find((c) => c.id === activeComplaintId);

  const switchRoleAndNavigate = (newRole: UserRole) => {
    setRole(newRole);
    if (newRole === 'END_USER') {
      setCurrentScreen('USER_HOME');
    } else if (newRole === 'ADMIN') {
      setCurrentScreen('ADMIN_HOME');
    } else if (newRole === 'EMPLOYEE') {
      setCurrentScreen('EMPLOYEE_HOME');
    }
  };

  const registerAndLogin = (profile: UserProfile) => {
    setUser(profile);
    setRole(profile.role);
    if (profile.role === 'END_USER') setCurrentScreen('USER_HOME');
    else if (profile.role === 'ADMIN') setCurrentScreen('ADMIN_HOME');
    else setCurrentScreen('EMPLOYEE_HOME');
  };

  const createComplaint = (data: {
    title: string;
    description: string;
    priority: PriorityLevel;
    deviceModel: string;
    serialNumber: string;
  }): string => {
    const newId = `INV-${Math.floor(10000 + Math.random() * 90000)}`;
    const now = new Date();
    const timeString = 'Just now';

    const newComplaint: Complaint = {
      id: newId,
      title: data.title,
      categoryId: selectedCategory ? selectedCategory.id : 'cat-general',
      categoryName: selectedCategory ? selectedCategory.title : 'General Equipment Service',
      deviceModel: data.deviceModel || user.inverterModel,
      serialNumber: data.serialNumber || user.serialNumber,
      description: data.description,
      priority: data.priority,
      status: 'REGISTERED',
      createdAt: timeString,
      customerName: user.name,
      customerPhone: user.phone,
      customerAddress: user.address,
      messages: [
        {
          id: `msg-${Date.now()}`,
          senderRole: 'END_USER',
          senderName: user.name,
          text: data.description,
          timestamp: timeString,
        },
      ],
      replacement: {
        required: selectedCategory?.id === 'cat-part-replacement',
        partName: selectedCategory?.id === 'cat-part-replacement' ? 'Module / Board Replacement' : 'Inspection Pending',
        partNumber: 'TBD-BY-TECHNICIAN',
        status: selectedCategory?.id === 'cat-part-replacement' ? 'PENDING_ADMIN_APPROVAL' : 'NOT_REQUIRED',
        isUnderWarranty: true,
        costEstimate: 'Under Warranty Verification',
      },
      repair: {
        diagnosticNotes: 'Awaiting initial diagnostic assignment.',
        actionTaken: '',
        replacementDone: false,
      },
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
          messages: [...c.messages, newMsg],
        };
      })
    );
  };

  const sendAdminReply = (
    complaintId: string,
    replyText: string,
    assignEmployeeId?: string,
    approveReplacement?: boolean,
    replacementPartName?: string
  ) => {
    if (!replyText.trim()) return;
    const timeString = 'Just now';
    const newMsg: ComplaintMessage = {
      id: `msg-${Date.now()}`,
      senderRole: 'ADMIN',
      senderName: 'Admin Operations',
      text: replyText.trim(),
      timestamp: timeString,
    };

    const employee = AVAILABLE_EMPLOYEES.find((e) => e.id === assignEmployeeId);

    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id !== complaintId) return c;

        let nextStatus: ComplaintStatus = 'ADMIN_REPLIED';
        if (employee) {
          nextStatus = 'ASSIGNED_EMPLOYEE';
        }

        const updatedReplacement = { ...c.replacement };
        if (approveReplacement) {
          updatedReplacement.required = true;
          updatedReplacement.status = 'APPROVED';
          updatedReplacement.approvedBy = 'Admin Operations';
          if (replacementPartName) {
            updatedReplacement.partName = replacementPartName;
          }
        }

        const updatedRepair = { ...c.repair };
        if (employee) {
          updatedRepair.technicianId = employee.id;
          updatedRepair.technicianName = employee.name;
          updatedRepair.technicianPhone = employee.phone;
          updatedRepair.scheduledDate = 'Tomorrow 11:00 AM';
        }

        return {
          ...c,
          status: nextStatus,
          messages: [...c.messages, newMsg],
          replacement: updatedReplacement,
          repair: updatedRepair,
        };
      })
    );
  };

  const submitEmployeeResolution = (
    complaintId: string,
    data: {
      diagnosticNotes: string;
      actionTaken: string;
      replacementDone: boolean;
      markCompleted: boolean;
    }
  ) => {
    const timeString = 'Just now';
    const completionNote = data.markCompleted
      ? `Task marked as COMPLETED. Diagnostics: ${data.diagnosticNotes}. Action: ${data.actionTaken}. Replacement executed: ${data.replacementDone ? 'YES' : 'NO'}.`
      : `Update logged: ${data.diagnosticNotes}. Action in progress: ${data.actionTaken}`;

    const newMsg: ComplaintMessage = {
      id: `msg-${Date.now()}`,
      senderRole: 'EMPLOYEE',
      senderName: 'Vikram Singh (Technician)',
      text: completionNote,
      timestamp: timeString,
      isActionLog: true,
    };

    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id !== complaintId) return c;

        const newStatus: ComplaintStatus = data.markCompleted
          ? 'REPAIR_REPLACEMENT_DONE'
          : 'REPAIR_IN_PROGRESS';

        const updatedReplacement = { ...c.replacement };
        if (data.replacementDone) {
          updatedReplacement.status = 'INSTALLED';
        }

        const updatedRepair = {
          ...c.repair,
          diagnosticNotes: data.diagnosticNotes || c.repair.diagnosticNotes,
          actionTaken: data.actionTaken || c.repair.actionTaken,
          replacementDone: data.replacementDone,
          completedAt: data.markCompleted ? timeString : undefined,
        };

        return {
          ...c,
          status: newStatus,
          messages: [...c.messages, newMsg],
          replacement: updatedReplacement,
          repair: updatedRepair,
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
        currentScreen,
        setCurrentScreen,
        complaints,
        selectedCategory,
        setSelectedCategory,
        activeComplaintId,
        setActiveComplaintId,
        activeComplaint,
        registerAndLogin,
        createComplaint,
        sendUserReply,
        sendAdminReply,
        submitEmployeeResolution,
        switchRoleAndNavigate,
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
