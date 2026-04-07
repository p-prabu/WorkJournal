# Mind Journal Changelog

This file is the version and feature history for Mind Journal. Use it to record visible user-facing updates over time.

## 2026-04-07

### Changed

- Activity Map now shifts into a visible brain silhouette from 100 notes onward and keeps filling in toward a denser full-brain form through 10,000 notes
- Brain canvas sizing and glow were adjusted so the higher-note visualization reads more clearly
- Brain mode now uses theme-aware milestone colors at 100, 1000, 2000, 4000, 7000, and 10,000 notes, with smooth interpolation between them
- Activity Map now includes a compact Brain Roadmap showing the 100, 1000, 2000, 4000, 7000, and 10,000 note milestones
- Added a Settings popover for showing or hiding the Theme picker, Cards/Timeline switch, and Brain Roadmap
- Focus Mode now keeps the New Note button visible and uses `Cmd/Ctrl + .` as the toggle shortcut

### Notes

- The early-stage abstract network remains for smaller note collections under 100 notes
- The brain stage uses structure and density rather than connection lines

## 2026-04-06

### Added

- Persistent Focus Mode with keyboard toggle
- Cross-platform shortcut help modal opened by `?`
- First-use onboarding guide for empty state
- JSON import for notes
- Import summary feedback showing added and replaced note counts
- Compact calendar popover filter beside the view controls
- Dedicated Library panel with compact note cards
- Sort control for `Updated` and `Created`
- Clickable Library tag chips for quick filtering
- Undo banner for restoring the most recently deleted note
- User guide documentation

### Changed

- Search field expanded by moving the date filter trigger beside `Cards` and `Timeline`
- Theme selector moved into the actions row to avoid toolbar overlap
- Library cards now show only title and tags for denser browsing
- Library list now scrolls internally instead of growing the full page
- Delete confirmation uses a custom in-app modal instead of the browser default popup
- Added keyboard shortcuts for Focus Mode, clear filters, and next/previous visible note navigation
- Import now shows a review step before notes are applied

### Notes

- `README.md` is the main technical/project overview
- `USER_GUIDE.md` is the end-user usage guide
- `MindJournal_README.md` remains as the product-style reference document
