const STORAGE_KEYS = {
  notes: "mind_journal_notes",
  theme: "mind_journal_theme",
  view: "mind_journal_view"
};

const WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DEFAULT_THEME = "soft-gray";

const state = {
  notes: loadNotes(),
  selectedNoteId: null,
  notePendingDeleteId: null,
  isCalendarOpen: false,
  searchQuery: "",
  selectedDate: null,
  currentView: loadPreference(STORAGE_KEYS.view, "card"),
  currentTheme: loadPreference(STORAGE_KEYS.theme, DEFAULT_THEME),
  calendarMonth: startOfMonth(new Date()),
  autosaveMessage: "Autosave ready"
};

const elements = {
  searchInput: document.querySelector("#search-input"),
  newNoteButton: document.querySelector("#new-note-button"),
  librarySummary: document.querySelector("#library-summary"),
  libraryContainer: document.querySelector("#library-container"),
  editorPanel: document.querySelector("#editor-panel"),
  editorHeading: document.querySelector("#editor-heading"),
  editorEmptyState: document.querySelector("#editor-empty-state"),
  editorForm: document.querySelector("#editor-form"),
  noteTitle: document.querySelector("#note-title"),
  noteTags: document.querySelector("#note-tags"),
  noteContent: document.querySelector("#note-content"),
  noteCreatedAt: document.querySelector("#note-created-at"),
  noteUpdatedAt: document.querySelector("#note-updated-at"),
  closeEditorButton: document.querySelector("#close-editor-button"),
  deleteNoteButton: document.querySelector("#delete-note-button"),
  deleteModalBackdrop: document.querySelector("#delete-modal-backdrop"),
  deleteModalHeading: document.querySelector("#delete-modal-heading"),
  deleteModalDescription: document.querySelector("#delete-modal-description"),
  cancelDeleteButton: document.querySelector("#cancel-delete-button"),
  confirmDeleteButton: document.querySelector("#confirm-delete-button"),
  clearFiltersButton: document.querySelector("#clear-filters-button"),
  exportButton: document.querySelector("#export-button"),
  calendarTrigger: document.querySelector("#calendar-trigger"),
  calendarTriggerText: document.querySelector("#calendar-trigger-text"),
  themeSelect: document.querySelector("#theme-select"),
  viewButtons: document.querySelectorAll("[data-view]"),
  calendarMonthLabel: document.querySelector("#calendar-month-label"),
  calendarPopover: document.querySelector("#calendar-popover"),
  calendarWeekdays: document.querySelector("#calendar-weekdays"),
  calendarGrid: document.querySelector("#calendar-grid"),
  calendarPrev: document.querySelector("#calendar-prev"),
  calendarNext: document.querySelector("#calendar-next"),
  calendarToday: document.querySelector("#calendar-today"),
  noteCardTemplate: document.querySelector("#note-card-template"),
  brainCanvas: document.querySelector("#brain-canvas"),
  visualSummary: document.querySelector("#visual-summary"),
  autosaveIndicator: document.querySelector("#autosave-indicator")
};

initialize();

function initialize() {
  document.body.dataset.theme = state.currentTheme;
  elements.themeSelect.value = state.currentTheme;
  ensureSelection();
  bindEvents();
  renderWeekdays();
  renderApp();
}

function bindEvents() {
  elements.newNoteButton.addEventListener("click", createNote);
  elements.closeEditorButton.addEventListener("click", closeEditor);
  elements.deleteNoteButton.addEventListener("click", openDeleteModal);
  elements.cancelDeleteButton.addEventListener("click", closeDeleteModal);
  elements.confirmDeleteButton.addEventListener("click", deleteSelectedNote);
  elements.deleteModalBackdrop.addEventListener("click", (event) => {
    if (event.target === elements.deleteModalBackdrop) {
      closeDeleteModal();
    }
  });
  elements.clearFiltersButton.addEventListener("click", clearFilters);
  elements.exportButton.addEventListener("click", exportNotes);
  elements.calendarTrigger.addEventListener("click", toggleCalendarPopover);
  elements.searchInput.addEventListener("input", (event) => {
    state.searchQuery = event.target.value.trim();
    renderApp();
  });
  elements.themeSelect.addEventListener("change", (event) => {
    state.currentTheme = event.target.value;
    persistPreference(STORAGE_KEYS.theme, state.currentTheme);
    document.body.dataset.theme = state.currentTheme;
    drawBrainVisualization();
  });
  elements.viewButtons.forEach((button) => {
    button.addEventListener("click", () => {
      state.currentView = button.dataset.view;
      persistPreference(STORAGE_KEYS.view, state.currentView);
      renderEditor();
      updateViewButtons();
    });
  });
  elements.noteTitle.addEventListener("input", () => updateSelectedNoteField("title", elements.noteTitle.value));
  elements.noteTags.addEventListener("input", () => updateSelectedNoteField("tags", parseTags(elements.noteTags.value)));
  elements.noteContent.addEventListener("input", () => updateSelectedNoteField("content", elements.noteContent.value));
  elements.calendarPrev.addEventListener("click", () => {
    state.calendarMonth = addMonths(state.calendarMonth, -1);
    renderCalendar();
  });
  elements.calendarNext.addEventListener("click", () => {
    state.calendarMonth = addMonths(state.calendarMonth, 1);
    renderCalendar();
  });
  elements.calendarToday.addEventListener("click", () => {
    state.calendarMonth = startOfMonth(new Date());
    state.selectedDate = formatDateKey(new Date());
    state.isCalendarOpen = false;
    renderApp();
  });
  document.addEventListener("click", handleDocumentClick);
  window.addEventListener("resize", drawBrainVisualization);
  window.addEventListener("keydown", handleKeyboardShortcuts);
}

