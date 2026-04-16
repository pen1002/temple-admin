import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { readSheetRows } from '@/lib/google-sheets'


// GET /api/indung/sync?temple_slug=cheongwansa
// 시트의 입금확인 상태(H열)를 DB bank_confirmed에 동기화
export async function GET() {
  try {
    const sheetRows = await readSheetRows()
    let synced = 0

    for (const row of sheetRows) {
      const isConfirmed = row.bankStatus.includes('완료') || row.bankStatus.includes('확인')
      if (!isConfirmed) continue

      // 이름 + 사찰로 매칭 (시트 기준)
      const slug = row.temple || 'cheongwansa'
      const donors = await prisma.indungDonor.findMany({
        where: {
          temple_slug: slug,
          name: row.name,
          bank_confirmed: false,
        },
        take: 1,
        orderBy: { created_at: 'asc' },
      })

      for (const d of donors) {
        await prisma.indungDonor.update({
          where: { id: d.id },
          data: { bank_confirmed: true },
        })
        synced++
      }
    }

    return NextResponse.json({ ok: true, synced, totalSheetRows: sheetRows.length })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'unknown'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
