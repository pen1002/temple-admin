'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';

const items = [
  { label: '대웅전', sub: '본존불 친견', icon: '🏛️', href: 'daeungjeon' },
  { label: '지장전', sub: '명부전', icon: '🪷', href: 'jijangjeon' },
  { label: '종무소', sub: '사찰 안내', icon: '📜', href: 'jongmuso' },
  { label: '초공양', sub: '초 올리기', icon: '🕯️', href: 'candle' },
  { label: '인등불사', sub: '인연의 등', icon: '🏮', href: 'indung' },
  { label: '연등공양', sub: '연꽃 등불', icon: '🪷', href: 'yeondeung' },
  { label: '부처님말씀', sub: '오늘의 법문', icon: '📿', href: 'dharma' },
  { label: '공지사항', sub: '타종', icon: '🔔', href: 'notice' },
];

function CardIcon({ id, done }: { id: string; done: boolean }) {
  const s = done ? 64 : 40
  const common = { width: s, height: s, display: 'block' } as const
  switch (id) {
    case 'daeungjeon': return (
      <svg viewBox="0 0 80 80" style={{ ...common, overflow: 'visible' }}>
        <defs>
          <linearGradient id="ciRoof" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#4a3020"/><stop offset="100%" stopColor="#3a2010"/></linearGradient>
          <linearGradient id="ciWall" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#e8dcc8"/><stop offset="100%" stopColor="#d4c8a8"/></linearGradient>
          <radialGradient id="ciInner"><stop offset="0%" stopColor="rgba(255,220,80,0.4)"/><stop offset="100%" stopColor="rgba(40,20,5,0.95)"/></radialGradient>
        </defs>
        {/* 지붕 */}
        <path d="M4 28 L40 8 L76 28" fill="url(#ciRoof)" stroke="#2a1508" strokeWidth="1" />
        <path d="M8 28 L40 12 L72 28" fill="none" stroke="#c9a84c" strokeWidth="0.5" opacity="0.4" />
        <rect x="36" y="10" width="8" height="4" rx="1" fill="#c9a84c" opacity="0.6" />
        {/* 벽체 */}
        <rect x="10" y="28" width="60" height="44" fill="url(#ciWall)" stroke="#b8a888" strokeWidth="0.5" />
        {/* 기둥 */}
        <rect x="10" y="28" width="4" height="44" fill="#8a6a40" /><rect x="66" y="28" width="4" height="44" fill="#8a6a40" />
        <rect x="28" y="28" width="3" height="44" fill="#9a7a50" opacity="0.6" /><rect x="49" y="28" width="3" height="44" fill="#9a7a50" opacity="0.6" />
        {/* 어간문 — 좌우 열림 애니메이션 */}
        <g style={{ animation: 'ci-doorL 4s ease-in-out infinite' }}>
          <rect x="18" y="32" width="12" height="38" fill="#6a4a28" stroke="#4a3018" strokeWidth="0.5" />
          <line x1="24" y1="32" x2="24" y2="70" stroke="#8a6a40" strokeWidth="0.3" />
          <circle cx="28" cy="51" r="1" fill="#c9a84c" />
        </g>
        <g style={{ animation: 'ci-doorR 4s ease-in-out infinite' }}>
          <rect x="50" y="32" width="12" height="38" fill="#6a4a28" stroke="#4a3018" strokeWidth="0.5" />
          <line x1="56" y1="32" x2="56" y2="70" stroke="#8a6a40" strokeWidth="0.3" />
          <circle cx="52" cy="51" r="1" fill="#c9a84c" />
        </g>
        {/* 문 안쪽 — 불상 실루엣 + 후광 */}
        <rect x="30" y="32" width="20" height="38" fill="url(#ciInner)" />
        <ellipse cx="40" cy="48" rx="8" ry="8" fill="rgba(255,220,80,0.15)" />
        <ellipse cx="40" cy="50" rx="5" ry="7" fill="#c9a84c" opacity="0.6" />
        <ellipse cx="40" cy="46" rx="3" ry="2.5" fill="#c9a84c" opacity="0.7" />
        <ellipse cx="40" cy="62" rx="7" ry="3" fill="#8B6810" opacity="0.5" />
        {/* 현판 */}
        <rect x="26" y="24" width="28" height="7" rx="1" fill="#3a2010" stroke="#c9a84c" strokeWidth="0.4" />
        <text x="40" y="30" textAnchor="middle" fill="#c9a84c" fontSize="5" fontWeight="700">大 雄 殿</text>
      </svg>
    )
    case 'jijangjeon': return (
      <svg viewBox="0 0 64 64" style={{ ...common, animation: 'ci-float 3s ease-in-out infinite' }}>
        <rect x="18" y="8" width="28" height="40" rx="3" fill="#2a1a10" stroke="#c9a84c" strokeWidth="0.8" />
        <path d="M20 10 L32 6 L44 10" fill="none" stroke="#c9a84c" strokeWidth="0.5" />
        <rect x="20" y="10" width="24" height="3" rx="1" fill="#c9a84c" opacity="0.3" />
        <text x="32" y="36" textAnchor="middle" fill="#c9a84c" fontSize="8" fontWeight="700">靈</text>
        <ellipse cx="32" cy="50" rx="10" ry="3" fill="#e8a88c" />
        <path d="M24 49 Q28 46 32 49" fill="#f0b8a0" /><path d="M32 49 Q36 46 40 49" fill="#f0b8a0" />
        <rect x="22" y="52" width="20" height="5" rx="1" fill="#1a1a2e" stroke="#c9a84c" strokeWidth="0.4" />
        <circle cx="32" cy="28" r="18" fill="none" stroke="rgba(201,168,76,0.1)" strokeWidth="8" style={{ animation: 'ci-halo 3s ease-in-out infinite alternate' }} />
      </svg>
    )
    case 'jongmuso': return (
      <svg viewBox="0 0 64 64" style={common}>
        <rect x="8" y="12" width="34" height="42" rx="2" fill="#d4c4a0" stroke="#b8a878" strokeWidth="0.6" />
        <rect x="8" y="12" width="34" height="5" rx="1.5" fill="#c8b890" />
        {[24,30,36,42].map(y => <line key={y} x1="14" y1={y} x2="38" y2={y} stroke="#a09070" strokeWidth="0.4" />)}
        <circle cx="40" cy="51" r="1.5" fill="#c02020" opacity="0.6" />
        <g style={{ animation: 'ci-brush 2.5s ease-in-out infinite', transformOrigin: '52px 10px' }}>
          <rect x="50" y="10" width="3" height="32" rx="1" fill="#5a3a20" />
          <path d="M50 42 Q51.5 48 53 42" fill="#2a1a10" />
        </g>
        <ellipse cx="56" cy="18" rx="7" ry="5" fill="#8B6914" stroke="#6a5010" strokeWidth="0.4" style={{ animation: 'ci-bob 3s ease-in-out infinite' }} />
        <circle cx="59" cy="17" r="1" fill="#3a2a10" />
      </svg>
    )
    case 'candle': return (
      <svg viewBox="0 0 64 64" style={common}>
        <rect x="24" y="26" width="16" height="28" rx="2" fill="#f5f0e0" stroke="#d4c8a0" strokeWidth="0.6" />
        <rect x="22" y="52" width="20" height="4" rx="1.5" fill="#d4c8a0" />
        <rect x="30" y="20" width="4" height="8" rx="1" fill="#e8dcc0" />
        <ellipse cx="32" cy="14" rx="6" ry="9" fill="rgba(255,200,50,0.7)" style={{ animation: 'ci-flame 0.8s ease-in-out infinite alternate' }} />
        <ellipse cx="32" cy="16" rx="3" ry="5" fill="rgba(255,240,150,0.9)" />
        <ellipse cx="32" cy="18" rx="1.5" ry="2.5" fill="#fff" opacity="0.7" />
        <circle cx="32" cy="14" r="14" fill="none" stroke="rgba(255,200,50,0.08)" strokeWidth="6" style={{ animation: 'ci-glow 2s ease-in-out infinite alternate' }} />
      </svg>
    )
    case 'indung': return (
      <svg viewBox="0 0 64 64" style={common}>
        <rect x="29" y="4" width="6" height="6" rx="1.5" fill="#d4c8a0" />
        <path d="M22 10 Q22 6 32 6 Q42 6 42 10 L44 26 Q46 30 46 34 L46 46 Q46 50 42 50 L22 50 Q18 50 18 46 L18 34 Q18 30 20 26 Z"
          fill="url(#ciCeramicG)" stroke="#c8bda0" strokeWidth="0.5" />
        <path d="M46 24 Q52 24 52 32 Q52 38 46 38" fill="none" stroke="#c8bda0" strokeWidth="2" strokeLinecap="round" />
        <ellipse cx="28" cy="24" rx="4" ry="6" fill="rgba(255,255,255,0.12)" />
        <text x="32" y="36" textAnchor="middle" fill="rgba(100,60,10,0.5)" fontSize="8" fontWeight="700">燈</text>
        <ellipse cx="32" cy="6" rx="5" ry="7" fill="rgba(255,200,50,0.6)" style={{ animation: 'ci-flame 1s ease-in-out infinite alternate' }} />
        <ellipse cx="32" cy="7" rx="2.5" ry="4" fill="rgba(255,240,150,0.8)" />
        <defs><radialGradient id="ciCeramicG" cx="40%" cy="35%"><stop offset="0%" stopColor="#f0e8d8"/><stop offset="100%" stopColor="#c8bda0"/></radialGradient></defs>
      </svg>
    )
    case 'yeondeung': return (
      <svg viewBox="0 0 64 70" style={{ ...common, animation: 'ci-sway 2.5s ease-in-out infinite' }}>
        <line x1="32" y1="0" x2="32" y2="12" stroke="#666" strokeWidth="1" />
        <rect x="18" y="11" width="28" height="4" rx="1.5" fill="#c0392b" />
        <ellipse cx="32" cy="34" rx="20" ry="19" fill="#f4b8cc" />
        <path d="M32 15 Q32 34 32 53" stroke="#e8a0b8" strokeWidth="1" fill="none" />
        <path d="M17 18 Q13 34 17 50" stroke="#e8a0b8" strokeWidth="0.7" fill="none" />
        <path d="M47 18 Q51 34 47 50" stroke="#e8a0b8" strokeWidth="0.7" fill="none" />
        <ellipse cx="26" cy="30" rx="5" ry="8" fill="rgba(255,255,255,0.15)" />
        <rect x="30" y="15" width="4" height="38" rx="1" fill="#e898b0" opacity="0.4" />
        <rect x="18" y="51" width="28" height="4" rx="1.5" fill="#c0392b" />
        <line x1="32" y1="55" x2="32" y2="61" stroke="#666" strokeWidth="1" />
        <rect x="27" y="60" width="10" height="8" rx="1" fill="#f0b0c8" />
      </svg>
    )
    case 'dharma': return (
      <svg viewBox="0 0 64 64" style={common}>
        <rect x="6" y="6" width="52" height="50" rx="2" fill="#5a3a1a" stroke="#3a2210" strokeWidth="1" />
        <rect x="6" y="4" width="52" height="5" rx="1" fill="#7a5a30" />
        <path d="M3 6 L32 2 L61 6" fill="none" stroke="#8a6a40" strokeWidth="1.5" strokeLinecap="round" />
        {[18,28,38,48].map((y,i) => (
          <g key={i}><rect x="8" y={y} width="48" height="1.5" rx="0.5" fill="#7a5a30" />
          {Array.from({length:8}).map((_,j) => <rect key={j} x={10+j*6} y={y-8} width="4" height="8" rx="0.3" fill={['#c8b890','#d0c098','#baa878','#c4b488'][j%4]} stroke="#a09068" strokeWidth="0.2" />)}</g>
        ))}
        <rect x="4" y="52" width="56" height="4" rx="1.5" fill="#5a3a1a" stroke="#3a2210" strokeWidth="0.5" />
        <g style={{ animation: 'ci-scroll 4s ease-in-out infinite' }}>
          <rect x="20" y="20" width="24" height="14" rx="1.5" fill="#f0e8d0" stroke="#c8b890" strokeWidth="0.5" />
          <line x1="23" y1="25" x2="41" y2="25" stroke="#8a7a58" strokeWidth="0.4" />
          <line x1="23" y1="28" x2="39" y2="28" stroke="#8a7a58" strokeWidth="0.4" />
          <line x1="23" y1="31" x2="36" y2="31" stroke="#8a7a58" strokeWidth="0.4" />
          <text x="32" y="29" textAnchor="middle" fill="rgba(201,168,76,0.4)" fontSize="5">卍</text>
        </g>
        <circle cx="32" cy="30" r="16" fill="none" stroke="rgba(201,168,76,0.08)" strokeWidth="4" style={{ animation: 'ci-glow 4s ease-in-out infinite alternate' }} />
      </svg>
    )
    case 'notice': return (
      <svg viewBox="0 0 64 72" style={{ ...common, animation: 'ci-bell 3s ease-in-out infinite' }}>
        <ellipse cx="32" cy="8" rx="6" ry="4" fill="#4a5038" stroke="#3a4030" strokeWidth="0.6" />
        <rect x="29" y="10" width="6" height="5" rx="1.5" fill="#4a5038" />
        <path d="M18 15 Q18 10 32 10 Q46 10 46 15 L48 60 Q50 66 52 70 L12 70 Q14 66 16 60 Z" fill="url(#ciBellG)" stroke="#5a584a" strokeWidth="0.6" />
        <rect x="22" y="18" width="20" height="12" rx="1.5" fill="none" stroke="#8a8070" strokeWidth="0.4" />
        {[0,1,2,3,4,5,6,7,8].map(k => <circle key={k} cx={26+(k%3)*6} cy={22+Math.floor(k/3)*3.5} r="1.3" fill="#7a7868" />)}
        <path d="M28 42 Q30 36 34 40 Q36 36 38 42 Q35 46 32 44 Q29 46 28 42" fill="#7a7868" stroke="#6a6858" strokeWidth="0.3" />
        <circle cx="32" cy="56" r="4" fill="#6a6858" /><circle cx="32" cy="56" r="2.5" fill="#7a7868" />
        <path d="M14 68 Q22 65 32 64 Q42 65 50 68" fill="none" stroke="#8a8070" strokeWidth="0.5" />
        {[0,1,2,3,4,5].map(k => <path key={k} d={`M${16+k*6} 70 Q${19+k*6} 67 ${22+k*6} 70`} fill="#6a6858" />)}
        <defs><linearGradient id="ciBellG" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#8a8878"/><stop offset="50%" stopColor="#6b695a"/><stop offset="100%" stopColor="#5a584a"/></linearGradient></defs>
        <circle cx="32" cy="40" r="20" fill="none" stroke="rgba(201,168,76,0.06)" strokeWidth="5" style={{ animation: 'ci-wave 3s ease-out infinite' }} />
      </svg>
    )
    default: return <div style={{ fontSize: 32 }}>☸</div>
  }
}

