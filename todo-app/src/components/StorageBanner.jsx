import styles from './StorageBanner.module.css'

function StorageBanner({ message, onDismiss }) {
  if (!message) return null
  return (
    <div className={styles.banner} role="alert">
      <span className={styles.text}>{message}</span>
      <button className={styles.dismiss} onClick={onDismiss} aria-label="Dismiss warning">
        &times;
      </button>
    </div>
  )
}

export default StorageBanner
