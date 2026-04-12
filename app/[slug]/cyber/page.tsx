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

const GAP = 12;

function getGridPos(i: number, cw: number) {
  const cols = cw < 500 ? 2 : 4;
  const cardW = cw < 500 ? (cw - GAP * 3) / 2 : 130;
  const cardH = cw < 500 ? 100 : 120;
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

      <div className="dw-title">{phase === 'done' ? '사이버법당' : '미 래 사'}</div>
      {phase !== 'done' && <div className="dw-sub">사이버법당 · 초전법륜지</div>}

      <div style={{ position: 'relative', width: cw, height: phase === 'done' ? totalH + gridY0 + 40 : wcy + wr + 60, transition: 'height 0.8s ease' }}>

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
              <div style={{ fontSize: phase === 'idle' || phase === 'spinning' ? 32 : 30, lineHeight: 1 }}>{item.icon}</div>
              <div style={{ fontSize: phase === 'idle' || phase === 'spinning' ? 12 : 13, fontWeight: 700, letterSpacing: 1, color: '#2C2C2A', textAlign: 'center', opacity: 1, transition: 'font-size 0.5s' }}>{item.label}</div>
              <div style={{ fontSize: 10, color: '#888', textAlign: 'center', opacity: morphT > 0.6 || phase === 'done' ? 1 : 0, display: phase === 'idle' || phase === 'spinning' ? 'none' : 'block', transition: 'opacity 0.3s' }}>{item.sub}</div>
            </div>
          );
        })}
      </div>

      {phase === 'idle' && (
        <div className="dw-cta" onClick={doSpin}>
          <span>법륜을 굴려 사이버법당에 들어갑니다</span>
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
        @media(max-width:500px) { .dw-title{font-size:22px} }
      `}</style>
    </div>
  );
}
