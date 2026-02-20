#!/usr/bin/env python3
"""Qwen3-TTS 음성 클로닝 나레이션 생성 스크립트"""

import sys
import os
import time
import torch
import soundfile as sf
import subprocess
from qwen_tts import Qwen3TTSModel

# 경로 설정
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
REF_AUDIO = os.path.join(PROJECT_ROOT, "public/videos/explainers/year-end-tax-tips/assets/my-voice.wav")
OUTPUT_DIR = os.path.join(PROJECT_ROOT, "public/videos/explainers/year-end-tax-tips/narration")

# 씬별 나레이션 텍스트
SCENES = {
    "scene-01": "연봉 똑같이 3,500만 원. A씨는 52만 원 환급받았습니다. B씨는 286만 원 환급받았습니다. 두 사람의 차이, 뭘까요?",

    "scene-02": "비결은 하나입니다. 아는 만큼 돌려받는 거예요. 직장인 평균 환급액, 68만 원. 근데 꿀팁 몇 개만 알면요? 수백만 원이 통장에 꽂힙니다. 국세청 자료에서 확인된 실제 숫자예요. 공제 항목을 제대로 챙기면, 같은 연봉으로 전혀 다른 결과가 나옵니다. 오늘, 그 방법 다 알려드릴게요.",

    "scene-03": "첫 번째 꿀팁, 모르면 1,000만 원 손해입니다. 중소기업에 다니는 청년이라면요. 소득세를 90%나 깎아줍니다. 연간 최대 200만 원. 5년이면 1,000만 원이에요. 조건 확인해보세요. 만 15세에서 34세 이하. 군 복무 기간은 빼줘서, 실질적으론 만 40세까지 가능합니다. 회사 자산이 5,000억 원 미만인 중소기업이면 됩니다. 나 이미 그 기간 지났는데? 괜찮아요. 경정청구로 최대 5년 소급 적용 가능합니다. 지금 당장 홈택스 들어가서 확인하세요. 신청 안 하면 그냥 날리는 돈이에요. 회사가 알아서 해주지 않습니다.",

    "scene-04": "두 번째 꿀팁입니다. 연금저축 계좌, 있으신가요? 없으면 지금 만들어야 합니다. IRP랑 같이 쓰면, 최대 148만 원 돌려받습니다. 방법은 간단해요. 연금저축에 600만 원, IRP에 300만 원. 합쳐서 900만 원 납입하면 됩니다. 총급여 5,500만 원 이하라면요. 공제율이 16.5%라서, 148만 5천 원 환급입니다. 5,500만 원 초과라도 13.2%, 118만 원이 돌아와요. 주의할 점 하나. 12월 31일까지 납입해야 합니다. 연말 마감이 코앞이면, 지금 당장 이체하세요. 노후 준비도 하고, 세금도 아끼는 겁니다. 일석이조예요.",

    "scene-05": "세 번째 꿀팁, 이건 진짜 신기합니다. 10만 원을 기부하면, 돈이 생겨요. 고향사랑기부제입니다. 10만 원 기부하면, 세금 10만 원 전액 환급됩니다. 거기에 답례품 3만 원이 또 옵니다. 기부했는데 오히려 3만 원이 생기는 거예요. 이걸 모르면 3만 원 손해입니다. 신청은 고향사랑이음 사이트에서 하면 됩니다. 10만 원 초과분은 15% 공제율이고요. 2025년부터 한도가 2,000만 원으로 확대됐습니다.",

    "scene-06": "월세 내는 분들, 집중하세요. 2025년부터 기준이 확 바뀌었습니다. 소득 기준이 7,000만 원에서 8,000만 원으로 올랐고요. 공제 한도도 750만 원에서 1,000만 원으로 늘었습니다. 총급여 5,500만 원 이하라면 공제율 17%. 월세 1,000만 원 한도로 최대 170만 원 돌려받습니다. 조건 세 가지만 확인하세요. 첫째, 본인과 가족 모두 무주택자. 둘째, 임대차계약서 주소와 주민등록 주소 일치. 셋째, 계좌이체로 월세 납부 내역 보관. 이 세 가지 안 맞으면 공제 불가예요. 지금 바로 확인해 보세요.",

    "scene-07": "2025년에 새로 생긴 공제 두 가지입니다. 첫 번째, 결혼세액공제. 올해 결혼하셨나요? 부부 각각 50만 원, 합산 100만 원 세액공제입니다. 재혼도 됩니다. 나이 제한도 없어요. 2024년부터 2026년까지 한시 적용이니까, 놓치지 마세요. 두 번째, 헬스장 소득공제. 2025년 7월부터 시작됐습니다. 총급여 7,000만 원 이하라면, 공제율 30%. 헬스장 월 10만 원씩 내면 연간 36만 원 돌려받습니다. 단, 등록된 사업자 헬스장만 가능하니까 미리 확인하세요. 운동도 하고 세금도 아끼는 거예요.",

    "scene-08": "이제 실수 이야기 해볼게요. 이거 잘못하면 오히려 가산세 맞습니다. 실수 1번, 맞벌이 부부 공제 배분. 소득이 높은 쪽에 공제를 몰아주는 게 맞아요. 근데 의료비만 반대입니다. 의료비는 소득 낮은 배우자에게 몰아주세요. 이유는 총급여의 3% 초과분부터 공제되기 때문입니다. 소득이 낮을수록 기준선이 낮아서 더 많이 공제돼요. 홈택스에 맞벌이 절세 안내 기능 있으니 꼭 써보세요. 실수 2번, 부양가족 중복 공제. 부모님 공제를 형제 둘이서 같이 받으면 한 명은 가산세입니다. 연간 소득금액 100만 원 이하인 분만 공제 대상이에요. 근로소득만 있으면 총급여 500만 원 이하여야 합니다. 실수 3번, 실손보험금 미차감. 의료비 쓰고 실손보험금 받았으면, 그 금액은 빼야 해요. 안 빼면 가산세 나옵니다.",

    "scene-09": "신용카드 쓰는 순서도 중요합니다. 연봉의 25%까지는 신용카드로 쓰세요. 포인트 혜택이 있으니까요. 25% 넘어가는 순간부터는 체크카드로 전환하세요. 체크카드 공제율이 30%로 더 높습니다. 전통시장이나 대중교통은 40%까지 올라가요. 그리고 자녀 있으신 분들, 올해 공제 확 늘었습니다. 첫째 25만 원, 둘째 30만 원, 셋째 40만 원. 셋째 낳으셨으면요? 출산공제 70만 원이 추가됩니다. 합치면 110만 원이에요. 본인이 대학원 다니시는 분도 있죠? 본인 교육비는 한도가 없습니다. 전액 15% 공제예요. 직업훈련비도 포함됩니다.",

    "scene-10": "오늘 배운 것 정리해볼게요. 중소기업 청년이라면, 90% 소득세 감면 신청했나요? 연금저축 IRP, 900만 원 납입 완료했나요? 고향사랑기부제 10만 원, 챙겼나요? 월세 내고 있다면, 주소 일치 확인했나요? 올해 결혼하셨으면, 결혼세액공제 신청하세요. 신용카드 25% 넘었으면, 지금부터 체크카드 쓰세요. 이 여섯 가지만 챙겨도, 평균 68만 원에서 수백만 원으로 달라집니다.",

    "scene-11": "연말정산, 어렵지 않습니다. 아는 만큼 돌려받는 거예요. 영상 도움이 됐다면 구독 눌러주세요. 다음 영상에서는 프리랜서 종합소득세 신고 꿀팁 다룹니다. 그것도 모르면 수십만 원 날려요.",
}

