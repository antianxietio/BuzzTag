/**
 * ChatBubble Component
 * Displays individual chat messages with animations
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../styles';

const ChatBubble = ({ message, isBot, animated = true, delay = 0, timestamp, onLongPress }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;
    const scaleAnim = useRef(new Animated.Value(0.8)).current;

    useEffect(() => {
        if (animated) {
            Animated.sequence([
                Animated.delay(delay),
                Animated.parallel([
                    Animated.spring(fadeAnim, {
                        toValue: 1,
                        tension: 50,
                        friction: 7,
                        useNativeDriver: true,
                    }),
                    Animated.spring(slideAnim, {
                        toValue: 0,
                        tension: 50,
                        friction: 7,
                        useNativeDriver: true,
                    }),
                    Animated.spring(scaleAnim, {
                        toValue: 1,
                        tension: 50,
                        friction: 7,
                        useNativeDriver: true,
                    }),
                ]),
            ]).start();
        } else {
            fadeAnim.setValue(1);
            slideAnim.setValue(0);
            scaleAnim.setValue(1);
        }
    }, []);

    return (
        <Animated.View
            style={[
                styles.container,
                isBot ? styles.botContainer : styles.userContainer,
                {
                    opacity: fadeAnim,
                    transform: [
                        { translateY: slideAnim },
                        { scale: scaleAnim },
                    ],
                },
            ]}
        >
            {isBot && <Text style={styles.label}>BuzzTag 💬</Text>}
            <TouchableOpacity
                onLongPress={onLongPress}
                activeOpacity={0.9}
                disabled={!onLongPress}
            >
                <View style={[styles.bubble, isBot ? styles.botBubble : styles.userBubble]}>
                    <Text style={styles.text}>{message}</Text>
                    {timestamp && (
                        <Text style={styles.timestamp}>{timestamp}</Text>
                    )}
                </View>
            </TouchableOpacity>
            {!isBot && <Text style={styles.label}>You</Text>}
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 8,
        maxWidth: '80%',
    },
    botContainer: {
        alignSelf: 'flex-start',
        alignItems: 'flex-start',
    },
    userContainer: {
        alignSelf: 'flex-end',
        alignItems: 'flex-end',
    },
    bubble: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 20,
        marginTop: 4,
    },
    botBubble: {
        backgroundColor: COLORS.botBubble,
        borderBottomLeftRadius: 4,
    },
    userBubble: {
        backgroundColor: COLORS.userBubble,
        borderBottomRightRadius: 4,
    },
    text: {
        color: COLORS.text,
        fontSize: 16,
        lineHeight: 22,
    },
    timestamp: {
        color: COLORS.textSecondary,
        fontSize: 11,
        marginTop: 4,
        alignSelf: 'flex-end',
    },
    label: {
        color: COLORS.textSecondary,
        fontSize: 12,
        paddingHorizontal: 4,
        marginBottom: 2,
    },
});

export default ChatBubble;
