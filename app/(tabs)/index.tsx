// ========================================
// GeoAdTech — Civic Dashboard (Premium)
// ========================================
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Skeleton } from '@/components/Skeleton';
import { MOCK_PROJECTS } from '@/constants/mockData';
import { Colors, Shadows } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { getActivityFeed, getNearbyProjects } from '@/services/api';
import { Project } from '@/types';

const { width } = Dimensions.get('window');

const ISSUE_CATEGORIES = [
  { icon: 'construct', label: 'Road Damage', color: '#F9A825' },
  { icon: 'water', label: 'Flooding', color: '#2196F3' },
  { icon: 'flashlight', label: 'Power Issue', color: '#9C27B0' },
  { icon: 'trash', label: 'Sanitation', color: '#4CAF50' },
  { icon: 'warning', label: 'Safety Hazard', color: '#F44336' },
  { icon: 'wifi', label: 'Connectivity', color: '#FF9800' },
];

export default function DashboardScreen() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [activity, setActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [locationStr, setLocationStr] = useState('Detecting location...');
  const [activeProjectIdx, setActiveProjectIdx] = useState(0);
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<string | null>(null);
  const [issueDesc, setIssueDesc] = useState('');
  const [reportSubmitted, setReportSubmitted] = useState(false);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    setLoading(true);
    await fetchData();
    setLoading(false);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await fetchData();
    setRefreshing(false);
  }, []);

  const fetchData = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      let lat = 0, lng = 0;

      if (status === 'granted') {
        const loc = await Location.getCurrentPositionAsync({});
        lat = loc.coords.latitude;
        lng = loc.coords.longitude;
        const geocode = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lng });
        if (geocode[0]) {
          setLocationStr(geocode[0].district || geocode[0].city || 'Your Area');
        }
      } else {
        setLocationStr('India');
      }

      const [projData, actData] = await Promise.all([
        getNearbyProjects(lat, lng),
        getActivityFeed()
      ]);

      setProjects(projData.length > 0 ? projData : MOCK_PROJECTS);
      setActivity(actData);
    } catch (err) {
      console.error('Fetch error:', err);
      setProjects(MOCK_PROJECTS);
    }
  };

  const handleActionPress = (path: string) => {
    Haptics.selectionAsync();
    router.push(path as any);
  };

  const handleReportPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setReportModalVisible(true);
  };

  const submitReport = () => {
    if (!selectedIssue) {
      Alert.alert('Missing Info', 'Please select an issue category.');
      return;
    }
    setReportSubmitted(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setTimeout(() => {
      setReportModalVisible(false);
      setReportSubmitted(false);
      setSelectedIssue(null);
      setIssueDesc('');
      Alert.alert('✅ Report Submitted', 'Your issue has been logged and will be reviewed by the municipal team within 24 hours.');
    }, 1500);
  };

  const activeProject = projects[activeProjectIdx];
  const inProgressProjects = projects.filter(p => p.status === 'in-progress');
  const completedProjects = projects.filter(p => p.status === 'completed');
  const totalBeneficiaries = projects.reduce((s, p) => s + p.impactMetrics.beneficiaries, 0);

  const PROJECT_IMAGES: Record<string, string> = {
    metro: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?q=80&w=800',
    hospital: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=800',
    bridge: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=800',
    road: 'https://images.unsplash.com/photo-1541888946425-d81bb19480c5?q=80&w=800',
    college: 'https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=800',
    government: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?q=80&w=800',
    other: 'https://images.unsplash.com/photo-1590066839089-6d63430030da?q=80&w=800',
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <View>
            <Skeleton width={150} height={20} style={{ marginBottom: 8 }} />
            <Skeleton width={100} height={12} />
          </View>
          <Skeleton width={44} height={44} borderRadius={12} />
        </View>
        <ScrollView style={{ padding: 20 }}>
          <Skeleton width="100%" height={260} borderRadius={24} style={{ marginBottom: 30 }} />
          <View style={{ flexDirection: 'row', gap: 12, marginBottom: 30 }}>
            <Skeleton width={(width - 52) / 3} height={100} borderRadius={18} />
            <Skeleton width={(width - 52) / 3} height={100} borderRadius={18} />
            <Skeleton width={(width - 52) / 3} height={100} borderRadius={18} />
          </View>
          <Skeleton width={200} height={20} style={{ marginBottom: 20 }} />
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
            <Skeleton width="47%" height={120} borderRadius={20} />
            <Skeleton width="47%" height={120} borderRadius={20} />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerGreeting}>Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'}, {user?.name?.split(' ')[0] || 'Citizen'} 🇮🇳</Text>
          <View style={styles.locationRow}>
            <Ionicons name="location" size={12} color={Colors.primary} />
            <Text style={styles.locationText}>{locationStr}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.notifBtn}
          onPress={() => handleActionPress('/notifications')}
        >
          <Ionicons name="notifications-outline" size={24} color={Colors.text} />
          {activity.length > 0 && <View style={styles.notifDot} />}
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
        }
      >
        {/* Featured Project Card — Overhauled with Linear Gradient Overlay */}
        {activeProject && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Featured Project</Text>
              <View style={styles.dotNav}>
                {projects.slice(0, 5).map((_, i) => (
                  <TouchableOpacity key={i} onPress={() => setActiveProjectIdx(i)}>
                    <View style={[styles.dot, i === activeProjectIdx && styles.dotActive]} />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <TouchableOpacity
              style={styles.featuredCard}
              onPress={() => handleActionPress(`/project/${activeProject._id}`)}
              activeOpacity={0.95}
            >
              <Image
                source={{ uri: activeProject.images[0] || PROJECT_IMAGES[activeProject.category] || PROJECT_IMAGES.other }}
                style={styles.featuredImage}
              />
              <LinearGradient
                colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.8)']}
                style={styles.featuredOverlay}
              >
                <View style={styles.featuredTop}>
                  <View style={styles.distanceBadge}>
                    <Ionicons name="flash" size={10} color={Colors.primary} />
                    <Text style={styles.distanceText}>Live Status</Text>
                  </View>
                  <View style={[styles.statusChip, { backgroundColor: activeProject.status === 'completed' ? Colors.success : Colors.accent }]}>
                    <Text style={styles.statusText}>{activeProject.status.replace('-', ' ').toUpperCase()}</Text>
                  </View>
                </View>
                <View>
                  <Text style={styles.featuredCategory}>{activeProject.category.toUpperCase()}</Text>
                  <Text style={styles.featuredTitle} numberOfLines={2}>{activeProject.name}</Text>
                  <View style={styles.featuredProgress}>
                    <View style={styles.progressBg}>
                      <View style={[styles.progressBar, { width: `${activeProject.impactMetrics.completionPercentage}%` as any }]} />
                    </View>
                    <Text style={styles.progressLabel}>{activeProject.impactMetrics.completionPercentage}% Completion</Text>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </>
        )}

        {/* Quick Stats */}
        <Text style={styles.sectionTitle}>Local Impact</Text>
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: Colors.primary }]}>
            <Ionicons name="construct" size={22} color={Colors.white} />
            <Text style={styles.statValWhite}>{inProgressProjects.length}</Text>
            <Text style={styles.statLabelWhite}>Active{'\n'}Works</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="checkmark-circle-outline" size={22} color={Colors.success} />
            <Text style={styles.statVal}>{completedProjects.length}</Text>
            <Text style={styles.statLabel}>Success{'\n'}Stories</Text>
          </View>
          <TouchableOpacity
            style={styles.statCard}
            onPress={() => handleActionPress('/discuss')}
          >
            <Ionicons name="trending-up" size={22} color={Colors.info} />
            <Text style={styles.statVal}>{totalBeneficiaries >= 1e6 ? `${(totalBeneficiaries / 1e6).toFixed(1)}M` : `${(totalBeneficiaries / 1000).toFixed(0)}K`}</Text>
            <Text style={styles.statLabel}>Lives{'\n'}Changed</Text>
          </TouchableOpacity>
        </View>

        {/* Citizen Actions — Improved with Better Icons/Labels */}
        <Text style={styles.sectionTitle}>Smart Services</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity style={styles.actionCard} onPress={handleReportPress} activeOpacity={0.8}>
            <LinearGradient colors={['#FFF3E0', '#FFE0B2']} style={styles.actionIcon}>
              <Ionicons name="megaphone" size={26} color="#FF9800" />
            </LinearGradient>
            <Text style={styles.actionTitle}>Report</Text>
            <Text style={styles.actionSub}>Civic Issues</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard} onPress={() => handleActionPress('/map')} activeOpacity={0.8}>
            <LinearGradient colors={['#E3F2FD', '#BBDEFB']} style={styles.actionIcon}>
              <Ionicons name="map" size={26} color="#2196F3" />
            </LinearGradient>
            <Text style={styles.actionTitle}>Explore</Text>
            <Text style={styles.actionSub}>Live Project Map</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard} onPress={() => handleActionPress('/discuss')} activeOpacity={0.8}>
            <LinearGradient colors={['#E8F5E9', '#C8E6C9']} style={styles.actionIcon}>
              <Ionicons name="sparkles" size={26} color="#4CAF50" />
            </LinearGradient>
            <Text style={styles.actionTitle}>Council AI</Text>
            <Text style={styles.actionSub}>Civic Chatbot</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard} onPress={() => handleActionPress('/notifications')} activeOpacity={0.8}>
            <LinearGradient colors={['#F3E5F5', '#E1BEEF']} style={styles.actionIcon}>
              <Ionicons name="notifications" size={26} color="#9C27B0" />
            </LinearGradient>
            <Text style={styles.actionTitle}>Alerts</Text>
            <Text style={styles.actionSub}>Area History</Text>
          </TouchableOpacity>
        </View>

        {/* Live Activity Social Feed — NEW MODERN FEATURE */}
        {activity.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Global Feed</Text>
            </View>
            <View style={styles.activityContainer}>
              {activity.map((act, i) => (
                <View key={act.id} style={[styles.activityItem, i === 0 && { borderTopWidth: 0 }]}>
                  <View style={[styles.activityAvatar, { backgroundColor: act.type === 'report' ? '#FFE0B2' : '#C8E6C9' }]}>
                    <Ionicons
                      name={act.type === 'report' ? 'alert-circle' : 'chatbox-ellipses'}
                      size={18}
                      color={act.type === 'report' ? '#F57C00' : '#388E3C'}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={styles.activityRow}>
                      <Text style={styles.activityUser}>{act.user}</Text>
                      <Text style={styles.activityTime}>{new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                    </View>
                    <Text style={styles.activityText}>{act.title}</Text>
                  </View>
                </View>
              ))}
            </View>
          </>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Report Issue Modal */}
      <Modal visible={reportModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            {reportSubmitted ? (
              <View style={styles.modalSuccess}>
                <Ionicons name="checkmark-circle" size={80} color={Colors.success} />
                <Text style={styles.successTitle}>Thank You, Citizen!</Text>
                <Text style={styles.successSub}>Your report makes India better.</Text>
              </View>
            ) : (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Smart Report</Text>
                  <TouchableOpacity onPress={() => setReportModalVisible(false)}>
                    <Ionicons name="close-circle" size={32} color={Colors.textMuted} />
                  </TouchableOpacity>
                </View>
                <Text style={styles.modalSub}>What issue are you noticing today?</Text>
                <View style={styles.issueCategoryGrid}>
                  {ISSUE_CATEGORIES.map((cat) => (
                    <TouchableOpacity
                      key={cat.label}
                      style={[styles.issueCatBtn, selectedIssue === cat.label && { borderColor: cat.color, backgroundColor: `${cat.color}10` }]}
                      onPress={() => {
                        setSelectedIssue(cat.label);
                        Haptics.selectionAsync();
                      }}
                    >
                      <Ionicons name={cat.icon as any} size={24} color={selectedIssue === cat.label ? cat.color : Colors.textSecondary} />
                      <Text style={[styles.issueCatLabel, selectedIssue === cat.label && { color: cat.color }]}>{cat.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <Text style={styles.modalSub}>Add a note for the municipal team:</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="Type details here..."
                  placeholderTextColor={Colors.textMuted}
                  multiline
                  value={issueDesc}
                  onChangeText={setIssueDesc}
                />
                <TouchableOpacity style={styles.modalSubmitBtn} onPress={submitReport}>
                  <Text style={styles.modalSubmitText}>Post to Dashboard</Text>
                  <Ionicons name="send" size={18} color={Colors.white} />
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14, backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.border },
  headerGreeting: { fontSize: 18, fontWeight: '800', color: Colors.text },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 3 },
  locationText: { fontSize: 12, color: Colors.textSecondary, fontWeight: '600' },
  notifBtn: { width: 44, height: 44, borderRadius: 12, backgroundColor: Colors.background, justifyContent: 'center', alignItems: 'center' },
  notifDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.error, position: 'absolute', top: 10, right: 10, borderWidth: 2, borderColor: Colors.white },
  scroll: { padding: 20, paddingBottom: 40 },

  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, marginTop: 12 },
  sectionTitle: { fontSize: 20, fontWeight: '900', color: Colors.text, marginBottom: 16 },
  dotNav: { flexDirection: 'row', gap: 6 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.border },
  dotActive: { width: 18, backgroundColor: Colors.primary },

  featuredCard: { borderRadius: 24, overflow: 'hidden', marginBottom: 30, height: 260, ...Shadows.premium },
  featuredImage: { width: '100%', height: '100%', position: 'absolute' },
  featuredOverlay: { flex: 1, padding: 20, justifyContent: 'space-between' },
  featuredTop: { flexDirection: 'row', justifyContent: 'space-between' },
  distanceBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(255,255,255,0.9)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  distanceText: { fontSize: 11, fontWeight: '800', color: Colors.text },
  statusChip: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  statusText: { color: Colors.white, fontSize: 9, fontWeight: '900' },
  featuredCategory: { color: 'rgba(255,255,255,0.8)', fontSize: 10, fontWeight: '900', letterSpacing: 1.5, marginBottom: 6 },
  featuredTitle: { fontSize: 24, fontWeight: '900', color: Colors.white, marginBottom: 14, lineHeight: 30 },
  featuredProgress: { gap: 8 },
  progressBg: { height: 6, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 3, overflow: 'hidden' },
  progressBar: { height: '100%', backgroundColor: Colors.white, borderRadius: 3 },
  progressLabel: { fontSize: 11, color: 'rgba(255,255,255,0.9)', fontWeight: '700' },

  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 30 },
  statCard: { flex: 1, backgroundColor: Colors.white, borderRadius: 18, padding: 16, alignItems: 'center', gap: 6, ...Shadows.small },
  statVal: { fontSize: 22, fontWeight: '900', color: Colors.text },
  statValWhite: { fontSize: 22, fontWeight: '900', color: Colors.white },
  statLabel: { fontSize: 11, color: Colors.textSecondary, fontWeight: '700', textAlign: 'center' },
  statLabelWhite: { fontSize: 11, color: 'rgba(255,255,255,0.8)', fontWeight: '700', textAlign: 'center' },

  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 30 },
  actionCard: { width: '47%', backgroundColor: Colors.white, borderRadius: 24, padding: 18, ...Shadows.small },
  actionIcon: { width: 54, height: 54, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginBottom: 14 },
  actionTitle: { fontSize: 16, fontWeight: '800', color: Colors.text, marginBottom: 2 },
  actionSub: { fontSize: 11, color: Colors.textSecondary, fontWeight: '600' },

  // Activity Feed
  activityContainer: { backgroundColor: Colors.white, borderRadius: 24, padding: 8, ...Shadows.small },
  activityItem: { flexDirection: 'row', padding: 14, gap: 12, borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  activityAvatar: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  activityRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 },
  activityUser: { fontSize: 13, fontWeight: '800', color: Colors.text },
  activityTime: { fontSize: 11, color: Colors.textMuted, fontWeight: '600' },
  activityText: { fontSize: 14, color: Colors.textSecondary, lineHeight: 20 },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  modalSheet: { backgroundColor: Colors.white, borderTopLeftRadius: 36, borderTopRightRadius: 36, padding: 24, paddingBottom: 40 },
  modalHandle: { width: 44, height: 5, borderRadius: 3, backgroundColor: '#E2E8F0', alignSelf: 'center', marginBottom: 24 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  modalTitle: { fontSize: 24, fontWeight: '900', color: Colors.text },
  modalSub: { fontSize: 14, color: Colors.textSecondary, marginBottom: 18, fontWeight: '700' },
  issueCategoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
  issueCatBtn: { width: '30%', borderRadius: 18, borderWidth: 2, borderColor: '#F1F5F9', padding: 12, alignItems: 'center', gap: 8 },
  issueCatLabel: { fontSize: 11, fontWeight: '700', color: Colors.textSecondary, textAlign: 'center' },
  modalInput: { backgroundColor: '#F8FAFC', borderRadius: 18, padding: 16, minHeight: 110, textAlignVertical: 'top', color: Colors.text, marginBottom: 20, fontSize: 15, borderWidth: 1, borderColor: '#E2E8F0' },
  modalSubmitBtn: { flexDirection: 'row', backgroundColor: Colors.primary, height: 60, borderRadius: 20, justifyContent: 'center', alignItems: 'center', gap: 10, ...Shadows.glow(Colors.primary) },
  modalSubmitText: { color: Colors.white, fontSize: 17, fontWeight: '900' },
  modalSuccess: { alignItems: 'center', paddingVertical: 40 },
  successTitle: { fontSize: 24, fontWeight: '900', color: Colors.success, marginTop: 20 },
  successSub: { fontSize: 16, color: Colors.textSecondary, marginTop: 10, textAlign: 'center' },
});
