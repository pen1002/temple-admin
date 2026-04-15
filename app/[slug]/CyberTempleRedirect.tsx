'use client'
import dynamic from 'next/dynamic'

const DharmaWheelPage = dynamic(() => import('./dharma-wheel/page'), {
  ssr: false,
  loading: () => <div style={{ minHeight: '100vh', background: '#FFFEF5' }} />,
})

export default function CyberTempleRedirect() {
  return <DharmaWheelPage />
}
