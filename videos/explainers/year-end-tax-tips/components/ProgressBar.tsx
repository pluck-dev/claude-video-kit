// 연말정산 꿀팁 영상 — 진행 바 애니메이션 컴포넌트
// CSS animation/transition 절대 금지 — useCurrentFrame() + interpolate() 사용

import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { Colors } from './Colors';

interface ProgressBarProps {
  // 진행률 (0~100)
  targetPercent: number;
  fromPercent?: number;

  // 레이블
  label?: string;
  valueLabel?: string; // 오른쪽 값 레이블 (예: '600만 원')
  showPercent?: boolean;

  // 색상
  barColor?: string;
  trackColor?: string;
  labelColor?: string;

  // 크기
  height?: number;
  borderRadius?: number;

  // 애니메이션
  startFrame?: number;
  durationFrames?: number;

  style?: React.CSSProperties;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  targetPercent,
  fromPercent = 0,
  label,
  valueLabel,
  showPercent = false,
  barColor = Colors.primary,
  trackColor = Colors.border,
  labelColor = Colors.textLight,
  height = 16,
  borderRadius = 8,
  startFrame = 0,
  durationFrames = 60,
  style,
}) => {
  const frame = useCurrentFrame();

  // 진행률 애니메이션
  const currentPercent = interpolate(
    frame,
    [startFrame, startFrame + durationFrames],
    [fromPercent, targetPercent],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // 레이블 영역 fadeIn
  const labelOpacity = interpolate(
    frame,
    [startFrame, startFrame + 15],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <div style={{ width: '100%', ...style }}>
      {/* 레이블 행 */}
      {(label || valueLabel || showPercent) && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 10,
            opacity: labelOpacity,
          }}
        >
          {label && (
            <div
              style={{
                fontFamily: "'Pretendard Variable', Pretendard, -apple-system, sans-serif",
                fontSize: 22,
                fontWeight: 600,
                color: labelColor,
              }}
            >
              {label}
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {valueLabel && (
              <div
                style={{
                  fontFamily: "'Pretendard Variable', Pretendard, -apple-system, sans-serif",
                  fontSize: 22,
                  fontWeight: 700,
                  color: barColor,
                }}
              >
                {valueLabel}
              </div>
            )}
            {showPercent && (
              <div
                style={{
                  fontFamily: "'Pretendard Variable', Pretendard, -apple-system, sans-serif",
                  fontSize: 20,
                  fontWeight: 600,
                  color: Colors.textMuted,
                }}
              >
                {Math.round(currentPercent)}%
              </div>
            )}
          </div>
        </div>
      )}

      {/* 프로그레스 바 트랙 */}
      <div
        style={{
          width: '100%',
          height,
          backgroundColor: trackColor,
          borderRadius,
          overflow: 'hidden',
        }}
      >
        {/* 프로그레스 바 채움 */}
        <div
          style={{
            width: `${currentPercent}%`,
            height: '100%',
            backgroundColor: barColor,
            borderRadius,
          }}
        />
      </div>
    </div>
  );
};
