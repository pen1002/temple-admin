import { kv } from '@vercel/kv'

export interface Notice {
  id: string
  title: string
  content: string
  createdAt: string
}

export interface EventItem {
  id: string
  name: string
  date: string
  memo?: string
}

export interface RitualTime {
  id: string
  name: string
  time: string
}

export interface GalleryItem {
  url: string
  caption?: string
  location: string
  uploadedAt: string
}

export async function getAdminPhones(slug: string): Promise<string[]> {
  const phones = await kv.get<string[]>(`${slug}:admin_phones`)
  return phones || []
}

export async function getTempleName(slug: string): Promise<string> {
  const name = await kv.get<string>(`${slug}:temple_name`)
  return name || slug
}

export async function getNotices(slug: string): Promise<Notice[]> {
  const notices = await Promise.all([
    kv.get<Notice>(`${slug}:notice_1`),
    kv.get<Notice>(`${slug}:notice_2`),
    kv.get<Notice>(`${slug}:notice_3`),
  ])
  return notices.filter((n): n is Notice => n !== null)
}

export async function saveNotice(slug: string, notice: Notice): Promise<void> {
  const n2 = await kv.get<Notice>(`${slug}:notice_1`)
  const n3 = await kv.get<Notice>(`${slug}:notice_2`)
  await kv.set(`${slug}:notice_1`, notice)
  if (n2) await kv.set(`${slug}:notice_2`, n2)
  if (n3) await kv.set(`${slug}:notice_3`, n3)
}

export async function getEventList(slug: string): Promise<EventItem[]> {
  const list = await kv.get<EventItem[]>(`${slug}:event_list`)
  return list || []
}

export async function saveEventList(slug: string, list: EventItem[]): Promise<void> {
  await kv.set(`${slug}:event_list`, list)
}

export async function getRitualTimes(slug: string): Promise<RitualTime[]> {
  const times = await kv.get<RitualTime[]>(`${slug}:ritual_times`)
  return times || []
}

export async function saveRitualTimes(slug: string, times: RitualTime[]): Promise<void> {
  await kv.set(`${slug}:ritual_times`, times)
}

export async function getDharma(slug: string) {
  const [text, source, history] = await Promise.all([
    kv.get<string>(`${slug}:dharma_text`),
    kv.get<string>(`${slug}:dharma_source`),
    kv.get<Array<{ text: string; source: string; savedAt: string }>>(`${slug}:dharma_history`),
  ])
  return { text: text || '', source: source || '', history: history || [] }
}

export async function saveDharma(slug: string, text: string, source: string): Promise<void> {
  const history = await kv.get<Array<{ text: string; source: string; savedAt: string }>>(`${slug}:dharma_history`) || []
  const newEntry = { text, source, savedAt: new Date().toISOString() }
  const updatedHistory = [newEntry, ...history].slice(0, 3)
  await Promise.all([
    kv.set(`${slug}:dharma_text`, text),
    kv.set(`${slug}:dharma_source`, source),
    kv.set(`${slug}:dharma_history`, updatedHistory),
  ])
}

export async function getGallery(slug: string): Promise<GalleryItem[]> {
  const gallery = await kv.get<GalleryItem[]>(`${slug}:gallery_recent`)
  return gallery || []
}

export async function addGalleryItem(slug: string, item: GalleryItem): Promise<void> {
  const gallery = await getGallery(slug)
  const updated = [item, ...gallery].slice(0, 10)
  await kv.set(`${slug}:gallery_recent`, updated)
}

export async function saveUndo(slug: string, action: object): Promise<void> {
  await kv.set(`${slug}:undo_last`, action, { ex: 30 })
}

export async function getUndo(slug: string): Promise<object | null> {
  return await kv.get(`${slug}:undo_last`)
}

export async function clearUndo(slug: string): Promise<void> {
  await kv.del(`${slug}:undo_last`)
}
