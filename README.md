# Alpha Contact Table & Board Prototype

A high-polish, responsive contact management prototype built for the Alpha Frontend Design Engineer evaluation exercise. This application allows small teams to track, scan, and update business contacts across two synchronized visual representations: an information-dense **Table View** and an intuitive stage-grouped **Board View**, backed by a slide-over **Contact Details Panel** with draft isolation, save/cancel mechanics, and keyboard accessibility.

---

## 🌟 Key Features Implemented

1. **Dual Synchronized Views**:
   - **Table View**: Information-dense spreadsheet format optimized for scanning records across 8 specified fields (Name, Email, Company, Stage, Owner, Labels).
   - **Board View**: Kanban-style stage board grouping contacts across the four workflow stages (`Lead`, `Prospect`, `Qualified`, `Customer`).
   - **View Switcher**: Accessible tablist control toggling views smoothly while preserving data state and panel status.
2. **Contact Details Slide-over Panel**:
   - Displays all 8 contact fields with clean typography and layout hierarchy.
   - **Editable Fields**: `Stage` (dropdown) and `Notes` (multi-line plain textarea).
   - **Read-Only Fields**: Name, Email, Company, Role, Owner, Labels with formatted tags or badges.
   - **Draft Isolation Pattern**: Edits are held in a separate draft state and do not mutate canonical data until explicitly saved.
   - **Explicit Save & Cancel**: Save button updates canonical data across views; Cancel button reverts draft to original values.
   - **Dirty State Tracking**: Save and Cancel buttons are disabled when no changes exist; dirty warning prompt when attempting to close with unsaved edits.
   - **Feedback & Transitions**: Ephemeral "Saved" confirmation checkmark when save succeeds.
3. **Empty Stage & Missing Data Handling**:
   - **Intentionally Empty Stage**: The `Qualified` column begins with 0 contacts and renders an explicit empty-state inbox card with helpful messaging.
   - Moving any contact into `Qualified` dynamically populates the column and hides the empty state.
   - **Missing Information**: Missing optional values (email, company, role, owner) render consistent em-dash placeholders (`—`), and empty label lists render `"No labels"`.
4. **Accessibility & Keyboard Usability**:
   - Semantic HTML with ARIA roles (`role="tablist"`, `role="tab"`, `role="dialog"`, `aria-label`).
   - Accessible keyboard activation: Rows and cards open details panel on `Enter` or `Space`.
   - `Escape` key closes the details panel.
   - Focus management: Preserves and restores focus to the triggering element when the panel closes.
5. **Quality Assurance**:
   - 21 automated unit and integration tests with Vitest and React Testing Library.
   - Zero lint errors (`eslint .`) and zero TypeScript compiler errors (`tsc -b`).

---

## 🛠️ Technology Stack

- **Framework**: React 19 + TypeScript (~5.8)
- **Bundler & Dev Server**: Vite 6
- **Styling**: Tailwind CSS v4 with bespoke neutral design tokens (stone palette, subtle shadows, rounded borders)
- **Icons**: Lucide React
- **Testing**: Vitest 5 + React Testing Library + `@testing-library/jest-dom` + `@testing-library/user-event`

---

## 🚀 Quick Start

### Installation

```bash
cd alpha-app
npm install
```

### Running the Development Server

```bash
npm run dev
```

Open `http://localhost:5173/` in your web browser.

### Running Automated Tests

```bash
npm run test
```

### Production Build & Lint

```bash
npm run build
npm run lint
```

---

## 📐 Design Choices & Interaction Model

- **Information Hierarchy**: The table view prioritizes quick scanning by showing the most actionable contact identifiers (Name, Email, Company, Stage, Owner, Labels). The board view prioritizes pipeline velocity, displaying stage distributions at a glance.
- **Single Slide-over Panel**: Rather than inline editing or modal dialogs, a slide-over panel provides maximum editing focus without losing the user's spatial context in the active view.
- **Visual Design System**: Built with an editorial stone color palette (`bg-stone-50`, `border-stone-200`, `text-stone-900`) combined with semantic stage badges (`Lead` = warm amber, `Prospect` = blue, `Qualified` = violet, `Customer` = emerald).

---

## 🧠 State-Management Approach

- **Single Source of Truth**: All contacts live in a single canonical collection in client memory managed by `useContacts`.
- **Derived Views**: Both the table and board views are pure derived projections of the canonical contacts list (`groupByStage(contacts)`). Any save to a contact instantly reflects in both views without data divergence or duplication.
- **Draft Isolation Pattern**:
  ```
  Canonical Contact List -> Selected Contact -> Draft State (isolated)
                                                      │
                            ┌─────────────────────────┴────────────────────────┐
                            ▼                                                  ▼
                         [Save]                                             [Cancel]
               Commits draft to canonical list                     Reverts draft to canonical
               (Triggers reactive update across views)             (Leaves canonical untouched)
  ```
- **Active View Independence**: Active view (`table` | `board`) is stored independently from panel open state. Closing the details panel returns the user precisely to the view they were using.

---

## ⚖️ Trade-offs and Intentional Scoping

1. **In-Memory State**: Fictional seed data is maintained in client-side state without external database persistence or backend server calls, matching the prototype requirements of the brief.
2. **No Drag-and-Drop**: As per SRS Section 2.2 and 15.1, drag-and-drop was left out of scope in favor of robust, accessible stage updating via the details panel.
3. **Limited Table Columns**: The table view shows 6 core columns; the details panel exposes all 8 fields to prevent horizontal clutter while maintaining full data access.

---

## 🔮 Future Improvements

If extending beyond the evaluation prototype:
- **Search & Multi-field Filtering**: Instant full-text search across name/email/company and multi-stage filter chips.
- **Drag-and-Drop Board Interactions**: Accessible drag-and-drop between Kanban columns with keyboard alternatives.
- **Persistent Storage**: Backend API integration with optimistic UI updates and local storage fallback.
- **Undo / Activity Log**: Historical audit trail of contact stage transitions and notes edits.
