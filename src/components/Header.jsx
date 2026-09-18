import { Device } from '../models/Device.js'
import styles from './Header.module.css'

export default function Header({ devices }) {
  const stats = Device.fleetStats(devices)

  const summary =
    stats.attention === 0
      ? `All ${stats.total} devices across ${stats.siteCount} sites are healthy.`
      : `${stats.attention} device${stats.attention === 1 ? '' : 's'} need attention out of ${stats.total}.`

  return (
    <header className={styles.header}>
      <div className={styles.header__brand}>
        <span className={styles.header__mark}>
          <img className={styles.header__mark} src="/download.webp" alt="Commtel Netwatch Desk logo" />
        </span>
        <div>
          <h1 className={styles.header__title}>Commtel NetWatch</h1>
          <p className={styles.header__summary}>{summary}</p>
        </div>
      </div>
    </header>
  )
}
