// DR 사찰자료관 시리즈 — 아이콘 그리드 타일형 (DR-01~09)
// 우선 개발: DR-05(보고서)·DR-07(퀴즈)·DR-08(인포그래픽)
// 나머지 6개: '준비 중' 뱃지 표시
import type { TempleData } from '../types'

interface ArchiveInfo {
  icon:     string
  name:     string
  desc:     string          // 40자 이내 설명
  category: string
  ready:    boolean
  color:    [string, string] // gradient
}

const ARCHIVE_MAP: Record<string, ArchiveInfo> = {
  'DR-01': { icon: '📜', name: '창건 연혁',         desc: '사찰 창건부터 현재까지 역사 기록 아카이브',   category: '역사', ready: false, color: ['#5B4A3F', '#7B6A5F'] },
  'DR-02': { icon: '🗺️', name: '문화재 지도',        desc: '국보·보물 등 지정문화재 위치 지도',           category: '문화재', ready: false, color: ['#2D5016', '#3D6B20'] },
  'DR-03': { icon: '📷', name: '사진 아카이브',      desc: '사찰 주요 행사 및 풍경 역대 사진 자료',       category: '미디어', ready: false, color: ['#1B3A6B', '#2A5080'] },
  'DR-04': { icon: '🎵', name: '범패·의식 음원',     desc: '전통 불교 의식 음악 및 범패 음원 자료',       category: '음악', ready: false, color: ['#6B2D8E', '#8B4DAE'] },
  'DR-05': { icon: '📊', name: '사찰 보고서',        desc: '연간 사업 보고서 및 신도 현황 통계 자료',     category: '보고서', ready: true,  color: ['#1B4332', '#2D6A4F'] },
  'DR-06': { icon: '📖', name: '경전 자료',          desc: '주요 경전 및 의식문 PDF 다운로드',           category: '경전', ready: false, color: ['#4A3500', '#7B5A00'] },
  'DR-07': { icon: '🧩', name: '불교 상식 퀴즈',     desc: '재미있게 배우는 불교 기초 상식 퀴즈 모음',    category: '교육', ready: true,  color: ['#8B0000', '#B22222'] },
  'DR-08': { icon: '🎨', name: '불교 인포그래픽',    desc: '불교 교리와 의식을 쉽게 설명하는 그래픽 자료', category: '교육', ready: true,  color: ['#5B2D8E', '#7B4DAE'] },
  'DR-09': { icon: '🏛️', name: '가람 배치 도면',     desc: '사찰 전각 배치 평면도 및 3D 조감도 자료',    category: '건축', ready: false, color: ['#4A4A2A', '#6A6A3A'] },
}

interface Props { blockType: string; temple: TempleData; config: Record<string, unknown> }

