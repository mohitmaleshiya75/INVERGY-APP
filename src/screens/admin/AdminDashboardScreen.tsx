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
import { QUICK_TECHNICIANS } from '../../data/mockData';
import { Complaint, TechnicianContact } from '../../types';

export const AdminDashboardScreen: React.FC = () => {
  const { complaints, sendAdminReply } = useApp();

  const [activeFilter, setActiveFilter] = useState<'ALL' | 'PENDING' | 'SHARED' | 'RESOLVED'>('ALL');
  const [selectedTicket, setSelectedTicket] = useState<Complaint | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Modal State
  const [replyText, setReplyText] = useState('');
  const [shareTechnician, setShareTechnician] = useState(true);
  const [techName, setTechName] = useState('Vikram Singh');
  const [techPhone, setTechPhone] = useState('+91 98111 22334');
  const [techDesig, setTechDesig] = useState('Senior Inverter & Solar Field Engineer');
  const [actionSuccess, setActionSuccess] = useState(false);

  // Statistics
  const total = complaints.length;
  const pending = complaints.filter((c) => c.status === 'PENDING_ADMIN_REPLY').length;
  const shared = complaints.filter((c) => !!c.sharedTechnician).length;
  const resolved = complaints.filter((c) => c.status === 'RESOLVED').length;

  const filteredTickets = complaints.filter((c) => {
    if (activeFilter === 'PENDING') return c.status === 'PENDING_ADMIN_REPLY';
    if (activeFilter === 'SHARED') return !!c.sharedTechnician;
    if (activeFilter === 'RESOLVED') return c.status === 'RESOLVED';
    return true;
  });

  const openReviewModal = (ticket: Complaint) => {
    setSelectedTicket(ticket);
    setReplyText('');
    setShareTechnician(true);
    setTechName(ticket.sharedTechnician?.name || 'Vikram Singh');
    setTechPhone(ticket.sharedTechnician?.phone || '+91 98111 22334');
    setTechDesig(ticket.sharedTechnician?.designation || 'Senior Inverter & Solar Field Engineer');
    setActionSuccess(false);
    setModalVisible(true);
  };

  const handleSendAdminReply = (markResolved: boolean = false) => {
    if (!selectedTicket) return;
    if (!replyText.trim() && !shareTechnician && !markResolved) return;

    const technicianData: TechnicianContact | undefined = shareTechnician
      ? {
          name: techName.trim(),
          phone: techPhone.trim(),
          designation: techDesig.trim(),
        }
      : undefined;

    sendAdminReply(
      selectedTicket.id,
      replyText.trim() || (markResolved ? 'Issue marked as resolved by Admin.' : 'Technician details shared below.'),
      technicianData,
      markResolved ? 'RESOLVED' : undefined
    );

    setActionSuccess(true);
    setTimeout(() => {
      setModalVisible(false);
      setActionSuccess(false);
    }, 1200);
  };

  const selectQuickTech = (qt: TechnicianContact) => {
    setTechName(qt.name);
    setTechPhone(qt.phone);
    setTechDesig(qt.designation || 'Field Specialist');
    setShareTechnician(true);
  };

  const quickTemplates = [
    'We have noted your issue. Our technician will visit you tomorrow morning. You can call him directly.',
    'Please keep the system powered OFF. I have assigned our specialist who will reach within 2 hours.',
    'Could you please share your inverter model number or a picture of the error display in this chat?',
  ];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Admin Header Banner */}
        <View style={styles.adminBanner}>
          <View style={styles.adminBannerTop}>
            <View>
              <Text style={styles.adminRoleTag}>ADMIN CONTROL DESK</Text>
              <Text style={styles.adminTitle}>Direct Customer Support</Text>
            </View>
            <View style={styles.adminBadge}>
              <Ionicons name="shield-checkmark" size={16} color="#8B5CF6" />
              <Text style={styles.adminBadgeText}>Admin Role</Text>
            </View>
          </View>
          <Text style={styles.adminSub}>
            Reply directly to customer complaints, request equipment details in chat, and share technician contact numbers.
          </Text>
        </View>

        {/* Metrics Grid */}
        <View style={styles.kpiGrid}>
          <View style={[styles.kpiCard, { borderColor: '#E2E8F0' }]}>
            <Text style={styles.kpiValue}>{total}</Text>
            <Text style={styles.kpiLabel}>Total Queries</Text>
          </View>

          <View style={[styles.kpiCard, { borderColor: '#FDE68A', backgroundColor: '#FFFBEB' }]}>
            <Text style={[styles.kpiValue, { color: '#D97706' }]}>{pending}</Text>
            <Text style={[styles.kpiLabel, { color: '#B45309' }]}>Waiting Reply</Text>
          </View>

          <View style={[styles.kpiCard, { borderColor: '#DDD6FE', backgroundColor: '#FAF5FF' }]}>
            <Text style={[styles.kpiValue, { color: '#7C3AED' }]}>{shared}</Text>
            <Text style={[styles.kpiLabel, { color: '#6D28D9' }]}>Tech Shared</Text>
          </View>

          <View style={[styles.kpiCard, { borderColor: '#BBF7D0', backgroundColor: '#F0FDF4' }]}>
            <Text style={[styles.kpiValue, { color: '#16A34A' }]}>{resolved}</Text>
            <Text style={[styles.kpiLabel, { color: '#15803D' }]}>Resolved</Text>
          </View>
        </View>

        {/* Filter Pills */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {[
            { key: 'ALL', label: `All (${total})` },
            { key: 'PENDING', label: `Waiting Reply (${pending})` },
            { key: 'SHARED', label: `Technician Shared (${shared})` },
            { key: 'RESOLVED', label: `Resolved (${resolved})` },
          ].map((f) => (
            <TouchableOpacity
              key={f.key}
              style={[styles.filterPill, activeFilter === f.key && styles.filterPillActive]}
              onPress={() => setActiveFilter(f.key as any)}
            >
              <Text style={[styles.filterPillText, activeFilter === f.key && styles.filterPillTextActive]}>
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Complaints List */}
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
                <Text style={styles.categorySub}>Category: {ticket.categoryName}</Text>

                {ticket.customProblemDetails && (
                  <View style={styles.clarifyBox}>
                    <Text style={styles.clarifyLabel}>User Clarified Problem:</Text>
                    <Text style={styles.clarifyText}>{ticket.customProblemDetails}</Text>
                  </View>
                )}

                {/* Customer Address */}
                <View style={styles.addressRow}>
                  <Ionicons name="location-outline" size={12} color="#64748B" />
                  <Text style={styles.addressText} numberOfLines={1}>
                    {ticket.customerAddress}
                  </Text>
                </View>

                {/* Last Message Snippet */}
                {lastMsg && (
                  <View style={[styles.lastMsgBox, isUserLast && styles.lastMsgBoxUser]}>
                    <Text style={styles.lastMsgSender}>
                      {isUserLast ? 'Customer Needs Reply:' : 'Last Admin Reply:'}
                    </Text>
                    <Text style={styles.lastMsgText} numberOfLines={2}>
                      "{lastMsg.text}"
                    </Text>
                  </View>
                )}

                {/* Shared Technician Pill if already shared */}
                {ticket.sharedTechnician && (
                  <View style={styles.sharedTechBadge}>
                    <Ionicons name="call" size={12} color="#7C3AED" />
                    <Text style={styles.sharedTechText}>
                      Tech: {ticket.sharedTechnician.name} ({ticket.sharedTechnician.phone})
                    </Text>
                  </View>
                )}

                <View style={styles.cardFooter}>
                  <StatusBadge status={ticket.status} />

                  <TouchableOpacity
                    style={styles.replyActionBtn}
                    onPress={() => openReviewModal(ticket)}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="chatbubble-ellipses" size={14} color="#FFFFFF" />
                    <Text style={styles.replyActionBtnText}>Reply & Share No.</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Admin Reply & Share Tech Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Admin Direct Reply</Text>
                <Text style={styles.modalSub}>
                  Ticket {selectedTicket?.id} • {selectedTicket?.customerName}
                </Text>
              </View>
              <TouchableOpacity style={styles.closeBtn} onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.modalBody}>
              {/* Customer Problem Info */}
              <View style={styles.problemPreviewBox}>
                <Text style={styles.problemPreviewLabel}>Customer Problem & Query:</Text>
                <Text style={styles.problemPreviewText}>{selectedTicket?.description}</Text>
                {selectedTicket?.customProblemDetails && (
                  <Text style={styles.problemPreviewClarify}>
                    Custom details: {selectedTicket.customProblemDetails}
                  </Text>
                )}
              </View>

              {/* Quick Reply Templates */}
              <Text style={styles.sectionHeading}>QUICK REPLY TEMPLATES</Text>
              <View style={styles.templatesList}>
                {quickTemplates.map((t, idx) => (
                  <TouchableOpacity key={idx} style={styles.templateChip} onPress={() => setReplyText(t)}>
                    <Ionicons name="copy-outline" size={12} color="#7C3AED" />
                    <Text style={styles.templateChipText} numberOfLines={2}>
                      {t}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Direct Reply Composer */}
              <Text style={styles.sectionHeading}>YOUR DIRECT REPLY *</Text>
              <TextInput
                style={styles.replyTextArea}
                value={replyText}
                onChangeText={setReplyText}
                placeholder="Type your response to the user..."
                placeholderTextColor="#94A3B8"
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />

              {/* Share Technician Contact Section */}
              <View style={styles.shareTechSection}>
                <TouchableOpacity
                  style={styles.shareTechToggle}
                  onPress={() => setShareTechnician(!shareTechnician)}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name={shareTechnician ? 'checkbox' : 'square-outline'}
                    size={20}
                    color="#7C3AED"
                  />
                  <Text style={styles.shareTechToggleLabel}>
                    Share Technician Contact Number with User
                  </Text>
                </TouchableOpacity>

                {shareTechnician && (
                  <View style={styles.techForm}>
                    <Text style={styles.quickTechLabel}>Select Technician:</Text>
                    <View style={styles.quickTechRow}>
                      {QUICK_TECHNICIANS.map((qt, idx) => (
                        <TouchableOpacity
                          key={idx}
                          style={[
                            styles.quickTechChip,
                            techName === qt.name && styles.quickTechChipActive,
                          ]}
                          onPress={() => selectQuickTech(qt)}
                        >
                          <Text
                            style={[
                              styles.quickTechChipText,
                              techName === qt.name && styles.quickTechChipTextActive,
                            ]}
                          >
                            {qt.name}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>

                    <Text style={styles.inputLabel}>Technician Name:</Text>
                    <TextInput style={styles.input} value={techName} onChangeText={setTechName} />

                    <Text style={styles.inputLabel}>Technician Phone Number:</Text>
                    <TextInput style={styles.input} value={techPhone} onChangeText={setTechPhone} keyboardType="phone-pad" />
                  </View>
                )}
              </View>

              {/* Actions */}
              <View style={styles.actionButtonsRow}>
                <TouchableOpacity
                  style={[styles.submitReplyBtn, actionSuccess && { backgroundColor: '#10B981' }]}
                  onPress={() => handleSendAdminReply(false)}
                  activeOpacity={0.85}
                >
                  <Ionicons name={actionSuccess ? 'checkmark-circle' : 'send'} size={16} color="#FFFFFF" />
                  <Text style={styles.submitReplyBtnText}>
                    {actionSuccess ? 'Sent!' : 'Send Reply & Share Contact'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.resolveBtn}
                  onPress={() => handleSendAdminReply(true)}
                  activeOpacity={0.85}
                >
                  <Ionicons name="checkmark-done" size={16} color="#16A34A" />
                  <Text style={styles.resolveBtnText}>Close / Resolve</Text>
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
  categorySub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  clarifyBox: {
    backgroundColor: '#FAF5FF',
    padding: 8,
    borderRadius: 6,
    marginTop: 6,
    borderWidth: 1,
    borderColor: '#E9D5FF',
  },
  clarifyLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#7C3AED',
  },
  clarifyText: {
    fontSize: 11,
    color: '#4C1D95',
    marginTop: 1,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },
  addressText: {
    fontSize: 11,
    color: '#64748B',
    flex: 1,
  },
  lastMsgBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 6,
    padding: 8,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  lastMsgBoxUser: {
    backgroundColor: '#F0F9FF',
    borderColor: '#BAE6FD',
  },
  lastMsgSender: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0284C7',
    marginBottom: 2,
  },
  lastMsgText: {
    fontSize: 11,
    color: '#334155',
  },
  sharedTechBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EDE9FE',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  sharedTechText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#6B21A8',
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
  replyActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    gap: 6,
  },
  replyActionBtnText: {
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
  problemPreviewBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },
  problemPreviewLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
  },
  problemPreviewText: {
    fontSize: 13,
    color: '#0F172A',
    marginTop: 2,
  },
  problemPreviewClarify: {
    fontSize: 11,
    color: '#7C3AED',
    marginTop: 4,
    fontWeight: '600',
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: '800',
    color: '#475569',
    letterSpacing: 0.5,
    marginBottom: 6,
    marginTop: 8,
  },
  templatesList: {
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
    borderRadius: 6,
    padding: 8,
  },
  templateChipText: {
    fontSize: 11,
    color: '#6B21A8',
    flex: 1,
  },
  replyTextArea: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    padding: 10,
    fontSize: 13,
    color: '#0F172A',
    height: 75,
    marginBottom: 14,
  },
  shareTechSection: {
    backgroundColor: '#FAF5FF',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E9D5FF',
    marginBottom: 16,
  },
  shareTechToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  shareTechToggleLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#6B21A8',
    flex: 1,
  },
  techForm: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E9D5FF',
  },
  quickTechLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#7C3AED',
    marginBottom: 4,
  },
  quickTechRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 10,
  },
  quickTechChip: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
  },
  quickTechChipActive: {
    borderColor: '#7C3AED',
    backgroundColor: '#EDE9FE',
  },
  quickTechChipText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#475569',
  },
  quickTechChipTextActive: {
    color: '#6B21A8',
    fontWeight: '800',
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 6,
    paddingHorizontal: 8,
    height: 36,
    fontSize: 12,
    color: '#0F172A',
    marginBottom: 8,
  },
  actionButtonsRow: {
    gap: 8,
  },
  submitReplyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8B5CF6',
    borderRadius: 8,
    paddingVertical: 12,
    gap: 6,
  },
  submitReplyBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  resolveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: 8,
    paddingVertical: 10,
    gap: 6,
  },
  resolveBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#16A34A',
  },
});
