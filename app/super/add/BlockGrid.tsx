'use client'
import { useState } from 'react'

// ── 타입 ──────────────────────────────────────────────────────────────────────
interface BlockItem { code: string; name: string; desc: string; tags?: string[]; previewImageUrl?: string }
type CatKey = 'H' | 'T' | 'L' | 'P' | 'E' | 'B' | 'G' | 'C' | 'I' | 'X'

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
  { key: 'X', icon: '📚',  label: 'Q&A·자료관',  color: '#5B2D8E' },
]

// ── 65개 부품 카탈로그 ────────────────────────────────────────────────────────
export const BLOCK_CATALOG: Record<CatKey, BlockItem[]> = {
  H: [
    { code: 'H-01', name: '파티클+연등형',        desc: '금빛 파티클 + 연등 동시 효과 (문수사 원형)',        tags: ['파티클', '연등', '애니메이션'] },
    { code: 'H-02', name: '정지 이미지형',        desc: '대표 사진 + 사찰명 오버레이 + CTA 버튼',           tags: ['이미지', 'CTA', '심플'] },
    { code: 'H-03', name: '슬라이드형',           desc: '3~5장 자동전환·터치스와이프 지원',                  tags: ['슬라이드', '자동전환', '터치'] },
    { code: 'H-04', name: '파티클 전용형',        desc: '금빛 파티클 사찰명 조립 (연등 제외)',               tags: ['파티클', '금빛'] },
    { code: 'H-05', name: '연등 부유형',          desc: '어두운 배경 + 5색 연등 부유 · 보림사 검증완료',     tags: ['연등', '부유', '프리미엄', '네이비', '금빛'] },
    { code: 'H-06', name: 'Lamp 광명형',          desc: '원뿔 빛줄기 + 금빛 광명 framer-motion',            tags: ['빛', '광명', 'framer-motion'] },
    { code: 'H-07', name: '원형→그리드 변환형',   desc: '원이 스크롤 시 4×4 메뉴로 전환',                   tags: ['스크롤', '변환', '인터랙티브'] },
    { code: 'H-08', name: '촛불법당형',           desc: '법당 기둥 + 촛불 flicker + 중앙 주불 SVG',         tags: ['촛불', '법당', '주불', '장엄', '프리미엄'] },
    { code: 'H-09', name: '계절 테마형',          desc: '봄·여름·가을·겨울 자동 전환',                      tags: ['계절', '테마', '자동'] },
    { code: 'H-10', name: '연등행렬형',           desc: '부처님오신날 종로 연등행렬 · 군중+연등 동적',       tags: ['연등행렬', '축제', '도심', '부처님오신날'] },
    { code: 'H-11', name: '봉축의 하루',          desc: '새벽예불→법요식→연등제작→행렬→점등→회향 6장면 그리드', tags: ['봉축', '6장면', '그리드', '부처님오신날', '하루'] },
  ],
  T: [
    { code: 'T-01', name: '전각 배치도형',        desc: '경내 전각 위치 인터랙티브 지도',                    tags: ['지도', '인터랙티브', '전각'] },
    { code: 'T-02', name: '전각 상세 카드형',     desc: '전각별 사진+설명 카드',                            tags: ['전각', '카드', '사진'] },
    { code: 'T-03', name: '문화재 갤러리형',      desc: '국보·보물 이미지 그리드',                           tags: ['문화재', '국보', '갤러리'] },
    { code: 'T-04', name: '가로 스크롤 연혁형',   desc: '창건~현재 타임라인',                               tags: ['연혁', '타임라인', '역사'] },
    { code: 'T-05', name: '주지스님 인사말형',    desc: '사진+친필메시지 레이아웃',                         tags: ['주지', '인사말', '사진'] },
    { code: 'T-06', name: '종단 소개 카드형',     desc: '소속 종단·등록번호 표시',                          tags: ['종단', '정보'] },
  ],
  L: [
    { code: 'L-01', name: '음력 달력형',          desc: '초하루·보름 자동 표시',                            tags: ['음력', '달력', '자동'] },
    { code: 'L-02', name: '주간 리스트형',        desc: '이번 주 법회 일정 목록',                           tags: ['주간', '리스트', '일정'] },
    { code: 'L-03', name: '정기법회 카드형',      desc: '일요·수요 법회 고정 카드',                         tags: ['정기', '법회', '카드'] },
    { code: 'L-04', name: '재일 전용형',          desc: '지장재일·관음재일 모듈',                           tags: ['재일', '지장', '관음'] },
    { code: 'L-05', name: 'D-Day 카운트형',       desc: '특별법회 D-Day 표시',                              tags: ['D-Day', '카운트', '특별'] },
    { code: 'L-06', name: '법회 사진 카드형',     desc: '행사 후 사진 포함 카드',                           tags: ['사진', '카드', '행사'] },
    { code: 'L-07', name: '격주 법회형',          desc: '격주 패턴 자동 계산',                              tags: ['격주', '자동', '패턴'] },
  ],
  P: [
    { code: 'P-01', name: '백일기도 카드',        desc: '접수·기간·회향일 표시',                            tags: ['백일기도', '접수', '기간'] },
    { code: 'P-02', name: '1년기도 카드',         desc: '연간 기도 접수 모듈',                              tags: ['1년기도', '연간', '접수'] },
    { code: 'P-03', name: '천일기도 카드',        desc: '진행률 바 포함',                                   tags: ['천일기도', '진행률'] },
    { code: 'P-04', name: '수험생 합격기도',      desc: '시즌별 강조 배너',                                 tags: ['수험생', '합격', '시즌'] },
    { code: 'P-05', name: '사업번창기도',         desc: '접수 폼 포함',                                     tags: ['사업', '번창', '폼'] },
    { code: 'P-06', name: '49재·천도재',         desc: '일정 및 신청 안내',                                tags: ['49재', '천도재', '신청'] },
    { code: 'P-07', name: '인등 접수 모듈',       desc: '이름·기간 입력+결제',                              tags: ['인등', '접수', '결제'] },
    { code: 'P-08', name: '연등 접수 모듈',       desc: '부처님오신날 연동',                                tags: ['연등', '부처님오신날'] },
    { code: 'P-09', name: '초하루 불공',          desc: '음력 1일 자동 강조',                               tags: ['초하루', '음력', '불공'] },
    { code: 'P-10', name: '보름 불공',            desc: '음력 15일 자동 강조',                              tags: ['보름', '음력', '불공'] },
  ],
  E: [
    { code: 'E-01', name: '산사음악회 카드',      desc: '포스터+일정+예약',                                 tags: ['음악회', '포스터', '예약'] },
    { code: 'E-02', name: '무료국수공양',         desc: '일시·장소·참여 안내',                              tags: ['공양', '무료', '참여'] },
    { code: 'E-03', name: '연등 축제',            desc: '체험 프로그램 안내',                               tags: ['연등', '축제', '체험'] },
    { code: 'E-04', name: '템플스테이 카드',      desc: '일정·비용·신청링크',                               tags: ['템플스테이', '신청'] },
    { code: 'E-05', name: '성지순례 카드',        desc: '코스·일정·참가비',                                 tags: ['성지순례', '코스'] },
    { code: 'E-06', name: '불교강좌 카드',        desc: '강사·일정·수강신청',                               tags: ['강좌', '수강신청'] },
  ],
  B: [
    { code: 'B-01', name: '불사 목표 그래프형',   desc: '목표금액 달성률 바',                               tags: ['불사', '목표', '그래프'] },
    { code: 'B-02', name: '기와시주 목록형',      desc: '시주자 명단 표시',                                 tags: ['기와시주', '명단'] },
    { code: 'B-03', name: '불사 사진첩형',        desc: '공사 진행 사진 갤러리',                            tags: ['사진첩', '공사', '갤러리'] },
    { code: 'B-04', name: '동참자 명예전당형',    desc: '기여자 이름 표시',                                 tags: ['명예전당', '기여자'] },
    { code: 'B-05', name: '중창불사 카드',        desc: '법당 중창 모금 모듈',                              tags: ['중창', '모금'] },
    { code: 'B-06', name: '불상 조성 카드',       desc: '불상 제작 동참 모듈',                              tags: ['불상', '조성', '동참'] },
  ],
  G: [
    { code: 'G-01', name: '3열 그리드형',         desc: '최근 사진 자동 로드',                              tags: ['그리드', '사진', '자동'] },
    { code: 'G-02', name: '슬라이드형',           desc: '자동 전환 갤러리',                                 tags: ['슬라이드', '자동전환'] },
    { code: 'G-03', name: '유튜브 법문형',        desc: '유튜브 영상 임베드',                               tags: ['유튜브', '영상', '법문'] },
    { code: 'G-04', name: '앨범별 분류형',        desc: '행사별 앨범 폴더',                                 tags: ['앨범', '분류', '폴더'] },
  ],
  C: [
    { code: 'C-01', name: '가상계좌 발급형',      desc: '실시간 가상계좌 생성',                             tags: ['가상계좌', '결제', '실시간'] },
    { code: 'C-02', name: '카카오페이 모듈',      desc: 'QR+링크 간편결제',                                 tags: ['카카오페이', 'QR', '간편결제'] },
    { code: 'C-03', name: '토스 모듈',            desc: '토스 간편결제 연동',                               tags: ['토스', '간편결제'] },
    { code: 'C-04', name: '무통장 안내 카드',     desc: '계좌번호+입금자명 안내',                           tags: ['무통장', '계좌'] },
    { code: 'C-05', name: '신용카드 결제',        desc: 'PG사 연동 카드결제',                               tags: ['신용카드', 'PG', '결제'] },
  ],
  I: [
    { code: 'I-01', name: '108사찰 현황 지도',    desc: '전국 지도 핀 표시',                                tags: ['지도', '전국', '현황'] },
    { code: 'I-02', name: '교리 요약 도표',       desc: '불교 기초 인포그래픽',                             tags: ['교리', '도표', '인포그래픽'] },
    { code: 'I-03', name: '동참자 통계 그래프',   desc: '기도·불사 통계 차트',                              tags: ['통계', '차트', '그래프'] },
    { code: 'I-04', name: '연간 일정 로드맵',     desc: '1년 행사 타임라인',                                tags: ['연간', '로드맵', '타임라인'] },
    { code: 'IG-01', name: '숫자 카운터 인포그래픽', desc: '통계 숫자 카운터 애니메이션',                  tags: ['카운터', '통계', '애니메이션'] },
  ],
  X: [
    { code: 'QA-01', name: 'Q&A 슬라이드 자료관', desc: 'FAQ·슬라이드·인포그래픽 탭 구성',                tags: ['FAQ', 'Q&A', '자료관'] },
  ],
}

