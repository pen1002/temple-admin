import { redirect } from 'next/navigation'

export default function CyberRedirectPage() {
  redirect(`/${process.env.CYBER_DEFAULT_SLUG || 'miraesa'}/cyber`)
}
