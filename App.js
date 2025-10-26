/**
 * BuzzTag 2.0 - Main App Component
 * Break the ice. Talk to the question.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
    SafeAreaView,
    ScrollView,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
    Vibration,
    Alert,
    FlatList,
    Animated,
    Modal,
    Clipboard,
    ToastAndroid,
    Platform,
} from 'react-native';
import BluetoothService from './services/bluetooth';
import Storage from './services/storage';
import questionsData from './data/questions.json';
import ChatBubble from './components/ChatBubble';
import InputBar from './components/InputBar';
import TypingIndicator from './components/TypingIndicator';
import ProfileSetup from './components/ProfileSetup';
import { COLORS, SPACING, TYPOGRAPHY } from './styles';

const App = () => {
    // User profile state
    const [userProfile, setUserProfile] = useState(null);
    const [isLoadingProfile, setIsLoadingProfile] = useState(true);

    // Conversation state: { deviceId: { messages: [], isTyping: false } }
    const [conversations, setConversations] = useState({});
    const [devices, setDevices] = useState([]);
    const [selectedDevice, setSelectedDevice] = useState(null);
    const [isScanning, setIsScanning] = useState(false);
    const [bluetoothEnabled, setBluetoothEnabled] = useState(false);
    const [showDeviceSelector, setShowDeviceSelector] = useState(false);
    const [pendingMessage, setPendingMessage] = useState(null);
    const scrollViewRef = useRef(null);
    const usedQuestions = useRef(new Map()); // Map of deviceId -> Set of used questions

    // Load user profile on mount
    useEffect(() => {
        loadUserProfile();
    }, []);

    const loadUserProfile = async () => {
        try {
            const profile = await Storage.loadProfile();
            setUserProfile(profile);
        } catch (error) {
            console.log('No existing profile found');
        } finally {
            setIsLoadingProfile(false);
        }
    };

    const handleProfileComplete = async (profile) => {
        try {
            await Storage.saveProfile(profile);
            setUserProfile(profile);
        } catch (error) {
            console.error('Error saving profile:', error);
            Alert.alert('Error', 'Failed to save profile. Please try again.');
        }
    };

    useEffect(() => {
        if (userProfile) {
            loadPersistedData();
            // Delay Bluetooth initialization slightly to ensure everything is ready
            const timer = setTimeout(() => {
                initializeBluetooth();
            }, 500);
            return () => {
                clearTimeout(timer);
                BluetoothService.destroy();
            };
        }
    }, [userProfile]);

    // Load persisted conversations and devices
    const loadPersistedData = async () => {
        try {
            const savedConversations = await Storage.loadConversations();
            const savedDevices = await Storage.loadDevices();

            if (savedConversations) {
                setConversations(savedConversations);
            }

            if (savedDevices && savedDevices.length > 0) {
                setDevices(savedDevices);
            }
        } catch (error) {
            console.log('No persisted data found:', error);
        }
    };

    // Save conversations whenever they change
    useEffect(() => {
        if (userProfile && Object.keys(conversations).length > 0) {
            Storage.saveConversations(conversations).catch(console.error);
        }
    }, [conversations]);

    // Save devices whenever they change
    useEffect(() => {
        if (userProfile && devices.length > 0) {
            Storage.saveDevices(devices).catch(console.error);
        }
    }, [devices]);

    const initializeBluetooth = async () => {
        try {
            // Request permissions
            const hasPermission = await BluetoothService.requestPermissions();
            if (!hasPermission) {
                Alert.alert(
                    'Permissions Required',
                    'BuzzTag needs Bluetooth and Location permissions to discover nearby devices.',
                    [{ text: 'OK' }]
                );
                return;
            }

            // Check if Bluetooth is enabled
            const enabled = await BluetoothService.isBluetoothEnabled();
            setBluetoothEnabled(enabled);

            if (enabled) {
                startScanning();
            } else {
                Alert.alert(
                    'Bluetooth Disabled',
                    'Please enable Bluetooth to use BuzzTag.',
                    [{ text: 'OK' }]
                );
            }
        } catch (error) {
            console.error('Bluetooth initialization error:', error);
            Alert.alert('Error', 'Failed to initialize Bluetooth: ' + error.message);
        }
    };

    const startScanning = () => {
        setIsScanning(true);
        BluetoothService.startScanning(handleDeviceFound);
    };

    const stopScanning = () => {
        setIsScanning(false);
        BluetoothService.stopScanning();
    };

    const handleDeviceFound = (device) => {
        // Vibrate on new device
        Vibration.vibrate([100, 50, 100]);

        // Update devices list
        setDevices((prev) => {
            const exists = prev.some((d) => d.id === device.id);
            if (!exists) {
                // Initialize conversation for new device
                setConversations((convs) => ({
                    ...convs,
                    [device.id]: {
                        messages: [],
                        isTyping: false,
                    },
                }));

                // Initialize used questions for this device
                if (!usedQuestions.current.has(device.id)) {
                    usedQuestions.current.set(device.id, new Set());
                }

                // Auto-select first device and send welcome question
                if (prev.length === 0) {
                    setSelectedDevice(device.id);
                    setTimeout(() => showNewQuestion(device.id), 500);
                }

                return [...prev, device];
            }
            return prev;
        });
    };

    const getRandomQuestion = (deviceId) => {
        const deviceQuestions = usedQuestions.current.get(deviceId) || new Set();
        const availableQuestions = questionsData.questions.filter(
            (q) => !deviceQuestions.has(q)
        );

        // Reset if all questions used
        if (availableQuestions.length === 0) {
            deviceQuestions.clear();
            usedQuestions.current.set(deviceId, deviceQuestions);
            return questionsData.questions[
                Math.floor(Math.random() * questionsData.questions.length)
            ];
        }

        const question =
            availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
        deviceQuestions.add(question);
        usedQuestions.current.set(deviceId, deviceQuestions);
        return question;
    };

    const showNewQuestion = (deviceId) => {
        if (!deviceId) return;

        // Get a random question and send it as YOUR message (not from bot)
        const question = getRandomQuestion(deviceId);

        const newMessage = {
            id: Date.now().toString() + Math.random(),
            text: question,
            isBot: false, // Changed: This is YOUR message, sent TO the device
            timestamp: Date.now(),
        };

        setConversations((prev) => ({
            ...prev,
            [deviceId]: {
                ...prev[deviceId],
                messages: [
                    ...(prev[deviceId]?.messages || []),
                    newMessage,
                ],
            },
        }));

        // Vibration feedback
        Vibration.vibrate(50);

        // Scroll to bottom
        setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
    };

    const handleSendMessage = (text) => {
        if (!text.trim()) return;

        // If no device selected, show device selector
        if (!selectedDevice && devices.length > 0) {
            setPendingMessage(text);
            setShowDeviceSelector(true);
            return;
        }

        // If still no device, alert user
        if (!selectedDevice) {
            Alert.alert(
                'No Device',
                'Please wait for a device to connect or select a device from the list.',
                [{ text: 'OK' }]
            );
            return;
        }

        sendMessageToDevice(selectedDevice, text);
    };

    const sendMessageToDevice = (deviceId, text) => {
        const newMessage = {
            id: Date.now().toString() + Math.random(),
            text: text,
            isBot: false,
            timestamp: Date.now(),
        };

        setConversations((prev) => ({
            ...prev,
            [deviceId]: {
                ...prev[deviceId],
                messages: [...(prev[deviceId]?.messages || []), newMessage],
            },
        }));

        // Vibration feedback
        Vibration.vibrate(50);

        // Scroll to bottom
        setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);

        // Close device selector if open
        setShowDeviceSelector(false);
        setPendingMessage(null);
    };

    const handleDeviceSelect = (deviceId) => {
        setSelectedDevice(deviceId);
        Vibration.vibrate(50);

        // If there's a pending message, send it
        if (pendingMessage) {
            sendMessageToDevice(deviceId, pendingMessage);
        } else {
            setShowDeviceSelector(false);
        }

        // Scroll to bottom when switching devices
        setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
    };

    const handleBuzzAgain = () => {
        if (!selectedDevice) {
            Alert.alert(
                'No Device Selected',
                'Please select a device to send a question.',
                [{ text: 'OK' }]
            );
            return;
        }
        Vibration.vibrate([100, 50, 100]);
        showNewQuestion(selectedDevice);
    };

    const handleResetChat = () => {
        if (!selectedDevice) return;

        const deviceName = devices.find(d => d.id === selectedDevice)?.name || 'this device';

        Alert.alert(
            'Reset Chat',
            `Clear all messages with ${deviceName}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Reset',
                    style: 'destructive',
                    onPress: () => {
                        setConversations((prev) => ({
                            ...prev,
                            [selectedDevice]: {
                                messages: [],
                                isTyping: false,
                            },
                        }));
                        const deviceQuestions = usedQuestions.current.get(selectedDevice);
                        if (deviceQuestions) {
                            deviceQuestions.clear();
                        }
                        Vibration.vibrate(50);
                    },
                },
            ]
        );
    };

    const handleRemoveDevice = (deviceId) => {
        const device = devices.find(d => d.id === deviceId);
        Alert.alert(
            'Remove Device',
            `Remove ${device?.name || 'this device'} from the list?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Remove',
                    style: 'destructive',
                    onPress: () => {
                        setDevices(prev => prev.filter(d => d.id !== deviceId));
                        setConversations(prev => {
                            const newConv = { ...prev };
                            delete newConv[deviceId];
                            return newConv;
                        });
                        if (selectedDevice === deviceId) {
                            setSelectedDevice(null);
                        }
                        Vibration.vibrate(50);
                    },
                },
            ]
        );
    };

    const handleLongPressMessage = (message) => {
        Alert.alert(
            'Message Actions',
            message.text,
            [
                {
                    text: 'Copy',
                    onPress: () => {
                        Clipboard.setString(message.text);
                        if (Platform.OS === 'android') {
                            ToastAndroid.show('Message copied!', ToastAndroid.SHORT);
                        }
                        Vibration.vibrate(50);
                    },
                },
                { text: 'Cancel', style: 'cancel' },
            ]
        );
    };

    const getSignalStrength = (rssi) => {
        if (!rssi) return { icon: '📡', text: 'Unknown', color: COLORS.textSecondary };
        if (rssi > -60) return { icon: '📶', text: 'Excellent', color: COLORS.success };
        if (rssi > -70) return { icon: '📶', text: 'Good', color: COLORS.success };
        if (rssi > -80) return { icon: '📡', text: 'Fair', color: COLORS.accent };
        return { icon: '📡', text: 'Weak', color: COLORS.error };
    };

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;

        // Less than 1 minute
        if (diff < 60000) return 'Just now';
        // Less than 1 hour
        if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
        // Today
        if (date.toDateString() === now.toDateString()) {
            return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
        }
        // This week
        if (diff < 604800000) {
            return date.toLocaleDateString('en-US', { weekday: 'short', hour: 'numeric', minute: '2-digit' });
        }
        // Older
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }; const renderDeviceItem = ({ item }) => {
        const isSelected = item.id === selectedDevice;
        const messageCount = conversations[item.id]?.messages?.length || 0;
        const signal = getSignalStrength(item.rssi);

        return (
            <TouchableOpacity
                onPress={() => handleDeviceSelect(item.id)}
                onLongPress={() => handleRemoveDevice(item.id)}
                style={[
                    styles.deviceItem,
                    isSelected && styles.deviceItemSelected,
                ]}
            >
                <View style={styles.deviceMainInfo}>
                    <Text style={styles.signalIcon}>{signal.icon}</Text>
                    <View style={styles.deviceInfo}>
                        <Text style={[
                            styles.deviceText,
                            isSelected && styles.deviceTextSelected
                        ]}>
                            {item.name}
                        </Text>
                        <Text style={styles.signalText}>{signal.text}</Text>
                    </View>
                    {messageCount > 0 && (
                        <View style={styles.messageBadge}>
                            <Text style={styles.messageBadgeText}>{messageCount}</Text>
                        </View>
                    )}
                </View>
            </TouchableOpacity>
        );
    };

    const currentConversation = selectedDevice ? conversations[selectedDevice] : null;
    const currentMessages = currentConversation?.messages || [];
    const isTyping = currentConversation?.isTyping || false;

    // Show profile setup if no profile exists
    if (isLoadingProfile) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>Loading BuzzTag...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (!userProfile) {
        return <ProfileSetup onComplete={handleProfileComplete} />;
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>🔵 BuzzTag</Text>
                <Text style={styles.headerSubtitle}>Break the ice. Talk to the question.</Text>
            </View>

            {/* Nearby Devices Section */}
            <View style={styles.devicesSection}>
                <View style={styles.devicesHeader}>
                    <Text style={styles.sectionTitle}>
                        {isScanning ? '🔍 Searching...' : '📱 Nearby Devices'}
                    </Text>
                    <Text style={styles.deviceCount}>({devices.length})</Text>
                </View>

                {devices.length > 0 ? (
                    <>
                        <FlatList
                            data={devices}
                            renderItem={renderDeviceItem}
                            keyExtractor={(item) => item.id}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={styles.devicesList}
                        />
                        <Text style={styles.deviceHint}>
                            💡 Tap to select • Long press to remove
                        </Text>
                    </>
                ) : (
                    <Text style={styles.emptyText}>
                        {bluetoothEnabled
                            ? 'Waiting for nearby BuzzTag users...'
                            : 'Bluetooth disabled'}
                    </Text>
                )}
            </View>

            {/* Chat Section */}
            <View style={styles.chatSection}>
                <View style={styles.chatHeader}>
                    <View>
                        <Text style={styles.sectionTitle}>💬 Chat</Text>
                        {selectedDevice && (
                            <View style={styles.chatHeaderInfo}>
                                <Text style={styles.chatSubtitle}>
                                    {devices.find(d => d.id === selectedDevice)?.name || 'Unknown'}
                                </Text>
                                <Text style={styles.messageCountText}>
                                    • {currentMessages.length} {currentMessages.length === 1 ? 'message' : 'messages'}
                                </Text>
                            </View>
                        )}
                    </View>
                    {currentMessages.length > 0 && (
                        <TouchableOpacity onPress={handleResetChat}>
                            <Text style={styles.resetButton}>Reset</Text>
                        </TouchableOpacity>
                    )}
                </View>

                <ScrollView
                    ref={scrollViewRef}
                    style={styles.messagesContainer}
                    contentContainerStyle={styles.messagesContent}
                    showsVerticalScrollIndicator={false}
                >
                    {currentMessages.length === 0 && !isTyping && (
                        <View style={styles.emptyChat}>
                            <Text style={styles.emptyChatText}>
                                {!selectedDevice
                                    ? '👋 Select a device to start chatting...'
                                    : devices.length === 0
                                        ? '� Waiting for someone nearby...'
                                        : '🎉 Ready to break the ice! Tap "Buzz Again" or send a message.'}
                            </Text>
                        </View>
                    )}

                    {currentMessages.map((message, index) => (
                        <ChatBubble
                            key={message.id}
                            message={message.text}
                            isBot={message.isBot}
                            timestamp={formatTimestamp(message.timestamp)}
                            animated={true}
                            delay={index * 100}
                            onLongPress={() => handleLongPressMessage(message)}
                        />
                    ))}

                    {isTyping && <TypingIndicator />}
                </ScrollView>

                {/* Buzz Again Button */}
                {selectedDevice && (
                    <TouchableOpacity style={styles.buzzButton} onPress={handleBuzzAgain}>
                        <Text style={styles.buzzButtonText}>
                            {currentMessages.length === 0 ? '🎯 Buzz Newly' : '🔁 Buzz Again'}
                        </Text>
                    </TouchableOpacity>
                )}

                {/* Input Bar */}
                <InputBar
                    onSend={handleSendMessage}
                    placeholder={selectedDevice ? "Type your answer..." : "Select a device first..."}
                    disabled={!selectedDevice}
                />
            </View>

            {/* Device Selector Modal */}
            <Modal
                visible={showDeviceSelector}
                transparent={true}
                animationType="fade"
                onRequestClose={() => {
                    setShowDeviceSelector(false);
                    setPendingMessage(null);
                }}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Select Device</Text>
                        <Text style={styles.modalSubtitle}>
                            Choose which device to send your message to:
                        </Text>

                        <ScrollView style={styles.modalDeviceList}>
                            {devices.map((device) => (
                                <TouchableOpacity
                                    key={device.id}
                                    style={styles.modalDeviceItem}
                                    onPress={() => handleDeviceSelect(device.id)}
                                >
                                    <View style={styles.deviceDot} />
                                    <Text style={styles.modalDeviceText}>{device.name}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>

                        <TouchableOpacity
                            style={styles.modalCancelButton}
                            onPress={() => {
                                setShowDeviceSelector(false);
                                setPendingMessage(null);
                            }}
                        >
                            <Text style={styles.modalCancelText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.lg,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    headerTitle: {
        ...TYPOGRAPHY.title,
        marginBottom: SPACING.xs,
    },
    headerSubtitle: {
        ...TYPOGRAPHY.caption,
    },
    devicesSection: {
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.md,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    devicesHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.sm,
    },
    sectionTitle: {
        ...TYPOGRAPHY.subtitle,
    },
    deviceCount: {
        ...TYPOGRAPHY.caption,
        marginLeft: SPACING.xs,
    },
    devicesList: {
        flexGrow: 0,
    },
    deviceItem: {
        flexDirection: 'column',
        backgroundColor: COLORS.inputBackground,
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 16,
        marginRight: SPACING.sm,
        borderWidth: 2,
        borderColor: 'transparent',
        minWidth: 120,
    },
    deviceItemSelected: {
        backgroundColor: COLORS.accent + '20',
        borderColor: COLORS.accent,
    },
    deviceMainInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    signalIcon: {
        fontSize: 16,
        marginRight: 6,
    },
    deviceInfo: {
        flex: 1,
    },
    deviceDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: COLORS.success,
        marginRight: SPACING.sm,
    },
    deviceDotSelected: {
        backgroundColor: COLORS.accent,
    },
    deviceText: {
        ...TYPOGRAPHY.caption,
        color: COLORS.text,
        fontWeight: '600',
    },
    deviceTextSelected: {
        color: COLORS.accent,
        fontWeight: 'bold',
    },
    signalText: {
        fontSize: 10,
        color: COLORS.textSecondary,
        marginTop: 2,
    },
    messageBadge: {
        backgroundColor: COLORS.accent,
        borderRadius: 10,
        paddingHorizontal: 6,
        paddingVertical: 2,
        marginLeft: 6,
        minWidth: 20,
        alignItems: 'center',
    },
    messageBadgeText: {
        color: COLORS.background,
        fontSize: 10,
        fontWeight: 'bold',
    },
    emptyText: {
        ...TYPOGRAPHY.caption,
        fontStyle: 'italic',
    },
    deviceHint: {
        ...TYPOGRAPHY.caption,
        color: COLORS.textSecondary,
        fontSize: 11,
        marginTop: 8,
        fontStyle: 'italic',
    },
    chatSection: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    chatHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.md,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    chatHeaderInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 2,
    },
    chatSubtitle: {
        ...TYPOGRAPHY.caption,
        color: COLORS.accent,
        fontWeight: '600',
    },
    messageCountText: {
        ...TYPOGRAPHY.caption,
        color: COLORS.textSecondary,
        marginLeft: 4,
    },
    resetButton: {
        ...TYPOGRAPHY.caption,
        color: COLORS.accent,
    },
    messagesContainer: {
        flex: 1,
    },
    messagesContent: {
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.md,
        flexGrow: 1,
    },
    emptyChat: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: SPACING.xl,
    },
    emptyChatText: {
        ...TYPOGRAPHY.body,
        textAlign: 'center',
        color: COLORS.textSecondary,
    },
    buzzButton: {
        backgroundColor: COLORS.inputBackground,
        marginHorizontal: SPACING.md,
        marginVertical: SPACING.sm,
        paddingVertical: 12,
        borderRadius: 24,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.accent,
    },
    buzzButtonText: {
        ...TYPOGRAPHY.subtitle,
        color: COLORS.accent,
    },
    // Modal styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: SPACING.lg,
    },
    modalContent: {
        backgroundColor: COLORS.background,
        borderRadius: 20,
        padding: SPACING.lg,
        width: '100%',
        maxWidth: 400,
        maxHeight: '70%',
    },
    modalTitle: {
        ...TYPOGRAPHY.title,
        marginBottom: SPACING.sm,
        textAlign: 'center',
    },
    modalSubtitle: {
        ...TYPOGRAPHY.body,
        color: COLORS.textSecondary,
        marginBottom: SPACING.lg,
        textAlign: 'center',
    },
    modalDeviceList: {
        maxHeight: 300,
        marginBottom: SPACING.md,
    },
    modalDeviceItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.inputBackground,
        padding: SPACING.md,
        borderRadius: 12,
        marginBottom: SPACING.sm,
    },
    modalDeviceText: {
        ...TYPOGRAPHY.body,
        color: COLORS.text,
    },
    modalCancelButton: {
        backgroundColor: COLORS.inputBackground,
        padding: SPACING.md,
        borderRadius: 12,
        alignItems: 'center',
    },
    modalCancelText: {
        ...TYPOGRAPHY.subtitle,
        color: COLORS.textSecondary,
    },
    // Loading styles
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        ...TYPOGRAPHY.body,
        color: COLORS.textSecondary,
    },
});

export default App;
