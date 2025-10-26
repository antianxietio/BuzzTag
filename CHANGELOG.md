# Changelog

All notable changes to BuzzTag will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased] - v3.0.0 Development

### In Progress
- **Persistent Storage**: Save conversations and data permanently
- **User Profiles**: Custom username and avatar selection
- **Real Bluetooth Messaging**: True peer-to-peer communication
- **End-to-End Encryption**: Secure message encryption
- **Sound Effects**: Audio feedback for actions
- **Enhanced Haptics**: Custom vibration patterns
- **Message Reactions**: Emoji reactions on messages
- **Voice Messages**: Record and send voice notes
- **Achievements System**: Unlock badges for milestones
- **Connection Status**: Real-time connection indicators

### Added (Development)
- Storage service for AsyncStorage operations
- Achievements data with 12 unique badges
- Roadmap document for v3.0.0 planning
- Dependencies: async-storage, audio-recorder-player, crypto-js

---

## [2.2.0] - 2025-10-26

### Added
- **Message Timestamps**: Display time for each message (relative and absolute)
  - Shows "Just now" for recent messages
  - Shows "Xm ago" for messages within the hour
  - Shows time for messages today (e.g., "2:30 PM")
  - Shows day and time for older messages
- **Signal Strength Indicators**: Show Bluetooth RSSI strength for each device
  - 📶 Excellent (> -60 dBm)
  - 📶 Good (-60 to -70 dBm)
  - 📡 Fair (-70 to -80 dBm)
  - 📡 Weak (< -80 dBm)
- **Long-Press to Copy**: Long-press any message to copy its text to clipboard
  - Shows Android toast notification on copy
  - Works for both user and bot messages
- **Device Removal**: Long-press device chips to remove them from the list
  - Confirmation dialog before removal
  - Clears conversation history for removed device
- **Message Count Display**: Show total message count in chat header
  - Updates in real-time as you chat
  - Shows "X message(s)" format
- **Device Selection Hints**: Helper text showing "💡 Tap to select • Long press to remove"
- **Toast Notifications**: Android toast feedback when copying messages
- **Improved Device Cards**: Enhanced device chips with signal strength and message badges
  - Signal icon and text (Excellent/Good/Fair/Weak)
  - Message count badge on devices with conversations
  - Minimum width for better touch targets
- **Contribution Guidelines**: Added comprehensive CONTRIBUTING.md
- **Pull Request Template**: Standardized PR template for contributors
- **CODEOWNERS File**: Automatic code review assignment to @antianxietio
- **Branch Protection Guide**: Complete guide for repository protection setup

### Changed
- **Device Filtering**: Improved Bluetooth device filtering to exclude unnamed/system devices
  - Filters out "Unknown" devices
  - Filters out generic "Device_X" names
  - Filters out MAC address-based names
- **Device UI Layout**: Redesigned device chips with vertical layout
  - Signal strength icon at top
  - Device name and signal text below
  - Message badge on the right
  - Better use of space in horizontal scroll
- **Vibration Feedback**: Enhanced haptic feedback on all user interactions
  - Single vibration (50ms) for message sends, copies, selections
  - Multi-pattern vibration for device discovery (100ms-50ms-100ms)
- **Chat Header**: Now shows device name and message count
  - Device name in accent color
  - Message count in secondary text color
  - Clean, informative layout
- **Message Bubbles**: Added timestamps at bottom of each message
  - Small, subtle timestamp text
  - Right-aligned in bubbles
  - Maintains clean bubble design
- **ChatBubble Component**: Now supports long-press interaction
  - TouchableOpacity wrapper for press handling
  - Passes onLongPress callback
  - Maintains existing animations

### Fixed
- **"Buzz Again" functionality** now sends questions FROM user TO device (not from BuzzTag)
  - Questions appear as YOUR messages (blue bubbles)
  - No more confusing bot responses
  - Matches expected messaging pattern
- **Button text** changes from "Buzz Newly" to "Buzz Again" after first message
  - Shows 🎯 "Buzz Newly" for fresh conversations
  - Shows 🔁 "Buzz Again" after messages sent
- **Buzz button** now always visible when device is selected
  - Previously only showed when messages existed
  - Now available immediately after device selection
- **Device filtering** excludes generic "Device_X" names and MAC addresses
  - Cleaner device list
  - Only shows meaningful device names

### Technical Details
- Added `Clipboard` import from react-native for copy functionality
- Added `ToastAndroid` import for Android-specific toast notifications
- Added `Platform` import for platform-specific features
- Added `handleLongPressMessage()` for message copy functionality with alert dialog
- Added `handleRemoveDevice()` for device removal with confirmation
- Added `getSignalStrength()` for RSSI interpretation and icon selection
- Added `formatTimestamp()` for relative time display logic
- Updated `ChatBubble` component props: `timestamp`, `onLongPress`
- Enhanced `renderDeviceItem()` with signal strength display
- Added new styles: `deviceMainInfo`, `signalIcon`, `signalText`, `chatHeaderInfo`, `messageCountText`, `deviceHint`
- Modified `showNewQuestion()` to send as user message instead of bot message

### Documentation
- Created `CONTRIBUTING.md` - 300+ lines of contribution guidelines
  - Code of conduct
  - Development process workflow
  - Branch naming conventions
  - Commit message format
  - PR requirements
  - Style guidelines
  - Testing checklist
