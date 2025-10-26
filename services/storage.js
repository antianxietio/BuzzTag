/**
 * Storage Service
 * Handles all persistent data storage using AsyncStorage
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
    USER_PROFILE: '@buzztag_user_profile',
    CONVERSATIONS: '@buzztag_conversations',
    DEVICES: '@buzztag_devices',
    ACHIEVEMENTS: '@buzztag_achievements',
    SETTINGS: '@buzztag_settings',
};

class StorageService {
    /**
     * Save user profile
     */
    async saveProfile(profile) {
        try {
            await AsyncStorage.setItem(KEYS.USER_PROFILE, JSON.stringify(profile));
            console.log('✅ Profile saved:', profile.username);
            return true;
        } catch (error) {
            console.error('❌ Error saving profile:', error);
            return false;
        }
    }

    /**
     * Load user profile
     */
    async loadProfile() {
        try {
            const data = await AsyncStorage.getItem(KEYS.USER_PROFILE);
            if (data) {
                const profile = JSON.parse(data);
                console.log('✅ Profile loaded:', profile.username);
                return profile;
            }
            return null;
        } catch (error) {
            console.error('❌ Error loading profile:', error);
            return null;
        }
    }

    /**
     * Save conversations
     */
    async saveConversations(conversations) {
        try {
            await AsyncStorage.setItem(KEYS.CONVERSATIONS, JSON.stringify(conversations));
            console.log('✅ Conversations saved');
            return true;
        } catch (error) {
            console.error('❌ Error saving conversations:', error);
            return false;
        }
    }

    /**
     * Load conversations
     */
    async loadConversations() {
        try {
            const data = await AsyncStorage.getItem(KEYS.CONVERSATIONS);
            if (data) {
                const conversations = JSON.parse(data);
                console.log('✅ Conversations loaded');
                return conversations;
            }
            return {};
        } catch (error) {
            console.error('❌ Error loading conversations:', error);
            return {};
        }
    }

    /**
     * Save devices list
     */
    async saveDevices(devices) {
        try {
            await AsyncStorage.setItem(KEYS.DEVICES, JSON.stringify(devices));
            console.log('✅ Devices saved:', devices.length);
            return true;
        } catch (error) {
            console.error('❌ Error saving devices:', error);
            return false;
        }
    }

    /**
     * Load devices list
     */
    async loadDevices() {
        try {
            const data = await AsyncStorage.getItem(KEYS.DEVICES);
            if (data) {
                const devices = JSON.parse(data);
                console.log('✅ Devices loaded:', devices.length);
                return devices;
            }
            return [];
        } catch (error) {
            console.error('❌ Error loading devices:', error);
            return [];
        }
    }

    /**
     * Save achievements
     */
    async saveAchievements(achievements) {
        try {
            await AsyncStorage.setItem(KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
            console.log('✅ Achievements saved');
            return true;
        } catch (error) {
            console.error('❌ Error saving achievements:', error);
            return false;
        }
    }

    /**
     * Load achievements
     */
    async loadAchievements() {
        try {
            const data = await AsyncStorage.getItem(KEYS.ACHIEVEMENTS);
            if (data) {
                const achievements = JSON.parse(data);
                console.log('✅ Achievements loaded');
                return achievements;
            }
            return null;
        } catch (error) {
            console.error('❌ Error loading achievements:', error);
            return null;
        }
    }

    /**
     * Save settings
     */
    async saveSettings(settings) {
        try {
            await AsyncStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
            console.log('✅ Settings saved');
            return true;
        } catch (error) {
            console.error('❌ Error saving settings:', error);
            return false;
        }
    }

    /**
     * Load settings
     */
    async loadSettings() {
        try {
            const data = await AsyncStorage.getItem(KEYS.SETTINGS);
            if (data) {
                const settings = JSON.parse(data);
                console.log('✅ Settings loaded');
                return settings;
            }
            return {
                soundEnabled: true,
                hapticsEnabled: true,
                autoSave: true,
            };
        } catch (error) {
            console.error('❌ Error loading settings:', error);
            return {
                soundEnabled: true,
                hapticsEnabled: true,
                autoSave: true,
            };
        }
    }

    /**
     * Clear all data
     */
    async clearAll() {
        try {
            await AsyncStorage.multiRemove([
                KEYS.USER_PROFILE,
                KEYS.CONVERSATIONS,
                KEYS.DEVICES,
                KEYS.ACHIEVEMENTS,
                KEYS.SETTINGS,
            ]);
            console.log('✅ All data cleared');
            return true;
        } catch (error) {
            console.error('❌ Error clearing data:', error);
            return false;
        }
    }

    /**
     * Get storage info
     */
    async getStorageInfo() {
        try {
            const keys = await AsyncStorage.getAllKeys();
            const buzztagKeys = keys.filter(k => k.startsWith('@buzztag'));
            return {
                totalKeys: buzztagKeys.length,
                keys: buzztagKeys,
            };
        } catch (error) {
            console.error('❌ Error getting storage info:', error);
            return { totalKeys: 0, keys: [] };
        }
    }
}

export default new StorageService();
