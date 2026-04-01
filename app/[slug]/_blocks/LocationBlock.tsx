// V-01: 오시는 길
import type { TempleData } from './types'

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
    <section
      id="location"
      className="px-5 py-12"
      style={{ background: '#FFF8E7' }}
    >
      <div className="max-w-xl mx-auto">
        {/* 섹션 헤더 */}
        <div className="flex items-center gap-2 mb-6">
          <span className="text-2xl">📍</span>
          <h2 className="font-bold text-xl" style={{ color: '#2C1810' }}>오시는 길</h2>
          <div className="flex-1 h-px ml-2" style={{ background: '#D4AF37', opacity: 0.4 }} />
        </div>

        <div className="space-y-3">
          {/* 주소 */}
          {address && (
            <div
              className="rounded-2xl p-5"
              style={{ background: '#fff', border: '1px solid #e8dcc8' }}
            >
              <p className="text-sm font-semibold mb-1.5" style={{ color: '#8B6914' }}>주소</p>
              <p className="text-base font-medium" style={{ color: '#2C1810' }}>{address}</p>
            </div>
          )}

          {/* 연락처 */}
          {temple.phone && (
            <div
              className="rounded-2xl p-5"
              style={{ background: '#fff', border: '1px solid #e8dcc8' }}
            >
              <p className="text-sm font-semibold mb-1.5" style={{ color: '#8B6914' }}>전화</p>
              <a
                href={`tel:${temple.phone}`}
                className="text-base font-medium active:opacity-70"
                style={{ color: '#2C1810' }}
              >
                📞 {temple.phone}
              </a>
            </div>
          )}

          {/* 교통 정보 */}
          {(transport || bus) && (
            <div
              className="rounded-2xl p-5"
              style={{ background: '#fff', border: '1px solid #e8dcc8' }}
            >
              <p className="text-sm font-semibold mb-1.5" style={{ color: '#8B6914' }}>교통</p>
              {transport && <p className="text-base mb-1" style={{ color: '#2C1810' }}>🚌 {transport}</p>}
              {bus && <p className="text-base" style={{ color: '#2C1810' }}>🚍 {bus}</p>}
            </div>
          )}

          {/* 주차 */}
          {parking && (
            <div
              className="rounded-2xl p-5"
              style={{ background: '#fff', border: '1px solid #e8dcc8' }}
            >
              <p className="text-sm font-semibold mb-1.5" style={{ color: '#8B6914' }}>주차</p>
              <p className="text-base" style={{ color: '#2C1810' }}>🅿 {parking}</p>
            </div>
          )}

          {/* 지도 버튼 */}
          <div className="flex gap-3 pt-1">
            <a
              href={naverMapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-4 rounded-2xl font-bold text-base text-center active:opacity-70"
              style={{ background: '#03C75A', color: '#fff' }}
            >
              네이버 지도
            </a>
            <a
              href={kakaoMapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-4 rounded-2xl font-bold text-base text-center active:opacity-70"
              style={{ background: '#FEE500', color: '#191919' }}
            >
              카카오 지도
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
