# Development plan

> TASK-003. TASK-001·002가 잠근 제품·스택을 **구현 순서·마일스톤·완료 조건**으로 푼다.  
> 실제 코드 TASK id는 이후 `vibeops task add`가 붙인다. 여기 번호는 계획 단위다.

## Principles

1. **문서가 원본** — `docs/project/*`와 이 계획을 어기고 구현하지 않는다.
2. **VibeOps 단계** — `add` → build → `ship` → `merge` → `sync`. 스킵·대체 반영 금지 (`AGENTS.md`).
3. **의존 순서** — 스캐폴드 → 계정 → 페르소나 SoR → 성장 → agent → `/v1` → MCP → 싱크 잡. `persona_id` 없이 WriteJob 금지.
4. **한 TASK = 한 검증 가능한 슬라이스** — 스캐폴드에 비즈니스 로직을 넣지 않는다.
5. **LLM은 llm_wrapper만** — 직접 SDK 호출 금지.
6. **agent ↔ api** — 같은 Nest 프로세스. 호스트만 분기.
7. **UI 원본은 잠긴 디자인 문서** — 스캐폴드 시 `getDesign.md`(벤치마크 사이트)를 확인한 뒤 `DESIGN.md` · `LAYOUT.md` · `UX.md`를 레포에 고정한다. 이후 웹 구현은 이 세 파일을 어기지 않는다.

## Target (MVP done)

다음이 **셀프호스트**에서 동작하면 MVP 완료로 본다.

| # | Criterion |
|---|-----------|
| 1 | `DESIGN.md` · `LAYOUT.md` · `UX.md`가 getDesign.md 벤치로 잠겨 있고, Podman Compose로 PG17+Redis + web/api 기동 |
| 2 | 가입·로그인 (Better Auth, 쿠키 `.getpersona.md` 패턴; UI는 잠긴 DESIGN/LAYOUT/UX) |
| 3 | 페르소나 등록·목록·조회·패치·보관, **계정 소속**만 |
| 4 | remember → 후보 → promote (promote 토큰/게이트) |
| 5 | post / comment / reply → `text` \| `skip` (personaAgent 흡수 품질의 최소 이식) |
| 6 | REST `/v1` + API 키(해시) + Swagger + 명시적 퍼블릭만 개방 |
| 7 | MCP가 같은 코어를 호출 |
| 8 | 싱크는 **잡 골격 + 어댑터 인터페이스**까지 (실 스크레이프는 후속) |
| 9 | CI(self-hosted): lint · typecheck · test |
| 10 | 감사 이벤트(Postgres) + Pino |

## Milestone map

```text
M0 Design lock + Scaffold ──► M1 Auth ──► M2 Persona SoR ──► M3 Growth
                                              │
                                              ▼
                                    M4 Agents (post/comment/reply)
                                              │
                                              ▼
                                    M5 Connect (/v1 + keys + Swagger)
                                              │
                                              ▼
                                    M6 MCP ──► M7 Sync job boundary
                                              │
                                              ▼
                                    M8 Quality + harden (parallel OK after M5)
```

---

## M0 — Design lock + monorepo scaffold

**Goal:** (1) getDesign.md를 확인해 UI 문서를 잠그고, (2) 잠긴 스택으로 빈 모노레포가 빌드·테스트·compose까지 통과.

### M0a — Design / layout / UX lock (before or with first scaffold commit)

벤치마크 대상은 **getDesign.md 제품 사이트**(다른 서비스). 웹에서 확인한 뒤 이 레포에 세 파일을 **고정**한다. 경로: `docs/project/DESIGN.md`, `docs/project/LAYOUT.md`, `docs/project/UX.md` (에이전트·구현의 UI SoR).

| File | Locks |
|------|--------|
| **DESIGN.md** | 팔레트, 타이포, 간격, 컴포넌트 토큰, 모션, 보이스 등 **디자인 요소** (getDesign.md에서 추출·벤치) |
| **LAYOUT.md** | 페이지·섹션 구조, 그리드, 브레이크포인트, 셸(네비/푸터) **레이아웃** |
| **UX.md** | 가입·로그인·핵심 플로우, 빈 상태, 오류, 권한, 카피 톤 등 **UX 규칙** |

**Exit (M0a):** 세 파일이 레포에 있고, README/`10-dev-plan`이 이를 UI 원본으로 가리킨다. 이후 M1+ 웹 UI는 이 문서를 어기지 않는다.

