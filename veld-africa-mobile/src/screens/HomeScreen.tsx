import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';

const { width } = Dimensions.get('window');

// Mock data - would come from API
const FEATURED_PROPERTIES = [
  {
    id: '1',
    title: 'Luxury Villa in Lekki',
    location: 'Lekki, Lagos',
    price: '₦75,000,000',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
    type: 'Residential',
    roi: '12%',
  },
  {
    id: '2',
    title: 'FarmVille Estate',
    location: 'Ogun State',
    price: '₦15,000,000',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800',
    type: 'Agro',
    roi: '18%',
  },
];

const QUICK_ACTIONS = [
  { icon: 'search', label: 'Browse', route: 'Properties' },
  { icon: 'trending-up', label: 'Portfolio', route: 'Portfolio' },
  { icon: 'calculator', label: 'Calculator', action: 'calculator' },
  { icon: 'headset', label: 'Support', action: 'chat' },
];

export default function HomeScreen() {
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#1B4D3E', '#2D6A4F']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.greeting}>Welcome to\u003c/Text>
          <Text style={styles.brandName}>VELD Africa\u003c/Text>
          <Text style={styles.tagline}>Gateway. Growth. Generational.\u003c/Text>
        </View>

        {/* Portfolio Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View>
              <Text style={styles.summaryLabel}>Total Invested\u003c/Text>
              <Text style={styles.summaryValue}>₦0.00\u003c/Text>
            </View>
            <View>
              <Text style={styles.summaryLabel}>Active Properties\u003c/Text>
              <Text style={styles.summaryValue}>0\u003c/Text>
            </View>
          </View>
          <View style={[styles.summaryRow, { marginTop: 16 }]>}
            <View>
              <Text style={styles.summaryLabel}>Total Returns\u003c/Text>
              <Text style={styles.summaryValue}>₦0.00\u003c/Text>
            </View>
            <View>
              <Text style={styles.summaryLabel}>ROI\u003c/Text>
              <Text style={[styles.summaryValue, { color: '#C9A227' }]>0%\u003c/Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions\u003c/Text>
        <View style={styles.quickActionsGrid}>
          {QUICK_ACTIONS.map((action) => (
            <TouchableOpacity
              key={action.label}
              style={styles.quickActionItem}
              onPress={() => {
                if (action.route) {
                  navigation.navigate(action.route as never);
                } else if (action.action === 'chat') {
                  navigation.navigate('Chat' as never);
                }
              }}
            >
              <View style={styles.quickActionIcon}>
                <Ionicons name={action.icon as any} size={24} color="#1B4D3E" />
              </View>
              <Text style={styles.quickActionLabel}>{action.label}\u003c/Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Featured Properties */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured Properties\u003c/Text>
          <TouchableOpacity onPress={() => navigation.navigate('Properties' as never)}>
            <Text style={styles.seeAll}>See All\u003c/Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.propertiesScroll}
        >
          {FEATURED_PROPERTIES.map((property) => (
            <TouchableOpacity
              key={property.id}
              style={styles.propertyCard}
              onPress={() =>
                navigation.navigate('PropertyDetail', { id: property.id } as never)
              }
            >
              <Image
                source={{ uri: property.image }}
                style={styles.propertyImage}
                resizeMode="cover"
              />
              <View style={styles.propertyOverlay}>
                <View style={styles.roiBadge}>
                  <Text style={styles.roiText}>ROI: {property.roi}\u003c/Text>
                </View>
              </View>
              <View style={styles.propertyInfo}>
                <Text style={styles.propertyTitle} numberOfLines={1}>
                  {property.title}
                </Text>
                <View style={styles.propertyMeta}>
                  <Ionicons name="location" size={14} color="#666" />
                  <Text style={styles.propertyLocation}>{property.location}\u003c/Text>
                </View>
                <Text style={styles.propertyPrice}>{property.price}\u003c/Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* AI Recommendations Banner */}
      <TouchableOpacity style={styles.aiBanner}>
        <LinearGradient
          colors={['#1B4D3E', '#0d2e25']}
          style={styles.aiBannerGradient}
        >
          <View style={styles.aiBannerContent}>
            <Ionicons name="sparkles" size={32} color="#C9A227" />
            <View style={styles.aiBannerText}>
              <Text style={styles.aiBannerTitle}>AI-Powered Recommendations\u003c/Text>
              <Text style={styles.aiBannerSubtitle}>
                Get personalized property suggestions
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#fff" />
        </LinearGradient>
      </TouchableOpacity>

      {/* Newsletter Section */}
      <View style={[styles.section, styles.newsletterSection]}>
        <Text style={styles.sectionTitle}>The Gateway\u003c/Text>
        <Text style={styles.newsletterDesc}>
          Subscribe to our newsletter for exclusive investment opportunities
        </Text>
        <TouchableOpacity style={styles.subscribeButton}>
          <Text style={styles.subscribeButtonText}>Subscribe Now\u003c/Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9F6',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  headerContent: {
    marginBottom: 24,
  },
  greeting: {
    color: '#fff',
    fontSize: 16,
    opacity: 0.9,
  },
  brandName: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 4,
  },
  tagline: {
    color: '#C9A227',
    fontSize: 14,
    marginTop: 4,
  },
  summaryCard: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 20,
    backdropFilter: 'blur(10px)',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    marginBottom: 4,
  },
  summaryValue: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  section: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  seeAll: {
    color: '#1B4D3E',
    fontSize: 14,
    fontWeight: '600',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickActionItem: {
    width: (width - 64) / 4,
    alignItems: 'center',
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quickActionLabel: {
    fontSize: 12,
    color: '#1a1a1a',
  },
  propertiesScroll: {
    paddingRight: 20,
  },
  propertyCard: {
    width: 280,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginRight: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  propertyImage: {
    width: '100%',
    height: 160,
  },
  propertyOverlay: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  roiBadge: {
    backgroundColor: '#C9A227',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  roiText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  propertyInfo: {
    padding: 16,
  },
  propertyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  propertyMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  propertyLocation: {
    fontSize: 13,
    color: '#666',
    marginLeft: 4,
  },
  propertyPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1B4D3E',
  },
  aiBanner: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  aiBannerGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  aiBannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  aiBannerText: {
    marginLeft: 16,
  },
  aiBannerTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  aiBannerSubtitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    marginTop: 2,
  },
  newsletterSection: {
    backgroundColor: '#1B4D3E',
    margin: 20,
    borderRadius: 16,
    marginTop: 0,
  },
  newsletterDesc: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    marginTop: 8,
    marginBottom: 16,
  },
  subscribeButton: {
    backgroundColor: '#C9A227',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  subscribeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
