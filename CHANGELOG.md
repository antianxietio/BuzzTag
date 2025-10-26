# Changelog

All notable changes to BuzzTag will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.2.0] - 2025-10-26

### Added
- **Message Timestamps**: Display time for each message (relative and absolute)
- **Signal Strength Indicators**: Show Bluetooth RSSI strength (Excellent/Good/Fair/Weak) for each device
- **Long-Press to Copy**: Long-press any message to copy its text to clipboard
- **Device Removal**: Long-press device chips to remove them from the list
- **Message Count Display**: Show total message count in chat header
- **Device Selection Hints**: Helper text showing tap/long-press interactions
- **Toast Notifications**: Android toast feedback when copying messages
- **Improved Device Cards**: Enhanced device chips with signal strength and message badges
- **Contribution Guidelines**: Added comprehensive CONTRIBUTING.md
- **Pull Request Template**: Standardized PR template for contributors
- **CODEOWNERS File**: Automatic code review assignment
- **Branch Protection Guide**: Complete guide for repository protection setup

### Changed
- **Device Filtering**: Improved Bluetooth device filtering to exclude unnamed/system devices
- **Device UI Layout**: Redesigned device chips with vertical layout showing signal strength
- **Vibration Feedback**: Enhanced haptic feedback on all user interactions
- **Chat Header**: Now shows device name and message count
- **Message Bubbles**: Added timestamps at bottom of each message

### Fixed
- "Buzz Again" functionality now sends questions FROM user TO device (not from BuzzTag)
- Button text changes from "Buzz Newly" to "Buzz Again" after first message
- Buzz button now always visible when device is selected (not just when messages exist)
- Device filtering excludes generic "Device_X" names and MAC addresses

### Technical Details
- Added `Clipboard` and `ToastAndroid` imports
- Added `handleLongPressMessage()` for message copy functionality
- Added `handleRemoveDevice()` for device removal
- Added `getSignalStrength()` for RSSI interpretation
- Added `formatTimestamp()` for relative time display
- Updated `ChatBubble` component to support long-press and timestamps
- Enhanced device rendering with signal indicators

### Documentation
- Created `CONTRIBUTING.md` - 300+ lines of contribution guidelines
- Created `.github/PULL_REQUEST_TEMPLATE.md` - Standardized PR format
- Created `.github/CODEOWNERS` - Auto-assign reviews to @antianxietio
- Created `BRANCH_PROTECTION_GUIDE.md` - Step-by-step repository protection setup

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

