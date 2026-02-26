// ========================================
// GeoAdTech — Profile Screen (Stitch Style)
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

import { Colors, Shadows } from '@/constants/theme';

export default function ProfileScreen() {
    const [notifEnabled, setNotifEnabled] = React.useState(true);
    const [bgLocation, setBgLocation] = React.useState(true);

    const menuItems = [
        {
            icon: 'language-outline',
            title: 'Language',
            subtitle: 'English (In-App)',
            action: () => { },
        },
        {
            icon: 'shield-checkmark-outline',
            title: 'Privacy Policy',
            subtitle: 'Public Data Transparency',
            action: () => { },
        },
        {
            icon: 'help-circle-outline',
            title: 'Citizen Support',
            subtitle: '24/7 Municipal Help',
            action: () => { },
        },
        {
            icon: 'settings-outline',
            title: 'Gov Settings',
            subtitle: 'Regional Preferences',
            action: () => { },
        },
    ];

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false} bounces={false}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerSubtitle}>User Account</Text>
                <Text style={styles.headerTitle}>Civic Identity</Text>
            </View>

            {/* Citizen ID Card (Stitch Inspired) */}
            <View style={styles.citizenCard}>
                <View style={styles.cardHeader}>
                    <View>
                        <Text style={styles.cardOrg}>DEMOCRACY DEPT. OF DELHI</Text>
                        <Text style={styles.cardTitle}>OFFICIAL CITIZEN PASS</Text>
                    </View>
                    <Ionicons name="finger-print" size={24} color={Colors.white} />
                </View>

                <View style={styles.cardBody}>
                    <View style={styles.cardAvatar}>
                        <Ionicons name="person" size={32} color={Colors.primary} />
                    </View>
                    <View style={styles.cardMeta}>
                        <Text style={styles.cardName}>Piyush Kumar</Text>
                        <Text style={styles.cardId}>ID: CIVIC-9421-2026</Text>
                        <View style={styles.verificationBadge}>
                            <Ionicons name="checkmark-circle" size={12} color={Colors.white} />
                            <Text style={styles.verificationText}>Verified Resident</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.cardFooter}>
                    <View style={styles.footerItem}>
                        <Text style={styles.footerLabel}>CONTRIBUTIONS</Text>
                        <Text style={styles.footerVal}>Platinum Rank</Text>
                    </View>
                    <View style={styles.footerItem}>
                        <Text style={styles.footerLabel}>CREDITS</Text>
                        <Text style={styles.footerVal}>1,240 XP</Text>
                    </View>
                </View>
            </View>

            {/* Engagement Stats */}
            <View style={styles.statsRow}>
                <View style={styles.statBox}>
                    <Text style={styles.statVal}>18</Text>
                    <Text style={styles.statLabel}>Sites Tracked</Text>
                </View>
                <View style={styles.statDiv} />
                <View style={styles.statBox}>
                    <Text style={styles.statVal}>5</Text>
                    <Text style={styles.statLabel}>Reviews</Text>
                </View>
                <View style={styles.statDiv} />
                <View style={styles.statBox}>
                    <Text style={styles.statVal}>0.2mi</Text>
                    <Text style={styles.statLabel}>Radius Avg</Text>
                </View>
            </View>

            {/* Preferences Section */}
            <Text style={styles.sectionTitle}>Engagement Prefs</Text>
            <View style={styles.settingsGroup}>
                <View style={styles.settingRow}>
                    <View style={styles.settingLeft}>
                        <View style={[styles.settingIcon, { backgroundColor: Colors.primaryLight }]}>
                            <Ionicons name="notifications" size={18} color={Colors.primary} />
                        </View>
                        <View>
                            <Text style={styles.settingTitle}>Geo-Notifications</Text>
                            <Text style={styles.settingSubtitle}>Smart alerts for nearby works</Text>
                        </View>
                    </View>
                    <Switch
                        value={notifEnabled}
                        onValueChange={setNotifEnabled}
                        trackColor={{ false: Colors.border, true: Colors.primaryLight }}
                        thumbColor={notifEnabled ? Colors.primary : Colors.textMuted}
                    />
                </View>

                <View style={styles.settingDiv} />

                <View style={styles.settingRow}>
                    <View style={styles.settingLeft}>
                        <View style={[styles.settingIcon, { backgroundColor: `${Colors.accent}15` }]}>
                            <Ionicons name="location" size={18} color={Colors.accent} />
                        </View>
                        <View>
                            <Text style={styles.settingTitle}>Auto-Detection</Text>
                            <Text style={styles.settingSubtitle}>Scan zones while driving</Text>
                        </View>
                    </View>
                    <Switch
                        value={bgLocation}
                        onValueChange={setBgLocation}
                        trackColor={{ false: Colors.border, true: `${Colors.accent}30` }}
                        thumbColor={bgLocation ? Colors.accent : Colors.textMuted}
                    />
                </View>
            </View>

            {/* General Menu */}
            <Text style={styles.sectionTitle}>General</Text>
            <View style={styles.menuGroup}>
                {menuItems.map((item, index) => (
                    <React.Fragment key={item.title}>
                        <TouchableOpacity style={styles.menuRow} activeOpacity={0.7}>
                            <View style={styles.menuLeft}>
                                <Ionicons name={item.icon as any} size={20} color={Colors.textSecondary} />
                                <View>
                                    <Text style={styles.menuTitle}>{item.title}</Text>
                                    <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                                </View>
                            </View>
                            <Ionicons name="chevron-forward" size={18} color={Colors.border} />
                        </TouchableOpacity>
                        {index < menuItems.length - 1 && <View style={styles.settingDiv} />}
                    </React.Fragment>
                ))}
            </View>

            <TouchableOpacity style={styles.logoutBtn}>
                <Ionicons name="log-out-outline" size={20} color={Colors.error} />
                <Text style={styles.logoutText}>End Civic Session</Text>
            </TouchableOpacity>

            <View style={{ height: 100 }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    header: { paddingTop: 70, paddingHorizontal: 25, paddingBottom: 25, backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.border },
    headerSubtitle: { fontSize: 10, color: Colors.primary, fontWeight: '800', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 },
    headerTitle: { fontSize: 26, fontWeight: '900', color: Colors.text },
    citizenCard: { backgroundColor: Colors.primary, margin: 20, borderRadius: 25, padding: 25, ...Shadows.premium },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
    cardOrg: { color: 'rgba(255,255,255,0.7)', fontSize: 9, fontWeight: '900', letterSpacing: 1 },
    cardTitle: { color: Colors.white, fontSize: 16, fontWeight: '900' },
    cardBody: { flexDirection: 'row', alignItems: 'center', gap: 15, marginBottom: 25 },
    cardAvatar: { width: 64, height: 64, borderRadius: 32, backgroundColor: Colors.white, justifyContent: 'center', alignItems: 'center' },
    cardMeta: { flex: 1 },
    cardName: { color: Colors.white, fontSize: 22, fontWeight: '800' },
    cardId: { color: 'rgba(255,255,255,0.6)', fontSize: 11, marginTop: 2 },
    verificationBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 8, alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.15)' },
    verificationText: { color: Colors.white, fontSize: 9, fontWeight: '800' },
    cardFooter: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.15)', paddingTop: 20, gap: 40 },
    footerItem: {},
    footerLabel: { color: 'rgba(255,255,255,0.5)', fontSize: 9, fontWeight: '900', marginBottom: 2 },
    footerVal: { color: Colors.white, fontSize: 14, fontWeight: '800' },
    statsRow: { flexDirection: 'row', backgroundColor: Colors.white, marginHorizontal: 20, borderRadius: 20, padding: 20, ...Shadows.small, marginTop: 5 },
    statBox: { flex: 1, alignItems: 'center' },
    statVal: { fontSize: 20, fontWeight: '900', color: Colors.primary, marginBottom: 4 },
    statLabel: { fontSize: 10, color: Colors.textSecondary, fontWeight: '700' },
    statDiv: { width: 1, backgroundColor: Colors.border },
    sectionTitle: { fontSize: 13, fontWeight: '800', color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginHorizontal: 25, marginTop: 30, marginBottom: 12 },
    settingsGroup: { backgroundColor: Colors.white, marginHorizontal: 20, borderRadius: 20, ...Shadows.small },
    settingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 18 },
    settingLeft: { flexDirection: 'row', alignItems: 'center', gap: 15 },
    settingIcon: { width: 38, height: 38, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
    settingTitle: { fontSize: 15, fontWeight: '700', color: Colors.text },
    settingSubtitle: { fontSize: 11, color: Colors.textSecondary, marginTop: 2 },
    settingDiv: { height: 1, backgroundColor: Colors.background, marginHorizontal: 15 },
    menuGroup: { backgroundColor: Colors.white, marginHorizontal: 20, borderRadius: 20, ...Shadows.small },
    menuRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 18 },
    menuLeft: { flexDirection: 'row', alignItems: 'center', gap: 15 },
    menuTitle: { fontSize: 15, fontWeight: '700', color: Colors.text },
    menuSubtitle: { fontSize: 11, color: Colors.textSecondary, marginTop: 2 },
    logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginHorizontal: 20, marginTop: 30, padding: 18, borderRadius: 20, borderWidth: 1, borderColor: `${Colors.error}20`, backgroundColor: `${Colors.error}05` },
    logoutText: { color: Colors.error, fontSize: 15, fontWeight: '700' }
});
