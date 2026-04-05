// 항상 표시되는 푸터
import type { TempleData } from './types'

export default function FooterBlock({ temple }: { temple: TempleData }) {
  return (
    <footer className="bt-footer">
      <div className="bt-footer-inner">
        {/* 브랜드 */}
        <div className="bt-footer-brand">
          <h3>{temple.name}</h3>
          {temple.denomination && <p>{temple.denomination}</p>}
          {temple.address && <p>{temple.address}</p>}
          {temple.phone && (
            <p><a href={`tel:${temple.phone}`} style={{ color: 'inherit' }}>{temple.phone}</a></p>
          )}
          {temple.email && (
            <p><a href={`mailto:${temple.email}`} style={{ color: 'inherit' }}>{temple.email}</a></p>
          )}
        </div>

        {/* 링크 컬럼 1 */}
        <div className="bt-footer-col">
          <h4>사찰 안내</h4>
          <a href="#intro">소개</a>
          <a href="#heritage">문화유산</a>
          <a href="#history">연혁</a>
        </div>

        {/* 링크 컬럼 2 */}
        <div className="bt-footer-col">
          <h4>프로그램</h4>
          <a href="#templestay">템플스테이</a>
          <a href="#events">법회·행사</a>
          <a href="#offering">인등불사</a>
        </div>

        {/* 링크 컬럼 3 */}
        <div className="bt-footer-col">
          <h4>관련 링크</h4>
          <a href="https://www.templestay.com" target="_blank" rel="noopener noreferrer">템플스테이</a>
          <a href="https://www.jogye.or.kr" target="_blank" rel="noopener noreferrer">조계종</a>
          <a href={`/admin/${temple.code}`} style={{ opacity: 0.3 }}>관리자</a>
        </div>
      </div>

      <div className="bt-footer-bottom">
        © {new Date().getFullYear()} {temple.name}. All rights reserved. · 1080 사찰 자동화 대작불사
      </div>
    </footer>
  )
}
