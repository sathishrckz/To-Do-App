import { memo } from 'react'
import styles from './TaskItem.module.css'

const TaskItem = memo(function TaskItem({ task }) {
  return (
    <li className={styles.item}>
      <span className={styles.text}>{task.text}</span>
    </li>
  )
})

export default TaskItem
