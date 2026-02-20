// 연말정산 꿀팁 영상 — 타이포그래피 컴포넌트
// CSS animation/transition 절대 금지 — useCurrentFrame() + interpolate()/spring() 사용

import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { Colors } from './Colors';

// 공통 타이포그래피 스타일 설정
const BASE_FONT_FAMILY =
  "'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont, 'Noto Sans KR', sans-serif";

// --- Title 컴포넌트 ---
// 대제목: 56px Bold (700)
interface TitleProps {
  children: React.ReactNode;
  color?: string;
  textAlign?: React.CSSProperties['textAlign'];
  fadeInStart?: number; // fadeIn 시작 프레임 (기본 0)
  fadeInDuration?: number; // fadeIn 지속 프레임 (기본 20)
  style?: React.CSSProperties;
}

export const Title: React.FC<TitleProps> = ({
  children,
  color = Colors.textLight,
  textAlign = 'left',
  fadeInStart = 0,
  fadeInDuration = 20,
  style,
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(
    frame,
    [fadeInStart, fadeInStart + fadeInDuration],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <div
      style={{
        fontFamily: BASE_FONT_FAMILY,
        fontSize: 56,
        fontWeight: 700,
        color,
        textAlign,
        lineHeight: 1.3,
        opacity,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// --- Subtitle 컴포넌트 ---
// 소제목: 36px SemiBold (600)
interface SubtitleProps {
  children: React.ReactNode;
  color?: string;
  textAlign?: React.CSSProperties['textAlign'];
  fadeInStart?: number;
  fadeInDuration?: number;
  style?: React.CSSProperties;
}

export const Subtitle: React.FC<SubtitleProps> = ({
  children,
  color = Colors.textMuted,
  textAlign = 'left',
  fadeInStart = 0,
  fadeInDuration = 20,
  style,
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(
    frame,
    [fadeInStart, fadeInStart + fadeInDuration],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <div
      style={{
        fontFamily: BASE_FONT_FAMILY,
        fontSize: 36,
        fontWeight: 600,
        color,
        textAlign,
        lineHeight: 1.4,
        opacity,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// --- Body 컴포넌트 ---
// 본문: 24px Medium (500)
interface BodyProps {
  children: React.ReactNode;
  color?: string;
  textAlign?: React.CSSProperties['textAlign'];
  fadeInStart?: number;
  fadeInDuration?: number;
  style?: React.CSSProperties;
}

export const Body: React.FC<BodyProps> = ({
  children,
  color = Colors.textLight,
  textAlign = 'left',
  fadeInStart = 0,
  fadeInDuration = 20,
  style,
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(
    frame,
    [fadeInStart, fadeInStart + fadeInDuration],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <div
      style={{
        fontFamily: BASE_FONT_FAMILY,
        fontSize: 24,
        fontWeight: 500,
        color,
        textAlign,
        lineHeight: 1.6,
        opacity,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// --- Caption 컴포넌트 ---
// 자막: 20px Regular (400) — 하단 고정 용도
interface CaptionProps {
  children: React.ReactNode;
  color?: string;
  style?: React.CSSProperties;
}

export const Caption: React.FC<CaptionProps> = ({
  children,
  color = Colors.textLight,
  style,
}) => {
  return (
    <div
      style={{
        fontFamily: BASE_FONT_FAMILY,
        fontSize: 20,
        fontWeight: 400,
        color,
        lineHeight: 1.5,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// --- NumberHighlight 컴포넌트 ---
// 숫자 강조: 72px ExtraBold (800) — 임팩트 수치 표시용
interface NumberHighlightProps {
  children: React.ReactNode;
  color?: string;
  textAlign?: React.CSSProperties['textAlign'];
  fadeInStart?: number;
  fadeInDuration?: number;
  style?: React.CSSProperties;
}

export const NumberHighlight: React.FC<NumberHighlightProps> = ({
  children,
  color = Colors.success,
  textAlign = 'center',
  fadeInStart = 0,
  fadeInDuration = 20,
  style,
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(
    frame,
    [fadeInStart, fadeInStart + fadeInDuration],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <div
      style={{
        fontFamily: BASE_FONT_FAMILY,
        fontSize: 72,
        fontWeight: 800,
        color,
        textAlign,
        lineHeight: 1.1,
        opacity,
        letterSpacing: '-0.02em',
        ...style,
      }}
    >
      {children}
    </div>
  );
};