const GAP = 12;

function getGridPos(i: number, cw: number) {
  const cols = cw < 500 ? 2 : 4;
  const cardW = cw < 500 ? (cw - GAP * 3) / 2 : 140;
  const cardH = cw < 500 ? 140 : 180;
  const totalW = cols * cardW + (cols - 1) * GAP;
  const startX = (cw - totalW) / 2;
  const col = i % cols, row = Math.floor(i / cols);
  return { x: startX + col * (cardW + GAP) + cardW / 2, y: row * (cardH + GAP) + cardH / 2, w: cardW, h: cardH };
}

export default function DharmaWheelPage() {
  const router = useRouter();
  const { slug } = useParams<{ slug: string }>();
  const rootRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<'idle' | 'spinning' | 'morphing' | 'done'>('idle');
  const [wheelAngle, setWheelAngle] = useState(0);
  const [morphT, setMorphT] = useState(0);
  const [cw, setCw] = useState(600);

  useEffect(() => {
    const u = () => setCw(Math.min(rootRef.current?.clientWidth || 600, 600));
    u(); window.addEventListener('resize', u);
    return () => window.removeEventListener('resize', u);
  }, []);

  const wcx = cw / 2, wcy = cw < 500 ? 190 : 210, wr = cw < 500 ? 145 : 165;

  function spokeXY(i: number) {
    const a = (i * 45 + 22.5 - 90 + wheelAngle) * Math.PI / 180;
    return { x: wcx + wr * 0.68 * Math.cos(a), y: wcy + wr * 0.68 * Math.sin(a) };
  }

  const doSpin = useCallback(() => {
    if (phase !== 'idle') return;
    setPhase('spinning');
    const t0 = performance.now();

    const spin = (now: number) => {
      const p = Math.min(1, (now - t0) / 2000);
      const e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
      setWheelAngle(720 * e);
      if (p < 1) return requestAnimationFrame(spin);
      setPhase('morphing');
      const t1 = performance.now();
      const morph = (now2: number) => {
        const p2 = Math.min(1, (now2 - t1) / 1200);
        setMorphT(1 - Math.pow(1 - p2, 3));
        if (p2 < 1) return requestAnimationFrame(morph);
        setPhase('done');
      };
      requestAnimationFrame(morph);
    };
    requestAnimationFrame(spin);
  }, [phase]);

  useEffect(() => {
    let sy = 0;
    const w = (e: WheelEvent) => { if (e.deltaY > 20) doSpin(); };
    const ts = (e: TouchEvent) => { sy = e.touches[0].clientY; };
    const tm = (e: TouchEvent) => { if (sy - e.touches[0].clientY > 30) doSpin(); };
    window.addEventListener('wheel', w);
    window.addEventListener('touchstart', ts);
    window.addEventListener('touchmove', tm);
    return () => { window.removeEventListener('wheel', w); window.removeEventListener('touchstart', ts); window.removeEventListener('touchmove', tm); };
  }, [doSpin]);

  const gridY0 = cw < 500 ? 60 : 80;
  const cols = cw < 500 ? 2 : 4;
  const rows = Math.ceil(8 / cols);
  const ch = cw < 500 ? 100 : 120;
  const totalH = rows * ch + (rows - 1) * GAP;
  const wheelOpacity = phase === 'morphing' ? 1 - morphT : phase === 'done' ? 0 : 1;

  return (
    <div ref={rootRef} className="dw-root">
      <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@400;700;900&display=swap" rel="stylesheet" />

      <div className="dw-title">{phase === 'done' ? '미래사' : '미 래 사'}</div>
      <div className="dw-sub">{phase === 'done' ? '온라인법당 초전법륜지' : '사이버법당 · 초전법륜지'}</div>

      <div style={{ position: 'relative', width: cw, minHeight: phase === 'done' ? totalH + gridY0 + 20 : wcy + wr + 60, transition: 'min-height 0.8s ease', overflow: phase === 'done' ? 'visible' : 'hidden' }}>

        {/* 바퀴 뼈대 — 스핀 중 보이고 morph 시 fade out */}
        {phase !== 'done' && (
          <svg style={{ position: 'absolute', top: 0, left: 0, width: cw, height: wcy + wr + 30, opacity: wheelOpacity, pointerEvents: 'none' }}
            viewBox={`0 0 ${cw} ${wcy + wr + 30}`}>
            <defs>
              <linearGradient id="dwG" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F5D060" /><stop offset="50%" stopColor="#D4A017" /><stop offset="100%" stopColor="#B8860B" />
              </linearGradient>
            </defs>
            <g transform={`rotate(${wheelAngle}, ${wcx}, ${wcy})`}>
              <circle cx={wcx} cy={wcy} r={wr} fill="none" stroke="url(#dwG)" strokeWidth={14} />
              <circle cx={wcx} cy={wcy} r={wr - 12} fill="none" stroke="#C8961E" strokeWidth={2} opacity={0.5} />
              {Array.from({ length: 8 }).map((_, i) => {
                const a = (i * 45 - 90) * Math.PI / 180;
                return <line key={i} x1={wcx + 36 * Math.cos(a)} y1={wcy + 36 * Math.sin(a)} x2={wcx + (wr - 8) * Math.cos(a)} y2={wcy + (wr - 8) * Math.sin(a)} stroke="#C8961E" strokeWidth={5} strokeLinecap="round" />;
              })}
              <circle cx={wcx} cy={wcy} r={36} fill="url(#dwG)" stroke="#B8860B" strokeWidth={2.5} />
              <circle cx={wcx} cy={wcy} r={24} fill="#F5E6B8" stroke="#C8961E" strokeWidth={1.5} />
              <ellipse cx={wcx} cy={wcy - 8} rx={4.5} ry={5} fill="#C8961E" />
              <ellipse cx={wcx + 7} cy={wcy + 4} rx={4.5} ry={5} fill="#C8961E" />
              <ellipse cx={wcx - 7} cy={wcy + 4} rx={4.5} ry={5} fill="#C8961E" />
              <circle cx={wcx} cy={wcy} r={2.5} fill="#F5E6B8" />
            </g>
          </svg>
        )}

        {/* 8개 아이콘 — 바퀴살 위에서 그리드로 연속 morph */}
        {items.map((item, i) => {
          const sp = spokeXY(i);
          const gp = getGridPos(i, cw);
          const tgtX = gp.x, tgtY = gp.y + gridY0;

          let x: number, y: number, sc: number, op: number, rot: number, br: number;
          if (phase === 'idle' || phase === 'spinning') {
            x = sp.x; y = sp.y; sc = cw < 500 ? 0.7 : 0.65; op = 1; rot = wheelAngle + i * 45; br = 50;
          } else if (phase === 'morphing') {
            const t = morphT;
            // 각 아이템에 약간의 시차 (stagger)
            const stagger = Math.min(1, Math.max(0, (t - i * 0.03) / (1 - 0.03 * 7)));
            const st = 1 - Math.pow(1 - stagger, 2);
            x = sp.x + (tgtX - sp.x) * st;
            y = sp.y + (tgtY - sp.y) * st;
            sc = 0.35 + 0.65 * st;
            op = 0.5 + 0.5 * st;
            rot = (1 - st) * (wheelAngle + i * 45);
            br = 50 - 38 * st;
          } else {
            x = tgtX; y = tgtY; sc = 1; op = 1; rot = 0; br = 12;
          }

          return (
            <div key={i}
              onClick={() => phase === 'done' && item.href !== '#' && router.push(`/${slug}/cyber/${item.href}`)}
              style={{
                position: 'absolute',
                left: x - gp.w / 2, top: y - gp.h / 2,
                width: gp.w, height: gp.h,
                transform: `scale(${sc}) rotate(${rot}deg)`,
                opacity: op,
                borderRadius: br,
                background: `rgba(255,255,255,${phase === 'done' ? 1 : 0.3 + morphT * 0.7})`,
                border: `0.5px solid ${phase === 'done' ? '#ddd' : `rgba(200,150,30,${0.3 + morphT * 0.5})`}`,
                boxShadow: phase === 'done' ? '0 1px 8px rgba(0,0,0,0.06)' : 'none',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6,
                cursor: phase === 'done' ? 'pointer' : 'default',
                transition: phase === 'done' ? 'transform 0.2s, box-shadow 0.2s' : 'none',
                zIndex: 10,
                willChange: 'transform, opacity, left, top',
              }}
              onMouseEnter={e => { if (phase === 'done') { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)'; } }}
              onMouseLeave={e => { if (phase === 'done') { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 1px 8px rgba(0,0,0,0.06)'; } }}
            >
              <div style={{ width: phase === 'done' ? 64 : 40, height: phase === 'done' ? 64 : 40, transition: 'width 0.5s, height 0.5s' }}>
                <CardIcon id={item.href} done={phase === 'done'} />
              </div>
              <div style={{ fontSize: phase === 'idle' || phase === 'spinning' ? 11 : 13, fontWeight: 700, letterSpacing: 1, color: '#2C2C2A', textAlign: 'center', opacity: 1, transition: 'font-size 0.5s', marginTop: 4 }}>{item.label}</div>
              <div style={{ fontSize: 10, color: '#888', textAlign: 'center', opacity: morphT > 0.6 || phase === 'done' ? 1 : 0, display: phase === 'idle' || phase === 'spinning' ? 'none' : 'block', transition: 'opacity 0.3s' }}>{item.sub}</div>
            </div>
          );
        })}
      </div>

      {phase === 'idle' && (
        <div className="dw-cta" onClick={doSpin}>
          <span>법륜을 굴려 온라인법당에 들어갑니다</span>
          <div className="dw-bounce">⌄</div>
        </div>
      )}

      {phase === 'done' && (
        <button className="dw-reset" onClick={() => { setPhase('idle'); setWheelAngle(0); setMorphT(0); }}>
          ☸ 법륜 다시 굴리기
        </button>
      )}

      <style>{`
        .dw-root { width:100%; min-height:100vh; display:flex; flex-direction:column; align-items:center; overflow:hidden; font-family:'Noto Serif KR',serif; padding-top:20px; background:linear-gradient(180deg,#FFFEF5,#FFF9E6); }
        .dw-title { font-size:26px; font-weight:900; letter-spacing:6px; margin-bottom:2px; color:#2C2C2A; transition:all 0.5s; }
        .dw-sub { font-size:13px; color:#888; letter-spacing:2px; margin-bottom:12px; }
        .dw-cta { margin-top:8px; display:flex; flex-direction:column; align-items:center; gap:4px; cursor:pointer; }
        .dw-cta span { font-size:14px; color:#888; letter-spacing:1px; }
        .dw-bounce { font-size:24px; color:#888; animation:dwB 1.5s infinite; }
        @keyframes dwB { 0%,100%{transform:translateY(0)} 50%{transform:translateY(7px)} }
        .dw-reset { margin:20px 0 40px; background:linear-gradient(135deg,#8B6914,#C8961E); color:#fff; border:none; border-radius:12px; padding:12px 36px; font-size:15px; font-weight:700; letter-spacing:2px; cursor:pointer; font-family:'Noto Serif KR',serif; box-shadow:0 2px 10px rgba(139,105,20,0.25); }
        @keyframes ci-doorL { 0%,20%{transform:translateX(0)} 40%,70%{transform:translateX(-8px)} 90%,100%{transform:translateX(0)} }
        @keyframes ci-doorR { 0%,20%{transform:translateX(0)} 40%,70%{transform:translateX(8px)} 90%,100%{transform:translateX(0)} }
        @keyframes ci-glow { 0%{filter:drop-shadow(0 0 2px rgba(255,200,50,0.2))} 100%{filter:drop-shadow(0 0 12px rgba(255,200,50,0.5))} }
        @keyframes ci-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
        @keyframes ci-brush { 0%,100%{transform:rotate(-5deg)} 50%{transform:rotate(5deg)} }
        @keyframes ci-bob { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-2px)} }
        @keyframes ci-flame { 0%{transform:scaleY(0.85);opacity:0.8} 100%{transform:scaleY(1.1);opacity:1} }
        @keyframes ci-sway { 0%,100%{transform:rotate(-3deg)} 50%{transform:rotate(3deg)} }
        @keyframes ci-scroll { 0%,15%{transform:translateY(0) scale(0.7);opacity:0} 30%{transform:translateY(-8px) scale(1);opacity:1} 60%{transform:translateY(-14px);opacity:1} 80%,100%{transform:translateY(-20px) scale(0.8);opacity:0} }
        @keyframes ci-bell { 0%,100%{transform:rotate(-1.5deg)} 50%{transform:rotate(1.5deg)} }
        @keyframes ci-wave { 0%{transform:scale(0.8);opacity:0.4} 100%{transform:scale(1.6);opacity:0} }
        @keyframes ci-halo { 0%{opacity:0.05} 100%{opacity:0.15} }
        @media(max-width:500px) { .dw-title{font-size:22px} }
      `}</style>
    </div>
  );
}
