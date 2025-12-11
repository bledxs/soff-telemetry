import 'dotenv/config';
import { FileStorage } from './infrastructure/kv-store.js';
import { getTheme } from './presentation/theme.js';
import {
  renderContributionBadge,
  getDefaultContributionBadgeOptions,
} from './presentation/templates/contribution-badge.js';
import {
  renderStatsCard,
  getDefaultStatsCardOptions,
} from './presentation/templates/stats-card.js';
import {
  fetchContributionCalendar,
  calculateActiveDays,
  fetchGitHubStats,
  getGitHubUsername,
  getGitHubToken,
} from './infrastructure/github-api.js';
import { ContributionData } from './domain/types.js';
import { writeFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Main orchestrator - generates badges/stats
 */
async function main() {
  const args = process.argv.slice(2);
  const service = args.find((arg) => arg.startsWith('--service='))?.split('=')[1] || 'contribution';
  const username = args.find((arg) => arg.startsWith('--username='))?.split('=')[1];

  console.log(`🚀 Generating ${service} badge/stats...`);

  // Initialize storage
  const storage = new FileStorage();

  if (service === 'contribution' || service === 'all') {
    await generateContributionBadge(storage, username);
  }

  if (service === 'stats' || service === 'all') {
    await generateStatsCard(storage, username);
  }

  // TODO: Add other services here
  // if (service === 'languages' || service === 'all') { ... }
  // if (service === 'streak' || service === 'all') { ... }

  console.log('✅ Done!');
}

/**
 * Generates the Contribution Days Badge
 */
async function generateContributionBadge(storage: FileStorage, username?: string) {
  console.log('  📊 Fetching contribution data from GitHub...');

  try {
    // Get GitHub credentials
    const githubUsername = getGitHubUsername(username);
    const token = getGitHubToken();

    console.log(`  👤 Using GitHub username: ${githubUsername}`);

    // Fetch contribution calendar
    const calendar = await fetchContributionCalendar(githubUsername, token);
    const totalDays = calculateActiveDays(calendar);

    console.log(`  📅 Active contribution days: ${totalDays}`);

    // Create contribution data
    const contributionData: ContributionData = {
      totalDays,
      lastUpdated: new Date().toISOString(),
    };

    // Save data
    await storage.write('contribution-data', contributionData);

    // Generate SVG
    const theme = getTheme('dark');
    const options = getDefaultContributionBadgeOptions(theme);
    const svg = renderContributionBadge(contributionData, options);

    // Save SVG to data/
    const outputPath = join(__dirname, '../data/contribution-badge.svg');
    await writeFile(outputPath, svg, 'utf-8');

    console.log(`  💾 Badge saved to: data/contribution-badge.svg`);
  } catch (error) {
    console.error('  ❌ Error fetching contribution data:', error);
    throw error;
  }
}

/**
 * Generates the GitHub Stats Card
 */
async function generateStatsCard(storage: FileStorage, username?: string) {
  console.log('  📊 Fetching GitHub stats...');

  try {
    // Get GitHub credentials
    const githubUsername = getGitHubUsername(username);
    const token = getGitHubToken();

    console.log(`  👤 Using GitHub username: ${githubUsername}`);

    // Fetch GitHub stats
    const stats = await fetchGitHubStats(githubUsername, token);

    console.log(`  📈 Total Commits: ${stats.totalCommits}`);
    console.log(`  🔀 Pull Requests: ${stats.totalPRs}`);
    console.log(`  📋 Issues: ${stats.totalIssues}`);
    console.log(`  ⭐ Stars: ${stats.totalStars}`);
    console.log(`  🏆 Rank: ${stats.rank}`);

    // Save data
    await storage.write('stats-data', stats);

    // Generate SVG
    const theme = getTheme('dark');
    const options = getDefaultStatsCardOptions(theme, githubUsername);
    const svg = renderStatsCard(stats, options);

    // Save SVG to data/
    const outputPath = join(__dirname, '../data/stats-card.svg');
    await writeFile(outputPath, svg, 'utf-8');

    console.log(`  💾 Stats card saved to: data/stats-card.svg`);
  } catch (error) {
    console.error('  ❌ Error fetching stats:', error);
    throw error;
  }
}

// Run
main().catch((error) => {
  console.error('❌ Error:', error);
  process.exit(1);
});
