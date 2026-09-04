import type { TeamRequest } from '../types'

interface RequestCardProps { request: TeamRequest; onEdit: (request: TeamRequest, opener: HTMLButtonElement) => void }

export function RequestCard({ request, onEdit }: RequestCardProps) {
  const due = request.dueDate
    ? new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${request.dueDate}T00:00:00Z`))
    : 'No due date'
  return (
    <article className="request-card">
      <div className="card-topline">
        <span className={`badge priority-${request.priority.toLowerCase()}`}>{request.priority} priority</span>
        <span className={`badge status-${request.status.toLowerCase().replace(' ', '-')}`}>{request.status}</span>
      </div>
      <div className="card-body">
        <div>
          <p className="category-label">{request.category}</p>
          <h3>{request.title}</h3>
          {request.description && <p className="description">{request.description}</p>}
        </div>
        <div className="card-actions">
          <p className="due-date"><span>Due</span>{due}</p>
          <button className="button-secondary" type="button" onClick={(event) => onEdit(request, event.currentTarget)}>Edit request</button>
        </div>
      </div>
    </article>
  )
}
