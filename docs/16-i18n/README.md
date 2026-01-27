# Розділ 16: Internationalization (i18n) Strategy

**Версія:** 1.0  
**Дата:** 27 січня 2026  
**Власник:** Product & Engineering Team  

---

## 16.1. Executive Summary

**Мета:** Визначити стратегію інтернаціоналізації для експансії за межі України.

**Ключові Принципи:**
- 🇺🇦 **Ukraine-first** (MVP — тільки українська)
- 🌍 **Global-ready** (архітектура готова до багатомовності)
- 🎯 **Market-driven** (додаємо мови на основі попиту)
- 📍 **Localization > Translation** (адаптація, а не просто переклад)

**Roadmap:**
- **Phase 1 (0-6 міс):** Українська мова only
- **Phase 2 (6-12 міс):** Англійська + Східна Європа (Польща, Румунія)
- **Phase 3 (12-24 міс):** Глобальна експансія (США, Канада, Західна Європа)

---

## 16.2. Language Strategy

### 🌍 Target Markets & Languages

**Phase 1: Ukraine (MVP) — Month 0-6**

| Language | Locale | Market Size | Priority | Status |
|----------|--------|-------------|----------|--------|
| **Українська** | uk-UA | 45,000 lawyers | P0 | ✅ MVP |

**Why Ukraine-only in MVP:**
- Focus on PMF (product-market fit)
- Знаємо ринок
- Швидше ітерації (no translation overhead)
- Локальні інтеграції (Дія.Підпис, суди)

---

**Phase 2: Eastern Europe — Month 6-12**

| Language | Locale | Market Size | Priority | Effort |
|----------|--------|-------------|----------|--------|
| **Англійська** | en-US | Global | P1 | Medium |
| **Польська** | pl-PL | ~80,000 lawyers | P2 | Medium |
| **Румунська** | ro-RO | ~25,000 lawyers | P2 | Medium |
| **Болгарська** | bg-BG | ~12,000 lawyers | P3 | Medium |

**Why Eastern Europe:**
- Схожі правові системи (post-Soviet)
- Близька культура
- Менша конкуренція (Clio не фокусується)
- Lower pricing tolerance (наша ціна конкурентна)

**Англійська:**
- Міжнародна мова (необхідна для всіх ринків)
- Спрощує подальшу експансію
- Потенційні клієнти в Україні (міжнародні фірми)

---

**Phase 3: Global Expansion — Month 12-24**

| Language | Locale | Market Size | Priority | Effort |
|----------|--------|-------------|----------|--------|
| **Іспанська** | es-ES | ~200,000 lawyers (Spain) | P2 | Medium |
| **Німецька** | de-DE | ~160,000 lawyers (Germany) | P2 | High |
| **Французька** | fr-FR | ~70,000 lawyers (France) | P3 | Medium |
| **Італійська** | it-IT | ~240,000 lawyers (Italy) | P3 | Medium |

**Критерії вибору мови:**
1. Розмір ринку (кількість юристів)
2. Willingness to pay (готовність платити)
3. Конкуренція (чи є локальні CRM?)
4. Складність локалізації (правова система, інтеграції)
5. Мовна складність (складність перекладу)

---

## 16.3. Technical Implementation

### 🔧 i18n Framework

