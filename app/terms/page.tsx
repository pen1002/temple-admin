import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '이용약관 | 미래사',
  description: '미래사 서비스 이용약관',
}

const S = {
  wrap: { maxWidth: 800, margin: '0 auto', padding: '24px 16px 60px', fontFamily: "'Apple SD Gothic Neo','Malgun Gothic',sans-serif", color: '#222', lineHeight: 1.8, fontSize: 14 } as const,
  banner: { background: '#FEF3C7', border: '1px solid #F59E0B', borderRadius: 8, padding: '12px 16px', marginBottom: 24, fontSize: 13, color: '#92400E' } as const,
  h1: { fontSize: 22, fontWeight: 800, marginBottom: 4, color: '#111' } as const,
  h2: { fontSize: 16, fontWeight: 700, marginTop: 32, marginBottom: 8, color: '#333', borderBottom: '1px solid #e5e5e5', paddingBottom: 4 } as const,
  toc: { background: '#f9f9f9', borderRadius: 8, padding: '16px 20px', marginBottom: 24, fontSize: 13 } as const,
  tocLink: { display: 'block', padding: '3px 0', color: '#2563EB', textDecoration: 'none' } as const,
  dl: { display: 'grid', gridTemplateColumns: '120px 1fr', gap: '4px 8px', fontSize: 13, marginTop: 8 } as const,
  dt: { fontWeight: 600, color: '#555' } as const,
  dd: { margin: 0 } as const,
  footer: { marginTop: 40, padding: '16px 0', borderTop: '1px solid #e5e5e5', fontSize: 12, color: '#888' } as const,
}

const ARTICLES = [
  '제1조 목적', '제2조 용어의 정의', '제3조 약관의 효력 및 변경',
  '제4조 서비스의 제공 및 변경', '제5조 서비스 이용 제한',
  '제6조 이용자의 의무', '제7조 미래사의 의무',
  '제8조 인등·불사금 등 공양 관련', '제9조 개인정보 보호',
  '제10조 면책 조항', '제11조 분쟁 해결',
]

