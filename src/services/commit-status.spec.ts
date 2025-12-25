import { beforeEach, describe, expect, it, jest, mock, spyOn } from 'bun:test'
import { hasUserCommittedToday } from './commit-status'

const listForUserMock = jest.fn()

mock.module('../octokit', () => ({
  octokit: {
    rest: {
      repos: {
        listForUser: listForUserMock,
      },
    },
  },
}))

describe('hasUserCommittedToday', () => {
  const username = 'testuser'

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns true when the latest repo was pushed today', async () => {
    const repoData = [{ pushed_at: new Date().toISOString() }]
    listForUserMock.mockResolvedValue({ data: repoData })

    const consoleLogSpy = spyOn(console, 'log').mockImplementation(() => {})

    const result = await hasUserCommittedToday(username)

    expect(result).toBe(true)
    expect(consoleLogSpy).toHaveBeenCalledWith(
      '✅ You have made a commit today!',
    )
  })

  it('returns false and logs "No repositories found." when no repo is returned', async () => {
    listForUserMock.mockResolvedValue({ data: [] })
    const consoleLogSpy = spyOn(console, 'log').mockImplementation(() => {})

    const result = await hasUserCommittedToday(username)

    expect(result).toBe(false)
    expect(consoleLogSpy).toHaveBeenCalledWith('No repositories found.')
  })

  it('returns false and logs "❌ No commits today." when the repo was not pushed today', async () => {
    const yesterday = new Date(Date.now() - 86400000).toISOString()
    const repoData = [{ pushed_at: yesterday }]
    listForUserMock.mockResolvedValue({ data: repoData })

    const consoleLogSpy = spyOn(console, 'log').mockImplementation(() => {})

    const result = await hasUserCommittedToday(username)

    expect(result).toBe(false)
    expect(consoleLogSpy).toHaveBeenCalledWith('❌ No commits today.')
  })

  it('returns false and logs "No commits found." when pushed_at is missing', async () => {
    const repoData = [{ pushed_at: null }]
    listForUserMock.mockResolvedValue({ data: repoData })

    const consoleLogSpy = spyOn(console, 'log').mockImplementation(() => {})

    const result = await hasUserCommittedToday(username)

    expect(result).toBe(false)
    expect(consoleLogSpy).toHaveBeenCalledWith('No commits found.')
  })

  it('logs an error and returns false when the fetch fails', async () => {
    const error = new Error('Network error')
    listForUserMock.mockRejectedValue(error)

    const consoleErrorSpy = spyOn(console, 'error').mockImplementation(
      () => {},
    )
    const result = await hasUserCommittedToday(username)

    expect(result).toBe(false)
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error fetching repositories:',
      error,
    )
  })
})
