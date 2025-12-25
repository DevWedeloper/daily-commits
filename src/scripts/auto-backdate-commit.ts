#!/usr/bin/env bun
/* eslint-disable node/prefer-global/process */
import fs from 'node:fs'
import simpleGit from 'simple-git'
import { formatDateGMT8 as formatDate } from '~/utils/date'
import { dateExists, findInsertIndex } from '~/utils/log'

// ----- CONFIG -----
const LOG_FILE = 'commit_log.txt'
const GIT_USER_NAME = 'DevWedeloper'
const GIT_USER_EMAIL = 'vicnathangabrielle@gmail.com'

// ----- MAIN -----
async function main() {
  const args = process.argv.slice(2)
  if (!args) {
    console.error(
      'Usage: bun backdateCommit.ts YYYY-MM-DD[,YYYY-MM-DD,...]',
    )
    process.exit(1)
  }

  const isDev = args.includes('--development')

  const dates = args.map(d => new Date(d.trim())).filter(d => !Number.isNaN(d.getTime()))
  const git = simpleGit()

  // Set git user config for this repo
  await git.addConfig('user.name', GIT_USER_NAME)
  await git.addConfig('user.email', GIT_USER_EMAIL)

  // Read existing log file
  const lines = fs.existsSync(LOG_FILE)
    ? fs.readFileSync(LOG_FILE, 'utf-8')
        .split('\n')
        .filter(line => line.trim() !== '') // remove empty lines
    : []

  for (const targetDate of dates) {
    const timestamp = formatDate(targetDate)

    // Skip if already exists
    if (dateExists(lines, targetDate)) {
      console.log(`Skipped ${timestamp} — already exists in log.`)
      continue
    }

    // Find proper insertion index
    const insertIndex = findInsertIndex(lines, targetDate)

    // Insert line
    lines.splice(insertIndex, 0, `Backdated commit on ${timestamp}`)

    // Write file
    fs.writeFileSync(LOG_FILE, lines.join('\n'))

    // Stage and commit individually
    await git.add(LOG_FILE)
    await git.commit(`Backdated commit on ${timestamp}`, undefined, {
      '--date': targetDate.toISOString(),
    })

    console.log(`Committed backdated entry for ${timestamp}`)
  }

  if (!isDev) {
    await git.push()
    console.log('All backdated commits processed and pushed successfully.')
  }
  else {
    console.log('Development mode: skipping push. All commits created locally for review.')
  }
}

main().catch((err) => {
  console.error('Error:', err)
  process.exit(1)
})
