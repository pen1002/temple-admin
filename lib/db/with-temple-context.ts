import { prisma } from '@/lib/prisma'
import type { PrismaClient } from '@prisma/client'
import { EXCLUDED_SLUGS } from '@/lib/constants/excluded-slugs'

// Prisma interactive transaction client 타입
type TxClient = Omit<
  PrismaClient,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
>

/**
 * 사찰 컨텍스트를 설정하고 RLS가 적용된 트랜잭션 내에서 쿼리 실행.
 *
 * - set_config 3번째 인자 true = 트랜잭션 로컬 (종료 시 자동 해제)
 * - PgBouncer Transaction Mode와 완벽 호환
 * - super admin은 이 함수를 사용하지 않음 (prisma 직접 사용 → BYPASSRLS)
 *
 * @param templeSlug - 사찰 코드 (예: 'miraesa')
 * @param callback - 트랜잭션 클라이언트로 실행할 쿼리
 * @returns 콜백의 반환값
 *
 * @example
 * const believers = await withTempleContext('miraesa', async (tx) => {
 *   return tx.believer.findMany()  // RLS가 자동으로 필터링
 * })
 */
export async function withTempleContext<T>(
  templeSlug: string,
  callback: (tx: TxClient) => Promise<T>
): Promise<T> {
  // 입력 검증
  if (!templeSlug || typeof templeSlug !== 'string') {
    throw new Error('[withTempleContext] templeSlug is required')
  }

  // EXCLUDED_SLUGS 경고 (Phase 1: 경고만, Phase 2: 차단 검토)
  if ((EXCLUDED_SLUGS as readonly string[]).includes(templeSlug)) {
    console.warn(`[withTempleContext] ⚠️ EXCLUDED_SLUG access: ${templeSlug}`)
  }

  return prisma.$transaction(async (tx) => {
    // Prisma 태그드 템플릿으로 SQL injection 방지
    await tx.$executeRaw`
      SELECT set_config('app.current_temple_slug', ${templeSlug}, true)
    `
    return callback(tx as unknown as TxClient)
  })
}
