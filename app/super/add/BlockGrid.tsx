'use client'
import { useState } from 'react'

// ── 타입 ──────────────────────────────────────────────────────────────────────
interface BlockItem { code: string; name: string; desc: string }
type CatKey = 'H' | 'T' | 'L' | 'P' | 'E' | 'B' | 'G' | 'C' | 'I'

// ── 카테고리 정의 ─────────────────────────────────────────────────────────────
const CATEGORIES: { key: CatKey; icon: string; label: string; color: string }[] = [
  { key: 'H', icon: '🏯',  label: '히어로',      color: '#1B3A6B' },
  { key: 'T', icon: '🏛️', label: '사찰소개',     color: '#5C3A00' },
  { key: 'L', icon: '📿',  label: '법회',         color: '#6B4226' },
  { key: 'P', icon: '🙏',  label: '기도·불공',   color: '#8B0000' },
  { key: 'E', icon: '🎋',  label: '행사',         color: '#2D5016' },
  { key: 'B', icon: '🪔',  label: '기도불사동참', color: '#B8860B' },
  { key: 'G', icon: '📸',  label: '갤러리',       color: '#2C5F8A' },
  { key: 'C', icon: '💳',  label: '결제수단',     color: '#4A4A4A' },
  { key: 'I', icon: '📊',  label: '인포그래픽',   color: '#3D5A3E' },
]

