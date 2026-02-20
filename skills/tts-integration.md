# TTS 서비스 연동 가이드

## 개요

스크립트 나레이션을 TTS(Text-to-Speech)로 자동 생성하는 가이드.
TTS는 선택 사항(optional)이며, 직접 녹음을 선호하는 경우 이 단계를 건너뛸 수 있다.

---

## TTS 서비스 비교

| 서비스 | 품질 | 한국어 지원 | 가격 | API |
|--------|------|------------|------|-----|
| ElevenLabs | ★★★★★ | ○ 양호 | $5/month~ | REST |
| Google Cloud TTS | ★★★★ | ◎ 우수 | 무료 티어 있음 | REST / gRPC |
| Azure TTS | ★★★★ | ◎ 우수 | 무료 티어 있음 | REST |
| OpenAI TTS | ★★★★ | ○ 양호 | $15/1M chars | REST |
| Edge TTS | ★★★ | ◎ 우수 | 완전 무료 | CLI |
| Naver CLOVA | ★★★★ | ◎ 최우수 | 유료 | REST |

◎ = 우수 (자연스럽고 정확함), ○ = 양호 (사용 가능 수준)

### 서비스 선택 기준

- **무료로 빠르게 시작**: Edge TTS (설치 후 즉시 사용)
- **고품질 한국어**: Naver CLOVA 또는 Google Cloud TTS
- **다국어 + 감정 표현**: ElevenLabs
- **OpenAI 통합 프로젝트**: OpenAI TTS

---

## 스크립트 → 나레이션 추출 규칙

`scripts/script-{N}.md` 파일에서 나레이션 텍스트만 추출하여 TTS에 입력한다.

### 추출 프로세스

```
1. scripts/*.md 파일에서 ## 나레이션 섹션 추출
2. [VISUAL], [TRANSITION], [TEXT-ON-SCREEN], [HIGHLIGHT] 태그 제거
3. 마크다운 문법 제거 (**, __, ##, - 등)
4. 숫자 및 약어 풀어쓰기 (발음 정확도 향상)
5. SSML 태그 추가 (선택: 속도, 강조, 일시정지)
6. TTS API로 전송
```

### 약어 및 숫자 변환 규칙

TTS가 올바르게 발음하도록 나레이션 텍스트를 전처리한다.

```
# 약어 변환 예시
API     → "에이피아이" (또는 풀어쓰기: "Application Programming Interface")
CPU     → "씨피유"
URL     → "유알엘"
npm     → "엔피엠"
CLI     → "씨엘아이"

# 숫자 변환 예시
1,000   → "천" 또는 "일천"
100%    → "백 퍼센트"
v2.0    → "버전 2.0"
2024년  → "이천이십사년"

# 특수문자 제거
코드(code)  → "코드"
React.memo  → "리액트 메모"
```

### SSML 활용 (고급)

Google Cloud TTS, Azure TTS는 SSML(Speech Synthesis Markup Language)을 지원한다.

```xml
<speak>
  안녕하세요.
  <break time="500ms"/>
  오늘은 React Hook에 대해 알아보겠습니다.
  <emphasis level="strong">useState</emphasis>는
  가장 기본적인 Hook입니다.
  <break time="300ms"/>
  지금부터 시작합니다.
</speak>
```

SSML 태그 목록:

| 태그 | 기능 | 예시 |
|------|------|------|
| `<break>` | 일시정지 | `<break time="500ms"/>` |
| `<emphasis>` | 강조 | `<emphasis level="strong">` |
| `<prosody>` | 속도/음량 조절 | `<prosody rate="slow">` |
| `<say-as>` | 읽기 방식 지정 | `<say-as interpret-as="cardinal">2024</say-as>` |

---

## 씬별 MP3 생성

### 출력 파일 규칙

