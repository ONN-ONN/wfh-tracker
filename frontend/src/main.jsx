import React, { useState, useCallback } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import LoginPage from './components/LoginPage.jsx'
import './index.css'

function Root() {
  const [authed,  setAuthed]  = useState(false)
  const [who,     setWho]     = useState(null)
  const [notice,  setNotice]  = useState(null)

  const handleAuthed = (code, pin, name) => {
    setWho(name || code)
    setNotice(null)
    setAuthed(true)
  }

  const handleLogout = useCallback(auto => {
    setAuthed(false)
    setWho(null)
    setNotice(auto ? 'ออกจากระบบอัตโนมัติ เพราะไม่ได้ใช้งานนาน — กรุณาเข้าสู่ระบบใหม่' : null)
  }, [])

  if (!authed) {
    return <LoginPage onAuthed={handleAuthed} notice={notice} />
  }
  return <App who={who} onLogout={handleLogout} />
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
)