export default function TermsPage() {
  return (
    <div style={S.wrap}>
      <div style={S.banner}>
        ⚠️ 본 이용약관은 변호사 검토 전 임시본입니다. 향후 법률 검토를 거쳐 정식본으로 교체될 예정입니다.
      </div>

      <h1 style={S.h1}>이용약관</h1>
      <p style={{ fontSize: 13, color: '#666', marginBottom: 20 }}>시행일: 2026년 4월 17일</p>

      <nav style={S.toc}>
        <strong>목차</strong>
        {ARTICLES.map((a, i) => (
          <a key={i} href={`#t${i + 1}`} style={S.tocLink}>{a}</a>
        ))}
        <a href="#t-appendix" style={S.tocLink}>부칙</a>
      </nav>

      <section id="t1">
        <h2 style={S.h2}>제1조 (목적)</h2>
        <p>본 약관은 미래사(이하 &quot;사찰&quot;)가 제공하는 온라인 법당 서비스(이하 &quot;서비스&quot;)의 이용과 관련하여 사찰과 이용자 간의 권리, 의무 및 책임 사항을 규정함을 목적으로 합니다.</p>
      </section>

      <section id="t2">
        <h2 style={S.h2}>제2조 (용어의 정의)</h2>
        <ul>
          <li><strong>서비스:</strong> 사찰이 온라인으로 제공하는 신도 등록, 기도 접수, 불사금 납부, 법회 안내 등 일체의 디지털 종무소 기능</li>
          <li><strong>이용자:</strong> 서비스에 접속하여 본 약관에 따라 사찰이 제공하는 서비스를 이용하는 자</li>
          <li><strong>공양:</strong> 연등 접수, 인등불사, 원불모시기, 지장전 위패 등 이용자가 신청하는 불교 의식 서비스 및 이에 수반하는 보시금</li>
        </ul>
      </section>

      <section id="t3">
        <h2 style={S.h2}>제3조 (약관의 효력 및 변경)</h2>
        <p>① 본 약관은 서비스 화면에 게시하거나 기타의 방법으로 이용자에게 공지함으로써 효력이 발생합니다.</p>
        <p>② 사찰은 관련 법령에 위배되지 않는 범위에서 본 약관을 개정할 수 있으며, 개정 시 적용일자 및 개정 사유를 명시하여 7일 전 공지합니다.</p>
      </section>

      <section id="t4">
        <h2 style={S.h2}>제4조 (서비스의 제공 및 변경)</h2>
        <p>사찰은 다음과 같은 서비스를 제공합니다.</p>
        <ul>
          <li>온라인 신도 등록 및 관리</li>
          <li>연등·인등·원불 등 공양 접수</li>
          <li>지장전 위패 봉안 접수</li>
          <li>법회·행사 일정 안내</li>
          <li>부처님 말씀(오늘의 법문) 제공</li>
          <li>기타 사찰이 정하는 온라인 불교 서비스</li>
        </ul>
      </section>

      <section id="t5">
        <h2 style={S.h2}>제5조 (서비스 이용 제한)</h2>
        <p>사찰은 다음 각 호에 해당하는 경우 서비스 이용을 제한할 수 있습니다.</p>
        <ul>
          <li>타인의 정보를 도용한 경우</li>
          <li>서비스의 정상적인 운영을 방해한 경우</li>
          <li>기타 관련 법령에 위반하는 행위를 한 경우</li>
        </ul>
      </section>

      <section id="t6">
        <h2 style={S.h2}>제6조 (이용자의 의무)</h2>
        <ul>
          <li>이용자는 본인의 정확한 정보를 제공하여야 합니다.</li>
          <li>타인의 정보를 부정하게 사용하여서는 아니 됩니다.</li>
          <li>서비스 내에서 불교의 가르침에 어긋나는 행위를 하여서는 아니 됩니다.</li>
        </ul>
      </section>

      <section id="t7">
        <h2 style={S.h2}>제7조 (미래사의 의무)</h2>
        <ul>
          <li>사찰은 관련 법령과 본 약관이 금지하거나 공서양속에 반하는 행위를 하지 않습니다.</li>
          <li>이용자의 개인정보를 보호하기 위해 보안 시스템을 갖추며, 개인정보처리방침을 공시합니다.</li>
          <li>서비스의 안정적 제공을 위해 최선을 다합니다.</li>
        </ul>
      </section>

      <section id="t8">
        <h2 style={S.h2} id="refund">제8조 (인등·불사금 등 공양 관련)</h2>
        <p>① 이용자는 다음 공양 서비스에 대하여 결제일로부터 7일 이내 취소를 요청할 수 있습니다:</p>
        <ol>
          <li>연등 접수</li>
          <li>인등불사</li>
          <li>원불모시기</li>
          <li>지장전 위패</li>
          <li>나의 기도 동참</li>
        </ol>
        <p>② 다음의 경우 취소가 제한될 수 있습니다:</p>
        <ol>
          <li>법회·행사 당일 또는 전일 접수분</li>
          <li>이미 점등(點燈)·봉안(奉安)이 완료된 경우</li>
          <li>이용자의 요청으로 맞춤 제작이 진행된 경우</li>
        </ol>
        <p>③ 환불은 이용자가 결제한 방법과 동일한 방법으로 처리하되, 결제 수단 사업자의 규정에 따라 영업일 기준 3~7일이 소요될 수 있습니다.</p>
        <p>④ 환불 요청은 010-5145-5589 또는 miraesa108@gmail.com으로 연락하여 주십시오.</p>
      </section>

      <section id="t9">
        <h2 style={S.h2}>제9조 (개인정보 보호)</h2>
        <p>사찰은 이용자의 개인정보를 보호하기 위해 「개인정보보호법」 등 관련 법령이 정하는 바를 준수하며, 별도의 <a href="/privacy" style={{ color: '#2563EB' }}>개인정보처리방침</a>에 따릅니다.</p>
      </section>

      <section id="t10">
        <h2 style={S.h2}>제10조 (면책 조항)</h2>
        <ul>
          <li>천재지변 또는 이에 준하는 불가항력으로 서비스를 제공할 수 없는 경우 책임이 면제됩니다.</li>
          <li>이용자의 귀책 사유로 인한 서비스 이용 장애에 대하여 사찰은 책임을 지지 않습니다.</li>
        </ul>
      </section>

      <section id="t11">
        <h2 style={S.h2}>제11조 (분쟁 해결)</h2>
        <p>① 사찰과 이용자 간에 발생한 분쟁에 관하여는 상호 협의하여 해결합니다.</p>
        <p>② 협의가 이루어지지 않을 경우 서울중앙지방법원을 관할 법원으로 합니다.</p>
      </section>

      <section id="t-appendix">
        <h2 style={S.h2}>부칙</h2>
        <p>본 약관은 2026년 4월 17일부터 시행합니다.</p>
        <p><strong>개정 이력:</strong></p>
        <ul>
          <li>2026.04.17 — 최초 제정 (임시본)</li>
        </ul>
      </section>

      <section style={{ marginTop: 32, padding: 16, background: '#f9f9f9', borderRadius: 8, border: '1px solid #e5e5e5' }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>사업자 정보</h3>
        <dl style={S.dl}>
          <dt style={S.dt}>상호</dt><dd style={S.dd}>미래사</dd>
          <dt style={S.dt}>대표</dt><dd style={S.dd}>미래사 주지스님</dd>
          <dt style={S.dt}>사업자등록번호</dt><dd style={S.dd}>667-47-01068 (간이과세자)</dd>
          <dt style={S.dt}>연락처</dt><dd style={S.dd}>010-5145-5589</dd>
          <dt style={S.dt}>이메일</dt><dd style={S.dd}>miraesa108@gmail.com</dd>
          <dt style={S.dt}>통신판매업</dt><dd style={S.dd}>신고 면제 (공정위 고시 근거, 간이과세자)</dd>
        </dl>
      </section>

      <div style={S.footer}>
        <p>미래사 | 사업자등록번호 667-47-01068 | 통신판매업 신고면제 (간이과세자)</p>
      </div>
    </div>
  )
}
