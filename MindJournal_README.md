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
- 🎨 Light, Dark, and Soft Gray themes
- 🧠 Brain-style visualization that grows with notes
- 💾 LocalStorage persistence (works offline)
- ↩️ Undo delete banner
- 📥 Import notes from JSON
- 📤 Export all notes as JSON
- ⌨️ Keyboard shortcuts for fast workflow

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|--------|--------|
| N | Create new note |
| Esc | Close editor or dismiss open overlays |
| Ctrl / Cmd + F | Focus search |

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

---

## 📥📤 Import and Export Notes

Click **Export JSON** to download all notes as:

```
mind-journal-notes.json
```

Click **Import JSON** to restore or merge notes from a previously exported JSON file.
After import, the app reports how many notes were added and how many were replaced.

---

## 🎨 Themes

- Light
- Dark
- Soft Gray (default, eye-friendly)

---

## 🧠 Visualization

The app includes a dynamic **brain-style visualization**:

- Few notes → small network
- More notes → dense network

---

## 🧭 Layout

- Left sidebar: search, date filter, theme switcher, view switcher, Library list
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
