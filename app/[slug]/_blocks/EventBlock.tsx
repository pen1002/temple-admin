// E-01 / L-02 / L-03: 법회·행사 일정
import type { TemplateContent, TempleData } from './types'

interface Props {
  content: TemplateContent
  temple: TempleData
}

function getDday(dateStr: string): string {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(dateStr)
  target.setHours(0, 0, 0, 0)
  const diff = Math.round((target.getTime() - today.getTime()) / 86_400_000)
  if (diff < 0)  return '종료'
  if (diff === 0) return 'D-Day'
  return `D-${diff}`
}

export default function EventBlock({ content, temple }: Props) {
  const { eventList, ritualTimes } = content
  const hasEvents  = eventList.length > 0
  const hasRituals = ritualTimes.length > 0

  if (!hasEvents && !hasRituals) return null

  return (
    <section
      className="px-5 py-12"
      style={{ background: '#FFF8E7' }}
    >
      <div className="max-w-xl mx-auto space-y-8">
        {/* 행사 일정 */}
        {hasEvents && (
          <div>
            <div className="flex items-center gap-2 mb-5">
              <span className="text-2xl">🎋</span>
              <h2 className="font-bold text-xl" style={{ color: '#2C1810' }}>행사 일정</h2>
              <div className="flex-1 h-px ml-2" style={{ background: '#D4AF37', opacity: 0.4 }} />
            </div>
            <div className="space-y-3">
              {eventList.map(evt => {
                const dday = evt.date ? getDday(evt.date) : null
                const isToday = dday === 'D-Day'
                const isOver  = dday === '종료'
                return (
                  <div
                    key={evt.id}
                    className="rounded-2xl p-4 flex items-center gap-4"
                    style={{
                      background: isToday ? temple.primaryColor + '18' : '#fff',
                      border: `1px solid ${isToday ? temple.primaryColor + '60' : '#e8dcc8'}`,
                      opacity: isOver ? 0.5 : 1,
                    }}
                  >
                    {/* D-Day 뱃지 */}
                    {dday && (
                      <div
                        className="flex-shrink-0 px-2.5 py-1 rounded-lg text-xs font-bold min-w-[52px] text-center"
                        style={{
                          background: isToday ? temple.primaryColor : isOver ? '#ccc' : '#FFF8E7',
                          color:      isToday ? '#FFFAF0' : isOver ? '#888' : temple.primaryColor,
                          border:     `1px solid ${isToday ? temple.primaryColor : isOver ? '#ddd' : temple.primaryColor + '40'}`,
                        }}
                      >
                        {dday}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-base" style={{ color: '#2C1810' }}>{evt.name}</p>
                      {evt.date && (
                        <p className="text-sm" style={{ color: '#8B6914' }}>
                          {new Date(evt.date).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' })}
                        </p>
                      )}
                      {evt.memo && (
                        <p className="text-sm mt-0.5" style={{ color: '#9a7a50' }}>{evt.memo}</p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* 법회 시간 */}
        {hasRituals && (
          <div>
            <div className="flex items-center gap-2 mb-5">
              <span className="text-2xl">📿</span>
              <h2 className="font-bold text-xl" style={{ color: '#2C1810' }}>정기 법회</h2>
              <div className="flex-1 h-px ml-2" style={{ background: '#D4AF37', opacity: 0.4 }} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              {ritualTimes.map(r => (
                <div
                  key={r.id}
                  className="rounded-2xl p-4 text-center"
                  style={{ background: '#fff', border: '1px solid #e8dcc8' }}
                >
                  <p className="font-bold text-base mb-1" style={{ color: '#2C1810' }}>{r.name}</p>
                  <p className="font-semibold" style={{ color: temple.primaryColor }}>{r.time}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
