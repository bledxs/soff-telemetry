# 🎯 SOFF Telemetry

> Self-hosted GitHub profile stats, streak, and visitor badges — Use as a reusable GitHub Action or self-host

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)
[![Code Style: Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://prettier.io/)
[![GitHub Marketplace](https://img.shields.io/badge/Marketplace-Soff%20Telemetry-blue?logo=github)](https://github.com/marketplace/actions/soff-telemetry)

## ✨ Features

- 📅 **Active Days**: Total contribution days from GitHub (shows consistency)
- 📊 **GitHub Stats**: Commits, PRs, Issues, Stars (Coming Soon)
- 🔥 **Top Languages**: Most used programming languages (Coming Soon)
- ⚡ **Streak Stats**: Contribution streak tracking (Coming Soon)
- 🎨 **Lucide Icons**: Beautiful, professional icons from [Lucide](https://lucide.dev) (1000+ icons available)

**Why use SOFF Telemetry?**

- ✅ **No fork required** - Use as a GitHub Action directly
- ✅ **No rate limits** - Self-hosted data
- ✅ **Full control** - Customize design and themes
- ✅ **Lucide icons** - Professional, consistent icon library
- ✅ **Free database** - Repository acts as storage
- ✅ **Automated updates** - GitHub Actions cron jobs
- ✅ **Real data** - Powered by GitHub API (not fake counters)

## 📦 Architecture

```text
soff-telemetry/
├── .github/workflows/    # Automated updates (cron job)
├── src/
│   ├── domain/           # Pure types & interfaces
│   ├── infrastructure/   # GitHub API & storage layer
│   ├── presentation/     # SVG rendering & templates
│   │   ├── components/   # Reusable SVG utilities
│   │   └── templates/    # Badge templates
│   └── main.ts           # Orchestrator
├── data/                 # Generated badges & counters
└── dist/                 # Compiled TypeScript

```

### Design Principles

- **Clean Architecture**: Domain-driven design with clear separation
- **Type Safety**: Strict TypeScript with explicit types
- **Modular**: Easy to add new badges and customize designs
- **Professional**: ESLint, Prettier, Husky pre-commit hooks

## 🚀 Quick Start

### Option 1: Use as a GitHub Action (Recommended)

The easiest way to use SOFF Telemetry is as a reusable GitHub Action. No fork required!

#### Step 1: Create a workflow file

Create `.github/workflows/update-badges.yml` in your profile repository:

```yaml
name: Update Telemetry Badges

on:
  schedule:
    - cron: '0 0 * * *' # Daily at midnight
  workflow_dispatch: # Manual trigger

jobs:
  update-badges:
    runs-on: ubuntu-latest
    permissions:
      contents: write

    steps:
      - uses: actions/checkout@v4

      - name: Generate Soff Telemetry
        uses: bledxs/soff-telemetry@v1
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          theme: 'dark'
          output_dir: './assets'
          service: 'contribution'

      - name: Commit changes
        run: |
          git config --local user.email "github-actions[bot]@users.noreply.github.com"
          git config --local user.name "github-actions[bot]"
          git add -A
          git diff --quiet && git diff --staged --quiet || (git commit -m "🤖 Update badges" && git push)
```

#### Step 2: Use the badge in your README

```markdown
![Active Days](https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_USERNAME/main/assets/contribution-badge.svg)
```

#### Available Inputs

| Input          | Description                                    | Required | Default          |
| -------------- | ---------------------------------------------- | -------- | ---------------- |
| `github_token` | GitHub token with read:user permissions        | Yes      | -                |
| `username`     | GitHub username (defaults to repo owner)       | No       | Repository owner |
| `theme`        | Badge theme (dark, light)                      | No       | `dark`           |
| `output_dir`   | Output directory for badges                    | No       | `./data`         |
| `service`      | Service to generate (contribution, stats, all) | No       | `contribution`   |

#### Available Outputs

| Output       | Description                      |
| ------------ | -------------------------------- |
| `badge_path` | Path to the generated badge file |
| `total_days` | Total active contribution days   |

### Option 2: Fork & Self-Host

If you want to customize the code or add your own features:

#### 1. Fork & Clone

```bash
git clone https://github.com/YOUR_USERNAME/soff-telemetry.git
cd soff-telemetry
npm install
```

#### 2. Test Locally

```bash
# 1. Copy the example environment file
cp .env.example .env

# 2. Edit .env and add your GitHub credentials
# GITHUB_USERNAME=your-username
# GITHUB_TOKEN=your-github-token

# 3. Install dependencies
npm install

# 4. Run the script
npm run update-contribution

# OR pass username as argument (overrides .env)
npm run update-contribution -- --username=your-username

# Watch mode for development
npm run dev

# Build TypeScript
npm run build
```

> **Note**: Get a GitHub token from [Settings → Developer settings → Personal access tokens](https://github.com/settings/tokens). Only `read:user` scope is needed.

#### 3. Use in Your Profile

```markdown
![Active Days](https://raw.githubusercontent.com/YOUR_USERNAME/soff-telemetry/main/data/contribution-badge.svg)
```

The badge updates automatically every night via GitHub Actions!

## 🛠️ Development

### Available Scripts

```bash
npm run dev              # Development mode with watch
npm run build            # Compile TypeScript
npm run update-contribution # Generate active days badge
npm run update-stats     # Generate stats card (coming soon)
npm run update-all       # Generate all badges

# Code Quality
npm run lint             # Check linting
npm run lint:fix         # Fix linting issues
npm run format           # Format code with Prettier
npm run typecheck        # Type checking
```

### Git Hooks (Husky)

- **pre-commit**: Runs lint-staged (ESLint + Prettier on staged files)
- **pre-push**: Runs type checking

## 🎨 Customization

### Theme Colors

Edit `src/presentation/theme.ts`:

```typescript
export const defaultTheme: Theme = {
  background: '#0d1117',
  textColor: '#c9d1d9',
  accentColor: '#58a6ff', // Main blue
  secondaryColor: '#1f6feb', // Darker blue
  borderColor: '#30363d',
  progressBarBg: '#21262d',
  progressBarFill: '#58a6ff',
};
```

### Badge Design

Each badge template is in `src/presentation/templates/`. Modify:

- Layout and dimensions
- Icons and gradients
- Text styles and positioning

## 🤖 GitHub Actions

The workflow runs:

- **Daily** at 00:00 UTC (cron job)
- **Manually** via workflow dispatch
- **On push** to main (for testing)

Auto-commits changes to `data/` folder.

## 📚 Project Structure

```typescript
// Domain: Pure types, no dependencies
export interface ContributionData {
  totalDays: number;
  lastUpdated: string;
}

// Infrastructure: I/O operations
class FileStorage implements IStorage {
  async read<T>(key: string): Promise<T | null>;
  async write<T>(key: string, data: T): Promise<void>;
}

// Presentation: SVG generation
function renderContributionBadge(data: ContributionData): string {
  // Returns SVG string
}
```

## 🗺️ Roadmap

- [x] Contribution Days badge with gradient & fire icon
- [x] Professional tooling (ESLint, Prettier, Husky)
- [x] GitHub API integration for real contribution data
- [ ] GitHub Stats Card
- [ ] Top Languages Card
- [ ] Streak Stats Card
- [ ] Multiple theme support
- [ ] Animated badges
- [ ] Unit tests

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## � Documentation

- **[Usage Examples](USAGE.md)** - Detailed examples and advanced configurations- **[Lucide Icons Guide](docs/LUCIDE_ICONS.md)** - How to use and customize icons- **[Publishing Guide](PUBLISHING.md)** - How to publish to GitHub Marketplace
- **[Contributing](CONTRIBUTING.md)** - Contribution guidelines

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by [github-readme-stats](https://github.com/anuraghazra/github-readme-stats)
- Icons powered by [Lucide](https://lucide.dev) - Beautiful & consistent open source icons
- Built with ❤️ and TypeScript by [@bledxs](https://github.com/bledxs)

---

<div align="center">

**⭐ If you find this useful, give it a star!**

[Report Bug](https://github.com/bledxs/soff-telemetry/issues) · [Request Feature](https://github.com/bledxs/soff-telemetry/issues) · [View Examples](USAGE.md)

</div>