// ── 65개 부품 카탈로그 ────────────────────────────────────────────────────────
export const BLOCK_CATALOG: Record<CatKey, BlockItem[]> = {
  H: [
    { code: 'H-01', name: '파티클 문자형',       desc: '금빛 파티클이 사찰명 조합' },
    { code: 'H-02', name: '정지 이미지형',        desc: '대표 사진 + 사찰명 오버레이' },
    { code: 'H-03', name: '슬라이드형',           desc: '3~5장 자동 전환' },
    { code: 'H-04', name: '비디오 배경형',        desc: '유튜브/MP4 배경 영상' },
    { code: 'H-05', name: '연등 애니메이션형',    desc: '연등 흔들림 효과' },
    { code: 'H-06', name: '서체 강조형',          desc: '한자+한글 타이포 중심' },
    { code: 'H-07', name: 'Scroll Morph형',       desc: '스크롤 따라 변하는 히어로' },
    { code: 'H-08', name: '행사 전면 배치형',     desc: 'D-30 이내 행사 금색 강조' },
    { code: 'H-09', name: '계절 테마형',          desc: '봄·여름·가을·겨울 자동 전환' },
    { code: 'H-10', name: '3D 모델형',            desc: 'Sketchfab 불상 3D 인터랙션' },
  ],
  T: [
    { code: 'T-01', name: '전각 배치도형',        desc: '경내 전각 위치 인터랙티브 지도' },
    { code: 'T-02', name: '전각 상세 카드형',     desc: '전각별 사진+설명 카드' },
    { code: 'T-03', name: '문화재 갤러리형',      desc: '국보·보물 이미지 그리드' },
    { code: 'T-04', name: '가로 스크롤 연혁형',   desc: '창건~현재 타임라인' },
    { code: 'T-05', name: '주지스님 인사말형',    desc: '사진+친필메시지 레이아웃' },
    { code: 'T-06', name: '종단 소개 카드형',     desc: '소속 종단·등록번호 표시' },
  ],
  L: [
    { code: 'L-01', name: '음력 달력형',          desc: '초하루·보름 자동 표시' },
    { code: 'L-02', name: '주간 리스트형',        desc: '이번 주 법회 일정 목록' },
    { code: 'L-03', name: '정기법회 카드형',      desc: '일요·수요 법회 고정 카드' },
    { code: 'L-04', name: '재일 전용형',          desc: '지장재일·관음재일 모듈' },
    { code: 'L-05', name: 'D-Day 카운트형',       desc: '특별법회 D-Day 표시' },
    { code: 'L-06', name: '법회 사진 카드형',     desc: '행사 후 사진 포함 카드' },
    { code: 'L-07', name: '격주 법회형',          desc: '격주 패턴 자동 계산' },
  ],
  P: [
    { code: 'P-01', name: '백일기도 카드',        desc: '접수·기간·회향일 표시' },
    { code: 'P-02', name: '1년기도 카드',         desc: '연간 기도 접수 모듈' },
    { code: 'P-03', name: '천일기도 카드',        desc: '진행률 바 포함' },
    { code: 'P-04', name: '수험생 합격기도',      desc: '시즌별 강조 배너' },
    { code: 'P-05', name: '사업번창기도',         desc: '접수 폼 포함' },
    { code: 'P-06', name: '49재·천도재',         desc: '일정 및 신청 안내' },
    { code: 'P-07', name: '인등 접수 모듈',       desc: '이름·기간 입력+결제' },
    { code: 'P-08', name: '연등 접수 모듈',       desc: '부처님오신날 연동' },
    { code: 'P-09', name: '초하루 불공',          desc: '음력 1일 자동 강조' },
    { code: 'P-10', name: '보름 불공',            desc: '음력 15일 자동 강조' },
  ],
  E: [
    { code: 'E-01', name: '산사음악회 카드',      desc: '포스터+일정+예약' },
    { code: 'E-02', name: '무료국수공양',         desc: '일시·장소·참여 안내' },
    { code: 'E-03', name: '연등 축제',            desc: '체험 프로그램 안내' },
    { code: 'E-04', name: '템플스테이 카드',      desc: '일정·비용·신청링크' },
    { code: 'E-05', name: '성지순례 카드',        desc: '코스·일정·참가비' },
    { code: 'E-06', name: '불교강좌 카드',        desc: '강사·일정·수강신청' },
  ],
  B: [
    { code: 'B-01', name: '불사 목표 그래프형',   desc: '목표금액 달성률 바' },
    { code: 'B-02', name: '기와시주 목록형',      desc: '시주자 명단 표시' },
    { code: 'B-03', name: '불사 사진첩형',        desc: '공사 진행 사진 갤러리' },
    { code: 'B-04', name: '동참자 명예전당형',    desc: '기여자 이름 표시' },
    { code: 'B-05', name: '중창불사 카드',        desc: '법당 중창 모금 모듈' },
    { code: 'B-06', name: '불상 조성 카드',       desc: '불상 제작 동참 모듈' },
  ],
  G: [
    { code: 'G-01', name: '3열 그리드형',         desc: '최근 사진 자동 로드' },
    { code: 'G-02', name: '슬라이드형',           desc: '자동 전환 갤러리' },
    { code: 'G-03', name: '유튜브 법문형',        desc: '유튜브 영상 임베드' },
    { code: 'G-04', name: '앨범별 분류형',        desc: '행사별 앨범 폴더' },
  ],
  C: [
    { code: 'C-01', name: '가상계좌 발급형',      desc: '실시간 가상계좌 생성' },
    { code: 'C-02', name: '카카오페이 모듈',      desc: 'QR+링크 간편결제' },
    { code: 'C-03', name: '토스 모듈',            desc: '토스 간편결제 연동' },
    { code: 'C-04', name: '무통장 안내 카드',     desc: '계좌번호+입금자명 안내' },
    { code: 'C-05', name: '신용카드 결제',        desc: 'PG사 연동 카드결제' },
  ],
  I: [
    { code: 'I-01', name: '108사찰 현황 지도',    desc: '전국 지도 핀 표시' },
    { code: 'I-02', name: '교리 요약 도표',       desc: '불교 기초 인포그래픽' },
    { code: 'I-03', name: '동참자 통계 그래프',   desc: '기도·불사 통계 차트' },
    { code: 'I-04', name: '연간 일정 로드맵',     desc: '1년 행사 타임라인' },
  ],
}

// ── 필수 항목 (항상 포함) ──────────────────────────────────────────────────────
const MANDATORY_ITEMS = [
  '주지스님 인사말',
  '우리절 연혁',
  '공지사항 배너',
  '오늘의 부처님말씀',
  '우리절 갤러리',
  '오시는길 (네이버지도)',
  '하단 푸터 (연락처·링크)',
]

// ── 블록 이름 조회 헬퍼 ───────────────────────────────────────────────────────
export function getBlockName(code: string): string {
  for (const blocks of Object.values(BLOCK_CATALOG)) {
    const found = blocks.find(b => b.code === code)
    if (found) return found.name
  }
  return code
}

