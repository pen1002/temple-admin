import { google, sheets_v4 } from 'googleapis'
import path from 'path'

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets']
const SHEET_ID = '19Z62fOCr-Esj3DuA8Y_1oKMqu3yTQsqwcjnlqXcJkmE'

let cachedClient: sheets_v4.Sheets | null = null

export async function getSheetsClient(): Promise<sheets_v4.Sheets> {
  if (cachedClient) return cachedClient
  const auth = new google.auth.GoogleAuth({
    keyFile: path.resolve(process.cwd(), 'google-service-account.json'),
    scopes: SCOPES,
  })
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
