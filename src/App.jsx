import { useState } from 'react'
import rawDevices from './data/devices.js'
import { Device } from './models/Device.js'
import Header from './components/Header.jsx'
import AlertBanner from './components/AlertBanner.jsx'
import StatsRow from './components/StatsRow.jsx'
import FilterBar from './components/FilterBar.jsx'
import DeviceList from './components/DeviceList.jsx'
import DeviceDetail from './components/DeviceDetail.jsx'
import styles from './App.module.css'

const DEFAULT_FILTERS = { query: '', status: 'all', site: 'all', sort: 'health' }

const devices = Device.fromList(rawDevices)
const sites = [...new Set(devices.map((device) => device.site))]

export default function App() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [selectedId, setSelectedId] = useState(null)

  // Filtering + sorting computed fresh on every render — no filteredDevices
  // state variable, and the array is copied before sort() since sort()
  // mutates in place.
  let visibleDevices = devices.filter((device) => device.matches(filters.query))

  if (filters.status !== 'all') {
    visibleDevices = visibleDevices.filter((device) => device.status === filters.status)
  }
  if (filters.site !== 'all') {
    visibleDevices = visibleDevices.filter((device) => device.site === filters.site)
  }

  const sortedDevices = [...visibleDevices]
  if (filters.sort === 'health') {
    sortedDevices.sort((a, b) => a.healthScore - b.healthScore)
  } else if (filters.sort === 'name') {
    sortedDevices.sort((a, b) => a.name.localeCompare(b.name))
  } else if (filters.sort === 'load') {
    sortedDevices.sort((a, b) => b.loadPct - a.loadPct)
  }

  // If the selected device fell out of the visible set, this naturally
  // becomes undefined and the detail panel below stops rendering.
  const selectedDevice = sortedDevices.find((device) => device.id === selectedId)

  const isFilterActive =
    filters.query !== '' || filters.status !== 'all' || filters.site !== 'all' || filters.sort !== 'health'

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }))
  }

  const handleReset = () => setFilters(DEFAULT_FILTERS)

  const handleSelect = (id) => {
    setSelectedId((prev) => (prev === id ? null : id))
  }

  return (
    <div className={styles.page}>
      <Header devices={devices} />
      <AlertBanner devices={devices} onInspect={handleSelect} />
      <StatsRow devices={devices} />
      <FilterBar
        filters={filters}
        sites={sites}
        resultCount={sortedDevices.length}
        isActive={isFilterActive}
        onFilterChange={handleFilterChange}
        onReset={handleReset}
      />

      <div className={styles.main}>
        <DeviceList
          devices={sortedDevices}
          selectedId={selectedId}
          onSelect={handleSelect}
          emptySlot={
            <button className={styles.clearButton} onClick={handleReset}>
              Clear filters
            </button>
          }
        />

        {selectedDevice && <DeviceDetail device={selectedDevice} onClose={() => setSelectedId(null)} />}
      </div>
    </div>
  )
}
