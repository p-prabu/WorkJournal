const STORAGE_KEYS = {
  notes: "mind_journal_notes",
  theme: "mind_journal_theme",
  view: "mind_journal_view",
  sort: "mind_journal_sort",
  focus: "mind_journal_focus_mode",
  onboarding: "mind_journal_has_seen_onboarding",
  uiSettings: "mind_journal_ui_settings"
};

const WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DEFAULT_THEME = "soft-gray";
const BRAIN_MILESTONES = [
  { count: 100, label: "100", cue: "Emerges", fill: 0.08 },
  { count: 1000, label: "1000", cue: "Activates", fill: 0.28 },
  { count: 2000, label: "2000", cue: "Deepens", fill: 0.46 },
  { count: 4000, label: "4000", cue: "Brightens", fill: 0.68 },
  { count: 7000, label: "7000", cue: "Near full", fill: 0.86 },
  { count: 10000, label: "10000", cue: "Full form", fill: 1 }
];
let brainPointCloudCache = null;
const DEFAULT_UI_SETTINGS = {
  showThemeControl: true,
  showViewControl: true,
  showBrainRoadmap: true
};

const state = {
  notes: loadNotes(),
  selectedNoteId: null,
  notePendingDeleteId: null,
  lastDeletedNote: null,
  pendingImport: null,
  isCalendarOpen: false,
  isSettingsOpen: false,
  isFocusMode: loadPreference(STORAGE_KEYS.focus, "false") === "true",
  isShortcutHelpOpen: false,
  hasSeenOnboarding: loadPreference(STORAGE_KEYS.onboarding, "false") === "true",
  uiSettings: loadUiSettings(),
  searchQuery: "",
  selectedDate: null,
  currentView: loadPreference(STORAGE_KEYS.view, "card"),
  currentSort: loadPreference(STORAGE_KEYS.sort, "updated"),
  currentTheme: loadPreference(STORAGE_KEYS.theme, DEFAULT_THEME),
  calendarMonth: startOfMonth(new Date()),
  autosaveMessage: "Autosave ready"
};

const elements = {
  searchInput: document.querySelector("#search-input"),
  shortcutHelpButton: document.querySelector("#shortcut-help-button"),
  settingsButton: document.querySelector("#settings-button"),
  settingsPopover: document.querySelector("#settings-popover"),
  toggleThemeControl: document.querySelector("#toggle-theme-control"),
  toggleViewControl: document.querySelector("#toggle-view-control"),
  toggleBrainRoadmap: document.querySelector("#toggle-brain-roadmap"),
  focusModeButton: document.querySelector("#focus-mode-button"),
  newNoteButton: document.querySelector("#new-note-button"),
  viewControlWrapper: document.querySelector("#view-control-wrapper"),
  themeControlWrapper: document.querySelector("#theme-control-wrapper"),
  librarySummary: document.querySelector("#library-summary"),
  libraryContainer: document.querySelector("#library-container"),
  editorPanel: document.querySelector("#editor-panel"),
  editorHeading: document.querySelector("#editor-heading"),
  editorEmptyState: document.querySelector("#editor-empty-state"),
  onboardingPanel: document.querySelector("#onboarding-panel"),
  dismissOnboardingButton: document.querySelector("#dismiss-onboarding-button"),
  editorForm: document.querySelector("#editor-form"),
  noteTitle: document.querySelector("#note-title"),
  noteTags: document.querySelector("#note-tags"),
  noteContent: document.querySelector("#note-content"),
  noteCreatedAt: document.querySelector("#note-created-at"),
  noteUpdatedAt: document.querySelector("#note-updated-at"),
  closeEditorButton: document.querySelector("#close-editor-button"),
  deleteNoteButton: document.querySelector("#delete-note-button"),
  undoBanner: document.querySelector("#undo-banner"),
  undoMessage: document.querySelector("#undo-message"),
  undoDeleteButton: document.querySelector("#undo-delete-button"),
  shortcutsModalBackdrop: document.querySelector("#shortcuts-modal-backdrop"),
  closeShortcutsButton: document.querySelector("#close-shortcuts-button"),
  importConfirmModalBackdrop: document.querySelector("#import-confirm-modal-backdrop"),
  importSummaryFile: document.querySelector("#import-summary-file"),
  importSummaryTotal: document.querySelector("#import-summary-total"),
  importSummaryAdded: document.querySelector("#import-summary-added"),
  importSummaryReplaced: document.querySelector("#import-summary-replaced"),
  cancelImportButton: document.querySelector("#cancel-import-button"),
  confirmImportButton: document.querySelector("#confirm-import-button"),
  deleteModalBackdrop: document.querySelector("#delete-modal-backdrop"),
  deleteModalHeading: document.querySelector("#delete-modal-heading"),
  deleteModalDescription: document.querySelector("#delete-modal-description"),
  cancelDeleteButton: document.querySelector("#cancel-delete-button"),
  confirmDeleteButton: document.querySelector("#confirm-delete-button"),
  clearFiltersButton: document.querySelector("#clear-filters-button"),
  importButton: document.querySelector("#import-button"),
  importFileInput: document.querySelector("#import-file-input"),
  exportButton: document.querySelector("#export-button"),
  calendarTrigger: document.querySelector("#calendar-trigger"),
  calendarTriggerText: document.querySelector("#calendar-trigger-text"),
  themeSelect: document.querySelector("#theme-select"),
  sortSelect: document.querySelector("#sort-select"),
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
  brainRoadmap: document.querySelector("#brain-roadmap"),
  brainRoadmapStatus: document.querySelector("#brain-roadmap-status"),
  brainRoadmapProgress: document.querySelector("#brain-roadmap-progress"),
  brainRoadmapGrid: document.querySelector("#brain-roadmap-grid"),
  autosaveIndicator: document.querySelector("#autosave-indicator")
};

