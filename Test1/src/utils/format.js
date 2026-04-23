const dateFormatter = new Intl.DateTimeFormat('fr-FR', {
  dateStyle: 'medium',
})

const dateTimeFormatter = new Intl.DateTimeFormat('fr-FR', {
  dateStyle: 'medium',
  timeStyle: 'short',
})

function parseDateValue(value) {
  if (!value) {
    return null
  }

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value
  }

  const text = String(value).trim()

  if (!text) {
    return null
  }

  const isoMatch = text.match(/^(\d{4})-(\d{2})-(\d{2})(?:[T\s].*)?$/)

  if (isoMatch) {
    const [, year, month, day] = isoMatch
    const parsed = new Date(Number(year), Number(month) - 1, Number(day))
    return Number.isNaN(parsed.getTime()) ? null : parsed
  }

  const slashMatch = text.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)

  if (slashMatch) {
    const first = Number(slashMatch[1])
    const second = Number(slashMatch[2])
    const year = Number(slashMatch[3])
    const useMonthFirst = first <= 12 && second > 12 ? true : second <= 12 && first > 12 ? false : true
    const month = useMonthFirst ? first : second
    const day = useMonthFirst ? second : first
    const parsed = new Date(year, month - 1, day)

    return Number.isNaN(parsed.getTime()) ? null : parsed
  }

  const parsed = new Date(text)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

function parseDateTimeValue(value) {
  if (!value) {
    return null
  }

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value
  }

  const text = String(value).trim()

  if (!text) {
    return null
  }

  const dateOnly = text.match(/^(\d{4})-(\d{2})-(\d{2})$/) || text.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)

  if (dateOnly) {
    return parseDateValue(text)
  }

  const parsed = new Date(text)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

export function formatDate(value) {
  const parsed = parseDateValue(value)

  if (!parsed) {
    return 'Non renseignée'
  }

  return dateFormatter.format(parsed)
}

export function formatDateTime(value) {
  const parsed = parseDateTimeValue(value)

  if (!parsed) {
    return 'Non renseignée'
  }

  return dateTimeFormatter.format(parsed)
}

export function toDateInputValue(value) {
  const parsed = parseDateValue(value)

  if (!parsed) {
    return ''
  }

  const year = parsed.getFullYear()
  const month = String(parsed.getMonth() + 1).padStart(2, '0')
  const day = String(parsed.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export function getInitials(value = '') {
  const parts = String(value)
    .trim()
    .split(/\s+/)
    .filter(Boolean)

  if (!parts.length) {
    return '?'
  }

  return parts
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('')
}

export function toneFromString(value = '') {
  const hash = [...String(value)].reduce((sum, char) => sum + char.charCodeAt(0), 0)
  return hash % 2 === 0 ? 'var(--mc-red)' : 'var(--mc-black)'
}
