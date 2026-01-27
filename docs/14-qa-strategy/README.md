# Розділ 14: QA Strategy & Testing

**Версія:** 1.0  
**Дата:** 27 січня 2026  
**Власник:** QA Team  

---

## 14.1. Executive Summary

**Мета:** Забезпечити високу якість продукту через comprehensive testing strategy.

**Філософія QA:**
> "Quality is not an act, it is a habit." — Aristotle

- Testing як частина розробки (не afterthought)
- Automated testing where possible
- Manual testing for UX and edge cases
- Continuous quality improvement

**Key Metrics:**
- Bug escape rate: <5% (bugs found in production)
- Test coverage: >80% (critical paths)
- Regression prevention: 100% (no old bugs resurface)

---

## 14.2. Testing Pyramid

```
           /\
          /  \         E2E Tests
         /____\        (10% effort)
        /      \
       /        \      Integration Tests
      /__________\     (30% effort)
     /            \
    /              \   Unit Tests
   /________________\  (60% effort)
```

**Rationale:**
- Unit tests: fast, cheap, catch bugs early
- Integration tests: verify components work together
- E2E tests: slow, expensive, but critical user flows

---

## 14.3. Test Types & Coverage

### 1️⃣ Unit Testing

**What:** Test individual functions/components in isolation

**Tools:**
- Jest (test runner)
- React Testing Library (component tests)
- Vitest (faster alternative to Jest)

**Coverage Target:** 80%+ for:
- Business logic (utils, helpers)
- React components (critical UI)
- API functions

**Example:**
```typescript
// utils/formatCurrency.test.ts
describe('formatCurrency', () => {
  it('formats UAH correctly', () => {
    expect(formatCurrency(1000, 'UAH')).toBe('1 000 грн');
  });
  
  it('handles zero', () => {
    expect(formatCurrency(0, 'UAH')).toBe('0 грн');
  });
  
  it('handles negative amounts', () => {
    expect(formatCurrency(-500, 'UAH')).toBe('-500 грн');
  });
});
```

**What NOT to test:**
- Third-party libraries (already tested)
- Trivial code (getters/setters)
- Implementation details (test behavior, not internals)

---

### 2️⃣ Integration Testing

**What:** Test multiple components/services working together

**Scenarios:**
- API endpoints + database (Supabase queries)
- Frontend components + API calls
- Authentication flow (sign up → verify email → login)

**Tools:**
- Supertest (API testing)
- React Testing Library (component integration)
- Playwright (browser-based integration)

**Example:**
```typescript
// tests/api/cases.integration.test.ts
describe('Cases API', () => {
  it('creates case and assigns to user', async () => {
    const user = await createTestUser();
    const token = await getAuthToken(user);
    
    const response = await request(app)
      .post('/api/cases')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Test Case', clientId: 'client-123' });
    
    expect(response.status).toBe(201);
    expect(response.body.userId).toBe(user.id);
    
    // Verify in database
    const caseInDb = await supabase
      .from('cases')
      .select('*')
      .eq('id', response.body.id)
      .single();
    
    expect(caseInDb.data.name).toBe('Test Case');
  });
});
```

**Coverage Target:** 60%+ of critical paths

---

### 3️⃣ End-to-End (E2E) Testing

**What:** Test complete user workflows in real browser

**Tools:**
- Playwright (primary)
- Cypress (alternative)

**Critical User Flows (MUST test):**
1. Sign up → create case → add event → receive notification
2. Login → upload document → view document
3. Create client → create case for client → log time → generate invoice
4. Mobile: create case → go offline → sync when online

**Example:**
```typescript
// e2e/case-creation.spec.ts
import { test, expect } from '@playwright/test';

test('user can create case', async ({ page }) => {
  // Login
  await page.goto('/login');
  await page.fill('[name="email"]', 'test@example.com');
  await page.fill('[name="password"]', 'password123');
  await page.click('button[type="submit"]');
  
  // Navigate to cases
  await page.click('text=Справи');
  await page.click('text=Створити справу');
  
  // Fill form
  await page.fill('[name="name"]', 'Розлучення Тест');
  await page.selectOption('[name="type"]', 'civil');
  await page.click('text=Зберегти');
  
  // Verify
  await expect(page).toHaveURL(/\/cases\/[a-z0-9-]+/);
  await expect(page.locator('h1')).toContainText('Розлучення Тест');
});
```

**Coverage Target:** Top 10 user flows (100%)

