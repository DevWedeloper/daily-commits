import { octokit } from '../octokit';
import type { ListForUser } from '../types/octokit';
import { isSameDay } from '../utils/date';

const fetchLatestPushedRepo = async (username: string) => {
  try {
    const { data } = await octokit.rest.repos.listForUser({
      username,
      per_page: 1,
      sort: 'pushed',
      direction: 'desc',
    });

    return data[0] || null;
  } catch (error) {
    console.error('Error fetching repositories:', error);
    return null;
  }
};

const hasRepoBeenPushedToday = (repo: ListForUser): boolean => {
  if (!repo.pushed_at) {
    console.log('No commits found.');
    return false;
  }

  const lastCommitDate = new Date(repo.pushed_at);
  const today = new Date();

  return isSameDay(lastCommitDate, today);
};

export const hasUserCommittedToday = async (
  username: string
): Promise<boolean> => {
  const repo = await fetchLatestPushedRepo(username);
  if (!repo) {
    console.log('No repositories found.');
    return false;
  }

  const result = hasRepoBeenPushedToday(repo);
  if (result) {
    console.log('✅ You have made a commit today!');
  } else {
    console.log('❌ No commits today.');
  }

  return result;
};
