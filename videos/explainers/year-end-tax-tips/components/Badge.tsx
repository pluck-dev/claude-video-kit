// 연말정산 꿀팁 영상 — 배지 컴포넌트
// CSS animation/transition 절대 금지 — spring() + interpolate() 사용

import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { Colors } from './Colors';

type BadgeVariant = 'new' | 'warning' | 'success' | 'danger' | 'tip' | 'custom';

interface BadgeProps {
  // 텍스트
  text: string;

  // 스타일 변형
  variant?: BadgeVariant;

  // 커스텀 색상 (variant='custom' 시 사용)
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;

  // 크기
  fontSize?: number;
  paddingH?: number;
  paddingV?: number;
  borderRadius?: number;

  // 애니메이션
  popInStart?: number; // spring pop-in 시작 프레임
  style?: React.CSSProperties;
}

// variant별 기본 색상 매핑
const VARIANT_STYLES: Record<BadgeVariant, { bg: string; text: string; border?: string }> = {
  new: {
    bg: Colors.primary,
    text: Colors.textLight,
  },
  warning: {
    bg: Colors.warning,
    text: '#1A0A00',
  },
  success: {
    bg: Colors.success,
    text: Colors.bgDark,
  },
  danger: {
    bg: Colors.danger,
    text: Colors.textLight,
  },
  tip: {
    bg: Colors.warning,
    text: '#1A0A00',
  },
  custom: {
    bg: Colors.bgCard,
    text: Colors.textLight,
  },
};

export const Badge: React.FC<BadgeProps> = ({
  text,
  variant = 'new',
  backgroundColor,
  textColor,
  borderColor,
  fontSize = 16,
  paddingH = 14,
  paddingV = 6,
  borderRadius = 8,
  popInStart = 0,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // spring pop-in 애니메이션
  const scale = spring({
    frame: frame - popInStart,
    fps,
    from: 0,
    to: 1,
    config: {
      damping: 10,
      stiffness: 300,
      mass: 0.8,
    },
  });

  const variantStyle = VARIANT_STYLES[variant];
  const bg = backgroundColor ?? variantStyle.bg;
  const color = textColor ?? variantStyle.text;
  const border = borderColor ?? variantStyle.border;

  return (
    <span
      style={{
        display: 'inline-block',
        backgroundColor: bg,
        color,
        fontFamily: "'Pretendard Variable', Pretendard, -apple-system, sans-serif",
        fontSize,
        fontWeight: 700,
        paddingLeft: paddingH,
        paddingRight: paddingH,
        paddingTop: paddingV,
        paddingBottom: paddingV,
        borderRadius,
        border: border ? `2px solid ${border}` : undefined,
        transform: `scale(${scale})`,
        transformOrigin: 'center center',
        letterSpacing: '0.03em',
        ...style,
      }}
    >
      {text}
    </span>
  );
};
