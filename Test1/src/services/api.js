import { session } from '@/stores/session'
import { PASSWORD_RULE_MESSAGE } from '@/utils/password'

const API_ERROR_TRANSLATIONS = {
  'invalid email or password': 'E-mail ou mot de passe invalide.',
  'user already exixts !': 'Un compte utilise déjà cet e-mail.',
  'user already exists !': 'Un compte utilise déjà cet e-mail.',
  'this email is already in use !': 'Cet e-mail est déjà utilisé.',
  'this contact is not yours.': 'Ce contact ne vous appartient pas.',
  'contact not found': 'Contact introuvable.',
  'not authorized to view this contact': "Vous n'êtes pas autorisé à consulter ce contact.",
  'not found': 'Introuvable.',
  'this password is not valid !': 'Le mot de passe actuel est invalide.',
  'email already exists': 'Cet e-mail est déjà utilisé.',
  'user not found': 'Utilisateur introuvable.',
}

const API_ERROR_PATTERNS = [
  { pattern: /password too short/i, message: PASSWORD_RULE_MESSAGE },
  { pattern: /password must contain at least/i, message: PASSWORD_RULE_MESSAGE },
]

function normalizeMessageKey(message) {
  return String(message || '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

function translateApiErrorMessage(message) {
  const text = String(message || '').trim()

  if (!text) {
    return ''
  }

  const translated = API_ERROR_TRANSLATIONS[normalizeMessageKey(text)]
  if (translated) {
    return translated
  }

  const matchingPattern = API_ERROR_PATTERNS.find(({ pattern }) => pattern.test(text))
  return matchingPattern?.message || text
}

export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'https://api-contact.zoul.dev/api').replace(/\/$/, '')

export function buildQuery(params = {}) {
  const query = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query.set(key, value)
    }
  })

  const suffix = query.toString()
  return suffix ? `?${suffix}` : ''
}

export async function request(path, options = {}) {
  const { auth = true, headers: extraHeaders = {}, ...fetchOptions } = options
  const headers = {
    'Content-Type': 'application/json',
    ...extraHeaders,
  }

  if (auth && session.token) {
    headers.Authorization = `Bearer ${session.token}`
  }

  let response

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...fetchOptions,
      headers,
    })
  } catch {
    throw new Error('Impossible de contacter le serveur.')
  }

  if (response.status === 204) {
    return null
  }

  const contentType = response.headers.get('content-type') || ''
  let data = null

  if (contentType.includes('application/json')) {
    data = await response.json()
  } else {
    data = await response.text()
  }

  if (!response.ok) {
    const message =
      (data && typeof data === 'object' && (data.message || data.error)) ||
      (typeof data === 'string' && data.trim()) ||
      `La requête a échoué (${response.status}).`

    throw new Error(translateApiErrorMessage(message))
  }

  return data
}
