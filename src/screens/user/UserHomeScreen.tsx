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

  const activeTickets = complaints.filter(
    (c) => c.status !== 'REPAIR_REPLACEMENT_DONE' && c.status !== 'RESOLVED'
  );
  const completedTickets = complaints.filter(
    (c) => c.status === 'REPAIR_REPLACEMENT_DONE' || c.status === 'RESOLVED'
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Welcome Customer Card */}
        <View style={styles.userCard}>
          <View style={styles.userTop}>
            <View>
              <Text style={styles.greeting}>Welcome Back,</Text>
              <Text style={styles.userName}>{user.name}</Text>
            </View>
            <View style={styles.warrantyPill}>
              <Ionicons name="shield-checkmark" size={14} color="#10B981" />
              <Text style={styles.warrantyText}>WARRANTY ACTIVE</Text>
            </View>
          </View>

          <View style={styles.equipmentBox}>
            <Ionicons name="hardware-chip-outline" size={20} color="#0EA5E9" />
            <View style={{ flex: 1 }}>
              <Text style={styles.equipmentLabel}>REGISTERED SYSTEM</Text>
              <Text style={styles.equipmentName}>{user.inverterModel}</Text>
              <Text style={styles.serialText}>S/N: {user.serialNumber}</Text>
            </View>
          </View>
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
              Select category ➔ report fault ➔ get admin reply & on-site repair/replacement
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
          {PROBLEM_CATEGORIES.slice(0, 4).map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={styles.catMiniCard}
              onPress={() => {
                setSelectedCategory(cat);
                setCurrentScreen('RAISE_COMPLAINT');
              }}
            >
              <View style={styles.catMiniIcon}>
                <Ionicons name={cat.icon as any} size={20} color="#0EA5E9" />
              </View>
              <Text style={styles.catMiniTitle} numberOfLines={2}>
                {cat.title}
              </Text>
              <Text style={styles.catMiniBadge}>{cat.badge}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Active Complaints List */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>
            Active Complaints ({activeTickets.length})
          </Text>
        </View>

        {activeTickets.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons name="checkmark-circle-outline" size={32} color="#10B981" />
            <Text style={styles.emptyTitle}>No Active Complaints</Text>
            <Text style={styles.emptySub}>Your inverter system is operating normally.</Text>
          </View>
        ) : (
          <View style={styles.ticketsList}>
            {activeTickets.map((ticket) => (
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

                {ticket.replacement.required && (
                  <View style={styles.replacementIndicator}>
                    <Ionicons name="hardware-chip" size={12} color="#0284C7" />
                    <Text style={styles.replacementIndicatorText}>
                      Part Replacement: {ticket.replacement.partName} ({ticket.replacement.status})
                    </Text>
                  </View>
                )}

                <View style={styles.ticketFooter}>
                  <StatusBadge status={ticket.status} />
                  <Text style={styles.viewThreadText}>View Thread ➔</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Resolved / Completed History */}
        {completedTickets.length > 0 && (
          <>
            <View style={[styles.sectionHeaderRow, { marginTop: 20 }]}>
              <Text style={styles.sectionTitle}>
                Resolved & Replaced History ({completedTickets.length})
              </Text>
            </View>
            <View style={styles.ticketsList}>
              {completedTickets.map((ticket) => (
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
                  <Text style={styles.ticketCategory}>
                    Completed: {ticket.repair.completedAt || 'Recently'}
                  </Text>
                  <View style={styles.ticketFooter}>
                    <Text style={styles.resolvedNote}>✓ Replacement & Repair Signed Off</Text>
                    <Text style={styles.viewThreadText}>Review ➔</Text>
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
  userCard: {
    backgroundColor: '#0F172A',
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
  },
  userTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  greeting: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
  },
  userName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 2,
  },
  warrantyPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#064E3B',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  warrantyText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#34D399',
    letterSpacing: 0.5,
  },
  equipmentBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 10,
    padding: 12,
    gap: 10,
  },
  equipmentLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#38BDF8',
    letterSpacing: 0.5,
  },
  equipmentName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#F8FAFC',
    marginTop: 2,
  },
  serialText: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 1,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
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
  replacementIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F0F9FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 8,
  },
  replacementIndicatorText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0369A1',
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
