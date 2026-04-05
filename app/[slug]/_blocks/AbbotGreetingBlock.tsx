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

  const paragraphs: string[] =
    Array.isArray(config.aboutExtra)
      ? (config.aboutExtra as string[])
      : message
        ? [message]
        : temple.description
          ? [temple.description]
          : []

  const infoItems: InfoItem[] = Array.isArray(config.aboutInfoExtra)
    ? (config.aboutInfoExtra as [string, string][]).map(([label, value]) => ({ label, value }))
    : [
        { label: '종단', value: '대한불교 조계종' },
        { label: '창건', value: temple.foundedYear ? `${temple.foundedYear}년` : '통일신라' },
        { label: '주지', value: abbotName },
        { label: '소재지', value: temple.address ?? '' },
      ]

  return (
    <section id="intro" className="bt-section">
      <div className="bt-section-inner">
        <span className="bt-section-label">About Temple</span>
        <h2 className="bt-section-title">가지산 품 안에서 천년을 이어온 선종의 성지</h2>

        <div className="bt-about-layout">
          {/* 텍스트 */}
          <div className="bt-about-text">
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}

            {quoteText && (
              <blockquote>
                {quoteText}
                {quoteAuthor && <cite>{quoteAuthor}</cite>}
              </blockquote>
            )}

            <dl className="bt-about-info">
              {infoItems.filter(i => i.value).map(({ label, value }) => (
                <div key={label} className="bt-about-info-item">
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* 이미지 */}
          <div className="bt-about-images">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imageUrl} alt={`${temple.name} 전경`} />
          </div>
        </div>
      </div>
    </section>
  )
}
