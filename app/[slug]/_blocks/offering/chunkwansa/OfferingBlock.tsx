// SEC08-*: 천관사 전용 인등불사 — 진행률·인원수 표시 없음
import type { TempleData } from '../../types'

interface PlanItem {
  icon:  string
  name:  string
  price: string
  desc:  string
}

interface BankAccount {
  bankName:      string
  accountNumber: string
  accountHolder: string
}

interface Props {
  temple: TempleData
  config: Record<string, unknown>
}

const DEFAULT_PLANS: PlanItem[] = [
  { icon: '🪔', name: '3천인등불사',    price: '1구 30,000원 / 1년', desc: '천관전 내 인등 1구 봉안, 1년간 기도 회향' },
  { icon: '🏛️', name: '천관전 불사',   price: '종무소 문의',        desc: '천관보살 전각 불사 동참' },
  { icon: '🙏', name: '49재·천도재',  price: '종무소 문의',        desc: '망자의 극락왕생을 위한 천도재 불사' },
]

const DEFAULT_ACCOUNTS: BankAccount[] = [
  { bankName: '농협', accountNumber: '351-0001-2345-03', accountHolder: '천관사' },
]

export default function ChunkwansaOfferingBlock({ temple, config }: Props) {
  const sectionTitle = typeof config.sectionTitle === 'string' ? config.sectionTitle : '인등·기도 불사동참'
  const sectionDesc  = typeof config.sectionDesc  === 'string' ? config.sectionDesc
    : `${temple.name}의 기도에 동참하여 천관보살의 가피를 함께 나누세요.`
  const contactPhone = typeof config.contactPhone === 'string' ? config.contactPhone : '061-867-2954'

  const plans: PlanItem[] = Array.isArray(config.plans) && (config.plans as PlanItem[]).length > 0
    ? (config.plans as PlanItem[])
    : DEFAULT_PLANS

  const accounts: BankAccount[] = Array.isArray(config.accounts)
    ? (config.accounts as BankAccount[])
    : DEFAULT_ACCOUNTS

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
              입금 후 사찰 전화({contactPhone})로 확인해 주세요
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
