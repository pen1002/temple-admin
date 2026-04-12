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
    setTimeout(() => { setBowing(false); window.location.href = `/${slug}/cyber` }, 2000);
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
        @keyframes djBow { 0%{background:transparent} 15%{background:rgba(245,208,96,0.15)} 50%{background:rgba(245,208,96,0.08)} 100%{background:transparent} }
        @media(max-width:500px) { .dj-plaque{letter-spacing:8px} }
      `}</style>
    </div>
  );
}
