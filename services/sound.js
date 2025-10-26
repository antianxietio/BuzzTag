/**
 * Sound Effects Service
 * Handles audio feedback for app events
 */

import { Vibration } from 'react-native';

class SoundService {
    constructor() {
        this.soundsEnabled = true;
        this.hapticsEnabled = true;
    }

    /**
     * Enable/disable sounds
     */
    setSoundsEnabled(enabled) {
        this.soundsEnabled = enabled;
    }

    /**
     * Enable/disable haptics
     */
    setHapticsEnabled(enabled) {
        this.hapticsEnabled = enabled;
    }

    /**
     * Play message sent feedback
     */
    messageSent() {
        if (this.hapticsEnabled) {
            Vibration.vibrate(10); // Short tap
        }
    }

    /**
     * Play message received feedback
     */
    messageReceived() {
        if (this.hapticsEnabled) {
            Vibration.vibrate([0, 50, 50, 50]); // Double tap pattern
        }
    }

    /**
     * Play device connected feedback
     */
    deviceConnected() {
        if (this.hapticsEnabled) {
            Vibration.vibrate([0, 100, 100, 100]); // Success pattern
        }
    }

    /**
     * Play achievement unlocked feedback
     */
    achievementUnlocked() {
        if (this.hapticsEnabled) {
            Vibration.vibrate([0, 50, 100, 50, 100, 50]); // Celebration pattern
        }
    }

    /**
     * Play button press feedback
     */
    buttonPress() {
        if (this.hapticsEnabled) {
            Vibration.vibrate(5); // Very short tap
        }
    }

    /**
     * Play error feedback
     */
    error() {
        if (this.hapticsEnabled) {
            Vibration.vibrate([0, 100, 50, 100]); // Error pattern
        }
    }

    /**
     * Play long press feedback
     */
    longPress() {
        if (this.hapticsEnabled) {
            Vibration.vibrate(30); // Medium tap
        }
    }
}

export default new SoundService();
