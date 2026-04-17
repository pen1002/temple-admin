// 미래사 전용 특수 로직
// 다른 사찰에는 적용되지 않는 미래사 고유 동작을 이 파일에 집중 관리한다.

const CYBER_SLUG = process.env.CYBER_DEFAULT_SLUG || ''

/**
 * 사이버사찰(미래사)은 자체 레이아웃을 사용하므로 공통 FooterBlock을 숨긴다.
 * 실제로 temple_type === 'cyber' 인 경우 page.tsx에서 조기 반환하므로
 * 이 조건은 안전망 역할만 한다.
 */
export function shouldHideFooter(templeCode: string): boolean {
  return templeCode === CYBER_SLUG
}
