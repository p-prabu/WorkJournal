# Mind Journal User Guide

## Getting Started

1. Open [`index.html`](/Users/prabuponnan/Documents/Claude/journal/index.html) in your browser.
2. If this is your first time, review the welcome guide in the empty state.
3. Click `New Note`.
4. Add a title, tags, and content.
5. Notes save automatically while you type.

## Main Areas

- Left sidebar:
  Search, view switcher, date filter, theme, sort controls, and Library list
- Top right:
  Activity Map visualization
- Right editor panel:
  Edit the currently selected note

## Working With Notes

### Focus Mode

- Use `Focus Mode` to hide the utility controls and keep only Search, Library, Activity Map, and Editor visible
- Focus Mode stays on after refresh until you turn it off
- Click the Focus button or use the keyboard shortcut to toggle it
- Press `?` outside typing to open the full shortcut reference for Mac and Windows

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
- The app downloads `mind-journal-notes-YYYY-MM-DD.json`

### Import

- Click `Import JSON`
- Select a previously exported `.json` file
- Review the import summary before confirming
- Imported notes are merged into the current notes by note `id`
- The app shows how many notes were added and how many existing notes were replaced

## Themes

- Soft Gray
- Light
- Dark
- Glass
- Paper

Theme preference is saved in the browser.

## Keyboard Shortcuts

| Action | Mac | Windows |
| --- | --- | --- |
| Open shortcut help | `?` | `?` |
| Create a new note | `N` | `N` |
| Close the editor or dismiss open overlays | `Esc` | `Esc` |
| Focus search | `Cmd + F` | `Ctrl + F` |
| Toggle Focus Mode | `Cmd + .` | `Ctrl + .` |
| Clear search and date filters | `Cmd + Delete` | `Ctrl + Backspace` |
| Select next visible note | `J` | `J` |
| Select previous visible note | `K` | `K` |
| Open archive | `O` | `O` |
| Download backup | `D` | `D` |

## Data and Limitations

- Notes are stored only in this browser
- Clearing browser storage removes local notes
- There is no cloud sync or account system
- Delete undo is immediate-session only and is not a long-term trash/archive
- The first-use welcome guide is remembered per browser using local storage
