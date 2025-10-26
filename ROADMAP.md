# BuzzTag v3.0.0 Development Roadmap

## 🎯 Major Features Implementation Plan

### Phase 1: Core Infrastructure (Priority 1)
**Estimated Time: 2-3 hours**

#### 1.1 Persistent Storage System
- [ ] Install @react-native-async-storage/async-storage
- [ ] Create StorageService utility
- [ ] Save/load conversations
- [ ] Save/load device list
- [ ] Save/load user profile
- [ ] Auto-save on changes
- [ ] Migration system for updates

#### 1.2 User Profile System
- [ ] Profile setup screen
- [ ] Username input
- [ ] Avatar/emoji selector (10+ options)
- [ ] Profile preview
- [ ] Save to storage
- [ ] First-time setup flow

#### 1.3 End-to-End Encryption
- [ ] Install crypto library (react-native-quick-crypto or similar)
- [ ] Generate keypairs per user
- [ ] Encrypt messages before sending
- [ ] Decrypt received messages
- [ ] Key exchange protocol
- [ ] Secure storage for private keys

---

### Phase 2: Real Bluetooth Communication (Priority 1)
**Estimated Time: 3-4 hours**

#### 2.1 BLE Service & Characteristics
- [ ] Define BLE service UUID
- [ ] Define characteristic UUIDs (tx/rx)
- [ ] Set up peripheral mode (advertising)
- [ ] Set up central mode (scanning)
- [ ] Handle connections
- [ ] Handle disconnections

#### 2.2 Message Protocol
- [ ] Design message packet structure
- [ ] Implement message chunking (BLE has 20-byte limit)
- [ ] Message reassembly
- [ ] Message acknowledgment
- [ ] Retry mechanism
- [ ] Message queue management

#### 2.3 Profile Broadcasting
- [ ] Broadcast username in advertising data
- [ ] Broadcast avatar emoji
- [ ] Read peer profile on connection
- [ ] Update UI with real names

---

### Phase 3: UI Enhancements (Priority 2)
**Estimated Time: 2-3 hours**

#### 3.1 Sound Effects & Haptics
- [ ] Install react-native-sound or use native APIs
- [ ] Add message send sound
- [ ] Add message receive sound
- [ ] Add device connect sound
- [ ] Add device disconnect sound
- [ ] Custom haptic patterns:
  - Short (50ms) - tap/select
  - Medium (100ms) - send message
  - Pattern (100-50-100ms) - new device
  - Long (200ms) - achievement unlocked

#### 3.2 Connection Status Panel
- [ ] Scanning indicator animation
- [ ] Connection quality meter (RSSI-based)
- [ ] "Last seen" timestamps
- [ ] Online/offline status dots
- [ ] Connection state: Connecting → Connected → Disconnected
- [ ] Auto-reconnect indicator

#### 3.3 Message Reactions
- [ ] Long-press message to show reaction picker
- [ ] Emoji reaction options: 👍 ❤️ 😂 😮 😢 🔥
- [ ] Store reactions in message object
- [ ] Display reactions below messages
- [ ] Animated reaction appearance
- [ ] Count multiple same reactions
- [ ] Tap reaction to add yours

---

### Phase 4: Advanced Features (Priority 2)
**Estimated Time: 3-4 hours**

#### 4.1 Voice Messages
- [ ] Install @react-native-community/audio-toolkit or react-native-audio-recorder-player
- [ ] Record button UI
- [ ] Recording duration display
- [ ] Waveform visualization (simplified bars)
- [ ] Play/pause controls
- [ ] Audio compression
- [ ] Send audio via Bluetooth (chunked)
- [ ] Audio cache management

#### 4.2 Achievements System
- [ ] Achievement data structure
- [ ] Achievement unlock conditions:
  - 🎯 Ice Breaker - First message sent
  - 💬 Conversationalist - 10 messages sent
  - 🤝 Social Butterfly - Connected to 5 devices
  - 🔥 On Fire - 50 messages in one session
  - 🌟 Super Star - 100 total messages
  - 🦋 Buzz Master - Used all 50 questions
- [ ] Achievement notification UI
- [ ] Achievement badge display
- [ ] Achievement progress tracking
- [ ] Achievement unlock animation
- [ ] Achievements screen/modal

---

### Phase 5: Security & Encryption (Priority 1)
**Estimated Time: 2-3 hours**

#### 5.1 Message Encryption
- [ ] Install react-native-quick-crypto or crypto-js
- [ ] AES-256 encryption for messages
- [ ] RSA key exchange
- [ ] Encrypt before BLE transmission
- [ ] Decrypt on receive
- [ ] Handle encryption errors

#### 5.2 Key Management
- [ ] Generate public/private keypair on first launch
- [ ] Store private key securely (Keychain/Keystore)
- [ ] Exchange public keys on connection
- [ ] Session key generation
- [ ] Key rotation support

#### 5.3 Security Indicators
- [ ] 🔒 Encrypted badge on messages
- [ ] Connection security status
- [ ] Warning for unencrypted connections
- [ ] Encryption toggle (optional)

---

## 📦 Dependencies to Install

```bash
# Core functionality
npm install @react-native-async-storage/async-storage

# Encryption
npm install react-native-quick-crypto
# OR
npm install crypto-js

# Audio (for voice messages)
npm install react-native-audio-recorder-player

# Additional utilities
npm install react-native-get-random-values  # For UUID generation
```

