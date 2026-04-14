'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import BlockGrid, { getBlockName } from './BlockGrid'

interface Result { ok?: boolean; code?: string; name?: string; blockCount?: number; error?: string }

// ── 10대 컬러 테마 ───────────────────────────────────────────────────────────
const TEMPLE_THEMES = [
  { id: 'golden-lotus',     name: '황금 연등',  primary: '#F59E0B', secondary: '#FCD34D', bg: '#1a1200',
    desc: '황금빛 연등이 밤하늘을 수놓는 따뜻하고 신성한 테마', temples: ['해인사', '통도사', '법주사'] },
  { id: 'deep-ocean',       name: '해조 관음',  primary: '#0F766E', secondary: '#164E63', bg: '#0a1a1a',
    desc: '관음보살의 자비가 깊은 바다처럼 흐르는 청록 테마', temples: ['낙산사', '보리암', '향일암'] },
  { id: 'forest-healing',   name: '치유 산림',  primary: '#047857', secondary: '#065F46', bg: '#0a150a',
    desc: '심산유곡 울창한 숲 속 사찰의 치유와 정진 테마', temples: ['월정사', '백양사', '선암사'] },
  { id: 'compassion-pink',  name: '자비 연화',  primary: '#FB7185', secondary: '#EC4899', bg: '#1a0a10',
    desc: '연꽃처럼 청정하고 따뜻한 자비심을 담은 테마', temples: ['관음사', '연화사', '자비사'] },
  { id: 'midnight-void',    name: '적멸 심야',  primary: '#4338CA', secondary: '#4C1D95', bg: '#080812',
    desc: '적멸의 고요함 속 깊은 선정을 표현한 심야 테마', temples: ['마곡사', '동학사', '갑사'] },
  { id: 'zen-ash',          name: '선태 회백',  primary: '#94A3B8', secondary: '#6B7280', bg: '#111114',
    desc: '선방의 재 빛 고요함과 무념무상의 경지를 담은 테마', temples: ['수덕사', '봉암사', '태고사'] },
  { id: 'dawn-glow',        name: '여명 일출',  primary: '#F97316', secondary: '#EF4444', bg: '#150800',
    desc: '새벽 예불의 타오르는 촛불과 일출의 광명을 담은 테마', temples: ['미황사', '대흥사', '두륜사'] },
  { id: 'earth-terracotta', name: '황토 기와',  primary: '#92400E', secondary: '#78350F', bg: '#120800',
    desc: '전통 황토와 기와의 온기를 담은 고찰의 정취 테마', temples: ['불국사', '송광사', '화엄사'] },
  { id: 'clear-wisdom',     name: '청명 지혜',  primary: '#0EA5E9', secondary: '#3B82F6', bg: '#05101a',
    desc: '맑고 투명한 지혜의 빛, 청명한 하늘을 담은 테마', temples: ['건봉사', '신흥사', '백담사'] },
  { id: 'pearl-white',      name: '백옥 백련',  primary: '#E4E4E7', secondary: '#F1F5F9', bg: '#0a0a0a',
    desc: '백련처럼 순수하고 청정한 백옥의 광명 테마', temples: ['극락사', '광명사', '정토사'] },
]

