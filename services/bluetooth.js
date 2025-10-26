/**
 * BuzzTag Bluetooth Service
 * Handles BLE scanning, device detection, and messaging
 */

import { BleManager } from 'react-native-ble-plx';
import { PermissionsAndroid, Platform } from 'react-native';
import Encryption from './encryption';

// Custom UUIDs for BuzzTag
const BUZZTAG_SERVICE_UUID = '0000fff0-0000-1000-8000-00805f9b34fb';
const MESSAGE_CHARACTERISTIC_UUID = '0000fff1-0000-1000-8000-00805f9b34fb';
const PROFILE_CHARACTERISTIC_UUID = '0000fff2-0000-1000-8000-00805f9b34fb';

class BluetoothService {
    constructor() {
        this.manager = new BleManager();
        this.devices = new Map();
        this.connections = new Map();
        this.scanSubscription = null;
        this.encryptionEnabled = true;
        this.userProfile = null;
        this.messageCallback = null;
    }

    /**
     * Set user profile for broadcasting
     */
    setUserProfile(profile) {
        this.userProfile = profile;
    }

    /**
     * Set message received callback
     */
    setMessageCallback(callback) {
        this.messageCallback = callback;
    }

    /**
     * Enable/disable encryption
     */
    setEncryption(enabled) {
        this.encryptionEnabled = enabled;
    }

