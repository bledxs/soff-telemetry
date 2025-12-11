import { FileStorage } from './infrastructure/kv-store.js';
import { getTheme } from './presentation/theme.js';
import {
  renderVisitorBadge,
  incrementVisitorCount,
  getDefaultVisitorBadgeOptions,
} from './presentation/templates/visitor-badge.js';
import { VisitorData } from './domain/types.js';
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
  const service = args.find((arg) => arg.startsWith('--service='))?.split('=')[1] || 'visitor';

  console.log(`🚀 Generating ${service} badge/stats...`);

  // Initialize storage
  const storage = new FileStorage();

  if (service === 'visitor' || service === 'all') {
    await generateVisitorBadge(storage);
  }

  // TODO: Add other services here
  // if (service === 'stats' || service === 'all') { ... }
  // if (service === 'languages' || service === 'all') { ... }
  // if (service === 'streak' || service === 'all') { ... }

  console.log('✅ Done!');
}

/**
 * Generates the Visitor Badge
 */
async function generateVisitorBadge(storage: FileStorage) {
  console.log('  📊 Updating visitor count...');

  // Read current counter
  const currentData = await storage.read<VisitorData>('visitor-count');

  // Increment counter
  const newData = incrementVisitorCount(currentData);

  // Guardar nuevo contador
  await storage.write('visitor-count', newData);

  console.log(`  👁️  Visitor count: ${newData.count}`);

  // Generate SVG
  const theme = getTheme('dark');
  const options = getDefaultVisitorBadgeOptions(theme);
  const svg = renderVisitorBadge(newData, options);

  // Save SVG to data/
  const outputPath = join(__dirname, '../data/visitor-badge.svg');
  await writeFile(outputPath, svg, 'utf-8');

  console.log(`  💾 Badge saved to: data/visitor-badge.svg`);
}

// Run
main().catch((error) => {
  console.error('❌ Error:', error);
  process.exit(1);
});
