import styles from './EmptyState.module.css'

export default function EmptyState({ message = 'No devices match your filters.', children }) {
  return (
    <div className={styles.empty}>
      <p className={styles.empty__message}>{message}</p>
      {children}
    </div>
  )
}
