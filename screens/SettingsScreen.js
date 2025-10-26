import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Switch,
    SafeAreaView,
    StatusBar,
    Alert,
} from 'react-native';
import Storage from '../services/storage';
import AchievementsService from '../services/achievements';
import SoundService from '../services/sound';

const SettingsScreen = ({ userProfile, onBack, onProfileUpdate }) => {
    const [soundsEnabled, setSoundsEnabled] = useState(true);
    const [hapticsEnabled, setHapticsEnabled] = useState(true);
    const [encryptionEnabled, setEncryptionEnabled] = useState(true);
    const [achievements, setAchievements] = useState([]);
    const [achievementProgress, setAchievementProgress] = useState({ unlocked: 0, total: 0, percentage: 0 });

    useEffect(() => {
        loadSettings();
        loadAchievements();
    }, []);

    const loadSettings = async () => {
        try {
            const settings = await Storage.loadSettings();
            if (settings) {
                setSoundsEnabled(settings.soundsEnabled ?? true);
                setHapticsEnabled(settings.hapticsEnabled ?? true);
                setEncryptionEnabled(settings.encryptionEnabled ?? true);

                SoundService.setSoundsEnabled(settings.soundsEnabled ?? true);
                SoundService.setHapticsEnabled(settings.hapticsEnabled ?? true);
            }
        } catch (error) {
            console.error('Error loading settings:', error);
        }
    };

    const loadAchievements = async () => {
        try {
            await AchievementsService.initialize();
            const allAchievements = AchievementsService.getAchievements();
            const progress = AchievementsService.getProgress();
            setAchievements(allAchievements);
            setAchievementProgress(progress);
        } catch (error) {
            console.error('Error loading achievements:', error);
        }
    };

    const saveSetting = async (key, value) => {
        try {
            const settings = await Storage.loadSettings() || {};
            settings[key] = value;
            await Storage.saveSettings(settings);
        } catch (error) {
            console.error('Error saving setting:', error);
        }
    };

    const handleSoundsToggle = (value) => {
        setSoundsEnabled(value);
        SoundService.setSoundsEnabled(value);
        saveSetting('soundsEnabled', value);
        if (value) SoundService.buttonPress();
    };

    const handleHapticsToggle = (value) => {
        setHapticsEnabled(value);
        SoundService.setHapticsEnabled(value);
        saveSetting('hapticsEnabled', value);
        if (value) SoundService.buttonPress();
    };

    const handleEncryptionToggle = (value) => {
        setEncryptionEnabled(value);
        saveSetting('encryptionEnabled', value);
    };

    const handleClearData = () => {
        Alert.alert(
            'Clear All Data',
            'This will delete all conversations, devices, and settings. Your profile will be kept. Are you sure?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Clear',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await Storage.saveConversations({});
                            await Storage.saveDevices([]);
                            Alert.alert('Success', 'Data cleared successfully');
                            SoundService.buttonPress();
                        } catch (error) {
                            Alert.alert('Error', 'Failed to clear data');
                        }
                    },
                },
            ]
        );
    };

    const handleResetProfile = () => {
        Alert.alert(
            'Reset Profile',
            'This will reset your profile and you\'ll need to set it up again. All data will be cleared. Are you sure?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Reset',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await Storage.clearAll();
                            if (onProfileUpdate) onProfileUpdate(null);
                            SoundService.buttonPress();
                        } catch (error) {
                            Alert.alert('Error', 'Failed to reset profile');
                        }
                    },
                },
            ]
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#0A0E27" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack} style={styles.backButton}>
                    <Text style={styles.backButtonText}>← Back</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Settings</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView style={styles.content}>
                {/* Profile Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Profile</Text>
                    <View style={styles.profileCard}>
                        <Text style={styles.profileAvatar}>{userProfile?.avatar}</Text>
                        <View style={styles.profileInfo}>
                            <Text style={styles.profileName}>{userProfile?.username}</Text>
                            <Text style={styles.profileDate}>
                                Joined {new Date(userProfile?.createdAt).toLocaleDateString()}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Achievements Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Achievements</Text>
                    <View style={styles.achievementProgress}>
                        <Text style={styles.achievementProgressText}>
                            {achievementProgress.unlocked} / {achievementProgress.total} unlocked
                        </Text>
                        <View style={styles.progressBar}>
                            <View
                                style={[styles.progressFill, { width: `${achievementProgress.percentage}%` }]}
                            />
                        </View>
                    </View>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={styles.achievementsList}
                    >
                        {achievements.map((achievement) => (
                            <View
                                key={achievement.id}
                                style={[
                                    styles.achievementBadge,
                                    achievement.unlocked && styles.achievementUnlocked
                                ]}
                            >
                                <Text style={styles.achievementIcon}>
                                    {achievement.icon}
                                </Text>
                                <Text style={styles.achievementTitle} numberOfLines={1}>
                                    {achievement.title}
                                </Text>
                            </View>
                        ))}
                    </ScrollView>
                </View>

                {/* Sound & Haptics Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Sound & Haptics</Text>

                    <View style={styles.settingRow}>
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingLabel}>Sound Effects</Text>
                            <Text style={styles.settingDescription}>Play sounds for actions</Text>
                        </View>
                        <Switch
                            value={soundsEnabled}
                            onValueChange={handleSoundsToggle}
                            trackColor={{ false: '#2A3F5A', true: '#00D9FF' }}
                            thumbColor="#FFF"
                        />
                    </View>

                    <View style={styles.settingRow}>
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingLabel}>Haptic Feedback</Text>
                            <Text style={styles.settingDescription}>Vibrate on interactions</Text>
                        </View>
                        <Switch
                            value={hapticsEnabled}
                            onValueChange={handleHapticsToggle}
                            trackColor={{ false: '#2A3F5A', true: '#00D9FF' }}
                            thumbColor="#FFF"
                        />
                    </View>
                </View>

                {/* Privacy & Security Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Privacy & Security</Text>

                    <View style={styles.settingRow}>
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingLabel}>Message Encryption</Text>
                            <Text style={styles.settingDescription}>Encrypt messages with AES-256</Text>
                        </View>
                        <Switch
                            value={encryptionEnabled}
                            onValueChange={handleEncryptionToggle}
                            trackColor={{ false: '#2A3F5A', true: '#00D9FF' }}
                            thumbColor="#FFF"
                        />
                    </View>
                </View>

                {/* Data Management Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Data Management</Text>

                    <TouchableOpacity
                        style={styles.dangerButton}
                        onPress={handleClearData}
                    >
                        <Text style={styles.dangerButtonText}>Clear All Data</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.dangerButton, styles.resetButton]}
                        onPress={handleResetProfile}
                    >
                        <Text style={styles.dangerButtonText}>Reset Profile</Text>
                    </TouchableOpacity>
                </View>

                {/* App Info */}
                <View style={styles.section}>
                    <Text style={styles.appInfo}>BuzzTag v3.0.0</Text>
                    <Text style={styles.appInfo}>Break the ice. Talk to the question.</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0A0E27',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#1A1F3A',
    },
    backButton: {
        padding: 8,
    },
    backButtonText: {
        color: '#00D9FF',
        fontSize: 16,
        fontWeight: '600',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFF',
    },
    placeholder: {
        width: 60,
    },
    content: {
        flex: 1,
    },
    section: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#1A1F3A',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 16,
    },
    profileCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1A1F3A',
        borderRadius: 12,
        padding: 16,
    },
    profileAvatar: {
        fontSize: 48,
        marginRight: 16,
    },
    profileInfo: {
        flex: 1,
    },
    profileName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 4,
    },
    profileDate: {
        fontSize: 14,
        color: '#999',
    },
    achievementProgress: {
        marginBottom: 16,
    },
    achievementProgressText: {
        fontSize: 14,
        color: '#999',
        marginBottom: 8,
    },
    progressBar: {
        height: 8,
        backgroundColor: '#1A1F3A',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#00D9FF',
        borderRadius: 4,
    },
    achievementsList: {
        marginHorizontal: -16,
        paddingHorizontal: 16,
    },
    achievementBadge: {
        width: 80,
        height: 100,
        backgroundColor: '#1A1F3A',
        borderRadius: 12,
        padding: 8,
        marginRight: 12,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0.5,
    },
    achievementUnlocked: {
        opacity: 1,
        borderWidth: 2,
        borderColor: '#00D9FF',
    },
    achievementIcon: {
        fontSize: 32,
        marginBottom: 8,
    },
    achievementTitle: {
        fontSize: 10,
        color: '#FFF',
        textAlign: 'center',
    },
    settingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#1A1F3A',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
    },
    settingInfo: {
        flex: 1,
        marginRight: 16,
    },
    settingLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFF',
        marginBottom: 4,
    },
    settingDescription: {
        fontSize: 12,
        color: '#999',
    },
    dangerButton: {
        backgroundColor: '#FF4444',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        marginBottom: 12,
    },
    resetButton: {
        backgroundColor: '#FF8844',
    },
    dangerButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFF',
    },
    appInfo: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
        marginBottom: 4,
    },
});

export default SettingsScreen;
