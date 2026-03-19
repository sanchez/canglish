# Canglish Brand Guidelines

## Brand Identity

**App Name:** Canglish
**Tagline:** Learn Cantonese using English phonetics
**Description:** A language learning application that helps people learn Cantonese through an intuitive phonetic system. Canglish bridges the gap between English and Cantonese speakers by using familiar English sounds to represent Cantonese pronunciation.

**Core Value Proposition:** Making Cantonese accessible to English speakers through a phonetic system that feels natural and intuitive.

---

## Color Palette

### Primary Colors

| Name | Hex | Usage |
|------|-----|-------|
| Primary | `#6366f1` | Main brand color, CTAs, links, active states |
| Primary Hover | `#4f46e5` | Button hover states |
| Primary Light | `#818cf8` | Highlights, secondary emphasis |

### Semantic Colors

| Name | Hex | Usage |
|------|-----|-------|
| Success | `#22c55e` | Correct answers, mastered items, positive feedback |
| Success Light | `#4ade80` | Success backgrounds, badges |
| Danger | `#ef4444` | Wrong answers, errors, destructive actions |
| Danger Light | `#f87171` | Error backgrounds, warning states |

### Neutral Colors

| Name | Hex | Usage |
|------|-----|-------|
| Background Light | `#f9fafb` | Page background (light mode) |
| Background Dark | `#111827` | Page background (dark mode) |
| Surface Light | `#ffffff` | Cards, elevated surfaces (light mode) |
| Surface Dark | `#1f2937` | Cards, elevated surfaces (dark mode) |
| Text Primary Light | `#111827` | Main text (light mode) |
| Text Primary Dark | `#f9fafb` | Main text (dark mode) |
| Text Secondary | `#6b7280` | Secondary text, metadata |

---

## Typography

**Font Stack:** System sans-serif stack (Tailwind default)

| Element | Style | Usage |
|---------|-------|-------|
| App Logo | `text-2xl font-bold` | Header wordmark |
| Page Title | `text-3xl font-bold` | Main page headings |
| Section Header | `text-xl font-semibold` | Card titles, section labels |
| Body | `text-base` | Default text content |
| Secondary | `text-sm text-gray-500` | Metadata, helper text |
| Caption | `text-xs` | Timestamps, fine print |

---

## Layout & Structure

### Information Architecture

The application consists of four main areas:

1. **Home** (`/`) — Dashboard overview with quick actions and progress summary
2. **Search** (`/search`) — Full-text search for words and phrases
3. **Learn** (`/learn/words`, `/learn/phrases`) — Practice unmastered vocabulary
4. **Review** (`/review`) — Spaced repetition review of mastered items

### Navigation

**Primary Navigation:** Fixed header bar
- Always visible at top of viewport
- Contains: Logo (left), main nav links (center/right), theme toggle, progress indicator (right)
- Height: 64px (h-16)

**Navigation Flow:**

```
Home ─────────────────────────────────────────────────┐
  │                                                     │
  ├── Search ─────────────────────────────────────────►│
  │     └── Click word/phrase → Detail view             │
  │                                                     │
  ├── Learn ──────────────────────────────────────────►│
  │     ├── /learn/words ──────────────────────────────►│
  │     └── /learn/phrases ───────────────────────────►│
  │                                                     │
  └── Review ─────────────────────────────────────────►│
        └── Quiz mode with spaced repetition
```

### Page Structure

**Header (Persistent)**
- Logo/wordmark (links to home)
- Navigation links: Search, Learn, Profile
- Theme toggle (sun/moon icon)
- Progress badge showing mastered count

**Main Content Area**
- Centered container with max-width 1280px
- Responsive padding: 16px (mobile) → 24px (tablet) → 32px (desktop)
- 8 vertical padding units from header and bottom

**Footer**
- Minimal, optional
- Contains attribution or secondary links if needed

### Grid System

| Breakpoint | Columns | Gutter | Container Padding |
|------------|---------|--------|-------------------|
| Mobile (<640px) | 1 | 16px | 16px |
| Tablet (640-1024px) | 2 | 24px | 24px |
| Desktop (>1024px) | 3-4 | 24px | 32px |

### Content Cards

- Border radius: 12px (rounded-xl)
- Padding: 24px (p-6)
- Shadow: subtle drop shadow
- Hover: slight elevation increase for interactive cards

---

## User Experience

### How Users Access Information

**1. Direct Navigation**
Users can navigate directly to any section via the header navigation:
- Clicking "Search" → Search page
- Clicking "Learn" → Learning mode selection
- Clicking "Profile" → User profile/progress

**2. Search**
- Search bar prominently placed on search page
- Real-time filtering as user types
- Search by English word/phrase OR Cantonese (Canglish)
- Results grouped: Words first, then phrases
- Click any result to expand details

**3. Learning Flow**
- From Home: Click "Start Learning" → Select mode (words/phrases)
- Quiz presents one item at a time
- User sees Cantonese (Canglish) and must recall English meaning
- Immediate feedback: green for correct, red for incorrect
- Progress through items until session ends or all mastered

**4. Review Flow**
- Only mastered items appear in review
- Spaced repetition based on performance
- Same quiz interface as learning but different item selection

### Core Interaction Patterns

**Quiz Interaction:**
```
Question Presented
       │
       ▼
┌─────────────────┐
│  "ngo5 hai6    │  ← User types answer
│   hai2"        │
│                 │
│ [___________]   │
│                 │
│ [Submit]        │
└─────────────────┘
       │
       ▼
  Correct? ──── Yes ──── Item marked mastered (6 correct total)
       │
       No
       │
       ▼
  Try Again (lives system, e.g., 3 hearts)
```

