export default function LegalFooterMinimal() {
  return (
    <footer style={{ padding: '16px 24px', background: '#f9fafb', borderTop: '1px solid #e5e7eb', fontSize: 11, color: '#6b7280', textAlign: 'center', lineHeight: 1.8 }}>
      <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '0 12px', justifyContent: 'center', alignItems: 'center' }}>
        <span>&copy; 2026 미래사</span>
        <span style={{ color: '#d1d5db' }}>·</span>
        <a href="/privacy" style={{ textDecoration: 'underline', color: '#6b7280' }}>개인정보처리방침</a>
        <span style={{ color: '#d1d5db' }}>·</span>
        <a href="/terms" style={{ textDecoration: 'underline', color: '#6b7280' }}>이용약관</a>
        <span style={{ color: '#d1d5db' }}>·</span>
        <span>사업자번호 667-47-01068</span>
        <span style={{ color: '#d1d5db' }}>·</span>
        <span>010-5145-5589</span>
        <span style={{ color: '#d1d5db' }}>·</span>
        <span>통신판매업 신고면제 (간이과세자)</span>
      </div>
    </footer>
  )
}
