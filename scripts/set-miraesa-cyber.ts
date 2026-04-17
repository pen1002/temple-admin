/**
 * 미래사 temple_type을 'cyber'로 변경하는 1회성 스크립트
 * 실행: npx tsx scripts/set-miraesa-cyber.ts
 */
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const result = await prisma.temple.update({
    where: { code: process.env.CYBER_DEFAULT_SLUG || '' },
    data: { temple_type: 'cyber' },
    select: { code: true, name: true, temple_type: true },
  })
  console.log('✅ 업데이트 완료:', result)
}

main()
  .catch(e => { console.error('❌ 오류:', e); process.exit(1) })
  .finally(() => prisma.$disconnect())
