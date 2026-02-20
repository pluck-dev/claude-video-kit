// 연말정산 꿀팁 영상 — 색상 상수
// 스토리보드 overview.md 색상 팔레트 기반

export const Colors = {
  // 주색 — 신뢰/공식 (제목, 강조 박스, 버튼)
  primary: '#2563EB',

  // 보조색 — 환급/이익 (환급 금액, 긍정 수치, 체크 아이콘)
  success: '#10B981',

  // 강조색 — 손해/주의 (경고, 손해 수치, 실수 아이콘)
  danger: '#EF4444',

  // 황금색 — 꿀팁/포인트 (꿀팁 배지, 포인트 텍스트, 별)
  warning: '#F59E0B',

  // 배경 — 다크 네이비
  bgDark: '#0F172A',

  // 서브 배경 — 카드, 박스 배경
  bgCard: '#1E293B',

  // 기본 텍스트
  textLight: '#F8FAFC',

  // 보조 텍스트 — 부제목, 설명
  textMuted: '#94A3B8',

  // 구분선 / 보더
  border: '#334155',

  // 반투명 오버레이
  overlay: 'rgba(15, 23, 42, 0.8)',
} as const;

export type ColorKey = keyof typeof Colors;
