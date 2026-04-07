# Mind Journal

Mind Journal is a local-first journal and notes web app built with plain HTML, CSS, and JavaScript. It runs directly in the browser, stores data in `localStorage`, and works without a backend or build step.

## Features

- Create, edit, and delete notes
- Search notes by title, content, tags, and date text
- Filter notes by created date using the calendar picker
- Browse notes in `Cards` or `Timeline` view
- Sort notes by `Updated` or `Created`
- Click Library tags to filter quickly
- Undo note deletion from the editor banner
- Toggle persistent Focus Mode
- First-use onboarding for new users
- Import notes from JSON
- Export notes to JSON
- Switch between Light, Dark, and Soft Gray themes
- Use keyboard shortcuts for common actions
- See a lightweight activity visualization that grows with note count

## Project Files

```text
/journal
├── index.html
├── style.css
├── script.js
├── README.md
├── USER_GUIDE.md
├── CHANGELOG.md
└── MindJournal_README.md
```

## Run Locally

1. Open [`index.html`](/Users/prabuponnan/Documents/Claude/journal/index.html) in a browser.
2. Start creating notes.

No installation or server is required.

## Storage

- Notes key: `mind_journal_notes`
- Theme key: `mind_journal_theme`
- View key: `mind_journal_view`
- Sort key: `mind_journal_sort`
- Focus key: `mind_journal_focus_mode`
- Onboarding key: `mind_journal_has_seen_onboarding`

All data is stored in the current browser only.

## Import and Export

- `Export JSON` downloads notes as `mind-journal-notes.json`
- `Import JSON` accepts exported note arrays and merges them into the current note store by `id`
- The app shows an import review step before imported notes are applied
- Import feedback reports how many notes were `added` and how many were `replaced`

## Keyboard Shortcuts

| Action | Mac | Windows |
| --- | --- | --- |
| Open shortcut help | `?` | `?` |
| Create a new note | `N` | `N` |
| Close the editor or dismiss open overlays | `Esc` | `Esc` |
| Focus the in-app search field | `Cmd + F` | `Ctrl + F` |
| Toggle Focus Mode | `Cmd + Shift + .` | `Ctrl + Shift + .` |
| Clear search and date filters | `Cmd + Delete` | `Ctrl + Backspace` |
| Select next visible note | `J` | `J` |
| Select previous visible note | `K` | `K` |

## Notes

- [`USER_GUIDE.md`](/Users/prabuponnan/Documents/Claude/journal/USER_GUIDE.md) is the end-user guide
- [`CHANGELOG.md`](/Users/prabuponnan/Documents/Claude/journal/CHANGELOG.md) tracks feature updates and versions
- [`MindJournal_README.md`](/Users/prabuponnan/Documents/Claude/journal/MindJournal_README.md) is the original product-style reference
