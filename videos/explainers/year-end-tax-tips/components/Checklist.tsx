// 연말정산 꿀팁 영상 — 체크리스트 애니메이션 컴포넌트
// CSS animation/transition 절대 금지 — useCurrentFrame() + interpolate() 사용

import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { Colors } from './Colors';

interface ChecklistItem {
  label: string;
  description?: string;
}

interface ChecklistProps {
  items: ChecklistItem[];

  // 애니메이션 타이밍
  startFrame?: number;     // 첫 번째 항목 등장 시작 프레임
  itemDelay?: number;      // 항목 간 딜레이 (프레임)
  itemDuration?: number;   // 각 항목 등장 지속 프레임

  // 체크 마크 등장 타이밍 (항목 등장 이후 추가 딜레이)
  checkDelay?: number;

  // 스타일
  checkColor?: string;
  labelColor?: string;
  descriptionColor?: string;
  fontSize?: number;
  itemGap?: number;

  style?: React.CSSProperties;
}

export const Checklist: React.FC<ChecklistProps> = ({
  items,
  startFrame = 0,
  itemDelay = 20,
  itemDuration = 15,
  checkDelay = 8,
  checkColor = Colors.success,
  labelColor = Colors.textLight,
  descriptionColor = Colors.textMuted,
  fontSize = 26,
  itemGap = 20,
  style,
}) => {
  const frame = useCurrentFrame();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: itemGap, ...style }}>
      {items.map((item, index) => {
        // 각 항목의 등장 시작 프레임
        const itemStart = startFrame + index * itemDelay;

        // 항목 전체 opacity (slideIn 효과)
        const itemOpacity = interpolate(
          frame,
          [itemStart, itemStart + itemDuration],
          [0, 1],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        );

        // 항목 translateX (왼쪽에서 슬라이드)
        const itemTranslateX = interpolate(
          frame,
          [itemStart, itemStart + itemDuration],
          [-30, 0],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        );

        // 체크 마크 등장 (항목 등장 이후)
        const checkStart = itemStart + checkDelay;
        const checkScale = interpolate(
          frame,
          [checkStart, checkStart + 10],
          [0, 1],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        );

        const isChecked = frame >= checkStart;

        return (
          <div
            key={index}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 16,
              opacity: itemOpacity,
              transform: `translateX(${itemTranslateX}px)`,
            }}
          >
            {/* 체크박스 */}
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                border: `3px solid ${isChecked ? checkColor : Colors.border}`,
                backgroundColor: isChecked ? checkColor : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                marginTop: 2,
              }}
            >
              {/* 체크 아이콘 (scale 애니메이션) */}
              <div
                style={{
                  transform: `scale(${checkScale})`,
                  color: Colors.bgDark,
                  fontSize: 20,
                  fontWeight: 800,
                  lineHeight: 1,
                }}
              >
                ✓
              </div>
            </div>

            {/* 텍스트 영역 */}
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontFamily:
                    "'Pretendard Variable', Pretendard, -apple-system, sans-serif",
                  fontSize,
                  fontWeight: 600,
                  color: labelColor,
                  lineHeight: 1.4,
                }}
              >
                {item.label}
              </div>
              {item.description && (
                <div
                  style={{
                    fontFamily:
                      "'Pretendard Variable', Pretendard, -apple-system, sans-serif",
                    fontSize: fontSize - 4,
                    fontWeight: 400,
                    color: descriptionColor,
                    lineHeight: 1.5,
                    marginTop: 4,
                  }}
                >
                  {item.description}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
