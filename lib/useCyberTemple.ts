'use client'
import { useState, useEffect } from 'react'

export interface CyberTempleInfo {
  name: string
  nameEn: string | null
  denomination: string | null
  abbotName: string | null
  phone: string | null
  address: string | null
  bank_name: string | null
  bank_account: string | null
  bank_holder: string | null
  kakao_notify_tel: string | null
  pin: string | null
  temple_rank: string | null
}

const cache: Record<string, CyberTempleInfo> = {}

export function useCyberTemple(slug: string) {
  const [info, setInfo] = useState<CyberTempleInfo | null>(cache[slug] || null)

  useEffect(() => {
    if (!slug) return
    if (cache[slug]) { setInfo(cache[slug]); return }
    fetch(`/api/cyber/temple-info?slug=${slug}`)
      .then(r => r.json())
      .then(d => { if (d.name) { cache[slug] = d; setInfo(d) } })
      .catch(() => {})
  }, [slug])

  return info
}
