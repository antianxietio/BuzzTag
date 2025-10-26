/**
 * TypingIndicator Component
 * Animated three-dot indicator for bot typing
 */

import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Text } from 'react-native';
import { COLORS } from '../styles';

const TypingIndicator = () => {
    const dot1 = useRef(new Animated.Value(0)).current;
    const dot2 = useRef(new Animated.Value(0)).current;
    const dot3 = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(20)).current;

    useEffect(() => {
        // Entrance animation
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.spring(slideAnim, {
                toValue: 0,
                tension: 50,
                friction: 7,
                useNativeDriver: true,
            }),
        ]).start();

        // Dot bounce animation
        const animateDot = (dot, delay) => {
            return Animated.loop(
                Animated.sequence([
                    Animated.delay(delay),
                    Animated.spring(dot, {
                        toValue: -10,
                        tension: 100,
                        friction: 4,
                        useNativeDriver: true,
                    }),
                    Animated.spring(dot, {
                        toValue: 0,
                        tension: 100,
                        friction: 4,
                        useNativeDriver: true,
                    }),
                ])
            );
        };

        const animations = Animated.parallel([
            animateDot(dot1, 0),
            animateDot(dot2, 200),
            animateDot(dot3, 400),
        ]);

        animations.start();

        return () => animations.stop();
    }, []);

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }],
                },
            ]}
        >
            <Text style={styles.label}>BuzzTag 💬</Text>
            <View style={styles.bubble}>
                <Animated.View style={[styles.dot, { transform: [{ translateY: dot1 }] }]} />
                <Animated.View style={[styles.dot, { transform: [{ translateY: dot2 }] }]} />
                <Animated.View style={[styles.dot, { transform: [{ translateY: dot3 }] }]} />
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignSelf: 'flex-start',
        marginVertical: 8,
        maxWidth: '80%',
    },
    label: {
        color: COLORS.textSecondary,
        fontSize: 12,
        paddingHorizontal: 4,
        marginBottom: 4,
    },
    bubble: {
        flexDirection: 'row',
        backgroundColor: COLORS.botBubble,
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderRadius: 20,
        borderBottomLeftRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: COLORS.accent,
        marginHorizontal: 4,
    },
});

export default TypingIndicator;