---

## 🗂️ New File Structure

```
BuzzTag/
├── services/
│   ├── bluetooth.js (existing - enhance)
│   ├── storage.js (NEW - AsyncStorage wrapper)
│   ├── encryption.js (NEW - crypto functions)
│   ├── audio.js (NEW - voice recording/playback)
│   └── achievements.js (NEW - achievement logic)
├── components/
│   ├── ChatBubble.js (existing - add reactions)
│   ├── InputBar.js (existing - add voice button)
│   ├── TypingIndicator.js (existing)
│   ├── ReactionPicker.js (NEW)
│   ├── VoiceRecorder.js (NEW)
│   ├── AudioPlayer.js (NEW)
│   ├── ProfileSetup.js (NEW)
│   ├── AchievementBadge.js (NEW)
│   ├── AchievementNotification.js (NEW)
│   └── ConnectionStatusBar.js (NEW)
├── screens/
│   ├── ChatScreen.js (refactor from App.js)
│   ├── ProfileScreen.js (NEW)
│   └── AchievementsScreen.js (NEW)
├── utils/
│   ├── constants.js (NEW - UUIDs, configs)
│   ├── sounds.js (NEW - sound effects)
│   └── haptics.js (NEW - vibration patterns)
└── data/
    ├── questions.json (existing)
    ├── achievements.json (NEW)
    └── avatars.json (NEW)
```

---

## 🎨 UI Components Hierarchy

```
App
├── ProfileSetup (first time only)
└── MainScreen
    ├── Header
    │   ├── Profile Button
    │   ├── Achievements Button
    │   └── Settings Button
    ├── ConnectionStatusBar (NEW)
    │   ├── Scanning indicator
    │   └── Connection quality
    ├── DeviceList
    │   └── DeviceChip (with online/offline status)
    ├── ChatArea
    │   ├── ChatBubble (with reactions & timestamps)
    │   ├── VoiceMessageBubble (NEW)
    │   └── TypingIndicator
    ├── InputBar
    │   ├── Text input
    │   ├── Voice button (NEW)
    │   └── Send button
    └── AchievementNotification (toast)
```

---

## 🔄 Message Flow with Encryption

```
User A                          User B
  |                               |
  | 1. Type message              |
  | 2. Encrypt with B's pubkey   |
  | 3. Send via BLE              |
  |----------------------------->|
  |                              | 4. Receive encrypted
  |                              | 5. Decrypt with privkey
  |                              | 6. Display message
  |                              | 7. Send ACK
  |<-----------------------------|
  | 8. Update delivery status    |
```

---

## 📊 Data Structures

### User Profile
```javascript
{
  id: "uuid",
  username: "JohnDoe",
  avatar: "😎",
  publicKey: "base64...",
  createdAt: timestamp,
  stats: {
    messagesSent: 0,
    devicesConnected: 0,
    questionsUsed: 0
  }
}
```

### Message with Reactions
```javascript
{
  id: "uuid",
  deviceId: "device-uuid",
  text: "encrypted-or-plain",
  isBot: false,
  timestamp: 1234567890,
  encrypted: true,
  reactions: [
    { emoji: "👍", userId: "uuid", timestamp: 123 }
  ],
  voiceNote: {
    uri: "file://...",
    duration: 5.2,
    waveform: [0.2, 0.5, 0.8, ...]
  }
}
```

### Achievement
```javascript
{
  id: "ice_breaker",
  title: "Ice Breaker",
  description: "Send your first message",
  icon: "🎯",
  unlocked: false,
  unlockedAt: null,
  condition: { type: "messages_sent", count: 1 }
}
```

---

## 🎯 Implementation Priority

### Week 1: Core Features
1. ✅ Persistent Storage (Day 1-2)
2. ✅ User Profile Setup (Day 2-3)
3. ✅ Real BLE Messaging (Day 3-5)
4. ✅ Message Encryption (Day 5-7)

### Week 2: Enhancements
5. ✅ Sound Effects & Haptics (Day 8-9)
6. ✅ Connection Status Panel (Day 9-10)
7. ✅ Message Reactions (Day 10-11)
8. ✅ Achievements System (Day 12-14)

### Week 3: Advanced
9. ✅ Voice Messages (Day 15-18)
10. ✅ Polish & Testing (Day 19-21)

---

## 🧪 Testing Checklist

- [ ] AsyncStorage save/load
- [ ] Profile creation flow
- [ ] BLE message sending (2 devices)
- [ ] BLE message receiving (2 devices)
- [ ] Encryption/decryption
- [ ] Sound playback
- [ ] Haptic feedback
- [ ] Reactions add/remove
- [ ] Voice recording
- [ ] Voice playback
- [ ] Achievement unlocking
- [ ] App restart (data persistence)
- [ ] Multiple devices simultaneously
- [ ] Connection/disconnection handling
- [ ] Edge cases (no Bluetooth, no permissions)

---

## 📝 Version Planning

- **v2.2.0** - Current (timestamps, signal strength, copy, remove)
- **v3.0.0** - THIS RELEASE (all above features)
- **v3.1.0** - Photo sharing, themes
- **v3.2.0** - Group conversations
- **v4.0.0** - Backend sync, cloud features

---

**Ready to implement? This will be AMAZING!** 🚀

