# Komga Fork — Internal Development Project Plan

## Overview

This project plan covers all remaining work on the `zolty-mat/komga` fork before it's ready for internal deployment and upstream PR submission. Each task is self-contained with clear inputs/outputs so it can be executed by a local LLM (Qwen3 8B via Ollama) or Claude Code.

**Repository:** `zolty-mat/komga` (fork of `gotson/komga`)
**Branch:** `next-ui`
**Local model:** `qwen3:8b` via Ollama at `localhost:11434`

---

## Phase 1: Security Fixes (Priority: Critical)

### 1.1 Fix next-ui npm vulnerabilities (3 HIGH)

**Context:** Trivy scan found 3 HIGH vulnerabilities in `next-ui/package-lock.json`.

**Files to modify:** `next-ui/package.json`, `next-ui/package-lock.json`

**Tasks:**
1. Update `defu` from 6.1.4 to >=6.1.5 (CVE-2026-35209, prototype pollution)
2. Update `picomatch` from 4.0.3 to >=4.0.4 (CVE-2026-33671, ReDoS)
3. Update `rollup` from 4.52.0 to >=4.59.0 (CVE-2026-27606, path traversal RCE)

**Commands:**
```bash
cd next-ui
npm audit fix
npm run test:unit
npm run build-only
```

**Verification:** `npm audit` shows 0 high/critical. All tests pass. Build succeeds.

---

### 1.2 Fix Dockerfile to run as non-root user

**Context:** Trivy config scan flagged `komga/docker/Dockerfile.tpl` — DS-0002: no non-root USER directive.

**File to modify:** `komga/docker/Dockerfile.tpl`

**Task:** Add a non-root user and switch to it before the ENTRYPOINT/CMD.

**Pattern:**
```dockerfile
RUN addgroup --system komga && adduser --system --ingroup komga komga
USER komga
```

**Verification:** `trivy config komga/docker/Dockerfile.tpl` returns 0 HIGH findings.

---

### 1.3 Fix pre-existing locale-helper test failure

**Context:** `next-ui/src/utils/i18n/locale-helper.test.ts` fails because `localStorage.getItem` is not a function in happy-dom environment. This is an upstream bug.

**File to modify:** `next-ui/src/utils/i18n/locale-helper.test.ts`

**Task:** Add a `localStorage` stub in the test setup so `getLocale()` works in happy-dom.

**Pattern from existing tests:** Use `vi.stubGlobal('localStorage', { getItem: vi.fn(), setItem: vi.fn(), clear: vi.fn() })` or configure the happy-dom environment to include localStorage.

**Verification:** `npx vitest run --project unit src/utils/i18n/locale-helper.test.ts` passes.

---

## Phase 2: OAuth2 Login Screen (Priority: High — upstream PR target)

### 2.1 Create OAuth2 colada query

**Context:** The backend exposes `GET /api/v1/oauth2/providers` which returns `OAuth2ClientDto[]` (name + registrationId). The next-ui frontend has no code to call this endpoint yet. The OpenAPI types already include this endpoint.

**File to create:** `next-ui/src/colada/oauth2.ts`

**Pattern:** Follow `next-ui/src/colada/claim.ts` exactly — use `defineQuery`, `useQuery`, `komgaClient.GET`.

**Code:**
```typescript
import { defineQuery, useQuery } from '@pinia/colada'
import { komgaClient } from '@/api/komga-client'

export const QUERY_KEYS_OAUTH2 = {
  providers: ['oauth2-providers'] as const,
}

export const useOAuth2Providers = defineQuery(() => {
  return useQuery({
    key: () => QUERY_KEYS_OAUTH2.providers,
    query: () =>
      komgaClient
        .GET('/api/v1/oauth2/providers')
        .then((res) => res.data),
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: false,
  })
})
```

**Verification:** Unit test passes (see 2.2).

---

### 2.2 Create OAuth2 MSW mock handler + unit test

**File to create:** `next-ui/src/mocks/api/handlers/oauth2.ts`

**Pattern:** Follow `next-ui/src/mocks/api/handlers/claim.ts`.

**Mock handler:**
```typescript
import { httpTyped } from '@/mocks/api/httpTyped'

export const mockOAuth2Providers = [
  { name: 'Authentik', registrationId: 'authentik' },
  { name: 'GitHub', registrationId: 'github' },
]

export const oauth2Handlers = [
  httpTyped.get('/api/v1/oauth2/providers', ({ response }) =>
    response(200).json(mockOAuth2Providers),
  ),
]
```

**Register in:** `next-ui/src/mocks/api/handlers.ts` — add `oauth2Handlers` import and spread into `handlers` array.

**File to create:** `next-ui/src/colada/oauth2.test.ts`

