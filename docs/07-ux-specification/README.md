# Розділ 7: UX/UI Specification

**Версія:** 1.0  
**Дата:** 27 січня 2026  
**Власник:** Design Team  

---

## 7.1. Design Philosophy

### 🎯 Core Principles

**1. Clarity Over Cleverness**
> "Юрист має розуміти інтерфейс за 3 секунди. Без гадання."

- Зрозумілі лейбли (не "Items" → "Справи")
- Очевидні дії (великі кнопки, чіткий CTA)
- Мінімум кроків до результату
- Українська мова (не калька з англійської)

**2. Mobile-First, Always**
> "70% часу юристи працюють з телефону. Desktop — бонус."

- Розробка починається з mobile layout
- Touch-friendly: кнопки мінімум 44×44px
- Thumb-zone оптимізація (важливі дії внизу екрану)
- Жести: swipe, pull-to-refresh

**3. Offline-First**
> "Суди, метро, поїздки — немає інтернету. Продукт має працювати."

- Критичні функції доступні офлайн
- Чітка індикація online/offline статусу
- Автосинхронізація без manual refresh
- Конфлікти розв'язуються автоматично (last-write-wins)

**4. Speed & Performance**
> "Кожна мілісекунда затримки = lost engagement."

- Skeleton screens (не спінери)
- Optimistic UI (показуємо результат відразу)
- Lazy loading для важких елементів
- Prefetch критичних даних

**5. Trust & Transparency**
> "Юристи працюють з конфіденційними даними. Довіра = все."

- Чіткі privacy policies
- Видимі security indicators (🔒)
- Прозора комунікація про зміни
- Ніколи не приховувати помилки

---

## 7.2. Visual Design System

### 🎨 Brand Colors

**Primary Palette:**
```
Primary Blue:    #0066FF (дії, CTA, links)
Primary Dark:    #003D99 (headers, emphasis)
Primary Light:   #E6F0FF (backgrounds, hover states)

Usage:
- Buttons (primary actions)
- Links
- Active states
- Brand elements
```

**Secondary Colors:**
```
Success Green:   #00C853 (completed cases, paid invoices)
Warning Orange:  #FF9800 (pending, drafts, approaching deadlines)
Error Red:       #F44336 (overdue, errors, critical)
Info Blue:       #2196F3 (notifications, informational messages)
```

**Neutral Palette:**
```
Black:           #1A1A1A (primary text)
Gray 700:        #4A4A4A (secondary text, icons)
Gray 500:        #9E9E9E (disabled states, borders)
Gray 300:        #E0E0E0 (dividers, subtle borders)
Gray 100:        #F5F5F5 (backgrounds, cards)
White:           #FFFFFF (main background)
```

**Color Usage Rules:**
- Text on white: use Black or Gray 700
- Text on Primary Blue: always White
- Disabled elements: Gray 500
- Borders: Gray 300 (subtle) or Gray 500 (prominent)

---

### ✍️ Typography

**Font Family:** Inter (Google Fonts)
- Clean, modern, highly readable
- Excellent Cyrillic support
- Variable font (optimizes loading)
- Weights: 400 (Regular), 600 (SemiBold), 700 (Bold)

**Why Inter?**
- Designed for UI (better than system fonts)
- Open source
- Great at small sizes (mobile)

**Type Scale:**

| Element | Size | Weight | Line Height | Letter Spacing | Usage |
|---------|------|--------|-------------|----------------|-------|
| **H1** | 32px | 700 | 40px (125%) | -0.5px | Page titles |
| **H2** | 24px | 600 | 32px (133%) | -0.25px | Section headers |
| **H3** | 20px | 600 | 28px (140%) | 0 | Card titles, subsections |
| **Body Large** | 16px | 400 | 24px (150%) | 0 | Intro text, important info |
| **Body** | 14px | 400 | 20px (143%) | 0 | Default text, forms |
| **Body Small** | 12px | 400 | 16px (133%) | 0 | Captions, meta info |
| **Label** | 14px | 600 | 20px (143%) | 0 | Form labels, tags |
| **Button** | 16px | 600 | 24px (150%) | 0 | Button text |

**Mobile Adjustments:**
- H1: 28px (instead of 32px)
- H2: 20px (instead of 24px)
- Body: stay at 14px (too small = hard to read)

**Font Loading:**
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
```

---

### 📐 Spacing System

**Base Unit:** 4px (все кратне 4 для pixel-perfect)

```
Spacing Scale:
4px   (0.25rem) — micro (icon padding)
8px   (0.5rem)  — xxs (tight spacing)
12px  (0.75rem) — xs (compact lists)
16px  (1rem)    — sm (default gap) ← MOST COMMON
24px  (1.5rem)  — md (section spacing)
32px  (2rem)    — lg (major sections)
48px  (3rem)    — xl (page sections)
64px  (4rem)    — xxl (hero sections)
```

**Usage Guidelines:**
- Padding inside cards: 16px (mobile), 24px (desktop)
- Gap between list items: 12px
- Gap between form fields: 16px
- Margin between sections: 32px
- Page padding: 16px (mobile), 24px (desktop)

**Example:**
```css
.card {
  padding: 16px; /* mobile */
  gap: 12px;
}

