import { categories, priorities, statuses } from '../types'
import type { Filters } from '../types'

interface FilterBarProps {
  filters: Filters
  onChange: (filters: Filters) => void
  onClear: () => void
  hasActiveFilters: boolean
}

export function FilterBar({ filters, onChange, onClear, hasActiveFilters }: FilterBarProps) {
  const update = (key: keyof Filters, value: string) => onChange({ ...filters, [key]: value })
  return (
    <section className="filter-panel" aria-labelledby="filter-heading">
      <div className="filter-heading-row">
        <div>
          <p className="eyebrow">Find work</p>
          <h2 id="filter-heading">Search and filter</h2>
        </div>
        <button className="button-link" type="button" onClick={onClear} disabled={!hasActiveFilters}>Clear all</button>
      </div>
      <div className="filter-grid">
        <label className="search-field">Search
          <input type="search" value={filters.search} onChange={(event) => update('search', event.target.value)} placeholder="Title or description" />
        </label>
        <label>Category
          <select value={filters.category} onChange={(event) => update('category', event.target.value)}>
            <option value="">All categories</option>
            {categories.map((value) => <option key={value}>{value}</option>)}
          </select>
        </label>
        <label>Priority
          <select value={filters.priority} onChange={(event) => update('priority', event.target.value)}>
            <option value="">All priorities</option>
            {priorities.map((value) => <option key={value}>{value}</option>)}
          </select>
        </label>
        <label>Status
          <select value={filters.status} onChange={(event) => update('status', event.target.value)}>
            <option value="">All statuses</option>
            {statuses.map((value) => <option key={value}>{value}</option>)}
          </select>
        </label>
      </div>
    </section>
  )
}