**Library:** next-intl (https://next-intl-docs.vercel.app/)
- Built for Next.js
- Server-side rendering support
- TypeScript-first
- Small bundle size

**Alternative:** react-i18next (більш популярний, але тяжчий)

**Why next-intl:**
- Оптимізований для Next.js 14+
- Server Components support
- Automatic route localization
- Smaller bundle

---

### 📁 File Structure

```
/messages
  ├── uk.json         (українська)
  ├── en.json         (англійська)
  ├── pl.json         (польська)
  └── ro.json         (румунська)

/app
  └── [locale]        (dynamic route)
      ├── cases
      ├── clients
      └── ...
```

**Translation Files (JSON):**
```json
// messages/uk.json
{
  "common": {
    "save": "Зберегти",
    "cancel": "Скасувати",
    "delete": "Видалити",
    "loading": "Завантаження..."
  },
  "cases": {
    "title": "Справи",
    "create": "Створити справу",
    "status": {
      "active": "Активна",
      "inProgress": "В роботі",
      "completed": "Завершена"
    }
  },
  "validation": {
    "required": "Це поле обов'язкове",
    "email": "Введіть коректний email",
    "phone": "Введіть коректний номер телефону"
  }
}
```

```json
// messages/en.json
{
  "common": {
    "save": "Save",
    "cancel": "Cancel",
    "delete": "Delete",
    "loading": "Loading..."
  },
  "cases": {
    "title": "Cases",
    "create": "Create Case",
    "status": {
      "active": "Active",
      "inProgress": "In Progress",
      "completed": "Completed"
    }
  }
}
```

---

### 💻 Code Usage

```tsx
// app/[locale]/cases/page.tsx
import { useTranslations } from 'next-intl';

export default function CasesPage() {
  const t = useTranslations('cases');
  
  return (
    <div>
      <h1>{t('title')}</h1>
      <Button>{t('create')}</Button>
      
      <StatusBadge>{t('status.active')}</StatusBadge>
    </div>
  );
}
```

**With Variables:**
```tsx
const t = useTranslations('notifications');

// messages/uk.json: "caseCreated": "Справу {name} успішно створено"
// messages/en.json: "caseCreated": "Case {name} created successfully"

<Toast>{t('caseCreated', { name: caseName })}</Toast>
```

**Pluralization:**
```json
// messages/uk.json
{
  "cases": {
    "count": "{count, plural, one {# справа} few {# справи} many {# справ} other {# справ}}"
  }
}

// messages/en.json
{
  "cases": {
    "count": "{count, plural, one {# case} other {# cases}}"
  }
}
```

```tsx
{t('cases.count', { count: 5 })} // "5 справ" / "5 cases"
```

---

### 🌐 Routing Strategy

**URL Structure:**

```
justio.ua/uk/cases      (українська)
justio.ua/en/cases      (англійська)
justio.ua/pl/cases      (польська)
```

**Default Language:**
- Ukraine domain (justio.ua) → Ukrainian default
- International domain (justio.com) → English default
- Auto-detect from browser (`Accept-Language` header)

**Language Switcher:**
- In header (globe icon 🌍)
- Dropdown with flags + language names
- Persists choice in cookie/localStorage
- Redirects to same page in new language

---

### 📅 Date & Time Localization

**Library:** date-fns (https://date-fns.org/)

```tsx
import { format } from 'date-fns';
import { uk, enUS, pl } from 'date-fns/locale';

const locales = { uk, en: enUS, pl };

function formatDate(date: Date, locale: string) {
  return format(date, 'PPP', { locale: locales[locale] });
}

// Ukraine: 27 січня 2026
// English: January 27, 2026
// Polish: 27 stycznia 2026
```

**Time Zones:**
- Store all dates in UTC (database)
- Display in user's local timezone
- Use `Intl.DateTimeFormat` for formatting

```tsx
const formatter = new Intl.DateTimeFormat(locale, {
  dateStyle: 'medium',
  timeStyle: 'short',
});

formatter.format(date); // "27 січ. 2026, 10:00"
```

---

### 💰 Currency & Numbers

**Currency:**
```tsx
const formatter = new Intl.NumberFormat(locale, {
  style: 'currency',
  currency: currencyCode, // UAH, USD, EUR, PLN
});

formatter.format(1000);
// Ukraine (uk, UAH): "1 000,00 ₴"
// USA (en-US, USD): "$1,000.00"
// Poland (pl, PLN): "1 000,00 zł"
```

**Numbers:**
```tsx
const formatter = new Intl.NumberFormat(locale);

formatter.format(1234567.89);
// Ukraine: "1 234 567,89"
// USA: "1,234,567.89"
// Poland: "1 234 567,89"
```

**Handling:**
- Store currency code per organization (UAH, USD, EUR)
- Allow multi-currency invoices (Phase 2+)
- Exchange rates API (if needed)

---

### 📞 Phone Number Formatting

**Library:** libphonenumber-js

```tsx
import { parsePhoneNumber } from 'libphonenumber-js';

const phone = parsePhoneNumber('+380671234567', 'UA');

phone.formatInternational(); // "+380 67 123 4567"
phone.formatNational();      // "067 123 4567"
```

**Country-specific:**
- Ukraine: +380 XX XXX XXXX
- USA: +1 (XXX) XXX-XXXX
- Poland: +48 XXX XXX XXX

---

## 16.4. Localization (L10n) Beyond Translation

### 🎨 Visual Localization

**Date Format:**
- Ukraine: DD.MM.YYYY (27.01.2026)
- USA: MM/DD/YYYY (01/27/2026)
- ISO: YYYY-MM-DD (2026-01-27)

**First Day of Week:**
- Ukraine: Monday
- USA: Sunday
- Middle East: Saturday

**Name Order:**
- Ukraine: Прізвище Ім'я По-батькові
- USA: First Last
- Japan: 姓 名 (Last First)

---

### 📜 Legal & Compliance

**Different per Country:**

| Aspect | Ukraine | Poland | USA |
|--------|---------|--------|-----|
| **Data Protection** | Ukraine Law | GDPR | CCPA (California) |
| **E-Signature** | Дія.Підпис | Qualified eIDAS | DocuSign, Adobe Sign |
| **Invoice Format** | Ukrainian standard | Polish faktura | US invoice |
| **Tax ID** | ЄДРПОУ/ІПН | NIP | EIN |
| **Courts Integration** | Ukrainian courts | Polish courts | PACER (USA) |

**Implication:**
- Separate integrations per country
- Country-specific templates
- Compliance documents (ToS, Privacy Policy) per jurisdiction

---

### 💳 Payment Methods

| Country | Preferred Methods | Implementation |
|---------|------------------|----------------|
| **Ukraine** | Bank cards, LiqPay, WayForPay | ✅ Stripe + Local |
| **Poland** | BLIK, Przelewy24 | Stripe (supports) |
| **USA** | Credit cards, ACH | Stripe |
| **EU** | SEPA, cards | Stripe |

---

### 🏛️ Legal System Differences

**Case Types Vary:**

| Ukraine | USA | Poland |
|---------|-----|--------|
| Цивільне | Civil | Cywilne |
| Кримінальне | Criminal | Karne |
| Господарське | Business | Gospodarcze |
| Адміністративне | Administrative | Administracyjne |

**Terminology:**
- "Адвокат" (Ukraine) ≠ "Lawyer" (USA) ≠ "Adwokat" (Poland)
- Different court structures
- Different document types

**Solution:**
- Flexible case types (user-defined)
- Pre-configured templates per country
- Allow customization

---

## 16.5. Translation Workflow

### 🔄 Translation Process

**1. Source Language:** Ukrainian (our native)
- All UI strings written in Ukrainian first
- Developers use translation keys (not hard-coded text)

**2. Translation:**

**MVP Approach (Bootstrap):**
- Google Translate for initial draft
- Native speaker review (hire freelancer)
- Iterative improvement based on user feedback

**Long-term Approach:**
- Professional translation service (e.g., Lokalise, Phrase)
- Native speakers for each language
- Legal terminology expert review

**3. Review:**
- Native speaker QA
- In-context review (see text in actual UI)
- Legal terminology check

**4. Update:**
- Continuous (as we add features)
- Versioned (sync with releases)

---

### 🛠️ Translation Tools

**Option 1: Manual (JSON files)**
- Pros: Simple, free, full control
- Cons: No collaboration, no context

**Option 2: Lokalise / Phrase (SaaS)**
- Pros: Collaboration, context screenshots, versioning
- Cons: $50-100/month

**Recommendation:**
- Phase 1: Manual (JSON)
- Phase 2+: Lokalise (when 3+ languages)

---

### ✅ Translation Quality Checklist

**Before Launch:**
- [ ] All UI strings translated (100% coverage)
- [ ] No hard-coded text (all via translation keys)
- [ ] Pluralization rules correct
- [ ] Date/number formatting tested
- [ ] Legal terminology reviewed
- [ ] Native speaker QA
- [ ] In-context review (actual app)
- [ ] RTL support (if Arabic/Hebrew) — N/A for now

---

## 16.6. Content Localization

### 📝 Marketing Content

**Website:**
- Landing page (per language)
- Pricing page (with local currency)
- Blog posts (translate popular ones)
- Case studies (local examples)

**Email:**
- Transactional emails (welcome, password reset)
- Marketing emails (newsletters, updates)
- Notifications (reminders, alerts)

**Support:**
- Help center (localized articles)
- FAQs (per market)
- Video tutorials (subtitles or voiceover)

---

### 📚 Legal Documents

**Per Country:**
- Terms of Service
- Privacy Policy
- Data Processing Agreement
- Cookie Policy

**Challenge:** Legal review required for each
**Cost:** $500-1000 per document per language

---

## 16.7. Testing Strategy

### 🧪 i18n Testing

**Unit Tests:**
```tsx
import { renderWithLocale } from '@/test-utils';

test('displays create button in Ukrainian', () => {
  const { getByText } = renderWithLocale(<CasesPage />, 'uk');
  expect(getByText('Створити справу')).toBeInTheDocument();
});

test('displays create button in English', () => {
  const { getByText } = renderWithLocale(<CasesPage />, 'en');
  expect(getByText('Create Case')).toBeInTheDocument();
});
```

**Visual Regression:**
- Screenshot tests per language
- Check text doesn't overflow
- Ensure layout doesn't break

**Manual Testing:**
```
Test Matrix:
Language × Feature × Platform

Example:
- Ukrainian × Create Case × Mobile
- English × Create Case × Desktop
- Polish × Invoice Gen × Mobile
```

---

### 🔍 Common i18n Bugs

**1. Hard-coded text:**
```tsx
// ❌ Bad
<Button>Create Case</Button>

// ✅ Good
<Button>{t('cases.create')}</Button>
```

**2. String concatenation:**
```tsx
// ❌ Bad (breaks in other languages)
const msg = "You have " + count + " cases";

// ✅ Good
const msg = t('cases.count', { count });
```

**3. Assuming word order:**
```tsx
// ❌ Bad (English word order)
"{firstName} {lastName}"

// ✅ Good (use full name key)
t('user.fullName', { firstName, lastName })
// uk: "{lastName} {firstName}"
// en: "{firstName} {lastName}"
```

**4. Date formatting:**
```tsx
// ❌ Bad
date.toLocaleDateString() // Uses browser locale (unpredictable)

// ✅ Good
format(date, 'PPP', { locale: locales[currentLocale] })
```

---

## 16.8. SEO & Localization

### 🔍 SEO Strategy

**URL Structure:**
```
justio.ua/uk/       (українська, for Ukraine)
justio.com/en/      (англійська, global)
justio.com/pl/      (польська, for Poland)
```

**hreflang Tags:**
```html
<link rel="alternate" hreflang="uk" href="https://justio.ua/uk/" />
<link rel="alternate" hreflang="en" href="https://justio.com/en/" />
<link rel="alternate" hreflang="pl" href="https://justio.com/pl/" />
<link rel="alternate" hreflang="x-default" href="https://justio.com/en/" />
```

**Meta Tags:**
```html
<!-- Ukrainian -->
<title>Justio - CRM для юристів</title>
<meta name="description" content="Перша українська CRM для юристів..." />

<!-- English -->
<title>Justio - Legal CRM Software</title>
<meta name="description" content="Modern CRM for law firms..." />
```

**Sitemap:**
```xml
<url>
  <loc>https://justio.ua/uk/</loc>
  <xhtml:link rel="alternate" hreflang="en" href="https://justio.com/en/" />
  <xhtml:link rel="alternate" hreflang="pl" href="https://justio.com/pl/" />
</url>
```

---

## 16.9. User Experience

### 🌍 Language Detection

**Priority Order:**
1. User's saved preference (cookie/account setting)
2. URL path (`/uk/`, `/en/`)
3. Browser `Accept-Language` header
4. IP-based geolocation (fallback)
5. Default (Ukrainian for .ua, English for .com)

**Code:**
```tsx
function detectLocale(request: Request): string {
  // 1. Check cookie
  const cookieLocale = request.cookies.get('NEXT_LOCALE');
  if (cookieLocale) return cookieLocale;
  
  // 2. Check URL
  const urlLocale = request.nextUrl.pathname.split('/')[1];
  if (supportedLocales.includes(urlLocale)) return urlLocale;
  
  // 3. Check Accept-Language
  const browserLocale = request.headers.get('accept-language')?.split(',')[0];
  if (supportedLocales.includes(browserLocale)) return browserLocale;
  
  // 4. Default
  return 'uk';
}
```

---

### 🔄 Language Switcher UI

**Header Component:**
```
┌────────────────────────────────┐
│ Justio    🌍 UA ▼    👤    │
└────────────────────────────────┘
                 │
                 ▼
        ┌────────────────┐
        │ 🇺🇦 Українська │ ← Current (checkmark)
        │ 🇬🇧 English    │
        │ 🇵🇱 Polski     │
        └────────────────┘
```

**Best Practices:**
- Show language name in that language (not translated)
  - ✅ "English" (not "Англійська")
  - ✅ "Polski" (not "Польська")
- Use flags + text (flags alone = accessibility issue)
- Persist choice across sessions
- Redirect to same page in new language

---

## 16.10. Performance Optimization

### ⚡ Bundle Size

**Problem:** Each language = +20-50KB JSON
**Solution:** Code splitting

```tsx
// Load only current language
const messages = await import(`@/messages/${locale}.json`);
```

**Lazy Load:**
- Only load active language
- Prefetch likely next language (user hovers on switcher)

---

### 🚀 Server-Side Rendering

**next-intl supports SSR:**
- Translations available on server
- No flash of untranslated content (FOUT)
- SEO-friendly (bots see translated text)

---

## 16.11. Analytics & Monitoring

### 📊 Track Language Usage

**Metrics:**
- % users per language
- Conversion rate per language
- Churn rate per language
- Support tickets per language

**Tools:**
- Google Analytics (custom dimension: language)
- Mixpanel (user property: locale)

**Insights:**
- Which languages have best retention?
- Which need more attention (high churn)?

---

### 🐛 Error Tracking

**Sentry:**
- Tag errors with locale
- Identify translation issues
- Missing translation key errors

```tsx
Sentry.captureException(error, {
  tags: { locale: currentLocale },
});
```

---

## 16.12. Rollout Strategy

### 🚀 Launch Plan

**Phase 1: Ukraine (MVP)**
- Month 0: Ukrainian only
- Focus: PMF, product stability

**Phase 2: English + Poland**
- Month 6: Add English (for international + UA expats)
- Month 9: Add Polish (first foreign market)
- Strategy: Soft launch → collect feedback → iterate

**Phase 3: Expansion**
- Month 12+: Add based on demand
- Strategy: Survey users "What language do you want?"

---

### 📈 Success Metrics

**Per Language:**
- New user sign-ups
- Conversion to paid
- Retention (Month 1, Month 3)
- NPS score

**Goal:**
- Each new language: 100+ users in 3 months
- Retention comparable to Ukrainian version
- If not → pause expansion, improve product

---

## 16.13. Challenges & Solutions

### 🤔 Common Challenges

**Challenge 1: Right-to-Left (RTL) Languages**
- Languages: Arabic, Hebrew
- Solution: CSS logical properties (`start`, `end` instead of `left`, `right`)
- Not priority for Phase 1-2

**Challenge 2: Long Translations**
- German words can be 2x longer than English
- Solution: Test UI with longest language, use flexible layouts

**Challenge 3: Pluralization Rules**
- Ukrainian: one, few, many (складно!)
- Solution: Use proper i18n library (handles this)

**Challenge 4: Legal Terminology**
- Each country has unique legal terms
- Solution: Hire legal translators, not just linguists

**Challenge 5: Maintaining Translations**
- New features → new strings → all languages need update
- Solution: Translation management tool (Lokalise)

---

## 16.14. Internationalization Checklist

### ✅ Before Adding New Language

**Technical:**
- [ ] Translation file created (messages/xx.json)
- [ ] 100% string coverage (no missing keys)
- [ ] Pluralization rules defined
- [ ] Date/number formatting tested
- [ ] Currency formatting tested
- [ ] Email templates translated

**Content:**
- [ ] Landing page translated
- [ ] Help center (key articles)
- [ ] Legal docs (ToS, Privacy Policy)
- [ ] Transactional emails

**Testing:**
- [ ] Visual regression tests (screenshots)
- [ ] Manual QA (native speaker)
- [ ] Legal terminology review

**Business:**
- [ ] Payment method supported
- [ ] Customer support (language availability)
- [ ] Local partnerships (if needed)

**Launch:**
- [ ] SEO (hreflang, meta tags)
- [ ] Analytics tracking
- [ ] Announcement (blog post, email)

---

## 16.15. Cost Estimation

### 💰 Budget per Language

| Item | Cost | Frequency |
|------|------|-----------|
| **Initial Translation** | $2,000 | One-time |
| **Legal Doc Translation** | $1,000 | One-time |
| **Native Speaker QA** | $500 | One-time |
| **Ongoing Updates** | $200/mo | Monthly |
| **Support (bilingual)** | $1,500/mo | Monthly |
| **Total Year 1** | ~$8,000 | - |

**Per Language Investment:**
- Polish: $8,000
- Romanian: $8,000
- English: $5,000 (easier to find translators)

**Phase 2 Total:** ~$20,000 (3 languages)

---

## 16.16. Key Takeaways

### 🎯 Best Practices

**DO:**
- ✅ Design for i18n from day 1 (even if single language)
- ✅ Use translation keys (never hard-coded text)
- ✅ Test with longest language (German)
- ✅ Hire native speakers for QA
- ✅ Localize, don't just translate

**DON'T:**
- ❌ Hard-code text
- ❌ Assume English word order
- ❌ Use Google Translate without review
- ❌ Add language without business case
- ❌ Forget about RTL (if targeting Arabic)

---

**Status:** ✅ Ready for Implementation  
**Next:** Implement i18n infrastructure (even with 1 language)  
**Owner:** Engineering Lead + Product Manager
