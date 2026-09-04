import { categories, priorities, statuses } from '../types'
import type { Filters, RequestDraft, TeamRequest } from '../types'

export const emptyFilters: Filters = { search: '', category: '', priority: '', status: '' }

export function filterRequests(requests: TeamRequest[], filters: Filters) {
  const query = filters.search.trim().toLocaleLowerCase()
  return requests.filter((request) => {
    const matchesText = !query || `${request.title} ${request.description}`.toLocaleLowerCase().includes(query)
    return (
      matchesText &&
      (!filters.category || request.category === filters.category) &&
      (!filters.priority || request.priority === filters.priority) &&
      (!filters.status || request.status === filters.status)
    )
  })
}

export type DraftErrors = Partial<Record<keyof RequestDraft, string>>

export function todayAsInputValue(now = new Date()) {
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function isCalendarDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const [year, month, day] = value.split('-').map(Number)
  const parsed = new Date(Date.UTC(year, month - 1, day))
  return parsed.getUTCFullYear() === year && parsed.getUTCMonth() === month - 1 && parsed.getUTCDate() === day
}

export function validateDraft(draft: RequestDraft, today = todayAsInputValue()): DraftErrors {
  const errors: DraftErrors = {}
  const title = draft.title.trim()
  const description = draft.description.trim()

  if (!title) errors.title = 'Enter a title.'
  else if (title.length < 3) errors.title = 'Use at least 3 characters.'
  else if (title.length > 80) errors.title = 'Use 80 characters or fewer.'
  if (description.length > 500) errors.description = 'Use 500 characters or fewer.'
  if (!categories.includes(draft.category)) errors.category = 'Choose a category.'
  if (!priorities.includes(draft.priority)) errors.priority = 'Choose a priority.'
  if (!statuses.includes(draft.status)) errors.status = 'Choose a status.'
  if (draft.dueDate && !isCalendarDate(draft.dueDate)) errors.dueDate = 'Enter a valid due date.'
  else if (draft.dueDate && draft.dueDate < today) errors.dueDate = 'Due date cannot be in the past.'

  return errors
}

export function normalizeDraft(draft: RequestDraft): RequestDraft {
  return { ...draft, title: draft.title.trim(), description: draft.description.trim() }
}