```
public/audio/narration/
├── scene-01.mp3
├── scene-02.mp3
├── scene-03.mp3
└── ...

파일명 규칙: scene-{두자리숫자}.mp3
샘플레이트: 44100Hz
비트레이트: 128kbps 이상
채널: 모노 (스테레오 불필요)
```

---

## 타이밍 정보 생성

나레이션 MP3 생성 후, 각 파일의 길이를 측정하여 `timing.json`을 생성한다.
이 파일은 Remotion의 `durationInFrames` 계산에 활용된다.

### `public/audio/narration/timing.json`

```json
{
  "fps": 30,
  "scenes": [
    {
      "id": "scene-01",
      "file": "scene-01.mp3",
      "duration": 15.2,
      "durationInFrames": 456
    },
    {
      "id": "scene-02",
      "file": "scene-02.mp3",
      "duration": 22.8,
      "durationInFrames": 684
    }
  ],
  "totalDuration": 38.0,
  "totalDurationInFrames": 1140
}
```

### durationInFrames 계산 공식

```
durationInFrames = Math.ceil(duration × fps)

예: 15.2초 × 30fps = Math.ceil(456) = 456프레임
```

### MP3 길이 측정 명령어

```bash
# ffprobe로 MP3 길이 측정
ffprobe -v quiet -show_entries format=duration \
  -of default=noprint_wrappers=1:nokey=1 \
  public/audio/narration/scene-01.mp3

# Python으로 일괄 측정 및 JSON 생성
python3 -c "
import os, json, subprocess

scenes = []
narration_dir = 'public/audio/narration'
fps = 30

for filename in sorted(os.listdir(narration_dir)):
    if filename.endswith('.mp3') and filename.startswith('scene-'):
        filepath = os.path.join(narration_dir, filename)
        result = subprocess.run(
            ['ffprobe', '-v', 'quiet', '-show_entries', 'format=duration',
             '-of', 'default=noprint_wrappers=1:nokey=1', filepath],
            capture_output=True, text=True
        )
        duration = float(result.stdout.strip())
        scene_id = filename.replace('.mp3', '')
        scenes.append({
            'id': scene_id,
            'file': filename,
            'duration': round(duration, 2),
            'durationInFrames': int(duration * fps + 0.999)
        })

total = sum(s['duration'] for s in scenes)
output = {
    'fps': fps,
    'scenes': scenes,
    'totalDuration': round(total, 2),
    'totalDurationInFrames': int(total * fps + 0.999)
}
print(json.dumps(output, indent=2, ensure_ascii=False))
"
```

---

## .env API 키 관리

```bash
# .env 파일 (절대 git에 커밋하지 않는다)

# ElevenLabs
ELEVENLABS_API_KEY=
ELEVENLABS_VOICE_ID=

# Google Cloud TTS
GOOGLE_TTS_API_KEY=
GOOGLE_APPLICATION_CREDENTIALS=./credentials/google-service-account.json

# Azure TTS
AZURE_TTS_KEY=
AZURE_TTS_REGION=koreacentral

# OpenAI
OPENAI_API_KEY=

# Naver CLOVA
NAVER_CLIENT_ID=
NAVER_CLIENT_SECRET=
```

`.gitignore`에 반드시 포함:

```
.env
.env.local
credentials/
*.pem
*.json.key
```

---

## 서비스별 CLI 명령어

### Edge TTS (무료, 즉시 사용 가능)

```bash
# 설치
pip install edge-tts

# 사용 가능한 한국어 목소리 확인
edge-tts --list-voices | grep ko-KR

# 나레이션 생성
edge-tts \
  --voice ko-KR-SunHiNeural \
  --text "안녕하세요. 오늘은 React Hook을 배워보겠습니다." \
  --write-media public/audio/narration/scene-01.mp3

# 파일로부터 입력
edge-tts \
  --voice ko-KR-SunHiNeural \
  --file narration-texts/scene-01.txt \
  --write-media public/audio/narration/scene-01.mp3

# 주요 한국어 목소리
# ko-KR-SunHiNeural    - 여성, 밝고 친절한 톤
# ko-KR-InJoonNeural   - 남성, 안정적인 톤
```

