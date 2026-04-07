import type { TempleData, TemplateContent } from './types'
import type { DailyWisdomData } from '@/lib/getDailyWisdom'
import DailyWisdomBlock from './wisdom/DailyWisdomBlock'
import NavBlock      from './nav/standard/NavBlock'
import HeroBlock    from './HeroBlock'
import LanternHeroBlock from './hero/borimsa/LanternHeroBlock'
import StandardLanternHero from './hero/standard/LanternHeroBlock'
import BorimsaCandleHero from './hero/borimsa/CandleHeroBlock'
import StandardCandleHero from './hero/standard/CandleHeroBlock'
import BorimsaParadeHero from './hero/borimsa/LanternParadeHeroBlock'
import StandardParadeHero from './hero/standard/LanternParadeHeroBlock'
import H11BonchukHaroo from './hero/standard/H11BonchukHarooBlock'
import DharmaBlock  from './DharmaBlock'
import NoticeBlock  from './NoticeBlock'
import EventBlock   from './EventBlock'
import GalleryBlock from './GalleryBlock'
import LocationBlock from './LocationBlock'
import TickerBlock       from './TickerBlock'
import AbbotGreetingBlock from './AbbotGreetingBlock'
import HeritageBlock      from './HeritageBlock'
import StatsBlock            from './StatsBlock'
import HistoryTimelineBlock  from './HistoryTimelineBlock'
import QABlock               from './QABlock'
import TemplestayBlock       from './TemplestayBlock'
import BorimsaTemplestayBlock   from './templestay/borimsa/TemplestayBlock'
import ChunkwansaTemplestayBlock from './templestay/chunkwansa/TemplestayBlock'
import OfferingBlock             from './OfferingBlock'
import BorimsaOfferingBlock      from './offering/borimsa/OfferingBlock'
import ChunkwansaOfferingBlock   from './offering/chunkwansa/OfferingBlock'
import ChunkwansaNatureCards     from './nature/chunkwansa/NatureCardsBlock'
import ChunkwansaHeritageBlock   from './heritage/chunkwansa/HeritageBlock'
import QuoteBannerBlock          from './QuoteBannerBlock'

