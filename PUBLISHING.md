# 🚀 Publishing to GitHub Marketplace

This guide explains how to publish SOFF Telemetry as a GitHub Action on the Marketplace.

## Prerequisites

- GitHub account with a public repository
- Repository must have a valid `action.yml` file ✅
- Repository must have a README.md with usage instructions ✅
- Compiled code in `dist/` directory ✅

## Step-by-Step Publication Process

### 1. Ensure All Files Are Ready

Make sure you have:

- ✅ `action.yml` - Action metadata
- ✅ `README.md` - Documentation with examples
- ✅ `dist/action-entrypoint.js` - Compiled TypeScript
- ✅ `LICENSE` - MIT license

### 2. Build the Action

```bash
npm run build
```

This compiles TypeScript to JavaScript in the `dist/` folder.

### 3. Commit the Compiled Code

**Important:** GitHub Actions need the compiled code in the repository.

```bash
git add dist/
git add action.yml
git commit -m "feat: add GitHub Action support"
git push
```

### 4. Create a Release

#### Option A: Via GitHub UI

1. Go to your repository on GitHub
2. Click "Releases" → "Draft a new release"
3. Click "Choose a tag" and create a new tag: `v1.0.0`
4. Set release title: `v1.0.0 - Initial Release`
5. Write release notes describing features
6. Check ✅ "Publish this Action to the GitHub Marketplace"
7. Select primary category (e.g., "Continuous Integration")
8. Add additional categories if needed
9. Click "Publish release"

#### Option B: Via Git Command Line

```bash
# Create and push a tag
git tag -a v1.0.0 -m "Initial release"
git push origin v1.0.0

# Then go to GitHub UI to publish the release
```

### 5. Marketplace Categories

Choose relevant categories for your action:

- **Continuous Integration** - Build and test automation
- **Code Quality** - Linting, formatting, analysis
- **Deployment** - Publishing and deployment tools
- **Monitoring** - Logging and monitoring
- **Project Management** - Issue and project tracking
- **Publishing** - Package and artifact publishing
- **Utilities** - Helpful utilities

For SOFF Telemetry, recommended categories:

- Primary: **Utilities**
- Secondary: **Continuous Integration**

### 6. Create Major Version Tags

Create major version tags so users can reference `@v1` instead of `@v1.0.0`:

```bash
git tag -fa v1 -m "Update v1 tag"
git push origin v1 --force
```

This allows users to use:

```yaml
- uses: bledxs/soff-telemetry@v1 # Always latest v1.x.x
```

Instead of:

```yaml
- uses: bledxs/soff-telemetry@v1.0.0 # Specific version
```

## Versioning Best Practices