@media (min-width: 768px) {
  .card {
    padding: 24px; /* desktop */
  }
}
```

---

### 🔘 Components Library

#### 1. Buttons

**Primary Button (Main actions):**
```
Background: #0066FF
Text: White, 16px, weight 600
Padding: 12px 24px
Border radius: 8px
Height: 48px (mobile), 44px (desktop)
Box shadow: 0 1px 3px rgba(0,0,0,0.1)

States:
- Default: #0066FF
- Hover: #0052CC (darker, 10%)
- Active: #003D99 (pressed)
- Disabled: #E0E0E0 bg, #9E9E9E text
- Loading: spinner + "Завантаження..."
- Focus: outline 2px #0066FF, offset 2px

Interaction:
- Hover: lift shadow (0 4px 8px)
- Active: scale(0.98)
```

**Secondary Button (Alternative actions):**
```
Background: White
Border: 1px solid #0066FF
Text: #0066FF, 16px, weight 600
Same padding/height as Primary

States:
- Hover: background #E6F0FF
- Active: background #D1E4FF
```

**Ghost Button (Tertiary actions):**
```
Background: transparent
Text: #0066FF, 16px, weight 600
No border
Padding: 12px 16px

States:
- Hover: background #E6F0FF
- Active: background #D1E4FF
```

**Destructive Button (Delete, etc.):**
```
Background: #F44336
Text: White
Same style as Primary

Use sparingly!
Always confirm before destructive action.
```

**Button Sizes:**
```
Large:  48px height (mobile primary CTA)
Medium: 44px height (desktop default)
Small:  36px height (secondary actions, tables)
```

**Button States:**
```typescript
<Button 
  variant="primary" 
  size="large"
  loading={isLoading}
  disabled={!isValid}
>
  Зберегти справу
</Button>
```

---

#### 2. Input Fields

**Text Input:**
```
Height: 48px (mobile), 44px (desktop)
Padding: 12px 16px
Border: 1px solid #E0E0E0
Border radius: 8px
Font: 16px (avoid iOS zoom-in)
Background: White

States:
- Default: border #E0E0E0
- Focus: border #0066FF, box-shadow 0 0 0 4px #E6F0FF
- Error: border #F44336, box-shadow 0 0 0 4px rgba(244,67,54,0.1)
- Disabled: background #F5F5F5, text #9E9E9E
- Success: border #00C853 (optional, for validation)

Label:
- Font: 14px, weight 600
- Color: #4A4A4A
- Margin bottom: 8px

Helper Text:
- Font: 12px
- Color: #9E9E9E (normal) or #F44336 (error)
- Margin top: 4px

Placeholder:
- Color: #9E9E9E
- Italic: NO (makes it look disabled)
```

**Example:**
```
┌─────────────────────────────────┐
│ Назва справи *                  │ ← Label (14px, weight 600)
├─────────────────────────────────┤
│ Розлучення Іванових            │ ← Input (16px, focus state)
└─────────────────────────────────┘
  Це поле обов'язкове               ← Helper (12px, gray)
```

**Input Variants:**
- Text
- Email (with validation)
- Password (with show/hide toggle)
- Number (with increment/decrement buttons)
- Date (with date picker)
- Select (dropdown)
- Textarea (multi-line, auto-expand)

---

#### 3. Cards

**Standard Card:**
```
Background: White
Border: 1px solid #E0E0E0
Border radius: 12px
Padding: 16px (mobile), 24px (desktop)
Box shadow: 0 1px 3px rgba(0,0,0,0.1)

