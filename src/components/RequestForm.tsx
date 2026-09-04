import { useEffect, useRef, useState } from 'react'
import { categories, priorities, statuses } from '../types'
import type { RequestDraft, TeamRequest } from '../types'
import { normalizeDraft, todayAsInputValue, validateDraft } from '../lib/requests'
import type { DraftErrors } from '../lib/requests'

const newDraft: RequestDraft = { title: '', description: '', category: 'Data', priority: 'Medium', status: 'New', dueDate: '' }

interface RequestFormProps {
  request: TeamRequest | null
  onSave: (draft: RequestDraft) => void
  onClose: () => void
}

export function RequestForm({ request, onSave, onClose }: RequestFormProps) {
  const [draft, setDraft] = useState<RequestDraft>(request ? { ...request } : newDraft)
  const [errors, setErrors] = useState<DraftErrors>({})
  const dialogRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    titleRef.current?.focus()
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      if (event.key !== 'Tab' || !dialogRef.current) return
      const focusable = [...dialogRef.current.querySelectorAll<HTMLElement>('button, input, textarea, select')].filter((item) => !item.hasAttribute('disabled'))
      if (!focusable.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  const update = (key: keyof RequestDraft, value: string) => {
    setDraft((current) => ({ ...current, [key]: value }))
    setErrors((current) => ({ ...current, [key]: undefined }))
  }

  const submit = (event: React.FormEvent) => {
    event.preventDefault()
    const nextErrors = validateDraft(draft)
    setErrors(nextErrors)
    const firstError = Object.keys(nextErrors)[0] as keyof RequestDraft | undefined
    if (firstError) {
      dialogRef.current?.querySelector<HTMLElement>(`[name="${firstError}"]`)?.focus()
      return
    }
    onSave(normalizeDraft(draft))
  }

  const fieldError = (key: keyof RequestDraft) => errors[key] ? `${key}-error` : undefined

  return (
    <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="form-title" ref={dialogRef}>
        <div className="modal-header">
          <div><p className="eyebrow">{request ? 'Update work' : 'Add work'}</p><h2 id="form-title">{request ? 'Edit request' : 'Create request'}</h2></div>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Close request form">×</button>
        </div>
        <form onSubmit={submit} noValidate>
          <label>Title <span aria-hidden="true">*</span>
            <input ref={titleRef} name="title" value={draft.title} onChange={(event) => update('title', event.target.value)} maxLength={81} aria-invalid={!!errors.title} aria-describedby={fieldError('title')} />
            {errors.title && <span className="field-error" id="title-error">{errors.title}</span>}
          </label>
          <label>Description
            <textarea name="description" value={draft.description} onChange={(event) => update('description', event.target.value)} rows={4} maxLength={501} aria-invalid={!!errors.description} aria-describedby={fieldError('description')} />
            <span className="field-hint">{draft.description.length}/500</span>
            {errors.description && <span className="field-error" id="description-error">{errors.description}</span>}
          </label>
          <div className="form-grid">
            <label>Category <span aria-hidden="true">*</span>
              <select name="category" value={draft.category} onChange={(event) => update('category', event.target.value)}>{categories.map((value) => <option key={value}>{value}</option>)}</select>
            </label>
            <label>Priority <span aria-hidden="true">*</span>
              <select name="priority" value={draft.priority} onChange={(event) => update('priority', event.target.value)}>{priorities.map((value) => <option key={value}>{value}</option>)}</select>
            </label>
            <label>Status <span aria-hidden="true">*</span>
              <select name="status" value={draft.status} onChange={(event) => update('status', event.target.value)}>{statuses.map((value) => <option key={value}>{value}</option>)}</select>
            </label>
            <label>Due date
              <input name="dueDate" type="date" min={todayAsInputValue()} value={draft.dueDate} onChange={(event) => update('dueDate', event.target.value)} aria-invalid={!!errors.dueDate} aria-describedby={fieldError('dueDate')} />
              {errors.dueDate && <span className="field-error" id="dueDate-error">{errors.dueDate}</span>}
            </label>
          </div>
          <div className="modal-actions">
            <button className="button-secondary" type="button" onClick={onClose}>Cancel</button>
            <button className="button-primary" type="submit">{request ? 'Save changes' : 'Create request'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}
