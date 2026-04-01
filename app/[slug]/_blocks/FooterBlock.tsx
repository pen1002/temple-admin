// 항상 표시되는 푸터
import type { TempleData } from './types'

export default function FooterBlock({ temple }: { temple: TempleData }) {
  return (
    <footer
      className="px-5 py-10"
      style={{ background: '#0a0704', borderTop: '1px solid #2a1e10' }}
    >
      <div className="max-w-xl mx-auto text-center space-y-3">
        {/* 법륜 아이콘 */}
        <div className="text-3xl mb-4" style={{ color: '#D4AF37', opacity: 0.6 }}>☸</div>

        {/* 사찰명 */}
        <p className="font-bold text-lg" style={{ color: '#C4A882' }}>{temple.name}</p>

        {/* 종단 */}
        {temple.denomination && (
          <p className="text-sm" style={{ color: '#6b5a40' }}>{temple.denomination}</p>
        )}

        {/* 주소 */}
        {temple.address && (
          <p className="text-sm" style={{ color: '#6b5a40' }}>{temple.address}</p>
        )}

        {/* 연락처 */}
        {temple.phone && (
          <a href={`tel:${temple.phone}`} className="text-sm block" style={{ color: '#6b5a40' }}>
            {temple.phone}
          </a>
        )}

        {/* 이메일 */}
        {temple.email && (
          <a href={`mailto:${temple.email}`} className="text-sm block" style={{ color: '#6b5a40' }}>
            {temple.email}
          </a>
        )}

        <div className="pt-4" style={{ borderTop: '1px solid #2a1e10' }}>
          <p className="text-xs" style={{ color: '#3d2e1a' }}>
            © {new Date().getFullYear()} {temple.name}. All rights reserved.
          </p>
          <p className="text-xs mt-1" style={{ color: '#2a1e10' }}>
            1080 사찰 자동화 대작불사
          </p>
          {/* 관리자 로그인 (매우 작게) */}
          <a
            href={`/admin/${temple.code}`}
            className="text-xs mt-3 inline-block opacity-20 hover:opacity-50 transition-opacity"
            style={{ color: '#8B6914' }}
          >
            관리
          </a>
        </div>
      </div>
    </footer>
  )
}
