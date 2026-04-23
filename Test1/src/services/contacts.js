import { buildQuery, request } from './api'
import { normalizeContact } from '@/utils/entities'
import { sameId } from '@/utils/ids'

function extractContacts(response) {
  if (Array.isArray(response)) {
    return response
  }

  if (Array.isArray(response?.data)) {
    return response.data
  }

  return []
}

function contactTimestamp(contact) {
  const value = contact?.updatedAt || contact?.createdAt || 0
  const timestamp = new Date(value).getTime()
  return Number.isNaN(timestamp) ? 0 : timestamp
}

function cleanContactPayload(contact = {}) {
  return {
    firstname: String(contact.firstname ?? contact.firstName ?? '').trim(),
    lastname: String(contact.lastname ?? contact.lastName ?? '').trim(),
    phone: String(contact.phone ?? '').trim(),
    email: String(contact.email ?? '').trim(),
    gender: String(contact.gender ?? '').trim(),
    birthdate: String(contact.birthdate ?? '').trim(),
    position: String(contact.position ?? '').trim(),
    company: String(contact.company ?? '').trim(),
  }
}

export async function fetchContacts(options = {}) {
  const {
    scope = options.userId ? 'all' : 'me',
    userId = null,
    q,
    page = 1,
    perPage = 1000,
    order = 'desc',
    company,
    position,
    orderBy = 'createdAt',
  } = options

  const response = await request(
    `${scope === 'all' ? '/contacts' : '/contacts/me'}${buildQuery({
      q,
      page,
      perPage,
      order,
      company,
      position,
      orderBy,
    })}`
  )

  const contacts = extractContacts(response)
    .map((contact) => normalizeContact(contact))
    .filter(Boolean)

  const filtered = userId
    ? contacts.filter((contact) =>
        sameId(contact.userId, userId) || sameId(contact.user?.id, userId) || sameId(contact.user?._id, userId)
      )
    : contacts

  return filtered.sort((left, right) => contactTimestamp(right) - contactTimestamp(left))
}

export async function fetchContact(id) {
  return normalizeContact(await request(`/contacts/${id}`))
}

export async function createContact(contact) {
  const created = await request('/contacts', {
    method: 'POST',
    body: JSON.stringify(cleanContactPayload(contact)),
  })

  return normalizeContact(created)
}

export async function updateContact(id, contact) {
  const updated = await request(`/contacts/${id}`, {
    method: 'PUT',
    body: JSON.stringify(cleanContactPayload(contact)),
  })

  return normalizeContact(updated)
}

export async function deleteContact(id) {
  await request(`/contacts/${id}`, {
    method: 'DELETE',
  })
}