function renderApp() {
  sortNotesInPlace();
  ensureSelection();
  renderLibrary();
  renderEditor();
  renderCalendar();
  renderDeleteModal();
  updateViewButtons();
  updateVisualSummary();
  drawBrainVisualization();
}

function renderWeekdays() {
  elements.calendarWeekdays.innerHTML = "";
  WEEKDAY_LABELS.forEach((label) => {
    const cell = document.createElement("span");
    cell.textContent = label;
    elements.calendarWeekdays.appendChild(cell);
  });
}

function renderCalendarPopover() {
  elements.calendarPopover.classList.toggle("hidden", !state.isCalendarOpen);
  elements.calendarTrigger.setAttribute("aria-expanded", String(state.isCalendarOpen));
  elements.calendarTriggerText.textContent = state.selectedDate ? formatCompactDate(state.selectedDate) : "Any date";
}

function buildNoteCard(note) {
  const fragment = elements.noteCardTemplate.content.cloneNode(true);
  const article = fragment.querySelector(".note-card");
  const title = fragment.querySelector("h3");
  const time = fragment.querySelector("time");
  const preview = fragment.querySelector(".note-card__preview");
  const tags = fragment.querySelector(".tag-list");

  title.textContent = note.title || "Untitled note";
  time.remove();
  preview.remove();

  if (note.tags.length === 0) {
    tags.remove();
  } else {
    note.tags.forEach((tag) => {
      const item = document.createElement("li");
      item.textContent = `#${tag}`;
      tags.appendChild(item);
    });
  }

  if (note.id === state.selectedNoteId) {
    article.classList.add("is-selected");
  }

  article.addEventListener("click", () => {
    state.selectedNoteId = note.id;
    renderApp();
  });

  return fragment;
}

function renderLibrary() {
  const visibleNotes = getVisibleNotes();
  elements.libraryContainer.innerHTML = "";
  elements.librarySummary.textContent = `${visibleNotes.length} of ${state.notes.length}`;

  if (visibleNotes.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty-list";
    empty.textContent = state.notes.length
      ? "No notes match the current filters."
      : "No notes yet. Create one to start journaling.";
    elements.libraryContainer.appendChild(empty);
    return;
  }

  if (state.currentView === "timeline") {
    const groups = groupNotesByDay(visibleNotes);
    Object.entries(groups).forEach(([dateKey, notes]) => {
      const wrapper = document.createElement("section");
      wrapper.className = "timeline-group";

      const label = document.createElement("div");
      label.className = "timeline-group__label";
      label.textContent = formatReadableDate(dateKey);
      wrapper.appendChild(label);

      notes.forEach((currentNote) => wrapper.appendChild(buildNoteCard(currentNote)));
      elements.libraryContainer.appendChild(wrapper);
    });
    return;
  }

  visibleNotes.forEach((currentNote) => elements.libraryContainer.appendChild(buildNoteCard(currentNote)));
}

function renderEditor() {
  const note = getSelectedNote();
  const hasNote = Boolean(note);

  elements.editorEmptyState.classList.toggle("hidden", hasNote);
  elements.editorForm.classList.toggle("hidden", !hasNote);
  elements.deleteNoteButton.disabled = !hasNote;
  elements.closeEditorButton.disabled = !hasNote;

  if (!hasNote) {
    elements.editorHeading.textContent = "No note selected";
    elements.autosaveIndicator.textContent = state.autosaveMessage;
    updateMobileEditorState();
    return;
  }

  elements.editorHeading.textContent = note.title || "Untitled note";
  elements.noteTitle.value = note.title;
  elements.noteTags.value = note.tags.join(", ");
  elements.noteContent.value = note.content;
  updateEditorMeta(note);
  elements.autosaveIndicator.textContent = state.autosaveMessage;

  updateMobileEditorState();
}

