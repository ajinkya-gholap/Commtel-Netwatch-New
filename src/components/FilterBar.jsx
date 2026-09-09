import styles from './FilterBar.module.css'

export default function FilterBar({ filters, sites, resultCount, isActive, onFilterChange, onReset }) {
  return (
    <section className={styles.bar} aria-label="Filter devices">
      <input
        type="text"
        className={styles.bar__search}
        placeholder="Search by name, IP, ID or type…"
        value={filters.query}
        onChange={(event) => onFilterChange('query', event.target.value)}
      />

      <select
        className={styles.bar__select}
        value={filters.status}
        onChange={(event) => onFilterChange('status', event.target.value)}
        aria-label="Filter by status"
      >
        <option value="all">All statuses</option>
        <option value="online">Online</option>
        <option value="warning">Degraded</option>
        <option value="offline">Offline</option>
      </select>

      <select
        className={styles.bar__select}
        value={filters.site}
        onChange={(event) => onFilterChange('site', event.target.value)}
        aria-label="Filter by site"
      >
        <option value="all">All sites</option>
        {sites.map((site) => (
          <option key={site} value={site}>
            {site}
          </option>
        ))}
      </select>

      <select
        className={styles.bar__select}
        value={filters.sort}
        onChange={(event) => onFilterChange('sort', event.target.value)}
        aria-label="Sort devices"
      >
        <option value="health">Worst health first</option>
        <option value="name">Name A→Z</option>
        <option value="load">Highest load first</option>
      </select>

      <span className={styles.bar__count}>
        {resultCount} {resultCount === 1 ? 'device' : 'devices'}
      </span>

      {isActive && (
        <button className={styles.bar__reset} onClick={onReset}>
          Reset
        </button>
      )}
    </section>
  )
}
