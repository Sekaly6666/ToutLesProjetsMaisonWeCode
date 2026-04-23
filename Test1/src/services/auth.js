import { buildQuery, request } from './api'
import { normalizeUser } from '@/utils/entities'
import { sameId } from '@/utils/ids'
import { getPasswordStrengthMessage } from '@/utils/password'

function normalizeEmail(value) {
  return String(value || '').trim().toLowerCase()
}

function cleanProfilePayload(payload) {
  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined && value !== null && value !== '')
  )
}

function extractUsers(response) {
  if (Array.isArray(response)) {
    return response
  }

  if (Array.isArray(response?.data)) {
    return response.data
  }

  return []
}

export async function fetchUsers(query = {}) {
  const response = await request(
    `/users${buildQuery({
      page: 1,
      perPage: 1000,
      order: 'asc',
      ...query,
    })}`
  )

  return extractUsers(response)
    .map((user) => normalizeUser(user))
    .filter(Boolean)
    .sort((left, right) =>
      String(left?.name || '')
        .toLowerCase()
        .localeCompare(String(right?.name || '').toLowerCase(), 'fr', { sensitivity: 'base' })
    )
}

export async function fetchUserById(id) {
  if (!id) {
    return null
  }

  const users = await fetchUsers()
  return users.find((user) => sameId(user.id, id) || sameId(user._id, id)) || null
}

export async function registerUser({ name, email, password, confirmPassword, confirm_password } = {}) {
  const normalizedEmail = normalizeEmail(email)
  const confirmation = String(confirm_password ?? confirmPassword ?? '').trim()
  const passwordError = getPasswordStrengthMessage(password)

  if (!confirmation) {
    throw new Error('La confirmation du mot de passe est requise.')
  }

  if (passwordError) {
    throw new Error(passwordError)
  }

  const created = await request('/users', {
    auth: false,
    method: 'POST',
    body: JSON.stringify({
      name: String(name || '').trim(),
      email: normalizedEmail,
      password,
      confirm_password: confirmation,
    }),
  })

  return normalizeUser(created)
}

export async function loginUser({ email, password } = {}) {
  const response = await request('/users/login', {
    auth: false,
    method: 'POST',
    body: JSON.stringify({
      email: normalizeEmail(email),
      password,
    }),
  })

  const token = String(response?.token || '').trim()

  if (!token) {
    throw new Error("Le serveur n'a pas renvoyé de jeton de connexion.")
  }

  return {
    user: normalizeUser(response),
    token,
  }
}

export async function fetchCurrentUser() {
  return normalizeUser(await request('/users/me'))
}

export async function updateCurrentUser(payload = {}) {
  const password = payload.password ? String(payload.password) : ''
  const passwordError = password ? getPasswordStrengthMessage(password) : ''

  if (passwordError) {
    throw new Error(passwordError)
  }

  const body = cleanProfilePayload({
    name: String(payload.name || '').trim(),
    email: payload.email ? normalizeEmail(payload.email) : '',
    password,
  })

  return normalizeUser(
    await request('/users/me', {
      method: 'PUT',
      body: JSON.stringify(body),
    })
  )
}

export async function updateUser(_id, payload) {
  return updateCurrentUser(payload)
}
