# 식물 관찰 학습 웹앱

## 준비물

- Windows
- Node.js 18 이상
- Docker에서 실행 중인 AnythingLLM
- AnythingLLM Developer API 키

## 실행 방법

1. `.env.example`을 `.env`로 복사하고 메모장으로 엽니다.
2. 다음 두 항목을 입력하고 저장합니다.

   ```env
   ANYTHINGLLM_API_KEY=발급받은_Developer_API_키
   ANYTHINGLLM_WORKSPACE_SLUG=워크스페이스_slug
   ```

   `workspace slug`는 AnythingLLM 워크스페이스 주소의 `/workspace/` 뒤에
   표시되는 값입니다.

3. Docker AnythingLLM이 `http://localhost:3001`에서 실행 중인지 확인합니다.
4. `start.bat`을 더블 클릭합니다.
5. 브라우저에서 `http://127.0.0.1:8765`를 엽니다.

`.env`를 수정했다면 실행 중인 서버 창에서 `Ctrl+C`를 누른 후
`start.bat`을 다시 실행해야 합니다.

## 보안 및 기능 안내

- API 키는 브라우저로 전달되지 않고 로컬 Node.js 서버에서만 사용됩니다.
- `.env`는 Git에 포함되지 않습니다.
- 왼쪽에서 선택한 사진과 문서(워드, 파워포인트, 엑셀, 텍스트, PDF 등)는 질문과 함께 AnythingLLM으로 전송됩니다.
- AI가 생성한 파일이 AnythingLLM에서 오지 않더라도, 워드/엑셀/텍스트 요청이면 웹앱이 답변 본문으로 파일을 만들어 첨부합니다.
- 이미지는 비전 모델이 직접 보고, 문서는 AnythingLLM 문서 처리기로 읽힌 뒤 답변에 사용됩니다.
- 첨부 없이 글로만 질문할 수도 있습니다.

## Railway 배포

같은 Railway 프로젝트 및 환경에 학습 웹앱과 AnythingLLM을 배포합니다.
`.railway/railway.ts`는 GitHub의 `main`에서 웹앱을 빌드하고,
AnythingLLM의 Railway용 Docker 이미지와 `/storage` 영구 볼륨을 추가합니다.

1. Node.js 22 이상과 최신 Railway CLI를 사용합니다. 저장소를 복제한 디렉터리에서
   다음 명령을 실행하고 대상 Railway 프로젝트와 환경을 선택합니다.

   ```bash
   npm install --no-save --package-lock=false railway@3.17.0
   railway login
   railway link
   railway config plan
   railway config apply
   ```

   프로젝트에 두 서비스 이름 중 하나가 이미 있다면 계획에서 해당 서비스의 변경을
   확인합니다. 웹앱의 GitHub 저장소 선택에 권한이 필요하면 Railway의 GitHub 연결에서
   이 저장소를 허용합니다.

2. `plant-observation` 서비스의 **Settings → Networking → Generate Domain**에서
   학습 페이지 주소를 만듭니다.
3. AnythingLLM에 모델과 워크스페이스를 설정하고 **Developer API**에서 키를 발급합니다.
   관리 화면 접속을 위해 도메인이 필요하면 `anythingllm` 서비스에 먼저
   `AUTH_TOKEN`과 별도의 무작위 `JWT_SECRET`을 설정한 후 포트 `3001`의
   Railway 도메인을 사용합니다. 설정이 끝나면 관리용 도메인은 제거해도 됩니다.
4. `plant-observation` 서비스의 **Variables**에 아래 값을 추가하고 배포합니다.

   | 변수 | 값 |
   | --- | --- |
   | `ANYTHINGLLM_API_KEY` | AnythingLLM에서 발급한 Developer API 키 |
   | `ANYTHINGLLM_WORKSPACE_SLUG` | 워크스페이스 주소에서 `/workspace/` 다음에 오는 부분 |

   `ANYTHINGLLM_URL`은 배포 구성에서 AnythingLLM의 Railway 내부 주소를 참조합니다.
   배포 구성을 다시 적용하기 전에 `railway config plan`에서 Dashboard에 추가한
   변수가 삭제 대상에 포함되는지 확인합니다.
5. 학습 페이지에서 `AnythingLLM 연결됨`을 확인하고 식물 관찰 질문을 보냅니다.
   연결 표시는 API 키와 워크스페이스가 확인되었음을 뜻합니다. 모델의 답변까지
   받으면 대화 설정이 완료된 것입니다.

[Railway 배포 구성 안내](https://docs.railway.com/infrastructure-as-code) ·
[AnythingLLM Railway 이미지 안내](https://railway.com/deploy/anythingllm)

## 문제 해결

- `설정 필요`: `.env`의 API 키와 workspace slug를 확인합니다.
- `API 키가 올바르지 않습니다`: AnythingLLM의 Developer API에서 발급한 키인지 확인합니다.
- `연결할 수 없습니다`: Docker와 AnythingLLM이 실행 중인지 확인합니다.
- `포트 8765가 이미 사용 중`: 기존에 실행한 `start.bat` 창을 종료합니다.