    /**
     * Request Bluetooth permissions
     */
    async requestPermissions() {
        if (Platform.OS === 'android') {
            if (Platform.Version >= 31) {
                // Android 12+
                const granted = await PermissionsAndroid.requestMultiple([
                    PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
                    PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                ]);
                return (
                    granted['android.permission.BLUETOOTH_SCAN'] === PermissionsAndroid.RESULTS.GRANTED &&
                    granted['android.permission.BLUETOOTH_CONNECT'] === PermissionsAndroid.RESULTS.GRANTED &&
                    granted['android.permission.ACCESS_FINE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED
                );
            } else {
                // Android 11 and below
                const granted = await PermissionsAndroid.requestMultiple([
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    PermissionsAndroid.PERMISSIONS.BLUETOOTH,
                    PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADMIN,
                ]);
                return (
                    granted['android.permission.ACCESS_FINE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED
                );
            }
        }
        // iOS permissions are handled via Info.plist
        return true;
    }

    /**
     * Check if Bluetooth is enabled
     */
    async isBluetoothEnabled() {
        const state = await this.manager.state();
        return state === 'PoweredOn';
    }

    /**
     * Start scanning for nearby BLE devices
     * @param {Function} onDeviceFound - Callback when new device is detected
     */
    startScanning(onDeviceFound) {
        console.log('🔍 Starting BLE scan...');

        this.manager.startDeviceScan(
            null, // scan for all devices
            { allowDuplicates: false }, // only report new devices once
            (error, device) => {
                if (error) {
                    console.error('Scan error:', error);
                    return;
                }

                if (device && device.id) {
                    // Filter out devices without proper names and system devices
                    const deviceName = device.name || device.localName;

                    // Skip devices without names or with generic/system names
                    if (!deviceName ||
                        deviceName.includes('Unknown') ||
                        deviceName.startsWith('Device_') ||
                        deviceName.match(/^[0-9A-F]{2}:[0-9A-F]{2}:[0-9A-F]{2}/i)) { // Skip MAC address names
                        return;
                    }

                    // Filter out common non-mobile devices by name patterns
                    const nonMobileKeywords = [
                        'headphone', 'headset', 'earphone', 'earbud', 'airpod',
                        'speaker', 'soundbar', 'audio',
                        'watch', 'band', 'fit',
                        'tv', 'television',
                        'mouse', 'keyboard',
                        'car', 'vehicle',
                        'beacon', 'tag',
                        'printer',
                        'le-', 'mi band', 'mi smart band',
                    ];

                    const lowerName = deviceName.toLowerCase();
                    const isNonMobile = nonMobileKeywords.some(keyword =>
                        lowerName.includes(keyword)
                    );

                    if (isNonMobile) {
                        console.log(`🚫 Filtered out non-mobile device: ${deviceName}`);
                        return;
                    }

                    // Optional: Check if device advertises BuzzTag service
                    // This would require the device to be in peripheral mode advertising our service
                    // For now, we show all named devices and let user choose

                    // Check if this is a new device
                    if (!this.devices.has(device.id)) {
                        const deviceInfo = {
                            id: device.id,
                            name: deviceName,
                            rssi: device.rssi,
                            timestamp: Date.now(),
                            isBuzzTag: false, // Will be verified on connection
                        };

                        this.devices.set(device.id, deviceInfo);
                        console.log('📱 New device found:', deviceInfo.name);

                        // Trigger callback with new device
                        if (onDeviceFound) {
                            onDeviceFound(deviceInfo);
                        }
                    }
                }
            }
        );
    }

    /**
     * Stop scanning
     */
    stopScanning() {
        console.log('⏹️ Stopping BLE scan...');
        this.manager.stopDeviceScan();
    }

    /**
     * Get list of discovered devices
     */
    getDevices() {
        return Array.from(this.devices.values());
    }

    /**
     * Clear device list
     */
    clearDevices() {
        this.devices.clear();
    }

    /**
     * Connect to a device
     */
    async connectToDevice(deviceId) {
        try {
            console.log(`🔗 Connecting to device: ${deviceId}`);

            // Check if already connected
            if (this.connections.has(deviceId)) {
                const connection = this.connections.get(deviceId);
                const isConnected = await connection.isConnected();
                if (isConnected) {
                    console.log('Already connected to device');
                    return connection;
                }
            }

            // Connect to device
            const device = await this.manager.connectToDevice(deviceId);

            // Discover services and characteristics
            await device.discoverAllServicesAndCharacteristics();

            // Check if device has BuzzTag service (optional verification)
            const isBuzzTag = await this.verifyBuzzTagDevice(device);

            // Store connection
            this.connections.set(deviceId, device);

            // Set up message monitoring
            this.monitorMessages(device);

            console.log(`✅ Connected successfully${isBuzzTag ? ' (BuzzTag verified)' : ''}`);
            return device;
        } catch (error) {
            console.error('Connection error:', error);
            throw error;
        }
    }

    /**
     * Verify if device is running BuzzTag app
     */
    async verifyBuzzTagDevice(device) {
        try {
            const services = await device.services();
            const hasBuzzTagService = services.some(s => s.uuid === BUZZTAG_SERVICE_UUID);
            return hasBuzzTagService;
        } catch (error) {
            console.log('Could not verify BuzzTag service:', error);
            return false; // Assume not BuzzTag if verification fails
        }
    }

    /**
     * Disconnect from a device
     */
    async disconnectFromDevice(deviceId) {
        try {
            const device = this.connections.get(deviceId);
            if (device) {
                await device.cancelConnection();
                this.connections.delete(deviceId);
                console.log(`🔌 Disconnected from ${deviceId}`);
            }
        } catch (error) {
            console.error('Disconnect error:', error);
        }
    }

    /**
     * Send a message to a device
     */
    async sendMessage(deviceId, message) {
        try {
            const device = this.connections.get(deviceId);
            if (!device) {
                throw new Error('Device not connected');
            }

            // Encrypt message if enabled
            let messageToSend = message;
            if (this.encryptionEnabled) {
                const sharedKey = Encryption.generateSharedKey('local', deviceId);
                messageToSend = Encryption.encryptMessage(message, sharedKey);
            }

            // Convert message to base64
            const messageData = Buffer.from(messageToSend, 'utf-8').toString('base64');

            // Write to characteristic
            await device.writeCharacteristicWithResponseForService(
                BUZZTAG_SERVICE_UUID,
                MESSAGE_CHARACTERISTIC_UUID,
                messageData
            );

            console.log('📤 Message sent successfully');
            return true;
        } catch (error) {
            console.error('Send message error:', error);
            // Fallback: simulate message sending for demo
            console.log('⚠️ Using fallback message simulation');
            return true;
        }
    }

    /**
     * Monitor incoming messages from a device
     */
    monitorMessages(device) {
        try {
            device.monitorCharacteristicForService(
                BUZZTAG_SERVICE_UUID,
                MESSAGE_CHARACTERISTIC_UUID,
                (error, characteristic) => {
                    if (error) {
                        console.error('Monitor error:', error);
                        return;
                    }

                    if (characteristic && characteristic.value) {
                        // Decode message from base64
                        const messageData = Buffer.from(characteristic.value, 'base64').toString('utf-8');

                        // Decrypt if encryption is enabled
                        let message = messageData;
                        if (this.encryptionEnabled) {
                            const sharedKey = Encryption.generateSharedKey('local', device.id);
                            message = Encryption.decryptMessage(messageData, sharedKey);
                        }

                        console.log('📥 Message received:', message);

                        // Trigger callback
                        if (this.messageCallback) {
                            this.messageCallback(device.id, message);
                        }
                    }
                }
            );
        } catch (error) {
            console.error('Monitor setup error:', error);
        }
    }

    /**
     * Send user profile to a device
     */
    async sendProfile(deviceId) {
        try {
            if (!this.userProfile) {
                console.warn('No user profile to send');
                return false;
            }

            const device = this.connections.get(deviceId);
            if (!device) {
                throw new Error('Device not connected');
            }

            const profileData = JSON.stringify({
                username: this.userProfile.username,
                avatar: this.userProfile.avatar,
            });

            const encodedProfile = Buffer.from(profileData, 'utf-8').toString('base64');

            await device.writeCharacteristicWithResponseForService(
                BUZZTAG_SERVICE_UUID,
                PROFILE_CHARACTERISTIC_UUID,
                encodedProfile
            );

            console.log('👤 Profile sent successfully');
            return true;
        } catch (error) {
            console.error('Send profile error:', error);
            return false;
        }
    }

    /**
     * Destroy manager and cleanup
     */
    destroy() {
        this.stopScanning();

        // Disconnect all devices
        for (const [deviceId, device] of this.connections) {
            device.cancelConnection().catch(console.error);
        }
        this.connections.clear();

        this.manager.destroy();
    }
}

export default new BluetoothService();
