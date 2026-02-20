// 씬 09 — 신용카드 25% 전략 + 자녀·교육비 공제
// durationInFrames: 1260 (42s @ 30fps)
// 레이아웃: 25% 기준선 ProgressBar + 신용/체크 카드 비교 + 자녀 공제 테이블 + 교육비 한도 없음 강조

import React from 'react';
import { Audio, staticFile, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { Gif } from '@remotion/gif';
import { Colors } from '../components/Colors';
import { ProgressBar } from '../components/ProgressBar';

export const Scene09CardStrategy: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

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

  // 25% 기준선 설명 (30~60f)
  const strategyOpacity = interpolate(frame, [30, 60], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // 카드 비교 영역 (150~200f)
  const cardCompareOpacity = interpolate(frame, [150, 180], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // 자녀 공제 테이블 (400~450f)
  const childTableOpacity = interpolate(frame, [400, 430], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // 교육비 강조 (700~750f)
  const eduOpacity = interpolate(frame, [700, 730], [0, 1], {
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

  // 카드별 공제율 데이터
  const cardTypes = [
    { label: '신용카드', rate: '15%', percent: 15, color: Colors.textMuted, description: '25%까지는 신용카드 (포인트 혜택)' },
    { label: '체크카드', rate: '30%', percent: 30, color: Colors.success, description: '25% 초과분부터는 체크카드' },
    { label: '전통시장', rate: '40%', percent: 40, color: Colors.primary, description: '전통시장 / 대중교통' },
  ];

  // 자녀 공제 데이터
  const childData = [
    { label: '첫째', amount: '25만 원', color: Colors.textMuted },
    { label: '둘째', amount: '30만 원', color: Colors.primary },
    { label: '셋째 이상', amount: '40만 원', color: Colors.success },
    { label: '출산공제 추가', amount: '+70만 원', color: Colors.warning, note: '셋째 출산 시' },
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
      }}
    >
      <Audio src={staticFile('videos/explainers/year-end-tax-tips/narration/scene-09.mp3')} />
      {/* 리액션 GIF */}
      <div style={{
        position: 'absolute',
        left: 60,
        bottom: 80,
        opacity: gifOpacity,
        width: 400,
        height: 400,
      }}>
        <Gif
          src="https://media1.giphy.com/media/GiJIJug9pUHg1pqcwL/giphy.gif"
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
          gap: 20,
          marginBottom: 32,
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
          전략
        </div>
        <div
          style={{
            fontFamily: "'Pretendard Variable', Pretendard, -apple-system, sans-serif",
            fontSize: 36,
            fontWeight: 700,
            color: Colors.textLight,
          }}
        >
          신용카드 25% 전략 + 자녀·교육비 공제
        </div>
      </div>

      {/* 메인 콘텐츠 — 좌우 분할 */}
      <div style={{ display: 'flex', flexDirection: 'row', gap: 60, flex: 1 }}>

        {/* 왼쪽: 카드 전략 */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 24 }}>

          {/* 25% 기준선 설명 */}
          <div style={{ opacity: strategyOpacity }}>
            <div
              style={{
                fontFamily: "'Pretendard Variable', Pretendard, -apple-system, sans-serif",
                fontSize: 24,
                fontWeight: 600,
                color: Colors.textMuted,
                marginBottom: 16,
              }}
            >
              연봉 25% 기준선 — 이걸 넘기면 카드를 바꾸세요
            </div>

            {/* 25% 기준선 프로그레스바 */}
            <div style={{ position: 'relative' }}>
              <ProgressBar
                targetPercent={25}
                barColor={Colors.warning}
                trackColor={Colors.bgCard}
                height={28}
                startFrame={50}
                durationFrames={50}
                showPercent
              />
              {/* 25% 마커 라벨 */}
              <div
                style={{
                  position: 'absolute',
                  left: '25%',
                  top: -28,
                  transform: 'translateX(-50%)',
                  fontFamily: "'Pretendard Variable', Pretendard, -apple-system, sans-serif",
                  fontSize: 18,
                  fontWeight: 700,
                  color: Colors.warning,
                  whiteSpace: 'nowrap',
                }}
              >
                ↓ 이 지점부터 체크카드
              </div>
            </div>
          </div>

          {/* 카드별 공제율 비교 */}
          <div style={{ opacity: cardCompareOpacity, marginTop: 16 }}>
            <div
              style={{
                fontFamily: "'Pretendard Variable', Pretendard, -apple-system, sans-serif",
                fontSize: 24,
                fontWeight: 700,
                color: Colors.textLight,
                marginBottom: 16,
              }}
            >
              카드 종류별 공제율
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {cardTypes.map((card, i) => {
                const itemOpacity = interpolate(
                  frame,
                  [180 + i * 25, 200 + i * 25],
                  [0, 1],
                  { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
                );
                return (
                  <div
                    key={i}
                    style={{ opacity: itemOpacity }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 6,
                      }}
                    >
                      <div
                        style={{
                          fontFamily: "'Pretendard Variable', Pretendard, -apple-system, sans-serif",
                          fontSize: 22,
                          fontWeight: 600,
                          color: Colors.textLight,
                        }}
                      >
                        {card.label}
                      </div>
                      <div
                        style={{
                          fontFamily: "'Pretendard Variable', Pretendard, -apple-system, sans-serif",
                          fontSize: 26,
                          fontWeight: 800,
                          color: card.color,
                        }}
                      >
                        {card.rate}
                      </div>
                    </div>
                    <ProgressBar
                      targetPercent={card.percent}
                      barColor={card.color}
                      height={14}
                      startFrame={200 + i * 25}
                      durationFrames={50}
                    />
                    <div
                      style={{
                        fontFamily: "'Pretendard Variable', Pretendard, -apple-system, sans-serif",
                        fontSize: 18,
                        fontWeight: 400,
                        color: Colors.textMuted,
                        marginTop: 4,
                      }}
                    >
                      {card.description}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 오른쪽: 자녀 공제 + 교육비 */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 24 }}>

          {/* 자녀 세액공제 테이블 */}
          <div style={{ opacity: childTableOpacity }}>
            <div
              style={{
                fontFamily: "'Pretendard Variable', Pretendard, -apple-system, sans-serif",
                fontSize: 26,
                fontWeight: 700,
                color: Colors.textLight,
                marginBottom: 16,
              }}
            >
              자녀 세액공제 (2025년 확대)
            </div>
            <div
              style={{
                backgroundColor: Colors.bgCard,
                borderRadius: 16,
                overflow: 'hidden',
              }}
            >
              {/* 테이블 헤더 */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  backgroundColor: 'rgba(37, 99, 235, 0.2)',
                  padding: '12px 24px',
                }}
              >
                <div style={{ fontFamily: "'Pretendard Variable', Pretendard, sans-serif", fontSize: 20, fontWeight: 700, color: Colors.textMuted }}>자녀 수</div>
                <div style={{ fontFamily: "'Pretendard Variable', Pretendard, sans-serif", fontSize: 20, fontWeight: 700, color: Colors.textMuted, textAlign: 'right' }}>공제액</div>
              </div>

              {/* 테이블 행 */}
              {childData.map((row, i) => {
                const rowOpacity = interpolate(
                  frame,
                  [430 + i * 20, 450 + i * 20],
                  [0, 1],
                  { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
                );
                return (
                  <div
                    key={i}
                    style={{
                      opacity: rowOpacity,
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      padding: '14px 24px',
                      borderTop: `1px solid ${Colors.border}`,
                    }}
                  >
                    <div>
                      <div style={{ fontFamily: "'Pretendard Variable', Pretendard, sans-serif", fontSize: 22, fontWeight: 600, color: Colors.textLight }}>{row.label}</div>
                      {row.note && (
                        <div style={{ fontFamily: "'Pretendard Variable', Pretendard, sans-serif", fontSize: 16, color: Colors.textMuted, marginTop: 2 }}>{row.note}</div>
                      )}
                    </div>
                    <div
                      style={{
                        fontFamily: "'Pretendard Variable', Pretendard, sans-serif",
                        fontSize: 26,
                        fontWeight: 800,
                        color: row.color,
                        textAlign: 'right',
                      }}
                    >
                      {row.amount}
                    </div>
                  </div>
                );
              })}

              {/* 합산 예시 */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  padding: '16px 24px',
                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                  borderTop: `2px solid ${Colors.success}`,
                  opacity: interpolate(frame, [560, 590], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
                }}
              >
                <div style={{ fontFamily: "'Pretendard Variable', Pretendard, sans-serif", fontSize: 20, fontWeight: 700, color: Colors.success }}>셋째 출산 시 합산</div>
                <div style={{ fontFamily: "'Pretendard Variable', Pretendard, sans-serif", fontSize: 28, fontWeight: 800, color: Colors.success, textAlign: 'right' }}>= 110만 원</div>
              </div>
            </div>
          </div>

          {/* 교육비 한도 없음 강조 */}
          <div
            style={{
              opacity: eduOpacity,
              backgroundColor: 'rgba(37, 99, 235, 0.12)',
              border: `2px solid ${Colors.primary}`,
              borderRadius: 16,
              padding: '24px 28px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <span style={{ fontSize: 28 }}>🎓</span>
              <div
                style={{
                  fontFamily: "'Pretendard Variable', Pretendard, -apple-system, sans-serif",
                  fontSize: 26,
                  fontWeight: 700,
                  color: Colors.textLight,
                }}
              >
                본인 교육비
              </div>
              <div
                style={{
                  backgroundColor: Colors.primary,
                  borderRadius: 8,
                  padding: '4px 14px',
                  fontFamily: "'Pretendard Variable', Pretendard, sans-serif",
                  fontSize: 18,
                  fontWeight: 700,
                  color: Colors.textLight,
                }}
              >
                한도 없음
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
              대학원·직업훈련비 포함, 전액 15% 공제
              <br />
              (자녀 교육비는 1인당 연 300만 원 한도)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
