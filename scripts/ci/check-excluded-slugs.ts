import { EXCLUDED_SLUGS } from '../../lib/constants/excluded-slugs'

const REQUIRED: readonly string[] = ['munsusa', 'borimsa']
const slugs: readonly string[] = EXCLUDED_SLUGS
const missing = REQUIRED.filter(s => !slugs.includes(s))

if (missing.length > 0) {
  console.error('❌ EXCLUDED_SLUGS에서 누락:', missing)
  console.error('   사용권 이양 사찰 보호 규칙 위반')
  process.exit(1)
}

console.log('✅ EXCLUDED_SLUGS 보호 확인:', REQUIRED.join(', '))
