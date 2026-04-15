'use client'
import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
export default function MembersRedirect() {
  const { slug } = useParams<{ slug: string }>()
  const router = useRouter()
  useEffect(() => { router.replace(`/${slug}/cyber/jongmuso?tab=members`) }, [slug, router])
  return null
}
