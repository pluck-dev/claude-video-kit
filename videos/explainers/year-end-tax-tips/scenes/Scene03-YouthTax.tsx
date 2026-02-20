// 씬 03 — 꿀팁 1: 중소기업 청년 소득세 90% 감면
// durationInFrames: 1080 (36s @ 30fps)
// 레이아웃: 90% 강조 타이포 → 1,000만 원 타임라인 → 조건 체크리스트 → 경정청구 배지

import React from 'react';
import { Audio, staticFile, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { Gif } from '@remotion/gif';
import { Colors } from '../components/Colors';
import { Badge } from '../components/Badge';
import { Checklist } from '../components/Checklist';
import { ProgressBar } from '../components/ProgressBar';

export const Scene03YouthTax: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // 씬 fadeIn / fadeOut
  const sceneOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: 'clamp',
  });
  const sceneOpacityOut = interpolate(
    frame,
    [durationInFrames - 15, durationInFrames],
    [1, 0],
    { extrapolateLeft: 'clamp' }
  );
  const finalOpacity = Math.min(sceneOpacity, sceneOpacityOut);

  // 상단 섹션 제목 (0~30f)
  const headerOpacity = interpolate(frame, [10, 30], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const headerTranslateY = interpolate(frame, [10, 30], [-30, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // "90%" 대형 숫자 spring 등장 (30~90f)
  const ninetyScale = spring({
    frame: frame - 30,
    fps,
    from: 0,
    to: 1,
    config: { damping: 12, stiffness: 200, mass: 1 },
  });

  // "모르면 1,000만 원 손해" 텍스트 (90~120f)
  const warningOpacity = interpolate(frame, [90, 115], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // 타임라인 바: 1년 200만 원 × 5년 = 1,000만 원 (200~350f)
  const timelineOpacity = interpolate(frame, [200, 220], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // 체크리스트 등장 (400f~)
  const checklistOpacity = interpolate(frame, [400, 420], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // 경정청구 배지 (700f~)
  const badgeOpacity = interpolate(frame, [700, 720], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // 리액션 GIF fadeIn/fadeOut
  const gifOpacity = interpolate(
    frame,
    [200, 215, 450, 465],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const conditionItems = [
    { label: '만 15세 ~ 34세 이하', description: '군 복무 기간 차감 → 실질적으로 만 40세까지 가능' },
    { label: '중소기업 재직 중', description: '자산 5,000억 원 미만 중소기업' },
    { label: '홈택스에서 직접 신청 필수', description: '회사가 알아서 해주지 않습니다' },
  ];

  return (
    <div
      style={{
        width: 1920,
        height: 1080,
        backgroundColor: Colors.bgDark,
        opacity: finalOpacity,
        display: 'flex',
        flexDirection: 'column',
        padding: '60px 100px',
        boxSizing: 'border-box',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <Audio src={staticFile('videos/explainers/year-end-tax-tips/narration/scene-03.mp3')} />
      {/* 리액션 GIF */}
      <div style={{
        position: 'absolute',
        right: 60,
        bottom: 80,
        opacity: gifOpacity,
        width: 400,
        height: 400,
      }}>
        <Gif
          src="https://media2.giphy.com/media/Ud0jIDEksXLhSwufo7/giphy.gif"
          width={400}
          height={400}
          fit="contain"
        />
      </div>
      {/* 상단 섹션 제목 */}
      <div
        style={{
          opacity: headerOpacity,
          transform: `translateY(${headerTranslateY}px)`,
          display: 'flex',
          alignItems: 'center',
          gap: 20,
          marginBottom: 40,
        }}
      >
        <div
          style={{
            backgroundColor: Colors.warning,
            borderRadius: 10,
            padding: '6px 20px',
            fontFamily: "'Pretendard Variable', Pretendard, -apple-system, sans-serif",
            fontSize: 20,
            fontWeight: 700,
            color: '#1A0A00',
          }}
        >
          꿀팁 1
        </div>
        <div
          style={{
            fontFamily: "'Pretendard Variable', Pretendard, -apple-system, sans-serif",
            fontSize: 36,
            fontWeight: 700,
            color: Colors.textLight,
          }}
        >
          중소기업 청년 소득세 감면
        </div>
      </div>

      {/* 메인 콘텐츠 영역 */}
      <div style={{ display: 'flex', flexDirection: 'row', gap: 60, flex: 1 }}>

        {/* 왼쪽: 90% 강조 + 경고 텍스트 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
            gap: 16,
          }}
        >
          {/* 90% 대형 숫자 */}
          <div
            style={{
              transform: `scale(${ninetyScale})`,
              textAlign: 'center',
              lineHeight: 1,
            }}
          >
            <div
              style={{
                fontFamily: "'Pretendard Variable', Pretendard, -apple-system, sans-serif",
                fontSize: 160,
                fontWeight: 800,
                color: Colors.warning,
                letterSpacing: '-0.04em',
                lineHeight: 1,
              }}
            >
              90%
            </div>
            <div
              style={{
                fontFamily: "'Pretendard Variable', Pretendard, -apple-system, sans-serif",
                fontSize: 32,
                fontWeight: 600,
                color: Colors.textMuted,
                marginTop: 8,
              }}
            >
              소득세 감면
            </div>
          </div>

          {/* "모르면 1,000만 원 손해" 경고 */}
          <div
            style={{
              opacity: warningOpacity,
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              border: `2px solid ${Colors.danger}`,
              borderRadius: 12,
              padding: '16px 32px',
              textAlign: 'center',
              marginTop: 8,
            }}
          >
            <div
              style={{
                fontFamily: "'Pretendard Variable', Pretendard, -apple-system, sans-serif",
                fontSize: 26,
                fontWeight: 700,
                color: Colors.danger,
              }}
            >
              모르면 1,000만 원 손해
            </div>
          </div>

          {/* 타임라인: 연간 200만 × 5년 = 1,000만 */}
          <div
            style={{
              opacity: timelineOpacity,
              width: '100%',
              marginTop: 16,
            }}
          >
            <div
              style={{
                fontFamily: "'Pretendard Variable', Pretendard, -apple-system, sans-serif",
                fontSize: 22,
                fontWeight: 600,
                color: Colors.textMuted,
                marginBottom: 12,
                textAlign: 'center',
              }}
            >
              연간 최대 200만 원 × 5년
            </div>
            <ProgressBar
              targetPercent={100}
              fromPercent={0}
              label="누적 절세 효과"
              valueLabel="최대 1,000만 원"
              barColor={Colors.warning}
              height={20}
              startFrame={220}
              durationFrames={90}
            />
            {/* 5년 마커 */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: 8,
              }}
            >
              {['1년차\n200만', '2년차\n400만', '3년차\n600만', '4년차\n800만', '5년차\n1,000만'].map(
                (label, i) => {
                  const markerOpacity = interpolate(
                    frame,
                    [250 + i * 20, 270 + i * 20],
                    [0, 1],
                    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
                  );
                  return (
                    <div
                      key={i}
                      style={{
                        opacity: markerOpacity,
                        textAlign: 'center',
                      }}
                    >
                      <div
                        style={{
                          fontFamily: "'Pretendard Variable', Pretendard, -apple-system, sans-serif",
                          fontSize: 16,
                          fontWeight: 600,
                          color: i === 4 ? Colors.warning : Colors.textMuted,
                          whiteSpace: 'pre-line',
                          lineHeight: 1.3,
                        }}
                      >
                        {label}
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        </div>

        {/* 오른쪽: 조건 체크리스트 + 경정청구 배지 */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: 32,
          }}
        >
          {/* 조건 체크리스트 */}
          <div style={{ opacity: checklistOpacity }}>
            <div
              style={{
                fontFamily: "'Pretendard Variable', Pretendard, -apple-system, sans-serif",
                fontSize: 28,
                fontWeight: 700,
                color: Colors.textLight,
                marginBottom: 24,
              }}
            >
              조건 확인하세요
            </div>
            <Checklist
              items={conditionItems}
              startFrame={420}
              itemDelay={25}
              itemDuration={18}
              checkDelay={12}
              checkColor={Colors.warning}
              fontSize={24}
            />
          </div>

          {/* 경정청구 배지 + 설명 */}
          <div
            style={{
              opacity: badgeOpacity,
              backgroundColor: 'rgba(37, 99, 235, 0.15)',
              border: `2px solid ${Colors.primary}`,
              borderRadius: 16,
              padding: '24px 32px',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Badge text="소급 가능" variant="new" popInStart={720} />
              <div
                style={{
                  fontFamily: "'Pretendard Variable', Pretendard, -apple-system, sans-serif",
                  fontSize: 26,
                  fontWeight: 700,
                  color: Colors.textLight,
                }}
              >
                경정청구 5년 소급 적용
              </div>
            </div>
            <div
              style={{
                fontFamily: "'Pretendard Variable', Pretendard, -apple-system, sans-serif",
                fontSize: 22,
                fontWeight: 500,
                color: Colors.textMuted,
                lineHeight: 1.5,
              }}
            >
              이미 기간이 지났어도 괜찮아요.
              <br />
              홈택스에서 최대 5년 전까지 신청 가능합니다.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
