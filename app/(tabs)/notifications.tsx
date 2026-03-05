// ========================================
// GeoAdTech — Notifications Screen (Fully Functional)
// ========================================
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MOCK_NOTIFICATIONS } from '@/constants/mockData';
import { Colors, Shadows } from '@/constants/theme';
import { getNotificationHistory } from '@/services/api';
import { NotificationItem } from '@/types';

const ICON_MAP: Record<string, string> = {
    metro: 'train',
    hospital: 'medical',
    bridge: 'git-network',
    road: 'car',
    college: 'school',
    government: 'business',
    other: 'notifications',
};

const COLOR_MAP: Record<string, string> = {
    metro: '#26C6DA',
    hospital: '#EF5350',
    bridge: '#FFA726',
    road: '#66BB6A',
    college: '#AB47BC',
    government: '#5C6BC0',
    other: Colors.primary,
};

const formatRelativeTime = (ts: string) => {
    const diff = Date.now() - new Date(ts).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
};

export default function NotificationsScreen() {
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [filter, setFilter] = useState<'all' | 'unread'>('all');

    useEffect(() => { fetchNotifications(); }, []);

    const fetchNotifications = async () => {
        try {
            const data = await getNotificationHistory('user_123');
            setNotifications(data.length > 0 ? data : MOCK_NOTIFICATIONS);
        } catch {
            setNotifications(MOCK_NOTIFICATIONS);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchNotifications();
        setRefreshing(false);
    };

    const markAsRead = (id: string) => {
        setNotifications(prev => prev.map(n =>
            (n.id === id || (n as any)._id === id) ? { ...n, read: true } : n
        ));
    };

    const markAllRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const displayed = filter === 'unread'
        ? notifications.filter(n => !n.read)
        : notifications;

    const unreadCount = notifications.filter(n => !n.read).length;

    const renderItem = ({ item }: { item: NotificationItem }) => {
        const color = COLOR_MAP[item.category] || Colors.primary;
        const icon = ICON_MAP[item.category] || 'notifications';
        const itemId = item.id || (item as any)._id;

        return (
            <TouchableOpacity
                style={[styles.card, !item.read && styles.unreadCard, !item.read && { borderLeftColor: color }]}
                onPress={() => {
                    markAsRead(itemId);
                    router.push(`/project/${item.projectId}` as any);
                }}
                activeOpacity={0.85}
            >
                <View style={[styles.iconBox, { backgroundColor: `${color}15` }]}>
                    <Ionicons name={icon as any} size={22} color={color} />
                </View>
                <View style={styles.cardContent}>
                    <View style={styles.cardTopRow}>
                        <View style={[styles.catPill, { backgroundColor: `${color}15` }]}>
                            <Text style={[styles.catText, { color }]}>{item.category.toUpperCase()}</Text>
                        </View>
                        <View style={styles.cardRight}>
                            <Text style={styles.timeStr}>{formatRelativeTime(item.timestamp)}</Text>
                            {!item.read && <View style={styles.unreadDot} />}
                        </View>
                    </View>
                    <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
                    <Text style={styles.cardBody} numberOfLines={2}>{item.body}</Text>
                    <View style={styles.projectTag}>
                        <Ionicons name="location-outline" size={11} color={Colors.primary} />
                        <Text style={styles.projectTagText} numberOfLines={1}>{item.projectName}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerSub}>CIVIC ALERTS</Text>
                    <Text style={styles.headerTitle}>Notifications</Text>
                </View>
                {unreadCount > 0 && (
                    <TouchableOpacity style={styles.markAllBtn} onPress={markAllRead}>
                        <Text style={styles.markAllText}>Mark all read</Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* Filter */}
            <View style={styles.filterBar}>
                <TouchableOpacity
                    style={[styles.filterChip, filter === 'all' && styles.filterChipActive]}
                    onPress={() => setFilter('all')}
                >
                    <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>All ({notifications.length})</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.filterChip, filter === 'unread' && styles.filterChipActive]}
                    onPress={() => setFilter('unread')}
                >
                    <Text style={[styles.filterText, filter === 'unread' && styles.filterChipActive]}>
                        Unread {unreadCount > 0 ? `(${unreadCount})` : ''}
                    </Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={displayed}
                keyExtractor={(item) => item.id || (item as any)._id}
                renderItem={renderItem}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
                ListEmptyComponent={() => (
                    <View style={styles.empty}>
                        <View style={styles.emptyIcon}>
                            <Ionicons name="notifications-off-outline" size={48} color={Colors.border} />
                        </View>
                        <Text style={styles.emptyTitle}>{filter === 'unread' ? 'All caught up!' : 'No alerts yet'}</Text>
                        <Text style={styles.emptyBody}>
                            {filter === 'unread'
                                ? 'You have no unread notifications.'
                                : 'Travel near public works sites to receive geo-fence alerts.'}
                        </Text>
                    </View>
                )}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14, backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.border },
    headerSub: { fontSize: 10, color: Colors.primary, fontWeight: '800', letterSpacing: 2 },
    headerTitle: { fontSize: 24, fontWeight: '900', color: Colors.text, marginTop: 2 },
    markAllBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: Colors.primary },
    markAllText: { fontSize: 12, fontWeight: '700', color: Colors.primary },

    filterBar: { flexDirection: 'row', gap: 10, paddingHorizontal: 16, paddingVertical: 12, backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.border },
    filterChip: { paddingHorizontal: 18, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: Colors.border },
    filterChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
    filterText: { fontSize: 12, fontWeight: '700', color: Colors.textSecondary },
    filterTextActive: { color: Colors.white },

    list: { padding: 16, paddingBottom: 100 },
    card: { flexDirection: 'row', backgroundColor: Colors.white, borderRadius: 20, padding: 16, marginBottom: 12, gap: 14, ...Shadows.small, borderLeftWidth: 3, borderLeftColor: 'transparent' },
    unreadCard: { borderLeftWidth: 4 },
    iconBox: { width: 46, height: 46, borderRadius: 14, justifyContent: 'center', alignItems: 'center', flexShrink: 0 },
    cardContent: { flex: 1 },
    cardTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
    catPill: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
    catText: { fontSize: 9, fontWeight: '900', letterSpacing: 0.5 },
    cardRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    timeStr: { fontSize: 11, color: Colors.textMuted, fontWeight: '600' },
    unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.primary },
    cardTitle: { fontSize: 15, fontWeight: '800', color: Colors.text, marginBottom: 4 },
    cardBody: { fontSize: 13, color: Colors.textSecondary, lineHeight: 18, marginBottom: 10 },
    projectTag: { flexDirection: 'row', alignItems: 'center', gap: 5 },
    projectTagText: { fontSize: 11, fontWeight: '700', color: Colors.primary, flex: 1 },

    empty: { alignItems: 'center', paddingTop: 70, paddingHorizontal: 30, gap: 14 },
    emptyIcon: { width: 80, height: 80, borderRadius: 40, backgroundColor: Colors.background, justifyContent: 'center', alignItems: 'center' },
    emptyTitle: { fontSize: 18, fontWeight: '800', color: Colors.text },
    emptyBody: { textAlign: 'center', color: Colors.textSecondary, fontSize: 14, lineHeight: 22 },
});
