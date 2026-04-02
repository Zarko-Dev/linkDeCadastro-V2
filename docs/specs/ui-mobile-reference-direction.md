# UI/UX Mobile Reference Direction

## Purpose

This document defines the mobile-first visual and interaction direction for `linkDeCadastro-V2`, based on the visual references shared in this conversation.

The goal is not to copy the references literally. The goal is to extract their design language and apply it to a premium SaaS/AI product surface:

- dark, compact, high-contrast surfaces
- vertical stacking with strong hierarchy
- layered cards that feel like product surfaces, not generic admin panels
- visible depth, shadows, and controlled glow
- restrained motion that feels premium and deliberate
- a layout that works exceptionally well on mobile and scales cleanly to desktop

The screenshot shown later in the conversation is an anti-reference for this V2. It demonstrates what we should avoid:

- heavy legacy admin navigation
- generic white dashboard cards
- classic panel/grid composition
- visually noisy surfaces that feel like a CRM clone
- layouts that read as a stretched desktop panel on mobile

## Design Reading From The References

The references suggest two related but different moods:

- mobile reference: narrow, tall, stacked surfaces with strong vertical rhythm and a calm, dense interface
- desktop reference: a cockpit-like workspace with a large primary canvas, supporting panels, and clear control zones

The shared language across both references is:

- monochrome or near-monochrome tone
- soft contrast instead of bright color noise
- rounded but not bubbly geometry
- text and image blocks that look intentionally placed
- a sense of product depth, not a generic app template

## Product Direction

The V2 should feel like a polished SaaS/AI operating layer for the business, not a marketing site and not a generic admin dashboard.

The interface should communicate:

- trust
- clarity
- control
- momentum
- modernity
- product intelligence
- composure
- premium restraint

The UX should optimize for:

- fast scanning on mobile
- confident task completion
- low visual clutter
- obvious primary actions
- easy expansion into richer desktop workflows
- a sense that the system helps the user think and act faster

## Core Principles

### 1. Mobile First, Desktop Amplified

Design the mobile layout first as the source of truth.

Desktop should be an expansion of that system, not a separate aesthetic.

### 2. Strong Vertical Hierarchy

On mobile, each screen must read top-to-bottom with one clear primary action and one clear primary content cluster.

### 3. Dense But Calm

The references are compact, but not busy.
Use dense information layouts with generous breathing room between clusters.

### 4. One Primary Surface Per Screen

Each screen should have one visually dominant surface and a few supporting surfaces.

The dominant surface should feel intentional and premium, not like a generic admin card.

### 5. Motion With Purpose

Use motion for:

- first impression
- section reveal
- navigation transition
- state feedback
- list expansion

Do not use motion as decoration.

### 6. Progressive Disclosure

Show less by default on mobile.

Reveal deeper information through expansion, drill-down, and bottom sheets.

### 7. O -> N -> On Structure

Preserve the sustainable, modular and clear sequencing:

- O: overview and context
- N: navigation and orientation
- On: operation and next action

Every screen should be legible through that progression.

## Visual Language

### Tone

Use a premium SaaS/AI tone:

- calm
- precise
- intentional
- modern
- quietly expressive

### Surface Direction

Prefer:

- deep ink backgrounds
- layered glass or soft-matte panels
- subtle glow instead of hard contrast
- refined gradients with low noise
- clear spacing between surface groups

Avoid:

- bright white cards
- hard panel borders everywhere
- classic admin blue/gray dashboard styling
- dense tables as the primary pattern for key flows

### Layout Feel

The system should feel like a product command layer:

- the hero surface should read like a cockpit summary
- secondary areas should feel modular, not boxed in
- forms should feel like guided operations
- chat should feel like a real-time workspace, not an inbox table
- agents and automations should feel like builders, not settings pages

## Mobile Target

### Layout Shape

The mobile target should resemble a stacked control surface:

