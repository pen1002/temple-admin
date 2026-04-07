'use client'
// H-11: 봉축의 하루 — 부처님오신날 6장면 그리드 히어로
// 2열 × 3행 SVG 씬 + CSS 12종 애니메이션

export interface H11BonchukHarooProps {
  templeName?:    string   // 기본 "부처님 오신 날"
  templeSubtitle?: string  // 기본 "불기 2570년 봉축의 하루"
  badgeText?:     string   // 기본 "불기 2570년"
  ctaText?:       string   // 기본 "봉축 법요식 안내"
  ctaHref?:       string   // 기본 "#"
}

const CSS = `
@keyframes fogDrift {
  0%   { transform: translateX(-8%) scaleX(1); opacity: 0.55; }
  50%  { transform: translateX(4%)  scaleX(1.08); opacity: 0.75; }
  100% { transform: translateX(-8%) scaleX(1); opacity: 0.55; }
}
@keyframes lanternSway {
  0%, 100% { transform: rotate(-6deg); }
  50%       { transform: rotate(6deg); }
}
@keyframes lanternGlow {
  0%, 100% { filter: drop-shadow(0 0 4px #e8c870cc); }
  50%       { filter: drop-shadow(0 0 12px #e8c870ff); }
}
@keyframes cloudMove {
  0%   { transform: translateX(0); }
  100% { transform: translateX(60px); }
}
@keyframes lightBeam {
  0%, 100% { opacity: 0.18; }
  50%       { opacity: 0.38; }
}
@keyframes windowBlink {
  0%, 90%, 100% { opacity: 1; }
  95%            { opacity: 0.2; }
}
@keyframes sunRay {
  0%, 100% { transform: rotate(0deg) scaleY(1); opacity: 0.5; }
  50%       { transform: rotate(8deg) scaleY(1.12); opacity: 0.8; }
}
@keyframes starAppear {
  0%, 100% { opacity: 0.3; r: 1.2px; }
  50%       { opacity: 1;   r: 2px; }
}
@keyframes lanternLight {
  0%, 100% { opacity: 0.6; }
  50%       { opacity: 1; }
}
@keyframes personWalk {
  0%   { transform: translateX(0); }
  100% { transform: translateX(28px); }
}
@keyframes flagWave {
  0%, 100% { d: path("M 0 0 Q 8 3 16 0 Q 8 -3 0 0"); }
  50%       { d: path("M 0 0 Q 8 -3 16 0 Q 8 3 0 0"); }
}
@keyframes mistFloat {
  0%   { transform: translateY(0)   translateX(0);   opacity: 0.4; }
  33%  { transform: translateY(-6px) translateX(4px);  opacity: 0.65; }
  66%  { transform: translateY(-2px) translateX(-3px); opacity: 0.5; }
  100% { transform: translateY(0)   translateX(0);   opacity: 0.4; }
}
.h11-sway   { animation: lanternSway  3s ease-in-out infinite; transform-origin: top center; }
.h11-glow   { animation: lanternGlow  2.5s ease-in-out infinite; }
.h11-fog    { animation: fogDrift     8s ease-in-out infinite; }
.h11-cloud  { animation: cloudMove    18s linear infinite; }
.h11-beam   { animation: lightBeam   4s ease-in-out infinite; }
.h11-blink  { animation: windowBlink 6s ease-in-out infinite; }
.h11-sunray { animation: sunRay      5s ease-in-out infinite; transform-origin: bottom center; }
.h11-star   { animation: starAppear  3s ease-in-out infinite; }
.h11-llight { animation: lanternLight 2s ease-in-out infinite; }
.h11-walk   { animation: personWalk  4s linear infinite alternate; }
.h11-flag   { animation: flagWave    1.6s ease-in-out infinite; }
.h11-mist   { animation: mistFloat   7s ease-in-out infinite; }
`

