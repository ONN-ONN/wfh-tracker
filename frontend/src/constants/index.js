export const STATUSES = [
  { key: 'office',   label: 'ออฟฟิศ',            icon: '🧑🏾‍💻', type: 'full',    color: '#0284c7', bg: '#0284c726' },
  { key: 'wfh',      label: 'WFH',                icon: '🏠',    type: 'full',    color: '#15803d', bg: '#15803d26' },
  { key: 'vacation', label: 'ลาพักร้อน',          icon: '🏖️',   type: 'full',    color: '#b91c1c', bg: '#b91c1c26' },
  { key: 'sick',     label: 'ลาป่วย',             icon: '🤒',    type: 'full',    color: '#ea580c', bg: '#ea580c26' },
  { key: 'personal', label: 'ลากิจ',              icon: '💼',    type: 'full',    color: '#7c3aed', bg: '#7c3aed26' },
  { key: 'bd',       label: 'ลา Birthday',        icon: '🎂',    type: 'full',    color: '#db2777', bg: '#db277726' },
  { key: 'other',    label: 'อื่นๆ',              icon: '📝',    type: 'full',    color: '#65a30d', bg: '#65a30d26' },
  // half-day
  { key: 'sick_am',  label: 'ลาป่วย ครึ่งเช้า',  icon: '🤒',    type: 'half_am', color: '#ea580c', colorBot: '#7c2d12', label2: 'เช้า' },
  { key: 'sick_pm',  label: 'ลาป่วย ครึ่งบ่าย',  icon: '🤒',    type: 'half_pm', color: '#ea580c', colorBot: '#7c2d12', label2: 'บ่าย' },
  { key: 'vac_am',   label: 'พักร้อน ครึ่งเช้า', icon: '🏖️',   type: 'half_am', color: '#b91c1c', colorBot: '#7f1d1d', label2: 'เช้า' },
  { key: 'vac_pm',   label: 'พักร้อน ครึ่งบ่าย', icon: '🏖️',   type: 'half_pm', color: '#b91c1c', colorBot: '#7f1d1d', label2: 'บ่าย' },
  { key: 'per_am',   label: 'ลากิจ ครึ่งเช้า',   icon: '💼',    type: 'half_am', color: '#7c3aed', colorBot: '#4c1d95', label2: 'เช้า' },
  { key: 'per_pm',   label: 'ลากิจ ครึ่งบ่าย',   icon: '💼',    type: 'half_pm', color: '#7c3aed', colorBot: '#4c1d95', label2: 'บ่าย' },
]

export const STATUS_MAP = Object.fromEntries(STATUSES.map(s => [s.key, s]))

export const MONTHS_TH = [
  'มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน',
  'กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม',
]

export const MONTHS_SHORT = [
  'ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.',
  'ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.',
]

export const DAYS_TH = ['อา','จ','อ','พ','พฤ','ศ','ส']

export const HOLIDAYS_2026 = {
  '2026-1-1':  'วันขึ้นปีใหม่',
  '2026-3-3':  'วันมาฆบูชา',
  '2026-4-6':  'วันจักรี',
  '2026-4-13': 'วันสงกรานต์',
  '2026-4-14': 'วันสงกรานต์',
  '2026-4-15': 'วันสงกรานต์',
  '2026-5-1':  'วันแรงงาน',
  '2026-5-4':  'วันฉัตรมงคล',
  '2026-6-1':  'ชดเชยวันวิสาขบูชา',
  '2026-6-3':  'วันเฉลิมฯ พระบรมราชินี',
  '2026-7-28': 'วันเฉลิมฯ ร.10',
  '2026-7-29': 'วันอาสาฬหบูชา',
  '2026-8-12': 'วันแม่แห่งชาติ',
  '2026-10-13':'วันคล้ายวันสวรรคต ร.9',
  '2026-10-23':'วันปิยมหาราช',
  '2026-12-7': 'ชดเชยวันพ่อแห่งชาติ',
  '2026-12-10':'วันรัฐธรรมนูญ',
  '2026-12-31':'วันสิ้นปี',
}

export const getHoliday = (y, m, d) =>
  HOLIDAYS_2026[`${y}-${m + 1}-${d}`] || null

export const TEAM_COLORS = [
  { text: '#15803d', bg: '#dcfce7' },
  { text: '#0f766e', bg: '#ccfbf1' },
  { text: '#7c3aed', bg: '#ede9fe' },
  { text: '#b45309', bg: '#fef3c7' },
  { text: '#0284c7', bg: '#e0f2fe' },
]
