'use client'
import { useState } from 'react'

// ── 타입 ──────────────────────────────────────────────────────────────────────
interface BlockItem { code: string; name: string; desc: string; tags?: string[]; previewImageUrl?: string }
// 확정 탭 순서: 히어로 / 법회 / 기도·불공 / 행사 / 템플스테이 / 결제수단 / 사찰자료관
type CatKey = 'H' | 'BH' | 'PR' | 'EV' | 'TS' | 'L' | 'C' | 'DR'

// ── 카테고리 정의 (2026.04.08 전면 개편 확정) ────────────────────────────────
const CATEGORIES: { key: CatKey; icon: string; label: string; color: string }[] = [
  { key: 'H',  icon: '🏯',  label: '히어로',      color: '#1B3A6B' },
  { key: 'BH', icon: '📿',  label: '법회',         color: '#6B4226' },
  { key: 'PR', icon: '🙏',  label: '기도·불공',   color: '#8B0000' },
  { key: 'EV', icon: '🎋',  label: '행사',         color: '#2D5016' },
  { key: 'TS', icon: '🏕️', label: '템플스테이',   color: '#2C5F4A' },
  { key: 'L',  icon: '🕯',  label: '인등불사',     color: '#8B5A00' },
  { key: 'C',  icon: '💳',  label: '결제수단',     color: '#4A4A4A' },
  { key: 'DR', icon: '📖',  label: '사찰자료관',   color: '#5B2D8E' },
]