// ── Scene 1: 새벽 예불 ────────────────────────────────────────────────────────
function SceneDawn() {
  return (
    <svg viewBox="0 0 160 120" xmlns="http://www.w3.org/2000/svg" style={{ width:'100%', height:'100%' }}>
      <defs>
        <linearGradient id="s1sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#1a1228" />
          <stop offset="60%"  stopColor="#3d1f4f" />
          <stop offset="100%" stopColor="#6b2d6b" />
        </linearGradient>
        <radialGradient id="s1moon" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#ffe8a0" />
          <stop offset="100%" stopColor="#c9a84c" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* Sky */}
      <rect width="160" height="120" fill="url(#s1sky)" />
      {/* Stars */}
      {[[20,12],[45,8],[70,15],[95,6],[130,10],[150,18],[12,28],[155,30]].map(([x,y],i) => (
        <circle key={i} cx={x} cy={y} r="1.2" fill="#ffe8c0" className="h11-star"
          style={{ animationDelay: `${i*0.4}s` }} />
      ))}
      {/* Moon glow */}
      <circle cx="130" cy="22" r="18" fill="url(#s1moon)" opacity="0.5" />
      <circle cx="130" cy="22" r="10" fill="#fff4cc" opacity="0.85" />
      {/* Temple roof silhouette */}
      <polygon points="20,90 80,60 140,90" fill="#0d0820" />
      <polygon points="30,90 80,65 130,90" fill="#1a1030" />
      <rect x="70" y="75" width="20" height="15" fill="#0d0820" />
      {/* Bell tower */}
      <rect x="10" y="70" width="14" height="22" fill="#0d0820" />
      <polygon points="7,70 17,62 27,70" fill="#0d0820" />
      {/* Lanterns on string */}
      <line x1="10" y1="50" x2="150" y2="48" stroke="#a08040" strokeWidth="0.7" />
      {[22,42,62,82,102,122,142].map((x,i) => (
        <g key={i} className="h11-sway" style={{ animationDelay: `${i*0.3}s` }}>
          <line x1={x} y1="50" x2={x} y2="56" stroke="#a08040" strokeWidth="0.6" />
          <ellipse cx={x} cy="60" rx="4" ry="5.5" fill={['#c53030','#c9a84c','#e8a020','#68d391','#4299e1'][i%5]}
            className="h11-llight" style={{ animationDelay:`${i*0.25}s` }} />
          <ellipse cx={x} cy="58" rx="3.5" ry="1.5" fill="#ffffff30" />
          <line x1={x} y1="65.5" x2={x} y2="68" stroke="#a08040" strokeWidth="0.6" />
        </g>
      ))}
      {/* Mist */}
      <ellipse cx="80" cy="100" rx="70" ry="12" fill="#8060a020" className="h11-fog" />
      <ellipse cx="50" cy="108" rx="45" ry="8"  fill="#60408015" className="h11-mist" style={{ animationDelay:'1.5s' }} />
      {/* Ground */}
      <rect x="0" y="105" width="160" height="15" fill="#0d0820" />
      {/* Label */}
      <text x="80" y="118" textAnchor="middle" fill="#c9a84c" fontSize="6.5" fontFamily="serif">새벽 예불</text>
    </svg>
  )
}

