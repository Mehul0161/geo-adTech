// ========================================
// GeoAdTech — Project Detail Screen
// ========================================
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Animated,
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import MapView, { Circle, Marker } from 'react-native-maps';

import { CATEGORY_ICONS, MOCK_PROJECTS } from '@/constants/mockData';
import { BorderRadius, Colors, FontSizes, Shadows, Spacing, StatusColors } from '@/constants/theme';
import { Project } from '@/types';

const { width } = Dimensions.get('window');

export default function ProjectDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [project, setProject] = useState<Project | null>(null);
    const [showFeedback, setShowFeedback] = useState(false);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [feedbackSent, setFeedbackSent] = useState(false);
    const scrollY = React.useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const found = MOCK_PROJECTS.find((p) => p._id === id);
        if (found) setProject(found);
    }, [id]);

    if (!project) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Loading...</Text>
            </View>
        );
    }

    const categoryColor = Colors.categories[project.category] || Colors.textMuted;
    const statusColor = StatusColors[project.status] || Colors.textMuted;

    const formatNumber = (num: number): string => {
        if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B';
        if (num >= 1e7) return (num / 1e7).toFixed(1) + 'Cr';
        if (num >= 1e5) return (num / 1e5).toFixed(1) + 'L';
        if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
        return num.toString();
    };

    const handleSubmitFeedback = () => {
        if (rating === 0) return;
        setFeedbackSent(true);
        setTimeout(() => {
            setShowFeedback(false);
            setFeedbackSent(false);
            setRating(0);
            setComment('');
        }, 2000);
    };

    return (
        <ScrollView
            style={styles.container}
            showsVerticalScrollIndicator={false}
            onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                { useNativeDriver: false }
            )}
        >
            {/* Mini Map Header */}
            <View style={styles.mapContainer}>
                <MapView
                    style={styles.headerMap}
                    initialRegion={{
                        latitude: project.location.coordinates[1],
                        longitude: project.location.coordinates[0],
                        latitudeDelta: 0.015,
                        longitudeDelta: 0.015,
                    }}
                    scrollEnabled={false}
                    zoomEnabled={false}
                    customMapStyle={darkMapStyle}
                >
                    <Circle
                        center={{
                            latitude: project.location.coordinates[1],
                            longitude: project.location.coordinates[0],
                        }}
                        radius={project.geofence.radius}
                        fillColor={`${categoryColor}20`}
                        strokeColor={`${categoryColor}60`}
                        strokeWidth={2}
                    />
                    <Marker
                        coordinate={{
                            latitude: project.location.coordinates[1],
                            longitude: project.location.coordinates[0],
                        }}
                    >
                        <View style={[styles.marker, { backgroundColor: categoryColor }]}>
                            <Ionicons
                                name={CATEGORY_ICONS[project.category] as any}
                                size={18}
                                color={Colors.white}
                            />
                        </View>
                    </Marker>
                </MapView>
                <View style={styles.mapOverlay} />
            </View>

            {/* Content */}
            <View style={styles.content}>
                {/* Badges */}
                <View style={styles.badgeRow}>
                    <View style={[styles.categoryBadge, { backgroundColor: categoryColor }]}>
                        <Ionicons
                            name={CATEGORY_ICONS[project.category] as any}
                            size={13}
                            color={Colors.white}
                        />
                        <Text style={styles.badgeText}>
                            {project.category.toUpperCase()}
                        </Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: `${statusColor}20` }]}>
                        <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
                        <Text style={[styles.statusBadgeText, { color: statusColor }]}>
                            {project.status.replace('-', ' ').toUpperCase()}
                        </Text>
                    </View>
                </View>

                {/* Title */}
                <Text style={styles.title}>{project.name}</Text>

                {/* Campaign Quote */}
                <View style={styles.quoteCard}>
                    <View style={styles.quoteLine} />
                    <Text style={styles.quoteText}>"{project.campaign.text}"</Text>
                </View>

                {/* Progress Bar */}
                <View style={styles.progressSection}>
                    <View style={styles.progressHeader}>
                        <Text style={styles.progressLabel}>Completion</Text>
                        <Text style={[styles.progressValue, { color: statusColor }]}>
                            {project.impactMetrics.completionPercentage}%
                        </Text>
                    </View>
                    <View style={styles.progressBarBg}>
                        <Animated.View
                            style={[
                                styles.progressBarFill,
                                {
                                    width: `${project.impactMetrics.completionPercentage}%`,
                                    backgroundColor: statusColor,
                                },
                            ]}
                        />
                    </View>
                </View>

                {/* Impact Metrics */}
                <Text style={styles.sectionTitle}>Impact Metrics</Text>
                <View style={styles.metricsGrid}>
                    <View style={styles.metricCard}>
                        <Ionicons name="people" size={22} color={Colors.primary} />
                        <Text style={styles.metricValue}>
                            {formatNumber(project.impactMetrics.beneficiaries)}
                        </Text>
                        <Text style={styles.metricLabel}>Beneficiaries</Text>
                    </View>
                    <View style={styles.metricCard}>
                        <Ionicons name="wallet" size={22} color={Colors.success} />
                        <Text style={styles.metricValue}>{project.impactMetrics.budget}</Text>
                        <Text style={styles.metricLabel}>Budget</Text>
                    </View>
                    <View style={styles.metricCard}>
                        <Ionicons name="star" size={22} color={Colors.warning} />
                        <Text style={styles.metricValue}>
                            {project.rating.toFixed(1)}
                        </Text>
                        <Text style={styles.metricLabel}>
                            {project.totalRatings.toLocaleString()} ratings
                        </Text>
                    </View>
                    <View style={styles.metricCard}>
                        <Ionicons name="calendar" size={22} color={Colors.accent} />
                        <Text style={styles.metricValue}>
                            {new Date(project.impactMetrics.expectedCompletion).toLocaleDateString(
                                'en-IN',
                                { month: 'short', year: 'numeric' }
                            )}
                        </Text>
                        <Text style={styles.metricLabel}>Target Date</Text>
                    </View>
                </View>

                {/* Description */}
                <Text style={styles.sectionTitle}>About This Project</Text>
                <Text style={styles.description}>{project.description}</Text>

                {/* Timeline */}
                <Text style={styles.sectionTitle}>Timeline</Text>
                <View style={styles.timelineCard}>
                    <View style={styles.timelineRow}>
                        <View style={[styles.timelineDot, { backgroundColor: Colors.success }]} />
                        <View style={styles.timelineContent}>
                            <Text style={styles.timelineLabel}>Started</Text>
                            <Text style={styles.timelineDate}>
                                {new Date(project.impactMetrics.startDate).toLocaleDateString('en-IN', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                })}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.timelineConnector} />
                    <View style={styles.timelineRow}>
                        <View
                            style={[
                                styles.timelineDot,
                                {
                                    backgroundColor:
                                        project.status === 'completed' ? Colors.success : Colors.primary,
                                },
                            ]}
                        />
                        <View style={styles.timelineContent}>
                            <Text style={styles.timelineLabel}>
                                {project.status === 'completed' ? 'Completed' : 'Expected Completion'}
                            </Text>
                            <Text style={styles.timelineDate}>
                                {new Date(
                                    project.impactMetrics.expectedCompletion
                                ).toLocaleDateString('en-IN', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                })}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Leadership */}
                <Text style={styles.sectionTitle}>Leadership</Text>
                <View style={styles.leaderCard}>
                    <View style={styles.leaderAvatar}>
                        <Ionicons name="person" size={24} color={Colors.primary} />
                    </View>
                    <View>
                        <Text style={styles.leaderName}>{project.leadership.name}</Text>
                        <Text style={styles.leaderTitle}>{project.leadership.title}</Text>
                    </View>
                </View>

                {/* Feedback Button */}
                <TouchableOpacity
                    style={styles.feedbackBtn}
                    onPress={() => setShowFeedback(!showFeedback)}
                    activeOpacity={0.8}
                >
                    <Ionicons name="chatbubble-ellipses" size={20} color={Colors.background} />
                    <Text style={styles.feedbackBtnText}>Share Your Feedback</Text>
                </TouchableOpacity>

                {/* Feedback Form */}
                {showFeedback && (
                    <View style={styles.feedbackCard}>
                        {feedbackSent ? (
                            <View style={styles.feedbackSuccess}>
                                <Ionicons name="checkmark-circle" size={48} color={Colors.success} />
                                <Text style={styles.feedbackSuccessText}>Thank you for your feedback!</Text>
                            </View>
                        ) : (
                            <>
                                <Text style={styles.feedbackTitle}>Rate this project</Text>
                                <View style={styles.starRow}>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <TouchableOpacity key={star} onPress={() => setRating(star)}>
                                            <Ionicons
                                                name={star <= rating ? 'star' : 'star-outline'}
                                                size={36}
                                                color={star <= rating ? Colors.warning : Colors.textMuted}
                                            />
                                        </TouchableOpacity>
                                    ))}
                                </View>
                                <TextInput
                                    style={styles.commentInput}
                                    placeholder="Add a comment (optional)"
                                    placeholderTextColor={Colors.textMuted}
                                    value={comment}
                                    onChangeText={setComment}
                                    multiline
                                    numberOfLines={3}
                                />
                                <TouchableOpacity
                                    style={[
                                        styles.submitBtn,
                                        rating === 0 && styles.submitBtnDisabled,
                                    ]}
                                    onPress={handleSubmitFeedback}
                                    disabled={rating === 0}
                                >
                                    <Text style={styles.submitBtnText}>Submit</Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                )}

                <View style={{ height: 100 }} />
            </View>
        </ScrollView>
    );
}