**Pattern:** Follow `next-ui/src/colada/claim.test.ts`.

**Tests:**
1. When providers exist, data contains the provider list
2. When no providers configured, data is empty array
3. When endpoint fails (401), error is set

**Verification:** `npx vitest run --project unit src/colada/oauth2.test.ts` passes.

---

### 2.3 Add OAuth2 provider buttons to login page

**Context:** `next-ui/src/pages/login.vue` currently shows only username/password. The old UI (`komga-webui/src/views/LoginView.vue`) has the full OAuth2 implementation with popup flow. Port the OAuth2 section to the new Vue 3 + Vuetify 4 stack.

**File to modify:** `next-ui/src/pages/login.vue`

**Requirements:**
1. After the "Forgot your password?" link and before the divider, add an OAuth2 section
2. Fetch providers via `useOAuth2Providers()`
3. For each provider, render a `v-btn` with the provider name
4. Clicking a button opens a popup to `/oauth2/authorization/{registrationId}`
5. Use `$formatMessage` for all i18n strings (follow existing pattern with description + defaultMessage + id)
6. Hide the entire OAuth2 section if no providers are configured
7. If `webui.oauth2.hide_login` client setting is true, hide the password form

**Reference implementation:** `komga-webui/src/views/LoginView.vue` lines with `oauth2Login(provider)` and the popup window logic.

**OAuth2 popup flow:**
```typescript
function oauth2Login(registrationId: string) {
  const url = `${window.location.origin}/oauth2/authorization/${registrationId}`
  const popup = window.open(url, 'oauth2Login', 'width=600,height=700')
  // Listen for redirect back — the backend redirects to /?server_redirect=Y
  const interval = setInterval(() => {
    try {
      if (popup?.location?.search?.includes('server_redirect=Y')) {
        clearInterval(interval)
        popup.close()
        router.push('/')
      }
    } catch { /* cross-origin — keep waiting */ }
  }, 500)
}
```

**Verification:** Storybook story renders correctly. Login page shows OAuth2 buttons when providers exist.

---

### 2.4 Complete startup.vue token exchange

**Context:** `next-ui/src/pages/startup.vue` has `// TODO: exchange header token for cookie`. The backend endpoint is `GET /api/v1/login/set-cookie` with `X-Auth-Token` header.

**File to modify:** `next-ui/src/pages/startup.vue`

**Task:** In `checkAuthenticated()`, before checking `data.value`, check for `xAuthToken` query parameter. If present, call `/api/v1/login/set-cookie` with the token in the X-Auth-Token header, then retry auth check.

**Verification:** Startup page handles OAuth2 callback with token parameter.

---

### 2.5 Add login page Storybook stories for OAuth2

**File to modify:** `next-ui/src/pages/login.stories.ts`

**Add stories:**
1. `WithOAuth2Providers` — mock 2 providers, show buttons
2. `WithSingleProvider` — mock 1 provider
3. `HideLogin` — mock providers + hide_login setting true, hide password form
4. `NoProviders` — mock empty provider list (default behavior, no OAuth2 section)

**Pattern:** Follow existing stories in the file — use MSW handlers to mock the providers endpoint.

**Verification:** `npm run test:storybook` passes.

---

## Phase 3: Test Coverage Expansion (Priority: Medium)

### 3.1 Add colada tests for untested modules

**Colada modules WITHOUT tests (15 modules):**
- `books.ts`
- `collections.ts`
- `history.ts`
- `libraries.ts` (composable tested, but colada query not directly)
- `page-hashes.ts`
- `readlists.ts`
- `referential.ts`
- `series.ts`
- `settings.ts`
- `syncpoints.ts`
- `transient-books.ts`

**For each module, create `<module>.test.ts`** following the pattern in `claim.test.ts`:
1. Import `server`, `createMockColada`, `enableAutoUnmount`
2. Test the primary `useXxx` query — verify data is returned from mock
3. Test error case (401) — verify error is set

**Verification:** `npx vitest run --project unit` shows all tests passing. Coverage increases.

---

### 3.2 Increase coverage thresholds

**File to modify:** `next-ui/vite.config.mts`

**After Phase 3.1 tests are added:**
1. Run `npx vitest run --project unit --coverage` to see actual coverage
2. Update thresholds to ~5% below actual (safety margin)
3. Target: statements 20%, branches 15%, functions 20%, lines 20%

**Verification:** `npx vitest run --project unit --coverage` passes thresholds.

---

## Phase 4: CI/CD & Build Pipeline (Priority: Medium)

### 4.1 Create Harbor build workflow for our fork

**File to create:** `.github/workflows/build-komga.yml`

**Pattern:** Follow `home_k3s_cluster/.github/workflows/build-etsy-scraper.yml` pattern.