Hover (if clickable):
- Shadow: 0 4px 12px rgba(0,0,0,0.15)
- Scale: 1.01
- Transition: 200ms ease-out
- Cursor: pointer
```

**Card Structure:**
```
┌────────────────────────────────┐
│ Header (title + action)        │ ← Flex row, justify-between
├────────────────────────────────┤
│                                │
│ Body (content)                 │ ← Main content
│                                │
├────────────────────────────────┤
│ Footer (meta info)             │ ← Optional, gray text
└────────────────────────────────┘
```

**Card Header:**
```
Title: H3 (20px, weight 600)
Subtitle: Body Small (12px, gray)
Action: Button or Icon (right-aligned)
Margin bottom: 16px
```

**Card Variants:**
- Default (white bg)
- Highlighted (light blue bg #E6F0FF)
- Outlined (no shadow, just border)
- Elevated (larger shadow for modals)

---

#### 4. Status Badges

**Badge Style:**
```
Padding: 4px 12px
Border radius: 16px (pill shape)
Font: 12px, weight 600
Display: inline-flex
Gap: 4px (if with icon)
```

**Status Colors:**

| Status | Background | Text | Icon |
|--------|-----------|------|------|
| **Активна** | #E8F5E9 | #00C853 | 🟢 |
| **В роботі** | #E3F2FD | #2196F3 | 🔵 |
| **Завершена** | #F5F5F5 | #4A4A4A | ⚪ |
| **Архів** | #FAFAFA | #9E9E9E | ⚫ |
| **Прострочено** | #FFEBEE | #F44336 | 🔴 |
| **Чернетка** | #FFF3E0 | #FF9800 | 🟠 |
| **Оплачено** | #E8F5E9 | #00C853 | ✅ |
| **Очікує оплати** | #FFF3E0 | #FF9800 | ⏳ |

**Example:**
```html
<span class="badge badge-active">
  🟢 Активна
</span>
```

---

#### 5. Icons

**Icon System:** Lucide Icons (https://lucide.dev/)
- Modern, clean, consistent
- Open-source (MIT)
- React components ready
- 1000+ icons

**Icon Sizes:**
```
Small:  16px (inline with text)
Medium: 20px (default, buttons)
Large:  24px (prominent actions)
XLarge: 32px (empty states, illustrations)
```

**Common Icons:**
```
📁 Folder        → cases (справи)
👤 User          → clients (клієнти)
📅 Calendar      → events (події)
📄 File          → documents (документи)
⏱️  Clock        → time tracking (час)
💰 DollarSign    → billing (рахунки)
⚙️  Settings     → settings (налаштування)
🔔 Bell          → notifications (сповіщення)
🔍 Search        → search (пошук)
➕ Plus          → add (додати)
✏️  Edit         → edit (редагувати)
🗑️  Trash        → delete (видалити)
↗️  ExternalLink → open in new tab
⬇️  Download     → download file
```

**Icon Usage:**
- Always with label (accessibility!)
- Color: inherit from text
- Vertical align: middle
- Padding: 4px around clickable icons

---

#### 6. Form Elements

**Checkbox:**
```
Size: 20×20px
Border: 2px solid #E0E0E0
Border radius: 4px
Background: White

States:
- Unchecked: border #E0E0E0
- Checked: background #0066FF, white checkmark
- Hover: border #0066FF
- Disabled: border #E0E0E0, background #F5F5F5

Label: 14px, to the right, gap 8px
```

**Radio Button:**
```
Size: 20×20px
Border: 2px solid #E0E0E0
Border radius: 50% (circle)

States:
- Unchecked: border #E0E0E0
- Checked: border #0066FF, inner circle #0066FF (8px)
- Hover: border #0066FF

Label: 14px, to the right, gap 8px
```

**Toggle Switch:**
```
Width: 44px
Height: 24px
Border radius: 12px (pill)
Background: #E0E0E0 (off), #0066FF (on)
Circle: 20×20px, white

Usage: Settings, enable/disable features
```

**Select Dropdown:**
```
Same style as Text Input
Chevron down icon: right side
Dropdown menu:
  - Max height: 240px (scrollable)
  - Shadow: 0 4px 12px rgba(0,0,0,0.15)
  - Border radius: 8px
  - Padding: 8px 0
  - Options: 40px height, 12px padding
```

---

#### 7. Modals & Dialogs

**Modal Structure:**
```
Overlay: rgba(0,0,0,0.5) (semi-transparent black)
Container:
  - Background: White
  - Border radius: 12px
  - Padding: 24px
  - Max width: 500px (mobile: 90vw)
  - Shadow: 0 20px 60px rgba(0,0,0,0.3)

Header:
  - Title: H2 (24px)
  - Close button: top-right (×)
  - Border bottom: 1px solid #E0E0E0
  - Padding bottom: 16px

Body:
  - Content (forms, text)
  - Padding: 16px 0

Footer:
  - Buttons (Cancel + Confirm)
  - Border top: 1px solid #E0E0E0
  - Padding top: 16px
  - Align: right (flex-end)
```

**Modal Animations:**
```
Enter: fade-in + scale-up (200ms)
Exit: fade-out + scale-down (150ms)
```

**Accessibility:**
- Focus trap (can't tab outside)
- ESC to close
- Click overlay to close
- ARIA labels

---

#### 8. Notifications (Toast)

**Toast Position:**
```
Desktop: top-right (16px from edge)
Mobile: bottom-center (16px from bottom)
```

**Toast Style:**
```
Background:
  - Success: #00C853
  - Error: #F44336
  - Warning: #FF9800
  - Info: #2196F3

