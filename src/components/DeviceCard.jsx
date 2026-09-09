import { classes } from '../utils/format.js'
import StatusBadge from './StatusBadge.jsx'
import styles from './DeviceCard.module.css'

/**
 * Pattern demo: if / else-if / else chain picking the footer note, since
 * each branch needs its own sentence built from different device facts —
 * a ternary chain here would be far less readable than four plain checks.
 */
export default function DeviceCard({ device, isSelected, onSelect }) {
  let footerNote

  if (device.isOffline) {
    footerNote = `No heartbeat for ${device.lastSeenText}`
  } else if (device.isSaturated) {
    footerNote = `Link saturated at ${device.loadPct}%`
  } else if (device.isFirmwareStale) {
    footerNote = `Firmware ${device.firmware} is out of date`
  } else {
    footerNote = `Seen ${device.lastSeenText}`
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      onSelect(device.id)
    }
  }

  return (
    <div
      className={classes(styles.card, {
        [styles['card--selected']]: isSelected,
        [styles['card--offline']]: device.isOffline,
        [styles['card--critical']]: device.isCritical && !device.isOffline,
      })}
      role="button"
      tabIndex={0}
      onClick={() => onSelect(device.id)}
      onKeyDown={handleKeyDown}
    >
      <div className={styles.card__top}>
        <div>
          <p className={styles.card__name}>{device.name}</p>
          <p className={styles.card__meta}>
            {device.type} · {device.site}
          </p>
        </div>
        <StatusBadge status={device.status} size="sm" />
      </div>

      <p className={styles.card__ip}>{device.ip}</p>

      <div className={styles.card__row}>
        <span className={styles.card__health}>Health {device.healthScore}</span>

        {device.alerts > 0 && (
          <span className={styles.card__chip}>
            {device.alerts} {device.alerts === 1 ? 'alert' : 'alerts'}
          </span>
        )}
      </div>

      <p className={styles.card__footer}>{footerNote}</p>
    </div>
  )
}
