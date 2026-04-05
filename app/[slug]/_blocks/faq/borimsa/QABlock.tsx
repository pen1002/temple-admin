// QA-01: FAQ·퀴즈·슬라이드·인포그래픽 학습관 (탭 패널)
'use client'
import { useState } from 'react'
import type { TempleData } from '../../types'

interface FaqItem { q: string; a: string }
interface QuizItem { q: string; opts: string[]; ans: number; explain: string }

interface Props {
  temple: TempleData
  config: Record<string, unknown>
}

const BORIMSA_FAQ: FaqItem[] = [
  { q: '보림사는 언제, 누구에 의해 세워졌나요?', a: '759년(신라 경덕왕 18년) 화엄종 승려 원표대덕이 가지산사로 처음 세웠습니다. 이후 859년 보조선사 체징이 헌안왕의 권유로 가지산문을 개창하며 한국 선종의 시작점이 되었습니다.' },
  { q: '동양 3보림이란 무엇인가요?', a: '보림사는 인도 가지산의 보림사, 중국 선종 제6조 혜능 스님의 보림사와 더불어 동양 3보림의 하나입니다. 중국 혜능 선맥의 정통을 이어받은 한국 선종의 사상적 모태입니다.' },
  { q: '철조비로자나불좌상이 국보인 이유는?', a: '한국에서 제작 연대가 확실한 가장 오래된 철불입니다. 858년 김언경이 철 2,500근을 시주했다는 명문이 불상 뒷면에 새겨져 있어 한국 미술사의 절대 기준점이 됩니다.' },
  { q: '삼층석탑에서 발견된 석탑지란?', a: '1933년 북탑 해체 보수 시 내부에서 870년(경문왕 10년)이라는 건립 연대와 수리 기록이 담긴 납석제 석탑지가 발견되었습니다. 탑의 타임캡슐이라 할 수 있습니다.' },
  { q: '목조 사천왕상 내부에서 발견된 것은?', a: '1995년 해체 보수 시 사천왕상 내부에서 월인석보를 비롯한 227종 345권의 조선 전기 고문헌이 발견되었습니다. 임진왜란 이전의 유일한 목조 사천왕상입니다.' },
  { q: '템플스테이 예약 방법은?', a: '휴식형(상시), 체험형(주말), 당일형으로 운영됩니다. 성인 기준 40,000~60,000원이며, 템플스테이 공식 홈페이지(www.templestay.com)에서 예약 가능합니다.' },
  { q: '주변 명소는 어디가 있나요?', a: '정남진 편백숲 우드랜드, 정남진 장흥 토요시장(한우·키조개·표고버섯의 장흥 삼합), 정남진 천문과학관 등 자연과 먹거리 명소가 가깝습니다.' },
]

const BORIMSA_QUIZ: QuizItem[] = [
  { q: '보림사 철조비로자나불좌상이 국보로 지정된 핵심 이유는?', opts: ['크기가 한국 철불 중 가장 크다','858년이라는 제작 연대가 명확히 기록되어 있다','금으로 도금되어 있다','고려 왕실이 제작을 명했다'], ans: 1, explain: '불상 뒷면에 858년 김언경이 철 2,500근을 시주했다는 기년명이 새겨져 한국 최초의 기년명 철불입니다.' },
  { q: '지권인(智拳印)이 상징하는 의미는?', opts: ['전쟁 승리 기원','중생과 부처가 본래 하나라는 선종 사상','극락왕생 기도','제자들에 대한 가르침'], ans: 1, explain: '지권인은 왼손 검지를 오른손으로 감싸 쥔 수인으로, 중생과 부처가 본래 하나라는 선종의 핵심 철학을 시각화한 것입니다.' },
  { q: '남·북 삼층석탑에서 발견된 석탑지가 중요한 이유는?', opts: ['금 사리 발견','870년 건립 연대와 수리 기록이 담겨 있다','석공 이름이 기록','설계 도면이 포함'], ans: 1, explain: '1933년 북탑 내부에서 발견된 석탑지에는 870년이라는 건립 연대와 후대 수리 기록이 새겨져 있습니다.' },
  { q: '목조 사천왕상 내부에서 1995년 발견된 것은?', opts: ['금·은 보석류','《월인석보》 등 227종 345권 고문헌','부처님 사리 3과','창건 목재편'], ans: 1, explain: '1995년 해체 보수 중 사천왕상 내부에서 《월인석보》를 비롯한 227종 345권의 조선 전기 고문헌이 발견되었습니다.' },
  { q: '보림사가 동양 3보림으로 불리는 이유는?', opts: ['세 나라 사찰의 동일 건축 양식','세 사찰 모두 동양 최대 규모','중국 혜능 선맥의 정통을 잇는 선종 중심 사찰','같은 해 창건'], ans: 2, explain: '보림사라는 명칭은 중국 선종 제6조 혜능 스님의 보림사에서 유래했으며, 선맥의 정통을 상징합니다.' },
]

