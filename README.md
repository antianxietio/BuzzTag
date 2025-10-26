# 🚀 BuzzTag 3.0

**The Bluetooth Icebreaker Chat App with Real Messaging**

*Break the ice. Connect nearby. Chat securely.*

---

## 📱 Overview

BuzzTag is a Bluetooth-based social icebreaker app that lets you discover nearby users, chat in real-time, and break the ice with fun questions. With user profiles, encrypted messaging, achievements, and more - BuzzTag makes meeting new people fun and secure.

### Key Features

- 👤 **User Profiles** - Create your identity with 24 emoji avatars and custom usernames
- 📡 **Real BLE Messaging** - Send and receive messages directly via Bluetooth
- 🔐 **End-to-End Encryption** - AES-256 encrypted conversations (optional)
- 🎯 **Icebreaker Questions** - Break the ice with random conversation starters
- � **Individual Device Chats** - Separate chat threads for each nearby device
- 💾 **Persistent Storage** - All conversations, profiles, and settings saved locally
- 🎖️ **Achievement System** - 12 achievements to unlock (Ice Breaker, Social Butterfly, Night Owl, etc.)
- � **Message Reactions** - React to messages with 8 emoji reactions
- 🔔 **Haptic Feedback** - Custom vibration patterns for different actions
- � **Connection Status** - Real-time Bluetooth status with color indicators
- ⚙️ **Settings Page** - Customize your experience and manage data
- 🔒 **Privacy First** - No internet required, everything stays on your device

---

## 🛠️ Tech Stack

- **Framework**: React Native 0.72.6
- **Bluetooth**: react-native-ble-plx ^3.1.2
- **Animations**: react-native-reanimated ~3.3.0
- **Storage**: @react-native-async-storage/async-storage ^1.19.0
- **Encryption**: crypto-js ^4.2.0
- **Platform**: Android (API 24+) & iOS 14+

---

## 📦 Installation

### Prerequisites

- Node.js 16+
- React Native CLI
- Android Studio (for Android)
- Xcode (for iOS)

### Setup

1. **Clone and install dependencies**:
   ```bash
   cd BuzzTag
   npm install
   ```

2. **iOS Setup**:
   ```bash
   cd ios
   pod install
   cd ..
   ```

3. **Run the app**:
   ```bash
   # Android
   npm run android

   # iOS
   npm run ios
   ```

---

## 🎨 Color Palette

| Element | Color Code |
|---------|-----------|
| Background | `#0B132B` |
| Accent | `#5BC0BE` |
| Text | `#FFFFFF` |
| Bot Bubble | `#3A506B` |
| User Bubble | `#5BC0BE` |

---

## 📁 Project Structure

```
BuzzTag/
├── App.js                      # Main app with state management
├── services/
│   ├── bluetooth.js            # BLE messaging & device detection
│   ├── storage.js              # AsyncStorage wrapper
│   ├── encryption.js           # AES-256 encryption service
│   ├── achievements.js         # Achievement tracking system
│   └── sound.js                # Haptic feedback service
├── components/
│   ├── ChatBubble.js          # Message bubble with reactions
│   ├── InputBar.js            # Text input component
│   ├── TypingIndicator.js     # Animated typing indicator
│   ├── ProfileSetup.js        # First-time user setup
│   ├── ConnectionStatusBar.js # BT status indicator
│   ├── ReactionPicker.js      # Emoji reaction modal
│   └── AchievementNotification.js # Achievement unlock animation
├── screens/
│   └── SettingsScreen.js      # Settings & profile management
├── data/
│   ├── questions.json         # Icebreaker questions
│   └── achievements.json      # Achievement definitions
├── styles.js                  # Theme & colors
├── android/                   # Android config
└── ios/                       # iOS config
```

---

## 🔐 Permissions

### Android
- `BLUETOOTH` / `BLUETOOTH_ADMIN`
- `BLUETOOTH_SCAN` / `BLUETOOTH_CONNECT` (Android 12+)
- `ACCESS_FINE_LOCATION`

### iOS
- `NSBluetoothAlwaysUsageDescription`
- `NSLocationWhenInUseUsageDescription`

---

## 🎯 How It Works

1. **First Launch** → Create your profile with avatar and username
2. **Enable Bluetooth** → Grant necessary permissions
3. **Automatic Scanning** → App discovers nearby BuzzTag users
4. **Select Device** → Tap a device to start chatting
5. **Send Messages** → Type freely or use icebreaker questions
6. **Add Reactions** → Long-press messages to react with emojis
7. **Unlock Achievements** → Complete challenges to earn badges
8. **Customize Settings** → Toggle encryption, sounds, and haptics

---

## 🎖️ Achievements

Unlock 12 achievements as you use BuzzTag:

- 💬 **Ice Breaker** - Send your first message
- 🗣️ **Conversationalist** - Send 10 messages
- 📢 **Chatterbox** - Send 50 messages
- 🦋 **Social Butterfly** - Connect with 5 devices
- 🌐 **Networker** - Connect with 10 devices
- ❓ **Question Master** - Answer 25 questions
- 🎯 **Buzz Master** - Answer 50 questions
- 🔥 **On Fire** - Send 20 messages in one session
- ⚡ **Speedster** - Send 5 messages in 30 seconds
- 🌙 **Night Owl** - Active between midnight and 5 AM
- 🌅 **Early Bird** - Active between 5 AM and 8 AM
- ❤️ **Loyal User** - Active for 7 different days

---

## ⚙️ Settings & Features

- 👤 **Profile Management** - Edit username, change avatar, view your profile
- 🎖️ **Achievement Progress** - See unlocked badges and track progress
- 🔊 **Sound Effects** - Toggle haptic feedback on/off
- 🔐 **Encryption** - Enable/disable AES-256 message encryption
- 🗑️ **Data Management** - Clear conversations or reset profile
- 📊 **Statistics** - View messages sent, devices connected, and more

---

## 🚀 What's New in v3.0.0

- ✨ **User Profiles** - Personalize with avatars and usernames
- 📡 **Real Bluetooth Messaging** - Direct BLE communication
- 🔐 **End-to-End Encryption** - Secure your conversations
- 💾 **Persistent Storage** - Never lose your chats
- 🎖️ **Achievement System** - 12 unlockable badges
- 😊 **Message Reactions** - Express yourself with 8 emojis
- 🔔 **Haptic Feedback** - Feel every interaction
- 📊 **Connection Status** - Know your Bluetooth state
- ⚙️ **Settings Page** - Full control over your experience
- 🎯 **Smart Device Filtering** - Only shows mobile devices

---

## 🚀 Future Enhancements

- � **Voice Messages** - Send audio clips
- 📸 **Photo Sharing** - Share images via Bluetooth
- 🎭 **Question Categories** - Filter by mood (Funny, Deep, Chill)
- 👥 **Group Chats** - Multi-device conversations
- 📍 **Location Tags** - Remember where you connected
- 🌐 **Event Mode** - Special mode for meetups
- 🌓 **Themes** - Light/Dark mode customization
- 📈 **Analytics Dashboard** - Detailed usage statistics

---

## 📄 License

MIT License - feel free to use and modify!

---

## 💡 Motto

**"Connect nearby. Chat securely. Break the ice."**

---

## 📦 Download

- **GitHub Releases**: [Download APK](https://github.com/antianxietio/BuzzTag/releases)
- **Play Store**: Coming soon!

---

Built with ❤️ using React Native | v3.0.0