interface Props {
  blockType:    string
  config:       Record<string, unknown>
  temple:       TempleData
  content:      TemplateContent
  dailyWisdom?: DailyWisdomData | null
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
export default function BlockRenderer({ blockType, config, temple, content, dailyWisdom }: Props) {
  // WISDOM-01: 오늘의 부처님말씀
  if (blockType === 'WISDOM-01') {
    return <DailyWisdomBlock wisdom={dailyWisdom ?? null} temple={temple} />
  }

  // N-01: GNB 네비게이션
  if (blockType === 'N-01') {
    return (
      <NavBlock
        temple={{
          name:         temple.name,
          primaryColor: temple.primaryColor,
          kakao:        (config.kakao   as string | undefined),
          blog:         (config.blog    as string | undefined),
          youtube:      (config.youtube as string | undefined),
        }}
      />
    )
  }

  if (blockType === 'H-05' && temple.code === 'borimsa') {
    return <LanternHeroBlock temple={temple} />
  }

  // H-05 표준: config에서 props 주입, 없으면 temple 기본값으로 fallback
  if (blockType === 'H-05') {
    const cfg = config as Record<string, unknown>
    return (
      <StandardLanternHero
        templeName={        (cfg.templeName        as string) ?? temple.name}
        templeNameHanja={   (cfg.templeNameHanja   as string) ?? ''}
        badge={             (cfg.badge             as string) ?? `● ${temple.denomination ?? '대한불교조계종'}`}
        taglines={          (cfg.taglines          as string[]) ?? ['함께하는 불심', '천년의 도량', '마음의 안식처']}
        ctaPrimary={        (cfg.ctaPrimary        as { text: string; href: string }) ?? { text: '사찰 소개', href: '#about' }}
        ctaSecondary={      (cfg.ctaSecondary      as { text: string; href: string }) ?? { text: '오시는 길', href: '#location' }}
        lanternCount={      (cfg.lanternCount      as number) ?? 12}
        bgColor={           (cfg.bgColor           as string) ?? '#0a1020'}
      />
    )
  }

  // H-08: 보림사 전용 촛불법당형 히어로
  if (blockType === 'H-08' && temple.code === 'borimsa') {
    return <BorimsaCandleHero temple={temple} />
  }

  // H-08 표준: config props 주입 → temple 기본값 fallback
  if (blockType === 'H-08') {
    const cfg = config as Record<string, unknown>
    return (
      <StandardCandleHero
        templeName={       (cfg.templeName       as string) ?? temple.name}
        templeNameHanja={  (cfg.templeNameHanja  as string) ?? ''}
        badge={            (cfg.badge            as string) ?? `● ${temple.denomination ?? '대한불교조계종'}`}
        taglines={         (cfg.taglines         as string[]) ?? ['천년의 고요한 도량', '마음을 내려놓는 공간', '부처님의 자비가 함께합니다']}
        ctaPrimary={       (cfg.ctaPrimary       as { text: string; href: string }) ?? { text: '기도 동참하기', href: '#offering' }}
        ctaSecondary={     (cfg.ctaSecondary     as { text: string; href: string }) ?? { text: '오시는 길',   href: '#location' }}
        candleCount={      (cfg.candleCount      as number) ?? 7}
        bgColor={          (cfg.bgColor          as string) ?? '#070201'}
        buddhaType={       (cfg.buddhaType       as string) ?? 'vairocana'}
      />
    )
  }

  // H-10: 보림사 전용 연등행렬형
  if (blockType === 'H-10' && temple.code === 'borimsa') {
    return <BorimsaParadeHero temple={temple} />
  }

  // H-10 표준: config props 주입 → temple 기본값 fallback
  if (blockType === 'H-10') {
    const cfg = config as Record<string, unknown>
    return (
      <StandardParadeHero
        mainTitle={      (cfg.mainTitle      as string) ?? '부처님 오신 날'}
        subtitle={       (cfg.subtitle       as string) ?? `${temple.name} 연등행렬 · 불기 2570년`}
        lanternCount={   (cfg.lanternCount   as number) ?? 35}
        glowIntensity={  (cfg.glowIntensity  as number) ?? 3}
        templeName={     (cfg.templeName     as string | undefined)}
        templeNameHanja={(cfg.templeNameHanja as string | undefined)}
        badge={          (cfg.badge          as string | undefined)}
        taglines={       (cfg.taglines       as string[] | undefined)}
        ctaPrimary={     (cfg.ctaPrimary     as { text: string; href: string } | undefined)}
        ctaSecondary={   (cfg.ctaSecondary   as { text: string; href: string } | undefined)}
      />
    )
  }

  // H-11: 봉축의 하루 — 6장면 그리드 히어로
  if (blockType === 'H-11') {
    const cfg = config as Record<string, unknown>
    return (
      <H11BonchukHaroo
        templeName={     (cfg.templeName      as string | undefined)}
        templeSubtitle={ (cfg.templeSubtitle  as string | undefined)}
        badgeText={      (cfg.badgeText       as string | undefined)}
        ctaText={        (cfg.ctaText         as string | undefined)}
        ctaHref={        (cfg.ctaHref         as string | undefined)}
      />
    )
  }

  if (blockType.startsWith('H-')) {
    return <HeroBlock blockType={blockType} temple={temple} config={config} content={content} />
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

  // SEC06-* 주지스님 인사말
  if (blockType.startsWith('SEC06-')) {
    return <AbbotGreetingBlock temple={temple} config={config} />
  }

  // SEC05-04 국보·보물 Heritage
  if (blockType === 'SEC05-04' && temple.code === 'chunkwansa') {
    return <ChunkwansaHeritageBlock temple={temple} config={config} />
  }
  if (blockType === 'SEC05-04') {
    return <HeritageBlock temple={temple} config={config} />
  }

  // SEC11-* Stats Bar
  if (blockType.startsWith('SEC11-')) {
    return <StatsBlock temple={temple} config={config} />
  }

  // SEC05-01 역사 타임라인
  if (blockType === 'SEC05-01') {
    return <HistoryTimelineBlock temple={temple} config={config} />
  }

  // QA-01 FAQ·퀴즈 학습관
  if (blockType === 'QA-01') {
    return <QABlock temple={temple} config={config} />
  }

  // SEC13-* 템플스테이
  if (blockType.startsWith('SEC13-') && temple.code === 'borimsa') {
    return <BorimsaTemplestayBlock temple={temple} config={config} />
  }
  if (blockType.startsWith('SEC13-') && temple.code === 'chunkwansa') {
    return <ChunkwansaTemplestayBlock temple={temple} config={config} />
  }
  if (blockType.startsWith('SEC13-')) {
    return <TemplestayBlock temple={temple} config={config} />
  }

  // SEC08-* 인등불사·기도 동참
  if (blockType.startsWith('SEC08-') && temple.code === 'borimsa') {
    return <BorimsaOfferingBlock temple={temple} config={config} />
  }
  if (blockType.startsWith('SEC08-') && temple.code === 'chunkwansa') {
    return <ChunkwansaOfferingBlock temple={temple} config={config} />
  }
  if (blockType.startsWith('SEC08-')) {
    return <OfferingBlock temple={temple} config={config} />
  }

  // NATURE-01: 천관사 자연3종카드
  if (blockType === 'NATURE-01' && temple.code === 'chunkwansa') {
    return <ChunkwansaNatureCards temple={temple} config={config} />
  }

  // QB-01 인용구 배너
  if (blockType === 'QB-01') {
    return <QuoteBannerBlock temple={temple} config={config} />
  }

  // 미구현 블록 타입 — 조용히 스킵
  return null
}
