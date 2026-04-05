// SEC05-01: 역사 타임라인
import type { TempleData } from './types'

interface TimelineEvent {
  year: string
  title: string
  desc?: string
  highlight?: boolean
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

  return (
    <section id="history" className="bt-section">
      <div className="bt-section-inner" style={{ maxWidth: 900 }}>
        <span className="bt-section-label">History</span>
        <h2 className="bt-section-title">{temple.name} 연혁</h2>
        <p className="bt-section-desc">759년 창건부터 천년을 이어온 가지산 성지의 발자취</p>

        <div className="bt-timeline">
          {events.map((ev, i) => (
            <div key={i} className={`bt-tl-item${ev.highlight ? ' highlight' : ''}`}>
              <div className="bt-tl-year">{ev.year}</div>
              <div className="bt-tl-title">{ev.title}</div>
              {ev.desc && <p className="bt-tl-desc">{ev.desc}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
