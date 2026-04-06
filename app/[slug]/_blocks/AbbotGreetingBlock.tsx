// SEC06-01: 주지스님 인사말 (소개 + 사진 + 사찰 정보)
import type { TempleData } from './types'

interface InfoItem {
  label: string
  value: string
}

interface Props {
  temple: TempleData
  config: Record<string, unknown>
}

export default function AbbotGreetingBlock({ temple, config }: Props) {
  const abbotName = (config.abbotName as string) ?? temple.abbotName ?? '정응 스님'
  const imageUrl = (config.imageUrl as string) ??
    'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Borimsa_Daeungjeon_11-05025.JPG/800px-Borimsa_Daeungjeon_11-05025.JPG'

  const paragraphs: string[] = Array.isArray(config.aboutExtra)
    ? (config.aboutExtra as string[])
    : [
        '불자님, 안녕하십니까.',
        '천년고찰 보림사에 오신 것을 진심으로 환영합니다.',
        '보림사는 신라 헌안왕 2년(858년) 보조선사 체징 스님께서 창건하신 천년의 도량입니다. 구산선문 가지산문의 중심 사찰로서 우리나라 선종의 뿌리가 되는 성지입니다. 도량 안에는 국보 제44호 철조비로자나불좌상, 국보 제117호 동·서 삼층석탑, 보물 제224호 보조선사창성탑 등 찬란한 문화유산이 살아 숨쉬고 있습니다.',
        '이곳 보림사는 단순한 관람의 공간이 아닙니다. 부처님의 지혜와 자비가 면면히 흐르는 기도와 수행의 도량입니다. 어떤 무게를 안고 오시더라도 이 천년의 고요 속에서 잠시 내려놓고 쉬어가시길 바랍니다.',
      ]

  const infoItems: InfoItem[] = Array.isArray(config.aboutInfoExtra)
    ? (config.aboutInfoExtra as [string, string][]).map(([label, value]) => ({ label, value }))
    : [
        { label: '종단', value: '대한불교 조계종' },
        { label: '창건', value: temple.foundedYear ? `${temple.foundedYear}년` : '858년(신라 헌안왕 2년)' },
        { label: '주지', value: abbotName },
        { label: '소재지', value: temple.address ?? '전라남도 장흥군 유치면 가지산로 770' },
      ]

  return (
    <section id="intro" className="bt-section">
      <div className="bt-section-inner">
        <span className="bt-section-label">About Temple</span>
        <h2 className="bt-section-title">가지산 품 안에서 천년을 이어온 선종의 성지</h2>

        <div className="bt-about-layout">
          {/* 텍스트 */}
          <div className="bt-about-text">
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}

            <blockquote>
              나무 비로자나불.
              <cite>— 주지 {abbotName}</cite>
            </blockquote>

            <dl className="bt-about-info">
              {infoItems.filter(i => i.value).map(({ label, value }) => (
                <div key={label} className="bt-about-info-item">
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* 이미지 */}
          <div className="bt-about-images">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imageUrl} alt={`${temple.name} 전경`} />
          </div>
        </div>
      </div>
    </section>
  )
}
