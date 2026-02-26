// ========================================
// GeoAdTech — Profile Screen
// ========================================
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { BorderRadius, Colors, FontSizes, Shadows, Spacing } from '@/constants/theme';

export default function ProfileScreen() {
    const [notifEnabled, setNotifEnabled] = React.useState(true);
    const [bgLocation, setBgLocation] = React.useState(true);

    const menuItems = [
        {
            icon: 'language-outline',
            title: 'Language',
            subtitle: 'English',
            action: () => { },
        },
        {
            icon: 'shield-checkmark-outline',
            title: 'Privacy Policy',
            subtitle: 'How we handle your data',
            action: () => { },
        },
        {
            icon: 'help-circle-outline',
            title: 'Help & FAQ',
            subtitle: 'Get answers to common questions',
            action: () => { },
        },
        {
            icon: 'information-circle-outline',
            title: 'About GeoAdTech',
            subtitle: 'Version 1.0.0',
            action: () => { },
        },
    ];

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Profile</Text>
            </View>

            {/* User Card */}
            <View style={styles.userCard}>
                <View style={styles.avatar}>
                    <Ionicons name="person" size={32} color={Colors.primary} />
                </View>
                <View style={styles.userInfo}>
                    <Text style={styles.userName}>Citizen User</Text>
                    <Text style={styles.userEmail}>user@geoadtech.com</Text>
                </View>
                <TouchableOpacity style={styles.editBtn}>
                    <Ionicons name="pencil" size={16} color={Colors.primary} />
                </TouchableOpacity>
            </View>

            {/* Stats */}
            <View style={styles.statsRow}>
                <View style={styles.statItem}>
                    <Text style={styles.statValue}>12</Text>
                    <Text style={styles.statLabel}>Projects Visited</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                    <Text style={styles.statValue}>4</Text>
                    <Text style={styles.statLabel}>Feedback Given</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                    <Text style={styles.statValue}>28</Text>
                    <Text style={styles.statLabel}>Alerts Received</Text>
                </View>
            </View>

            {/* Settings Section */}
            <Text style={styles.sectionTitle}>Preferences</Text>

            <View style={styles.settingsCard}>
                <View style={styles.settingRow}>
                    <View style={styles.settingLeft}>
                        <View style={[styles.settingIcon, { backgroundColor: `${Colors.primary}20` }]}>
                            <Ionicons name="notifications" size={18} color={Colors.primary} />
                        </View>
                        <View>
                            <Text style={styles.settingTitle}>Push Notifications</Text>
                            <Text style={styles.settingSubtitle}>Get alerts for nearby projects</Text>
                        </View>
                    </View>
                    <Switch
                        value={notifEnabled}
                        onValueChange={setNotifEnabled}
                        trackColor={{ false: Colors.surfaceLight, true: `${Colors.primary}50` }}
                        thumbColor={notifEnabled ? Colors.primary : Colors.textMuted}
                    />
                </View>

                <View style={styles.settingDivider} />

                <View style={styles.settingRow}>
                    <View style={styles.settingLeft}>
                        <View style={[styles.settingIcon, { backgroundColor: `${Colors.accent}20` }]}>
                            <Ionicons name="location" size={18} color={Colors.accent} />
                        </View>
                        <View>
                            <Text style={styles.settingTitle}>Background Location</Text>
                            <Text style={styles.settingSubtitle}>Auto-detect geo-fenced areas</Text>
                        </View>
                    </View>
                    <Switch
                        value={bgLocation}
                        onValueChange={setBgLocation}
                        trackColor={{ false: Colors.surfaceLight, true: `${Colors.accent}50` }}
                        thumbColor={bgLocation ? Colors.accent : Colors.textMuted}
                    />
                </View>
            </View>

            {/* Menu Items */}
            <Text style={styles.sectionTitle}>General</Text>

            <View style={styles.menuCard}>
                {menuItems.map((item, index) => (
                    <React.Fragment key={item.title}>
                        <TouchableOpacity
                            style={styles.menuRow}
                            onPress={item.action}
                            activeOpacity={0.7}
                        >
                            <View style={styles.menuLeft}>
                                <Ionicons name={item.icon as any} size={20} color={Colors.textSecondary} />
                                <View>
                                    <Text style={styles.menuTitle}>{item.title}</Text>
                                    <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                                </View>
                            </View>
                            <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
                        </TouchableOpacity>
                        {index < menuItems.length - 1 && <View style={styles.settingDivider} />}
                    </React.Fragment>
                ))}
            </View>

            {/* Sign Out */}
            <TouchableOpacity style={styles.signOutBtn}>
                <Ionicons name="log-out-outline" size={20} color={Colors.error} />
                <Text style={styles.signOutText}>Sign Out</Text>
            </TouchableOpacity>

            <View style={{ height: 100 }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    header: {
        paddingHorizontal: Spacing.lg,
        paddingTop: 60,
        paddingBottom: Spacing.md,
    },
    headerTitle: {
        fontSize: FontSizes.xxl,
        fontWeight: '800',
        color: Colors.text,
    },
    userCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.surface,
        marginHorizontal: Spacing.md,
        padding: Spacing.md,
        borderRadius: BorderRadius.lg,
        gap: Spacing.sm,
        ...Shadows.small,
    },
    avatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: `${Colors.primary}15`,
        justifyContent: 'center',
        alignItems: 'center',
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        color: Colors.text,
        fontSize: FontSizes.lg,
        fontWeight: '700',
    },
    userEmail: {
        color: Colors.textSecondary,
        fontSize: FontSizes.sm,
        marginTop: 2,
    },
    editBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: `${Colors.primary}15`,
        justifyContent: 'center',
        alignItems: 'center',
    },
    statsRow: {
        flexDirection: 'row',
        backgroundColor: Colors.surface,
        marginHorizontal: Spacing.md,
        marginTop: Spacing.md,
        padding: Spacing.md,
        borderRadius: BorderRadius.lg,
        ...Shadows.small,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statValue: {
        fontSize: FontSizes.xl,
        fontWeight: '800',
        color: Colors.primary,
    },
    statLabel: {
        fontSize: FontSizes.xs,
        color: Colors.textSecondary,
        marginTop: 4,
    },
    statDivider: {
        width: 1,
        backgroundColor: Colors.border,
    },
    sectionTitle: {
        fontSize: FontSizes.sm,
        fontWeight: '700',
        color: Colors.textMuted,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginHorizontal: Spacing.lg,
        marginTop: Spacing.lg,
        marginBottom: Spacing.sm,
    },
    settingsCard: {
        backgroundColor: Colors.surface,
        marginHorizontal: Spacing.md,
        borderRadius: BorderRadius.lg,
        ...Shadows.small,
    },
    settingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: Spacing.md,
    },
    settingLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
        flex: 1,
    },
    settingIcon: {
        width: 36,
        height: 36,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    settingTitle: {
        color: Colors.text,
        fontSize: FontSizes.md,
        fontWeight: '600',
    },
    settingSubtitle: {
        color: Colors.textSecondary,
        fontSize: FontSizes.xs,
        marginTop: 2,
    },
    settingDivider: {
        height: 1,
        backgroundColor: Colors.border,
        marginHorizontal: Spacing.md,
    },
    menuCard: {
        backgroundColor: Colors.surface,
        marginHorizontal: Spacing.md,
        borderRadius: BorderRadius.lg,
        ...Shadows.small,
    },
    menuRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: Spacing.md,
    },
    menuLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
    },
    menuTitle: {
        color: Colors.text,
        fontSize: FontSizes.md,
        fontWeight: '600',
    },
    menuSubtitle: {
        color: Colors.textSecondary,
        fontSize: FontSizes.xs,
        marginTop: 2,
    },
    signOutBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: Spacing.sm,
        marginHorizontal: Spacing.md,
        marginTop: Spacing.lg,
        padding: Spacing.md,
        borderRadius: BorderRadius.lg,
        borderWidth: 1,
        borderColor: `${Colors.error}30`,
        backgroundColor: `${Colors.error}08`,
    },
    signOutText: {
        color: Colors.error,
        fontSize: FontSizes.md,
        fontWeight: '600',
    },
});
