import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import { PriorityBadge, StatusBadge } from '../../components/StatusBadge';
import { PROBLEM_CATEGORIES } from '../../data/mockData';

export const UserHomeScreen: React.FC = () => {
  const { user, complaints, setCurrentScreen, setSelectedCategory, setActiveComplaintId } = useApp();

  const handleRaiseComplaint = () => {
    setCurrentScreen('CATEGORY_SELECT');
  };

  const handleOpenComplaint = (id: string) => {
    setActiveComplaintId(id);
    setCurrentScreen('COMPLAINT_DETAIL');
  };

  const activeTickets = complaints.filter((c) => c.status !== 'RESOLVED');
  const resolvedTickets = complaints.filter((c) => c.status === 'RESOLVED');

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Help & Support Banner */}
        <View style={styles.supportHeroCard}>
          <View style={styles.heroTop}>
            <View>
              <Text style={styles.heroGreeting}>Hello, {user.name.split(' ')[0]}</Text>
              <Text style={styles.heroTitle}>Help & Support Center</Text>
            </View>
            <View style={styles.activePill}>
              <Ionicons name="flash" size={12} color="#0284C7" />
              <Text style={styles.activePillText}>24/7 ASSISTANCE</Text>
            </View>
          </View>
          <Text style={styles.heroSub}>
            Direct support with Admin. Select a problem category or choose "Other Problem" to explain your issue.
          </Text>
        </View>

        {/* Primary Action Button: Raise Complaint */}
        <TouchableOpacity
          style={styles.raiseActionCard}
          onPress={handleRaiseComplaint}
          activeOpacity={0.85}
        >
          <View style={styles.raiseIconCircle}>
            <Ionicons name="add-circle" size={28} color="#FFFFFF" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.raiseTitle}>Raise a New Complaint</Text>
            <Text style={styles.raiseSub}>
              Select category ➔ report issue ➔ get direct Admin reply & technician contact
            </Text>
          </View>
          <Ionicons name="arrow-forward-circle" size={26} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Problem Categories Fast Picker */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Problem Categories</Text>
          <TouchableOpacity onPress={() => setCurrentScreen('CATEGORY_SELECT')}>
            <Text style={styles.seeAllText}>View All ➔</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {PROBLEM_CATEGORIES.map((cat) => {
            const isOther = !!cat.isOther;
            return (
              <TouchableOpacity
                key={cat.id}
                style={[styles.catMiniCard, isOther && styles.catMiniCardOther]}
                onPress={() => {
                  setSelectedCategory(cat);
                  setCurrentScreen('RAISE_COMPLAINT');
                }}
              >
                <View
                  style={[
                    styles.catMiniIcon,
                    isOther && { backgroundColor: '#EDE9FE' },
                  ]}
                >
                  <Ionicons
                    name={cat.icon as any}
                    size={20}
                    color={isOther ? '#8B5CF6' : '#0EA5E9'}
                  />
                </View>
                <Text style={styles.catMiniTitle} numberOfLines={2}>
                  {cat.title}
                </Text>
                <Text
                  style={[
                    styles.catMiniBadge,
                    isOther && { color: '#8B5CF6' },
                  ]}
                >
                  {cat.badge}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Active Support Tickets */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>
            My Support Queries ({activeTickets.length})
          </Text>
        </View>

        {activeTickets.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons name="checkmark-circle-outline" size={32} color="#10B981" />
            <Text style={styles.emptyTitle}>No Active Complaints</Text>
            <Text style={styles.emptySub}>You have no pending support tickets.</Text>
          </View>
        ) : (
          <View style={styles.ticketsList}>
            {activeTickets.map((ticket) => {
              const lastMsg = ticket.messages[ticket.messages.length - 1];

              return (
                <TouchableOpacity
                  key={ticket.id}
                  style={styles.ticketCard}
                  onPress={() => handleOpenComplaint(ticket.id)}
                  activeOpacity={0.8}
                >
                  <View style={styles.ticketHeaderRow}>
                    <Text style={styles.ticketId}>{ticket.id}</Text>
                    <PriorityBadge priority={ticket.priority} />
                  </View>

                  <Text style={styles.ticketTitle}>{ticket.title}</Text>
                  <Text style={styles.ticketCategory}>Category: {ticket.categoryName}</Text>

                  {/* Shared Technician Pill */}
                  {ticket.sharedTechnician && (
                    <View style={styles.techPill}>
                      <Ionicons name="call" size={12} color="#7C3AED" />
                      <Text style={styles.techPillText}>
                        Technician: {ticket.sharedTechnician.name} ({ticket.sharedTechnician.phone})
                      </Text>
                    </View>
                  )}

                  {/* Last Message Snippet */}
                  {lastMsg && (
                    <View style={styles.lastMsgBox}>
                      <Text style={styles.lastMsgSender}>
                        {lastMsg.senderRole === 'ADMIN' ? 'Admin:' : 'You:'}
                      </Text>
                      <Text style={styles.lastMsgText} numberOfLines={1}>
                        {lastMsg.text}
                      </Text>
                    </View>
                  )}

                  <View style={styles.ticketFooter}>
                    <StatusBadge status={ticket.status} />
                    <Text style={styles.viewThreadText}>Open Chat ➔</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* Resolved Queries */}
        {resolvedTickets.length > 0 && (
          <>
            <View style={[styles.sectionHeaderRow, { marginTop: 22 }]}>
              <Text style={styles.sectionTitle}>
                Resolved Queries ({resolvedTickets.length})
              </Text>
            </View>
            <View style={styles.ticketsList}>
              {resolvedTickets.map((ticket) => (
                <TouchableOpacity
                  key={ticket.id}
                  style={[styles.ticketCard, styles.ticketCardResolved]}
                  onPress={() => handleOpenComplaint(ticket.id)}
                  activeOpacity={0.8}
                >
                  <View style={styles.ticketHeaderRow}>
                    <Text style={styles.ticketId}>{ticket.id}</Text>
                    <StatusBadge status={ticket.status} />
                  </View>
                  <Text style={styles.ticketTitle}>{ticket.title}</Text>
                  <View style={styles.ticketFooter}>
                    <Text style={styles.resolvedNote}>✓ Query Closed</Text>
                    <Text style={styles.viewThreadText}>Review Chat ➔</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}
      </ScrollView>
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
  supportHeroCard: {
    backgroundColor: '#0F172A',
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  heroGreeting: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 2,
  },
  activePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  activePillText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#0284C7',
    letterSpacing: 0.5,
  },
  heroSub: {
    fontSize: 12,
    color: '#94A3B8',
    lineHeight: 16,
  },
  raiseActionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0EA5E9',
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    gap: 12,
    shadowColor: '#0EA5E9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  raiseIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  raiseTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  raiseSub: {
    fontSize: 11,
    color: '#E0F2FE',
    marginTop: 2,
    lineHeight: 15,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  seeAllText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0EA5E9',
  },
  categoryScroll: {
    gap: 10,
    paddingBottom: 6,
    marginBottom: 16,
  },
  catMiniCard: {
    width: 140,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  catMiniCardOther: {
    borderColor: '#C4B5FD',
    backgroundColor: '#FAF5FF',
  },
  catMiniIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F0F9FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  catMiniTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
    height: 32,
  },
  catMiniBadge: {
    fontSize: 9,
    fontWeight: '700',
    color: '#0284C7',
    marginTop: 6,
  },
  ticketsList: {
    gap: 10,
  },
  ticketCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  ticketCardResolved: {
    backgroundColor: '#F8FAFC',
    borderColor: '#CBD5E1',
  },
  ticketHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  ticketId: {
    fontSize: 12,
    fontWeight: '800',
    color: '#475569',
  },
  ticketTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  ticketCategory: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  techPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FAF5FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 6,
    alignSelf: 'flex-start',
  },
  techPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#7C3AED',
  },
  lastMsgBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 6,
    padding: 6,
    marginTop: 8,
    gap: 4,
  },
  lastMsgSender: {
    fontSize: 11,
    fontWeight: '700',
    color: '#334155',
  },
  lastMsgText: {
    fontSize: 11,
    color: '#64748B',
    flex: 1,
  },
  ticketFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  viewThreadText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0EA5E9',
  },
  resolvedNote: {
    fontSize: 11,
    fontWeight: '600',
    color: '#10B981',
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 8,
  },
  emptySub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
});
