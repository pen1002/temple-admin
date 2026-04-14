/**
 * 사찰 스님에게 카카오 알림톡/SMS 발송
 * Solapi API 사용 — 알림톡 우선, 실패 시 SMS 대체
 *
 * 환경변수:
 *   SOLAPI_API_KEY    — Solapi API Key
 *   SOLAPI_API_SECRET — Solapi API Secret
 *   SOLAPI_SENDER     — 발신번호 (사전 등록 필수)
 *   SOLAPI_PFID       — 카카오 비즈니스 채널 ID (알림톡용)
 *
 * SOLAPI_PFID 미설정 시 SMS로 대체 발송
 * SOLAPI_API_KEY 미설정 시 graceful skip
 */
import crypto from 'crypto'

const API_KEY = process.env.SOLAPI_API_KEY || ''
const API_SECRET = process.env.SOLAPI_API_SECRET || ''
const SENDER = process.env.SOLAPI_SENDER || ''
const PFID = process.env.SOLAPI_PFID || ''
const SOLAPI_URL = 'https://api.solapi.com/messages/v4/send'

function getAuthHeader(): string {
  const date = new Date().toISOString()
  const salt = Math.random().toString(36).substring(2, 15)
  const signature = crypto
    .createHmac('sha256', API_SECRET)
    .update(date + salt)
    .digest('hex')
  return `HMAC-SHA256 apiKey=${API_KEY}, date=${date}, salt=${salt}, signature=${signature}`
}

/**
 * 알림톡 발송 (PFID + templateId 필요)
 * 실패 시 자동으로 SMS 대체
 */
export async function notifyTemple(
  phone: string,
  message: string,
  templateId?: string,
  variables?: Record<string, string>,
): Promise<boolean> {
  if (!API_KEY || !API_SECRET || !SENDER || !phone) return false

  const to = phone.replace(/[^0-9]/g, '')
  if (to.length < 10) return false
  const from = SENDER.replace(/[^0-9]/g, '')

  try {
    // 알림톡 발송 시도 (PFID + templateId 있을 때)
    if (PFID && templateId) {
      const kakaoRes = await fetch(SOLAPI_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': getAuthHeader() },
        body: JSON.stringify({
          message: {
            to,
            from,
            kakaoOptions: {
              pfId: PFID,
              templateId,
              variables: variables || {},
            },
          },
        }),
      })
      if (kakaoRes.ok) return true
      // 알림톡 실패 → SMS 대체 (아래로 진행)
    }

    // SMS 발송 (알림톡 미설정 또는 실패 시)
    const smsRes = await fetch(SOLAPI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': getAuthHeader() },
      body: JSON.stringify({
        message: { to, from, text: message },
      }),
    })
    return smsRes.ok
  } catch {
    return false
  }
}

/**
 * 알림톡 템플릿 ID 상수
 * Solapi 콘솔에서 템플릿 등록 후 여기에 ID 추가
 */
export const KAKAO_TEMPLATES = {
  OFFERING: process.env.SOLAPI_TPL_OFFERING || '',    // 기도/공양 접수 알림
  SIDO: process.env.SOLAPI_TPL_SIDO || '',            // 신도 등록 알림
  MEMORIAL: process.env.SOLAPI_TPL_MEMORIAL || '',    // 위패 봉안 알림
}
