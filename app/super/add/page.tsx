import { redirect } from 'next/navigation'
import { getSuperSession } from '@/lib/superAuth'
import AddTempleForm from './AddTempleForm'

export default async function SuperAddPage() {
  const ok = await getSuperSession()
  if (!ok) redirect('/super/login')
  return <AddTempleForm />
}
