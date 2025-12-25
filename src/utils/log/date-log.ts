export function findInsertIndex(lines: string[], targetDate: Date): number {
  for (let i = 0; i < lines.length; i++) {
    const match = lines[i].match(/\d{2} \w{3} \d{4}/)
    if (!match)
      continue

    const lineDate = new Date(match[0])
    if (lineDate > targetDate)
      return i
  }
  return lines.length
}

export function dateExists(lines: string[], targetDate: Date): boolean {
  const targetDay = targetDate.toDateString()

  return lines.some((line) => {
    const match = line.match(/\d{2} \w{3} \d{4}/)
    if (!match)
      return false

    return new Date(match[0]).toDateString() === targetDay
  })
}
