'use client';
import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams } from 'next/navigation';
import { useCyberTemple } from '@/lib/useCyberTemple';

const RELATIONS = ['부', '모', '조부', '조모', '배우자', '자녀', '형제자매', '기타']
const PER_ROUND = 30, COLS = 5

interface Memorial { id: string; name: string; deceased: string; relationship: string; wish: string; created_at: string }

export default function JijangjeonPage() {
  const { slug } = useParams<{ slug: string }>();
  const temple = useCyberTemple(slug);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [memorials, setMemorials] = useState<Memorial[]>([]);
  const [name, setName] = useState(''); const [deceased, setDeceased] = useState('');
  const [relationship, setRelationship] = useState('부'); const [wish, setWish] = useState('');
  const [contact, setContact] = useState(''); const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false); const [kakaoText, setKakaoText] = useState('');
  const [viewRound, setViewRound] = useState(1);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; deceased: string; name: string; rel: string; wish?: string; date?: string } | null>(null);
  const [candlesLit, setCandlesLit] = useState(0);
  const [incenseBurning, setIncenseBurning] = useState(false);
  const [spiritLanterns, setSpiritLanterns] = useState(0);
  const tiltRef = useRef<HTMLDivElement>(null);
  const targetTilt = useRef({ x: 0, y: 0 });
  const currentTilt = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);

  const fetchData = useCallback(async () => {
    const res = await fetch(`/api/cyber/offering?temple_slug=${slug}&type=memorial&limit=10000`);
    const data = await res.json();
    if (Array.isArray(data)) setMemorials(data);
  }, [slug]);
  useEffect(() => { fetchData() }, [fetchData]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => { targetTilt.current = { x: -((e.clientY / window.innerHeight) * 2 - 1) * 12, y: ((e.clientX / window.innerWidth) * 2 - 1) * 12 }; };
    const onLeave = () => { targetTilt.current = { x: 0, y: 0 }; };
    const animate = () => { currentTilt.current.x += (targetTilt.current.x - currentTilt.current.x) * 0.06; currentTilt.current.y += (targetTilt.current.y - currentTilt.current.y) * 0.06; if (tiltRef.current) tiltRef.current.style.transform = `perspective(1000px) rotateX(${currentTilt.current.x}deg) rotateY(${currentTilt.current.y}deg)`; rafRef.current = requestAnimationFrame(animate); };
    window.addEventListener('mousemove', onMove); document.documentElement.addEventListener('mouseleave', onLeave); rafRef.current = requestAnimationFrame(animate);
    return () => { window.removeEventListener('mousemove', onMove); document.documentElement.removeEventListener('mouseleave', onLeave); cancelAnimationFrame(rafRef.current); };
  }, []);

  const totalRounds = Math.max(1, Math.ceil(memorials.length / PER_ROUND) + 1);
  const roundStart = (viewRound - 1) * PER_ROUND;
  const roundCount = Math.min(Math.max(0, memorials.length - roundStart), PER_ROUND);

  const handleSubmit = async () => {
    if (!name.trim() || !deceased.trim()) return; setLoading(true);
    const res = await fetch('/api/cyber/offering', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ temple_slug: slug, type: 'memorial', name: name.trim(), deceased: deceased.trim(), relationship, wish: wish.trim(), contact: contact.trim(), amount: 5000 }) });
    const result = await res.json(); if (result.kakaoText) setKakaoText(result.kakaoText);
    await fetchData(); setSubmitted(true); setLoading(false);
  };

  const accent = '#9b7acc', accentRgb = '155,122,204';
  const inp: React.CSSProperties = { background: 'rgba(255,255,255,0.06)', border: `1px solid rgba(${accentRgb},0.25)`, borderRadius: 8, padding: '10px 14px', color: 'rgba(220,200,255,0.9)', fontSize: 14, outline: 'none', width: '100%' };

  return (
    <div className="jj-root">
      <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@400;700;900&display=swap" rel="stylesheet" />
      {/* 단청 천장 */}
      <svg className="jj-ceiling" viewBox="0 0 600 50" preserveAspectRatio="none">
        <rect width="600" height="50" fill="#1a1028"/><rect y="0" width="600" height="6" fill="#2a1848"/><rect y="6" width="600" height="3" fill="#6a3a8a"/><rect y="9" width="600" height="2" fill="#c9a84c"/><rect y="11" width="600" height="4" fill="#3a2060"/><rect y="15" width="600" height="3" fill="#8a5ab0"/><rect y="40" width="600" height="10" fill="#2a1040"/><rect y="38" width="600" height="3" fill="#c9a84c"/>
      </svg>
      <div className="jj-col jj-col-l" /><div className="jj-col jj-col-r" />
      <div className="jj-plaque"><div className="jj-plaque-text">地 藏 殿</div><div className="jj-plaque-sub">{temple?.name || slug} 사이버법당 · {memorials.length}위 봉안</div></div>

      {/* 지장보살 3D */}
      <div className="jj-halo" />
      <div className="jj-buddha-wrap">
        <div className="jj-tilt" ref={tiltRef}>
          <iframe title="지장보살상 - Ksitigarbha Bodhisattva" src="https://sketchfab.com/models/86ac52263ea74a16ac2bf8900dcd8456/embed?autostart=1&ui_theme=dark&ui_infos=0&ui_controls=0&ui_stop=0&ui_watermark=0&ui_watermark_link=0" className="jj-iframe" allow="autoplay; fullscreen; xr-spatial-tracking" onLoad={() => setModelLoaded(true)} />
          {!modelLoaded && <div className="jj-loader"><div className="jj-spinner" /><span>지장보살 로딩 중...</span></div>}
        </div>
      </div>

      {/* 공양대 SVG — 대웅전과 동일 방식 */}
      <div className="jj-altar-area">
        <svg viewBox="0 0 500 160" className="jj-altar-svg">
          <rect x="100" y="60" width="300" height="90" rx="4" fill="#2a1040"/><rect x="100" y="60" width="300" height="8" rx="3" fill="#9b7acc"/><rect x="100" y="140" width="300" height="10" rx="2" fill="#1a0828"/>
          {/* 좌측 촛불 */}
          <g opacity={candlesLit >= 1 ? 1 : 0.25}>
            {candlesLit >= 1 && <circle cx="170" cy="38" r="36" fill="rgba(212,184,255,0.12)"><animate attributeName="r" values="32;40;32" dur="2s" repeatCount="indefinite"/></circle>}
            <rect x="165" y="68" width="10" height="4" rx="2" fill="#9b7acc"/><rect x="166" y="38" width="8" height="32" rx="3" fill="#F5E6B8"/><rect x="169" y="32" width="2" height="8" fill="#666"/>
            {candlesLit >= 1 && <g><ellipse cx="170" cy="26" rx="8" ry="16" fill="#FFD700" opacity="0.9"><animate attributeName="ry" values="14;18;14" dur="2.5s" repeatCount="indefinite"/></ellipse><ellipse cx="170" cy="24" rx="5" ry="10" fill="#FFA500" opacity="0.8"/><ellipse cx="170" cy="22" rx="3" ry="6" fill="#fff" opacity="0.9"/></g>}
          </g>
          {/* 우측 촛불 */}
          <g opacity={candlesLit >= 2 ? 1 : 0.25}>
            {candlesLit >= 2 && <circle cx="330" cy="38" r="36" fill="rgba(212,184,255,0.12)"><animate attributeName="r" values="32;40;32" dur="2.3s" repeatCount="indefinite"/></circle>}
            <rect x="325" y="68" width="10" height="4" rx="2" fill="#9b7acc"/><rect x="326" y="38" width="8" height="32" rx="3" fill="#F5E6B8"/><rect x="329" y="32" width="2" height="8" fill="#666"/>
            {candlesLit >= 2 && <g><ellipse cx="330" cy="26" rx="8" ry="16" fill="#FFD700" opacity="0.9"><animate attributeName="ry" values="16;19;16" dur="2.2s" repeatCount="indefinite"/></ellipse><ellipse cx="330" cy="24" rx="5" ry="10" fill="#FFA500" opacity="0.8"/><ellipse cx="330" cy="22" rx="3" ry="6" fill="#fff" opacity="0.9"/></g>}
          </g>
          {/* 향로 */}
          <ellipse cx="250" cy="68" rx="24" ry="4" fill="#6a4a8a"/><path d="M230,68 Q227,52 232,42 L268,42 Q273,52 270,68 Z" fill="#7a5a9a"/><rect x="236" y="40" width="28" height="4" rx="1.5" fill="#9b7acc"/><ellipse cx="250" cy="41" rx="12" ry="2" fill="#2a1040"/>
          <line x1="247" y1="40" x2="247" y2="12" stroke={incenseBurning ? '#8B4513' : '#999'} strokeWidth="3.6"/><line x1="250" y1="40" x2="250" y2="8" stroke={incenseBurning ? '#8B4513' : '#999'} strokeWidth="3.6"/><line x1="253" y1="40" x2="253" y2="14" stroke={incenseBurning ? '#8B4513' : '#999'} strokeWidth="3.6"/>
          {incenseBurning && <>{[{ cx: 248, cy: 4, d: 4 }, { cx: 251, cy: 0, d: 3.5 }, { cx: 250, cy: -5, d: 4.5 }, { cx: 246, cy: -2, d: 5 }, { cx: 253, cy: 2, d: 3.8 }, { cx: 249, cy: -8, d: 4.2 }].map((s, i) => <circle key={i} cx={s.cx} cy={s.cy} r="4" fill="rgba(200,200,220,0.9)"><animate attributeName="cy" values={`${s.cy};${s.cy - 60};${s.cy - 120}`} dur={`${s.d}s`} repeatCount="indefinite"/><animate attributeName="r" values="4;8;12" dur={`${s.d}s`} repeatCount="indefinite"/><animate attributeName="opacity" values="0.9;0.4;0" dur={`${s.d}s`} repeatCount="indefinite"/></circle>)}
            <circle cx="247" cy="12" r="2.5" fill="#FF6633" opacity="0.8"/><circle cx="250" cy="8" r="2.5" fill="#FF6633" opacity="0.9"/><circle cx="253" cy="14" r="2.5" fill="#FF6633" opacity="0.7"/>
          </>}
        </svg>
      </div>
      {/* 영가등 */}
      <div className="jj-lanterns">
        {Array.from({ length: spiritLanterns }).map((_, i) => {
          const colors = ['#d4b8ff','#c9a8f0','#b898e8','#aa88dd','#9b7acc','#8a6abb','#c0a0ee','#d0b0ff'];
          return (<div key={i} className="jj-lantern" style={{ left: `${10 + (i * 11) % 80}%`, top: `${10 + Math.sin(i * 1.5) * 30}px`, animationDelay: `${i * 0.3}s` }}>
            <div className="jj-lantern-string" /><div className="jj-lantern-body" style={{ background: `radial-gradient(circle at 50% 30%, ${colors[i % colors.length]}, #3a1858)` }}><div className="jj-lantern-glow" /></div><div className="jj-lantern-tassel" />
          </div>);
        })}
      </div>
      <div className="jj-credit">3D 모델: Truong Kieu Van (Sketchfab CC Attribution) | 지장보살상</div>
      <div className="jj-counter">{[candlesLit > 0 && `촛불 ${candlesLit}개`, incenseBurning && '향 공양', spiritLanterns > 0 && `영가등 ${spiritLanterns}개`].filter(Boolean).join(' · ')}</div>
      <div className="jj-actions">
        <button className="jj-btn" onClick={() => setCandlesLit(2)} disabled={candlesLit >= 2}>{candlesLit >= 2 ? '촛불 완료' : '🕯 촛불 켜기'}</button>
        <button className="jj-btn" onClick={() => setIncenseBurning(true)} disabled={incenseBurning}>{incenseBurning ? '향 공양 중' : '🪔 향 피우기'}</button>
        <button className="jj-btn" onClick={() => spiritLanterns < 8 && setSpiritLanterns(p => p + 1)} disabled={spiritLanterns >= 8}>🪷 영가등 켜기</button>
      </div>

      {/* 위패 봉안 영역 */}
      <div style={{ width: '100%', maxWidth: 600, margin: '0 auto', padding: '16px 16px 60px' }}>
        <h3 style={{ textAlign: 'center', color: '#d4b8ff', fontSize: 18, fontWeight: 600, letterSpacing: 3, marginBottom: 6 }}>위패 봉안</h3>
        <p style={{ textAlign: 'center', fontSize: 11, color: `rgba(${accentRgb},0.35)`, marginBottom: 16 }}>위패 1위 봉안 1년 5,000원</p>

        {/* 차수 네비 */}
        <div style={{ textAlign: 'center', marginBottom: 8 }}><span style={{ color: `rgba(${accentRgb},0.7)`, fontSize: 13 }}>전체 {memorials.length.toLocaleString()}위 봉안</span></div>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16, marginBottom: 12 }}>
          <button onClick={() => setViewRound(Math.max(1, viewRound - 1))} disabled={viewRound <= 1} style={{ background: 'none', border: `1px solid rgba(${accentRgb},0.2)`, color: viewRound <= 1 ? `rgba(${accentRgb},0.2)` : accent, borderRadius: 6, padding: '5px 12px', cursor: 'pointer', fontSize: 13 }}>◂</button>
          <span style={{ color: accent, fontSize: 14, fontWeight: 600 }}>{viewRound}차 ({roundCount}/{PER_ROUND})</span>
          <button onClick={() => setViewRound(viewRound + 1)} style={{ background: 'none', border: `1px solid rgba(${accentRgb},0.2)`, color: accent, borderRadius: 6, padding: '5px 12px', cursor: 'pointer', fontSize: 13 }}>▸</button>
        </div>

        {/* 위패 격자 5×6 */}
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${COLS}, 1fr)`, gap: 5, marginBottom: 24 }}>
          {Array.from({ length: PER_ROUND }).map((_, i) => {
            const gi = roundStart + i; const lit = gi < memorials.length; const m = lit ? memorials[gi] : null;
            return (
              <div key={i} onMouseEnter={e => m && setTooltip({ x: e.clientX, y: e.clientY, deceased: m.deceased, name: m.name, rel: m.relationship, wish: m.wish, date: m.created_at })} onMouseLeave={() => setTooltip(null)} onClick={e => m && setTooltip({ x: e.clientX, y: e.clientY, deceased: m.deceased, name: m.name, rel: m.relationship, wish: m.wish, date: m.created_at })}
                style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2px 0' }}>
                {lit && <div style={{ position: 'absolute', top: -2, left: '50%', transform: 'translateX(-50%)', width: '120%', height: '80%', background: 'radial-gradient(ellipse at 50% 40%, rgba(212,184,255,0.3) 0%, transparent 75%)', borderRadius: '50%', animation: 'jjGlow 3s ease-in-out infinite alternate', pointerEvents: 'none' }} />}
                <svg viewBox="0 0 40 70" style={{ width: '100%', maxWidth: 80, position: 'relative', zIndex: 1, filter: lit ? 'drop-shadow(0 0 8px rgba(212,184,255,0.5))' : 'grayscale(1) opacity(0.15)' }}>
                  <path d="M11 54 L11 16 Q11 6 20 6 Q29 6 29 16 L29 54 Z" fill={lit ? '#0a0a0a' : '#1a1a1a'} stroke={lit ? '#c9a84c' : '#333'} strokeWidth="0.8" />
                  <path d="M13 52 L13 18 Q13 9 20 9 Q27 9 27 18 L27 52 Z" fill="none" stroke={lit ? 'rgba(201,168,76,0.5)' : '#333'} strokeWidth="0.4" />
                  {lit && m && <text x="20" y="34" textAnchor="middle" fill="#c9a84c" fontSize="7" fontWeight="700" writingMode="tb" style={{ textShadow: '0 0 4px rgba(201,168,76,0.5)' }}>{m.deceased.slice(0, 3)}</text>}
                  <ellipse cx="20" cy="56" rx="12" ry="3" fill={lit ? '#e8a88c' : '#555'} />
                  <rect x="10" y="60" width="20" height="5" rx="1" fill={lit ? '#1a1a2e' : '#222'} stroke={lit ? '#c9a84c' : '#333'} strokeWidth="0.4" />
                </svg>
              </div>
            );
          })}
        </div>
        <style>{`@keyframes jjGlow { 0% { opacity: 0.5; } 100% { opacity: 1; } }`}</style>

        {tooltip && (
          <div style={{ position: 'fixed', left: Math.min(tooltip.x + 10, (typeof window !== 'undefined' ? window.innerWidth : 400) - 180), top: Math.max(tooltip.y - 70, 8), background: 'rgba(12,4,28,0.97)', border: `1px solid rgba(${accentRgb},0.4)`, borderRadius: 8, padding: '8px 12px', pointerEvents: 'none', zIndex: 100 }}>
            <div style={{ fontSize: 13, color: 'rgba(220,200,255,0.95)', fontWeight: 700 }}>{tooltip.deceased} 영가지위</div>
            <div style={{ fontSize: 11, color: `rgba(${accentRgb},0.6)`, marginTop: 2 }}>신청: {tooltip.name} ({tooltip.rel})</div>
            {tooltip.wish && <div style={{ fontSize: 10, color: `rgba(${accentRgb},0.45)`, marginTop: 2 }}>{tooltip.wish.slice(0, 30)}</div>}
            {tooltip.date && <div style={{ fontSize: 10, color: `rgba(${accentRgb},0.3)`, marginTop: 2 }}>{new Date(tooltip.date).toLocaleDateString('ko-KR')}</div>}
          </div>
        )}

        {/* 봉안 폼 */}
        {!submitted ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="신청자 성함 *" style={inp} />
            <input value={deceased} onChange={e => setDeceased(e.target.value)} placeholder="영가 존함 *" style={inp} />
            <select value={relationship} onChange={e => setRelationship(e.target.value)} style={{ ...inp, appearance: 'none' }}>{RELATIONS.map(r => <option key={r} value={r}>{r}</option>)}</select>
            <textarea value={wish} onChange={e => setWish(e.target.value)} placeholder="발원문 (선택)" rows={3} style={{ ...inp, resize: 'none' }} />
            <input value={contact} onChange={e => setContact(e.target.value)} type="tel" placeholder="연락처 (010-0000-0000)" style={inp} />
            <div style={{ textAlign: 'center', padding: '4px 0' }}><span style={{ color: 'rgba(220,200,255,0.95)', fontSize: 15, fontWeight: 600 }}>위패 1위 봉안 1년 5,000원</span></div>
            <button onClick={handleSubmit} disabled={loading || !name.trim() || !deceased.trim()} style={{ background: loading ? `rgba(${accentRgb},0.15)` : `rgba(${accentRgb},0.25)`, border: `1px solid rgba(${accentRgb},0.5)`, color: 'rgba(220,200,255,0.95)', borderRadius: 8, padding: 14, fontSize: 15, cursor: 'pointer', fontWeight: 500 }}>{loading ? '접수 중...' : '위패 봉안 신청'}</button>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <div style={{ fontSize: 42, marginBottom: 12 }}>🪷</div>
            <p style={{ color: 'rgba(220,200,255,0.95)', fontSize: 16, fontWeight: 500, lineHeight: 1.9 }}>위패가 봉안되었습니다.</p>
            <p style={{ color: `rgba(${accentRgb},0.5)`, fontSize: 13, marginTop: 8 }}>조상 영가의 극락왕생을 기원합니다.</p>
            {kakaoText && <button onClick={() => { navigator.clipboard.writeText(kakaoText); alert('카카오톡에 붙여넣기하여 공유해 주세요.') }} style={{ marginTop: 12, background: '#FEE500', border: 'none', color: '#3A1D1D', borderRadius: 8, padding: '8px 20px', fontSize: 13, cursor: 'pointer', fontWeight: 700 }}>카카오톡 공유</button>}
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginTop: 16 }}>
              <button onClick={() => { setSubmitted(false); setName(''); setDeceased(''); setWish(''); setContact('') }} style={{ background: `rgba(${accentRgb},0.15)`, border: `1px solid rgba(${accentRgb},0.4)`, color: 'rgba(220,200,255,0.9)', borderRadius: 8, padding: '10px 20px', cursor: 'pointer', fontSize: 13 }}>추가 봉안</button>
              <a href={`/${slug}/dharma-wheel?grid=1`} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.3)', color: '#c9a84c', borderRadius: 8, padding: '10px 20px', fontSize: 13, textDecoration: 'none' }}>☸ 도량으로</a>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .jj-root{width:100%;min-height:100vh;display:flex;flex-direction:column;align-items:center;position:relative;overflow:hidden;background:linear-gradient(180deg,#0d0820 0%,#1a1028 40%,#0d0820 100%);font-family:'Noto Serif KR',serif;color:#d4b8ff}
        .jj-ceiling{position:absolute;top:0;left:0;width:100%;height:50px;z-index:2}
        .jj-col{position:absolute;top:0;width:36px;height:100%;z-index:3;background:#3a1858;border-radius:3px}.jj-col-l{left:5%}.jj-col-r{right:5%}
        .jj-plaque{position:relative;z-index:4;text-align:center;margin-top:56px}
        .jj-plaque-text{font-size:clamp(24px,6vw,32px);font-weight:900;color:#d4b8ff;letter-spacing:10px;text-shadow:0 2px 8px rgba(155,122,204,0.4)}
        .jj-plaque-sub{font-size:11px;color:rgba(212,184,255,0.4);letter-spacing:2px;margin-top:2px}
        .jj-halo{position:absolute;top:140px;left:50%;transform:translateX(-50%);width:200px;height:200px;border-radius:50%;z-index:3;background:radial-gradient(circle,rgba(155,122,204,0.2) 0%,transparent 70%);animation:jjH 3s ease-in-out infinite alternate}
        @keyframes jjH{0%{transform:translateX(-50%) scale(0.95);opacity:0.5}100%{transform:translateX(-50%) scale(1.08);opacity:1}}
        .jj-buddha-wrap{position:relative;z-index:4;width:100%;max-width:340px;height:clamp(240px,50vw,300px);margin-top:8px}
        .jj-tilt{width:100%;height:100%;will-change:transform}.jj-iframe{width:100%;height:100%;border:none;border-radius:8px}
        .jj-loader{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;background:rgba(13,8,32,0.9);border-radius:8px;font-size:12px;color:rgba(212,184,255,0.5)}
        .jj-spinner{width:32px;height:32px;border:2px solid rgba(155,122,204,0.2);border-top-color:#9b7acc;border-radius:50%;animation:spin 1s linear infinite}
        @keyframes spin{to{transform:rotate(360deg)}}
        .jj-altar-area{position:relative;z-index:5;width:100%;max-width:420px;margin-top:-20px}.jj-altar-svg{width:100%;height:auto;display:block;overflow:visible}
        .jj-lanterns{position:absolute;top:50px;left:0;width:100%;height:120px;z-index:5;pointer-events:none}
        .jj-lantern{position:absolute;animation:jjSway 4s ease-in-out infinite alternate}
        .jj-lantern-string{position:absolute;top:-16px;left:50%;width:1px;height:16px;background:#8a6abb}
        .jj-lantern-body{width:28px;height:34px;border-radius:50%;border:1px solid #6a4a8a;position:relative}
        .jj-lantern-glow{position:absolute;inset:-6px;border-radius:50%;background:radial-gradient(circle,rgba(155,122,204,0.25) 0%,transparent 70%)}
        .jj-lantern-tassel{position:absolute;bottom:-10px;left:50%;transform:translateX(-50%);width:2px;height:10px;background:#9b7acc}
        @keyframes jjSway{0%{transform:rotate(-3deg)}100%{transform:rotate(3deg)}}
        .jj-credit{font-size:9px;color:rgba(212,184,255,0.15);text-align:center;margin-top:4px;z-index:5}
        .jj-counter{font-size:11px;color:rgba(212,184,255,0.5);text-align:center;margin-top:8px;z-index:5;min-height:16px;letter-spacing:1px}
        .jj-actions{display:flex;gap:8px;flex-wrap:wrap;justify-content:center;margin-top:12px;padding:0 16px;z-index:6}
        .jj-btn{background:rgba(155,122,204,0.85);color:#d4b8ff;border:1px solid rgba(212,184,255,0.3);border-radius:20px;padding:10px 18px;font-size:13px;font-weight:700;font-family:'Noto Serif KR',serif;cursor:pointer;letter-spacing:1px;transition:all 0.2s;white-space:nowrap}
        .jj-btn:hover:not(:disabled){background:rgba(155,122,204,0.95);transform:scale(1.05)}.jj-btn:active:not(:disabled){transform:scale(0.96)}.jj-btn:disabled{opacity:0.4;cursor:not-allowed}
        @media(max-width:500px){.jj-col{width:28px}.jj-col-l{left:2%}.jj-col-r{right:2%}.jj-buddha-wrap{max-width:280px}.jj-btn{padding:8px 14px;font-size:12px}}
      `}</style>
    </div>
  );
}