// ── Scene 2: 오전 봉축 법요식 ─────────────────────────────────────────────────
function SceneMorning() {
  return (
    <svg viewBox="0 0 160 120" xmlns="http://www.w3.org/2000/svg" style={{ width:'100%', height:'100%' }}>
      <defs>
        <linearGradient id="s2sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#87ceeb" />
          <stop offset="100%" stopColor="#daf3ff" />
        </linearGradient>
        <radialGradient id="s2sun" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#fff0a0" />
          <stop offset="100%" stopColor="#ffcc0000" />
        </radialGradient>
      </defs>
      <rect width="160" height="120" fill="url(#s2sky)" />
      {/* Sun rays */}
      {[0,30,60,90,120,150,180,210,240,270,300,330].map((deg,i) => (
        <line key={i} x1="30" y1="25"
          x2={30 + Math.cos(deg*Math.PI/180)*28}
          y2={25 + Math.sin(deg*Math.PI/180)*28}
          stroke="#ffcc40" strokeWidth="1.5" strokeOpacity="0.4"
          className="h11-sunray" style={{ animationDelay:`${i*0.15}s` }} />
      ))}
      <circle cx="30" cy="25" r="18" fill="url(#s2sun)" />
      <circle cx="30" cy="25" r="11" fill="#fff5b0" />
      {/* Clouds */}
      <g className="h11-cloud" style={{ animationDelay:'0s' }}>
        <ellipse cx="90" cy="22" rx="22" ry="9"  fill="#ffffff" opacity="0.9" />
        <ellipse cx="78" cy="25" rx="14" ry="7"  fill="#ffffff" opacity="0.85" />
        <ellipse cx="104" cy="25" rx="14" ry="7" fill="#ffffff" opacity="0.85" />
      </g>
      <g className="h11-cloud" style={{ animationDelay:'-8s' }}>
        <ellipse cx="130" cy="35" rx="16" ry="7" fill="#ffffffcc" />
        <ellipse cx="120" cy="37" rx="10" ry="6" fill="#ffffffcc" />
      </g>
      {/* Temple */}
      <rect x="40" y="68" width="80" height="32" fill="#8b6914" />
      <rect x="48" y="72" width="64" height="28" fill="#c9a84c30" />
      {/* Main gate / columns */}
      {[52,70,90,108].map(x => (
        <rect key={x} x={x} y="68" width="5" height="32" fill="#7a5c10" />
      ))}
      {/* Roof */}
      <polygon points="28,68 80,48 132,68" fill="#5c3a00" />
      <polygon points="32,68 80,52 128,68" fill="#8b5e1a" />
      <polygon points="36,68 80,55 124,68" fill="#a07030" />
      {/* Lantern banner flags */}
      {[45,65,85,105,125].map((x,i) => (
        <g key={i}>
          <line x1={x} y1="48" x2={x} y2="68" stroke="#c9a84c" strokeWidth="0.8" />
          <path d={`M ${x} 50 L ${x+10} 55 L ${x} 60 Z`} fill={['#c53030','#c9a84c','#2c7a7b','#c53030','#c9a84c'][i]} opacity="0.85" />
        </g>
      ))}
      {/* Crowd (simplified) */}
      {[15,30,45,60,75,90,105,120,135,148].map((x,i) => (
        <g key={i} className="h11-walk" style={{ animationDelay:`${i*0.2}s`, animationDirection: i%2===0 ? 'normal' : 'alternate-reverse' }}>
          <circle cx={x} cy="97" r="3.5" fill={['#f5cba7','#fdbcb4','#e0ac69','#c68642'][i%4]} />
          <rect   x={x-2.5} y="100" width="5" height="8" rx="1"
            fill={['#c53030','#2b6cb0','#276749','#553c9a','#97266d'][i%5]} />
        </g>
      ))}
      <rect x="0" y="105" width="160" height="15" fill="#6b8c42" />
      <text x="80" y="118" textAnchor="middle" fill="#5c3a00" fontSize="6.5" fontFamily="serif">봉축 법요식</text>
    </svg>
  )
}

// ── Scene 3: 오후 연등 제작 ───────────────────────────────────────────────────
function SceneAfternoon() {
  return (
    <svg viewBox="0 0 160 120" xmlns="http://www.w3.org/2000/svg" style={{ width:'100%', height:'100%' }}>
      <defs>
        <linearGradient id="s3sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#d4874a" />
          <stop offset="50%"  stopColor="#f4a460" />
          <stop offset="100%" stopColor="#ffd59e" />
        </linearGradient>
      </defs>
      <rect width="160" height="120" fill="url(#s3sky)" />
      {/* Lantern-making tables */}
      <rect x="20" y="80" width="50" height="6"  rx="2" fill="#8b5e1a" />
      <rect x="90" y="80" width="50" height="6"  rx="2" fill="#8b5e1a" />
      {[22,34,46,58].map((x,i) => (
        <rect key={i} x={x} y="86" width="3" height="18" fill="#7a5210" />
      ))}
      {[92,104,116,128].map((x,i) => (
        <rect key={i} x={x} y="86" width="3" height="18" fill="#7a5210" />
      ))}
      {/* Completed lanterns hanging */}
      <line x1="10" y1="40" x2="150" y2="38" stroke="#a08040" strokeWidth="0.8" />
      {[18,34,50,66,82,98,114,130,146].map((x,i) => (
        <g key={i} className="h11-sway h11-glow" style={{ animationDelay:`${i*0.35}s` }}>
          <line x1={x} y1="40" x2={x} y2="46" stroke="#c9a84c" strokeWidth="0.7" />
          <ellipse cx={x} cy="51" rx="5" ry="7"
            fill={['#c53030','#e8a020','#c9a84c','#2c7a7b','#9f7aea','#f687b3','#68d391','#4299e1','#ed8936'][i]}
            opacity="0.9" />
          <ellipse cx={x} cy="49" rx="4.5" ry="2" fill="#ffffff30" />
          <line x1={x} y1="58" x2={x} y2="61" stroke="#c9a84c" strokeWidth="0.7" />
          <path d={`M ${x-3} 61 L ${x} 64 L ${x+3} 61`} fill={['#c53030','#e8a020','#c9a84c','#2c7a7b','#9f7aea','#f687b3','#68d391','#4299e1','#ed8936'][i]} opacity="0.6" />
        </g>
      ))}
      {/* People at tables */}
      {[30,45,100,115].map((x,i) => (
        <g key={i}>
          <circle cx={x} cy="76" r="4" fill={['#fdbcb4','#f5cba7','#e0ac69','#c68642'][i]} />
          <rect x={x-3} y="80" width="6" height="9" rx="1" fill={['#c53030','#2b6cb0','#276749','#553c9a'][i]} />
        </g>
      ))}
      {/* Light beams through window */}
      <polygon points="0,30 25,50 0,70" fill="#fff4a020" className="h11-beam" />
      <polygon points="155,35 140,55 155,75" fill="#fff4a015" className="h11-beam" style={{ animationDelay:'1.5s' }} />
      <rect x="0" y="104" width="160" height="16" fill="#5c7a30" />
      <text x="80" y="118" textAnchor="middle" fill="#fff" fontSize="6.5" fontFamily="serif">연등 제작</text>
    </svg>
  )
}