**Workflow:**
1. Trigger: push to `next-ui` branch
2. Runner: `self-hosted`
3. Steps:
   - Checkout
   - Setup Java 21
   - `./gradlew :komga:webuiCopyIndex :komga:nextuiCopyIndex :komga:bootJar`
   - Build next-ui: `cd next-ui && npm ci && npm run build`
   - JReleaser Docker package: `./gradlew jreleaserPackage`
   - Docker build from `komga/build/jreleaser/package/docker/`
   - Push to `harbor.k3s.internal.strommen.systems/production/komga:sha-$GITHUB_SHA`
   - Push `:latest` tag

**Verification:** Workflow runs successfully, image appears in Harbor.

---

### 4.2 Update cluster manifest to use fork image

**File to modify:** `home_k3s_cluster/kubernetes/apps/media/komga.yaml`

**Change:**
```yaml
# FROM:
image: harbor.k3s.internal.strommen.systems/dockerhub-cache/gotson/komga:1.24.3
# TO:
image: harbor.k3s.internal.strommen.systems/production/komga:latest
```

**Only do this AFTER build workflow (4.1) produces a working image.**

**Verification:** `kubectl rollout status deployment/komga -n media` succeeds. Komga accessible at `komga.k3s.internal.strommen.systems`.

---

## Phase 5: Upstream PR Preparation (Priority: Low — after Discord outreach)

### 5.1 Discord outreach

**Manual task:** Post in Komga Discord (`discord.gg/TdRpkDu`) asking:
1. Are external PRs welcome on `next-ui` branch?
2. Prefer issue-first or draft PR?
3. Chromatic — do contributors need a token?

### 5.2 Prepare upstream PR branch

**After Discord confirms PRs are welcome:**
1. Create branch `feat/oauth2-login` from `upstream/next-ui`
2. Cherry-pick only the OAuth2-related commits (Phase 2)
3. Ensure Conventional Commit messages: `feat(next-ui): add OAuth2/OIDC login support`
4. Run full test suite + lint + type-check + prettier
5. Open PR against `gotson/komga:next-ui`

---

## Task Execution Order

| # | Task | Depends On | Estimated Size | Can Run on Qwen3? |
|---|------|-----------|----------------|-------------------|
| 1 | 1.1 npm audit fix | — | XS | Yes |
| 2 | 1.2 Dockerfile non-root | — | XS | Yes |
| 3 | 1.3 Fix locale test | — | XS | Yes |
| 4 | 2.1 OAuth2 colada query | — | XS | Yes |
| 5 | 2.2 OAuth2 mock + test | 2.1 | S | Yes |
| 6 | 2.3 Login page OAuth2 | 2.1, 2.2 | M | Yes (with context) |
| 7 | 2.4 Startup token exchange | — | XS | Yes |
| 8 | 2.5 Login stories | 2.3 | S | Yes |
| 9 | 3.1 Colada test expansion | — | M (batch of 11) | Yes (1 at a time) |
| 10 | 3.2 Coverage thresholds | 3.1 | XS | Yes |
| 11 | 4.1 Harbor build workflow | — | S | Yes |
| 12 | 4.2 Update cluster manifest | 4.1 | XS | Manual |
| 13 | 5.1 Discord outreach | — | — | Manual |
| 14 | 5.2 Upstream PR | 2.*, 5.1 | S | Manual |

**Tasks 1-3 and 4, 7, 9, 11 are independent — can run in parallel.**

---

## Qwen3 Execution Notes

Each task above is sized to fit within Qwen3 8B's 40K context window. When dispatching to Qwen3:

1. **Provide the full task description** from this plan
2. **Include the relevant source file** being modified (read it first, paste into prompt)
3. **Include one reference file** showing the pattern to follow
4. **Ask for the complete file output** — don't ask for diffs (Qwen3 8B handles full files better than patches)
5. **Verify output** by running the test command listed in each task

**Model config for code tasks:**
```
ollama run qwen3:8b --temperature 0.3
```
Lower temperature for deterministic code generation.

---

## Current State Summary

| Area | Status | Details |
|------|--------|---------|
| Fork | ✅ Created | `zolty-mat/komga`, all branches synced |
| CI/CD | ✅ Updated | `tests.yml` → self-hosted, `security.yml` added |
| Tests added | ✅ 16 new | claim, users, client-settings, utils |
| Coverage config | ✅ Done | Thresholds at 10% baseline |
| Security scan | ✅ Done | 3 HIGH (next-ui), 14+1 CRITICAL (webui), 1 Dockerfile |
| OAuth2 gap | ✅ Mapped | Full implementation plan with code samples |
| Qwen3 | ✅ Ready | 8B model pulled, 40K context, thinking+tools |
| Test results | ✅ 59/59 pass | 1 pre-existing failure (locale-helper) |