Text: White, 14px
Padding: 12px 16px
Border radius: 8px
Shadow: 0 4px 12px rgba(0,0,0,0.2)
Max width: 400px

Icon: left side (20px)
Message: center
Close button: right side (optional)

Auto-dismiss: 5 seconds (success/info), 10 seconds (error)
```

**Example:**
```
┌─────────────────────────────────┐
│ ✅  Справу успішно створено     │
└─────────────────────────────────┘
```

---

## 7.3. Layout & Grid System

### Desktop Layout (≥1024px)

**Grid:** 12 columns, gap 24px, max-width 1280px

```
┌───────────────────────────────────────────────────┐
│ Header (64px fixed)                               │
│ Logo | Nav | Search | Profile | Notifications    │
├──────────┬────────────────────────────────────────┤
│          │                                        │
│ Sidebar  │          Main Content                  │
│ 240px    │          (fluid, max 1040px)           │
│ fixed    │                                        │
│          │          ┌──────────────────┐          │
│ • Справи │          │   Content Card   │          │
│ • Клієнти│          └──────────────────┘          │
│ • Календ │                                        │
│ • Рахунки│          ┌──────────────────┐          │
│ • Налаш  │          │   Content Card   │          │
│          │          └──────────────────┘          │
│          │                                        │
└──────────┴────────────────────────────────────────┘
```

**Sidebar:**
- Width: 240px (fixed)
- Position: sticky (scrolls with content)
- Collapsible: on tablet (<1024px)
- Active state: highlighted link

**Main Content:**
- Padding: 24px
- Max width: 1040px
- Centered if viewport > max-width

---

### Mobile Layout (<768px)

**Full-width, stacked:**

```
┌──────────────────────┐
│ Header (56px)        │ ← Fixed top
│ ☰ Logo        🔔    │
├──────────────────────┤
│                      │
│   Content            │
│   (100% width)       │
│   padding: 16px      │
│                      │
│   ┌────────────────┐ │
│   │   Card         │ │
│   └────────────────┘ │
│                      │
│   ┌────────────────┐ │
│   │   Card         │ │
│   └────────────────┘ │
│                      │
│                      │ ← Scrollable area
│                      │
│                      │
├──────────────────────┤
│ Bottom Nav (60px)    │ ← Fixed bottom
│ 📁  👤  📅  💰  ⚙️   │
│ Cases Clients Cal... │
└──────────────────────┘
```

**Bottom Navigation (Табы):**
- Height: 60px
- 5 tabs maximum
- Icon (24px) + Label (10px)
- Active state: primary color
- Fixed position (always visible)

---

### Tablet Layout (768-1023px)

**Hybrid:**
- Sidebar: collapsible hamburger menu (slides in)
- Content: full-width with padding
- Bottom nav: NO (use top nav)

---

## 7.4. Key Screens Wireframes

### 🏠 Dashboard (Mobile)

```
┌──────────────────────────────────┐
│ ☰  Justio           🔔(3)    │ ← Header
├──────────────────────────────────┤
│                                  │
│ Доброго дня, Олена! 👋          │ ← Greeting
│ У вас 3 події сьогодні          │
│                                  │
│ ┌──────────────────────────────┐ │
│ │ Статистика                   │ │ ← Stats Card
│ │ ┌──────┬──────┬──────┬──────┐ │ │
│ │ │ 12   │ 3    │ 8    │ 1    │ │ │
│ │ │Справи│Нові  │Робота│Архів │ │ │
│ │ └──────┴──────┴──────┴──────┘ │ │
│ └──────────────────────────────┘ │
│                                  │
│ События сьогодні                 │ ← Section header
│ ┌──────────────────────────────┐ │
│ │ 10:00 📅                     │ │ ← Event card
│ │ Засідання                    │ │
│ │ Розлучення Петренко          │ │
│ │ Київський райсуд             │ │
│ │ 🔵 Активна                   │ │
│ └──────────────────────────────┘ │
│                                  │
│ ┌──────────────────────────────┐ │
│ │ 15:00 💬                     │ │
│ │ Консультація                 │ │
│ │ Іванов М.П.                  │ │
│ └──────────────────────────────┘ │
│                                  │
│ Останні справи  [Всі →]         │
│ ┌──────────────────────────────┐ │
│ │ 📁 Розлучення Петренко       │ │ ← Case card
│ │    Петренко М.І.             │ │
│ │    🟢 Активна • вчора        │ │
│ └──────────────────────────────┘ │
│                                  │
│    [+] Створити справу           │ ← Primary CTA
│                                  │
├──────────────────────────────────┤
│ 📁   👤   📅   💰   ⚙️          │ ← Bottom Nav
│Cases Cli  Cal  Bil  Set         │
└──────────────────────────────────┘
```

---

### 📁 Список Справ (Mobile)

```
┌──────────────────────────────────┐
│ ←  Справи              🔍  ⋮    │ ← Header (back, search, filter)
├──────────────────────────────────┤
│ Фільтри: [Всі ▼] [Нові ▼]      │ ← Filter chips
│                                  │
│ ┌──────────────────────────────┐ │
│ │ 📁 Розлучення Петренко       │ │ ← Case card (clickable)
│ │ Петренко Марія Іванівна      │ │
│ │ 🟢 Активна                   │ │
│ │ Оновлено: вчора              │ │
│ │ ───────────────────────────  │ │
│ │ 📅 Засідання: 15.02 о 10:00  │ │ ← Next event
│ └──────────────────────────────┘ │
│                                  │
│ ┌──────────────────────────────┐ │
│ │ 📁 Спадщина Сидоренко        │ │
│ │ Сидоренко В.П.               │ │
│ │ 🔵 В роботі                  │ │
│ │ Оновлено: 3 дні тому         │ │
│ │ ───────────────────────────  │ │
│ │ 📄 5 документів              │ │
│ └──────────────────────────────┘ │
│                                  │
│ ┌──────────────────────────────┐ │
│ │ 📁 Договір купівлі-продажу   │ │
│ │ ТОВ "Будсервіс"              │ │
│ │ ⚪ Завершена                 │ │
│ │ Оновлено: тиждень тому       │ │
│ └──────────────────────────────┘ │
│                                  │
│      [+] Нова справа             │ ← FAB (Floating Action Button)
│                                  │
└──────────────────────────────────┘
```

**Interactions:**
- Tap card → open case detail
- Swipe left → quick actions (archive, delete)
- Pull down → refresh
- Long press → select mode (bulk actions)

---

### 📋 Сторінка Справи (Mobile)

```
┌──────────────────────────────────┐
│ ←  Розлучення Петренко     ⋮    │ ← Header (back, menu)
├──────────────────────────────────┤
│ Tabs (swipeable):                │
│ [Огляд] Документи Час Рахунки   │ ← Tabs
│ ────────                         │
│                                  │
│ 🟢 Активна                       │ ← Status badge
│                                  │
│ 👤 Клієнт                        │ ← Section
│ ┌──────────────────────────────┐ │
│ │ Петренко Марія Іванівна      │ │ ← Client card (clickable)
│ │ +380 67 123 4567             │ │
│ │ petrenkom@email.com          │ │
│ └──────────────────────────────┘ │
│                                  │
│ 📅 Найближча подія               │
│ ┌──────────────────────────────┐ │
│ │ Перше засідання              │ │ ← Event card
│ │ 15 лютого 2026, 10:00        │ │
│ │ Київський райсуд, зал 12     │ │
│ │ ───────────────────────────  │ │
│ │ 🔔 Нагадування:              │ │
│ │    • За 1 день               │ │
│ │    • За 1 годину             │ │
│ └──────────────────────────────┘ │
│                                  │
│ 📄 Документи (5)      [Всі →]   │
│ • Позовна заява.pdf              │
│ • Довіреність.pdf                │
│ • Скан паспорта.jpg              │
│                                  │
│ ⏱️ Витрачено часу                 │
│ ┌──────────────────────────────┐ │
│ │ 12.5 години                  │ │ ← Time summary
│ │ Останній запис: вчора        │ │
│ └──────────────────────────────┘ │
│                                  │
│ 📝 Примітки                      │
│ Клієнт хоче максимально швидко   │
│ завершити справу...              │
│                                  │
│    [✏️ Редагувати]               │ ← Secondary button
│                                  │
└──────────────────────────────────┘
```

---

### 📅 Календар (Mobile)

```
┌──────────────────────────────────┐
│ ←  Календар            👁️  +    │ ← Header
├──────────────────────────────────┤
│ [Місяць] [Тиждень] [Список]      │ ← View tabs
│ ─────────                        │
│                                  │
│ ← Лютий 2026 →                   │ ← Month navigation
│                                  │
│  Пн  Вт  Ср  Чт  Пт  Сб  Нд     │ ← Calendar grid
│      1   2   3•  4   5   6       │
│  7   8   9  10  11  12  13       │
│ 14 [15]• 16  17  18  19  20      │ ← 15 = today, • = has events
│ 21  22  23  24  25  26  27       │
│ 28  29                           │
│                                  │
│ Події на 15 лютого:              │ ← Selected day events
│                                  │
│ ┌──────────────────────────────┐ │
│ │ 10:00 - 11:00                │ │ ← Event card
│ │ 📅 Перше засідання           │ │
│ │ Розлучення Петренко          │ │
│ │ Київський райсуд             │ │
│ │ 🟢 Активна справа            │ │
│ └──────────────────────────────┘ │
│                                  │
│ ┌──────────────────────────────┐ │
│ │ 15:00 - 16:00                │ │
│ │ 💬 Консультація              │ │
│ │ Іванов М.П.                  │ │
│ │ Zoom                         │ │
│ └──────────────────────────────┘ │
│                                  │
│    [+] Додати подію              │
│                                  │
└──────────────────────────────────┘
```

---

### 💰 Створення Рахунку (Mobile)

```
┌──────────────────────────────────┐
│ ←  Новий рахунок           [✓]  │ ← Header (save button)
├──────────────────────────────────┤
│                                  │
│ Клієнт *                         │ ← Required field
│ ┌──────────────────────────────┐ │
│ │ Петренко Марія Іванівна    ▼ │ │ ← Dropdown (searchable)
│ └──────────────────────────────┘ │
│                                  │
│ Справа (опціонально)             │
│ ┌──────────────────────────────┐ │
│ │ Розлучення Петренко        ▼ │ │
│ └──────────────────────────────┘ │
│                                  │
│ Позиції рахунку                  │
│ ┌──────────────────────────────┐ │
│ │ Консультація                 │ │ ← Invoice item
│ │ 3 год × 1000 грн             │ │
│ │ = 3000 грн              [×]  │ │ ← Delete button
│ └──────────────────────────────┘ │
│                                  │
│ ┌──────────────────────────────┐ │
│ │ Підготовка документів        │ │
│ │ 1 × 5000 грн                 │ │
│ │ = 5000 грн              [×]  │ │
│ └──────────────────────────────┘ │
│                                  │
│    [+ Додати позицію]            │ ← Add button
│                                  │
│ ──────────────────────────────── │
│ Дата виставлення: 27.01.2026     │
│ Термін оплати: 10.02.2026        │
│                                  │
│ ┌──────────────────────────────┐ │
│ │ Разом до сплати:             │ │ ← Total (prominent)
│ │                              │ │
│ │      8000 грн                │ │ ← Large text
│ └──────────────────────────────┘ │
│                                  │
│  [Зберегти чернетку]             │ ← Secondary
│  [Створити PDF]                  │ ← Primary
│                                  │
└──────────────────────────────────┘
```

---

## 7.5. Interaction Patterns

### ✨ Micro-interactions

**1. Button Tap:**
```css
.button {
  transition: all 150ms ease-out;
}

