import type { Notice, EventItem, RitualTime, GalleryItem } from '@/lib/kv'

export interface TempleData {
  id: string
  code: string
  name: string
  nameEn: string | null
  description: string | null
  address: string | null
  phone: string | null
  email: string | null
  heroImageUrl: string | null
  logoUrl: string | null
  primaryColor: string
  secondaryColor: string
  denomination: string | null
  abbotName: string | null
  foundedYear: number | null
  tier: number
}

export interface DharmaData {
  text: string
  source: string
  history: { text: string; source: string; savedAt: string }[]
}

export interface TemplateContent {
  notices: Notice[]
  eventList: EventItem[]
  ritualTimes: RitualTime[]
  dharma: DharmaData
  gallery: GalleryItem[]
}
