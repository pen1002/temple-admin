/**
 * 사찰 갤러리 임시 이미지 삽입 스크립트
 * Usage: npx tsx scripts/seed-gallery.ts tongdosa
 */
import Redis from 'ioredis'
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const GALLERY_PRESETS: Record<string, Array<{ url: string; caption: string; location: string }>> = {
  tongdosa: [
    {
      url: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800',
      caption: '통도사 대웅전',
      location: '상로전',
    },
    {
      url: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800',
      caption: '금강계단',
      location: '상로전',
    },
    {
      url: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800',
      caption: '영축산 통도사',
      location: '경내',
    },
  ],
}

async function main() {
  const slug = process.argv[2]
  if (!slug) { console.error('Usage: npx tsx scripts/seed-gallery.ts <slug>'); process.exit(1) }

  const preset = GALLERY_PRESETS[slug]
  if (!preset) { console.error(`No gallery preset for '${slug}'`); process.exit(1) }

  const redis = new Redis(process.env.REDIS_URL!, {
    maxRetriesPerRequest: 3,
    tls: process.env.REDIS_URL?.includes('rediss://') ? {} : undefined,
  })

  const items = preset.map(item => ({ ...item, uploadedAt: new Date().toISOString() }))
  await redis.set(`${slug}:gallery_recent`, JSON.stringify(items))
  console.log(`✅ ${slug} 갤러리 ${items.length}개 삽입 완료`)
  console.log(items.map(i => `  - ${i.caption} (${i.location})`).join('\n'))

  await redis.quit()
}

main().catch(e => { console.error(e); process.exit(1) })
