import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
import { setRaw, getGallery } from './lib/kv'

async function main() {
  const now = new Date().toISOString()
  const items = [
    { url: 'https://res.cloudinary.com/db3izttcy/image/upload/brs-nt44_vmceyo',           caption: '보림사 전경',                       location: 'borimsa', uploadedAt: now },
    { url: 'https://res.cloudinary.com/db3izttcy/image/upload/Borimsa_Iron_buddha_xf1xdm',caption: '국보 제44호 철조비로자나불좌상',     location: 'borimsa', uploadedAt: now },
    { url: 'https://res.cloudinary.com/db3izttcy/image/upload/brs-nt44_vmceyo',           caption: '국보 제117호 남·북 삼층석탑과 석등', location: 'borimsa', uploadedAt: now },
    { url: 'https://res.cloudinary.com/db3izttcy/image/upload/brs-t1254_xwgej6',          caption: '보물 제1254호 목조사천왕상',           location: 'borimsa', uploadedAt: now },
  ]
  await setRaw('borimsa:gallery_recent', items)
  const gallery = await getGallery('borimsa')
  console.log(`갤러리 ${gallery.length}장:`)
  gallery.forEach((g, i) => console.log(`  ${i+1}. ${g.caption} — ${g.url.slice(0,50)}`))
}
main().catch(console.error)
