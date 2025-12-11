import { FileStorage } from './infrastructure/kv-store.js';
import { getTheme } from './presentation/theme.js';
import {
  renderContributionBadge,
  getDefaultContributionBadgeOptions,
} from './presentation/templates/contribution-badge.js';
import {
  fetchContributionCalendar,
  calculateActiveDays,
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

  console.log(`🚀 Generating ${service} badge/stats...`);

  // Initialize storage
  const storage = new FileStorage();

  if (service === 'contribution' || service === 'all') {
    await generateContributionBadge(storage);
  }

  // TODO: Add other services here
  // if (service === 'stats' || service === 'all') { ... }
  // if (service === 'languages' || service === 'all') { ... }
  // if (service === 'streak' || service === 'all') { ... }

  console.log('✅ Done!');
}

/**
 * Generates the Contribution Days Badge
 */
async function generateContributionBadge(storage: FileStorage) {
  console.log('  📊 Fetching contribution data from GitHub...');

  try {
    // Get GitHub credentials
    const username = getGitHubUsername();
    const token = getGitHubToken();

    // Fetch contribution calendar
    const calendar = await fetchContributionCalendar(username, token);
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

// Run
main().catch((error) => {
  console.error('❌ Error:', error);
  process.exit(1);
});
