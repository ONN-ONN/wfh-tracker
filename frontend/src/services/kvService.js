/**
 * kvService.js
 * เรียก Cloudflare Worker API แทน Apps Script
 */

const BASE = import.meta.env.VITE_WORKER_URL || ''

let _code = null
let _pin  = null

export function setCredentials(code, pin) {
  _code = code
  _pin  = pin
}

export function clearCredentials() {
  _code = null
  _pin  = null
}

async function post(path, body = {}) {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code: _code, pin: _pin, ...body }),
  })
  const data = await res.json()
  if (!data.ok) throw new Error(data.error || 'เกิดข้อผิดพลาด')
  return data
}

export async function apiLogin(code, pin) {
  const res = await fetch(`${BASE}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, pin }),
  })
  const data = await res.json()
  if (!data.ok) throw new Error(data.error || 'รหัสหรือ PIN ไม่ถูกต้อง')
  setCredentials(code, pin)
  return { name: data.name, team: data.team }
}

export async function apiGetTeams() {
  const data = await post('/api/teams')
  return data.teams
}

export async function apiGetMonth(year, month) {
  const data = await post('/api/month', { year, month: month + 1 })
  return data.data || {}
}

export async function apiEnsureHeader() {
  // KV ไม่ต้องมี header — no-op
  return true
}

export async function apiSaveEntries(entries) {
  if (!entries || !entries.length) return
  await post('/api/save', { entries })
}

export async function apiDeleteEntries(entries) {
  if (!entries || !entries.length) return
  await post('/api/delete', { entries })
}

// single-entry helpers
export const apiSaveEntry = (member, team, year, month, day, status) =>
  apiSaveEntries([{ member, team, year, month, day, status }])

export const apiDeleteEntry = (member, year, month, day) =>
  apiDeleteEntries([{ member, year, month, day }])
