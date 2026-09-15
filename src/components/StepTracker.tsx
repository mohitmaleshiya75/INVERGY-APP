import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ComplaintStatus, ReplacementInfo, RepairInfo } from '../types';

interface StepTrackerProps {
  status: ComplaintStatus;
  replacement: ReplacementInfo;
  repair: RepairInfo;
}

export const StepTracker: React.FC<StepTrackerProps> = ({
  status,
  replacement,
  repair,
}) => {
  // Determine current step index (0-based)
  // Step 0: Registered (Complaint Raised)
  // Step 1: Admin Review & Replied
  // Step 2: Employee/Technician Assigned & Inspection
  // Step 3: Replacement Approved & Sourced
  // Step 4: Repair & Replacement Completed
  const getStepIndex = (): number => {
    switch (status) {
      case 'REGISTERED':
        return 0;
      case 'ADMIN_REPLIED':
        return 1;
      case 'ASSIGNED_EMPLOYEE':
      case 'REPAIR_SCHEDULED':
        return 2;
      case 'REPLACEMENT_ORDERED':
        return 3;
      case 'REPAIR_IN_PROGRESS':
        return replacement.required && replacement.status === 'APPROVED' ? 3 : 2;
      case 'REPAIR_REPLACEMENT_DONE':
      case 'RESOLVED':
        return 4;
      default:
        return 0;
    }
  };

  const currentIndex = getStepIndex();

  const steps = [
    {
      title: 'Complaint Registered',
      sub: 'Raised by End User with device details',
      icon: 'document-text-outline' as const,
    },
    {
      title: 'Admin Replied & Triaged',
      sub: 'Admin evaluated fault & provided guidance',
      icon: 'chatbubble-ellipses-outline' as const,
    },
    {
      title: 'Technician Assigned',
      sub: repair.technicianName
        ? `Field specialist: ${repair.technicianName}`
        : 'Assigned to field engineering department',
      icon: 'person-add-outline' as const,
    },
    {
      title: 'Hardware Replacement',
      sub: replacement.required
        ? `Part: ${replacement.partName} (${replacement.status})`
        : 'Diagnostic review (Component level fix)',
      icon: 'hardware-chip-outline' as const,
    },
    {
      title: 'Repair & Replacement Done',
      sub: repair.completedAt
        ? `Completed & tested on ${repair.completedAt}`
        : 'On-site installation, rewiring & final testing',
      icon: 'checkmark-done-circle-outline' as const,
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="git-commit-outline" size={18} color="#0EA5E9" />
        <Text style={styles.headerTitle}>Replacement & Repair Lifecycle</Text>
      </View>

      <View style={styles.stepsList}>
        {steps.map((step, idx) => {
          const isDone = idx < currentIndex || (idx === 4 && currentIndex === 4);
          const isCurrent = idx === currentIndex && currentIndex !== 4;
          const isPending = idx > currentIndex;

          let iconColor = '#94A3B8';
          let circleBg = '#F1F5F9';
          let borderColor = '#CBD5E1';

          if (isDone) {
            iconColor = '#10B981';
            circleBg = '#ECFDF5';
            borderColor = '#10B981';
          } else if (isCurrent) {
            iconColor = '#0EA5E9';
            circleBg = '#E0F2FE';
            borderColor = '#0EA5E9';
          }

          return (
            <View key={idx} style={styles.stepRow}>
              {/* Left timeline line and circle */}
              <View style={styles.indicatorCol}>
                <View style={[styles.circle, { backgroundColor: circleBg, borderColor }]}>
                  {isDone ? (
                    <Ionicons name="checkmark" size={14} color="#10B981" />
                  ) : (
                    <Ionicons name={step.icon} size={14} color={iconColor} />
                  )}
                </View>
                {idx < steps.length - 1 && (
                  <View
                    style={[
                      styles.connectorLine,
                      { backgroundColor: idx < currentIndex ? '#10B981' : '#E2E8F0' },
                    ]}
                  />
                )}
              </View>

              {/* Right description */}
              <View style={styles.contentCol}>
                <View style={styles.stepTitleRow}>
                  <Text
                    style={[
                      styles.stepTitle,
                      isCurrent && styles.stepTitleCurrent,
                      isDone && styles.stepTitleDone,
                    ]}
                  >
                    {step.title}
                  </Text>
                  {isCurrent && (
                    <View style={styles.inProgressBadge}>
                      <Text style={styles.inProgressText}>ACTIVE STAGE</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.stepSub}>{step.sub}</Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginVertical: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  stepsList: {
    paddingLeft: 4,
  },
  stepRow: {
    flexDirection: 'row',
    minHeight: 52,
  },
  indicatorCol: {
    alignItems: 'center',
    width: 32,
  },
  circle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  connectorLine: {
    width: 2,
    flex: 1,
    marginVertical: 4,
  },
  contentCol: {
    flex: 1,
    paddingLeft: 10,
    paddingBottom: 14,
  },
  stepTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 6,
  },
  stepTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  stepTitleCurrent: {
    color: '#0284C7',
    fontWeight: '800',
  },
  stepTitleDone: {
    color: '#0F172A',
    fontWeight: '700',
  },
  inProgressBadge: {
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  inProgressText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#0284C7',
    letterSpacing: 0.5,
  },
  stepSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
    lineHeight: 15,
  },
});
