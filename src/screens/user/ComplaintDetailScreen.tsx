import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import { PriorityBadge, StatusBadge } from '../../components/StatusBadge';
import { StepTracker } from '../../components/StepTracker';

export const ComplaintDetailScreen: React.FC = () => {
  const { activeComplaint, sendUserReply, setCurrentScreen } = useApp();
  const [replyText, setReplyText] = useState('');

  if (!activeComplaint) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No complaint selected.</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => setCurrentScreen('USER_HOME')}>
          <Text style={styles.backBtnText}>Back to Complaints</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleSend = () => {
    if (!replyText.trim()) return;
    sendUserReply(activeComplaint.id, replyText);
    setReplyText('');
  };

  const quickReplies = [
    'Yes, 11:00 AM slot works for me.',
    'Please bring replacement board.',
    'Confirming gate code and address.',
  ];

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Top Ticket Header */}
        <View style={styles.ticketCard}>
          <View style={styles.topRow}>
            <View>
              <Text style={styles.ticketId}>{activeComplaint.id}</Text>
              <Text style={styles.ticketDate}>Raised: {activeComplaint.createdAt}</Text>
            </View>
            <View style={styles.badgeRow}>
              <PriorityBadge priority={activeComplaint.priority} />
            </View>
          </View>

          <Text style={styles.ticketTitle}>{activeComplaint.title}</Text>
          <Text style={styles.categorySub}>Category: {activeComplaint.categoryName}</Text>

          <View style={styles.divider} />

          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Current Status:</Text>
            <StatusBadge status={activeComplaint.status} />
          </View>
        </View>

        {/* Replacement & Repair Visual Progress Tracker */}
        <StepTracker
          status={activeComplaint.status}
          replacement={activeComplaint.replacement}
          repair={activeComplaint.repair}
        />

        {/* Hardware Replacement Status Card */}
        {activeComplaint.replacement.required && (
          <View style={styles.hardwareCard}>
            <View style={styles.hardwareHeader}>
              <Ionicons name="hardware-chip" size={18} color="#0284C7" />
              <Text style={styles.hardwareTitle}>Hardware Replacement Status</Text>
              <View
                style={[
                  styles.partStatusPill,
                  activeComplaint.replacement.status === 'INSTALLED' && { backgroundColor: '#DCFCE7' },
                  activeComplaint.replacement.status === 'APPROVED' && { backgroundColor: '#E0F2FE' },
                ]}
              >
                <Text
                  style={[
                    styles.partStatusText,
                    activeComplaint.replacement.status === 'INSTALLED' && { color: '#16A34A' },
                    activeComplaint.replacement.status === 'APPROVED' && { color: '#0284C7' },
                  ]}
                >
                  {activeComplaint.replacement.status.replace(/_/g, ' ')}
                </Text>
              </View>
            </View>

            <View style={styles.partDetailRow}>
              <Text style={styles.partLabel}>Required Part:</Text>
              <Text style={styles.partValue}>{activeComplaint.replacement.partName}</Text>
            </View>
            <View style={styles.partDetailRow}>
              <Text style={styles.partLabel}>Part Code:</Text>
              <Text style={styles.partValue}>{activeComplaint.replacement.partNumber}</Text>
            </View>
            <View style={styles.partDetailRow}>
              <Text style={styles.partLabel}>Warranty Coverage:</Text>
              <Text style={[styles.partValue, { color: '#16A34A', fontWeight: '800' }]}>
                {activeComplaint.replacement.costEstimate || '100% Free under Warranty'}
              </Text>
            </View>
          </View>
        )}

        {/* Technician / Field Engineer Card */}
        {activeComplaint.repair.technicianName && (
          <View style={styles.technicianCard}>
            <View style={styles.techRow}>
              <View style={styles.techAvatar}>
                <Ionicons name="construct" size={18} color="#D97706" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.techRoleTitle}>ASSIGNED FIELD ENGINEER</Text>
                <Text style={styles.techName}>{activeComplaint.repair.technicianName}</Text>
                <Text style={styles.techPhone}>{activeComplaint.repair.technicianPhone}</Text>
              </View>
              <View style={styles.scheduledPill}>
                <Ionicons name="calendar-outline" size={12} color="#475569" />
                <Text style={styles.scheduledText}>{activeComplaint.repair.scheduledDate}</Text>
              </View>
            </View>

            {activeComplaint.repair.actionTaken ? (
              <View style={styles.techActionBox}>
                <Text style={styles.techActionLabel}>Technician Action Log:</Text>
                <Text style={styles.techActionText}>{activeComplaint.repair.actionTaken}</Text>
              </View>
            ) : null}
          </View>
        )}

        {/* Admin <-> User Reply Conversation Thread */}
        <View style={styles.threadCard}>
          <View style={styles.threadHeader}>
            <Ionicons name="chatbubbles-outline" size={18} color="#0EA5E9" />
            <Text style={styles.threadHeaderTitle}>Official Support & Admin Thread</Text>
          </View>
          <Text style={styles.threadHeaderSub}>
            Live conversation between Customer, Admin Triage, and Field Technicians
          </Text>

          <View style={styles.messagesList}>
            {activeComplaint.messages.map((msg) => {
              const isUser = msg.senderRole === 'END_USER';
              const isAdmin = msg.senderRole === 'ADMIN';
              const isEmp = msg.senderRole === 'EMPLOYEE';

              return (
                <View
                  key={msg.id}
                  style={[
                    styles.messageBubble,
                    isUser && styles.messageBubbleUser,
                    isAdmin && styles.messageBubbleAdmin,
                    isEmp && styles.messageBubbleEmp,
                  ]}
                >
                  <View style={styles.senderHeader}>
                    <View style={styles.senderLeft}>
                      <Ionicons
                        name={
                          isUser ? 'person-circle' : isAdmin ? 'shield-checkmark' : 'construct'
                        }
                        size={14}
                        color={isUser ? '#0284C7' : isAdmin ? '#7C3AED' : '#D97706'}
                      />
                      <Text
                        style={[
                          styles.senderRoleTag,
                          isUser && { color: '#0284C7' },
                          isAdmin && { color: '#7C3AED' },
                          isEmp && { color: '#D97706' },
                        ]}
                      >
                        {isAdmin ? 'ADMIN REPLY' : isEmp ? 'TECHNICIAN UPDATE' : 'CUSTOMER'}
                      </Text>
                    </View>
                    <Text style={styles.timestamp}>{msg.timestamp}</Text>
                  </View>

                  <Text style={styles.senderName}>{msg.senderName}</Text>
                  <Text style={styles.messageText}>{msg.text}</Text>
                </View>
              );
            })}
          </View>

          {/* Quick Reply Suggestion Chips */}
          <View style={styles.quickReplyContainer}>
            <Text style={styles.quickReplyTitle}>Quick Responses:</Text>
            <View style={styles.quickChipsRow}>
              {quickReplies.map((qr, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.quickChip}
                  onPress={() => setReplyText(qr)}
                >
                  <Text style={styles.quickChipText}>{qr}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* User Reply Input Bar */}
          <View style={styles.replyBar}>
            <TextInput
              style={styles.replyInput}
              placeholder="Respond to Admin / Technician..."
              placeholderTextColor="#94A3B8"
              value={replyText}
              onChangeText={setReplyText}
              multiline
            />
            <TouchableOpacity
              style={[styles.sendBtn, !replyText.trim() && styles.sendBtnDisabled]}
              onPress={handleSend}
              disabled={!replyText.trim()}
              activeOpacity={0.8}
            >
              <Ionicons name="send" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 12,
  },
  backBtn: {
    backgroundColor: '#0EA5E9',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  backBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  ticketCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  ticketId: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: 0.5,
  },
  ticketDate: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  badgeRow: {
    alignItems: 'flex-end',
  },
  ticketTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 6,
  },
  categorySub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 12,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  hardwareCard: {
    backgroundColor: '#F0F9FF',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    marginBottom: 12,
  },
  hardwareHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  hardwareTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0369A1',
    flex: 1,
  },
  partStatusPill: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  partStatusText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#B45309',
    letterSpacing: 0.3,
  },
  partDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  partLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  partValue: {
    fontSize: 11,
    color: '#0F172A',
    fontWeight: '700',
    flex: 1,
    textAlign: 'right',
  },
  technicianCard: {
    backgroundColor: '#FFFBEB',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#FDE68A',
    marginBottom: 12,
  },
  techRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  techAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  techRoleTitle: {
    fontSize: 9,
    fontWeight: '800',
    color: '#D97706',
    letterSpacing: 0.5,
  },
  techName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  techPhone: {
    fontSize: 11,
    color: '#64748B',
  },
  scheduledPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  scheduledText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#334155',
  },
  techActionBox: {
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#FDE68A',
  },
  techActionLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#B45309',
  },
  techActionText: {
    fontSize: 11,
    color: '#475569',
    marginTop: 2,
    lineHeight: 16,
  },
  threadCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },
  threadHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  threadHeaderTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  threadHeaderSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
    marginBottom: 14,
  },
  messagesList: {
    gap: 10,
  },
  messageBubble: {
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
  },
  messageBubbleUser: {
    backgroundColor: '#F0F9FF',
    borderColor: '#BAE6FD',
  },
  messageBubbleAdmin: {
    backgroundColor: '#FAF5FF',
    borderColor: '#E9D5FF',
  },
  messageBubbleEmp: {
    backgroundColor: '#FFFBEB',
    borderColor: '#FDE68A',
  },
  senderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  senderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  senderRoleTag: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  timestamp: {
    fontSize: 10,
    color: '#94A3B8',
  },
  senderName: {
    fontSize: 11,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 4,
  },
  messageText: {
    fontSize: 13,
    color: '#0F172A',
    lineHeight: 18,
  },
  quickReplyContainer: {
    marginTop: 14,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  quickReplyTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  quickChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  quickChip: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  quickChipText: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '600',
  },
  replyBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    padding: 6,
    marginTop: 12,
    gap: 8,
  },
  replyInput: {
    flex: 1,
    maxHeight: 80,
    fontSize: 13,
    color: '#0F172A',
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  sendBtn: {
    backgroundColor: '#0EA5E9',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: {
    backgroundColor: '#CBD5E1',
  },
});
