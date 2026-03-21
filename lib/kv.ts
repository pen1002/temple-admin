import Redis from 'ioredis'

// 싱글톤 Redis 클라이언트 (서버리스 환경에서 재사용)
const getRedis = (() => {
  let client: Redis | null = null
  return () => {
    if (!client) {
      client = new Redis(process.env.REDIS_URL!, {
        maxRetriesPerRequest: 3,
        lazyConnect: false,
        tls: process.env.REDIS_URL?.includes('rediss://') ? {} : undefined,
      })
      client.on('error', (err) => console.error('Redis error:', err))
    }
    return client
  }
})()

// 헬퍼: JSON 직렬화/역직렬화
async function get<T>(key: string): Promise<T | null> {
  const val = await getRedis().get(key)
  if (val === null) return null
  try { return JSON.parse(val) as T } catch { return val as unknown as T }
}

async function set(key: string, value: unknown, exSeconds?: number): Promise<void> {
  const serialized = typeof value === 'string' ? value : JSON.stringify(value)
  if (exSeconds) {
    await getRedis().set(key, serialized, 'EX', exSeconds)
  } else {
    await getRedis().set(key, serialized)
  }
}

async function del(key: string): Promise<void> {
  await getRedis().del(key)
}

// ─────────────────────────────────────────
// 인터페이스 정의
// ─────────────────────────────────────────

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

// ─────────────────────────────────────────
// 관리자 / 사찰 기본 정보
// ─────────────────────────────────────────

export async function getAdminPhones(slug: string): Promise<string[]> {
  const phones = await get<string[]>(`${slug}:admin_phones`)
  return phones || []
}

export async function getTempleName(slug: string): Promise<string> {
  const name = await get<string>(`${slug}:temple_name`)
  return name || slug
}

// ─────────────────────────────────────────
// 공지사항
// ─────────────────────────────────────────

export async function getNotices(slug: string): Promise<Notice[]> {
  const notices = await Promise.all([
    get<Notice>(`${slug}:notice_1`),
    get<Notice>(`${slug}:notice_2`),
    get<Notice>(`${slug}:notice_3`),
  ])
  return notices.filter((n): n is Notice => n !== null)
}

export async function saveNotice(slug: string, notice: Notice): Promise<void> {
  const n2 = await get<Notice>(`${slug}:notice_1`)
  const n3 = await get<Notice>(`${slug}:notice_2`)
  await set(`${slug}:notice_1`, notice)
  if (n2) await set(`${slug}:notice_2`, n2)
  if (n3) await set(`${slug}:notice_3`, n3)
}

// ─────────────────────────────────────────
// 행사 날짜
// ─────────────────────────────────────────

export async function getEventList(slug: string): Promise<EventItem[]> {
  const list = await get<EventItem[]>(`${slug}:event_list`)
  return list || []
}

export async function saveEventList(slug: string, list: EventItem[]): Promise<void> {
  await set(`${slug}:event_list`, list)
}

// ─────────────────────────────────────────
// 법회 시간
// ─────────────────────────────────────────

export async function getRitualTimes(slug: string): Promise<RitualTime[]> {
  const times = await get<RitualTime[]>(`${slug}:ritual_times`)
  return times || []
}

export async function saveRitualTimes(slug: string, times: RitualTime[]): Promise<void> {
  await set(`${slug}:ritual_times`, times)
}

// ─────────────────────────────────────────
// 법문
// ─────────────────────────────────────────

export async function getDharma(slug: string) {
  const [text, source, history] = await Promise.all([
    get<string>(`${slug}:dharma_text`),
    get<string>(`${slug}:dharma_source`),
    get<Array<{ text: string; source: string; savedAt: string }>>(`${slug}:dharma_history`),
  ])
  return { text: text || '', source: source || '', history: history || [] }
}

export async function saveDharma(slug: string, text: string, source: string): Promise<void> {
  const history = await get<Array<{ text: string; source: string; savedAt: string }>>(
    `${slug}:dharma_history`
  ) || []
  const newEntry = { text, source, savedAt: new Date().toISOString() }
  const updatedHistory = [newEntry, ...history].slice(0, 3)
  await Promise.all([
    set(`${slug}:dharma_text`, text),
    set(`${slug}:dharma_source`, source),
    set(`${slug}:dharma_history`, updatedHistory),
  ])
}

// ─────────────────────────────────────────
// 갤러리
// ─────────────────────────────────────────

export async function getGallery(slug: string): Promise<GalleryItem[]> {
  const gallery = await get<GalleryItem[]>(`${slug}:gallery_recent`)
  return gallery || []
}

export async function addGalleryItem(slug: string, item: GalleryItem): Promise<void> {
  const gallery = await getGallery(slug)
  const updated = [item, ...gallery].slice(0, 10)
  await set(`${slug}:gallery_recent`, updated)
}

// ─────────────────────────────────────────
// 실행 취소 (30초 TTL)
// ─────────────────────────────────────────

export async function saveUndo(slug: string, action: object): Promise<void> {
  await set(`${slug}:undo_last`, action, 30)
}

export async function getUndo(slug: string): Promise<object | null> {
  return await get(`${slug}:undo_last`)
}

export async function clearUndo(slug: string): Promise<void> {
  await del(`${slug}:undo_last`)
}

// ─────────────────────────────────────────
// undo route에서 직접 key 접근용
// ─────────────────────────────────────────

export async function setRaw(key: string, value: unknown): Promise<void> {
  await set(key, value)
}

export async function delRaw(key: string): Promise<void> {
  await del(key)
}