// ── 필수 항목 (항상 포함) ──────────────────────────────────────────────────────
const MANDATORY_ITEMS = [
  '주지스님 인사말',
  '공지사항 배너 (티커)',
  '우리절 갤러리',
  '하단 푸터 (연락처·링크)',
  '우리절 연혁',
  '오늘의 부처님말씀',
  '오시는길 (네이버지도)',
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
  const [previewBlock, setPreviewBlock] = useState<BlockItem | null>(null)

  const toggle = (code: string) => {
    onChange(selected.includes(code) ? selected.filter(c => c !== code) : [...selected, code])
  }

  const activeCat = CATEGORIES.find(c => c.key === activeTab)!
  const activeBlocks = BLOCK_CATALOG[activeTab]
  const previewCat = previewBlock
    ? CATEGORIES.find(c => BLOCK_CATALOG[c.key].some(b => b.code === previewBlock.code))!
    : activeCat

  return (
    <div className="relative">
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
                  style={{ backgroundColor: isActive ? 'rgba(255,255,255,0.3)' : cat.color, color: '#fff' }}
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
              onClick={() => setPreviewBlock(block)}
              className={`relative rounded-xl border-2 overflow-hidden text-left transition-all active:scale-95 flex flex-col ${
                isSelected ? 'border-temple-gold shadow-md' : 'border-gray-200 bg-white'
              }`}
            >
              {/* 카테고리 컬러 바 */}
              <div className="w-full h-1" style={{ backgroundColor: activeCat.color }} />

              {/* 카드 본문 */}
              <div className={`flex-1 px-3 py-3 ${isSelected ? 'bg-yellow-50' : 'bg-white'}`}>
                <code
                  className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded mb-1.5 inline-block"
                  style={{
                    backgroundColor: activeCat.color + (isSelected ? '25' : '15'),
                    color: isSelected ? activeCat.color : '#999999',
                  }}
                >
                  {block.code}
                </code>
                <p className={`text-sm font-bold leading-tight mb-1 ${isSelected ? 'text-temple-brown' : 'text-gray-700'}`}>
                  {block.name}
                </p>
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

      {/* ── 미리보기 슬라이드 패널 ─────────────────────────────────────────── */}
      {/* 딤 배경 */}
      <div
        className="fixed inset-0 z-40 transition-opacity duration-300"
        style={{
          backgroundColor: 'rgba(0,0,0,0.5)',
          opacity: previewBlock ? 1 : 0,
          pointerEvents: previewBlock ? 'auto' : 'none',
        }}
        onClick={() => setPreviewBlock(null)}
      />

      {/* 패널 본체 */}
      <div
        className="fixed top-0 right-0 h-full w-80 max-w-[90vw] bg-white z-50 shadow-2xl flex flex-col"
        style={{
          transform: previewBlock ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        {previewBlock && (
          <>
            {/* 패널 헤더 */}
            <div
              className="flex items-center justify-between px-5 py-4 flex-shrink-0"
              style={{ backgroundColor: previewCat.color }}
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">{previewCat.icon}</span>
                <span className="text-white font-bold text-base">{previewCat.label}</span>
              </div>
              <button
                onClick={() => setPreviewBlock(null)}
                className="text-white text-2xl leading-none opacity-80 hover:opacity-100"
              >
                ×
              </button>
            </div>

            {/* 스크롤 영역 */}
            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
              {/* 미리보기 이미지 / iframe */}
              {previewBlock.previewImageUrl ? (
                <img
                  src={previewBlock.previewImageUrl}
                  alt={previewBlock.name}
                  className="w-full rounded-xl object-cover"
                  style={{ maxHeight: '180px' }}
                />
              ) : (
                <div className="w-full rounded-xl overflow-hidden relative" style={{ height: '180px', background: '#0d0a06' }}>
                  <iframe
                    src={`/block-preview/${previewBlock.code}`}
                    title={previewBlock.name}
                    style={{
                      width: '375px',
                      height: '600px',
                      border: 'none',
                      transformOrigin: 'top left',
                      transform: 'scale(0.507)',
                      pointerEvents: 'none',
                    }}
                  />
                </div>
              )}

              {/* 블록 코드 + 이름 */}
              <div>
                <code
                  className="text-xs font-mono font-bold px-2 py-1 rounded"
                  style={{ backgroundColor: previewCat.color + '20', color: previewCat.color }}
                >
                  {previewBlock.code}
                </code>
                <h3 className="text-xl font-bold text-gray-800 mt-2">{previewBlock.name}</h3>
              </div>

              {/* 설명 */}
              <p className="text-sm text-gray-600 leading-relaxed">{previewBlock.desc}</p>

              {/* 태그 */}
              {previewBlock.tags && previewBlock.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {previewBlock.tags.map(tag => (
                    <span
                      key={tag}
                      className="text-xs px-2.5 py-1 rounded-full font-medium"
                      style={{ backgroundColor: previewCat.color + '15', color: previewCat.color }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* 하단 선택 버튼 */}
            <div className="flex-shrink-0 px-5 py-4 border-t border-gray-100">
              {selected.includes(previewBlock.code) ? (
                <button
                  onClick={() => { toggle(previewBlock.code); setPreviewBlock(null) }}
                  className="w-full py-4 rounded-2xl font-bold text-base border-2 border-red-300 text-red-500 bg-red-50 active:scale-95 transition-all"
                >
                  ✕ 선택 해제
                </button>
              ) : (
                <button
                  onClick={() => { toggle(previewBlock.code); setPreviewBlock(null) }}
                  className="w-full py-4 rounded-2xl font-bold text-base text-white active:scale-95 transition-all"
                  style={{ backgroundColor: previewCat.color }}
                >
                  ✓ 이 블록 선택하기
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
