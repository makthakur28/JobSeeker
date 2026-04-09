import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../theme/colors';

const JobCard = ({ job, onPress }) => {
    return (
        <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
            <View style={styles.mainRow}>
                <View style={styles.textContainer}>
                    <Text style={styles.title} numberOfLines={1}>{job.title}</Text>
                    <Text style={styles.company}>{job.company}</Text>
                </View>
                <View style={styles.sourceBadge}>
                    <Ionicons name={job.source === 'LinkedIn' ? 'logo-linkedin' : 'globe-outline'} size={12} color={colors.text} />
                    <Text style={styles.sourceText}>{job.source}</Text>
                </View>
            </View>
            <View style={styles.metaRow}>
                <View style={styles.metaItem}>
                    <Ionicons name="location-outline" size={14} color={colors.textMuted} />
                    <Text style={styles.metaText} numberOfLines={1}>{job.location}</Text>
                </View>
                <View style={styles.metaItem}>
                    <Ionicons name="time-outline" size={14} color={colors.textMuted} />
                    <Text style={styles.metaText}>{job.date_posted || 'Recent'}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.card,
        marginHorizontal: 16,
        marginBottom: 12,
        padding: 20,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.border,
    },
    mainRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 15 },
    textContainer: { flex: 1, paddingRight: 15 },
    title: { color: colors.text, fontSize: 18, fontWeight: '700', marginBottom: 6 },
    company: { color: colors.textMuted, fontSize: 15, fontWeight: '600' },
    sourceBadge: { 
        flexDirection: 'row', alignItems: 'center', gap: 6,
        backgroundColor: 'rgba(255,255,255,0.06)', 
        paddingHorizontal: 10, paddingVertical: 6, 
        borderRadius: 8, borderWidth: 1, borderColor: colors.border 
    },
    sourceText: { color: colors.text, fontSize: 10, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
    metaRow: { flexDirection: 'row', gap: 15, alignItems: 'center' },
    metaItem: { flexDirection: 'row', alignItems: 'center', gap: 6, flexShrink: 1 },
    metaText: { color: colors.textMuted, fontSize: 13, fontWeight: '500'}
});

export default JobCard;