function renderDeleteModal() {
  const note = getPendingDeleteNote();
  const isOpen = Boolean(note);

  elements.deleteModalBackdrop.classList.toggle("hidden", !isOpen);
  elements.deleteModalBackdrop.setAttribute("aria-hidden", String(!isOpen));

  if (!isOpen) {
    return;
  }

  elements.deleteModalHeading.textContent = `Delete "${note.title || "Untitled note"}"?`;
  elements.deleteModalDescription.textContent =
    "This note will be removed from your local journal and cannot be recovered here.";
}

function renderCalendar() {
  renderCalendarPopover();
  const activeMonth = state.calendarMonth;
  elements.calendarMonthLabel.textContent = activeMonth.toLocaleDateString(undefined, {
    month: "long",
    year: "numeric"
  });
  elements.calendarGrid.innerHTML = "";

  const gridDays = getCalendarGridDays(activeMonth);
  const noteCounts = countNotesByCreatedDate(state.notes);
  const todayKey = formatDateKey(new Date());

  gridDays.forEach((date) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "calendar-day";

    const dateKey = formatDateKey(date);
    const count = noteCounts.get(dateKey) || 0;

    if (date.getMonth() !== activeMonth.getMonth()) {
      button.classList.add("is-muted");
    }
    if (dateKey === todayKey) {
      button.classList.add("is-today");
    }
    if (dateKey === state.selectedDate) {
      button.classList.add("is-selected");
    }

    const dayNumber = document.createElement("span");
    dayNumber.textContent = String(date.getDate());
    const countLabel = document.createElement("small");
    countLabel.textContent = count ? String(count) : "0";
    countLabel.classList.toggle("is-empty", count === 0);
    button.setAttribute(
      "aria-label",
      `${formatReadableDate(dateKey)}${count ? `, ${count} note${count > 1 ? "s" : ""}` : ", no notes"}`
    );
    button.append(dayNumber, countLabel);

    button.addEventListener("click", () => {
      state.selectedDate = state.selectedDate === dateKey ? null : dateKey;
      state.calendarMonth = startOfMonth(date);
      state.isCalendarOpen = false;
      renderApp();
    });

    elements.calendarGrid.appendChild(button);
  });
}

function updateViewButtons() {
  elements.viewButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.view === state.currentView);
  });
}

function updateVisualSummary() {
  const count = state.notes.length;
  if (count === 0) {
    elements.visualSummary.textContent = "Your note graph thickens as your journal grows.";
    return;
  }
  if (count === 1) {
    elements.visualSummary.textContent = "One memory anchor is active. Add more notes to widen the network.";
    return;
  }
  elements.visualSummary.textContent = `${count} notes are feeding a denser pattern of connections.`;
}

function drawBrainVisualization() {
  const canvas = elements.brainCanvas;
  const context = canvas.getContext("2d");
  const scale = window.devicePixelRatio || 1;
  const { width: cssWidth, height: cssHeight } = canvas.getBoundingClientRect();

  if (!cssWidth || !cssHeight) {
    return;
  }

  canvas.width = Math.floor(cssWidth * scale);
  canvas.height = Math.floor(cssHeight * scale);
  context.setTransform(scale, 0, 0, scale, 0, 0);
  context.clearRect(0, 0, cssWidth, cssHeight);

  const count = Math.max(6, Math.min(state.notes.length * 3 + 6, 42));
  const centerX = cssWidth / 2;
  const centerY = cssHeight / 2;
  const maxRadius = Math.min(cssWidth, cssHeight) * 0.34;
  const computedStyle = getComputedStyle(document.body);
  const accent = computedStyle.getPropertyValue("--accent").trim();
  const accentStrong = computedStyle.getPropertyValue("--accent-strong").trim();
  const glow = computedStyle.getPropertyValue("--canvas-glow").trim();

  const nodes = Array.from({ length: count }, (_, index) => {
    const t = index / count;
    const angle = t * Math.PI * 2 * 1.618;
    const radius = maxRadius * (0.28 + 0.72 * ((index % 7) / 6));
    const pulse = state.notes.length ? ((index * 13) % 10) / 40 : 0.08;
    return {
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * (radius * 0.72),
      radius: 2.5 + pulse * 8
    };
  });

  context.strokeStyle = glow;
  context.lineWidth = 1.2;

  for (let index = 0; index < nodes.length; index += 1) {
    const node = nodes[index];
    const next = nodes[(index + 1) % nodes.length];
    const paired = nodes[(index + Math.max(2, Math.floor(count / 4))) % nodes.length];
    drawLine(context, node, next);
    if (index % 3 === 0) {
      drawLine(context, node, paired);
    }
  }

  nodes.forEach((node, index) => {
    const gradient = context.createRadialGradient(node.x, node.y, 0, node.x, node.y, node.radius * 4);
    gradient.addColorStop(0, accentStrong);
    gradient.addColorStop(0.45, accent);
    gradient.addColorStop(1, "transparent");
    context.fillStyle = gradient;
    context.beginPath();
    context.arc(node.x, node.y, node.radius * 2.2, 0, Math.PI * 2);
    context.fill();

    context.fillStyle = index % 4 === 0 ? accentStrong : accent;
    context.beginPath();
    context.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
    context.fill();
  });
}

