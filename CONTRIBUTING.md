# Contributing to BuzzTag

First off, thank you for considering contributing to BuzzTag! 🎉

## 📋 Table of Contents
- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Process](#development-process)
- [Pull Request Process](#pull-request-process)
- [Style Guidelines](#style-guidelines)

## 🤝 Code of Conduct

This project and everyone participating in it is governed by respect and professionalism. Be kind, be constructive, and help make this a welcoming community.

## 🚀 How Can I Contribute?

### Reporting Bugs
- Use the GitHub Issues tab
- Check if the bug was already reported
- Include detailed steps to reproduce
- Include screenshots if applicable
- Mention your device and Android version

### Suggesting Features
- Open a GitHub Issue with the "enhancement" label
- Clearly describe the feature and its benefits
- Explain why this feature would be useful

### Code Contributions
- Fork the repository
- Create a feature branch
- Make your changes
- Submit a pull request

## 💻 Development Process

### 1. Fork the Repository
```bash
# Click the "Fork" button on GitHub
# Then clone your fork
git clone https://github.com/YOUR_USERNAME/BuzzTag.git
cd BuzzTag
```

### 2. Create a Branch
```bash
# Create a new branch for your feature/fix
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

Branch naming conventions:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `refactor/` - Code refactoring
- `test/` - Adding tests

### 3. Set Up Development Environment
```bash
# Install dependencies
npm install

# For Android development
cd android
./gradlew assembleDebug
cd ..
```

### 4. Make Your Changes
- Write clean, readable code
- Follow existing code style
- Add comments for complex logic
- Update documentation if needed
- Test your changes thoroughly

### 5. Commit Your Changes
```bash
git add .
git commit -m "feat: add awesome new feature"
```

Commit message format:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

### 6. Push to Your Fork
```bash
git push origin feature/your-feature-name
```

### 7. Open a Pull Request
- Go to the original BuzzTag repository
- Click "New Pull Request"
- Select your fork and branch
- Fill out the PR template
- Wait for review

## 🔄 Pull Request Process

### Before Submitting
- [ ] Code builds successfully (`./gradlew assembleRelease`)
- [ ] No console errors or warnings
- [ ] Tested on physical Android device
- [ ] Updated CHANGELOG.md if applicable
- [ ] Added/updated comments and documentation
- [ ] Followed the style guidelines

### PR Requirements
1. **Title**: Clear and descriptive (e.g., "Add message timestamps feature")
2. **Description**: Explain what and why (use the template)
3. **Screenshots**: Include before/after screenshots for UI changes
4. **Testing**: Describe how you tested the changes
5. **Breaking Changes**: Clearly note any breaking changes

### Review Process
- Maintainer will review your PR within 1-7 days
- Address any requested changes
- Once approved, maintainer will merge
- **DO NOT push directly to main/master branch**

## 📝 Style Guidelines

### JavaScript/React Native
- Use functional components with hooks
- Use ES6+ syntax
- Follow existing code structure
- Use meaningful variable names
- Add JSDoc comments for functions

```javascript
/**
 * Description of what the function does
 * @param {string} param1 - Description of param1
 * @returns {boolean} Description of return value
 */
const myFunction = (param1) => {
    // Implementation
};
```

### File Organization
```
components/     - Reusable UI components
services/       - Business logic and services
data/           - Static data and configurations
styles.js       - Global styles and theme
```

### Component Structure
```javascript
// 1. Imports
import React, { useState } from 'react';
import { View, Text } from 'react-native';

// 2. Component
const MyComponent = ({ prop1, prop2 }) => {
    // 3. State and hooks
    const [state, setState] = useState(null);
    
    // 4. Functions
    const handleAction = () => {
        // ...
    };
    
    // 5. Render
    return (
        <View>
            <Text>Content</Text>
        </View>
    );
};

// 6. Styles
const styles = StyleSheet.create({
    // ...
});

// 7. Export
export default MyComponent;
```

### Naming Conventions
- Components: PascalCase (`ChatBubble.js`)
- Functions: camelCase (`handleSendMessage`)
- Constants: UPPER_SNAKE_CASE (`MAX_DEVICES`)
- Files: camelCase for utilities, PascalCase for components

## 🎨 UI/UX Guidelines
- Follow Material Design principles
- Maintain consistent spacing (use SPACING constants)
- Use colors from `styles.js` theme
- Ensure accessibility (readable text, touch targets)
- Test on different screen sizes

## 🧪 Testing
- Test on real Android devices when possible
- Test all user flows
- Test edge cases (no devices, many devices, etc.)
- Test Bluetooth permissions and connections
- Verify no crashes or memory leaks

## 📚 Additional Resources
- [React Native Docs](https://reactnative.dev/docs/getting-started)
- [React Hooks](https://react.dev/reference/react)
- [React Native BLE PLX](https://github.com/dotintent/react-native-ble-plx)

## 🆘 Getting Help
- Check existing issues and discussions
- Ask questions in GitHub Discussions
- Read the README.md and documentation
- Review existing code for examples

## 📜 License
By contributing, you agree that your contributions will be licensed under the same license as the project (see LICENSE file).

---

Thank you for contributing to BuzzTag! 🔵💬

