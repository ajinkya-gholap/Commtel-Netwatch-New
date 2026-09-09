import { classes } from '../utils/format.js'
import styles from './StatusBadge.module.css'

/**
 * Small coloured pill showing a device's raw status.
 *
 * Pattern demo: if / else-if / else chain assigning to variables before
 * the return, rather than a nested ternary, because there are four
 * distinct branches and each needs both a label *and* a class.
 */
export default function StatusBadge({ status, size = 'md' }) {
  let label
  let modifierClass

  if (status === 'online') {
    label = 'Online'
    modifierClass = styles['badge--online']
  } else if (status === 'warning') {
    label = 'Degraded'
    modifierClass = styles['badge--warning']
  } else if (status === 'offline') {
    label = 'Offline'
    modifierClass = styles['badge--offline']
  } else {
    label = 'Unknown'
    modifierClass = styles['badge--unknown']
  }

  return (
    <span
      className={classes(styles.badge, {
        [modifierClass]: true,
        [styles['badge--sm']]: size === 'sm',
      })}
    >
      <span className={styles.badge__dot} />
      {label}
    </span>
  )
}
