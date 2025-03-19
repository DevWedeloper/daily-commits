import { autoCommitAndPush } from '../services/auto-commit';
import { hasUserCommittedToday } from '../services/commit-status';

const checkAndCommit = async () => {
  const hasCommittedToday = await hasUserCommittedToday('DevWedeloper');

  if (!hasCommittedToday) {
    await autoCommitAndPush();
  } else {
    console.log('Already committed today. Skipping automated commit.');
  }
};

checkAndCommit();
