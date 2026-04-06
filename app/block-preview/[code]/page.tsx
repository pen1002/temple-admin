// 블록 미리보기 풀스크린 페이지 — 헤더/푸터 없이 블록만 렌더링
// iframe에서 로드: /block-preview/H-01 등
import { notFound } from 'next/navigation'
import TempleH06Hero, { defaultProps as h06DefaultProps } from '@/components/blocks/TempleH06Hero'
import HeroH05Lantern from '@/components/hero/HeroH05Lantern'
// @ts-ignore
import StandardLanternHero from '@/app/[slug]/_blocks/hero/standard/LanternHeroBlock'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore — [slug] 디렉토리명에 대괄호 포함
import HeroBlock, { CombinedHero, LanternHero, ParticleHero, ImageHero } from '@/app/[slug]/_blocks/HeroBlock'
// @ts-ignore
import DharmaBlock  from '@/app/[slug]/_blocks/DharmaBlock'
// @ts-ignore
import NoticeBlock  from '@/app/[slug]/_blocks/NoticeBlock'
// @ts-ignore
import EventBlock   from '@/app/[slug]/_blocks/EventBlock'
// @ts-ignore
import GalleryBlock from '@/app/[slug]/_blocks/GalleryBlock'
import type { TempleData, TemplateContent, DharmaData } from '@/app/[slug]/_blocks/types'

// ── 더미 사찰 데이터 ─────────────────────────────────────────────────────────
const T: TempleData = {
  id: 'preview', code: 'preview',
  name: '미리보기 사찰', nameEn: 'Preview Temple',
  description: '블록 미리보기용 샘플 사찰입니다.',
  address: '서울특별시 종로구 우정국로 59', phone: '02-000-0000',
  email: null, heroImageUrl: null, logoUrl: null,
  primaryColor: '#8B2500', secondaryColor: '#C5A572',
  denomination: '대한불교 조계종', abbotName: '법광 스님',
  foundedYear: 936, tier: 2,
}

// H-05 미리보기: 보림사 실제 데이터
const T_BORIMSA: TempleData = {
  id: 'borimsa', code: 'borimsa',
  name: '보림사', nameEn: 'Borimsa Temple',
  description: '한국 선종의 종가, 동양 3보림의 하나',
  address: '전라남도 장흥군 유치면 봉덕리 45', phone: '061-860-1232',
  email: null, heroImageUrl: null, logoUrl: null,
  primaryColor: '#C9A84C', secondaryColor: '#8B6914',
  denomination: '대한불교 조계종', abbotName: '정응 스님',
  foundedYear: 858, tier: 2,
}

const DHARMA: DharmaData = {
  text: '마음이 청정하면 국토가 청정하고, 마음이 평화로우면 세상이 평화롭습니다. 오늘 하루도 맑은 마음으로 정진하십시오.',
  source: '유마경(維摩經)',
  history: [],
}

const CONTENT: TemplateContent = {
  notices: [
    { id: '1', title: '4월 초파일 법요식 안내', content: '부처님오신날 봉축 법요식이 오전 10시에 봉행됩니다. 신도 여러분의 많은 참여 바랍니다.', createdAt: '2026-04-01T09:00:00Z' },
    { id: '2', title: '주말 참선 수련회 모집', content: '4월 셋째 주 토·일 1박 2일 참선 수련회를 진행합니다. 선착순 30명 모집합니다.', createdAt: '2026-03-28T09:00:00Z' },
    { id: '3', title: '사찰 경내 정화 작업 안내', content: '매주 토요일 오전 9시 경내 청소 및 정화 작업을 진행합니다.', createdAt: '2026-03-20T09:00:00Z' },
  ],
  eventList: [
    { id: '1', name: '부처님오신날 봉축 법요식', date: '2026-05-14', memo: '오전 10시, 대웅전 앞마당' },
    { id: '2', name: '산사음악회', date: '2026-05-22', memo: '오후 7시, 경내 야외무대' },
    { id: '3', name: '여름 템플스테이', date: '2026-07-12', memo: '1박 2일, 선착순 20명' },
  ],
  ritualTimes: [
    { id: '1', name: '새벽 예불', time: '04:30' },
    { id: '2', name: '사시 예불', time: '10:00' },
    { id: '3', name: '저녁 예불', time: '18:30' },
    { id: '4', name: '도량석', time: '04:00' },
  ],
  dharma: DHARMA,
  gallery: [],
}

