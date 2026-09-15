export type UserRole = 'END_USER' | 'ADMIN';

export type PriorityLevel = 'Low' | 'Medium' | 'Urgent' | 'Critical';

export type ComplaintStatus =
  | 'PENDING_ADMIN_REPLY'               // Raised by user, waiting for Admin
  | 'ADMIN_REPLIED'                     // Admin replied (may include technician contact)
  | 'REPAIR_REPLACEMENT_IN_PROGRESS'    // Technician working / parts replacement
  | 'RESOLVED';                         // Query & repair resolved

export interface TechnicianContact {
  name: string;
  phone: string;
  designation?: string;
}

export interface ComplaintMessage {
  id: string;
  senderRole: UserRole;
  senderName: string;
  text: string;
  timestamp: string;
  technicianShared?: TechnicianContact;
}

export interface ComplaintCategory {
  id: string;
  title: string;
  icon: string;
  description: string;
  badge: string;
  isOther?: boolean;
}

export interface Complaint {
  id: string;
  title: string;
  categoryId: string;
  categoryName: string;
  customProblemDetails?: string;
  productDetailsInChat?: string;
  description: string;
  priority: PriorityLevel;
  status: ComplaintStatus;
  createdAt: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  sharedTechnician?: TechnicianContact;
  messages: ComplaintMessage[];
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
  role: UserRole;
}
