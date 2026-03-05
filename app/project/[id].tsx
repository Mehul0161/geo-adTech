// ========================================
// GeoAdTech — Project Details (Premium)
// ========================================
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Animated,
    Dimensions,
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';

import { CATEGORY_ICONS } from '@/constants/mockData';
import { Colors, Shadows } from '@/constants/theme';
import { getProjectById, submitFeedback } from '@/services/api';
import { Project } from '@/types';

const { width } = Dimensions.get('window');
const HERO_HEIGHT = 400;

export default function ProjectDetailScreen() {
    const { id } = useLocalSearchParams();
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [feedback, setFeedback] = useState('');
    const [rating, setRating] = useState(5);
    const [submitted, setSubmitted] = useState(false);

    const scrollY = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (id) fetchDetail(id as string);
    }, [id]);

    const fetchDetail = async (projectId: string) => {
        try {
            const data = await getProjectById(projectId);
            setProject(data || null);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleFeedback = async () => {
        try {
            if (!project) return;
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            await submitFeedback({
                projectId: project._id,
                userId: 'user_123',
                rating,
                comment: feedback
            });
            setSubmitted(true);
            setFeedback('');
        } catch (e) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            Alert.alert('Error', 'Could not sync feedback with nodal servers.');
        }
    };

    const handleRatingPress = (r: number) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setRating(r);
    };

    if (loading) return (
        <View style={styles.center}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingText}>Synchronizing Civic Data...</Text>
        </View>
    );

    if (!project) return (
        <View style={styles.center}>
            <Text style={styles.errorText}>Data Node Not Responding.</Text>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                <Text style={{ color: Colors.primary, fontWeight: '800' }}>← Return to Hub</Text>
            </TouchableOpacity>
        </View>
    );

    const categoryColor = Colors.categories[project.category] || Colors.textSecondary;

    // Header Parallax Interpolations
    const headerTranslate = scrollY.interpolate({
        inputRange: [-HERO_HEIGHT, 0, HERO_HEIGHT],
        outputRange: [HERO_HEIGHT / 2, 0, -HERO_HEIGHT / 3],
        extrapolate: 'clamp',
    });

    const headerScale = scrollY.interpolate({
        inputRange: [-HERO_HEIGHT, 0],
        outputRange: [2, 1],
        extrapolate: 'clamp',
    });

    return (
        <View style={styles.container}>
            {/* Parallax Header */}
            <Animated.View style={[styles.heroContainer, { transform: [{ translateY: headerTranslate }, { scale: headerScale }] }]}>
                <Image
                    source={{ uri: project.images?.[0] || 'https://images.unsplash.com/photo-1590066839089-6d63430030da?q=80&w=1000' }}
                    style={styles.heroImage}
                />
                <LinearGradient colors={['rgba(0,0,0,0.4)', 'transparent', 'rgba(0,0,0,0.6)']} style={StyleSheet.absoluteFill} />
            </Animated.View>

            {/* Content Scroll */}
            <Animated.ScrollView
                onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}
                bounces={true}
            >
                <View style={{ height: HERO_HEIGHT - 60 }} />

                <View style={styles.content}>
                    {/* Floating Quick Stats */}
                    <View style={styles.pillContainer}>
                        <View style={[styles.statusPill, { backgroundColor: categoryColor }]}>
                            <Text style={styles.statusText}>{project.status?.replace('-', ' ').toUpperCase() || 'UNKNOWN'}</Text>
                        </View>
                        <Text style={styles.mainTitle}>{project.name}</Text>
                        <View style={styles.locRow}>
                            <Ionicons name="location" size={14} color={Colors.primary} />
                            <Text style={styles.locText}>Delhi Integrated Digital Node</Text>
                        </View>
                    </View>

                    <View style={styles.statsGrid}>
                        <LinearGradient colors={['#F1F5F9', '#FFFFFF']} style={styles.statCard}>
                            <Text style={styles.statVal}>{project.impactMetrics?.budget || 'N/A'}</Text>
                            <Text style={styles.statLabel}>ALLOCATED</Text>
                        </LinearGradient>
                        <LinearGradient colors={['#F1F5F9', '#FFFFFF']} style={styles.statCard}>
                            <Text style={styles.statVal}>{project.impactMetrics?.completionPercentage || 0}%</Text>
                            <Text style={styles.statLabel}>VELOCITY</Text>
                        </LinearGradient>
                        <LinearGradient colors={['#F1F5F9', '#FFFFFF']} style={styles.statCard}>
                            <Text style={styles.statVal}>
                                {project.impactMetrics?.beneficiaries
                                    ? (project.impactMetrics.beneficiaries / 1000000).toFixed(1) + 'M'
                                    : 'N/A'}
                            </Text>
                            <Text style={styles.statLabel}>BENEFICIARIES</Text>
                        </LinearGradient>
                    </View>

                    {/* AI Campaign */}
                    <View style={styles.aiSection}>
                        <View style={styles.aiHeader}>
                            <Ionicons name="sparkles" size={16} color={Colors.primary} />
                            <Text style={styles.aiLabel}>CIVIC AI INSIGHT</Text>
                        </View>
                        <Text style={styles.aiText}>"{project.campaign?.text || 'No AI insights available for this node.'}"</Text>
                    </View>

                    {/* Transformation Compare */}
                    <Text style={styles.sectionTitle}>Digital Transformation</Text>
                    <View style={styles.transformSection}>
                        <View style={styles.transformImages}>
                            <View style={styles.sideBlock}>
                                <Image source={{ uri: 'https://images.unsplash.com/photo-1541888946425-d81bb19480c5?q=80&w=400' }} style={styles.sideImg} />
                                <View style={styles.sideBadge}><Text style={styles.sideText}>PAST</Text></View>
                            </View>
                            <View style={styles.transformDivider}>
                                <View style={styles.dividerIcon}><Ionicons name="sync" size={12} color={Colors.white} /></View>
                            </View>
                            <View style={styles.sideBlock}>
                                <Image source={{ uri: project.images?.[0] || 'https://images.unsplash.com/photo-1590066839089-6d63430030da?q=80&w=400' }} style={styles.sideImg} />
                                <View style={[styles.sideBadge, { right: 10, left: undefined, backgroundColor: Colors.success }]}><Text style={styles.sideText}>ACTIVE</Text></View>
                            </View>
                        </View>
                    </View>

                    {/* Map Snippet */}
                    <View style={styles.mapWrap}>
                        <MapView
                            style={styles.map}
                            initialRegion={{
                                latitude: (project.location?.coordinates?.[1] || 28.6139) - 0.002,
                                longitude: project.location?.coordinates?.[0] || 77.2090,
                                latitudeDelta: 0.01,
                                longitudeDelta: 0.01,
                            }}
                            scrollEnabled={false}
                            zoomEnabled={false}
                            pitchEnabled={false}
                        >
                            {project.location?.coordinates && (
                                <Marker coordinate={{ latitude: project.location.coordinates[1], longitude: project.location.coordinates[0] }}>
                                    <View style={[styles.markerPin, { backgroundColor: categoryColor }]}>
                                        <Ionicons name={CATEGORY_ICONS[project.category] as any || 'location'} size={14} color={Colors.white} />
                                    </View>
                                </Marker>
                            )}
                        </MapView>
                        <LinearGradient colors={['transparent', 'rgba(255,255,255,0.9)']} style={styles.mapOverlay}>
                            <TouchableOpacity style={styles.expandBtn} onPress={() => router.push('/map' as any)}>
                                <Text style={styles.expandText}>Expand Digital Twin</Text>
                                <Ionicons name="expand" size={14} color={Colors.primary} />
                            </TouchableOpacity>
                        </LinearGradient>
                    </View>

                    {/* Engagement */}
                    <View style={styles.feedbackCard}>
                        {submitted ? (
                            <View style={styles.successBox}>
                                <View style={styles.successIcon}>
                                    <Ionicons name="shield-checkmark" size={40} color={Colors.white} />
                                </View>
                                <Text style={styles.successTitle}>Signal Transmitted</Text>
                                <Text style={styles.successText}>Your feedback is now part of the public transparency ledger.</Text>
                            </View>
                        ) : (
                            <>
                                <Text style={styles.feedbackTitle}>Citizen Response</Text>
                                <View style={styles.starsRow}>
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <TouchableOpacity key={s} onPress={() => handleRatingPress(s)}>
                                            <Ionicons name={s <= rating ? 'star' : 'star-outline'} size={32} color={Colors.accent} />
                                        </TouchableOpacity>
                                    ))}
                                </View>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Add technical comments or general feedback..."
                                    placeholderTextColor="#94A3B8"
                                    multiline
                                    value={feedback}
                                    onChangeText={setFeedback}
                                />
                                <TouchableOpacity style={styles.submitBtn} onPress={handleFeedback}>
                                    <LinearGradient colors={[Colors.primary, '#1E293B']} style={styles.submitGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                                        <Text style={styles.submitText}>COMMIT FEEDBACK</Text>
                                        <Ionicons name="cloud-upload" size={18} color={Colors.white} />
                                    </LinearGradient>
                                </TouchableOpacity>
                            </>
                        )}
                    </View>

                    <View style={{ height: 100 }} />
                </View>
            </Animated.ScrollView>

            {/* Floating Back Button */}
            <TouchableOpacity style={styles.headerBack} onPress={() => router.back()}>
                <Ionicons name="chevron-back" size={24} color={Colors.text} />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.white },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    loadingText: { marginTop: 16, fontSize: 13, fontWeight: '800', color: Colors.primary, letterSpacing: 1 },
    errorText: { fontSize: 16, fontWeight: '900', color: Colors.error },
    backBtn: { marginTop: 20 },

    heroContainer: { height: HERO_HEIGHT, width: '100%', position: 'absolute', top: 0 },
    heroImage: { width: '100%', height: '100%' },
    headerBack: { position: 'absolute', top: 50, left: 20, width: 44, height: 44, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.9)', justifyContent: 'center', alignItems: 'center', ...Shadows.medium, zIndex: 100 },

    content: { backgroundColor: Colors.white, borderTopLeftRadius: 40, borderTopRightRadius: 40, padding: 24, paddingBottom: 0 },
    pillContainer: { marginTop: -60, backgroundColor: Colors.white, borderRadius: 24, padding: 20, ...Shadows.premium, marginBottom: 24 },
    statusPill: { alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, marginBottom: 12 },
    statusText: { color: Colors.white, fontSize: 10, fontWeight: '900', letterSpacing: 1 },
    mainTitle: { fontSize: 26, fontWeight: '900', color: Colors.text, marginBottom: 4 },
    locRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    locText: { color: Colors.textMuted, fontSize: 13, fontWeight: '700' },

    statsGrid: { flexDirection: 'row', gap: 10, marginBottom: 28 },
    statCard: { flex: 1, borderRadius: 16, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: '#F1F5F9' },
    statVal: { fontSize: 18, fontWeight: '900', color: Colors.primary, marginBottom: 2 },
    statLabel: { fontSize: 8, fontWeight: '900', color: '#64748B', letterSpacing: 1 },

    aiSection: { backgroundColor: '#F8FAFC', padding: 20, borderRadius: 24, marginBottom: 32, borderLeftWidth: 4, borderLeftColor: Colors.primary },
    aiHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
    aiLabel: { fontSize: 10, fontWeight: '900', color: Colors.textMuted, letterSpacing: 1.5 },
    aiText: { fontSize: 16, fontStyle: 'italic', fontWeight: '800', color: Colors.text, lineHeight: 24 },

    sectionTitle: { fontSize: 13, fontWeight: '900', color: Colors.textMuted, letterSpacing: 2, marginBottom: 16, textTransform: 'uppercase' },
    transformSection: { marginBottom: 32 },
    transformImages: { height: 180, flexDirection: 'row', borderRadius: 24, overflow: 'hidden' },
    sideBlock: { flex: 1, position: 'relative' },
    sideImg: { width: '100%', height: '100%' },
    sideBadge: { position: 'absolute', top: 10, left: 10, backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
    sideText: { color: Colors.white, fontSize: 9, fontWeight: '900' },
    transformDivider: { width: 4, backgroundColor: Colors.white, zIndex: 10, justifyContent: 'center', alignItems: 'center' },
    dividerIcon: { width: 24, height: 24, borderRadius: 12, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center', position: 'absolute', ...Shadows.small },

    mapWrap: { height: 180, borderRadius: 24, overflow: 'hidden', marginBottom: 32, ...Shadows.small },
    map: { width: '100%', height: '100%' },
    mapOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 100, justifyContent: 'flex-end', padding: 16 },
    expandBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: Colors.white, alignSelf: 'center', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, ...Shadows.small },
    expandText: { fontSize: 12, fontWeight: '800', color: Colors.primary },
    markerPin: { width: 30, height: 30, borderRadius: 15, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: Colors.white },

    feedbackCard: { backgroundColor: Colors.white, borderRadius: 32, padding: 24, borderWidth: 1, borderColor: '#F1F5F9', ...Shadows.small },
    feedbackTitle: { fontSize: 20, fontWeight: '900', color: Colors.text, textAlign: 'center', marginBottom: 20 },
    starsRow: { flexDirection: 'row', justifyContent: 'center', gap: 12, marginBottom: 24 },
    input: { backgroundColor: '#F8FAFC', borderRadius: 20, padding: 20, minHeight: 120, textAlignVertical: 'top', color: Colors.text, marginBottom: 24, fontSize: 15, fontWeight: '500', borderWidth: 1, borderColor: '#E2E8F0' },
    submitBtn: { height: 64, borderRadius: 22, overflow: 'hidden', ...Shadows.glow(Colors.primary) },
    submitGradient: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 12 },
    submitText: { color: Colors.white, fontSize: 16, fontWeight: '900', letterSpacing: 1 },

    successBox: { alignItems: 'center', paddingVertical: 20 },
    successIcon: { width: 72, height: 72, borderRadius: 36, backgroundColor: Colors.success, justifyContent: 'center', alignItems: 'center', marginBottom: 20, ...Shadows.glow(Colors.success) },
    successTitle: { fontSize: 22, fontWeight: '900', color: Colors.success, marginBottom: 10 },
    successText: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22, fontWeight: '500' },
});
