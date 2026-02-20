// 연말정산 꿀팁 영상 — 숫자 카운트업 애니메이션 컴포넌트
// CSS animation/transition 절대 금지 — useCurrentFrame() + interpolate() 사용

import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { Colors } from './Colors';

interface CountUpProps {
  // 숫자 범위
  from?: number;
  to: number;

  // 표시 형식
  prefix?: string;  // 앞에 붙는 텍스트 (예: '약 ')
  suffix?: string;  // 뒤에 붙는 텍스트 (예: '만 원', '%')
  decimals?: number; // 소수점 자리수 (기본 0)
  useComma?: boolean; // 천 단위 쉼표 (기본 true)

  // 애니메이션 타이밍
  startFrame?: number;   // 카운트 시작 프레임
  durationFrames?: number; // 카운트 지속 프레임

  // 스타일
  fontSize?: number;
  fontWeight?: number;
  color?: string;
  style?: React.CSSProperties;
}

export const CountUp: React.FC<CountUpProps> = ({
  from = 0,
  to,
  prefix = '',
  suffix = '',
  decimals = 0,
  useComma = true,
  startFrame = 0,
  durationFrames = 60,
  fontSize = 72,
  fontWeight = 800,
  color = Colors.success,
  style,
}) => {
  const frame = useCurrentFrame();

  // interpolate로 현재 프레임의 값 계산
  const currentValue = interpolate(
    frame,
    [startFrame, startFrame + durationFrames],
    [from, to],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // 표시 숫자 포맷
  const displayValue = decimals > 0
    ? currentValue.toFixed(decimals)
    : Math.floor(currentValue).toString();

  // 천 단위 쉼표 적용
  const formattedValue = useComma
    ? Number(displayValue).toLocaleString('ko-KR')
    : displayValue;

  return (
    <span
      style={{
        fontFamily:
          "'Pretendard Variable', Pretendard, -apple-system, sans-serif",
        fontSize,
        fontWeight,
        color,
        letterSpacing: '-0.02em',
        lineHeight: 1.1,
        ...style,
      }}
    >
      {prefix}{formattedValue}{suffix}
    </span>
  );
};
