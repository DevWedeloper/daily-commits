/* eslint-disable no-console */
import fs from 'node:fs'
import simpleGit from 'simple-git'
import { GIT_USER_EMAIL, GIT_USER_NAME, LOG_FILE } from '~/constants'
import env from '~/env'
import { getFormattedTimestamp } from '~/utils/date'

export async function autoCommitAndPush() {
  try {
    const git = simpleGit()
    const timestamp = getFormattedTimestamp(new Date(), env.USER_TIMEZONE)

    fs.appendFileSync(LOG_FILE, `Automated commit on ${timestamp}\n`)

    await git.addConfig('user.name', GIT_USER_NAME)
    await git.addConfig('user.email', GIT_USER_EMAIL)

    await git.add(LOG_FILE)
    await git.commit(`Automated commit on ${timestamp}`)
    await git.push()

    console.log('Changes have been pushed successfully.')
  }
  catch (error) {
    console.error('Error occurred during the commit process:', error)
  }
}