- Created `.github/PULL_REQUEST_TEMPLATE.md` - Standardized PR format
  - Description template
  - Change type checkboxes
  - Testing checklist
  - Screenshot sections
- Created `.github/CODEOWNERS` - Auto-assign reviews to @antianxietio
  - Global ownership
  - Path-specific owners
  - Documentation ownership
- Created `BRANCH_PROTECTION_GUIDE.md` - Step-by-step repository protection setup
  - Traditional branch protection rules
  - New GitHub rulesets approach
  - Contributor workflow example
  - Quick setup checklist

### Security
- **Branch Protection Enabled**: Master branch now requires pull requests
  - Prevents direct pushes
  - Requires code review approval
  - Forces collaborative workflow
  - Protects against accidental force pushes

---

## [2.1.0] - 2025-10-26

### Added
- **Individual Chat Per Device**: Each connected device now has its own separate conversation thread
- **Device Selection System**: Users can now select which device to chat with from the device list
- **Device Selection Modal**: When sending a message without a selected device, a modal appears to choose the recipient
- **Message Count Badges**: Device chips now display the number of messages in each conversation
- **Visual Device Selection**: Selected device is highlighted with accent color and border
- **Device-Specific Question Tracking**: Each device maintains its own set of used questions to avoid repetition
- **Enhanced Vibration Patterns**: Multi-pattern vibrations (100ms, 50ms, 100ms) for better haptic feedback
- **Auto-Device Selection**: First discovered device is automatically selected and sent a welcome question

### Changed
- **App.js**: 
  - Refactored from single message array to conversation-based architecture using Map structure
  - Changed state management: `messages` → `conversations` (object with deviceId keys)
  - Updated `usedQuestions` from Set to Map to track questions per device
  - Modified `handleDeviceFound()` to initialize conversations and auto-select first device
  - Enhanced `getRandomQuestion()` to accept deviceId parameter for device-specific tracking
  - Refactored `showNewQuestion()` to work with specific device conversations
  - Rewrote `handleSendMessage()` to check for device selection and show modal if needed
  - Added `sendMessageToDevice()` helper function for sending messages to specific devices
  - Added `handleDeviceSelect()` for device selection with pending message support
  - Updated device rendering to show selection state and message counts
  - Enhanced chat UI to display current device name in header subtitle
  - Modified empty state messages based on device selection status
  - Added Modal component for device selection interface

- **ChatBubble.js**:
  - Enhanced animation with spring physics (tension: 50, friction: 7)
  - Added scale animation (0.8 → 1.0) for pop-in effect
  - Added `delay` prop to support staggered animations
  - Changed from `Animated.timing` to `Animated.spring` for more natural motion
  - Added `scaleAnim` reference for scale transformation

- **InputBar.js**:
  - Added `disabled` prop to prevent input when no device is selected
  - Implemented focus state tracking with `isFocused` state
  - Added animated border color that changes on focus (border → accent color)
  - Enhanced send button with scale animation on press
  - Changed button to show emoji icons (🔒 when disabled, 📤 when enabled)
  - Added keyboard dismiss on send
  - Improved button styling with circular design (44x44 dp)
  - Added shadow effects to send button
  - Increased border width from 1px to 2px for better visibility
  - Added `inputDisabled` style for visual feedback

- **TypingIndicator.js**:
  - Added entrance animations (fade + slide) when component appears
  - Enhanced dot bounce with spring physics instead of timing
  - Increased dot size from 8dp to 10dp for better visibility
  - Added label "BuzzTag 💬" for consistency with chat bubbles
  - Improved animation sequence with better timing (0ms, 200ms, 400ms delays)
  - Added proper cleanup with animation stop on unmount

### Fixed
- Random thinking time for bot responses (1200-2000ms) for more natural feel
- Message persistence per device conversation
- Scroll behavior when switching between device chats
- Device selector properly closes after message sent

### Technical Details
- **State Architecture**: Conversations stored as `{ [deviceId]: { messages: [], isTyping: false } }`
- **Question Tracking**: `Map<deviceId, Set<questions>>` for per-device question history
- **Modal Implementation**: Full-screen overlay with device list and cancel button
- **Animation Library**: Leveraged React Native's Animated API with spring physics
- **Haptic Feedback**: Multi-pattern vibration on device discovery and button presses

---

## [2.0.0] - 2025-10-26 (Initial Release)

### Added
- Initial BuzzTag app with Bluetooth device discovery
- Icebreaker question system with 50 questions
- Chat interface with bot and user messages
- Real-time device scanning
- Typing indicator animation
- Message input with send button
- "Buzz Again" button for new questions
- Reset chat functionality
- Android permissions handling (Bluetooth, Location, Vibrate)
- React Native 0.72.6 setup
- Bluetooth Low Energy (BLE) support via react-native-ble-plx
- Custom styling system with color themes

### Technical Stack
- React Native 0.72.6
- react-native-ble-plx ^3.1.2
- react-native-reanimated ~3.3.0
- react-native-permissions ^3.10.1
- react-native-vector-icons ^10.0.0
- Gradle 7.6.1
- Android Gradle Plugin 7.4.2
- Java 17 (Microsoft OpenJDK)
- Kotlin 1.8.0

