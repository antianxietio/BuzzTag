/**
 * Achievements Service
 * Tracks user progress and unlocks achievements
 */

import Storage from './storage';
import achievementsData from '../data/achievements.json';

class AchievementsService {
    constructor() {
        this.achievements = {};
        this.stats = {
            messagesSent: 0,
            devicesConnected: 0,
            questionsAnswered: 0,
            sessionMessages: 0,
            sessionStartTime: new Date(),
            lastActiveDate: null,
            activeDays: new Set(),
        };
    }

    /**
     * Initialize achievements from storage
     */
    async initialize() {
        try {
            const saved = await Storage.loadAchievements();
            if (saved) {
                this.achievements = saved;
            } else {
                // Initialize all achievements as locked
                achievementsData.forEach(achievement => {
                    this.achievements[achievement.id] = {
                        ...achievement,
                        unlocked: false,
                        unlockedAt: null,
                    };
                });
                await this.save();
            }
        } catch (error) {
            console.error('Error loading achievements:', error);
        }
    }

    /**
     * Save achievements to storage
     */
    async save() {
        try {
            await Storage.saveAchievements(this.achievements);
        } catch (error) {
            console.error('Error saving achievements:', error);
        }
    }

    /**
     * Update stats and check for unlocks
     */
    async updateStats(type, value = 1) {
        this.stats[type] = (this.stats[type] || 0) + value;

        // Track active days
        const today = new Date().toDateString();
        this.stats.activeDays.add(today);

        await this.checkAchievements(type);
    }

    /**
     * Check if any achievements should be unlocked
     */
    async checkAchievements(triggerType = null) {
        const newUnlocks = [];

        for (const achievement of Object.values(this.achievements)) {
            if (achievement.unlocked) continue;

            let shouldUnlock = false;

            switch (achievement.id) {
                case 'ice_breaker':
                    shouldUnlock = this.stats.messagesSent >= 1;
                    break;
                case 'conversationalist':
                    shouldUnlock = this.stats.messagesSent >= 10;
                    break;
                case 'chatterbox':
                    shouldUnlock = this.stats.messagesSent >= 50;
                    break;
                case 'social_butterfly':
                    shouldUnlock = this.stats.devicesConnected >= 5;
                    break;
                case 'networker':
                    shouldUnlock = this.stats.devicesConnected >= 10;
                    break;
                case 'question_master':
                    shouldUnlock = this.stats.questionsAnswered >= 25;
                    break;
                case 'buzz_master':
                    shouldUnlock = this.stats.questionsAnswered >= 50;
                    break;
                case 'on_fire':
                    shouldUnlock = this.stats.sessionMessages >= 20;
                    break;
                case 'night_owl':
                    const hour = new Date().getHours();
                    shouldUnlock = this.stats.messagesSent >= 1 && hour >= 0 && hour < 5;
                    break;
                case 'early_bird':
                    const morningHour = new Date().getHours();
                    shouldUnlock = this.stats.messagesSent >= 1 && morningHour >= 5 && morningHour < 8;
                    break;
                case 'speedster':
                    // Check if 5 messages sent within 30 seconds
                    shouldUnlock = this.stats.sessionMessages >= 5 &&
                        (new Date() - this.stats.sessionStartTime) <= 30000;
                    break;
                case 'loyal_user':
                    shouldUnlock = this.stats.activeDays.size >= 7;
                    break;
            }

            if (shouldUnlock) {
                achievement.unlocked = true;
                achievement.unlockedAt = new Date().toISOString();
                newUnlocks.push(achievement);
            }
        }

        if (newUnlocks.length > 0) {
            await this.save();
        }

        return newUnlocks;
    }

    /**
     * Get all achievements
     */
    getAchievements() {
        return Object.values(this.achievements);
    }

    /**
     * Get unlocked achievements
     */
    getUnlockedAchievements() {
        return Object.values(this.achievements).filter(a => a.unlocked);
    }

    /**
     * Get locked achievements
     */
    getLockedAchievements() {
        return Object.values(this.achievements).filter(a => !a.unlocked);
    }

    /**
     * Get achievement progress
     */
    getProgress() {
        const total = Object.keys(this.achievements).length;
        const unlocked = this.getUnlockedAchievements().length;
        return {
            unlocked,
            total,
            percentage: Math.round((unlocked / total) * 100),
        };
    }

    /**
     * Reset session stats (call on app restart)
     */
    resetSession() {
        this.stats.sessionMessages = 0;
        this.stats.sessionStartTime = new Date();
    }
}

export default new AchievementsService();