// ── Scene 4: 도심 연등행렬 ────────────────────────────────────────────────────
function SceneParade() {
  return (
    <svg viewBox="0 0 160 120" xmlns="http://www.w3.org/2000/svg" style={{ width:'100%', height:'100%' }}>
      <defs>
        <linearGradient id="s4sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#1a2a4a" />
          <stop offset="100%" stopColor="#2d4a7a" />
        </linearGradient>
      </defs>
      <rect width="160" height="120" fill="url(#s4sky)" />
      {/* City buildings */}
      {[
        { x:0,  w:22, h:80, c:'#1e2d4a' },
        { x:20, w:18, h:65, c:'#1a2640' },
        { x:36, w:24, h:90, c:'#1c2d4e' },
        { x:58, w:16, h:55, c:'#18263c' },
        { x:72, w:26, h:75, c:'#1e2e4c' },
        { x:96, w:20, h:85, c:'#1c2a42' },
        { x:114,w:22, h:60, c:'#1a2840' },
        { x:134,w:26, h:78, c:'#1e2c48' },
      ].map((b,i) => (
        <g key={i}>
          <rect x={b.x} y={120-b.h} width={b.w} height={b.h} fill={b.c} />
          {/* Windows */}
          {Array.from({ length: Math.floor(b.h/12) }).map((_,r) =>
            Array.from({ length: Math.floor(b.w/7) }).map((_,c) => (
              <rect key={`${r}-${c}`} x={b.x+2+c*7} y={120-b.h+3+r*12} width="4" height="5" rx="0.5"
                fill="#e8c870" className="h11-blink"
                style={{ animationDelay:`${(i*3+r*2+c)*0.4}s` }} />
            ))
          )}
        </g>
      ))}
      {/* Street */}
      <rect x="0" y="95" width="160" height="25" fill="#1a1408" />
      <line x1="80" y1="95" x2="80" y2="120" stroke="#e8c87030" strokeWidth="1.5" strokeDasharray="4,4" />
      {/* Lantern strings across street */}
      {[0,1,2].map(row => (
        <g key={row}>
          <line x1="0" y1={40+row*14} x2="160" y2={42+row*14} stroke="#a08040" strokeWidth="0.7" />
          {[10,28,46,64,82,100,118,136,154].map((x,i) => (
            <g key={i} className="h11-sway h11-glow" style={{ animationDelay:`${(row*3+i)*0.3}s` }}>
              <line x1={x} y1={40+row*14} x2={x} y2={45+row*14} stroke="#c9a84c" strokeWidth="0.6" />
              <ellipse cx={x} cy={49+row*14} rx="3.5" ry="5"
                fill={['#e53e3e','#ed8936','#c9a84c','#ecc94b','#68d391','#4299e1','#9f7aea','#f687b3','#fed7aa'][i]} opacity="0.95" />
              <ellipse cx={x} cy={48+row*14} rx="3" ry="1.5" fill="#ffffff30" />
            </g>
          ))}
        </g>
      ))}
      {/* Parade crowd */}
      {[8,18,28,38,48,58,68,78,88,98,108,118,128,138,148].map((x,i) => (
        <g key={i} className="h11-walk" style={{ animationDelay:`${i*0.18}s` }}>
          <circle cx={x} cy="98" r="2.5" fill={['#fdbcb4','#f5cba7','#e0ac69'][i%3]} />
          <rect x={x-2} y="100" width="4" height="6" rx="0.5"
            fill={['#c53030','#9b2c2c','#2b6cb0','#276749','#553c9a'][i%5]} />
          {/* Hand lanterns */}
          <line x1={x+2} y1="101" x2={x+5} y2="98" stroke="#a08040" strokeWidth="0.6" />
          <ellipse cx={x+5} cy="96" rx="2.2" ry="3" fill={['#e53e3e','#c9a84c','#68d391','#4299e1','#9f7aea'][i%5]}
            className="h11-llight" style={{ animationDelay:`${i*0.2}s` }} />
        </g>
      ))}
      <text x="80" y="118" textAnchor="middle" fill="#e8c870" fontSize="6.5" fontFamily="serif">도심 연등행렬</text>
    </svg>
  )
}

