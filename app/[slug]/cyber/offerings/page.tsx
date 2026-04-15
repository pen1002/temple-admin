'use client'
import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
export default function OfferingsRedirect() {
  const { slug } = useParams<{ slug: string }>()
  const router = useRouter()
  useEffect(() => { router.replace(`/${slug}/cyber/jungmuso?tab=offerings`) }, [slug, router])
  return null
}
