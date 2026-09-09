import { classes } from '../utils/format.js'
import styles from './StatTile.module.css'

/**
 * One number in the stats row (Online / Degraded / Offline / Avg uptime).
 * `tone` and `suffix` both have default values since most tiles are plain
 * neutral counts and don't need a unit suffix.
 */
export default function StatTile({ label, value, tone = 'neutral', suffix = '' }) {
  return (
    <div
      className={classes(styles.tile, {
        [styles['tile--good']]: tone === 'good',
        [styles['tile--warning']]: tone === 'warning',
        [styles['tile--critical']]: tone === 'critical',
      })}
    >
      <p className={styles.tile__label}>{label}</p>
      <p className={styles.tile__value}>
        {value}
        {suffix}
      </p>
    </div>
  )
}