// ── 블록 카탈로그 (2026.04.08 전면 개편) ─────────────────────────────────────
export const BLOCK_CATALOG: Record<CatKey, BlockItem[]> = {
  // ── 히어로 (유지) ───────────────────────────────────────────────────────────
  H: [
    { code: 'H-01', name: '파티클+연등형',        desc: '금빛 파티클 + 연등 동시 효과 (문수사 원형)',           tags: ['파티클', '연등', '애니메이션'] },
    { code: 'H-02', name: '정지 이미지형',        desc: '대표 사진 + 사찰명 오버레이 + CTA 버튼',              tags: ['이미지', 'CTA', '심플'] },
    { code: 'H-03', name: '슬라이드형',           desc: '3~5장 자동전환 · 터치스와이프 지원',                   tags: ['슬라이드', '자동전환', '터치'] },
    { code: 'H-04', name: '파티클 전용형',        desc: '금빛 파티클 사찰명 조립 (연등 제외)',                  tags: ['파티클', '금빛'] },
    { code: 'H-05', name: '연등 부유형',          desc: '어두운 배경 + 5색 연등 부유 · 보림사 검증완료',        tags: ['연등', '부유', '프리미엄', '네이비', '금빛'] },
    { code: 'H-06', name: 'Lamp 광명형',          desc: '원뿔 빛줄기 + 금빛 광명 framer-motion',               tags: ['빛', '광명', 'framer-motion'] },
    { code: 'H-07', name: '원형→그리드 변환형',   desc: '원이 스크롤 시 4×4 메뉴로 전환',                      tags: ['스크롤', '변환', '인터랙티브'] },
    { code: 'H-08', name: '촛불법당형',           desc: '법당 기둥 + 촛불 flicker + 중앙 주불 SVG',            tags: ['촛불', '법당', '주불', '장엄', '프리미엄'] },
    { code: 'H-09', name: '계절 테마형',          desc: '봄·여름·가을·겨울 자동 전환',                         tags: ['계절', '테마', '자동'] },
    { code: 'H-10', name: '연등행렬형',           desc: '부처님오신날 종로 연등행렬 · 군중+연등 동적',          tags: ['연등행렬', '축제', '도심', '부처님오신날'] },
    { code: 'H-11', name: '봉축의 하루',          desc: '새벽예불→법요식→연등제작→행렬→점등→회향 6장면 그리드',  tags: ['봉축', '6장면', '그리드', '부처님오신날', '하루'] },
    { code: 'H-12', name: '인등공양형 삼천인등',   desc: '1,000등 캔버스 히어로 + 1~10구 신청 + 호버 툴팁 (천관사)', tags: ['인등', '삼천인등', '히어로', '천관사', 'Supabase'] },
    { code: 'H-13', name: '오백인등형',           desc: '500등 단위 차수 확장 · 사찰명 변수 · 1~6차 삼천인등 완성', tags: ['인등', '오백인등', '차수', '프로그레스', '중소사찰'] },
  ],
  // ── 법회 (전면 재구성 BH-01~09) ─────────────────────────────────────────────
  BH: [
    { code: 'BH-01', name: '부처님오신날 봉축법회', desc: '음력 4월 8일 부처님오신날 봉축 법요식 안내',         tags: ['봉축', '부처님오신날', '연등'] },
    { code: 'BH-02', name: '성도재일법회',          desc: '음력 12월 8일 부처님 성도일 기념 법회',             tags: ['성도재일', '법회', '음력12월'] },
    { code: 'BH-03', name: '출가재일법회',          desc: '음력 2월 8일 부처님 출가일 기념 법회',              tags: ['출가재일', '법회', '음력2월'] },
    { code: 'BH-04', name: '열반재일법회',          desc: '음력 2월 15일 부처님 열반일 기념 법회',             tags: ['열반재일', '법회', '음력2월'] },
    { code: 'BH-05', name: '초하루법회',            desc: '매월 음력 1일 새달 시작 정기 법회',                 tags: ['초하루', '음력', '정기법회'] },
    { code: 'BH-06', name: '보름법회',              desc: '매월 음력 15일 보름 정기 법회',                     tags: ['보름', '음력', '정기법회'] },
    { code: 'BH-07', name: '관음재일법회',          desc: '매월 음력 24일 관세음보살 재일 법회',               tags: ['관음재일', '재일', '법회'] },
    { code: 'BH-08', name: '지장재일법회',          desc: '매월 음력 18일 지장보살 재일 법회',                 tags: ['지장재일', '재일', '법회'] },
    { code: 'BH-09', name: '일요법회',              desc: '매주 일요일 신도 대상 정기 일요 법회',              tags: ['일요법회', '정기', '신도'] },
  ],
  // ── 기도·불공 (전면 재구성 PR-01~12) ────────────────────────────────────────
  PR: [
    { code: 'PR-01', name: '인등기도',            desc: '소원을 담은 연등 봉헌으로 밝히는 기도 불사',          tags: ['인등', '연등', '기도'] },
    { code: 'PR-02', name: '백일기도',            desc: '100일간 매일 정진하는 발원 기도',                    tags: ['백일기도', '정진', '발원'] },
    { code: 'PR-03', name: '1년기도',             desc: '365일 한 해를 발원하는 연간 정진 기도',              tags: ['1년기도', '연간', '발원'] },
    { code: 'PR-04', name: '천일기도',            desc: '1,000일 장기 정진 서원 기도 불사',                   tags: ['천일기도', '장기', '서원'] },
    { code: 'PR-05', name: '수험생정진기도',       desc: '수험생 합격 발원 특별 정진 기도',                    tags: ['수험생', '합격', '기도'] },
    { code: 'PR-06', name: '49재',                desc: '돌아가신 분의 극락왕생을 위한 49일 재',              tags: ['49재', '극락', '천도'] },
    { code: 'PR-07', name: '천도재',              desc: '영가의 극락왕생을 기원하는 천도 의식',               tags: ['천도재', '영가', '극락'] },
    { code: 'PR-08', name: '정초기도',            desc: '새해 첫날 한 해 발원 정초 기도',                    tags: ['정초기도', '새해', '발원'] },
    { code: 'PR-09', name: '산신기도',            desc: '산신께 올리는 전통 산신 기도 의식',                  tags: ['산신기도', '전통', '의식'] },
    { code: 'PR-10', name: '기제사',              desc: '기일에 영가를 추모하는 제사 의식',                   tags: ['기제사', '추모', '영가'] },
    { code: 'PR-11', name: '동지기도',            desc: '동짓날 액막이·발원 동지 팥죽 기도',                  tags: ['동지기도', '팥죽', '액막이'] },
    { code: 'PR-12', name: '백중기도',            desc: '음력 7월 15일 백중 영가 천도 기도',                  tags: ['백중기도', '천도', '음력7월'] },
  ],
  // ── 행사 (전면 재구성 EV-01~03) ─────────────────────────────────────────────
  EV: [
    { code: 'EV-01', name: '산사음악회',          desc: '사찰 경내에서 열리는 자연과 음악의 힐링 콘서트',      tags: ['산사음악회', '콘서트', '힐링'] },
    { code: 'EV-02', name: '방생법회',            desc: '생명 존중 사상을 실천하는 전통 방생 행사',           tags: ['방생', '생명존중', '전통'] },
    { code: 'EV-03', name: '사찰순례',            desc: '성지·명찰을 순례하며 신심을 키우는 순례 행사',       tags: ['순례', '성지', '신심'] },
  ],
  // ── 템플스테이 (신설 TS-01~03) ──────────────────────────────────────────────
  TS: [
    { code: 'TS-01', name: '휴식형',             desc: '일상을 내려놓고 사찰에서 쉬며 충전하는 템플스테이',   tags: ['템플스테이', '휴식', '힐링'] },
    { code: 'TS-02', name: '당일형',             desc: '하루 동안 사찰 문화를 체험하는 단기 템플스테이',      tags: ['템플스테이', '당일', '체험'] },
    { code: 'TS-03', name: '산사체험형',         desc: '전통 사찰 문화·수행을 직접 체험하는 템플스테이',      tags: ['템플스테이', '수행', '전통문화'] },
  ],
  // ── 결제수단 (기존 유지) ─────────────────────────────────────────────────────
  C: [
    { code: 'C-01', name: '가상계좌 발급형',      desc: '실시간 가상계좌 생성',                               tags: ['가상계좌', '결제', '실시간'] },
    { code: 'C-02', name: '카카오페이 모듈',      desc: 'QR+링크 간편결제',                                   tags: ['카카오페이', 'QR', '간편결제'] },
    { code: 'C-03', name: '토스 모듈',            desc: '토스 간편결제 연동',                                 tags: ['토스', '간편결제'] },
    { code: 'C-04', name: '무통장 안내 카드',     desc: '계좌번호+입금자명 안내',                             tags: ['무통장', '계좌'] },
    { code: 'C-05', name: '신용카드 결제',        desc: 'PG사 연동 카드결제',                                 tags: ['신용카드', 'PG', '결제'] },
  ],
  // ── 사찰자료관 (인포그래픽+Q&A 통합 신설 DR-01~09) ──────────────────────────
  L: [
    { code: 'L-01', name: '인등불사 — 1차 1,000등 점화형', desc: '캔버스 인등 격자 + 신청·발원문·진척바 (천관사 1차)', tags: ['인등', '점화', 'Supabase', '천관사'] },
  ],
  DR: [
    { code: 'DR-01', name: 'AI 오디오 오버뷰',   desc: '사찰 정보를 AI가 음성으로 해설하는 오디오 콘텐츠',   tags: ['AI', '오디오', 'NotebookLM'] },
    { code: 'DR-02', name: '슬라이드 자료',       desc: '법회·행사·교육용 프레젠테이션 슬라이드 자료',        tags: ['슬라이드', '프레젠테이션', '교육'] },
    { code: 'DR-03', name: '동영상 개요',         desc: '사찰 소개 및 주요 행사 동영상 요약 콘텐츠',          tags: ['동영상', '소개', '행사'] },
    { code: 'DR-04', name: '마인드맵',            desc: '불교 교리·사찰 역사를 시각적으로 정리한 마인드맵',   tags: ['마인드맵', '교리', '역사'] },
    { code: 'DR-05', name: '보고서',              desc: '사찰 현황·행사·통계를 정리한 공식 보고서 문서',      tags: ['보고서', '통계', '문서'] },
    { code: 'DR-06', name: '플래시카드',          desc: '불교 용어·교리를 카드 형태로 학습하는 자료',         tags: ['플래시카드', '학습', '불교용어'] },
    { code: 'DR-07', name: '퀴즈',                desc: '불교 상식·사찰 역사 OX·선택형 퀴즈 콘텐츠',         tags: ['퀴즈', '불교상식', '학습', '우선개발'] },
    { code: 'DR-08', name: '인포그래픽',          desc: '데이터·정보를 시각화한 인포그래픽 이미지 자료',      tags: ['인포그래픽', '시각화', '데이터', '우선개발'] },
    { code: 'DR-09', name: '데이터 표',           desc: '사찰 관련 통계·현황을 정리한 데이터 표 자료',        tags: ['데이터', '통계', '표'] },
  ],
}

// ── 필수 항목 (항상 포함) ──────────────────────────────────────────────────────
const MANDATORY_ITEMS = [
  'GNB + 햄버거 메뉴 (사찰소개·공지사항·기도법회행사·오시는길)',
  '공지 티커 배너 (I-01 · 국가유산/공지행사 자동전환)',
  '오늘의 짬짜미 부처님말씀 (B-01 · 365일 자동순환)',
  '주지스님 인사말',
  '공지사항 스와이프 (NS-01 · 3개 카드)',
  '우리절 소개',
  '우리절 연혁',
  '우리절 갤러리 (최대 10장)',
  '오시는 길 (네이버지도)',
  '하단 푸터',
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
