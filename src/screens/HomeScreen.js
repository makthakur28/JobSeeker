import React, { useState } from 'react';
import { 
  StyleSheet, Text, View, TextInput, TouchableOpacity, 
  FlatList, Modal, Linking, ActivityIndicator, SafeAreaView, Platform, Keyboard
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../theme/colors';
import JobCard from '../components/JobCard';
import FilterPills from '../components/FilterPills';
import { fetchJobsApi } from '../api/jobs';

const WORK_TYPES = ["Any", "Remote", "Hybrid", "On-site"];

export default function HomeScreen() {
  const [role, setRole] = useState('Software Engineer');
  const [location, setLocation] = useState('Worldwide');
  const [workType, setWorkType] = useState('Remote');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  const fetchJobs = async () => {
    if (!role) return;
    Keyboard.dismiss();
    setLoading(true);
    setJobs([]);
    try {
      const data = await fetchJobsApi(role, location, workType);
      if (Array.isArray(data)) setJobs(data);
    } catch (error) {
      alert('Network Error. Ensure your API is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTextGroup}>
          <Text style={styles.headerTitle}>Job Tracker</Text>
          <Text style={styles.headerSubtitle}>Find your next role with ease</Text>
        </View>
        <TouchableOpacity style={styles.avatarBox}>
            <Ionicons name="apps-outline" size={20} color={colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchSection}>
        <View style={styles.inputStack}>
            <View style={styles.inputWrapper}>
            <Ionicons name="search" size={18} color={colors.textMuted} style={styles.inputIcon} />
            <TextInput 
                style={styles.input}
                value={role}
                onChangeText={setRole}
                placeholder="Job Role (e.g. React Developer)"
                placeholderTextColor={colors.textMuted}
            />
            </View>
            <View style={[styles.inputWrapper, {marginTop: 10}]}>
            <Ionicons name="map-outline" size={18} color={colors.textMuted} style={styles.inputIcon} />
            <TextInput 
                style={styles.input}
                value={location}
                onChangeText={setLocation}
                placeholder="Location (e.g. Remote, NY, Worldwide)"
                placeholderTextColor={colors.textMuted}
            />
            </View>
        </View>
        
        <View style={styles.filterSection}>
            <FilterPills options={WORK_TYPES} selected={workType} onSelect={setWorkType} />
        </View>

        <TouchableOpacity style={styles.searchButton} onPress={fetchJobs}>
            <Text style={styles.searchBtnText}>Search Jobs</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.listContainer}>
        {loading ? (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={styles.loaderText}>Searching jobs everywhere...</Text>
            </View>
        ) : (
            <FlatList 
                data={jobs}
                keyExtractor={(item) => (item.title + item.company + item.apply_link).substring(0, 50)}
                renderItem={({ item }) => <JobCard job={item} onPress={() => setSelectedJob(item)}/>}
                contentContainerStyle={{ paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={() => (
                    <View style={styles.loaderContainer}>
                        <Ionicons name="list-circle-outline" size={40} color={colors.border} />
                        <Text style={[styles.loaderText, {marginTop: 15}]}>Tap Search to see open roles.</Text>
                    </View>
                )}
            />
        )}
      </View>

      {/* Modal */}
      <Modal visible={!!selectedJob} transparent animationType="slide">
        <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
                {selectedJob && (
                    <>
                        <View style={styles.modalHeaderRow}>
                            <View style={{flex: 1}}>
                                <Text style={styles.modalTitle}>{selectedJob.title}</Text>
                                <Text style={styles.modalCompany}>{selectedJob.company}</Text>
                            </View>
                            <TouchableOpacity onPress={() => setSelectedJob(null)} style={styles.closeBtn}>
                                <Ionicons name="close" size={24} color={colors.background} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.tagsRow}>
                            <View style={styles.tag}><Text style={styles.tagText}>{selectedJob.location}</Text></View>
                            <View style={styles.tag}><Text style={styles.tagText}>{selectedJob.job_type}</Text></View>
                            <View style={styles.tagBadge}>
                                <Ionicons name={selectedJob.source === 'LinkedIn' ? 'logo-linkedin' : 'globe-outline'} size={12} color="#000" />
                                <Text style={styles.tagBadgeText}>{selectedJob.source}</Text>
                            </View>
                        </View>

                        <Text style={styles.sectionHeader}>About the Role</Text>
                        <Text style={styles.modalDesc}>{selectedJob.description}</Text>

                        <TouchableOpacity 
                            style={styles.applyAction} 
                            onPress={() => Linking.openURL(selectedJob.apply_link)}
                        >
                            <Text style={styles.applyActionText}>Apply Directly</Text>
                            <Ionicons name="open-outline" size={18} color={colors.background} />
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
  container: { flex: 1, backgroundColor: colors.background, paddingTop: Platform.OS === 'android' ? 40 : 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 25, marginTop: 10 },
  headerTextGroup: { flex: 1 },
  headerTitle: { fontSize: 28, fontWeight: '800', color: colors.text, letterSpacing: -0.5 },
  headerSubtitle: { fontSize: 14, color: colors.textMuted, marginTop: 4, fontWeight: '500' },
  avatarBox: { width: 40, height: 40, borderRadius: 12, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, justifyContent: 'center', alignItems: 'center' },
  searchSection: { paddingHorizontal: 16 },
  inputStack: { backgroundColor: colors.card, padding: 12, borderRadius: 20, borderWidth: 1, borderColor: colors.border },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.background, borderRadius: 12, paddingHorizontal: 15, height: 50, borderWidth: 1, borderColor: colors.border },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, color: colors.text, fontSize: 15, fontWeight: '500' },
  filterSection: { marginHorizontal: -16, marginBottom: 15, marginTop: 5 },
  searchButton: { backgroundColor: colors.primary, height: 55, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  searchBtnText: { color: colors.background, fontSize: 16, fontWeight: '700' },
  listContainer: { flex: 1 },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 40 },
  loaderText: { color: colors.textMuted, marginTop: 15, fontSize: 14, fontWeight: '500' },
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.85)' },
  modalContent: { backgroundColor: '#18181b', padding: 25, borderTopLeftRadius: 35, borderTopRightRadius: 35, minHeight: '55%', borderWidth: 1, borderColor: '#27272a' },
  modalHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  modalTitle: { fontSize: 24, fontWeight: '700', color: colors.text, marginBottom: 8, letterSpacing: -0.5 },
  modalCompany: { fontSize: 16, color: colors.textMuted, fontWeight: '600' },
  closeBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center' },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 30 },
  tag: { backgroundColor: '#27272a', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8 },
  tagText: { color: '#fafafa', fontSize: 13, fontWeight: '600' },
  tagBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.text, paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8 },
  tagBadgeText: { color: colors.background, fontSize: 13, fontWeight: '700' },
  sectionHeader: { fontSize: 16, color: colors.text, fontWeight: '600', marginBottom: 10 },
  modalDesc: { color: colors.textMuted, fontSize: 15, lineHeight: 24, marginBottom: 40 },
  applyAction: { flexDirection: 'row', backgroundColor: colors.primary, height: 60, borderRadius: 16, justifyContent: 'center', alignItems: 'center', gap: 10 },
  applyActionText: { color: colors.background, fontSize: 17, fontWeight: '700' }
});
