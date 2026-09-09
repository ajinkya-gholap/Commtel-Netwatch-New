import { classes } from '../utils/format.js'
import StatusBadge from './StatusBadge.jsx'
import styles from './DeviceDetail.module.css'

/**
 * Pattern demo: if / else-if / else chain producing one recommended
 * action sentence. Each branch reflects a different operational
 * decision, not just a style choice, so it reads better as explicit
 * statements than as a nested ternary.
 */
export default function DeviceDetail({ device, onClose }) {
  let recommendedAction

  if (device.isOffline) {
    recommendedAction = 'Dispatch a field engineer to restore connectivity.'
  } else if (device.isCritical && device.isUnderMaintenance) {
    recommendedAction = `Wait for the scheduled maintenance window (${device.maintenanceWindow}).`
  } else if (device.isSaturated) {
    recommendedAction = 'Raise a capacity upgrade request for this link.'
  } else if (device.isFirmwareStale) {
    recommendedAction = `Schedule a firmware upgrade from ${device.firmware}.`
  } else {
    recommendedAction = 'No action needed — device is healthy.'
  }

  return (
    <aside className={styles.panel} aria-label={`${device.name} details`}>
      <div className={styles.panel__header}>
        <div>
          <p className={styles.panel__name}>{device.name}</p>
          <p className={styles.panel__meta}>
            {device.type} · {device.site}
          </p>
        </div>
        <button className={styles.panel__close} onClick={onClose} aria-label="Close details">
          ×
        </button>
      </div>

      <StatusBadge status={device.status} />

      <div className={styles.panel__healthRow}>
        <span className={styles.panel__healthLabel}>
          Health score · {device.healthBand}
        </span>
        <span className={styles.panel__healthScore}>{device.healthScore}</span>
      </div>
      <div className={styles.panel__healthBar}>
        <div
          className={classes(styles.panel__healthFill, {
            [styles['panel__healthFill--good']]: device.healthBand === 'good',
            [styles['panel__healthFill--fair']]: device.healthBand === 'fair',
            [styles['panel__healthFill--poor']]: device.healthBand === 'poor',
          })}
          style={{ width: `${device.healthScore}%` }}
        />
      </div>

      <dl className={styles.panel__facts}>
        <div className={styles.panel__fact}>
          <dt>IP address</dt>
          <dd>{device.ip}</dd>
        </div>
        <div className={styles.panel__fact}>
          <dt>Link load</dt>
          <dd>{device.loadPct}%</dd>
        </div>
        <div className={styles.panel__fact}>
          <dt>Firmware</dt>
          <dd>{device.firmware}</dd>
        </div>
        <div className={styles.panel__fact}>
          <dt>Last seen</dt>
          <dd>{device.lastSeenText}</dd>
        </div>
        {device.maintenanceWindow && (
          <div className={styles.panel__fact}>
            <dt>Maintenance</dt>
            <dd>{device.maintenanceWindow}</dd>
          </div>
        )}
      </dl>

      <div className={styles.panel__action}>
        <p className={styles.panel__actionLabel}>Recommended action</p>
        <p className={styles.panel__actionText}>{recommendedAction}</p>
      </div>
    </aside>
  )
}
