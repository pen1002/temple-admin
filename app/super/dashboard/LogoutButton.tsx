'use client'

export default function LogoutButton() {
  const handleLogout = async () => {
    await fetch('/api/super/auth', { method: 'DELETE' })
    window.location.href = '/super/login'
  }

  return (
    <button onClick={handleLogout} className="text-gray-400 text-sm underline">
      로그아웃
    </button>
  )
}
