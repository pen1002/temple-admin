import type { TempleData, TemplateContent } from './types'
import HeroBlock    from './HeroBlock'
import DharmaBlock  from './DharmaBlock'
import NoticeBlock  from './NoticeBlock'
import EventBlock   from './EventBlock'
import GalleryBlock from './GalleryBlock'
import LocationBlock from './LocationBlock'

interface Props {
  blockType: string
  config:    Record<string, unknown>
  temple:    TempleData
  content:   TemplateContent
}

/**
 * blockType → 컴포넌트 매핑
 *
 * 지원 블록:
 *   H-*   → HeroBlock     (히어로 섹션)
 *   D-01  → DharmaBlock   (오늘의 법문)
 *   I-01  → NoticeBlock   (공지사항)
 *   E-* / L-* → EventBlock  (행사·법회)
 *   G-01  → GalleryBlock  (갤러리)
 *   V-01  → LocationBlock (오시는 길)
 *
 * 미구현 블록 타입은 null 반환 (렌더링 스킵)
 */
export default function BlockRenderer({ blockType, config, temple, content }: Props) {
  if (blockType.startsWith('H-')) {
    return <HeroBlock blockType={blockType} temple={temple} />
  }

  if (blockType === 'D-01') {
    return <DharmaBlock dharma={content.dharma} temple={temple} />
  }

  if (blockType === 'I-01') {
    return <NoticeBlock content={content} temple={temple} />
  }

  if (blockType.startsWith('E-') || blockType.startsWith('L-')) {
    return <EventBlock content={content} temple={temple} />
  }

  if (blockType.startsWith('G-')) {
    return <GalleryBlock content={content} temple={temple} />
  }

  if (blockType === 'V-01') {
    return <LocationBlock temple={temple} config={config} />
  }

  // 미구현 블록 타입 — 조용히 스킵
  return null
}
