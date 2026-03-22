# VELD AFRICA Brand Identity System

## Primary Color Palette

Extracted from VELD_Logo.png and refined for digital application:

### Core Colors

| Token | HEX | Usage |
|-------|-----|-------|
| `--veld-forest` | `#1B4D3E` | Primary brand color, headers, key CTAs |
| `--veld-emerald` | `#2D6A4F` | Secondary green, hover states |
| `--veld-gold` | `#C9A227` | Accent, premium highlights, CTAs |
| `--veld-sand` | `#D4C5B0` | Neutral warm accent, backgrounds |
| `--veld-cream` | `#FAF9F6` | Primary background, cards |
| `--veld-charcoal` | `#1A1A1A` | Primary text |
| `--veld-slate` | `#4A5568` | Secondary text |

### Extended Palette for Glassmorphism

| Token | HEX | Usage |
|-------|-----|-------|
| `--glass-white` | `rgba(255,255,255,0.1)` | Glass panels |
| `--glass-border` | `rgba(255,255,255,0.2)` | Glass borders |
| `--glass-forest` | `rgba(27,77,62,0.85)` | Dark glass overlays |
| `--glass-gold` | `rgba(201,162,39,0.15)` | Gold shimmer effects |

### Gradient Definitions

```css
--gradient-hero: linear-gradient(135deg, #1B4D3E 0%, #2D6A4F 50%, #1B4332 100%);
--gradient-gold: linear-gradient(135deg, #C9A227 0%, #D4AF37 50%, #B8941F 100%);
--gradient-glass: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%);
--gradient-dark: linear-gradient(180deg, transparent 0%, rgba(27,77,62,0.9) 100%);
```

---

## Typography System

### Primary Font: Inter
- **Weights**: 300 (Light), 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold)
- **Usage**: Body text, UI elements, navigation

### Display Font: Playfair Display
- **Weights**: 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold)
- **Usage**: Headlines, hero text, manifesto quotes

### Monospace Font: JetBrains Mono
- **Usage**: Data displays, property IDs, technical specifications

### Type Scale

| Level | Size | Line Height | Letter Spacing | Weight | Usage |
|-------|------|-------------|----------------|--------|-------|
| Display | 72px/4.5rem | 1.1 | -0.02em | 700 | Hero headlines |
| H1 | 48px/3rem | 1.2 | -0.01em | 600 | Page titles |
| H2 | 36px/2.25rem | 1.3 | -0.01em | 600 | Section headers |
| H3 | 28px/1.75rem | 1.4 | 0 | 600 | Subsections |
| H4 | 22px/1.375rem | 1.5 | 0 | 500 | Card titles |
| Body Large | 18px/1.125rem | 1.6 | 0 | 400 | Lead paragraphs |
| Body | 16px/1rem | 1.6 | 0 | 400 | Standard text |
| Body Small | 14px/0.875rem | 1.5 | 0 | 400 | Captions, metadata |
| Label | 12px/0.75rem | 1.4 | 0.05em | 500 | Tags, labels (uppercase) |

---

## Glassmorphism Design System

### Glass Card Variants

```css
/* Standard Glass Card */
.glass-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
}

/* Gold Accent Glass */
.glass-gold {
  background: rgba(201, 162, 39, 0.08);
  border: 1px solid rgba(201, 162, 39, 0.2);
}

/* Forest Dark Glass */
.glass-forest {
  background: rgba(27, 77, 62, 0.8);
  border: 1px solid rgba(45, 106, 79, 0.3);
}

/* Light Glass (for dark sections) */
.glass-light {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.5);
}
```

### Shadows & Depth

```css
--shadow-sm: 0 2px 8px rgba(27, 77, 62, 0.08);
--shadow-md: 0 4px 20px rgba(27, 77, 62, 0.12);
--shadow-lg: 0 8px 32px rgba(27, 77, 62, 0.16);
--shadow-glow: 0 0 40px rgba(201, 162, 39, 0.15);
--shadow-glass: 0 8px 32px rgba(0, 0, 0, 0.1);
```

### Border Radius Scale

```css
--radius-sm: 8px;
--radius-md: 12px;
--radius-lg: 16px;
--radius-xl: 24px;
--radius-full: 9999px;
```

---

## Partner Brand Integration

### Partner Logo Treatment
- Grayscale by default
- Color on hover
- Consistent height (32px mobile, 48px desktop)
- Opacity 60% default, 100% on hover
- Smooth 300ms transition

### Partner Section Design
- Horizontal scrolling marquee on mobile
- Grid layout on desktop
- Glass card container with subtle border
- "Trusted Partners" label in gold accent

---

## Animation & Motion

### Easing Functions
```css
--ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in: cubic-bezier(0.4, 0, 1, 1);
```

### Duration Scale
- Micro: 150ms (hover states)
- Fast: 300ms (transitions)
- Normal: 500ms (reveals)
- Slow: 800ms (section animations)

### Key Animations
- **Fade Up**: opacity 0→1, translateY 20px→0, ease-smooth
- **Glass Shimmer**: Background gradient animation on gold accents
- **Parallax Hero**: Subtle background movement on scroll
- **Counter Ticker**: Number counting animation for statistics

---

## Responsive Breakpoints

```css
--sm: 640px;   /* Mobile landscape */
--md: 768px;   /* Tablet */
--lg: 1024px;  /* Desktop */
--xl: 1280px;  /* Large desktop */
--2xl: 1536px; /* Extra large */
```

---

## Usage Guidelines

### Do
- Use forest green as the primary anchor color
- Pair gold sparingly for premium emphasis
- Maintain high contrast for accessibility
- Use glassmorphism for overlay cards and modals
- Employ Playfair for emotional, aspirational headlines

### Don't
- Use gold for large backgrounds (too intense)
- Pair forest green with bright reds or oranges
- Overuse glass effects (causes performance issues)
- Use display font for body text
- Drop below 4.5:1 contrast ratio

