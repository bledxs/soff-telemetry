# 🎯 SOFF Telemetry

> Self-hosted GitHub profile stats, streak, and visitor badges built with TypeScript

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)
[![Code Style: Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://prettier.io/)

## ✨ Features

- 👁️ **Visitor Badge**: Real-time visitor counter with eye icon and gradient design
- 📊 **GitHub Stats**: Commits, PRs, Issues, Stars (Coming Soon)
- 🔥 **Top Languages**: Most used programming languages (Coming Soon)
- ⚡ **Streak Stats**: Contribution streak tracking (Coming Soon)

**Why self-hosted?**

- ✅ No rate limits
- ✅ Full control over design and data
- ✅ Repository acts as free database
- ✅ Automated updates via GitHub Actions

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

### 1. Fork & Clone

```bash
git clone https://github.com/YOUR_USERNAME/soff-telemetry.git
cd soff-telemetry
npm install
```

### 2. Test Locally

```bash
# Generate visitor badge
npm run update-visitor

# Watch mode for development
npm run dev

# Build TypeScript
npm run build
```

### 3. Use in Your Profile

```markdown
![Visitors](https://raw.githubusercontent.com/YOUR_USERNAME/soff-telemetry/main/data/visitor-badge.svg)
```

The badge updates automatically every night via GitHub Actions!

## 🛠️ Development

### Available Scripts

```bash
npm run dev              # Development mode with watch
npm run build            # Compile TypeScript
npm run update-visitor   # Generate visitor badge
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
export interface VisitorData {
  count: number;
  lastUpdated: string;
}

// Infrastructure: I/O operations
class FileStorage implements IStorage {
  async read<T>(key: string): Promise<T | null>;
  async write<T>(key: string, data: T): Promise<void>;
}

// Presentation: SVG generation
function renderVisitorBadge(data: VisitorData): string {
  // Returns SVG string
}
```

## 🗺️ Roadmap

- [x] Visitor Badge with gradient & icon
- [x] Professional tooling (ESLint, Prettier, Husky)
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

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by [github-readme-stats](https://github.com/anuraghazra/github-readme-stats)
- Built with ❤️ and TypeScript

---

**Made with ☕ by [SOFF](https://github.com/YOUR_USERNAME)**

## 🎨 Theme

Custom blue palette inspired by VTEX/React aesthetics.

## 📝 License

MIT
