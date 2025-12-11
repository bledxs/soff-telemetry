# 🎯 Quick Reference: Soff Telemetry as GitHub Action

## 📦 What You Get

SOFF Telemetry is now a **reusable GitHub Action** that anyone can use without forking!

```yaml
# That's it! Just 3 lines:
- uses: bledxs/soff-telemetry@v1
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}
```

## 🚀 For Users (How to Use)

### 1. Add to Your Profile Repo

Create `.github/workflows/update-badges.yml`:

```yaml
name: Update Profile Badges

on:
  schedule:
    - cron: '0 0 * * *' # Daily at midnight
  workflow_dispatch:

jobs:
  update:
    runs-on: ubuntu-latest
    permissions:
      contents: write

    steps:
      - uses: actions/checkout@v4

      - name: Generate Telemetry Badge
        uses: bledxs/soff-telemetry@v1
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          theme: 'dark'
          output_dir: './assets'

      - name: Commit changes
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add -A
          git diff --quiet && git diff --staged --quiet || (git commit -m "🤖 Update badges" && git push)
```

### 2. Add Badge to README

```markdown
![Active Days](https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_USERNAME/main/assets/contribution-badge.svg)
```

### 3. Done! 🎉

The badge will update automatically every day.

## 🔧 For You (Maintainer)

### To Publish to Marketplace

1. **Ensure everything is built:**

   ```bash
   npm run build
   ```

2. **Commit the dist folder:**

   ```bash
   git add dist/
   git add action.yml
   git commit -m "feat: publish as GitHub Action"
   git push
   ```

3. **Create a release on GitHub:**
   - Go to Releases → New Release
   - Tag: `v1.0.0`
   - Title: `v1.0.0 - Initial Release`
   - ✅ Check "Publish to Marketplace"
   - Select category: "Utilities"
   - Publish!

4. **Create major version tag:**

   ```bash
   git tag -fa v1 -m "v1 latest"
   git push origin v1 --force
   ```

Now users can reference `@v1` and always get the latest v1.x.x version!

## 📊 Architecture

```text
bledxs/soff-telemetry (Your Repo - The Action)
├── action.yml          ← Defines the action
├── dist/
│   └── action-entrypoint.js ← Compiled code
└── src/
    └── action-entrypoint.ts  ← Entry point for Action

user/user (User's Profile Repo)
├── .github/workflows/
│   └── update-badges.yml     ← Uses your action
├── assets/
│   └── contribution-badge.svg ← Generated badge
└── README.md                  ← Shows the badge
```

## 🎯 Benefits

### For Users

✅ No fork needed
✅ No code maintenance
✅ Always get latest version with `@v1`
✅ Just 3 lines of YAML

### For You

✅ Single source of truth (your repo)
✅ Easy to update everyone at once
✅ Community can contribute via PRs
✅ Portfolio/showcase piece

## 📝 Versioning Strategy

```bash
# Bug fixes - patch version
git tag v1.0.1
git tag -fa v1
git push origin v1.0.1 v1 --force

# New features - minor version
git tag v1.1.0
git tag -fa v1
git push origin v1.1.0 v1 --force

# Breaking changes - major version
git tag v2.0.0
git tag v2
git push origin v2.0.0 v2
```

Users choose:

- `@v1` - Latest v1.x.x (auto-updates)
- `@v1.0.0` - Locked to specific version
- `@main` - Latest commit (bleeding edge)

## 🔍 What Changed

### New Files

- ✅ `action.yml` - Action metadata
- ✅ `src/action-entrypoint.ts` - Action entry point
- ✅ `.github/workflows/update-badges.yml` - Example workflow
- ✅ `USAGE.md` - Detailed usage examples
- ✅ `PUBLISHING.md` - Publishing guide

### Updated Files

- ✅ `package.json` - Added @actions/core and @actions/github
- ✅ `README.md` - Added "Use as Action" section
- ✅ `src/presentation/theme.ts` - Accept string theme names

### Dependencies Added

- `@actions/core` - GitHub Actions toolkit
- `@actions/github` - GitHub API helpers

## 🎬 Next Steps

1. **Test locally:**

   ```bash
   npm run build
   npm run update-contribution
   ```

2. **Commit and push:**

   ```bash
   git add .
   git commit -m "feat: transform into reusable GitHub Action"
   git push
   ```

3. **Create release on GitHub**

4. **Test in a real repo:**
   - Create a test profile repo
   - Add the workflow
   - Run it manually
   - Verify badge generates

5. **Announce:**
   - Share on Twitter/X
   - Post on Reddit (r/github)
   - Dev.to article
   - LinkedIn post

## 💡 Tips

- Add screenshots to README
- Create video demo (1-2 minutes)
- Add "Use this Action" button
- Respond to issues quickly
- Keep updating with new features

---

**You now have a production-ready GitHub Action! 🚀**
