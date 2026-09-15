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
import { PriorityLevel } from '../../types';

export const RaiseComplaintScreen: React.FC = () => {
  const { selectedCategory, user, createComplaint, setCurrentScreen } = useApp();

  const [title, setTitle] = useState(
    selectedCategory ? `${selectedCategory.title} issue detected` : 'Equipment malfunction'
  );
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<PriorityLevel>('Urgent');
  const [deviceModel, setDeviceModel] = useState(user.inverterModel);
  const [serialNumber, setSerialNumber] = useState(user.serialNumber);
  const [preferredSlot, setPreferredSlot] = useState('Tomorrow Morning (10 AM - 1 PM)');
  const [attachedPhoto, setAttachedPhoto] = useState(false);

  const priorities: PriorityLevel[] = ['Low', 'Medium', 'Urgent', 'Critical'];
  const slots = [
    'Today Urgent (Within 3 Hours)',
    'Tomorrow Morning (10 AM - 1 PM)',
    'Tomorrow Afternoon (2 PM - 6 PM)',
  ];

  const handleSubmit = () => {
    if (!description.trim()) {
      alert('Please enter a brief description of the fault or symptoms.');
      return;
    }

    createComplaint({
      title: title.trim(),
      description: description.trim(),
      priority,
      deviceModel: deviceModel.trim(),
      serialNumber: serialNumber.trim(),
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Category Badge Header */}
        <View style={styles.categoryHeader}>
          <View style={styles.categoryIconCircle}>
            <Ionicons
              name={selectedCategory ? (selectedCategory.icon as any) : 'alert-circle'}
              size={20}
              color="#0EA5E9"
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.categoryHeaderSub}>SELECTED CATEGORY</Text>
            <Text style={styles.categoryHeaderTitle}>
              {selectedCategory ? selectedCategory.title : 'General Equipment Issue'}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.changeBtn}
            onPress={() => setCurrentScreen('CATEGORY_SELECT')}
          >
            <Text style={styles.changeBtnText}>Change</Text>
          </TouchableOpacity>
        </View>

        {/* Complaint Form */}
        <View style={styles.formCard}>
          <Text style={styles.sectionTitle}>File Support & Replacement Ticket</Text>

          {/* Ticket Title */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Complaint Summary / Title *</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="e.g. Inverter Error E04, continuous beeping"
              placeholderTextColor="#94A3B8"
            />
          </View>

          {/* Priority Selector */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Urgency & Impact Level</Text>
            <View style={styles.priorityRow}>
              {priorities.map((p) => {
                const isSelected = priority === p;
                return (
                  <TouchableOpacity
                    key={p}
                    style={[
                      styles.priorityChip,
                      isSelected && styles.priorityChipSelected,
                      isSelected && p === 'Critical' && { backgroundColor: '#EF4444', borderColor: '#EF4444' },
                      isSelected && p === 'Urgent' && { backgroundColor: '#F97316', borderColor: '#F97316' },
                    ]}
                    onPress={() => setPriority(p)}
                  >
                    <Text
                      style={[
                        styles.priorityText,
                        isSelected && { color: '#FFFFFF', fontWeight: '800' },
                      ]}
                    >
                      {p}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Device Model & Serial */}
          <View style={styles.rowTwoCols}>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Inverter Model</Text>
              <TextInput
                style={styles.inputSmall}
                value={deviceModel}
                onChangeText={setDeviceModel}
                placeholder="Model"
                placeholderTextColor="#94A3B8"
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Serial Number</Text>
              <TextInput
                style={styles.inputSmall}
                value={serialNumber}
                onChangeText={setSerialNumber}
                placeholder="Serial No."
                placeholderTextColor="#94A3B8"
              />
            </View>
          </View>

          {/* Description */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Detailed Description of the Issue *</Text>
            <TextInput
              style={styles.textArea}
              value={description}
              onChangeText={setDescription}
              placeholder="Describe symptoms: Any burning smell? Error code on LCD? Did breaker trip? Did backup stop immediately?"
              placeholderTextColor="#94A3B8"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          {/* Photo Attachment (Mock) */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Attach Photo / Video Proof (Recommended for replacement)</Text>
            <TouchableOpacity
              style={[styles.uploadBox, attachedPhoto && styles.uploadBoxAttached]}
              onPress={() => setAttachedPhoto(!attachedPhoto)}
              activeOpacity={0.8}
            >
              <Ionicons
                name={attachedPhoto ? 'checkmark-circle' : 'camera-outline'}
                size={22}
                color={attachedPhoto ? '#10B981' : '#0EA5E9'}
              />
              <Text style={[styles.uploadText, attachedPhoto && { color: '#10B981' }]}>
                {attachedPhoto
                  ? 'Photo attached: inverter_error_display.jpg (Tap to remove)'
                  : 'Tap to upload picture of inverter LCD display or burnt part'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Preferred Service Slot */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Preferred Technician Visit Slot</Text>
            <View style={styles.slotList}>
              {slots.map((s) => (
                <TouchableOpacity
                  key={s}
                  style={[styles.slotItem, preferredSlot === s && styles.slotItemSelected]}
                  onPress={() => setPreferredSlot(s)}
                >
                  <Ionicons
                    name={preferredSlot === s ? 'radio-button-on' : 'radio-button-off'}
                    size={16}
                    color={preferredSlot === s ? '#0EA5E9' : '#94A3B8'}
                  />
                  <Text
                    style={[
                      styles.slotText,
                      preferredSlot === s && { color: '#0F172A', fontWeight: '700' },
                    ]}
                  >
                    {s}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Customer Address Confirmation */}
          <View style={styles.addressNotice}>
            <Ionicons name="location" size={16} color="#0EA5E9" />
            <Text style={styles.addressText} numberOfLines={2}>
              Service address: {user.address}
            </Text>
          </View>

          {/* Submit Action */}
          <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} activeOpacity={0.85}>
            <Ionicons name="send" size={18} color="#FFFFFF" />
            <Text style={styles.submitBtnText}>Raise Complaint & Notify Admin</Text>
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
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  categoryIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  categoryHeaderSub: {
    fontSize: 9,
    fontWeight: '800',
    color: '#0284C7',
    letterSpacing: 0.5,
  },
  categoryHeaderTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  changeBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    backgroundColor: '#F1F5F9',
  },
  changeBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0EA5E9',
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
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
  input: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 12,
    height: 44,
    fontSize: 14,
    color: '#0F172A',
  },
  inputSmall: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 10,
    height: 38,
    fontSize: 12,
    color: '#0F172A',
  },
  rowTwoCols: {
    flexDirection: 'row',
    gap: 10,
  },
  priorityRow: {
    flexDirection: 'row',
    gap: 8,
  },
  priorityChip: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: '#F8FAFC',
  },
  priorityChipSelected: {
    backgroundColor: '#0EA5E9',
    borderColor: '#0EA5E9',
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 12,
    paddingVertical: 10,
    height: 90,
    fontSize: 13,
    color: '#0F172A',
  },
  uploadBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#94A3B8',
    borderRadius: 10,
    padding: 12,
    gap: 10,
    backgroundColor: '#F8FAFC',
  },
  uploadBoxAttached: {
    borderColor: '#10B981',
    backgroundColor: '#ECFDF5',
  },
  uploadText: {
    fontSize: 12,
    color: '#64748B',
    flex: 1,
  },
  slotList: {
    gap: 8,
  },
  slotItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 10,
    gap: 8,
    backgroundColor: '#F8FAFC',
  },
  slotItemSelected: {
    borderColor: '#0EA5E9',
    backgroundColor: '#F0F9FF',
  },
  slotText: {
    fontSize: 12,
    color: '#64748B',
  },
  addressNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    padding: 10,
    gap: 8,
    marginVertical: 10,
  },
  addressText: {
    fontSize: 11,
    color: '#475569',
    flex: 1,
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
});
