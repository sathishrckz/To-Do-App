import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import App from '../src/App'

beforeEach(() => {
  localStorage.clear()
  vi.restoreAllMocks()
})

describe('App — full add-task flow', () => {
  it('renders the heading', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /to-do app/i })).toBeInTheDocument()
  })

  it('renders empty state initially', () => {
    render(<App />)
    expect(screen.getByText(/no tasks yet/i)).toBeInTheDocument()
  })

  it('Add button is disabled when input is empty', () => {
    render(<App />)
    expect(screen.getByRole('button', { name: /add task to list/i })).toBeDisabled()
  })

  it('adds a task and shows it in the list', async () => {
    render(<App />)
    await userEvent.type(screen.getByRole('textbox'), 'Buy milk')
    await userEvent.click(screen.getByRole('button', { name: /add task to list/i }))
    expect(screen.getByText('Buy milk')).toBeInTheDocument()
  })

  it('clears the input after adding a task', async () => {
    render(<App />)
    const input = screen.getByRole('textbox')
    await userEvent.type(input, 'Buy milk')
    await userEvent.click(screen.getByRole('button', { name: /add task to list/i }))
    expect(input).toHaveValue('')
  })

  it('disables Add button again after task is added', async () => {
    render(<App />)
    await userEvent.type(screen.getByRole('textbox'), 'Task')
    await userEvent.click(screen.getByRole('button', { name: /add task to list/i }))
    expect(screen.getByRole('button', { name: /add task to list/i })).toBeDisabled()
  })

  it('adds multiple tasks in order', async () => {
    render(<App />)
    const input = screen.getByRole('textbox')
    const btn = screen.getByRole('button', { name: /add task to list/i })
    await userEvent.type(input, 'First')
    await userEvent.click(btn)
    await userEvent.type(input, 'Second')
    await userEvent.click(btn)
    const items = screen.getAllByRole('listitem')
    expect(items[0]).toHaveTextContent('First')
    expect(items[1]).toHaveTextContent('Second')
  })

  it('whitespace-only input does not add a task', async () => {
    render(<App />)
    await userEvent.type(screen.getByRole('textbox'), '   ')
    expect(screen.getByRole('button', { name: /add task to list/i })).toBeDisabled()
  })

  it('Enter key adds task', async () => {
    render(<App />)
    await userEvent.type(screen.getByRole('textbox'), 'Enter task{Enter}')
    expect(screen.getByText('Enter task')).toBeInTheDocument()
  })

  it('persists tasks in localStorage', async () => {
    render(<App />)
    await userEvent.type(screen.getByRole('textbox'), 'Persisted task')
    await userEvent.click(screen.getByRole('button', { name: /add task to list/i }))
    const stored = JSON.parse(localStorage.getItem('todo-app:tasks'))
    expect(stored).toHaveLength(1)
    expect(stored[0].text).toBe('Persisted task')
  })

  it('loads tasks from localStorage on mount', () => {
    localStorage.setItem(
      'todo-app:tasks',
      JSON.stringify([{ id: 'abc', text: 'Pre-existing', createdAt: '' }])
    )
    render(<App />)
    expect(screen.getByText('Pre-existing')).toBeInTheDocument()
  })

  it('shows StorageBanner when localStorage write fails', async () => {
    render(<App />)
    vi.spyOn(window.localStorage, 'setItem').mockImplementation(() => {
      const err = new Error('quota')
      err.name = 'QuotaExceededError'
      throw err
    })
    await userEvent.type(screen.getByRole('textbox'), 'Task')
    await userEvent.click(screen.getByRole('button', { name: /add task to list/i }))
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })
})
