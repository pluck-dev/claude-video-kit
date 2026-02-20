// 씬 04 — 꿀팁 2: 연금저축 + IRP 148만 원 환급
// durationInFrames: 1170 (39s @ 30fps)
// 레이아웃: 계산기 다이어그램 — 600만 + 300만 = 900만 → 148만 원 환급 CountUp, 공제율 비교 카드

import React from 'react';
import { Audio, staticFile, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { Gif } from '@remotion/gif';
import { Colors } from '../components/Colors';
import { CountUp } from '../components/CountUp';
import { ProgressBar } from '../components/ProgressBar';

export const Scene04PensionIRP: React.FC = () => {
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

  // 상단 헤더 (0~30f)
  const headerOpacity = interpolate(frame, [10, 30], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // 연금저축 바 (60~180f)
  const pensionBarOpacity = interpolate(frame, [60, 80], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // IRP 바 (120~240f)
  const irpBarOpacity = interpolate(frame, [120, 140], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // 합계 표시 (230~280f)
  const totalOpacity = interpolate(frame, [230, 260], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // = 기호 + 환급액 (280~380f)
  const resultOpacity = interpolate(frame, [300, 330], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const resultScale = spring({
    frame: frame - 300,
    fps,
    from: 0.5,
    to: 1,
    config: { damping: 12, stiffness: 180 },
  });

  // 공제율 카드 (550~620f)
  const rateCardOpacity = interpolate(frame, [550, 580], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // 주의사항 (900~950f)
  const warningOpacity = interpolate(frame, [900, 930], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // 리액션 GIF fadeIn/fadeOut
  const gifOpacity = interpolate(
    frame,
    [250, 265, 500, 515],
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
      <Audio src={staticFile('videos/explainers/year-end-tax-tips/narration/scene-04.mp3')} />
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
          src="https://media2.giphy.com/media/3oKIPa2TdahY8LAAxy/giphy.gif"
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
          marginBottom: 48,
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
          꿀팁 2
        </div>
        <div
          style={{
            fontFamily: "'Pretendard Variable', Pretendard, -apple-system, sans-serif",
            fontSize: 36,
            fontWeight: 700,
            color: Colors.textLight,
          }}
        >
          연금저축 + IRP — 최대 148만 원 환급
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div style={{ display: 'flex', flexDirection: 'row', gap: 80, flex: 1 }}>

        {/* 왼쪽: 납입 다이어그램 */}
        <div
          style={{
            flex: 1.2,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: 24,
          }}
        >
          {/* 연금저축 바 */}
          <div style={{ opacity: pensionBarOpacity }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 8,
              }}
            >
              <div
                style={{
                  fontFamily: "'Pretendard Variable', Pretendard, -apple-system, sans-serif",
                  fontSize: 26,
                  fontWeight: 700,
                  color: Colors.textLight,
                }}
              >
                연금저축
              </div>
              <div
                style={{
                  fontFamily: "'Pretendard Variable', Pretendard, -apple-system, sans-serif",
                  fontSize: 26,
                  fontWeight: 700,
                  color: Colors.primary,
                }}
              >
                600만 원
              </div>
            </div>
            <ProgressBar
              targetPercent={66.7}
              barColor={Colors.primary}
              height={24}
              startFrame={80}
              durationFrames={80}
            />
          </div>

          {/* IRP 바 */}
          <div style={{ opacity: irpBarOpacity }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 8,
              }}
            >
              <div
                style={{
                  fontFamily: "'Pretendard Variable', Pretendard, -apple-system, sans-serif",
                  fontSize: 26,
                  fontWeight: 700,
                  color: Colors.textLight,
                }}
              >
                IRP
              </div>
              <div
                style={{
                  fontFamily: "'Pretendard Variable', Pretendard, -apple-system, sans-serif",
                  fontSize: 26,
                  fontWeight: 700,
                  color: Colors.success,
                }}
              >
                300만 원
              </div>
            </div>
            <ProgressBar
              targetPercent={33.3}
              barColor={Colors.success}
              height={24}
              startFrame={140}
              durationFrames={80}
            />
          </div>

          {/* 합계 라인 */}
          <div
            style={{
              opacity: totalOpacity,
              borderTop: `2px solid ${Colors.border}`,
              paddingTop: 20,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                fontFamily: "'Pretendard Variable', Pretendard, -apple-system, sans-serif",
                fontSize: 30,
                fontWeight: 700,
                color: Colors.textLight,
              }}
            >
              합계 납입
            </div>
            <div
              style={{
                fontFamily: "'Pretendard Variable', Pretendard, -apple-system, sans-serif",
                fontSize: 36,
                fontWeight: 800,
                color: Colors.textLight,
              }}
            >
              900만 원
            </div>
          </div>

          {/* 화살표 + 환급 결과 */}
          <div
            style={{
              opacity: resultOpacity,
              transform: `scale(${resultScale})`,
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              border: `3px solid ${Colors.success}`,
              borderRadius: 16,
              padding: '24px 32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: "'Pretendard Variable', Pretendard, -apple-system, sans-serif",
                  fontSize: 24,
                  fontWeight: 600,
                  color: Colors.textMuted,
                  marginBottom: 4,
                }}
              >
                세금 환급
              </div>
              <div
                style={{
                  fontFamily: "'Pretendard Variable', Pretendard, -apple-system, sans-serif",
                  fontSize: 20,
                  fontWeight: 500,
                  color: Colors.textMuted,
                }}
              >
                (총급여 5,500만 원 이하 기준)
              </div>
            </div>
            <CountUp
              from={0}
              to={148}
              suffix="만 원"
              startFrame={320}
              durationFrames={80}
              fontSize={72}
              fontWeight={800}
              color={Colors.success}
            />
          </div>

          {/* 주의사항 */}
          <div
            style={{
              opacity: warningOpacity,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              backgroundColor: 'rgba(245, 158, 11, 0.1)',
              border: `1px solid ${Colors.warning}`,
              borderRadius: 12,
              padding: '14px 24px',
            }}
          >
            <span style={{ fontSize: 24 }}>⚠️</span>
            <div
              style={{
                fontFamily: "'Pretendard Variable', Pretendard, -apple-system, sans-serif",
                fontSize: 22,
                fontWeight: 600,
                color: Colors.warning,
              }}
            >
              12월 31일까지 납입 완료해야 공제 적용!
            </div>
          </div>
        </div>

        {/* 오른쪽: 공제율 비교 카드 */}
        <div
          style={{
            flex: 0.8,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: 24,
            opacity: rateCardOpacity,
          }}
        >
          <div
            style={{
              fontFamily: "'Pretendard Variable', Pretendard, -apple-system, sans-serif",
              fontSize: 28,
              fontWeight: 700,
              color: Colors.textLight,
              marginBottom: 8,
            }}
          >
            공제율 비교
          </div>

          {/* 5,500만 원 이하 카드 */}
          <div
            style={{
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              border: `2px solid ${Colors.success}`,
              borderRadius: 16,
              padding: '28px 32px',
            }}
          >
            <div
              style={{
                fontFamily: "'Pretendard Variable', Pretendard, -apple-system, sans-serif",
                fontSize: 20,
                fontWeight: 600,
                color: Colors.textMuted,
                marginBottom: 8,
              }}
            >
              총급여 5,500만 원 이하
            </div>
            <div
              style={{
                fontFamily: "'Pretendard Variable', Pretendard, -apple-system, sans-serif",
                fontSize: 56,
                fontWeight: 800,
                color: Colors.success,
                lineHeight: 1,
              }}
            >
              16.5%
            </div>
            <div
              style={{
                fontFamily: "'Pretendard Variable', Pretendard, -apple-system, sans-serif",
                fontSize: 22,
                fontWeight: 700,
                color: Colors.success,
                marginTop: 8,
              }}
            >
              → 최대 148만 5천 원 환급
            </div>
          </div>

          {/* 5,500만 원 초과 카드 */}
          <div
            style={{
              backgroundColor: Colors.bgCard,
              border: `2px solid ${Colors.border}`,
              borderRadius: 16,
              padding: '28px 32px',
            }}
          >
            <div
              style={{
                fontFamily: "'Pretendard Variable', Pretendard, -apple-system, sans-serif",
                fontSize: 20,
                fontWeight: 600,
                color: Colors.textMuted,
                marginBottom: 8,
              }}
            >
              총급여 5,500만 원 초과
            </div>
            <div
              style={{
                fontFamily: "'Pretendard Variable', Pretendard, -apple-system, sans-serif",
                fontSize: 56,
                fontWeight: 800,
                color: Colors.textMuted,
                lineHeight: 1,
              }}
            >
              13.2%
            </div>
            <div
              style={{
                fontFamily: "'Pretendard Variable', Pretendard, -apple-system, sans-serif",
                fontSize: 22,
                fontWeight: 700,
                color: Colors.textMuted,
                marginTop: 8,
              }}
            >
              → 최대 118만 원 환급
            </div>
          </div>

          {/* 일석이조 메시지 */}
          <div
            style={{
              textAlign: 'center',
              fontFamily: "'Pretendard Variable', Pretendard, -apple-system, sans-serif",
              fontSize: 24,
              fontWeight: 700,
              color: Colors.warning,
            }}
          >
            노후 준비 + 세금 절약 — 일석이조
          </div>
        </div>
      </div>
    </div>
  );
};
