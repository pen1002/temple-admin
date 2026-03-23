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
  const cameraRef = useRef<HTMLInputElement>(null)
  const galleryRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const resizeImage = (f: File, maxPx = 1200, quality = 0.8): Promise<File> =>
    new Promise((resolve) => {
      const img = new Image()
      const url = URL.createObjectURL(f)
      img.onload = () => {
        URL.revokeObjectURL(url)
        let { width: w, height: h } = img
        if (w > maxPx || h > maxPx) {
          if (w > h) { h = Math.round(h * maxPx / w); w = maxPx }
          else { w = Math.round(w * maxPx / h); h = maxPx }
        }
        const canvas = document.createElement('canvas')
        canvas.width = w; canvas.height = h
        canvas.getContext('2d')!.drawImage(img, 0, 0, w, h)
        canvas.toBlob(
          blob => resolve(new File([blob!], f.name.replace(/\.[^.]+$/, '.jpg'), { type: 'image/jpeg' })),
          'image/jpeg', quality
        )
      }
      img.src = url
    })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    if (f.size > 30 * 1024 * 1024) { setError('사진 크기가 30MB를 초과합니다.'); return }
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
      setProgress(20)
      const resized = await resizeImage(file, 1200, 0.8)
      const formData = new FormData()
      formData.append('file', resized)
      formData.append('slug', slug)
      formData.append('location', location)
      formData.append('caption', caption)

      setProgress(40)
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

        {/* 미리보기 */}
        {preview ? (
          <div className="rounded-2xl overflow-hidden border-2 border-temple-gold">
            <img src={preview} alt="미리보기" className="w-full object-contain" style={{ maxHeight: '300px', background: '#f5f5f5' }} />
          </div>
        ) : (
          <div className="border-3 rounded-2xl p-6 text-center" style={{ borderWidth: '2px', borderStyle: 'dashed', borderColor: '#D4AF37' }}>
            <p className="text-5xl mb-2">📸</p>
            <p className="text-lg font-bold text-temple-brown">아래 버튼으로 사진을 선택하세요</p>
          </div>
        )}

        {/* 카메라 / 갤러리 버튼 */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => cameraRef.current?.click()}
            className="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-temple-gold bg-temple-gold text-temple-brown font-bold min-h-[72px] text-lg active:opacity-80 transition-opacity"
          >
            <span className="text-3xl">📷</span>
            카메라 촬영
          </button>
          <button
            type="button"
            onClick={() => galleryRef.current?.click()}
            className="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-temple-gold bg-white text-temple-brown font-bold min-h-[72px] text-lg active:opacity-80 transition-opacity"
          >
            <span className="text-3xl">🖼️</span>
            갤러리 선택
          </button>
        </div>

        {/* 숨겨진 input - 카메라 */}
        <input
          ref={cameraRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          className="hidden"
        />
        {/* 숨겨진 input - 갤러리 */}
        <input
          ref={galleryRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

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
