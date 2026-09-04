import { sampleRequests } from '../data/sampleRequests'
import { categories, priorities, statuses } from '../types'
import type { TeamRequest } from '../types'

export const STORAGE_KEY = 'team-request-tracker.requests.v1'

function isRequest(value: unknown): value is TeamRequest {
  if (!value || typeof value !== 'object') return false
  const item = value as Record<string, unknown>
  return (
    ['id', 'title', 'description', 'dueDate', 'createdAt', 'updatedAt'].every((key) => typeof item[key] === 'string') &&
    categories.includes(item.category as never) &&
    priorities.includes(item.priority as never) &&
    statuses.includes(item.status as never)
  )
}

export function loadRequests(storage: Pick<Storage, 'getItem'> = localStorage): TeamRequest[] {
  try {
    const raw = storage.getItem(STORAGE_KEY)
    if (raw === null) return sampleRequests
    const value: unknown = JSON.parse(raw)
    return Array.isArray(value) && value.every(isRequest) ? value : sampleRequests
  } catch {
    return sampleRequests
  }
}

export function saveRequests(requests: TeamRequest[], storage: Pick<Storage, 'setItem'> = localStorage) {
  storage.setItem(STORAGE_KEY, JSON.stringify(requests))
}
