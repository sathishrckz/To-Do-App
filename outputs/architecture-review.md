# Design Review: EPMCDMETST-43701 - To-Do-App

---

## 1. Executive Summary

| Field | Detail |
|-------|--------|
| **Review Date** | 2026-05-26 |
| **Reviewer** | Design Review Agent (agent-003) |
| **Document Reviewed** | `outputs/architecture.md` (commit 93efa23) |
| **Requirements Source** | `outputs/requirements.md` (commit 2dd4ea4) |
| **Overall Assessment** | ✅ **Approved with Minor Recommendations** |
| **Critical Issues** | 0 |
| **Important Issues** | 4 |
| **Minor Findings** | 5 |

The architecture is well-structured, appropriately scoped, and correctly addresses all 7 functional requirements and all 4 non-functional requirements. No blockers to development. Four important gaps should be resolved during implementation setup; five minor findings are noted for quality improvement.

---

## 2. Review Scope & Methodology

**Documents Reviewed:**
- `outputs/architecture.md` — 14 sections, 353 lines
- `outputs/requirements.md` — cross-reference validation

**Review Criteria Applied:**
1. Requirements Alignment (all FR/NFR addressed?)
2. Architectural Risk Assessment (technical, security, performance, deployment)
3. Component Design Quality (SRP, cohesion, testability)
4. Technology Stack Validation (appropriate choices, justified, alternatives evaluated)
5. Security Assessment (OWASP coverage, XSS, input sanitisation)
6. Performance & Scalability Validation (NFR targets achievable?)
7. Deployment & Operations Readiness

**Review Process:** Automated cross-reference of requirements traceability matrix against component definitions, data flow diagrams, security approach, and folder structure. All 14 architecture sections analysed.

---

## 3. Requirements Alignment Analysis

### Functional Requirements Coverage

| Requirement | Addressed In Architecture | Status |
|-------------|--------------------------|--------|
| FR-01: Input field "Add Task" | `TaskInput.jsx`, Section 4 | ✅ |
| FR-02: "Add" button | `TaskInput.jsx`, Section 4 | ✅ |
| FR-03: Button disabled when empty/whitespace | `isAddDisabled` derived state, Section 6 | ✅ |
| FR-04: Immediate render, no page reload | React state update → `TaskList` re-render, Section 6 | ✅ |
| FR-05: Input clears after add | `setInputValue('')`, Section 6 | ✅ |
| FR-06: localStorage persistence | `useLocalStorage` hook, Sections 4, 7, 8 | ✅ |
| FR-07: Load from localStorage on mount | `useLocalStorage` reads on mount, Section 6 | ✅ |

**Result: 7/7 Functional Requirements addressed. No gaps.**

### Non-Functional Requirements Coverage

| Requirement | Addressed In Architecture | Status |
|-------------|--------------------------|--------|
| Performance < 2s load | Vite build, `React.memo`, bundle < 150KB, Section 10 | ✅ |
| Interaction < 100ms | Synchronous React state updates, Section 10 | ✅ |
| Security (no sensitive data, XSS) | JSX auto-escaping, Section 9 | ✅ |
| Reliability (localStorage errors) | `try/catch` + `StorageBanner`, Sections 4, 12, 13 | ✅ |

**Result: 4/4 Non-Functional Requirements addressed. No gaps.**

### Acceptance Criteria Achievability

| AC | Architecture Support | Verdict |
|----|---------------------|---------|
| AC-01: Enter text in input | `TaskInput.jsx` controlled input | ✅ Achievable |
| AC-02: Button disabled when empty | `isAddDisabled` derived state | ✅ Achievable |
| AC-03: Click Add or press Enter | `onKeyDown` handler in `TaskInput.jsx` | ✅ Achievable |
| AC-04: Task appears immediately | React re-render on state update | ✅ Achievable |
| AC-05: Input clears after add | `setInputValue('')` | ✅ Achievable |
| AC-06: Tasks persist on refresh | `useLocalStorage` hook | ✅ Achievable |
| AC-07: Tasks loaded on page open | `useEffect` on mount | ✅ Achievable |

---

## 4. Identified Risks

### Risk Register

