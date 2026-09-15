import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import { PriorityBadge, StatusBadge } from '../../components/StatusBadge';
import { Complaint } from '../../types';

export const EmployeeDashboardScreen: React.FC = () => {
  const { complaints, submitEmployeeResolution } = useApp();

  const [selectedTicket, setSelectedTicket] = useState<Complaint | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Form State
  const [diagnosticNotes, setDiagnosticNotes] = useState('');
  const [actionTaken, setActionTaken] = useState('');
  const [replacementDone, setReplacementDone] = useState(true);
  const [actionSuccess, setActionSuccess] = useState(false);

  // Assigned tickets for employee EMP-01
  const assignedTickets = complaints.filter(
    (c) => c.repair.technicianId === 'EMP-01' || c.status === 'ASSIGNED_EMPLOYEE' || c.status === 'REPAIR_IN_PROGRESS'
  );

  const openResolutionModal = (ticket: Complaint) => {
    setSelectedTicket(ticket);
    setDiagnosticNotes(ticket.repair.diagnosticNotes || '');
    setActionTaken(ticket.repair.actionTaken || '');
    setReplacementDone(ticket.replacement.required);
    setActionSuccess(false);
    setModalVisible(true);
  };

  const handleSaveResolution = (markCompleted: boolean) => {
    if (!selectedTicket) return;

    submitEmployeeResolution(selectedTicket.id, {
      diagnosticNotes,
      actionTaken,
      replacementDone,
      markCompleted,
    });

    setActionSuccess(true);
    setTimeout(() => {
      setModalVisible(false);
      setActionSuccess(false);
    }, 1200);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Employee Profile Header */}
        <View style={styles.techCard}>
          <View style={styles.techTop}>
            <View style={styles.avatarCircle}>
              <Ionicons name="construct" size={24} color="#FFFFFF" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.techBadge}>FIELD ENGINEER PORTAL</Text>
              <Text style={styles.techName}>Vikram Singh</Text>
              <Text style={styles.techRole}>Senior Inverter & Solar Specialist (EMP-01)</Text>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{assignedTickets.length}</Text>
              <Text style={styles.statLabel}>Assigned Tasks</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>
                {assignedTickets.filter((t) => t.status === 'REPAIR_REPLACEMENT_DONE').length}
              </Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>100%</Text>
              <Text style={styles.statLabel}>Warranty Rating</Text>
            </View>
          </View>
        </View>

        {/* Work Orders Header */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>
            Assigned Work Orders ({assignedTickets.length})
          </Text>
          <Text style={styles.sectionSub}>Repair & Replacement Schedule</Text>
        </View>

        {/* Tickets List */}
        <View style={styles.ticketsList}>
          {assignedTickets.map((ticket) => {
            const isCompleted = ticket.status === 'REPAIR_REPLACEMENT_DONE';

            return (
              <View key={ticket.id} style={[styles.ticketCard, isCompleted && styles.ticketCardDone]}>
                <View style={styles.topRow}>
                  <Text style={styles.ticketId}>{ticket.id}</Text>
                  <PriorityBadge priority={ticket.priority} />
                </View>

                <Text style={styles.ticketTitle}>{ticket.title}</Text>

                {/* Customer Location */}
                <View style={styles.locationRow}>
                  <Ionicons name="location-outline" size={14} color="#D97706" />
                  <Text style={styles.locationText} numberOfLines={2}>
                    {ticket.customerAddress}
                  </Text>
                </View>

                <View style={styles.deviceRow}>
                  <Ionicons name="hardware-chip-outline" size={14} color="#64748B" />
                  <Text style={styles.deviceText}>
                    {ticket.deviceModel} • Customer: {ticket.customerName}
                  </Text>
                </View>

                {/* Replacement Part Badge */}
                {ticket.replacement.required && (
                  <View style={styles.replacementPill}>
                    <Ionicons name="build" size={12} color="#B45309" />
                    <Text style={styles.replacementPillText}>
                      Part to Replace: {ticket.replacement.partName} [{ticket.replacement.status}]
                    </Text>
                  </View>
                )}

                <View style={styles.cardFooter}>
                  <StatusBadge status={ticket.status} />

                  <TouchableOpacity
                    style={[styles.actionBtn, isCompleted && styles.actionBtnDone]}
                    onPress={() => openResolutionModal(ticket)}
                    activeOpacity={0.8}
                  >
                    <Ionicons
                      name={isCompleted ? 'checkmark-circle' : 'hammer'}
                      size={15}
                      color="#FFFFFF"
                    />
                    <Text style={styles.actionBtnText}>
                      {isCompleted ? 'View Resolution' : 'Execute Repair'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Repair & Replacement Execution Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Execute Repair & Replacement</Text>
                <Text style={styles.modalSub}>
                  Work Order: {selectedTicket?.id} • {selectedTicket?.customerName}
                </Text>
              </View>
              <TouchableOpacity style={styles.closeBtn} onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.modalBody}>
              {/* Problem Brief */}
              <View style={styles.problemBox}>
                <Text style={styles.problemLabel}>Reported Problem:</Text>
                <Text style={styles.problemText}>{selectedTicket?.description}</Text>
              </View>

              {/* Hardware Replacement Section */}
              {selectedTicket?.replacement.required && (
                <View style={styles.replacementBox}>
                  <View style={styles.replHeader}>
                    <Ionicons name="hardware-chip" size={16} color="#D97706" />
                    <Text style={styles.replTitle}>Authorized Replacement Hardware</Text>
                  </View>
                  <Text style={styles.replPartName}>{selectedTicket?.replacement.partName}</Text>
                  <Text style={styles.replWarranty}>
                    Status: {selectedTicket?.replacement.status} • Covered 100% under INVERGY Warranty
                  </Text>

                  <TouchableOpacity
                    style={styles.replCheckRow}
                    onPress={() => setReplacementDone(!replacementDone)}
                    activeOpacity={0.8}
                  >
                    <Ionicons
                      name={replacementDone ? 'checkbox' : 'square-outline'}
                      size={20}
                      color="#D97706"
                    />
                    <Text style={styles.replCheckText}>
                      Hardware component replaced & old part sealed for warranty return
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Diagnostic Notes Input */}
              <Text style={styles.inputLabel}>ON-SITE DIAGNOSTIC FINDINGS *</Text>
              <TextInput
                style={styles.textInput}
                value={diagnosticNotes}
                onChangeText={setDiagnosticNotes}
                placeholder="e.g. Tested Voc at 92V. Found blown IGBT diode bridge on phase 1."
                placeholderTextColor="#94A3B8"
              />

              {/* Action Taken / Repair Log */}
              <Text style={styles.inputLabel}>REPAIR ACTION & TESTING PERFORMED *</Text>
              <TextInput
                style={styles.textArea}
                value={actionTaken}
                onChangeText={setActionTaken}
                placeholder="e.g. Replaced driver PCB with factory calibrated unit. Tested 3.5kW load for 30 minutes. Waveform verified."
                placeholderTextColor="#94A3B8"
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />

              {/* Action Buttons */}
              <View style={styles.actionButtonsCol}>
                <TouchableOpacity
                  style={[
                    styles.completeBtn,
                    actionSuccess && { backgroundColor: '#10B981' },
                  ]}
                  onPress={() => handleSaveResolution(true)}
                  activeOpacity={0.85}
                >
                  <Ionicons
                    name={actionSuccess ? 'checkmark-circle' : 'checkmark-done-circle'}
                    size={20}
                    color="#FFFFFF"
                  />
                  <Text style={styles.completeBtnText}>
                    {actionSuccess
                      ? 'Completed & Updated!'
                      : 'Mark Repair & Replacement Complete'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.progressBtn}
                  onPress={() => handleSaveResolution(false)}
                >
                  <Ionicons name="time-outline" size={16} color="#475569" />
                  <Text style={styles.progressBtnText}>Save Draft / In-Progress Log</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  techCard: {
    backgroundColor: '#78350F',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
  },
  techTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#B45309',
    alignItems: 'center',
    justifyContent: 'center',
  },
  techBadge: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FDE68A',
    letterSpacing: 0.8,
  },
  techName: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    marginTop: 2,
  },
  techRole: {
    fontSize: 11,
    color: '#FEF3C7',
    marginTop: 1,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 10,
    padding: 10,
    gap: 8,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: 10,
    color: '#FDE68A',
    fontWeight: '600',
    marginTop: 2,
  },
  sectionHeaderRow: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  sectionSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  ticketsList: {
    gap: 12,
  },
  ticketCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  ticketCardDone: {
    borderColor: '#BBF7D0',
    backgroundColor: '#F0FDF4',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  ticketId: {
    fontSize: 13,
    fontWeight: '900',
    color: '#475569',
  },
  ticketTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  locationText: {
    fontSize: 11,
    color: '#92400E',
    fontWeight: '600',
    flex: 1,
  },
  deviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  deviceText: {
    fontSize: 11,
    color: '#64748B',
  },
  replacementPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  replacementPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#92400E',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D97706',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    gap: 6,
  },
  actionBtnDone: {
    backgroundColor: '#16A34A',
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
  },
  modalSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  closeBtn: {
    padding: 6,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
  },
  modalBody: {
    padding: 16,
    paddingBottom: 40,
  },
  problemBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
  },
  problemLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.5,
  },
  problemText: {
    fontSize: 13,
    color: '#0F172A',
    marginTop: 3,
  },
  replacementBox: {
    backgroundColor: '#FFFBEB',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#FDE68A',
    marginBottom: 14,
  },
  replHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  replTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#B45309',
  },
  replPartName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#78350F',
  },
  replWarranty: {
    fontSize: 11,
    color: '#92400E',
    marginTop: 2,
    marginBottom: 8,
  },
  replCheckRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#FDE68A',
  },
  replCheckText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#78350F',
    flex: 1,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#475569',
    letterSpacing: 0.5,
    marginBottom: 6,
    marginTop: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    padding: 10,
    fontSize: 13,
    color: '#0F172A',
    marginBottom: 10,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    padding: 10,
    height: 70,
    fontSize: 13,
    color: '#0F172A',
    marginBottom: 16,
  },
  actionButtonsCol: {
    gap: 10,
  },
  completeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D97706',
    borderRadius: 10,
    paddingVertical: 14,
    gap: 8,
  },
  completeBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  progressBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    paddingVertical: 12,
    gap: 6,
  },
  progressBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
});
