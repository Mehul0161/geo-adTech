// ========================================
// GeoAdTech — Auth Screen (Premium)
// ========================================
import { Colors, Shadows } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
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

const { width } = Dimensions.get('window');

type Mode = 'login' | 'register';

interface Field {
    key: string;
    label: string;
    placeholder: string;
    icon: string;
    secure?: boolean;
    keyType?: any;
    required?: boolean;
}

const LOGIN_FIELDS: Field[] = [
    { key: 'email', label: 'DIGITAL ID', placeholder: 'your@email.com', icon: 'mail', keyType: 'email-address', required: true },
    { key: 'password', label: 'SECURITY KEY', placeholder: '••••••••', icon: 'lock-closed', secure: true, required: true },
];

const REGISTER_FIELDS: Field[] = [
    { key: 'name', label: 'FULL NAME', placeholder: 'Piyush Kumar', icon: 'person', required: true },
    { key: 'email', label: 'DIGITAL ID', placeholder: 'your@email.com', icon: 'mail', keyType: 'email-address', required: true },
    { key: 'password', label: 'SECURITY KEY', placeholder: 'Min. 6 characters', icon: 'lock-closed', secure: true, required: true },
    { key: 'phone', label: 'MOBILE (OTP)', placeholder: '+91 98765 43210', icon: 'call', keyType: 'phone-pad' },
    { key: 'city', label: 'MUNICIPALITY', placeholder: 'New Delhi', icon: 'location' },
];

