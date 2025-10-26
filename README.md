# 🚀 BuzzTag 2.0

**The Bluetooth Icebreaker Chat App**

*Break the ice. Talk to the question.*

---

## 📱 Overview

BuzzTag is an anonymous Bluetooth-based icebreaker app that detects nearby users and displays fun questions whenever a new phone is found. Users can respond to questions in a built-in mini chat interface, creating a unique conversational experience.

### Key Features

- 🔄 **Spontaneous Questions** - Every nearby device triggers a fresh random question
- 💬 **Icebreaker Chat** - Answer fun prompts in a chat bubble interface
- 🔒 **Privacy First** - No user data collection, everything stays local
- 📱 **Clean UX** - Smooth chat-style layout with animations
- 🕹️ **Offline Simplicity** - Works completely offline using BLE

---

## 🛠️ Tech Stack

- **Framework**: React Native 0.72.6
- **Bluetooth**: react-native-ble-plx
- **Animations**: react-native-reanimated
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
├── App.js                      # Main app component
├── services/
│   └── bluetooth.js            # BLE scanning & device detection
├── components/
│   ├── ChatBubble.js          # Message bubble component
│   ├── InputBar.js            # Text input component
│   └── TypingIndicator.js     # Animated typing indicator
├── data/
│   └── questions.json         # Icebreaker questions
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

1. **Launch App** → Request Bluetooth permissions
2. **Scanning Starts** → Looks for nearby BLE devices
3. **Device Found** → Triggers a random question
4. **User Responds** → Types answer in chat interface
5. **Buzz Again** → Manually get a new question

---

## 🚀 Future Enhancements

- 🎭 **Personality Modes** - Funny, Deep, Chill question styles
- 📍 **Shared Answers** - QR code sharing
- 🌐 **Event Mode** - Connect at events
- 🧠 **AI Prompts** - Smart question generation
- 🌓 **Themes** - Light/Dark mode

---

## 📄 License

MIT License - feel free to use and modify!

---

## 💡 Motto

**"Talk to the moment. Answer the buzz."**

---

Built with ❤️ using React Native
