import { describe, expect, it } from 'vitest'
import { sampleRequests } from '../data/sampleRequests'
import { filterRequests, validateDraft } from './requests'

describe('filterRequests', () => {
  it('combines text, category, priority, and status with AND logic', () => {
    expect(filterRequests(sampleRequests, { search: 'dashboard', category: 'Data', priority: 'High', status: 'In progress' })).toHaveLength(1)
    expect(filterRequests(sampleRequests, { search: 'dashboard', category: 'Research', priority: 'High', status: 'In progress' })).toHaveLength(0)
  })
})

describe('validateDraft', () => {
  it('validates title and description length', () => {
    const base = { title: 'ok', description: 'x'.repeat(501), category: 'Data' as const, priority: 'Medium' as const, status: 'New' as const, dueDate: '' }
    expect(validateDraft(base)).toEqual({ title: 'Use at least 3 characters.', description: 'Use 500 characters or fewer.' })
  })
})
