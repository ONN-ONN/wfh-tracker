import { STATUSES } from '../constants'

export default function SummaryBar({ data, year, month }) {
  const counts = {}
  STATUSES.forEach(s => (counts[s.key] = 0))

  Object.entries(data).forEach(([key, status]) => {
    const [, dateStr] = key.split('|')
    const [y, m] = dateStr.split('-').map(Number)
    if (y === year && m === month + 1 && counts[status] !== undefined) {
      counts[status]++
    }
  })

  const total = Object.values(counts).reduce((a, b) => a + b, 0)
  const active = STATUSES.filter(s => counts[s.key] > 0)
  if (total === 0) return null

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <div className="bg-blue-900 text-white rounded-xl px-3 py-2 text-xs">
        <span className="text-lg font-bold block">{total}</span>รายการ
      </div>
      {active.map(s => (
        <div key={s.key} className="rounded-xl px-3 py-2 text-xs flex items-center gap-2 border"
          style={{ background: s.bg, borderColor: s.color + '40' }}>
          <span>{s.icon}</span>
          <div>
            <span className="font-bold" style={{ color: s.color }}>{counts[s.key]}</span>
            <span className="text-gray-600 ml-1">{s.label}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
