import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('App', () => {
  it('creates and edits a request', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /new request/i }))
    const createDialog = screen.getByRole('dialog')
    await user.type(within(createDialog).getByLabelText(/title/i), 'Prepare fictional briefing')
    await user.selectOptions(within(createDialog).getByLabelText(/category/i), 'Research')
    await user.click(screen.getByRole('button', { name: /create request/i }))
    expect(screen.getByRole('heading', { name: 'Prepare fictional briefing' })).toBeInTheDocument()
    await user.click(screen.getAllByRole('button', { name: /edit request/i })[0])
    await user.selectOptions(within(screen.getByRole('dialog')).getByLabelText(/status/i), 'Complete')
    await user.click(screen.getByRole('button', { name: /save changes/i }))
    expect(screen.getAllByText('Complete').length).toBeGreaterThan(0)
  })

  it('shows validation and no-results feedback', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /new request/i }))
    await user.click(screen.getByRole('button', { name: /create request/i }))
    expect(screen.getByText('Enter a title.')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /cancel/i }))
    await user.type(screen.getByLabelText('Search'), 'never-find-this')
    expect(screen.getByRole('heading', { name: /no matching requests/i })).toBeInTheDocument()
  })
})
