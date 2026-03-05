// ========================================
// GeoAdTech — Projects List (Premium)
// ========================================
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    Image,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MOCK_PROJECTS } from '@/constants/mockData';
import { Colors, Shadows, StatusColors } from '@/constants/theme';
import { getNearbyProjects } from '@/services/api';
import { Project } from '@/types';

const { width } = Dimensions.get('window');

const PROJECT_IMAGES: Record<string, string> = {
    metro: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?q=80&w=800',
    hospital: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=800',
    bridge: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=800',
    road: 'https://images.unsplash.com/photo-1541888946425-d81bb19480c5?q=80&w=800',
    college: 'https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=800',
    government: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?q=80&w=800',
    other: 'https://images.unsplash.com/photo-1590066839089-6d63430030da?q=80&w=800',
};

const FILTERS = [
    { label: 'All', icon: 'grid-outline' },
    { label: 'In Progress', icon: 'time-outline' },
    { label: 'Completed', icon: 'checkmark-done-outline' },
    { label: 'Planned', icon: 'calendar-outline' },
];

export default function ProjectsScreen() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [filtered, setFiltered] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [activeFilter, setActiveFilter] = useState('All');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const data = await getNearbyProjects(28.6139, 77.2090);
            const result = data.length > 0 ? data : MOCK_PROJECTS;
            setProjects(result);
            applyCurrentFilter(result, activeFilter);
        } catch (e) {
            setProjects(MOCK_PROJECTS);
            applyCurrentFilter(MOCK_PROJECTS, activeFilter);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const applyCurrentFilter = (allProjects: Project[], filter: string) => {
        if (filter === 'All') {
            setFiltered(allProjects);
        } else {
            const map: Record<string, string> = {
                'In Progress': 'in-progress',
                'Completed': 'completed',
                'Planned': 'planned',
            };
            setFiltered(allProjects.filter(p => p.status === map[filter]));
        }
    };

    const onRefresh = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setRefreshing(true);
        fetchData();
    };

    const handleFilterPress = (filter: string) => {
        Haptics.selectionAsync();
        setActiveFilter(filter);
        applyCurrentFilter(projects, filter);
    };

    const renderProject = ({ item }: { item: Project }) => {
        const statusColor = StatusColors[item.status] || Colors.textSecondary;
        const imgUri = item.images[0] || PROJECT_IMAGES[item.category] || PROJECT_IMAGES.other;

        return (
            <TouchableOpacity
                style={styles.card}
                onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    router.push(`/project/${item._id}` as any);
                }}
                activeOpacity={0.9}
            >
                <View style={styles.cardTop}>
                    <Image source={{ uri: imgUri }} style={styles.cardImg} />
                    <LinearGradient colors={['rgba(0,0,0,0.4)', 'transparent']} style={styles.cardImageOverlay} />
                    <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
                        <Text style={styles.statusText}>{item.status.replace('-', ' ').toUpperCase()}</Text>
                    </View>
                </View>

                <View style={styles.cardInfo}>
                    <View style={styles.titleLine}>
                        <Text style={styles.projectName} numberOfLines={1}>{item.name}</Text>
                        <View style={[styles.pctTag, { backgroundColor: `${statusColor}15` }]}>
                            <Text style={[styles.pctText, { color: statusColor }]}>{item.impactMetrics.completionPercentage}%</Text>
                        </View>
                    </View>

                    <Text style={styles.shortDesc} numberOfLines={2}>{item.shortDescription}</Text>

                    <View style={styles.progressBarBg}>
                        <LinearGradient
                            colors={[statusColor, `${statusColor}88`]}
                            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                            style={[styles.progressBarFill, { width: `${item.impactMetrics.completionPercentage}%` }]}
                        />
                    </View>

                    <View style={styles.cardFooter}>
                        <View style={styles.metaRow}>
                            <Ionicons name="people" size={12} color={Colors.textSecondary} />
                            <Text style={styles.metaText}>{item.impactMetrics.beneficiaries.toLocaleString()}</Text>
                        </View>
                        <View style={styles.metaRow}>
                            <Ionicons name="leaf" size={12} color={Colors.textSecondary} />
                            <Text style={styles.metaText}>{item.category.toUpperCase()}</Text>
                        </View>
                        <View style={[styles.metaRow, { marginLeft: 'auto' }]}>
                            <Text style={styles.detailsTag}>DETAILS</Text>
                            <Ionicons name="chevron-forward" size={14} color={Colors.primary} />
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerLabel}>CITIZEN LEDGER</Text>
                    <Text style={styles.headerTitle}>Public Works</Text>
                </View>
                <View style={styles.statChip}>
                    <Text style={styles.statLabel}>SYNCED</Text>
                    <View style={styles.liveDot} />
                </View>
            </View>

            {/* Filter Hub */}
            <View style={styles.filterSection}>
                <FlatList
                    horizontal
                    data={FILTERS}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filterList}
                    keyExtractor={item => item.label}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={[styles.filterChip, activeFilter === item.label && styles.filterChipActive]}
                            onPress={() => handleFilterPress(item.label)}
                        >
                            <Ionicons
                                name={item.icon as any}
                                size={14}
                                color={activeFilter === item.label ? Colors.white : Colors.primary}
                            />
                            <Text style={[styles.filterText, activeFilter === item.label && styles.filterTextActive]}>
                                {item.label}
                            </Text>
                        </TouchableOpacity>
                    )}
                />
            </View>

            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                    <Text style={styles.loadingText}>Fetching decentralized works data...</Text>
                </View>
            ) : (
                <FlatList
                    data={filtered}
                    renderItem={renderProject}
                    keyExtractor={item => item._id}
                    contentContainerStyle={styles.list}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            tintColor={Colors.primary}
                        />
                    }
                    ListEmptyComponent={() => (
                        <View style={styles.empty}>
                            <Ionicons name="search-outline" size={48} color={Colors.border} />
                            <Text style={styles.emptyText}>No filtered projects found in this sector.</Text>
                        </View>
                    )}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAFC' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 16 },
    loadingText: { fontSize: 13, fontWeight: '800', color: Colors.textMuted, letterSpacing: 1 },

    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16, backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
    headerLabel: { fontSize: 10, fontWeight: '900', color: Colors.primary, letterSpacing: 2 },
    headerTitle: { fontSize: 24, fontWeight: '900', color: Colors.text, marginTop: 2 },
    statChip: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#F1F5F9', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
    statLabel: { fontSize: 9, fontWeight: '900', color: '#64748B', letterSpacing: 1 },
    liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.success },

    filterSection: { backgroundColor: Colors.white, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
    filterList: { paddingHorizontal: 20, gap: 10 },
    filterChip: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 14, gap: 8, borderWidth: 1, borderColor: '#F1F5F9' },
    filterChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary, ...Shadows.small },
    filterText: { fontSize: 12, fontWeight: '800', color: Colors.textSecondary },
    filterTextActive: { color: Colors.white },

    list: { padding: 20, paddingBottom: 100 },
    card: { backgroundColor: Colors.white, borderRadius: 24, marginBottom: 20, overflow: 'hidden', ...Shadows.medium, borderBottomWidth: 4, borderBottomColor: '#F1F5F9' },
    cardTop: { height: 160, position: 'relative' },
    cardImg: { width: '100%', height: '100%' },
    cardImageOverlay: { ...StyleSheet.absoluteFillObject },
    statusBadge: { position: 'absolute', top: 12, right: 12, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
    statusText: { color: Colors.white, fontSize: 9, fontWeight: '900', letterSpacing: 1 },

    cardInfo: { padding: 18 },
    titleLine: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    projectName: { fontSize: 18, fontWeight: '900', color: Colors.text, flex: 1, marginRight: 10 },
    pctTag: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
    pctText: { fontSize: 12, fontWeight: '900' },
    shortDesc: { fontSize: 13, color: Colors.textSecondary, lineHeight: 20, marginBottom: 16, fontWeight: '500' },

    progressBarBg: { height: 5, backgroundColor: '#F1F5F9', borderRadius: 3, marginBottom: 16, overflow: 'hidden' },
    progressBarFill: { height: '100%', borderRadius: 3 },

    cardFooter: { flexDirection: 'row', alignItems: 'center', gap: 14 },
    metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    metaText: { fontSize: 11, color: Colors.textMuted, fontWeight: '700' },
    detailsTag: { fontSize: 10, fontWeight: '900', color: Colors.primary, letterSpacing: 1 },

    empty: { flex: 1, alignItems: 'center', paddingVertical: 100, gap: 12 },
    emptyText: { fontSize: 14, color: Colors.textMuted, fontWeight: '700' },
});
