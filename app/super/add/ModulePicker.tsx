'use client'
import { useState } from 'react'

// ── 블록 정의 ──────────────────────────────────────────────────────────────
export interface BlockDef {
  id: string          // 블록 ID (H-01 등)
  name: string        // 이름
  category: string    // 카테고리 (마인드맵 노드)
  desc: string        // 한줄 설명
  features: string[]  // 기능 태그
  required?: boolean  // 필수 여부
  tier: number        // 최소 Tier
  accent: string      // 대표 컬러
  defaultConfig: Record<string, unknown>
}

export const BLOCK_DEFS: BlockDef[] = [
  {
    id: 'H-01', name: '파티클 히어로', category: '히어로', tier: 1, required: true,
    accent: '#2B6B7F',
    desc: '파티클 애니메이션 + 등불 효과 메인 화면',
    features: ['✨ 파티클 효과', '🏮 등불 애니메이션', '📜 한자 표기', '🎨 사찰 테마'],
    defaultConfig: { heroTitle: '', heroHanja: '', badge: '', heroDesc: '', ticker: [], stats: [], quoteText: '' },
  },
  {
    id: 'E-01', name: '법회 · 행사', category: '행사', tier: 1,
    accent: '#7C3D9A',
    desc: '법회·기도·행사 일정 그리드 (자동 D-day 표시)',
    features: ['📅 자동 D-day', '🌕 음력 연동', '☸ 행사 카드', '🔔 임박 알림'],
    defaultConfig: { sectionTitle: '법회 · 기도 · 행사', events: [] },
  },
  {
    id: 'G-01', name: '갤러리', category: '미디어', tier: 2,
    accent: '#3D6B4F',
    desc: '관리앱 업로드 사진 3열 그리드 (라이트박스 포함)',
    features: ['📷 3열 그리드', '🔍 라이트박스', '☁️ 실시간 연동', '📁 최대 9장'],
    defaultConfig: { title: '경내 풍경', columns: 3, limit: 9, source: 'kv' },
  },
  {
    id: 'D-01', name: '오늘의 법문', category: '콘텐츠', tier: 1,
    accent: '#B8600C',
    desc: '관리앱에서 입력한 법문을 인용문 스타일로 표시',
    features: ['✍️ 인용문 형식', '📖 출처 표시', '🔄 실시간 업데이트', '🌅 매일 새로'],
    defaultConfig: { title: '오늘의 법문', showSource: true, style: 'quote', source: 'kv' },
  },
  {
    id: 'I-01', name: '공지사항', category: '콘텐츠', tier: 1,
    accent: '#C0392B',
    desc: '최신 공지 최대 5건, 날짜와 함께 표시',
    features: ['📢 최신 5건', '📅 날짜 표시', '🔄 실시간', '📋 리스트 뷰'],
    defaultConfig: { title: '공지사항', limit: 5, showDate: true, source: 'kv' },
  },
  {
    id: 'P-01', name: '실천 네트워크', category: '기관', tier: 2,
    accent: '#1A7A5A',
    desc: '사찰의 핵심 가치·실천 활동을 3단 카드로 소개',
    features: ['🏛 3단 카드', '🎨 아이콘', '📝 설명 텍스트', '🌟 강조 디자인'],
    defaultConfig: { sectionTitle: '핵심 실천 가치', pillars: [] },
  },
  {
    id: 'W-01', name: '산하기관', category: '기관', tier: 3,
    accent: '#2471A3',
    desc: '산하 복지·구호 기관들의 링크 카드 그리드',
    features: ['🏥 기관 카드', '🔗 외부 링크', '2×3 그리드', '📌 아이콘'],
    defaultConfig: { sectionTitle: '산하기관 바로가기', orgs: [] },
  },
  {
    id: 'DO-01', name: '나눔 동참', category: '기관', tier: 2,
    accent: '#D4A017',
    desc: '후원 계좌 안내 + 문의처 2단 카드',
    features: ['🏦 계좌 안내', '📞 문의처', '💛 후원 유도', '2단 레이아웃'],
    defaultConfig: { bankName: '', accountHolder: '', accountNumber: '', phone: '', email: '' },
  },
  {
    id: 'V-01', name: '오시는 길', category: '기관', tier: 1,
    accent: '#6B4226',
    desc: '주소·교통·주차 정보와 지도 안내 섹션',
    features: ['📍 주소 표시', '🚌 교통 안내', '🅿 주차 정보', '🗺 지도 연동'],
    defaultConfig: { address: '', transport: '', bus: '', parking: '', mapLines: [] },
  },
]