const darkMapStyle = [
    { elementType: 'geometry', stylers: [{ color: '#1d2c4d' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#8ec3b9' }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: '#1a3646' }] },
    { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#304a7d' }] },
    { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0e1626' }] },
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
        fontSize: FontSizes.md,
    },
    mapContainer: {
        height: 250,
        position: 'relative',
    },
    headerMap: {
        ...StyleSheet.absoluteFillObject,
    },
    mapOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 60,
        backgroundColor: Colors.background,
        borderTopLeftRadius: BorderRadius.xl,
        borderTopRightRadius: BorderRadius.xl,
    },
    marker: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: Colors.white,
    },
    content: {
        paddingHorizontal: Spacing.lg,
        marginTop: -20,
    },
    badgeRow: {
        flexDirection: 'row',
        gap: Spacing.sm,
        marginBottom: Spacing.sm,
    },
    categoryBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.sm + 2,
        paddingVertical: 4,
        borderRadius: BorderRadius.sm,
        gap: 4,
    },
    badgeText: {
        color: Colors.white,
        fontSize: FontSizes.xs,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.sm + 2,
        paddingVertical: 4,
        borderRadius: BorderRadius.sm,
        gap: 6,
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    statusBadgeText: {
        fontSize: FontSizes.xs,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    title: {
        fontSize: FontSizes.xxl,
        fontWeight: '800',
        color: Colors.text,
        marginBottom: Spacing.md,
        lineHeight: 34,
    },
    quoteCard: {
        flexDirection: 'row',
        backgroundColor: Colors.surface,
        borderRadius: BorderRadius.md,
        padding: Spacing.md,
        marginBottom: Spacing.lg,
        gap: Spacing.sm,
    },
    quoteLine: {
        width: 3,
        backgroundColor: Colors.primary,
        borderRadius: 2,
    },
    quoteText: {
        color: Colors.textSecondary,
        fontSize: FontSizes.md,
        fontStyle: 'italic',
        lineHeight: 22,
        flex: 1,
    },
    progressSection: {
        marginBottom: Spacing.lg,
    },
    progressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: Spacing.sm,
    },
    progressLabel: {
        color: Colors.textSecondary,
        fontSize: FontSizes.sm,
        fontWeight: '600',
    },
    progressValue: {
        fontSize: FontSizes.sm,
        fontWeight: '800',
    },
    progressBarBg: {
        height: 8,
        backgroundColor: Colors.surfaceLight,
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 4,
    },
    sectionTitle: {
        fontSize: FontSizes.sm,
        fontWeight: '700',
        color: Colors.textMuted,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: Spacing.sm,
        marginTop: Spacing.sm,
    },
    metricsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.sm,
        marginBottom: Spacing.md,
    },
    metricCard: {
        width: (width - Spacing.lg * 2 - Spacing.sm) / 2,
        backgroundColor: Colors.surface,
        borderRadius: BorderRadius.md,
        padding: Spacing.md,
        alignItems: 'center',
        gap: 6,
        ...Shadows.small,
    },
    metricValue: {
        color: Colors.text,
        fontSize: FontSizes.lg,
        fontWeight: '800',
    },
    metricLabel: {
        color: Colors.textSecondary,
        fontSize: FontSizes.xs,
    },
    description: {
        color: Colors.textSecondary,
        fontSize: FontSizes.md,
        lineHeight: 24,
        marginBottom: Spacing.md,
    },
    timelineCard: {
        backgroundColor: Colors.surface,
        borderRadius: BorderRadius.md,
        padding: Spacing.md,
        marginBottom: Spacing.md,
    },
    timelineRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
    },
    timelineDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    timelineConnector: {
        width: 2,
        height: 24,
        backgroundColor: Colors.border,
        marginLeft: 5,
    },
    timelineContent: {},
    timelineLabel: {
        color: Colors.textMuted,
        fontSize: FontSizes.xs,
        textTransform: 'uppercase',
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    timelineDate: {
        color: Colors.text,
        fontSize: FontSizes.md,
        fontWeight: '600',
    },
    leaderCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.surface,
        borderRadius: BorderRadius.md,
        padding: Spacing.md,
        gap: Spacing.sm,
        marginBottom: Spacing.lg,
    },
    leaderAvatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: `${Colors.primary}15`,
        justifyContent: 'center',
        alignItems: 'center',
    },
    leaderName: {
        color: Colors.text,
        fontSize: FontSizes.md,
        fontWeight: '700',
    },
    leaderTitle: {
        color: Colors.textSecondary,
        fontSize: FontSizes.sm,
        marginTop: 2,
    },
    feedbackBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.primary,
        borderRadius: BorderRadius.lg,
        paddingVertical: Spacing.md,
        gap: Spacing.sm,
        ...Shadows.medium,
    },
    feedbackBtnText: {
        color: Colors.background,
        fontSize: FontSizes.md,
        fontWeight: '700',
    },
    feedbackCard: {
        backgroundColor: Colors.surface,
        borderRadius: BorderRadius.lg,
        padding: Spacing.lg,
        marginTop: Spacing.md,
        ...Shadows.small,
    },
    feedbackTitle: {
        color: Colors.text,
        fontSize: FontSizes.lg,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: Spacing.md,
    },
    starRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: Spacing.sm,
        marginBottom: Spacing.md,
    },
    commentInput: {
        backgroundColor: Colors.surfaceLight,
        borderRadius: BorderRadius.md,
        padding: Spacing.md,
        color: Colors.text,
        fontSize: FontSizes.md,
        minHeight: 80,
        textAlignVertical: 'top',
        marginBottom: Spacing.md,
    },
    submitBtn: {
        backgroundColor: Colors.primary,
        borderRadius: BorderRadius.md,
        paddingVertical: Spacing.sm + 4,
        alignItems: 'center',
    },
    submitBtnDisabled: {
        opacity: 0.4,
    },
    submitBtnText: {
        color: Colors.background,
        fontSize: FontSizes.md,
        fontWeight: '700',
    },
    feedbackSuccess: {
        alignItems: 'center',
        paddingVertical: Spacing.lg,
        gap: Spacing.sm,
    },
    feedbackSuccessText: {
        color: Colors.success,
        fontSize: FontSizes.lg,
        fontWeight: '600',
    },
});
