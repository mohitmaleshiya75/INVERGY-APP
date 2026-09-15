import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ title, showBack, onBack }) => {
  const { role, switchRoleAndNavigate, currentScreen, setCurrentScreen, user } = useApp();

  const roles: { key: UserRole; label: string; icon: keyof typeof Ionicons.glyphMap; color: string }[] = [
    { key: 'END_USER', label: 'End User', icon: 'person', color: '#0EA5E9' },
    { key: 'EMPLOYEE', label: 'Employee', icon: 'construct', color: '#F59E0B' },
    { key: 'ADMIN', label: 'Admin', icon: 'shield-checkmark', color: '#8B5CF6' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topContainer}>
        {/* Brand Bar */}
        <View style={styles.brandRow}>
          <View style={styles.brandLeft}>
            <View style={styles.logoBadge}>
              <Ionicons name="flash" size={18} color="#FFFFFF" />
            </View>
            <View>
              <Text style={styles.brandTitle}>INVERGY</Text>
              <Text style={styles.brandSub}>Energy & Inverter Care</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.profileChip}
            onPress={() => setCurrentScreen('AUTH')}
            activeOpacity={0.8}
          >
            <Ionicons name="person-circle-outline" size={18} color="#0F172A" />
            <Text style={styles.profileText} numberOfLines={1}>
              {currentScreen === 'AUTH' ? 'Close Auth' : user.name.split(' ')[0]}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Interactive Role Switcher Bar */}
        <View style={styles.roleSwitcherContainer}>
          <Text style={styles.roleSwitcherLabel}>TEST VIEW ROLE:</Text>
          <View style={styles.roleTabs}>
            {roles.map((r) => {
              const isActive = role === r.key;
              return (
                <TouchableOpacity
                  key={r.key}
                  style={[
                    styles.roleTab,
                    isActive && { backgroundColor: r.color, borderColor: r.color },
                  ]}
                  onPress={() => switchRoleAndNavigate(r.key)}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={r.icon}
                    size={14}
                    color={isActive ? '#FFFFFF' : '#64748B'}
                    style={{ marginRight: 4 }}
                  />
                  <Text
                    style={[
                      styles.roleTabText,
                      isActive ? styles.roleTabTextActive : styles.roleTabTextInactive,
                    ]}
                  >
                    {r.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Optional Page Subheader / Back Bar */}
        {title && (
          <View style={styles.titleRow}>
            {showBack && (
              <TouchableOpacity style={styles.backButton} onPress={onBack}>
                <Ionicons name="arrow-back" size={20} color="#0F172A" />
              </TouchableOpacity>
            )}
            <Text style={styles.pageTitle}>{title}</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  topContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 10,
    backgroundColor: '#FFFFFF',
  },
  brandRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  brandLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#0EA5E9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: 1,
  },
  brandSub: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  profileChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 4,
  },
  profileText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0F172A',
  },
  roleSwitcherContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  roleSwitcherLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.8,
    marginBottom: 4,
    paddingHorizontal: 4,
  },
  roleTabs: {
    flexDirection: 'row',
    gap: 6,
  },
  roleTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
  },
  roleTabText: {
    fontSize: 11,
    fontWeight: '700',
  },
  roleTabTextActive: {
    color: '#FFFFFF',
  },
  roleTabTextInactive: {
    color: '#475569',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  backButton: {
    marginRight: 10,
    padding: 4,
    borderRadius: 6,
    backgroundColor: '#F1F5F9',
  },
  pageTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
  },
});
