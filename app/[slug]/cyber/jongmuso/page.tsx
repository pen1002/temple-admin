'use client';

import { useState, useRef } from 'react';
import { useParams } from 'next/navigation';

const GIDO_ITEMS = [
  { name: '초파일봉축연등', icon: '🏮', price: '개인등 5만 / 가족등 10만' },
  { name: '인등기도', icon: '🕯️', price: '1만원 (1년)' },
  { name: '초공양', icon: '🕯️', price: '5천원 (1년)' },
  { name: '초하루기도', icon: '🌙', price: '1년 2,000원' },
  { name: '백일기도', icon: '🌸', price: '1년 2,000원' },
  { name: '49재', icon: '🍀', price: '1년 2,000원' },
  { name: '천도재', icon: '🕯️', price: '1년 2,000원' },
  { name: '정초기도', icon: '🌳', price: '1년 2,000원' },
  { name: '산신기도', icon: '⛰', price: '1년 2,000원' },
];

const STATUS_DATA = [
  { name: '초파일봉축연등', current: 25, total: 100 },
  { name: '인등기도', current: 2, total: 30 },
  { name: '초공양', current: 1, total: 30 },
  { name: '초하루기도', current: 18, total: 100 },
  { name: '백일기도', current: 42, total: 100 },
  { name: '49재', current: 7, total: 100 },
  { name: '천도재', current: 12, total: 100 },
  { name: '정초기도', current: 65, total: 100 },
  { name: '산신기도', current: 23, total: 100 },
];

const CAL_EVENTS = [
  { date: 6, label: '일요법회 10:30', type: 'normal' as const },
  { date: 8, label: '초하루법회 새벽 5:30', type: 'normal' as const },
  { date: 14, label: '관음재일 (음 3/18)', type: 'special' as const },
  { date: 15, label: '보름법회 새벽 5:30', type: 'normal' as const },
  { date: 20, label: '일요법회 10:30 / 지장재일 (음 3/24)', type: 'normal' as const },
];

