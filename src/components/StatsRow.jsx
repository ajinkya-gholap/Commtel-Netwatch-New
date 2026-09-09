import { Device } from '../models/Device.js'
import StatTile from './StatTile.jsx'
import styles from './StatsRow.module.css'

/**
 * Reads its numbers from Device.fleetStats() rather than recomputing
 * anything itself (e.g. never touches uptimePct directly).
 */
export default function StatsRow({ devices }) {
  const stats = Device.fleetStats(devices)

  return (
    <section className={styles.row} aria-label="Fleet summary">
      <StatTile label="Online" value={stats.online} tone={stats.online > 0 ? 'good' : 'neutral'} />
      <StatTile
        label="Degraded"
        value={stats.warning}
        tone={stats.warning > 0 ? 'warning' : 'neutral'}
      />
      <StatTile
        label="Offline"
        value={stats.offline}
        tone={stats.offline > 0 ? 'critical' : 'neutral'}
      />
      <StatTile
        label="Avg. uptime"
        value={stats.avgUptime}
        suffix="%"
        tone={stats.avgUptime >= 99 ? 'good' : stats.avgUptime >= 95 ? 'warning' : 'critical'}
      />
    </section>
  )
}