**Progressive Disclosure:**
- Search results show summary by default
- Click to expand full details (pronunciation, examples, notes)
- Learning quiz shows question first, answer revealed on submit

### Feedback Systems

| Feedback Type | Visual Cue | When Used |
|---------------|------------|-----------|
| Correct answer | Green background, checkmark icon | Quiz submission |
| Incorrect answer | Red background, X icon | Quiz submission |
| Item mastered | Gold/green badge | After 6 correct answers |
| Progress update | Progress bar fill | After each quiz answer |
| Lives remaining | Heart icons | Quiz mode |

### Responsive Behavior

| Element | Mobile | Tablet | Desktop |
|---------|--------|--------|---------|
| Navigation | Hamburger menu or simplified | Full nav | Full nav |
| Cards | 1 column | 2 columns | 3-4 columns |
| Quiz layout | Stacked | Stacked | Centered max-width |
| Search results | Full width list | 2-column grid | 3-column grid |

---

## Component Specifications

### Buttons

| Variant | Background | Text | Hover |
|---------|------------|------|-------|
| Primary | Indigo 500 | White | Indigo 600 |
| Secondary | Gray 200 (light) / Gray 600 (dark) | Gray 700 (light) / Gray 100 (dark) | Darker shade |
| Success | Green 500 | White | Green 600 |
| Danger | Red 500 | White | Red 600 |

**Specs:**
- Border radius: 8px (rounded-lg)
- Padding: 16px horizontal, 8px vertical (px-4 py-2)
- Transition: 200ms all
- Focus ring: 2px offset in button color

### Cards

| Type | Usage | Shadow |
|------|-------|--------|
| Static card | Display-only content | Subtle (card) |
| Interactive card | Clickable items | Subtle + lift on hover |

**Interactive card behavior:**
- Default: `shadow-card`
- Hover: `shadow-card-hover` + `translateY(-2px)`
- Transition: 200ms ease

### Form Inputs

- Border: 1px solid gray-300 (light) / gray-600 (dark)
- Border radius: 8px (rounded-lg)
- Padding: 16px horizontal, 12px vertical
- Focus: 2px indigo ring
- Background: white (light) / gray-700 (dark)

### Progress Indicators

**Progress Bar:**
- Height: 8px (h-2)
- Background: gray-200 (light) / gray-700 (dark)
- Fill: indigo-500
- Border radius: full (rounded-full)
- Transition: 300ms width

**Mastery Badge:**
- Small pill shape
- Green background for mastered
- Gray background for not mastered
- Icon + text label

**Hearts Display (Quiz Lives):**
- Row of heart icons
- Filled hearts = remaining lives
- Empty hearts = lost lives
- Subtle pulse animation when lives low (1 remaining)

### Empty States

When no content available:
- Centered illustration or icon
- Descriptive headline
- Helpful action button (e.g., "Start Learning" when no items to review)

---

## Animations & Transitions

| Animation | Duration | Easing | Usage |
|-----------|----------|--------|-------|
| Page transition | 200ms | ease-out | Route changes |
| Card hover lift | 200ms | ease | Interactive cards |
| Fade in | 300ms | ease-out | Appearing elements |
| Slide up | 300ms | ease-out | List item entry |
| Progress fill | 300ms | ease-out | Progress bar updates |
| Pulse subtle | 2s | ease-in-out | Loading, low lives |

**Principles:**
- Animations enhance understanding, never distract
- Quiz feedback is instant (no delay on correct/incorrect)
- Page transitions are fast to maintain flow

---

## Dark Mode

**Toggle Location:** Header, right side
**Toggle Style:** Icon button (sun/moon)
**Implementation:** Class-based on html element

**Dark Mode Adjustments:**
- All backgrounds shift to dark palette
- Text colors invert appropriately
- Card surfaces use gray-800 instead of white
- Borders use gray-600/700 instead of gray-200/300
- No color hue changes, only lightness/darkness

---

## Iconography

**Style:** Outline icons, 2px stroke weight
**Color:** currentColor (inherits from parent)
**Sizes:**
- Small: 16x16 (w-4 h-4)
- Medium: 20x20 (w-5 h-5) — most common
- Large: 24x24 (w-6 h-6)

**Icon Set:**
- Navigation: Book (learn), Search, User/Profile
- Actions: Check (correct), X (incorrect), Refresh (retry), ChevronDown (expand)
- Feedback: Heart (lives), Flag (difficulty marker), Info (help)
- Status: Sun/Moon (theme toggle)

---

## Accessibility

- All interactive elements have visible focus states
- Color alone does not convey meaning (icons + color for feedback)
- Theme toggle is keyboard accessible
- Search is keyboard navigable
- Quiz can be completed with keyboard only
- Proper heading hierarchy for screen readers
- ARIA labels on icon-only buttons
- Sufficient color contrast (WCAG AA minimum)
- Page titles updated per route: "Page Name - Canglish"

---

## Voice & Tone

**Personality:** Encouraging, supportive, patient
**In learning contexts:** Celebrate correct answers, gentle correction on mistakes
**In error states:** Helpful, never blaming, offer solutions
**Copy examples:**
- Correct: "Great job! Keep it up" or simply the green checkmark
- Incorrect: "Not quite — try again" with the correct answer revealed
- Empty state: "No items to review yet. Time to learn something new!"
- Mastery: "Congratulations! You've mastered this item"

---

## Technical Implementation Notes

- Built with Nuxt 3 and Vue 3 Composition API
- Styling via Tailwind CSS
- Dark mode via Tailwind's `dark:` modifier
- State management via Nuxt's `useState()` composable
- localStorage for progress persistence
- All colors defined in tailwind.config.js for consistency
