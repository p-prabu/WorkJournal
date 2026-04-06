# Mind Journal User Guide

## Getting Started

1. Open [`index.html`](/Users/prabuponnan/Documents/Claude/journal/index.html) in your browser.
2. Click `New Note`.
3. Add a title, tags, and content.
4. Notes save automatically while you type.

## Main Areas

- Left sidebar:
  Search, view switcher, date filter, theme, sort controls, and Library list
- Top right:
  Activity Map visualization
- Right editor panel:
  Edit the currently selected note

## Working With Notes

### Create a note

- Click `New Note`
- Or press `N`

### Edit a note

- Select a note from the Library
- Update the title, tags, or content in the editor
- Changes are saved automatically

### Delete a note

- Open a note
- Click `Delete`
- Confirm in the custom delete dialog
- Use `Undo` from the banner if you want to restore the deleted note immediately

## Library Views

### Cards

- Shows notes as a simple compact list
- Best for quick scanning

### Timeline

- Groups notes by created date
- Best for browsing entries day by day

### Sort

- Use the `Sort` control to switch between `Updated` and `Created`
- `Updated` is useful for recent editing
- `Created` is useful for journal-style chronological browsing

## Search and Date Filter

### Search

- Use the search box to match note title, content, tags, and date text
- Click a tag chip in the Library to filter quickly by that tag

### Date filter

- Click the calendar button next to search
- Choose a day to filter notes by created date
- Click the same day again to clear that date filter
- Use `Clear Filters` to reset search and date together

## Import and Export

### Export

- Click `Export JSON`
- The app downloads `mind-journal-notes.json`

### Import

- Click `Import JSON`
- Select a previously exported `.json` file
- Imported notes are merged into the current notes by note `id`
- The app shows how many notes were added and how many existing notes were replaced

## Themes

- Soft Gray
- Light
- Dark

Theme preference is saved in the browser.

## Keyboard Shortcuts

| Shortcut | Action |
| --- | --- |
| `N` | Create a new note |
| `Esc` | Close the editor or dismiss open overlays |
| `Ctrl/Cmd + F` | Focus search |

## Data and Limitations

- Notes are stored only in this browser
- Clearing browser storage removes local notes
- There is no cloud sync or account system
- Delete undo is immediate-session only and is not a long-term trash/archive
