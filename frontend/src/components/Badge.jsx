import { LABELS } from '../utils'

export default function Badge({ value, map }) {
  const color = (map && map[value]) || 'secondary'
  return <span className={`badge bg-${color}`}>{LABELS[value] || value}</span>
}
