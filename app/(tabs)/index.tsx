// ========================================
// GeoAdTech — Map Screen (Home)
// ========================================
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, { Circle, Marker } from 'react-native-maps';

import { CATEGORY_ICONS, MOCK_PROJECTS } from '@/constants/mockData';
import { BorderRadius, Colors, FontSizes, Shadows, Spacing } from '@/constants/theme';
import { getCurrentLocation } from '@/services/location';
import { Project } from '@/types';

const { width } = Dimensions.get('window');

// Default to New Delhi if location unavailable
const DEFAULT_REGION = {
  latitude: 28.6139,
  longitude: 77.209,
  latitudeDelta: 0.15,
  longitudeDelta: 0.15,
};

export default function MapScreen() {
  const [region, setRegion] = useState(DEFAULT_REGION);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const mapRef = useRef<MapView>(null);
  const slideAnim = useRef(new Animated.Value(200)).current;

  useEffect(() => {
    loadLocation();
  }, []);

  useEffect(() => {
    if (selectedProject) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 80,
        friction: 12,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 200,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [selectedProject]);

  const loadLocation = async () => {
    try {
      const loc = await getCurrentLocation();
      if (loc) {
        setRegion({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          latitudeDelta: 0.08,
          longitudeDelta: 0.08,
        });
      }
    } catch (e) {
      // Use default region
    } finally {
      setLoading(false);
    }
  };

  const handleMarkerPress = (project: Project) => {
    setSelectedProject(project);
    mapRef.current?.animateToRegion(
      {
        latitude: project.location.coordinates[1],
        longitude: project.location.coordinates[0],
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      },
      500
    );
  };

  const goToMyLocation = async () => {
    const loc = await getCurrentLocation();
    if (loc) {
      mapRef.current?.animateToRegion(
        {
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        },
        500
      );
    }
  };

  const getCategoryColor = (category: string) =>
    Colors.categories[category] || Colors.textMuted;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Finding your location...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Search Bar / Header */}
      <View style={styles.header}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color={Colors.textMuted} />
          <Text style={styles.searchPlaceholder}>Search projects near you...</Text>
        </View>
      </View>

      {/* Map */}
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={region}
        customMapStyle={darkMapStyle}
        showsUserLocation
        showsMyLocationButton={false}
        onPress={() => setSelectedProject(null)}
      >
        {MOCK_PROJECTS.map((project) => (
          <React.Fragment key={project._id}>
            <Circle
              center={{
                latitude: project.location.coordinates[1],
                longitude: project.location.coordinates[0],
              }}
              radius={project.geofence.radius}
              fillColor={`${getCategoryColor(project.category)}15`}
              strokeColor={`${getCategoryColor(project.category)}40`}
              strokeWidth={1}
            />
            <Marker
              coordinate={{
                latitude: project.location.coordinates[1],
                longitude: project.location.coordinates[0],
              }}
              onPress={() => handleMarkerPress(project)}
            >
              <View
                style={[
                  styles.markerContainer,
                  {
                    backgroundColor: getCategoryColor(project.category),
                    borderColor:
                      selectedProject?._id === project._id
                        ? Colors.white
                        : getCategoryColor(project.category),
                    transform: [
                      { scale: selectedProject?._id === project._id ? 1.2 : 1 },
                    ],
                  },
                ]}
              >
                <Ionicons
                  name={CATEGORY_ICONS[project.category] as any}
                  size={16}
                  color={Colors.white}
                />
              </View>
            </Marker>
          </React.Fragment>
        ))}
      </MapView>

      {/* My Location Button */}
      <TouchableOpacity style={styles.myLocationBtn} onPress={goToMyLocation}>
        <Ionicons name="locate" size={22} color={Colors.primary} />
      </TouchableOpacity>

      {/* Project Preview Card */}
      {selectedProject && (
        <Animated.View
          style={[
            styles.previewCard,
            { transform: [{ translateY: slideAnim }] },
          ]}
        >
          <TouchableOpacity
            style={styles.previewContent}
            onPress={() => router.push(`/project/${selectedProject._id}`)}
            activeOpacity={0.8}
          >
            <View style={styles.previewHeader}>
              <View
                style={[
                  styles.categoryBadge,
                  { backgroundColor: getCategoryColor(selectedProject.category) },
                ]}
              >
                <Ionicons
                  name={CATEGORY_ICONS[selectedProject.category] as any}
                  size={12}
                  color={Colors.white}
                />
                <Text style={styles.categoryText}>
                  {selectedProject.category.toUpperCase()}
                </Text>
              </View>
              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor:
                      selectedProject.status === 'completed'
                        ? `${Colors.success}20`
                        : selectedProject.status === 'in-progress'
                          ? `${Colors.primary}20`
                          : `${Colors.warning}20`,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    {
                      color:
                        selectedProject.status === 'completed'
                          ? Colors.success
                          : selectedProject.status === 'in-progress'
                            ? Colors.primary
                            : Colors.warning,
                    },
                  ]}
                >
                  {selectedProject.status.replace('-', ' ').toUpperCase()}
                </Text>
              </View>
            </View>

            <Text style={styles.previewTitle} numberOfLines={1}>
              {selectedProject.name}
            </Text>
            <Text style={styles.previewDesc} numberOfLines={2}>
              {selectedProject.shortDescription}
            </Text>

            <View style={styles.previewFooter}>
              <View style={styles.previewStat}>
                <Ionicons name="star" size={14} color={Colors.warning} />
                <Text style={styles.previewStatText}>
                  {selectedProject.rating.toFixed(1)}
                </Text>
              </View>
              <View style={styles.previewStat}>
                <Ionicons name="pie-chart" size={14} color={Colors.primary} />
                <Text style={styles.previewStatText}>
                  {selectedProject.impactMetrics.completionPercentage}%
                </Text>
              </View>
              <View style={styles.viewBtn}>
                <Text style={styles.viewBtnText}>View Details</Text>
                <Ionicons name="arrow-forward" size={14} color={Colors.primary} />
              </View>
            </View>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
}