// ── Props ─────────────────────────────────────────────────────────────────────
interface Props {
  selected: string[]
  onChange: (ids: string[]) => void
}

export default function BlockGrid({ selected, onChange }: Props) {
  const [activeTab, setActiveTab] = useState<CatKey>('H')

  const toggle = (code: string) => {
    onChange(selected.includes(code) ? selected.filter(c => c !== code) : [...selected, code])
  }

  const activeCat = CATEGORIES.find(c => c.key === activeTab)!
  const activeBlocks = BLOCK_CATALOG[activeTab]

  return (
    <div>
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-temple-brown font-bold text-base">블록 보물함</p>
        <span className="bg-temple-gold text-temple-brown text-sm font-bold px-3 py-1 rounded-full">
          {selected.length}개 선택
        </span>
      </div>

      {/* 카테고리 탭 (가로 스크롤) */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
        {CATEGORIES.map(cat => {
          const isActive = cat.key === activeTab
          const selCount = BLOCK_CATALOG[cat.key].filter(b => selected.includes(b.code)).length
          return (
            <button
              key={cat.key}
              onClick={() => setActiveTab(cat.key)}
              className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl border-2 text-sm font-bold transition-all whitespace-nowrap"
              style={{
                backgroundColor: isActive ? cat.color : '#ffffff',
                borderColor: cat.color,
                color: isActive ? '#ffffff' : cat.color,
              }}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
              {selCount > 0 && (
                <span
                  className="w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold"
                  style={{ backgroundColor: isActive ? 'rgba(255,255,255,0.3)' : cat.color, color: isActive ? '#fff' : '#fff' }}
                >
                  {selCount}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* 블록 카드 그리드 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-6">
        {activeBlocks.map(block => {
          const isSelected = selected.includes(block.code)
          return (
            <button
              key={block.code}
              onClick={() => toggle(block.code)}
              className={`relative rounded-xl border-2 overflow-hidden text-left transition-all active:scale-95 flex flex-col ${
                isSelected ? 'border-temple-gold shadow-md' : 'border-gray-200 bg-white'
              }`}
            >
              {/* 카테고리 컬러 바 */}
              <div className="w-full h-1" style={{ backgroundColor: activeCat.color }} />

              {/* 카드 본문 */}
              <div className={`flex-1 px-3 py-3 ${isSelected ? 'bg-yellow-50' : 'bg-white'}`}>
                {/* 블록 코드 */}
                <code
                  className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded mb-1.5 inline-block"
                  style={{
                    backgroundColor: activeCat.color + (isSelected ? '25' : '15'),
                    color: isSelected ? activeCat.color : '#999999',
                  }}
                >
                  {block.code}
                </code>
                {/* 부품명 */}
                <p className={`text-sm font-bold leading-tight mb-1 ${isSelected ? 'text-temple-brown' : 'text-gray-700'}`}>
                  {block.name}
                </p>
                {/* 설명 */}
                <p className="text-[10px] text-gray-400 leading-tight line-clamp-2">
                  {block.desc}
                </p>
              </div>

              {/* 선택 체크 뱃지 */}
              {isSelected && (
                <div
                  className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center shadow-sm"
                  style={{ backgroundColor: activeCat.color }}
                >
                  <span className="text-white text-[10px] font-bold">✓</span>
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* 필수 항목 (항상 포함) */}
      <div className="rounded-2xl overflow-hidden border-2 border-yellow-300">
        <div className="bg-temple-gold px-4 py-2.5 flex items-center gap-2">
          <span className="text-lg">⭐</span>
          <p className="text-temple-brown font-bold text-sm">필수 항목 (전 사찰 자동 포함)</p>
        </div>
        <div className="bg-yellow-50 px-4 py-3 grid grid-cols-2 gap-x-4 gap-y-1.5">
          {MANDATORY_ITEMS.map(item => (
            <div key={item} className="flex items-center gap-1.5">
              <span className="text-temple-gold text-xs">✓</span>
              <span className="text-temple-brown text-xs font-medium">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
