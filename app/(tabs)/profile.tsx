// ========================================
// GeoAdTech — Profile Screen (Premium)
// ========================================
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
    Alert,
    Modal,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors, Shadows } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';

const LEVEL_COLORS = [Colors.info, Colors.accent, Colors.success, '#9C27B0'];
const LEVELS = ['Explorer', 'Contributor', 'Advocate', 'Champion'];

export default function ProfileScreen() {
    const { user, logout, updateUser, refreshUser } = useAuth();
    const [refreshing, setRefreshing] = useState(false);
    const [notifEnabled, setNotifEnabled] = useState(true);
    const [bgLocation, setBgLocation] = useState(true);
    const [locationStr, setLocationStr] = useState(user?.city || 'Detecting...');
    const [editModal, setEditModal] = useState(false);
    const [tempName, setTempName] = useState(user?.name || '');
    const [tempPhone, setTempPhone] = useState(user?.phone || '');
    const [tempCity, setTempCity] = useState(user?.city || '');
    const [saving, setSaving] = useState(false);

    const sitesTracked = user?.sitesTracked ?? 0;
    const feedbackGiven = user?.feedbackGiven ?? 0;
    const zonesEntered = user?.zonesEntered ?? 0;

    const levelIdx = Math.min(Math.floor(feedbackGiven / 3), 3);
    const xp = feedbackGiven * 120 + zonesEntered * 40 + sitesTracked * 60;

    useEffect(() => {
        detectLocation();
        refreshUser();
    }, []);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        await refreshUser();
        setRefreshing(false);
    }, []);

    const detectLocation = async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') return;
            const loc = await Location.getCurrentPositionAsync({});
            const geo = await Location.reverseGeocodeAsync({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
            if (geo[0]) setLocationStr(geo[0].city || geo[0].district || user?.city || 'India');
        } catch { setLocationStr(user?.city || 'India'); }
    };

    const handleEditPress = () => {
        Haptics.selectionAsync();
        setTempName(user?.name || '');
        setTempPhone(user?.phone || '');
        setTempCity(user?.city || '');
        setEditModal(true);
    };

    const saveProfile = async () => {
        if (!tempName.trim()) {
            Alert.alert('Missing', 'Name cannot be empty.');
            return;
        }
        setSaving(true);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        await updateUser({ name: tempName.trim(), phone: tempPhone.trim() || undefined, city: tempCity.trim() || undefined });
        setSaving(false);
        setEditModal(false);
    };

    const handleLogout = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        Alert.alert('Sign Out', 'Are you sure you want to exit the civic hub?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Exit Hub', style: 'destructive', onPress: () => logout() },
        ]);
    };

    const handleMenuPress = (action: () => void) => {
        Haptics.selectionAsync();
        action();
    };

    const handleSwitchToggle = (setter: (v: boolean) => void, val: boolean) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setter(val);
    };

    const joinedDate = user?.createdAt
        ? new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
        : 'Since Today';

    const menuItems = [
        { icon: 'map', label: 'Civic Map', sub: 'Project transparency data', action: () => router.push('/map' as any) },
        { icon: 'sparkles', label: 'Council AI', sub: 'Your civic engagement assist', action: () => router.push('/discuss' as any) },
        { icon: 'time', label: 'Geo-Alert History', sub: 'Past alerts & triggers', action: () => router.push('/notifications' as any) },
        { icon: 'globe', label: 'Language Settings', sub: 'English (India)', action: () => Alert.alert('Coming Soon', 'Regional language support.') },
        { icon: 'lock-closed', label: 'Privacy & Data', sub: 'Transparency report', action: () => Alert.alert('Privacy', 'Your data is encrypted.') },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Account Hub</Text>
                <TouchableOpacity style={styles.editBtn} onPress={handleEditPress}>
                    <Ionicons name="settings-sharp" size={20} color={Colors.primary} />
                </TouchableOpacity>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
            >
                {/* Official ID Card - Premium Glassmorphism Overhaul */}
                <LinearGradient
                    colors={[Colors.primary, '#1E293B']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.citizenCard}
                >
                    <View style={styles.cardTopRow}>
                        <View>
                            <Text style={styles.cardIssuer}>GOVERNMENT OF INDIA • CIVIC DEPT</Text>
                            <Text style={styles.cardType}>DIGITAL CITIZEN IDENTITY</Text>
                        </View>
                        <View style={styles.chipContainer}>
                            <View style={styles.goldChip} />
                        </View>
                    </View>

                    <View style={styles.cardBody}>
                        <View style={styles.avatarCircle}>
                            <Text style={styles.avatarLetter}>{user?.name?.charAt(0).toUpperCase() || 'C'}</Text>
                        </View>
                        <View style={styles.cardMeta}>
                            <Text style={styles.cardName}>{user?.name}</Text>
                            <Text style={styles.cardEmail}>{user?.email}</Text>
                            <View style={styles.verifiedBadge}>
                                <Ionicons name="shield-checkmark" size={10} color={Colors.white} />
                                <Text style={styles.verifiedText}>ACTIVE CITIZEN • {locationStr.toUpperCase()}</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.cardFooter}>
                        <View>
                            <Text style={styles.cardFooterLabel}>CITIZEN RANK</Text>
                            <Text style={styles.cardFooterVal}>{LEVELS[levelIdx]}</Text>
                        </View>
                        <View>
                            <Text style={styles.cardFooterLabel}>IMPACT POINTS</Text>
                            <Text style={styles.cardFooterVal}>{xp.toLocaleString()}</Text>
                        </View>
                        <View>
                            <Text style={styles.cardFooterLabel}>ISSUE DATE</Text>
                            <Text style={styles.cardFooterVal}>{joinedDate.toUpperCase()}</Text>
                        </View>
                    </View>
                </LinearGradient>

                {/* Progress Hub */}
                <View style={styles.glassSection}>
                    <View style={styles.levelHeader}>
                        <Text style={styles.levelTitle}>Next Milestone</Text>
                        <Text style={[styles.levelNext, { color: LEVEL_COLORS[levelIdx] }]}>{levelIdx < 3 ? LEVELS[levelIdx + 1] : 'MAX RANK'}</Text>
                    </View>
                    <View style={styles.levelBar}>
                        <View style={[styles.levelFill, { width: `${Math.min((feedbackGiven % 3) / 3 * 100, 100)}%`, backgroundColor: LEVEL_COLORS[levelIdx] }]} />
                    </View>
                    <View style={styles.statRow}>
                        <View style={styles.statItem}>
                            <Text style={styles.statVal}>{sitesTracked}</Text>
                            <Text style={styles.statLabel}>SITES</Text>
                        </View>
                        <View style={styles.statDiv} />
                        <View style={styles.statItem}>
                            <Text style={styles.statVal}>{feedbackGiven}</Text>
                            <Text style={styles.statLabel}>REVIEWS</Text>
                        </View>
                        <View style={styles.statDiv} />
                        <View style={styles.statItem}>
                            <Text style={styles.statVal}>{zonesEntered}</Text>
                            <Text style={styles.statLabel}>ZONES</Text>
                        </View>
                    </View>
                </View>

                {/* Modern Preferences */}
                <Text style={styles.sectionTitle}>Smart Preferences</Text>
                <View style={styles.menuGroup}>
                    <View style={styles.menuRow}>
                        <View style={styles.menuLeft}>
                            <LinearGradient colors={['#EEF2FF', '#E0E7FF']} style={styles.iconBox}>
                                <Ionicons name="notifications" size={18} color={Colors.primary} />
                            </LinearGradient>
                            <View>
                                <Text style={styles.menuLabel}>Geo-Notifications</Text>
                                <Text style={styles.menuSub}>Alerts for local municipal works</Text>
                            </View>
                        </View>
                        <Switch
                            value={notifEnabled}
                            onValueChange={(v) => handleSwitchToggle(setNotifEnabled, v)}
                            trackColor={{ false: '#E2E8F0', true: Colors.primaryLight }}
                            thumbColor={notifEnabled ? Colors.primary : '#94A3B8'}
                        />
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.menuRow}>
                        <View style={styles.menuLeft}>
                            <LinearGradient colors={['#FFF1F2', '#FFE4E6']} style={styles.iconBox}>
                                <Ionicons name="locate" size={18} color={Colors.accent} />
                            </LinearGradient>
                            <View>
                                <Text style={styles.menuLabel}>Smart Detection</Text>
                                <Text style={styles.menuSub}>Auto-scan projects while traveling</Text>
                            </View>
                        </View>
                        <Switch
                            value={bgLocation}
                            onValueChange={(v) => handleSwitchToggle(setBgLocation, v)}
                            trackColor={{ false: '#E2E8F0', true: '#FDA4AF' }}
                            thumbColor={bgLocation ? Colors.accent : '#94A3B8'}
                        />
                    </View>
                </View>

                {/* Navigation Menu */}
                <Text style={styles.sectionTitle}>Account Tools</Text>
                <View style={styles.menuGroup}>
                    {menuItems.map((item, idx) => (
                        <React.Fragment key={item.label}>
                            <TouchableOpacity
                                style={styles.menuRow}
                                onPress={() => handleMenuPress(item.action)}
                                activeOpacity={0.7}
                            >
                                <View style={styles.menuLeft}>
                                    <View style={styles.simpleIcon}>
                                        <Ionicons name={item.icon as any} size={20} color={Colors.textSecondary} />
                                    </View>
                                    <View>
                                        <Text style={styles.menuLabel}>{item.label}</Text>
                                        <Text style={styles.menuSub}>{item.sub}</Text>
                                    </View>
                                </View>
                                <Ionicons name="chevron-forward" size={16} color="#CBD5E1" />
                            </TouchableOpacity>
                            {idx < menuItems.length - 1 && <View style={styles.divider} />}
                        </React.Fragment>
                    ))}
                </View>

                {/* Sign Out */}
                <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                    <Ionicons name="power" size={18} color={Colors.error} />
                    <Text style={styles.logoutText}>Sign Out of Hub</Text>
                </TouchableOpacity>

                <Text style={styles.version}>NODE: INDIA-WEST-1 • REV 2.4.0 • {user?.role?.toUpperCase()}</Text>
                <View style={{ height: 40 }} />
            </ScrollView>

            {/* Edit Modal */}
            <Modal visible={editModal} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalSheet}>
                        <View style={styles.modalHandle} />
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Update Credentials</Text>
                            <TouchableOpacity onPress={() => setEditModal(false)}>
                                <Ionicons name="close-circle" size={32} color={Colors.textMuted} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.modalLabel}>DISPLAY NAME</Text>
                            <TextInput style={styles.modalInput} value={tempName} onChangeText={setTempName} placeholder="Full Name" />

                            <Text style={styles.modalLabel}>CONTACT PHONE</Text>
                            <TextInput style={styles.modalInput} value={tempPhone} onChangeText={setTempPhone} placeholder="+91 XXXX XXXX" keyboardType="phone-pad" />

                            <Text style={styles.modalLabel}>HOME MUNICIPALITY</Text>
                            <TextInput style={styles.modalInput} value={tempCity} onChangeText={setTempCity} placeholder="City Name" />
                        </View>
                        <TouchableOpacity
                            style={[styles.saveBtn, saving && { opacity: 0.7 }]}
                            onPress={saveProfile}
                            disabled={saving}
                        >
                            <Text style={styles.saveBtnText}>{saving ? 'SYNCHRONIZING...' : 'SAVE TO CITIZEN ID'}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14, backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.border },
    headerTitle: { fontSize: 20, fontWeight: '900', color: Colors.text },
    editBtn: { width: 44, height: 44, borderRadius: 14, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center' },

    citizenCard: { margin: 20, borderRadius: 28, padding: 24, paddingBottom: 28, ...Shadows.premium },
    cardTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 },
    cardIssuer: { color: 'rgba(255,255,255,0.5)', fontSize: 9, fontWeight: '900', letterSpacing: 1.2 },
    cardType: { color: Colors.white, fontSize: 16, fontWeight: '900', marginTop: 4, letterSpacing: 0.5 },
    chipContainer: { padding: 4, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 8 },
    goldChip: { width: 32, height: 24, borderRadius: 4, backgroundColor: '#fbbf24', opacity: 0.8 },
    cardBody: { flexDirection: 'row', alignItems: 'center', gap: 18, marginBottom: 28 },
    avatarCircle: { width: 72, height: 72, borderRadius: 36, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' },
    avatarLetter: { fontSize: 32, fontWeight: '900', color: Colors.white },
    cardMeta: { flex: 1 },
    cardName: { color: Colors.white, fontSize: 22, fontWeight: '900' },
    cardEmail: { color: 'rgba(255,255,255,0.6)', fontSize: 13, marginTop: 2 },
    verifiedBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10, backgroundColor: 'rgba(255,255,255,0.15)', alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
    verifiedText: { color: Colors.white, fontSize: 10, fontWeight: '800' },
    cardFooter: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)', paddingTop: 20 },
    cardFooterLabel: { color: 'rgba(255,255,255,0.4)', fontSize: 8, fontWeight: '900', letterSpacing: 1, marginBottom: 4 },
    cardFooterVal: { color: Colors.white, fontSize: 13, fontWeight: '900' },

    glassSection: { backgroundColor: Colors.white, marginHorizontal: 20, marginBottom: 24, borderRadius: 24, padding: 20, ...Shadows.small },
    levelHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12, alignItems: 'center' },
    levelTitle: { fontSize: 16, fontWeight: '900', color: Colors.text },
    levelNext: { fontSize: 12, fontWeight: '800' },
    levelBar: { height: 10, backgroundColor: '#F1F5F9', borderRadius: 5, overflow: 'hidden', marginBottom: 20 },
    levelFill: { height: '100%', borderRadius: 5 },
    statRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10 },
    statItem: { alignItems: 'center', flex: 1 },
    statVal: { fontSize: 20, fontWeight: '900', color: Colors.text, marginBottom: 4 },
    statLabel: { fontSize: 10, fontWeight: '800', color: Colors.textMuted },
    statDiv: { width: 1, height: 24, backgroundColor: '#E2E8F0' },

    sectionTitle: { fontSize: 13, fontWeight: '900', color: Colors.textMuted, letterSpacing: 1.2, marginHorizontal: 24, marginBottom: 14 },
    menuGroup: { backgroundColor: Colors.white, marginHorizontal: 20, borderRadius: 24, ...Shadows.small, marginBottom: 28, overflow: 'hidden' },
    menuRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 18 },
    menuLeft: { flexDirection: 'row', alignItems: 'center', gap: 16, flex: 1 },
    iconBox: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
    simpleIcon: { width: 44, height: 44, borderRadius: 14, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center' },
    menuLabel: { fontSize: 16, fontWeight: '800', color: Colors.text },
    menuSub: { fontSize: 12, color: Colors.textSecondary, marginTop: 2, fontWeight: '600' },
    divider: { height: 1, backgroundColor: '#F1F5F9', marginHorizontal: 20 },

    logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginHorizontal: 20, padding: 20, borderRadius: 24, borderWidth: 1.5, borderColor: '#FEE2E2', backgroundColor: '#FEF2F2', marginBottom: 16 },
    logoutText: { color: Colors.error, fontSize: 16, fontWeight: '800' },
    version: { textAlign: 'center', fontSize: 11, color: Colors.textMuted, fontWeight: '700', letterSpacing: 1 },

    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
    modalSheet: { backgroundColor: Colors.white, borderTopLeftRadius: 36, borderTopRightRadius: 36, padding: 24, paddingBottom: 50 },
    modalHandle: { width: 44, height: 5, borderRadius: 3, backgroundColor: '#E2E8F0', alignSelf: 'center', marginBottom: 24 },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
    modalTitle: { fontSize: 22, fontWeight: '900', color: Colors.text },
    inputGroup: { gap: 16 },
    modalLabel: { fontSize: 11, fontWeight: '900', color: Colors.textMuted, letterSpacing: 1 },
    modalInput: { backgroundColor: '#F8FAFC', borderRadius: 18, padding: 18, fontSize: 16, color: Colors.text, borderWidth: 1, borderColor: '#E2E8F0', fontWeight: '600' },
    saveBtn: { backgroundColor: Colors.primary, height: 64, borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginTop: 32, ...Shadows.glow(Colors.primary) },
    saveBtnText: { color: Colors.white, fontSize: 17, fontWeight: '900', letterSpacing: 1 },
});