// 단일 타일 렌더러
function ArchiveTile({ code, info, primary }: { code: string; info: ArchiveInfo; primary: string }) {
  const [c1, c2] = info.color

  if (!info.ready) {
    return (
      <div style={{
        background: '#f5f0ea', border: '1px solid #e0d8cc',
        borderRadius: 16, padding: '24px 16px', textAlign: 'center',
        position: 'relative', overflow: 'hidden',
        opacity: 0.65,
      }}>
        {/* 준비 중 뱃지 */}
        <span style={{
          position: 'absolute', top: 10, right: 10,
          fontSize: '.58rem', fontWeight: 700,
          background: '#c8b8a2', color: '#6a5a4a',
          padding: '2px 8px', borderRadius: 10,
          letterSpacing: '.06em',
        }}>
          준비 중
        </span>
        <div style={{
          width: 52, height: 52, borderRadius: 14, margin: '0 auto 12px',
          background: `linear-gradient(135deg, ${c1}40, ${c2}40)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.6rem',
        }}>
          {info.icon}
        </div>
        <p style={{ fontSize: '.75rem', fontWeight: 700, color: '#8a7a6a', marginBottom: 4 }}>{info.name}</p>
        <span style={{
          fontSize: '.62rem', background: '#e8e0d8', color: '#9a8a7a',
          padding: '2px 8px', borderRadius: 10,
        }}>
          {info.category}
        </span>
      </div>
    )
  }

  return (
    <div style={{
      background: '#fff', borderRadius: 16, overflow: 'hidden',
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      border: '1px solid rgba(0,0,0,0.06)',
      cursor: 'pointer',
      transition: 'transform .15s, box-shadow .15s',
    }}>
      {/* 컬러 헤더 */}
      <div style={{
        background: `linear-gradient(135deg, ${c1}, ${c2})`,
        padding: '24px 16px 20px',
        textAlign: 'center', position: 'relative',
      }}>
        <div style={{
          width: 56, height: 56, borderRadius: 16, margin: '0 auto 8px',
          background: 'rgba(255,255,255,0.18)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.8rem',
        }}>
          {info.icon}
        </div>
        <span style={{
          fontSize: '.6rem', fontWeight: 700,
          background: 'rgba(255,255,255,0.25)', color: '#fff',
          padding: '2px 8px', borderRadius: 10, letterSpacing: '.06em',
        }}>
          {info.category}
        </span>
      </div>

      {/* 콘텐츠 */}
      <div style={{ padding: '16px' }}>
        <h3 style={{
          fontSize: '.88rem', fontWeight: 800,
          color: '#1a1008', marginBottom: 6, letterSpacing: '.01em',
        }}>
          {info.name}
        </h3>
        <p style={{
          fontSize: '.72rem', color: '#7a6a5a',
          lineHeight: 1.6, marginBottom: 14,
          wordBreak: 'keep-all',
        }}>
          {info.desc}
        </p>
        <a
          href={`#archive-${code.toLowerCase()}`}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
            fontSize: '.75rem', fontWeight: 700,
            color: c1, textDecoration: 'none',
            border: `1.5px solid ${c1}50`,
            borderRadius: 10, padding: '7px 0',
          }}
        >
          자료 보기 →
        </a>
      </div>
    </div>
  )
}

export default function ArchiveBlock({ blockType, temple, config }: Props) {
  const info = ARCHIVE_MAP[blockType]
  if (!info) return null

  const primary = temple.primaryColor || '#8B2500'
  const name    = (config.name as string) ?? info.name
  const desc    = (config.desc as string) ?? info.desc

  // 단일 블록 모드: 단일 DR 코드로 접근할 때
  return (
    <section id={`dr-${blockType}`} className="bt-section" style={{ background: 'var(--color-bg-alt, #faf7f2)' }}>
      <div className="bt-section-inner">
        <span className="bt-section-label">Archive</span>
        <h2 className="bt-section-title">{name}</h2>
        <p style={{
          textAlign: 'center', color: '#7a6a5a',
          fontSize: '.9rem', marginTop: 8, marginBottom: 40,
          wordBreak: 'keep-all',
        }}>
          {desc}
        </p>

        {/* 허니콤 그리드 — CSS grid로 벌집형 오프셋 구현 */}
        <div style={{
          maxWidth: 760, margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 16,
        }}>
          {Object.entries(ARCHIVE_MAP).map(([code, item], idx) => (
            <div
              key={code}
              style={{
                // 2번째 행 오프셋: 짝수 행을 반 칸 밀어서 벌집형 효과
                marginTop: Math.floor(idx / 3) % 2 === 1 ? -16 : 0,
                marginBottom: Math.floor(idx / 3) % 2 === 1 ? -16 : 0,
              }}
            >
              <ArchiveTile code={code} info={item} primary={primary} />
            </div>
          ))}
        </div>

        {/* 자료관 전체 보기 CTA */}
        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <a
            href="#archive"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '11px 28px', borderRadius: 50,
              border: `2px solid ${primary}`,
              color: primary, fontWeight: 700, fontSize: '.88rem',
              textDecoration: 'none', letterSpacing: '.04em',
            }}
          >
            자료관 전체 보기
          </a>
        </div>
      </div>
    </section>
  )
}
