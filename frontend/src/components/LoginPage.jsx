import { useState } from 'react'
import { apiLogin } from '../services/kvService'

export default function LoginPage({ onAuthed, notice }) {
  const [code, setCode] = useState('')
  const [pin,  setPin]  = useState('')
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)

  const submit = async e => {
    e.preventDefault()
    if (!code.trim() || !pin.trim()) return
    setLoading(true)
    setError(null)
    try {
      const user = await apiLogin(code.trim(), pin.trim())
      onAuthed(code.trim(), pin.trim(), user.name)
    } catch (e) {
      setError(e.message || 'รหัสพนักงานหรือ PIN ไม่ถูกต้อง')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl border border-gray-100 p-7">
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">💻</div>
          <h1 className="text-xl font-bold text-blue-900">Work Tracker</h1>
          <p className="text-xs text-gray-500 mt-1">ติดตามวันทำงานและวันลาของทีม</p>
        </div>

        {notice && !error && (
          <div className="mb-4 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
            ⏱️ {notice}
          </div>
        )}
        {error && (
          <div className="mb-4 px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">รหัสพนักงาน</label>
            <input
              autoFocus
              value={code}
              onChange={e => setCode(e.target.value)}
              placeholder="เช่น 1001"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">PIN</label>
            <input
              type="password"
              inputMode="numeric"
              value={pin}
              onChange={e => setPin(e.target.value)}
              placeholder="• • • •"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-center text-xl tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !code.trim() || !pin.trim()}
            className="w-full py-2.5 rounded-xl bg-blue-900 text-white font-semibold hover:bg-blue-950 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
          >
            {loading ? <><span className="animate-spin">⏳</span> กำลังตรวจสอบ...</> : 'เข้าใช้งาน'}
          </button>
        </form>

        <p className="mt-5 pt-4 border-t border-gray-100 text-center text-[11px] text-gray-400">
          ปัญหาการใช้งาน ติดต่อ <span className="font-medium text-gray-500">Performance Test</span>
        </p>
      </div>
    </div>
  )
}
