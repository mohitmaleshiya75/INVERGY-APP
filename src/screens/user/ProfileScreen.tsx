import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';

export const ProfileScreen: React.FC = () => {
  const { user, updateUserProfile, setUserTab } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone);
  const [email, setEmail] = useState(user.email);
  const [address, setAddress] = useState(user.address);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    updateUserProfile({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      address: address.trim(),
    });
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      {/* User Header Profile Card */}
      <View style={styles.profileCard}>
        <View style={styles.avatarSection}>
          <View style={styles.avatarCircle}>
            <Ionicons name="person" size={32} color="#FFFFFF" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.profileName}>{user.name}</Text>
            <Text style={styles.profilePhone}>{user.phone}</Text>
            <View style={styles.roleTag}>
              <Ionicons name="checkmark-circle" size={12} color="#10B981" />
              <Text style={styles.roleTagText}>VERIFIED CUSTOMER</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Guidance Card: No Pre-registered Products Required */}
      <View style={styles.noticeCard}>
        <View style={styles.noticeHeader}>
          <Ionicons name="information-circle" size={20} color="#0284C7" />
          <Text style={styles.noticeTitle}>No Registered Products Needed</Text>
        </View>
        <Text style={styles.noticeBody}>
          You do not need to register equipment or serial numbers upfront. When you raise a complaint, you can directly chat with Admin to share any inverter or solar model details if required.
        </Text>
        <TouchableOpacity
          style={styles.goToSupportBtn}
          onPress={() => setUserTab('HELP_SUPPORT')}
          activeOpacity={0.8}
        >
          <Text style={styles.goToSupportBtnText}>Open Help & Support Tab ➔</Text>
        </TouchableOpacity>
      </View>

      {/* Profile Details Card */}
      <View style={styles.detailsCard}>
        <View style={styles.detailsHeader}>
          <Text style={styles.detailsTitle}>Personal & Service Details</Text>
          <TouchableOpacity
            style={styles.editToggleBtn}
            onPress={() => {
              if (isEditing) handleSave();
              else setIsEditing(true);
            }}
          >
            <Ionicons name={isEditing ? 'checkmark' : 'pencil'} size={14} color="#0EA5E9" />
            <Text style={styles.editToggleText}>{isEditing ? 'Save Changes' : 'Edit'}</Text>
          </TouchableOpacity>
        </View>

        {savedSuccess && (
          <View style={styles.successBanner}>
            <Ionicons name="checkmark-circle" size={16} color="#16A34A" />
            <Text style={styles.successText}>Profile updated successfully!</Text>
          </View>
        )}

        {/* Full Name */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Customer Full Name</Text>
          {isEditing ? (
            <TextInput style={styles.input} value={name} onChangeText={setName} />
          ) : (
            <Text style={styles.fieldValue}>{user.name}</Text>
          )}
        </View>

        {/* Mobile Number */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Mobile Contact Number</Text>
          {isEditing ? (
            <TextInput style={styles.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
          ) : (
            <Text style={styles.fieldValue}>{user.phone}</Text>
          )}
        </View>

        {/* Email Address */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Email Address</Text>
          {isEditing ? (
            <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" />
          ) : (
            <Text style={styles.fieldValue}>{user.email}</Text>
          )}
        </View>

        {/* Service Address */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Installation / Home Address</Text>
          {isEditing ? (
            <TextInput style={[styles.input, { height: 60 }]} value={address} onChangeText={setAddress} multiline />
          ) : (
            <Text style={styles.fieldValue}>{user.address}</Text>
          )}
        </View>
      </View>
    </ScrollView>
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
  profileCard: {
    backgroundColor: '#0F172A',
    borderRadius: 14,
    padding: 18,
    marginBottom: 14,
  },
  avatarSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatarCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#0EA5E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  profilePhone: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 2,
  },
  roleTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#064E3B',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 6,
    gap: 4,
  },
  roleTagText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#34D399',
    letterSpacing: 0.5,
  },
  noticeCard: {
    backgroundColor: '#F0F9FF',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    marginBottom: 14,
  },
  noticeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  noticeTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0369A1',
  },
  noticeBody: {
    fontSize: 12,
    color: '#334155',
    lineHeight: 17,
  },
  goToSupportBtn: {
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  goToSupportBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0284C7',
  },
  detailsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  detailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  detailsTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  editToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F0F9FF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  editToggleText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0EA5E9',
  },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#DCFCE7',
    padding: 8,
    borderRadius: 8,
    marginBottom: 12,
  },
  successText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#16A34A',
  },
  fieldGroup: {
    marginBottom: 14,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 4,
  },
  fieldValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
  },
  input: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 10,
    height: 40,
    fontSize: 13,
    color: '#0F172A',
  },
});
