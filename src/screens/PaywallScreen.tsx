/**
 * Paywall Screen
 * RevenueCat subscription paywall
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppTheme } from '../theme/ThemeContext';
import { RootStackScreenProps } from '../navigation/types';
import { Text, Title1, Button, Card } from '../components/ui';
import { 
  getOfferings, 
  purchasePackage, 
  restorePurchases,
  checkProStatus,
} from '../services/revenue-cat';
import { useStore } from '../store/useStore';
import { PurchasesPackage } from 'react-native-purchases';

type Props = RootStackScreenProps<'Paywall'>;

type PlanType = 'monthly' | 'annual';

const features = [
  { icon: 'infinite-outline', title: 'Unlimited Messages', description: 'No daily limits on conversations' },
  { icon: 'create-outline', title: 'Custom Coaches', description: 'Create coaches with your own prompts' },
  { icon: 'share-outline', title: 'Share & Import', description: 'Share coaches with the community' },
  { icon: 'sparkles-outline', title: 'Deep Context', description: 'Add unlimited values, goals & life areas' },
  { icon: 'flash-outline', title: 'Priority Responses', description: 'Faster AI processing times' },
  { icon: 'download-outline', title: 'Export Wisdom', description: 'Download your insights as PDF' },
];

export const PaywallScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useAppTheme();
  const [selectedPlan, setSelectedPlan] = useState<PlanType>('annual');
  const [packages, setPackages] = useState<PurchasesPackage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const { setIsPro } = useStore();
  
  // Load offerings on mount
  useEffect(() => {
    const loadOfferings = async () => {
      const availablePackages = await getOfferings();
      if (availablePackages.length > 0) {
        setPackages(availablePackages);
      }
    };
    loadOfferings();
  }, []);
  
  const handleSubscribe = async () => {
    setIsLoading(true);
    
    // Find the selected package
    const selectedPackage = packages.find((pkg) => {
      if (selectedPlan === 'annual') {
        return pkg.identifier.includes('annual') || pkg.packageType === 'ANNUAL';
      }
      return pkg.identifier.includes('monthly') || pkg.packageType === 'MONTHLY';
    });
    
    if (selectedPackage) {
      const result = await purchasePackage(selectedPackage);
      
      if (result.success) {
        setIsPro(true);
        Alert.alert('Success!', 'Welcome to Muse Pro!', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      } else if (result.error && result.error !== 'cancelled') {
        Alert.alert('Purchase Failed', result.error);
      }
    } else {
      // Demo mode - no packages available (RevenueCat not configured)
      Alert.alert(
        'Demo Mode',
        'RevenueCat is not configured. In production, this would process the purchase.',
        [{ text: 'OK' }]
      );
    }
    
    setIsLoading(false);
  };
  
  const handleRestore = async () => {
    setIsRestoring(true);
    
    const result = await restorePurchases();
    
    if (result.success) {
      if (result.isPro) {
        setIsPro(true);
        Alert.alert('Restored!', 'Your Pro subscription has been restored.', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      } else {
        Alert.alert('No Purchases Found', 'No active subscriptions were found.');
      }
    } else {
      Alert.alert('Restore Failed', result.error || 'Please try again.');
    }
    
    setIsRestoring(false);
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerSpacer} />
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
        {/* Hero */}
        <View style={styles.hero}>
          <Text style={styles.heroEmoji}>✨</Text>
          <Title1 align="center">Muse Pro</Title1>
          <Text
            variant="body"
            color={theme.colors.textSecondary}
            align="center"
            style={styles.heroSubtitle}
          >
            Unlock the full power of AI coaching
          </Text>
        </View>
        
        {/* Features */}
        <View style={styles.features}>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <View style={[styles.featureIcon, { backgroundColor: theme.coachColors.creative.background }]}>
                <Ionicons
                  name={feature.icon as any}
                  size={22}
                  color={theme.coachColors.creative.primary}
                />
              </View>
              <View style={styles.featureContent}>
                <Text variant="headline">{feature.title}</Text>
                <Text variant="footnote" color={theme.colors.textSecondary}>
                  {feature.description}
                </Text>
              </View>
            </View>
          ))}
        </View>
        
        {/* Plan Selection */}
        <View style={styles.plans}>
          {/* Annual Plan */}
          <TouchableOpacity
            onPress={() => setSelectedPlan('annual')}
            activeOpacity={0.8}
          >
            <Card
              variant={selectedPlan === 'annual' ? 'outlined' : 'flat'}
              padding="medium"
              style={[
                styles.planCard,
                selectedPlan === 'annual' && {
                  borderColor: theme.coachColors.creative.primary,
                  borderWidth: 2,
                },
              ]}
            >
              <View style={styles.planHeader}>
                <View>
                  <Text variant="headline">Annual</Text>
                  <Text variant="caption1" color={theme.colors.textSecondary}>
                    Best value
                  </Text>
                </View>
                <View style={styles.planPrice}>
                  <Text variant="title2">$49.99</Text>
                  <Text variant="footnote" color={theme.colors.textSecondary}>
                    /year
                  </Text>
                </View>
              </View>
              <View style={[styles.savingsBadge, { backgroundColor: theme.coachColors.wellness.background }]}>
                <Text variant="caption1" color={theme.coachColors.wellness.primary}>
                  Save 40% vs monthly
                </Text>
              </View>
              {selectedPlan === 'annual' && (
                <View style={[styles.checkmark, { backgroundColor: theme.coachColors.creative.primary }]}>
                  <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                </View>
              )}
            </Card>
          </TouchableOpacity>
          
          {/* Monthly Plan */}
          <TouchableOpacity
            onPress={() => setSelectedPlan('monthly')}
            activeOpacity={0.8}
          >
            <Card
              variant={selectedPlan === 'monthly' ? 'outlined' : 'flat'}
              padding="medium"
              style={[
                styles.planCard,
                selectedPlan === 'monthly' && {
                  borderColor: theme.coachColors.creative.primary,
                  borderWidth: 2,
                },
              ]}
            >
              <View style={styles.planHeader}>
                <Text variant="headline">Monthly</Text>
                <View style={styles.planPrice}>
                  <Text variant="title2">$6.99</Text>
                  <Text variant="footnote" color={theme.colors.textSecondary}>
                    /month
                  </Text>
                </View>
              </View>
              {selectedPlan === 'monthly' && (
                <View style={[styles.checkmark, { backgroundColor: theme.coachColors.creative.primary }]}>
                  <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                </View>
              )}
            </Card>
          </TouchableOpacity>
        </View>
        
        {/* Subscribe Button */}
        <Button
          title={selectedPlan === 'annual' ? 'Subscribe for $49.99/year' : 'Subscribe for $6.99/month'}
          onPress={handleSubscribe}
          variant="accent"
          accentColor={theme.coachColors.creative.primary}
          fullWidth
          size="large"
          style={styles.subscribeButton}
          loading={isLoading}
          disabled={isLoading || isRestoring}
        />
        
        {/* Restore */}
        <TouchableOpacity 
          onPress={handleRestore} 
          style={styles.restoreButton}
          disabled={isLoading || isRestoring}
        >
          {isRestoring ? (
            <ActivityIndicator size="small" color={theme.colors.textSecondary} />
          ) : (
            <Text variant="subheadline" color={theme.colors.textSecondary}>
              Restore Purchases
            </Text>
          )}
        </TouchableOpacity>
        
        {/* Fine Print */}
        <Text
          variant="caption1"
          color={theme.colors.textTertiary}
          align="center"
          style={styles.finePrint}
        >
          Cancel anytime. Subscription automatically renews unless canceled at least 24 hours before the end of the current period.
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
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerSpacer: {
    flex: 1,
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
  hero: {
    alignItems: 'center',
    marginBottom: 32,
  },
  heroEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  heroSubtitle: {
    marginTop: 8,
  },
  features: {
    marginBottom: 32,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureContent: {
    flex: 1,
    marginLeft: 16,
  },
  plans: {
    marginBottom: 24,
  },
  planCard: {
    marginBottom: 12,
    position: 'relative',
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  planPrice: {
    alignItems: 'flex-end',
  },
  savingsBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginTop: 12,
  },
  checkmark: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subscribeButton: {
    marginBottom: 16,
  },
  restoreButton: {
    alignItems: 'center',
    padding: 12,
  },
  finePrint: {
    marginTop: 16,
    paddingHorizontal: 20,
  },
});