---

### ElevenLabs

```bash
# 목소리 목록 확인
curl -H "xi-api-key: $ELEVENLABS_API_KEY" \
  https://api.elevenlabs.io/v1/voices | jq '.voices[].name'

# 나레이션 생성
curl -X POST \
  "https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}" \
  -H "xi-api-key: $ELEVENLABS_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "안녕하세요. 오늘은 React Hook을 배워보겠습니다.",
    "model_id": "eleven_multilingual_v2",
    "voice_settings": {
      "stability": 0.5,
      "similarity_boost": 0.75
    }
  }' \
  --output public/audio/narration/scene-01.mp3
```

---

### Google Cloud TTS

```bash
# 나레이션 생성 (JSON body)
curl -X POST \
  "https://texttospeech.googleapis.com/v1/text:synthesize?key=${GOOGLE_TTS_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "input": { "text": "안녕하세요. 오늘은 React Hook을 배워보겠습니다." },
    "voice": {
      "languageCode": "ko-KR",
      "name": "ko-KR-Wavenet-C",
      "ssmlGender": "FEMALE"
    },
    "audioConfig": {
      "audioEncoding": "MP3",
      "speakingRate": 1.0,
      "pitch": 0.0
    }
  }' | jq -r '.audioContent' | base64 --decode > public/audio/narration/scene-01.mp3
```

---

### OpenAI TTS

```bash
# 나레이션 생성
curl -X POST https://api.openai.com/v1/audio/speech \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "tts-1-hd",
    "voice": "alloy",
    "input": "안녕하세요. 오늘은 React Hook을 배워보겠습니다.",
    "speed": 1.0
  }' \
  --output public/audio/narration/scene-01.mp3

# 목소리 옵션: alloy, echo, fable, onyx, nova, shimmer
```

---

## TTS 스킵 옵션

TTS 없이 직접 녹음하거나 나중에 추가할 경우, Phase 2a를 건너뛴다.

```bash
# 스킵 시 빈 플레이스홀더 생성 (Remotion 오류 방지용)
# 각 씬에 대해 무음 MP3 생성
ffmpeg -f lavfi -i anullsrc=r=44100:cl=mono \
  -t 10 -q:a 9 -acodec libmp3lame \
  public/audio/narration/scene-01.mp3
```

스킵 시 `timing.json`에 스크립트 기반 예상 시간을 수동으로 입력한다.

---

## Remotion에서 타이밍 정보 활용

```tsx
// src/lib/timing.ts
import timingData from '../../public/audio/narration/timing.json';

export const getSceneDuration = (sceneId: string): number => {
  const scene = timingData.scenes.find((s) => s.id === sceneId);
  return scene?.durationInFrames ?? 150; // 기본값 5초
};

// 사용 예시 (Root.tsx)
import { getSceneDuration } from './lib/timing';

<Composition
  id="Scene01"
  component={Scene01Intro}
  durationInFrames={getSceneDuration('scene-01')}
  fps={30}
  width={1920}
  height={1080}
/>
```

---

## 주의사항

- TTS는 선택 사항이다. 직접 녹음도 완전히 유효한 방법이다
- API 키는 반드시 `.env` 파일에만 보관하고 git에 커밋하지 않는다
- 긴 텍스트(500자 이상)는 API 제한으로 인해 분할 요청이 필요할 수 있다
- 생성된 MP3의 실제 길이를 측정하여 `timing.json`을 정확히 작성해야 한다
- TTS 목소리는 프로젝트 전체에서 동일한 목소리를 사용한다 (일관성)
- Edge TTS는 무료이지만 속도 조절이 제한적이다 — 상업용 프로젝트에는 유료 서비스를 권장한다
