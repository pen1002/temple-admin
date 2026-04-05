// V-01: 오시는 길
import type { TempleData } from '../../types'

interface Props {
  temple: TempleData
  config: Record<string, unknown>
}

export default function LocationBlock({ temple, config }: Props) {
  const address   = (config.address   as string) || temple.address || ''
  const transport = (config.transport as string) || ''
  const bus       = (config.bus       as string) || ''
  const parking   = (config.parking   as string) || ''

  if (!address && !temple.address) return null

  const naverMapUrl = `https://map.naver.com/v5/search/${encodeURIComponent(temple.name + ' ' + address)}`
  const kakaoMapUrl = `https://map.kakao.com/?q=${encodeURIComponent(temple.name)}`

  return (
    <section id="location" className="bt-section">
      <div className="bt-section-inner">
        <span className="bt-section-label">Visit</span>
        <h2 className="bt-section-title">오시는 길</h2>

        <div className="bt-visit-layout">
          {/* 지도 플레이스홀더 */}
          <div className="bt-visit-map" />

          {/* 정보 */}
          <div className="bt-visit-info">
            {address && (
              <dl>
                <dt>주소</dt>
                <dd>{address}</dd>
              </dl>
            )}
            {temple.phone && (
              <dl>
                <dt>전화</dt>
                <dd>
                  <a href={`tel:${temple.phone}`}>{temple.phone}</a>
                </dd>
              </dl>
            )}
            {transport && (
              <dl>
                <dt>자가용</dt>
                <dd>{transport}</dd>
              </dl>
            )}
            {bus && (
              <dl>
                <dt>대중교통</dt>
                <dd>{bus}</dd>
              </dl>
            )}
            {parking && (
              <dl>
                <dt>주차</dt>
                <dd>{parking}</dd>
              </dl>
            )}

            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
              <a
                href={naverMapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bt-visit-btn bt-visit-btn-primary"
              >
                네이버 지도
              </a>
              <a
                href={kakaoMapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bt-visit-btn"
                style={{ background: '#FEE500', color: '#191919' }}
              >
                카카오 지도
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
