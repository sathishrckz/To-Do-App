import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import TaskInput from '../src/components/TaskInput'
import '../src/styles/tokens.css'

function setup(value = '') {
  const onChange = vi.fn()
  const onAdd = vi.fn()
  render(<TaskInput value={value} onChange={onChange} onAdd={onAdd} />)
  return { onChange, onAdd }
}

describe('TaskInput', () => {
  it('renders input and button', () => {
    setup()
    expect(screen.getByRole('textbox')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument()
  })

  it('button is disabled when value is empty', () => {
    setup('')
    expect(screen.getByRole('button', { name: /add/i })).toBeDisabled()
  })

  it('button is disabled when value is whitespace only', () => {
    setup('   ')
    expect(screen.getByRole('button', { name: /add/i })).toBeDisabled()
  })

  it('button is enabled when value has text', () => {
    setup('Buy milk')
    expect(screen.getByRole('button', { name: /add/i })).toBeEnabled()
  })

  it('calls onChange when user types', async () => {
    const { onChange } = setup('')
    await userEvent.type(screen.getByRole('textbox'), 'Hello')
    expect(onChange).toHaveBeenCalled()
  })

  it('calls onAdd when button is clicked and value is non-empty', async () => {
    const { onAdd } = setup('Task text')
    await userEvent.click(screen.getByRole('button', { name: /add/i }))
    expect(onAdd).toHaveBeenCalledOnce()
  })

  it('does not call onAdd when button is clicked and value is empty', async () => {
    const { onAdd } = setup('')
    const btn = screen.getByRole('button', { name: /add/i })
    expect(btn).toBeDisabled()
    expect(onAdd).not.toHaveBeenCalled()
  })

  it('calls onAdd on Enter key when value is non-empty', async () => {
    const { onAdd } = setup('Buy milk')
    await userEvent.type(screen.getByRole('textbox'), '{Enter}')
    expect(onAdd).toHaveBeenCalledOnce()
  })

  it('does not call onAdd on Enter key when value is empty', async () => {
    const { onAdd } = setup('')
    await userEvent.type(screen.getByRole('textbox'), '{Enter}')
    expect(onAdd).not.toHaveBeenCalled()
  })

  it('respects maxLength of 500', () => {
    setup()
    expect(screen.getByRole('textbox')).toHaveAttribute('maxLength', '500')
  })
})
