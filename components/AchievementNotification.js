import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

const AchievementNotification = ({ achievement, onDismiss }) => {
    const slideAnim = useRef(new Animated.Value(-100)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Slide in and fade in
        Animated.parallel([
            Animated.spring(slideAnim, {
                toValue: 0,
                tension: 50,
                friction: 8,
                useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start();

        // Auto dismiss after 4 seconds
        const timer = setTimeout(() => {
            dismissNotification();
        }, 4000);

        return () => clearTimeout(timer);
    }, []);

    const dismissNotification = () => {
        Animated.parallel([
            Animated.timing(slideAnim, {
                toValue: -100,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start(() => {
            if (onDismiss) onDismiss();
        });
    };

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    transform: [{ translateY: slideAnim }],
                    opacity: fadeAnim,
                },
            ]}
        >
            <Text style={styles.icon}>{achievement.icon}</Text>
            <View style={styles.content}>
                <Text style={styles.title}>Achievement Unlocked! 🎉</Text>
                <Text style={styles.achievementTitle}>{achievement.title}</Text>
                <Text style={styles.description}>{achievement.description}</Text>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 60,
        left: 16,
        right: 16,
        backgroundColor: '#1A1F3A',
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 10,
        shadowColor: '#00D9FF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        borderWidth: 2,
        borderColor: '#00D9FF',
        zIndex: 1000,
    },
    icon: {
        fontSize: 40,
        marginRight: 12,
    },
    content: {
        flex: 1,
    },
    title: {
        fontSize: 12,
        color: '#00D9FF',
        fontWeight: 'bold',
        marginBottom: 4,
    },
    achievementTitle: {
        fontSize: 16,
        color: '#FFF',
        fontWeight: 'bold',
        marginBottom: 2,
    },
    description: {
        fontSize: 12,
        color: '#999',
    },
});

export default AchievementNotification;
