import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ConnectionStatusBar = ({
    bluetoothEnabled,
    isScanning,
    devicesCount,
    selectedDevice
}) => {
    const getStatusColor = () => {
        if (!bluetoothEnabled) return '#FF4444';
        if (selectedDevice) return '#00FF88';
        if (isScanning) return '#00D9FF';
        return '#FFB800';
    };

    const getStatusText = () => {
        if (!bluetoothEnabled) return 'Bluetooth Off';
        if (selectedDevice) return 'Connected';
        if (isScanning) return 'Scanning...';
        if (devicesCount > 0) return `${devicesCount} device${devicesCount !== 1 ? 's' : ''} nearby`;
        return 'No devices';
    };

    const getStatusIcon = () => {
        if (!bluetoothEnabled) return '🔴';
        if (selectedDevice) return '🟢';
        if (isScanning) return '🔵';
        return '🟡';
    };

    return (
        <View style={[styles.container, { backgroundColor: getStatusColor() + '20' }]}>
            <Text style={styles.icon}>{getStatusIcon()}</Text>
            <View style={styles.textContainer}>
                <Text style={[styles.statusText, { color: getStatusColor() }]}>
                    {getStatusText()}
                </Text>
                {selectedDevice && (
                    <Text style={styles.deviceName} numberOfLines={1}>
                        {selectedDevice.name}
                    </Text>
                )}
            </View>
            <View style={[styles.indicator, { backgroundColor: getStatusColor() }]} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        marginHorizontal: 16,
        marginBottom: 8,
    },
    icon: {
        fontSize: 16,
        marginRight: 8,
    },
    textContainer: {
        flex: 1,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
    },
    deviceName: {
        fontSize: 10,
        color: '#999',
        marginTop: 2,
    },
    indicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginLeft: 8,
    },
});

export default ConnectionStatusBar;
