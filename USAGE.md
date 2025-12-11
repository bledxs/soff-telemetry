# 📚 Usage Examples

This document provides detailed examples of how to use SOFF Telemetry in different scenarios.

## Basic Usage

### Minimal Setup

The simplest way to use SOFF Telemetry:

```yaml
name: Update Badges

on:
  schedule:
    - cron: '0 0 * * *'
  workflow_dispatch:

jobs:
  update:
    runs-on: ubuntu-latest
    permissions:
      contents: write

    steps:
      - uses: actions/checkout@v4
      - uses: bledxs/soff-telemetry@v1
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}

      - run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add -A
          git commit -m "Update badges" || exit 0
          git push
```

### Custom Theme

Using a different theme:

```yaml
- uses: bledxs/soff-telemetry@v1
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}
    theme: 'light'
```

### Custom Output Directory

Generate badges in a specific directory:

```yaml
- uses: bledxs/soff-telemetry@v1
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}
    output_dir: './github-stats'
```

### Specific Username

Generate badges for a specific user (useful for organization profiles):

```yaml
- uses: bledxs/soff-telemetry@v1
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}
    username: 'specific-user'
```

## Advanced Usage

### Multiple Badges with Different Themes

Generate the same badge with different themes:

```yaml
jobs:
  update-badges:
    runs-on: ubuntu-latest
    permissions:
      contents: write

    steps:
      - uses: actions/checkout@v4

      - name: Generate Dark Theme
        uses: bledxs/soff-telemetry@v1
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          theme: 'dark'
          output_dir: './assets/dark'

      - name: Generate Light Theme
        uses: bledxs/soff-telemetry@v1
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          theme: 'light'
          output_dir: './assets/light'

      - name: Commit changes
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add -A
          git diff --quiet && git diff --staged --quiet || (git commit -m "🎨 Update badges" && git push)
```

Then use in README:

```markdown
<!-- For users with dark mode -->

![Active Days](https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_USERNAME/main/assets/dark/contribution-badge.svg#gh-dark-mode-only)

<!-- For users with light mode -->

![Active Days](https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_USERNAME/main/assets/light/contribution-badge.svg#gh-light-mode-only)
```

### Using Outputs

Use the action outputs in subsequent steps:

```yaml
- name: Generate Badge
  id: telemetry
  uses: bledxs/soff-telemetry@v1
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}

- name: Use Outputs
  run: |
    echo "Badge generated at: ${{ steps.telemetry.outputs.badge_path }}"
    echo "Total active days: ${{ steps.telemetry.outputs.total_days }}"
```

### Conditional Execution

Only run when there are actual changes:

```yaml
- name: Generate Badge
  uses: bledxs/soff-telemetry@v1
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}

- name: Check for changes
  id: verify
  run: |
    if git diff --quiet; then
      echo "changed=false" >> $GITHUB_OUTPUT
    else
      echo "changed=true" >> $GITHUB_OUTPUT
    fi

- name: Commit if changed
  if: steps.verify.outputs.changed == 'true'
  run: |
    git config user.name "github-actions[bot]"
    git config user.email "github-actions[bot]@users.noreply.github.com"
    git add -A
    git commit -m "Update badges [skip ci]"
    git push
```

### Schedule with Timezone

Run at specific times in your timezone:

```yaml
on:
  schedule:
    # Run at 9 AM UTC (3 AM CST)
    - cron: '0 9 * * *'

    # Run twice a day
    - cron: '0 0,12 * * *'

    # Run only on weekdays at 8 AM UTC
    - cron: '0 8 * * 1-5'
```

### With Custom Commit Message

```yaml
- name: Commit with custom message
  run: |
    git config user.name "github-actions[bot]"
    git config user.email "github-actions[bot]@users.noreply.github.com"
    git add -A

    # Create a detailed commit message
    DAYS="${{ steps.telemetry.outputs.total_days }}"
    git commit -m "🤖 Update telemetry badges" -m "Active days: $DAYS" || exit 0
    git push
```

## README Integration

### Simple Badge

```markdown
![Active Days](https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_USERNAME/main/assets/contribution-badge.svg)
```

### Badge with Link

```markdown
[![Active Days](https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_USERNAME/main/assets/contribution-badge.svg)](https://github.com/YOUR_USERNAME)
```

### Aligned Badges

```markdown
<div align="center">
  <img src="https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_USERNAME/main/assets/contribution-badge.svg" alt="Active Days" />
</div>
```

### Multiple Badges in a Row

```markdown
<p align="center">
  <img src="https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_USERNAME/main/assets/contribution-badge.svg" alt="Active Days" />
  <img src="https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_USERNAME/main/assets/stats-badge.svg" alt="Stats" />
</p>
```

## Troubleshooting

### Token Permissions

If you get authentication errors, ensure your token has the correct permissions:

1. Go to Settings → Developer settings → Personal access tokens
2. Generate a new token with `read:user` scope
3. Add it as a repository secret named `GH_TOKEN`
4. Use it in your workflow:

```yaml
with:
  github_token: ${{ secrets.GH_TOKEN }}
```

### Output Directory Not Created

The action automatically creates the output directory, but if you have issues:

```yaml
steps:
  - uses: actions/checkout@v4

  - name: Create output directory
    run: mkdir -p ./assets

  - uses: bledxs/soff-telemetry@v1
    with:
      github_token: ${{ secrets.GITHUB_TOKEN }}
      output_dir: './assets'
```

### Commits Not Showing Up

Make sure your workflow has write permissions:

```yaml
jobs:
  update-badges:
    runs-on: ubuntu-latest
    permissions:
      contents: write # This is required!
```

### Badge Not Updating in README

GitHub caches images. To force refresh:

1. Add a cache-busting query parameter:

   ```markdown
   ![Badge](https://raw.githubusercontent.com/USER/REPO/main/badge.svg?v=1)
   ```

2. Or use the GitHub CDN:

   ```markdown
   ![Badge](https://github.com/USER/REPO/raw/main/badge.svg)
   ```

## Performance Tips

### Run Less Frequently

If you don't need daily updates:

```yaml
on:
  schedule:
    # Run weekly on Monday at midnight
    - cron: '0 0 * * 1'
```

### Skip CI on Badge Updates

Prevent triggering other workflows:

```yaml
git commit -m "Update badges [skip ci]"
```

## Security Best Practices

1. **Use GITHUB_TOKEN when possible**: It's automatically provided and scoped to the repository

2. **For private repos**, create a Personal Access Token with minimal scopes

3. **Never commit tokens**: Always use GitHub Secrets

4. **Use read-only permissions**: The action only needs `read:user` scope

## Need Help?

- 📖 [Full Documentation](https://github.com/bledxs/soff-telemetry)
- 🐛 [Report Issues](https://github.com/bledxs/soff-telemetry/issues)
- 💬 [Discussions](https://github.com/bledxs/soff-telemetry/discussions)
