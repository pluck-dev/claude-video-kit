// 씬 07 — 2025년 NEW: 결혼세액공제 + 헬스장 공제
// durationInFrames: 1110 (37s @ 30fps)
// 레이아웃: 2분할 카드 — 상단 결혼세액공제(100만 원 NEW), 하단 헬스장 공제(30%, 36만 원 NEW)

import React from 'react';
import { Audio, staticFile, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { Gif } from '@remotion/gif';
import { Colors } from '../components/Colors';
import { Badge } from '../components/Badge';
import { CountUp } from '../components/CountUp';

export const Scene07NewBenefits2025: React.FC = () => {
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

  // 헤더 (0~30f)
  const headerOpacity = interpolate(frame, [10, 30], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // 결혼 카드 슬라이드 (40~80f)
  const marriageCardY = interpolate(frame, [40, 70], [-60, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const marriageCardOpacity = interpolate(frame, [40, 70], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // 헬스장 카드 슬라이드 (120~160f)
  const gymCardY = interpolate(frame, [120, 160], [60, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const gymCardOpacity = interpolate(frame, [120, 160], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // 결혼 세부 내용 (180~220f)
  const marriageDetailOpacity = interpolate(frame, [180, 210], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // 헬스장 세부 내용 (250~290f)
  const gymDetailOpacity = interpolate(frame, [250, 280], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // 30% 강조 scale (300f~)
  const pctScale = spring({
    frame: frame - 300,
    fps,
    from: 0,
    to: 1,
    config: { damping: 10, stiffness: 250, mass: 0.8 },
  });

  // 리액션 GIF fadeIn/fadeOut
  const gifOpacity = interpolate(
    frame,
    [200, 215, 450, 465],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

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
      <Audio src={staticFile('videos/explainers/year-end-tax-tips/narration/scene-07.mp3')} />
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
          src="https://media2.giphy.com/media/EiAyoEw3B94vP6iGoU/giphy.gif"
          width={400}
          height={400}
          fit="contain"
        />
      </div>
      {/* 상단 헤더 */}
      <div
        style={{
          opacity: headerOpacity,
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          marginBottom: 40,
        }}
      >
        <div
          style={{
            backgroundColor: Colors.primary,
            borderRadius: 10,
            padding: '6px 20px',
            fontFamily: "'Pretendard Variable', Pretendard, -apple-system, sans-serif",
            fontSize: 20,
            fontWeight: 700,
            color: Colors.textLight,
          }}
        >
          2025년 신설
        </div>
        <div
          style={{
            fontFamily: "'Pretendard Variable', Pretendard, -apple-system, sans-serif",
            fontSize: 36,
            fontWeight: 700,
            color: Colors.textLight,
          }}
        >
          올해부터 새로 생긴 공제 두 가지
        </div>
      </div>

      {/* 2분할 레이아웃 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 32, flex: 1 }}>

        {/* 상단 카드: 결혼세액공제 */}
        <div
          style={{
            flex: 1,
            backgroundColor: 'rgba(37, 99, 235, 0.1)',
            border: `2px solid ${Colors.primary}`,
            borderRadius: 20,
            padding: '32px 48px',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 48,
            opacity: marriageCardOpacity,
            transform: `translateY(${marriageCardY}px)`,
          }}
        >
          {/* 왼쪽: 아이콘 + 제목 */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 12,
              flexShrink: 0,
            }}
          >
            <div style={{ fontSize: 56 }}>💍</div>
            <div
              style={{
                fontFamily: "'Pretendard Variable', Pretendard, -apple-system, sans-serif",
                fontSize: 28,
                fontWeight: 700,
                color: Colors.textLight,
                textAlign: 'center',
              }}
            >
              결혼세액공제
            </div>
            <Badge text="NEW" variant="new" popInStart={60} />
          </div>

          {/* 중앙: 금액 강조 */}
          <div style={{ flex: 1, textAlign: 'center' }}>
            <CountUp
              from={0}
              to={100}
              suffix="만 원"
              startFrame={80}
              durationFrames={60}
              fontSize={80}
              fontWeight={800}
              color={Colors.primary}
            />
            <div
              style={{
                fontFamily: "'Pretendard Variable', Pretendard, -apple-system, sans-serif",
                fontSize: 22,
                fontWeight: 500,
                color: Colors.textMuted,
                marginTop: 4,
              }}
            >
              부부 합산 세액공제
            </div>
          </div>

          {/* 오른쪽: 세부 조건 */}
          <div
            style={{
              flex: 1.2,
              opacity: marriageDetailOpacity,
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
            }}
          >
            {[
              { icon: '✅', text: '부부 각각 50만 원 × 2 = 100만 원' },
              { icon: '✅', text: '재혼 가능 / 나이 제한 없음' },
              { icon: '⏰', text: '2024년 ~ 2026년 한시 적용' },
            ].map((item, i) => {
              const itemOpacity = interpolate(
                frame,
                [200 + i * 15, 220 + i * 15],
                [0, 1],
                { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
              );
              return (
                <div
                  key={i}
                  style={{
                    opacity: itemOpacity,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                  }}
                >
                  <span style={{ fontSize: 22 }}>{item.icon}</span>
                  <div
                    style={{
                      fontFamily: "'Pretendard Variable', Pretendard, -apple-system, sans-serif",
                      fontSize: 22,
                      fontWeight: 500,
                      color: Colors.textLight,
                    }}
                  >
                    {item.text}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 하단 카드: 헬스장 소득공제 */}
        <div
          style={{
            flex: 1,
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            border: `2px solid ${Colors.success}`,
            borderRadius: 20,
            padding: '32px 48px',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 48,
            opacity: gymCardOpacity,
            transform: `translateY(${gymCardY}px)`,
          }}
        >
          {/* 왼쪽: 아이콘 + 제목 */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 12,
              flexShrink: 0,
            }}
          >
            <div style={{ fontSize: 56 }}>🏋️</div>
            <div
              style={{
                fontFamily: "'Pretendard Variable', Pretendard, -apple-system, sans-serif",
                fontSize: 28,
                fontWeight: 700,
                color: Colors.textLight,
                textAlign: 'center',
              }}
            >
              헬스장 소득공제
            </div>
            <Badge text="NEW" variant="success" popInStart={140} />
          </div>

          {/* 중앙: 공제율 강조 */}
          <div
            style={{
              flex: 1,
              textAlign: 'center',
              transform: `scale(${pctScale})`,
            }}
          >
            <div
              style={{
                fontFamily: "'Pretendard Variable', Pretendard, -apple-system, sans-serif",
                fontSize: 80,
                fontWeight: 800,
                color: Colors.success,
                lineHeight: 1,
                letterSpacing: '-0.02em',
              }}
            >
              30%
            </div>
            <div
              style={{
                fontFamily: "'Pretendard Variable', Pretendard, -apple-system, sans-serif",
                fontSize: 22,
                fontWeight: 500,
                color: Colors.textMuted,
                marginTop: 4,
              }}
            >
              소득공제율 (총급여 7,000만 원 이하)
            </div>
          </div>

          {/* 오른쪽: 세부 조건 */}
          <div
            style={{
              flex: 1.2,
              opacity: gymDetailOpacity,
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
            }}
          >
            {[
              { icon: '📅', text: '2025년 7월부터 시행' },
              { icon: '💪', text: '월 10만 원 × 12개월 → 연 36만 원 공제' },
              { icon: '⚠️', text: '등록된 사업자 헬스장만 가능 — 사전 확인 필수' },
            ].map((item, i) => {
              const itemOpacity = interpolate(
                frame,
                [270 + i * 15, 290 + i * 15],
                [0, 1],
                { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
              );
              return (
                <div
                  key={i}
                  style={{
                    opacity: itemOpacity,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                  }}
                >
                  <span style={{ fontSize: 22 }}>{item.icon}</span>
                  <div
                    style={{
                      fontFamily: "'Pretendard Variable', Pretendard, -apple-system, sans-serif",
                      fontSize: 22,
                      fontWeight: 500,
                      color: Colors.textLight,
                    }}
                  >
                    {item.text}
                  </div>
                </div>
              );
            })}

            {/* 운동 + 절세 메시지 */}
            <div
              style={{
                marginTop: 8,
                fontFamily: "'Pretendard Variable', Pretendard, -apple-system, sans-serif",
                fontSize: 20,
                fontWeight: 700,
                color: Colors.warning,
              }}
            >
              운동도 하고 세금도 아끼는 거예요
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
