// ========================================
// GeoAdTech — Live Project Map (Stitch Inspired)
// ========================================
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

import { Colors, Shadows } from '@/constants/theme';
import { getNearbyProjects } from '@/services/api';
import { Project, UserLocation } from '@/types';

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = width * 0.85;
const CARD_GAP = 15;

const MapScreen: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [location, setLocation] = useState<UserLocation | null>(null);
    const [loading, setLoading] = useState(true);
    const mapRef = useRef<MapView>(null);
    const flatListRef = useRef<FlatList>(null);

    const categories = ['All', 'Roads', 'Health', 'Parks', 'Education', 'Metro'];

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') return;
            let loc = await Location.getCurrentPositionAsync({});
            const userLoc = { latitude: loc.coords.latitude, longitude: loc.coords.longitude, timestamp: loc.timestamp };
            setLocation(userLoc);
            fetchProjects(userLoc);
        })();
    }, []);

    const fetchProjects = async (loc: UserLocation) => {
        try {
            const data = await getNearbyProjects(loc.latitude, loc.longitude);
            setProjects(data);
            setFilteredProjects(data);
        } catch (error) {
            console.error('Fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    const onCategoryChange = (cat: string) => {
        setSelectedCategory(cat);
        if (cat === 'All') {
            setFilteredProjects(projects);
        } else {
            setFilteredProjects(projects.filter((p) => p.category.toLowerCase() === cat.toLowerCase() || (cat === 'Roads' && p.category === 'road')));
        }
    };

    const snapToProject = (index: number) => {
        const project = filteredProjects[index];
        if (project && mapRef.current) {
            mapRef.current.animateToRegion({
                latitude: project.location.coordinates[1],
                longitude: project.location.coordinates[0],
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            }, 500);
        }
    };

    const renderProjectCard = ({ item }: { item: Project }) => {
        return (
            <TouchableOpacity
                style={styles.card}
                onPress={() => router.push(`/project/${item._id}`)}
                activeOpacity={0.9}
            >
                <View style={styles.cardMain}>
                    <View style={styles.imageContainer}>
                        <Image
                            source={{ uri: item.images[0] || 'https://images.unsplash.com/photo-1541888946425-d81bb19480c5?q=80&w=200' }}
                            style={styles.cardImage}
                        />
                        <View style={[styles.ongoingBadge, { backgroundColor: Colors.accent }]}>
                            <Text style={styles.ongoingText}>ONGOING</Text>
                        </View>
                    </View>

                    <View style={styles.cardInfo}>
                        <Text style={styles.cardName} numberOfLines={1}>{item.name}</Text>
                        <Text style={styles.cardSubtitle}>{item.category.charAt(0).toUpperCase() + item.category.slice(1)} • 0.2 mi away</Text>

                        <View style={styles.cardProgressRow}>
                            <View style={styles.cardProgressBar}>
                                <View style={[styles.cardProgressFill, { width: `${item.impactMetrics.completionPercentage}%`, backgroundColor: Colors.accent }]} />
                            </View>
                            <Text style={styles.cardProgressDetail}>
                                {item.impactMetrics.completionPercentage}% Complete • Est. {new Date(item.impactMetrics.expectedCompletion).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.cardArrow}>
                        <Ionicons name="chevron-forward" size={20} color={Colors.textMuted} />
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    const CATEGORY_DATA = [
        { label: 'All', icon: 'grid-outline', color: Colors.primary },
        { label: 'Roads', icon: 'git-branch-outline', color: '#F9A825' },
        { label: 'Health', icon: 'add-circle-outline', color: '#EF5350' },
        { label: 'Parks', icon: 'leaf-outline', color: '#4CAF50' },
    ];

    const getMarkerIcon = (category: string) => {
        switch (category) {
            case 'road': return 'construct';
            case 'metro': return 'time';
            case 'hospital': return 'checkmark-circle';
            case 'other': return 'location';
            default: return 'location';
        }
    };

    const getMarkerColor = (category: string) => {
        switch (category) {
            case 'road': return '#F9A825'; // Orange
            case 'metro': return '#1D3D8F'; // Blue
            case 'hospital': return '#00BFA5'; // Teal
            case 'other': return '#4CAF50'; // Green
            default: return Colors.primary;
        }
    };

    return (
        <View style={styles.container}>
            {loading ? (
                <View style={styles.loading}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                </View>
            ) : (
                <>
                    <MapView
                        ref={mapRef}
                        provider={PROVIDER_GOOGLE}
                        style={styles.map}
                        initialRegion={location ? { ...location, latitudeDelta: 0.05, longitudeDelta: 0.05 } : undefined}
                    >
                        {location && (
                            <Marker coordinate={{ latitude: location.latitude, longitude: location.longitude }} title="You are here">
                                <View style={styles.userMarker}>
                                    <View style={styles.userMarkerPulse} />
                                    <View style={styles.userMarkerCore} />
                                </View>
                            </Marker>
                        )}

                        {filteredProjects.map((p, i) => {
                            const color = getMarkerColor(p.category);
                            const icon = getMarkerIcon(p.category);
                            return (
                                <Marker
                                    key={p._id}
                                    coordinate={{ latitude: p.location.coordinates[1], longitude: p.location.coordinates[0] }}
                                    onPress={() => flatListRef.current?.scrollToIndex({ index: i, animated: true })}
                                >
                                    <View style={[styles.markerPin, { backgroundColor: color }]}>
                                        <Ionicons name={icon as any} size={14} color={Colors.white} />
                                    </View>
                                    <View style={[styles.markerStem, { borderTopColor: color }]} />
                                </Marker>
                            );
                        })}
                    </MapView>

                    {/* Geo-fence Alert Overlay (Stitch Inspired) */}
                    <View style={styles.alertContainer}>
                        <View style={styles.alertCard}>
                            <View style={styles.alertHeader}>
                                <View style={styles.alertIconBox}>
                                    <Ionicons name="radio" size={16} color={Colors.accent} />
                                </View>
                                <Text style={styles.alertLabel}>GEO-FENCE ALERT</Text>
                            </View>

                            <View style={styles.alertMain}>
                                <View style={styles.alertInfo}>
                                    <Text style={styles.alertTitle}>You're Near a Development Site</Text>
                                    <View style={styles.alertSubRow}>
                                        <Ionicons name="navigate" size={14} color={Colors.textSecondary} />
                                        <Text style={styles.alertDist}>200m away</Text>
                                    </View>
                                    <Text style={styles.alertDesc} numberOfLines={2}>
                                        New Flyover Project — reducing commute by 15 mins.
                                    </Text>
                                </View>
                                <Image
                                    source={{ uri: 'https://images.unsplash.com/photo-1541888946425-d81bb19480c5?q=80&w=200' }}
                                    style={styles.alertImg}
                                />
                            </View>

                            <View style={styles.alertFooter}>
                                <TouchableOpacity
                                    style={styles.alertViewBtn}
                                    onPress={() => router.push('/project/65d1234567890abcdef00001')}
                                >
                                    <Text style={styles.alertViewText}>View Details</Text>
                                    <Ionicons name="arrow-forward" size={16} color={Colors.white} />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.alertDismissBtn}>
                                    <Text style={styles.alertDismissText}>Dismiss</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    {/* Search Header */}
                    <View style={styles.searchHeader}>
                        <View style={styles.searchBar}>
                            <Ionicons name="search" size={20} color={Colors.textSecondary} />
                            <TextInput
                                placeholder="Search projects or locations"
                                placeholderTextColor={Colors.textMuted}
                                style={styles.searchInput}
                            />
                            <TouchableOpacity>
                                <Ionicons name="options-outline" size={20} color={Colors.textSecondary} />
                            </TouchableOpacity>
                        </View>

                        <FlatList
                            horizontal
                            data={CATEGORY_DATA}
                            keyExtractor={(item) => item.label}
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.filterList}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={[styles.filterChip, selectedCategory === item.label && styles.activeFilterChip]}
                                    onPress={() => onCategoryChange(item.label)}
                                >
                                    <Ionicons
                                        name={item.icon as any}
                                        size={16}
                                        color={selectedCategory === item.label ? Colors.white : item.color}
                                        style={{ marginRight: 6 }}
                                    />
                                    <Text style={[styles.filterText, selectedCategory === item.label && styles.activeFilterText]}>
                                        {item.label}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>

                    {/* Scan Nearby FAB */}
                    <TouchableOpacity style={styles.scanFab}>
                        <Ionicons name="scan" size={20} color={Colors.white} />
                        <Text style={styles.scanText}>Scan Nearby</Text>
                    </TouchableOpacity>

                    {/* Project Carousel */}
                    <View style={styles.carouselContainer}>
                        <FlatList
                            ref={flatListRef}
                            horizontal
                            data={filteredProjects}
                            renderItem={renderProjectCard}
                            keyExtractor={(item) => item._id}
                            showsHorizontalScrollIndicator={false}
                            snapToInterval={CARD_WIDTH + CARD_GAP}
                            decelerationRate="fast"
                            contentContainerStyle={styles.carouselContent}
                            onMomentumScrollEnd={(e) => {
                                const index = Math.round(e.nativeEvent.contentOffset.x / (CARD_WIDTH + CARD_GAP));
                                snapToProject(index);
                            }}
                        />
                    </View>

                    {/* Controls */}
                    <TouchableOpacity
                        style={styles.locateBtn}
                        onPress={() => mapRef.current?.animateToRegion({ ...location!, latitudeDelta: 0.01, longitudeDelta: 0.01 })}
                    >
                        <Ionicons name="navigate-outline" size={24} color={Colors.text} />
                    </TouchableOpacity>

                    <View style={styles.zoomControls}>
                        <TouchableOpacity style={styles.zoomBtn}><Text style={styles.zoomIcon}>+</Text></TouchableOpacity>
                        <View style={styles.zoomDiv} />
                        <TouchableOpacity style={styles.zoomBtn}><Text style={styles.zoomIcon}>—</Text></TouchableOpacity>
                    </View>
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    map: { width: '100%', height: '100%' },
    userMarker: { width: 30, height: 30, justifyContent: 'center', alignItems: 'center' },
    userMarkerPulse: { width: 30, height: 30, borderRadius: 15, backgroundColor: `${Colors.info}40`, position: 'absolute' },
    userMarkerCore: { width: 12, height: 12, borderRadius: 6, backgroundColor: Colors.info, borderWidth: 2, borderColor: Colors.white },

    markerPin: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: Colors.white, ...Shadows.small },
    markerStem: { width: 2, height: 10, alignSelf: 'center', borderLeftWidth: 6, borderRightWidth: 6, borderTopWidth: 10, borderLeftColor: 'transparent', borderRightColor: 'transparent', marginTop: -2 },

    searchHeader: { position: 'absolute', top: 60, width: '100%', paddingHorizontal: 20 },
    searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, height: 50, borderRadius: 25, paddingHorizontal: 20, ...Shadows.medium, gap: 10 },
    searchInput: { flex: 1, fontSize: 16, color: Colors.text, height: '100%' },

    filterList: { paddingVertical: 15 },
    filterChip: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginRight: 10, ...Shadows.small, borderWidth: 1, borderColor: Colors.border },
    activeFilterChip: { backgroundColor: Colors.primary, borderColor: Colors.primary },
    filterText: { color: Colors.textSecondary, fontWeight: '700', fontSize: 12 },
    activeFilterText: { color: Colors.white },

    scanFab: { position: 'absolute', bottom: 310, right: 20, backgroundColor: Colors.primary, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 30, ...Shadows.premium, gap: 8 },
    scanText: { color: Colors.white, fontSize: 14, fontWeight: '800' },

    carouselContainer: { position: 'absolute', bottom: 100, width: '100%' },
    carouselContent: { paddingHorizontal: 20, paddingBottom: 20 },

    card: { backgroundColor: Colors.white, width: CARD_WIDTH, marginRight: CARD_GAP, borderRadius: 20, padding: 12, ...Shadows.premium },
    cardMain: { flexDirection: 'row', gap: 12 },
    imageContainer: { width: 100, height: 100, position: 'relative' },
    cardImage: { width: '100%', height: '100%', borderRadius: 15 },
    ongoingBadge: { position: 'absolute', top: 8, left: 8, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
    ongoingText: { color: Colors.white, fontSize: 8, fontWeight: '900' },
    cardInfo: { flex: 1, justifyContent: 'center' },
    cardName: { fontSize: 16, fontWeight: '900', color: Colors.text, marginBottom: 4 },
    cardSubtitle: { fontSize: 11, color: Colors.textSecondary, fontWeight: '600', marginBottom: 10 },
    cardProgressRow: { width: '100%' },
    cardProgressBar: { height: 4, backgroundColor: Colors.background, borderRadius: 2, overflow: 'hidden', marginBottom: 6 },
    cardProgressFill: { height: '100%', borderRadius: 2 },
    cardProgressDetail: { fontSize: 10, fontWeight: '700', color: Colors.textMuted },
    cardArrow: { justifyContent: 'center', paddingLeft: 5 },

    locateBtn: { position: 'absolute', right: 20, bottom: 240, width: 50, height: 50, borderRadius: 25, backgroundColor: Colors.white, justifyContent: 'center', alignItems: 'center', ...Shadows.medium },
    zoomControls: { position: 'absolute', right: 20, bottom: 380, width: 50, backgroundColor: Colors.white, borderRadius: 25, ...Shadows.medium, overflow: 'hidden' },
    zoomBtn: { width: 50, height: 50, justifyContent: 'center', alignItems: 'center' },
    zoomIcon: { fontSize: 20, fontWeight: '600', color: Colors.text },
    zoomDiv: { height: 1, backgroundColor: Colors.border, width: '60%', alignSelf: 'center' },

    // Alert Styles (Stitch Inspired)
    alertContainer: { position: 'absolute', top: 130, width: '100%', paddingHorizontal: 20, zIndex: 100 },
    alertCard: { backgroundColor: Colors.white, borderRadius: 25, padding: 20, ...Shadows.premium, borderLeftWidth: 5, borderLeftColor: Colors.accent },
    alertHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 15 },
    alertIconBox: { width: 24, height: 24, borderRadius: 12, backgroundColor: `${Colors.accent}15`, justifyContent: 'center', alignItems: 'center' },
    alertLabel: { fontSize: 10, fontWeight: '900', color: Colors.accent, letterSpacing: 1 },
    alertMain: { flexDirection: 'row', gap: 15, marginBottom: 20 },
    alertInfo: { flex: 1 },
    alertTitle: { fontSize: 18, fontWeight: '900', color: Colors.text, marginBottom: 6 },
    alertSubRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 8 },
    alertDist: { fontSize: 12, color: Colors.textSecondary, fontWeight: '700' },
    alertDesc: { fontSize: 13, color: Colors.textSecondary, lineHeight: 18 },
    alertImg: { width: 80, height: 80, borderRadius: 15 },
    alertFooter: { flexDirection: 'row', gap: 12 },
    alertViewBtn: { flex: 1.5, backgroundColor: Colors.primary, height: 48, borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
    alertViewText: { color: Colors.white, fontSize: 14, fontWeight: '800' },
    alertDismissBtn: { flex: 1, height: 48, borderRadius: 12, borderWidth: 1, borderColor: Colors.border, justifyContent: 'center', alignItems: 'center' },
    alertDismissText: { color: Colors.textSecondary, fontSize: 14, fontWeight: '700' },
});

export default MapScreen;