function FaqPanel({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(null)
  return (
    <div className="bt-faq-list">
      {items.map((item, i) => (
        <div key={i} className={`bt-faq-item${open === i ? ' open' : ''}`}>
          <button
            className="bt-faq-q"
            onClick={() => setOpen(open === i ? null : i)}
          >
            {item.q}
          </button>
          <div className="bt-faq-a">
            <p>{item.a}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

function QuizPanel({ items }: { items: QuizItem[] }) {
  const [idx, setIdx] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const item = items[idx]
  const correct = selected === item.ans

  return (
    <div className="bt-quiz-container">
      <div className="bt-quiz-progress">
        {items.map((_, i) => (
          <div
            key={i}
            className={`bt-quiz-dot${i === idx ? ' active' : i < idx ? ' correct' : ''}`}
          />
        ))}
      </div>

      <p className="bt-quiz-question">{item.q}</p>

      <div className="bt-quiz-options">
        {item.opts.map((opt, i) => {
          let cls = 'bt-quiz-opt'
          if (selected !== null) {
            if (i === item.ans) cls += ' correct-ans'
            else if (i === selected) cls += ' wrong-ans'
          }
          return (
            <button
              key={i}
              className={cls}
              disabled={selected !== null}
              onClick={() => setSelected(i)}
            >
              {i + 1}. {opt}
            </button>
          )
        })}
      </div>

      {selected !== null && (
        <div className="bt-quiz-explain">
          <strong>{correct ? '✓ 정답입니다!' : '✗ 틀렸습니다.'}</strong>
          <p style={{ marginTop: 6 }}>{item.explain}</p>
        </div>
      )}

      <div className="bt-quiz-nav">
        {selected !== null && idx < items.length - 1 && (
          <button
            className="bt-quiz-btn bt-quiz-btn-next"
            onClick={() => { setIdx(idx + 1); setSelected(null) }}
          >
            다음 문제 →
          </button>
        )}
        {selected !== null && idx === items.length - 1 && (
          <button
            className="bt-quiz-btn bt-quiz-btn-retry"
            onClick={() => { setIdx(0); setSelected(null) }}
          >
            처음부터 다시
          </button>
        )}
      </div>
    </div>
  )
}

const SLIDE_TITLES = [
  '천년의 깨달음에서 현대의 치유로',
  '보림사를 읽는 3가지 시선',
  '깨달음의 동진, 가지산문의 개창',
  '도슨트 투어: 천년의 유산을 걷다',
  '조선 목조각의 걸작, 사천왕상',
  '완벽한 비례미, 남·북 삼층석탑과 석등',
  '절대 연대를 품은 최초의 철불',
  '창건의 주역을 기리다, 보조선사 창성탑비',
  '소실과 중건, 멈추지 않는 법맥',
  '다선일미와 비자나무 숲',
  '나를 찾는 시간, 보림사 템플스테이',
  '장흥의 자연과 연결된 치유 여행',
  '천년의 선이 건네는 위로',
  '보림사 방문 안내',
]
const SLIDE_BASE = 'https://k-buddhism.vercel.app/images'
const INFOGRAPHIC_URL = 'https://k-buddhism.vercel.app/images/Zen_history.png'

function SlidesPanel() {
  const [idx, setIdx] = useState(0)
  const total = SLIDE_TITLES.length
  const prev = () => setIdx(i => (i - 1 + total) % total)
  const next = () => setIdx(i => (i + 1) % total)

  return (
    <div style={{ marginTop: 32 }}>
      <div className="slide-viewer" style={{ borderRadius: 8, overflow: 'hidden', background: '#1a1a18', boxShadow: '0 8px 40px rgba(0,0,0,.15)' }}>
        <div style={{ position: 'relative', width: '100%', aspectRatio: '4/3', overflow: 'hidden', background: '#1a1a18' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${SLIDE_BASE}/slide-${String(idx + 1).padStart(2, '0')}.jpg`}
            alt={SLIDE_TITLES[idx]}
            style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
          />
        </div>
        {/* 점 네비게이션 */}
        <div style={{ display: 'flex', gap: 5, justifyContent: 'center', padding: 8, background: '#1a1a18' }}>
          {SLIDE_TITLES.map((_, i) => (
            <span
              key={i}
              onClick={() => setIdx(i)}
              style={{
                width: i === idx ? 22 : 7, height: 7, borderRadius: i === idx ? 4 : '50%',
                background: i === idx ? 'var(--color-gold, #9B8654)' : 'rgba(255,255,255,.2)',
                cursor: 'pointer', transition: '.3s', display: 'inline-block',
              }}
            />
          ))}
        </div>
        {/* 컨트롤 */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', background: '#1a1a18', borderTop: '1px solid rgba(255,255,255,.08)' }}>
          <button onClick={prev} style={{ color: '#fff', fontSize: '.82rem', fontWeight: 500, padding: '7px 18px', borderRadius: 20, border: '1px solid rgba(255,255,255,.2)', background: 'none', cursor: 'pointer' }}>← 이전</button>
          <span style={{ color: 'rgba(255,255,255,.6)', fontSize: '.78rem' }}>{idx + 1} / {total}</span>
          <button onClick={next} style={{ color: '#fff', fontSize: '.82rem', fontWeight: 500, padding: '7px 18px', borderRadius: 20, border: '1px solid rgba(255,255,255,.2)', background: 'none', cursor: 'pointer' }}>다음 →</button>
        </div>
      </div>
      <p style={{ marginTop: 16, fontSize: '.82rem', color: 'var(--color-text-light, #6B6560)', textAlign: 'center' }}>
        ※ 보림사 소개 슬라이드 (NotebookLM 생성 자료 기반 14페이지)
      </p>
    </div>
  )
}

function InfographicPanel() {
  const [lightbox, setLightbox] = useState(false)
  return (
    <div style={{ marginTop: 48, textAlign: 'center' }}>
      <div style={{ background: 'var(--color-card, #FDFBF7)', border: '1px solid var(--color-border, #D4CEC4)', borderRadius: 16, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,.1)', display: 'inline-block', maxWidth: '100%' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={INFOGRAPHIC_URL}
          alt="한국 선종의 역사적 기원 인포그래픽"
          style={{ width: '100%', maxWidth: 1200, cursor: 'zoom-in', display: 'block' }}
          onClick={() => setLightbox(true)}
        />
        <div style={{ padding: '20px 28px', textAlign: 'left', borderTop: '1px solid var(--color-border, #D4CEC4)' }}>
          <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1rem', fontWeight: 700, color: 'var(--color-dark, #1A1A18)', marginBottom: 4 }}>
            한국 선종의 종가(宗家), 장흥 보림사 — 인포그래픽
          </h4>
          <p style={{ fontSize: '.82rem', color: 'var(--color-text-light, #6B6560)' }}>
            한국 선종의 역사적 기원과 천년을 건너온 국보급 문화유산을 한눈에 살펴보세요. (클릭하면 확대됩니다)
          </p>
        </div>
      </div>
      {lightbox && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 2000, background: 'rgba(0,0,0,.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, cursor: 'zoom-out' }}
          onClick={() => setLightbox(false)}
        >
          <button style={{ position: 'absolute', top: 20, right: 24, color: '#fff', fontSize: '1.5rem', background: 'none', border: 'none', cursor: 'pointer', padding: 8 }} onClick={() => setLightbox(false)}>✕</button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={INFOGRAPHIC_URL} alt="인포그래픽 확대" style={{ maxWidth: '95vw', maxHeight: '90vh', objectFit: 'contain', borderRadius: 8 }} onClick={e => e.stopPropagation()} />
        </div>
      )}
    </div>
  )
}

export default function QABlock({ temple, config }: Props) {
  const [tab, setTab] = useState<'faq' | 'quiz' | 'slides' | 'infographic'>('faq')

  const faqItems: FaqItem[] = Array.isArray(config.faqItems) && (config.faqItems as FaqItem[]).length > 0
    ? (config.faqItems as FaqItem[])
    : BORIMSA_FAQ

  const quizItems: QuizItem[] = Array.isArray(config.quizItems) && (config.quizItems as QuizItem[]).length > 0
    ? (config.quizItems as QuizItem[])
    : BORIMSA_QUIZ

  const TABS = [
    { key: 'faq'          as const, label: '📋 FAQ 리포트' },
    { key: 'quiz'         as const, label: '🧩 문화유산 퀴즈' },
    { key: 'slides'       as const, label: '🖼 슬라이드' },
    { key: 'infographic'  as const, label: '📊 인포그래픽' },
  ]

  return (
    <section id="components" className="bt-section">
      <div className="bt-section-inner" style={{ maxWidth: 900 }}>
        <span className="bt-section-label">Learning &amp; Explore</span>
        <h2 className="bt-section-title">
          {typeof config.sectionTitle === 'string' ? config.sectionTitle : `${temple.name} 학습관`}
        </h2>
        {typeof config.sectionDesc === 'string' && (
          <p className="bt-section-desc">{config.sectionDesc}</p>
        )}

        <div className="bt-comp-tabs" id="compTabs">
          {TABS.map(t => (
            <button
              key={t.key}
              className={`bt-comp-tab${tab === t.key ? ' active' : ''}`}
              onClick={() => setTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'faq'         && <FaqPanel         items={faqItems} />}
        {tab === 'quiz'        && <QuizPanel        items={quizItems} />}
        {tab === 'slides'      && <SlidesPanel />}
        {tab === 'infographic' && <InfographicPanel />}
      </div>
    </section>
  )
}
