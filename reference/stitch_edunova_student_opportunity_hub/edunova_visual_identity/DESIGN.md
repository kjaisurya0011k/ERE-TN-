---
name: Edunova Visual Identity
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#454652'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#767683'
  outline-variant: '#c6c5d4'
  surface-tint: '#4c56af'
  primary: '#000666'
  on-primary: '#ffffff'
  primary-container: '#1a237e'
  on-primary-container: '#8690ee'
  inverse-primary: '#bdc2ff'
  secondary: '#843ab4'
  on-secondary: '#ffffff'
  secondary-container: '#cc80fd'
  on-secondary-container: '#580087'
  tertiary: '#001e25'
  on-tertiary: '#ffffff'
  tertiary-container: '#00353f'
  on-tertiary-container: '#00a6bf'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e0e0ff'
  primary-fixed-dim: '#bdc2ff'
  on-primary-fixed: '#000767'
  on-primary-fixed-variant: '#343d96'
  secondary-fixed: '#f4d9ff'
  secondary-fixed-dim: '#e4b5ff'
  on-secondary-fixed: '#2f004b'
  on-secondary-fixed-variant: '#6a1b9a'
  tertiary-fixed: '#a8edff'
  tertiary-fixed-dim: '#49d7f4'
  on-tertiary-fixed: '#001f26'
  on-tertiary-fixed-variant: '#004e5b'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '800'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '800'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 38px
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-bold:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
  caption:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
  stack-sm: 12px
  stack-md: 24px
  stack-lg: 48px
---

## Brand & Style

The design system is engineered for a high-growth EdTech environment, balancing the academic rigor of institutional learning with the agility of a modern startup. The brand personality is rooted in **Empowerment** and **Efficiency**, targeting students and young professionals who require a frictionless path to educational achievement.

The aesthetic follows a **Modern Corporate** direction with high-end digital finishes. It utilizes generous whitespace to reduce cognitive load during complex application processes. Key visual identifiers include:
- **Sophisticated Vibrancy:** Deep Indigo foundations paired with energetic Violet and Cyan accents to symbolize the transition from study to success.
- **Glassmorphism Lite:** Subtle backdrop blurs on navigation elements to maintain context while layering information.
- **Trust-Oriented Clarity:** A focus on high legibility and structured information hierarchies to build user confidence.

## Colors

The palette is designed for high accessibility and emotional resonance. 
- **Primary (Deep Indigo):** Used for core branding, primary actions, and authoritative text. It provides the "Trust" factor.
- **Secondary (Violet):** Used for secondary actions, progress indicators, and creative highlights.
- **Accent (Cyan):** Reserved strictly for success states, "Apply" calls-to-action, and "Opportunity" markers.
- **Neutrals:** A range of cool grays (from #F8FAFC to #0F172A) is used to create a tiered information architecture without overwhelming the user with color.

Gradients should be applied sparingly to primary buttons and hero sections to avoid visual fatigue.

## Typography

This design system utilizes a dual-font strategy to balance character and utility. 
- **Plus Jakarta Sans** is the display face, chosen for its modern, friendly curves and high-impact weights. Use this for all headlines and brand moments.
- **Inter** is the workhorse typeface for body text, forms, and data-heavy tables. Its tall x-height ensures maximum readability on mobile screens.

**Hierarchy Rules:**
- Use `display-lg` only for hero sections and major landing page headers.
- Maintain a minimum 1.5x line-height for body text to improve reading stamina.
- Labels should use a semi-bold weight to distinguish them from input values.

## Layout & Spacing

The layout philosophy follows a **12-column Fluid Grid** for desktop and a **single-column vertical stack** for mobile. 

- **The 8pt Rhythm:** All padding, margins, and component heights must be multiples of 8px. 
- **Whitespace:** Use the `stack-lg` (48px) unit between major sections to allow the content to breathe. 
- **Safe Zones:** Content containers should never exceed 1280px to maintain line-length readability for educational articles and course descriptions.
- **Mobile Reflow:** On mobile, horizontal card lists should convert into a vertical stack or a side-scrolling carousel with visible "peek" margins to indicate more content.

## Elevation & Depth

Visual hierarchy is achieved through a combination of **Tonal Layers** and **Ambient Shadows**.

- **Level 0 (Background):** Neutral #F8FAFC.
- **Level 1 (Cards):** Pure White (#FFFFFF) with a very soft, diffused shadow. Shadow spec: `0px 4px 20px rgba(26, 35, 126, 0.05)`.
- **Level 2 (Hover/Active):** Slightly more pronounced shadow to indicate interactivity. Shadow spec: `0px 10px 30px rgba(26, 35, 126, 0.12)`.
- **Overlays:** Use a 60% opacity Indigo backdrop with a 12px blur for modals and mobile menus to maintain a sense of depth and focus.

## Shapes

The shape language is characterized by **Generous Rounding** to evoke a sense of approachability and modern tech-fluency.

- **Standard Elements:** Buttons, input fields, and small chips use `0.5rem` (rounded).
- **Surface Elements:** Content cards and containers use `1.5rem` (rounded-xl) to create a soft, friendly interface.
- **Hero Images:** Should utilize the `rounded-xl` token or custom organic "blob" masks using the brand's secondary colors.

## Components

### Buttons
- **Primary:** Brand Gradient (Indigo to Violet), White text, `rounded-lg`. High contrast.
- **Success/Apply:** Solid Cyan (#00B8D4), Navy text (#1A237E) for maximum legibility.
- **Ghost:** Indigo outline (1.5px), transparent background.

### Cards
- **Educational Cards:** White background, `rounded-xl`, subtle shadow. Include a 4px Indigo top-border for "Recommended" or "Featured" items.
- **Stats Cards:** Violet background with White text for data visualization (e.g., "Courses Completed").

### Inputs & Forms
- **Fields:** Light gray border (#E2E8F0), switching to Indigo on focus. Labels sit above the field in `label-bold` style.
- **Error State:** Red (#D32F2F) border and text, with a small icon for accessibility.

### Interactive Elements
- **Chips:** Small `rounded-pill` elements for categories (e.g., "Full-time", "Scholarship"). Use light tints of the primary/secondary colors with dark text.
- **Progress Bars:** Dual-tone. A light neutral track with a Cyan or Violet fill to show course completion status.
- **Navigation:** Top-fixed bar with a glassmorphism effect (blur) to stay accessible while scrolling long application forms.