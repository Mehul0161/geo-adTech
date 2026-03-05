// ========================================
// GeoAdTech — Live Project Map (Premium)
// ========================================
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import MapView, { Circle, Marker } from 'react-native-maps';

import { MOCK_PROJECTS } from '@/constants/mockData';
import { Colors, Shadows } from '@/constants/theme';
import { getNearbyProjects } from '@/services/api';
import { Project, UserLocation } from '@/types';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.85;
const CARD_GAP = 16;

const PROJECT_IMAGES: Record<string, string> = {
    metro: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?q=80&w=400',
    hospital: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=400',
    bridge: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=400',
    road: 'https://images.unsplash.com/photo-1541888946425-d81bb19480c5?q=80&w=400',
    college: 'https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=400',
    government: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?q=80&w=400',
    other: 'https://images.unsplash.com/photo-1590066839089-6d63430030da?q=80&w=400',
};

// Premium Map Style (Silver/Retro)
const MAP_STYLE = [
    { "elementType": "geometry", "stylers": [{ "color": "#f5f5f5" }] },
    { "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] },
    { "elementType": "labels.text.fill", "stylers": [{ "color": "#616161" }] },
    { "elementType": "labels.text.stroke", "stylers": [{ "color": "#f5f5f5" }] },
    { "featureType": "administrative.land_parcel", "elementType": "labels.text.fill", "stylers": [{ "color": "#bdbdbd" }] },
    { "featureType": "poi", "elementType": "geometry", "stylers": [{ "color": "#eeeeee" }] },
    { "featureType": "poi", "elementType": "labels.text.fill", "stylers": [{ "color": "#757575" }] },
    { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#ffffff" }] },
    { "featureType": "road.arterial", "elementType": "labels.text.fill", "stylers": [{ "color": "#757575" }] },
    { "featureType": "road.highway", "elementType": "geometry", "stylers": [{ "color": "#dadada" }] },
    { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#c9c9c9" }] },
    { "featureType": "water", "elementType": "labels.text.fill", "stylers": [{ "color": "#9e9e9e" }] }
];

const CATEGORY_DATA = [
    { label: 'All', icon: 'grid', color: Colors.primary },
    { label: 'metro', icon: 'train', color: '#0EA5E9' },
    { label: 'road', icon: 'car', color: '#10B981' },
    { label: 'hospital', icon: 'medkit', color: '#F43F5E' },
    { label: 'bridge', icon: 'construct', color: '#F59E0B' },
];

const getMarkerColor = (category: string) => {
    const colors: Record<string, string> = {
        metro: '#0EA5E9', road: '#10B981', hospital: '#F43F5E',
        bridge: '#F59E0B', college: '#8B5CF6', government: '#6366F1', other: Colors.primary,
    };
    return colors[category] || Colors.primary;
};

const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371000;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const MapScreen: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [location, setLocation] = useState<UserLocation | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [geoAlert, setGeoAlert] = useState<Project | null>(null);
    const [geoDistance, setGeoDistance] = useState(0);
    const [selectedMarker, setSelectedMarker] = useState<string | null>(null);
    const mapRef = useRef<MapView>(null);
    const flatListRef = useRef<FlatList>(null);

    useEffect(() => { init(); }, []);

    const init = async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                const fallback = { latitude: 28.6139, longitude: 77.2090, timestamp: Date.now() };
                setLocation(fallback);
                await fetchProjects(fallback);
                return;
            }
            const loc = await Location.getCurrentPositionAsync({});
            const userLoc: UserLocation = { latitude: loc.coords.latitude, longitude: loc.coords.longitude, timestamp: loc.timestamp };
            setLocation(userLoc);
            await fetchProjects(userLoc);
        } catch {
            const fallback = { latitude: 28.6139, longitude: 77.2090, timestamp: Date.now() };
            setLocation(fallback);
            await fetchProjects(fallback);
        }
    };

    const fetchProjects = async (loc: UserLocation) => {
        try {
            const data = await getNearbyProjects(loc.latitude, loc.longitude, 50000);
            const result = data.length > 0 ? data : MOCK_PROJECTS;
            setProjects(result);
            setFilteredProjects(result);
            checkGeoFence(loc, result);
        } catch {
            setProjects(MOCK_PROJECTS);
            setFilteredProjects(MOCK_PROJECTS);
        } finally {
            setLoading(false);
        }
    };

    const checkGeoFence = useCallback((userLoc: UserLocation, allProjects: Project[]) => {
        for (const p of allProjects) {
            const dist = getDistance(
                userLoc.latitude, userLoc.longitude,
                p.location.coordinates[1], p.location.coordinates[0]
            );
            const radius = p.geofence?.radius || 500;
            if (dist <= radius) {
                setGeoAlert(p);
                setGeoDistance(Math.round(dist));
                return;
            }
        }
    }, []);

    const onCategoryChange = (cat: string) => {
        Haptics.selectionAsync();
        setSelectedCategory(cat);
        const base = searchQuery ? projects.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())) : projects;
        setFilteredProjects(cat === 'All' ? base : base.filter(p => p.category === cat));
    };

    const onSearch = (q: string) => {
        setSearchQuery(q);
        const base = selectedCategory === 'All' ? projects : projects.filter(p => p.category === selectedCategory);
        setFilteredProjects(q ? base.filter(p =>
            p.name.toLowerCase().includes(q.toLowerCase()) ||
            p.category.toLowerCase().includes(q.toLowerCase())
        ) : base);
    };

    const snapToProject = (index: number) => {
        const project = filteredProjects[index];
        if (project && mapRef.current) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            mapRef.current.animateToRegion({
                latitude: project.location.coordinates[1],
                longitude: project.location.coordinates[0],
                latitudeDelta: 0.012,
                longitudeDelta: 0.012,
            }, 800);
            setSelectedMarker(project._id);
        }
    };

    const scanNearby = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        if (!location) return;
        checkGeoFence(location, projects);
        if (!geoAlert) {
            Alert.alert('Pure Environment', 'No active civic projects detected in your immediate 500m radius.');
        }
    };

    const renderProjectCard = ({ item }: { item: Project }) => {
        const color = getMarkerColor(item.category);
        const imgUri = item.images[0] || PROJECT_IMAGES[item.category] || PROJECT_IMAGES.other;

        return (
            <TouchableOpacity
                style={[styles.card, selectedMarker === item._id && { borderColor: color, borderWidth: 2 }]}
                onPress={() => {
                    Haptics.selectionAsync();
                    router.push(`/project/${item._id}` as any);
                }}
                activeOpacity={0.9}
            >
                <Image source={{ uri: imgUri }} style={styles.cardImage} />
                <View style={styles.cardInfo}>
                    <View style={[styles.catPill, { backgroundColor: `${color}15` }]}>
                        <Text style={[styles.catText, { color }]}>{item.category.toUpperCase()}</Text>
                    </View>
                    <Text style={styles.cardName} numberOfLines={1}>{item.name}</Text>
                    <View style={styles.cardProgressRow}>
                        <View style={styles.cardProgressBg}>
                            <View style={[styles.cardProgressFill, { width: `${item.impactMetrics.completionPercentage}%` as any, backgroundColor: color }]} />
                        </View>
                        <Text style={styles.cardProgressPct}>{item.impactMetrics.completionPercentage}%</Text>
                    </View>
                    <View style={styles.cardFooter}>
                        <Ionicons name="people" size={12} color={Colors.textMuted} />
                        <Text style={styles.cardImpact}>{item.impactMetrics.beneficiaries.toLocaleString()} impacted</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            {loading ? (
                <View style={styles.loader}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                    <Text style={styles.loaderText}>Calibrating map satellites...</Text>
                </View>
            ) : (
                <>
                    <MapView
                        ref={mapRef}
                        style={styles.map}
                        customMapStyle={MAP_STYLE}
                        initialRegion={location ? { ...location, latitudeDelta: 0.05, longitudeDelta: 0.05 } : undefined}
                    >
                        {location && (
                            <Marker coordinate={{ latitude: location.latitude, longitude: location.longitude }}>
                                <View style={styles.userMarker}>
                                    <View style={styles.userPulse} />
                                    <LinearGradient colors={[Colors.info, '#0EA5E9']} style={styles.userCore} />
                                </View>
                            </Marker>
                        )}

                        {filteredProjects.map((p, i) => {
                            const color = getMarkerColor(p.category);
                            return (
                                <React.Fragment key={p._id}>
                                    <Circle
                                        center={{ latitude: p.location.coordinates[1], longitude: p.location.coordinates[0] }}
                                        radius={p.geofence?.radius || 500}
                                        fillColor={`${color}10`}
                                        strokeColor={`${color}30`}
                                        strokeWidth={1}
                                    />
                                    <Marker
                                        coordinate={{ latitude: p.location.coordinates[1], longitude: p.location.coordinates[0] }}
                                        onPress={() => {
                                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                            flatListRef.current?.scrollToIndex({ index: i, animated: true });
                                            setSelectedMarker(p._id);
                                        }}
                                    >
                                        <View style={[styles.markerWrap, selectedMarker === p._id && styles.markerWrapSelected]}>
                                            <LinearGradient colors={[color, color]} style={styles.markerPin}>
                                                <Ionicons name="business" size={12} color={Colors.white} />
                                            </LinearGradient>
                                        </View>
                                    </Marker>
                                </React.Fragment>
                            );
                        })}
                    </MapView>

                    {/* Modern Geo-fence Alert Card */}
                    {geoAlert && (
                        <View style={styles.alertContainer}>
                            <LinearGradient colors={[Colors.white, '#F8FAFC']} style={styles.alertCard}>
                                <View style={styles.alertHeader}>
                                    <LinearGradient colors={['#FEE2E2', '#FECACA']} style={styles.alertIconBox}>
                                        <Ionicons name="pulse" size={14} color={Colors.accent} />
                                    </LinearGradient>
                                    <Text style={styles.alertTag}>PROXIMITY RADAR ACTIVE</Text>
                                    <TouchableOpacity onPress={() => setGeoAlert(null)} style={styles.alertClose}>
                                        <Ionicons name="close-circle" size={24} color={Colors.textMuted} />
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.alertBody}>
                                    <View style={styles.alertInfo}>
                                        <Text style={styles.alertTitle} numberOfLines={1}>{geoAlert.name}</Text>
                                        <View style={styles.alertDistRow}>
                                            <Ionicons name="location" size={13} color={Colors.primary} />
                                            <Text style={styles.alertDist}>{geoDistance}m from your current position</Text>
                                        </View>
                                        <Text style={styles.alertDesc} numberOfLines={2}>{geoAlert.shortDescription}</Text>
                                    </View>
                                </View>
                                <View style={styles.alertFooter}>
                                    <TouchableOpacity
                                        style={styles.alertViewBtn}
                                        onPress={() => router.push(`/project/${geoAlert._id}` as any)}
                                    >
                                        <Text style={styles.alertViewText}>Inspect Project</Text>
                                        <Ionicons name="eye" size={16} color={Colors.white} />
                                    </TouchableOpacity>
                                </View>
                            </LinearGradient>
                        </View>
                    )}

                    {/* Floating Search + Filters */}
                    <View style={styles.topOverlay}>
                        <View style={styles.searchBar}>
                            <Ionicons name="search" size={20} color={Colors.textSecondary} />
                            <TextInput
                                placeholder="Find municipal works..."
                                placeholderTextColor={Colors.textMuted}
                                style={styles.searchInput}
                                value={searchQuery}
                                onChangeText={onSearch}
                            />
                        </View>

                        <FlatList
                            horizontal
                            data={CATEGORY_DATA}
                            keyExtractor={item => item.label}
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.filterList}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={[styles.filterChip, selectedCategory === item.label && { backgroundColor: item.color, borderColor: item.color }]}
                                    onPress={() => onCategoryChange(item.label)}
                                >
                                    <Ionicons name={item.icon as any} size={14} color={selectedCategory === item.label ? Colors.white : item.color} />
                                    <Text style={[styles.filterText, selectedCategory === item.label && styles.filterTextActive]}>
                                        {item.label === 'All' ? 'All' : item.label.charAt(0).toUpperCase() + item.label.slice(1)}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>

                    {/* Improved Control FABs */}
                    <TouchableOpacity
                        style={styles.locateBtn}
                        onPress={() => {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            if (!location) return;
                            mapRef.current?.animateToRegion({ ...location, latitudeDelta: 0.015, longitudeDelta: 0.015 }, 500);
                        }}
                    >
                        <Ionicons name="navigate" size={20} color={Colors.text} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.scanFab} onPress={scanNearby}>
                        <LinearGradient
                            colors={[Colors.primary, '#1E293B']}
                            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                            style={styles.scanGradient}
                        >
                            <Ionicons name="scan-circle" size={22} color={Colors.white} />
                            <Text style={styles.scanText}>SCAN AREA</Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    {/* Premium Carousel */}
                    <View style={styles.carouselContainer}>
                        <FlatList
                            ref={flatListRef}
                            horizontal
                            data={filteredProjects}
                            renderItem={renderProjectCard}
                            keyExtractor={item => item._id}
                            showsHorizontalScrollIndicator={false}
                            snapToInterval={CARD_WIDTH + CARD_GAP}
                            decelerationRate="fast"
                            contentContainerStyle={{ paddingHorizontal: 20, gap: CARD_GAP }}
                            onMomentumScrollEnd={e => {
                                const index = Math.round(e.nativeEvent.contentOffset.x / (CARD_WIDTH + CARD_GAP));
                                snapToProject(index);
                            }}
                            ListEmptyComponent={() => (
                                <View style={styles.carouselEmpty}>
                                    <Text style={styles.carouselEmptyText}>No transparency data found for this filter.</Text>
                                </View>
                            )}
                        />
                    </View>
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    loader: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 16 },
    loaderText: { color: Colors.textSecondary, fontWeight: '800', letterSpacing: 1 },
    map: { width: '100%', height: '100%' },

    userMarker: { width: 44, height: 44, justifyContent: 'center', alignItems: 'center' },
    userPulse: { ...StyleSheet.absoluteFillObject, borderRadius: 22, backgroundColor: 'rgba(14, 165, 233, 0.2)' },
    userCore: { width: 14, height: 14, borderRadius: 7, borderWidth: 2.5, borderColor: Colors.white, ...Shadows.glow('#0EA5E9') },

    markerWrap: { padding: 4 },
    markerWrapSelected: { transform: [{ scale: 1.25 }] },
    markerPin: { width: 34, height: 34, borderRadius: 17, justifyContent: 'center', alignItems: 'center', borderWidth: 2.5, borderColor: Colors.white, ...Shadows.medium },

    alertContainer: { position: 'absolute', top: 155, left: 16, right: 16, zIndex: 100 },
    alertCard: { borderRadius: 24, padding: 20, ...Shadows.premium, borderLeftWidth: 6, borderLeftColor: Colors.accent },
    alertHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 },
    alertIconBox: { width: 28, height: 28, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
    alertTag: { flex: 1, fontSize: 10, fontWeight: '900', color: Colors.accent, letterSpacing: 1.5 },
    alertClose: { padding: 2 },
    alertBody: { marginBottom: 18 },
    alertInfo: { flex: 1 },
    alertTitle: { fontSize: 18, fontWeight: '900', color: Colors.text, marginBottom: 6 },
    alertDistRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
    alertDist: { fontSize: 12, color: Colors.primary, fontWeight: '800' },
    alertDesc: { fontSize: 13, color: Colors.textSecondary, lineHeight: 19, fontWeight: '500' },
    alertFooter: {},
    alertViewBtn: { flexDirection: 'row', backgroundColor: Colors.primary, height: 48, borderRadius: 14, justifyContent: 'center', alignItems: 'center', gap: 10, ...Shadows.glow(Colors.primary) },
    alertViewText: { color: Colors.white, fontSize: 14, fontWeight: '900' },

    topOverlay: { position: 'absolute', top: 55, left: 0, right: 0, paddingHorizontal: 16 },
    searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, height: 50, borderRadius: 16, paddingHorizontal: 18, ...Shadows.premium, gap: 12, marginBottom: 12 },
    searchInput: { flex: 1, fontSize: 15, color: Colors.text, fontWeight: '600' },
    filterList: { paddingVertical: 4, gap: 10 },
    filterChip: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 14, gap: 8, ...Shadows.small, borderWidth: 1, borderColor: '#F1F5F9' },
    filterText: { color: '#64748B', fontWeight: '800', fontSize: 12 },
    filterTextActive: { color: Colors.white },

    locateBtn: { position: 'absolute', right: 16, bottom: 255, width: 48, height: 48, borderRadius: 16, backgroundColor: Colors.white, justifyContent: 'center', alignItems: 'center', ...Shadows.medium },
    scanFab: { position: 'absolute', bottom: 255, left: 16, borderRadius: 16, overflow: 'hidden', ...Shadows.premium },
    scanGradient: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14, gap: 10 },
    scanText: { color: Colors.white, fontSize: 13, fontWeight: '900', letterSpacing: 1 },

    carouselContainer: { position: 'absolute', bottom: 90, width: '100%' },
    card: { backgroundColor: Colors.white, width: CARD_WIDTH, borderRadius: 24, padding: 16, flexDirection: 'row', gap: 14, ...Shadows.premium, borderBottomWidth: 4, borderBottomColor: '#F1F5F9' },
    cardImage: { width: 90, height: 100, borderRadius: 18 },
    cardInfo: { flex: 1, justifyContent: 'space-between' },
    catPill: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, marginBottom: 4 },
    catText: { fontSize: 10, fontWeight: '900' },
    cardName: { fontSize: 16, fontWeight: '900', color: Colors.text, lineHeight: 22 },
    cardProgressRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
    cardProgressBg: { flex: 1, height: 5, backgroundColor: '#F1F5F9', borderRadius: 3, overflow: 'hidden' },
    cardProgressFill: { height: '100%', borderRadius: 3 },
    cardProgressPct: { fontSize: 12, fontWeight: '900', color: Colors.textSecondary },
    cardFooter: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    cardImpact: { fontSize: 11, color: Colors.textMuted, fontWeight: '700' },
    carouselEmpty: { width: width - 40, justifyContent: 'center', alignItems: 'center', height: 120, backgroundColor: Colors.white, borderRadius: 24, ...Shadows.medium },
    carouselEmptyText: { color: Colors.textSecondary, fontWeight: '700', textAlign: 'center' },
});

export default MapScreen;
