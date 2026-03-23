'use client'
import { BLOCK_DEFS } from './ModulePicker'

interface Props {
  selected: string[]
  onChange: (ids: string[]) => void
}

const CAT_COLOR: Record<string, string> = {
  '히어로': '#2B6B7F',
  '행사':   '#7C3D9A',
  '미디어': '#3D6B4F',
  '콘텐츠': '#B8600C',
  '기관':   '#1A7A5A',
}

export default function BlockGrid({ selected, onChange }: Props) {
  const toggle = (id: string, required?: boolean) => {
    if (required) return
    onChange(selected.includes(id) ? selected.filter(s => s !== id) : [...selected, id])
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-temple-brown font-bold text-base">블록 보물함</p>
        <span className="bg-temple-gold text-temple-brown text-sm font-bold px-3 py-1 rounded-full">
          {selected.length}개 선택
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {BLOCK_DEFS.map(def => {
          const isSelected = selected.includes(def.id)
          const catColor = CAT_COLOR[def.category] ?? '#6B7280'

          return (
            <button
              key={def.id}
              onClick={() => toggle(def.id, def.required)}
              disabled={def.required}
              className={`p-3 rounded-xl border-2 text-left transition-all active:scale-95 ${
                isSelected
                  ? 'border-temple-gold bg-yellow-50 shadow-sm'
                  : 'border-gray-200 bg-white'
              } ${def.required ? 'cursor-default' : 'cursor-pointer'}`}
            >
              {/* 헤더 행 */}
              <div className="flex items-center justify-between mb-1.5">
                <code className={`text-[10px] font-bold ${isSelected ? 'text-temple-brown' : 'text-gray-400'}`}>
                  {def.id}
                </code>
                {def.required
                  ? <span className="text-[9px] text-temple-gold font-bold">필수</span>
                  : isSelected
                    ? <span className="text-temple-gold text-sm leading-none">✓</span>
                    : null
                }
              </div>

              {/* 카테고리 컬러 바 */}
              <div
                className="w-full h-1 rounded-full mb-1.5"
                style={{ backgroundColor: catColor + (isSelected ? 'cc' : '44') }}
              />

              {/* 블록 이름 */}
              <p className={`text-sm font-bold leading-tight ${isSelected ? 'text-temple-brown' : 'text-gray-600'}`}>
                {def.name}
              </p>

              {/* 설명 */}
              <p className="text-[10px] text-gray-400 mt-0.5 leading-tight line-clamp-2">
                {def.desc}
              </p>
            </button>
          )
        })}
      </div>
    </div>
  )
}
