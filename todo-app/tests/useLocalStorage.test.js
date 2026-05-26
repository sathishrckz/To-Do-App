import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useLocalStorage } from '../src/hooks/useLocalStorage'

const KEY = 'test-key'

beforeEach(() => {
  localStorage.clear()
  vi.restoreAllMocks()
})

describe('useLocalStorage', () => {
  it('returns initialValue when key is not set', () => {
    const { result } = renderHook(() => useLocalStorage(KEY, []))
    expect(result.current[0]).toEqual([])
  })

  it('reads existing value from localStorage on init', () => {
    localStorage.setItem(KEY, JSON.stringify([{ id: '1', text: 'Task', createdAt: '' }]))
    const { result } = renderHook(() => useLocalStorage(KEY, []))
    expect(result.current[0]).toHaveLength(1)
    expect(result.current[0][0].text).toBe('Task')
  })

  it('writes value to localStorage on setValue', () => {
    const { result } = renderHook(() => useLocalStorage(KEY, []))
    act(() => result.current[1]([{ id: '1', text: 'New', createdAt: '' }]))
    expect(JSON.parse(localStorage.getItem(KEY))).toHaveLength(1)
  })

  it('returns null error on successful write', () => {
    const { result } = renderHook(() => useLocalStorage(KEY, []))
    act(() => result.current[1]([]))
    expect(result.current[2]).toBeNull()
  })

  it('returns initialValue and no crash on malformed JSON', () => {
    localStorage.setItem(KEY, 'not-valid-json')
    const { result } = renderHook(() => useLocalStorage(KEY, []))
    expect(result.current[0]).toEqual([])
  })

  it('sets error message on QuotaExceededError', () => {
    const { result } = renderHook(() => useLocalStorage(KEY, []))
    vi.spyOn(window.localStorage, 'setItem').mockImplementation(() => {
      const err = new Error('quota')
      err.name = 'QuotaExceededError'
      throw err
    })
    act(() => result.current[1]([{ id: '1', text: 'x', createdAt: '' }]))
    expect(result.current[2]).toMatch(/full/i)
  })

  it('sets error message on SecurityError', () => {
    const { result } = renderHook(() => useLocalStorage(KEY, []))
    vi.spyOn(window.localStorage, 'setItem').mockImplementation(() => {
      const err = new Error('security')
      err.name = 'SecurityError'
      throw err
    })
    act(() => result.current[1]([]))
    expect(result.current[2]).toMatch(/unavailable/i)
  })
})
