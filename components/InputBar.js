/**
 * InputBar Component
 * Text input with send button for chat interface
 */

import React, { useState, useRef, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Animated, Keyboard } from 'react-native';
import { COLORS } from '../styles';

const InputBar = ({ onSend, placeholder = "Type your answer...", disabled = false }) => {
    const [text, setText] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const focusAnim = useRef(new Animated.Value(0)).current;
    const buttonScale = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.spring(focusAnim, {
            toValue: isFocused ? 1 : 0,
            tension: 50,
            friction: 7,
            useNativeDriver: false,
        }).start();
    }, [isFocused]);

    const handleSend = () => {
        if (text.trim() && !disabled) {
            // Button press animation
            Animated.sequence([
                Animated.spring(buttonScale, {
                    toValue: 0.9,
                    tension: 100,
                    useNativeDriver: true,
                }),
                Animated.spring(buttonScale, {
                    toValue: 1,
                    tension: 100,
                    useNativeDriver: true,
                }),
            ]).start();

            onSend(text.trim());
            setText('');
            Keyboard.dismiss();
        }
    };

    const borderColor = focusAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [COLORS.border, COLORS.accent],
    });

    return (
        <Animated.View style={[styles.container, { borderTopColor: borderColor }]}>
            <TextInput
                style={[
                    styles.input,
                    disabled && styles.inputDisabled,
                ]}
                value={text}
                onChangeText={setText}
                placeholder={placeholder}
                placeholderTextColor={COLORS.placeholder}
                multiline
                maxLength={500}
                returnKeyType="send"
                onSubmitEditing={handleSend}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                editable={!disabled}
            />
            <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                <TouchableOpacity
                    style={[
                        styles.sendButton,
                        (!text.trim() || disabled) && styles.sendButtonDisabled
                    ]}
                    onPress={handleSend}
                    disabled={!text.trim() || disabled}
                    activeOpacity={0.7}
                >
                    <Text style={styles.sendButtonText}>
                        {disabled ? '🔒' : '📤'}
                    </Text>
                </TouchableOpacity>
            </Animated.View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: COLORS.inputBackground,
        borderTopWidth: 2,
        borderTopColor: COLORS.border,
    },
    input: {
        flex: 1,
        backgroundColor: COLORS.background,
        borderRadius: 24,
        paddingHorizontal: 16,
        paddingVertical: 10,
        marginRight: 12,
        color: COLORS.text,
        fontSize: 14,
        maxHeight: 100,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    inputDisabled: {
        opacity: 0.5,
    },
    sendButton: {
        backgroundColor: COLORS.accent,
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: COLORS.accent,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4,
    },
    sendButtonDisabled: {
        backgroundColor: COLORS.disabled,
        opacity: 0.5,
        shadowOpacity: 0,
        elevation: 0,
    },
    sendButtonText: {
        fontSize: 20,
    },
});

export default InputBar;
