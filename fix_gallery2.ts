import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
import { setRaw, getGallery } from './lib/kv'
async function main() {
  const now = new Date().toISOString()
  await setRaw('borimsa:gallery_recent', [
    { url: 'https://res.cloudinary.com/db3izttcy/image/upload/brs-dharmahall_jggvn9',     caption: '보림사 전경',           location: 'borimsa', uploadedAt: now },
    { url: 'https://res.cloudinary.com/db3izttcy/image/upload/Borimsa_Iron_buddha_xf1xdm',caption: '철조비로자나불좌상',     location: 'borimsa', uploadedAt: now },
    { url: 'https://res.cloudinary.com/db3izttcy/image/upload/eastwest3rdtower_bnwfor',   caption: '남북 삼층석탑과 석등',   location: 'borimsa', uploadedAt: now },
    { url: 'https://res.cloudinary.com/db3izttcy/image/upload/brs-t1254_xwgej6',          caption: '목조사천왕상',           location: 'borimsa', uploadedAt: now },
  ])
  const g = await getGallery('borimsa')
  console.log(`갤러리 ${g.length}장:`)
  g.forEach((i, n) => console.log(`  ${n+1}. ${i.caption} — ${i.url.split('/').pop()}`))
}
main().catch(console.error)
