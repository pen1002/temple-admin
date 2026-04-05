// QB-01: 인용구 배너 (전폭 배경이미지 + 문구)
import type { TempleData } from './types'

interface Props {
  temple: TempleData
  config: Record<string, unknown>
}

export default function QuoteBannerBlock({ temple, config }: Props) {
  const heading = typeof config.heading === 'string'
    ? config.heading
    : '천년의 선(禪)이 건네는 위로'
  const subtext = typeof config.subtext === 'string'
    ? config.subtext
    : '혁신의 산실에서 영혼의 안식처로 — 가지산 보림사'

  return (
    <div className="bt-quote-banner">
      <h2>{heading}</h2>
      <p>{subtext}</p>
    </div>
  )
}
