'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const EXAMPLE_JSON = `{
  "temple": {
    "code": "example",
    "name": "예시사",
    "nameEn": "Example Temple",
    "description": "사찰 설명을 입력하세요.",
    "address": "경기도 예시시 예시구",
    "phone": "031-000-0000",
    "denomination": "대한불교 조계종",
    "abbotName": "예시 스님",
    "primaryColor": "#8B5E3C",
    "secondaryColor": "#D4A017",
    "tier": 2
  },
  "blocks": [
    {
      "blockType": "H-01",
      "label": "파티클 히어로",
      "order": 1,
      "isVisible": true,
      "config": {
        "badge": "☸ 사찰 배지",
        "heroTitle": "예시사",
        "heroHanja": "例 示 寺",
        "heroDesc": "사찰 소개 문구",
        "ticker": ["☸ 예시사", "✦ 대한불교조계종"],
        "stats": [
          { "value": "값", "label": "통계 설명" }
        ]
      }
    },
    { "blockType": "D-01", "label": "오늘의 법문", "order": 2, "isVisible": true, "config": { "source": "kv" } },
    { "blockType": "I-01", "label": "공지사항", "order": 3, "isVisible": true, "config": { "source": "kv" } }
  ]
}`

interface Result { ok?: boolean; code?: string; name?: string; blockCount?: number; error?: string }

export default function AddTempleForm() {
  const router = useRouter()
  const [mode, setMode] = useState<'form' | 'json'>('form')

  // 폼 모드 상태
  const [form, setForm] = useState({
    code: '', name: '', nameEn: '', description: '', address: '',
    phone: '', denomination: '대한불교 조계종', abbotName: '',
    primaryColor: '#8B5E3C', secondaryColor: '#D4A017',
    tier: '2', pin: '',
  })

  // JSON 모드 상태
  const [jsonText, setJsonText] = useState('')
  const [jsonPin, setJsonPin] = useState('')

  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<Result | null>(null)
  const [error, setError] = useState('')

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const submitForm = async () => {
    if (!form.code || !form.name || !form.tier) { setError('코드, 이름, 등급은 필수입니다.'); return }
    setLoading(true); setError('')
    const body = {
      temple: {
        code: form.code.trim().toLowerCase(),
        name: form.name.trim(),
        nameEn: form.nameEn || undefined,
        description: form.description || undefined,
        address: form.address || undefined,
        phone: form.phone || undefined,
        denomination: form.denomination,
        abbotName: form.abbotName || undefined,
        primaryColor: form.primaryColor,
        secondaryColor: form.secondaryColor,
        tier: Number(form.tier),
      },
      blocks: [
        { blockType: 'H-01', label: '파티클 히어로', order: 1, isVisible: true, config: {
          heroTitle: form.name, badge: `☸ ${form.denomination}`,
          ticker: [`☸ ${form.name}`, `✦ ${form.denomination}`],
        }},
        { blockType: 'D-01', label: '오늘의 법문', order: 2, isVisible: true, config: { source: 'kv' } },
        { blockType: 'I-01', label: '공지사항', order: 3, isVisible: true, config: { source: 'kv' } },
      ],
    }
    await submit(body, form.pin)
  }

  const submitJson = async () => {
    let parsed
    try { parsed = JSON.parse(jsonText) }
    catch { setError('JSON 형식이 올바르지 않습니다.'); return }
    setLoading(true); setError('')
    await submit(parsed, jsonPin)
  }

  const submit = async (body: object, pin: string) => {
    try {
      // 1. 사찰 DB 등록
      const res = await fetch('/api/super/temples', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const d = await res.json() as Result
      if (!res.ok) { setError(d.error || '등록 실패'); setLoading(false); return }
      setResult(d)

      // 2. PIN 등록 (선택)
      const code = (body as { temple?: { code?: string } }).temple?.code
      if (pin && code) {
        await fetch(`/api/super/temples/${code}/pin`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pin }),
        })
      }
    } catch { setError('네트워크 오류') }
    finally { setLoading(false) }
  }

  if (result?.ok) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6" style={{ background: 'linear-gradient(180deg, #1a0f08, #2C1810)' }}>
        <div className="bg-temple-cream rounded-3xl p-8 w-full max-w-sm text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-temple-brown mb-2">점안 완료!</h2>
          <p className="text-gray-600 text-lg mb-1">{result.name}</p>
          <p className="text-gray-500 text-base mb-4">블록 {result.blockCount}개 · 코드: <code className="bg-gray-100 px-1.5 rounded">{result.code}</code></p>
          <div className="space-y-3">
            <a
              href={`https://munsusa-site-fmwyrdut3-bae-yeonams-projects.vercel.app/${result.code}`}
              target="_blank" rel="noopener"
              className="btn-primary"
            >
              🌐 사이트 확인하기
            </a>
            <button onClick={() => { setResult(null); setForm({ code:'',name:'',nameEn:'',description:'',address:'',phone:'',denomination:'대한불교 조계종',abbotName:'',primaryColor:'#8B5E3C',secondaryColor:'#D4A017',tier:'2',pin:'' }); setJsonText(''); setJsonPin('') }}
              className="btn-secondary">
              + 또 다른 사찰 등록
            </button>
            <button onClick={() => router.push('/super/dashboard')} className="text-gray-400 text-base underline w-full text-center">
              관제 대시보드로 →
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(180deg, #1a0f08 0%, #2C1810 20%, #FFF8E7 20%)' }}>
      {/* 헤더 */}
      <div className="px-5 pt-10 pb-4 flex items-center gap-3">
        <button onClick={() => router.push('/super/dashboard')} className="text-temple-gold text-2xl">←</button>
        <div>
          <h1 className="text-2xl font-bold text-white">새 사찰 등록</h1>
          <p className="text-gray-400 text-base">점안(點眼) 의식</p>
        </div>
      </div>

      <div className="flex-1 bg-temple-cream rounded-t-3xl px-5 pt-6 pb-10">
        {error && (
          <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4 mb-5 text-red-700 text-base">⚠️ {error}</div>
        )}

        {/* 탭 */}
        <div className="flex bg-gray-100 rounded-2xl p-1 mb-6">
          {(['form', 'json'] as const).map(m => (
            <button key={m} onClick={() => setMode(m)}
              className={`flex-1 py-2.5 rounded-xl font-bold text-lg transition-all ${
                mode === m ? 'bg-white text-temple-brown shadow-sm' : 'text-gray-400'
              }`}>
              {m === 'form' ? '📝 항목 입력' : '{ } JSON 입력'}
            </button>
          ))}
        </div>

        {/* 폼 모드 */}
        {mode === 'form' && (
          <div className="space-y-4">
            {[
              { key: 'code', label: '사찰 코드 *', placeholder: 'haeinsa', hint: '영문 소문자만 (URL에 사용)' },
              { key: 'name', label: '사찰명 *', placeholder: '해인사' },
              { key: 'nameEn', label: '영문명', placeholder: 'Haeinsa Temple' },
              { key: 'description', label: '사찰 소개', placeholder: '사찰 설명...', multiline: true },
              { key: 'address', label: '주소', placeholder: '경상남도 합천군 가야면...' },
              { key: 'phone', label: '전화번호', placeholder: '055-000-0000' },
              { key: 'denomination', label: '종단', placeholder: '대한불교 조계종' },
              { key: 'abbotName', label: '주지스님', placeholder: '현응 스님' },
            ].map(({ key, label, placeholder, hint, multiline }) => (
              <div key={key}>
                <label className="block text-temple-brown font-bold text-base mb-1">{label}</label>
                {multiline ? (
                  <textarea value={form[key as keyof typeof form]} onChange={e => set(key, e.target.value)}
                    placeholder={placeholder} rows={3}
                    className="input-field resize-none" />
                ) : (
                  <input type="text" value={form[key as keyof typeof form]} onChange={e => set(key, e.target.value)}
                    placeholder={placeholder} className="input-field" />
                )}
                {hint && <p className="text-gray-400 text-sm mt-1">{hint}</p>}
              </div>
            ))}

            {/* 등급 선택 */}
            <div>
              <label className="block text-temple-brown font-bold text-base mb-1">등급 *</label>
              <div className="grid grid-cols-3 gap-2">
                {[['1','기본'],['2','표준'],['3','프리미엄']].map(([v,l]) => (
                  <button key={v} type="button" onClick={() => set('tier', v)}
                    className={`py-3 rounded-xl font-bold text-base border-2 transition-all ${
                      form.tier === v ? 'bg-temple-gold border-temple-gold text-temple-brown' : 'bg-white border-gray-200 text-gray-500'
                    }`}>
                    Tier {v}<br /><span className="text-sm">{l}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 컬러 */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-temple-brown font-bold text-base mb-1">메인 컬러</label>
                <div className="flex gap-2">
                  <input type="color" value={form.primaryColor} onChange={e => set('primaryColor', e.target.value)}
                    className="w-14 h-14 rounded-xl border-2 border-gray-200 cursor-pointer" />
                  <input type="text" value={form.primaryColor} onChange={e => set('primaryColor', e.target.value)}
                    className="input-field text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-temple-brown font-bold text-base mb-1">보조 컬러</label>
                <div className="flex gap-2">
                  <input type="color" value={form.secondaryColor} onChange={e => set('secondaryColor', e.target.value)}
                    className="w-14 h-14 rounded-xl border-2 border-gray-200 cursor-pointer" />
                  <input type="text" value={form.secondaryColor} onChange={e => set('secondaryColor', e.target.value)}
                    className="input-field text-sm" />
                </div>
              </div>
            </div>

            {/* PIN */}
            <div>
              <label className="block text-temple-brown font-bold text-base mb-1">관리자 PIN (선택)</label>
              <input type="text" inputMode="numeric" maxLength={8} value={form.pin}
                onChange={e => set('pin', e.target.value.replace(/\D/g, '').slice(0, 8))}
                placeholder="4~8자리 숫자 (나중에 설정 가능)"
                className="input-field" />
            </div>

            <button onClick={submitForm} disabled={loading || !form.code || !form.name}
              className="btn-primary text-xl py-5 disabled:opacity-40">
              {loading ? '⚙️ 등록 중...' : '☸ 사찰 점안하기'}
            </button>
          </div>
        )}

        {/* JSON 모드 */}
        {mode === 'json' && (
          <div className="space-y-4">
            <div>
              <label className="block text-temple-brown font-bold text-base mb-1">JSON 데이터</label>
              <textarea
                value={jsonText}
                onChange={e => setJsonText(e.target.value)}
                placeholder={EXAMPLE_JSON}
                rows={18}
                className="input-field font-mono text-sm resize-none leading-relaxed"
                style={{ fontSize: '13px' }}
              />
              <p className="text-gray-400 text-sm mt-1">
                scripts/temples/ 폴더의 JSON 파일 내용을 붙여넣으세요
              </p>
            </div>

            <div>
              <label className="block text-temple-brown font-bold text-base mb-1">관리자 PIN (선택)</label>
              <input type="text" inputMode="numeric" maxLength={8} value={jsonPin}
                onChange={e => setJsonPin(e.target.value.replace(/\D/g, '').slice(0, 8))}
                placeholder="4~8자리 숫자"
                className="input-field" />
            </div>

            <button onClick={submitJson} disabled={loading || !jsonText.trim()}
              className="btn-primary text-xl py-5 disabled:opacity-40">
              {loading ? '⚙️ 등록 중...' : '☸ JSON으로 점안하기'}
            </button>

            {/* 예시 버튼 */}
            <button onClick={() => setJsonText(EXAMPLE_JSON)}
              className="btn-secondary">
              📋 예시 JSON 불러오기
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
