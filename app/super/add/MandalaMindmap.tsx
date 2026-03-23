'use client'

interface MandalaProps {
  templeName: string
  selected: string[]
  onChange: (ids: string[]) => void
}

const CX = 270, CY = 270

function pos(angleDeg: number, r: number) {
  const rad = (angleDeg - 90) * Math.PI / 180
  return { x: CX + r * Math.cos(rad), y: CY + r * Math.sin(rad) }
}

const CATS = [
  { id: 'hero',     label: '히어로', angle: 0,   color: '#2B6B7F', blocks: ['H-01'] },
  { id: 'event',    label: '행사',   angle: 60,  color: '#7C3D9A', blocks: ['E-01'] },
  { id: 'media',    label: '미디어', angle: 120, color: '#3D6B4F', blocks: ['G-01'] },
  { id: 'content',  label: '콘텐츠', angle: 180, color: '#B8600C', blocks: ['D-01', 'I-01'] },
  { id: 'practice', label: '실천',   angle: 240, color: '#1A7A5A', blocks: ['P-01', 'W-01'] },
  { id: 'guide',    label: '안내',   angle: 300, color: '#6B4226', blocks: ['DO-01', 'V-01'] },
]

const BLOCK_NODES = [
  { id: 'H-01',  label: '히어로',    angle: 0,   required: true },
  { id: 'E-01',  label: '법회·행사', angle: 60  },
  { id: 'G-01',  label: '갤러리',    angle: 120 },
  { id: 'D-01',  label: '법문',      angle: 165 },
  { id: 'I-01',  label: '공지',      angle: 195 },
  { id: 'P-01',  label: '실천',      angle: 225 },
  { id: 'W-01',  label: '산하기관',  angle: 255 },
  { id: 'DO-01', label: '나눔',      angle: 285 },
  { id: 'V-01',  label: '오시는길',  angle: 315 },
]

export { CATS, BLOCK_NODES }

export default function MandalaMindmap({ templeName, selected, onChange }: MandalaProps) {
  const toggle = (id: string, required?: boolean) => {
    if (required) return
    onChange(selected.includes(id) ? selected.filter(s => s !== id) : [...selected, id])
  }

  return (
    <svg
      viewBox="0 0 540 540"
      className="w-full max-w-sm mx-auto block"
      style={{ background: 'radial-gradient(circle at 50% 50%, #1a0d06 0%, #0a0604 100%)', borderRadius: '50%' }}
    >
      {/* 외곽 장식 링 */}
      <circle cx={CX} cy={CY} r={252} fill="none" stroke="#D4AF3722" strokeWidth="1" />
      <circle cx={CX} cy={CY} r={244} fill="none" stroke="#D4AF3712" strokeWidth="0.5" />

      {/* 중심 → 카테고리 연결선 */}
      {CATS.map(cat => {
        const p = pos(cat.angle, 115)
        const active = cat.blocks.some(id => selected.includes(id))
        return (
          <line key={`cl-${cat.id}`}
            x1={CX} y1={CY} x2={p.x} y2={p.y}
            stroke={active ? '#D4AF37' : '#2e2e2e'}
            strokeWidth={active ? 2 : 1}
            opacity={0.7}
          />
        )
      })}

      {/* 카테고리 → 블록 연결선 */}
      {BLOCK_NODES.map(block => {
        const cat = CATS.find(c => c.blocks.includes(block.id))!
        const cPos = pos(cat.angle, 115)
        const bPos = pos(block.angle, 200)
        const active = selected.includes(block.id)
        return (
          <line key={`bl-${block.id}`}
            x1={cPos.x} y1={cPos.y} x2={bPos.x} y2={bPos.y}
            stroke={active ? '#D4AF37' : '#252525'}
            strokeWidth={active ? 1.5 : 1}
            strokeDasharray={active ? '' : '3 5'}
            opacity={0.7}
          />
        )
      })}

      {/* 블록 노드 */}
      {BLOCK_NODES.map(block => {
        const p = pos(block.angle, 200)
        const active = selected.includes(block.id)
        const cat = CATS.find(c => c.blocks.includes(block.id))!
        return (
          <g key={block.id}
            onClick={() => toggle(block.id, block.required)}
            style={{ cursor: block.required ? 'default' : 'pointer' }}
          >
            {/* 선택 글로우 */}
            {active && (
              <circle cx={p.x} cy={p.y} r={33} fill={cat.color} opacity={0.18} />
            )}
            {/* 노드 원 */}
            <circle cx={p.x} cy={p.y} r={24}
              fill={active ? '#1c0e06' : '#161616'}
              stroke={active ? '#D4AF37' : '#3a3a3a'}
              strokeWidth={active ? 2.5 : 1.5}
            />
            {/* 필수 뱃지 */}
            {block.required && (
              <circle cx={p.x + 16} cy={p.y - 16} r={7} fill="#D4AF37" />
            )}
            {/* 블록 ID */}
            <text x={p.x} y={p.y - 4} textAnchor="middle"
              fill={active ? '#D4AF37' : '#666666'}
              fontSize="8.5" fontWeight="bold" fontFamily="monospace"
            >
              {block.id}
            </text>
            {/* 블록 이름 */}
            <text x={p.x} y={p.y + 9} textAnchor="middle"
              fill={active ? '#eeeeee' : '#4a4a4a'}
              fontSize="7.5"
            >
              {block.label}
            </text>
          </g>
        )
      })}

      {/* 카테고리 노드 */}
      {CATS.map(cat => {
        const p = pos(cat.angle, 115)
        const active = cat.blocks.some(id => selected.includes(id))
        const selCount = cat.blocks.filter(id => selected.includes(id)).length
        return (
          <g key={cat.id}>
            {active && <circle cx={p.x} cy={p.y} r={38} fill={cat.color} opacity={0.18} />}
            <circle cx={p.x} cy={p.y} r={29}
              fill={active ? cat.color + '28' : '#131313'}
              stroke={active ? cat.color : '#383838'}
              strokeWidth={active ? 2 : 1.5}
            />
            <text x={p.x} y={p.y + 4} textAnchor="middle"
              fill={active ? '#ffffff' : '#666666'}
              fontSize="10" fontWeight="bold"
            >
              {cat.label}
            </text>
            {/* 선택 카운트 뱃지 */}
            {selCount > 0 && (
              <>
                <circle cx={p.x + 20} cy={p.y - 20} r={11} fill="#D4AF37" />
                <text x={p.x + 20} y={p.y - 16} textAnchor="middle"
                  fill="#1a0f08" fontSize="10" fontWeight="bold"
                >
                  {selCount}
                </text>
              </>
            )}
          </g>
        )
      })}

      {/* 중심 원 */}
      <circle cx={CX} cy={CY} r={56} fill="none" stroke="#D4AF37" strokeWidth="1.5" opacity={0.5} />
      <circle cx={CX} cy={CY} r={50} fill="#100804" />
      <text x={CX} y={CY - 11} textAnchor="middle" fill="#D4AF37" fontSize="20">☸</text>
      <text x={CX} y={CY + 7} textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">
        {(templeName || '사찰명').slice(0, 5)}
      </text>
      <text x={CX} y={CY + 22} textAnchor="middle" fill="#777777" fontSize="8.5">
        {selected.length}개 선택
      </text>
    </svg>
  )
}