def main():
    # 특정 씬만 생성할 수 있도록 인자 지원
    target_scenes = sys.argv[1:] if len(sys.argv) > 1 else list(SCENES.keys())

    print(f"=== Qwen3-TTS 음성 클로닝 나레이션 생성 ===")
    print(f"레퍼런스 오디오: {REF_AUDIO}")
    print(f"출력 디렉토리: {OUTPUT_DIR}")
    print(f"대상 씬: {', '.join(target_scenes)}")
    print()

    # 디바이스: CPU 사용 (MPS는 Qwen3-TTS matmul 호환 문제)
    device = "cpu"
    dtype = torch.float32
    print("디바이스: CPU")

    # 모델 로드
    print("\n모델 로딩 중... (첫 실행 시 ~2.5GB 다운로드)")
    start = time.time()

    model = Qwen3TTSModel.from_pretrained(
        "Qwen/Qwen3-TTS-12Hz-0.6B-Base",
        device_map=device,
        dtype=dtype,
    )
    print(f"모델 로드 완료 ({time.time() - start:.1f}초)")

    # 음성 클론 프롬프트 생성 (x_vector_only_mode: 레퍼런스 텍스트 불필요)
    print("\n음성 클론 프롬프트 생성 중...")
    voice_prompt = model.create_voice_clone_prompt(
        ref_audio=REF_AUDIO,
        x_vector_only_mode=True,
    )
    print("음성 클론 프롬프트 생성 완료")

    # 씬별 나레이션 생성
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    for scene_name in target_scenes:
        if scene_name not in SCENES:
            print(f"\n[SKIP] {scene_name} - 텍스트 없음")
            continue

        text = SCENES[scene_name]
        output_wav = os.path.join(OUTPUT_DIR, f"{scene_name}.wav")
        output_mp3 = os.path.join(OUTPUT_DIR, f"{scene_name}.mp3")

        print(f"\n[{scene_name}] 생성 중... ({len(text)}자)")
        scene_start = time.time()

        try:
            wavs, sr = model.generate_voice_clone(
                text=text,
                language="Korean",
                voice_clone_prompt=voice_prompt,
            )

            # WAV 저장
            sf.write(output_wav, wavs[0], sr)
            duration = len(wavs[0]) / sr
            print(f"[{scene_name}] WAV 저장 완료: {duration:.1f}초 ({time.time() - scene_start:.1f}초 소요)")

            # MP3 변환 (ffmpeg)
            try:
                subprocess.run([
                    "ffmpeg", "-y", "-i", output_wav,
                    "-codec:a", "libmp3lame", "-b:a", "192k",
                    output_mp3
                ], capture_output=True, check=True)
                print(f"[{scene_name}] MP3 변환 완료")
                # WAV 삭제 (MP3만 보관)
                os.remove(output_wav)
            except (subprocess.CalledProcessError, FileNotFoundError):
                print(f"[{scene_name}] MP3 변환 실패 - WAV 유지")

        except Exception as e:
            print(f"[{scene_name}] 생성 실패: {e}")
            import traceback
            traceback.print_exc()

    print(f"\n=== 전체 완료 (총 {time.time() - start:.1f}초) ===")
    print(f"출력: {OUTPUT_DIR}")

    # 결과 요약
    files = [f for f in os.listdir(OUTPUT_DIR) if f.endswith(('.mp3', '.wav'))]
    files.sort()
    for f in files:
        path = os.path.join(OUTPUT_DIR, f)
        size_kb = os.path.getsize(path) / 1024
        print(f"  {f} ({size_kb:.0f}KB)")

if __name__ == "__main__":
    main()
