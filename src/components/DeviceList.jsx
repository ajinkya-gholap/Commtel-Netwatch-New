import DeviceCard from './DeviceCard.jsx'
import EmptyState from './EmptyState.jsx'
import styles from './DeviceList.module.css'

export default function DeviceList({ devices, selectedId, onSelect, emptySlot }) {
  if (devices.length === 0) {
    return <EmptyState>{emptySlot}</EmptyState>
  }

  return (
    <div className={styles.grid}>
      {devices.map((device) => (
        <DeviceCard
          key={device.id}
          device={device}
          isSelected={device.id === selectedId}
          onSelect={onSelect}
        />
      ))}
    </div>
  )
}
