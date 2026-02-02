/**
 * Settings Screen
 * App settings modal
 */

import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, useAppTheme } from '../theme/ThemeContext';
import { RootStackScreenProps } from '../navigation/types';
import { Text, Title2, Card } from '../components/ui';

type Props = RootStackScreenProps<'Settings'>;

export const SettingsScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useAppTheme();
  const { themeMode, setThemeMode, isDark } = useTheme();
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerSpacer} />
        <View style={styles.handle} />
        <TouchableOpacity
          onPress={() => navigation.goBack()}
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
        
        {/* Appearance */}
        <View style={styles.section}>
          <Text variant="headline" color={theme.colors.textSecondary} style={styles.sectionTitle}>
            APPEARANCE
          </Text>
          <Card variant="elevated" padding="none">
            <TouchableOpacity
              style={styles.settingItem}
              onPress={() => setThemeMode('light')}
            >
              <View style={styles.settingContent}>
                <Ionicons name="sunny-outline" size={22} color={theme.colors.textPrimary} />
                <Text variant="body" style={styles.settingLabel}>Light</Text>
              </View>
              {themeMode === 'light' && (
                <Ionicons name="checkmark" size={22} color={theme.coachColors.productivity.primary} />
              )}
            </TouchableOpacity>
            
            <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
            
            <TouchableOpacity
              style={styles.settingItem}
              onPress={() => setThemeMode('dark')}
            >
              <View style={styles.settingContent}>
                <Ionicons name="moon-outline" size={22} color={theme.colors.textPrimary} />
                <Text variant="body" style={styles.settingLabel}>Dark</Text>
              </View>
              {themeMode === 'dark' && (
                <Ionicons name="checkmark" size={22} color={theme.coachColors.productivity.primary} />
              )}
            </TouchableOpacity>
            
            <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
            
            <TouchableOpacity
              style={styles.settingItem}
              onPress={() => setThemeMode('system')}
            >
              <View style={styles.settingContent}>
                <Ionicons name="phone-portrait-outline" size={22} color={theme.colors.textPrimary} />
                <Text variant="body" style={styles.settingLabel}>System</Text>
              </View>
              {themeMode !== 'light' && themeMode !== 'dark' && (
                <Ionicons name="checkmark" size={22} color={theme.coachColors.productivity.primary} />
              )}
            </TouchableOpacity>
          </Card>
        </View>
        
        {/* Notifications */}
        <View style={styles.section}>
          <Text variant="headline" color={theme.colors.textSecondary} style={styles.sectionTitle}>
            NOTIFICATIONS
          </Text>
          <Card variant="elevated" padding="none">
            <View style={styles.settingItem}>
              <View style={styles.settingContent}>
                <Ionicons name="notifications-outline" size={22} color={theme.colors.textPrimary} />
                <Text variant="body" style={styles.settingLabel}>Daily Reminders</Text>
              </View>
              <Switch
                value={true}
                trackColor={{
                  false: theme.colors.border,
                  true: theme.coachColors.wellness.primary,
                }}
              />
            </View>
          </Card>
        </View>
        
        {/* About */}
        <View style={styles.section}>
          <Text variant="headline" color={theme.colors.textSecondary} style={styles.sectionTitle}>
            ABOUT
          </Text>
          <Card variant="elevated" padding="none">
            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingContent}>
                <Ionicons name="document-text-outline" size={22} color={theme.colors.textPrimary} />
                <Text variant="body" style={styles.settingLabel}>Privacy Policy</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={theme.colors.textTertiary} />
            </TouchableOpacity>
            
            <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
            
            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingContent}>
                <Ionicons name="document-outline" size={22} color={theme.colors.textPrimary} />
                <Text variant="body" style={styles.settingLabel}>Terms of Service</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={theme.colors.textTertiary} />
            </TouchableOpacity>
            
            <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
            
            <View style={styles.settingItem}>
              <View style={styles.settingContent}>
                <Ionicons name="information-circle-outline" size={22} color={theme.colors.textPrimary} />
                <Text variant="body" style={styles.settingLabel}>Version</Text>
              </View>
              <Text variant="body" color={theme.colors.textTertiary}>1.0.0</Text>
            </View>
          </Card>
        </View>
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
    backgroundColor: '#DEDEDE',
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  title: {
    marginBottom: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    marginBottom: 8,
    marginLeft: 4,
    fontSize: 13,
    letterSpacing: 0.5,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingLabel: {
    marginLeft: 12,
  },
  divider: {
    height: 0.5,
    marginLeft: 50,
  },
});

