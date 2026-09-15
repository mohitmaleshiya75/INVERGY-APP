import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import { PROBLEM_CATEGORIES } from '../../data/mockData';
import { ComplaintCategory } from '../../types';

export const CategorySelectScreen: React.FC = () => {
  const { setSelectedCategory, setCurrentScreen } = useApp();

  const handleSelectCategory = (cat: ComplaintCategory) => {
    setSelectedCategory(cat);
    setCurrentScreen('RAISE_COMPLAINT');
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Step Indicator Banner */}
        <View style={styles.bannerCard}>
          <View style={styles.stepPill}>
            <Text style={styles.stepPillText}>STEP 1 OF 2</Text>
          </View>
          <Text style={styles.bannerTitle}>Select Problem Category</Text>
          <Text style={styles.bannerDesc}>
            Choose the specific issue category so our technical triage team can assign the right specialist and replacement parts.
          </Text>
        </View>

        {/* Categories List */}
        <View style={styles.categoriesContainer}>
          {PROBLEM_CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={styles.categoryCard}
              onPress={() => handleSelectCategory(cat)}
              activeOpacity={0.8}
            >
              <View style={styles.cardHeader}>
                <View style={styles.iconWrapper}>
                  <Ionicons name={cat.icon as any} size={24} color="#0EA5E9" />
                </View>
                <View style={styles.cardTitleBox}>
                  <View style={styles.badgeRow}>
                    <Text style={styles.categoryBadge}>{cat.badge}</Text>
                  </View>
                  <Text style={styles.categoryTitle}>{cat.title}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
              </View>

              <Text style={styles.categoryDesc}>{cat.description}</Text>

              {/* Common Issues Chips */}
              <View style={styles.chipsRow}>
                {cat.commonIssues.map((issue, idx) => (
                  <View key={idx} style={styles.issueChip}>
                    <Text style={styles.issueChipText}>• {issue}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.cardFooter}>
                <Text style={styles.footerAction}>Select & Raise Complaint ➔</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
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
  bannerCard: {
    backgroundColor: '#0F172A',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
  },
  stepPill: {
    backgroundColor: '#0EA5E9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  stepPillText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.8,
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  bannerDesc: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 4,
    lineHeight: 18,
  },
  categoriesContainer: {
    gap: 12,
  },
  categoryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cardTitleBox: {
    flex: 1,
  },
  badgeRow: {
    marginBottom: 2,
  },
  categoryBadge: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0284C7',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  categoryTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  categoryDesc: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
    marginBottom: 12,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  issueChip: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  issueChipText: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '500',
  },
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 10,
    alignItems: 'flex-end',
  },
  footerAction: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0EA5E9',
  },
});
