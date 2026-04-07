'use client'
// NATURE-01: 천관사 자연3종카드 — 천관산 기암괴석·대나무숲·동백군락
import type { TempleData } from '../../types'

interface NatureCard {
  icon:    string
  title:   string
  subtitle: string
  desc:    string
  season?: string
  color:   string
  bg:      string
}

interface Props {
  temple: TempleData
  config: Record<string, unknown>
}

const DEFAULT_CARDS: NatureCard[] = [
  {
    icon:     '🪨',
    title:    '천관산 기암괴석',
    subtitle: '天冠山 奇巖怪石',
    desc:     '해발 723m 천관산 정상부를 뒤덮은 수백 개의 기암괴석. 사람·동물·불상을 닮은 돌들이 저마다의 이름을 품고 서 있습니다. 천관보살이 하강하신 성스러운 산의 형상이라 전해집니다.',
    season:   '사계절',
    color:    '#4a3820',
    bg:       'linear-gradient(135deg, #d4c4a8 0%, #b8a080 50%, #8b7355 100%)',
  },
  {
    icon:     '🎋',
    title:    '대나무숲',
    subtitle: '竹 林',
    desc:     '사찰 주변을 병풍처럼 두른 울창한 대나무숲. 바람이 지날 때마다 청아한 댓잎 소리가 마음의 소음을 걷어냅니다. 한 걸음 들어서는 순간 세상 소리가 멀어집니다.',
    season:   '봄·여름',
    color:    '#1e4030',
    bg:       'linear-gradient(135deg, #4a7c59 0%, #2d6048 50%, #1a3d2b 100%)',
  },
  {
    icon:     '🌺',
    title:    '동백 군락',
    subtitle: '冬柏 群落',
    desc:     '천관사 경내와 천관산 자락 전체에 분포하는 동백나무 군락. 눈 속에도 붉게 피어나는 동백꽃은 보살의 자비처럼 꺼지지 않는 원력을 상징합니다. 12월부터 이듬해 2월이 절정입니다.',
    season:   '12월~2월',
    color:    '#7a1a1a',
    bg:       'linear-gradient(135deg, #c0392b 0%, #922b21 50%, #641e16 100%)',
  },
]

// ── SVG 씬 배경 ──────────────────────────────────────────────────────────────
function RockScene() {
  return (
    <svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg"
      style={{ position:'absolute', inset:0, width:'100%', height:'100%', opacity:0.18 }}>
      {/* Sky */}
      <rect width="200" height="120" fill="#d4c4a8" />
      {/* Rocks */}
      <polygon points="20,100 45,55 70,100"  fill="#8b7355" />
      <polygon points="50,100 80,40 110,100" fill="#7a6345" />
      <polygon points="90,100 125,50 160,100" fill="#9c8465" />
      <polygon points="140,100 165,62 190,100" fill="#8b7355" />
      {/* Details */}
      <polygon points="55,100 72,70 89,100" fill="#6b5535" opacity="0.7" />
      <polygon points="100,100 120,60 140,100" fill="#5c4a2a" opacity="0.7" />
      {/* Ground */}
      <rect x="0" y="100" width="200" height="20" fill="#6b5535" />
    </svg>
  )
}

function BambooScene() {
  return (
    <svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg"
      style={{ position:'absolute', inset:0, width:'100%', height:'100%', opacity:0.18 }}>
      <rect width="200" height="120" fill="#2d6048" />
      {/* Bamboo stalks */}
      {[15,32,50,68,85,103,120,138,155,172,188].map((x,i) => (
        <g key={i}>
          <rect x={x-2} y="0" width="4" height="120" rx="2"
            fill={i%2===0 ? '#4a8c60' : '#3d7550'} />
          {/* Nodes */}
          {[20,45,70,95].map(y => (
            <rect key={y} x={x-3} y={y} width="6" height="3" rx="1" fill="#2d5a3d" />
          ))}
          {/* Leaves */}
          <ellipse cx={x+8} cy={28+i*3} rx="14" ry="4" fill="#3d8c55" opacity="0.7"
            transform={`rotate(-${20+i*5}, ${x+8}, ${28+i*3})`} />
          <ellipse cx={x-8} cy={55+i*2} rx="12" ry="3.5" fill="#2d7a48" opacity="0.6"
            transform={`rotate(${15+i*4}, ${x-8}, ${55+i*2})`} />
        </g>
      ))}
    </svg>
  )
}