**Run Frequency:**
- Before every release (mandatory)
- Nightly (automated in CI/CD)

---

### 4️⃣ API Testing

**What:** Test backend API endpoints directly

**Tools:**
- Postman (manual + Newman for automation)
- Thunder Client (VS Code extension)
- Supertest (code-based)

**Test Cases:**
- Happy path (valid input → success)
- Validation (invalid input → 400 error)
- Authentication (no token → 401, wrong token → 403)
- Edge cases (empty arrays, nulls, Unicode)
- Performance (response time <300ms)

**Example Postman Collection:**
```json
{
  "name": "Justio API Tests",
  "requests": [
    {
      "name": "Create Case - Success",
      "request": {
        "method": "POST",
        "url": "{{baseUrl}}/api/cases",
        "header": [{ "key": "Authorization", "value": "Bearer {{token}}" }],
        "body": { "name": "Test Case", "clientId": "abc" }
      },
      "tests": [
        "pm.test('Status is 201', () => pm.response.to.have.status(201));",
        "pm.test('Has ID', () => pm.response.json().id);"
      ]
    }
  ]
}
```

**Coverage Target:** All API endpoints

---

### 5️⃣ Mobile Testing

**What:** Ensure app works on real devices

**Devices to Test:**
- iPhone (iOS Safari)
- Android (Chrome)
- Tablet (iPad)

**Key Areas:**
- Touch interactions (tap, swipe)
- Offline functionality (PWA)
- Performance (load time, animations)
- Responsive layout (portrait/landscape)

**Tools:**
- BrowserStack (cloud devices)
- Physical devices (team phones)
- Playwright mobile emulation

**Test Matrix:**
| Device | OS | Browser | Frequency |
|--------|----|----|-----------|
| iPhone 13 | iOS 17 | Safari | Every release |
| Samsung Galaxy S22 | Android 13 | Chrome | Every release |
| iPad | iOS 17 | Safari | Weekly |

---

### 6️⃣ Performance Testing

**What:** Ensure app is fast and scalable

**Metrics:**
- Page Load Time: <2s
- Time to Interactive: <3s
- API Response (p95): <300ms
- Lighthouse Score: >90

**Tools:**
- Lighthouse (automated)
- WebPageTest
- k6 (load testing)

**Load Testing Scenarios:**
- 100 concurrent users (MVP target)
- 1,000 concurrent users (6 months)
- 10,000 concurrent users (future)

**Example k6 Script:**
```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  vus: 100, // virtual users
  duration: '30s',
};

export default function () {
  let res = http.get('https://justio.ua/api/cases');
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time <300ms': (r) => r.timings.duration < 300,
  });
  sleep(1);
}
```

---

### 7️⃣ Security Testing

**What:** Find vulnerabilities before hackers do