**Out (M0a):** 픽셀 퍼펙트 이식 완료 선언, getDesign.md 런타임 의존.

### M0b — Monorepo scaffold

| Deliverable | Notes |
|-------------|--------|
| pnpm workspace + Turborepo | `@getpersona/web`, `@getpersona/api`, `@getpersona/shared` |
| Next 16.3 + Nest 11.2 (Express) | health 정도만; 웹 토큰은 DESIGN.md 기준 |
| Podman Compose | Postgres 17, Redis |
| ESLint 9 + Prettier + Husky + lint-staged | |
| Jest(api) + Vitest(web) | smoke |
| GH Actions self-hosted | lint/typecheck/test |
| Infisical 훅 자리 | env 로딩 패턴만 |
| Pino on api | |
| Helmet 기본 헤더 | CSP는 단계적 |

**Exit (M0):** M0a 완료 + `pnpm install && pnpm turbo run build typecheck test` 성공 + compose up 후 `/health` 200.

**Out:** 비즈니스 엔티티, Better Auth 본구현, agent.

**Suggested next TASK title:** `구현: DESIGN/LAYOUT/UX 잠금 + 모노레포 스캐폴드`

---

## M1 — Account (Better Auth)

**Goal:** 웹에서 가입·로그인. API가 세션을 신뢰.

| Deliverable | Notes |
|-------------|--------|
| Better Auth 1.6 | getDesign.md와 동일 패턴(약관·메일·OAuth) |
| SMTP (셀프호스트) | 메일 인증 getDesign.md와 동일 |
| Cookie domain `.getpersona.md` | 로컬은 별도 dev 설정 |
| CORS 화이트리스트 | stack 문서 호스트 |
| 최소 웹 페이지 | 랜딩·auth UI — **DESIGN.md / LAYOUT.md / UX.md** 준수 |
| i18n ko/en | next-intl 골격 |

**Exit:** 가입→로그인→세션 쿠키→api에서 현재 유저 조회.

**Out:** 페르소나 CRUD, 결제, admin.

**Depends on:** M0.

---

## M2 — Persona SoR (register / manage / fork)

**Goal:** 페르소나가 DB SoR. 소속 계정만 접근.

| Deliverable | Notes |
|-------------|--------|
| TypeORM entities | identity, voice, boundaries, permissions |
| ULID/UUIDv7 ids | UTC timestamps |
| Create / List / Get / Patch / Archive | |
| Fork (public fields only) | |
| Ownership checks | 모든 mutating API |
| Web UI | 등록·목록·수정 (getDesign 벤치) |
| Zod shared schemas | `@getpersona/shared` |
| class-validator DTOs | Nest `/v1` 준비 또는 내부 모듈 |

**Exit:** 로그인 유저가 페르소나 CRUD·포크. 타인 페르소나 403.

**Out:** remember/promote, write agents, 실 싱크.

**Depends on:** M1.

---

## M3 — Growth (remember / promote / project)

**Goal:** 후보·게이트. 쓰기가 LTM을 직접 안 바꿈.

| Deliverable | Notes |
|-------------|--------|
| remember (idempotent key) | episode + candidate |
| promote + promote credential | identity/voice/boundary 게이트 |
| project() | 좁은 계약 + memory window |
| Audit rows | Postgres |
| 최소 운영 UI 또는 API | 후보 목록·승인 |

**Exit:** remember → promote → 이후 project에 LTM 반영. write 토큰으로 promote 불가.

**Depends on:** M2.

---

## M4 — Agents (post / comment / reply)

**Goal:** personaAgent 쓰기 영역을 역할별 에이전트로 흡수(최소 이식).

| Deliverable | Notes |
|-------------|--------|
| `@getpersona/agent-post` 등 또는 api 모듈 | 패키지 경계는 스캐폴드 때 확정한 구조 따름 |
| WriteJob path | project → draft → judge → text\|skip |
| llm_wrapper client only | |
| Physical laws | 길이·누수·judge 비재작성 |
| Run trace | memory_used, run_id |
| BullMQ optional | 긴 잡이면 큐, 단발 write는 동기 가능 |

**Exit:** 소속 페르소나로 세 kind 호출 → text 또는 skip + trace. 타 계정 불가.

**Out:** 소셜 게시, 브라우저 드라이버, 전체 personaAgent 기능 복제.

