// E-01 / L-02 / L-03 / SEC03-*: 법회·행사 일정
import type { TemplateContent, TempleData } from './types'

interface Props {
  content: TemplateContent
  temple: TempleData
}

export default function EventBlock({ content, temple }: Props) {
  const { eventList, ritualTimes } = content
  const hasEvents  = eventList.length > 0
  const hasRituals = ritualTimes.length > 0

  if (!hasEvents && !hasRituals) return null

  return (
    <section className="bt-section" id="events">
      <div className="bt-section-inner">
        <span className="bt-section-label">Schedule</span>
        <h2 className="bt-section-title">법회 · 행사 일정</h2>

        {hasEvents && (
          <div className="bt-events-grid">
            {eventList.map(evt => (
              <div key={evt.id} className="bt-event-card">
                <div className="bt-event-icon">🎋</div>
                {evt.date && (
                  <span className="bt-event-tag">
                    {new Date(evt.date).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' })}
                  </span>
                )}
                <h3>{evt.name}</h3>
                {evt.memo && <p>{evt.memo}</p>}
                {evt.date && (
                  <div className="bt-event-meta">
                    {new Date(evt.date).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {hasRituals && (
          <>
            <h3 className="bt-section-title" style={{ fontSize: '1.2rem', marginTop: hasEvents ? 56 : 0 }}>정기 법회</h3>
            <div className="bt-events-grid">
              {ritualTimes.map(r => (
                <div key={r.id} className="bt-event-card">
                  <div className="bt-event-icon">📿</div>
                  <h3>{r.name}</h3>
                  <div className="bt-event-meta">{r.time}</div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  )
}
