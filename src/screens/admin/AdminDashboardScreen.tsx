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
import { AVAILABLE_EMPLOYEES } from '../../data/mockData';
import { Complaint } from '../../types';

export const AdminDashboardScreen: React.FC = () => {
  const { complaints, sendAdminReply } = useApp();

  const [activeFilter, setActiveFilter] = useState<'ALL' | 'NEEDS_REPLY' | 'REPLACEMENTS' | 'IN_REPAIR' | 'RESOLVED'>('ALL');
  const [selectedTicket, setSelectedTicket] = useState<Complaint | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Modal Form State
  const [replyText, setReplyText] = useState('');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('EMP-01');
  const [approveReplacement, setApproveReplacement] = useState(true);
  const [replacementPartName, setReplacementPartName] = useState('');
  const [actionSuccess, setActionSuccess] = useState(false);

  // Statistics
  const totalTickets = complaints.length;
  const needsReply = complaints.filter(
    (c) => c.status === 'REGISTERED' || (c.messages.length > 0 && c.messages[c.messages.length - 1].senderRole === 'END_USER')
  ).length;
  const pendingReplacements = complaints.filter(
    (c) => c.replacement.required && c.replacement.status !== 'INSTALLED'
  ).length;
  const inRepair = complaints.filter(
    (c) => c.status === 'REPAIR_IN_PROGRESS' || c.status === 'ASSIGNED_EMPLOYEE'
  ).length;
  const resolved = complaints.filter(
    (c) => c.status === 'REPAIR_REPLACEMENT_DONE' || c.status === 'RESOLVED'
  ).length;

  const filteredTickets = complaints.filter((c) => {
    if (activeFilter === 'NEEDS_REPLY') {
      return c.status === 'REGISTERED' || c.messages[c.messages.length - 1]?.senderRole === 'END_USER';
    }
    if (activeFilter === 'REPLACEMENTS') {
      return c.replacement.required;
    }
    if (activeFilter === 'IN_REPAIR') {
      return c.status === 'REPAIR_IN_PROGRESS' || c.status === 'ASSIGNED_EMPLOYEE';
    }
    if (activeFilter === 'RESOLVED') {
      return c.status === 'REPAIR_REPLACEMENT_DONE' || c.status === 'RESOLVED';
    }
    return true;
  });

  const openReviewModal = (ticket: Complaint) => {
    setSelectedTicket(ticket);
    setReplyText('');
    setSelectedEmployeeId(ticket.repair.technicianId || 'EMP-01');
    setApproveReplacement(ticket.replacement.required);
    setReplacementPartName(ticket.replacement.partName || 'Inverter Driver Module');
    setActionSuccess(false);
    setModalVisible(true);
  };

  const handleAdminSubmit = () => {
    if (!selectedTicket || !replyText.trim()) return;

    sendAdminReply(
      selectedTicket.id,
      replyText,
      selectedEmployeeId,
      approveReplacement,
      replacementPartName
    );

    setActionSuccess(true);
    setTimeout(() => {
      setModalVisible(false);
      setActionSuccess(false);
    }, 1200);
  };

  const quickTemplates = [
    'Triage complete: Error E04 points to power bridge overload. Technician assigned with replacement board for tomorrow 11 AM.',
    'Replacement part authorized 100% under warranty. Field engineer dispatched for installation.',
    'Please verify if the battery circuit breaker tripped. Our technician will visit today.',
  ];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Admin Header Banner */}
        <View style={styles.adminBanner}>
          <View style={styles.adminBannerTop}>
            <View>
              <Text style={styles.adminRoleTag}>ADMIN CONTROL CENTER</Text>
              <Text style={styles.adminTitle}>Operations & Triage</Text>
            </View>
            <View style={styles.adminBadge}>
              <Ionicons name="shield-checkmark" size={16} color="#8B5CF6" />
              <Text style={styles.adminBadgeText}>Super Admin</Text>
            </View>
          </View>
          <Text style={styles.adminSub}>
            Oversee all incoming complaints, respond to user queries, authorize hardware replacements, and dispatch technicians.
          </Text>
        </View>

        {/* KPI Metrics Cards */}
        <View style={styles.kpiGrid}>
          <View style={[styles.kpiCard, { borderColor: '#E2E8F0' }]}>
            <Text style={styles.kpiValue}>{totalTickets}</Text>
            <Text style={styles.kpiLabel}>Total Tickets</Text>
          </View>

          <View style={[styles.kpiCard, { borderColor: '#FDE68A', backgroundColor: '#FFFBEB' }]}>
            <Text style={[styles.kpiValue, { color: '#D97706' }]}>{needsReply}</Text>
            <Text style={[styles.kpiLabel, { color: '#B45309' }]}>Needs Reply</Text>
          </View>

          <View style={[styles.kpiCard, { borderColor: '#BAE6FD', backgroundColor: '#F0F9FF' }]}>
            <Text style={[styles.kpiValue, { color: '#0284C7' }]}>{pendingReplacements}</Text>
            <Text style={[styles.kpiLabel, { color: '#0369A1' }]}>Replacements</Text>
          </View>

          <View style={[styles.kpiCard, { borderColor: '#BBF7D0', backgroundColor: '#F0FDF4' }]}>
            <Text style={[styles.kpiValue, { color: '#16A34A' }]}>{resolved}</Text>
            <Text style={[styles.kpiLabel, { color: '#15803D' }]}>Resolved</Text>
          </View>
        </View>

        {/* Filter Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {[
            { key: 'ALL', label: `All (${totalTickets})` },
            { key: 'NEEDS_REPLY', label: `Needs Reply (${needsReply})` },
            { key: 'REPLACEMENTS', label: `Replacements (${pendingReplacements})` },
            { key: 'IN_REPAIR', label: `In Field (${inRepair})` },
            { key: 'RESOLVED', label: `Resolved (${resolved})` },
          ].map((f) => (
            <TouchableOpacity
              key={f.key}
              style={[
                styles.filterPill,
                activeFilter === f.key && styles.filterPillActive,
              ]}
              onPress={() => setActiveFilter(f.key as any)}
            >
              <Text
                style={[
                  styles.filterPillText,
                  activeFilter === f.key && styles.filterPillTextActive,
                ]}
              >
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Complaints Management List */}
        <View style={styles.complaintsList}>
          {filteredTickets.map((ticket) => {
            const lastMsg = ticket.messages[ticket.messages.length - 1];
            const isUserLast = lastMsg?.senderRole === 'END_USER';

            return (
              <View key={ticket.id} style={styles.ticketCard}>
                <View style={styles.cardTopRow}>
                  <View style={styles.idAndDate}>
                    <Text style={styles.ticketId}>{ticket.id}</Text>
                    <Text style={styles.customerName}>• {ticket.customerName}</Text>
                  </View>
                  <PriorityBadge priority={ticket.priority} />
                </View>

                <Text style={styles.ticketTitle}>{ticket.title}</Text>
                <Text style={styles.deviceText}>
                  {ticket.deviceModel} (S/N: {ticket.serialNumber})
                </Text>

                {/* Last Message Preview */}
                {lastMsg && (
                  <View
                    style={[
                      styles.lastMsgBox,
                      isUserLast ? styles.lastMsgBoxUser : styles.lastMsgBoxOther,
                    ]}
                  >
                    <View style={styles.lastMsgSenderRow}>
                      <Ionicons
                        name={isUserLast ? 'person-circle' : 'chatbubble-ellipses'}
                        size={12}
                        color={isUserLast ? '#0284C7' : '#64748B'}
                      />
                      <Text style={styles.lastMsgSender}>
                        {isUserLast ? 'CUSTOMER WAITING FOR REPLY' : `Last: ${lastMsg.senderName}`}
                      </Text>
                    </View>
                    <Text style={styles.lastMsgText} numberOfLines={2}>
                      "{lastMsg.text}"
                    </Text>
                  </View>
                )}

                {/* Replacement Status Bar */}
                {ticket.replacement.required && (
                  <View style={styles.replacementTagRow}>
                    <Ionicons name="hardware-chip" size={13} color="#7C3AED" />
                    <Text style={styles.replacementTagText}>
                      Part: {ticket.replacement.partName} ({ticket.replacement.status})
                    </Text>
                  </View>
                )}

                <View style={styles.cardFooter}>
                  <StatusBadge status={ticket.status} />

                  <TouchableOpacity
                    style={styles.reviewBtn}
                    onPress={() => openReviewModal(ticket)}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="create-outline" size={15} color="#FFFFFF" />
                    <Text style={styles.reviewBtnText}>Reply & Manage</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Admin Reply & Triage Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Admin Triage & Reply</Text>
                <Text style={styles.modalSub}>
                  Ticket: {selectedTicket?.id} • {selectedTicket?.customerName}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.closeBtn}
                onPress={() => setModalVisible(false)}
              >
                <Ionicons name="close" size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.modalBody}>
              {/* Customer Original Complaint */}
              <View style={styles.infoBox}>
                <Text style={styles.infoBoxLabel}>Customer Query:</Text>
                <Text style={styles.infoBoxText}>{selectedTicket?.description}</Text>
                <Text style={styles.infoBoxAddress}>Address: {selectedTicket?.customerAddress}</Text>
              </View>

              {/* Quick Reply Templates */}
              <Text style={styles.formSectionLabel}>QUICK RESPONSE TEMPLATES</Text>
              <View style={styles.templatesCol}>
                {quickTemplates.map((tmpl, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={styles.templateChip}
                    onPress={() => setReplyText(tmpl)}
                  >
                    <Ionicons name="copy-outline" size={12} color="#7C3AED" />
                    <Text style={styles.templateChipText} numberOfLines={2}>
                      {tmpl}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Admin Reply Input */}
              <Text style={styles.formSectionLabel}>OFFICIAL ADMIN REPLY *</Text>
              <TextInput
                style={styles.modalTextArea}
                value={replyText}
                onChangeText={setReplyText}
                placeholder="Type comprehensive response to customer (diagnostics, next visit, replacement guidance)..."
                placeholderTextColor="#94A3B8"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />

              {/* Assign Field Employee */}
              <Text style={styles.formSectionLabel}>ASSIGN FIELD ENGINEER</Text>
              <View style={styles.employeeOptions}>
                {AVAILABLE_EMPLOYEES.map((emp) => {
                  const isSelected = selectedEmployeeId === emp.id;
                  return (
                    <TouchableOpacity
                      key={emp.id}
                      style={[
                        styles.employeeOption,
                        isSelected && styles.employeeOptionSelected,
                      ]}
                      onPress={() => setSelectedEmployeeId(emp.id)}
                    >
                      <Ionicons
                        name={isSelected ? 'radio-button-on' : 'radio-button-off'}
                        size={16}
                        color={isSelected ? '#7C3AED' : '#94A3B8'}
                      />
                      <View style={{ flex: 1 }}>
                        <Text
                          style={[
                            styles.empOptionName,
                            isSelected && { color: '#7C3AED', fontWeight: '800' },
                          ]}
                        >
                          {emp.name}
                        </Text>
                        <Text style={styles.empOptionSub}>{emp.designation}</Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Hardware Replacement Authorization */}
              <View style={styles.replacementAuthCard}>
                <TouchableOpacity
                  style={styles.checkRow}
                  onPress={() => setApproveReplacement(!approveReplacement)}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name={approveReplacement ? 'checkbox' : 'square-outline'}
                    size={20}
                    color="#7C3AED"
                  />
                  <Text style={styles.checkLabel}>
                    Authorize Free Hardware Replacement under Warranty
                  </Text>
                </TouchableOpacity>

                {approveReplacement && (
                  <View style={styles.partNameInputBox}>
                    <Text style={styles.partInputLabel}>Replacement Part Name:</Text>
                    <TextInput
                      style={styles.partInput}
                      value={replacementPartName}
                      onChangeText={setReplacementPartName}
                      placeholder="e.g. Inverter IGBT Driver Board"
                    />
                  </View>
                )}
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                style={[
                  styles.modalSubmitBtn,
                  actionSuccess && { backgroundColor: '#10B981' },
                ]}
                onPress={handleAdminSubmit}
                activeOpacity={0.85}
              >
                <Ionicons
                  name={actionSuccess ? 'checkmark-circle' : 'paper-plane'}
                  size={18}
                  color="#FFFFFF"
                />
                <Text style={styles.modalSubmitText}>
                  {actionSuccess
                    ? 'Reply Sent & Assigned!'
                    : 'Send Admin Reply & Dispatch Technician'}
                </Text>
              </TouchableOpacity>
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
  adminBanner: {
    backgroundColor: '#1E1B4B',
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
  },
  adminBannerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  adminRoleTag: {
    fontSize: 10,
    fontWeight: '800',
    color: '#A78BFA',
    letterSpacing: 0.8,
  },
  adminTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    marginTop: 2,
  },
  adminBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  adminBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#DDD6FE',
  },
  adminSub: {
    fontSize: 11,
    color: '#C7D2FE',
    lineHeight: 16,
  },
  kpiGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  kpiCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    alignItems: 'center',
  },
  kpiValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
  },
  kpiLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#64748B',
    marginTop: 2,
  },
  filterScroll: {
    gap: 8,
    marginBottom: 14,
  },
  filterPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  filterPillActive: {
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
  },
  filterPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  filterPillTextActive: {
    color: '#FFFFFF',
  },
  complaintsList: {
    gap: 12,
  },
  ticketCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  idAndDate: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ticketId: {
    fontSize: 12,
    fontWeight: '900',
    color: '#475569',
  },
  customerName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  ticketTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  deviceText: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  lastMsgBox: {
    borderRadius: 8,
    padding: 8,
    marginTop: 10,
    borderWidth: 1,
  },
  lastMsgBoxUser: {
    backgroundColor: '#F0F9FF',
    borderColor: '#BAE6FD',
  },
  lastMsgBoxOther: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
  },
  lastMsgSenderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  lastMsgSender: {
    fontSize: 9,
    fontWeight: '800',
    color: '#0284C7',
    letterSpacing: 0.5,
  },
  lastMsgText: {
    fontSize: 11,
    color: '#334155',
  },
  replacementTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FAF5FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  replacementTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#7C3AED',
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
  reviewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    gap: 6,
  },
  reviewBtnText: {
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
  infoBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
  },
  infoBoxLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.5,
  },
  infoBoxText: {
    fontSize: 13,
    color: '#0F172A',
    marginTop: 3,
  },
  infoBoxAddress: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 6,
  },
  formSectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#475569',
    letterSpacing: 0.5,
    marginBottom: 8,
    marginTop: 10,
  },
  templatesCol: {
    gap: 6,
    marginBottom: 12,
  },
  templateChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FAF5FF',
    borderWidth: 1,
    borderColor: '#E9D5FF',
    borderRadius: 8,
    padding: 8,
  },
  templateChipText: {
    fontSize: 11,
    color: '#6B21A8',
    flex: 1,
  },
  modalTextArea: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    padding: 12,
    height: 90,
    fontSize: 13,
    color: '#0F172A',
    marginBottom: 14,
  },
  employeeOptions: {
    gap: 8,
    marginBottom: 14,
  },
  employeeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
  },
  employeeOptionSelected: {
    borderColor: '#8B5CF6',
    backgroundColor: '#FAF5FF',
  },
  empOptionName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  empOptionSub: {
    fontSize: 10,
    color: '#64748B',
  },
  replacementAuthCard: {
    backgroundColor: '#FAF5FF',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E9D5FF',
    marginBottom: 16,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B21A8',
    flex: 1,
  },
  partNameInputBox: {
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E9D5FF',
  },
  partInputLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#7C3AED',
    marginBottom: 4,
  },
  partInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 6,
    paddingHorizontal: 8,
    height: 36,
    fontSize: 12,
    color: '#0F172A',
  },
  modalSubmitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8B5CF6',
    borderRadius: 10,
    paddingVertical: 14,
    gap: 8,
  },
  modalSubmitText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
