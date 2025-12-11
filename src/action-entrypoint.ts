/**
 * GitHub Action entrypoint
 * This file is the entry point when running as a GitHub Action
 */

import 'dotenv/config';
import * as core from '@actions/core';
import { FileStorage } from './infrastructure/kv-store.js';
import { getTheme } from './presentation/theme.js';
import {
  renderContributionBadge,
  getDefaultContributionBadgeOptions,
} from './presentation/templates/contribution-badge.js';
import { fetchContributionCalendar, calculateActiveDays } from './infrastructure/github-api.js';
import { ContributionData } from './domain/types.js';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

/**
 * Main action runner
 */
async function run(): Promise<void> {
  try {
    // Get inputs from action.yml
    const githubToken = core.getInput('github_token', { required: true });
    const username = core.getInput('username') || process.env.GITHUB_REPOSITORY_OWNER || '';
    const theme = core.getInput('theme') || 'dark';
    const outputDir = core.getInput('output_dir') || './data';
    const service = core.getInput('service') || 'contribution';

    core.info(`🚀 Generating ${service} badge/stats...`);
    core.info(`👤 Username: ${username}`);
    core.info(`🎨 Theme: ${theme}`);
    core.info(`📂 Output directory: ${outputDir}`);

    // Ensure output directory exists
    if (!existsSync(outputDir)) {
      await mkdir(outputDir, { recursive: true });
      core.info(`✅ Created output directory: ${outputDir}`);
    }

    // Initialize storage
    const storage = new FileStorage(outputDir);

    if (service === 'contribution' || service === 'all') {
      const badgePath = await generateContributionBadge(
        storage,
        username,
        githubToken,
        theme,
        outputDir,
      );

      // Set outputs for the action
      core.setOutput('badge_path', badgePath);
    }

    core.info('✅ Done!');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    core.setFailed(`Action failed: ${errorMessage}`);
  }
}

/**
 * Generates the Contribution Days Badge
 */
async function generateContributionBadge(
  storage: FileStorage,
  username: string,
  token: string,
  themeName: string,
  outputDir: string,
): Promise<string> {
  core.info('📊 Fetching contribution data from GitHub...');

  if (!username) {
    throw new Error('GitHub username is required');
  }

  if (!token) {
    throw new Error('GitHub token is required');
  }

  // Fetch contribution calendar
  const calendar = await fetchContributionCalendar(username, token);
  const totalDays = calculateActiveDays(calendar);

  core.info(`📅 Active contribution days: ${totalDays}`);

  // Set output
  core.setOutput('total_days', totalDays.toString());

  // Create contribution data
  const contributionData: ContributionData = {
    totalDays,
    lastUpdated: new Date().toISOString(),
  };

  // Save data
  await storage.write('contribution-data', contributionData);

  // Generate SVG
  const theme = getTheme(themeName);
  const options = getDefaultContributionBadgeOptions(theme);
  const svg = renderContributionBadge(contributionData, options);

  // Save SVG
  const outputPath = join(outputDir, 'contribution-badge.svg');
  await writeFile(outputPath, svg, 'utf-8');

  core.info(`💾 Badge saved to: ${outputPath}`);

  return outputPath;
}

// Run the action
void run();
