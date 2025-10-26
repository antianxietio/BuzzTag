import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Animated,
    Dimensions,
    Platform,
} from 'react-native';

const { width } = Dimensions.get('window');

// Emoji avatar options
const AVATAR_EMOJIS = [
    '😀', '😎', '🤓', '😊', '🥳', '🤖',
    '👽', '🐱', '🐶', '🐼', '🦊', '🦁',
    '🌟', '⚡', '🔥', '💎', '🎮', '🎨',
    '🚀', '🌈', '🎭', '🎪', '🎯', '🏆',
];

const ProfileSetup = ({ onComplete }) => {
    const [username, setUsername] = useState('');
    const [selectedAvatar, setSelectedAvatar] = useState('😊');
    const [error, setError] = useState('');
    const [fadeAnim] = useState(new Animated.Value(0));
    const [slideAnim] = useState(new Animated.Value(50));

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
            }),
            Animated.spring(slideAnim, {
                toValue: 0,
                tension: 50,
                friction: 8,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const validateUsername = (text) => {
        setUsername(text);
        setError('');

        if (text.length > 0 && text.length < 3) {
            setError('Username must be at least 3 characters');
        } else if (text.length > 20) {
            setError('Username must be less than 20 characters');
        } else if (!/^[a-zA-Z0-9_\s]*$/.test(text)) {
            setError('Only letters, numbers, spaces, and _ allowed');
        }
    };

    const handleComplete = () => {
        if (username.trim().length < 3) {
            setError('Please enter a valid username');
            return;
        }

        const profile = {
            username: username.trim(),
            avatar: selectedAvatar,
            createdAt: new Date().toISOString(),
            stats: {
                messagesSent: 0,
                devicesConnected: 0,
                questionsAnswered: 0,
                daysActive: 0,
            },
        };

        onComplete(profile);
    };

    return (
        <View style={styles.container}>
            <Animated.View
                style={[
                    styles.content,
                    {
                        opacity: fadeAnim,
                        transform: [{ translateY: slideAnim }],
                    },
                ]}
            >
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>Welcome to BuzzTag! 🎉</Text>
                    <Text style={styles.subtitle}>
                        Let's set up your profile to get started
                    </Text>
                </View>

                {/* Avatar Selection */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Choose Your Avatar</Text>
                    <View style={styles.selectedAvatarContainer}>
                        <Text style={styles.selectedAvatar}>{selectedAvatar}</Text>
                    </View>

                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.avatarGrid}
                    >
                        {AVATAR_EMOJIS.map((emoji) => (
                            <TouchableOpacity
                                key={emoji}
                                style={[
                                    styles.avatarOption,
                                    selectedAvatar === emoji && styles.avatarOptionSelected,
                                ]}
                                onPress={() => setSelectedAvatar(emoji)}
                            >
                                <Text style={styles.avatarEmoji}>{emoji}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Username Input */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Choose Your Username</Text>
                    <TextInput
                        style={[styles.input, error ? styles.inputError : null]}
                        value={username}
                        onChangeText={validateUsername}
                        placeholder="Enter username..."
                        placeholderTextColor="#999"
                        maxLength={20}
                        autoCapitalize="none"
                        autoCorrect={false}
                    />
                    {error ? (
                        <Text style={styles.errorText}>{error}</Text>
                    ) : (
                        <Text style={styles.helperText}>
                            {username.length}/20 characters
                        </Text>
                    )}
                </View>

                {/* Preview */}
                <View style={styles.previewSection}>
                    <Text style={styles.previewLabel}>Preview</Text>
                    <View style={styles.previewCard}>
                        <Text style={styles.previewAvatar}>{selectedAvatar}</Text>
                        <Text style={styles.previewUsername}>
                            {username || 'Your Name'}
                        </Text>
                    </View>
                </View>

                {/* Complete Button */}
                <TouchableOpacity
                    style={[
                        styles.completeButton,
                        (!username || error) && styles.completeButtonDisabled,
                    ]}
                    onPress={handleComplete}
                    disabled={!username || !!error}
                >
                    <Text style={styles.completeButtonText}>
                        Get Started 🚀
                    </Text>
                </TouchableOpacity>

                {/* Info */}
                <Text style={styles.infoText}>
                    You can change these settings later in your profile
                </Text>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0A0E27',
    },
    content: {
        flex: 1,
        padding: 24,
    },
    header: {
        alignItems: 'center',
        marginTop: 40,
        marginBottom: 40,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#999',
        textAlign: 'center',
    },
    section: {
        marginBottom: 32,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFF',
        marginBottom: 16,
    },
    selectedAvatarContainer: {
        alignSelf: 'center',
        width: 100,
        height: 100,
        backgroundColor: '#1A1F3A',
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        borderWidth: 3,
        borderColor: '#00D9FF',
    },
    selectedAvatar: {
        fontSize: 60,
    },
    avatarGrid: {
        paddingVertical: 8,
    },
    avatarOption: {
        width: 60,
        height: 60,
        backgroundColor: '#1A1F3A',
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 6,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    avatarOptionSelected: {
        borderColor: '#00D9FF',
        backgroundColor: '#2A3F5A',
    },
    avatarEmoji: {
        fontSize: 32,
    },
    input: {
        backgroundColor: '#1A1F3A',
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        color: '#FFF',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    inputError: {
        borderColor: '#FF4444',
    },
    errorText: {
        color: '#FF4444',
        fontSize: 12,
        marginTop: 8,
        marginLeft: 4,
    },
    helperText: {
        color: '#666',
        fontSize: 12,
        marginTop: 8,
        marginLeft: 4,
    },
    previewSection: {
        marginBottom: 32,
    },
    previewLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#999',
        marginBottom: 12,
        textAlign: 'center',
    },
    previewCard: {
        backgroundColor: '#1A1F3A',
        borderRadius: 16,
        padding: 24,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#2A3F5A',
    },
    previewAvatar: {
        fontSize: 48,
        marginBottom: 12,
    },
    previewUsername: {
        fontSize: 20,
        fontWeight: '600',
        color: '#FFF',
    },
    completeButton: {
        backgroundColor: '#00D9FF',
        borderRadius: 12,
        padding: 18,
        alignItems: 'center',
        marginBottom: 16,
    },
    completeButtonDisabled: {
        backgroundColor: '#333',
        opacity: 0.5,
    },
    completeButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#0A0E27',
    },
    infoText: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
    },
});

export default ProfileSetup;
