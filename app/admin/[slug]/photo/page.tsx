'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import AdminLayout from '@/components/AdminLayout'

export default function PhotoPage({ params }: { params: { slug: string } }) {
  const { slug } = params
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string>('')
  const [location, setLocation] = useState('gallery')
  const [caption, setCaption] = useState('')
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    if (f.size > 10 * 1024 * 1024) { setError('사진 크기가 10MB를 초과합니다.'); return }
    setFile(f)
    setError('')
    const reader = new FileReader()
    reader.onload = ev => setPreview(ev.target?.result as string)
    reader.readAsDataURL(f)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) { setError('사진을 선택해주세요.'); return }
    setUploading(true)
    setProgress(10)
    setError('')
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('slug', slug)
      formData.append('location', location)
      formData.append('caption', caption)

      setProgress(30)
      const res = await fetch('/api/admin/photo', { method: 'POST', body: formData })
      setProgress(90)
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || '업로드 실패') }
      setProgress(100)
      router.push(`/admin/${slug}/done?type=photo`)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '업로드 중 오류가 발생했습니다.'
      setError(message)
      setUploading(false)
      setProgress(0)
    }
  }

  if (uploading) {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center px-6">
        <div className="text-center w-full max-w-sm">
          <div className="text-6xl mb-4 animate-pulse">📷</div>
          <p className="text-xl text-temple-brown mb-4">사진을 올리는 중...</p>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="h-4 rounded-full transition-all duration-300"
              style={{ width: `${progress}%`, backgroundColor: '#D4AF37' }}
            />
          </div>
          <p className="text-gray-500 text-base mt-2">{progress}%</p>
        </div>
      </div>
    )
  }

  return (
    <AdminLayout slug={slug} templeName="" title="사진 올리기">
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4 text-red-700 text-lg">⚠️ {error}</div>}

        {/* Photo selector */}
        <div
          onClick={() => fileRef.current?.click()}
          className="border-3 border-dashed border-temple-gold rounded-2xl flex flex-col items-center justify-center cursor-pointer active:opacity-70 transition-opacity overflow-hidden"
          style={{ minHeight: '200px', borderWidth: '3px', borderStyle: 'dashed' }}
        >
          {preview ? (
            <img src={preview} alt="미리보기" className="w-full h-56 object-cover rounded-2xl" />
          ) : (
            <div className="text-center py-10 px-4">
              <p className="text-6xl mb-3">📸</p>
              <p className="text-xl font-bold text-temple-brown">사진 선택하기</p>
              <p className="text-gray-500 text-base mt-1">탭하면 카메라 또는 갤러리에서<br/>선택할 수 있습니다</p>
            </div>
          )}
        </div>

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          className="hidden"
        />

        {file && (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="w-full text-center text-temple-gold text-lg underline"
          >
            다른 사진 선택하기
          </button>
        )}

        <div>
          <label className="block font-bold text-lg text-temple-brown mb-2">올릴 위치</label>
          <select value={location} onChange={e => setLocation(e.target.value)} className="input-field appearance-none bg-white">
            <option value="gallery">갤러리</option>
            <option value="today">오늘의 경내</option>
            <option value="event">행사 스케치</option>
          </select>
        </div>

        <div>
          <label className="block font-bold text-lg text-temple-brown mb-2">설명 (선택)</label>
          <input
            type="text"
            value={caption}
            onChange={e => setCaption(e.target.value)}
            placeholder="예: 대웅전 앞 배롱나무 꽃이 피었습니다"
            className="input-field"
            maxLength={100}
          />
        </div>

        <button type="submit" disabled={!file} className="btn-primary text-xl py-5 disabled:opacity-50">
          📷 홈페이지에 올리기
        </button>
        <button type="button" onClick={() => router.back()} className="btn-secondary">취소</button>
      </form>
    </AdminLayout>
  )
}
