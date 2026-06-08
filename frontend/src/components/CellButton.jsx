import { STATUS_MAP } from '../constants'

export default function CellButton({ statusKey, onClick }) {
  // ค่าเริ่มต้น = ออฟฟิศ
  if (!statusKey) {
    const s = STATUS_MAP.office
    return (
      <button
        onClick={onClick}
        title="ออฟฟิศ (ค่าเริ่มต้น) · คลิกเพื่อเปลี่ยน"
        className="w-7 h-7 rounded flex items-center justify-center text-sm mx-auto transition-transform hover:scale-110"
        style={{ background: s.bg }}
      >
        {s.icon}
      </button>
    )
  }

  const s = STATUS_MAP[statusKey]
  if (!s) return null

  if (s.type === 'full') {
    return (
      <button
        onClick={onClick}
        title={s.label}
        className="w-7 h-7 rounded flex items-center justify-center text-sm mx-auto transition-transform hover:scale-110"
        style={{ background: s.bg }}
      >
        {s.icon}
      </button>
    )
  }

  // half-day
  const isAm = s.type === 'half_am'
  return (
    <button
      onClick={onClick}
      title={s.label}
      className="w-7 h-7 rounded overflow-hidden flex flex-col mx-auto transition-transform hover:scale-110"
    >
      <div
        className="flex-1 flex items-center justify-center text-white font-bold"
        style={{ background: isAm ? s.color : s.colorBot, fontSize: '7px' }}
      >
        {isAm ? 'เช้า' : s.icon}
      </div>
      <div
        className="flex-1 flex items-center justify-center"
        style={{ background: isAm ? s.colorBot : s.color, fontSize: isAm ? '11px' : '7px', color: isAm ? 'white' : 'white' }}
      >
        {isAm ? s.icon : 'บ่าย'}
      </div>
    </button>
  )
}