// ── 카테고리별 플레이스홀더 ──────────────────────────────────────────────────
const CAT_META: Record<string, { icon: string; label: string; color: string; bg: string }> = {
  T: { icon: '🏛️', label: '사찰소개',     color: '#5C3A00', bg: '#FFF8E7' },
  P: { icon: '🙏',  label: '기도·불공',   color: '#8B0000', bg: '#fff5f5' },
  B: { icon: '🪔',  label: '기도불사동참', color: '#B8860B', bg: '#fffbf0' },
  C: { icon: '💳',  label: '결제수단',     color: '#4A4A4A', bg: '#f8f8f8' },
  I: { icon: '📊',  label: '인포그래픽',   color: '#3D5A3E', bg: '#f0f7f0' },
  X: { icon: '📚',  label: 'Q&A·자료관',  color: '#5B2D8E', bg: '#faf5ff' },
}

const BLOCK_INFO: Record<string, { name: string; desc: string }> = {
  'T-01': { name: '전각 배치도형',        desc: '경내 전각 위치 인터랙티브 지도' },
  'T-02': { name: '전각 상세 카드형',     desc: '전각별 사진+설명 카드' },
  'T-03': { name: '문화재 갤러리형',      desc: '국보·보물 이미지 그리드' },
  'T-04': { name: '가로 스크롤 연혁형',   desc: '창건~현재 타임라인' },
  'T-05': { name: '주지스님 인사말형',    desc: '사진+친필메시지 레이아웃' },
  'T-06': { name: '종단 소개 카드형',     desc: '소속 종단·등록번호 표시' },
  'P-01': { name: '백일기도 카드',        desc: '접수·기간·회향일 표시' },
  'P-02': { name: '1년기도 카드',         desc: '연간 기도 접수 모듈' },
  'P-03': { name: '천일기도 카드',        desc: '진행률 바 포함' },
  'P-04': { name: '수험생 합격기도',      desc: '시즌별 강조 배너' },
  'P-05': { name: '사업번창기도',         desc: '접수 폼 포함' },
  'P-06': { name: '49재·천도재',         desc: '일정 및 신청 안내' },
  'P-07': { name: '인등 접수 모듈',       desc: '이름·기간 입력+결제' },
  'P-08': { name: '연등 접수 모듈',       desc: '부처님오신날 연동' },
  'P-09': { name: '초하루 불공',          desc: '음력 1일 자동 강조' },
  'P-10': { name: '보름 불공',            desc: '음력 15일 자동 강조' },
  'B-01': { name: '불사 목표 그래프형',   desc: '목표금액 달성률 바' },
  'B-02': { name: '기와시주 목록형',      desc: '시주자 명단 표시' },
  'B-03': { name: '불사 사진첩형',        desc: '공사 진행 사진 갤러리' },
  'B-04': { name: '동참자 명예전당형',    desc: '기여자 이름 표시' },
  'B-05': { name: '중창불사 카드',        desc: '법당 중창 모금 모듈' },
  'B-06': { name: '불상 조성 카드',       desc: '불상 제작 동참 모듈' },
  'C-01': { name: '가상계좌 발급형',      desc: '실시간 가상계좌 생성' },
  'C-02': { name: '카카오페이 모듈',      desc: 'QR+링크 간편결제' },
  'C-03': { name: '토스 모듈',            desc: '토스 간편결제 연동' },
  'C-04': { name: '무통장 안내 카드',     desc: '계좌번호+입금자명 안내' },
  'C-05': { name: '신용카드 결제',        desc: 'PG사 연동 카드결제' },
  'I-02': { name: '교리 요약 도표',       desc: '불교 기초 인포그래픽' },
  'I-03': { name: '동참자 통계 그래프',   desc: '기도·불사 통계 차트' },
  'I-04': { name: '연간 일정 로드맵',     desc: '1년 행사 타임라인' },
  'I-05': { name: '108사찰 현황 지도',    desc: '전국 지도 핀 표시' },
  'IG-01': { name: '숫자 카운터 인포그래픽', desc: '통계 숫자 카운터 애니메이션' },
  'QA-01': { name: 'Q&A 슬라이드 자료관', desc: 'FAQ·슬라이드·인포그래픽 탭 구성' },
}

