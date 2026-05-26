import TaskItem from './TaskItem'
import styles from './TaskList.module.css'

function TaskList({ tasks }) {
  if (tasks.length === 0) {
    return <p className={styles.empty}>No tasks yet. Add one above!</p>
  }
  return (
    <ul className={styles.list} aria-label="Task list">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </ul>
  )
}

export default TaskList