| Risk ID | Category | Severity | Description | Impact | Likelihood | Mitigation | Status |
|---------|----------|----------|-------------|--------|-----------|-----------|--------|
| R-01 | Technical | 🟡 Medium | `useEffect` dependency array errors — common React pitfall that causes infinite loops or stale closures if incorrectly specified in `useLocalStorage` | App freezes or data corruption | Medium | Enforce ESLint `react-hooks/exhaustive-deps` rule; add specific unit tests for hook mount/update cycles | Open |
| R-02 | Technical | 🟡 Medium | No task text length limit — a user can type thousands of characters into the input, potentially breaking UI layout and accelerating localStorage quota usage | Visual layout breakage | Low | Add `maxLength` attribute to input (recommended: 500 chars); validate in handler | Open |
| R-03 | Technical | 🟢 Low | localStorage key `todo-app-tasks` has no namespace — if the app domain ever hosts another app using the same key, data collision occurs | Silent data corruption | Low | Use namespaced key: `todo-app:EPMCDMETST-43701:tasks` | Open |
| R-04 | Dependency | 🟢 Low | `uuid` package security advisory — external dependency risk | Broken ID generation | Low | `npm audit` in CI pipeline; fallback to `crypto.randomUUID()` | Documented |
| R-05 | Storage | 🟢 Low | localStorage unavailable in private/incognito mode | Tasks not persisted | Medium | Already mitigated: `StorageBanner` + in-memory fallback | Mitigated ✅ |
| R-06 | Storage | 🟢 Low | localStorage quota exceeded (~5MB) | New tasks not saved | Low | Already mitigated: `QuotaExceededError` caught, warning shown | Mitigated ✅ |
| R-07 | Design | 🟢 Low | Design system tokens not yet confirmed — architecture references design system conventions but no CSS variables or design tokens are specified | Visual inconsistency | Medium | Design Review Agent to confirm tokens before implementation; use placeholder variables in interim | Open |
| R-08 | Build | 🟢 Low | No bundle size enforcement — 150KB gzip target is stated but not enforced in `vite.config.js` | Silent bundle bloat | Low | Add `build.rollupOptions.output.manualChunks` and bundle analyser (`rollup-plugin-visualizer`) | Open |

**Top 3 Risks for Immediate Attention:**
1. **R-01** — `useEffect` dependencies (ESLint rule enforcement required)
2. **R-02** — No task text length limit
3. **R-07** — Design system tokens unconfirmed

---

## 5. Identified Gaps

| Gap ID | Area | Severity | Description | Recommendation | Owner | Timeline |
|--------|------|----------|-------------|---------------|-------|---------|
| G-01 | Tech Stack | 🔴 Important | **Jest/Vitest inconsistency**: Executive Summary (Section 1) states "Jest + React Testing Library" as a key decision; Section 5 testing table also lists "Jest"; but a Note and Section 14 correct to Vitest. Developers reading the doc will be confused about which runner to install. | Update Section 1 key decisions and Section 5 testing table to consistently state **Vitest** (not Jest). Remove all Jest references. | Architecture owner | Before implementation |
| G-02 | Component Design | 🔴 Important | **ErrorBoundary missing from folder structure**: Section 12 states "React `ErrorBoundary` wrapping `App`" but the folder structure in Section 11 has no `ErrorBoundary.jsx` file, and it's absent from the component diagram. | Add `ErrorBoundary.jsx` to `src/components/` and to the component diagram. Wrap `<App />` in `main.jsx`. | Architecture owner | Before implementation |
| G-03 | Tooling | 🔴 Important | **ESLint/Prettier config files absent from folder structure**: Both tools are listed as DevOps/Quality tools (Section 5) but neither `.eslintrc.js` (or `eslint.config.js`) nor `.prettierrc` appear in the folder structure (Section 11). | Add `.eslintrc.js` and `.prettierrc` to the root of the folder structure. Specify required plugins: `eslint-plugin-react`, `eslint-plugin-react-hooks`. | Architecture owner | Before implementation |
| G-04 | Tooling | 🔴 Important | **No `package.json` scripts defined**: Section 11 lists commands (`vite dev`, `vite build`, `vite preview`) but no `package.json` scripts table is provided. Developers must infer the script names. | Add a package.json scripts block to the architecture: `dev`, `build`, `preview`, `test`, `test:coverage`, `lint`. | Architecture owner | Before implementation |
| G-05 | Performance | 🟡 Minor | **Separate `vitest.config.js` is redundant**: Vitest can be fully configured inside `vite.config.js` using the `test` key. A separate `vitest.config.js` adds file noise without benefit. | Merge vitest configuration into `vite.config.js`; remove `vitest.config.js` from folder structure. | Architecture owner | During implementation |

---

## 6. Component Design Assessment

**Overall: Excellent**

| Aspect | Assessment |
|--------|-----------|
| Single Responsibility | ✅ Each component has one clearly defined role |
| Component boundaries | ✅ No overlapping responsibilities |
| Unidirectional data flow | ✅ State down, callbacks up |
| Testability | ✅ All components are stateless/pure or have injectable props |
| Circular dependencies | ✅ None — App → children, no reverse dependencies |
| Naming clarity | ✅ All names are self-describing |