// ── SVG 미리보기 ──────────────────────────────────────────────────────────
const BLOCK_SVG: Record<string, string> = {
  'H-01': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 160">
    <defs>
      <radialGradient id="hg" cx="50%" cy="50%" r="60%">
        <stop offset="0%" stop-color="#2B4A5A"/><stop offset="100%" stop-color="#0D1B22"/>
      </radialGradient>
    </defs>
    <rect width="280" height="160" fill="url(#hg)"/>
    <!-- particles -->
    <circle cx="30" cy="20" r="1.5" fill="#D4AF37" opacity=".9"/>
    <circle cx="80" cy="10" r="1" fill="#D4AF37" opacity=".7"/>
    <circle cx="130" cy="25" r="2" fill="#D4AF37" opacity=".5"/>
    <circle cx="200" cy="15" r="1.5" fill="#88ccdd" opacity=".8"/>
    <circle cx="250" cy="30" r="1" fill="#D4AF37" opacity=".6"/>
    <circle cx="20" cy="80" r="1" fill="#88ccdd" opacity=".5"/>
    <circle cx="60" cy="90" r="2" fill="#D4AF37" opacity=".7"/>
    <circle cx="220" cy="70" r="1.5" fill="#D4AF37" opacity=".8"/>
    <circle cx="265" cy="100" r="1" fill="#88ccdd" opacity=".6"/>
    <circle cx="110" cy="130" r="1.5" fill="#D4AF37" opacity=".4"/>
    <circle cx="170" cy="145" r="1" fill="#D4AF37" opacity=".6"/>
    <circle cx="240" cy="140" r="2" fill="#88ccdd" opacity=".5"/>
    <!-- lanterns left -->
    <ellipse cx="38" cy="55" rx="9" ry="13" fill="#C03030" opacity=".75"/>
    <ellipse cx="38" cy="42" rx="5" ry="3" fill="#8A1800"/>
    <line x1="38" y1="68" x2="38" y2="75" stroke="#8A1800" stroke-width="1.5"/>
    <!-- lanterns right -->
    <ellipse cx="242" cy="72" rx="7" ry="10" fill="#B82200" opacity=".7"/>
    <ellipse cx="242" cy="62" rx="4" ry="2.5" fill="#8A1800"/>
    <line x1="242" y1="82" x2="242" y2="88" stroke="#8A1800" stroke-width="1.5"/>
    <!-- main text -->
    <text x="140" y="72" text-anchor="middle" font-family="serif" font-size="28" font-weight="bold" fill="white">사찰명</text>
    <text x="140" y="95" text-anchor="middle" font-family="serif" font-size="13" fill="#D4AF37" letter-spacing="8">寺 名</text>
    <text x="140" y="115" text-anchor="middle" font-family="sans-serif" font-size="9" fill="#88aabb" letter-spacing="1">파티클 애니메이션 · 등불 효과</text>
    <!-- badge -->
    <rect x="90" y="125" width="100" height="18" rx="9" fill="#D4AF37" opacity=".2"/>
    <text x="140" y="137.5" text-anchor="middle" font-size="8.5" fill="#D4AF37">☸ H-01 파티클 히어로</text>
  </svg>`,

  'G-01': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 160">
    <rect width="280" height="160" fill="#F0F4F0"/>
    <!-- grid photos 3x2 -->
    <rect x="8" y="8" width="82" height="55" rx="5" fill="#C8DCC8"/>
    <rect x="99" y="8" width="82" height="55" rx="5" fill="#B8CFBA"/>
    <rect x="190" y="8" width="82" height="55" rx="5" fill="#A8C2AA"/>
    <rect x="8" y="72" width="82" height="55" rx="5" fill="#B0C8B2"/>
    <rect x="99" y="72" width="82" height="55" rx="5" fill="#C0D4C2"/>
    <rect x="190" y="72" width="82" height="55" rx="5" fill="#A0BAA2"/>
    <!-- mountain icons in photos -->
    <polygon points="49,48 30,62 68,62" fill="#4A7A5A" opacity=".4"/>
    <polygon points="140,48 121,62 159,62" fill="#3A6A4A" opacity=".4"/>
    <polygon points="231,48 212,62 250,62" fill="#4A7A5A" opacity=".4"/>
    <circle cx="49" cy="22" r="8" fill="#D4AF37" opacity=".5"/>
    <circle cx="140" cy="22" r="8" fill="#D4AF37" opacity=".4"/>
    <circle cx="231" cy="22" r="8" fill="#D4AF37" opacity=".5"/>
    <!-- magnifier hint -->
    <circle cx="181" cy="80" r="10" fill="white" opacity=".8" stroke="#3D6B4F" stroke-width="1.5"/>
    <circle cx="181" cy="80" r="6" fill="none" stroke="#3D6B4F" stroke-width="1.5"/>
    <line x1="186" y1="85" x2="191" y2="90" stroke="#3D6B4F" stroke-width="2" stroke-linecap="round"/>
    <!-- label -->
    <rect x="0" y="135" width="280" height="25" fill="#3D6B4F" opacity=".85"/>
    <text x="140" y="151" text-anchor="middle" font-size="10" fill="white">📷 G-01 갤러리 · 3열 그리드 · 라이트박스</text>
  </svg>`,

  'D-01': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 160">
    <defs>
      <linearGradient id="dg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#FFF8E7"/><stop offset="100%" stop-color="#FFF0CC"/>
      </linearGradient>
    </defs>
    <rect width="280" height="160" fill="url(#dg)"/>
    <!-- quote marks -->
    <text x="18" y="52" font-size="52" fill="#D4AF37" opacity=".35" font-family="serif">"</text>
    <text x="242" y="90" font-size="52" fill="#D4AF37" opacity=".35" font-family="serif">"</text>
    <!-- dharma lines -->
    <text x="140" y="55" text-anchor="middle" font-family="serif" font-size="11" fill="#5A3A1A">내면의 빛을 찾아</text>
    <text x="140" y="73" text-anchor="middle" font-family="serif" font-size="11" fill="#5A3A1A">마음의 보배를 가꾸어라</text>
    <text x="140" y="91" text-anchor="middle" font-family="serif" font-size="11" fill="#5A3A1A">그것이 진정한 수행이니</text>
    <!-- divider -->
    <line x1="110" y1="103" x2="170" y2="103" stroke="#D4AF37" stroke-width="1"/>
    <!-- source -->
    <text x="140" y="118" text-anchor="middle" font-size="9.5" fill="#B8600C">— 법구경 (法句經)</text>
    <!-- label bar -->
    <rect x="0" y="135" width="280" height="25" fill="#B8600C" opacity=".85"/>
    <text x="140" y="151" text-anchor="middle" font-size="10" fill="white">✍️ D-01 오늘의 법문 · 관리앱 실시간 연동</text>
  </svg>`,

  'I-01': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 160">
    <rect width="280" height="160" fill="#FFF8F8"/>
    <!-- notice items -->
    <rect x="10" y="12" width="260" height="26" rx="6" fill="white" stroke="#F0D0D0" stroke-width="1"/>
    <circle cx="24" cy="25" r="4" fill="#C0392B"/>
    <text x="36" y="29" font-size="9.5" fill="#3A1A1A">부처님오신날 봉축 연등 접수 안내</text>
    <text x="220" y="29" font-size="8" fill="#aaa">2026.04.01</text>

    <rect x="10" y="46" width="260" height="26" rx="6" fill="white" stroke="#F0D0D0" stroke-width="1"/>
    <circle cx="24" cy="59" r="4" fill="#C0392B" opacity=".7"/>
    <text x="36" y="63" font-size="9.5" fill="#3A1A1A">3월 정기법회 일정 변경 공지</text>
    <text x="220" y="63" font-size="8" fill="#aaa">2026.03.20</text>

    <rect x="10" y="80" width="260" height="26" rx="6" fill="white" stroke="#F0D0D0" stroke-width="1"/>
    <circle cx="24" cy="93" r="4" fill="#C0392B" opacity=".5"/>
    <text x="36" y="97" font-size="9.5" fill="#3A1A1A">수요 무료 국수 공양 봉사자 모집</text>
    <text x="220" y="97" font-size="8" fill="#aaa">2026.03.15</text>

    <rect x="10" y="114" width="260" height="26" rx="6" fill="#f8f8f8" stroke="#E8C8C8" stroke-width="1"/>
    <circle cx="24" cy="127" r="4" fill="#C0392B" opacity=".3"/>
    <text x="36" y="131" font-size="9.5" fill="#888">합창단 신규 단원 모집</text>
    <text x="220" y="131" font-size="8" fill="#bbb">2026.03.01</text>
    <!-- label -->
    <rect x="0" y="144" width="280" height="16" fill="#C0392B" opacity=".8"/>
    <text x="140" y="155" text-anchor="middle" font-size="9" fill="white">📢 I-01 공지사항 · 최신 5건 자동 표시</text>
  </svg>`,

  'E-01': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 160">
    <rect width="280" height="160" fill="#F8F0FF"/>
    <!-- event cards grid 2x3 -->
    <rect x="8" y="8" width="82" height="66" rx="6" fill="white" stroke="#E0C8F0" stroke-width="1.5"/>
    <text x="49" y="28" text-anchor="middle" font-size="18">🌕</text>
    <text x="49" y="44" text-anchor="middle" font-size="8.5" fill="#7C3D9A" font-weight="bold">초하루법회</text>
    <text x="49" y="56" text-anchor="middle" font-size="7.5" fill="#888">매월 음력 1일</text>
    <rect x="49" y="62" width="40" height="8" rx="4" fill="#7C3D9A" opacity=".15" x="29"/>
    <text x="49" y="69" text-anchor="middle" font-size="7" fill="#7C3D9A">정기법회</text>

    <rect x="99" y="8" width="82" height="66" rx="6" fill="white" stroke="#E0C8F0" stroke-width="1.5"/>
    <text x="140" y="28" text-anchor="middle" font-size="18">🪷</text>
    <text x="140" y="44" text-anchor="middle" font-size="8.5" fill="#7C3D9A" font-weight="bold">봉축법요식</text>
    <text x="140" y="56" text-anchor="middle" font-size="7.5" fill="#888">음력 4월 8일</text>
    <text x="140" y="69" text-anchor="middle" font-size="7" fill="#7C3D9A">봉축</text>

    <rect x="190" y="8" width="82" height="66" rx="6" fill="#F0E8FF" stroke="#7C3D9A" stroke-width="1.5"/>
    <text x="231" y="28" text-anchor="middle" font-size="18">🍜</text>
    <text x="231" y="44" text-anchor="middle" font-size="8.5" fill="#7C3D9A" font-weight="bold">무료국수공양</text>
    <text x="231" y="56" text-anchor="middle" font-size="7.5" fill="#C0392B">D-2 임박!</text>
    <text x="231" y="69" text-anchor="middle" font-size="7" fill="#7C3D9A">매주수요일</text>

    <rect x="8" y="83" width="82" height="66" rx="6" fill="white" stroke="#E0C8F0" stroke-width="1.5"/>
    <text x="49" y="103" text-anchor="middle" font-size="18">🪔</text>
    <text x="49" y="119" text-anchor="middle" font-size="8.5" fill="#7C3D9A" font-weight="bold">백중기도</text>
    <text x="49" y="131" text-anchor="middle" font-size="7.5" fill="#888">음력 7월 15일</text>
    <text x="49" y="144" text-anchor="middle" font-size="7" fill="#7C3D9A">계절행사</text>

    <rect x="99" y="83" width="82" height="66" rx="6" fill="white" stroke="#E0C8F0" stroke-width="1.5"/>
    <text x="140" y="103" text-anchor="middle" font-size="18">❄️</text>
    <text x="140" y="119" text-anchor="middle" font-size="8.5" fill="#7C3D9A" font-weight="bold">동안거</text>
    <text x="140" y="131" text-anchor="middle" font-size="7.5" fill="#888">음력 10월~1월</text>
    <text x="140" y="144" text-anchor="middle" font-size="7" fill="#7C3D9A">안거수행</text>

    <rect x="190" y="83" width="82" height="66" rx="6" fill="white" stroke="#E0C8F0" stroke-width="1.5"/>
    <text x="231" y="103" text-anchor="middle" font-size="18">🐟</text>
    <text x="231" y="119" text-anchor="middle" font-size="8.5" fill="#7C3D9A" font-weight="bold">방생법회</text>
    <text x="231" y="131" text-anchor="middle" font-size="7.5" fill="#888">음력 2월 15일</text>
    <text x="231" y="144" text-anchor="middle" font-size="7" fill="#7C3D9A">계절행사</text>
  </svg>`,

  'P-01': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 160">
    <rect width="280" height="160" fill="#F0FAF5"/>
    <!-- 3 pillar cards -->
    <rect x="8" y="12" width="80" height="110" rx="8" fill="white" stroke="#C8E8D8" stroke-width="1.5"/>
    <circle cx="48" cy="45" r="20" fill="#1A7A5A" opacity=".15"/>
    <text x="48" y="52" text-anchor="middle" font-size="22">🏥</text>
    <text x="48" y="72" text-anchor="middle" font-size="8.5" fill="#1A7A5A" font-weight="bold">복지재단</text>
    <text x="48" y="85" text-anchor="middle" font-size="7.5" fill="#888">지역사회 복지</text>
    <text x="48" y="100" text-anchor="middle" font-size="7" fill="#666">산하 6개 복지</text>
    <text x="48" y="112" text-anchor="middle" font-size="7" fill="#666">시설 운영</text>

    <rect x="100" y="12" width="80" height="110" rx="8" fill="#1A7A5A" stroke="#1A7A5A" stroke-width="1.5"/>
    <circle cx="140" cy="45" r="20" fill="white" opacity=".2"/>
    <text x="140" y="52" text-anchor="middle" font-size="22">🌏</text>
    <text x="140" y="72" text-anchor="middle" font-size="8.5" fill="white" font-weight="bold">국제구호</text>
    <text x="140" y="85" text-anchor="middle" font-size="7.5" fill="#C8F8E8">아시아 7개국</text>
    <text x="140" y="100" text-anchor="middle" font-size="7" fill="#A0E8C8">빈민 구호</text>
    <text x="140" y="112" text-anchor="middle" font-size="7" fill="#A0E8C8">교육 지원</text>

    <rect x="192" y="12" width="80" height="110" rx="8" fill="white" stroke="#C8E8D8" stroke-width="1.5"/>
    <circle cx="232" cy="45" r="20" fill="#1A7A5A" opacity=".15"/>
    <text x="232" y="52" text-anchor="middle" font-size="22">🕊️</text>
    <text x="232" y="72" text-anchor="middle" font-size="8.5" fill="#1A7A5A" font-weight="bold">평화운동</text>
    <text x="232" y="85" text-anchor="middle" font-size="7.5" fill="#888">비핵·평화</text>
    <text x="232" y="100" text-anchor="middle" font-size="7" fill="#666">원폭 피해자</text>
    <text x="232" y="112" text-anchor="middle" font-size="7" fill="#666">지원 쉼터</text>

    <rect x="0" y="136" width="280" height="24" fill="#1A7A5A" opacity=".85"/>
    <text x="140" y="151" text-anchor="middle" font-size="9.5" fill="white">🏛 P-01 실천 네트워크 · 3단 카드</text>
  </svg>`,

  'W-01': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 160">
    <rect width="280" height="160" fill="#F0F4FA"/>
    <!-- 2x3 org cards -->
    <rect x="8" y="8" width="82" height="40" rx="5" fill="white" stroke="#D0E0F0" stroke-width="1"/>
    <rect x="12" y="16" width="22" height="22" rx="4" fill="#3B82F6" opacity=".2"/>
    <text x="23" y="31" text-anchor="middle" font-size="12">🏛</text>
    <text x="70" y="24" text-anchor="end" font-size="8" fill="#2471A3" font-weight="bold">복지재단</text>
    <text x="70" y="36" text-anchor="end" font-size="7" fill="#888">홈페이지 →</text>

    <rect x="99" y="8" width="82" height="40" rx="5" fill="white" stroke="#D0E0F0" stroke-width="1"/>
    <rect x="103" y="16" width="22" height="22" rx="4" fill="#10B981" opacity=".2"/>
    <text x="114" y="31" text-anchor="middle" font-size="12">🤝</text>
    <text x="173" y="24" text-anchor="end" font-size="8" fill="#059669" font-weight="bold">복지관</text>
    <text x="173" y="36" text-anchor="end" font-size="7" fill="#888">홈페이지 →</text>

    <rect x="190" y="8" width="82" height="40" rx="5" fill="white" stroke="#D0E0F0" stroke-width="1"/>
    <rect x="194" y="16" width="22" height="22" rx="4" fill="#F97316" opacity=".2"/>
    <text x="205" y="31" text-anchor="middle" font-size="12">👵</text>
    <text x="264" y="24" text-anchor="end" font-size="8" fill="#EA580C" font-weight="bold">노인복지</text>
    <text x="264" y="36" text-anchor="end" font-size="7" fill="#888">홈페이지 →</text>

    <rect x="8" y="56" width="82" height="40" rx="5" fill="white" stroke="#D0E0F0" stroke-width="1"/>
    <rect x="12" y="64" width="22" height="22" rx="4" fill="#8B5CF6" opacity=".2"/>
    <text x="23" y="79" text-anchor="middle" font-size="12">💊</text>
    <text x="82" y="72" text-anchor="end" font-size="8" fill="#7C3AED" font-weight="bold">복지센터</text>
    <text x="82" y="84" text-anchor="end" font-size="7" fill="#888">홈페이지 →</text>

    <rect x="99" y="56" width="82" height="40" rx="5" fill="white" stroke="#D0E0F0" stroke-width="1"/>
    <rect x="103" y="64" width="22" height="22" rx="4" fill="#14B8A6" opacity=".2"/>
    <text x="114" y="79" text-anchor="middle" font-size="12">🌍</text>
    <text x="173" y="72" text-anchor="end" font-size="8" fill="#0D9488" font-weight="bold">위드아시아</text>
    <text x="173" y="84" text-anchor="end" font-size="7" fill="#888">홈페이지 →</text>

    <rect x="190" y="56" width="82" height="40" rx="5" fill="white" stroke="#D0E0F0" stroke-width="1"/>
    <rect x="194" y="64" width="22" height="22" rx="4" fill="#F97316" opacity=".2"/>
    <text x="205" y="79" text-anchor="middle" font-size="12">🕊️</text>
    <text x="264" y="72" text-anchor="end" font-size="8" fill="#EA580C" font-weight="bold">평화의집</text>
    <text x="264" y="84" text-anchor="end" font-size="7" fill="#888">홈페이지 →</text>

    <rect x="0" y="108" width="280" height="52" fill="#2471A3" opacity=".08" rx="0"/>
    <text x="140" y="128" text-anchor="middle" font-size="9" fill="#2471A3">2 × 3 기관 링크 카드 그리드</text>
    <text x="140" y="145" text-anchor="middle" font-size="9" fill="#2471A3">외부 홈페이지 연결 · Tier 3 전용</text>
    <rect x="0" y="136" width="280" height="24" fill="#2471A3" opacity=".85"/>
    <text x="140" y="151" text-anchor="middle" font-size="9.5" fill="white">🔗 W-01 산하기관 · 2×3 링크 카드</text>
  </svg>`,

  'DO-01': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 160">
    <rect width="280" height="160" fill="#FFFDF0"/>
    <!-- left card - bank -->
    <rect x="8" y="8" width="126" height="118" rx="8" fill="white" stroke="#F0E0A0" stroke-width="1.5"/>
    <text x="71" y="30" text-anchor="middle" font-size="13" fill="#D4A017">🏦</text>
    <text x="71" y="46" text-anchor="middle" font-size="9.5" fill="#5A4A00" font-weight="bold">후원 계좌</text>
    <line x1="20" y1="52" x2="122" y2="52" stroke="#F0E0A0" stroke-width="1"/>
    <text x="20" y="68" font-size="8.5" fill="#888">은행</text>
    <text x="122" y="68" text-anchor="end" font-size="8.5" fill="#333">부산은행</text>
    <text x="20" y="84" font-size="8.5" fill="#888">예금주</text>
    <text x="122" y="84" text-anchor="end" font-size="8.5" fill="#333">○○재단</text>
    <text x="20" y="100" font-size="8.5" fill="#888">계좌번호</text>
    <text x="122" y="100" text-anchor="end" font-size="8" fill="#D4A017" font-weight="bold">051-XXX-XXXX</text>

    <!-- right card - contact -->
    <rect x="146" y="8" width="126" height="118" rx="8" fill="white" stroke="#F0E0A0" stroke-width="1.5"/>
    <text x="209" y="30" text-anchor="middle" font-size="13" fill="#D4A017">📞</text>
    <text x="209" y="46" text-anchor="middle" font-size="9.5" fill="#5A4A00" font-weight="bold">후원 문의</text>
    <line x1="158" y1="52" x2="260" y2="52" stroke="#F0E0A0" stroke-width="1"/>
    <text x="158" y="68" font-size="8.5" fill="#888">전화</text>
    <text x="260" y="68" text-anchor="end" font-size="8.5" fill="#333">051-624-XXXX</text>
    <text x="158" y="84" font-size="8.5" fill="#888">이메일</text>
    <text x="260" y="84" text-anchor="end" font-size="8" fill="#333">xxx@buddhism.kr</text>
    <text x="158" y="100" font-size="8.5" fill="#888">운영시간</text>
    <text x="260" y="100" text-anchor="end" font-size="8" fill="#333">평일 09~18시</text>

    <rect x="0" y="136" width="280" height="24" fill="#D4A017" opacity=".85"/>
    <text x="140" y="151" text-anchor="middle" font-size="9.5" fill="white">💛 DO-01 나눔 동참 · 2단 후원 카드</text>
  </svg>`,

  'V-01': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 160">
    <rect width="280" height="160" fill="#F8F6F4"/>
    <!-- map area (right) -->
    <rect x="148" y="8" width="124" height="118" rx="8" fill="#E8E4E0" stroke="#D0C8C0" stroke-width="1"/>
    <!-- map lines (roads) -->
    <line x1="148" y1="67" x2="272" y2="67" stroke="white" stroke-width="3"/>
    <line x1="195" y1="8" x2="195" y2="126" stroke="white" stroke-width="2.5"/>
    <line x1="148" y1="95" x2="272" y2="95" stroke="white" stroke-width="2"/>
    <line x1="230" y1="8" x2="230" y2="126" stroke="white" stroke-width="1.5"/>
    <!-- pin -->
    <circle cx="213" cy="60" r="10" fill="#6B4226"/>
    <circle cx="213" cy="57" r="5" fill="white"/>
    <polygon points="213,70 207,60 219,60" fill="#6B4226"/>
    <text x="213" y="100" text-anchor="middle" font-size="7.5" fill="#5A4A3A">경내 주차장</text>

    <!-- info area (left) -->
    <rect x="8" y="8" width="132" height="118" rx="8" fill="white" stroke="#DDD0C8" stroke-width="1.5"/>
    <text x="74" y="28" text-anchor="middle" font-size="13">📍</text>
    <text x="74" y="42" text-anchor="middle" font-size="9" fill="#5A3A1A" font-weight="bold">오시는 길</text>
    <line x1="18" y1="48" x2="130" y2="48" stroke="#EEE0D8" stroke-width="1"/>
    <text x="18" y="62" font-size="8" fill="#6B4226">📍</text>
    <text x="30" y="62" font-size="7.5" fill="#333">주소 텍스트</text>
    <text x="18" y="78" font-size="8" fill="#6B4226">🚌</text>
    <text x="30" y="78" font-size="7.5" fill="#333">대중교통 안내</text>
    <text x="18" y="94" font-size="8" fill="#6B4226">🅿</text>
    <text x="30" y="94" font-size="7.5" fill="#333">주차 안내</text>
    <text x="18" y="110" font-size="8" fill="#6B4226">☎</text>
    <text x="30" y="110" font-size="7.5" fill="#333">전화번호</text>

    <rect x="0" y="136" width="280" height="24" fill="#6B4226" opacity=".85"/>
    <text x="140" y="151" text-anchor="middle" font-size="9.5" fill="white">🗺 V-01 오시는 길 · 주소·교통·주차 안내</text>
  </svg>`,
}

// ── 카테고리 (마인드맵 노드) ────────────────────────────────────────────────
const CATEGORIES = [
  { id: 'all',    label: '전체',     emoji: '☸',  color: '#2C1810' },
  { id: '히어로',  label: '히어로',   emoji: '🏮', color: '#2B6B7F' },
  { id: '행사',   label: '행사',     emoji: '📅', color: '#7C3D9A' },
  { id: '미디어', label: '미디어',   emoji: '📷', color: '#3D6B4F' },
  { id: '콘텐츠', label: '콘텐츠',   emoji: '📖', color: '#B8600C' },
  { id: '기관',   label: '기관·정보', emoji: '🏛', color: '#2471A3' },
]

// ── 컴포넌트 ────────────────────────────────────────────────────────────────
interface Props {
  selected: string[]
  onChange: (ids: string[]) => void
}

export default function ModulePicker({ selected, onChange }: Props) {
  const [activeCategory, setActiveCategory] = useState('all')

  const visible = activeCategory === 'all'
    ? BLOCK_DEFS
    : BLOCK_DEFS.filter(b => b.category === activeCategory)

  const toggle = (id: string) => {
    const def = BLOCK_DEFS.find(b => b.id === id)
    if (def?.required) return // 필수 블록은 해제 불가
    onChange(
      selected.includes(id)
        ? selected.filter(s => s !== id)
        : [...selected, id]
    )
  }

  const activeCat = CATEGORIES.find(c => c.id === activeCategory)!

  return (
    <div className="space-y-4">
      {/* ── 마인드맵 노드 바 ── */}
      <div className="bg-white rounded-2xl border border-gray-100 p-3 shadow-sm">
        <p className="text-gray-400 text-sm mb-2 text-center">카테고리를 선택해 블록을 탐색하세요</p>

        {/* 노드 연결도 */}
        <div className="relative flex items-center justify-center gap-1 py-1">
          {/* 중앙 노드 */}
          <div
            className="flex flex-col items-center cursor-pointer select-none"
            onClick={() => setActiveCategory('all')}
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold transition-all shadow-sm ${
              activeCategory === 'all'
                ? 'bg-temple-brown text-temple-gold scale-110 shadow-md'
                : 'bg-gray-100 text-gray-500'
            }`}>
              ☸
            </div>
            <span className={`text-xs mt-1 font-bold ${activeCategory === 'all' ? 'text-temple-brown' : 'text-gray-400'}`}>전체</span>
          </div>

          {/* 연결선 */}
          <div className="flex-1 h-px bg-gray-200 max-w-[20px]" />

          {/* 카테고리 노드들 */}
          {CATEGORIES.slice(1).map((cat, i) => {
            const count = BLOCK_DEFS.filter(b => b.category === cat.id).length
            const isActive = activeCategory === cat.id
            return (
              <div key={cat.id} className="flex items-center">
                {i > 0 && <div className="w-1.5 h-px bg-gray-200" />}
                <div
                  className="flex flex-col items-center cursor-pointer select-none"
                  onClick={() => setActiveCategory(cat.id)}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-base transition-all shadow-sm ${
                      isActive ? 'scale-110 shadow-md text-white' : 'bg-gray-100 text-gray-500'
                    }`}
                    style={isActive ? { background: cat.color } : {}}
                  >
                    {cat.emoji}
                  </div>
                  <span className={`text-xs mt-1 whitespace-nowrap ${isActive ? 'font-bold' : 'text-gray-400'}`}
                    style={isActive ? { color: cat.color } : {}}>
                    {cat.label}
                  </span>
                  <span className="text-xs text-gray-300">{count}개</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── 카테고리 타이틀 ── */}
      <div className="flex items-center gap-2">
        <div className="w-1 h-6 rounded-full" style={{ background: activeCat.color }} />
        <h3 className="text-temple-brown font-bold text-lg">
          {activeCat.emoji} {activeCat.label === '전체' ? '전체 블록 보물함' : `${activeCat.label} 블록`}
        </h3>
        <span className="text-gray-400 text-base">({visible.length}개)</span>
      </div>

      {/* ── 블록 카드 그리드 ── */}
      <div className="grid grid-cols-2 gap-3">
        {visible.map(block => {
          const isSelected = selected.includes(block.id)
          const isRequired = block.required

          return (
            <div
              key={block.id}
              onClick={() => toggle(block.id)}
              className={`relative rounded-2xl overflow-hidden border-2 transition-all cursor-pointer select-none ${
                isSelected
                  ? 'border-temple-gold shadow-lg scale-[1.02]'
                  : isRequired
                    ? 'border-gray-300 opacity-90'
                    : 'border-gray-100 active:scale-[0.98]'
              }`}
              style={isSelected ? { boxShadow: `0 4px 20px ${block.accent}40` } : {}}
            >
              {/* SVG 미리보기 */}
              <div
                className="w-full"
                style={{ aspectRatio: '280/160' }}
                dangerouslySetInnerHTML={{ __html: BLOCK_SVG[block.id] || `<svg viewBox="0 0 280 160"><rect fill="${block.accent}" opacity=".2" width="280" height="160"/><text x="140" y="90" text-anchor="middle" font-size="40">${CATEGORIES.find(c=>c.id===block.category)?.emoji || '☸'}</text></svg>` }}
              />

              {/* 카드 본문 */}
              <div className="p-3 bg-white">
                {/* 헤더 */}
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded-full text-white"
                    style={{ background: block.accent }}
                  >
                    {block.id}
                  </span>
                  {isRequired && (
                    <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full font-bold">필수</span>
                  )}
                  {block.tier > 1 && (
                    <span className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full">Tier {block.tier}+</span>
                  )}
                </div>

                <h4 className="font-bold text-temple-brown text-base leading-tight mb-1">{block.name}</h4>
                <p className="text-gray-500 text-sm leading-snug mb-2">{block.desc}</p>

                {/* 기능 태그 */}
                <div className="flex flex-wrap gap-1">
                  {block.features.slice(0, 3).map(f => (
                    <span key={f} className="text-xs bg-gray-50 text-gray-500 px-1.5 py-0.5 rounded-full border border-gray-100">
                      {f}
                    </span>
                  ))}
                </div>
              </div>

              {/* 선택 오버레이 */}
              {isSelected && (
                <div className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center shadow-md"
                  style={{ background: block.accent }}>
                  <span className="text-white text-base font-bold">✓</span>
                </div>
              )}
              {isRequired && !isSelected && (
                <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center shadow-sm">
                  <span className="text-white text-xs">🔒</span>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* ── 선택된 모듈 패널 ── */}
      <div className="bg-white rounded-2xl border-2 border-temple-gold border-opacity-40 p-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-temple-brown font-bold text-base">
            선택된 모듈 <span className="text-temple-gold">{selected.length}개</span>
          </p>
          {selected.length > 0 && (
            <button
              onClick={() => onChange(BLOCK_DEFS.filter(b => b.required).map(b => b.id))}
              className="text-gray-400 text-sm underline"
            >
              필수만 남기기
            </button>
          )}
        </div>

        {selected.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-2">위 카드를 클릭해 블록을 선택하세요</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {selected.map(id => {
              const def = BLOCK_DEFS.find(b => b.id === id)!
              return (
                <div
                  key={id}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-white text-sm font-semibold"
                  style={{ background: def.accent }}
                >
                  <span>{def.id}</span>
                  <span className="opacity-80 text-xs">{def.name}</span>
                  {!def.required && (
                    <button
                      onClick={e => { e.stopPropagation(); toggle(id) }}
                      className="ml-0.5 opacity-70 hover:opacity-100 font-bold text-base leading-none"
                    >
                      ×
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* 실행 순서 힌트 */}
        {selected.length > 0 && (
          <p className="text-gray-400 text-xs mt-2 text-center">
            표시 순서: {selected.map(id => BLOCK_DEFS.find(b => b.id === id)?.id).join(' → ')}
          </p>
        )}
      </div>
    </div>
  )
}
