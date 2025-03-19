import fs from 'fs';
import simpleGit from 'simple-git';

const getFormattedTimestamp = () => new Date().toUTCString();

export const autoCommitAndPush = async () => {
  try {
    const git = simpleGit();
    const timestamp = getFormattedTimestamp();

    fs.appendFileSync('commit_log.txt', `Automated commit on ${timestamp}\n`);

    await git.addConfig('user.name', 'DevWedeloper');
    await git.addConfig('user.email', 'vicnathangabrielle@gmail.com');

    await git.add('commit_log.txt');
    await git.commit(`Automated commit on ${timestamp}`);
    await git.push();

    console.log('Changes have been pushed successfully.');
  } catch (error) {
    console.error('Error occurred during the commit process:', error);
  }
};
