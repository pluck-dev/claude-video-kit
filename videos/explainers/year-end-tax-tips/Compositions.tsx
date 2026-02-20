// 연말정산 꿀팁 — Composition 등록
// Root.tsx에서 <YearEndTaxTipsCompositions /> 로 사용

import React from 'react';
import { Composition } from 'remotion';
import { FullVideo } from './FullVideo';
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

// 공통 설정
const FPS = 30;
const WIDTH = 1920;
const HEIGHT = 1080;

export const YearEndTaxTipsCompositions: React.FC = () => {
  return (
    <>
      {/* 전체 영상 — 총 10,350프레임 (5분 45초, crossfade 오버랩 포함) */}
      <Composition
        id="year-end-tax-tips-full"
        component={FullVideo}
        durationInFrames={10350}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />

      {/* 씬 01: 훅 — 330프레임 (11s) */}
      <Composition
        id="year-end-tax-tips-scene01"
        component={Scene01Hook}
        durationInFrames={330}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />

      {/* 씬 02: 배경 — 690프레임 (23s) */}
      <Composition
        id="year-end-tax-tips-scene02"
        component={Scene02Background}
        durationInFrames={690}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />

      {/* 씬 03: 꿀팁 1 청년 소득세 — 1080프레임 (36s) */}
      <Composition
        id="year-end-tax-tips-scene03"
        component={Scene03YouthTax}
        durationInFrames={1080}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />

      {/* 씬 04: 꿀팁 2 연금IRP — 1170프레임 (39s) */}
      <Composition
        id="year-end-tax-tips-scene04"
        component={Scene04PensionIRP}
        durationInFrames={1170}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />

      {/* 씬 05: 꿀팁 3 고향사랑기부제 — 900프레임 (30s) */}
      <Composition
        id="year-end-tax-tips-scene05"
        component={Scene05HometownDonation}
        durationInFrames={900}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />

      {/* 씬 06: 꿀팁 4 월세공제 — 1050프레임 (35s) */}
      <Composition
        id="year-end-tax-tips-scene06"
        component={Scene06RentDeduction}
        durationInFrames={1050}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />

      {/* 씬 07: 2025 신설 공제 — 1110프레임 (37s) */}
      <Composition
        id="year-end-tax-tips-scene07"
        component={Scene07NewBenefits2025}
        durationInFrames={1110}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />

      {/* 씬 08: 흔한 실수 TOP3 — 1650프레임 (55s) */}
      <Composition
        id="year-end-tax-tips-scene08"
        component={Scene08CommonMistakes}
        durationInFrames={1650}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />

      {/* 씬 09: 카드 전략 — 1260프레임 (42s) */}
      <Composition
        id="year-end-tax-tips-scene09"
        component={Scene09CardStrategy}
        durationInFrames={1260}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />

      {/* 씬 10: 체크리스트 — 780프레임 (26s) */}
      <Composition
        id="year-end-tax-tips-scene10"
        component={Scene10Checklist}
        durationInFrames={780}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />

      {/* 씬 11: 아웃트로 — 480프레임 (16s) */}
      <Composition
        id="year-end-tax-tips-scene11"
        component={Scene11Outro}
        durationInFrames={480}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
    </>
  );
};
