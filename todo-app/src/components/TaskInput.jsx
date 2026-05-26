import styles from './TaskInput.module.css'

function TaskInput({ value, onChange, onAdd }) {
  const isDisabled = value.trim() === ''

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !isDisabled) onAdd()
  }

  return (
    <div className={styles.container}>
      <input
        className={styles.input}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="What needs to be done?"
        aria-label="Add task"
        maxLength={500}
      />
      <button
        className={styles.button}
        onClick={onAdd}
        disabled={isDisabled}
        aria-label="Add task to list"
      >
        Add
      </button>
    </div>
  )
}

export default TaskInput
