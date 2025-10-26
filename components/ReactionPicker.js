import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const REACTIONS = ['❤️', '😂', '👍', '🔥', '🎉', '😮', '👏', '💯'];

const ReactionPicker = ({ onSelect, onClose }) => {
    return (
        <View style={styles.container}>
            <View style={styles.backdrop} onTouchStart={onClose} />
            <View style={styles.picker}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {REACTIONS.map((emoji) => (
                        <TouchableOpacity
                            key={emoji}
                            style={styles.reactionButton}
                            onPress={() => onSelect(emoji)}
                        >
                            <Text style={styles.reactionEmoji}>{emoji}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backdrop: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    picker: {
        backgroundColor: '#1A1F3A',
        borderRadius: 30,
        paddingVertical: 8,
        paddingHorizontal: 4,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    reactionButton: {
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    reactionEmoji: {
        fontSize: 32,
    },
});

export default ReactionPicker;
