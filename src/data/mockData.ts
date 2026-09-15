import { Complaint, ComplaintCategory, TechnicianContact, UserProfile } from '../types';

export const INITIAL_USER: UserProfile = {
  name: 'Rahul Verma',
  email: 'rahul.verma@example.com',
  phone: '+91 98765 43210',
  address: 'Flat 402, Green Valley Apartments, Sector 18, Gurugram',
  role: 'END_USER',
};

export const QUICK_TECHNICIANS: TechnicianContact[] = [
  { name: 'Vikram Singh', phone: '+91 98111 22334', designation: 'Senior Inverter & Solar Field Engineer' },
  { name: 'Amit Patel', phone: '+91 98222 33445', designation: 'Battery & Hardware Specialist' },
  { name: 'Priya Sundaram', phone: '+91 98333 44556', designation: 'Power Grid & Wiring Inspector' },
];

export const PROBLEM_CATEGORIES: ComplaintCategory[] = [
  {
    id: 'cat-inverter-fail',
    title: 'Inverter / Power System Fault',
    icon: 'flash-outline',
    description: 'No AC power output, continuous buzzer beeping, error code on screen, or sudden power cutoff.',
    badge: 'Hardware',
  },
  {
    id: 'cat-solar-sync',
    title: 'Solar Generation & Grid Sync',
    icon: 'sunny-outline',
    description: 'Solar panels not generating power, MPPT sync failure, or generation drop during daylight.',
    badge: 'Solar PV',
  },
  {
    id: 'cat-battery-drain',
    title: 'Battery Backup & Drainage',
    icon: 'battery-dead-outline',
    description: 'Backup time drastically dropped, battery heating up, or frequent low voltage cutoff.',
    badge: 'Battery & Backup',
  },
  {
    id: 'cat-wiring-mcb',
    title: 'Wiring, MCB & Sparking',
    icon: 'git-network-outline',
    description: 'Main breaker tripping, burnt smell near switchboard, loose terminals, or sparking.',
    badge: 'Electrical Safety',
  },
  {
    id: 'cat-replacement',
    title: 'Hardware Replacement & Parts',
    icon: 'build-outline',
    description: 'Request replacement of defective motherboard, transformer, cooling fan, or battery cell.',
    badge: 'Replacement',
  },
  {
    id: 'cat-other-problem',
    title: 'Other Problem / Not Listed',
    icon: 'help-circle-outline',
    description: 'Have a different issue? Select this to freely describe and clarify your problem directly to Admin.',
    badge: 'Custom Query',
    isOther: true,
  },
];

export const INITIAL_COMPLAINTS: Complaint[] = [
  {
    id: 'INV-90214',
    title: 'Continuous alarm and Error E04 during grid cut',
    categoryId: 'cat-inverter-fail',
    categoryName: 'Inverter / Power System Fault',
    description: 'Whenever main power cuts, the inverter beeps with a red blinking LED and error E04 appears. Home appliances do not receive power.',
    productDetailsInChat: 'Model: INVERGY SolarMax Pro 5.5kVA, S/N: SM55-8942-2025',
    priority: 'Urgent',
    status: 'ADMIN_REPLIED',
    createdAt: 'Yesterday 10:30 AM',
    customerName: 'Rahul Verma',
    customerPhone: '+91 98765 43210',
    customerAddress: 'Flat 402, Green Valley Apartments, Sector 18, Gurugram',
    sharedTechnician: {
      name: 'Vikram Singh',
      phone: '+91 98111 22334',
      designation: 'Senior Inverter & Solar Field Engineer',
    },
    messages: [
      {
        id: 'msg-1',
        senderRole: 'END_USER',
        senderName: 'Rahul Verma',
        text: 'Hello Admin, my inverter is constantly beeping and showing error code E04. Could you please check what this means?',
        timestamp: 'Yesterday 10:30 AM',
      },
      {
        id: 'msg-2',
        senderRole: 'ADMIN',
        senderName: 'INVERGY Admin Support',
        text: 'Hello Rahul. Error code E04 indicates an internal MOSFET bridge overload. Please turn OFF the front power switch right now to prevent heating. Could you share your inverter model or serial number here in chat so we can pull your warranty?',
        timestamp: 'Yesterday 10:45 AM',
      },
      {
        id: 'msg-3',
        senderRole: 'END_USER',
        senderName: 'Rahul Verma',
        text: 'Turned off the switch! The model sticker on the side says: INVERGY SolarMax Pro 5.5kVA, S/N: SM55-8942-2025.',
        timestamp: 'Yesterday 11:00 AM',
      },
      {
        id: 'msg-4',
        senderRole: 'ADMIN',
        senderName: 'INVERGY Admin Support',
        text: 'Thank you for the model details! Your 5.5kVA unit is under full free warranty. I have assigned our Senior Field Engineer Vikram Singh to visit your address tomorrow morning at 11 AM with a replacement driver board. You can call him directly at the number below.',
        timestamp: 'Yesterday 11:15 AM',
        technicianShared: {
          name: 'Vikram Singh',
          phone: '+91 98111 22334',
          designation: 'Senior Inverter & Solar Field Engineer',
        },
      },
      {
        id: 'msg-5',
        senderRole: 'END_USER',
        senderName: 'Rahul Verma',
        text: 'Thank you Admin! I have noted Vikram\'s number and will keep the unit accessible for him tomorrow at 11 AM.',
        timestamp: 'Yesterday 11:30 AM',
      },
    ],
  },
  {
    id: 'INV-88301',
    title: 'High-pitch buzzing sound near main distribution board',
    categoryId: 'cat-other-problem',
    categoryName: 'Other Problem / Not Listed',
    customProblemDetails: 'Unusual high pitch frequency sound and mild warm smell coming from the bypass junction box during peak sunshine.',
    description: 'Unusual high pitch frequency sound and mild warm smell coming from the bypass junction box during peak sunshine.',
    productDetailsInChat: 'Solar rooftop 3kW system with external AC/DC isolator box',
    priority: 'Critical',
    status: 'ADMIN_REPLIED',
    createdAt: 'Today 09:15 AM',
    customerName: 'Rahul Verma',
    customerPhone: '+91 98765 43210',
    customerAddress: 'Flat 402, Green Valley Apartments, Sector 18, Gurugram',
    sharedTechnician: {
      name: 'Priya Sundaram',
      phone: '+91 98333 44556',
      designation: 'Power Grid & Wiring Inspector',
    },
    messages: [
      {
        id: 'msg-21',
        senderRole: 'END_USER',
        senderName: 'Rahul Verma',
        text: 'I selected Other Problem: There is an unusual loud buzzing sound and slight warm smell from the solar bypass box on the wall.',
        timestamp: 'Today 09:15 AM',
      },
      {
        id: 'msg-22',
        senderRole: 'ADMIN',
        senderName: 'INVERGY Admin Support',
        text: 'Safety Alert: A buzzing sound with heat near the junction box can be a loose contact or arching terminal. Please trip the solar DC isolator switch if safe to reach. I am dispatching our wiring specialist Priya Sundaram immediately.',
        timestamp: 'Today 09:25 AM',
        technicianShared: {
          name: 'Priya Sundaram',
          phone: '+91 98333 44556',
          designation: 'Power Grid & Wiring Inspector',
        },
      },
    ],
  },
];
