'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';

const items = [
  { label: '대웅전', sub: '본존불 친견', icon: '🏛️', href: 'daeungjeon' },
  { label: '지장전', sub: '명부전', icon: '🪷', href: 'jijangjeon' },
  { label: '종무소', sub: '사찰 안내', icon: '📜', href: 'jongmuso' },
  { label: '초공양', sub: '초 올리기', icon: '🕯️', href: 'candle' },
  { label: '인등불사', sub: '인연의 등', icon: '🏮', href: 'indung' },
  { label: '연등공양', sub: '연꽃 등불', icon: '🪷', href: 'yeondeung' },
  { label: '부처님말씀', sub: '오늘의 법문', icon: '📿', href: '#' },
  { label: '공지사항', sub: '소식', icon: '📋', href: '#' },
];

export default function DharmaWheelPage() {
  const router = useRouter();
  const { slug } = useParams<{ slug: string }>();
  const [phase, setPhase] = useState<'wheel' | 'spinning' | 'grid'>('wheel');
  const [wheelAngle, setWheelAngle] = useState(0);
  const [cardsVisible, setCardsVisible] = useState<boolean[]>(new Array(8).fill(false));
  const [wheelFading, setWheelFading] = useState(false);

  const cx = 200, cy = 200, innerR = 48, outerR = 155;

  const spokes = items.map((item, i) => {
    const ang = (i * 45 - 90) * Math.PI / 180;
    const midAng = ((i * 45 + 22.5) - 90) * Math.PI / 180;
    const textRotRaw = i * 45 + 22.5;
    const textRot = (textRotRaw > 90 && textRotRaw < 270) ? textRotRaw + 180 : textRotRaw;
    const a1 = (i * 45 - 90) * Math.PI / 180;
    const a2 = ((i + 1) * 45 - 90) * Math.PI / 180;
    const r1 = 58, r2 = 148;
    const bx1 = cx + r1 * Math.cos(a1), by1 = cy + r1 * Math.sin(a1);
    const bx2 = cx + r2 * Math.cos(a1), by2 = cy + r2 * Math.sin(a1);
    const bx3 = cx + r2 * Math.cos(a2), by3 = cy + r2 * Math.sin(a2);
    const bx4 = cx + r1 * Math.cos(a2), by4 = cy + r1 * Math.sin(a2);
    return {
      x1: cx + innerR * Math.cos(ang), y1: cy + innerR * Math.sin(ang),
      x2: cx + outerR * Math.cos(ang), y2: cy + outerR * Math.sin(ang),
      tipX: cx + (outerR + 2) * Math.cos(ang), tipY: cy + (outerR + 2) * Math.sin(ang),
      tipRot: i * 45,
      textX: cx + 105 * Math.cos(midAng), textY: cy + 105 * Math.sin(midAng),
      textRot,
      bgPath: `M${bx1},${by1} L${bx2},${by2} A${r2},${r2} 0 0 1 ${bx3},${by3} L${bx4},${by4} A${r1},${r1} 0 0 0 ${bx1},${by1}Z`,
      label: item.label, idx: i,
    };
  });

  const doSpin = useCallback(() => {
    if (phase !== 'wheel') return;
    setPhase('spinning');
    let frame = 0;
    const totalFrames = 90;
    const ease = (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    const animate = () => {
      frame++;
      const t = frame / totalFrames;
      setWheelAngle(360 * ease(t));
      if (frame < totalFrames) {
        requestAnimationFrame(animate);
      } else {
        setWheelFading(true);
        setTimeout(() => {
          setPhase('grid');
          items.forEach((_, i) => {
            setTimeout(() => {
              setCardsVisible(prev => { const n = [...prev]; n[i] = true; return n; });
            }, i * 120);
          });
        }, 600);
      }
    };
    requestAnimationFrame(animate);
  }, [phase]);

  useEffect(() => {
    let touchStartY = 0;
    const onWheel = (e: WheelEvent) => { if (e.deltaY > 30) doSpin(); };
    const onTouchStart = (e: TouchEvent) => { touchStartY = e.touches[0].clientY; };
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches[0].clientY - touchStartY > 40) doSpin();
    };
    window.addEventListener('wheel', onWheel);
    window.addEventListener('touchstart', onTouchStart);
    window.addEventListener('touchmove', onTouchMove);
    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
    };
  }, [doSpin]);

  return (
    <div className="dw-root">
      <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@400;700;900&display=swap" rel="stylesheet" />

      <div className="dw-title">
        {phase === 'grid' ? '사이버법당' : '未 來 寺'}
      </div>

      {phase !== 'grid' && (
        <div className="dw-sub">사이버법당 · 팔정도</div>
      )}

      {phase !== 'grid' && (
        <div className={`dw-wheel-wrap ${wheelFading ? 'fading' : ''}`}>
          <svg viewBox="0 0 400 400" className="dw-wheel-svg">
            <defs>
              <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F5D060"/>
                <stop offset="50%" stopColor="#D4A017"/>
                <stop offset="100%" stopColor="#B8860B"/>
              </linearGradient>
              <linearGradient id="g2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#E8C840"/>
                <stop offset="100%" stopColor="#C8961E"/>
              </linearGradient>
            </defs>
            <g transform={`rotate(${wheelAngle}, 200, 200)`}>
              <circle cx={200} cy={200} r={172} fill="none" stroke="url(#g1)" strokeWidth={16}/>
              <circle cx={200} cy={200} r={156} fill="none" stroke="#C8961E" strokeWidth={2.5} opacity={0.6}/>
              <circle cx={200} cy={200} r={164} fill="none" stroke="#F5D060" strokeWidth={1} opacity={0.3}/>
              <circle cx={200} cy={200} r={44} fill="url(#g1)" stroke="#B8860B" strokeWidth={3}/>
              <circle cx={200} cy={200} r={30} fill="#F5E6B8" stroke="#C8961E" strokeWidth={2}/>
              <ellipse cx={200} cy={190} rx={5.5} ry={6} fill="#C8961E"/>
              <ellipse cx={208.7} cy={205} rx={5.5} ry={6} fill="#C8961E"/>
              <ellipse cx={191.3} cy={205} rx={5.5} ry={6} fill="#C8961E"/>
              <circle cx={200} cy={200} r={3} fill="#F5E6B8"/>
              {spokes.map((s, i) => (
                <g key={i}>
                  <path d={s.bgPath} fill={i % 2 === 0 ? 'rgba(245,224,140,0.25)' : 'rgba(200,150,30,0.12)'}/>
                  <line x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} stroke="#C8961E" strokeWidth={7} strokeLinecap="round"/>
                  <g transform={`translate(${s.tipX},${s.tipY}) rotate(${s.tipRot})`}>
                    <path d="M0,-11 L7,0 L0,11 L-7,0 Z" fill="#D4A017" stroke="#B8860B" strokeWidth={1.5}/>
                    <circle cx={0} cy={0} r={2.5} fill="#F5E6B8"/>
                  </g>
                  <text x={s.textX} y={s.textY + 4} textAnchor="middle"
                    transform={`rotate(${s.textRot},${s.textX},${s.textY})`}
                    className="dw-spoke-label">
                    {s.label}
                  </text>
                </g>
              ))}
            </g>
          </svg>
        </div>
      )}

      {phase === 'wheel' && (
        <div className="dw-cta" onClick={doSpin}>
          <span>법륜바퀴를 굴립니다</span>
          <div className="dw-bounce">⌄</div>
        </div>
      )}

      {phase === 'grid' && (
        <>
          <div className="dw-grid">
            {items.map((item, i) => (
              <div key={i} className={`dw-card ${cardsVisible[i] ? 'show' : ''}`}
                onClick={() => item.href !== '#' && router.push(`/${slug}/cyber/${item.href}`)}>
                <div className="dw-card-icon">{item.icon}</div>
                <div className="dw-card-label">{item.label}</div>
                <div className="dw-card-sub">{item.sub}</div>
              </div>
            ))}
          </div>
          <button className="dw-enter" onClick={() => router.push(`/${slug}/cyber`)}>
            법륜 다시 굴리기 ☸
          </button>
        </>
      )}

      <style>{`
        .dw-root {
          width: 100%; min-height: 100vh; display: flex; flex-direction: column;
          align-items: center; justify-content: flex-start; overflow: hidden;
          font-family: 'Noto Serif KR', serif; padding-top: 20px; position: relative;
          background: linear-gradient(180deg, #FFFEF5 0%, #FFF9E6 100%);
        }
        .dw-title {
          font-size: 26px; font-weight: 900; letter-spacing: 6px; margin-bottom: 2px;
          color: #2C2C2A; transition: all 0.6s;
        }
        .dw-sub {
          font-size: 13px; color: #888; letter-spacing: 2px; margin-bottom: 16px;
          transition: opacity 0.5s;
        }
        .dw-wheel-wrap {
          width: 380px; height: 380px; position: relative;
          transition: transform 0.8s cubic-bezier(.22,1,.36,1), opacity 0.6s;
        }
        .dw-wheel-wrap.fading { transform: scale(0.15); opacity: 0; }
        .dw-wheel-svg { width: 100%; height: 100%; }
        .dw-spoke-label {
          font-family: 'Noto Serif KR', serif; font-size: 12.5px;
          font-weight: 700; fill: #6B4400;
        }
        .dw-cta {
          margin-top: 12px; display: flex; flex-direction: column;
          align-items: center; gap: 4px; cursor: pointer;
        }
        .dw-cta span { font-size: 14px; color: #888; letter-spacing: 1px; }
        .dw-bounce {
          font-size: 24px; color: #888; animation: dwBounce 1.5s infinite;
        }
        @keyframes dwBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(7px); }
        }
        .dw-grid {
          display: grid; grid-template-columns: repeat(4, 1fr);
          gap: 10px; padding: 0 16px; width: 100%; max-width: 600px;
        }
        .dw-card {
          background: #fff; border: 0.5px solid #e0e0e0; border-radius: 12px;
          display: flex; flex-direction: column; align-items: center;
          justify-content: center; padding: 16px 6px; gap: 8px;
          cursor: pointer; min-height: 110px;
          opacity: 0; transform: scale(0.5) rotate(30deg);
          transition: opacity 0.5s, transform 0.6s cubic-bezier(.22,1,.36,1), border-color 0.2s;
        }
        .dw-card.show { opacity: 1; transform: scale(1) rotate(0deg); }
        .dw-card:hover { border-color: #bbb; transform: scale(1.03); }
        .dw-card:active { transform: scale(0.96); }
        .dw-card-icon { font-size: 30px; line-height: 1; }
        .dw-card-label {
          font-size: 13px; font-weight: 700; letter-spacing: 1px;
          text-align: center; color: #2C2C2A;
        }
        .dw-card-sub { font-size: 10px; color: #888; text-align: center; }
        .dw-enter {
          margin-top: 24px; margin-bottom: 40px; background: linear-gradient(135deg, #8B6914, #C8961E);
          color: #fff; border: none; border-radius: 12px;
          padding: 14px 44px; font-size: 16px; font-weight: 700;
          letter-spacing: 3px; cursor: pointer;
          font-family: 'Noto Serif KR', serif;
          box-shadow: 0 2px 12px rgba(139,105,20,0.3);
          transition: transform 0.2s;
        }
        .dw-enter:hover { transform: scale(1.04); }
        .dw-enter:active { transform: scale(0.97); }
        @media (max-width: 500px) {
          .dw-wheel-wrap { width: 300px; height: 300px; }
          .dw-title { font-size: 22px; }
          .dw-spoke-label { font-size: 10.5px; }
          .dw-grid { grid-template-columns: repeat(2, 1fr); gap: 8px; padding: 0 12px; }
          .dw-card { min-height: 100px; padding: 12px 4px; }
        }
      `}</style>
    </div>
  );
}