// Dark map style for Google Maps
const darkMapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#1d2c4d' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#8ec3b9' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#1a3646' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#304a7d' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#255763' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0e1626' }] },
  { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#283d6a' }] },
  { featureType: 'transit', elementType: 'geometry', stylers: [{ color: '#2f3948' }] },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  loadingText: {
    color: Colors.textSecondary,
    marginTop: Spacing.md,
    fontSize: FontSizes.md,
  },
  header: {
    position: 'absolute',
    top: 50,
    left: Spacing.md,
    right: Spacing.md,
    zIndex: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 4,
    gap: Spacing.sm,
    ...Shadows.medium,
  },
  searchPlaceholder: {
    color: Colors.textMuted,
    fontSize: FontSizes.md,
  },
  map: {
    flex: 1,
  },
  markerContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    ...Shadows.small,
  },
  myLocationBtn: {
    position: 'absolute',
    right: Spacing.md,
    bottom: 220,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.full,
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.medium,
  },
  previewCard: {
    position: 'absolute',
    bottom: 80,
    left: Spacing.md,
    right: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    ...Shadows.medium,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  previewContent: {
    padding: Spacing.md,
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: BorderRadius.sm,
    gap: 4,
  },
  categoryText: {
    color: Colors.white,
    fontSize: FontSizes.xs,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: BorderRadius.sm,
  },
  statusText: {
    fontSize: FontSizes.xs,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  previewTitle: {
    color: Colors.text,
    fontSize: FontSizes.lg,
    fontWeight: '700',
    marginBottom: 4,
  },
  previewDesc: {
    color: Colors.textSecondary,
    fontSize: FontSizes.sm,
    lineHeight: 18,
    marginBottom: Spacing.sm,
  },
  previewFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  previewStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  previewStatText: {
    color: Colors.textSecondary,
    fontSize: FontSizes.sm,
    fontWeight: '600',
  },
  viewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginLeft: 'auto',
  },
  viewBtnText: {
    color: Colors.primary,
    fontSize: FontSizes.sm,
    fontWeight: '600',
  },
});
