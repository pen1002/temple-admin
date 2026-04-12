'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

const DAILY_WORDS = [
  { text: '천상천하 유아독존 삼계개고 아당안지', source: '석가모니불 탄생게' },
  { text: '일체유심조 — 모든 것은 오직 마음이 지어낸 것이다', source: '화엄경' },
  { text: '과거심불가득 현재심불가득 미래심불가득', source: '금강경' },
  { text: '색즉시공 공즉시색 수상행식 역부여시', source: '반야심경' },
  { text: '네 스스로를 등불로 삼고 네 스스로에 의지하라', source: '대반열반경' },
  { text: '한 송이 꽃이 피니 온 세상에 봄이 온다', source: '선가귀감' },
  { text: '천 리 길도 한 걸음부터 시작한다', source: '도덕경' },
  { text: '물은 낮은 곳으로 흐르되 모든 것을 이롭게 한다', source: '도덕경' },
  { text: '분별하는 마음을 내려놓으면 걸림이 없다', source: '반야심경' },
  { text: '보시는 아무 것도 바라지 않고 베푸는 것이니라', source: '금강경' },
]

export default function DharmaPage() {
  const { slug } = useParams<{ slug: string }>()
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    const day = new Date().getDate()
    setIdx(day % DAILY_WORDS.length)
  }, [])

  const word = DAILY_WORDS[idx]

  return (
    <div style={{ padding: 'clamp(24px,5vw,40px) 16px 60px', maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
      <div style={{ fontSize: 48, marginBottom: 12 }}>📿</div>
      <h2 style={{ fontSize: 22, fontWeight: 600, color: '#c9a84c', letterSpacing: 3, fontFamily: '"Noto Serif KR",serif', marginBottom: 8 }}>오늘의 부처님 말씀</h2>
      <p style={{ fontSize: 11, color: 'rgba(201,168,76,0.4)', marginBottom: 32 }}>{new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}</p>

      <div style={{ background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.15)', borderRadius: 16, padding: 'clamp(24px,5vw,40px)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 12, left: 20, fontSize: 48, color: 'rgba(201,168,76,0.1)', fontFamily: 'serif', lineHeight: 1 }}>"</div>
        <p style={{ fontSize: 'clamp(18px,4vw,24px)', fontWeight: 700, color: '#f0dfa0', lineHeight: 1.8, letterSpacing: 1, fontFamily: '"Noto Serif KR",serif', margin: '12px 0 16px', wordBreak: 'keep-all' }}>
          {word.text}
        </p>
        <p style={{ fontSize: 13, color: 'rgba(201,168,76,0.6)', fontStyle: 'italic' }}>— {word.source}</p>
      </div>

      <div style={{ marginTop: 32, display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
        <button onClick={() => setIdx((idx + 1) % DAILY_WORDS.length)} style={{ background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.3)', color: '#c9a84c', borderRadius: 8, padding: '10px 24px', cursor: 'pointer', fontSize: 13 }}>다른 말씀 보기</button>
        <button onClick={() => {
          navigator.clipboard.writeText(`${word.text}\n— ${word.source}`).then(() => alert('말씀이 복사되었습니다.'))
        }} style={{ background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.3)', color: '#c9a84c', borderRadius: 8, padding: '10px 24px', cursor: 'pointer', fontSize: 13 }}>말씀 복사</button>
        <a href={`/${slug}/cyber`} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.3)', color: '#c9a84c', borderRadius: 8, padding: '10px 24px', fontSize: 13, textDecoration: 'none' }}>☸ 도량으로</a>
      </div>
    </div>
  )
}
