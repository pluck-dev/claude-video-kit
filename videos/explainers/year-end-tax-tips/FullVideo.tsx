// 연말정산 꿀팁 — 전체 영상 컴포넌트
// 모든 씬을 Series로 연결 (씬 간 15프레임 crossfade 오버랩)
// 총 프레임: 10,350 (5분 45초 @ 30fps)

import React from 'react';
import { AbsoluteFill, Series } from 'remotion';
import { Colors } from './components/Colors';
import { Scene01Hook } from './scenes/Scene01-Hook';
import { Scene02Background } from './scenes/Scene02-Background';
import { Scene03YouthTax } from './scenes/Scene03-YouthTax';
import { Scene04PensionIRP } from './scenes/Scene04-PensionIRP';
import { Scene05HometownDonation } from './scenes/Scene05-HometownDonation';
import { Scene06RentDeduction } from './scenes/Scene06-RentDeduction';
import { Scene07NewBenefits2025 } from './scenes/Scene07-NewBenefits2025';
import { Scene08CommonMistakes } from './scenes/Scene08-CommonMistakes';
import { Scene09CardStrategy } from './scenes/Scene09-CardStrategy';
import { Scene10Checklist } from './scenes/Scene10-Checklist';
import { Scene11Outro } from './scenes/Scene11-Outro';

// 씬 전환 오버랩 (crossfade)
const OVERLAP = 15; // 0.5초

export const FullVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: Colors.bgDark }}>
    <Series>
      {/* 씬 01: 훅 — Before/After 비교 (11s = 330f) */}
      <Series.Sequence durationInFrames={330}>
        <Scene01Hook />
      </Series.Sequence>

      {/* 씬 02: 배경 — 왜 연말정산이 중요한가 (23s = 690f) */}
      <Series.Sequence durationInFrames={690} offset={-OVERLAP}>
        <Scene02Background />
      </Series.Sequence>

      {/* 씬 03: 꿀팁 1 — 중소기업 청년 소득세 90% 감면 (36s = 1080f) */}
      <Series.Sequence durationInFrames={1080} offset={-OVERLAP}>
        <Scene03YouthTax />
      </Series.Sequence>

      {/* 씬 04: 꿀팁 2 — 연금저축 + IRP 148만 원 환급 (39s = 1170f) */}
      <Series.Sequence durationInFrames={1170} offset={-OVERLAP}>
        <Scene04PensionIRP />
      </Series.Sequence>

      {/* 씬 05: 꿀팁 3 — 고향사랑기부제 10만 원의 마법 (30s = 900f) */}
      <Series.Sequence durationInFrames={900} offset={-OVERLAP}>
        <Scene05HometownDonation />
      </Series.Sequence>

      {/* 씬 06: 꿀팁 4 — 월세 세액공제 2025년 대폭 확대 (35s = 1050f) */}
      <Series.Sequence durationInFrames={1050} offset={-OVERLAP}>
        <Scene06RentDeduction />
      </Series.Sequence>

      {/* 씬 07: 2025년 NEW — 결혼세액공제 + 헬스장 공제 (37s = 1110f) */}
      <Series.Sequence durationInFrames={1110} offset={-OVERLAP}>
        <Scene07NewBenefits2025 />
      </Series.Sequence>

      {/* 씬 08: 흔한 실수 TOP 3 (55s = 1650f) */}
      <Series.Sequence durationInFrames={1650} offset={-OVERLAP}>
        <Scene08CommonMistakes />
      </Series.Sequence>

      {/* 씬 09: 신용카드 25% 전략 + 자녀·교육비 공제 (42s = 1260f) */}
      <Series.Sequence durationInFrames={1260} offset={-OVERLAP}>
        <Scene09CardStrategy />
      </Series.Sequence>

      {/* 씬 10: 체크리스트 정리 (26s = 780f) */}
      <Series.Sequence durationInFrames={780} offset={-OVERLAP}>
        <Scene10Checklist />
      </Series.Sequence>

      {/* 씬 11: 아웃트로 + CTA (16s = 480f) */}
      <Series.Sequence durationInFrames={480} offset={-OVERLAP}>
        <Scene11Outro />
      </Series.Sequence>
    </Series>
    </AbsoluteFill>
  );
};
