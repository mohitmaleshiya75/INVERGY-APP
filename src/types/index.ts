export type UserRole = 'END_USER' | 'EMPLOYEE' | 'ADMIN';

export type PriorityLevel = 'Low' | 'Medium' | 'Urgent' | 'Critical';

export type ComplaintStatus =
  | 'REGISTERED'               // Complaint raised by user
  | 'ADMIN_REPLIED'             // Admin replied to complaint
  | 'ASSIGNED_EMPLOYEE'         // Admin assigned to technician
  | 'REPAIR_SCHEDULED'          // Field visit scheduled
  | 'REPLACEMENT_ORDERED'       // Replacement part requested/approved
  | 'REPAIR_IN_PROGRESS'        // Technician on site repairing
  | 'REPAIR_REPLACEMENT_DONE'   // Replacement & repair completed
  | 'RESOLVED';                 // Final closure

export interface ComplaintMessage {
  id: string;
  senderRole: UserRole;
  senderName: string;
  text: string;
  timestamp: string;
  isActionLog?: boolean;
}

export interface ReplacementInfo {
  required: boolean;
  partName: string;
  partNumber: string;
  status: 'NOT_REQUIRED' | 'PENDING_ADMIN_APPROVAL' | 'APPROVED' | 'DISPATCHED' | 'INSTALLED';
  isUnderWarranty: boolean;
  approvedBy?: string;
  costEstimate?: string;
}

export interface RepairInfo {
  technicianId?: string;
  technicianName?: string;
  technicianPhone?: string;
  scheduledDate?: string;
  diagnosticNotes?: string;
  actionTaken?: string;
  replacementDone?: boolean;
  completedAt?: string;
}

export interface ComplaintCategory {
  id: string;
  title: string;
  icon: string;
  description: string;
  badge: string;
  commonIssues: string[];
}

export interface Complaint {
  id: string;
  title: string;
  categoryId: string;
  categoryName: string;
  deviceModel: string;
  serialNumber: string;
  description: string;
  priority: PriorityLevel;
  status: ComplaintStatus;
  createdAt: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  messages: ComplaintMessage[];
  replacement: ReplacementInfo;
  repair: RepairInfo;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
  inverterModel: string;
  serialNumber: string;
  role: UserRole;
}
