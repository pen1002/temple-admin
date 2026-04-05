import type { TempleData, TemplateContent } from './types'
import HeroBlock    from './HeroBlock'
import DharmaBlock  from './DharmaBlock'
import NoticeBlock  from './NoticeBlock'
import EventBlock   from './EventBlock'
import GalleryBlock from './GalleryBlock'
import LocationBlock from './LocationBlock'
import TickerBlock  from './TickerBlock'

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
    return <HeroBlock blockType={blockType} temple={temple} config={config} />
  }

  if (blockType === 'T-01') {
    return <TickerBlock content={content} temple={temple} config={config} />
  }

  if (blockType === 'D-01') {
    return <DharmaBlock dharma={content.dharma} temple={temple} />
  }

  if (blockType === 'I-01') {
    return <NoticeBlock content={content} temple={temple} />
  }

  // SEC03-* 법회·행사 → EventBlock으로 렌더링
  if (blockType.startsWith('E-') || blockType.startsWith('L-') || blockType.startsWith('SEC03-')) {
    return <EventBlock content={content} temple={temple} />
  }

  // SEC07-* 갤러리 → GalleryBlock으로 렌더링
  if (blockType.startsWith('G-') || blockType.startsWith('SEC07-')) {
    return <GalleryBlock content={content} temple={temple} />
  }

  if (blockType === 'V-01') {
    return <LocationBlock temple={temple} config={config} />
  }

  // 미구현 블록 타입 (SEC05-*, SEC06-*, SEC08-*, SEC11-*, SEC13-*, QA-01 등) — 조용히 스킵
  return null
}
