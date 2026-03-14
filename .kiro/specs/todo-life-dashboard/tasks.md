# Implementation Plan: Todo Life Dashboard

## Overview

Implement a single-page dashboard as three static files (`index.html`, `css/styles.css`, `js/script.js`) using only Vanilla JavaScript. Modules are implemented sequentially, each building on the previous, and wired together at the end via `DashboardApp`.

## Tasks

- [x] 1. Create project skeleton and HTML structure
  - Create `index.html` with the full layout skeleton from the design: `<header>`, `<main id="main-grid">`, left/right columns, all cards, and all required element IDs (`#clock`, `#date`, `#greeting-text`, `#theme-toggle`, `#name-input`, `#name-save`, `#timer-display`, `#timer-message`, `#btn-start`, `#btn-stop`, `#btn-reset`, `#link-list`, `#link-form`, `#link-label`, `#link-url`, `#link-error`, `#task-form`, `#task-input`, `#task-error`, `#task-list`)
  - Create `css/styles.css` as an empty file (linked from `index.html`)
  - Create `js/script.js` as an empty file (linked from `index.html`)
  - _Requirements: 8.1, 8.3_

- [x] 2. Implement CSS — layout, variables, and responsive design
  - [x] 2.1 Define CSS custom properties (color system, typography, spacing, radius) from the design's color system and typography sections
    - Include both light and dark mode variable sets
    - _Requirements: 8.4_
  - [x] 2.2 Implement base styles: `body`, `header`, `#main-grid` two-column grid, `.card`, button variants (accent, neutral, outline, danger), input styles, `.error-msg`
    - _Requirements: 8.4_
  - [x] 2.3 Add responsive breakpoint: `@media (max-width: 767px)` collapses grid to single column
    - _Requirements: 8.4_
  - [x] 2.4 Add `body.dark` overrides for dark mode colors
    - _Requirements: 5.2_

- [x] 3. Implement `Storage` module in `js/script.js`
  - Write the `Storage` object with `get(key)`, `set(key, value)`, `remove(key)` methods
  - Wrap `set` in try/catch; log warning on quota error; app continues in-memory
  - Wrap `get` in try/catch; return `null` on `JSON.parse` failure
  - _Requirements: 8.2, 8.5_

- [x] 4. Implement `GreetingWidget` module
  - [x] 4.1 Implement `_getGreeting(hour)`, `_formatTime(date)`, `_formatDate(date)`, `render(userName)`, `_tick()`, and `init()`
    - `init()` reads `tld_username` from Storage, starts `setInterval` every 1000ms calling `_tick()`
    - `render()` updates `#clock`, `#date`, `#greeting-text`
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7_
  - [ ]* 4.2 Write property test for `_getGreeting` (Property 1)
    - **Property 1: Greeting maps every hour to the correct period**
    - **Validates: Requirements 1.3, 1.4, 1.5, 1.6**
  - [ ]* 4.3 Write property test for greeting containing stored name (Property 2)
    - **Property 2: Greeting includes the stored name**
    - **Validates: Requirements 1.7, 6.2, 6.4**
  - [ ]* 4.4 Write property test for `_formatDate` (Property 17)
    - **Property 17: Date format contains required components**
    - **Validates: Requirements 1.1**

- [x] 5. Implement `FocusTimer` module
  - [x] 5.1 Implement module-scoped `remaining` (1500) and `intervalId` (null), then implement `_formatTime(totalSeconds)`, `_tick()`, `render()`, `_notifyComplete()`, `start()`, `stop()`, `reset()`, and `init()`
    - `init()` renders initial `25:00` and binds click events on `#btn-start`, `#btn-stop`, `#btn-reset`
    - `start()` guards against double-start by checking `intervalId !== null`
    - `_tick()` decrements `remaining`, calls `render()`, calls `stop()` + `_notifyComplete()` when `remaining === 0`
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7_
  - [ ]* 5.2 Write property test for `_formatTime` (Property 3)
    - **Property 3: Time format is always MM:SS**
    - **Validates: Requirements 2.3**
  - [ ]* 5.3 Write property test for tick decrement (Property 4)
    - **Property 4: Each tick decrements remaining by exactly one**
    - **Validates: Requirements 2.2**
  - [ ]* 5.4 Write property test for reset (Property 5)
    - **Property 5: Reset always returns timer to 1500 seconds**
    - **Validates: Requirements 2.5**
  - [ ]* 5.5 Write property test for start idempotency (Property 6)
    - **Property 6: Start is idempotent while running**
    - **Validates: Requirements 2.7**
  - [ ]* 5.6 Write unit tests for FocusTimer
    - Test timer initializes to `25:00` on `init()` (Req 2.1)
    - Test `stop()` retains current `remaining` (Req 2.4)
    - Test `_notifyComplete()` is called when `remaining` reaches 0 (Req 2.6)

