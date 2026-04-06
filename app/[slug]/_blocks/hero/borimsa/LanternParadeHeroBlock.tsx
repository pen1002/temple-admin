'use client'
import StandardLanternParade from '../standard/LanternParadeHeroBlock'
import type { TempleData } from '../../types'

export default function LanternParadeHeroBlock({ temple }: { temple: TempleData }) {
  return (
    <StandardLanternParade
      mainTitle="부처님 오신 날"
      subtitle={`${temple.name} 연등행렬 · 불기 2570년`}
      lanternCount={35}
      glowIntensity={3}
    />
  )
}