**Minor observation:** The component table (Section 4) lists `useLocalStorage.js` as depending on `uuid`, but UUID generation logically belongs in the task creation handler in `App.jsx`, not in the storage hook. The hook should be responsible only for read/write — it shouldn't know about task shape or ID generation. Recommend moving `uuid` dependency to `App.jsx`.

---

## 7. Technology Review

| Technology | Assessment | Finding |
|-----------|-----------|---------|
| React 18 | ✅ Correct choice | Hooks-first, active ecosystem, specified in requirements |
| Vite 5 | ✅ Correct choice | CRA deprecated; Vite is the modern standard |
| Vitest | ✅ Correct choice | Consistent with Vite config; faster than Jest in Vite projects |
| React Testing Library | ✅ Correct choice | User-centric testing; right abstraction level |
| CSS Modules | ✅ Correct choice | Scoped, no runtime, framework-agnostic |
| `uuid` npm package | ✅ Acceptable | As specified; low risk; trivially replaceable |
| JavaScript (no TypeScript) | ✅ Acceptable at this scope | Would recommend TypeScript for future stories |
| localStorage | ✅ Correct choice | Specified in requirements; simplest fit |

**Gap (G-01):** Jest vs Vitest inconsistency must be resolved — see Gaps section.

---

## 8. Security Assessment

### OWASP Top 10 Coverage

| OWASP | Category | Status | Notes |
|-------|----------|--------|-------|
| A01 | Broken Access Control | ✅ N/A | Single-user, no auth |
| A02 | Cryptographic Failures | ✅ N/A | No sensitive data |
| A03 | Injection | ✅ Mitigated | React JSX auto-escaping prevents XSS |
| A04 | Insecure Design | 🟡 Partial | No `dangerouslySetInnerHTML` policy stated |
| A05 | Security Misconfiguration | ✅ N/A | Static client-only app |
| A06 | Vulnerable & Outdated Components | ✅ Monitored | `npm audit` in CI mentioned |
| A07 | Auth & Session Mgmt Failures | ✅ N/A | No authentication |
| A08 | Software & Data Integrity Failures | ✅ Mitigated | localStorage data shape validated on load |
| A09 | Security Logging Failures | 🟡 Partial | `console.warn` only — acceptable for this scope |
| A10 | SSRF | ✅ N/A | No server-side requests |

**Security Recommendations:**
- Explicitly document a **"no `dangerouslySetInnerHTML`" implementation constraint** to prevent future regressions.
- For production deployment: add basic **Content Security Policy (CSP)** headers via hosting config (e.g., `default-src 'self'`).
- Input trimming before storage is stated but should be explicitly enforced in the implementation plan.

**Overall Security Verdict:** ✅ Appropriate for scope. React's JSX model provides strong default XSS prevention.

---

## 9. Performance & Scalability Review

| Target | Verdict | Evidence |
|--------|---------|---------|
| Load < 2s | ✅ Achievable | Vite bundle < 150KB gzip; React + uuid only; no heavy deps |
| Interaction < 100ms | ✅ Achievable | Synchronous React state; localStorage write is fast for small payloads |
| 500+ tasks threshold | 🟡 Review | Threshold is not benchmarked; 500 tasks at ~100 bytes each = 50KB — well within 5MB limit |
| Bundle < 150KB gzip | 🟡 Not enforced | Target stated but no build config enforces it (Gap G-04 area) |

**`React.memo` and `useCallback` usage:** ✅ Correct and proportionate. `TaskItem` is a good candidate for memoisation given the list re-renders on every task addition.

---

## 10. Deployment & Operations Review

| Area | Assessment |
|------|-----------|
| Dev environment | ✅ Clear — `vite dev` on port 5173 |
| Production build | ✅ `vite build` → `dist/` static files |
| Hosting options | ✅ GitHub Pages / Netlify / nginx — all viable |
| CI/CD pipeline | 🟡 Referenced in diagram but no GitHub Actions workflow defined |
| Config management | 🟡 No `.env.example` or environment variable documentation |
| Monitoring | ✅ Appropriate for scope — Lighthouse + console |
| Incident response | ✅ N/A — static app, no backend |

---

## 11. Recommendations (Prioritised)

### Must Fix — Before Development Begins

| # | Recommendation | Impact |
|---|---------------|--------|
| R1 | **Fix Jest/Vitest inconsistency** (G-01): Update Sections 1 and 5 to exclusively reference Vitest. | Prevents developer confusion during testing setup |
| R2 | **Add ErrorBoundary to folder structure and component diagram** (G-02): Add `ErrorBoundary.jsx` to `src/components/` and wrap `<App>` in `main.jsx`. | Prevents silent render crashes reaching the user |
| R3 | **Add ESLint/Prettier config files to folder structure** (G-03): Show `.eslintrc.js` with `react-hooks/exhaustive-deps` and `.prettierrc`. | Prevents R-01 (useEffect dependency errors) at dev time |
| R4 | **Add package.json scripts block** (G-04): Document `dev`, `build`, `preview`, `test`, `lint` scripts. | Eliminates ambiguity for developers setting up the project |