- [ ] 6. Checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 7. Implement `TodoList` module
  - [x] 7.1 Implement `_validate(label)`, `_isDuplicate(label, excludeId)`, `_save()`, `_renderItem(task)`, `render()`, `_add(label)`, `_edit(id, newLabel)`, `_toggleComplete(id)`, `_delete(id)`, and `init()`
    - `init()` loads `tld_tasks` from Storage (default `[]`), calls `render()`, binds `#task-form` submit
    - Each task: `{ id: Date.now().toString(), text, done: false }`
    - `_renderItem` produces a `<li>` with complete toggle, inline edit control, and delete button
    - Display errors in `#task-error`
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 7.1, 7.2, 7.3_
  - [ ]* 7.2 Write property test for valid add producing done=false task (Property 7)
    - **Property 7: Adding a valid task produces a task with done=false**
    - **Validates: Requirements 3.1**
  - [ ]* 7.3 Write property test for whitespace label rejection (Property 8)
    - **Property 8: Whitespace-only labels are always rejected**
    - **Validates: Requirements 3.2**
  - [ ]* 7.4 Write property test for toggle involution (Property 9)
    - **Property 9: Completing a task twice returns to original state**
    - **Validates: Requirements 3.3**
  - [ ]* 7.5 Write property test for delete removes task (Property 10)
    - **Property 10: Deleting a task removes it from the list**
    - **Validates: Requirements 3.5**
  - [ ]* 7.6 Write property test for localStorage round-trip (Property 11)
    - **Property 11: Task list round-trips through localStorage**
    - **Validates: Requirements 3.6, 3.7**
  - [ ]* 7.7 Write property test for case-insensitive duplicate detection (Property 12)
    - **Property 12: Case-insensitive duplicate detection**
    - **Validates: Requirements 3.8, 7.1, 7.3**

- [x] 8. Implement `QuickLinks` module
  - [x] 8.1 Implement `_validate(label, url)`, `_normalizeUrl(url)`, `_save()`, `_renderItem(link)`, `render()`, `_add(label, url)`, `_delete(id)`, and `init()`
    - `init()` loads `tld_links` from Storage (default `[]`), calls `render()`, binds `#link-form` submit
    - Each link: `{ id: Date.now().toString(), label, url }`
    - Links open in new tab (`target="_blank"`)
    - Display errors in `#link-error`
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_
  - [ ]* 8.2 Write property test for link validation rejecting empty fields (Property 13)
    - **Property 13: Link validation rejects empty label or empty URL**
    - **Validates: Requirements 4.2**
  - [ ]* 8.3 Write property test for delete removes link (Property 14)
    - **Property 14: Deleting a link removes it from the list**
    - **Validates: Requirements 4.4**
  - [ ]* 8.4 Write property test for link localStorage round-trip (Property 15)
    - **Property 15: Link list round-trips through localStorage**
    - **Validates: Requirements 4.5, 4.6**

- [ ] 9. Checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 10. Implement `Settings` module
  - [x] 10.1 Implement `_applyTheme(theme)`, `_toggleTheme()`, `_saveName(name)`, `_loadName()`, and `init()`
    - `init()` reads `tld_theme` (default `"light"`) and `tld_username` from Storage, calls `_applyTheme()`, binds `#theme-toggle` click and `#name-save` click
    - `_applyTheme` adds/removes `"dark"` class on `<body>`
    - `_saveName` trims name; if empty, calls `Storage.remove("tld_username")`; otherwise saves and calls `GreetingWidget.render(name)`
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 6.1, 6.2, 6.3, 6.4_
  - [ ]* 10.2 Write property test for theme toggle involution (Property 16)
    - **Property 16: Theme toggle is an involution**
    - **Validates: Requirements 5.2, 5.3, 5.4**
  - [ ]* 10.3 Write unit tests for Settings
    - Test dashboard defaults to `"light"` theme when `tld_theme` key is absent (Req 5.1)
    - Test saving empty name removes `tld_username` key from localStorage (Req 6.3)
    - Test `#name-input` element exists in the DOM (Req 6.1)

- [x] 11. Implement `DashboardApp` and wire everything together
  - Write `DashboardApp.init()` that calls `GreetingWidget.init()`, `FocusTimer.init()`, `TodoList.init()`, `QuickLinks.init()`, `Settings.init()` in order
  - Register `DashboardApp.init()` on `DOMContentLoaded`
  - Ensure all module objects are defined before `DashboardApp` in `script.js`
  - _Requirements: 8.1, 8.5_

- [ ] 12. Final checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- Property tests use **fast-check** and must run a minimum of 100 iterations each
- Pure functions (`_getGreeting`, `_formatTime`, `_formatDate`, `_validate`, `_isDuplicate`, `_normalizeUrl`) should be extractable for testing without a DOM environment
- Test files go in `tests/unit/` and `tests/property/` as described in the design
- Each task references specific requirements for traceability