function drawLine(context, from, to) {
  context.beginPath();
  context.moveTo(from.x, from.y);
  context.quadraticCurveTo((from.x + to.x) / 2, (from.y + to.y) / 2 - 12, to.x, to.y);
  context.stroke();
}

function createNote() {
  const timestamp = new Date().toISOString();
  const note = {
    id: createId(),
    title: "",
    content: "",
    tags: [],
    createdAt: timestamp,
    updatedAt: timestamp
  };

  state.notes.unshift(note);
  state.selectedNoteId = note.id;
  state.selectedDate = formatDateKey(timestamp);
  state.calendarMonth = startOfMonth(new Date(timestamp));
  persistNotes();
  setAutosaveMessage("New note created");
  renderApp();
  elements.noteTitle.focus();
}

function closeEditor() {
  state.selectedNoteId = null;
  setAutosaveMessage("Editor closed");
  renderEditor();
}

function deleteSelectedNote() {
  const note = getPendingDeleteNote();
  if (!note) {
    return;
  }

  state.notes = state.notes.filter((item) => item.id !== note.id);
  state.notePendingDeleteId = null;
  state.selectedNoteId = null;
  persistNotes();
  ensureSelection();
  setAutosaveMessage("Note deleted");
  renderApp();
  elements.newNoteButton.focus();
}

function openDeleteModal() {
  const note = getSelectedNote();
  if (!note) {
    return;
  }

  state.notePendingDeleteId = note.id;
  renderDeleteModal();
  elements.cancelDeleteButton.focus();
}

function closeDeleteModal() {
  state.notePendingDeleteId = null;
  renderDeleteModal();
  elements.deleteNoteButton.focus();
}

function clearFilters() {
  state.searchQuery = "";
  state.selectedDate = null;
  state.isCalendarOpen = false;
  state.calendarMonth = startOfMonth(new Date());
  elements.searchInput.value = "";
  renderApp();
}

function updateSelectedNoteField(field, value) {
  const note = getSelectedNote();
  if (!note) {
    return;
  }

  note[field] = value;
  note.updatedAt = new Date().toISOString();
  persistNotes();
  sortNotesInPlace();
  setAutosaveMessage(`Autosaved ${new Date(note.updatedAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  })}`);
  renderLibrary();
  updateEditorMeta(note);
  elements.editorHeading.textContent = note.title || "Untitled note";
  elements.autosaveIndicator.textContent = state.autosaveMessage;
}

function exportNotes() {
  const data = JSON.stringify(state.notes, null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "mind-journal-notes.json";
  link.click();
  URL.revokeObjectURL(url);
  setAutosaveMessage("JSON export downloaded");
  renderEditor();
}

function handleKeyboardShortcuts(event) {
  const target = event.target;
  const isTyping = target instanceof HTMLElement && /INPUT|TEXTAREA|SELECT/.test(target.tagName);

  if (event.key === "Escape" && state.notePendingDeleteId) {
    closeDeleteModal();
    return;
  }

  if (event.key === "Escape" && state.isCalendarOpen) {
    state.isCalendarOpen = false;
    renderCalendarPopover();
    elements.calendarTrigger.focus();
    return;
  }

  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "f") {
    event.preventDefault();
    elements.searchInput.focus();
    elements.searchInput.select();
    return;
  }

  if (event.key === "Escape") {
    closeEditor();
    return;
  }

  if (!isTyping && !event.metaKey && !event.ctrlKey && !event.altKey && event.key.toLowerCase() === "n") {
    event.preventDefault();
    createNote();
  }
}

function getVisibleNotes() {
  return state.notes.filter((note) => matchesSearch(note, state.searchQuery) && matchesSelectedDate(note, state.selectedDate));
}

