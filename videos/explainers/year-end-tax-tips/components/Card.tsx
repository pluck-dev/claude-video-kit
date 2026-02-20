// 연말정산 꿀팁 영상 — 정보 카드 컴포넌트
// CSS animation/transition 절대 금지 — interpolate() 사용

import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { Colors } from './Colors';

interface CardProps {
  // 카드 내용
  title?: string;
  children?: React.ReactNode;
  icon?: string; // 이모지 아이콘 (예: '✅', '⚠️')

  // 스타일 커스터마이즈
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  width?: number | string;
  minHeight?: number;
  padding?: number;

  // 애니메이션
  slideInStart?: number; // slideIn 시작 프레임
  slideInDuration?: number; // slideIn 지속 프레임
  slideFrom?: 'bottom' | 'left' | 'right' | 'top'; // 슬라이드 방향

  style?: React.CSSProperties;
  titleStyle?: React.CSSProperties;
}

export const Card: React.FC<CardProps> = ({
  title,
  children,
  icon,
  backgroundColor = Colors.bgCard,
  borderColor,
  borderWidth = 0,
  width = '100%',
  minHeight,
  padding = 32,
  slideInStart = 0,
  slideInDuration = 20,
  slideFrom = 'bottom',
  style,
  titleStyle,
}) => {
  const frame = useCurrentFrame();

  // opacity 애니메이션
  const opacity = interpolate(
    frame,
    [slideInStart, slideInStart + slideInDuration],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // 슬라이드 방향별 transform 계산
  const slideAmount = 40; // px 단위
  let translateX = 0;
  let translateY = 0;

  if (slideFrom === 'bottom') {
    translateY = interpolate(
      frame,
      [slideInStart, slideInStart + slideInDuration],
      [slideAmount, 0],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );
  } else if (slideFrom === 'left') {
    translateX = interpolate(
      frame,
      [slideInStart, slideInStart + slideInDuration],
      [-slideAmount, 0],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );
  } else if (slideFrom === 'right') {
    translateX = interpolate(
      frame,
      [slideInStart, slideInStart + slideInDuration],
      [slideAmount, 0],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );
  } else if (slideFrom === 'top') {
    translateY = interpolate(
      frame,
      [slideInStart, slideInStart + slideInDuration],
      [-slideAmount, 0],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );
  }

  return (
    <div
      style={{
        backgroundColor,
        borderRadius: 16,
        padding,
        width,
        minHeight,
        border: borderColor ? `${borderWidth}px solid ${borderColor}` : undefined,
        opacity,
        transform: `translateX(${translateX}px) translateY(${translateY}px)`,
        boxSizing: 'border-box',
        ...style,
      }}
    >
      {/* 아이콘 + 제목 영역 */}
      {(icon || title) && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            marginBottom: children ? 16 : 0,
          }}
        >
          {icon && (
            <span style={{ fontSize: 28, lineHeight: 1 }}>{icon}</span>
          )}
          {title && (
            <div
              style={{
                fontFamily:
                  "'Pretendard Variable', Pretendard, -apple-system, sans-serif",
                fontSize: 28,
                fontWeight: 700,
                color: Colors.textLight,
                lineHeight: 1.3,
                ...titleStyle,
              }}
            >
              {title}
            </div>
          )}
        </div>
      )}

      {/* 카드 내용 */}
      {children}
    </div>
  );
};
