'use client'
import { BLOCK_DEFS } from './ModulePicker'

// 블록 ID → 카테고리 컬러·아이콘 직접 매핑
const BLOCK_STYLE: Record<string, { color: string; icon: string }> = {
  'H-01':  { color: '#1B3A6B', icon: '🏯' },   // 히어로
  'E-01':  { color: '#2D5016', icon: '🎋' },   // 행사
  'G-01':  { color: '#2C5F8A', icon: '📸' },   // 갤러리
  'D-01':  { color: '#3D5A3E', icon: '🧘' },   // 신행 (법문)
  'I-01':  { color: '#4A4A4A', icon: '📋' },   // 안내 (공지)
  'P-01':  { color: '#D4AF37', icon: '🙏' },   // 기도 (실천)
  'W-01':  { color: '#5C4033', icon: '🏛️' },  // 전각 (산하기관)
  'DO-01': { color: '#B8860B', icon: '💛' },   // 후원 (나눔)
  'V-01':  { color: '#6B4226', icon: '📍' },   // 안내 (오시는 길)
}

interface Props {
  selected: string[]
  onChange: (ids: string[]) => void
}

export default function BlockGrid({ selected, onChange }: Props) {
  const toggle = (id: string, required?: boolean) => {
    if (required) return
    onChange(selected.includes(id) ? selected.filter(s => s !== id) : [...selected, id])
  }

  return (
    <div>
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-temple-brown font-bold text-base">블록 보물함</p>
        <span className="bg-temple-gold text-temple-brown text-sm font-bold px-3 py-1 rounded-full">
          {selected.length}개 선택
        </span>
      </div>

      {/* 그리드: 모바일 2열, 태블릿+ 3열 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {BLOCK_DEFS.map(def => {
          const isSelected = selected.includes(def.id)
          const style = BLOCK_STYLE[def.id] ?? { color: '#6B7280', icon: '✦' }

          return (
            <button
              key={def.id}
              onClick={() => toggle(def.id, def.required)}
              disabled={def.required}
              className={`relative rounded-2xl border-2 overflow-hidden text-left transition-all active:scale-95 min-h-[120px] flex flex-col ${
                isSelected
                  ? 'border-temple-gold shadow-md shadow-yellow-100'
                  : 'border-gray-200 bg-white'
              } ${def.required ? 'cursor-default' : 'cursor-pointer'}`}
            >
              {/* 상단 카테고리 컬러 바 */}
              <div
                className="w-full h-2 flex-shrink-0"
                style={{ backgroundColor: style.color }}
              />

              {/* 카드 본문 */}
              <div className={`flex-1 flex flex-col items-center justify-center px-2 py-3 ${
                isSelected ? 'bg-yellow-50' : 'bg-white'
              }`}>
                {/* 아이콘 + 블록 코드 */}
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="text-2xl leading-none">{style.icon}</span>
                  <code
                    className="text-xs font-bold font-mono px-1.5 py-0.5 rounded"
                    style={{
                      backgroundColor: style.color + '22',
                      color: isSelected ? style.color : '#888888',
                    }}
                  >
                    {def.id}
                  </code>
                </div>

                {/* 블록 이름 */}
                <p className={`text-sm font-bold text-center leading-tight ${
                  isSelected ? 'text-temple-brown' : 'text-gray-700'
                }`}>
                  {def.name}
                </p>
              </div>

              {/* 선택 체크 뱃지 */}
              {isSelected && (
                <div
                  className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: style.color }}
                >
                  <span className="text-white text-xs font-bold leading-none">✓</span>
                </div>
              )}

              {/* 필수 뱃지 */}
              {def.required && (
                <div className="absolute top-2.5 right-2.5 bg-temple-gold text-temple-brown text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                  필수
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
