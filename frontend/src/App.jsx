import { useState, useEffect, useCallback, useRef } from 'react'
import { MONTHS_TH } from './constants'
import {
  apiGetTeams, apiGetMonth, apiEnsureHeader,
  apiSaveEntry, apiDeleteEntry, clearCredentials,
} from './services/kvService'
import CalendarTable from './components/CalendarTable'
import StatusModal   from './components/StatusModal'
import SummaryBar    from './components/SummaryBar'

const AUTO_LOGOUT_MS = 30 * 60 * 1000 // 30 นาที

export default function App({ who, onLogout }) {
  const now   = new Date()
  const [year,  setYear]  = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth())
  const [teams, setTeams] = useState([])
  const [data,  setData]  = useState({})
  const [loading,  setLoading]  = useState(true)
  const [saving,   setSaving]   = useState(false)
  const [error,    setError]    = useState(null)
  const [modal,    setModal]    = useState(null)
  const timerRef = useRef(null)

  // auto logout
  useEffect(() => {
    const reset = () => {
      clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => onLogout(true), AUTO_LOGOUT_MS)
    }
    const events = ['mousemove','mousedown','keydown','touchstart','scroll','click']
    events.forEach(ev => window.addEventListener(ev, reset, { passive: true }))
    reset()
    return () => {
      clearTimeout(timerRef.current)
      events.forEach(ev => window.removeEventListener(ev, reset))
    }
  }, [onLogout])

  // load teams once
  useEffect(() => {
    apiGetTeams().then(t => { if (t) setTeams(t) }).catch(() => {})
  }, [])

  // load month data
  const loadData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      await apiEnsureHeader()
      const result = await apiGetMonth(year, month)
      setData(result)
    } catch (e) {
      setError('ไม่สามารถโหลดข้อมูลได้: ' + e.message)
    } finally {
      setLoading(false)
    }
  }, [year, month])

  useEffect(() => { loadData() }, [loadData])

  const changeMonth = delta => {
    setMonth(prev => {
      let m = prev + delta
      if (m > 11) { setYear(y => y + 1); return 0 }
      if (m < 0)  { setYear(y => y - 1); return 11 }
      return m
    })
  }

  const goToday = () => {
    const t = new Date()
    setYear(t.getFullYear())
    setMonth(t.getMonth())
  }

  const isCurrentMonth = year === now.getFullYear() && month === now.getMonth()

  // open modal
  const handleCellClick = (member, team, day) => {
    const key = `${member}|${year}-${month + 1}-${day}`
    setModal({ member, team, day, year, month, currentStatus: data[key] || null })
  }

  // save
  const handleSave = async statusKey => {
    if (!modal) return
    setSaving(true)
    setError(null)
    try {
      await apiSaveEntry(modal.member, modal.team, year, month, modal.day, statusKey)
      const key = `${modal.member}|${year}-${month + 1}-${modal.day}`
      setData(prev => ({ ...prev, [key]: statusKey }))
      setModal(null)
    } catch (e) {
      setError('บันทึกไม่สำเร็จ: ' + e.message)
    } finally {
      setSaving(false)
    }
  }

  // delete
  const handleDelete = async () => {
    if (!modal) return
    setSaving(true)
    setError(null)
    try {
      await apiDeleteEntry(modal.member, year, month, modal.day)
      const key = `${modal.member}|${year}-${month + 1}-${modal.day}`
      setData(prev => { const n = { ...prev }; delete n[key]; return n })
      setModal(null)
    } catch (e) {
      setError('ลบไม่สำเร็จ: ' + e.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="h-screen flex flex-col bg-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm shrink-0">
        <div className="px-4 py-3 flex items-center gap-4 flex-wrap">
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold text-blue-900">💻 Work Tracker</h1>
            {who && (
              <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-500">
                <span>👤 {who}</span>
                <button
                  onClick={() => { clearCredentials(); onLogout(false) }}
                  className="text-red-400 hover:text-red-600 hover:underline"
                >
                  ออกจากระบบ
                </button>
              </div>
            )}
          </div>

          {/* Month nav */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button onClick={() => changeMonth(-1)} className="w-8 h-8 rounded-lg border border-gray-200 text-gray-500 hover:bg-blue-50 flex items-center justify-center transition-colors">◀</button>
            <span className="text-base font-bold text-blue-900 min-w-[160px] text-center whitespace-nowrap">
              {MONTHS_TH[month]} {year + 543}
            </span>
            <button onClick={() => changeMonth(1)}  className="w-8 h-8 rounded-lg border border-gray-200 text-gray-500 hover:bg-blue-50 flex items-center justify-center transition-colors">▶</button>
            <button
              onClick={goToday}
              disabled={isCurrentMonth}
              className="px-3 h-8 rounded-lg border border-gray-200 text-xs font-medium text-blue-900 hover:bg-blue-50 disabled:opacity-40 disabled:cursor-default transition-colors whitespace-nowrap"
            >
              📅 วันนี้
            </button>
          </div>

          <button
            onClick={loadData}
            disabled={loading}
            className="px-3 py-2 rounded-lg bg-blue-900 text-white text-xs font-medium hover:bg-blue-950 disabled:opacity-50 transition-colors flex items-center gap-1.5"
          >
            <span className={loading ? 'animate-spin' : ''}>↻</span> โหลด
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="px-4 py-4 flex-1 flex flex-col min-h-0">
        {error && (
          <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 flex items-start gap-2">
            <span>⚠️</span>
            <span className="flex-1">{error}</span>
            <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600">✕</button>
          </div>
        )}
        {saving && (
          <div className="mb-4 px-4 py-2 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-700 flex items-center gap-2">
            <span className="animate-spin">⏳</span> กำลังบันทึก...
          </div>
        )}

        <SummaryBar data={data} year={year} month={month} />

        <div className="flex-1 min-h-0 overflow-auto">
          {loading ? (
            <div className="flex items-center justify-center h-full text-gray-400 text-sm gap-3">
              <span className="animate-spin text-2xl">⏳</span> กำลังโหลดข้อมูล...
            </div>
          ) : (
            <CalendarTable
              teams={teams}
              year={year}
              month={month}
              data={data}
              onCellClick={handleCellClick}
              saving={saving}
            />
          )}
        </div>
      </main>

      <footer className="shrink-0 border-t border-gray-200 bg-white px-4 py-3 text-center text-xs text-gray-400">
        © 2026 Work Tracker
      </footer>

      {modal && (
        <StatusModal
          target={modal}
          currentStatus={modal.currentStatus}
          onSave={handleSave}
          onDelete={handleDelete}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  )
}
