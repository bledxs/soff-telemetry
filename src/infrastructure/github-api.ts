import { graphql } from '@octokit/graphql';

/**
 * GitHub GraphQL API client
 * Fetches contribution and repository data
 */

export interface GitHubContributionDay {
  date: string;
  contributionCount: number;
}

export interface GitHubContributionCalendar {
  totalContributions: number;
  weeks: Array<{
    contributionDays: GitHubContributionDay[];
  }>;
}

/**
 * Fetches user contribution calendar from GitHub GraphQL API
 */
export async function fetchContributionCalendar(
  username: string,
  token: string,
): Promise<GitHubContributionCalendar> {
  const graphqlWithAuth = graphql.defaults({
    headers: {
      authorization: `token ${token}`,
    },
  });

  const query = `
    query($username: String!) {
      user(login: $username) {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                date
                contributionCount
              }
            }
          }
        }
      }
    }
  `;

  const response = await graphqlWithAuth<{
    user: {
      contributionsCollection: {
        contributionCalendar: GitHubContributionCalendar;
      };
    };
  }>(query, { username });

  return response.user.contributionsCollection.contributionCalendar;
}

/**
 * Calculates total active contribution days (days with at least 1 contribution)
 */
export function calculateActiveDays(calendar: GitHubContributionCalendar): number {
  let activeDays = 0;

  for (const week of calendar.weeks) {
    for (const day of week.contributionDays) {
      if (day.contributionCount > 0) {
        activeDays++;
      }
    }
  }

  return activeDays;
}

/**
 * Gets GitHub username from parameter, environment variables, or throws
 * Checks in order: parameter > GITHUB_USERNAME > GITHUB_REPOSITORY
 */
export function getGitHubUsername(username?: string): string {
  // 1. Check if username was passed as parameter
  if (username) {
    return username;
  }

  // 2. Check GITHUB_USERNAME environment variable (for local testing)
  if (process.env.GITHUB_USERNAME) {
    return process.env.GITHUB_USERNAME;
  }

  // 3. Check GITHUB_REPOSITORY (for GitHub Actions)
  const repoUsername = process.env.GITHUB_REPOSITORY?.split('/')[0];
  if (repoUsername) {
    return repoUsername;
  }

  throw new Error(
    'GitHub username not found. Provide it via --username argument, GITHUB_USERNAME env var, or run in GitHub Actions.',
  );
}

/**
 * Gets GitHub token from environment or throws
 */
export function getGitHubToken(): string {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    throw new Error('GITHUB_TOKEN environment variable not found.');
  }
  return token;
}
