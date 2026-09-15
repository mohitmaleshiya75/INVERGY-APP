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

export const ComplaintDetailScreen: React.FC = () => {
  const { activeComplaint, sendUserReply, setCurrentScreen } = useApp();
  const [replyText, setReplyText] = useState('');

  if (!activeComplaint) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No query selected.</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => setCurrentScreen('USER_MAIN')}>
          <Text style={styles.backBtnText}>Back to Support</Text>
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
    'Model: SolarMax Pro 5.5kVA',
    'Serial No: INV-2025-8942',
    'I will call the technician directly.',
  ];

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Ticket Header Card */}
        <View style={styles.ticketCard}>
          <View style={styles.topRow}>
            <View>
              <Text style={styles.ticketId}>{activeComplaint.id}</Text>
              <Text style={styles.ticketDate}>Raised: {activeComplaint.createdAt}</Text>
            </View>
            <PriorityBadge priority={activeComplaint.priority} />
          </View>

          <Text style={styles.ticketTitle}>{activeComplaint.title}</Text>
          <Text style={styles.categorySub}>Category: {activeComplaint.categoryName}</Text>

          {activeComplaint.customProblemDetails && (
            <View style={styles.customProblemBox}>
              <Text style={styles.customProblemLabel}>Clarified Problem:</Text>
              <Text style={styles.customProblemText}>{activeComplaint.customProblemDetails}</Text>
            </View>
          )}

          <View style={styles.divider} />

          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Status:</Text>
            <StatusBadge status={activeComplaint.status} />
          </View>
        </View>

        {/* Assigned Technician Contact Card (Shared by Admin) */}
        {activeComplaint.sharedTechnician && (
          <View style={styles.techCard}>
            <View style={styles.techTopRow}>
              <View style={styles.techIconCircle}>
                <Ionicons name="call" size={20} color="#FFFFFF" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.techCardBadge}>ASSIGNED TECHNICIAN CONTACT</Text>
                <Text style={styles.techName}>{activeComplaint.sharedTechnician.name}</Text>
                <Text style={styles.techPhone}>{activeComplaint.sharedTechnician.phone}</Text>
                {activeComplaint.sharedTechnician.designation && (
                  <Text style={styles.techDesig}>{activeComplaint.sharedTechnician.designation}</Text>
                )}
              </View>
            </View>

            <TouchableOpacity
              style={styles.callBtn}
              onPress={() => alert(`Dialing technician ${activeComplaint.sharedTechnician?.name} at ${activeComplaint.sharedTechnician?.phone}`)}
              activeOpacity={0.85}
            >
              <Ionicons name="call-outline" size={16} color="#FFFFFF" />
              <Text style={styles.callBtnText}>Call Technician Directly</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Direct Admin <-> User Chat Thread */}
        <View style={styles.threadCard}>
          <View style={styles.threadHeader}>
            <Ionicons name="chatbubbles-outline" size={18} color="#0EA5E9" />
            <Text style={styles.threadHeaderTitle}>Direct Chat with Admin Support</Text>
          </View>
          <Text style={styles.threadHeaderSub}>
            Provide product serial numbers, photos, or updates to the Admin here.
          </Text>

          <View style={styles.messagesList}>
            {activeComplaint.messages.map((msg) => {
              const isUser = msg.senderRole === 'END_USER';

              return (
                <View
                  key={msg.id}
                  style={[
                    styles.messageBubble,
                    isUser ? styles.messageBubbleUser : styles.messageBubbleAdmin,
                  ]}
                >
                  <View style={styles.senderHeader}>
                    <View style={styles.senderLeft}>
                      <Ionicons
                        name={isUser ? 'person-circle' : 'shield-checkmark'}
                        size={14}
                        color={isUser ? '#0284C7' : '#7C3AED'}
                      />
                      <Text
                        style={[
                          styles.senderRoleTag,
                          { color: isUser ? '#0284C7' : '#7C3AED' },
                        ]}
                      >
                        {isUser ? 'YOU' : 'ADMIN SUPPORT'}
                      </Text>
                    </View>
                    <Text style={styles.timestamp}>{msg.timestamp}</Text>
                  </View>

                  <Text style={styles.messageText}>{msg.text}</Text>

                  {/* If message shared technician contact */}
                  {msg.technicianShared && (
                    <View style={styles.msgTechBox}>
                      <Ionicons name="call" size={14} color="#7C3AED" />
                      <Text style={styles.msgTechText}>
                        Technician Contact: {msg.technicianShared.name} ({msg.technicianShared.phone})
                      </Text>
                    </View>
                  )}
                </View>
              );
            })}
          </View>

          {/* Quick Product Detail Suggestion Chips */}
          <View style={styles.quickReplyContainer}>
            <Text style={styles.quickReplyTitle}>Quick Responses & Product Details:</Text>
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
              placeholder="Respond to Admin or share product details..."
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
  },
  ticketDate: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
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
  customProblemBox: {
    backgroundColor: '#FAF5FF',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E9D5FF',
    marginTop: 8,
  },
  customProblemLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#7C3AED',
  },
  customProblemText: {
    fontSize: 12,
    color: '#4C1D95',
    marginTop: 2,
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
  techCard: {
    backgroundColor: '#1E1B4B',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
  },
  techTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  techIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#7C3AED',
    alignItems: 'center',
    justifyContent: 'center',
  },
  techCardBadge: {
    fontSize: 9,
    fontWeight: '800',
    color: '#C4B5FD',
    letterSpacing: 0.8,
  },
  techName: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
    marginTop: 2,
  },
  techPhone: {
    fontSize: 14,
    fontWeight: '700',
    color: '#A7F3D0',
    marginTop: 1,
  },
  techDesig: {
    fontSize: 11,
    color: '#DDD6FE',
    marginTop: 2,
  },
  callBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#059669',
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 12,
    gap: 6,
  },
  callBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
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
  messageText: {
    fontSize: 13,
    color: '#0F172A',
    lineHeight: 18,
  },
  msgTechBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EDE9FE',
    padding: 8,
    borderRadius: 6,
    marginTop: 8,
  },
  msgTechText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6B21A8',
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
