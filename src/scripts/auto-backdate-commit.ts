import meow from 'meow'
import { autoBackdateCommit } from '~/services/auto-backdate-commit'

const cli = meow(
  `
    Usage
      $ backdate-commit <dates...>

    Options
      --development  Skip push, create commits locally for review
      --dry-run      Show what would be done without making any git changes

    Examples
      $ backdate-commit 2025-12-06 2025-12-10 --development
  `,
  {
    importMeta: import.meta,
    flags: {
      development: { type: 'boolean', default: false },
      dryRun: { type: 'boolean', default: false },
    },
  },
)

const datesArgs: string[] = cli.input
const isDev: boolean = cli.flags.development
const isDryRun: boolean = cli.flags.dryRun

if (!datesArgs.length) {
  cli.showHelp()
}

autoBackdateCommit(datesArgs, isDev, isDryRun).catch((err) => {
  console.error('Error:', err)
  // eslint-disable-next-line node/prefer-global/process
  process.exit(1)
})
