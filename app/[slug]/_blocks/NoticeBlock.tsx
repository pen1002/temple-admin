// I-01: 공지사항
import type { TemplateContent, TempleData } from './types'

interface Props {
  content: TemplateContent
  temple: TempleData
}

export default function NoticeBlock({ content, temple }: Props) {
  const { notices } = content

  return (
    <section
      id="notice"
      className="px-5 py-12"
      style={{ background: '#1a1008' }}
    >
      <div className="max-w-xl mx-auto">
        {/* 섹션 헤더 */}
        <div className="flex items-center gap-2 mb-6">
          <span className="text-2xl">📢</span>
          <h2 className="font-bold text-xl" style={{ color: '#FFFAF0' }}>공지사항</h2>
          <div className="flex-1 h-px ml-2" style={{ background: '#D4AF37', opacity: 0.3 }} />
        </div>

        {notices.length === 0 ? (
          <p className="text-center py-8 text-base" style={{ color: '#6b5a40' }}>
            등록된 공지사항이 없습니다.
          </p>
        ) : (
          <div className="space-y-3">
            {notices.map((notice, i) => (
              <div
                key={notice.id}
                className="rounded-2xl p-5 flex gap-4 items-start"
                style={{
                  background: '#261a0e',
                  border: `1px solid ${i === 0 ? temple.primaryColor + '60' : '#3a2a18'}`,
                }}
              >
                {/* 번호 뱃지 */}
                <div
                  className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mt-0.5"
                  style={{
                    background: i === 0 ? temple.primaryColor : '#3a2a18',
                    color: i === 0 ? '#FFFAF0' : '#8B6914',
                  }}
                >
                  {i + 1}
                </div>

                <div className="flex-1 min-w-0">
                  <p
                    className="font-semibold text-base leading-snug mb-1"
                    style={{ color: '#FFFAF0', wordBreak: 'keep-all' }}
                  >
                    {notice.title}
                  </p>
                  {notice.content && (
                    <p className="text-sm leading-relaxed line-clamp-2" style={{ color: '#9a8060' }}>
                      {notice.content}
                    </p>
                  )}
                  <p className="text-xs mt-2" style={{ color: '#6b5a40' }}>
                    {new Date(notice.createdAt).toLocaleDateString('ko-KR')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
