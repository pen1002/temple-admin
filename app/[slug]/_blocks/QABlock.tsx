// QA-01: FAQ·퀴즈 학습관 (탭 패널)
'use client'
import { useState } from 'react'
import type { TempleData } from './types'

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

function FaqPanel({ items, primary }: { items: FaqItem[]; primary: string }) {
  const [open, setOpen] = useState<number | null>(null)
  return (
    <div style={{ marginTop: 24 }}>
      {items.map((item, i) => (
        <div key={i} style={{ borderBottom: '1px solid #D4CEC4' }}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            style={{
              width: '100%', textAlign: 'left', padding: '18px 0',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: '.92rem', fontWeight: 600, color: open === i ? primary : '#2E2B26',
              lineHeight: 1.5,
            }}
          >
            <span style={{ paddingRight: 16 }}>{item.q}</span>
            <span style={{ flexShrink: 0, color: primary, fontSize: '1.1rem', transition: '.3s', transform: open === i ? 'rotate(180deg)' : 'none' }}>▾</span>
          </button>
          {open === i && (
            <div style={{ padding: '4px 0 20px', fontSize: '.88rem', color: '#6B6560', lineHeight: 1.8 }}>
              {item.a}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function QuizPanel({ items, primary }: { items: QuizItem[]; primary: string }) {
  const [idx, setIdx] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const item = items[idx]
  const correct = selected === item.ans

  return (
    <div style={{ marginTop: 24, maxWidth: 640 }}>
      <p style={{ fontSize: '.78rem', color: '#9B8654', fontWeight: 600, marginBottom: 12 }}>
        문제 {idx + 1} / {items.length}
      </p>
      <p style={{ fontSize: '.97rem', fontWeight: 700, color: '#1A1A18', marginBottom: 20, lineHeight: 1.6 }}>
        {item.q}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
        {item.opts.map((opt, i) => {
          let bg = '#FDFBF7'
          let border = '#D4CEC4'
          let color = '#2E2B26'
          if (selected !== null) {
            if (i === item.ans) { bg = '#e8f5e9'; border = '#4CAF50'; color = '#1b5e20' }
            else if (i === selected) { bg = '#ffeaea'; border = '#f44336'; color = '#b71c1c' }
          }
          return (
            <button
              key={i}
              disabled={selected !== null}
              onClick={() => setSelected(i)}
              style={{
                textAlign: 'left', padding: '12px 18px',
                background: bg, border: `1.5px solid ${border}`, color,
                borderRadius: 8, cursor: selected !== null ? 'default' : 'pointer',
                fontSize: '.88rem', lineHeight: 1.5, transition: '.2s',
              }}
            >
              {i + 1}. {opt}
            </button>
          )
        })}
      </div>
      {selected !== null && (
        <div style={{ padding: '14px 18px', background: correct ? '#e8f5e9' : '#fff3e0', borderRadius: 8, marginBottom: 20 }}>
          <p style={{ fontWeight: 700, color: correct ? '#2e7d32' : '#e65100', marginBottom: 6 }}>
            {correct ? '✓ 정답입니다!' : '✗ 틀렸습니다.'}
          </p>
          <p style={{ fontSize: '.85rem', color: '#555', lineHeight: 1.7 }}>{item.explain}</p>
        </div>
      )}
      <div style={{ display: 'flex', gap: 10 }}>
        {selected !== null && idx < items.length - 1 && (
          <button
            onClick={() => { setIdx(idx + 1); setSelected(null) }}
            style={{ padding: '10px 24px', background: primary, color: '#fff', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '.88rem' }}
          >
            다음 문제 →
          </button>
        )}
        {selected !== null && idx === items.length - 1 && (
          <button
            onClick={() => { setIdx(0); setSelected(null) }}
            style={{ padding: '10px 24px', background: '#9B8654', color: '#fff', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '.88rem' }}
          >
            처음부터 다시
          </button>
        )}
      </div>
    </div>
  )
}

export default function QABlock({ temple, config }: Props) {
  const [tab, setTab] = useState<'faq' | 'quiz'>('faq')
  const primary = temple.primaryColor ?? '#8B2500'

  const faqItems: FaqItem[] = Array.isArray(config.faqItems) && (config.faqItems as FaqItem[]).length > 0
    ? (config.faqItems as FaqItem[])
    : BORIMSA_FAQ

  const quizItems: QuizItem[] = Array.isArray(config.quizItems) && (config.quizItems as QuizItem[]).length > 0
    ? (config.quizItems as QuizItem[])
    : BORIMSA_QUIZ

  const TABS = [
    { key: 'faq' as const,  label: '📋 FAQ 리포트' },
    { key: 'quiz' as const, label: '🧩 문화유산 퀴즈' },
  ]

  return (
    <section
      id="qa"
      style={{ background: '#F5F0E8', padding: '80px 24px' }}
    >
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        {/* 헤더 */}
        <p style={{ fontSize: '.75rem', fontWeight: 700, letterSpacing: '.12em', color: '#9B8654', marginBottom: 12, textTransform: 'uppercase' }}>
          Learning & Explore
        </p>
        <h2 style={{ fontFamily: "'Noto Serif KR', serif", fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 700, color: '#1A1A18', marginBottom: 12, lineHeight: 1.4 }}>
          {typeof config.sectionTitle === 'string' ? config.sectionTitle : `${temple.name} 학습관`}
        </h2>
        {typeof config.sectionDesc === 'string' && (
          <p style={{ fontSize: '.92rem', color: '#6B6560', marginBottom: 36 }}>
            {config.sectionDesc}
          </p>
        )}

        {/* 탭 */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              style={{
                padding: '10px 22px',
                background: tab === t.key ? primary : '#FDFBF7',
                color: tab === t.key ? '#fff' : '#6B6560',
                border: `1.5px solid ${tab === t.key ? primary : '#D4CEC4'}`,
                borderRadius: 24,
                fontWeight: 600,
                fontSize: '.84rem',
                cursor: 'pointer',
                transition: '.2s',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'faq'  && <FaqPanel  items={faqItems}  primary={primary} />}
        {tab === 'quiz' && <QuizPanel items={quizItems} primary={primary} />}
      </div>
    </section>
  )
}