// ── Scene 5: 저녁 점등 ────────────────────────────────────────────────────────
function SceneEvening() {
  return (
    <svg viewBox="0 0 160 120" xmlns="http://www.w3.org/2000/svg" style={{ width:'100%', height:'100%' }}>
      <defs>
        <linearGradient id="s5sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#8a3010" />
          <stop offset="40%"  stopColor="#c05621" />
          <stop offset="100%" stopColor="#f4a460" />
        </linearGradient>
        <radialGradient id="s5glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#e8c870" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#e8c870" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="160" height="120" fill="url(#s5sky)" />
      {/* Horizon glow */}
      <ellipse cx="80" cy="95" rx="90" ry="22" fill="#e8703010" />
      {/* Temple silhouette */}
      <rect x="30" y="60" width="100" height="45" fill="#1a0c04" />
      <polygon points="20,60 80,35 140,60" fill="#0d0602" />
      <polygon points="25,60 80,38 135,60" fill="#1a0c04" />
      {/* Temple gate arch */}
      <rect x="68" y="75" width="24" height="30" rx="12 12 0 0" fill="#0d0602" />
      <rect x="72" y="80" width="16" height="25" rx="8 8 0 0" fill="#2a1504" />
      {/* Light inside gate */}
      <ellipse cx="80" cy="93" rx="7" ry="6" fill="url(#s5glow)" className="h11-llight" />
      {/* Lantern strings */}
      <line x1="15" y1="28" x2="145" y2="26" stroke="#8b6914" strokeWidth="0.8" />
      <line x1="10" y1="38" x2="150" y2="36" stroke="#8b6914" strokeWidth="0.8" />
      {[16,30,44,58,72,86,100,114,128,142].map((x,i) => (
        <g key={i} className="h11-sway h11-glow" style={{ animationDelay:`${i*0.28}s` }}>
          <line x1={x} y1="28" x2={x} y2="34" stroke="#c9a84c" strokeWidth="0.6" />
          <ellipse cx={x} cy="39" rx="4" ry="5.5"
            fill={['#c53030','#e8a020','#c9a84c','#2c7a7b','#9f7aea','#f687b3','#68d391','#4299e1','#ed8936','#ecc94b'][i]}
            opacity="0.95" className="h11-llight" style={{ animationDelay:`${i*0.2}s` }} />
          <ellipse cx={x} cy="37" rx="3.5" ry="1.5" fill="#ffffff30" />
        </g>
      ))}
      {/* Light beams from temple */}
      <polygon points="65,83 35,120 50,120" fill="#e8c87008" className="h11-beam" />
      <polygon points="95,83 120,120 105,120" fill="#e8c87008" className="h11-beam" style={{ animationDelay:'0.8s' }} />
      {/* Mist at base */}
      <ellipse cx="80" cy="108" rx="75" ry="10" fill="#60402010" className="h11-fog" />
      <rect x="0" y="108" width="160" height="12" fill="#0d0602" />
      <text x="80" y="119" textAnchor="middle" fill="#e8c870" fontSize="6.5" fontFamily="serif">저녁 점등</text>
    </svg>
  )
}

