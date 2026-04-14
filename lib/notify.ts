/**
 * 사찰 스님에게 SMS/카카오 알림 발송
 * Solapi(구 CoolSMS) API 사용
 *
 * 환경변수:
 *   SOLAPI_API_KEY    — Solapi API Key
 *   SOLAPI_API_SECRET — Solapi API Secret
 *   SOLAPI_SENDER     — 발신번호 (사전 등록 필수)
 *
 * 미설정 시 graceful skip (에러 없이 통과)
 */

const API_KEY = process.env.SOLAPI_API_KEY || ''
const API_SECRET = process.env.SOLAPI_API_SECRET || ''
const SENDER = process.env.SOLAPI_SENDER || ''
const SOLAPI_URL = 'https://api.solapi.com/messages/v4/send'

function getAuthHeader(): string {
  const date = new Date().toISOString()
  const salt = Math.random().toString(36).substring(2, 15)
  // HMAC-SHA256
  const crypto = require('crypto')
  const signature = crypto
    .createHmac('sha256', API_SECRET)
    .update(date + salt)
    .digest('hex')
  return `HMAC-SHA256 apiKey=${API_KEY}, date=${date}, salt=${salt}, signature=${signature}`
}

export async function notifyTemple(phone: string, message: string): Promise<boolean> {
  if (!API_KEY || !API_SECRET || !SENDER || !phone) return false

  // 전화번호 정리 (하이픈 제거)
  const to = phone.replace(/[^0-9]/g, '')
  if (to.length < 10) return false

  try {
    const res = await fetch(SOLAPI_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': getAuthHeader(),
      },
      body: JSON.stringify({
        message: {
          to,
          from: SENDER.replace(/[^0-9]/g, ''),
          text: message,
        },
      }),
    })
    return res.ok
  } catch {
    return false
  }
}