- top brand zone
- hero or task summary
- primary action block
- stacked cards or panels
- compact supporting metrics
- optional footer navigation or quick actions

### Mobile Navigation

Recommended pattern:

- top app bar with brand and status
- one accessible menu entry for secondary sections
- one persistent primary action area when the user is in a task flow

If the screen is task heavy, use a bottom action bar or compact sticky CTA.

### Mobile Home Structure

The home screen should follow this order:

1. brand/status strip
2. one-line value statement
3. primary summary card
4. secondary cards for auth, courses, events, or chat
5. compact quick actions

The home screen should feel like an executive product command surface scaled down to a phone.

### Mobile Page Behavior

Each key page should use the same rhythm:

- header
- primary card
- supporting cards
- action group

Use vertical stacks instead of side-by-side layouts unless the viewport is clearly tablet-width.

### Mobile Components

Recommended component behavior:

- cards should span full width
- image areas should use large rounded placeholders or media shells
- buttons should be large enough for touch
- chips should be readable and tappable
- form fields should be grouped into short blocks
- lists should use cards, not plain rows, for the most important content

### Mobile Density Rules

Keep the UI compact, but avoid squeezing text.

Use:

- 16px minimum body text
- strong spacing between clusters
- short labels
- concise supporting copy
- subtle metadata

Avoid:

- large empty canvases on mobile
- long explanatory paragraphs
- multi-column grids below tablet width
- tiny icon-only actions without labels

## Desktop Target

### Layout Shape

The desktop target should feel like a cockpit or command surface:

- persistent left navigation or rail
- strong content canvas in the center
- supporting panels or widgets on the side
- status/summary strip near the top

### Desktop Home Structure

The desktop home should feel like a dashboard with a dominant main panel and secondary modular panels:

1. persistent rail or sidebar
2. top title/status bar
3. dominant hero or workspace panel
4. secondary panels in a grid
5. quick actions and recent activity

### Desktop Visual Language

Use:

- layered cards
- wider layouts
- controlled overlap
- subtle glow and shadow depth
- strong alignment

The desktop screen should feel more spatial than the mobile screen, but still clearly part of the same system.

### Desktop Navigation

Recommended pattern:

- left rail for primary destinations
- top bar for context and global actions
- body area for primary content

### Desktop Interaction

Desktop should support:

- hover states
- reveal-on-hover supporting actions
- keyboard-friendly controls
- richer multi-panel comparison

## Motion Direction

The frontend already uses `motion`, so the design language should lean on it consistently.

### Motion Principles

- use short durations
- prefer ease-out for entry
- use small vertical movement
- avoid exaggerated bounce
- keep motion coherent across pages
- respect reduced-motion preferences

### Motion Patterns To Use

- page entry fade and lift
- staggered reveal for cards
- hover lift for nav and panels
- press scale for taps
- gentle status pulse for live indicators
- slide-in for drawers and sheets

### Motion Patterns To Avoid

- large elastic bounces
- decorative looping motion everywhere
- simultaneous movement on every element
- motion that competes with reading

### Suggested Motion Tokens

- `--motion-fast: 120ms`
- `--motion-base: 220ms`
- `--motion-slow: 360ms`
- `--ease-out: cubic-bezier(0.2, 0.8, 0.2, 1)`
- `--ease-standard: cubic-bezier(0.4, 0, 0.2, 1)`

### Suggested Motion Primitives

- `AnimatedPage`
- `FadeIn`
- `StaggerGroup`
- `StaggerItem`
- `HoverLift`
- `SlideOver`
- `SheetReveal`

## Visual Tokens

Use a token system that supports dark depth, soft surfaces, and readable contrast.

### Color Tokens

- `--bg-app`
- `--bg-canvas`
- `--surface-1`
- `--surface-2`
- `--surface-3`
- `--text-primary`
- `--text-secondary`
- `--text-muted`
- `--border-soft`
- `--border-strong`
- `--accent`
- `--accent-weak`
- `--success`
- `--warning`
- `--danger`

