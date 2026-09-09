// Minimum acceptable firmware major version, per device type. Anything
// below this major version is flagged as stale in isFirmwareStale.
const FIRMWARE_BASELINE = {
  router: 5,
  switch: 4,
  firewall: 6,
  camera: 3,
  nvr: 3,
  sensor: 2,
}

/**
 * Domain model wrapping one raw device record. Every derived fact about a
 * device (health, staleness, saturation, display text, ...) is computed
 * here so components can stay "dumb" and just render what they're given.
 */
export class Device {
  constructor(raw) {
    this.id = raw.id
    this.name = raw.name
    this.type = raw.type
    this.ip = raw.ip
    this.site = raw.site
    this.status = raw.status
    this.uptimePct = raw.uptimePct
    this.bandwidthMbps = raw.bandwidthMbps
    this.capacityMbps = raw.capacityMbps
    this.alerts = raw.alerts
    this.firmware = raw.firmware
    this.lastSeenMinsAgo = raw.lastSeenMinsAgo
    this.maintenanceWindow = raw.maintenanceWindow ?? null
  }

  static fromList(rows) {
    return rows.map((row) => new Device(row))
  }

  /** Aggregate fleet-wide numbers used by the header and stat tiles. */
  static fleetStats(devices) {
    const total = devices.length
    const online = devices.filter((d) => d.isOnline).length
    const warning = devices.filter((d) => d.status === 'warning').length
    const offline = devices.filter((d) => d.isOffline).length
    const attention = devices.filter((d) => d.isCritical).length
    const siteCount = new Set(devices.map((d) => d.site)).size

    const avgUptime = total === 0
      ? 0
      : Math.round((devices.reduce((sum, d) => sum + d.uptimePct, 0) / total) * 10) / 10

    return { total, online, warning, offline, attention, siteCount, avgUptime }
  }

  get isOnline() {
    return this.status === 'online'
  }

  get isOffline() {
    return this.status === 'offline'
  }

  get isCritical() {
    return this.isOffline || (this.status === 'warning' && this.alerts >= 2)
  }

  get isUnderMaintenance() {
    return Boolean(this.maintenanceWindow)
  }

  get loadPct() {
    if (!this.capacityMbps) return 0
    return Math.round((this.bandwidthMbps / this.capacityMbps) * 100)
  }

  get isSaturated() {
    return this.loadPct >= 90
  }

  get isFirmwareStale() {
    const baseline = FIRMWARE_BASELINE[this.type] ?? 0
    const major = parseInt(String(this.firmware).split('.')[0], 10) || 0
    return major < baseline
  }

  get healthScore() {
    let score = this.uptimePct

    if (this.isOffline) score -= 60
    if (this.status === 'warning') score -= 15
    score -= this.alerts * 5
    if (this.isSaturated) score -= 10
    if (this.isFirmwareStale) score -= 8

    return Math.max(0, Math.min(100, Math.round(score)))
  }

  get healthBand() {
    if (this.healthScore >= 90) return 'good'
    if (this.healthScore >= 70) return 'fair'
    return 'poor'
  }

  get statusLabel() {
    if (this.status === 'online') return 'Online'
    if (this.status === 'warning') return 'Degraded'
    if (this.status === 'offline') return 'Offline'
    return 'Unknown'
  }

  get lastSeenText() {
    const mins = this.lastSeenMinsAgo

    if (mins < 1) return 'just now'
    if (mins < 60) return `${mins} min ago`

    const hours = Math.floor(mins / 60)
    if (hours < 24) return `${hours} hr ago`

    const days = Math.floor(hours / 24)
    return `${days} d ago`
  }

  matches(query) {
    const q = query.trim().toLowerCase()
    if (!q) return true

    return (
      this.name.toLowerCase().includes(q) ||
      this.ip.toLowerCase().includes(q) ||
      this.id.toLowerCase().includes(q) ||
      this.type.toLowerCase().includes(q)
    )
  }
}
