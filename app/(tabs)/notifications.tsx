// ========================================
// GeoAdTech — Notifications Screen
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

import { CATEGORY_ICONS, MOCK_NOTIFICATIONS } from '@/constants/mockData';
import { BorderRadius, Colors, FontSizes, Shadows, Spacing } from '@/constants/theme';
import { NotificationItem } from '@/types';

export default function NotificationsScreen() {
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        setNotifications(MOCK_NOTIFICATIONS);
    }, []);

    const onRefresh = async () => {
        setRefreshing(true);
        // Simulate API call
        await new Promise((r) => setTimeout(r, 800));
        setNotifications(MOCK_NOTIFICATIONS);
        setRefreshing(false);
    };

    const markAsRead = (id: string) => {
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        );
    };

    const formatTime = (timestamp: string) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffHrs / 24);

        if (diffHrs < 1) return 'Just now';
        if (diffHrs < 24) return `${diffHrs}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    };

    const unreadCount = notifications.filter((n) => !n.read).length;

    const renderNotification = ({ item }: { item: NotificationItem }) => {
        const categoryColor = Colors.categories[item.category] || Colors.textMuted;

        return (
            <TouchableOpacity
                style={[
                    styles.notifCard,
                    !item.read && styles.unreadCard,
                ]}
                onPress={() => {
                    markAsRead(item.id);
                    router.push(`/project/${item.projectId}`);
                }}
                activeOpacity={0.7}
            >
                <View style={[styles.iconContainer, { backgroundColor: `${categoryColor}20` }]}>
                    <Ionicons
                        name={CATEGORY_ICONS[item.category] as any}
                        size={22}
                        color={categoryColor}
                    />
                </View>
                <View style={styles.notifContent}>
                    <View style={styles.notifHeader}>
                        <Text style={styles.notifTitle} numberOfLines={1}>
                            {item.title}
                        </Text>
                        {!item.read && <View style={styles.unreadDot} />}
                    </View>
                    <Text style={styles.notifBody} numberOfLines={2}>
                        {item.body}
                    </Text>
                    <View style={styles.notifMeta}>
                        <Text style={styles.notifTime}>{formatTime(item.timestamp)}</Text>
                        <Text style={styles.notifProject}>
                            {item.projectName.length > 25
                                ? item.projectName.substring(0, 25) + '...'
                                : item.projectName}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    const renderEmptyState = () => (
        <View style={styles.emptyContainer}>
            <View style={styles.emptyIconContainer}>
                <Ionicons name="notifications-off-outline" size={64} color={Colors.textMuted} />
            </View>
            <Text style={styles.emptyTitle}>No Notifications Yet</Text>
            <Text style={styles.emptySubtitle}>
                When you enter a geo-fenced area near a development project, you'll receive alerts here.
            </Text>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Alerts</Text>
                {unreadCount > 0 && (
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>{unreadCount}</Text>
                    </View>
                )}
            </View>

            {/* Notification List */}
            <FlatList
                data={notifications}
                keyExtractor={(item) => item.id}
                renderItem={renderNotification}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={renderEmptyState}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={Colors.primary}
                        colors={[Colors.primary]}
                    />
                }
                ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.lg,
        paddingTop: 60,
        paddingBottom: Spacing.md,
        gap: Spacing.sm,
    },
    headerTitle: {
        fontSize: FontSizes.xxl,
        fontWeight: '800',
        color: Colors.text,
    },
    badge: {
        backgroundColor: Colors.error,
        borderRadius: BorderRadius.full,
        minWidth: 22,
        height: 22,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 6,
    },
    badgeText: {
        color: Colors.white,
        fontSize: FontSizes.xs,
        fontWeight: '700',
    },
    listContent: {
        paddingHorizontal: Spacing.md,
        paddingBottom: 100,
    },
    notifCard: {
        flexDirection: 'row',
        backgroundColor: Colors.surface,
        borderRadius: BorderRadius.md,
        padding: Spacing.md,
        gap: Spacing.sm,
        ...Shadows.small,
    },
    unreadCard: {
        borderLeftWidth: 3,
        borderLeftColor: Colors.primary,
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },
    notifContent: {
        flex: 1,
    },
    notifHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
        marginBottom: 4,
    },
    notifTitle: {
        color: Colors.text,
        fontSize: FontSizes.md,
        fontWeight: '700',
        flex: 1,
    },
    unreadDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: Colors.primary,
    },
    notifBody: {
        color: Colors.textSecondary,
        fontSize: FontSizes.sm,
        lineHeight: 19,
        marginBottom: Spacing.xs,
    },
    notifMeta: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    notifTime: {
        color: Colors.textMuted,
        fontSize: FontSizes.xs,
    },
    notifProject: {
        color: Colors.primary,
        fontSize: FontSizes.xs,
        fontWeight: '600',
    },
    separator: {
        height: Spacing.sm,
    },
    emptyContainer: {
        alignItems: 'center',
        paddingTop: 120,
        paddingHorizontal: Spacing.xl,
    },
    emptyIconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: Colors.surface,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: Spacing.lg,
    },
    emptyTitle: {
        fontSize: FontSizes.xl,
        fontWeight: '700',
        color: Colors.text,
        marginBottom: Spacing.sm,
    },
    emptySubtitle: {
        fontSize: FontSizes.md,
        color: Colors.textSecondary,
        textAlign: 'center',
        lineHeight: 22,
    },
});
