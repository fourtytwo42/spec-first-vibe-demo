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

export function validateDraft(draft: RequestDraft): DraftErrors {
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

  return errors
}

export function normalizeDraft(draft: RequestDraft): RequestDraft {
  return { ...draft, title: draft.title.trim(), description: draft.description.trim() }
}
