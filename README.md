# ON AIR · 온에어

> 80년대 브라운관 TV 감성으로 보는 **전세계 지상파·뉴스 라이브 스트리밍**.
> 한 페이지짜리 PWA — webOS / Tizen 스마트TV에서도 바로 동작합니다.

## 콘텐츠

| 종류 | 예시 | 재생 방식 |
|---|---|---|
| **유튜브 라이브 / 플레이리스트** | KBS, MBC, SBS, JTBC, YTN, BBC, CNN, NBC, Bloomberg, Al Jazeera 등 50+ 채널 | youtube-nocookie 임베드 |
| **공개 HLS 24/7 라이브** | DW (EN/DE), France 24 (EN/FR), Al Jazeera (EN/AR), NHK World, Euronews, ABC News Live | `<video>` + hls.js |
| **공식 라이브 링크** | 한국 지상파 본채널 (KBS / MBC / SBS / EBS) | 새 창에서 공식 플레이어 이동 |

> ⚠️ HLS 스트림은 사업자 측 변경/지역제한으로 끊길 수 있습니다. URL은 `onair-prototype.html` 의 `CHANNELS` 배열에서 관리하세요.

## 실행 방법

### 1) 로컬 / 모바일 / PC 브라우저

```bash
# 정적 서버 아무거나
python3 -m http.server 8080
# 또는
npx serve .
```

브라우저에서 `http://localhost:8080/onair-prototype.html` 열기.

### 2) GitHub Pages

`main` 또는 `claude/tv-streaming-app-4xy3t` 브랜치로 푸시하면 `.github/workflows/pages.yml` 이 자동 배포합니다. 저장소 Settings → Pages → Source: **GitHub Actions** 로 설정해 두세요.

배포 후 TV 브라우저에서:
```
https://<USER>.github.io/<REPO>/
```
로 접속하면 자동으로 `onair-prototype.html` 로 리다이렉트됩니다. webOS / Tizen User-Agent 가 감지되면 **TV 모드(리모컨 네비게이션)** 가 자동 활성화됩니다.

### 3) webOS .ipk 설치 (LG 스마트TV)

#### 사전 준비
1. TV에서 [개발자 모드 앱](https://us.lgaccount.com/login/sign_in) 설치 후 활성화
2. 개발자 PC에서:
   ```bash
   npm install -g @webosose/ares-cli
   ares-setup-device          # TV 등록 (이름: tv)
   ```

#### 빌드 + 설치
```bash
bash scripts/package-webos.sh                  # build/com.onair.tv_0.14.0_all.ipk 생성
bash scripts/package-webos.sh install          # 빌드 + TV 설치
bash scripts/package-webos.sh install launch   # 빌드 + 설치 + 실행
```

다른 TV 디바이스 이름을 쓰는 경우:
```bash
TV_DEVICE=mytv bash scripts/package-webos.sh install
```

## 파일 구조

```
.
├── onair-prototype.html      # 단일 파일 SPA (메인)
├── manifest.json             # PWA 매니페스트
├── sw.js                     # 서비스 워커
├── appinfo.json              # webOS 앱 매니페스트
├── icon-180.png / icon-192.png / icon-512.png
├── scripts/
│   └── package-webos.sh      # .ipk 패키징 헬퍼
└── .github/workflows/
    └── pages.yml             # GitHub Pages 자동 배포
```

## 리모컨 / 키보드 단축키 (TV 모드)

| 키 | 동작 |
|---|---|
| ↑ ↓ | 채널 포커스 이동 |
| ← → | 이전/다음 재생 가능 채널로 점프 |
| OK / Enter | 재생 |
| 0–9 | 채널 번호 직접 점프 |
| Back (webOS 461 / Tizen 10009) | 포커스 갱신 |

TV 모드는 `?tv=1` 쿼리 파라미터 또는 webOS/Tizen UA 자동 감지로 활성화됩니다.

## 채널 추가 / 수정

`onair-prototype.html` 의 `const CHANNELS = [...]` 배열을 편집:

```js
// 유튜브 라이브
{ num:"01", code:"FOO", name:"채널명", type:"youtube", country:"kr",
  ytId:"UCxxxxxx", color:"#FF0000", program:"표시 텍스트", desc:"설명" },

// 유튜브 특정 비디오
{ ..., type:"youtube_video", videoId:"YYYYYY" },

// 유튜브 채널 최신업로드 자동재생
{ ..., type:"playlist", ytId:"UCxxxxxx" },

// 공개 HLS 라이브
{ ..., type:"hls", hlsUrl:"https://.../master.m3u8" },

// 외부 공식 플레이어
{ ..., type:"link", url:"https://..." },
```

## 라이선스 / 책임

이 프로젝트는 각 방송사가 **공개적으로 제공한** 유튜브 임베드 / HLS 마스터 매니페스트만 사용합니다. 비공개·DRM 보호된 스트림은 포함되지 않습니다. 채널/스트림의 가용성은 각 방송사 정책에 따릅니다.
