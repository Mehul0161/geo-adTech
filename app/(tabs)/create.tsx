// ========================================
// GeoAdTech — Create / Report Screen (Premium)
// ========================================
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors, Shadows } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { submitReport } from '@/services/api';

const ISSUE_TYPES = [
    { icon: 'construct', label: 'Infrastructure', color: '#F9A825' },
    { icon: 'water', label: 'Utilities', color: '#2196F3' },
    { icon: 'trash', label: 'Environment', color: '#4CAF50' },
    { icon: 'flashlight', label: 'Electricity', color: '#9C27B0' },
    { icon: 'warning', label: 'Public Safety', color: '#F44336' },
    { icon: 'leaf', label: 'Ecosystem', color: '#00BFA5' },
    { icon: 'wifi', label: 'Connectivity', color: '#FF9800' },
    { icon: 'medical', label: 'Health', color: '#E91E63' },
];

const SEVERITY = [
    { label: 'Low', color: Colors.info },
    { label: 'Medium', color: Colors.warning },
    { label: 'High', color: Colors.accent },
    { label: 'Critical', color: Colors.error },
];

export default function CreateScreen() {
    const { user } = useAuth();
    const [selectedType, setSelectedType] = useState<string | null>(null);
    const [description, setDescription] = useState('');
    const [severity, setSeverity] = useState('Medium');
    const [locationStr, setLocationStr] = useState<string | null>(null);
    const [lat, setLat] = useState<number | undefined>();
    const [lng, setLng] = useState<number | undefined>();
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [referenceId, setReferenceId] = useState('');

    useEffect(() => {
        detectLocation();
    }, []);

    const detectLocation = async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') return;
            const loc = await Location.getCurrentPositionAsync({});
            setLat(loc.coords.latitude);
            setLng(loc.coords.longitude);
            const geo = await Location.reverseGeocodeAsync({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
            if (geo[0]) {
                const addr = [geo[0].streetNumber, geo[0].street, geo[0].district].filter(Boolean).join(', ');
                setLocationStr(addr || geo[0].city || 'Active Terminal');
            }
        } catch {
            setLocationStr('Satellite sync failed');
        }
    };

    const handleSubmit = async () => {
        if (!selectedType) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            Alert.alert('Incomplete Data', 'Please select a fault category.');
            return;
        }
        if (!description.trim()) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            Alert.alert('Incomplete Data', 'Description field must be populated.');
            return;
        }

        setSubmitting(true);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        const result = await submitReport({
            userId: user?._id || 'anonymous',
            issueType: selectedType,
            severity,
            description: description.trim(),
            location: locationStr || undefined,
            lat,
            lng,
        });

        setSubmitting(false);
        if (result.success) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            setReferenceId(result.referenceId || Math.random().toString(36).substr(2, 6).toUpperCase());
            setSubmitted(true);
        } else {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            Alert.alert('Transmission Error', 'Unable to sync report with nodal servers.');
        }
    };

    const resetForm = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setSelectedType(null);
        setDescription('');
        setSeverity('Medium');
        setSubmitted(false);
    };

    if (submitted) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.successScreen}>
                    <LinearGradient colors={['#F0FDF4', '#FFFFFF']} style={styles.successCard}>
                        <View style={styles.successIconBox}>
                            <Ionicons name="shield-checkmark" size={50} color={Colors.success} />
                        </View>
                        <Text style={styles.successTitle}>Report Authenticated</Text>
                        <Text style={styles.successSub}>
                            Your input has been added to the public transparency log. Local authorities have been notified.
                        </Text>
                        <View style={styles.refBox}>
                            <Text style={styles.refLabel}>TRANSACTION ID</Text>
                            <Text style={styles.refVal}>{referenceId}</Text>
                        </View>
                        <TouchableOpacity style={styles.resetBtn} onPress={resetForm}>
                            <Text style={styles.resetBtnText}>FILE NEW REPORT</Text>
                            <Ionicons name="add-circle" size={20} color={Colors.white} />
                        </TouchableOpacity>
                    </LinearGradient>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerLabel}>CIVIC COMMAND</Text>
                    <Text style={styles.headerTitle}>Report Fault</Text>
                </View>
                <TouchableOpacity onPress={detectLocation} style={styles.locationBadge}>
                    <Ionicons name="location" size={16} color={Colors.primary} />
                    <Text style={styles.locationBadgeText} numberOfLines={1}>{locationStr || 'SYNC...'}</Text>
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionLabel}>FAULT CATEGORY</Text>
                        <Text style={styles.requiredMark}>REQUIRED</Text>
                    </View>
                    <View style={styles.typeGrid}>
                        {ISSUE_TYPES.map((type) => (
                            <TouchableOpacity
                                key={type.label}
                                style={[styles.typeBtn, selectedType === type.label && { borderColor: type.color, backgroundColor: `${type.color}08` }]}
                                onPress={() => {
                                    Haptics.selectionAsync();
                                    setSelectedType(type.label);
                                }}
                            >
                                <View style={[styles.typeIconBox, { backgroundColor: selectedType === type.label ? `${type.color}15` : '#F1F5F9' }]}>
                                    <Ionicons name={type.icon as any} size={22} color={selectedType === type.label ? type.color : '#94A3B8'} />
                                </View>
                                <Text style={[styles.typeBtnText, selectedType === type.label && { color: type.color, fontWeight: '900' }]}>
                                    {type.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <Text style={styles.sectionLabel}>SEVERITY SCALE</Text>
                    <View style={styles.severityRow}>
                        {SEVERITY.map((item) => (
                            <TouchableOpacity
                                key={item.label}
                                style={[styles.severityBtn, severity === item.label && { backgroundColor: item.color, borderColor: item.color }]}
                                onPress={() => {
                                    Haptics.selectionAsync();
                                    setSeverity(item.label);
                                }}
                            >
                                <Text style={[styles.severityText, severity === item.label && styles.severityTextActive]}>{item.label.toUpperCase()}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <Text style={styles.sectionLabel}>SITUATIONAL REPORT</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Provide deep technical details or general observations about the fault. Be specific about the location if precise GPS is off."
                        placeholderTextColor="#94A3B8"
                        multiline
                        numberOfLines={5}
                        value={description}
                        onChangeText={setDescription}
                        textAlignVertical="top"
                    />

                    <View style={styles.infoCard}>
                        <Ionicons name="information-circle" size={20} color={Colors.primary} />
                        <Text style={styles.infoText}>
                            Your GPS coordinates and time-stamp will be attached to this transmission for verification.
                        </Text>
                    </View>

                    <TouchableOpacity
                        style={[styles.submitBtn, submitting && { opacity: 0.8 }]}
                        onPress={handleSubmit}
                        disabled={submitting}
                    >
                        {submitting ? (
                            <ActivityIndicator color={Colors.white} />
                        ) : (
                            <LinearGradient
                                colors={[Colors.primary, '#1E293B']}
                                style={styles.submitGradient}
                                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                            >
                                <Text style={styles.submitText}>INITIALIZE TRANSMISSION</Text>
                                <Ionicons name="cloud-upload" size={18} color={Colors.white} />
                            </LinearGradient>
                        )}
                    </TouchableOpacity>

                    <Text style={styles.disclaimer}>
                        AUTHORED UNDER CIVIC TRANSPARENCY PROTOCOL 2.0
                    </Text>
                    <View style={{ height: 40 }} />
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAFC' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14, backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
    headerLabel: { fontSize: 10, fontWeight: '900', color: Colors.primary, letterSpacing: 2 },
    headerTitle: { fontSize: 22, fontWeight: '900', color: Colors.text, marginTop: 2 },
    locationBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#F1F5F9', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, maxWidth: 160 },
    locationBadgeText: { fontSize: 11, fontWeight: '800', color: Colors.primary },

    scroll: { padding: 20 },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, marginBottom: 12 },
    sectionLabel: { fontSize: 11, fontWeight: '900', color: '#64748B', letterSpacing: 1.5, marginTop: 24, marginBottom: 12 },
    requiredMark: { fontSize: 9, fontWeight: '900', color: Colors.accent, backgroundColor: '#FFF1F2', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },

    typeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    typeBtn: { width: '22.5%', backgroundColor: Colors.white, borderRadius: 20, padding: 12, alignItems: 'center', gap: 8, borderWidth: 1.5, borderColor: '#F1F5F9', ...Shadows.small },
    typeIconBox: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
    typeBtnText: { fontSize: 10, fontWeight: '700', color: '#64748B', textAlign: 'center' },

    severityRow: { flexDirection: 'row', gap: 10 },
    severityBtn: { flex: 1, height: 48, borderRadius: 14, borderWidth: 1.5, borderColor: '#F1F5F9', backgroundColor: Colors.white, justifyContent: 'center', alignItems: 'center' },
    severityText: { fontSize: 11, fontWeight: '900', color: '#64748B', letterSpacing: 1 },
    severityTextActive: { color: Colors.white },

    input: { backgroundColor: Colors.white, borderRadius: 20, padding: 20, minHeight: 120, fontSize: 15, color: Colors.text, fontWeight: '500', borderWidth: 1.5, borderColor: '#F1F5F9', ...Shadows.small },

    infoCard: { flexDirection: 'row', gap: 12, backgroundColor: '#F0F9FF', padding: 16, borderRadius: 16, marginTop: 24, borderWidth: 1, borderColor: '#BAE6FD' },
    infoText: { flex: 1, fontSize: 12, color: '#0369A1', fontWeight: '600', lineHeight: 18 },

    submitBtn: { height: 60, borderRadius: 20, overflow: 'hidden', marginTop: 32, ...Shadows.glow(Colors.primary) },
    submitGradient: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 12 },
    submitText: { color: Colors.white, fontSize: 15, fontWeight: '900', letterSpacing: 1 },
    disclaimer: { fontSize: 10, color: '#94A3B8', textAlign: 'center', marginTop: 16, letterSpacing: 1.5, fontWeight: '800' },

    successScreen: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
    successCard: { width: '100%', borderRadius: 32, padding: 32, alignItems: 'center', ...Shadows.premium },
    successIconBox: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#DCFCE7', justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
    successTitle: { fontSize: 24, fontWeight: '900', color: Colors.text, marginBottom: 12 },
    successSub: { fontSize: 15, color: '#64748B', textAlign: 'center', lineHeight: 22, fontWeight: '500', marginBottom: 24 },
    refBox: { backgroundColor: '#F1F5F9', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12, alignItems: 'center', marginBottom: 32 },
    refLabel: { fontSize: 10, fontWeight: '900', color: '#64748B', letterSpacing: 2, marginBottom: 4 },
    refVal: { fontSize: 22, fontWeight: '900', color: Colors.primary, letterSpacing: 4 },
    resetBtn: { flexDirection: 'row', backgroundColor: Colors.primary, paddingHorizontal: 24, paddingVertical: 18, borderRadius: 20, alignItems: 'center', gap: 10, ...Shadows.glow(Colors.primary) },
    resetBtnText: { color: Colors.white, fontSize: 14, fontWeight: '900', letterSpacing: 1 },
});
