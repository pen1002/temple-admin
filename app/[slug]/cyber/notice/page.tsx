'use client'
import { useParams } from 'next/navigation'

const NOTICES = [
  { date: '2026.04.12', title: '사이버법당 미래사 개원 안내', content: '미래사 사이버법당이 개원하였습니다. 대웅전, 지장전, 종무소, 초공양, 인등·연등 공양에 동참해 주세요.' },
  { date: '2026.04.08', title: '부처님오신날 봉축 법요식 안내', content: '불기 2570년 부처님오신날 봉축 법요식이 온라인으로 진행됩니다. 사이버법당에서 함께해 주세요.' },
  { date: '2026.04.01', title: '4월 초하루기도 접수 안내', content: '4월 초하루기도를 접수합니다. 종무소에서 접수 가능합니다.' },
]

export default function NoticePage() {
  const { slug } = useParams<{ slug: string }>()

  return (
    <div style={{ padding: 'clamp(24px,5vw,40px) 16px 60px', maxWidth: 600, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <div style={{ fontSize: 48, marginBottom: 8 }}>📋</div>
        <h2 style={{ fontSize: 22, fontWeight: 600, color: '#c9a84c', letterSpacing: 3, fontFamily: '"Noto Serif KR",serif' }}>공지사항</h2>
        <p style={{ fontSize: 12, color: 'rgba(201,168,76,0.4)', marginTop: 4 }}>미래사 소식을 전합니다</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {NOTICES.map((n, i) => (
          <div key={i} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(201,168,76,0.12)', borderRadius: 10, padding: '16px 18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: 15, fontWeight: 600, color: '#f0dfa0' }}>{n.title}</span>
              <span style={{ fontSize: 11, color: 'rgba(201,168,76,0.4)', whiteSpace: 'nowrap', marginLeft: 12 }}>{n.date}</span>
            </div>
            <p style={{ fontSize: 13, color: 'rgba(240,223,160,0.65)', lineHeight: 1.8, margin: 0 }}>{n.content}</p>
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center', marginTop: 28 }}>
        <a href={`/${slug}/cyber`} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.3)', color: '#c9a84c', borderRadius: 8, padding: '10px 24px', fontSize: 13, textDecoration: 'none' }}>☸ 도량으로 돌아가기</a>
      </div>
    </div>
  )
}
