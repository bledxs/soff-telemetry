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
 * Gets GitHub username from environment or throws
 */
export function getGitHubUsername(): string {
  const username = process.env.GITHUB_REPOSITORY?.split('/')[0];
  if (!username) {
    throw new Error(
      'GITHUB_REPOSITORY environment variable not found. Make sure to run this in GitHub Actions.',
    );
  }
  return username;
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
