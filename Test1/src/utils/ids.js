export function normalizeId(value) {
  if (typeof value === 'number') {
    return value
  }

  if (typeof value !== 'string') {
    return value
  }

  const trimmed = value.trim()

  if (!trimmed) {
    return value
  }

  const numeric = Number(trimmed)

  if (!Number.isNaN(numeric) && String(numeric) === trimmed) {
    return numeric
  }

  return trimmed
}

export function sameId(a, b) {
  const left = String(a ?? '').trim()
  const right = String(b ?? '').trim()

  if (!left || !right) {
    return false
  }

  return left === right
}
