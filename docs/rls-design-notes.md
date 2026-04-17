# RLS Design Notes

## Phase 1 검토 대기 항목 (Week 3~4에 진행)
- [ ] Temple 테이블 footerPolicy 필드 추가
- [ ] shouldHideFooter 함수 DB 기반 전환 (오늘 발견한 기술부채)
- [ ] consent 필드 DB 스키마 설계
- [ ] 연간 공급대가 모니터링 필드 (간이과세자 지위 확인용)

## 참고
- 컴플라이언스 핫픽스 v2는 main에 이미 병합됨 (무관)
- 실제 RLS 정책은 Phase 1 세부 지시서 발령 후 작성
- 통신판매업 면제 상태는 간이과세자 지위 유지 전제

## 커밋 이력
- 2026-04-17: 껍데기 생성 (Phase 0+ 완료)
