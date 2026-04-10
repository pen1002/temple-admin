import { google, sheets_v4 } from 'googleapis'
import path from 'path'
import fs from 'fs'

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets']
const SHEET_ID = '19Z62fOCr-Esj3DuA8Y_1oKMqu3yTQsqwcjnlqXcJkmE'

let cachedClient: sheets_v4.Sheets | null = null

export async function getSheetsClient(): Promise<sheets_v4.Sheets> {
  if (cachedClient) return cachedClient

  let auth: InstanceType<typeof google.auth.GoogleAuth>

  // 1순위: 환경변수 JSON (Vercel 프로덕션)
  if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
    const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON)
    // Vercel 환경변수에서 \n이 리터럴 문자열로 저장되는 문제 보정
    if (credentials.private_key) {
      credentials.private_key = credentials.private_key.replace(/\\n/g, '\n')
    }
    auth = new google.auth.GoogleAuth({ credentials, scopes: SCOPES })
  }
  // 2순위: 로컬 파일 (개발환경)
  else {
    const keyFile = path.resolve(process.cwd(), 'google-service-account.json')
    if (!fs.existsSync(keyFile)) {
      throw new Error('Google service account not configured: set GOOGLE_SERVICE_ACCOUNT_JSON env or provide google-service-account.json')
    }
    auth = new google.auth.GoogleAuth({ keyFile, scopes: SCOPES })
  }

  const client = await auth.getClient()
  cachedClient = google.sheets({ version: 'v4', auth: client as never })
  return cachedClient
}

export { SHEET_ID }

export interface SheetRow {
  rowIndex: number       // 시트 행 번호 (0-based, 헤더 제외)
  createdAt: string      // A열: 접수일시
  temple: string         // B열: 사찰
  name: string           // C열: 성명 (was B열 in original but checking actual)
  wish: string           // D열: 발원문
  amount: string         // E열: 금액
  lanternCount: string   // F열: 인등수
  phase: string          // G열: 차수
  bankStatus: string     // H열: 입금확인
}

export async function readSheetRows(range = 'A2:H1000'): Promise<SheetRow[]> {
  const sheets = await getSheetsClient()
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range,
  })
  const rows = res.data.values || []
  return rows.map((r, i) => ({
    rowIndex: i + 1, // 헤더=row0, 데이터는 row1부터
    createdAt:    r[0] || '',
    temple:       r[1] || '',
    name:         r[2] || '',
    wish:         r[3] || '',
    amount:       r[4] || '',
    lanternCount: r[5] || '',
    phase:        r[6] || '',
    bankStatus:   r[7] || '입금대기',
  }))
}
