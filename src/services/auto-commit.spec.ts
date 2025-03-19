import { beforeEach, describe, expect, it, jest, mock, spyOn } from 'bun:test';
import fs from 'fs';
import { autoCommitAndPush } from './auto-commit';

mock.module('fs', () => {
  return {
    default: {
      appendFileSync: jest.fn(),
    },
  };
});

const addConfigMock = jest.fn(() => Promise.resolve());
const addMock = jest.fn(() => Promise.resolve());
const commitMock = jest.fn(() => Promise.resolve());
const pushMock = jest.fn(() => Promise.resolve());

mock.module('simple-git', () => {
  return {
    default: jest.fn(() => ({
      addConfig: addConfigMock,
      add: addMock,
      commit: commitMock,
      push: pushMock,
    })),
  };
});

describe('autoCommitAndPush', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('performs commit and push correctly', async () => {
    await autoCommitAndPush();

    expect(fs.appendFileSync).toHaveBeenCalledWith(
      'commit_log.txt',
      expect.stringContaining('Automated commit on')
    );

    expect(addConfigMock).toHaveBeenCalledWith('user.name', 'DevWedeloper');
    expect(addConfigMock).toHaveBeenCalledWith(
      'user.email',
      'vicnathangabrielle@gmail.com'
    );

    expect(addMock).toHaveBeenCalledWith('commit_log.txt');
    expect(commitMock).toHaveBeenCalledWith(
      expect.stringContaining('Automated commit on')
    );

    expect(pushMock).toHaveBeenCalled();
  });

  it('should log an error if committing fails', async () => {
    commitMock.mockImplementationOnce(() =>
      Promise.reject(new Error('Commit failed'))
    );

    const consoleErrorSpy = spyOn(console, 'error').mockImplementation(
      () => {}
    );

    await autoCommitAndPush();

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error occurred during the commit process:',
      expect.any(Error)
    );
  });
});
