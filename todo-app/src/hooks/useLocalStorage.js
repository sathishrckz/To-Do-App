import { useState } from 'react'

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch {
      return initialValue
    }
  })

  const [error, setError] = useState(null)

  const setValue = (value) => {
    try {
      setStoredValue(value)
      window.localStorage.setItem(key, JSON.stringify(value))
      setError(null)
    } catch (err) {
      if (err.name === 'SecurityError') {
        setError('Storage is unavailable. Tasks will not persist after page refresh.')
      } else if (err.name === 'QuotaExceededError') {
        setError('Storage is full. New tasks cannot be saved until space is freed.')
      } else {
        setError('Could not save tasks. Changes may not persist.')
      }
    }
  }

  return [storedValue, setValue, error]
}
