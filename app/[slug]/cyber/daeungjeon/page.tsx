'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'next/navigation';

export default function DaeungjeonPage() {
  const { slug } = useParams<{ slug: string }>();
  const [modelLoaded, setModelLoaded] = useState(false);
  const [bowing, setBowing] = useState(false);
  const [bowCount, setBowCount] = useState(0);
  const [totalBows, setTotalBows] = useState(0);
  const tiltRef = useRef<HTMLDivElement>(null);
  const targetTilt = useRef({ x: 0, y: 0 });
  const currentTilt = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);

  // DB fetch
  const fetchData = useCallback(async () => {
    const res = await fetch(`/api/cyber/offering?temple_slug=${slug}&type=bow&limit=1`)
    const data = await res.json()
    if (Array.isArray(data)) setTotalBows(data.length)
  }, [slug])
  useEffect(() => { fetchData() }, [fetchData])

  // 마우스 tilt 효과
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = (e.clientY / window.innerHeight) * 2 - 1;
      const maxTilt = 15;
      targetTilt.current = {
        x: -Math.max(-1, Math.min(1, normY)) * maxTilt,
        y: Math.max(-1, Math.min(1, normX)) * maxTilt,
      };
    };
    const handleMouseLeave = () => {
      targetTilt.current = { x: 0, y: 0 };
    };
    const animate = () => {
      const lerp = 0.06;
      currentTilt.current.x += (targetTilt.current.x - currentTilt.current.x) * lerp;
      currentTilt.current.y += (targetTilt.current.y - currentTilt.current.y) * lerp;
      if (tiltRef.current) {
        tiltRef.current.style.transform =
          `perspective(1000px) rotateX(${currentTilt.current.x}deg) rotateY(${currentTilt.current.y}deg)`;
      }
      rafRef.current = requestAnimationFrame(animate);
    };
    window.addEventListener('mousemove', handleMouseMove);
    document.documentElement.addEventListener('mouseleave', handleMouseLeave);
    rafRef.current = requestAnimationFrame(animate);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // 참배
  const doBow = useCallback(async () => {
    if (bowing) return;
    setBowing(true);
    setBowCount(prev => prev + 1);
    await fetch('/api/cyber/offering', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ temple_slug: slug, type: 'bow', name: '참배자' }),
    })
    await fetchData()
    setTimeout(() => { setBowing(false); window.location.href = `/${slug}/cyber` }, 5000);
  }, [bowing, slug, fetchData]);

  return (
    <div className="dj-root">
      <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@400;700;900&display=swap" rel="stylesheet" />

      <div className="dj-header">
        <div className="dj-plaque">大 雄 殿</div>
        <div className="dj-plaque-sub">미래사 사이버법당 · 누적 참배 {totalBows.toLocaleString()}회</div>
      </div>

      <div className="dj-buddha-area">
        <div className="dj-glow" />
        <div className="dj-tilt-wrapper" ref={tiltRef}>
          <div className="dj-model-wrap">
            <iframe
              title="금동미륵보살반가사유상 - 국보 제83호"
              src="https://sketchfab.com/models/2d37bf970e5143d59f0cdfad2c7fd691/embed?autostart=1&ui_theme=dark&ui_infos=0&ui_controls=0&ui_stop=0&ui_watermark=0&ui_watermark_link=0"
              className="dj-model-iframe"
              allow="autoplay; fullscreen; xr-spatial-tracking"
              onLoad={() => setModelLoaded(true)}
            />
            {!modelLoaded && (
              <div className="dj-loader">
                <div className="dj-loader-ring" />
                <div className="dj-loader-text">반가사유상 로딩 중...</div>
              </div>
            )}
          </div>
        </div>
        <div className="dj-reflection" />
      </div>

      {/* 공양대 — 촛불 + 향로 */}
      <div className="dj-altar">
        {/* 좌측 촛불 */}
        <div className="dj-candle-wrap">
          <svg viewBox="0 0 40 80" width="40" height="80">
            <rect x="15" y="35" width="10" height="35" rx="2" fill="#f5f0e0" stroke="#d4c8a0" strokeWidth="0.5" />
            <rect x="13" y="68" width="14" height="5" rx="2" fill="#d4c8a0" />
            <rect x="18" y="28" width="4" height="9" rx="1" fill="#e8dcc0" />
            <ellipse cx="20" cy="20" rx="7" ry="12" fill="rgba(255,180,30,0.8)" className="dj-flame-outer" />
            <ellipse cx="20" cy="22" rx="4" ry="7" fill="rgba(255,230,100,0.9)" className="dj-flame-mid" />
            <ellipse cx="20" cy="24" rx="2" ry="4" fill="#fff" opacity="0.8" className="dj-flame-inner" />
          </svg>
          <div className="dj-candle-glow" />
        </div>

        {/* 향로 */}
        <div className="dj-incense-wrap">
          <svg viewBox="0 0 60 70" width="60" height="70">
            {/* 향로 몸통 */}
            <ellipse cx="30" cy="45" rx="22" ry="10" fill="#8a7050" stroke="#6a5030" strokeWidth="0.8" />
            <path d="M10 45 Q8 35 12 28 L48 28 Q52 35 50 45" fill="url(#djBronze)" stroke="#6a5030" strokeWidth="0.8" />
            <ellipse cx="30" cy="28" rx="18" ry="6" fill="#9a8060" stroke="#7a6040" strokeWidth="0.5" />
            {/* 뚜껑 구멍 */}
            {[22,26,30,34,38].map(x => <circle key={x} cx={x} cy="28" r="1.2" fill="#4a3020" />)}
            {/* 다리 */}
            <rect x="14" y="53" width="4" height="8" rx="1" fill="#7a6040" />
            <rect x="42" y="53" width="4" height="8" rx="1" fill="#7a6040" />
            <rect x="28" y="53" width="4" height="8" rx="1" fill="#7a6040" />
            {/* 문양 */}
            <path d="M16 36 Q22 32 28 36 Q34 32 40 36 Q46 32 48 36" fill="none" stroke="#b8a070" strokeWidth="0.5" />
            <defs><linearGradient id="djBronze" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#a08860"/><stop offset="100%" stopColor="#7a6040"/></linearGradient></defs>
          </svg>
          {/* 향 연기 */}
          <div className="dj-smoke-container">
            <div className="dj-smoke dj-smoke-1" />
            <div className="dj-smoke dj-smoke-2" />
            <div className="dj-smoke dj-smoke-3" />
          </div>
        </div>

        {/* 우측 촛불 */}
        <div className="dj-candle-wrap">
          <svg viewBox="0 0 40 80" width="40" height="80">
            <rect x="15" y="35" width="10" height="35" rx="2" fill="#f5f0e0" stroke="#d4c8a0" strokeWidth="0.5" />
            <rect x="13" y="68" width="14" height="5" rx="2" fill="#d4c8a0" />
            <rect x="18" y="28" width="4" height="9" rx="1" fill="#e8dcc0" />
            <ellipse cx="20" cy="20" rx="7" ry="12" fill="rgba(255,180,30,0.8)" className="dj-flame-outer" />
            <ellipse cx="20" cy="22" rx="4" ry="7" fill="rgba(255,230,100,0.9)" className="dj-flame-mid" />
            <ellipse cx="20" cy="24" rx="2" ry="4" fill="#fff" opacity="0.8" className="dj-flame-inner" />
          </svg>
          <div className="dj-candle-glow" />
        </div>
      </div>

      <div className="dj-credit">
        3D 모델 출처: 국립중앙박물관 | 국보 제83호 금동미륵보살반가사유상
      </div>

      <div className="dj-bow-area">
        <button className={`dj-bow-btn ${bowing ? 'bowing' : ''}`} onClick={doBow} disabled={bowing}>
          {bowing ? '🙏 참배 중...' : '🙏 참배하기'}
        </button>
        {bowCount > 0 && (
          <div className="dj-bow-count">오늘 {bowCount}배 참배하셨습니다</div>
        )}
      </div>

      {bowing && <div className="dj-bow-overlay" />}

      <style>{`
        .dj-root { width:100%; min-height:100vh; display:flex; flex-direction:column; align-items:center; font-family:'Noto Serif KR',serif; background:linear-gradient(180deg,#1a1a1a 0%,#2a1f0f 50%,#1a1a1a 100%); color:#F5E6B8; padding:0; position:relative; overflow:hidden; }
        .dj-header { text-align:center; padding:32px 0 16px; z-index:2; }
        .dj-plaque { font-size:clamp(28px,7vw,36px); font-weight:900; letter-spacing:12px; color:#F5D060; text-shadow:0 0 20px rgba(212,160,23,0.4); }
        .dj-plaque-sub { font-size:12px; color:rgba(245,230,184,0.5); letter-spacing:3px; margin-top:4px; }
        .dj-buddha-area { position:relative; width:100%; max-width:500px; height:clamp(360px,70vw,500px); display:flex; align-items:center; justify-content:center; margin:0 auto; }
        .dj-glow { position:absolute; width:clamp(240px,50vw,320px); height:clamp(240px,50vw,320px); border-radius:50%; top:50%; left:50%; transform:translate(-50%,-50%); background:radial-gradient(circle,rgba(212,160,23,0.3) 0%,rgba(212,160,23,0.05) 60%,transparent 80%); animation:djGlow 3s ease-in-out infinite alternate; }
        @keyframes djGlow { 0%{transform:translate(-50%,-50%) scale(0.95);opacity:0.6} 100%{transform:translate(-50%,-50%) scale(1.05);opacity:1} }
        .dj-tilt-wrapper { width:clamp(300px,65vw,400px); height:clamp(340px,72vw,450px); transition:transform 0.05s linear; will-change:transform; z-index:1; }
        .dj-model-wrap { width:100%; height:100%; position:relative; border-radius:12px; overflow:hidden; }
        .dj-model-iframe { width:100%; height:100%; border:none; border-radius:12px; }
        .dj-loader { position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:12px; background:rgba(26,26,26,0.9); border-radius:12px; }
        .dj-loader-ring { width:40px; height:40px; border:3px solid rgba(245,208,96,0.2); border-top-color:#F5D060; border-radius:50%; animation:djSpin 1s linear infinite; }
        @keyframes djSpin { to{transform:rotate(360deg)} }
        .dj-loader-text { font-size:13px; color:rgba(245,230,184,0.6); }
        .dj-reflection { position:absolute; bottom:20px; left:50%; transform:translateX(-50%); width:200px; height:2px; background:linear-gradient(90deg,transparent,rgba(212,160,23,0.4),transparent); }
        .dj-credit { font-size:10px; color:rgba(245,230,184,0.25); text-align:center; padding:4px 0; z-index:2; }
        .dj-bow-area { display:flex; flex-direction:column; align-items:center; gap:10px; padding:20px 0 40px; z-index:2; }
        .dj-bow-btn { background:linear-gradient(135deg,#8B6914,#C8961E); color:#fff; border:none; border-radius:50px; padding:16px 48px; font-size:18px; font-weight:700; font-family:'Noto Serif KR',serif; letter-spacing:3px; cursor:pointer; transition:transform 0.2s,box-shadow 0.2s; box-shadow:0 4px 20px rgba(139,105,20,0.4); }
        .dj-bow-btn:hover:not(:disabled) { transform:scale(1.05); box-shadow:0 6px 30px rgba(139,105,20,0.6); }
        .dj-bow-btn:active:not(:disabled) { transform:scale(0.97); }
        .dj-bow-btn.bowing { opacity:0.7; cursor:not-allowed; }
        .dj-bow-count { font-size:14px; color:rgba(245,230,184,0.6); letter-spacing:1px; }
        .dj-bow-overlay { position:fixed; inset:0; z-index:100; pointer-events:none; animation:djBow 2s ease-in-out forwards; }
        @keyframes djBow { 0%{background:transparent} 10%{background:rgba(245,208,96,0.18)} 30%{background:rgba(245,208,96,0.1)} 70%{background:rgba(245,208,96,0.05)} 100%{background:transparent} }
        .dj-altar { display:flex; align-items:flex-end; justify-content:center; gap:clamp(20px,6vw,40px); padding:0 20px; z-index:2; margin-top:-10px; }
        .dj-candle-wrap { position:relative; }
        .dj-candle-glow { position:absolute; top:0; left:50%; transform:translateX(-50%); width:50px; height:50px; border-radius:50%; background:radial-gradient(circle,rgba(255,200,50,0.25) 0%,transparent 70%); animation:djCandleGlow 1.2s ease-in-out infinite alternate; pointer-events:none; }
        @keyframes djCandleGlow { 0%{opacity:0.5;transform:translateX(-50%) scale(0.9)} 100%{opacity:1;transform:translateX(-50%) scale(1.2)} }
        .dj-flame-outer { animation:djFlame1 0.6s ease-in-out infinite alternate; transform-origin:center bottom; }
        .dj-flame-mid { animation:djFlame2 0.5s ease-in-out 0.1s infinite alternate; transform-origin:center bottom; }
        .dj-flame-inner { animation:djFlame3 0.4s ease-in-out 0.2s infinite alternate; transform-origin:center bottom; }
        @keyframes djFlame1 { 0%{transform:scaleX(0.85) scaleY(0.9);opacity:0.7} 100%{transform:scaleX(1.1) scaleY(1.1);opacity:1} }
        @keyframes djFlame2 { 0%{transform:scaleX(0.9) scaleY(0.85)} 100%{transform:scaleX(1.05) scaleY(1.15)} }
        @keyframes djFlame3 { 0%{transform:scaleY(0.8);opacity:0.6} 100%{transform:scaleY(1.2);opacity:0.9} }
        .dj-incense-wrap { position:relative; }
        .dj-smoke-container { position:absolute; top:-10px; left:50%; transform:translateX(-50%); width:40px; height:60px; pointer-events:none; }
        .dj-smoke { position:absolute; bottom:0; border-radius:50%; background:rgba(200,190,170,0.15); filter:blur(3px); }
        .dj-smoke-1 { left:12px; width:8px; height:8px; animation:djSmoke 3.5s ease-out infinite; }
        .dj-smoke-2 { left:18px; width:6px; height:6px; animation:djSmoke 3.5s ease-out 0.8s infinite; }
        .dj-smoke-3 { left:15px; width:7px; height:7px; animation:djSmoke 3.5s ease-out 1.6s infinite; }
        @keyframes djSmoke {
          0% { transform:translateY(0) scale(1); opacity:0.4; }
          30% { transform:translateY(-18px) translateX(4px) scale(1.5); opacity:0.3; }
          60% { transform:translateY(-36px) translateX(-3px) scale(2.2); opacity:0.15; }
          100% { transform:translateY(-55px) translateX(6px) scale(3); opacity:0; }
        }
        @media(max-width:500px) { .dj-plaque{letter-spacing:8px} }
      `}</style>
    </div>
  );
}
