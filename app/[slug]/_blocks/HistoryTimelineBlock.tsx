// SEC05-01: 역사 타임라인
import type { TempleData } from './types'

interface TimelineEvent {
  year: string
  title: string
  desc?: string
  highlight?: boolean   // 국보·보물 등 강조
}

interface Props {
  temple: TempleData
  config: Record<string, unknown>
}

const BORIMSA_DEFAULTS: TimelineEvent[] = [
  { year: '759',   title: '원표대덕, 가지산사(迦智山寺) 창건', desc: '신라 경덕왕 18년, 큰 연못에 살던 아홉 마리 용을 제압하고 터를 잡다. 장생표주 건립.' },
  { year: '858',   title: '철조비로자나불좌상 조성 (국보 제117호)', desc: '김언경이 철 2,500근을 시주하여 한국 최초의 기년명 철불 탄생. 한국 미술사의 절대 기준점.', highlight: true },
  { year: '859',   title: '보조선사 체징, 가지산문 개창', desc: '헌안왕의 권유로 정착. 구산선문 최초의 산문 개산. 교학에서 실천적 선종으로의 패러다임 전환.', highlight: true },
  { year: '870',   title: '남·북 삼층석탑 및 석등 건립 (국보 제44호)', desc: '경문왕 10년. 통일신라 석탑의 완성된 비례미. 석탑지(타임캡슐) 발견으로 건립 연대 확인.', highlight: true },
  { year: '884',   title: '보조선사 창성탑 및 탑비 건립 (보물)', desc: '체징 선사의 생애와 법맥을 기록. 김언경의 행서 비문. 선종 역사의 공식 기록.' },
  { year: '1515',  title: '목조 사천왕상 조성 (보물 제1254호)', desc: '임진왜란 이전의 유일한 목조 사천왕상. 500년간 내부에 227종 345권의 고문헌 보존.', highlight: true },
  { year: '1950',  title: '6·25 전쟁의 참화', desc: '빨치산 소탕 작전으로 대부분의 목조 전각 전소. 일주문과 사천왕문만 기적적으로 생존.' },
  { year: '1982~', title: '대웅보전 복원 및 가람 중창', desc: '대웅보전(1982), 대적광전(1995) 등 주요 전각 복원. 천년의 잿더미 위에서 법맥을 이어가다.' },
  { year: '현재',  title: '선종 성지 · 힐링 공간으로 재탄생', desc: '템플스테이 운영, 비자나무 숲 치유, 다선일미 체험. 천년의 깨달음이 현대의 치유로 이어지다.' },
]

export default function HistoryTimelineBlock({ temple, config }: Props) {
  const events: TimelineEvent[] = Array.isArray(config.events) && (config.events as TimelineEvent[]).length > 0
    ? (config.events as TimelineEvent[])
    : BORIMSA_DEFAULTS

  const primary = temple.primaryColor ?? '#8B2500'
  const gold = '#9B8654'

  return (
    <section
      id="history"
      style={{ background: '#EDE7DB', padding: '80px 24px' }}
    >
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        {/* 헤더 */}
        <p style={{ fontSize: '.75rem', fontWeight: 700, letterSpacing: '.12em', color: gold, marginBottom: 12, textTransform: 'uppercase' }}>
          History
        </p>
        <h2 style={{ fontFamily: "'Noto Serif KR', serif", fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 700, color: '#1A1A18', marginBottom: 12, lineHeight: 1.4 }}>
          {temple.name} 연혁
        </h2>
        <p style={{ fontSize: '.92rem', color: '#6B6560', marginBottom: 56 }}>
          759년 창건부터 천년을 이어온 가지산 성지의 발자취
        </p>

        {/* 타임라인 */}
        <div style={{ position: 'relative', paddingLeft: 32 }}>
          {/* 세로선 */}
          <div style={{
            position: 'absolute', left: 10, top: 8, bottom: 8,
            width: 2, background: `linear-gradient(to bottom, ${primary}, ${gold}44)`,
          }} />

          {events.map((ev, i) => (
            <div key={i} style={{ position: 'relative', marginBottom: 36 }}>
              {/* 점 */}
              <div style={{
                position: 'absolute', left: -26, top: 4,
                width: ev.highlight ? 16 : 12,
                height: ev.highlight ? 16 : 12,
                borderRadius: '50%',
                background: ev.highlight ? primary : '#D4CEC4',
                border: `2px solid ${ev.highlight ? primary : '#9B8654'}`,
                transform: 'translateX(-50%)',
                boxShadow: ev.highlight ? `0 0 0 4px ${primary}22` : 'none',
              }} />

              <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', flexWrap: 'wrap' }}>
                {/* 연도 */}
                <span style={{
                  flexShrink: 0,
                  fontFamily: "'Playfair Display', serif",
                  fontSize: ev.highlight ? '1.15rem' : '1rem',
                  fontWeight: 700,
                  color: ev.highlight ? primary : gold,
                  minWidth: 56,
                  lineHeight: 1.3,
                }}>
                  {ev.year}
                </span>

                <div style={{ flex: 1 }}>
                  <h3 style={{
                    fontSize: ev.highlight ? '.97rem' : '.9rem',
                    fontWeight: ev.highlight ? 700 : 600,
                    color: '#1A1A18',
                    marginBottom: ev.desc ? 6 : 0,
                    lineHeight: 1.5,
                  }}>
                    {ev.title}
                  </h3>
                  {ev.desc && (
                    <p style={{ fontSize: '.84rem', color: '#6B6560', lineHeight: 1.75 }}>
                      {ev.desc}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