**Depends on:** M3 (project). Soft-dep: M2 only로 thin write 가능하나 **계획상 M3 후**.

---

## M5 — Connect surface (`/v1` + keys + Swagger)

**Goal:** `api.getpersona.md` 연결 면.

| Deliverable | Notes |
|-------------|--------|
| REST `/v1` | persona + write + growth ops |
| API keys | 원문 1회, DB 해시 |
| Rate limit | Redis, 키·계정 |
| Swagger | `@nestjs/swagger` |
| Public allowlist | 명시한 persona/route만 |
| Reverse proxy notes | agent./api. → same process |

**Exit:** 키로 `/v1` write 성공. 문서 UI에서 스키마 확인. 비공개 기본.

**Depends on:** M2–M4 (최소한 persona + write).

---

## M6 — MCP

**Goal:** 같은 코어를 MCP로 노출.

| Deliverable | Notes |
|-------------|--------|
| `@modelcontextprotocol/sdk` on `apps/api` | tools → Nest services |
| Auth via key (and/or session policy) | write/promote 분리 유지 |

**Exit:** MCP 클라이언트가 list/write(또는 동등 tool) 호출 성공.

**Depends on:** M5.

---

## M7 — Sync job boundary

**Goal:** 싱크를 제품 능력으로 열되, 어댑터 구현은 경계만.

| Deliverable | Notes |
|-------------|--------|
| Sync job model (BullMQ) | source handles, status, errors |
| Adapter interface | blog / X / Threads — **stub** |
| S3 for raw artifacts | `s3.goodtek.xyz` |
| Web: sync 요청 UX | 상태 폴링 |

**Exit:** 싱크 잡 enqueue → stub adapter → 후보/계약 패치 훅(또는 no-op)까지 파이프 증명.

**Out:** 실 스크레이프·BYOBrowser 연동.

**Depends on:** M2, Redis/BullMQ from M0/M4.

---

## M8 — Quality & harden

**Goal:** 종류별 품질·보안 기초. M5 이후 병행 가능.

| Deliverable | Notes |
|-------------|--------|
| Gold fixtures | 정답 문장 없음, 통과 형태/skip |
| Leak / length / language checks | |
| Backup note | PG dump 절차 문서 |
| DESIGN/LAYOUT/UX 회귀 | M0a 문서 대비 드리프트 점검 |

**Exit:** CI에 품질 테스트 일부. 누수 케이스 실패.

---

## Deferred (not in MVP plan)

| Item | When |
|------|------|
| `admin.getpersona.md` | 후속 |
| Payments | 후속 |
| Feature flags / OpenTelemetry | 후속 |
| Real platform scrapers | after M7 |
| CSP full harden | after baseline Helmet |
| `task release` to main | ops decision after MVP on develop/self-host |

UI 시각 정렬은 후속이 아니라 **M0a**에서 `DESIGN.md`/`LAYOUT.md`/`UX.md`로 잠근다.

## Suggested TASK sequence (after this plan ships)

1. M0 design lock (DESIGN/LAYOUT/UX) + scaffold  
2. M1 auth  
3. M2 persona SoR (+ fork)  
4. M3 growth  
5. M4 agents  
6. M5 `/v1` + keys + swagger  
7. M6 MCP  
8. M7 sync boundary  
9. M8 quality (or split)

각 줄 = `vibeops task add` 한 번. 큰 마일스톤은 쪼개도 된다 (예: M4를 post만 먼저).

## Risk register

| Risk | Mitigation |
|------|------------|
| personaAgent 이식이 큼 | M4는 kind별 최소 경로만; 품질 회귀는 M8 |
| getDesign 벤치 편차 | M0a에서 DESIGN/LAYOUT/UX를 먼저 잠금; 웹은 그 문서만 따름 |
| 쿠키 도메인 로컬 | dev용 host/cookie 설정 문서화 |
| 싱크 기대치 | M7에서 stub임을 제품 카피로 명시 |

## Traceability

| Plan | Locked docs |
|------|-------------|
| Surfaces / hosts | `02-product.md`, `09-stack.md` |
| Stack versions | `09-stack.md`, D-012 |
| UI SoR (from M0) | `DESIGN.md`, `LAYOUT.md`, `UX.md` |
| Growth / skip | `07-growth.md`, `04-api.md` |
| Decisions | D-010–D-014 |
| VibeOps | `AGENTS.md`, D-001 |
