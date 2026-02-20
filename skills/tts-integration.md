# TTS 서비스 연동 가이드

## 개요

스크립트 나레이션을 TTS(Text-to-Speech)로 자동 생성하는 가이드.
TTS는 선택 사항(optional)이며, 직접 녹음을 선호하는 경우 이 단계를 건너뛸 수 있다.

---

## TTS 서비스 비교

| 서비스 | 품질 | 한국어 지원 | 가격 | API | 음성 클로닝 |
|--------|------|------------|------|-----|------------|
| Qwen3-TTS | ★★★★★ | ◎ 우수 | 완전 무료 | 로컬 CLI | ◎ 3초 샘플로 클로닝 |
| ElevenLabs | ★★★★★ | ○ 양호 | $5/month~ | REST | ○ 유료 |
| Google Cloud TTS | ★★★★ | ◎ 우수 | 무료 티어 있음 | REST / gRPC | ✗ |
| Azure TTS | ★★★★ | ◎ 우수 | 무료 티어 있음 | REST | ○ 유료 |
| OpenAI TTS | ★★★★ | ○ 양호 | $15/1M chars | REST | ✗ |
| Edge TTS | ★★★ | ◎ 우수 | 완전 무료 | CLI | ✗ |
| Naver CLOVA | ★★★★ | ◎ 최우수 | 유료 | REST | ✗ |

◎ = 우수 (자연스럽고 정확함), ○ = 양호 (사용 가능 수준)

### 서비스 선택 기준

- **본인 목소리 클로닝 (무료)**: Qwen3-TTS (3~5초 샘플로 음성 복제, 로컬 실행)
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
{PUBLIC}/narration/
├── scene-01.mp3
├── scene-02.mp3
├── scene-03.mp3
└── ...

파일명 규칙: scene-{두자리숫자}.mp3
샘플레이트: 24000Hz (Qwen3-TTS 기본) 또는 44100Hz
비트레이트: 128kbps 이상 (MP3 변환 시 192kbps 권장)
채널: 모노 (스테레오 불필요)
```

---

## 타이밍 정보 생성

나레이션 MP3 생성 후, 각 파일의 길이를 측정하여 `timing.json`을 생성한다.
이 파일은 Remotion의 `durationInFrames` 계산에 활용된다.

### `{VIDEO}/timing.json`

```json
{
  "scene-01": {
    "audio_duration": 10.0,
    "duration_with_padding": 11.0,
    "frames": 330,
    "seconds": 11.0
  },
  "scene-02": {
    "audio_duration": 21.28,
    "duration_with_padding": 22.28,
    "frames": 690,
    "seconds": 23.0
  },
  "_total": {
    "frames": 1020,
    "seconds": 34.0,
    "minutes": 0.57
  }
}
```

### durationInFrames 계산 공식

```
1. ffprobe로 MP3 실제 길이(초) 측정
2. 1초 여유(padding) 추가: duration_with_padding = audio_duration + 1.0
3. 30프레임 단위로 올림: frames = Math.ceil(duration_with_padding * fps / 30) * 30

예: 21.28초 오디오 → +1초 = 22.28초 → 22.28 * 30 = 668.4 → 30단위 올림 = 690프레임 (23초)
```

### MP3 길이 측정 및 timing.json 생성

```bash
# ffprobe로 MP3 길이 측정
ffprobe -v quiet -show_entries format=duration \
  -of default=noprint_wrappers=1:nokey=1 \
  {PUBLIC}/narration/scene-01.mp3

# Python으로 일괄 측정 및 timing.json 생성
python3 -c "
import os, json, subprocess, math

narration_dir = '{PUBLIC}/narration'  # 실제 경로로 교체
output_path = '{VIDEO}/timing.json'   # 실제 경로로 교체
fps = 30

timing = {}
total_frames = 0

for filename in sorted(os.listdir(narration_dir)):
    if filename.endswith('.mp3') and filename.startswith('scene-'):
        filepath = os.path.join(narration_dir, filename)
        result = subprocess.run(
            ['ffprobe', '-v', 'quiet', '-show_entries', 'format=duration',
             '-of', 'default=noprint_wrappers=1:nokey=1', filepath],
            capture_output=True, text=True
        )
        audio_dur = round(float(result.stdout.strip()), 2)
        padded = audio_dur + 1.0
        frames = math.ceil(padded * fps / 30) * 30
        seconds = frames / fps

        scene_id = filename.replace('.mp3', '')
        timing[scene_id] = {
            'audio_duration': audio_dur,
            'duration_with_padding': round(padded, 2),
            'frames': frames,
            'seconds': seconds
        }
        total_frames += frames

timing['_total'] = {
    'frames': total_frames,
    'seconds': round(total_frames / fps, 1),
    'minutes': round(total_frames / fps / 60, 1)
}

with open(output_path, 'w') as f:
    json.dump(timing, f, indent=2, ensure_ascii=False)