**Types:**
- OWASP Top 10 (XSS, SQL injection, CSRF)
- Authentication bypass attempts
- Authorization checks (can user A access user B's data?)
- Data exposure (no PII in logs/errors)

**Tools:**
- OWASP ZAP (automated scanner)
- npm audit (dependency vulnerabilities)
- Snyk (continuous monitoring)
- Manual penetration testing

**Critical Checks:**
- ✅ No SQL injection (use parameterized queries)
- ✅ XSS prevention (sanitize inputs)
- ✅ CSRF tokens (for state-changing requests)
- ✅ Row-Level Security (users can't see others' data)
- ✅ Secrets not in code (use env variables)

**Frequency:**
- Automated: Every build (npm audit)
- Manual pentest: Before launch + quarterly

---

### 8️⃣ Accessibility Testing

**What:** Ensure app is usable by people with disabilities

**Standards:** WCAG 2.1 AA

**Tools:**
- axe DevTools (browser extension)
- Lighthouse accessibility audit
- Manual screen reader testing (NVDA, VoiceOver)

**Key Checks:**
- ✅ Color contrast ≥4.5:1
- ✅ Keyboard navigation works
- ✅ Images have alt text
- ✅ Forms have labels
- ✅ Semantic HTML (not just divs)

**Manual Test:**
- Navigate entire app with keyboard only (no mouse)
- Use screen reader for critical flows

---

### 9️⃣ Regression Testing

**What:** Ensure old bugs don't come back

**Strategy:**
- Every bug fix → add test case
- Run ALL tests before release
- Automated in CI/CD

**Example:**
```typescript
// Bug: Deleting case doesn't remove associated events
test('deleting case removes events', async () => {
  const case = await createCase();
  const event = await createEvent({ caseId: case.id });
  
  await deleteCase(case.id);
  
  const eventExists = await supabase
    .from('events')
    .select('*')
    .eq('id', event.id)
    .single();
  
  expect(eventExists.data).toBeNull();
});
```

---

## 14.4. Test Environment Setup

### 🌍 Environments

| Environment | Purpose | URL | Database |
|-------------|---------|-----|----------|
| **Local** | Development | localhost:3000 | Local Supabase |
| **Staging** | Testing | staging.justio.ua | Staging DB |
| **Production** | Live | justio.ua | Production DB |

**Rules:**
- NEVER test on production database
- Staging mirrors production (same setup)
- Automated tests run on CI/CD

---

### 🧪 Test Data Management

**Strategy:**
- Seed data for development (sample cases, users)
- Factories for tests (create test data programmatically)
- Cleanup after tests (delete test data)

**Example Factory:**
```typescript
// tests/factories/case.factory.ts
export async function createTestCase(overrides = {}) {
  const defaults = {
    name: `Test Case ${Date.now()}`,
    type: 'civil',
    status: 'active',
    userId: await createTestUser().id,
  };
  
  return supabase
    .from('cases')
    .insert({ ...defaults, ...overrides })
    .select()
    .single();
}
```

**Cleanup:**
```typescript
afterEach(async () => {
  await supabase.from('cases').delete().like('name', 'Test Case%');
});
```

---

## 14.5. CI/CD Integration

### 🚀 Automated Testing Pipeline

**GitHub Actions Workflow:**
```yaml
name: Test Suite

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      
      - name: Install dependencies
        run: npm ci
      
      - name: Lint
        run: npm run lint
      
      - name: Unit tests
        run: npm test -- --coverage
      
      - name: Build
        run: npm run build
      
      - name: E2E tests
        run: npx playwright test
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

**When Tests Run:**
- On every commit (unit + integration)
- On PR (full suite)
- Before deploy (E2E + smoke tests)
- Nightly (full regression suite)

---

## 14.6. Bug Management

### 🐛 Bug Lifecycle

**1. Discovery:**
- User report (support ticket)
- QA finds during testing
- Automated test fails
- Monitoring alert (Sentry)

**2. Triage:**
- Severity: Critical / High / Medium / Low
- Priority: P0 (hotfix now) → P3 (nice to have)
- Assign to developer

**3. Fix:**
- Developer reproduces
- Writes failing test
- Fixes bug
- Test passes
- Code review

**4. Verification:**
- QA verifies fix
- Regression test added
- Deploy to staging → production

**5. Close:**
- Mark as resolved
- Update changelog

---

### 🔥 Severity Levels

| Severity | Definition | Example | Response Time |
|----------|-----------|---------|---------------|
| **Critical** | App unusable | Can't login, data loss | <1 hour |
| **High** | Major feature broken | Can't create cases | <4 hours |
| **Medium** | Minor feature broken | Filter doesn't work | <24 hours |
| **Low** | Cosmetic issue | Text misaligned | Next sprint |

---

### 📝 Bug Report Template

```markdown
## Bug Description
Brief description of the issue

## Steps to Reproduce
1. Go to...
2. Click on...
3. See error

## Expected Behavior
What should happen

## Actual Behavior
What actually happened

## Screenshots/Video
(if applicable)

## Environment
- Browser: Chrome 120
- OS: Windows 11
- Device: Desktop
- User: test@example.com

## Additional Context
Any other relevant info
```

---

## 14.7. Test Documentation

### 📚 Test Plan Template

**For Each Release:**

```markdown
# Test Plan: v1.1.0

## Scope
- New features: Invoice generation
- Bug fixes: #123, #456
- Regression: All critical paths

## Test Cases
| ID | Description | Type | Status |
|----|------------|------|--------|
| TC-001 | Create invoice | Manual | ✅ Pass |
| TC-002 | Invoice PDF | Auto | ✅ Pass |
| TC-003 | Edge case: no items | Manual | ❌ Fail |

## Risks
- Invoice generation performance (many items)

## Sign-off
- QA Lead: ✅ Approved
- Product: ✅ Approved
```

---

## 14.8. Quality Gates

### 🚪 Definition of Done (DoD)

**Before ANY feature is "done":**
- [ ] Code written and reviewed
- [ ] Unit tests written (80%+ coverage)
- [ ] Integration tests (if applicable)
- [ ] Manual testing passed
- [ ] No critical/high bugs
- [ ] Documentation updated
- [ ] Deployed to staging
- [ ] Product Owner accepts

**Before Release:**
- [ ] All tests pass (unit + integration + E2E)
- [ ] No P0/P1 bugs
- [ ] Performance benchmarks met
- [ ] Security scan passed
- [ ] Changelog updated
- [ ] Rollback plan documented

---

## 14.9. Testing Schedule

### 📅 When We Test

**Daily:**
- Unit tests (on every commit)
- Linting (automated)

**Per Feature:**
- Integration tests
- Manual testing (QA)

**Before Release:**
- Full regression suite (E2E)
- Performance testing
- Security scan
- Smoke tests on staging

**Weekly:**
- Mobile device testing
- Accessibility audit

**Monthly:**
- Load testing
- Security penetration test (manual)

---

## 14.10. Metrics & Reporting

### 📊 QA Metrics to Track

| Metric | Target | Current | Trend |
|--------|--------|---------|-------|
| **Test Coverage** | 80% | - | - |
| **Bug Escape Rate** | <5% | - | - |
| **Avg Bug Fix Time** | <24h | - | - |
| **Test Pass Rate** | >95% | - | - |
| **Production Bugs/Month** | <5 | - | - |

**Tools:**
- Codecov (coverage)
- Jira (bug tracking)
- Sentry (production errors)

---

## 14.11. Manual Testing Checklist

### ✅ Pre-Release Checklist

**Functional:**
- [ ] Sign up flow works
- [ ] Login/logout works
- [ ] Create case → success
- [ ] Upload document → visible
- [ ] Create event → calendar shows it
- [ ] Notifications sent
- [ ] Invoice generation → PDF correct

**UI/UX:**
- [ ] Mobile responsive (iPhone, Android)
- [ ] Buttons clickable (no overlap)
- [ ] Forms validate correctly
- [ ] Error messages helpful
- [ ] Loading states show

**Cross-Browser:**
- [ ] Chrome (latest)
- [ ] Safari (latest)
- [ ] Firefox (latest)
- [ ] Mobile Safari (iOS)
- [ ] Mobile Chrome (Android)

**Performance:**
- [ ] Page load <2s
- [ ] No console errors
- [ ] Lighthouse score >90

**Security:**
- [ ] Can't access other users' data
- [ ] Passwords encrypted
- [ ] HTTPS everywhere

---

## 14.12. Testing Tools Stack

### 🛠️ Recommended Tools

| Category | Tool | Why |
|----------|------|-----|
| **Unit Testing** | Jest + RTL | Standard for React |
| **E2E Testing** | Playwright | Fast, reliable, multi-browser |
| **API Testing** | Postman + Newman | Easy to use, automatable |
| **Performance** | Lighthouse | Free, comprehensive |
| **Security** | OWASP ZAP | Open-source, industry standard |
| **Accessibility** | axe DevTools | WCAG compliant |
| **Load Testing** | k6 | Modern, developer-friendly |
| **Monitoring** | Sentry | Error tracking in production |

---

## 14.13. Challenges & Solutions

### 🤔 Common Testing Challenges

**Challenge 1: Flaky Tests**
- **Problem:** Tests pass sometimes, fail other times
- **Causes:** Race conditions, network issues, timing
- **Solution:** Add waits, retry logic, isolate tests

**Challenge 2: Slow E2E Tests**
- **Problem:** E2E suite takes 30 minutes
- **Solution:** Parallelize, run only critical paths pre-deploy, full suite nightly

**Challenge 3: Testing Offline Mode**
- **Problem:** Hard to simulate offline in tests
- **Solution:** Playwright network emulation, service worker mocking

**Challenge 4: Testing Payments**
- **Problem:** Can't use real payments in tests
- **Solution:** Stripe test mode, mock payment gateway

---

## 14.14. Future Improvements

### 🚀 Testing Roadmap

**Phase 1 (MVP):**
- ✅ Unit tests for critical logic
- ✅ Manual E2E testing
- ✅ Basic CI/CD

**Phase 2 (Post-Launch):**
- 🔲 Automated E2E tests (Playwright)
- 🔲 Performance testing (k6)
- 🔲 Test coverage >80%

**Phase 3 (Growth):**
- 🔲 Visual regression testing (Percy, Chromatic)
- 🔲 Contract testing (API contracts)
- 🔲 Chaos engineering (simulate failures)

---

**Status:** ✅ Ready for Implementation  
**Owner:** QA Lead + Engineering Team  
**Next Review:** After MVP launch
