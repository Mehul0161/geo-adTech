// ========================================
// GeoAdTech — Project Details (Stitch Style)
// ========================================
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

import { CATEGORY_ICONS } from '@/constants/mockData';
import { Colors, Shadows } from '@/constants/theme';
import { getProjectById, submitFeedback } from '@/services/api';
import { Project } from '@/types';

export default function ProjectDetailScreen() {
    const { id } = useLocalSearchParams();
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [feedback, setFeedback] = useState('');
    const [rating, setRating] = useState(5);
    const [submitted, setSubmitted] = useState(false);

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
        if (!feedback) return;
        try {
            await submitFeedback({
                projectId: project!._id,
                userId: 'user_123',
                rating,
                comment: feedback
            });
            setSubmitted(true);
            setFeedback('');
        } catch (e) {
            Alert.alert('Error', 'Could not submit feedback.');
        }
    };

    if (loading) return (
        <View style={styles.center}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingText}>Fetching Project Data...</Text>
        </View>
    );

    if (!project) return (
        <View style={styles.center}>
            <Text style={styles.errorText}>Project not found.</Text>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                <Text style={{ color: Colors.primary }}>Go Back</Text>
            </TouchableOpacity>
        </View>
    );

    const categoryColor = Colors.categories[project.category] || Colors.textSecondary;

    return (
        <ScrollView style={styles.container} bounces={false}>
            {/* Hero Image Section */}
            <View style={styles.heroContainer}>
                <Image
                    source={{ uri: project.images[0] || 'https://images.unsplash.com/photo-1590066839089-6d63430030da?q=80&w=1000' }}
                    style={styles.heroImage}
                />
                <View style={styles.heroOverlay}>
                    <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
                        <Ionicons name="close" size={24} color={Colors.white} />
                    </TouchableOpacity>
                    <View style={styles.heroTitles}>
                        <View style={[styles.categoryBadge, { backgroundColor: categoryColor }]}>
                            <Text style={styles.categoryText}>{project.category.toUpperCase()}</Text>
                        </View>
                        <Text style={styles.heroTitle}>{project.name}</Text>
                        <View style={styles.heroMeta}>
                            <Ionicons name="location" size={14} color="rgba(255,255,255,0.7)" />
                            <Text style={styles.heroLocation}>New Delhi, India</Text>
                        </View>
                    </View>
                </View>
            </View>

            {/* Content Body */}
            <View style={styles.content}>

                {/* Stats Row */}
                <View style={styles.statsGrid}>
                    <View style={styles.statCard}>
                        <Text style={styles.statVal}>₹{project.impactMetrics.budget.split(' ')[1]}</Text>
                        <Text style={styles.statLabel}>Investment</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statVal}>{project.impactMetrics.completionPercentage}%</Text>
                        <Text style={styles.statLabel}>In Progress</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statVal}>{(project.impactMetrics.beneficiaries / 1000000).toFixed(1)}M</Text>
                        <Text style={styles.statLabel}>Citizens Impacted</Text>
                    </View>
                </View>

                {/* AI Notification Card */}
                <View style={[styles.aiCard, { borderLeftColor: categoryColor }]}>
                    <View style={styles.aiHeader}>
                        <Ionicons name="sparkles" size={18} color={Colors.accent} />
                        <Text style={styles.aiLabel}>AI-DRIVEN CAMPAIGN MESSAGE</Text>
                    </View>
                    <Text style={styles.aiText}>"{project.campaign.text}"</Text>
                    <Text style={styles.aiTone}>Analysis: {(project.campaign.aiTone || 'informative').toUpperCase()} TONE</Text>
                </View>

                {/* Site Transformation (Stitch Inspired) */}
                <Text style={styles.sectionTitle}>Site Transformation</Text>
                <View style={styles.transformationCard}>
                    <View style={styles.transformationSlider}>
                        <View style={styles.halfImage}>
                            <Image source={{ uri: 'https://images.unsplash.com/photo-1541888946425-d81bb19480c5?q=80&w=500' }} style={styles.sideImg} />
                            <View style={styles.imgLabelBox}><Text style={styles.imgLabel}>BEFORE</Text></View>
                        </View>
                        <View style={styles.transformDivider}>
                            <View style={styles.handle}><Ionicons name="swap-horizontal" size={16} color={Colors.primary} /></View>
                        </View>
                        <View style={styles.halfImage}>
                            <Image source={{ uri: project.images[0] || 'https://images.unsplash.com/photo-1590066839089-6d63430030da?q=80&w=500' }} style={styles.sideImg} />
                            <View style={[styles.imgLabelBox, { right: 10, left: undefined }]}><Text style={styles.imgLabel}>PRESENT</Text></View>
                        </View>
                    </View>
                    <Text style={styles.transformationHint}>Pinch to compare detailed progress over time.</Text>
                </View>

                {/* Project Leadership (Stitch Inspired) */}
                <Text style={styles.sectionTitle}>Project Leadership</Text>
                <View style={styles.leadershipCard}>
                    <View style={styles.leaderProfile}>
                        <View style={styles.leaderAvatar}>
                            <Ionicons name="person" size={24} color={Colors.primary} />
                            <View style={styles.activeDot} />
                        </View>
                        <View style={styles.leaderInfo}>
                            <Text style={styles.leaderName}>{project.leadership.name}</Text>
                            <Text style={styles.leaderTitle}>{project.leadership.title}</Text>
                        </View>
                        <TouchableOpacity style={styles.leaderMsgBtn}>
                            <Ionicons name="chatbubble-ellipses" size={20} color={Colors.primary} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.quoteBox}>
                        <Text style={styles.quoteText}>"Everything we build is centered around the citizen journey, ensuring safety and longevity for our community."</Text>
                    </View>
                </View>

                {/* Map View */}
                <Text style={styles.sectionTitle}>Precise Location</Text>
                <View style={styles.mapContainer}>
                    <MapView
                        provider={PROVIDER_GOOGLE}
                        style={styles.map}
                        initialRegion={{
                            latitude: project.location.coordinates[1],
                            longitude: project.location.coordinates[0],
                            latitudeDelta: 0.005,
                            longitudeDelta: 0.005,
                        }}
                    >
                        <Marker coordinate={{ latitude: project.location.coordinates[1], longitude: project.location.coordinates[0] }}>
                            <View style={[styles.markerPin, { backgroundColor: categoryColor }]}>
                                <Ionicons name={CATEGORY_ICONS[project.category] as any} size={14} color={Colors.white} />
                            </View>
                        </Marker>
                    </MapView>
                </View>

                {/* Feedback Section */}
                <Text style={styles.sectionTitle}>Citizen Engagement</Text>
                <View style={styles.feedbackCard}>
                    {submitted ? (
                        <View style={styles.successBox}>
                            <Ionicons name="checkmark-circle" size={40} color={Colors.success} />
                            <Text style={styles.successTitle}>Thank you, Citizen!</Text>
                            <Text style={styles.successText}>Your feedback has been logged for municipal review.</Text>
                        </View>
                    ) : (
                        <>
                            <Text style={styles.feedbackPrompt}>How would you rate the progress on this site?</Text>
                            <View style={styles.starsRow}>
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <TouchableOpacity key={s} onPress={() => setRating(s)}>
                                        <Ionicons name={s <= rating ? 'star' : 'star-outline'} size={32} color={Colors.accent} />
                                    </TouchableOpacity>
                                ))}
                            </View>
                            <TextInput
                                style={styles.input}
                                placeholder="Your comments (optional)..."
                                multiline
                                value={feedback}
                                onChangeText={setFeedback}
                            />
                            <TouchableOpacity style={styles.submitBtn} onPress={handleFeedback}>
                                <Text style={styles.submitBtnText}>Submit Updates</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>

                <View style={{ height: 80 }} />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background },
    loadingText: { marginTop: 15, color: Colors.textSecondary, fontWeight: '700' },
    errorText: { fontSize: 18, color: Colors.error, fontWeight: '800' },
    heroContainer: { height: 400, position: 'relative' },
    heroImage: { width: '100%', height: '100%' },
    heroOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.3)', padding: 25, justifyContent: 'space-between' },
    closeBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center', alignSelf: 'flex-start', marginTop: 30 },
    heroTitles: { paddingBottom: 10 },
    categoryBadge: { alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, marginBottom: 12 },
    categoryText: { color: Colors.white, fontSize: 10, fontWeight: '900', letterSpacing: 1 },
    heroTitle: { fontSize: 32, fontWeight: '900', color: Colors.white, marginBottom: 8 },
    heroMeta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    heroLocation: { color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: '600' },
    content: { padding: 25, marginTop: -30, backgroundColor: Colors.background, borderTopLeftRadius: 35, borderTopRightRadius: 35 },
    statsGrid: { flexDirection: 'row', gap: 12, marginBottom: 30 },
    statCard: { flex: 1, backgroundColor: Colors.surface, borderRadius: 20, padding: 15, alignItems: 'center', ...Shadows.small },
    statVal: { fontSize: 18, fontWeight: '900', color: Colors.primary, marginBottom: 4 },
    statLabel: { fontSize: 10, color: Colors.textSecondary, fontWeight: '700', textTransform: 'uppercase' },
    aiCard: { backgroundColor: Colors.primaryLight, padding: 20, borderRadius: 20, borderLeftWidth: 5, marginBottom: 35 },
    aiHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
    aiLabel: { fontSize: 10, fontWeight: '900', color: Colors.textSecondary, letterSpacing: 1 },
    aiText: { fontSize: 16, fontStyle: 'italic', fontWeight: '700', color: Colors.primary, lineHeight: 24, marginBottom: 10 },
    aiTone: { fontSize: 9, color: Colors.textMuted, fontWeight: '900' },
    sectionTitle: { fontSize: 18, fontWeight: '900', color: Colors.text, marginBottom: 15, marginTop: 10 },
    transformationCard: { backgroundColor: Colors.white, borderRadius: 20, padding: 15, marginBottom: 30, ...Shadows.small },
    transformationSlider: { height: 180, flexDirection: 'row', borderRadius: 15, overflow: 'hidden' },
    halfImage: { flex: 1, position: 'relative' },
    sideImg: { width: '100%', height: '100%' },
    imgLabelBox: { position: 'absolute', bottom: 10, left: 10, backgroundColor: 'rgba(0,0,0,0.5)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
    imgLabel: { color: Colors.white, fontSize: 8, fontWeight: '900' },
    transformDivider: { width: 2, height: '100%', backgroundColor: Colors.white, zIndex: 10, justifyContent: 'center', alignItems: 'center' },
    handle: { width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.white, position: 'absolute', justifyContent: 'center', alignItems: 'center', ...Shadows.small },
    transformationHint: { color: Colors.textMuted, fontSize: 11, textAlign: 'center', marginTop: 12, fontStyle: 'italic' },
    leadershipCard: { backgroundColor: Colors.white, borderRadius: 20, padding: 18, marginBottom: 30, ...Shadows.small },
    leaderProfile: { flexDirection: 'row', alignItems: 'center', gap: 15, marginBottom: 15 },
    leaderAvatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: Colors.primaryLight, justifyContent: 'center', alignItems: 'center', position: 'relative' },
    activeDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.success, position: 'absolute', bottom: 2, right: 2, borderWidth: 2, borderColor: Colors.white },
    leaderInfo: { flex: 1 },
    leaderName: { fontSize: 16, fontWeight: '800', color: Colors.text },
    leaderTitle: { fontSize: 12, color: Colors.textSecondary },
    leaderMsgBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.primaryLight, justifyContent: 'center', alignItems: 'center' },
    quoteBox: { backgroundColor: Colors.background, padding: 15, borderRadius: 12 },
    quoteText: { fontSize: 13, fontStyle: 'italic', lineHeight: 20, color: Colors.textSecondary },
    mapContainer: { height: 200, borderRadius: 20, overflow: 'hidden', marginBottom: 35, ...Shadows.small },
    map: { width: '100%', height: '100%' },
    markerPin: { width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: Colors.white },
    feedbackCard: { backgroundColor: Colors.white, borderRadius: 20, padding: 25, ...Shadows.medium },
    feedbackPrompt: { fontSize: 15, fontWeight: '800', color: Colors.text, textAlign: 'center', marginBottom: 15 },
    starsRow: { flexDirection: 'row', justifyContent: 'center', gap: 10, marginBottom: 20 },
    input: { backgroundColor: Colors.background, borderRadius: 15, padding: 15, minHeight: 80, textAlignVertical: 'top', color: Colors.text, marginBottom: 20 },
    submitBtn: { backgroundColor: Colors.primary, height: 55, borderRadius: 30, justifyContent: 'center', alignItems: 'center', ...Shadows.glow(Colors.primary) },
    submitBtnText: { color: Colors.white, fontSize: 16, fontWeight: '800' },
    successBox: { alignItems: 'center', paddingVertical: 10 },
    successTitle: { fontSize: 20, fontWeight: '900', color: Colors.success, marginTop: 15, marginBottom: 8 },
    successText: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22 },
    backBtn: { marginTop: 10 }
});
