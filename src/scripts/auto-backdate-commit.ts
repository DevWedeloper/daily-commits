import meow from 'meow'
import { autoBackdateCommit } from '~/services/auto-backdate-commit'

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

autoBackdateCommit(datesArgs, isDev).catch((err) => {
  console.error('Error:', err)
  // eslint-disable-next-line node/prefer-global/process
  process.exit(1)
})
