# 🧠 Mind Journal

A minimal, Apple-inspired **offline-first notes & journal web app** built using pure HTML, CSS, and JavaScript.

---

## 🚀 Features

- 📝 Create, edit, and delete notes
- 🔍 Global search (title, content, tags, date)
- 📅 Calendar-based date filtering
- 🕰️ Timeline and Card view modes
- ↕️ Sort by updated or created date
- 🏷️ Clickable Library tags for quick filtering
- 🎯 Persistent Focus Mode for distraction-free writing
- 👋 First-use onboarding guidance
- 🎨 Light, Dark, Soft Gray, Glass, and Paper themes
- 🧠 Brain-style visualization that grows with notes
- 💾 LocalStorage persistence (works offline)
- ↩️ Undo delete banner
- 📥 Import notes from JSON
- 📤 Export all notes as JSON
- ⌨️ Keyboard shortcuts for fast workflow

---

## ⌨️ Keyboard Shortcuts

| Action | Mac | Windows |
|--------|--------|--------|
| Open shortcut help | `?` | `?` |
| Create new note | `N` | `N` |
| Close editor or dismiss open overlays | `Esc` | `Esc` |
| Focus search | `Cmd + F` | `Ctrl + F` |
| Toggle Focus Mode | `Cmd + .` | `Ctrl + .` |
| Clear search and date filters | `Cmd + Delete` | `Ctrl + Backspace` |
| Select next visible note | `J` | `J` |
| Select previous visible note | `K` | `K` |
| Open archive | `O` | `O` |
| Download backup | `D` | `D` |

---

## 🏗️ Tech Stack

- HTML5
- CSS3 (with variables for theming)
- Vanilla JavaScript (no frameworks)

---

## 📁 Project Structure

```
/mind-journal
│── index.html
│── style.css
│── script.js
│── README.md
│── USER_GUIDE.md
│── CHANGELOG.md
│── MindJournal_README.md
```

---

## ▶️ How to Run

1. Download or clone the project
2. Open `index.html` in your browser

No installation required.

---

## 💾 Data Storage

- Notes are stored in browser `localStorage`
- Storage key: `mind_journal_notes`
- Theme key: `mind_journal_theme`
- View key: `mind_journal_view`
- Sort key: `mind_journal_sort`
- Focus key: `mind_journal_focus_mode`
- Onboarding key: `mind_journal_has_seen_onboarding`

---

## 📥📤 Import and Export Notes

Click **Export JSON** to download all notes as:

```
mind-journal-notes-YYYY-MM-DD.json
```

Click **Import JSON** to restore or merge notes from a previously exported JSON file.
The app shows an import review step before applying imported notes.
After import, the app reports how many notes were added and how many were replaced.

---

## 🎨 Themes

- Light
- Dark
- Soft Gray (default, eye-friendly)
- Glass (calm frosted look)
- Paper (warm writing-first look)

---

## 🧠 Visualization

The app includes a dynamic **brain-style visualization**:

- Few notes → small network
- More notes → dense network

---

## 🧭 Layout

- Left sidebar: search, date filter, theme switcher, view switcher, Library list
- Focus Mode hides the utility controls and keeps Search, Library, Activity Map, and Editor visible
- Left sidebar controls also include sort and quick tag filtering from the Library
- Top right: activity map visualization
- Right panel: note editor for the currently selected note

---

## 📱 Responsive Design

- Desktop: centered layout
- Tablet: grid layout
- Mobile: stacked layout, full-screen editor

---

## 🎯 Design Philosophy

- Minimal
- Calm
- Distraction-free
- Apple-inspired UI

---

## ⚠️ Limitations

- No cloud sync
- Data stored only in browser
- Clearing browser storage removes notes
- Imported notes merge locally by note `id`
- Delete undo is available only for the latest deleted note in the current session

---

## 🔮 Future Improvements (Optional)

- Cloud sync (Firebase / API)
- User login
- Markdown support
- Tags filtering UI
- Backup & restore

---

## 🙌 Credits

Built as a **local-first productivity tool** with focus on simplicity and usability.

---

## 📄 License

Free to use for personal and educational purposes.
