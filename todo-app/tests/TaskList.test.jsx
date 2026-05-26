import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import TaskList from '../src/components/TaskList'
import '../src/styles/tokens.css'

const tasks = [
  { id: '1', text: 'First task', createdAt: '' },
  { id: '2', text: 'Second task', createdAt: '' },
]

describe('TaskList', () => {
  it('renders empty state message when tasks is empty', () => {
    render(<TaskList tasks={[]} />)
    expect(screen.getByText(/no tasks yet/i)).toBeInTheDocument()
  })

  it('renders a list item for each task', () => {
    render(<TaskList tasks={tasks} />)
    expect(screen.getByText('First task')).toBeInTheDocument()
    expect(screen.getByText('Second task')).toBeInTheDocument()
  })

  it('renders correct number of list items', () => {
    render(<TaskList tasks={tasks} />)
    expect(screen.getAllByRole('listitem')).toHaveLength(2)
  })

  it('renders a ul with aria-label', () => {
    render(<TaskList tasks={tasks} />)
    expect(screen.getByRole('list', { name: /task list/i })).toBeInTheDocument()
  })
})
