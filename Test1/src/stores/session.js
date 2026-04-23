import { reactive } from 'vue'

import { normalizeUser } from '@/utils/entities'

const STORAGE_KEY = 'mycontacts.session'

function readStoredSession() {
  if (typeof window === 'undefined') {
    return {
      user: null,
      token: null,
    }
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)

    if (!raw) {
      return {
        user: null,
        token: null,
      }
    }

    const parsed = JSON.parse(raw)

    if (!parsed || typeof parsed !== 'object') {
      window.localStorage.removeItem(STORAGE_KEY)
      return {
        user: null,
        token: null,
      }
    }

    const token = typeof parsed.token === 'string' ? parsed.token.trim() : ''

    if (!token) {
      window.localStorage.removeItem(STORAGE_KEY)
      return {
        user: null,
        token: null,
      }
    }

    return {
      user: normalizeUser(parsed),
      token,
    }
  } catch {
    window.localStorage.removeItem(STORAGE_KEY)
    return {
      user: null,
      token: null,
    }
  }
}

function writeStoredSession(value) {
  if (typeof window === 'undefined') {
    return
  }

  if (value?.user && value?.token) {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        user: value.user,
        token: value.token,
      })
    )
    return
  }

  window.localStorage.removeItem(STORAGE_KEY)
}

export const session = reactive(readStoredSession())

export function saveSession(value, token = null) {
  if (!value) {
    session.user = null
    session.token = null
    writeStoredSession(null)
    return
  }

  let nextUser = null
  let nextToken = token ?? session.token ?? null

  if (typeof value === 'object' && (Object.prototype.hasOwnProperty.call(value, 'user') || Object.prototype.hasOwnProperty.call(value, 'token'))) {
    nextUser = value.user ? normalizeUser(value.user) : null
    nextToken = value.token ?? nextToken ?? null
  } else {
    nextUser = normalizeUser(value)
  }

  session.user = nextUser
  session.token = nextToken
  writeStoredSession({
    user: nextUser,
    token: nextToken,
  })
}

export function clearSession() {
  saveSession(null)
}
