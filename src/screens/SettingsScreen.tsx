/**
 * Settings Screen
 * App settings modal with working touch interactions
 */

import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme, useAppTheme } from '../theme/ThemeContext';
import { RootStackScreenProps } from '../navigation/types';
import { Text, Title2 } from '../components/ui';
import { useStore } from '../store/useStore';
import { clearAllStorage } from '../services/storage';

type Props = RootStackScreenProps<'Settings'>;

export const SettingsScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useAppTheme();
  const { themePreference, setThemeMode } = useTheme();
  const { isPro } = useStore();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  
  const handleThemeChange = (mode: 'light' | 'dark' | 'system') => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setThemeMode(mode);
  };
  
  const handleNotificationToggle = (value: boolean) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setNotificationsEnabled(value);
  };
  
  const handleClearData = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      'Clear All Data',
      'This will delete all your conversations, saved wisdom, and preferences. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            await clearAllStorage();
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            Alert.alert('Done', 'All data has been cleared.');
          },
        },
      ]
    );
  };
  
  const handleUpgrade = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate('Paywall');
  };
  
  const showComingSoon = (feature: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert(feature, 'This will be available when the app is published.');
  };
  
  const cardStyle = {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    ...theme.shadows.sm,
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerSpacer} />
        <View style={[styles.handle, { backgroundColor: theme.colors.border }]} />
        <TouchableOpacity
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            navigation.goBack();
          }}
          style={styles.closeButton}
        >
          <Ionicons name="close" size={28} color={theme.colors.textPrimary} />
        </TouchableOpacity>
      </View>
      
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Title2 style={styles.title}>Settings</Title2>
        
        {/* Pro Status */}
        {!isPro && (
          <TouchableOpacity
            style={[styles.proCard, { backgroundColor: theme.coachColors.creative.background }]}
            onPress={handleUpgrade}
            activeOpacity={0.8}
          >
            <View style={styles.proContent}>
              <Text style={styles.proEmoji}>✨</Text>
              <View>
                <Text variant="headline">Upgrade to Pro</Text>
                <Text variant="footnote" color={theme.colors.textSecondary}>
                  Unlimited messages & custom coaches
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.coachColors.creative.primary} />
          </TouchableOpacity>
        )}
        
        {/* Appearance */}
        <View style={styles.section}>
          <Text variant="caption1" color={theme.colors.textSecondary} style={styles.sectionTitle}>
            APPEARANCE
          </Text>
          <View style={cardStyle}>
            <TouchableOpacity
              style={styles.settingItem}
              onPress={() => handleThemeChange('light')}
              activeOpacity={0.6}
            >
              <View style={styles.settingContent}>
                <View style={[styles.iconContainer, { backgroundColor: theme.coachColors.productivity.background }]}>
                  <Ionicons name="sunny" size={18} color={theme.coachColors.productivity.primary} />
                </View>
                <Text variant="body" style={styles.settingLabel}>Light</Text>
              </View>
              {themePreference === 'light' && (
                <Ionicons name="checkmark-circle" size={24} color={theme.coachColors.wellness.primary} />
              )}
            </TouchableOpacity>
            
            <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
            
            <TouchableOpacity
              style={styles.settingItem}
              onPress={() => handleThemeChange('dark')}
              activeOpacity={0.6}
            >
              <View style={styles.settingContent}>
                <View style={[styles.iconContainer, { backgroundColor: theme.coachColors.stoic.background }]}>
                  <Ionicons name="moon" size={18} color={theme.coachColors.stoic.primary} />
                </View>
                <Text variant="body" style={styles.settingLabel}>Dark</Text>
              </View>
              {themePreference === 'dark' && (
                <Ionicons name="checkmark-circle" size={24} color={theme.coachColors.wellness.primary} />
              )}
            </TouchableOpacity>
            
            <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
            
            <TouchableOpacity
              style={styles.settingItem}
              onPress={() => handleThemeChange('system')}
              activeOpacity={0.6}
            >
              <View style={styles.settingContent}>
                <View style={[styles.iconContainer, { backgroundColor: theme.coachColors.career.background }]}>
                  <Ionicons name="phone-portrait" size={18} color={theme.coachColors.career.primary} />
                </View>
                <Text variant="body" style={styles.settingLabel}>System</Text>
              </View>
              {themePreference === 'system' && (
                <Ionicons name="checkmark-circle" size={24} color={theme.coachColors.wellness.primary} />
              )}
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Notifications */}
        <View style={styles.section}>
          <Text variant="caption1" color={theme.colors.textSecondary} style={styles.sectionTitle}>
            NOTIFICATIONS
          </Text>
          <View style={cardStyle}>
            <View style={styles.settingItem}>
              <View style={styles.settingContent}>
                <View style={[styles.iconContainer, { backgroundColor: theme.coachColors.wellness.background }]}>
                  <Ionicons name="notifications" size={18} color={theme.coachColors.wellness.primary} />
                </View>
                <View style={styles.settingTextContainer}>
                  <Text variant="body">Daily Reminders</Text>
                  <Text variant="caption1" color={theme.colors.textTertiary}>
                    Get prompted to reflect
                  </Text>
                </View>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={handleNotificationToggle}
                trackColor={{
                  false: theme.colors.border,
                  true: theme.coachColors.wellness.primary,
                }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>
        </View>
        
        {/* Data */}
        <View style={styles.section}>
          <Text variant="caption1" color={theme.colors.textSecondary} style={styles.sectionTitle}>
            DATA
          </Text>
          <View style={cardStyle}>
            <TouchableOpacity 
              style={styles.settingItem}
              onPress={handleClearData}
              activeOpacity={0.6}
            >
              <View style={styles.settingContent}>
                <View style={[styles.iconContainer, { backgroundColor: '#FEE2E2' }]}>
                  <Ionicons name="trash" size={18} color="#EF4444" />
                </View>
                <Text variant="body" color="#EF4444">Clear All Data</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* About */}
        <View style={styles.section}>
          <Text variant="caption1" color={theme.colors.textSecondary} style={styles.sectionTitle}>
            ABOUT
          </Text>
          <View style={cardStyle}>
            <TouchableOpacity 
              style={styles.settingItem}
              onPress={() => showComingSoon('Privacy Policy')}
              activeOpacity={0.6}
            >
              <View style={styles.settingContent}>
                <View style={[styles.iconContainer, { backgroundColor: theme.colors.surfaceSecondary }]}>
                  <Ionicons name="shield-checkmark" size={18} color={theme.colors.textSecondary} />
                </View>
                <Text variant="body">Privacy Policy</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={theme.colors.textTertiary} />
            </TouchableOpacity>
            
            <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
            
            <TouchableOpacity 
              style={styles.settingItem}
              onPress={() => showComingSoon('Terms of Service')}
              activeOpacity={0.6}
            >
              <View style={styles.settingContent}>
                <View style={[styles.iconContainer, { backgroundColor: theme.colors.surfaceSecondary }]}>
                  <Ionicons name="document-text" size={18} color={theme.colors.textSecondary} />
                </View>
                <Text variant="body">Terms of Service</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={theme.colors.textTertiary} />
            </TouchableOpacity>
            
            <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
            
            <View style={styles.settingItem}>
              <View style={styles.settingContent}>
                <View style={[styles.iconContainer, { backgroundColor: theme.colors.surfaceSecondary }]}>
                  <Ionicons name="information-circle" size={18} color={theme.colors.textSecondary} />
                </View>
                <Text variant="body">Version</Text>
              </View>
              <Text variant="body" color={theme.colors.textTertiary}>1.0.0</Text>
            </View>
          </View>
        </View>
        
        {/* Footer */}
        <Text 
          variant="caption1" 
          color={theme.colors.textTertiary} 
          align="center"
          style={styles.footer}
        >
          Made with ❤️ for your growth
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerSpacer: {
    width: 40,
  },
  handle: {
    width: 36,
    height: 5,
    borderRadius: 3,
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  title: {
    marginBottom: 24,
  },
  proCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 32,
  },
  proContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  proEmoji: {
    fontSize: 32,
    marginRight: 12,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 8,
    marginLeft: 4,
    letterSpacing: 0.5,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    minHeight: 56,
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingTextContainer: {
    marginLeft: 12,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingLabel: {
    marginLeft: 0,
  },
  divider: {
    height: 0.5,
    marginLeft: 58,
  },
  footer: {
    marginTop: 16,
  },
});