### Radius Tokens

- `--radius-sm`
- `--radius-md`
- `--radius-lg`
- `--radius-xl`
- `--radius-pill`

### Shadow Tokens

- `--shadow-soft`
- `--shadow-card`
- `--shadow-panel`
- `--shadow-depth`

### Spacing Tokens

- `--space-1`
- `--space-2`
- `--space-3`
- `--space-4`
- `--space-5`
- `--space-6`
- `--space-8`
- `--space-10`

### Suggested Class Names

- `app-shell`
- `mobile-shell`
- `desktop-shell`
- `hero-surface`
- `panel`
- `panel-accent`
- `status-strip`
- `media-slot`
- `metric-card`
- `action-chip`
- `dock-bar`
- `nav-rail`
- `content-frame`
- `detail-surface`
- `list-card`
- `summary-card`
- `sheet-panel`

## Page Direction

### Home

The home must be the strongest expression of the design language.

It should show:

- status
- identity
- system summary
- key counts
- quick entry points

Recommended hierarchy:

- brand strip
- one strong headline
- one hero summary card
- compact metric cards
- current state or health panel

### Login

Login should feel focused, premium and calm.

Mobile:

- full-width form stack
- one strong headline
- one visible CTA
- minimal supporting copy
- no distracting side content
- one trust cue row with security, session and product value

Desktop:

- centered or split layout
- branded visual panel alongside the form
- clear trust cues
- no oversized side decoration

### Dashboard

The dashboard should feel like an executive command surface, not a legacy admin overview.

Prioritize:

- health
- user context
- quick actions
- next steps
- live status

### Formulario

The form screen should feel like a guided builder.

Mobile:

- form definition first
- preview second
- one primary action bar
- field groups with short labels

Desktop:

- form editor on one side
- live preview or summary on the other
- clearer decision-making surfaces

### Chat WPP

Chat should prioritize legibility and speed.

Mobile:

- conversation list is the main surface
- detail view should open as a full-screen drill-in or sheet
- unread state must be obvious

Desktop:

- inbox list
- active conversation
- details/inspector when needed

### Criacao de agentes

Agents should feel like a product builder, not a settings form.

Show:

- mode
- domain
- queue
- action intent
- preview of behavior

### Criacao de automacoes

Automations should read like a pipeline editor.

Show:

- trigger
- condition
- action
- target
- live preview of the flow

### Integracoes

Integrations should feel like a control matrix for connected systems.

Emphasize:

- connection status
- permissions
- last sync
- clear next action

## Implementation Priorities

### Phase 1

- define the visual token system
- normalize the shell for mobile and desktop
- make home the flagship screen
- keep motion primitives consistent
- remove any remaining classic admin visual cues

### Phase 2

- apply the design system to `login`, `courses`, and `events`
- improve list and card patterns
- ensure all important pages have one dominant surface
- align dashboard, form and integrations to the premium SaaS/AI tone

### Phase 3

- refine `admin/chat` and `admin/users`
- add richer drill-down patterns
- tune desktop workspace composition
- make agent and automation builders feel like first-class product surfaces

### Phase 4

- polish empty states, loading states, and error states
- tune transitions and page entry motion
- review accessibility and reduced motion

## Acceptance Criteria

The design direction is considered successful when:

- mobile screens feel purpose-built, not compressed desktop views
- desktop screens feel like a real workspace, not a stretched phone layout
- cards and surfaces share one coherent visual language
- motion feels intentional and consistent
- the UI reads clearly at a glance on a phone
- the UI feels premium and operational on desktop

## Implementation Note

This spec should guide the future UI work in `linkDeCadastro-V2` and should be treated as the mobile-first source of truth for the system shell, home, login, dashboard, form, chat, agents, automations, integrations, courses, events, and admin surfaces.
