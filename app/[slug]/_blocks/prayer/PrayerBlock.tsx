// PR 기도·불공 시리즈 — 그라데이션 원형 아이콘 카드형 (PR-01~12)
import type { TempleData } from '../types'

type PrayerCategory = 'LONG' | 'JESA' | 'SEASONAL' | 'OTHER'

interface PrayerInfo {
  icon: string
  name: string
  period: string
  duration: string
  desc: string
  category: PrayerCategory
}

const PRAYER_MAP: Record<string, PrayerInfo> = {
  'PR-01': { icon: '💡', name: '인등기도',         period: '상시 접수',      duration: '',       desc: '소원을 담은 연등을 봉헌하며 발원하는 기도',       category: 'OTHER'    },
  'PR-02': { icon: '🙏', name: '백일기도',         period: '100일 정진',     duration: '100일',  desc: '100일간 매일 새벽 정진하는 발원 기도',            category: 'LONG'     },
  'PR-03': { icon: '📿', name: '1년기도',          period: '365일 발원',     duration: '365일',  desc: '한 해 365일 하루도 빠짐없이 정진하는 기도',       category: 'LONG'     },
  'PR-04': { icon: '⛰️', name: '천일기도',         period: '1,000일 서원',   duration: '1,000일',desc: '1,000일 서원으로 드리는 장기 정진 기도',          category: 'LONG'     },
  'PR-05': { icon: '📚', name: '수험생정진기도',    period: '시험 합격 발원', duration: '',       desc: '수험생 합격을 발원하는 특별 정진 기도',           category: 'OTHER'    },
  'PR-06': { icon: '🕯️', name: '49재',             period: '49일 천도 의식', duration: '49일',   desc: '돌아가신 분의 극락왕생을 위한 49일 재',           category: 'JESA'     },
  'PR-07': { icon: '🪷', name: '천도재',           period: '영가 극락왕생',  duration: '',       desc: '영가의 극락왕생을 기원하는 천도 의식',            category: 'JESA'     },
  'PR-08': { icon: '🌅', name: '정초기도',         period: '새해 첫 발원',   duration: '',       desc: '새해 첫날 한 해의 안녕을 발원하는 기도',          category: 'SEASONAL' },
  'PR-09': { icon: '🏔️', name: '산신기도',         period: '전통 산신 의식', duration: '',       desc: '산신께 올리는 전통 산신 기도 의식',               category: 'OTHER'    },
  'PR-10': { icon: '🌿', name: '기제사',           period: '기일 추모 제사', duration: '',       desc: '기일에 영가를 추모하는 제사 의식',                category: 'JESA'     },
  'PR-11': { icon: '❄️', name: '동지기도',         period: '동짓날 액막이',  duration: '',       desc: '동짓날 팥죽 올리며 액막이 발원하는 기도',         category: 'SEASONAL' },
  'PR-12': { icon: '🌾', name: '백중기도',         period: '음력 7월 15일',  duration: '',       desc: '음력 7월 15일 백중 영가 천도 기도',               category: 'SEASONAL' },
}

const GRAD: Record<PrayerCategory, [string, string]> = {
  LONG:     ['#553C9A', '#2B6CB0'],
  JESA:     ['#4A5568', '#2D3748'],
  SEASONAL: ['#38A169', '#2C7A7B'],
  OTHER:    ['#B7791F', '#C05621'],
}

interface Props { blockType: string; temple: TempleData; config: Record<string, unknown> }

export default function PrayerBlock({ blockType, temple, config }: Props) {
  const info = PRAYER_MAP[blockType]
  if (!info) return null

  const primary  = temple.primaryColor || '#8B2500'
  const [g1, g2] = GRAD[info.category]
  const name     = (config.name    as string) ?? info.name
  const period   = (config.period  as string) ?? info.period
  const duration = (config.duration as string) ?? info.duration
  const desc     = (config.desc    as string) ?? info.desc
  const icon     = (config.icon    as string) ?? info.icon
  const ctaText  = (config.ctaText as string) ?? '동참하기'
  const ctaHref  = (config.ctaHref as string) ?? '#prayer'

  return (
    <section id={`pr-${blockType}`} className="bt-section" style={{ background: 'var(--color-bg, #0d0a06)' }}>
      <div className="bt-section-inner">
        <span className="bt-section-label">Prayer</span>
        <h2 className="bt-section-title" style={{ color: '#f0dfa0' }}>{name}</h2>

        <div style={{
          maxWidth: 540, margin: '40px auto 0',
          background: `linear-gradient(145deg, #1a1008, #2a1f10)`,
          borderRadius: 24, overflow: 'hidden',
          boxShadow: '0 8px 40px rgba(0,0,0,0.45)',
          border: '1px solid rgba(201,168,76,0.2)',
        }}>
          {/* 상단: 원형 아이콘 */}
          <div style={{ padding: '36px 24px 24px', textAlign: 'center' }}>
            <div style={{
              width: 88, height: 88, borderRadius: '50%', margin: '0 auto 16px',
              background: `linear-gradient(135deg, ${g1}, ${g2})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '2.6rem', boxShadow: `0 4px 20px ${g1}60`,
            }}>
              {icon}
            </div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#f0dfa0', letterSpacing: '.02em', marginBottom: 8 }}>
              {name}
            </h3>
            {/* 기간 뱃지 */}
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '.72rem', fontWeight: 700, padding: '4px 12px', borderRadius: 20, background: `${g1}40`, color: '#f0dfa0', border: `1px solid ${g1}60` }}>
                {period}
              </span>
              {duration && (
                <span style={{ fontSize: '.72rem', fontWeight: 800, padding: '4px 12px', borderRadius: 20, background: '#c9a84c', color: '#1a0f00' }}>
                  {duration}
                </span>
              )}
            </div>
          </div>

          {/* 중단: 설명 */}
          <div style={{ padding: '0 28px 28px' }}>
            <p style={{ fontSize: '.9rem', lineHeight: 1.8, color: 'rgba(240,223,160,0.75)', textAlign: 'center', marginBottom: 24, wordBreak: 'keep-all' }}>
              {desc}
            </p>
            <a href={ctaHref} style={{
              display: 'block', textAlign: 'center',
              padding: '13px 0', borderRadius: 14, fontWeight: 700,
              fontSize: '.95rem', color: '#1a0f00',
              background: `linear-gradient(90deg, #c9a84c, #f0dfa0)`,
              textDecoration: 'none',
              boxShadow: '0 3px 12px rgba(201,168,76,0.35)',
            }}>
              {ctaText}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