export default function AddTempleForm() {
  const router = useRouter()
  const [selectedBlocks, setSelectedBlocks] = useState<string[]>(['H-05'])
  const [themeColor, setThemeColor] = useState('golden-lotus')
  const [pageTemplate, setPageTemplate] = useState('standard')

  const [templeType, setTempleType] = useState<'offline' | 'cyber'>('offline')
  const [kakaoNotifyTel, setKakaoNotifyTel] = useState('')
  const [bankName, setBankName] = useState('')
  const [bankAccount, setBankAccount] = useState('')
  const [bankHolder, setBankHolder] = useState('')

  const [form, setForm] = useState({
    code: '', name: '', nameEn: '', description: '', address: '',
    phone: '', denomination: '대한불교 조계종', abbotName: '',
    primaryColor: '#8B5E3C', secondaryColor: '#D4A017',
    tier: '2', pin: '',
  })

  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<Result | null>(null)
  const [error, setError] = useState('')

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const activeTheme = TEMPLE_THEMES.find(t => t.id === themeColor) ?? TEMPLE_THEMES[0]

  const submitForm = async () => {
    if (!form.code || !form.name || !form.tier) { setError('코드, 이름, 등급은 필수입니다.'); return }
    if (selectedBlocks.length === 0) { setError('블록을 최소 1개 이상 선택해주세요.'); return }
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
        themeColor,
        pageTemplate,
        tier: Number(form.tier),
        temple_type: templeType,
        kakao_notify_tel: kakaoNotifyTel || undefined,
        bank_name: bankName || undefined,
        bank_account: bankAccount || undefined,
        bank_holder: bankHolder || undefined,
      },
      blocks: selectedBlocks.map((id, i) => {
        const config: Record<string, unknown> = id === 'H-01' ? {
          heroTitle: form.name,
          badge: `☸ ${form.denomination}`,
          ticker: [`☸ ${form.name}`, `✦ ${form.denomination}`],
          source: 'kv',
        } : { source: 'kv' }
        return { blockType: id, label: getBlockName(id), order: i + 1, isVisible: true, config }
      }),
    }
    try {
      const res = await fetch('/api/super/temples', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const d = await res.json() as Result
      if (!res.ok) { setError(d.error || '등록 실패'); setLoading(false); return }
      setResult(d)
      const code = form.code.trim().toLowerCase()
      if (form.pin && code) {
        await fetch(`/api/super/temples/${code}/pin`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pin: form.pin }),
        })
      }
    } catch { setError('네트워크 오류') }
    finally { setLoading(false) }
  }

  const resetForm = () => {
    setResult(null)
    setSelectedBlocks(['H-05'])
    setThemeColor('golden-lotus')
    setPageTemplate('standard')
    setForm({ code:'', name:'', nameEn:'', description:'', address:'', phone:'', denomination:'대한불교 조계종', abbotName:'', primaryColor:'#8B5E3C', secondaryColor:'#D4A017', tier:'2', pin:'' })
    setError('')
  }

  // ── 점안 완료 화면 ─────────────────────────────────────────────────────────
  if (result?.ok) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6" style={{ background: 'linear-gradient(180deg, #1a0f08, #2C1810)' }}>
        <div className="bg-temple-cream rounded-3xl p-8 w-full max-w-sm text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-temple-brown mb-2">점안 완료!</h2>
          <p className="text-gray-600 text-lg mb-1">{result.name}</p>
          <p className="text-gray-500 text-base mb-1">
            블록 {result.blockCount}개 · 코드: <code className="bg-gray-100 px-1.5 rounded">{result.code}</code>
          </p>
          <p className="text-gray-400 text-sm mb-4">
            테마: {activeTheme.name}
          </p>
          <div className="space-y-3">
            <a
              href={`https://${result.code}.k-buddhism.kr`}
              target="_blank" rel="noopener"
              className="btn-primary"
            >
              🌐 사이트 확인하기
            </a>
            <button onClick={resetForm} className="btn-secondary">
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

  // ── 등록 폼 (단일 스크롤) ──────────────────────────────────────────────────
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

      <div className="flex-1 bg-temple-cream rounded-t-3xl px-5 pt-6 pb-10 space-y-6">
        {error && (
          <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4 text-red-700 text-base">⚠️ {error}</div>
        )}

        {/* 사찰 유형 토글 */}
        <section>
          <h2 className="text-temple-brown font-bold text-lg mb-3">사찰 유형</h2>
          <div className="flex items-center gap-3 mb-3">
            <button onClick={() => setTempleType('offline')} style={{ padding: '10px 20px', borderRadius: 10, fontSize: 14, fontWeight: 700, border: '2px solid', borderColor: templeType === 'offline' ? '#8B5E3C' : '#ddd', background: templeType === 'offline' ? '#8B5E3C' : '#fff', color: templeType === 'offline' ? '#fff' : '#888', cursor: 'pointer' }}>🏛 오프라인 사찰</button>
            <button onClick={() => setTempleType('cyber')} style={{ padding: '10px 20px', borderRadius: 10, fontSize: 14, fontWeight: 700, border: '2px solid', borderColor: templeType === 'cyber' ? '#4338CA' : '#ddd', background: templeType === 'cyber' ? '#4338CA' : '#fff', color: templeType === 'cyber' ? '#fff' : '#888', cursor: 'pointer' }}>💻 사이버 법당</button>
          </div>
          {templeType === 'cyber' && (
            <div className="space-y-3">
              <div>
                <label className="block text-temple-brown font-bold text-base mb-1">카카오 알림 수신 전화번호</label>
                <input type="tel" value={kakaoNotifyTel} onChange={e => setKakaoNotifyTel(e.target.value)} placeholder="010-0000-0000" className="input-field" />
                <p className="text-gray-400 text-sm mt-1">기도/공양 접수 시 카카오톡 알림을 받을 번호</p>
              </div>
              <div>
                <label className="block text-temple-brown font-bold text-base mb-1">은행명 *</label>
                <input type="text" value={bankName} onChange={e => setBankName(e.target.value)} placeholder="예: 시티은행" className="input-field" />
              </div>
              <div>
                <label className="block text-temple-brown font-bold text-base mb-1">계좌번호 *</label>
                <input type="text" value={bankAccount} onChange={e => setBankAccount(e.target.value)} placeholder="예: 261-0359-626501" className="input-field" />
              </div>
              <div>
                <label className="block text-temple-brown font-bold text-base mb-1">예금주 *</label>
                <input type="text" value={bankHolder} onChange={e => setBankHolder(e.target.value)} placeholder="예: 배연암" className="input-field" />
              </div>
            </div>
          )}
        </section>

        {/* ① 기본 정보 ──────────────────────────────────────────────────────── */}
        <section>
          <h2 className="text-temple-brown font-bold text-lg mb-4">① 사찰 기본 정보</h2>
          <div className="space-y-4">
            {[
              { key: 'code',         label: '사찰 코드 *',  placeholder: 'haeinsa',          hint: '영문 소문자만 (URL에 사용)' },
              { key: 'name',         label: '사찰명 *',     placeholder: '해인사' },
              { key: 'nameEn',       label: '영문명',        placeholder: 'Haeinsa Temple' },
              { key: 'description',  label: '사찰 소개',    placeholder: '사찰 설명...', multiline: true },
              { key: 'address',      label: '주소',          placeholder: '경상남도 합천군 가야면...' },
              { key: 'phone',        label: '전화번호',      placeholder: '055-000-0000' },
              { key: 'denomination', label: '종단',          placeholder: '대한불교 조계종' },
              { key: 'abbotName',    label: '주지스님',      placeholder: '현응 스님' },
            ].map(({ key, label, placeholder, hint, multiline }) => (
              <div key={key}>
                <label className="block text-temple-brown font-bold text-base mb-1">{label}</label>
                {multiline ? (
                  <textarea value={form[key as keyof typeof form]} onChange={e => set(key, e.target.value)}
                    placeholder={placeholder} rows={3} className="input-field resize-none" />
                ) : (
                  <input type="text" value={form[key as keyof typeof form]} onChange={e => set(key, e.target.value)}
                    placeholder={placeholder} className="input-field" />
                )}
                {hint && <p className="text-gray-400 text-sm mt-1">{hint}</p>}
              </div>
            ))}

            {/* 등급 */}
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
              {[['primaryColor','메인 컬러'],['secondaryColor','보조 컬러']].map(([k,l]) => (
                <div key={k}>
                  <label className="block text-temple-brown font-bold text-base mb-1">{l}</label>
                  <div className="flex gap-2">
                    <input type="color" value={form[k as keyof typeof form]}
                      onChange={e => set(k, e.target.value)}
                      className="w-14 h-14 rounded-xl border-2 border-gray-200 cursor-pointer" />
                    <input type="text" value={form[k as keyof typeof form]}
                      onChange={e => set(k, e.target.value)}
                      className="input-field text-sm" />
                  </div>
                </div>
              ))}
            </div>

            {/* PIN */}
            <div>
              <label className="block text-temple-brown font-bold text-base mb-1">관리자 PIN (선택)</label>
              <input type="text" inputMode="numeric" maxLength={8} value={form.pin}
                onChange={e => set('pin', e.target.value.replace(/\D/g, '').slice(0, 8))}
                placeholder="4~8자리 숫자 (나중에 설정 가능)"
                className="input-field" />
            </div>
          </div>
        </section>

        {/* ② 블록 그리드 ───────────────────────────────────────────────────── */}
        <section>
          <h2 className="text-temple-brown font-bold text-lg mb-1">② 블록 구성 선택</h2>
          <p className="text-gray-400 text-sm mb-4">사찰 홈페이지에 표시할 섹션을 선택하세요</p>
          <BlockGrid selected={selectedBlocks} onChange={setSelectedBlocks} />
        </section>

        {/* ③ 홈페이지 테마 선택 ─────────────────────────────────────────────── */}
        <section>
          <h2 className="text-temple-brown font-bold text-lg mb-1">③ 홈페이지 테마</h2>
          <p className="text-gray-400 text-sm mb-4">홈페이지 전체 디자인 스타일을 선택하세요</p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {[
              { id: 'borimsa-type',  label: '🌿 보림사형', desc: '크림 아이보리 · 초록 포인트', color: '#2C5F2D', bg: '#F5F0E8' },
              { id: 'seonunsa-type', label: '🌸 선운사형', desc: '따뜻한 분홍 · 자연 테마',      color: '#8B3A3A', bg: '#FFF5F0' },
              { id: 'standard',      label: '⚫ 기본형',   desc: '다크 배경 · 골드 포인트',      color: '#D4AF37', bg: '#0d0a06' },
            ].map(t => {
              const isActive = pageTemplate === t.id
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setPageTemplate(t.id)}
                  style={{
                    flex: '1 1 140px', padding: '14px 12px', borderRadius: 14,
                    border: isActive ? `2.5px solid ${t.color}` : '2px solid #e8dcc8',
                    background: isActive ? t.bg : '#fff',
                    cursor: 'pointer', textAlign: 'left', transition: '.2s',
                    boxShadow: isActive ? `0 0 0 4px ${t.color}20` : 'none',
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: '.88rem', color: isActive ? t.color : '#2C1810', marginBottom: 3 }}>
                    {t.label}
                  </div>
                  <div style={{ fontSize: '.72rem', color: '#9a7a50' }}>{t.desc}</div>
                  {isActive && (
                    <div style={{ marginTop: 6, fontSize: '.68rem', fontWeight: 700, color: t.color }}>● 선택됨</div>
                  )}
                </button>
              )
            })}
          </div>
        </section>

        {/* ④ 컬러 테마 선택 ────────────────────────────────────────────────── */}
        <section>
          <h2 className="text-temple-brown font-bold text-lg mb-1">④ 사찰 컬러 테마</h2>
          <p className="text-gray-400 text-sm mb-4">도량의 분위기에 맞는 테마를 선택하세요</p>

          {/* 컬러 칩 그리드 — PC 5열, 모바일 가로 스와이프 */}
          <div className="grid grid-cols-5 gap-3 sm:grid-cols-5 overflow-x-auto pb-1">
            {TEMPLE_THEMES.map(theme => {
              const isActive = themeColor === theme.id
              return (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => setThemeColor(theme.id)}
                  title={theme.name}
                  className="flex flex-col items-center gap-1.5 group"
                >
                  {/* 원형 컬러 칩 */}
                  <div
                    className="w-12 h-12 rounded-full transition-all duration-200 flex items-center justify-center"
                    style={{
                      background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
                      boxShadow: isActive
                        ? `0 0 0 3px white, 0 0 0 5px ${theme.primary}`
                        : '0 2px 6px rgba(0,0,0,0.15)',
                      transform: isActive ? 'scale(1.15)' : 'scale(1)',
                    }}
                  >
                    {isActive && <span className="text-white text-lg font-bold drop-shadow">✓</span>}
                  </div>
                  {/* 테마명 */}
                  <span
                    className="text-[10px] font-bold text-center leading-tight"
                    style={{ color: isActive ? '#92400E' : '#9CA3AF' }}
                  >
                    {theme.name}
                  </span>
                </button>
              )
            })}
          </div>

          {/* 선택된 테마 상세 정보 */}
          <div
            className="mt-4 rounded-2xl p-4 transition-all duration-300"
            style={{ background: activeTheme.bg, border: `1.5px solid ${activeTheme.primary}40` }}
          >
            <div className="flex items-center gap-3 mb-2">
              {/* 미니 프리뷰 */}
              <div
                className="w-10 h-10 rounded-full flex-shrink-0"
                style={{ background: `linear-gradient(135deg, ${activeTheme.primary}, ${activeTheme.secondary})` }}
              />
              <div>
                <p className="font-bold text-base" style={{ color: activeTheme.primary }}>{activeTheme.name}</p>
                <code className="text-[10px] font-mono" style={{ color: activeTheme.primary + '99' }}>{activeTheme.id}</code>
              </div>
            </div>
            <p className="text-sm mb-3" style={{ color: activeTheme.primary + 'cc' }}>{activeTheme.desc}</p>
            <div className="flex flex-wrap gap-1.5">
              <span className="text-[10px] font-semibold" style={{ color: activeTheme.primary + '80' }}>추천 도량:</span>
              {activeTheme.temples.map(t => (
                <span
                  key={t}
                  className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                  style={{ background: activeTheme.primary + '20', color: activeTheme.primary }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ⑤ JSON 미리보기 (읽기 전용) ────────────────────────────────────── */}
        {selectedBlocks.length > 0 && (
          <section>
            <h2 className="text-temple-brown font-bold text-lg mb-3">⑤ 블록 구성 미리보기</h2>
            <div className="bg-gray-900 rounded-2xl p-4">
              <p className="text-gray-500 text-xs font-mono mb-2">{'// 생성될 블록 (읽기 전용)'}</p>
              <pre className="text-green-400 text-[11px] leading-relaxed overflow-x-auto max-h-40">
                {JSON.stringify(
                  selectedBlocks.map((id, i) => ({
                    blockType: id,
                    label: getBlockName(id),
                    order: i + 1,
                  })),
                  null, 2
                )}
              </pre>
            </div>
          </section>
        )}

        {/* ⑥ 점안 버튼 ─────────────────────────────────────────────────────── */}
        <button
          onClick={submitForm}
          disabled={loading || !form.code || !form.name}
          className="btn-primary text-xl py-5 disabled:opacity-40 w-full"
        >
          {loading ? '⚙️ 등록 중...' : '☸ 이 사찰 점안하기'}
        </button>
      </div>
    </div>
  )
}