// ── Scene 6: 밤 회향 ──────────────────────────────────────────────────────────
function SceneNight() {
  return (
    <svg viewBox="0 0 160 120" xmlns="http://www.w3.org/2000/svg" style={{ width:'100%', height:'100%' }}>
      <defs>
        <linearGradient id="s6sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#1a0a2e" />
          <stop offset="60%"  stopColor="#2d1450" />
          <stop offset="100%" stopColor="#4a2070" />
        </linearGradient>
        <radialGradient id="s6lanternglow" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#e8c870" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#e8c870" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="160" height="120" fill="url(#s6sky)" />
      {/* Stars (many) */}
      {[8,20,35,50,62,78,90,105,118,132,148,5,25,42,58,75,88,102,125,145,15,38,55,72,95,115,140,3,60,130].map((x,i) => (
        <circle key={i} cx={x} cy={4+i*3.2 % 45} r={i%3===0 ? 1.5 : 1}
          fill="#ffe8c0" className="h11-star" style={{ animationDelay:`${(i*0.37)%3}s` }} />
      ))}
      {/* Sky lanterns floating up */}
      {[25,55,85,115,145].map((x,i) => (
        <g key={i} className="h11-mist" style={{ animationDelay:`${i*0.8}s`, animationDuration:`${5+i*0.5}s` }}>
          <ellipse cx={x} cy={20+i*8} rx="5" ry="7"
            fill={['#c53030','#c9a84c','#e8a020','#9f7aea','#f687b3'][i]} opacity="0.85"
            className="h11-llight" style={{ animationDelay:`${i*0.3}s` }} />
          <ellipse cx={x} cy={18+i*8} rx="4.5" ry="1.8" fill="#ffffff20" />
          <circle cx={x} cy={20+i*8} r={8+i*2} fill="url(#s6lanternglow)" />
        </g>
      ))}
      {/* Temple at night */}
      <polygon points="15,85 80,55 145,85" fill="#0a0518" />
      <polygon points="20,85 80,58 140,85" fill="#140828" />
      <rect x="35" y="85" width="90" height="25" fill="#0a0518" />
      <rect x="68" y="88" width="24" height="22" rx="12 12 0 0" fill="#0a0518" />
      {/* Warm glow windows */}
      {[40,52,64,96,108,120].map((x,i) => (
        <rect key={i} x={x} y="90" width="7" height="9" rx="1"
          fill="#e8a02050" className="h11-blink" style={{ animationDelay:`${i*0.5}s` }} />
      ))}
      {/* Hanging lanterns - celebration density */}
      <line x1="5" y1="44" x2="155" y2="42" stroke="#8b6914" strokeWidth="0.7" />
      {[10,22,34,46,58,70,82,94,106,118,130,142,154].map((x,i) => (
        <g key={i} className="h11-sway h11-glow" style={{ animationDelay:`${i*0.22}s` }}>
          <line x1={x} y1="44" x2={x} y2="49" stroke="#c9a84c" strokeWidth="0.5" />
          <ellipse cx={x} cy="53" rx="3.5" ry="5"
            fill={['#e53e3e','#ed8936','#c9a84c','#ecc94b','#68d391','#4299e1','#9f7aea','#f687b3','#fed7aa','#c53030','#2c7a7b','#e8a020','#c9a84c'][i]}
            opacity="0.95" />
          <circle cx={x} cy="53" r={6+i%3*2} fill="url(#s6lanternglow)" />
        </g>
      ))}
      {/* Mist */}
      <ellipse cx="80" cy="106" rx="75" ry="10" fill="#40208020" className="h11-fog" />
      <rect x="0" y="108" width="160" height="12" fill="#0a0518" />
      <text x="80" y="119" textAnchor="middle" fill="#c9a84c" fontSize="6.5" fontFamily="serif">밤 회향</text>
    </svg>
  )
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function H11BonchukHarooBlock({
  templeName    = '부처님 오신 날',
  templeSubtitle = '불기 2570년 봉축의 하루',
  badgeText     = '불기 2570년',
  ctaText       = '봉축 법요식 안내',
  ctaHref       = '#',
}: H11BonchukHarooProps) {
  const scenes = [
    { scene: <SceneDawn />,      label: '새벽 예불',    time: '04:00' },
    { scene: <SceneMorning />,   label: '봉축 법요식',  time: '10:00' },
    { scene: <SceneAfternoon />, label: '연등 제작',    time: '13:00' },
    { scene: <SceneParade />,    label: '도심 연등행렬', time: '19:00' },
    { scene: <SceneEvening />,   label: '저녁 점등',    time: '20:30' },
    { scene: <SceneNight />,     label: '밤 회향',      time: '22:00' },
  ]

  return (
    <section style={{
      position: 'relative',
      width: '100%',
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #0d0618 0%, #1a0a2e 40%, #2d1450 100%)',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      <style>{CSS}</style>

      {/* ── 상단 오버레이 ── */}
      <div style={{
        width: '100%',
        padding: '48px 24px 32px',
        textAlign: 'center',
        position: 'relative',
        zIndex: 2,
      }}>
        {/* Badge */}
        <span style={{
          display: 'inline-block',
          padding: '4px 16px',
          border: '1px solid #c9a84c80',
          borderRadius: '20px',
          color: '#c9a84c',
          fontSize: '12px',
          letterSpacing: '0.15em',
          marginBottom: '16px',
          background: '#c9a84c10',
        }}>
          ● {badgeText}
        </span>

        {/* Temple name */}
        <h1 style={{
          margin: '0 0 12px',
          fontSize: 'clamp(32px, 6vw, 64px)',
          fontWeight: '700',
          color: '#f0dfa0',
          fontFamily: 'serif',
          letterSpacing: '0.08em',
          lineHeight: 1.2,
          textShadow: '0 2px 20px #c9a84c60',
        }}>
          {templeName}
        </h1>

        {/* Subtitle */}
        <p style={{
          margin: '0 0 28px',
          fontSize: 'clamp(14px, 2.5vw, 20px)',
          color: '#d4b86080',
          letterSpacing: '0.12em',
          fontFamily: 'serif',
        }}>
          {templeSubtitle}
        </p>

        {/* CTA */}
        <a
          href={ctaHref}
          style={{
            display: 'inline-block',
            padding: '12px 32px',
            background: 'linear-gradient(135deg, #c9a84c, #e8c870)',
            color: '#1a0a2e',
            fontWeight: '700',
            fontSize: '15px',
            letterSpacing: '0.1em',
            borderRadius: '4px',
            textDecoration: 'none',
            fontFamily: 'serif',
            boxShadow: '0 4px 20px #c9a84c40',
          }}
        >
          {ctaText}
        </a>
      </div>

      {/* ── 6장면 그리드 ── */}
      <div style={{
        width: '100%',
        maxWidth: '1200px',
        padding: '0 16px 48px',
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gridTemplateRows: 'repeat(3, 1fr)',
        gap: '8px',
        flex: 1,
      }}>
        {scenes.map((s, i) => (
          <div key={i} style={{
            position: 'relative',
            aspectRatio: '4/3',
            borderRadius: '6px',
            overflow: 'hidden',
            border: '1px solid #c9a84c30',
            boxShadow: '0 2px 12px #00000060',
          }}>
            {s.scene}
            {/* Time label overlay */}
            <div style={{
              position: 'absolute',
              top: '8px',
              left: '8px',
              background: '#00000060',
              color: '#c9a84c',
              fontSize: '11px',
              padding: '2px 8px',
              borderRadius: '3px',
              letterSpacing: '0.08em',
              fontFamily: 'monospace',
            }}>
              {s.time}
            </div>
          </div>
        ))}
      </div>

      {/* ── 하단 장식 ── */}
      <div style={{
        width: '100%',
        padding: '16px 24px 32px',
        textAlign: 'center',
        borderTop: '1px solid #c9a84c20',
      }}>
        <p style={{
          margin: 0,
          color: '#c9a84c60',
          fontSize: '12px',
          letterSpacing: '0.15em',
          fontFamily: 'serif',
        }}>
          · 나무석가모니불 · 나무석가모니불 · 나무석가모니불 ·
        </p>
      </div>
    </section>
  )
}
