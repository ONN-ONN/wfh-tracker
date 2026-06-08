import { DAYS_TH, MONTHS_TH, TEAM_COLORS, getHoliday } from '../constants'
import CellButton from './CellButton'

export default function CalendarTable({ teams = [], year, month, data, onCellClick, saving }) {
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const today = new Date()
  const isThisMonth = today.getFullYear() === year && today.getMonth() === month
  const dk = (member, d) => `${member}|${year}-${month + 1}-${d}`

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-300 shadow-sm">
      <table className="border-collapse" style={{ width: 'max-content', minWidth: '100%' }}>
        <thead>
          <tr className="bg-slate-700">
            <th className="sticky left-0 z-20 bg-slate-700 text-left px-3 py-2.5 text-xs font-bold text-slate-100 border-r border-slate-600 border-b-2 border-b-slate-500" style={{ minWidth: 150 }}>
              ชื่อ
            </th>
            <th className="sticky z-20 bg-slate-700 text-left px-2 py-2.5 text-xs font-bold text-slate-100 border-r border-slate-600 border-b-2 border-b-slate-500" style={{ left: 150, minWidth: 80 }}>
              ทีม
            </th>
            {Array.from({ length: daysInMonth }, (_, i) => {
              const d   = i + 1
              const dow = new Date(year, month, d).getDay()
              const isToday   = isThisMonth && today.getDate() === d
              const isWeekend = dow === 0 || dow === 6
              const holiday   = getHoliday(year, month, d)
              let bg = 'bg-slate-700'
              if (isWeekend) bg = 'bg-slate-800'
              if (holiday)   bg = 'bg-rose-900'
              if (isToday)   bg = 'bg-blue-700'
              return (
                <th
                  key={d}
                  title={holiday || undefined}
                  className={`sticky top-0 z-10 text-center py-1.5 border-b-2 border-slate-600 ${bg}`}
                  style={{ width: 34 }}
                >
                  <div className={`text-xs font-bold ${isToday ? 'text-white' : isWeekend ? 'text-slate-500' : holiday ? 'text-rose-200' : 'text-slate-200'}`}>
                    {d}
                  </div>
                  <div className={`text-[9px] ${isWeekend ? 'text-slate-600' : 'text-slate-400'}`}>
                    {DAYS_TH[dow]}
                  </div>
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody>
          {teams.map((team, ti) => {
            const col = TEAM_COLORS[ti % TEAM_COLORS.length]
            return (
              <>
                <tr key={`team-${team.name}`} className="bg-slate-200">
                  <td colSpan={daysInMonth + 2} className="px-3 py-1.5 text-xs font-semibold text-slate-600 border-b border-slate-300">
                    👥 {team.name}
                    <span className="ml-2 font-normal text-slate-400">({team.members.length} คน)</span>
                  </td>
                </tr>
                {team.members.map((member, mi) => (
                  <tr key={member} className={`border-b border-gray-100 hover:bg-blue-50/30 transition-colors ${mi % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}>
                    <td
                      className="sticky left-0 z-10 px-3 py-1 text-sm font-medium text-gray-800 border-r border-gray-100 whitespace-nowrap"
                      style={{ background: mi % 2 === 0 ? '#fff' : '#f8fafc' }}
                    >
                      {member}
                    </td>
                    <td
                      className="sticky z-10 px-2 py-1 border-r border-gray-100 text-center"
                      style={{ left: 150, background: mi % 2 === 0 ? '#fff' : '#f8fafc' }}
                    >
                      <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold whitespace-nowrap"
                        style={{ color: col.text, background: col.bg }}>
                        {team.name}
                      </span>
                    </td>
                    {Array.from({ length: daysInMonth }, (_, i) => {
                      const d   = i + 1
                      const dow = new Date(year, month, d).getDay()
                      const isWeekend = dow === 0 || dow === 6
                      const holiday   = getHoliday(year, month, d)
                      const isToday   = isThisMonth && today.getDate() === d
                      const nonWork   = isWeekend || !!holiday
                      const val = data[dk(member, d)]
                      return (
                        <td
                          key={d}
                          className={`text-center py-0.5 ${nonWork ? 'bg-slate-100 opacity-40 pointer-events-none' : ''} ${isToday ? 'bg-blue-50/60' : ''}`}
                          style={{ width: 34 }}
                        >
                          {!nonWork && (
                            <CellButton
                              statusKey={val}
                              onClick={() => !saving && onCellClick(member, team.name, d)}
                            />
                          )}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
