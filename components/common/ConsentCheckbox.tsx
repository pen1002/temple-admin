'use client'

interface ConsentCheckboxProps {
  id: string
  required: boolean
  label: React.ReactNode
  linkHref?: string
  linkLabel?: string
  checked: boolean
  onChange: (checked: boolean) => void
  note?: string
}

export default function ConsentCheckbox({ id, required, label, linkHref, linkLabel, checked, onChange, note }: ConsentCheckboxProps) {
  return (
    <div style={{ marginBottom: 6 }}>
      <label htmlFor={id} style={{ display: 'flex', alignItems: 'flex-start', gap: 6, fontSize: 11, cursor: 'pointer', lineHeight: 1.5 }}>
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={e => onChange(e.target.checked)}
          style={{ marginTop: 2, flexShrink: 0 }}
        />
        <span>
          {label}
          {required && <span style={{ color: '#ef4444', marginLeft: 2 }}>*</span>}
          {linkHref && (
            <a href={linkHref} target="_blank" rel="noopener noreferrer" style={{ color: '#2563EB', marginLeft: 4, textDecoration: 'underline', fontSize: 10 }}>
              {linkLabel || '[약관 보기]'}
            </a>
          )}
        </span>
      </label>
      {note && <div style={{ fontSize: 10, color: '#888', marginLeft: 22, marginTop: 2, lineHeight: 1.4 }}>{note}</div>}
    </div>
  )
}