function catKey(code: string) {
  const m = code.match(/^([A-Z]+)/)
  if (!m) return null
  const k = m[1]
  if (k === 'IG') return 'I'
  if (k === 'QA') return 'X'
  return k
}

function Placeholder({ code, name: nameProp, desc: descProp, catColor, catBg, catIcon }: {
  code: string; name?: string; desc?: string; catColor?: string; catBg?: string; catIcon?: string
}) {
  const info = BLOCK_INFO[code]
  const key = catKey(code)
  const meta = key ? CAT_META[key] : null
  const color  = catColor   ?? meta?.color  ?? '#888'
  const bg     = catBg      ?? meta?.bg     ?? '#f8f8f8'
  const icon   = catIcon    ?? meta?.icon   ?? '☸'
  const label  = meta?.label ?? '블록'
  const name   = nameProp   ?? info?.name   ?? code
  const desc   = descProp   ?? info?.desc   ?? '블록 미리보기'

  return (
    <div style={{ minHeight: '100vh', background: bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', fontFamily: 'sans-serif' }}>
      {/* 아이콘 */}
      <div style={{ fontSize: '56px', marginBottom: '16px' }}>{icon}</div>

      {/* 카테고리 뱃지 */}
      <div style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.15em', color, background: color + '18', padding: '4px 14px', borderRadius: '99px', marginBottom: '12px' }}>
        {label}
      </div>

      {/* 블록 코드 */}
      <code style={{ fontSize: '13px', fontWeight: 700, color, background: color + '12', padding: '4px 12px', borderRadius: '8px', marginBottom: '12px' }}>
        {code}
      </code>

      {/* 블록명 */}
      <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#1a1a1a', marginBottom: '10px', textAlign: 'center' }}>{name}</h2>

      {/* 설명 */}
      <p style={{ fontSize: '14px', color: '#666', textAlign: 'center', maxWidth: '280px', lineHeight: 1.6, marginBottom: '32px' }}>{desc}</p>

      {/* 준비 중 배지 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: color + '15', border: `1.5px dashed ${color}60`, borderRadius: '12px', padding: '10px 20px' }}>
        <span style={{ fontSize: '16px' }}>🔧</span>
        <span style={{ fontSize: '13px', fontWeight: 600, color }}>미리보기 준비 중</span>
      </div>

      {/* 구분선 + 목업 와이어프레임 */}
      <div style={{ marginTop: '40px', width: '100%', maxWidth: '320px' }}>
        <div style={{ height: '1px', background: color + '20', marginBottom: '20px' }} />
        {/* 와이어프레임 스켈레톤 */}
        {[80, 60, 70, 45].map((w, i) => (
          <div key={i} style={{ height: '12px', background: color + '18', borderRadius: '6px', marginBottom: '10px', width: `${w}%` }} />
        ))}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '16px' }}>
          {[1, 2].map(i => (
            <div key={i} style={{ height: '60px', background: color + '12', borderRadius: '10px', border: `1px solid ${color}20` }} />
          ))}
        </div>
      </div>
    </div>
  )
}

// ── 지원 코드 목록 ───────────────────────────────────────────────────────────
const REAL_BLOCKS: Record<string, boolean> = {
  'H-01':true,'H-02':true,'H-03':true,'H-04':true,'H-05':true,
  'H-06':true,'H-07':true,'H-08':true,'H-09':true,'H-10':true,
  'D-01':true,
  'L-01':true,'L-02':true,'L-03':true,'L-04':true,'L-05':true,'L-06':true,'L-07':true,
  'E-01':true,'E-02':true,'E-03':true,'E-04':true,'E-05':true,'E-06':true,
  'G-01':true,'G-02':true,'G-03':true,'G-04':true,
  'I-01':true,
}
const PLACEHOLDER_CODES = Object.keys(BLOCK_INFO)
const ALL_CODES = [...Object.keys(REAL_BLOCKS), ...PLACEHOLDER_CODES]

export function generateStaticParams() {
  return ALL_CODES.map(code => ({ code }))
}

