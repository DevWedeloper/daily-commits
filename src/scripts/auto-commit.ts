import env from '../../env';
import { autoCommitAndPush } from '../services/auto-commit';
import { hasUserCommittedToday } from '../services/commit-status';

const checkAndCommit = async () => {
  const hasCommittedToday = await hasUserCommittedToday(env.GH_USERNAME);

  if (!hasCommittedToday) {
    await autoCommitAndPush();
  } else {
    console.log('Already committed today. Skipping automated commit.');
  }
};

checkAndCommit();
