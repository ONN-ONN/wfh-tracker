import { useState, useEffect } from 'react'
import { STATUSES, STATUS_MAP, MONTHS_TH, DAYS_TH } from '../constants'

const FULL_DAY   = STATUSES.filter(s => s.type === 'full')
const SICK_HALF  = STATUSES.filter(s => s.key.startsWith('sick_'))
const VAC_HALF   = STATUSES.filter(s => s.key.startsWith('vac_'))
const PER_HALF   = STATUSES.filter(s => s.key.startsWith('per_'))

function Opt({ s, selected, onSelect }) {
  return (
    <button
      onClick={() => onSelect(s.key)}
      className="flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm text-left transition-all"
      style={{
        borderColor: selected ? s.color : '#e5e7eb',
        background:  selected ? s.bg    : '#fff',
        color:       selected ? s.color : '#374151',
        boxShadow:   selected ? `inset 0 0 0 1px ${s.color}` : 'none',
      }}
    >
      <span className="w-7 h-7 rounded-lg flex items-center justify-center text-base flex-shrink-0" style={{ background: s.bg }}>
        {s.icon}
      </span>
      <span className="font-medium">{s.label}</span>
    </button>
  )
}

function HalfGroup({ keys, selected, onSelect }) {
  const arr = keys.map(k => STATUS_MAP[k])
  const base = arr[0]
  return (
    <div className="flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2">
      <span className="text-base flex-shrink-0">{base.icon}</span>
      <span className="text-sm font-medium text-gray-700 flex-shrink-0">{base.label.replace(' ครึ่งเช้า','').replace(' ครึ่งบ่าย','')}</span>
      <div className="flex gap-1 ml-auto">
        {arr.map(s => {
          const sel = selected === s.key
          return (
            <button
              key={s.key}
              onClick={() => onSelect(s.key)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all"
              style={{
                borderColor: sel ? s.color : '#e5e7eb',
                background:  sel ? s.color : '#fff',
                color:       sel ? '#fff'  : '#6b7280',
              }}
            >
              {s.label2}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default function StatusModal({ target, currentStatus, onSave, onDelete, onClose }) {
  const [selected, setSelected] = useState(currentStatus || null)
  useEffect(() => { setSelected(currentStatus || null) }, [currentStatus])

  if (!target) return null
  const { member, day, year, month } = target
  const dow = new Date(year, month, day).getDay()

  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="px-5 pt-5 pb-3 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">{member}</h3>
          <p className="text-sm text-gray-500 mt-0.5">
            {day} {MONTHS_TH[month]} {year + 543} ({DAYS_TH[dow]})
          </p>
        </div>

        <div className="px-5 py-4 space-y-5">
          <section>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">การทำงาน / การลา (เต็มวัน)</p>
            <div className="grid grid-cols-2 gap-2">
              {FULL_DAY.map(s => <Opt key={s.key} s={s} selected={selected === s.key} onSelect={setSelected} />)}
            </div>
          </section>

          <section>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">ลาครึ่งวัน</p>
            <div className="space-y-2">
              <HalfGroup keys={['sick_am','sick_pm']} selected={selected} onSelect={setSelected} />
              <HalfGroup keys={['vac_am','vac_pm']}  selected={selected} onSelect={setSelected} />
              <HalfGroup keys={['per_am','per_pm']}  selected={selected} onSelect={setSelected} />
            </div>
          </section>
        </div>

        <div className="flex items-center gap-2 px-5 pb-5 pt-2 border-t border-gray-100">
          {currentStatus && (
            <button onClick={onDelete} className="text-sm text-red-500 hover:text-red-600 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors">
              🗑 ลบ
            </button>
          )}
          <div className="ml-auto flex gap-2">
            <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              ยกเลิก
            </button>
            <button
              onClick={() => selected && onSave(selected)}
              disabled={!selected}
              className="px-4 py-2 text-sm text-white bg-blue-900 rounded-lg hover:bg-blue-950 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              บันทึก
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