### Should Fix — During Implementation

| # | Recommendation | Impact |
|---|---------------|--------|
| R5 | **Add `maxLength` to task input** (R-02): Set max 500 characters; validate in handler before state update. | Prevents UI breakage and quota acceleration |
| R6 | **Move `uuid` dependency to `App.jsx`** (Component review): `useLocalStorage` should not know about task structure. | Improves hook reusability and separation of concerns |
| R7 | **Namespace the localStorage key** (R-03): Use `todo-app:tasks` instead of `todo-app-tasks`. | Prevents future key collisions |
| R8 | **Add CSP headers for production** (Security): Configure via hosting platform. | Defence-in-depth for production deployment |

### Could Fix — Future Enhancement

| # | Recommendation |
|---|---------------|
| R9 | Merge `vitest.config.js` into `vite.config.js` (G-05) |
| R10 | Add TypeScript in a future story for better refactoring safety |
| R11 | Add bundle analyser (`rollup-plugin-visualizer`) to enforce the 150KB gzip target |
| R12 | Add GitHub Actions workflow for automated `test` + `build` on push |

---

## 12. Approved Design Decisions

The following architectural decisions are approved without change:

| Decision | Status |
|----------|--------|
| React 18 + functional components + hooks | ✅ Approved |
| Vite 5 as build tool | ✅ Approved |
| Vitest + React Testing Library | ✅ Approved |
| CSS Modules with design system conventions | ✅ Approved |
| Flat `src/components/` folder structure | ✅ Approved |
| `uuid` npm package for task IDs | ✅ Approved |
| `useLocalStorage` custom hook pattern | ✅ Approved |
| Tasks appended chronologically (bottom) | ✅ Approved |
| `StorageBanner` for localStorage errors | ✅ Approved |
| `React.memo` + `useCallback` optimisations | ✅ Approved |
| Traceability matrix (FR/NFR → component) | ✅ Approved |

---

## 13. Architecture Updates Required

The following updates should be applied to `outputs/architecture.md` before development:

| Section | Update Required |
|---------|---------------|
| Section 1 (Executive Summary) | Replace "Jest + React Testing Library" with "Vitest + React Testing Library" |
| Section 5 (Testing table) | Replace "Jest / Istanbul" rows with "Vitest / V8 coverage" |
| Section 5 (Note) | Remove the corrective Note — make Vitest the primary statement, not a footnote |
| Section 11 (Folder Structure) | Add `ErrorBoundary.jsx`, `.eslintrc.js`, `.prettierrc` to structure |
| Section 11 (Folder Structure) | Remove `vitest.config.js` (merge into `vite.config.js`) |
| Section 11 (Deployment) | Add `package.json` scripts block |
| Section 4 (Component table) | Move `uuid` dependency from `useLocalStorage.js` to `App.jsx` |

---

## 14. Action Items

| Action | Owner | Priority | Status |
|--------|-------|----------|--------|
| Update architecture.md Sections 1, 5 — Jest → Vitest | Implementation Agent | High | Open |
| Add `ErrorBoundary.jsx` to folder structure + component diagram | Implementation Agent | High | Open |
| Add `.eslintrc.js` and `.prettierrc` to folder structure | Implementation Agent | High | Open |
| Add `package.json` scripts to architecture | Implementation Agent | High | Open |
| Add `maxLength` constraint to TaskInput specification | Implementation Agent | Medium | Open |
| Move `uuid` to `App.jsx` in component table | Implementation Agent | Medium | Open |
| Namespace localStorage key | Implementation Agent | Medium | Open |
| Confirm design system CSS tokens | Design Team | Medium | Open |

---

## 15. Sign-Off & Approval

| | |
|-|-|
| **Reviewer** | Design Review Agent (agent-003-design-review) |
| **Review Date** | 2026-05-26 |
| **Assessment** | ✅ Approved with Minor Recommendations |
| **Critical Blockers** | None |
| **Approval Conditions** | 4 important gaps (G-01 through G-04) to be resolved during implementation setup — not blockers to starting development |
| **Next Step** | Hand off to **Implementation Planning Agent (agent-004)** |

---

*Generated: 2026-05-26T07:30:00Z*
*Issue: https://jiraeu.epam.com/browse/EPMCDMETST-43701*
*Reviews: outputs/architecture.md (93efa23)*
