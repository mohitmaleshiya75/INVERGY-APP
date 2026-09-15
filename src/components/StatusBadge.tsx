import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ComplaintStatus, PriorityLevel } from '../types';

interface StatusBadgeProps {
  status: ComplaintStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'REGISTERED':
        return { label: 'Ticket Raised', bg: '#FEF3C7', text: '#D97706', border: '#FDE68A' };
      case 'ADMIN_REPLIED':
        return { label: 'Admin Replied', bg: '#E0F2FE', text: '#0284C7', border: '#BAE6FD' };
      case 'ASSIGNED_EMPLOYEE':
        return { label: 'Technician Assigned', bg: '#EDE9FE', text: '#7C3AED', border: '#DDD6FE' };
      case 'REPAIR_SCHEDULED':
        return { label: 'Visit Scheduled', bg: '#FEE2E2', text: '#DC2626', border: '#FECACA' };
      case 'REPLACEMENT_ORDERED':
        return { label: 'Part Dispatched', bg: '#FEF9C3', text: '#CA8A04', border: '#FEF08A' };
      case 'REPAIR_IN_PROGRESS':
        return { label: 'Repair in Progress', bg: '#FFEDD5', text: '#EA580C', border: '#FED7AA' };
      case 'REPAIR_REPLACEMENT_DONE':
        return { label: 'Repaired & Replaced', bg: '#DCFCE7', text: '#16A34A', border: '#BBF7D0' };
      case 'RESOLVED':
        return { label: 'Resolved & Closed', bg: '#D1FAE5', text: '#059669', border: '#A7F3D0' };
      default:
        return { label: status, bg: '#F1F5F9', text: '#475569', border: '#E2E8F0' };
    }
  };

  const config = getStatusConfig();

  return (
    <View style={[styles.badge, { backgroundColor: config.bg, borderColor: config.border }]}>
      <View style={[styles.dot, { backgroundColor: config.text }]} />
      <Text style={[styles.badgeText, { color: config.text }]}>{config.label}</Text>
    </View>
  );
};

export const PriorityBadge: React.FC<{ priority: PriorityLevel }> = ({ priority }) => {
  const getColor = () => {
    switch (priority) {
      case 'Critical':
        return { bg: '#FEE2E2', text: '#B91C1C' };
      case 'Urgent':
        return { bg: '#FFEDD5', text: '#C2410C' };
      case 'Medium':
        return { bg: '#FEF3C7', text: '#B45309' };
      case 'Low':
        return { bg: '#E0F2FE', text: '#0369A1' };
    }
  };

  const col = getColor();
  return (
    <View style={[styles.priorityBadge, { backgroundColor: col.bg }]}>
      <Text style={[styles.priorityText, { color: col.text }]}>{priority}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  priorityText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
});
