import fs from 'fs';
import simpleGit from 'simple-git';
import { hasUserCommittedToday } from '../services/commit-status';

const checkAndCommit = async () => {
  try {
    const hasComittedToday = await hasUserCommittedToday('DevWedeloper');

    if (!hasComittedToday) {
      const git = simpleGit();

      fs.appendFileSync(
        'commit_log.txt',
        `Automated commit on ${new Date().toISOString()}\n`
      );

      await git.addConfig('user.name', 'DevWedeloper');
      await git.addConfig('user.email', 'vicnathangabrielle@gmail.com');

      await git.add('commit_log.txt');
      await git.commit(`Automated commit on ${new Date().toISOString()}`);
      await git.push();

      console.log('Changes have been pushed successfully.');
    } else {
      console.log('Already committed today. Skipping automated commit.');
    }
  } catch (error) {
    console.error('Error occurred during the commit process:', error);
  }
};

checkAndCommit();