export default async function BlockPreviewPage(
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params

  // ── H-* 히어로 — 코드별 정확 분기 ──────────────────────────────────────────
  if (code === 'H-01') return <div style={{ margin:0, padding:0, overflow:'hidden' }}><CombinedHero temple={T} /></div>
  if (code === 'H-02') return <div style={{ margin:0, padding:0, overflow:'hidden' }}><ImageHero temple={T} /></div>
  if (code === 'H-03') return <Placeholder code={code} name="슬라이드형" desc="3~5장 자동전환·터치스와이프" catColor="#1B3A6B" catBg="#f0f4ff" catIcon="🏯" />
  if (code === 'H-04') return <div style={{ margin:0, padding:0, overflow:'hidden' }}><ParticleHero temple={T} /></div>
  if (code === 'H-05') return <div style={{ margin:0, padding:0, overflow:'hidden' }}><StandardLanternHero
    templeName="보림사"
    templeNameHanja="寶 林 寺"
    badge="● 한국 선종의 종가(宗家) · 천년 가지산문"
    taglines={['천년의 깨달음에서 현대의 치유로','한국 조계종의 모태, 동양 3보림의 하나','가지산 깊은 숲에서 선(禪)의 향기를 만나다']}
    ctaPrimary={{ text: '국보·보물 보기', href: '#heritage' }}
    ctaSecondary={{ text: '템플스테이 안내', href: '#templestay' }}
    lanternCount={12}
  /></div>
  if (code === 'H-06') return <div style={{ margin:0, padding:0, overflow:'hidden' }}><TempleH06Hero {...h06DefaultProps} blockId="h06-preview-chunguansa" denomination="대한불교조계종" templeName="천 관 사" subtitle="천년의 빛이 머무는 곳" description={"마음의 등불을 밝혀\n진리의 길을 걷습니다"} ctaLabel="홈페이지 바로가기" ctaHref="/about" theme="gold" mobileLanternScale={0.8} /></div>
  if (code === 'H-07') return <Placeholder code={code} name="원형→그리드 변환형" desc="원이 스크롤 시 4×4 메뉴로 전환" catColor="#1B3A6B" catBg="#f0f4ff" catIcon="🏯" />
  if (code === 'H-08') return <Placeholder code={code} name="행사 전면 배치형" desc="D-30 이내 행사 금색 강조" catColor="#1B3A6B" catBg="#f0f4ff" catIcon="🏯" />
  if (code === 'H-09') return <Placeholder code={code} name="계절 테마형" desc="봄·여름·가을·겨울 자동 전환" catColor="#1B3A6B" catBg="#f0f4ff" catIcon="🏯" />
  if (code === 'H-10') return <Placeholder code={code} name="3D 모델형" desc="Sketchfab 불상 3D 인터랙션" catColor="#1B3A6B" catBg="#f0f4ff" catIcon="🏯" />

  // ── D-01 법문 ─────────────────────────────────────────────────────────────
  if (code === 'D-01') {
    return (
      <div style={{ minHeight: '100vh', background: '#FFF8E7' }}>
        <DharmaBlock dharma={DHARMA} temple={T} />
      </div>
    )
  }

  // ── L-* 법회 / E-* 행사 → EventBlock ────────────────────────────────────
  if ((code.startsWith('L-') || code.startsWith('E-')) && REAL_BLOCKS[code]) {
    return (
      <div style={{ minHeight: '100vh', background: '#FFF8E7' }}>
        <EventBlock content={CONTENT} temple={T} />
      </div>
    )
  }

  // ── G-* 갤러리 → 이미지 없으므로 플레이스홀더로 대체 ──────────────────────
  if (code.startsWith('G-') && REAL_BLOCKS[code]) {
    return <Placeholder code={code} />
  }

  // ── I-01 공지사항 ─────────────────────────────────────────────────────────
  if (code === 'I-01') {
    return (
      <div style={{ minHeight: '100vh', background: '#1a1008' }}>
        <NoticeBlock content={CONTENT} temple={T} />
      </div>
    )
  }

  // ── 플레이스홀더 블록 ─────────────────────────────────────────────────────
  if (PLACEHOLDER_CODES.includes(code)) {
    return <Placeholder code={code} />
  }

  // ── 알 수 없는 코드 ───────────────────────────────────────────────────────
  if (!code.match(/^[A-Z]+-\d+$/) && code !== 'IG-01' && code !== 'QA-01') {
    notFound()
  }

  return <Placeholder code={code} />
}
