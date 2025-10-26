# GitHub Repository Protection Setup Guide

This guide will help you set up branch protection rules to prevent direct commits to the main branch and require code review.

## 🔒 Step-by-Step Setup

### 1. Go to Repository Settings
1. Navigate to your repository: `https://github.com/antianxietio/BuzzTag`
2. Click on **Settings** (top menu)
3. In the left sidebar, click **Branches** (under "Code and automation")

### 2. Add Branch Protection Rule
1. Click **Add branch protection rule**
2. In "Branch name pattern", enter: `master`

### 3. Configure Protection Rules

#### ✅ Required Settings (Check these boxes):

**Protect matching branches:**
- ✅ **Require a pull request before merging**
  - ✅ Require approvals: **1** (you need to approve before merge)
  - ✅ Dismiss stale pull request approvals when new commits are pushed
  - ✅ Require review from Code Owners (optional)

- ✅ **Require status checks to pass before merging**
  - ✅ Require branches to be up to date before merging

- ✅ **Require conversation resolution before merging**

- ✅ **Require linear history** (optional, keeps history clean)

- ✅ **Do not allow bypassing the above settings**
  - ⚠️ **Important:** Uncheck "Allow administrators to bypass" if you want strict enforcement
  - OR: Keep it checked so YOU can merge urgent fixes

**Rules applied to everyone:**
- ✅ **Restrict who can push to matching branches**
  - Click "Restrict pushes"
  - Leave empty or add only your username (antianxietio)
  - This prevents EVERYONE else from pushing directly

- ✅ **Lock branch** (optional - prevents any changes except via PR)

- ✅ **Allow force pushes**: ❌ Disabled (unchecked)
- ✅ **Allow deletions**: ❌ Disabled (unchecked)

### 4. Save Protection Rule
Click **Create** at the bottom

---

## 🎯 Alternative: Using Rulesets (New GitHub Feature)

### Access Rulesets
1. Go to **Settings** > **Rules** > **Rulesets**
2. Click **New ruleset** > **New branch ruleset**

### Configure Ruleset

**Ruleset Name:** `Protect Main Branch`

**Enforcement status:** Active

**Target branches:**
- Add target: Include default branch

**Rules:**
1. ✅ **Restrict deletions**
2. ✅ **Require a pull request before merging**
   - Required approvals: 1
3. ✅ **Require status checks to pass**
4. ✅ **Block force pushes**
5. ✅ **Require linear history**

**Bypass list:**
- Add yourself (antianxietio) if you want override capability
- Or leave empty for strict enforcement

Click **Create**

---

## 📋 What This Accomplishes

### ✅ Contributors CANNOT:
- Push directly to `master` branch
- Force push to `master`
- Delete the `master` branch
- Merge without your approval
- Bypass status checks

### ✅ Contributors MUST:
1. Fork the repository
2. Create a feature branch in their fork
3. Make changes and commit
4. Open a Pull Request
5. Wait for your review and approval
6. You merge after approval

### ✅ You (Owner) CAN:
- Review all pull requests
- Request changes
- Approve and merge
- (Optional) Bypass rules for urgent fixes if enabled

---

## 🔄 Contributor Workflow

```bash
# 1. Fork on GitHub (click Fork button)

# 2. Clone their fork
git clone https://github.com/THEIR_USERNAME/BuzzTag.git

# 3. Add upstream (your repo)
git remote add upstream https://github.com/antianxietio/BuzzTag.git

# 4. Create feature branch
git checkout -b feature/new-feature

# 5. Make changes and commit
git add .
git commit -m "feat: add new feature"

# 6. Push to their fork
git push origin feature/new-feature

# 7. Open PR on GitHub (to your main branch)
```

---

## 🛡️ Additional Security Settings

### Enable Required Reviews
1. Settings > **Moderation options**
2. ✅ Limit interactions (optional - for public repos)

### Add CODEOWNERS File
Create `.github/CODEOWNERS`:
```
# Require review from owner for all files
* @antianxietio

# Specific file patterns
*.js @antianxietio
android/** @antianxietio
```

### Enable Discussions (Optional)
1. Settings > **Features**
2. ✅ Discussions
3. This allows contributors to ask questions without creating issues

---

## 📝 Summary of Files Added

1. ✅ `CONTRIBUTING.md` - Contribution guidelines
2. ✅ `.github/PULL_REQUEST_TEMPLATE.md` - PR template
3. ✅ This guide - Branch protection setup

---

## 🚀 Quick Setup Checklist

- [ ] Navigate to Settings > Branches
- [ ] Add branch protection rule for `master`
- [ ] Check "Require a pull request before merging"
- [ ] Check "Require approvals: 1"
- [ ] Check "Restrict who can push to matching branches"
- [ ] Check "Do not allow bypassing"
- [ ] Check "Block force pushes"
- [ ] Save the rule
- [ ] Test by trying to push to master (should fail)

---

## ⚠️ Important Notes

1. **You cannot push directly either** if you enable strict mode
2. **Always work in branches** even as the owner
3. **Use PRs for your own changes** to maintain history
4. **Collaborators MUST fork** - they cannot push to branches in your repo
5. **External contributors** automatically use fork workflow

---

## 🆘 If Something Goes Wrong

To temporarily disable protection:
1. Settings > Branches
2. Click on the rule
3. Click "Delete rule"
4. Make your changes
5. Re-enable the rule

---

This configuration ensures:
- ✅ Open source (anyone can fork)
- ✅ Code review required (you review everything)
- ✅ No direct commits to main
- ✅ Clean git history
- ✅ Safe collaboration