Follow [Semantic Versioning](https://semver.org/):

- **v1.0.0** - Initial stable release
- **v1.0.1** - Bug fixes (patch)
- **v1.1.0** - New features (minor)
- **v2.0.0** - Breaking changes (major)

### Example Release Workflow

```bash
# Bug fix
git tag -a v1.0.1 -m "Fix: output path resolution"
git push origin v1.0.1
git tag -fa v1 -m "Update v1 tag"
git push origin v1 --force

# New feature
git tag -a v1.1.0 -m "Add: light theme support"
git push origin v1.1.0
git tag -fa v1 -m "Update v1 tag"
git push origin v1 --force

# Breaking change
git tag -a v2.0.0 -m "Breaking: Change input names"
git push origin v2.0.0
git tag -a v2 -m "v2 major version"
git push origin v2
```

## Updating the Action

### For Bug Fixes and Features

1. Make your changes
2. Update version in `package.json`
3. Build: `npm run build`
4. Commit changes
5. Create and push new tag
6. Create GitHub release
7. Update major version tag

### Example Update Flow

```bash
# Make changes
npm run build

# Commit
git add .
git commit -m "feat: add new theme options"
git push

# Tag new version
git tag -a v1.2.0 -m "Add new theme options"
git push origin v1.2.0

# Update major version
git tag -fa v1 -m "Update v1 tag"
git push origin v1 --force
```

## Marketplace Visibility

### Optimize Your Listing

1. **Clear Title**: "Soff Telemetry - GitHub Stats Badges"

2. **Good Description**:

   ```text
   Generate beautiful GitHub profile stats, contribution badges, and visitor
   counters automatically with customizable themes.
   ```

3. **Detailed README**: Include:
   - Usage examples ✅
   - Input/output documentation ✅
   - Visual examples (screenshots)
   - Troubleshooting guide ✅

4. **Proper Keywords** in `action.yml`:

   ```yaml
   keywords:
     - github-actions
     - badges
     - stats
     - profile
     - readme
   ```

### Add Badges to README

```markdown
![GitHub release](https://img.shields.io/github/v/release/bledxs/soff-telemetry)
![GitHub Marketplace](https://img.shields.io/badge/Marketplace-Soff%20Telemetry-blue?logo=github)
![GitHub](https://img.shields.io/github/license/bledxs/soff-telemetry)
```

## Important Files for Marketplace

### action.yml Metadata

```yaml
name: 'Soff Telemetry'
description: 'Generate GitHub profile stats and badges'
author: 'bledxs'

branding:
  icon: 'activity' # Choose from Feather icons
  color: 'blue' # blue, green, red, yellow, etc.
```

[Browse available icons](https://feathericons.com/)

### README Requirements

Your README should have:

- ✅ Title and description
- ✅ Usage examples
- ✅ Input documentation
- ✅ Output documentation
- ✅ License information

## Distribution Strategies

### Strategy 1: Commit dist/ (Recommended for small actions)

**Pros:**

- Simple
- No additional setup needed
- Works immediately

**Cons:**

- Larger repository size
- Compiled code in git history

```bash
git add dist/
git commit -m "build: add compiled action"
```

### Strategy 2: Use @vercel/ncc (Bundle everything)

Package everything into a single file:

```bash
npm install -g @vercel/ncc
ncc build src/action-entrypoint.ts -o dist
```

Update `action.yml`:

```yaml
runs:
  using: 'node20'
  main: 'dist/index.js' # Single bundled file
```

### Strategy 3: Use GitHub Actions to build on release

Create `.github/workflows/release.yml`:

```yaml
name: Release

on:
  push:
    tags:
      - 'v*'

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run build
      - run: |
          git config user.name github-actions
          git config user.email github-actions@github.com
          git add dist/
          git commit -m "Build for release" || exit 0
          git push
```

## Testing Before Publishing

### Test Locally

Use `act` to test GitHub Actions locally:

```bash
# Install act
brew install act  # macOS
# or
choco install act-cli  # Windows

# Run workflow
act -W .github/workflows/update-badges.yml
```

### Test in a Separate Repo

1. Create a test repository
2. Reference your action branch directly:

```yaml
- uses: bledxs/soff-telemetry@test-branch
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}
```

### Test Different Versions

```yaml
# Test specific commit
- uses: bledxs/soff-telemetry@abc123

# Test branch
- uses: bledxs/soff-telemetry@main

# Test tag
- uses: bledxs/soff-telemetry@v1.0.0
```

## Checklist Before Publishing

- [ ] All TypeScript compiles without errors
- [ ] `action.yml` has correct metadata
- [ ] README has usage examples
- [ ] LICENSE file exists
- [ ] `dist/` folder has compiled JavaScript
- [ ] Version tags follow semver
- [ ] Branding (icon/color) is set
- [ ] Keywords are relevant
- [ ] Code is tested and working

## After Publishing

1. **Announce**: Share on social media, forums, Reddit
2. **Monitor**: Watch for issues and feedback
3. **Maintain**: Keep dependencies updated
4. **Document**: Add examples and troubleshooting
5. **Engage**: Respond to issues and PRs

## Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Publishing Actions to Marketplace](https://docs.github.com/en/actions/creating-actions/publishing-actions-in-github-marketplace)
- [Action Metadata Syntax](https://docs.github.com/en/actions/creating-actions/metadata-syntax-for-github-actions)
- [Awesome Actions](https://github.com/sdras/awesome-actions)

---

**Ready to publish?** Follow the steps above and share your action with the world! 🚀
