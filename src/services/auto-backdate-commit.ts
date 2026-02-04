/* eslint-disable node/prefer-global/process */
/* eslint-disable no-console */
import fs from 'node:fs'
import simpleGit from 'simple-git'
import { GIT_USER_EMAIL, GIT_USER_NAME, LOG_FILE } from '~/constants'
import env from '~/env'
import { getFormattedTimestamp } from '~/utils/date'
import { dateExists, findInsertIndex } from '~/utils/log'

export async function autoBackdateCommit(datesArgs: string[], isDev: boolean, isDryRun: boolean) {
  const exec = async (fn: () => Promise<any> | void, label?: string) => {
    if (isDryRun) {
      if (label) {
        console.log(`[dry-run] ${label}`)
      }
      return
    }

    await fn()
  }

  const dates = datesArgs
    .map(d => new Date(d.trim()))
    .filter(d => !Number.isNaN(d.getTime()))

  const git = simpleGit()
  await exec(async () => {
    await git.addConfig('user.name', GIT_USER_NAME)
    await git.addConfig('user.email', GIT_USER_EMAIL)
  })

  const lines = fs.existsSync(LOG_FILE)
    ? fs.readFileSync(LOG_FILE, 'utf-8').split('\n').filter(line => line.trim() !== '')
    : []

  for (const targetDate of dates) {
    const timestamp = getFormattedTimestamp(targetDate, env.USER_TIMEZONE)

    if (dateExists(lines, targetDate)) {
      console.log(`Skipped ${timestamp} — already exists in log.`)
      continue
    }

    const insertIndex = findInsertIndex(lines, targetDate)
    lines.splice(insertIndex, 0, `Backdated commit on ${timestamp}`)
    fs.writeFileSync(LOG_FILE, lines.join('\n'))

    await exec(() => git.add(LOG_FILE))

    await exec(async () => {
      process.env.GIT_AUTHOR_DATE = timestamp
      process.env.GIT_COMMITTER_DATE = timestamp

      await git.commit(`Backdated commit on ${timestamp}`, LOG_FILE)
    })

    console.log(`Committed backdated entry for ${timestamp}`)
  }

  if (!isDev) {
    await exec(() => git.push())
    console.log('All backdated commits processed and pushed successfully.')
  }
  else {
    console.log('Development mode: skipping push. All commits created locally for review.')
  }
}
