/**
 * BuzzTag Bluetooth Service
 * Handles BLE scanning and device detection
 */

import { BleManager } from 'react-native-ble-plx';
import { PermissionsAndroid, Platform } from 'react-native';

class BluetoothService {
    constructor() {
        this.manager = new BleManager();
        this.devices = new Map();
        this.scanSubscription = null;
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

                    // Check if this is a new device
                    if (!this.devices.has(device.id)) {
                        const deviceInfo = {
                            id: device.id,
                            name: deviceName,
                            rssi: device.rssi,
                            timestamp: Date.now(),
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
     * Destroy manager and cleanup
     */
    destroy() {
        this.stopScanning();
        this.manager.destroy();
    }
}

export default new BluetoothService();