export default function AuthScreen() {
    const { login, register } = useAuth();
    const [mode, setMode] = useState<Mode>('login');
    const [form, setForm] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [showPwd, setShowPwd] = useState(false);

    const set = (key: string, value: string) => setForm(prev => ({ ...prev, [key]: value }));

    const handleSubmit = async () => {
        const fields = mode === 'login' ? LOGIN_FIELDS : REGISTER_FIELDS;
        for (const f of fields) {
            if (f.required && !form[f.key]?.trim()) {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
                Alert.alert('Incomplete', `Please enter your ${f.label.toLowerCase()}.`);
                return;
            }
        }
        setLoading(true);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        const result = mode === 'login'
            ? await login(form.email?.trim(), form.password)
            : await register({
                name: form.name?.trim(),
                email: form.email?.trim(),
                password: form.password,
                phone: form.phone?.trim() || undefined,
                city: form.city?.trim() || undefined,
            });

        setLoading(false);

        if (!result.success) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            Alert.alert(mode === 'login' ? 'Access Denied' : 'Registration Failed', result.message);
        } else {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
    };

    const switchMode = (m: Mode) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setMode(m);
        setForm({});
        setShowPwd(false);
    };

    const fields = mode === 'login' ? LOGIN_FIELDS : REGISTER_FIELDS;

    return (
        <LinearGradient colors={[Colors.primary, '#1E293B']} style={styles.outer}>
            <SafeAreaView style={{ flex: 1 }}>
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                >
                    <ScrollView
                        contentContainerStyle={styles.scroll}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    >
                        {/* Hero Header */}
                        <View style={styles.hero}>
                            <View style={styles.logoBadge}>
                                <Ionicons name="shield-checkmark" size={40} color={Colors.white} />
                            </View>
                            <Text style={styles.logoTitle}>GeoAdTech</Text>
                            <Text style={styles.logoSub}>CIVIC INTELLIGENCE GATEWAY</Text>
                        </View>

                        {/* Glassmorphism-style Form Card */}
                        <View style={styles.card}>
                            <View style={styles.tabRow}>
                                <TouchableOpacity
                                    style={[styles.tab, mode === 'login' && styles.tabActive]}
                                    onPress={() => switchMode('login')}
                                >
                                    <Text style={[styles.tabText, mode === 'login' && styles.tabTextActive]}>SIGN IN</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.tab, mode === 'register' && styles.tabActive]}
                                    onPress={() => switchMode('register')}
                                >
                                    <Text style={[styles.tabText, mode === 'register' && styles.tabTextActive]}>REGISTER</Text>
                                </TouchableOpacity>
                            </View>

                            <Text style={styles.welcomeText}>
                                {mode === 'login' ? 'Initialize Passport' : 'New Citizenship'}
                            </Text>
                            <Text style={styles.welcomeSub}>
                                {mode === 'login'
                                    ? 'Secure biometric or digital ID login required.'
                                    : 'Connect with your local government data nodes.'}
                            </Text>

                            {fields.map((f) => (
                                <View key={f.key} style={styles.fieldWrap}>
                                    <View style={styles.labelRow}>
                                        <Text style={styles.fieldLabel}>{f.label}</Text>
                                        {f.required && <View style={styles.requiredDot} />}
                                    </View>
                                    <View style={styles.inputBox}>
                                        <Ionicons name={f.icon as any} size={18} color="#94A3B8" />
                                        <TextInput
                                            style={styles.input}
                                            placeholder={f.placeholder}
                                            placeholderTextColor="#94A3B8"
                                            value={form[f.key] || ''}
                                            onChangeText={v => set(f.key, v)}
                                            secureTextEntry={f.secure && !showPwd}
                                            keyboardType={f.keyType || 'default'}
                                            autoCapitalize={f.key === 'name' ? 'words' : 'none'}
                                        />
                                        {f.secure && (
                                            <TouchableOpacity onPress={() => setShowPwd(p => !p)}>
                                                <Ionicons name={showPwd ? 'eye-off' : 'eye'} size={18} color="#CBD5E1" />
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                </View>
                            ))}

                            <TouchableOpacity
                                style={[styles.submitBtn, loading && { opacity: 0.8 }]}
                                onPress={handleSubmit}
                                disabled={loading}
                            >
                                {loading ? (
                                    <ActivityIndicator color={Colors.white} />
                                ) : (
                                    <LinearGradient
                                        colors={[Colors.primary, '#3B82F6']}
                                        style={styles.submitGradient}
                                        start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                                    >
                                        <Text style={styles.submitText}>
                                            {mode === 'login' ? 'AUTHENTICATE ACCESS' : 'PROVISION ACCOUNT'}
                                        </Text>
                                        <Ionicons name="finger-print-outline" size={20} color={Colors.white} />
                                    </LinearGradient>
                                )}
                            </TouchableOpacity>

                            <View style={styles.footerLinkWrap}>
                                <TouchableOpacity onPress={() => switchMode(mode === 'login' ? 'register' : 'login')}>
                                    <Text style={styles.footerLinkText}>
                                        {mode === 'login' ? "System doesn't recognize you? " : "Already verified? "}
                                        <Text style={styles.footerLinkActive}>
                                            {mode === 'login' ? 'Request Access' : 'Secure Login'}
                                        </Text>
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.encryptionRow}>
                            <Ionicons name="lock-closed" size={12} color="rgba(255,255,255,0.4)" />
                            <Text style={styles.encryptionText}>AES-256 END-TO-END ENCRYPTION ACTIVE</Text>
                        </View>

                        <View style={{ height: 40 }} />
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    outer: { flex: 1 },
    scroll: { flexGrow: 1, paddingTop: 40 },

    hero: { alignItems: 'center', marginBottom: 40 },
    logoBadge: { width: 80, height: 80, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)', marginBottom: 16 },
    logoTitle: { fontSize: 32, fontWeight: '900', color: Colors.white, letterSpacing: 1 },
    logoSub: { fontSize: 11, fontWeight: '800', color: 'rgba(255,255,255,0.5)', letterSpacing: 3, marginTop: 4 },

    card: { backgroundColor: Colors.white, marginHorizontal: 20, borderRadius: 32, padding: 24, ...Shadows.premium },

    tabRow: { flexDirection: 'row', backgroundColor: '#F1F5F9', borderRadius: 16, padding: 5, marginBottom: 28 },
    tab: { flex: 1, paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
    tabActive: { backgroundColor: Colors.primary, ...Shadows.small },
    tabText: { fontSize: 11, fontWeight: '900', color: '#64748B', letterSpacing: 1 },
    tabTextActive: { color: Colors.white },

    welcomeText: { fontSize: 24, fontWeight: '900', color: Colors.text, marginBottom: 6 },
    welcomeSub: { fontSize: 14, color: '#64748B', lineHeight: 20, marginBottom: 28, fontWeight: '500' },

    fieldWrap: { marginBottom: 20 },
    labelRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
    fieldLabel: { fontSize: 10, fontWeight: '900', color: '#94A3B8', letterSpacing: 1.5 },
    requiredDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: Colors.error },
    inputBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', borderRadius: 16, paddingHorizontal: 16, height: 56, borderWidth: 1.5, borderColor: '#F1F5F9', gap: 12 },
    input: { flex: 1, height: '100%', fontSize: 15, color: Colors.text, fontWeight: '600' },

    submitBtn: { height: 64, borderRadius: 20, overflow: 'hidden', marginTop: 10, ...Shadows.glow(Colors.primary) },
    submitGradient: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 12 },
    submitText: { color: Colors.white, fontSize: 15, fontWeight: '900', letterSpacing: 1 },

    footerLinkWrap: { marginTop: 24, alignItems: 'center' },
    footerLinkText: { fontSize: 13, color: '#64748B', fontWeight: '500' },
    footerLinkActive: { color: Colors.primary, fontWeight: '900' },

    encryptionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 30 },
    encryptionText: { color: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: '800', letterSpacing: 1 },
});
