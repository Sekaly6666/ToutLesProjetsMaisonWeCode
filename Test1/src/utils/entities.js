import { normalizeId } from '@/utils/ids'

const PLACEHOLDER_VALUES = new Set([
  'aucune',
  'aucune note',
  'compte courant',
  'non precise',
  'non renseigne',
  'non renseignee',
])

function normalizeTextValue(value) {
  const text = String(value ?? '').trim()

  if (!text) {
    return ''
  }

  const normalized = text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

  if (PLACEHOLDER_VALUES.has(normalized)) {
    return ''
  }

  return text
}

export function normalizeUser(raw = null) {
  if (!raw) {
    return null
  }

  if (typeof raw === 'string' || typeof raw === 'number') {
    const id = normalizeId(raw)

    return {
      id,
      _id: id,
    }
  }

  const source =
    raw.user && typeof raw.user === 'object' && !Array.isArray(raw.user) ? raw.user : raw

  if (!source || typeof source !== 'object' || Array.isArray(source)) {
    return null
  }

  const {
    token: _token,
    password: _password,
    confirm_password: _confirmPassword,
    confirmPassword: _confirmPasswordCamel,
    ...rest
  } = source
  const id = normalizeId(rest.id ?? rest._id ?? null)

  return {
    ...rest,
    id,
    _id: rest._id ?? id,
  }
}

export function splitFullName(value = '') {
  const parts = String(value).trim().split(/\s+/).filter(Boolean)

  if (!parts.length) {
    return {
      firstname: '',
      lastname: '',
    }
  }

  if (parts.length === 1) {
    return {
      firstname: parts[0],
      lastname: '',
    }
  }

  return {
    firstname: parts[0],
    lastname: parts.slice(1).join(' '),
  }
}

export function formatContactName(contact = {}) {
  if (typeof contact === 'string') {
    return contact.trim()
  }

  const firstname = String(contact.firstname ?? contact.firstName ?? '').trim()
  const lastname = String(contact.lastname ?? contact.lastName ?? '').trim()
  const composed = [firstname, lastname].filter(Boolean).join(' ').trim()

  if (composed) {
    return composed
  }

  return normalizeTextValue(contact.name ?? '')
}

export function formatGender(value = '') {
  const gender = String(value || '').trim()

  if (!gender) {
    return 'Non renseigné'
  }

  if (gender.toLowerCase() === 'male') {
    return 'Homme'
  }

  if (gender.toLowerCase() === 'female') {
    return 'Femme'
  }

  return gender
}

export function normalizeContact(raw = null) {
  if (!raw) {
    return null
  }

  const source =
    raw.contact && typeof raw.contact === 'object' && !Array.isArray(raw.contact) ? raw.contact : raw
  const user = normalizeUser(source.user)
  const firstname = normalizeTextValue(source.firstname ?? source.firstName ?? '')
  const lastname = normalizeTextValue(source.lastname ?? source.lastName ?? '')
  const name = [firstname, lastname].filter(Boolean).join(' ').trim() || normalizeTextValue(source.name ?? '') || formatContactName(source)
  const id = source.id ?? source._id ?? null
  const userId =
    user?.id ??
    user?._id ??
    source.userId ??
    (typeof source.user === 'string' ? normalizeId(source.user) : null)

  return {
    ...source,
    id,
    _id: source._id ?? id,
    firstname,
    lastname,
    name,
    phone: normalizeTextValue(source.phone ?? ''),
    email: normalizeTextValue(source.email ?? ''),
    gender: normalizeTextValue(source.gender ?? ''),
    birthdate: normalizeTextValue(source.birthdate ?? ''),
    position: normalizeTextValue(source.position ?? ''),
    company: normalizeTextValue(source.company ?? ''),
    user,
    userId,
    createdAt: source.createdAt ?? null,
    updatedAt: source.updatedAt ?? null,
  }
}