print(json.dumps(timing, indent=2, ensure_ascii=False))
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

## Qwen3-TTS (로컬 음성 클로닝)

Qwen3-TTS는 Alibaba Qwen 팀이 개발한 오픈소스 TTS 모델로,
3~5초의 짧은 음성 샘플만으로 본인 목소리를 클로닝할 수 있다.
완전 무료이며 로컬에서 실행되어 API 키가 필요 없다.

### 설치

```bash
# 필수 패키지
pip install -U qwen-tts

# MP3 변환용 (선택)
brew install ffmpeg
```

- Python >= 3.9 필요 (macOS 기본 Python이 아닌 별도 설치 버전 사용 권장, 예: Python 3.11)
- **Apple Silicon: MPS 비호환** — `matmul` 차원 오류 발생. 반드시 **CPU 모드**(`device_map="cpu"`, `dtype=torch.float32`)로 실행
- 0.6B 모델: ~3GB RAM / 1.7B 모델: ~6GB RAM
- 모델은 최초 실행 시 HuggingFace에서 자동 다운로드 (~2.5GB)

### 음성 샘플 (레퍼런스 오디오) 준비 가이드

좋은 음성 클로닝 결과를 위한 녹음 가이드:

```
권장 사양:
- 길이: 10~30초 (최소 3초, 길수록 품질 향상)
- 포맷: wav 또는 mp3 (44100Hz, 모노 권장)
- 환경: 조용한 공간, 반향 없는 곳
- 내용: 자연스럽게 읽는 문장 (감정 표현 포함 가능)
- 금지: 배경 음악, 노이즈, 여러 사람 목소리

녹음 도구:
- macOS: QuickTime Player → 새로운 오디오 녹음
- 스마트폰: 기본 녹음 앱 (조용한 환경에서)
- 전문: Audacity (무료, 노이즈 제거 기능)
```

### 레퍼런스 오디오 저장 경로

```
{PUBLIC}/assets/
├── my-voice.wav           ← 본인 목소리 레퍼런스 (10~30초)
└── my-voice.m4a           ← 원본 녹음 (변환 전 백업)
```

- 한 프로젝트에서 동일한 레퍼런스를 사용 (목소리 일관성)
- assets/ 폴더는 git에 포함 (공유 가능)
- `x_vector_only_mode=True` 사용 시 레퍼런스 텍스트(대사) 불필요 — 음성 특성만 추출

### Python API (권장 방식)

프로젝트별 `scripts/generate-tts.py`를 생성하여 씬별 나레이션을 일괄 생성한다.

```python
from qwen_tts import Qwen3TTSModel
import torch, soundfile as sf

# 모델 로드 (MPS 비호환 → CPU 필수)
model = Qwen3TTSModel.from_pretrained(
    "Qwen/Qwen3-TTS-12Hz-0.6B-Base",
    device_map="cpu",
    dtype=torch.float32,
)

# 음성 클론 프롬프트 (x_vector_only_mode: 레퍼런스 텍스트 불필요)
voice_prompt = model.create_voice_clone_prompt(
    ref_audio="{PUBLIC}/assets/my-voice.wav",
    x_vector_only_mode=True,
)

# 나레이션 생성
wavs, sr = model.generate_voice_clone(
    text="안녕하세요. 오늘은 연말정산 꿀팁을 알려드릴게요.",
    language="Korean",
    voice_clone_prompt=voice_prompt,
)

# WAV 저장 → ffmpeg로 MP3 변환
sf.write("scene-01.wav", wavs[0], sr)
# ffmpeg -y -i scene-01.wav -codec:a libmp3lame -b:a 192k scene-01.mp3
```

### 실행 방법

```bash
# 전체 씬 일괄 생성 (Python 3.11 사용 — macOS 기본 Python은 호환성 문제 가능)
/Library/Frameworks/Python.framework/Versions/3.11/bin/python3 scripts/generate-tts.py

# 특정 씬만 재생성
python3 scripts/generate-tts.py scene-03 scene-07
```

### 주요 주의사항

- **MPS(Apple Metal) 사용 불가**: `loc("mps_matmul")` 차원 오류 발생. 반드시 `device_map="cpu"` 사용
- **Python 버전**: macOS 기본 Python(3.14 등)에 qwen-tts가 설치 안 될 수 있음. `python3.11` 등 별도 버전 경로 지정
- **x_vector_only_mode=True**: 레퍼런스 오디오의 대사 텍스트를 몰라도 음성 특성만으로 클로닝 가능
- CPU 모드에서 11개 씬(~5.5분 분량) 생성에 약 8~10분 소요

### 모델 비교

| 모델 | 크기 | RAM | 용도 |
|------|------|-----|------|
| `base-0.6b` (기본) | 0.6B | ~3GB | 빠른 생성, 일반 품질 |
| `base-1.7b` | 1.7B | ~6GB | 높은 품질, 더 자연스러운 억양 |

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
