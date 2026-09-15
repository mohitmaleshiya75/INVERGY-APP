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
  const { role, switchRole, userTab, setUserTab, currentScreen, setCurrentScreen } = useApp();

  const roles: { key: UserRole; label: string; icon: keyof typeof Ionicons.glyphMap; color: string }[] = [
    { key: 'END_USER', label: 'End User', icon: 'person', color: '#0EA5E9' },
    { key: 'ADMIN', label: 'Admin', icon: 'shield-checkmark', color: '#8B5CF6' },
  ];

  const isUserMain = role === 'END_USER' && currentScreen === 'USER_MAIN';

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
              <Text style={styles.brandSub}>Energy & Equipment Support</Text>
            </View>
          </View>

          {/* Quick Role Switcher (End User / Admin) */}
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
                  onPress={() => switchRole(r.key)}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name={r.icon}
                    size={13}
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

        {/* User Tabs: "Help & Support" and "Profile" (Only shown for End User on main view) */}
        {role === 'END_USER' && isUserMain && (
          <View style={styles.userTabBar}>
            <TouchableOpacity
              style={[styles.userTabBtn, userTab === 'HELP_SUPPORT' && styles.userTabBtnActive]}
              onPress={() => setUserTab('HELP_SUPPORT')}
              activeOpacity={0.8}
            >
              <Ionicons
                name={userTab === 'HELP_SUPPORT' ? 'help-buoy' : 'help-buoy-outline'}
                size={16}
                color={userTab === 'HELP_SUPPORT' ? '#0EA5E9' : '#64748B'}
              />
              <Text
                style={[
                  styles.userTabBtnText,
                  userTab === 'HELP_SUPPORT' && styles.userTabBtnTextActive,
                ]}
              >
                Help & Support
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.userTabBtn, userTab === 'PROFILE' && styles.userTabBtnActive]}
              onPress={() => setUserTab('PROFILE')}
              activeOpacity={0.8}
            >
              <Ionicons
                name={userTab === 'PROFILE' ? 'person' : 'person-outline'}
                size={16}
                color={userTab === 'PROFILE' ? '#0EA5E9' : '#64748B'}
              />
              <Text
                style={[
                  styles.userTabBtnText,
                  userTab === 'PROFILE' && styles.userTabBtnTextActive,
                ]}
              >
                Profile
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Sub-page Navigation Header */}
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
    paddingBottom: 8,
    backgroundColor: '#FFFFFF',
  },
  brandRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
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
    fontSize: 10,
    color: '#64748B',
    fontWeight: '500',
  },
  roleTabs: {
    flexDirection: 'row',
    gap: 6,
    backgroundColor: '#F1F5F9',
    padding: 3,
    borderRadius: 8,
  },
  roleTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  roleTabText: {
    fontSize: 11,
    fontWeight: '700',
  },
  roleTabTextActive: {
    color: '#FFFFFF',
  },
  roleTabTextInactive: {
    color: '#64748B',
  },
  userTabBar: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 4,
  },
  userTabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 7,
    gap: 6,
  },
  userTabBtnActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  userTabBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  userTabBtnTextActive: {
    color: '#0EA5E9',
    fontWeight: '800',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  backButton: {
    marginRight: 10,
    padding: 4,
    borderRadius: 6,
    backgroundColor: '#F1F5F9',
  },
  pageTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
});
