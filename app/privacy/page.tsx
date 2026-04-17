import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '개인정보처리방침 | 미래사',
  description: '미래사 개인정보처리방침',
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
  '제1조 총칙', '제2조 수집하는 개인정보 항목', '제3조 개인정보 수집 방법',
  '제4조 개인정보 이용 목적', '제5조 개인정보 보유 및 이용 기간', '제6조 개인정보 제3자 제공',
  '제7조 개인정보 처리 위탁', '제8조 이용자의 권리와 행사 방법', '제9조 개인정보 파기 절차',
  '제10조 개인정보 보호 안전성 확보 조치', '제11조 쿠키 사용 여부', '제12조 개인정보처리책임자',
  '제13조 사업자 정보 및 통신판매업 신고 사항', '제14조 권익 침해 구제 방법',
]

export default function PrivacyPage() {
  return (
    <div style={S.wrap}>
      <div style={S.banner}>
        ⚠️ 본 개인정보처리방침은 변호사 검토 전 임시본입니다. 향후 법률 검토를 거쳐 정식본으로 교체될 예정입니다.
      </div>

      <h1 style={S.h1}>개인정보처리방침</h1>
      <p style={{ fontSize: 13, color: '#666', marginBottom: 20 }}>시행일: 2026년 4월 17일</p>

      <nav style={S.toc}>
        <strong>목차</strong>
        {ARTICLES.map((a, i) => (
          <a key={i} href={`#art${i + 1}`} style={S.tocLink}>{a}</a>
        ))}
        <a href="#appendix" style={S.tocLink}>부칙</a>
      </nav>

      <section id="art1">
        <h2 style={S.h2}>제1조 (총칙)</h2>
        <p>미래사(이하 &quot;사찰&quot;)는 「개인정보보호법」 제30조에 따라 이용자의 개인정보를 보호하고, 이와 관련한 고충을 신속하고 원활하게 처리하기 위하여 다음과 같이 개인정보처리방침을 수립·공개합니다.</p>
      </section>

      <section id="art2">
        <h2 style={S.h2}>제2조 (수집하는 개인정보 항목)</h2>
        <p>사찰은 다음과 같은 개인정보를 수집합니다.</p>
        <p><strong>필수 항목:</strong> 성명</p>
        <p><strong>선택 항목:</strong> 핸드폰 번호, 집전화 번호, 주소, 생년월일(음/양력), 가족 축원 정보(가족 성명·생년월일·관계), 영가 정보(성명·관계·제사일), 발원문</p>
        <p><strong>자동 수집 항목:</strong> 접속 IP, 접속 시간, 브라우저 정보</p>
      </section>

      <section id="art3">
        <h2 style={S.h2}>제3조 (개인정보 수집 방법)</h2>
        <p>사찰은 다음과 같은 방법으로 개인정보를 수집합니다.</p>
        <ul>
          <li>온라인 법당 신도카드 등록 양식</li>
          <li>연등접수, 인등불사, 원불모시기, 지장전 위패 접수 양식</li>
          <li>나의 기도 동참 조회 양식</li>
        </ul>
      </section>

      <section id="art4">
        <h2 style={S.h2}>제4조 (개인정보 이용 목적)</h2>
        <p>수집한 개인정보는 다음 목적으로만 이용합니다.</p>
        <ul>
          <li>신도 등록 및 관리</li>
          <li>기도·불사·공양 접수 및 처리</li>
          <li>법회·행사 안내 (SMS 수신 동의자에 한함)</li>
          <li>축원·위패 봉안 서비스 제공</li>
          <li>문의 대응 및 민원 처리</li>
        </ul>
      </section>

      <section id="art5">
        <h2 style={S.h2}>제5조 (개인정보 보유 및 이용 기간)</h2>
        <p>이용자의 개인정보는 수집·이용 목적이 달성된 후 지체 없이 파기합니다. 단, 다음의 경우 해당 기간 동안 보존합니다.</p>
        <ul>
          <li>전자상거래 등에서의 소비자보호에 관한 법률: 계약 또는 청약철회 등에 관한 기록 5년, 대금결제 및 재화 등의 공급에 관한 기록 5년</li>
          <li>신도 등록 정보: 신도 탈퇴 요청 시까지 (최대 보존 기간 5년)</li>
          <li>축원·위패 정보: 봉안 해제 요청 시까지</li>
        </ul>
      </section>

      <section id="art6">
        <h2 style={S.h2}>제6조 (개인정보 제3자 제공)</h2>
        <p>사찰은 이용자의 동의 없이 개인정보를 제3자에게 제공하지 않습니다. 다만, 다음의 경우는 예외로 합니다.</p>
        <ul>
          <li>이용자가 사전에 동의한 경우</li>
          <li>법률에 특별한 규정이 있는 경우</li>
        </ul>
      </section>

      <section id="art7">
        <h2 style={S.h2}>제7조 (개인정보 처리 위탁)</h2>
        <p>사찰은 서비스 제공을 위해 다음과 같이 개인정보 처리를 위탁합니다.</p>
        <ul>
          <li>솔라피(Solapi): SMS/알림톡 발송 대행</li>
          <li>Vercel Inc.: 웹 호스팅</li>
          <li>Supabase Inc.: 데이터베이스 호스팅</li>
        </ul>
      </section>

      <section id="art8">
        <h2 style={S.h2}>제8조 (이용자의 권리와 행사 방법)</h2>
        <p>이용자는 언제든지 다음 권리를 행사할 수 있습니다.</p>
        <ul>
          <li>개인정보 열람 요구</li>
          <li>오류 등이 있을 경우 정정 요구</li>
          <li>삭제 요구</li>
          <li>처리 정지 요구</li>
        </ul>
        <p>위 권리 행사는 010-5145-5589 또는 miraesa108@gmail.com으로 연락하여 주십시오.</p>
      </section>

      <section id="art9">
        <h2 style={S.h2}>제9조 (개인정보 파기 절차)</h2>
        <p>이용 목적이 달성된 개인정보는 별도의 DB로 옮겨져(종이의 경우 별도 서류함) 내부 방침 및 관련 법령에 따라 일정 기간 저장 후 혹은 즉시 파기됩니다.</p>
        <ul>
          <li>전자적 파일: 복구 불가능한 방법으로 영구 삭제</li>
          <li>종이 문서: 분쇄기로 분쇄 또는 소각</li>
        </ul>
      </section>

      <section id="art10">
        <h2 style={S.h2}>제10조 (개인정보 보호 안전성 확보 조치)</h2>
        <p>사찰은 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다.</p>
        <ul>
          <li>관리적 조치: 개인정보 취급 직원의 최소화 및 교육</li>
          <li>기술적 조치: 데이터베이스 접근 권한 관리, HTTPS 암호화 전송, JWT 기반 인증</li>
          <li>물리적 조치: 서버 호스팅 업체(Supabase, Vercel)의 물리적 보안 체계 활용</li>
        </ul>
      </section>

      <section id="art11">
        <h2 style={S.h2}>제11조 (쿠키 사용 여부)</h2>
        <p>사찰은 서비스 인증(로그인 세션 관리)을 위해 쿠키를 사용합니다. 이용자는 브라우저 설정에서 쿠키 저장을 거부할 수 있으나, 이 경우 일부 서비스 이용이 제한될 수 있습니다.</p>
      </section>

      <section id="art12">
        <h2 style={S.h2}>제12조 (개인정보처리책임자)</h2>
        <dl style={S.dl}>
          <dt style={S.dt}>개인정보처리책임자</dt><dd style={S.dd}>&nbsp;</dd>
          <dt style={S.dt}>성명</dt><dd style={S.dd}>미래사 주지스님</dd>
          <dt style={S.dt}>소속</dt><dd style={S.dd}>미래사 종무소</dd>
          <dt style={S.dt}>연락처</dt><dd style={S.dd}>010-5145-5589</dd>
          <dt style={S.dt}>이메일</dt><dd style={S.dd}>miraesa108@gmail.com</dd>
        </dl>
        <dl style={{ ...S.dl, marginTop: 16 }}>
          <dt style={S.dt}>개인정보처리담당자</dt><dd style={S.dd}>&nbsp;</dd>
          <dt style={S.dt}>부서</dt><dd style={S.dd}>미래사 종무소</dd>
          <dt style={S.dt}>연락처</dt><dd style={S.dd}>010-5145-5589</dd>
        </dl>
        <p style={{ marginTop: 12 }}>이용자는 미래사의 서비스를 이용하며 발생한 모든 개인정보 보호 관련 문의, 불만 처리, 피해 구제 등에 관한 사항을 위 연락처로 문의할 수 있습니다.</p>
      </section>

      <section id="art13">
        <h2 style={S.h2}>제13조 (사업자 정보 및 통신판매업 신고 사항)</h2>
        <p>① 미래사의 사업자 정보는 다음과 같습니다:</p>
        <dl style={S.dl}>
          <dt style={S.dt}>상호</dt><dd style={S.dd}>미래사</dd>
          <dt style={S.dt}>대표</dt><dd style={S.dd}>미래사 주지스님</dd>
          <dt style={S.dt}>사업자등록번호</dt><dd style={S.dd}>667-47-01068 (간이과세자)</dd>
          <dt style={S.dt}>소재지</dt><dd style={S.dd}>서울특별시 (상세 주소는 종무소로 문의)</dd>
          <dt style={S.dt}>연락처</dt><dd style={S.dd}>010-5145-5589</dd>
          <dt style={S.dt}>이메일</dt><dd style={S.dd}>miraesa108@gmail.com</dd>
        </dl>
        <p style={{ marginTop: 12 }}>② 미래사는 부가가치세법상 간이과세자로서, 공정거래위원회 고시 「통신판매업 신고 면제 기준에 대한 고시」에 따라 통신판매업 신고 의무가 면제됩니다.</p>
        <p>③ 단, 전자상거래 등에서의 소비자보호에 관한 법률에 따른 다음 의무는 동일하게 준수합니다:</p>
        <ol>
          <li>사업자 정보 표시 (법 제13조)</li>
          <li>청약철회 및 환불 규정 (법 제17조)</li>
          <li>거래 기록 보존 (법 제6조)</li>
          <li>개인정보 보호 (개인정보보호법)</li>
        </ol>
        <p>④ 이용자 권익 보호를 위해 위 조항은 지속적으로 준수합니다.</p>
      </section>

      <section id="art14">
        <h2 style={S.h2}>제14조 (권익 침해 구제 방법)</h2>
        <p>이용자는 개인정보 침해로 인한 구제를 받기 위하여 다음 기관에 분쟁 해결이나 상담 등을 신청할 수 있습니다.</p>
        <ul>
          <li>개인정보분쟁조정위원회: (국번없이) 1833-6972 (www.kopico.go.kr)</li>
          <li>개인정보침해신고센터: (국번없이) 118 (privacy.kisa.or.kr)</li>
          <li>대검찰청 사이버범죄수사단: (국번없이) 1301 (www.spo.go.kr)</li>
          <li>경찰청 사이버수사국: (국번없이) 182 (ecrm.cyber.go.kr)</li>
        </ul>
      </section>

      <section id="appendix">
        <h2 style={S.h2}>부칙</h2>
        <p>본 개인정보처리방침은 2026년 4월 17일부터 시행합니다.</p>
        <p><strong>개정 이력:</strong></p>
        <ul>
          <li>2026.04.17 — 최초 제정 (임시본)</li>
        </ul>
      </section>

      <div style={S.footer}>
        <p>미래사 | 사업자등록번호 667-47-01068 | 통신판매업 신고면제 (간이과세자)</p>
      </div>
    </div>
  )
}
