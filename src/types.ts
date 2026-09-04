export const categories = ['Data', 'Research', 'Technology', 'Operations'] as const
export const priorities = ['Low', 'Medium', 'High'] as const
export const statuses = ['New', 'In progress', 'Blocked', 'Complete'] as const

export type Category = (typeof categories)[number]
export type Priority = (typeof priorities)[number]
export type RequestStatus = (typeof statuses)[number]

export interface TeamRequest {
  id: string
  title: string
  description: string
  category: Category
  priority: Priority
  status: RequestStatus
  dueDate: string
  createdAt: string
  updatedAt: string
}

export type RequestDraft = Pick<
  TeamRequest,
  'title' | 'description' | 'category' | 'priority' | 'status' | 'dueDate'
>

export interface Filters {
  search: string
  category: Category | ''
  priority: Priority | ''
  status: RequestStatus | ''
}
