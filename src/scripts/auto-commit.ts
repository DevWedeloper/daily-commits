import { autoCommitAndPush } from '../services/auto-commit';
import { hasUserCommittedToday } from '../services/commit-status';

const checkAndCommit = async () => {
  const hasComittedToday = await hasUserCommittedToday('DevWedeloper');

  if (!hasComittedToday) {
    await autoCommitAndPush();
  } else {
    console.log('Already committed today. Skipping automated commit.');
  }
};

checkAndCommit();
