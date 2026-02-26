// ========================================
// GeoAdTech — Citizen Discuss (Stitch Style)
// ========================================
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
    FlatList,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import { Colors, Shadows } from '@/constants/theme';

export default function DiscussScreen() {
    const [messages, setMessages] = useState([
        { id: '1', role: 'ai', text: 'Hello citizen! I am your Civic Assistant. Have a question about a project nearby?' },
        { id: '2', role: 'user', text: 'When will the Delhi Metro Phase IV be completed?' },
        { id: '3', role: 'ai', text: 'Phase IV is currently 42% complete. Completion for the primary corridors is expected by June 2028.' },
    ]);
    const [input, setInput] = useState('');

    const sendMessage = () => {
        if (!input) return;
        setMessages([...messages, { id: Date.now().toString(), role: 'user', text: input }]);
        // Mock response
        setTimeout(() => {
            setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), role: 'ai', text: 'I am checking official records for update on that project. Please wait...' }]);
        }, 1000);
        setInput('');
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={100}
        >
            <View style={styles.header}>
                <Text style={styles.headerSubtitle}>Community Hub</Text>
                <Text style={styles.headerTitle}>Civic Discussion</Text>
            </View>

            <FlatList
                data={messages}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.list}
                renderItem={({ item }) => (
                    <View style={[styles.bubble, item.role === 'ai' ? styles.aiBubble : styles.userBubble]}>
                        <Text style={[styles.messageText, item.role === 'ai' ? styles.aiText : styles.userText]}>{item.text}</Text>
                    </View>
                )}
            />

            <View style={styles.inputArea}>
                <TextInput
                    style={styles.input}
                    placeholder="Ask about local development..."
                    value={input}
                    onChangeText={setInput}
                />
                <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
                    <Ionicons name="send" size={18} color={Colors.white} />
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    header: { paddingTop: 60, paddingHorizontal: 25, paddingBottom: 20, backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.border },
    headerSubtitle: { fontSize: 10, color: Colors.primary, fontWeight: '800', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 },
    headerTitle: { fontSize: 24, fontWeight: '900', color: Colors.text },
    list: { padding: 20, paddingBottom: 100 },
    bubble: { padding: 15, borderRadius: 15, marginBottom: 12, maxWidth: '85%' },
    aiBubble: { alignSelf: 'flex-start', backgroundColor: Colors.surface, ...Shadows.small },
    userBubble: { alignSelf: 'flex-end', backgroundColor: Colors.primary },
    aiText: { color: Colors.text },
    userText: { color: Colors.white },
    messageText: { fontSize: 14, lineHeight: 20 },
    inputArea: { flexDirection: 'row', padding: 15, backgroundColor: Colors.white, borderTopWidth: 1, borderTopColor: Colors.border, gap: 10, alignItems: 'center' },
    input: { flex: 1, height: 45, backgroundColor: Colors.background, borderRadius: 25, paddingHorizontal: 20, color: Colors.text },
    sendBtn: { width: 45, height: 45, borderRadius: 22.5, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center' }
});
