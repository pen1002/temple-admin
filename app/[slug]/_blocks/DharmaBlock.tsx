// D-01: 오늘의 법문
import type { DharmaData, TempleData } from './types'

interface Props {
  dharma: DharmaData
  temple: TempleData
}

export default function DharmaBlock({ dharma, temple }: Props) {
  if (!dharma.text) return null

  return (
    <section
      className="px-5 py-14"
      style={{ background: '#FFF8E7' }}
    >
      <div className="max-w-xl mx-auto">
        {/* 섹션 헤더 */}
        <div className="flex items-center gap-2 mb-8">
          <span className="text-2xl">🪷</span>
          <h2 className="font-bold text-xl" style={{ color: '#2C1810' }}>오늘의 법문</h2>
          <div className="flex-1 h-px ml-2" style={{ background: '#D4AF37', opacity: 0.4 }} />
        </div>

        {/* 법문 카드 */}
        <div
          className="rounded-3xl p-8 relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${temple.primaryColor}12, ${temple.primaryColor}06)`,
            border: `1px solid ${temple.primaryColor}30`,
          }}
        >
          {/* 장식 따옴표 */}
          <div
            className="absolute top-4 left-5 text-7xl font-serif leading-none select-none"
            style={{ color: '#D4AF37', opacity: 0.15 }}
          >
            "
          </div>
          <div
            className="absolute bottom-0 right-5 text-7xl font-serif leading-none select-none"
            style={{ color: '#D4AF37', opacity: 0.15 }}
          >
            "
          </div>

          <p
            className="relative z-10 leading-relaxed font-medium text-lg"
            style={{ color: '#2C1810', wordBreak: 'keep-all' }}
          >
            {dharma.text}
          </p>

          {dharma.source && (
            <p className="mt-5 text-sm font-semibold text-right" style={{ color: '#8B6914' }}>
              — {dharma.source}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
