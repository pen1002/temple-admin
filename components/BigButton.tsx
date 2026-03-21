import Link from 'next/link'

interface BigButtonProps {
  icon: string
  label: string
  description?: string
  color: string
  onClick?: () => void
  href?: string
  disabled?: boolean
}

export default function BigButton({ icon, label, description, color, onClick, href, disabled }: BigButtonProps) {
  const content = (
    <div className={`flex items-center gap-4 p-5 rounded-2xl border-2 min-h-[80px] w-full text-left transition-all active:scale-98 ${disabled ? 'opacity-50' : 'active:opacity-80'}`}
      style={{ borderColor: color, backgroundColor: `${color}15` }}>
      <span className="text-4xl flex-shrink-0">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-xl text-temple-brown leading-tight">{label}</p>
        {description && <p className="text-gray-500 text-base mt-0.5">{description}</p>}
      </div>
      <span className="text-2xl text-gray-400 flex-shrink-0">›</span>
    </div>
  )

  if (href && !disabled) {
    return <Link href={href} className="block">{content}</Link>
  }
  return <button onClick={onClick} disabled={disabled} className="block w-full">{content}</button>
}
