// ========================================
// GeoAdTech — Action Hub (Placeholder)
// ========================================
import { Colors, Shadows } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function CreateScreen() {
    return (
        <View style={styles.container}>
            <Ionicons name="add-circle" size={80} color={Colors.primary} />
            <Text style={styles.title}>Submit Development</Text>
            <Text style={styles.subtitle}>Help us track new projects in your neighborhood.</Text>
            <TouchableOpacity style={styles.btn}>
                <Text style={styles.btnText}>Start Report</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background, justifyContent: 'center', alignItems: 'center', padding: 40 },
    title: { fontSize: 24, fontWeight: '900', color: Colors.text, marginTop: 20 },
    subtitle: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', marginTop: 10, lineHeight: 22 },
    btn: { backgroundColor: Colors.primary, paddingHorizontal: 30, paddingVertical: 15, borderRadius: 15, marginTop: 30, ...Shadows.medium },
    btnText: { color: Colors.white, fontWeight: '800', fontSize: 16 }
});
