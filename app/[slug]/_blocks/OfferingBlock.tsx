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
    <section id="offering" className="bt-section bt-indung-section">
      <div className="bt-section-inner">
        <span className="bt-section-label">Offering of Light</span>
        <h2 className="bt-section-title">{sectionTitle}</h2>
        <p className="bt-section-desc">{sectionDesc}</p>

        <div className="bt-indung-grid">
          {plans.map((plan, i) => (
            <div key={i} className="bt-indung-card">
              <div style={{ fontSize: '2rem', marginBottom: 8 }}>{plan.icon}</div>
              <h4>{plan.name}</h4>
              <div className="price">{plan.price}</div>
              <p style={{ whiteSpace: 'pre-line' }}>{plan.desc}</p>
              {plan.tag && <span className="tag">{plan.tag}</span>}
            </div>
          ))}
        </div>

        {accounts.length > 0 && (
          <div className="bt-indung-account">
            <p style={{ fontWeight: 700, marginBottom: 8 }}>계좌 안내</p>
            {accounts.map((acc, i) => (
              <p key={i}>
                {acc.bankName} <strong>{acc.accountNumber}</strong> ({acc.accountHolder})
              </p>
            ))}
            <p style={{ marginTop: 8, opacity: 0.5, fontSize: '.75rem' }}>
              입금 후 사찰 전화(061-864-2055)로 확인해 주세요
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
