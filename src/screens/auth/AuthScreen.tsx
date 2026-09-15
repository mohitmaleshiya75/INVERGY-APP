import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';

export const AuthScreen: React.FC = () => {
  const { user, registerAndLogin, setCurrentScreen, role } = useApp();

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);
  const [address, setAddress] = useState(user.address);
  const [inverterModel, setInverterModel] = useState(user.inverterModel);
  const [serialNumber, setSerialNumber] = useState(user.serialNumber);
  const [selectedRole, setSelectedRole] = useState<UserRole>('END_USER');
  const [registeredSuccess, setRegisteredSuccess] = useState(false);

  const handleRegister = () => {
    if (!name.trim()) return;
    registerAndLogin({
      name: name.trim(),
      email: email.trim() || 'customer@invergy.com',
      phone: phone.trim() || '+91 98000 00000',
      address: address.trim() || 'Sector 15, Solar Green Enclave',
      inverterModel: inverterModel.trim() || 'INVERGY Hybrid Smart 5kVA',
      serialNumber: serialNumber.trim() || 'INV-2025-GEN-001',
      role: selectedRole,
    });
    setRegisteredSuccess(true);
    setTimeout(() => {
      setRegisteredSuccess(false);
    }, 1500);
  };

  const handleQuickDemo = (demoRole: UserRole, demoName: string) => {
    setSelectedRole(demoRole);
    setName(demoName);
    registerAndLogin({
      name: demoName,
      email: `${demoName.toLowerCase().replace(' ', '.')}@invergy.com`,
      phone: '+91 98765 43210',
      address: 'Plot 12, Energy Park, Gurugram',
      inverterModel: 'INVERGY SolarMax Pro 5.5kVA',
      serialNumber: 'INV-2025-SM55-8942',
      role: demoRole,
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Top Branding Banner */}
        <View style={styles.heroSection}>
          <View style={styles.iconCircle}>
            <Ionicons name="flash" size={32} color="#FFFFFF" />
          </View>
          <Text style={styles.heroTitle}>INVERGY PORTAL</Text>
          <Text style={styles.heroSubtitle}>Customer Registration & Equipment Support</Text>
        </View>

        {/* Quick Demo Switcher Card */}
        <View style={styles.demoCard}>
          <Text style={styles.demoTitle}>QUICK SWITCH USER ROLE</Text>
          <Text style={styles.demoDesc}>Test the complete workflow with pre-configured accounts:</Text>
          <View style={styles.demoButtonsRow}>
            <TouchableOpacity
              style={[styles.demoBtn, selectedRole === 'END_USER' && styles.demoBtnActiveBlue]}
              onPress={() => handleQuickDemo('END_USER', 'Rahul Verma (Customer)')}
            >
              <Ionicons name="person" size={14} color="#0EA5E9" />
              <Text style={styles.demoBtnText}>End User</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.demoBtn, selectedRole === 'EMPLOYEE' && styles.demoBtnActiveAmber]}
              onPress={() => handleQuickDemo('EMPLOYEE', 'Vikram Singh (Technician)')}
            >
              <Ionicons name="construct" size={14} color="#F59E0B" />
              <Text style={styles.demoBtnText}>Employee</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.demoBtn, selectedRole === 'ADMIN' && styles.demoBtnActivePurple]}
              onPress={() => handleQuickDemo('ADMIN', 'Admin Operations Team')}
            >
              <Ionicons name="shield-checkmark" size={14} color="#8B5CF6" />
              <Text style={styles.demoBtnText}>Admin</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Registration Form */}
        <View style={styles.formCard}>
          <Text style={styles.sectionHeader}>END USER REGISTRATION</Text>
          <Text style={styles.sectionSub}>Register your inverter system to raise service & replacement requests</Text>

          {/* Full Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Customer Name *</Text>
            <View style={styles.inputBox}>
              <Ionicons name="person-outline" size={18} color="#94A3B8" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="e.g. Rahul Verma"
                value={name}
                onChangeText={setName}
                placeholderTextColor="#94A3B8"
              />
            </View>
          </View>

          {/* Phone Number */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mobile Contact Number *</Text>
            <View style={styles.inputBox}>
              <Ionicons name="call-outline" size={18} color="#94A3B8" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="e.g. +91 98765 43210"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                placeholderTextColor="#94A3B8"
              />
            </View>
          </View>

          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address</Text>
            <View style={styles.inputBox}>
              <Ionicons name="mail-outline" size={18} color="#94A3B8" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="e.g. rahul.verma@example.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#94A3B8"
              />
            </View>
          </View>

          {/* Service Address */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Installation / Service Address *</Text>
            <View style={styles.inputBox}>
              <Ionicons name="location-outline" size={18} color="#94A3B8" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="Flat / House No., Sector, City"
                value={address}
                onChangeText={setAddress}
                placeholderTextColor="#94A3B8"
              />
            </View>
          </View>

          {/* Inverter Model */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Inverter / Solar System Model</Text>
            <View style={styles.inputBox}>
              <Ionicons name="hardware-chip-outline" size={18} color="#94A3B8" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="e.g. INVERGY SolarMax Pro 5.5kVA"
                value={inverterModel}
                onChangeText={setInverterModel}
                placeholderTextColor="#94A3B8"
              />
            </View>
          </View>

          {/* Serial Number */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Device Serial Number</Text>
            <View style={styles.inputBox}>
              <Ionicons name="barcode-outline" size={18} color="#94A3B8" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="e.g. INV-2025-SM55-8942"
                value={serialNumber}
                onChangeText={setSerialNumber}
                autoCapitalize="characters"
                placeholderTextColor="#94A3B8"
              />
            </View>
          </View>

          {/* Role Selection Option */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Register Role:</Text>
            <View style={styles.rolePickerRow}>
              {(['END_USER', 'EMPLOYEE', 'ADMIN'] as UserRole[]).map((r) => (
                <TouchableOpacity
                  key={r}
                  style={[styles.roleSelectChip, selectedRole === r && styles.roleSelectChipActive]}
                  onPress={() => setSelectedRole(r)}
                >
                  <Text style={[styles.roleSelectText, selectedRole === r && styles.roleSelectTextActive]}>
                    {r === 'END_USER' ? 'End User' : r === 'EMPLOYEE' ? 'Employee' : 'Admin'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity style={styles.submitBtn} onPress={handleRegister} activeOpacity={0.85}>
            <Ionicons name="checkmark-circle-outline" size={20} color="#FFFFFF" />
            <Text style={styles.submitBtnText}>
              {registeredSuccess ? 'Registered Successfully!' : 'Register & Enter App'}
            </Text>
          </TouchableOpacity>

          {/* Cancel / Back to Dashboard */}
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => {
              if (role === 'END_USER') setCurrentScreen('USER_HOME');
              else if (role === 'ADMIN') setCurrentScreen('ADMIN_HOME');
              else setCurrentScreen('EMPLOYEE_HOME');
            }}
          >
            <Text style={styles.backBtnText}>Skip to Active Screen</Text>
          </TouchableOpacity>
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
  heroSection: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#0EA5E9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    shadowColor: '#0EA5E9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: 1.5,
  },
  heroSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 4,
    fontWeight: '500',
  },
  demoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  demoTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0EA5E9',
    letterSpacing: 0.8,
  },
  demoDesc: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
    marginBottom: 10,
  },
  demoButtonsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  demoBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 4,
  },
  demoBtnActiveBlue: {
    backgroundColor: '#E0F2FE',
    borderColor: '#0EA5E9',
  },
  demoBtnActiveAmber: {
    backgroundColor: '#FEF3C7',
    borderColor: '#F59E0B',
  },
  demoBtnActivePurple: {
    backgroundColor: '#EDE9FE',
    borderColor: '#8B5CF6',
  },
  demoBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F172A',
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: 0.5,
  },
  sectionSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 3,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 14,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 6,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    height: 44,
    fontSize: 14,
    color: '#0F172A',
  },
  rolePickerRow: {
    flexDirection: 'row',
    gap: 8,
  },
  roleSelectChip: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: '#F8FAFC',
  },
  roleSelectChipActive: {
    backgroundColor: '#0EA5E9',
    borderColor: '#0EA5E9',
  },
  roleSelectText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  roleSelectTextActive: {
    color: '#FFFFFF',
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0EA5E9',
    borderRadius: 10,
    paddingVertical: 14,
    marginTop: 10,
    gap: 8,
  },
  submitBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  backBtn: {
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 6,
  },
  backBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
});
