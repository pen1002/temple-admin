'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'next/navigation';

export default function DaeungjeonPage() {
  const { slug } = useParams<{ slug: string }>();
  const [modelLoaded, setModelLoaded] = useState(false);
  const [bowCount, setBowCount] = useState(0);
  const [totalBows, setTotalBows] = useState(0);
  const [bowing, setBowing] = useState(false);
  const [candlesLit, setCandlesLit] = useState(0);
  const [incenseBurning, setIncenseBurning] = useState(false);
  const [lanternCount, setLanternCount] = useState(0);
  const tiltRef = useRef<HTMLDivElement>(null);
  const targetTilt = useRef({ x: 0, y: 0 });
  const currentTilt = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);

  const fetchData = useCallback(async () => {
    const res = await fetch(`/api/cyber/offering?temple_slug=${slug}&type=bow&limit=1`)
    const data = await res.json()
    if (Array.isArray(data)) setTotalBows(data.length)
  }, [slug])
  useEffect(() => { fetchData() }, [fetchData])

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      targetTilt.current = { x: -Math.max(-1, Math.min(1, ny)) * 15, y: Math.max(-1, Math.min(1, nx)) * 15 };
    };
    const onLeave = () => { targetTilt.current = { x: 0, y: 0 }; };
    const animate = () => {
      currentTilt.current.x += (targetTilt.current.x - currentTilt.current.x) * 0.06;
      currentTilt.current.y += (targetTilt.current.y - currentTilt.current.y) * 0.06;
      if (tiltRef.current) tiltRef.current.style.transform = `perspective(1000px) rotateX(${currentTilt.current.x}deg) rotateY(${currentTilt.current.y}deg)`;
      rafRef.current = requestAnimationFrame(animate);
    };
    window.addEventListener('mousemove', onMove);
    document.documentElement.addEventListener('mouseleave', onLeave);
    rafRef.current = requestAnimationFrame(animate);
    return () => { window.removeEventListener('mousemove', onMove); document.documentElement.removeEventListener('mouseleave', onLeave); if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, []);

  const doBow = useCallback(async () => {
    if (bowing) return;
    setBowing(true);
    setBowCount(p => p + 1);
    await fetch('/api/cyber/offering', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ temple_slug: slug, type: 'bow', name: '참배자' }) });
    await fetchData();
    setTimeout(() => { setBowing(false); window.location.href = `/${slug}/cyber` }, 5000);
  }, [bowing, slug, fetchData]);

  const doCandle = () => { if (candlesLit < 2) setCandlesLit(p => p + 1); };
  const doIncense = () => { setIncenseBurning(true); };
  const doLantern = () => { if (lanternCount < 8) setLanternCount(p => p + 1); };

  return (
    <div className="dj-root">
      <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@400;700;900&display=swap" rel="stylesheet" />
      <svg className="dj-ceiling" viewBox="0 0 600 50" preserveAspectRatio="none">
        <rect width="600" height="50" fill="#3D1F0A"/><rect y="0" width="600" height="6" fill="#1B6B5A"/><rect y="6" width="600" height="3" fill="#C83232"/><rect y="9" width="600" height="4" fill="#1B6B5A"/><rect y="13" width="600" height="2" fill="#F5D060"/><rect y="15" width="600" height="6" fill="#C83232"/><rect y="21" width="600" height="3" fill="#2255AA"/><rect y="24" width="600" height="2" fill="#F5D060"/><rect y="26" width="600" height="4" fill="#1B6B5A"/><rect y="40" width="600" height="10" fill="#8B4513"/><rect y="38" width="600" height="3" fill="#C8961E"/>
      </svg>
      <div className="dj-col dj-col-l" /><div className="dj-col dj-col-r" />
      <div className="dj-plaque"><div className="dj-plaque-text">大 雄 殿</div><div className="dj-plaque-sub">미래사 사이버법당 · 누적 참배 {totalBows.toLocaleString()}회</div></div>
      <div className="dj-lanterns">
        {Array.from({ length: lanternCount }).map((_, i) => {
          const colors = ['#ff6b6b','#ff8844','#ffaa33','#ff5555','#ee4444','#ff7744','#ffcc00','#ff9966'];
          return (<div key={i} className="dj-lantern" style={{ left: `${10 + (i * 11) % 80}%`, top: `${10 + Math.sin(i * 1.5) * 30}px`, animationDelay: `${i * 0.3}s` }}>
            <div className="lantern-string" /><div className="lantern-body" style={{ background: `radial-gradient(circle at 50% 30%, ${colors[i % colors.length]}, #aa2222)` }}><div className="lantern-glow" /></div><div className="lantern-tassel" />
          </div>);
        })}
      </div>
      <div className="dj-halo" />
      <div className="dj-buddha-wrap">
        <div className="dj-tilt" ref={tiltRef}>
          <iframe title="금동여래입상 - 국가유산청" src="https://sketchfab.com/models/7d18e55a52dc4a73a2060c4d42afc998/embed?autostart=1&ui_theme=dark&ui_infos=0&ui_controls=0&ui_stop=0&ui_watermark=0&ui_watermark_link=0" className="dj-iframe" allow="autoplay; fullscreen; xr-spatial-tracking" onLoad={() => setModelLoaded(true)} />
          {!modelLoaded && <div className="dj-loader"><div className="dj-spinner" /><span>여래입상 로딩 중...</span></div>}
        </div>
      </div>
      <div className="dj-altar-area">
        <svg viewBox="0 0 500 160" className="dj-altar-svg">
          <rect x="100" y="60" width="300" height="90" rx="4" fill="#6B3A1E"/><rect x="100" y="60" width="300" height="8" rx="3" fill="#C8961E"/><rect x="100" y="140" width="300" height="10" rx="2" fill="#4A2810"/>
          <g opacity={candlesLit >= 1 ? 1 : 0.25}>
            {candlesLit >= 1 && <circle cx="170" cy="42" r="18" fill="rgba(255,200,50,0.1)"><animate attributeName="r" values="16;20;16" dur="2s" repeatCount="indefinite"/></circle>}
            <rect x="167" y="68" width="6" height="3" rx="1" fill="#B8860B"/><rect x="168" y="42" width="4" height="28" rx="1.5" fill="#F5E6B8"/><rect x="169.5" y="38" width="1" height="5" fill="#666"/>
            {candlesLit >= 1 && <g><ellipse cx="170" cy="34" rx="4" ry="8" fill="#FFD700" opacity="0.9"><animate attributeName="ry" values="7;9;7" dur="2.5s" repeatCount="indefinite"/></ellipse><ellipse cx="170" cy="33" rx="2.5" ry="5" fill="#FFA500" opacity="0.8"/><ellipse cx="170" cy="32" rx="1.5" ry="3" fill="#fff" opacity="0.9"/></g>}
          </g>
          <g opacity={candlesLit >= 2 ? 1 : 0.25}>
            {candlesLit >= 2 && <circle cx="330" cy="42" r="18" fill="rgba(255,200,50,0.1)"><animate attributeName="r" values="16;20;16" dur="2.3s" repeatCount="indefinite"/></circle>}
            <rect x="327" y="68" width="6" height="3" rx="1" fill="#B8860B"/><rect x="328" y="42" width="4" height="28" rx="1.5" fill="#F5E6B8"/><rect x="329.5" y="38" width="1" height="5" fill="#666"/>
            {candlesLit >= 2 && <g><ellipse cx="330" cy="34" rx="4" ry="8" fill="#FFD700" opacity="0.9"><animate attributeName="ry" values="8;9.5;8" dur="2.2s" repeatCount="indefinite"/></ellipse><ellipse cx="330" cy="33" rx="2.5" ry="5" fill="#FFA500" opacity="0.8"/><ellipse cx="330" cy="32" rx="1.5" ry="3" fill="#fff" opacity="0.9"/></g>}
          </g>
          <ellipse cx="250" cy="68" rx="24" ry="4" fill="#8B6914"/><path d="M230,68 Q227,52 232,42 L268,42 Q273,52 270,68 Z" fill="#A07818"/><rect x="236" y="40" width="28" height="4" rx="1.5" fill="#C8961E"/><ellipse cx="250" cy="41" rx="12" ry="2" fill="#5C3A1E"/>
          <line x1="247" y1="40" x2="247" y2="12" stroke={incenseBurning ? '#8B4513' : '#999'} strokeWidth="1.2"/><line x1="250" y1="40" x2="250" y2="8" stroke={incenseBurning ? '#8B4513' : '#999'} strokeWidth="1.2"/><line x1="253" y1="40" x2="253" y2="14" stroke={incenseBurning ? '#8B4513' : '#999'} strokeWidth="1.2"/>
          {incenseBurning && <>{[{ cx: 249, cy: 4, d: 4 }, { cx: 251, cy: 0, d: 3.5 }, { cx: 250, cy: -5, d: 4.5 }].map((s, i) => <circle key={i} cx={s.cx} cy={s.cy} r="2" fill="rgba(200,200,200,0.3)"><animate attributeName="cy" values={`${s.cy};${s.cy - 30};${s.cy - 60}`} dur={`${s.d}s`} repeatCount="indefinite"/><animate attributeName="r" values="2;4;6" dur={`${s.d}s`} repeatCount="indefinite"/><animate attributeName="opacity" values="0.4;0.15;0" dur={`${s.d}s`} repeatCount="indefinite"/></circle>)}
            <circle cx="247" cy="12" r="1.5" fill="#FF6633" opacity="0.8"/><circle cx="250" cy="8" r="1.5" fill="#FF6633" opacity="0.9"/><circle cx="253" cy="14" r="1.5" fill="#FF6633" opacity="0.7"/>
          </>}
        </svg>
      </div>
      <div className="dj-credit">3D 모델 출처: 국가유산청(Korea Heritage Service) | 금동여래입상</div>
      <div className="dj-counter">{[candlesLit > 0 && `촛불 ${candlesLit}개`, incenseBurning && '향 공양', lanternCount > 0 && `연등 ${lanternCount}개`, bowCount > 0 && `${bowCount}배 참배`].filter(Boolean).join(' · ')}</div>
      <div className="dj-actions">
        <button className="dj-btn" onClick={doCandle} disabled={candlesLit >= 2}>{candlesLit >= 2 ? '촛불 완료' : '🕯 촛불 켜기'}</button>
        <button className="dj-btn" onClick={doIncense} disabled={incenseBurning}>{incenseBurning ? '향 공양 중' : '🪔 향 피우기'}</button>
        <button className="dj-btn" onClick={doLantern} disabled={lanternCount >= 8}>🏮 연등 달기</button>
        <button className={`dj-btn dj-btn-bow ${bowing ? 'bowing' : ''}`} onClick={doBow} disabled={bowing}>{bowing ? '🙏 삼배 올리는 중...' : '🙏 부처님께 삼배올립니다'}</button>
      </div>
      {bowing && <div className="dj-flash" />}
      <div className="dj-floor" />
      <style>{`
        .dj-root{width:100%;min-height:100vh;display:flex;flex-direction:column;align-items:center;position:relative;overflow:hidden;background:linear-gradient(180deg,#2a1a0a 0%,#3D1F0A 40%,#2a1a0a 100%);font-family:'Noto Serif KR',serif;color:#F5E6B8}
        .dj-ceiling{position:absolute;top:0;left:0;width:100%;height:50px;z-index:2}
        .dj-col{position:absolute;top:0;width:40px;height:100%;z-index:3;background:#A0281E;border-radius:3px}.dj-col-l{left:5%}.dj-col-r{right:5%}
        .dj-plaque{position:relative;z-index:4;text-align:center;margin-top:56px}
        .dj-plaque-text{font-size:clamp(24px,6vw,32px);font-weight:900;color:#F5D060;letter-spacing:10px;text-shadow:0 2px 8px rgba(0,0,0,0.5)}
        .dj-plaque-sub{font-size:11px;color:rgba(245,230,184,0.4);letter-spacing:2px;margin-top:2px}
        .dj-lanterns{position:absolute;top:50px;left:0;width:100%;height:120px;z-index:5;pointer-events:none}
        .dj-lantern{position:absolute;animation:sway 4s ease-in-out infinite alternate}
        .lantern-string{position:absolute;top:-16px;left:50%;width:1px;height:16px;background:#886644}
        .lantern-body{width:28px;height:34px;border-radius:50%;border:1px solid #aa2222;position:relative}
        .lantern-glow{position:absolute;inset:-6px;border-radius:50%;background:radial-gradient(circle,rgba(255,100,50,0.25) 0%,transparent 70%)}
        .lantern-tassel{position:absolute;bottom:-10px;left:50%;transform:translateX(-50%);width:2px;height:10px;background:#cc3333}
        @keyframes sway{0%{transform:rotate(-3deg)}100%{transform:rotate(3deg)}}
        .dj-halo{position:absolute;top:140px;left:50%;transform:translateX(-50%);width:220px;height:220px;border-radius:50%;z-index:3;background:radial-gradient(circle,rgba(245,208,96,0.25) 0%,rgba(245,208,96,0.05) 50%,transparent 75%);animation:halo 3s ease-in-out infinite alternate}
        @keyframes halo{0%{transform:translateX(-50%) scale(0.95);opacity:0.6}100%{transform:translateX(-50%) scale(1.08);opacity:1}}
        .dj-buddha-wrap{position:relative;z-index:4;width:calc(100% - 90px);max-width:360px;height:clamp(260px,55vw,320px);margin-top:8px}
        .dj-tilt{width:100%;height:100%;will-change:transform}.dj-iframe{width:100%;height:100%;border:none;border-radius:8px}
        .dj-loader{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;background:rgba(26,26,26,0.9);border-radius:8px;font-size:12px;color:rgba(245,230,184,0.5)}
        .dj-spinner{width:32px;height:32px;border:2px solid rgba(245,208,96,0.2);border-top-color:#F5D060;border-radius:50%;animation:spin 1s linear infinite}
        @keyframes spin{to{transform:rotate(360deg)}}
        .dj-altar-area{position:relative;z-index:5;width:100%;max-width:420px;margin-top:-20px}.dj-altar-svg{width:100%;height:auto;display:block;overflow:visible}
        .dj-credit{font-size:9px;color:rgba(245,230,184,0.2);text-align:center;margin-top:4px;z-index:5}
        .dj-counter{font-size:11px;color:rgba(245,230,184,0.5);text-align:center;margin-top:8px;z-index:5;min-height:16px;letter-spacing:1px}
        .dj-actions{display:flex;gap:8px;flex-wrap:wrap;justify-content:center;margin-top:12px;padding:0 16px 24px;z-index:6}
        .dj-btn{background:rgba(139,105,20,0.85);color:#F5E6B8;border:1px solid rgba(245,230,184,0.3);border-radius:20px;padding:10px 18px;font-size:13px;font-weight:700;font-family:'Noto Serif KR',serif;cursor:pointer;letter-spacing:1px;transition:all 0.2s;white-space:nowrap}
        .dj-btn:hover:not(:disabled){background:rgba(200,150,30,0.9);transform:scale(1.05)}.dj-btn:active:not(:disabled){transform:scale(0.96)}.dj-btn:disabled{opacity:0.5;cursor:not-allowed}.dj-btn.bowing{opacity:0.6}
        .dj-btn-bow{background:linear-gradient(135deg,#8B6914,#C8961E);padding:12px 24px;font-size:15px;border-radius:30px}
        .dj-flash{position:fixed;inset:0;z-index:100;pointer-events:none;animation:bow 5s ease-in-out forwards}
        @keyframes bow{0%{background:transparent}10%{background:rgba(245,208,96,0.18)}30%{background:rgba(245,208,96,0.1)}70%{background:rgba(245,208,96,0.05)}100%{background:transparent}}
        .dj-floor{position:absolute;bottom:0;left:0;width:100%;height:80px;z-index:1;background:linear-gradient(180deg,transparent,#5C3A1E)}
        @media(max-width:500px){.dj-col{width:24px}.dj-col-l{left:2%}.dj-col-r{right:2%}.dj-buddha-wrap{width:calc(100% - 60px);max-width:280px}.dj-btn{padding:8px 14px;font-size:12px}.dj-btn-bow{padding:10px 20px;font-size:13px}}
      `}</style>
    </div>
  );
}
