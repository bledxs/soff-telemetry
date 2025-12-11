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
/**
 * Fetches comprehensive GitHub user stats
 */
export async function fetchGitHubStats(username: string, token: string) {
  const graphqlWithAuth = graphql.defaults({
    headers: {
      authorization: `token ${token}`,
    },
  });

  const query = `
    query($username: String!) {
      user(login: $username) {
        contributionsCollection {
          totalCommitContributions
          totalPullRequestContributions
          totalIssueContributions
          restrictedContributionsCount
        }
        repositoriesContributedTo(first: 1, contributionTypes: [COMMIT, ISSUE, PULL_REQUEST, REPOSITORY]) {
          totalCount
        }
        pullRequests(first: 1) {
          totalCount
        }
        openIssues: issues(states: OPEN) {
          totalCount
        }
        closedIssues: issues(states: CLOSED) {
          totalCount
        }
        repositories(first: 100, ownerAffiliations: OWNER, orderBy: {direction: DESC, field: STARGAZERS}) {
          totalCount
          nodes {
            stargazers {
              totalCount
            }
          }
        }
      }
    }
  `;

  const response = await graphqlWithAuth<{
    user: {
      contributionsCollection: {
        totalCommitContributions: number;
        totalPullRequestContributions: number;
        totalIssueContributions: number;
        restrictedContributionsCount: number;
      };
      repositoriesContributedTo: {
        totalCount: number;
      };
      pullRequests: {
        totalCount: number;
      };
      openIssues: {
        totalCount: number;
      };
      closedIssues: {
        totalCount: number;
      };
      repositories: {
        totalCount: number;
        nodes: Array<{
          stargazers: {
            totalCount: number;
          };
        }>;
      };
    };
  }>(query, { username });

  // Calculate total stars
  const totalStars = response.user.repositories.nodes.reduce(
    (acc, repo) => acc + repo.stargazers.totalCount,
    0,
  );

  // Calculate total issues (open + closed)
  const totalIssues = response.user.openIssues.totalCount + response.user.closedIssues.totalCount;

  // Calculate rank based on stats
  const totalCommits = response.user.contributionsCollection.totalCommitContributions;
  const totalPRs = response.user.pullRequests.totalCount;
  const contributedTo = response.user.repositoriesContributedTo.totalCount;

  let rank = 'C';
  const score = totalCommits + totalPRs * 2 + totalStars * 3 + totalIssues;

  if (score >= 1000) rank = 'S';
  else if (score >= 500) rank = 'A+';
  else if (score >= 250) rank = 'A';
  else if (score >= 100) rank = 'B+';
  else if (score >= 50) rank = 'B';

  return {
    totalCommits,
    totalPRs: response.user.pullRequests.totalCount,
    totalIssues,
    totalStars,
    contributedTo,
    rank,
  };
}