initialize();

function initialize() {
  document.body.dataset.theme = state.currentTheme;
  document.body.classList.toggle("focus-mode", state.isFocusMode);
  elements.themeSelect.value = state.currentTheme;
  elements.sortSelect.value = state.currentSort;
  ensureSelection();
  bindEvents();
  renderWeekdays();
  renderApp();
}

function bindEvents() {
  elements.focusModeButton.addEventListener("click", toggleFocusMode);
  elements.shortcutHelpButton.addEventListener("click", openShortcutHelp);
  elements.settingsButton.addEventListener("click", toggleSettingsPopover);
  elements.toggleThemeControl.addEventListener("change", (event) => updateUiSetting("showThemeControl", event.target.checked));
  elements.toggleViewControl.addEventListener("change", (event) => updateUiSetting("showViewControl", event.target.checked));
  elements.toggleBrainRoadmap.addEventListener("change", (event) => updateUiSetting("showBrainRoadmap", event.target.checked));
  elements.newNoteButton.addEventListener("click", createNote);
  elements.closeEditorButton.addEventListener("click", closeEditor);
  elements.deleteNoteButton.addEventListener("click", openDeleteModal);
  elements.cancelDeleteButton.addEventListener("click", closeDeleteModal);
  elements.confirmDeleteButton.addEventListener("click", deleteSelectedNote);
  elements.undoDeleteButton.addEventListener("click", undoDelete);
  elements.closeShortcutsButton.addEventListener("click", closeShortcutHelp);
  elements.dismissOnboardingButton.addEventListener("click", dismissOnboarding);
  elements.cancelImportButton.addEventListener("click", cancelPendingImport);
  elements.confirmImportButton.addEventListener("click", confirmPendingImport);
  elements.deleteModalBackdrop.addEventListener("click", (event) => {
    if (event.target === elements.deleteModalBackdrop) {
      closeDeleteModal();
    }
  });
  elements.shortcutsModalBackdrop.addEventListener("click", (event) => {
    if (event.target === elements.shortcutsModalBackdrop) {
      closeShortcutHelp();
    }
  });
  elements.importConfirmModalBackdrop.addEventListener("click", (event) => {
    if (event.target === elements.importConfirmModalBackdrop) {
      cancelPendingImport();
    }
  });
  elements.clearFiltersButton.addEventListener("click", clearFilters);
  elements.importButton.addEventListener("click", () => elements.importFileInput.click());
  elements.importFileInput.addEventListener("change", importNotes);
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
    renderApp();
  });
  elements.sortSelect.addEventListener("change", (event) => {
    state.currentSort = event.target.value;
    persistPreference(STORAGE_KEYS.sort, state.currentSort);
    renderApp();
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
  document.body.classList.toggle("focus-mode", state.isFocusMode);
  sortNotesInPlace();
  ensureSelection();
  renderLibrary();
  renderEditor();
  renderCalendar();
  renderDeleteModal();
  renderShortcutHelpModal();
  renderImportConfirmModal();
  renderUndoBanner();
  renderFocusModeButton();
  renderSettingsPopover();
  renderVisibilitySettings();
  renderBrainRoadmap();
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

function renderFocusModeButton() {
  elements.focusModeButton.textContent = state.isFocusMode ? "Exit Focus" : "Focus Mode";
  elements.focusModeButton.setAttribute("aria-pressed", String(state.isFocusMode));
}

function renderSettingsPopover() {
  elements.settingsPopover.classList.toggle("hidden", !state.isSettingsOpen);
  elements.settingsButton.setAttribute("aria-expanded", String(state.isSettingsOpen));
  elements.toggleThemeControl.checked = state.uiSettings.showThemeControl;
  elements.toggleViewControl.checked = state.uiSettings.showViewControl;
  elements.toggleBrainRoadmap.checked = state.uiSettings.showBrainRoadmap;
}

function renderVisibilitySettings() {
  elements.themeControlWrapper.classList.toggle("hidden", !state.uiSettings.showThemeControl);
  elements.viewControlWrapper.classList.toggle("hidden", !state.uiSettings.showViewControl);
  elements.brainRoadmap.classList.toggle("hidden", !state.uiSettings.showBrainRoadmap);
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
      item.addEventListener("click", (event) => {
        event.stopPropagation();
        elements.searchInput.value = tag;
        state.searchQuery = tag;
        renderApp();
      });
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
  const showOnboarding = shouldShowOnboarding();

  elements.editorEmptyState.classList.toggle("hidden", hasNote);
  elements.onboardingPanel.classList.toggle("hidden", !showOnboarding);
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

function renderShortcutHelpModal() {
  elements.shortcutsModalBackdrop.classList.toggle("hidden", !state.isShortcutHelpOpen);
  elements.shortcutsModalBackdrop.setAttribute("aria-hidden", String(!state.isShortcutHelpOpen));
}

function renderImportConfirmModal() {
  const isOpen = Boolean(state.pendingImport);
  elements.importConfirmModalBackdrop.classList.toggle("hidden", !isOpen);
  elements.importConfirmModalBackdrop.setAttribute("aria-hidden", String(!isOpen));

  if (!isOpen) {
    return;
  }

  elements.importSummaryFile.textContent = state.pendingImport.fileName;
  elements.importSummaryTotal.textContent = String(state.pendingImport.importedNotes.length);
  elements.importSummaryAdded.textContent = String(state.pendingImport.addedCount);
  elements.importSummaryReplaced.textContent = String(state.pendingImport.replacedCount);
}

function renderUndoBanner() {
  const hasUndo = Boolean(state.lastDeletedNote);
  elements.undoBanner.classList.toggle("hidden", !hasUndo);
  if (hasUndo) {
    elements.undoMessage.textContent = `"${state.lastDeletedNote.title || "Untitled note"}" deleted`;
  }
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
  if (count >= 10000) {
    elements.visualSummary.textContent = "10,000 notes have filled the full brain form.";
    return;
  }
  if (count >= 100) {
    elements.visualSummary.textContent = `${count} notes are filling out a visible brain shape that keeps densifying toward 10,000.`;
    return;
  }
  elements.visualSummary.textContent = `${count} notes are feeding a denser pattern of connections. At 100 notes, the brain form begins to appear.`;
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

  const noteCount = state.notes.length;
  const computedStyle = getComputedStyle(document.body);
  const accent = computedStyle.getPropertyValue("--accent").trim();
  const accentStrong = computedStyle.getPropertyValue("--accent-strong").trim();
  const glow = computedStyle.getPropertyValue("--canvas-glow").trim();

  if (noteCount >= 100) {
    drawStructuredBrainMode(context, cssWidth, cssHeight, noteCount, accent, accentStrong, glow);
    return;
  }

  drawAbstractBrainMode(context, cssWidth, cssHeight, noteCount, accent, accentStrong, glow);
}

function drawAbstractBrainMode(context, cssWidth, cssHeight, noteCount, accent, accentStrong, glow) {
  const count = Math.max(8, Math.min(10 + noteCount * 2, 96));
  const centerX = cssWidth / 2;
  const centerY = cssHeight / 2;
  const maxRadius = Math.min(cssWidth, cssHeight) * 0.34;
  const linkSpan = Math.max(2, Math.floor(count / 6));
  const extraLinks = Math.min(Math.floor(noteCount * 1.2), 28);

  const nodes = Array.from({ length: count }, (_, index) => {
    const t = index / count;
    const angle = t * Math.PI * 2 * 1.618;
    const radius = maxRadius * (0.2 + 0.8 * ((index % 11) / 10));
    const pulse = noteCount ? ((index * 13 + noteCount) % 10) / 40 : 0.08;
    return {
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * (radius * 0.72),
      radius: 2.5 + pulse * 8
    };
  });

  context.strokeStyle = glow;
  context.lineWidth = 0.9 + Math.min(noteCount / 24, 1.1);

  for (let index = 0; index < nodes.length; index += 1) {
    const node = nodes[index];
    const next = nodes[(index + 1) % nodes.length];
    const paired = nodes[(index + linkSpan) % nodes.length];
    drawLine(context, node, next);
    if (index % 2 === 0) {
      drawLine(context, node, paired);
    }
  }

  for (let index = 0; index < extraLinks; index += 1) {
    const from = nodes[(index * 5) % nodes.length];
    const to = nodes[(index * 9 + linkSpan) % nodes.length];
    drawLine(context, from, to);
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

function drawStructuredBrainMode(context, cssWidth, cssHeight, noteCount, accent, accentStrong, glow) {
  const centerX = cssWidth * 0.52;
  const centerY = cssHeight * 0.54;
  const scale = Math.min(cssWidth * 0.31, cssHeight * 0.5);
  const progress = Math.min(Math.max((noteCount - 100) / 9900, 0), 1);
  const cloud = getBrainPointCloud(3600);
  const activeFloat = 120 + progress * (cloud.length - 120);
  const activeWhole = Math.floor(activeFloat);
  const activeRemainder = activeFloat - activeWhole;
  const palette = getBrainMilestonePalette(noteCount, getComputedStyle(document.body), glow);
  const lobeFill = context.createRadialGradient(centerX, centerY * 0.94, scale * 0.1, centerX, centerY, scale * 2.05);

  lobeFill.addColorStop(0, withAlpha(palette.active, 0.16 + progress * 0.16));
  lobeFill.addColorStop(0.58, withAlpha(palette.ghost, 0.08 + progress * 0.08));
  lobeFill.addColorStop(1, "transparent");

  context.fillStyle = lobeFill;
  context.beginPath();
  context.ellipse(centerX, centerY, scale * 1.5, scale * 1.12, 0, 0, Math.PI * 2);
  context.fill();

  context.save();
  context.translate(centerX, centerY);
  context.scale(scale, scale);

  drawBrainOutline(context, palette.outline, palette.glow, palette.outlineAlpha);
  drawBrainContours(context, palette.glow, progress, palette.contourAlpha);
  drawBrainShadowMass(context, palette.ghost, progress);

  cloud.forEach((point, index) => {
    const isActive = index < activeWhole;
    const isPartial = index === activeWhole;
    const baseGhostAlpha = 0.04 + progress * 0.03 + palette.ghostAlphaBoost;
    const alpha = isActive
      ? Math.min(0.96, 0.62 + point.depth * 0.14 + palette.activeAlphaBoost)
      : isPartial
        ? activeRemainder * (0.56 + palette.activeAlphaBoost)
        : baseGhostAlpha;
    const radius = isActive ? 0.016 + point.weight * 0.018 + progress * 0.006 : 0.009 + point.weight * 0.004;
    const fill = isActive ? (point.depth > 0.58 ? palette.outline : palette.active) : palette.ghost;

    context.fillStyle = withAlpha(fill, alpha);
    context.beginPath();
    context.arc(point.x, point.y, radius, 0, Math.PI * 2);
    context.fill();

    if (isActive) {
      context.fillStyle = withAlpha(palette.glow, 0.12 + progress * 0.12 + palette.glowAlphaBoost);
      context.beginPath();
      context.arc(point.x, point.y, radius * (1.6 + point.depth * 0.4), 0, Math.PI * 2);
      context.fill();
    }
  });

  context.restore();
}

function drawBrainOutline(context, accentStrong, glow, outlineAlpha) {
  context.fillStyle = withAlpha(accentStrong, 0.045);
  context.beginPath();
  context.moveTo(-0.92, -0.04);
  context.bezierCurveTo(-0.98, -0.42, -0.62, -0.82, -0.04, -0.84);
  context.bezierCurveTo(0.44, -0.86, 0.86, -0.6, 1, -0.16);
  context.bezierCurveTo(1.08, 0.08, 1.03, 0.34, 0.86, 0.52);
  context.bezierCurveTo(0.72, 0.66, 0.48, 0.76, 0.16, 0.74);
  context.bezierCurveTo(0.02, 0.9, -0.24, 0.96, -0.44, 0.88);
  context.bezierCurveTo(-0.62, 0.82, -0.72, 0.68, -0.74, 0.52);
  context.bezierCurveTo(-0.92, 0.48, -1.04, 0.24, -0.98, 0.04);
  context.bezierCurveTo(-0.96, -0.02, -0.94, -0.04, -0.92, -0.04);
  context.closePath();
  context.fill();

  context.strokeStyle = withAlpha(glow, 0.88);
  context.lineWidth = 0.024;
  context.beginPath();
  context.moveTo(-0.92, -0.04);
  context.bezierCurveTo(-0.98, -0.42, -0.62, -0.82, -0.04, -0.84);
  context.bezierCurveTo(0.44, -0.86, 0.86, -0.6, 1, -0.16);
  context.bezierCurveTo(1.08, 0.08, 1.03, 0.34, 0.86, 0.52);
  context.bezierCurveTo(0.72, 0.66, 0.48, 0.76, 0.16, 0.74);
  context.bezierCurveTo(0.02, 0.9, -0.24, 0.96, -0.44, 0.88);
  context.bezierCurveTo(-0.62, 0.82, -0.72, 0.68, -0.74, 0.52);
  context.bezierCurveTo(-0.92, 0.48, -1.04, 0.24, -0.98, 0.04);
  context.bezierCurveTo(-0.96, -0.02, -0.94, -0.04, -0.92, -0.04);
  context.stroke();

  context.strokeStyle = withAlpha(accentStrong, outlineAlpha);
  context.lineWidth = 0.03;
  context.beginPath();
  context.moveTo(-0.02, 0.72);
  context.bezierCurveTo(0.04, 0.88, 0.06, 1.04, 0.02, 1.18);
  context.stroke();

  context.strokeStyle = withAlpha(accentStrong, outlineAlpha * 0.82);
  context.lineWidth = 0.022;
  context.beginPath();
  context.moveTo(0.08, 0.58);
  context.bezierCurveTo(0.24, 0.76, 0.32, 0.88, 0.34, 1.02);
  context.stroke();
}

function drawBrainContours(context, glow, progress, contourAlpha) {
  const curves = [
    [-0.72, -0.28, -0.54, -0.56, -0.16, -0.6, 0.24, -0.44],
    [-0.74, -0.06, -0.46, -0.26, -0.04, -0.26, 0.38, -0.14],
    [-0.68, 0.12, -0.38, -0.02, 0.02, 0.04, 0.44, 0.12],
    [-0.54, 0.3, -0.18, 0.16, 0.22, 0.2, 0.58, 0.34],
    [-0.34, 0.52, -0.04, 0.42, 0.22, 0.44, 0.48, 0.56]
  ];

  context.strokeStyle = withAlpha(glow, contourAlpha + progress * 0.06);
  context.lineWidth = 0.016 + progress * 0.008;
  curves.forEach(([sx, sy, c1x, c1y, c2x, c2y, ex, ey]) => {
    context.beginPath();
    context.moveTo(sx, sy);
    context.bezierCurveTo(c1x, c1y, c2x, c2y, ex, ey);
    context.stroke();
  });
}

function drawBrainShadowMass(context, accent, progress) {
  context.fillStyle = withAlpha(accent, 0.05 + progress * 0.06);
  context.beginPath();
  context.ellipse(-0.04, -0.02, 0.9, 0.68, 0, 0, Math.PI * 2);
  context.fill();

  context.fillStyle = withAlpha(accent, 0.04 + progress * 0.04);
  context.beginPath();
  context.ellipse(0.34, -0.08, 0.44, 0.34, 0, 0, Math.PI * 2);
  context.fill();
}

function renderBrainRoadmap() {
  const computedStyle = getComputedStyle(document.body);
  const noteCount = state.notes.length;
  const progress = getBrainRoadmapProgress(noteCount);
  const nextMilestone = BRAIN_MILESTONES.find((milestone) => noteCount < milestone.count) || BRAIN_MILESTONES.at(-1);

  if (noteCount < BRAIN_MILESTONES[0].count) {
    elements.brainRoadmapStatus.textContent = "Next brain form unlocks at 100 notes.";
  } else if (noteCount >= BRAIN_MILESTONES.at(-1).count) {
    elements.brainRoadmapStatus.textContent = "Full brain milestone reached at 10,000 notes.";
  } else {
    elements.brainRoadmapStatus.textContent = `Current target: ${nextMilestone.count.toLocaleString()} notes (${nextMilestone.cue}).`;
  }

  elements.brainRoadmapProgress.style.width = `${progress * 100}%`;
  elements.brainRoadmapGrid.innerHTML = "";

  const currentTargetCount = nextMilestone.count;
  BRAIN_MILESTONES.forEach((milestone) => {
    const palette = getBrainMilestonePalette(milestone.count, computedStyle, computedStyle.getPropertyValue("--canvas-glow").trim());
    const isReached = noteCount >= milestone.count;
    const isCurrent = noteCount >= BRAIN_MILESTONES.at(-1).count
      ? milestone.count === BRAIN_MILESTONES.at(-1).count
      : milestone.count === currentTargetCount;
    const item = document.createElement("article");
    item.className = "brain-roadmap__item";
    item.classList.toggle("is-reached", isReached);
    item.classList.toggle("is-current", isCurrent);
    item.classList.toggle("is-locked", !isReached && !isCurrent);
    item.style.setProperty("--brain-card-outline", palette.outline);
    item.style.setProperty("--brain-card-outline-soft", withAlpha(palette.outline, 0.46));
    item.style.setProperty("--brain-card-active", palette.active);
    item.style.setProperty("--brain-card-active-soft", withAlpha(palette.active, 0.7));
    item.style.setProperty("--brain-card-active-faint", withAlpha(palette.active, 0.36));
    item.style.setProperty("--brain-card-ghost", palette.ghost);
    item.style.setProperty("--brain-card-ghost-soft", withAlpha(palette.ghost, 0.3));
    item.style.setProperty("--brain-card-glow", palette.glow);
    item.style.setProperty("--brain-card-glow-soft", withAlpha(palette.glow, 0.28));
    item.style.setProperty("--brain-card-glow-faint", withAlpha(palette.glow, 0.14));
    item.style.setProperty("--brain-fill-alpha", String(milestone.fill));
    item.setAttribute(
      "aria-label",
      `${milestone.count.toLocaleString()} notes, ${milestone.cue}${isCurrent ? ", current target" : isReached ? ", reached" : ", locked"}`
    );

    const preview = document.createElement("div");
    preview.className = "brain-roadmap__preview";
    preview.setAttribute("aria-hidden", "true");
    preview.append(
      createRoadmapPart("brain-roadmap__halo"),
      createRoadmapPart("brain-roadmap__mass"),
      createRoadmapPart("brain-roadmap__fill"),
      createRoadmapPart("brain-roadmap__lobe brain-roadmap__lobe--front"),
      createRoadmapPart("brain-roadmap__lobe brain-roadmap__lobe--rear"),
      createRoadmapPart("brain-roadmap__cerebellum"),
      createRoadmapPart("brain-roadmap__stem")
    );

    const countLabel = document.createElement("strong");
    countLabel.textContent = milestone.label;

    const cue = document.createElement("small");
    cue.textContent = milestone.cue;

    item.append(preview, countLabel, cue);
    elements.brainRoadmapGrid.appendChild(item);
  });
}

function createRoadmapPart(className) {
  const part = document.createElement("span");
  part.className = className;
  return part;
}

function getBrainRoadmapProgress(noteCount) {
  if (noteCount <= BRAIN_MILESTONES[0].count) {
    return 0;
  }
  if (noteCount >= BRAIN_MILESTONES.at(-1).count) {
    return 1;
  }

  for (let index = 0; index < BRAIN_MILESTONES.length - 1; index += 1) {
    const start = BRAIN_MILESTONES[index].count;
    const end = BRAIN_MILESTONES[index + 1].count;
    if (noteCount >= start && noteCount < end) {
      const segmentProgress = (noteCount - start) / (end - start);
      return (index + segmentProgress) / (BRAIN_MILESTONES.length - 1);
    }
  }

  return 1;
}

function getBrainMilestonePalette(noteCount, computedStyle, fallbackGlow) {
  const milestones = BRAIN_MILESTONES.map((milestone) => milestone.count);
  const colors = milestones.map((milestone) => computedStyle.getPropertyValue(`--brain-${milestone}`).trim());
  const cappedCount = Math.max(milestones[0], Math.min(noteCount, milestones[milestones.length - 1]));

  let startIndex = 0;
  let endIndex = milestones.length - 1;
  for (let index = 0; index < milestones.length - 1; index += 1) {
    if (cappedCount >= milestones[index] && cappedCount <= milestones[index + 1]) {
      startIndex = index;
      endIndex = index + 1;
      break;
    }
  }

  const startMilestone = milestones[startIndex];
  const endMilestone = milestones[endIndex];
  const ratio = startMilestone === endMilestone ? 0 : (cappedCount - startMilestone) / (endMilestone - startMilestone);
  const base = mixColors(colors[startIndex], colors[endIndex], ratio);
  const outline = mixColors(base, "#ffffff", state.currentTheme === "dark" ? 0.08 : 0.03);
  const ghost = mixColors(base, computedStyle.getPropertyValue("--panel-strong").trim(), 0.5);
  const glowBase = fallbackGlow || base;
  const glow = mixColors(base, glowBase, 0.32);
  const tierProgress = startIndex / (milestones.length - 1) + ratio / (milestones.length - 1);

  return {
    active: base,
    ghost,
    outline,
    glow,
    outlineAlpha: 0.24 + tierProgress * 0.28,
    contourAlpha: 0.12 + tierProgress * 0.14,
    activeAlphaBoost: 0.1 + tierProgress * 0.12,
    ghostAlphaBoost: tierProgress * 0.04,
    glowAlphaBoost: tierProgress * 0.12
  };
}

function getBrainPointCloud(totalPoints) {
  if (brainPointCloudCache && brainPointCloudCache.length >= totalPoints) {
    return brainPointCloudCache.slice(0, totalPoints);
  }

  const points = [];
  let attempt = 0;

  while (points.length < totalPoints && attempt < totalPoints * 60) {
    const x = -1.04 + 2.12 * pseudoRandom(attempt * 2.13);
    const y = -0.96 + 1.98 * pseudoRandom(attempt * 5.71 + 19);

    if (isInsideBrainShape(x, y)) {
      const ridge = Math.abs(Math.sin((x + 1.3) * 7.1 + y * 8.8));
      const swirl = Math.abs(Math.cos((x - y) * 5.4));
      const depth = Math.max(0.1, 1 - Math.abs(y + 0.03) * 0.72);
      points.push({
        x,
        y,
        weight: 0.38 + ridge * 0.4 + swirl * 0.22,
        depth
      });
    }
    attempt += 1;
  }

  points.sort((left, right) => right.weight + right.depth - (left.weight + left.depth));
  brainPointCloudCache = points;
  return points;
}

function isInsideBrainShape(x, y) {
  const cerebrum =
    ellipse(x + 0.04, y + 0.02, 0.96, 0.78) ||
    ellipse(x - 0.34, y - 0.08, 0.54, 0.46) ||
    ellipse(x + 0.32, y - 0.02, 0.52, 0.46) ||
    ellipse(x + 0.58, y - 0.16, 0.24, 0.22);
  const cerebellum = ellipse(x + 0.18, y - 0.58, 0.3, 0.22);
  const stem = ellipse(x - 0.04, y - 0.96, 0.09, 0.24);
  const frontCut = ellipse(x - 1.04, y + 0.12, 0.24, 0.22);
  const lowerCut = ellipse(x + 0.74, y - 0.62, 0.26, 0.18);

  return (cerebrum || cerebellum || stem) && !frontCut && !lowerCut;
}

function ellipse(x, y, rx, ry) {
  return (x * x) / (rx * rx) + (y * y) / (ry * ry) <= 1;
}

function pseudoRandom(seed) {
  const value = Math.sin(seed * 12.9898) * 43758.5453;
  return value - Math.floor(value);
}

function withAlpha(color, alpha) {
  const rgb = parseColorToRgb(color);
  if (rgb) {
    const safeAlpha = Math.max(0, Math.min(alpha, 1));
    return `rgba(${rgb.red}, ${rgb.green}, ${rgb.blue}, ${safeAlpha})`;
  }

  if (!color) {
    return `rgba(0, 0, 0, ${alpha})`;
  }
  return color;
}

function mixColors(from, to, ratio) {
  const start = parseColorToRgb(from) || { red: 0, green: 0, blue: 0 };
  const end = parseColorToRgb(to) || start;
  const progress = Math.max(0, Math.min(ratio, 1));

  return `rgb(${Math.round(interpolate(start.red, end.red, progress))}, ${Math.round(
    interpolate(start.green, end.green, progress)
  )}, ${Math.round(interpolate(start.blue, end.blue, progress))})`;
}

function parseColorToRgb(color) {
  if (!color) {
    return null;
  }

  if (color.startsWith("#")) {
    const hex = color.slice(1);
    const normalized = hex.length === 3
      ? hex
          .split("")
          .map((part) => part + part)
          .join("")
      : hex;
    const int = Number.parseInt(normalized, 16);
    return {
      red: (int >> 16) & 255,
      green: (int >> 8) & 255,
      blue: int & 255
    };
  }

  if (color.startsWith("rgb(")) {
    const [red, green, blue] = color
      .replace("rgb(", "")
      .replace(")", "")
      .split(",")
      .map((value) => Number.parseFloat(value.trim()));
    return { red, green, blue };
  }

  if (color.startsWith("rgba(")) {
    const [red, green, blue] = color
      .replace("rgba(", "")
      .replace(")", "")
      .split(",")
      .slice(0, 3)
      .map((value) => Number.parseFloat(value.trim()));
    return { red, green, blue };
  }

  return null;
}

function interpolate(start, end, ratio) {
  return start + (end - start) * ratio;
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
  markOnboardingSeen();
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

  state.lastDeletedNote = { ...note };
  state.notes = state.notes.filter((item) => item.id !== note.id);
  state.notePendingDeleteId = null;
  state.selectedNoteId = null;
  persistNotes();
  ensureSelection();
  setAutosaveMessage("Note deleted");
  renderApp();
  elements.focusModeButton.focus();
}

function undoDelete() {
  if (!state.lastDeletedNote) {
    return;
  }

  state.notes.unshift(state.lastDeletedNote);
  state.selectedNoteId = state.lastDeletedNote.id;
  state.lastDeletedNote = null;
  persistNotes();
  renderApp();
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

function toggleFocusMode() {
  state.isFocusMode = !state.isFocusMode;
  state.isCalendarOpen = false;
  state.isSettingsOpen = false;
  state.isShortcutHelpOpen = false;
  persistPreference(STORAGE_KEYS.focus, String(state.isFocusMode));
  renderApp();
}

function openShortcutHelp() {
  state.isCalendarOpen = false;
  state.isSettingsOpen = false;
  state.isShortcutHelpOpen = true;
  renderApp();
  elements.closeShortcutsButton.focus();
}

function closeShortcutHelp() {
  state.isShortcutHelpOpen = false;
  renderShortcutHelpModal();
  elements.focusModeButton.focus();
}

function dismissOnboarding() {
  markOnboardingSeen();
  renderEditor();
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

async function importNotes(event) {
  const [file] = event.target.files || [];
  if (!file) {
    return;
  }

  try {
    const text = await file.text();
    const parsed = JSON.parse(text);
    const importedNotes = normalizeImportedNotes(parsed);

    if (importedNotes.length === 0) {
      setAutosaveMessage("Import skipped: no valid notes found");
      renderEditor();
      return;
    }

    const existingIds = new Set(state.notes.map((note) => note.id));
    const mergedNotes = new Map(state.notes.map((note) => [note.id, note]));
    importedNotes.forEach((note) => {
      mergedNotes.set(note.id, note);
    });
    const replacedCount = importedNotes.filter((note) => existingIds.has(note.id)).length;
    const addedCount = importedNotes.length - replacedCount;

    state.pendingImport = {
      fileName: file.name,
      importedNotes,
      addedCount,
      replacedCount
    };
    renderImportConfirmModal();
    elements.confirmImportButton.focus();
  } catch (error) {
    console.error("Failed to import notes", error);
    setAutosaveMessage("Import failed: invalid JSON file");
    renderEditor();
  } finally {
    event.target.value = "";
  }
}

function confirmPendingImport() {
  if (!state.pendingImport) {
    return;
  }

  const mergedNotes = new Map(state.notes.map((note) => [note.id, note]));
  state.pendingImport.importedNotes.forEach((note) => {
    mergedNotes.set(note.id, note);
  });

  state.notes = Array.from(mergedNotes.values());
  sortNotesInPlace();
  state.selectedNoteId = state.pendingImport.importedNotes[0].id;
  persistNotes();
  markOnboardingSeen();
  setAutosaveMessage(
    `Import complete: ${state.pendingImport.addedCount} added, ${state.pendingImport.replacedCount} replaced`
  );
  state.pendingImport = null;
  renderApp();
}

function cancelPendingImport() {
  state.pendingImport = null;
  renderImportConfirmModal();
  elements.importButton.focus();
}

function handleKeyboardShortcuts(event) {
  const target = event.target;
  const isTyping = target instanceof HTMLElement && /INPUT|TEXTAREA|SELECT/.test(target.tagName);

  if (event.key === "Escape" && state.notePendingDeleteId) {
    closeDeleteModal();
    return;
  }

  if (event.key === "Escape" && state.pendingImport) {
    cancelPendingImport();
    return;
  }

  if (event.key === "Escape" && state.isCalendarOpen) {
    state.isCalendarOpen = false;
    renderCalendarPopover();
    elements.calendarTrigger.focus();
    return;
  }

  if (event.key === "Escape" && state.isSettingsOpen) {
    closeSettingsPopover();
    return;
  }

  if (event.key === "Escape" && state.isShortcutHelpOpen) {
    closeShortcutHelp();
    return;
  }

  if (state.notePendingDeleteId || state.isShortcutHelpOpen || state.pendingImport) {
    return;
  }

  if (!isTyping && event.key === "?") {
    event.preventDefault();
    openShortcutHelp();
    return;
  }

  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "f") {
    event.preventDefault();
    elements.searchInput.focus();
    elements.searchInput.select();
    return;
  }

  if ((event.metaKey || event.ctrlKey) && !event.shiftKey && !event.altKey && event.key === ".") {
    event.preventDefault();
    toggleFocusMode();
    return;
  }

  if ((event.metaKey || event.ctrlKey) && event.key === "Backspace") {
    event.preventDefault();
    clearFilters();
    return;
  }

  if (event.key === "Escape") {
    closeEditor();
    return;
  }

  if (!isTyping && !event.metaKey && !event.ctrlKey && !event.altKey && event.key.toLowerCase() === "n") {
    event.preventDefault();
    createNote();
    return;
  }

  if (!isTyping && !event.metaKey && !event.ctrlKey && !event.altKey && event.key.toLowerCase() === "j") {
    event.preventDefault();
    selectAdjacentVisibleNote(1);
    return;
  }

  if (!isTyping && !event.metaKey && !event.ctrlKey && !event.altKey && event.key.toLowerCase() === "k") {
    event.preventDefault();
    selectAdjacentVisibleNote(-1);
  }
}

function getVisibleNotes() {
  return state.notes.filter((note) => matchesSearch(note, state.searchQuery) && matchesSelectedDate(note, state.selectedDate));
}

function shouldShowOnboarding() {
  return state.notes.length === 0 && !state.hasSeenOnboarding;
}

function selectAdjacentVisibleNote(direction) {
  const visibleNotes = getVisibleNotes();
  if (visibleNotes.length === 0) {
    return;
  }

  const currentIndex = visibleNotes.findIndex((note) => note.id === state.selectedNoteId);
  if (currentIndex === -1) {
    state.selectedNoteId = direction > 0 ? visibleNotes[0].id : visibleNotes[visibleNotes.length - 1].id;
  } else {
    const nextIndex = Math.min(Math.max(currentIndex + direction, 0), visibleNotes.length - 1);
    state.selectedNoteId = visibleNotes[nextIndex].id;
  }

  renderApp();
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

function normalizeImportedNotes(parsed) {
  if (!Array.isArray(parsed)) {
    throw new Error("Imported JSON must be an array of notes");
  }

  return parsed
    .map((note) => ({
      id: String(note.id || createId()),
      title: String(note.title || ""),
      content: String(note.content || ""),
      tags: Array.isArray(note.tags) ? note.tags.map((tag) => String(tag).trim()).filter(Boolean) : [],
      createdAt: normalizeDate(note.createdAt),
      updatedAt: normalizeDate(note.updatedAt || note.createdAt)
    }))
    .filter((note) => note.title || note.content || note.tags.length);
}

function sortNotesInPlace() {
  const field = state.currentSort === "created" ? "createdAt" : "updatedAt";
  state.notes.sort((left, right) => new Date(right[field]) - new Date(left[field]));
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

function loadUiSettings() {
  const raw = localStorage.getItem(STORAGE_KEYS.uiSettings);
  if (!raw) {
    return { ...DEFAULT_UI_SETTINGS };
  }

  try {
    const parsed = JSON.parse(raw);
    return {
      showThemeControl: parsed.showThemeControl !== false,
      showViewControl: parsed.showViewControl !== false,
      showBrainRoadmap: parsed.showBrainRoadmap !== false
    };
  } catch (error) {
    console.error("Failed to parse UI settings", error);
    return { ...DEFAULT_UI_SETTINGS };
  }
}

function persistUiSettings() {
  localStorage.setItem(STORAGE_KEYS.uiSettings, JSON.stringify(state.uiSettings));
}

function markOnboardingSeen() {
  if (state.hasSeenOnboarding) {
    return;
  }
  state.hasSeenOnboarding = true;
  persistPreference(STORAGE_KEYS.onboarding, "true");
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
  state.isShortcutHelpOpen = false;
  state.isSettingsOpen = false;
  renderSettingsPopover();
  state.isCalendarOpen = !state.isCalendarOpen;
  renderCalendarPopover();
}

function toggleSettingsPopover() {
  state.isCalendarOpen = false;
  state.isShortcutHelpOpen = false;
  renderCalendarPopover();
  state.isSettingsOpen = !state.isSettingsOpen;
  renderSettingsPopover();
}

function closeSettingsPopover() {
  state.isSettingsOpen = false;
  renderSettingsPopover();
  elements.settingsButton.focus();
}

function updateUiSetting(key, value) {
  state.uiSettings[key] = value;
  persistUiSettings();
  renderApp();
}

function handleDocumentClick(event) {
  const target = event.target;

  if (state.isCalendarOpen && !elements.calendarPopover.contains(target) && !elements.calendarTrigger.contains(target)) {
    state.isCalendarOpen = false;
    renderCalendarPopover();
  }

  if (state.isSettingsOpen && !elements.settingsPopover.contains(target) && !elements.settingsButton.contains(target)) {
    state.isSettingsOpen = false;
    renderSettingsPopover();
  }
}

function formatCompactDate(dateKey) {
  return new Date(`${dateKey}T12:00:00`).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric"
  });
}
