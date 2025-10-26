/**
 * Encryption Service
 * Handles message encryption/decryption using AES-256
 */

import CryptoJS from 'crypto-js';

class EncryptionService {
    constructor() {
        // Generate a session key for this app instance
        this.sessionKey = null;
    }

    /**
     * Generate a secure session key
     */
    generateSessionKey() {
        // Generate a random 256-bit key
        const key = CryptoJS.lib.WordArray.random(32).toString();
        this.sessionKey = key;
        return key;
    }

    /**
     * Set the session key (for key exchange)
     */
    setSessionKey(key) {
        this.sessionKey = key;
    }

    /**
     * Encrypt a message
     */
    encryptMessage(message, deviceKey = null) {
        try {
            const key = deviceKey || this.sessionKey || this.generateSessionKey();
            const encrypted = CryptoJS.AES.encrypt(message, key).toString();
            return encrypted;
        } catch (error) {
            console.error('Encryption error:', error);
            return null;
        }
    }

    /**
     * Decrypt a message
     */
    decryptMessage(encryptedMessage, deviceKey = null) {
        try {
            const key = deviceKey || this.sessionKey;
            if (!key) {
                console.warn('No encryption key available');
                return encryptedMessage; // Return as-is if no key
            }

            const decrypted = CryptoJS.AES.decrypt(encryptedMessage, key);
            const message = decrypted.toString(CryptoJS.enc.Utf8);
            return message || encryptedMessage; // Fallback to original if decryption fails
        } catch (error) {
            console.error('Decryption error:', error);
            return encryptedMessage; // Return encrypted message if decryption fails
        }
    }

    /**
     * Generate a simple shared key from two device IDs
     * This is a simplified key exchange for demonstration
     * In production, use proper key exchange protocols
     */
    generateSharedKey(myDeviceId, theirDeviceId) {
        const combined = [myDeviceId, theirDeviceId].sort().join('_');
        const hash = CryptoJS.SHA256(combined).toString();
        return hash;
    }

    /**
     * Hash a value (useful for verification)
     */
    hash(value) {
        return CryptoJS.SHA256(value).toString();
    }
}

export default new EncryptionService();
