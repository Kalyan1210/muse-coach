/**
 * Profile Screen
 * User profile, context, and app settings
 */

import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../theme/ThemeContext';
import { MainTabScreenProps } from '../navigation/types';
import { Text, Title1, Card, Button } from '../components/ui';

type Props = MainTabScreenProps<'Profile'>;

// Mock user data
const mockUser = {
  name: 'Sam',
  values: ['Growth', 'Authenticity', 'Balance'],
  isPro: false,
  conversationCount: 23,
  wisdomCount: 7,
};

export const ProfileScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useAppTheme();
  
  const menuItems = [
    { icon: 'person-outline', label: 'Edit Context', sublabel: 'Values, goals & challenges' },
    { icon: 'notifications-outline', label: 'Reminders', sublabel: 'Daily reflection prompts' },
    { icon: 'moon-outline', label: 'Appearance', sublabel: 'Light, dark, or system' },
    { icon: 'shield-outline', label: 'Privacy', sublabel: 'Data & account settings' },
    { icon: 'help-circle-outline', label: 'Help & Support', sublabel: 'FAQs & contact' },
  ];
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Title1>You</Title1>
        </View>
        
        {/* User Card */}
        <Card variant="elevated" padding="large" style={styles.userCard}>
          <View style={styles.userHeader}>
            <View style={[styles.avatar, { backgroundColor: theme.coachColors.productivity.background }]}>
              <Text style={styles.avatarText}>
                {mockUser.name.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={styles.userInfo}>
              <Text variant="title2">{mockUser.name}</Text>
              <Text variant="subheadline" color={theme.colors.textSecondary}>
                {mockUser.isPro ? '✨ Muse Pro' : 'Free Plan'}
              </Text>
            </View>
          </View>
          
          {/* Stats */}
          <View style={styles.stats}>
            <View style={styles.statItem}>
              <Text variant="numeric" style={styles.statNumber}>
                {mockUser.conversationCount}
              </Text>
              <Text variant="caption1" color={theme.colors.textSecondary}>
                Conversations
              </Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: theme.colors.border }]} />
            <View style={styles.statItem}>
              <Text variant="numeric" style={styles.statNumber}>
                {mockUser.wisdomCount}
              </Text>
              <Text variant="caption1" color={theme.colors.textSecondary}>
                Saved Wisdom
              </Text>
            </View>
          </View>
        </Card>
        
        {/* Your Values */}
        <View style={styles.section}>
          <Text variant="headline" style={styles.sectionTitle}>
            Your Values
          </Text>
          <View style={styles.values}>
            {mockUser.values.map((value, index) => (
              <View
                key={index}
                style={[styles.valueTag, { backgroundColor: theme.colors.surfaceSecondary }]}
              >
                <Text variant="callout" color={theme.colors.textPrimary}>
                  {value}
                </Text>
              </View>
            ))}
            <TouchableOpacity
              style={[styles.valueTag, styles.addTag, { borderColor: theme.colors.border }]}
            >
              <Ionicons name="add" size={18} color={theme.colors.textSecondary} />
              <Text variant="callout" color={theme.colors.textSecondary}>
                Add
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Upgrade Card */}
        {!mockUser.isPro && (
          <Card
            variant="flat"
            padding="large"
            style={[styles.upgradeCard, { backgroundColor: theme.coachColors.creative.background }]}
            onPress={() => navigation.navigate('Paywall')}
          >
            <Text variant="title3">✨ Upgrade to Pro</Text>
            <Text variant="callout" color={theme.colors.textSecondary} style={styles.upgradeText}>
              Unlimited messages, custom coaches, and deeper personalization.
            </Text>
            <Button
              title="See Plans"
              onPress={() => navigation.navigate('Paywall')}
              variant="accent"
              accentColor={theme.coachColors.creative.primary}
              size="medium"
            />
          </Card>
        )}
        
        {/* Menu Items */}
        <View style={styles.section}>
          <Text variant="headline" style={styles.sectionTitle}>
            Settings
          </Text>
          <Card variant="elevated" padding="none">
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={item.label}
                style={[
                  styles.menuItem,
                  index < menuItems.length - 1 && {
                    borderBottomWidth: 0.5,
                    borderBottomColor: theme.colors.border,
                  },
                ]}
              >
                <View style={[styles.menuIcon, { backgroundColor: theme.colors.surfaceSecondary }]}>
                  <Ionicons
                    name={item.icon as any}
                    size={20}
                    color={theme.colors.textPrimary}
                  />
                </View>
                <View style={styles.menuContent}>
                  <Text variant="body">{item.label}</Text>
                  <Text variant="caption1" color={theme.colors.textTertiary}>
                    {item.sublabel}
                  </Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={theme.colors.textTertiary}
                />
              </TouchableOpacity>
            ))}
          </Card>
        </View>
        
        {/* App Info */}
        <Text
          variant="footnote"
          color={theme.colors.textTertiary}
          align="center"
          style={styles.appInfo}
        >
          Muse v1.0.0 • Made with 💜 for better coaching
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 24,
  },
  userCard: {
    marginBottom: 24,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '600',
  },
  userInfo: {
    marginLeft: 16,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
  },
  statDivider: {
    width: 1,
    height: 40,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  values: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  valueTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    marginRight: 8,
    marginBottom: 8,
  },
  addTag: {
    borderWidth: 1,
    borderStyle: 'dashed',
    backgroundColor: 'transparent',
  },
  upgradeCard: {
    marginBottom: 24,
  },
  upgradeText: {
    marginTop: 4,
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuContent: {
    flex: 1,
    marginLeft: 12,
  },
  appInfo: {
    marginTop: 24,
  },
});

