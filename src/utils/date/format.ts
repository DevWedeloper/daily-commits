export function formatDateGMT8(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, '0')

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  const gmtOffset = 8
  const local = new Date(date.getTime() + gmtOffset * 60 * 60 * 1000)

  return `${days[local.getUTCDay()]}, ${pad(local.getUTCDate())} ${
    months[local.getUTCMonth()]
  } ${local.getUTCFullYear()} ${pad(local.getUTCHours())}:${pad(
    local.getUTCMinutes(),
  )}:${pad(local.getUTCSeconds())} GMT+08:00`
}
