import { useState, useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { useLocalStorage } from './hooks/useLocalStorage'
import TaskInput from './components/TaskInput'
import TaskList from './components/TaskList'
import StorageBanner from './components/StorageBanner'
import styles from './App.module.css'
import './styles/tokens.css'

function App() {
  const [tasks, setTasks, storageError] = useLocalStorage('todo-app:tasks', [])
  const [inputValue, setInputValue] = useState('')
  const [bannerDismissed, setBannerDismissed] = useState(false)

  const handleAddTask = useCallback(() => {
    const trimmed = inputValue.trim()
    if (!trimmed) return
    const newTask = { id: uuidv4(), text: trimmed, createdAt: new Date().toISOString() }
    setTasks([...tasks, newTask])
    setInputValue('')
    setBannerDismissed(false)
  }, [inputValue, tasks, setTasks])

  const visibleError = !bannerDismissed && storageError ? storageError : null

  return (
    <div className={styles.page}>
      <main className={styles.card}>
        <h1 className={styles.title}>To-Do App</h1>
        <StorageBanner message={visibleError} onDismiss={() => setBannerDismissed(true)} />
        <TaskInput value={inputValue} onChange={setInputValue} onAdd={handleAddTask} />
        <TaskList tasks={tasks} />
      </main>
    </div>
  )
}

export default App
