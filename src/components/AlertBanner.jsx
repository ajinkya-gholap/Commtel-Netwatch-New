import styles from './AlertBanner.module.css'

/**
 * Pattern demo: guard clause / early return null. This is the cleanest
 * option here because the component either has nothing to say (clean
 * fleet) or one specific thing to say (worst device) — there's no
 * partial or "in-between" render worth writing.
 */
export default function AlertBanner({ devices, onInspect }) {
  const criticalDevices = devices.filter((device) => device.isCritical)

  if (criticalDevices.length === 0) {
    return null
  }

  const worst = [...criticalDevices].sort((a, b) => a.healthScore - b.healthScore)[0]

  return (
    <div className={styles.banner} role="alert">
      <div className={styles.banner__text}>
        <p className={styles.banner__title}>
          {criticalDevices.length === 1
            ? '1 device needs immediate attention'
            : `${criticalDevices.length} devices need immediate attention`}
        </p>
        <p className={styles.banner__detail}>
          Worst affected: <strong>{worst.name}</strong> ({worst.site}) — {worst.statusLabel}
        </p>
      </div>
      <button className={styles.banner__button} onClick={() => onInspect(worst.id)}>
        Inspect
      </button>
    </div>
  )
}
