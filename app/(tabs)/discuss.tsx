// ========================================
// GeoAdTech — Civic Discussion (Premium)
// ========================================
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef, useState } from 'react';
import {
    Animated,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors, Shadows } from '@/constants/theme';

type Message = {
    id: string;
    role: 'ai' | 'user';
    text: string;
    time: string;
};

const QUICK_QUESTIONS = [
    'Recent projects nearby?',
    'Metro Phase IV status',
    'How to report road damage',
    'Dwarka Expressway budget',
];

const getAIResponse = (query: string): string => {
    const q = query.toLowerCase();
    if (q.includes('metro') || q.includes('phase iv') || q.includes('phase 4')) {
        return 'Delhi Metro Phase IV is progressing rapidly with 45 new stations. Current completion is at 42%, with major progress on the Tughlakabad-Aerocity Line. Expected full service by 2028.';
    } else if (q.includes('dwarka') || q.includes('expressway')) {
        return 'The Dwarka Expressway (NH-248BB) is a massive 29km, 14-lane project now fully operational. It utilizes groundbreaking civil engineering and connects IGI Airport to Gurugram.';
    } else if (q.includes('report') || q.includes('issue') || q.includes('complaint')) {
        return 'To report a civic fault, use the "Report" tool in your Home dashboard. Choose from categories like Road, Power, or Water. Reports are geo-tagged and sent to the local municipality instantly.';
    } else if (q.includes('nearby') || q.includes('near me') || q.includes('location')) {
        return 'Our satellite telemetry shows active development in your sector. Check the Live Map tab to see exactly where project boundaries are and what works are in progress.';
    } else if (q.includes('budget') || q.includes('cost') || q.includes('investment')) {
        return 'Development is funded via transparent municipal allocations. For example, Metro Phase IV has a sanctioned budget of ₹24,948 Crore, focused on decongesting arterial roads.';
    } else if (q.includes('hello') || q.includes('hi') || q.includes('hey')) {
        return 'Namaste! I am your AI Civic Assistant. I can decode complex infrastructure data and help you navigate local developments. How can I assist you today?';
    } else {
        return 'I specialize in Delhi-NCR infrastructure, civic reporting, and project timelines. Try asking about specific Expressways, Metro lines, or how to use the geo-fence features.';
    }
};

const now = () => {
    const d = new Date();
    return `${d.getHours()}:${d.getMinutes().toString().padStart(2, '0')}`;
};

