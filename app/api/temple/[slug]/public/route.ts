import { NextRequest, NextResponse } from 'next/server'
import { getNotices, getEventList, getRitualTimes, getDharma, getGallery, getTempleName } from '@/lib/kv'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  if (!slug) return NextResponse.json({ error: 'Invalid slug' }, { status: 400 })

  try {
    const [notices, eventList, ritualTimes, dharma, gallery, templeName] = await Promise.all([
      getNotices(slug),
      getEventList(slug),
      getRitualTimes(slug),
      getDharma(slug),
      getGallery(slug),
      getTempleName(slug),
    ])

    return NextResponse.json({
      templeName,
      notices,
      eventList,
      ritualTimes,
      dharmaText: dharma.text,
      dharmaSource: dharma.source,
      dharmaHistory: dharma.history,
      gallery,
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Content-Type': 'application/json',
      }
    })
  } catch {
    return NextResponse.json({ error: '데이터를 불러오는 중 오류가 발생했습니다.' }, { status: 500 })
  }
}
