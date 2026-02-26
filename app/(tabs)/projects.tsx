// ========================================
// GeoAdTech — Projects List (Stitch Style)
// ========================================
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

import { CATEGORY_ICONS } from '@/constants/mockData';
import { Colors, Shadows } from '@/constants/theme';
import { getNearbyProjects } from '@/services/api';
import { Project } from '@/types';

export default function ProjectsScreen() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const data = await getNearbyProjects(28.6139, 77.2090);
            setProjects(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const renderProject = ({ item }: { item: Project }) => {
        const categoryColor = Colors.categories[item.category] || Colors.textSecondary;

        return (
            <TouchableOpacity
                style={styles.card}
                onPress={() => router.push(`/project/${item._id}`)}
                activeOpacity={0.8}
            >
                <View style={[styles.statusBadge, { backgroundColor: item.status === 'completed' ? Colors.success : Colors.accent }]}>
                    <Text style={styles.statusText}>{item.status.replace('-', ' ').toUpperCase()}</Text>
                </View>

                <View style={styles.cardTop}>
                    <View style={[styles.iconBox, { backgroundColor: `${categoryColor}15` }]}>
                        <Ionicons name={CATEGORY_ICONS[item.category] as any} size={24} color={categoryColor} />
                    </View>
                    <View style={styles.titleCol}>
                        <Text style={styles.projectName}>{item.name}</Text>
                        <Text style={styles.projectCategory}>{item.category.charAt(0).toUpperCase() + item.category.slice(1)} • New Delhi</Text>
                    </View>
                </View>

                <Text style={styles.description} numberOfLines={2}>{item.shortDescription}</Text>

                <View style={styles.footer}>
                    <View style={styles.progressRow}>
                        <View style={styles.progressBar}>
                            <View style={[styles.progressFill, { width: `${item.impactMetrics.completionPercentage}%`, backgroundColor: Colors.primary }]} />
                        </View>
                        <Text style={styles.progressVal}>{item.impactMetrics.completionPercentage}%</Text>
                    </View>
                    <TouchableOpacity style={styles.arrowBtn}>
                        <Ionicons name="arrow-forward" size={18} color={Colors.white} />
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        );
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerSubtitle}>Public Assets</Text>
                <Text style={styles.headerTitle}>Projects Overview</Text>
            </View>

            <FlatList
                data={projects}
                renderItem={renderProject}
                keyExtractor={item => item._id}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { paddingTop: 60, paddingHorizontal: 25, paddingBottom: 20, backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.border },
    headerSubtitle: { fontSize: 10, color: Colors.primary, fontWeight: '800', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 },
    headerTitle: { fontSize: 24, fontWeight: '900', color: Colors.text },
    list: { padding: 20, paddingBottom: 100 },
    card: { backgroundColor: Colors.white, borderRadius: 20, padding: 20, marginBottom: 20, ...Shadows.small, position: 'relative' },
    statusBadge: { position: 'absolute', top: 20, right: 20, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, zIndex: 10 },
    statusText: { color: Colors.white, fontSize: 8, fontWeight: '900' },
    cardTop: { flexDirection: 'row', gap: 15, alignItems: 'center', marginBottom: 15 },
    iconBox: { width: 48, height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
    titleCol: { flex: 1, paddingRight: 60 },
    projectName: { fontSize: 16, fontWeight: '800', color: Colors.text, marginBottom: 2 },
    projectCategory: { fontSize: 12, color: Colors.textSecondary, fontWeight: '500' },
    description: { color: Colors.textSecondary, fontSize: 13, lineHeight: 18, marginBottom: 20 },
    footer: { flexDirection: 'row', alignItems: 'center', gap: 15 },
    progressRow: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 },
    progressBar: { flex: 1, height: 6, backgroundColor: Colors.surfaceLight, borderRadius: 3, overflow: 'hidden' },
    progressFill: { height: '100%', borderRadius: 3 },
    progressVal: { fontSize: 12, fontWeight: '800', color: Colors.primary },
    arrowBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center' }
});
