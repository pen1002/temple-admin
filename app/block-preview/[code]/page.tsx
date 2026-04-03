// 블록 미리보기 풀스크린 페이지 — 헤더/푸터 없이 블록만 렌더링
// iframe에서 로드: /block-preview/H-01 등
import { notFound } from 'next/navigation'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore — [slug] 디렉토리명에 대괄호 포함, alias 경로 정상 동작
import HeroBlock from '@/app/[slug]/_blocks/HeroBlock'
import type { TempleData } from '@/app/[slug]/_blocks/types'

// 미리보기용 더미 사찰 데이터
const PREVIEW_TEMPLE: TempleData = {
  id: 'preview',
  code: 'preview',
  name: '미리보기 사찰',
  nameEn: 'Preview Temple',
  description: '블록 미리보기용 샘플 사찰입니다.',
  address: '서울특별시 종로구 우정국로',
  phone: '02-000-0000',
  email: null,
  heroImageUrl: null,
  logoUrl: null,
  primaryColor: '#8B2500',
  secondaryColor: '#C5A572',
  denomination: '대한불교 조계종',
  abbotName: '법광 스님',
  foundedYear: 936,
  tier: 2,
}

const HERO_CODES = ['H-01','H-02','H-03','H-04','H-05','H-06','H-07','H-08','H-09','H-10']

export function generateStaticParams() {
  return HERO_CODES.map(code => ({ code }))
}

export default async function BlockPreviewPage(
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params

  if (HERO_CODES.includes(code)) {
    return (
      <div style={{ margin: 0, padding: 0, overflow: 'hidden' }}>
        <HeroBlock blockType={code} temple={PREVIEW_TEMPLE} />
      </div>
    )
  }

  // H-* 외 블록은 준비 중 플레이스홀더
  if (code.match(/^[A-Z]+-\d+$/)) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#1a1a2e',
          color: '#C5A572',
          fontFamily: 'sans-serif',
          gap: '16px',
        }}
      >
        <div style={{ fontSize: '48px' }}>☸</div>
        <code style={{ fontSize: '20px', fontWeight: 'bold', background: 'rgba(197,165,114,0.15)', padding: '6px 16px', borderRadius: '8px' }}>
          {code}
        </code>
        <p style={{ fontSize: '14px', opacity: 0.6 }}>미리보기 준비 중</p>
      </div>
    )
  }

  notFound()
}
