export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./sentry.server.config')
  }
  // edge runtime: Sentry 비활성화 (번들 크기 제한)
}
