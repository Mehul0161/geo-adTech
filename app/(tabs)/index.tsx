// ========================================
// GeoAdTech — Civic Dashboard (Stitch UI)
// ========================================
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { Colors, Shadows } from '@/constants/theme';

export default function DashboardScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileBox}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100' }}
            style={styles.profileImg}
          />
        </View>
        <Text style={styles.headerTitle}>Civic Dashboard</Text>
        <TouchableOpacity style={styles.notifBtn} onPress={() => router.push('/notifications' as any)}>
          <Ionicons name="notifications" size={24} color={Colors.primary} />
          <View style={styles.notifBadge} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.greetingSection}>
          <Text style={styles.greeting}>Hello, Alex</Text>
          <View style={styles.locationRow}>
            <Ionicons name="location" size={14} color={Colors.primary} />
            <Text style={styles.locationText}>Downtown Sector</Text>
          </View>
        </View>

        {/* Nearby Development Card */}
        <Text style={styles.sectionTitle}>Nearby Development</Text>
        <TouchableOpacity
          style={styles.mainCard}
          onPress={() => router.push('/map' as any)}
          activeOpacity={0.9}
        >
          <View style={styles.cardHero}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1541888946425-d81bb19480c5?q=80&w=800' }}
              style={styles.cardImg}
            />
            <View style={styles.cardOverlay}>
              <View style={styles.distanceBadge}>
                <Ionicons name="location" size={12} color={Colors.text} />
                <Text style={styles.distanceText}>500m away</Text>
              </View>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>IN PROGRESS</Text>
              </View>
              <Text style={styles.cardTitle}>Harbor Bridge Expansion</Text>
            </View>
          </View>
          <View style={styles.cardBody}>
            <Text style={styles.cardDesc} numberOfLines={2}>
              A major infrastructure project aimed at reducing congestion in the downtown sector by adding t...
            </Text>
            <View style={styles.progressSection}>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: '75%' }]} />
              </View>
              <View style={styles.progressLabels}>
                <Text style={styles.label}>Progress</Text>
                <Text style={styles.val}>75%</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.viewBtn} onPress={() => router.push('/projects' as any)}>
              <Text style={styles.viewBtnText}>View Details</Text>
              <Ionicons name="arrow-forward" size={16} color={Colors.white} />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>

        {/* Impact Stats */}
        <Text style={styles.sectionTitle}>Impact Stats</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={[styles.statIconBox, { backgroundColor: '#E8EAF6' }]}>
              <Ionicons name="git-branch" size={24} color={Colors.primary} />
            </View>
            <Text style={styles.statVal}>12km</Text>
            <Text style={styles.statLabel}>ROADS BUILT</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIconBox, { backgroundColor: '#FFEBEE' }]}>
              <Ionicons name="add" size={24} color="#EF5350" />
            </View>
            <Text style={styles.statVal}>3</Text>
            <Text style={styles.statLabel}>HOSPITALS UPGRADED</Text>
          </View>
        </View>

        {/* Action Cards */}
        <View style={styles.actionGrid}>
          <TouchableOpacity style={styles.issueCard}>
            <Ionicons name="megaphone" size={32} color={Colors.primary} />
            <Text style={styles.actionText}>Report Issue</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.forumCard} onPress={() => router.push('/discuss' as any)}>
            <Ionicons name="chatbubbles" size={32} color="#757575" />
            <Text style={styles.actionText}>Community Forum</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border
  },
  profileBox: { width: 40, height: 40, borderRadius: 10, overflow: 'hidden', backgroundColor: '#F0F0F0' },
  profileImg: { width: '100%', height: '100%' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: Colors.text },
  notifBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center', position: 'relative' },
  notifBadge: { position: 'absolute', top: 8, right: 8, width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.error, borderWidth: 1.5, borderColor: Colors.white },

  scrollContent: { padding: 20 },
  greetingSection: { marginBottom: 25 },
  greeting: { fontSize: 32, fontWeight: '900', color: Colors.text, marginBottom: 5 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  locationText: { fontSize: 14, color: Colors.textSecondary, fontWeight: '600' },

  sectionTitle: { fontSize: 20, fontWeight: '900', color: Colors.text, marginBottom: 15, marginTop: 10 },

  mainCard: { backgroundColor: Colors.white, borderRadius: 25, overflow: 'hidden', ...Shadows.premium, marginBottom: 30 },
  cardHero: { height: 200, position: 'relative' },
  cardImg: { width: '100%', height: '100%' },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
    padding: 20,
    justifyContent: 'space-between'
  },
  distanceBadge: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6
  },
  distanceText: { fontSize: 11, fontWeight: '800', color: Colors.text },
  statusBadge: {
    backgroundColor: Colors.accent,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 5
  },
  statusText: { color: Colors.white, fontSize: 10, fontWeight: '900' },
  cardTitle: { color: Colors.white, fontSize: 24, fontWeight: '900', textShadowColor: 'rgba(0,0,0,0.3)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 4 },

  cardBody: { padding: 20 },
  cardDesc: { fontSize: 14, color: Colors.textSecondary, lineHeight: 22, marginBottom: 20 },
  progressSection: { marginBottom: 20 },
  progressBar: { height: 8, backgroundColor: '#F0F0F0', borderRadius: 4, overflow: 'hidden', marginBottom: 8 },
  progressFill: { height: '100%', backgroundColor: Colors.primary, borderRadius: 4 },
  progressLabels: { flexDirection: 'row', justifyContent: 'space-between' },
  label: { fontSize: 12, color: Colors.textMuted, fontWeight: '700' },
  val: { fontSize: 12, color: Colors.text, fontWeight: '900' },
  viewBtn: {
    backgroundColor: Colors.primary,
    height: 55,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    ...Shadows.glow(Colors.primary)
  },
  viewBtnText: { color: Colors.white, fontSize: 16, fontWeight: '800' },

  statsGrid: { flexDirection: 'row', gap: 15, marginBottom: 25 },
  statCard: { flex: 1, backgroundColor: Colors.white, borderRadius: 20, padding: 20, ...Shadows.small },
  statIconBox: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  statVal: { fontSize: 24, fontWeight: '900', color: Colors.text, marginBottom: 4 },
  statLabel: { fontSize: 10, color: Colors.textMuted, fontWeight: '800' },

  actionGrid: { flexDirection: 'row', gap: 15 },
  issueCard: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderStyle: 'dashed'
  },
  forumCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.small
  },
  actionText: { marginTop: 15, fontSize: 14, fontWeight: '800', color: Colors.textSecondary }
});
