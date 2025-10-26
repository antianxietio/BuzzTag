/**
 * BuzzTag Styles and Theme
 * Color palette and shared styles
 */

export const COLORS = {
    // Main colors
    background: '#0B132B',
    accent: '#5BC0BE',
    text: '#FFFFFF',
    textSecondary: '#A0A8B8',

    // Chat bubbles
    botBubble: '#3A506B',
    userBubble: '#5BC0BE',

    // UI elements
    inputBackground: '#1C2541',
    border: '#2D3748',
    placeholder: '#6B7280',
    disabled: '#4A5568',

    // Status
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
};

export const SPACING = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
};

export const TYPOGRAPHY = {
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    subtitle: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.text,
    },
    body: {
        fontSize: 16,
        color: COLORS.text,
    },
    caption: {
        fontSize: 14,
        color: COLORS.textSecondary,
    },
    small: {
        fontSize: 12,
        color: COLORS.textSecondary,
    },
};
