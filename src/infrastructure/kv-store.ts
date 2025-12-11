import { IStorage } from '../domain/types.js';
import { readFile, writeFile, access } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Simple JSON-based storage using the repository file system
 * Perfect for GitHub Actions: commit + push = free persistence 🎉
 */
export class FileStorage implements IStorage {
  private dataDir: string;

  constructor(dataDir: string = join(__dirname, '../../data')) {
    this.dataDir = dataDir;
  }

  private getFilePath(key: string): string {
    return join(this.dataDir, `${key}.json`);
  }

  async read<T>(key: string): Promise<T | null> {
    try {
      const filePath = this.getFilePath(key);
      const data = await readFile(filePath, 'utf-8');
      return JSON.parse(data) as T;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        return null; // File doesn't exist yet
      }
      throw error;
    }
  }

  async write<T>(key: string, data: T): Promise<void> {
    const filePath = this.getFilePath(key);
    const jsonData = JSON.stringify(data, null, 2);
    await writeFile(filePath, jsonData, 'utf-8');
  }

  async exists(key: string): Promise<boolean> {
    try {
      await access(this.getFilePath(key));
      return true;
    } catch {
      return false;
    }
  }
}

/**
 * Storage factory - in case we want Redis later, etc.
 */
export function createStorage(type: 'file' | 'redis' = 'file'): IStorage {
  switch (type) {
    case 'file':
      return new FileStorage();
    case 'redis':
      // TODO: Implement later if needed
      throw new Error('Redis storage not implemented yet');
    default:
      return new FileStorage();
  }
}
