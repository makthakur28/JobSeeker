import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import colors from '../theme/colors';

const FilterPills = ({ selected, options, onSelect }) => {
    return (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.container}>
            {options.map((opt) => {
                const isActive = selected === opt;
                return (
                    <TouchableOpacity 
                        key={opt}
                        onPress={() => onSelect(opt)}
                        style={[styles.pill, isActive && styles.pillActive]}
                    >
                        <Text style={[styles.text, isActive && styles.textActive]}>{opt}</Text>
                    </TouchableOpacity>
                );
            })}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flexDirection: 'row', marginVertical: 10, paddingHorizontal: 16 },
    pill: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        backgroundColor: colors.card,
        borderWidth: 1,
        borderColor: colors.border,
        marginRight: 10,
    },
    pillActive: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    text: { color: colors.textMuted, fontSize: 14, fontWeight: '600' },
    // Fix: Dark text on selected (white) pill for visibility
    textActive: { color: colors.background } 
});

export default FilterPills;
