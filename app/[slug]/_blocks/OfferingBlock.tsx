// SEC08-01: 인등불사·기도 동참
import type { TempleData } from './types'

interface PlanItem {
  icon: string
  name: string
  price: string
  desc: string
  tag?: string
}

interface BankAccount {
  bankName: string
  accountNumber: string
  accountHolder: string
}

interface Props {
  temple: TempleData
  config: Record<string, unknown>
}

export default function OfferingBlock({ temple, config }: Props) {
  const primary = temple.primaryColor ?? '#8B2500'
  const gold = '#9B8654'

  const sectionTitle = typeof config.sectionTitle === 'string' ? config.sectionTitle : '인등불사·기도 동참'
  const sectionDesc = typeof config.sectionDesc === 'string' ? config.sectionDesc
    : `${temple.name}의 기도에 동참하여 복덕을 쌓으세요.`

  const defaultPlans: PlanItem[] = [
    { icon: '🕯️', name: '기본 인등', price: '₩30,000/월', desc: '매일 법회 시 스님이 직접 독송\n월 1회 기도 회향 및 문자 발송' },
    { icon: '🌟', name: '삼구 인등', price: '₩80,000/월', tag: 'Family', desc: '가족 3인 동시 기원\n분기별 회향 증명서 발송' },
    { icon: '📿', name: '연간 인등', price: '₩300,000/년', tag: '2개월 무료', desc: '1년 등록 시 2개월 무료\n정기 법회 우선 참석권' },
    { icon: '🙏', name: '49재·천도재', price: '별도 문의', desc: '선망 영가 극락왕생 기원\n사전 예약 필수' },
  ]

  const plans: PlanItem[] = Array.isArray(config.plans) && (config.plans as PlanItem[]).length > 0
    ? (config.plans as PlanItem[])
    : defaultPlans

  const accounts: BankAccount[] = Array.isArray(config.accounts)
    ? (config.accounts as BankAccount[])
    : []

  return (
    <section
      id="offering"
      style={{ background: '#1A1008', padding: '80px 24px' }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* 헤더 */}
        <p style={{ fontSize: '.75rem', fontWeight: 700, letterSpacing: '.12em', color: gold, marginBottom: 12, textTransform: 'uppercase' }}>
          Offering of Light
        </p>
        <h2 style={{ fontFamily: "'Noto Serif KR', serif", fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 700, color: '#FFFAF0', marginBottom: 12, lineHeight: 1.4 }}>
          {sectionTitle}
        </h2>
        <p style={{ fontSize: '.92rem', color: 'rgba(255,250,240,.65)', marginBottom: 48, maxWidth: 560 }}>
          {sectionDesc}
        </p>

        {/* 인등 플랜 카드 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 20, marginBottom: 48 }}>
          {plans.map((plan, i) => (
            <div
              key={i}
              style={{
                background: '#261a0e',
                border: `1px solid ${i === 0 ? primary + '60' : '#3a2a18'}`,
                borderRadius: 16,
                padding: '28px 24px',
                position: 'relative',
              }}
            >
              {plan.tag && (
                <span style={{
                  position: 'absolute', top: 14, right: 14,
                  background: gold, color: '#fff',
                  padding: '3px 10px', borderRadius: 12,
                  fontSize: '.68rem', fontWeight: 700,
                }}>
                  {plan.tag}
                </span>
              )}
              <div style={{ fontSize: '2rem', marginBottom: 12 }}>{plan.icon}</div>
              <h4 style={{ color: '#FFFAF0', fontWeight: 700, fontSize: '1rem', marginBottom: 8 }}>{plan.name}</h4>
              <div style={{ color: gold, fontSize: '1.25rem', fontWeight: 700, marginBottom: 12 }}>{plan.price}</div>
              <p style={{ color: 'rgba(255,250,240,.6)', fontSize: '.84rem', lineHeight: 1.75, whiteSpace: 'pre-line' }}>
                {plan.desc}
              </p>
            </div>
          ))}
        </div>

        {/* 계좌 안내 */}
        {accounts.length > 0 && (
          <div style={{ background: '#261a0e', borderRadius: 12, padding: '24px 28px', display: 'inline-block', minWidth: 280 }}>
            <p style={{ color: gold, fontWeight: 700, fontSize: '.85rem', marginBottom: 12 }}>계좌 안내</p>
            {accounts.map((acc, i) => (
              <div key={i} style={{ marginBottom: i < accounts.length - 1 ? 10 : 0 }}>
                <span style={{ color: 'rgba(255,250,240,.55)', fontSize: '.82rem' }}>{acc.bankName} </span>
                <span style={{ color: '#FFFAF0', fontWeight: 700, fontSize: '.9rem' }}>{acc.accountNumber}</span>
                <span style={{ color: 'rgba(255,250,240,.55)', fontSize: '.82rem' }}> ({acc.accountHolder})</span>
              </div>
            ))}
            <p style={{ color: 'rgba(255,250,240,.35)', fontSize: '.75rem', marginTop: 10 }}>
              입금 후 사찰 전화(061-864-2055)로 확인해 주세요
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
