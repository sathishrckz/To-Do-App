import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import StorageBanner from '../src/components/StorageBanner'
import '../src/styles/tokens.css'

describe('StorageBanner', () => {
  it('renders nothing when message is null', () => {
    const { container } = render(<StorageBanner message={null} onDismiss={vi.fn()} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders warning text when message is set', () => {
    render(<StorageBanner message="Storage is full." onDismiss={vi.fn()} />)
    expect(screen.getByText('Storage is full.')).toBeInTheDocument()
  })

  it('has role="alert"', () => {
    render(<StorageBanner message="Error" onDismiss={vi.fn()} />)
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('calls onDismiss when dismiss button is clicked', async () => {
    const onDismiss = vi.fn()
    render(<StorageBanner message="Error" onDismiss={onDismiss} />)
    await userEvent.click(screen.getByRole('button', { name: /dismiss/i }))
    expect(onDismiss).toHaveBeenCalledOnce()
  })
})
