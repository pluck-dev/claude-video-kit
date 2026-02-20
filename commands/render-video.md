# /render-video - 비디오 렌더링

Remotion 프로젝트를 렌더링하여 mp4/webm 파일을 생성합니다.

## 참조 스킬
별도 스킬 파일 없음 (이 커맨드 파일에 전체 규칙 포함).

## 사용법
```
/render-video                          ← 전체 영상 렌더링
/render-video --preview                ← Remotion Studio 프리뷰
/render-video --composition Scene01    ← 특정 씬만 렌더링
/render-video --quality crf18          ← 고품질 렌더링
/render-video --format webm            ← WebM 포맷
```

## 실행 절차

### 프리뷰 (--preview)
```bash
npx remotion studio
```
- 브라우저에서 실시간 프리뷰
- 씬별 독립 확인 가능

### 전체 렌더링
```bash
npx remotion render src/index.ts MainVideo output/video.mp4
```

### 특정 씬 렌더링
```bash
npx remotion render src/index.ts {compositionId} output/{name}.mp4
```

### 렌더링 옵션
| 옵션 | 설명 | 기본값 |
|------|------|--------|
| `--codec` | 코덱 (h264, h265, vp8, vp9) | h264 |
| `--crf` | 품질 (0=최고, 51=최저) | 18 |
| `--pixel-format` | 픽셀 포맷 | yuv420p |
| `--concurrency` | 병렬 렌더링 스레드 | 50% CPU |
| `--frames` | 특정 프레임 범위 | 전체 |

## 사전 체크
1. Remotion 프로젝트 존재 확인 (package.json + remotion 의존성)
2. src/Root.tsx에 Composition 등록 확인
3. 에셋 파일 존재 확인 (public/)
4. 이전 렌더링 결과 백업 (output/ 기존 파일)

## 출력
- `output/{video-name}.mp4` — 렌더링 결과
- VIDEO.md Phase 5a 상태 업데이트

## 트러블슈팅
- `Error: No composition found` → src/Root.tsx에 Composition 등록 확인
- `Error: Could not find file` → public/ 에셋 경로 확인
- `ENOMEM` → --concurrency 낮추기
- 렌더링 느림 → --concurrency 높이기, 불필요 에셋 제거
