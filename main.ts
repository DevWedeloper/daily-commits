import { octokit } from './src/octokit';
import type { ListForUser } from './src/types/octokit';
import { isSameDay } from './src/utils/date';

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

const hasUserCommittedToday = (repo: ListForUser): boolean => {
  if (!repo.pushed_at) {
    console.log('No commits found.');
    return false;
  }

  const lastCommitDate = new Date(repo.pushed_at);
  const today = new Date();

  return isSameDay(lastCommitDate, today);
};

async function checkUserCommitStatus(username: string): Promise<boolean> {
  const repo = await fetchLatestPushedRepo(username);
  if (!repo) {
    console.log('No repositories found.');
    return false;
  }

  return hasUserCommittedToday(repo);
}

const main = async (): Promise<boolean> => {
  const hasCommittedToday = await checkUserCommitStatus('DevWedeloper');
  return hasCommittedToday;
};

main();
