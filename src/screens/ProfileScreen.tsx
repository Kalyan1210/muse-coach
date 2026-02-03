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
import * as Haptics from 'expo-haptics';
import { useAppTheme } from '../theme/ThemeContext';
import { MainTabScreenProps } from '../navigation/types';
import { Text, Title1, Card, Button } from '../components/ui';
import { useStore } from '../store/useStore';

type Props = MainTabScreenProps<'Profile'>;

export const ProfileScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useAppTheme();
  const { user, isPro, conversations, savedWisdom, customCoaches } = useStore();
  
  const userName = user?.name || 'Friend';
  const userValues = user?.values || [];
  const conversationCount = conversations.length;
  const wisdomCount = savedWisdom.length;
  
  const handleEditContext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate('PersonalContext');
  };
  
  const handleOpenSettings = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate('Settings');
  };
  
  const handleCreateCoach = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate('CreateCoach', {});
  };
  
  const menuItems = [
    { 
      icon: 'person-outline', 
      label: 'Edit Context', 
      sublabel: 'Values, goals & challenges',
      onPress: handleEditContext,
    },
    { 
      icon: 'settings-outline', 
      label: 'Settings', 
      sublabel: 'Theme, notifications, data',
      onPress: handleOpenSettings,
    },
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
              <Text style={[styles.avatarText, { color: theme.coachColors.productivity.primary }]}>
                {userName.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={styles.userInfo}>
              <Text variant="title2">{userName}</Text>
              <Text variant="subheadline" color={theme.colors.textSecondary}>
                {isPro ? '✨ Muse Pro' : 'Free Plan'}
              </Text>
            </View>
          </View>
          
          {/* Stats */}
          <View style={styles.stats}>
            <View style={styles.statItem}>
              <Text variant="numeric" style={styles.statNumber}>
                {conversationCount}
              </Text>
              <Text variant="caption1" color={theme.colors.textSecondary}>
                Conversations
              </Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: theme.colors.border }]} />
            <View style={styles.statItem}>
              <Text variant="numeric" style={styles.statNumber}>
                {wisdomCount}
              </Text>
              <Text variant="caption1" color={theme.colors.textSecondary}>
                Saved Wisdom
              </Text>
            </View>
            {isPro && (
              <>
                <View style={[styles.statDivider, { backgroundColor: theme.colors.border }]} />
                <View style={styles.statItem}>
                  <Text variant="numeric" style={styles.statNumber}>
                    {customCoaches.length}
                  </Text>
                  <Text variant="caption1" color={theme.colors.textSecondary}>
                    Custom Coaches
                  </Text>
                </View>
              </>
            )}
          </View>
        </Card>
        
        {/* Your Values */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text variant="headline">Your Values</Text>
            <TouchableOpacity onPress={handleEditContext}>
              <Text variant="callout" color={theme.coachColors.productivity.primary}>Edit</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.values}>
            {userValues.length > 0 ? (
              userValues.map((value, index) => (
                <View
                  key={index}
                  style={[styles.valueTag, { backgroundColor: theme.colors.surfaceSecondary }]}
                >
                  <Text variant="callout" color={theme.colors.textPrimary}>
                    {value}
                  </Text>
                </View>
              ))
            ) : (
              <TouchableOpacity
                style={[styles.emptyValues, { backgroundColor: theme.colors.surfaceSecondary }]}
                onPress={handleEditContext}
              >
                <Text variant="callout" color={theme.colors.textSecondary}>
                  Add your values to personalize coaching
                </Text>
                <Ionicons name="arrow-forward" size={16} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            )}
          </View>
        </View>
        
        {/* Create Coach (Pro) */}
        {isPro && (
          <TouchableOpacity
            style={[styles.createCoachCard, { backgroundColor: theme.coachColors.creative.background }]}
            onPress={handleCreateCoach}
            activeOpacity={0.8}
          >
            <View style={[styles.createIcon, { backgroundColor: theme.coachColors.creative.primary }]}>
              <Ionicons name="add" size={22} color="#FFFFFF" />
            </View>
            <View style={styles.createText}>
              <Text variant="headline">Create Custom Coach</Text>
              <Text variant="footnote" color={theme.colors.textSecondary}>
                Design an AI coach tailored to you
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.coachColors.creative.primary} />
          </TouchableOpacity>
        )}
        
        {/* Upgrade Card */}
        {!isPro && (
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
                onPress={item.onPress}
                activeOpacity={0.7}
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  emptyValues: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    width: '100%',
  },
  createCoachCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
  },
  createIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  createText: {
    flex: 1,
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
