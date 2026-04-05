// SEC06-01: 주지스님 인사말 (소개 + 사진 + 사찰 정보)
import type { TempleData } from './types'

interface InfoItem {
  label: string
  value: string
}

interface Props {
  temple: TempleData
  config: Record<string, unknown>
}

export default function AbbotGreetingBlock({ temple, config }: Props) {
  const abbotName = (config.abbotName as string) ?? temple.abbotName ?? '주지 스님'
  const message = config.message as string | undefined
  const imageUrl = (config.imageUrl as string) ??
    'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Borimsa_Daeungjeon_11-05025.JPG/800px-Borimsa_Daeungjeon_11-05025.JPG'
  const quoteText = config.quoteText as string | undefined
  const quoteAuthor = config.quoteAuthor as string | undefined

  // aboutExtra: 단락 배열 or 단일 문자열
  const paragraphs: string[] =
    Array.isArray(config.aboutExtra)
      ? (config.aboutExtra as string[])
      : message
        ? [message]
        : temple.description
          ? [temple.description]
          : []

  // 사찰 정보 표 (aboutInfoExtra or 기본값)
  const infoItems: InfoItem[] = Array.isArray(config.aboutInfoExtra)
    ? (config.aboutInfoExtra as [string, string][]).map(([label, value]) => ({ label, value }))
    : [
        { label: '종단', value: '대한불교 조계종' },
        { label: '창건', value: temple.foundedYear ? `${temple.foundedYear}년` : '통일신라' },
        { label: '주지', value: abbotName },
        { label: '소재지', value: temple.address ?? '' },
      ]

  const primary = temple.primaryColor ?? '#8B2500'

  return (
    <section
      id="intro"
      style={{ background: '#F5F0E8', padding: '80px 24px' }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* 섹션 레이블 */}
        <p style={{ fontSize: '.75rem', fontWeight: 700, letterSpacing: '.12em', color: primary, marginBottom: 12, textTransform: 'uppercase' }}>
          About Temple
        </p>
        <h2 style={{ fontFamily: "'Noto Serif KR', serif", fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 700, color: '#1A1A18', marginBottom: 48, lineHeight: 1.4 }}>
          가지산 품 안에서 천년을 이어온 선종의 성지
        </h2>

        {/* 2단 레이아웃 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 60, alignItems: 'center' }}>
          {/* 텍스트 */}
          <div>
            {paragraphs.map((p, i) => (
              <p key={i} style={{ marginBottom: 20, fontSize: '.95rem', lineHeight: 1.9, color: '#2E2B26' }}>
                {p}
              </p>
            ))}

            {/* 인용구 */}
            {quoteText && (
              <blockquote style={{
                borderLeft: `3px solid ${primary}`,
                padding: '12px 20px',
                margin: '24px 0',
                background: 'rgba(139,37,0,.04)',
                borderRadius: '0 8px 8px 0',
                fontFamily: "'Noto Serif KR', serif",
                fontStyle: 'italic',
                color: '#1A1A18',
                fontSize: '.95rem',
                lineHeight: 1.8,
              }}>
                {quoteText}
                {quoteAuthor && (
                  <cite style={{ display: 'block', marginTop: 8, fontSize: '.8rem', fontStyle: 'normal', color: '#6B6560' }}>
                    {quoteAuthor}
                  </cite>
                )}
              </blockquote>
            )}

            {/* 정보 그리드 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 28 }}>
              {infoItems.filter(i => i.value).map(({ label, value }) => (
                <div key={label} style={{ background: '#EDE7DB', padding: '14px 16px', borderRadius: 8 }}>
                  <dt style={{ fontSize: '.7rem', fontWeight: 700, color: primary, letterSpacing: '.08em', marginBottom: 4 }}>
                    {label}
                  </dt>
                  <dd style={{ fontSize: '.88rem', fontWeight: 600, color: '#1A1A18', margin: 0 }}>
                    {value}
                  </dd>
                </div>
              ))}
            </div>
          </div>

          {/* 이미지 */}
          <div>
            <img
              src={imageUrl}
              alt={`${temple.name} 전경`}
              style={{ width: '100%', borderRadius: 16, boxShadow: '0 8px 40px rgba(0,0,0,.15)', display: 'block' }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