export default function JongmusoPage() {
  const { slug } = useParams<{ slug: string }>();
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const [families, setFamilies] = useState<string[]>([]);
  const [famInput, setFamInput] = useState('');
  const [regBeopMyeong, setRegBeopMyeong] = useState('');
  const [regAddr, setRegAddr] = useState('');
  const [regTel, setRegTel] = useState('');
  const [regSuccess, setRegSuccess] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);
  const famRef = useRef<HTMLInputElement>(null);

  const openPanel = (id: string) => setActivePanel(activePanel === id ? null : id);
  const closePanel = () => setActivePanel(null);
  const addFamily = () => { const n = famInput.trim(); if (!n) return; setFamilies(p => [...p, n]); setFamInput(''); famRef.current?.focus(); };
  const removeFamily = (idx: number) => setFamilies(p => p.filter((_, i) => i !== idx));

  const submitRegistration = async () => {
    if (families.length === 0) { alert('성함을 1명 이상 입력해 주세요.'); return; }
    if (!regTel.trim()) { alert('전화번호를 입력해 주세요.'); return; }
    await fetch('/api/cyber/offering', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ temple_slug: slug, type: 'sido', name: families.join(', '), contact: regTel.trim(), wish: `법명:${regBeopMyeong || '-'} 주소:${regAddr || '-'}` }) });
    setRegSuccess(`${families.join(', ')} 님이 미래사 신도로 등록되었습니다!`);
    setTimeout(() => setRegSuccess(''), 8000);
  };

  const copyAccount = () => { navigator.clipboard.writeText('261-0359-626501').then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); }); };

  const startOffset = 3;
  const aprilDays: (number | null)[] = [];
  for (let i = 0; i < startOffset; i++) aprilDays.push(null);
  for (let d = 1; d <= 30; d++) aprilDays.push(d);
  while (aprilDays.length < 35) aprilDays.push(null);
  const eventDates = [6, 8, 14, 15, 20];
  const today = new Date().getDate();

  return (
    <div className="jm-root">
      <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@400;700;900&display=swap" rel="stylesheet" />
      <div className="jm-header"><div className="jm-title">宗 務 所</div><div className="jm-sub">대한불교조계종 미래사 디지털 종무소</div></div>

      <div className="shelf">
        <div className="shelf-plank" />
        <div className="shelf-row">
          {[{ id:'sido',icon:'📋',label:'신도카드',sub:'등록/검색' },{ id:'status',icon:'📊',label:'접수현황',sub:'기도/공양 현황' },{ id:'cal',icon:'📅',label:'법회일정',sub:'음력 기준' }].map(s => (
            <div key={s.id} className="shelf-slot" onClick={() => openPanel(s.id)}><div className="slot-icon">{s.icon}</div><div className="slot-label">{s.label}</div><div className="slot-sub">{s.sub}</div></div>
          ))}
        </div>
        <div className="shelf-plank" />
        <div className="shelf-row">
          {[{ id:'media',icon:'📺',label:'사찰 홍보',sub:'유튜브/블로그/SNS' },{ id:'info',icon:'🏛️',label:'사찰 안내',sub:'소개/오시는길' },{ id:'gido',icon:'🙏',label:'기도접수',sub:'9종 기도/공양' }].map(s => (
            <div key={s.id} className="shelf-slot" onClick={() => openPanel(s.id)}><div className="slot-icon">{s.icon}</div><div className="slot-label">{s.label}</div><div className="slot-sub">{s.sub}</div></div>
          ))}
        </div>
        <div className="shelf-plank" />
        <div className="shelf-row">
          <div className="shelf-slot" onClick={() => window.location.href = `/${slug}/cyber/notice`}><div className="slot-icon">🔔</div><div className="slot-label">공지사항</div><div className="slot-sub">미래사 소식</div></div>
        </div>
        <div className="shelf-plank" />
      </div>

      {activePanel === 'sido' && (<div className="panel"><button className="panel-close" onClick={closePanel}>&times;</button><div className="panel-title">신도카드</div>
        <input className="panel-input" placeholder="성함 또는 법명으로 검색..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        <div className="search-result">{searchQuery.trim() ? <div style={{ color:'rgba(245,230,184,0.3)',textAlign:'center',padding:'12px 0',fontSize:12 }}>&ldquo;{searchQuery}&rdquo; 검색 결과가 없습니다</div> : <div style={{ color:'rgba(245,230,184,0.3)',textAlign:'center',padding:'12px 0',fontSize:12 }}>성함을 입력하면 신도 정보가 표시됩니다</div>}</div>
        <div className="divider" /><div className="panel-title" style={{ fontSize:14 }}>신규 신도 등록</div>
        <div className="field-group"><div className="field-label">성함 (가족) <span className="req">*</span><span className="hint">이름 입력 후 추가</span></div>
          <div className="fam-tags">{families.map((n,i) => <span key={i} className="fam-tag">{n}<span className="fam-x" onClick={() => removeFamily(i)}>&times;</span></span>)}</div>
          <div className="fam-add"><input ref={famRef} className="fam-input" placeholder="이름 (예: 홍길동)" value={famInput} onChange={e => setFamInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addFamily(); } }} /><button className="fam-btn" onClick={addFamily}>+ 추가</button></div>
        </div>
        <div className="field-group"><div className="field-label">법명</div><input className="panel-input" placeholder="예: 혜광" value={regBeopMyeong} onChange={e => setRegBeopMyeong(e.target.value)} /></div>
        <div className="field-group"><div className="field-label">주소 <span className="req">*</span></div><input className="panel-input" placeholder="예: 서울시 강남구 테헤란로 108" value={regAddr} onChange={e => setRegAddr(e.target.value)} /></div>
        <div className="field-group"><div className="field-label">전화번호 <span className="req">*</span></div><input className="panel-input" placeholder="예: 010-1234-5678" value={regTel} onChange={e => setRegTel(e.target.value)} /></div>
        {(families.length > 0 || regTel.trim()) && <div className="preview-box"><div className="preview-title">등록 미리보기</div>{[['성함(가족)',families.join(', ')||'-'],['법명',regBeopMyeong||'-'],['주소',regAddr||'-'],['전화번호',regTel||'-']].map(([k,v],i) => <div key={i} className="preview-row"><span>{k}</span><span>{v}</span></div>)}</div>}
        <button className="submit-btn" onClick={submitRegistration}>신도 등록하기</button>
        {regSuccess && <div className="success-msg"><div className="success-title">{regSuccess}</div><div className="success-sub">나무아미타불 관세음보살</div></div>}
      </div>)}

      {activePanel === 'status' && (<div className="panel"><button className="panel-close" onClick={closePanel}>&times;</button><div className="panel-title">기도/공양 접수현황</div>
        {STATUS_DATA.map((item,i) => <div key={i}><div className="status-row"><span className="status-k">{item.name}</span><span className="status-v">{item.current}/{item.total}등</span></div><div className="progress-bar"><div className="progress-bg"><div className="progress-fill" style={{ width:`${Math.round(item.current/item.total*100)}%` }} /></div><span className="progress-num">{Math.round(item.current/item.total*100)}%</span></div></div>)}
      </div>)}

      {activePanel === 'cal' && (<div className="panel"><button className="panel-close" onClick={closePanel}>&times;</button><div className="panel-title">4월 법회/행사 일정</div>
        <div className="cal-grid">{['일','월','화','수','목','금','토'].map(d => <div key={d} className="cal-head">{d}</div>)}{aprilDays.map((day,i) => <div key={i} className={`cal-day ${day && eventDates.includes(day)?'event':''} ${day===today?'today':''}`}>{day||''}</div>)}</div>
        <div style={{ marginTop:12,fontSize:12 }}>{CAL_EVENTS.map((ev,i) => <div key={i} className="event-row"><span className="event-date">4/{ev.date}</span><span className={`event-label ${ev.type==='special'?'special':''}`}>{ev.label}</span></div>)}</div>
        <div style={{ marginTop:8,fontSize:10,color:'rgba(245,230,184,0.3)' }}>* 관음재일: 음력 매월 18일 | 지장재일: 음력 매월 24일</div>
      </div>)}

      {activePanel === 'media' && (<div className="panel"><button className="panel-close" onClick={closePanel}>&times;</button><div className="panel-title">사찰 홍보</div>
        <div className="youtube-embed"><iframe width="100%" height="200" src="https://www.youtube.com/embed?listType=user_uploads&list=108-forU" title="미래사 유튜브" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen style={{ borderRadius: 8 }} /></div>
        <div className="media-btns"><a className="media-btn youtube" href="https://www.youtube.com/@108-forU" target="_blank" rel="noopener noreferrer">유튜브</a><span className="media-btn naver">네이버 블로그</span><span className="media-btn kakao">카카오톡</span><span className="media-btn insta">인스타그램</span></div>
      </div>)}

      {activePanel === 'info' && (<div className="panel"><button className="panel-close" onClick={closePanel}>&times;</button><div className="panel-title">사찰 안내</div>
        {[['사찰명','미래사 (未來寺)'],['종단','대한불교조계종'],['주지스님','미래 스님'],['연락처','010-5145-5589'],['주소','대한민국 온라인시 미래로 108길 1004']].map(([k,v],i) => <div key={i} className="info-row"><span>{k}</span><span>{v}</span></div>)}
        <div className="map-placeholder">지도 연동 영역 (네이버/카카오맵)</div>
      </div>)}

      {activePanel === 'gido' && (<div className="panel"><button className="panel-close" onClick={closePanel}>&times;</button><div className="panel-title">기도접수</div>
        <div style={{ fontSize:11,color:'rgba(245,230,184,0.4)',marginBottom:10 }}>각 기도 1년 2,000원 | 100등 × 20차 = 2,000등</div>
        <div className="gido-grid">{GIDO_ITEMS.map((item,i) => <div key={i} className="gido-card"><div style={{ fontSize:24 }}>{item.icon}</div><div className="gido-name">{item.name}</div><div className="gido-price">{item.price}</div></div>)}</div>
        <div className="account-box"><div className="account-title">계좌 정보</div>
          {[['은행','시티은행'],['예금주','배연암'],['문의','010-5145-5589']].map(([k,v],i) => <div key={i} className="info-row"><span>{k}</span><span>{v}</span></div>)}
          <div className="info-row"><span>계좌번호</span><span>261-0359-626501 <button className="copy-btn" onClick={copyAccount}>{copied?'복사됨':'복사'}</button></span></div>
        </div>
      </div>)}

      <div style={{ textAlign:'center',marginTop:20,paddingBottom:40 }}><a href={`/${slug}/dharma-wheel?grid=1`} style={{ display:'inline-flex',alignItems:'center',gap:6,background:'rgba(201,168,76,0.12)',border:'1px solid rgba(201,168,76,0.3)',color:'#c9a84c',borderRadius:8,padding:'10px 24px',fontSize:13,textDecoration:'none' }}>☸ 도량으로 돌아가기</a></div>

      <style>{`
        .jm-root{width:100%;min-height:100vh;display:flex;flex-direction:column;align-items:center;background:#1e140a;font-family:'Noto Serif KR',serif;color:#F5E6B8;padding:20px 12px}
        .jm-header{text-align:center;margin-bottom:16px}.jm-title{font-size:clamp(20px,5vw,24px);font-weight:900;color:#F5D060;letter-spacing:6px}.jm-sub{font-size:11px;color:rgba(245,230,184,0.4);letter-spacing:2px;margin-top:2px}
        .shelf{width:100%;max-width:520px}.shelf-plank{height:10px;background:linear-gradient(180deg,#8B6914,#6B4400);border-radius:2px;margin:0 -4px}
        .shelf-row{display:grid;grid-template-columns:repeat(3,1fr);gap:0}
        .shelf-slot{background:#2a1a0a;border-left:3px solid #5C3A1E;border-right:3px solid #5C3A1E;padding:16px 8px;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:130px;cursor:pointer;transition:background 0.3s}.shelf-slot:hover{background:#3a2a1a}.shelf-slot:active{transform:scale(0.97)}
        .slot-icon{font-size:32px;margin-bottom:6px}.slot-label{font-size:12px;font-weight:700;color:#F5D060;letter-spacing:1px;text-align:center}.slot-sub{font-size:9px;color:rgba(245,230,184,0.35);margin-top:2px;text-align:center}
        .panel{width:100%;max-width:520px;background:#2a1a0a;border:1px solid rgba(200,150,30,0.2);border-radius:8px;padding:20px;margin-top:12px;position:relative;animation:fadeIn 0.3s ease}
        @keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        .panel-close{position:absolute;top:12px;right:16px;font-size:20px;color:rgba(245,230,184,0.5);cursor:pointer;background:none;border:none}.panel-close:hover{color:#F5D060}
        .panel-title{font-size:16px;font-weight:700;color:#F5D060;margin-bottom:12px;letter-spacing:2px}
        .panel-input{width:100%;padding:10px 14px;background:#1e140a;border:1px solid rgba(200,150,30,0.25);border-radius:8px;color:#F5E6B8;font-size:13px;font-family:'Noto Serif KR',serif;margin-bottom:8px;box-sizing:border-box}.panel-input:focus{outline:none;border-color:#C8961E}.panel-input::placeholder{color:rgba(245,230,184,0.25)}
        .divider{height:1px;background:rgba(200,150,30,0.1);margin:16px 0}
        .field-group{margin-bottom:12px}.field-label{font-size:12px;font-weight:700;color:#F5D060;margin-bottom:6px;display:flex;align-items:center;gap:4px}.req{color:#ff6b6b;font-size:10px}.hint{font-size:10px;color:rgba(245,230,184,0.35);font-weight:400;margin-left:4px}
        .fam-tags{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:6px}.fam-tag{display:inline-flex;align-items:center;gap:4px;padding:5px 10px;background:rgba(200,150,30,0.15);border:1px solid rgba(200,150,30,0.3);border-radius:16px;font-size:12px;color:#F5D060}.fam-x{cursor:pointer;font-size:14px;color:rgba(245,230,184,0.4);margin-left:2px}.fam-x:hover{color:#ff6b6b}
        .fam-add{display:flex;gap:6px}.fam-input{flex:1;padding:9px 12px;background:#1e140a;border:1px solid rgba(200,150,30,0.25);border-radius:8px;color:#F5E6B8;font-size:13px;font-family:'Noto Serif KR',serif;box-sizing:border-box}.fam-input:focus{outline:none;border-color:#C8961E}.fam-input::placeholder{color:rgba(245,230,184,0.25)}
        .fam-btn{padding:9px 14px;background:rgba(139,105,20,0.5);border:1px solid rgba(200,150,30,0.3);border-radius:8px;color:#F5D060;font-size:12px;font-weight:700;cursor:pointer;font-family:'Noto Serif KR',serif;white-space:nowrap}.fam-btn:hover{background:rgba(200,150,30,0.6)}
        .preview-box{background:rgba(200,150,30,0.06);border-radius:8px;padding:12px;margin-top:12px}.preview-title{font-size:11px;color:rgba(245,230,184,0.4);margin-bottom:6px}.preview-row{display:flex;justify-content:space-between;padding:3px 0;font-size:12px}.preview-row span:first-child{color:rgba(245,230,184,0.5)}.preview-row span:last-child{color:#F5E6B8;font-weight:500}
        .submit-btn{width:100%;padding:14px;margin-top:12px;background:linear-gradient(135deg,#8B6914,#C8961E);color:#fff;border:none;border-radius:10px;font-size:15px;font-weight:700;font-family:'Noto Serif KR',serif;cursor:pointer;letter-spacing:2px}.submit-btn:hover{transform:scale(1.02)}.submit-btn:active{transform:scale(0.98)}
        .success-msg{background:rgba(50,150,50,0.12);border:1px solid rgba(50,150,50,0.25);border-radius:8px;padding:16px;text-align:center;margin-top:12px}.success-title{color:#88cc88;font-size:15px;font-weight:700;margin-bottom:4px}.success-sub{color:rgba(245,230,184,0.5);font-size:12px}
        .search-result{min-height:40px}
        .status-row{display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px solid rgba(200,150,30,0.1);font-size:13px}.status-k{color:rgba(245,230,184,0.5)}.status-v{color:#F5E6B8;font-weight:500}
        .progress-bar{display:flex;align-items:center;gap:8px;margin:4px 0 8px}.progress-bg{flex:1;height:8px;border-radius:4px;background:rgba(200,150,30,0.15)}.progress-fill{height:8px;border-radius:4px;background:#C8961E}.progress-num{font-size:10px;color:rgba(245,230,184,0.5);min-width:36px;text-align:right}
        .cal-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:2px;margin-top:8px}.cal-head{font-size:10px;color:rgba(245,230,184,0.4);text-align:center;padding:4px 0}.cal-day{font-size:11px;text-align:center;padding:5px 2px;border-radius:4px;color:rgba(245,230,184,0.5)}.cal-day.event{background:rgba(200,150,30,0.2);color:#F5D060;font-weight:700}.cal-day.today{border:1px solid #C8961E}
        .event-row{display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px solid rgba(200,150,30,0.1);font-size:12px}.event-date{color:rgba(245,230,184,0.5)}.event-label{color:#F5E6B8;font-weight:500}.event-label.special{color:#ff9999}
        .youtube-placeholder{width:100%;height:150px;background:#0a0500;border-radius:8px;display:flex;flex-direction:column;align-items:center;justify-content:center;margin-bottom:12px;border:1px solid rgba(200,150,30,0.15);color:#cc0000}
        .media-btns{display:flex;flex-wrap:wrap;justify-content:center;gap:6px}.media-btn{padding:10px 20px;border-radius:20px;font-size:12px;font-weight:700;cursor:pointer;font-family:'Noto Serif KR',serif;border:1px solid}.media-btn.youtube{background:rgba(204,0,0,0.2);border-color:rgba(204,0,0,0.4);color:#ff6666}.media-btn.naver{background:rgba(3,199,90,0.2);border-color:rgba(3,199,90,0.4);color:#66ff99}.media-btn.kakao{background:rgba(254,229,0,0.15);border-color:rgba(254,229,0,0.3);color:#F5E6B8}.media-btn.insta{background:rgba(225,48,108,0.2);border-color:rgba(225,48,108,0.3);color:#ff6b8a}
        .info-row{display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid rgba(200,150,30,0.1);font-size:13px}.info-row:last-child{border-bottom:none}.info-row span:first-child{color:rgba(245,230,184,0.5)}.info-row span:last-child{color:#F5E6B8;font-weight:500}
        .map-placeholder{margin-top:12px;width:100%;height:130px;background:#1e140a;border-radius:8px;display:flex;align-items:center;justify-content:center;border:1px solid rgba(200,150,30,0.15);color:rgba(245,230,184,0.3);font-size:12px}
        .gido-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.gido-card{background:rgba(200,150,30,0.08);border:1px solid rgba(200,150,30,0.15);border-radius:8px;padding:12px 6px;text-align:center;cursor:pointer;transition:border-color 0.2s}.gido-card:hover{border-color:rgba(200,150,30,0.4);background:rgba(200,150,30,0.15)}.gido-name{font-size:11px;font-weight:700;color:#F5D060;margin-top:4px}.gido-price{font-size:9px;color:rgba(245,230,184,0.4);margin-top:2px}
        .account-box{margin-top:16px;padding:12px;background:rgba(200,150,30,0.08);border-radius:8px}.account-title{font-size:12px;color:#F5D060;font-weight:700;margin-bottom:6px}
        .copy-btn{margin-left:6px;padding:3px 8px;background:rgba(200,150,30,0.15);border:1px solid rgba(200,150,30,0.3);border-radius:10px;color:#F5D060;font-size:10px;cursor:pointer;font-family:'Noto Serif KR',serif}.copy-btn:hover{background:rgba(200,150,30,0.3)}
        @media(max-width:500px){.shelf-row{grid-template-columns:repeat(2,1fr)}.shelf-slot{min-height:110px;padding:12px 6px}.gido-grid{grid-template-columns:repeat(2,1fr)}.jm-title{font-size:20px}}
      `}</style>
    </div>
  );
}
