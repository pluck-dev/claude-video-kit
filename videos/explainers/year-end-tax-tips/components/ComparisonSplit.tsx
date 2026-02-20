// 연말정산 꿀팁 영상 — 2분할 비교 레이아웃 컴포넌트
// CSS animation/transition 절대 금지 — useCurrentFrame() + interpolate() 사용

import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { Colors } from './Colors';

interface ComparisonSideProps {
  label: string;
  value?: React.ReactNode;
  sublabel?: string;
  backgroundColor: string;
  accentColor: string;
  icon?: string;
  children?: React.ReactNode;
  slideFrom: 'left' | 'right';
  slideStart?: number;
  slideDuration?: number;
}

const ComparisonSide: React.FC<ComparisonSideProps> = ({
  label,
  value,
  sublabel,
  backgroundColor,
  accentColor,
  icon,
  children,
  slideFrom,
  slideStart = 0,
  slideDuration = 25,
}) => {
  const frame = useCurrentFrame();

  const opacity = interpolate(
    frame,
    [slideStart, slideStart + slideDuration],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const translateX = interpolate(
    frame,
    [slideStart, slideStart + slideDuration],
    [slideFrom === 'left' ? -80 : 80, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <div
      style={{
        flex: 1,
        backgroundColor,
        borderRadius: 20,
        padding: 48,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        opacity,
        transform: `translateX(${translateX}px)`,
        border: `3px solid ${accentColor}`,
      }}
    >
      {icon && (
        <div style={{ fontSize: 48 }}>{icon}</div>
      )}

      {/* 레이블 */}
      <div
        style={{
          fontFamily: "'Pretendard Variable', Pretendard, -apple-system, sans-serif",
          fontSize: 28,
          fontWeight: 700,
          color: Colors.textMuted,
          textAlign: 'center',
        }}
      >
        {label}
      </div>

      {/* 값 */}
      {value && (
        <div
          style={{
            fontFamily: "'Pretendard Variable', Pretendard, -apple-system, sans-serif",
            fontSize: 80,
            fontWeight: 800,
            color: accentColor,
            textAlign: 'center',
            lineHeight: 1,
            letterSpacing: '-0.02em',
          }}
        >
          {value}
        </div>
      )}

      {/* 서브레이블 */}
      {sublabel && (
        <div
          style={{
            fontFamily: "'Pretendard Variable', Pretendard, -apple-system, sans-serif",
            fontSize: 22,
            fontWeight: 500,
            color: Colors.textMuted,
            textAlign: 'center',
          }}
        >
          {sublabel}
        </div>
      )}

      {/* 추가 컨텐츠 */}
      {children}
    </div>
  );
};

interface ComparisonSplitProps {
  // 왼쪽 패널
  leftLabel: string;
  leftValue?: React.ReactNode;
  leftSublabel?: string;
  leftIcon?: string;
  leftChildren?: React.ReactNode;
  leftColor?: string; // 배경색
  leftAccent?: string; // 강조색

  // 오른쪽 패널
  rightLabel: string;
  rightValue?: React.ReactNode;
  rightSublabel?: string;
  rightIcon?: string;
  rightChildren?: React.ReactNode;
  rightColor?: string;
  rightAccent?: string;

  // 가운데 구분 텍스트
  dividerText?: string;

  // 애니메이션
  slideStart?: number;
  slideDuration?: number;

  gap?: number;
  style?: React.CSSProperties;
}

export const ComparisonSplit: React.FC<ComparisonSplitProps> = ({
  leftLabel,
  leftValue,
  leftSublabel,
  leftIcon,
  leftChildren,
  leftColor = 'rgba(239, 68, 68, 0.15)',
  leftAccent = Colors.danger,
  rightLabel,
  rightValue,
  rightSublabel,
  rightIcon,
  rightChildren,
  rightColor = 'rgba(16, 185, 129, 0.15)',
  rightAccent = Colors.success,
  dividerText = 'vs',
  slideStart = 0,
  slideDuration = 25,
  gap = 32,
  style,
}) => {
  const frame = useCurrentFrame();

  // 가운데 구분자 fadeIn
  const dividerOpacity = interpolate(
    frame,
    [slideStart + slideDuration, slideStart + slideDuration + 15],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'stretch',
        gap,
        ...style,
      }}
    >
      {/* 왼쪽 패널 */}
      <ComparisonSide
        label={leftLabel}
        value={leftValue}
        sublabel={leftSublabel}
        icon={leftIcon}
        backgroundColor={leftColor}
        accentColor={leftAccent}
        slideFrom="left"
        slideStart={slideStart}
        slideDuration={slideDuration}
      >
        {leftChildren}
      </ComparisonSide>

      {/* 가운데 구분자 */}
      {dividerText && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: dividerOpacity,
            flexShrink: 0,
          }}
        >
          <div
            style={{
              fontFamily: "'Pretendard Variable', Pretendard, -apple-system, sans-serif",
              fontSize: 36,
              fontWeight: 700,
              color: Colors.textMuted,
              padding: '0 8px',
            }}
          >
            {dividerText}
          </div>
        </div>
      )}

      {/* 오른쪽 패널 */}
      <ComparisonSide
        label={rightLabel}
        value={rightValue}
        sublabel={rightSublabel}
        icon={rightIcon}
        backgroundColor={rightColor}
        accentColor={rightAccent}
        slideFrom="right"
        slideStart={slideStart}
        slideDuration={slideDuration}
      >
        {rightChildren}
      </ComparisonSide>
    </div>
  );
};
