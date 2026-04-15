export const TEMPLE_OFFERINGS: Record<string, {
  templeLabel: string
  bank: { name: string; account: string; holder: string }
  offerings: { type: string; label: string; price: number; period: string; unit: string; icon: string }[]
}> = {
  miraesa: {
    templeLabel: '미래사',
    bank: { name: '한국씨티은행', account: '261-0359-626501', holder: '배연암' },
    offerings: [
      { type: 'yeondeung', label: '초파일 가족등', price: 100000, period: '1년', unit: '가족', icon: '🏮' },
      { type: 'indung', label: '인등', price: 10000, period: '1년', unit: '인', icon: '🕯️' },
      { type: 'avalokiteshvara', label: '원불모시기', price: 100000, period: '평생', unit: '위', icon: '🪷' },
    ],
  },
  iloam: {
    templeLabel: '일오암',
    bank: { name: '농협', account: '302-5217-2878-41', holder: '이남재' },
    offerings: [
      { type: 'yeondeung', label: '초파일 가족등', price: 100000, period: '1년', unit: '가족', icon: '🏮' },
      { type: 'indung', label: '인등', price: 10000, period: '1년', unit: '인', icon: '🕯️' },
      { type: 'avalokiteshvara', label: '원불모시기', price: 100000, period: '평생', unit: '위', icon: '🪷' },
    ],
  },
}