.button:active {
  transform: scale(0.95);
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
```
+ Haptic feedback on mobile (if available)

**2. Card Tap:**
```css
.card-clickable {
  transition: all 200ms ease-out;
}

.card-clickable:hover {
  transform: scale(1.02);
  box-shadow: 0 8px 20px rgba(0,0,0,0.15);
}
```
+ Ripple effect from tap point (Material Design)

**3. Input Focus:**
```css
.input:focus {
  border-color: #0066FF;
  box-shadow: 0 0 0 4px #E6F0FF;
  transition: all 200ms ease-out;
}
```

**4. Success Animation:**
- Checkmark ✅ appears (scale from 0 to 1)
- Green background flash (500ms fade)
- Haptic success feedback

**5. Error Animation:**
- Shake horizontally (300ms)
- Red border flash
- Haptic error feedback

**6. Loading States:**
- Skeleton screens (shimmer effect)
- Spinner (only when can't use skeleton)
- Progress bar (for file uploads)

---

### 🎯 Empty States

**Philosophy:** Never show blank screen. Always give next action.

**Cases (empty):**
```
┌──────────────────────────────────┐
│                                  │
│           📁                     │ ← Large icon (gray)
│                                  │
│   У вас ще немає справ           │ ← Headline (H2)
│                                  │
│   Створіть першу справу, щоб     │ ← Description (Body)
│   почати керувати клієнтами      │
│   та документами в одному місці  │
│                                  │
│    [+] Створити першу справу     │ ← Primary CTA
│                                  │
│    Імпортувати з Excel →         │ ← Secondary action
│                                  │
└──────────────────────────────────┘
```

**Search (no results):**
```
┌──────────────────────────────────┐
│           🔍                     │
│                                  │
│   Нічого не знайдено             │
│                                  │
│   Спробуйте інший пошуковий      │
│   запит або змініть фільтри      │
│                                  │
│    [Скинути фільтри]             │
│                                  │
└──────────────────────────────────┘
```

**Documents (empty):**
```
┌──────────────────────────────────┐
│           📄                     │
│                                  │
│   Немає документів               │
│                                  │
│   Завантажте перший документ     │
│   для цієї справи                │
│                                  │
│    [📤 Завантажити файл]         │
│                                  │
│    Перетягніть файли сюди        │
│                                  │
└──────────────────────────────────┘
```

---

### 🔄 Loading States

**Skeleton Screens > Spinners**

**List Loading:**
```
┌──────────────────────────────────┐
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓            │ ← Gray rectangle (pulse)
│ ▓▓▓▓▓▓▓▓▓▓▓▓                    │
│ ▓▓▓ ▓▓▓▓▓▓                      │
├──────────────────────────────────┤
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓            │
│ ▓▓▓▓▓▓▓▓▓▓▓▓                    │
│ ▓▓▓ ▓▓▓▓▓▓                      │
└──────────────────────────────────┘
```

**Pulse Animation:**
```css
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.skeleton {
  animation: pulse 1.5s ease-in-out infinite;
}
```

**When to use Spinner:**
- Inline actions (button loading)
- Small widgets (where skeleton doesn't make sense)
- Initial app load (splash screen)

---

### ⚠️ Error Handling

**Toast Notifications (Non-critical):**
```
┌──────────────────────────────────┐
│ ❌ Не вдалося зберегти           │ ← Error toast (red bg)
│    Перевірте інтернет-з'єднання  │
│                         [Повтор] │ ← Action button
└──────────────────────────────────┘
```

**Inline Errors (Forms):**
```
Назва справи *
┌─────────────────────────────────┐
│                                 │ ← Empty input (red border)
└─────────────────────────────────┘
⚠️ Це поле обов'язкове              ← Error message (red text)
```

**Error Page (Critical):**
```
┌──────────────────────────────────┐
│           ⚠️                     │
│                                  │
│   Щось пішло не так              │
│                                  │
│   Код помилки: 500               │
│                                  │
│   Ми вже знаємо про проблему     │
│   та працюємо над її вирішенням  │
│                                  │
│    [← Повернутися назад]         │
│    [Оновити сторінку]            │
│                                  │
│    Потрібна допомога? →          │
│                                  │
└──────────────────────────────────┘
```

---

## 7.6. Accessibility (A11Y)

### ♿ WCAG 2.1 AA Compliance

**1. Color Contrast:**
- Normal text: 4.5:1 minimum
- Large text (18px+ или 14px+ bold): 3:1 minimum
- UI components: 3:1 minimum

**Test:** Use Contrast Checker (WebAIM)

**2. Keyboard Navigation:**
- Tab order logical (top → bottom, left → right)
- All interactive elements focusable
- Focus indicator visible (outline 2px)
- Skip to main content link
- ESC closes modals/dropdowns

**3. Screen Reader Support:**
- Semantic HTML (nav, main, article, aside)
- ARIA labels for icons (`aria-label="Зберегти справу"`)
- Alt text for images
- Status announcements (`aria-live="polite"`)
- Form labels properly associated

**4. Touch Targets:**
- Minimum size: 44×44px (iOS/Android guidelines)
- Spacing: 8px between targets
- No tiny buttons!

**5. Text Resizing:**
- Support up to 200% zoom (browser setting)
- Layout doesn't break
- No horizontal scroll (mobile)

---

### 🧪 Accessibility Testing Checklist

**Automated:**
- [ ] Lighthouse audit (score 100)
- [ ] axe DevTools (0 violations)
- [ ] WAVE (no errors)

**Manual:**
- [ ] Keyboard-only navigation works
- [ ] Screen reader test (NVDA/VoiceOver)
- [ ] Color blindness simulation (Chrome DevTools)
- [ ] Zoom to 200% (no break)

---

## 7.7. Responsive Breakpoints

```
Mobile Small: < 375px   (iPhone SE)
Mobile:       375-767px (Most phones)
Tablet:       768-1023px (iPad)
Desktop:      1024-1439px (Laptop)
Desktop XL:   ≥ 1440px  (Large monitors)
```

**Mobile-First CSS:**
```css
/* Mobile (default) */
.container { padding: 16px; }

/* Tablet+ */
@media (min-width: 768px) {
  .container { padding: 24px; }
}

/* Desktop+ */
@media (min-width: 1024px) {
  .container { 
    padding: 32px;
    max-width: 1280px;
    margin: 0 auto;
  }
}
```

---

## 7.8. Animation & Motion

**Principles:**
- Fast (150-300ms)
- Easing: ease-out (feels natural)
- Subtle (не відвертають увагу)
- Purposeful (not for decoration)

**Common Animations:**
```css
/* Fade in */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Slide up */
@keyframes slideUp {
  from { 
    opacity: 0;
    transform: translateY(20px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
}

/* Scale (tap feedback) */
.tap-scale:active {
  transform: scale(0.95);
  transition: transform 150ms ease-out;
}
```

**Performance:**
- Use `transform` and `opacity` (GPU-accelerated)
- Avoid animating `width`, `height`, `top`, `left` (slow)
- Use `will-change` sparingly

**Reduced Motion:**
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 7.9. Dark Mode (Phase 2)

**Not in MVP**, але дизайн готовий:

**Color Adjustments:**
```
Background: #121212 (not pure black #000 - easier on eyes)
Surface: #1E1E1E
Text: #FFFFFF (87% opacity)
Primary: #4D9FFF (lighter blue for contrast)
```

**Implementation:**
- CSS variables for all colors
- `prefers-color-scheme` media query
- User toggle (save preference)

---

## 7.10. Design Tokens (CSS Variables)

```css
:root {
  /* Colors */
  --color-primary: #0066FF;
  --color-primary-dark: #003D99;
  --color-primary-light: #E6F0FF;
  
  --color-success: #00C853;
  --color-warning: #FF9800;
  --color-error: #F44336;
  --color-info: #2196F3;
  
  --color-text: #1A1A1A;
  --color-text-secondary: #4A4A4A;
  --color-text-disabled: #9E9E9E;
  
  --color-bg: #FFFFFF;
  --color-bg-secondary: #F5F5F5;
  --color-border: #E0E0E0;
  
  /* Spacing */
  --space-xs: 8px;
  --space-sm: 16px;
  --space-md: 24px;
  --space-lg: 32px;
  --space-xl: 48px;
  
  /* Typography */
  --font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-size-xs: 12px;
  --font-size-sm: 14px;
  --font-size-base: 16px;
  --font-size-lg: 20px;
  --font-size-xl: 24px;
  --font-size-2xl: 32px;
  
  /* Borders */
  --border-radius: 8px;
  --border-radius-lg: 12px;
  --border-radius-full: 9999px;
  
  /* Shadows */
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.1);
  --shadow-md: 0 4px 12px rgba(0,0,0,0.15);
  --shadow-lg: 0 8px 24px rgba(0,0,0,0.2);
}
```

---

## 7.11. Component Implementation

### React + Tailwind Example

```tsx
// Button.tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

export function Button({
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  children,
  onClick,
}: ButtonProps) {
  const baseClasses = 'rounded-lg font-semibold transition-all active:scale-95';
  
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-white text-blue-600 border border-blue-600 hover:bg-blue-50',
    ghost: 'bg-transparent text-blue-600 hover:bg-blue-50',
  };
  
  const sizeClasses = {
    small: 'h-9 px-4 text-sm',
    medium: 'h-11 px-6 text-base',
    large: 'h-12 px-8 text-lg',
  };
  
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading ? <Spinner /> : children}
    </button>
  );
}
```

---

## 7.12. Design Handoff Checklist

**For Developers:**

**Assets:**
- [ ] Figma file shared (dev mode)
- [ ] Icon library documented (Lucide)
- [ ] Typography specs (fonts, sizes)
- [ ] Color palette (CSS variables)
- [ ] Spacing system (4px grid)

**Components:**
- [ ] Storybook setup (component library)
- [ ] Reusable components (Button, Input, Card)
- [ ] Props documented
- [ ] States defined (hover, active, disabled)

**Responsive:**
- [ ] Mobile designs (375px)
- [ ] Tablet designs (768px)
- [ ] Desktop designs (1280px)
- [ ] Breakpoints documented

**Interactions:**
- [ ] Animations specified (duration, easing)
- [ ] Micro-interactions documented
- [ ] Loading states defined
- [ ] Error states defined

---

## 7.13. Quality Checklist

**Before Launch:**

**Visual:**
- [ ] All screens match designs (Figma vs Build)
- [ ] Colors use design tokens
- [ ] Typography consistent (font, sizes, weights)
- [ ] Spacing uses 4px grid
- [ ] Icons consistent (Lucide, correct sizes)

**Interaction:**
- [ ] All buttons have hover/active states
- [ ] Loading states implemented
- [ ] Error states handled
- [ ] Empty states designed
- [ ] Feedback on all actions (toast, inline)

**Responsive:**
- [ ] Works on iPhone SE (375px)
- [ ] Works on iPad (768px)
- [ ] Works on Desktop (1920px)
- [ ] No horizontal scroll on mobile

**Accessibility:**
- [ ] Color contrast AA compliant
- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] Touch targets ≥44px
- [ ] Screen reader tested

**Performance:**
- [ ] Page load <2s
- [ ] Animations 60fps
- [ ] Images optimized (WebP, lazy load)
- [ ] Fonts optimized (variable, preload)

---

## 7.14. Future Improvements

**Phase 1 (MVP):** Basic design system ✅

**Phase 2 (Post-Launch):**
- 🔲 Dark mode
- 🔲 Themes (custom branding for enterprise)
- 🔲 Advanced animations (page transitions)
- 🔲 Illustration system

**Phase 3 (Growth):**
- 🔲 Design system documentation site
- 🔲 Figma plugin (generate code from design)
- 🔲 A/B testing framework (variant designs)

---

**Status:** ✅ Ready for Development  
**Next:** Build component library in Storybook  
**Owner:** Design Lead + Frontend Team