function CamelliaScene() {
  return (
    <svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg"
      style={{ position:'absolute', inset:0, width:'100%', height:'100%', opacity:0.18 }}>
      <rect width="200" height="120" fill="#641e16" />
      {/* Branches */}
      <line x1="100" y1="120" x2="100" y2="60" stroke="#3d1208" strokeWidth="6" />
      <line x1="100" y1="80" x2="40" y2="40"  stroke="#3d1208" strokeWidth="4" />
      <line x1="100" y1="70" x2="160" y2="35" stroke="#3d1208" strokeWidth="4" />
      <line x1="100" y1="90" x2="155" y2="75" stroke="#3d1208" strokeWidth="3" />
      <line x1="100" y1="85" x2="45" y2="70"  stroke="#3d1208" strokeWidth="3" />
      {/* Leaves */}
      {[[40,38],[160,33],[155,73],[45,68],[75,25],[125,22],[80,55],[120,50]].map(([x,y],i) => (
        <ellipse key={i} cx={x} cy={y} rx="14" ry="8" fill="#2d5a1a"
          transform={`rotate(${i*22}, ${x}, ${y})`} />
      ))}
      {/* Flowers */}
      {[[38,35],[158,30],[154,70],[44,65],[74,22],[124,19]].map(([x,y],i) => (
        <g key={i}>
          {[0,60,120,180,240,300].map(deg => (
            <ellipse key={deg} cx={x + Math.cos(deg*Math.PI/180)*7}
              cy={y + Math.sin(deg*Math.PI/180)*7}
              rx="5" ry="3.5" fill="#c0392b"
              transform={`rotate(${deg}, ${x + Math.cos(deg*Math.PI/180)*7}, ${y + Math.sin(deg*Math.PI/180)*7})`} />
          ))}
          <circle cx={x} cy={y} r="4" fill="#f4d03f" />
        </g>
      ))}
    </svg>
  )
}

const SCENES = [RockScene, BambooScene, CamelliaScene]

export default function NatureCardsBlock({ config }: Props) {
  const cards: NatureCard[] = Array.isArray(config.cards) && (config.cards as NatureCard[]).length > 0
    ? (config.cards as NatureCard[])
    : DEFAULT_CARDS

  return (
    <section id="nature" className="bt-section" style={{ background: 'var(--color-bg, #f8f4ee)' }}>
      <div className="bt-section-inner">
        <span className="bt-section-label">Nature</span>
        <h2 className="bt-section-title">천관산의 세 가지 표정</h2>
        <p className="bt-section-desc">
          천관보살이 머무시는 산, 천관산이 품은 자연의 아름다움을 만나보세요
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
          marginTop: '40px',
        }}>
          {cards.map((card, i) => {
            const Scene = SCENES[i % SCENES.length]
            return (
              <div key={i} style={{
                position: 'relative',
                borderRadius: '12px',
                overflow: 'hidden',
                background: card.bg,
                minHeight: '320px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
              }}>
                {/* SVG scene background */}
                <Scene />

                {/* Content overlay */}
                <div style={{
                  position: 'relative',
                  zIndex: 1,
                  padding: '24px',
                  background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)',
                }}>
                  {card.season && (
                    <span style={{
                      display: 'inline-block',
                      padding: '2px 10px',
                      borderRadius: '12px',
                      background: 'rgba(255,255,255,0.2)',
                      color: '#fff',
                      fontSize: '11px',
                      letterSpacing: '0.08em',
                      marginBottom: '8px',
                    }}>
                      {card.season}
                    </span>
                  )}
                  <div style={{ fontSize: '2rem', marginBottom: '6px' }}>{card.icon}</div>
                  <h3 style={{
                    margin: '0 0 4px',
                    color: '#fff',
                    fontSize: '1.25rem',
                    fontFamily: 'serif',
                    fontWeight: '700',
                  }}>
                    {card.title}
                  </h3>
                  <p style={{
                    margin: '0 0 8px',
                    color: 'rgba(255,255,255,0.7)',
                    fontSize: '0.8rem',
                    letterSpacing: '0.12em',
                    fontFamily: 'serif',
                  }}>
                    {card.subtitle}
                  </p>
                  <p style={{
                    margin: 0,
                    color: 'rgba(255,255,255,0.88)',
                    fontSize: '0.85rem',
                    lineHeight: '1.7',
                  }}>
                    {card.desc}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