export default function DiscussScreen() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'ai',
            text: 'Namaste, Citizen! 🇮🇳 I am your Civic Intel Assistant. I can answer questions about urban development, project budgets, and reporting tools. How can I help you today?',
            time: now(),
        },
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const flatListRef = useRef<FlatList>(null);
    const typingAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (isTyping) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(typingAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
                    Animated.timing(typingAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
                ])
            ).start();
        } else {
            typingAnim.setValue(0);
        }
    }, [isTyping]);

    const sendMessage = (messageText?: string) => {
        const text = messageText || input;
        if (!text.trim()) return;

        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        const userMsg: Message = { id: Date.now().toString(), role: 'user', text: text.trim(), time: now() };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        setTimeout(() => {
            const aiResponse = getAIResponse(text);
            const aiMsg: Message = { id: (Date.now() + 1).toString(), role: 'ai', text: aiResponse, time: now() };
            setMessages(prev => [...prev, aiMsg]);
            setIsTyping(false);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
        }, 1200);

        setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    };

    const clearChat = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setMessages([{
            id: '1', role: 'ai',
            text: 'Session reset. I am ready to assist with civic inquiries.',
            time: now(),
        }]);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerSub}>DEMOCRACY DEPT AI</Text>
                    <Text style={styles.headerTitle}>Council Assistant</Text>
                </View>
                <View style={styles.headerActions}>
                    <TouchableOpacity style={styles.clearBtn} onPress={clearChat}>
                        <Ionicons name="trash-outline" size={20} color={Colors.textSecondary} />
                    </TouchableOpacity>
                </View>
            </View>

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
            >
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.list}
                    showsVerticalScrollIndicator={false}
                    onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                    renderItem={({ item }) => (
                        <View style={[styles.bubbleWrap, item.role === 'ai' ? styles.aiBubbleWrap : styles.userBubbleWrap]}>
                            {item.role === 'ai' && (
                                <LinearGradient colors={[Colors.primary, '#1E293B']} style={styles.aiAvatar}>
                                    <Ionicons name="sparkles" size={12} color={Colors.white} />
                                </LinearGradient>
                            )}
                            <View style={{ maxWidth: '80%' }}>
                                <View style={[styles.bubble, item.role === 'ai' ? styles.aiBubble : styles.userBubble]}>
                                    <Text style={[styles.bubbleText, item.role === 'user' && styles.userBubbleText]}>{item.text}</Text>
                                </View>
                                <Text style={[styles.timeText, item.role === 'user' && { textAlign: 'right' }]}>{item.time}</Text>
                            </View>
                        </View>
                    )}
                    ListFooterComponent={isTyping ? (
                        <View style={[styles.bubbleWrap, styles.aiBubbleWrap, { opacity: 0.7 }]}>
                            <LinearGradient colors={[Colors.primary, '#1E293B']} style={styles.aiAvatar}>
                                <Ionicons name="sparkles" size={12} color={Colors.white} />
                            </LinearGradient>
                            <Animated.View style={[styles.bubble, styles.aiBubble, { opacity: typingAnim }]}>
                                <Text style={styles.typingDots}>AI is thinking...</Text>
                            </Animated.View>
                        </View>
                    ) : null}
                />

                {/* Modern Contextual Answers */}
                <View style={styles.quickSection}>
                    <FlatList
                        horizontal
                        data={QUICK_QUESTIONS}
                        keyExtractor={q => q}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingHorizontal: 16, gap: 10 }}
                        renderItem={({ item }) => (
                            <TouchableOpacity style={styles.quickBtn} onPress={() => sendMessage(item)}>
                                <Text style={styles.quickText}>{item}</Text>
                            </TouchableOpacity>
                        )}
                    />
                </View>

                {/* Premium Input Hub */}
                <View style={styles.inputArea}>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Ask Council AI..."
                            placeholderTextColor="#94A3B8"
                            value={input}
                            onChangeText={setInput}
                            onSubmitEditing={() => sendMessage()}
                            returnKeyType="send"
                            multiline
                        />
                        <TouchableOpacity
                            style={[styles.sendBtn, !input.trim() && styles.sendBtnDisabled]}
                            onPress={() => sendMessage()}
                            disabled={!input.trim()}
                        >
                            <LinearGradient
                                colors={[Colors.primary, '#1E293B']}
                                style={styles.sendGradient}
                            >
                                <Ionicons name="send" size={18} color={Colors.white} />
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAFC' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14, backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: '#E2E8F0', ...Shadows.small },
    headerSub: { fontSize: 9, color: Colors.primary, fontWeight: '900', letterSpacing: 2 },
    headerTitle: { fontSize: 20, fontWeight: '900', color: Colors.text, marginTop: 1 },
    headerActions: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    clearBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center' },

    list: { padding: 20, paddingBottom: 24 },
    bubbleWrap: { flexDirection: 'row', marginBottom: 20, gap: 12, alignItems: 'flex-start' },
    aiBubbleWrap: { justifyContent: 'flex-start' },
    userBubbleWrap: { flexDirection: 'row-reverse', justifyContent: 'flex-start' },
    aiAvatar: { width: 30, height: 30, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginTop: 2 },
    bubble: { borderRadius: 20, padding: 16, ...Shadows.small },
    aiBubble: { backgroundColor: Colors.white, borderTopLeftRadius: 4 },
    userBubble: { backgroundColor: Colors.primary, borderTopRightRadius: 4 },
    bubbleText: { fontSize: 15, color: Colors.text, lineHeight: 22, fontWeight: '500' },
    userBubbleText: { color: Colors.white },
    timeText: { fontSize: 10, color: Colors.textMuted, marginTop: 6, fontWeight: '700' },
    typingDots: { color: Colors.primary, fontSize: 12, fontWeight: '800' },

    quickSection: { paddingVertical: 14, backgroundColor: '#F8FAFC' },
    quickBtn: { backgroundColor: Colors.white, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, borderWidth: 1, borderColor: '#E2E8F0', ...Shadows.small },
    quickText: { fontSize: 12, color: Colors.primary, fontWeight: '800' },

    inputArea: { padding: 16, paddingTop: 8, paddingBottom: Platform.OS === 'ios' ? 10 : 20, backgroundColor: Colors.white, borderTopWidth: 1, borderTopColor: '#E2E8F0' },
    inputContainer: { flexDirection: 'row', alignItems: 'flex-end', gap: 12 },
    input: { flex: 1, minHeight: 48, maxHeight: 120, backgroundColor: '#F1F5F9', borderRadius: 24, paddingHorizontal: 20, paddingVertical: 14, color: Colors.text, fontSize: 15, fontWeight: '500' },
    sendBtn: { width: 48, height: 48, borderRadius: 24, overflow: 'hidden', ...Shadows.premium },
    sendGradient: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    sendBtnDisabled: { opacity: 0.5, shadowOpacity: 0 },
});
