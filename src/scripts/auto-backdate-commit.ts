/* eslint-disable node/prefer-global/process */
import fs from 'node:fs'
import meow from 'meow'
import simpleGit from 'simple-git'
import { formatDateGMT8 as formatDate } from '~/utils/date'
import { dateExists, findInsertIndex } from '~/utils/log'

const LOG_FILE = 'commit_log.txt'
const GIT_USER_NAME = 'DevWedeloper'
const GIT_USER_EMAIL = 'vicnathangabrielle@gmail.com'

const cli = meow(
  `
    Usage
      $ backdate-commit <dates...>

    Options
      --development  Skip push, create commits locally for review

    Examples
      $ backdate-commit 2025-12-06 2025-12-10 --development
  `,
  {
    importMeta: import.meta,
    flags: {
      development: { type: 'boolean', default: false },
    },
  },
)

const datesArgs: string[] = cli.input
const isDev: boolean = cli.flags.development

if (!datesArgs.length) {
  cli.showHelp()
}

async function main() {
  const dates = datesArgs
    .map(d => new Date(d.trim()))
    .filter(d => !Number.isNaN(d.getTime()))

  const git = simpleGit()
  await git.addConfig('user.name', GIT_USER_NAME)
  await git.addConfig('user.email', GIT_USER_EMAIL)

  const lines = fs.existsSync(LOG_FILE)
    ? fs.readFileSync(LOG_FILE, 'utf-8').split('\n').filter(line => line.trim() !== '')
    : []

  for (const targetDate of dates) {
    const timestamp = formatDate(targetDate)

    if (dateExists(lines, targetDate)) {
      console.log(`Skipped ${timestamp} — already exists in log.`)
      continue
    }

    const insertIndex = findInsertIndex(lines, targetDate)
    lines.splice(insertIndex, 0, `Backdated commit on ${timestamp}`)
    fs.writeFileSync(LOG_FILE, lines.join('\n'))

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
