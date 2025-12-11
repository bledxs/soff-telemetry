# 🎨 Lucide Icons Integration

SOFF Telemetry now uses [Lucide](https://lucide.dev) for beautiful, consistent icons!

## Why Lucide?

- ✅ **Professional Design**: Crisp, modern icons designed by professionals
- ✅ **Consistent Style**: All icons share the same design language
- ✅ **Lightweight**: Only imports the icons you use
- ✅ **Open Source**: MIT licensed, 1000+ icons available
- ✅ **Active Development**: Regularly updated with new icons

## Available Icons

Current icons available in SOFF Telemetry:

| Icon | Name             | Best Use For                        |
| ---- | ---------------- | ----------------------------------- |
| 🔥   | `Flame`          | Contribution days, activity streaks |
| 📅   | `Calendar`       | Dates, schedules                    |
| 👁️   | `Eye`            | Visitors, views                     |
| ⭐   | `Star`           | GitHub stars, favorites             |
| 💻   | `Code`           | Code-related stats                  |
| 🌿   | `GitBranch`      | Branch count                        |
| 📝   | `GitCommit`      | Commit count                        |
| 🔄   | `GitPullRequest` | Pull requests                       |
| 📊   | `Activity`       | General activity                    |
| 📈   | `TrendingUp`     | Growth, trending stats              |
| 🏆   | `Award`          | Achievements, rank                  |
| ⚡   | `Zap`            | Speed, performance                  |
| ❤️   | `Heart`          | Favorites, likes                    |
| 👍   | `ThumbsUp`       | Approvals                           |
| 🎯   | `Target`         | Goals, objectives                   |
| 🥇   | `Trophy`         | Achievements                        |
| ✨   | `Sparkles`       | Special features                    |

## Using Icons in Your Badge

### Default Icon

The contribution badge uses the `Flame` icon by default:

```typescript
const flameIcon = createLucideIcon(
  IconPresets.contribution, // = 'Flame'
  { x: 10, y: 7 },
  14, // size
  theme.textColor,
);
```

### Icon Presets

Use convenient presets for common scenarios:

```typescript
import { IconPresets } from './components/lucide-icons.js';

// Available presets:
IconPresets.contribution; // Flame - for active days
IconPresets.calendar; // Calendar - for dates
IconPresets.stats; // Activity - for stats
IconPresets.stars; // Star - for GitHub stars
IconPresets.commits; // GitCommit - for commits
IconPresets.pullRequests; // GitPullRequest - for PRs
IconPresets.branches; // GitBranch - for branches
IconPresets.trending; // TrendingUp - for growth
IconPresets.award; // Award - for achievements
IconPresets.code; // Code - for code stats
IconPresets.zap; // Zap - for speed/performance
```

### Custom Icon Usage

Create badges with different icons:

```typescript
import { createLucideIcon } from './components/lucide-icons.js';

// Trophy icon for achievements
const trophyIcon = createLucideIcon(
  'Trophy',
  { x: 10, y: 7 },
  16,
  '#FFD700', // gold color
);

// Star icon for rating
const starIcon = createLucideIcon('Star', { x: 10, y: 7 }, 14, '#FFB800');

// Trending up for growth
const trendingIcon = createLucideIcon('TrendingUp', { x: 10, y: 7 }, 14, '#00D084');
```

## Adding More Icons

Want to add more icons? It's easy!

### Step 1: Find Your Icon

Browse [lucide.dev/icons](https://lucide.dev/icons) and find the icon you want.

### Step 2: Update lucide-icons.ts

Add the import and mapping:

```typescript
// 1. Import the icon
import {
  Flame,
  Calendar,
  // ... existing imports
  Rocket, // <- Add your new icon
} from 'lucide-static';

// 2. Add to iconMap
const iconMap = {
  Flame,
  Calendar,
  // ... existing icons
  Rocket, // <- Add here too
} as const;

// Type is automatically updated!
export type IconName = keyof typeof iconMap;
```

### Step 3: (Optional) Add to Presets

For commonly used icons, add a preset:

```typescript
export const IconPresets = {
  contribution: 'Flame' as IconName,
  // ... existing presets
  speed: 'Rocket' as IconName, // <- Add preset
};
```

### Step 4: Use It!

```typescript
const rocketIcon = createLucideIcon('Rocket', { x: 10, y: 7 }, 14, '#FF6B6B');
```

## Icon Customization

### Size

Icons are scaled from the default 24x24px:

```typescript
createLucideIcon('Star', { x: 10, y: 10 }, 12, color); // Small
createLucideIcon('Star', { x: 10, y: 10 }, 16, color); // Medium
createLucideIcon('Star', { x: 10, y: 10 }, 20, color); // Large
```

### Color

Use any valid SVG/CSS color:

```typescript
createLucideIcon('Heart', point, 14, '#FF0000'); // Hex
createLucideIcon('Heart', point, 14, 'rgb(255, 0, 0)'); // RGB
createLucideIcon('Heart', point, 14, theme.accentColor); // Theme color
```

### Position

Control exact placement:

```typescript
// Top left
createLucideIcon('Star', { x: 5, y: 5 }, 14, color);

// Centered (for 28px height badge)
createLucideIcon('Star', { x: 10, y: 7 }, 14, color);

// Right side
createLucideIcon('Star', { x: 200, y: 7 }, 14, color);
```

## Technical Details

### How It Works

Lucide icons are SVG elements with `<path>` data. The `createLucideIcon` function:

1. **Imports** the icon from `lucide-static`
2. **Extracts** the path data
3. **Scales** the icon to the desired size
4. **Transforms** coordinates to the specified position
5. **Applies** stroke color and styling

### SVG Output

Each icon generates clean SVG:

```xml
<g transform="translate(10, 7) scale(0.583)">
  <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"
        stroke="#c9d1d9"
        fill="none"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"/>
</g>
```

### Performance

- ✅ **Tree-shakeable**: Only imports icons you use
- ✅ **Zero runtime overhead**: Icons are embedded at build time
- ✅ **No network requests**: Everything is bundled
- ✅ **Tiny bundle size**: Each icon is ~1-2KB

## Examples

### Contribution Badge with Flame

```typescript
const badge = renderContributionBadge(data, {
  height: 28,
  theme: darkTheme,
  label: 'Active Days',
  icon: true, // Uses Flame icon
});
```

### Stats Card with Activity Icon

```typescript
const statsIcon = createLucideIcon(IconPresets.stats, { x: 15, y: 15 }, 18, theme.accentColor);
```

### Streak Badge with Zap Icon

```typescript
const zapIcon = createLucideIcon(
  IconPresets.zap,
  { x: 10, y: 7 },
  14,
  '#FFD700', // gold
);
```

## Migration from Old Icons

### Before (Hardcoded Icons)

```typescript
createIcon(point, size, fill, 'fire'); // Limited to 4 icons
```

### After (Lucide)

```typescript
createLucideIcon('Flame', point, size, fill); // 1000+ icons available!
```

## Resources

- 🎨 [Lucide Icon Gallery](https://lucide.dev/icons)
- 📖 [Lucide Documentation](https://lucide.dev/guide)
- 💻 [Lucide GitHub](https://github.com/lucide-icons/lucide)
- 📦 [Lucide Static NPM](https://www.npmjs.com/package/lucide-static)

## Benefits Over Custom Icons

| Feature         | Old (Hardcoded) | New (Lucide)        |
| --------------- | --------------- | ------------------- |
| Available icons | 4               | 1000+               |
| Design quality  | Varies          | Professional        |
| Consistency     | Mixed           | Uniform             |
| Adding icons    | Write SVG paths | Import from library |
| Maintenance     | Manual updates  | Auto-updated        |
| File size       | Fixed           | Tree-shakeable      |

---

**Ready to explore?** Check out [lucide.dev](https://lucide.dev) and pick your favorite icons! 🎨✨
