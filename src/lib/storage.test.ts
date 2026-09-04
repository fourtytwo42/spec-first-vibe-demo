import { describe, expect, it } from 'vitest'
import { sampleRequests } from '../data/sampleRequests'
import { loadRequests, STORAGE_KEY } from './storage'

describe('loadRequests', () => {
  it('returns sample data when storage is malformed', () => {
    expect(loadRequests({ getItem: () => '{broken' })).toEqual(sampleRequests)
    expect(loadRequests({ getItem: () => JSON.stringify([{ title: 'Incomplete' }]) })).toEqual(sampleRequests)
  })

  it('preserves a deliberately empty workspace', () => {
    expect(loadRequests({ getItem: (key) => key === STORAGE_KEY ? '[]' : null })).toEqual([])
  })
})