function matchesSearch(note, query) {
  if (!query) {
    return true;
  }

  const haystack = [
    note.title,
    note.content,
    note.tags.join(" "),
    formatShortDate(note.createdAt),
    formatShortDate(note.updatedAt),
    formatReadableDate(formatDateKey(note.createdAt))
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(query.toLowerCase());
}

function matchesSelectedDate(note, selectedDate) {
  if (!selectedDate) {
    return true;
  }
  return formatDateKey(note.createdAt) === selectedDate;
}

function groupNotesByDay(notes) {
  return notes.reduce((groups, note) => {
    const key = formatDateKey(note.createdAt);
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(note);
    return groups;
  }, {});
}

function countNotesByCreatedDate(notes) {
  return notes.reduce((map, note) => {
    const key = formatDateKey(note.createdAt);
    map.set(key, (map.get(key) || 0) + 1);
    return map;
  }, new Map());
}

function getCalendarGridDays(monthDate) {
  const firstDay = startOfMonth(monthDate);
  const startOffset = (firstDay.getDay() + 6) % 7;
  const gridStart = new Date(firstDay);
  gridStart.setDate(firstDay.getDate() - startOffset);

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + index);
    return date;
  });
}

function ensureSelection() {
  const visible = getVisibleNotes();

  if (state.selectedNoteId && state.notes.some((note) => note.id === state.selectedNoteId)) {
    return;
  }

  state.selectedNoteId = visible[0]?.id || null;
}

function getSelectedNote() {
  return state.notes.find((note) => note.id === state.selectedNoteId) || null;
}

function getPendingDeleteNote() {
  return state.notes.find((note) => note.id === state.notePendingDeleteId) || null;
}

function persistNotes() {
  localStorage.setItem(STORAGE_KEYS.notes, JSON.stringify(state.notes));
}

function loadNotes() {
  const raw = localStorage.getItem(STORAGE_KEYS.notes);
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.map((note) => ({
      id: String(note.id || createId()),
      title: String(note.title || ""),
      content: String(note.content || ""),
      tags: Array.isArray(note.tags) ? note.tags.map((tag) => String(tag).trim()).filter(Boolean) : [],
      createdAt: normalizeDate(note.createdAt),
      updatedAt: normalizeDate(note.updatedAt || note.createdAt)
    }));
  } catch (error) {
    console.error("Failed to parse saved notes", error);
    return [];
  }
}

function sortNotesInPlace() {
  state.notes.sort((left, right) => new Date(right.updatedAt) - new Date(left.updatedAt));
}

function normalizeDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return new Date().toISOString();
  }
  return date.toISOString();
}

function parseTags(value) {
  return value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function formatDateKey(value) {
  const date = value instanceof Date ? value : new Date(value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatShortDate(value) {
  return new Date(value).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

function formatReadableDate(dateKey) {
  return new Date(`${dateKey}T12:00:00`).toLocaleDateString(undefined, {
    weekday: "short",
    month: "long",
    day: "numeric",
    year: "numeric"
  });
}

function formatTimestamp(value) {
  return new Date(value).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function createId() {
  return `note_${Math.random().toString(36).slice(2, 10)}`;
}

function loadPreference(key, fallback) {
  return localStorage.getItem(key) || fallback;
}

function persistPreference(key, value) {
  localStorage.setItem(key, value);
}

function startOfMonth(value) {
  const date = value instanceof Date ? new Date(value) : new Date(value);
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addMonths(value, offset) {
  return new Date(value.getFullYear(), value.getMonth() + offset, 1);
}

function setAutosaveMessage(message) {
  state.autosaveMessage = message;
}

function updateMobileEditorState() {
  const shouldOpen = window.innerWidth <= 720 && Boolean(getSelectedNote());
  elements.editorPanel.classList.toggle("is-open", shouldOpen);
}

function updateEditorMeta(note) {
  elements.noteCreatedAt.textContent = formatTimestamp(note.createdAt);
  elements.noteUpdatedAt.textContent = formatTimestamp(note.updatedAt);
}

function toggleCalendarPopover() {
  state.isCalendarOpen = !state.isCalendarOpen;
  renderCalendarPopover();
}

function handleDocumentClick(event) {
  if (!state.isCalendarOpen) {
    return;
  }

  const target = event.target;
  if (elements.calendarPopover.contains(target) || elements.calendarTrigger.contains(target)) {
    return;
  }

  state.isCalendarOpen = false;
  renderCalendarPopover();
}

function formatCompactDate(dateKey) {
  return new Date(`${dateKey}T12:00:00`).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric"
  });
}
