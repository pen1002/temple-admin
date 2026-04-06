import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const { slug } = await request.json()
  revalidatePath(`/${slug}`)
  return NextResponse.json({ revalidated: true, slug })
}
