import { useMemo, useRef, useState } from 'react'
import { FilterBar } from './components/FilterBar'
import { RequestCard } from './components/RequestCard'
import { RequestForm } from './components/RequestForm'
import { emptyFilters, filterRequests } from './lib/requests'
import { loadRequests, saveRequests } from './lib/storage'
import type { Filters, RequestDraft, TeamRequest } from './types'

export default function App() {
  const [requests, setRequests] = useState(loadRequests)
  const [filters, setFilters] = useState<Filters>(emptyFilters)
  const [editing, setEditing] = useState<TeamRequest | null | undefined>(undefined)
  const [announcement, setAnnouncement] = useState('')
  const openerRef = useRef<HTMLElement | null>(null)
  const visible = useMemo(() => filterRequests(requests, filters), [requests, filters])
  const hasActiveFilters = Object.values(filters).some(Boolean)

  const openCreate = (opener: HTMLElement) => { openerRef.current = opener; setEditing(null) }
  const openEdit = (request: TeamRequest, opener: HTMLButtonElement) => { openerRef.current = opener; setEditing(request) }
  const closeForm = () => { setEditing(undefined); window.setTimeout(() => openerRef.current?.focus(), 0) }

  const save = (draft: RequestDraft) => {
    const now = new Date().toISOString()
    const next = editing
      ? requests.map((request) => request.id === editing.id ? { ...request, ...draft, updatedAt: now } : request)
      : [{ ...draft, id: crypto.randomUUID(), createdAt: now, updatedAt: now }, ...requests]
    setRequests(next)
    saveRequests(next)
    setAnnouncement(editing ? 'Request updated.' : 'Request created.')
    closeForm()
  }

  return (
    <>
      <header className="site-header">
        <div className="header-inner">
          <a className="brand" href="#main">Team Request Tracker</a>
          <span className="demo-label">Fictional demo</span>
        </div>
      </header>
      <main id="main">
        <section className="hero">
          <div>
            <p className="eyebrow">Shared workspace</p>
            <h1>Keep team requests moving.</h1>
            <p className="hero-copy">Capture the work, clarify what matters, and see what needs attention next.</p>
          </div>
          <button className="button-primary hero-action" type="button" onClick={(event) => openCreate(event.currentTarget)}>+ New request</button>
        </section>

        <section className="summary" aria-label="Request summary">
          <div><strong>{requests.length}</strong><span>Total requests</span></div>
          <div><strong>{requests.filter((request) => request.status === 'In progress').length}</strong><span>In progress</span></div>
          <div><strong>{requests.filter((request) => request.priority === 'High' && request.status !== 'Complete').length}</strong><span>High priority open</span></div>
        </section>

        <FilterBar filters={filters} onChange={setFilters} onClear={() => setFilters(emptyFilters)} hasActiveFilters={hasActiveFilters} />

        <section className="request-section" aria-labelledby="requests-heading">
          <div className="list-heading">
            <h2 id="requests-heading">Requests</h2>
            <p aria-live="polite">Showing {visible.length} of {requests.length}</p>
          </div>
          {visible.length > 0 ? (
            <div className="request-list">{visible.map((request) => <RequestCard key={request.id} request={request} onEdit={openEdit} />)}</div>
          ) : requests.length === 0 ? (
            <div className="empty-state"><span aria-hidden="true">◇</span><h3>No requests yet</h3><p>Create the first request to start organizing the team's work.</p><button className="button-primary" type="button" onClick={(event) => openCreate(event.currentTarget)}>Create first request</button></div>
          ) : (
            <div className="empty-state"><span aria-hidden="true">⌕</span><h3>No matching requests</h3><p>Try a different search or clear the active filters.</p><button className="button-secondary" type="button" onClick={() => setFilters(emptyFilters)}>Clear all filters</button></div>
          )}
        </section>
      </main>
      <p className="sr-only" role="status" aria-live="polite">{announcement}</p>
      {editing !== undefined && <RequestForm request={editing} onSave={save} onClose={closeForm} />}
    </>
  )
}
