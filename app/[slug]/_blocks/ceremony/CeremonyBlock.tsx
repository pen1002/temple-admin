// BH 법회 시리즈 — 세로 타임라인 카드형 (음력 날짜 좌측 강조)
import type { TempleData } from '../types'

interface CeremonyInfo {
  icon: string
  name: string
  schedule: string
  desc: string
  category: 'SEASONAL' | 'MONTHLY' | 'REGULAR'
}

const CEREMONY_MAP: Record<string, CeremonyInfo> = {
  'BH-01': { icon: '🪷', name: '부처님오신날 봉축법회', schedule: '음력 4월 8일',   desc: '음력 4월 8일 부처님오신날 봉축 법요식 안내',       category: 'SEASONAL' },
  'BH-02': { icon: '☸️', name: '성도재일법회',          schedule: '음력 12월 8일',  desc: '음력 12월 8일 부처님 성도일을 기리는 법회',        category: 'SEASONAL' },
  'BH-03': { icon: '🏔️', name: '출가재일법회',          schedule: '음력 2월 8일',   desc: '음력 2월 8일 부처님 출가일 기념 정진 법회',        category: 'SEASONAL' },
  'BH-04': { icon: '🕯️', name: '열반재일법회',          schedule: '음력 2월 15일',  desc: '음력 2월 15일 부처님 열반일을 추모하는 법회',      category: 'SEASONAL' },
  'BH-05': { icon: '🌑', name: '초하루법회',            schedule: '매월 음력 1일',  desc: '매월 음력 1일 새달을 여는 정기 초하루 법회',       category: 'MONTHLY'  },
  'BH-06': { icon: '🌕', name: '보름법회',              schedule: '매월 음력 15일', desc: '매월 음력 15일 보름달 아래 드리는 정기 법회',      category: 'MONTHLY'  },
  'BH-07': { icon: '🌸', name: '관음재일법회',          schedule: '매월 음력 24일', desc: '매월 음력 24일 관세음보살 재일 기도 법회',         category: 'MONTHLY'  },
  'BH-08': { icon: '🪔', name: '지장재일법회',          schedule: '매월 음력 18일', desc: '매월 음력 18일 지장보살 재일 기도 법회',           category: 'MONTHLY'  },
  'BH-09': { icon: '🙏', name: '일요법회',              schedule: '매주 일요일',    desc: '매주 일요일 신도 대상 정기 일요 법회',             category: 'REGULAR'  },
}

const CAT = {
  SEASONAL: { label: '봉축·재일', bg: '#ED8936', light: '#FFF3E0' },
  MONTHLY:  { label: '정기법회', bg: '#C9A84C', light: '#FFFDE7' },
  REGULAR:  { label: '상시법회', bg: '#38B2AC', light: '#E0F7FA' },
}

interface Props { blockType: string; temple: TempleData; config: Record<string, unknown> }

export default function CeremonyBlock({ blockType, temple, config }: Props) {
  const info = CEREMONY_MAP[blockType]
  if (!info) return null

  const primary  = temple.primaryColor || '#8B2500'
  const cat      = CAT[info.category]
  const name     = (config.name     as string) ?? info.name
  const schedule = (config.schedule as string) ?? info.schedule
  const desc     = (config.desc     as string) ?? info.desc
  const icon     = (config.icon     as string) ?? info.icon
  const ctaText  = (config.ctaText  as string) ?? '법회 안내 보기'
  const ctaHref  = (config.ctaHref  as string) ?? '#ceremony'

  return (
    <section id={`bh-${blockType}`} className="bt-section" style={{ background: 'var(--color-bg-alt, #FFF8E7)' }}>
      <div className="bt-section-inner">
        <span className="bt-section-label">Ceremony</span>
        <h2 className="bt-section-title">{name}</h2>

        <div style={{
          maxWidth: 680, margin: '40px auto 0',
          display: 'flex', gap: 0,
          background: '#fff', borderRadius: 20, overflow: 'hidden',
          boxShadow: '0 6px 32px rgba(0,0,0,0.10)',
          border: `1px solid ${primary}22`,
        }}>
          {/* 좌측: 음력 날짜 뱃지 */}
          <div style={{
            flexShrink: 0, width: 110,
            background: `linear-gradient(160deg, ${primary}, ${primary}bb)`,
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', padding: '32px 10px', gap: 10,
          }}>
            <span style={{ fontSize: '2.4rem', lineHeight: 1 }}>{icon}</span>
            <p style={{
              fontSize: '.65rem', fontWeight: 700, color: 'rgba(255,255,255,0.9)',
              textAlign: 'center', letterSpacing: '.05em', wordBreak: 'keep-all',
              lineHeight: 1.5, padding: '4px 6px', background: 'rgba(0,0,0,0.15)',
              borderRadius: 8,
            }}>
              {schedule}
            </p>
          </div>

          {/* 우측: 콘텐츠 */}
          <div style={{ flex: 1, padding: '28px 24px 24px' }}>
            <span style={{
              display: 'inline-block', fontSize: '.65rem', fontWeight: 700,
              padding: '3px 10px', borderRadius: 20,
              background: cat.light, color: cat.bg, marginBottom: 12,
              letterSpacing: '.06em',
            }}>
              {cat.label}
            </span>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1a1008', marginBottom: 10, letterSpacing: '.01em' }}>
              {name}
            </h3>
            <p style={{ fontSize: '.9rem', lineHeight: 1.75, color: '#5a4a35', marginBottom: 20, wordBreak: 'keep-all' }}>
              {desc}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <a href={ctaHref} style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                fontSize: '.82rem', fontWeight: 700, color: '#fff',
                textDecoration: 'none', background: primary,
                padding: '8px 18px', borderRadius: 20,
              }}>
                {ctaText} →
              </a>
              {/* 타임라인 점선 */}
              <div style={{ width: 60, height: 2, background: `${primary}30`, borderRadius: 2 }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
