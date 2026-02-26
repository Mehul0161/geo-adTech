// ========================================
// GeoAdTech — Notifications Screen (Stitch Style)
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

import { CATEGORY_ICONS } from '@/constants/mockData';
import { Colors, Shadows } from '@/constants/theme';
import { getNotificationHistory } from '@/services/api';
import { NotificationItem } from '@/types';

export default function NotificationsScreen() {
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const data = await getNotificationHistory('user_123');
            setNotifications(data);
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchNotifications();
        setRefreshing(false);
    };

    const markAsRead = (id: string | number) => {
        setNotifications((prev) =>
            prev.map((n) => (n.id === id || (n as any)._id === id ? { ...n, read: true } : n))
        );
    };

    const formatTime = (timestamp: string) => {
        const date = new Date(timestamp);
        const hrs = date.getHours();
        const mins = date.getMinutes().toString().padStart(2, '0');
        return `${hrs}:${mins}`;
    };

    const renderNotification = ({ item }: { item: NotificationItem }) => {
        const categoryColor = Colors.categories[item.category] || Colors.textSecondary;
        const itemId = item.id || (item as any)._id;

        return (
            <TouchableOpacity
                style={[styles.card, !item.read && styles.unreadCard]}
                onPress={() => {
                    markAsRead(itemId);
                    router.push(`/project/${item.projectId}`);
                }}
                activeOpacity={0.7}
            >
                <View style={[styles.iconBox, { backgroundColor: `${categoryColor}15` }]}>
                    <Ionicons name={CATEGORY_ICONS[item.category] as any} size={20} color={categoryColor} />
                </View>
                <View style={styles.content}>
                    <View style={styles.headerRow}>
                        <Text style={styles.time}>{formatTime(item.timestamp)}</Text>
                        {!item.read && <View style={styles.dot} />}
                    </View>
                    <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
                    <Text style={styles.body} numberOfLines={2}>{item.body}</Text>
                    <View style={styles.tag}>
                        <Ionicons name="business" size={10} color={Colors.primary} />
                        <Text style={styles.tagName}>{item.projectName}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerSubtitle}>Civic Alerts</Text>
                <Text style={styles.headerTitle}>History</Text>
            </View>

            <FlatList
                data={notifications}
                keyExtractor={(item) => item.id || (item as any)._id}
                renderItem={renderNotification}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={() => (
                    <View style={styles.empty}>
                        <Ionicons name="notifications-off-outline" size={48} color={Colors.border} />
                        <Text style={styles.emptyText}>No alerts yet. Travel to geo-fenced zones to see updates.</Text>
                    </View>
                )}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    header: { paddingTop: 70, paddingHorizontal: 25, paddingBottom: 25, backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.border },
    headerSubtitle: { fontSize: 10, color: Colors.primary, fontWeight: '800', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 },
    headerTitle: { fontSize: 26, fontWeight: '900', color: Colors.text },
    list: { padding: 20, paddingBottom: 100 },
    card: { flexDirection: 'row', backgroundColor: Colors.white, borderRadius: 20, padding: 20, marginBottom: 15, gap: 15, ...Shadows.small },
    unreadCard: { borderLeftWidth: 4, borderLeftColor: Colors.primary },
    iconBox: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
    content: { flex: 1 },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
    time: { fontSize: 11, color: Colors.textMuted, fontWeight: '700' },
    dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.primary },
    title: { fontSize: 16, fontWeight: '800', color: Colors.text, marginBottom: 4 },
    body: { fontSize: 13, color: Colors.textSecondary, lineHeight: 18, marginBottom: 12 },
    tag: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.primaryLight, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, gap: 6 },
    tagName: { fontSize: 10, fontWeight: '800', color: Colors.primary },
    empty: { alignItems: 'center', marginTop: 100, paddingHorizontal: 40 },
    emptyText: { marginTop: 20, textAlign: 'center', color: Colors.textMuted, fontSize: 14, lineHeight: 22 }
});
