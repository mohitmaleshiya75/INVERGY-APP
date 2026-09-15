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

  const isOther = !!selectedCategory?.isOther;

  const [title, setTitle] = useState(
    isOther
      ? 'Custom equipment issue'
      : selectedCategory
      ? `${selectedCategory.title} issue`
      : 'Service Request'
  );
  const [customProblemDetails, setCustomProblemDetails] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<PriorityLevel>('Urgent');
  const [attachedPhoto, setAttachedPhoto] = useState(false);

  const priorities: PriorityLevel[] = ['Low', 'Medium', 'Urgent', 'Critical'];

  const handleSubmit = () => {
    if (isOther && !customProblemDetails.trim()) {
      alert('Please specify your problem in the clarification field.');
      return;
    }
    if (!description.trim() && !customProblemDetails.trim()) {
      alert('Please enter a brief description of the issue.');
      return;
    }

    createComplaint({
      title: title.trim(),
      description: description.trim() || customProblemDetails.trim(),
      priority,
      customProblemDetails: isOther ? customProblemDetails.trim() : undefined,
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Selected Category Header */}
        <View style={[styles.categoryHeader, isOther && { borderColor: '#C4B5FD', backgroundColor: '#FAF5FF' }]}>
          <View style={[styles.categoryIconCircle, isOther && { backgroundColor: '#EDE9FE' }]}>
            <Ionicons
              name={selectedCategory ? (selectedCategory.icon as any) : 'help-circle'}
              size={20}
              color={isOther ? '#8B5CF6' : '#0EA5E9'}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.categoryHeaderSub, isOther && { color: '#8B5CF6' }]}>
              {isOther ? 'CUSTOM CATEGORY' : 'SELECTED CATEGORY'}
            </Text>
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

        {/* Form Card */}
        <View style={styles.formCard}>
          <Text style={styles.sectionTitle}>Raise Support Query / Complaint</Text>

          {/* If "Other Problem", Show Special Clarification Input */}
          {isOther && (
            <View style={styles.otherProblemBox}>
              <View style={styles.otherHeaderRow}>
                <Ionicons name="create-outline" size={16} color="#7C3AED" />
                <Text style={styles.otherHeaderTitle}>Clarify Your Problem (Not Listed)</Text>
              </View>
              <Text style={styles.otherHeaderDesc}>
                Describe exactly what you are experiencing so our Admin can understand and respond with the right guidance or technician.
              </Text>
              <TextInput
                style={styles.otherTextArea}
                value={customProblemDetails}
                onChangeText={setCustomProblemDetails}
                placeholder="e.g. Inverter display is flickering and making high pitch click sounds whenever AC is turned on..."
                placeholderTextColor="#94A3B8"
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>
          )}

          {/* Ticket Title */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Summary / Subject *</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="e.g. Inverter Error E04, continuous beeping"
              placeholderTextColor="#94A3B8"
            />
          </View>

          {/* Priority */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Urgency Level</Text>
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

          {/* Description */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Detailed Description / Symptoms *</Text>
            <TextInput
              style={styles.textArea}
              value={description}
              onChangeText={setDescription}
              placeholder="Describe what happened: Any burning smell? Sudden cutoff? Breaker tripped? (Note: You can provide exact product model or serial number in chat with Admin!)"
              placeholderTextColor="#94A3B8"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          {/* Mock Photo Upload */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Attach Photo (Optional)</Text>
            <TouchableOpacity
              style={[styles.uploadBox, attachedPhoto && styles.uploadBoxAttached]}
              onPress={() => setAttachedPhoto(!attachedPhoto)}
              activeOpacity={0.8}
            >
              <Ionicons
                name={attachedPhoto ? 'checkmark-circle' : 'camera-outline'}
                size={20}
                color={attachedPhoto ? '#10B981' : '#0EA5E9'}
              />
              <Text style={[styles.uploadText, attachedPhoto && { color: '#10B981' }]}>
                {attachedPhoto
                  ? 'Photo attached: issue_photo.jpg (Tap to remove)'
                  : 'Tap to upload photo of issue or error screen'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* User Location Info */}
          <View style={styles.addressNotice}>
            <Ionicons name="location" size={16} color="#0EA5E9" />
            <Text style={styles.addressText} numberOfLines={2}>
              Service address: {user.address}
            </Text>
          </View>

          {/* Submit CTA */}
          <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} activeOpacity={0.85}>
            <Ionicons name="send" size={18} color="#FFFFFF" />
            <Text style={styles.submitBtnText}>Submit & Chat with Admin</Text>
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
  otherProblemBox: {
    backgroundColor: '#FAF5FF',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E9D5FF',
    marginBottom: 16,
  },
  otherHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  otherHeaderTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#6B21A8',
  },
  otherHeaderDesc: {
    fontSize: 11,
    color: '#7E22CE',
    lineHeight: 16,
    marginBottom: 8,
  },
  otherTextArea: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D8B4FE',
    borderRadius: 8,
    padding: 10,
    fontSize: 13,
    color: '#0F172A',
    height: 70,
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
