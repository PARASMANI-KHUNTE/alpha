import pypandoc

content = r"""# Software Requirements Specification (SRS)
## Alpha Frontend Design Engineer Exercise — Contact Table & Board Prototype

**Document version:** 1.0  
**Status:** Implementation-ready specification  
**Product type:** Standalone frontend prototype  
**Target stack:** React, TypeScript, Vite, Tailwind CSS  
**Data strategy:** Fictional mock data + in-memory client state  
**Backend:** Not required

---

## 1. Purpose

This document defines the functional, visual, technical, and quality requirements for a contact-management prototype built as part of Alpha's Frontend Design Engineer evaluation.

The prototype represents a small team tracking business contacts in a spreadsheet-like database. Users can inspect the same contact records in two synchronized views:

1. **Table view** — optimized for scanning fields across records.
2. **Board view** — optimized for understanding contacts grouped by stage.

Users can open a record, edit its Stage and Notes fields, save or cancel the changes, and return to the view they were using. The exercise evaluates interface quality, interaction design, frontend implementation, robustness, and the reasoning behind design decisions.

This is a prototype, not a production CRM. It does not require authentication, a backend, remote APIs, or persistent database storage.

## 2. Scope

### 2.1 In scope

- React and TypeScript implementation.
- One shared dataset containing 8–12 fictional contacts.
- Eight specified contact fields.
- Table and board views that render the same records.
- A Table / Board view switch.
- A record details panel.
- Stage and Notes editing through the details panel.
- Explicit Save and Cancel actions.
- Synchronization between views after a successful save.
- An intentionally empty board stage.
- Missing optional information.
- Preservation of the active view when the details panel closes.
- Usable narrower desktop layouts and keyboard focus behavior.
- Runnable project instructions and a short README.
- Design rationale, accepted trade-offs, and future improvements.
- Verification of important interaction and state edge cases.

### 2.2 Out of scope

Unless time remains after all required functionality is complete, do not implement:

- Authentication, user accounts, permissions, or team invitations.
- Backend services, database, server APIs, or remote persistence.
- Real business or personal contact information.
- Create, delete, import, or bulk-edit workflows.
- Drag-and-drop between board columns.
- Additional views, analytics, dashboards, or reporting.
- Complex search, filtering, sorting, or pagination.
- Rich-text or document-style Notes; Notes is a plain text field.
- Real-time collaboration or multi-user conflict resolution.
- Extensive animation or elaborate visual effects.

### 2.3 Success criteria

The submission is successful when a reviewer can run the application, inspect the same contacts in both views, edit Stage and Notes, save or cancel safely, switch views without data divergence, and understand the design and implementation choices from the README.

## 3. Users and primary use cases

### 3.1 Intended user

A team member who needs to scan business contacts, understand their current relationship stage, and update a contact's stage or notes.

### 3.2 Primary use cases

1. Scan contact information in the table.
2. Switch to the board to compare contacts by stage.
3. Open a contact from either view.
4. Review all fields in a details panel.
5. change Stage and/or Notes.
6. Save the draft and see the updated record in both views.
7. Cancel a draft and retain the original values.
8. Close the panel and return to the same view.
9. Inspect a record with missing optional information.
10. See an empty board column without a broken or confusing layout.

## 4. Domain model and data requirements

### 4.1 Contact fields

Every contact must have the following fields:

| Field | Type | Required? | Description |
|---|---|---:|---|
| `id` | string | Yes | Stable unique identifier used internally; not a visible business field. |
| `name` | string | Yes | Contact's full display name. |
| `email` | string or `null` | No | Email address. Render a clear placeholder when absent. |
| `company` | string or `null` | No | Company or organization. |
| `role` | string or `null` | No | Job title or role. |
| `owner` | string or `null` | No | Team member responsible for the contact. |
| `labels` | string array | Yes | Zero or more descriptive labels. |
| `stage` | enum | Yes | Exactly one of the four supported stages. |
| `notes` | string | Yes | Plain-text notes; may be an empty string. |

The `id` field is an implementation requirement to support stable identity and updates. It is not an additional user-facing contact field.

### 4.2 Supported stages

The allowed stage values are:

- `Lead`
- `Prospect`
- `Qualified`
- `Customer`

Each contact has exactly one stage. Do not infer a stage from a label or duplicate a contact across board columns.

### 4.3 Dataset

- Seed between 8 and 12 fictional contacts; the recommended count is **10**.
- Use plausible but clearly fictional names, companies, roles, and email addresses.
- Use reserved example domains such as `example.com` for email addresses.
- Distribute contacts across Lead, Prospect, and Customer.
- Leave **Qualified** empty in the initial dataset so the empty-column state can be evaluated. Alternatively, another stage may be empty if the initial design explains the choice.
- Include at least two records with missing optional information, such as no email, no role, no company, or no owner.
- Include contacts with multiple labels and at least one contact with no labels.
- Include notes of different lengths, including an empty note.
- Do not create separate datasets for table and board.

### 4.4 Example TypeScript model

```ts
export type ContactStage =
  | "Lead"
  | "Prospect"
  | "Qualified"
  | "Customer";

export interface Contact {
  id: string;
  name: string;
  email: string | null;
  company: string | null;
  role: string | null;
  owner: string | null;
  labels: string[];
  stage: ContactStage;
  notes: string;
}
```

The mock data should live in one module and be imported into the application's initial state.

## 5. Functional requirements

Priority labels: **P0** = mandatory; **P1** = important quality requirement; **P2** = optional enhancement.

### FR-01 — Initialize contacts (P0)

**Requirement:** On application startup, initialize one canonical collection of 8–12 fictional contacts.

**Acceptance criteria:**
- The application starts with 8–12 unique contacts.
- Every contact has a stable, unique `id`.
- Every contact has a valid stage.
- Optional fields may be `null`; labels may be empty; notes may be empty.
- The initial records are identical regardless of which view is opened first.

### FR-02 — Switch between views (P0)

**Requirement:** Provide a clear Table / Board switch.

**Acceptance criteria:**
- Both view options are visible and distinguishable.
- Selecting Table displays the table.
- Selecting Board displays the board.
- Switching views does not reset or duplicate contact data.
- Switching views while the details panel is open must have a deliberate, consistent behavior. Recommended behavior: keep the selected contact and panel open while changing the underlying view; if that adds unnecessary complexity, disable or hide the view switch while the panel is open and document the decision.
- When the panel is closed, the user returns to the currently selected view.

### FR-03 — Render the table (P0)

**Requirement:** Display contacts as rows and contact properties as columns.

**Recommended visible columns:**
- Name
- Email
- Company
- Stage
- Owner
- Labels

Role and Notes can be shown in the details panel to keep the table compact. It is acceptable to adjust the columns if scanability improves.

**Acceptance criteria:**
- Each contact appears exactly once.
- Column headings are clear and aligned with their data.
- Long values do not break the table layout.
- Missing values display a neutral placeholder such as an em dash (`—`), not `undefined`, `null`, or a blank layout gap.
- Stage is represented consistently with the board and details panel.
- Clicking a row or an obvious row action opens that contact's details panel.
- Interactive elements inside a row do not accidentally trigger conflicting row actions.

### FR-04 — Render the board (P0)

**Requirement:** Display the same contacts in four stage columns.

**Acceptance criteria:**
- Columns exist for Lead, Prospect, Qualified, and Customer.
- Each contact appears in exactly one column matching its current stage.
- Each column displays its stage title and a contact count.
- An empty stage displays a purposeful empty state, not a broken or missing column.
- Cards show enough information for scanning, recommended: name, company, role or email, and labels.
- Missing values use the same neutral placeholder policy as the table.
- Clicking a card opens the selected contact's details panel.
- A saved stage change moves the card to the appropriate column without a page reload.

### FR-05 — Display contact details (P0)

**Requirement:** Opening a row or card displays a details panel for that record.

**Acceptance criteria:**
- The panel identifies the selected contact.
- All eight user-facing fields are represented: Name, Email, Company, Role, Owner, Labels, Stage, and Notes.
- The internal `id` does not need to be shown.
- Missing optional values are presented clearly.
- The panel can be closed using a visible close control.
- Closing the panel preserves the selected Table or Board view.
- Opening another record loads that record's values, not the previous record's draft.

### FR-06 — Edit Stage and Notes (P0)

**Requirement:** Users can edit Stage and Notes from the details panel, regardless of whether they opened it from the table or board.

**Acceptance criteria:**
- Stage uses a control restricted to the four valid stage values.
- Notes uses a plain-text input or textarea.
- The user can change either field independently or both together.
- The panel makes editability and unsaved state understandable.
- Fields not included in the requested editing scope remain read-only.
- The same editing workflow works when the panel was opened from either view.

### FR-07 — Save changes (P0)

**Requirement:** Save commits the draft Stage and Notes values to the canonical contact collection.

**Acceptance criteria:**
- A visible Save action is provided.
- Save updates the contact identified by its stable `id`; it must not append a duplicate contact.
- The table and board reflect the saved values immediately.
- If Stage changes, the board card moves to the correct column and the table's Stage value updates.
- If Notes changes, reopening the contact shows the saved Notes value.
- Saving one contact does not alter other contacts.
- The application provides a clear saved-state signal, or otherwise makes the completed action unambiguous.
- Save behavior remains correct after repeated edits and view switches.

### FR-08 — Cancel changes (P0)

**Requirement:** Cancel discards the current draft without modifying canonical data.

**Acceptance criteria:**
- A visible Cancel action is provided while editing.
- Cancel restores the form to the latest saved values.
- A cancelled stage change does not move the card.
- A cancelled notes change does not appear when the record is reopened.
- Cancel does not create a new record or modify another record.
- After cancelling, the user can start a new edit normally.

### FR-09 — Close panel and return to context (P0)

**Requirement:** Closing the details panel returns the user to the view they were using.

**Acceptance criteria:**
- Closing from Table returns to Table.
- Closing from Board returns to Board.
- The current view does not unexpectedly reset to the default.
- A consistent policy exists for closing with unsaved changes. Recommended for this small exercise: if the draft is dirty, ask for confirmation before discarding it; alternatively, keep the panel open until Save or Cancel. Do not silently discard edits without a clear policy.
- The panel does not leave keyboard focus lost or trapped.

### FR-10 — Handle missing optional data (P0)

**Requirement:** Missing optional information must not break the interface.

**Acceptance criteria:**
- Missing email, company, role, or owner renders a consistent placeholder.
- Empty labels display a neutral indication such as “No labels”.
- Empty notes render as an empty editable textarea or a clear empty state.
- Missing values do not cause crashes, invalid links, or malformed layout.
- The UI distinguishes genuinely absent data from a loading or error state.

### FR-11 — Maintain a single source of truth (P0)

**Requirement:** Table and board must derive from the same canonical collection.

**Acceptance criteria:**
- There is one authoritative contacts state.
- The table and board do not keep independently editable copies of the dataset.
- Stage and Notes changes are committed through one shared update function or equivalent state action.
- The UI derives each board column by filtering the canonical collection by `stage`.
- Stable contact IDs are used for React keys and updates.
- Repeated switching and editing does not produce duplicate, stale, or lost records.

### FR-12 — Keyboard focus and basic accessibility (P1)

**Requirement:** Core workflows must be usable with a keyboard.

**Acceptance criteria:**
- View-switch controls are keyboard operable and expose their selected state.
- Rows/cards that open a panel are keyboard accessible; use buttons or equivalent semantics rather than click-only noninteractive elements.
- Inputs have visible labels.
- Focus indicators are visible.
- Opening the panel moves focus to a logical location, usually the panel heading or first editable control.
- Closing the panel returns focus to the row/card or control that opened it, when practical.
- Escape behavior is consistent and does not silently discard a dirty draft.
- Text and controls have adequate contrast.

### FR-13 — Narrower desktop usability (P1)

**Requirement:** The interface remains usable on a narrower desktop viewport.

**Acceptance criteria:**
- The page does not develop unintended horizontal overflow at common laptop widths.
- The table may use a contained horizontal scroller if all columns cannot fit.
- Board columns can scroll horizontally or adapt their widths without collapsing card content.
- The details panel fits within the viewport and remains usable.
- Core actions remain visible and reachable.
- No core interaction depends on hover alone.

### FR-14 — Optional enhancements (P2)

Only implement after all P0 requirements are complete:
- Search contacts.
- Filter by stage or label.
- Sort the table.
- Drag-and-drop between board columns.
- Lightweight transitions.
- Persisting mock edits across reloads with local storage.

If local storage is added, keep it simple and document that it is browser-local, not backend persistence.

## 6. Interaction and state specification

### 6.1 Core state

Recommended state model:

```ts
type ViewMode = "table" | "board";

interface AppState {
  contacts: Contact[];
  activeView: ViewMode;
  selectedContactId: string | null;
  isDetailsOpen: boolean;
  draft: {
    stage: ContactStage;
    notes: string;
  } | null;
}
```

This is illustrative, not a requirement to place every value in one state object. State may be split across components or a custom hook, provided there is one source of truth and behavior remains consistent.

### 6.2 State ownership

- `contacts`: canonical saved data, owned by the app-level state or shared hook.
- `activeView`: current table/board selection.
- `selectedContactId`: identity of the open record.
- `draft`: editable Stage and Notes values for the selected contact.
- `isDetailsOpen`: whether the panel is visible; it may be inferred from `selectedContactId` if the implementation is simpler.
- Derived data, such as board columns and counts, should be calculated from `contacts` rather than stored separately.

### 6.3 Open record

1. User activates a row or card.
2. Store the contact's `id` as the selected ID.
3. Initialize the draft from the latest saved Stage and Notes.
4. Open the details panel.
5. Place keyboard focus at a logical panel target.

### 6.4 Edit record

1. User changes Stage or Notes.
2. Update only the draft values.
3. Keep canonical contacts unchanged until Save.
4. Enable or visually emphasize Save when the draft differs from saved values, if practical.
5. Keep Cancel available while a draft is active.

### 6.5 Save record

1. Locate the canonical contact by `selectedContactId`.
2. Replace only that contact's `stage` and `notes` values using an immutable state update.
3. Clear or reset the draft to the newly saved values.
4. Keep the panel open or close it; recommended: keep it open and show a concise saved confirmation.
5. Both views re-render from the same canonical data.
6. If the panel closes, restore focus to the originating row/card when possible.

### 6.6 Cancel record

1. Discard the draft.
2. Reinitialize from canonical saved values or clear the draft.
3. Do not update the contacts array.
4. Keep the panel open in read-only mode or close it, as long as the behavior is obvious and consistent.
5. Allow the user to begin editing again.

### 6.7 Close panel

1. If no unsaved changes exist, close the panel.
2. If unsaved changes exist, follow the documented dirty-draft policy.
3. Clear transient selection/draft state as appropriate.
4. Keep `activeView` unchanged.
5. Return focus to the triggering element if practical.

### 6.8 Invariants

These rules must always hold:

- Every `id` is unique.
- Every contact has exactly one valid stage.
- A contact appears once in the table and once across the board's combined columns.
- Draft changes are not visible as saved changes in the other view until Save.
- Cancel leaves canonical data unchanged.
- A save updates only the selected record's editable fields.
- View switching never initializes a second dataset.
- Empty columns remain visible.
- Missing optional values never break rendering.

## 7. UX and visual design requirements

### 7.1 Design direction

Use a calm, light, database-oriented interface inspired by the clarity and scanability of tools such as Notion, without copying their exact visual design. Aim for a professional, restrained, high-quality frontend exercise rather than a generic admin dashboard.

Recommended direction:
- Warm off-white or white page background.
- Dark neutral text with muted secondary text.
- Fine borders and subtle surface separation.
- One restrained accent color for active controls and focus.
- Small stage badges with readable text.
- Consistent spacing scale and typography.
- Minimal shadows; avoid excessive gradients, glassmorphism, and oversized dashboard cards.

### 7.2 Page hierarchy

Recommended layout:
1. Application/page title: “Contacts”.
2. Small supporting description or record count.
3. View switcher aligned near the page title or toolbar.
4. Main table or board.
5. Details panel presented as a side panel or accessible overlay.

Avoid adding decorative metrics or unrelated dashboard elements that compete with the required workflow.

### 7.3 Table design

- Keep rows compact enough to scan multiple contacts.
- Make the name the strongest text element in each row.
- Use secondary text for less important fields.
- Keep stage badges visually consistent with board column labels.
- Use stable row heights where practical.
- Provide subtle hover and focus states.
- Use a contained horizontal scroll region when needed, rather than allowing the entire page to overflow.

### 7.4 Board design

- Use four visually distinct but stylistically consistent columns.
- Show a count next to each stage title.
- Keep cards compact and consistent.
- Put the contact name first, followed by company/role and labels.
- Keep the empty column's title, count, and empty state visible.
- Do not rely on color alone to communicate stage; include the stage name.

### 7.5 Details panel

- Clearly identify the contact.
- Group fields in a logical order.
- Distinguish read-only values from editable Stage and Notes controls.
- Put Save and Cancel together in a predictable action area.
- Keep the panel within the viewport at narrower desktop sizes.
- Use a clear close control with an accessible label.
- If the panel is an overlay, consider Escape handling and focus return.

### 7.6 Responsive behavior

Desktop is the primary target, but the interface must work on narrower laptop windows. At minimum:
- Table overflow is contained.
- Board supports horizontal scrolling or sensible column sizing.
- Panel width adapts to available space.
- Header controls wrap or reposition cleanly.
- Buttons and inputs remain usable without hover.

## 8. Technical architecture

### 8.1 Proposed stack

| Layer | Choice | Rationale |
|---|---|---|
| UI framework | React | Component-based UI and state-driven rendering. |
| Language | TypeScript | Safer contact/stage types and clearer component contracts. |
| Build tooling | Vite | Fast setup and simple production build. |
| Styling | Tailwind CSS | Fast, consistent styling within the time budget. |
| State | React `useState` and/or a small custom hook | No global state library is needed for this scope. |
| Data | Local TypeScript mock file | No API or backend required. |
| Tests | Vitest + React Testing Library, if time permits | Focus on save/cancel and shared-view consistency. |
| Deployment | Any static hosting provider, optional | Enables a convenient live preview. |

Do not add a state-management library, UI framework, or complex abstraction unless it solves a real problem in this small application.

### 8.2 Suggested project structure

```text
alpha-contacts-prototype/
├── public/
├── src/
│   ├── components/
│   │   ├── AppHeader.tsx
│   │   ├── ViewSwitcher.tsx
│   │   ├── ContactsTable.tsx
│   │   ├── ContactsBoard.tsx
│   │   ├── BoardColumn.tsx
│   │   ├── ContactCard.tsx
│   │   ├── StageBadge.tsx
│   │   └── ContactDetailsPanel.tsx
│   ├── data/
│   │   └── contacts.ts
│   ├── hooks/
│   │   └── useContacts.ts
│   ├── types/
│   │   └── contact.ts
│   ├── utils/
│   │   └── contactHelpers.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── tests/                 # Optional
├── README.md
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.ts     # Depending on Tailwind version/setup
```

The structure is a suggestion. Keep it proportionate to the exercise; avoid creating many tiny files that add navigation overhead without improving clarity.

### 8.3 Component responsibilities

| Component | Responsibility |
|---|---|
| `App` | Own or connect shared state; compose the page and current view. |
| `AppHeader` | Page title, short description, record count if useful. |
| `ViewSwitcher` | Change between Table and Board and expose active state. |
| `ContactsTable` | Render table headings and canonical contact rows. |
| `ContactsBoard` | Derive and render stage columns from the canonical contacts. |
| `BoardColumn` | Render a stage heading, count, cards, and empty state. |
| `ContactCard` | Render compact contact information and open the details panel. |
| `StageBadge` | Render a consistent stage label. |
| `ContactDetailsPanel` | Show contact details and manage the Stage/Notes draft. |
| `useContacts` | Optional hook encapsulating canonical contacts and update actions. |
| `contactHelpers` | Optional pure helpers for formatting missing values or grouping by stage. |

### 8.4 State update pattern

Use immutable updates. Example:

```ts
function updateContact(
  id: string,
  changes: Pick<Contact, "stage" | "notes">
) {
  setContacts(current =>
    current.map(contact =>
      contact.id === id
        ? { ...contact, ...changes }
        : contact
    )
  );
}
```

The actual implementation should ensure that `changes` contains the current draft values and that the selected ID exists before committing. Avoid mutating a contact object or maintaining a separate board dataset.

### 8.5 Data derivation

- Table rows derive directly from `contacts`.
- Board columns derive by filtering `contacts` by `stage`.
- Stage counts derive from the same collection.
- Contact details derive from the selected contact ID.
- Do not keep separately editable counts or per-column arrays in state.

## 9. Non-functional requirements

### NFR-01 — Maintainability

- Use descriptive component and variable names.
- Define the Contact and ContactStage types centrally.
- Keep components focused on a clear responsibility.
- Avoid duplicated save logic between Table and Board.
- Avoid unnecessary `any` types.

### NFR-02 — Reliability

- Repeated saves and cancellations must not duplicate records.
- View switches must not lose committed data.
- Cancelled drafts must not leak into the canonical state.
- Missing optional data must not cause runtime errors.
- Stable IDs must be used instead of array indexes as record keys.

### NFR-03 — Performance

- The application should feel immediate with 8–12 contacts.
- No elaborate optimization or virtualization is necessary.
- Avoid unnecessary effects or complex derived state.
- View changes and saves should not require a full-page reload.

### NFR-04 — Accessibility

- Use semantic buttons, labels, and form controls.
- Ensure keyboard access to primary interactions.
- Show visible focus states.
- Use adequate contrast.
- Do not communicate status only through color.
- Give icon-only controls accessible names.
- Manage focus sensibly when opening and closing the details panel.

### NFR-05 — Compatibility

- Target a modern desktop browser.
- Test at a standard desktop width and a narrower laptop width.
- No mobile-first optimization is required, but severe layout breakage should be avoided.

### NFR-06 — Data and privacy

- Use fictional data only.
- Do not collect, transmit, or store personal data remotely.
- No credentials, secrets, or API keys should be required.
- State clearly in the README that data is local and in-memory unless optional local storage is added.

### NFR-07 — Delivery

- The repository must include all source files and dependency manifests needed to run the project.
- Setup instructions must be clear and accurate.
- The production build must complete successfully.
- A live preview is optional, not a substitute for runnable source code.

## 10. Error and edge-state handling

| Situation | Expected behavior |
|---|---|
| Email missing | Display `—`; do not render a broken mail link. |
| Company missing | Display `—` or a concise neutral placeholder. |
| Role/owner missing | Display `—` in the table or details panel. |
| No labels | Show “No labels” or a restrained empty state. |
| Notes empty | Show an empty textarea and allow typing. |
| Board column empty | Keep the column visible with a short message such as “No contacts in this stage”. |
| Save with no changes | Do not corrupt data; optionally disable Save. |
| Cancel after edits | Restore the last saved values. |
| Open a different contact | Load that contact's own saved values into the draft. |
| Close with dirty draft | Confirm discard or require explicit Save/Cancel; never silently lose edits. |
| Repeated stage changes | Update the same record each time; never duplicate it. |
| Invalid stage value | Prevent it through TypeScript and the stage control. |
| Selected contact unavailable | Close/reset the panel safely rather than rendering stale details. |

## 11. Testing and verification plan

The following manual checks are mandatory even if automated tests are not implemented.

### 11.1 Core workflow tests

- [ ] Start the application and confirm 8–12 contacts appear.
- [ ] Open Table and verify the expected columns.
- [ ] Switch to Board and verify four stage columns.
- [ ] Confirm each contact appears once in the table and exactly once across the board.
- [ ] Open a contact from the table.
- [ ] Open a contact from the board.
- [ ] Verify all eight fields appear in the details panel.
- [ ] Change Stage, save, and verify the table and board update.
- [ ] Change Notes, save, close, reopen, and verify the saved note.
- [ ] Change Stage and Notes, cancel, and verify neither value changed.
- [ ] Repeat save/cancel cycles on the same contact.
- [ ] Switch views after saving and verify changes remain.
- [ ] Close the panel and confirm the prior view is preserved.

### 11.2 Edge-case tests

- [ ] Inspect a contact with missing email.
- [ ] Inspect a contact with missing company, role, or owner.
- [ ] Inspect a contact with no labels.
- [ ] Inspect a contact with empty Notes.
- [ ] Verify the empty board column remains visible.
- [ ] Try to close the panel with unsaved changes and verify the documented policy.
- [ ] Open a second record after editing a first record and verify drafts do not mix.
- [ ] Verify long names, emails, labels, and notes do not break the layout.
- [ ] Verify focus indicators and keyboard operation.
- [ ] Test a narrower desktop viewport.

### 11.3 Build and repository checks

- [ ] Install dependencies using the documented command.
- [ ] Run the development server.
- [ ] Run linting and tests if configured.
- [ ] Run the production build.
- [ ] Check the browser console for errors and warnings.
- [ ] Confirm the README matches the actual scripts and setup.
- [ ] Remove unused dependencies, debug logs, and unfinished placeholder UI.

### 11.4 Optional automated test cases

If time permits, automate the highest-risk behaviors:
1. Saving a new stage updates the visible board grouping.
2. Saving Notes persists when the record is reopened.
3. Cancel leaves the original Stage and Notes unchanged.
4. View switching preserves the canonical contacts.
5. Missing optional fields render without throwing.
6. Closing the panel preserves the active view.

## 12. Delivery and submission requirements

### 12.1 Required deliverables

1. **Runnable source code** for the React + TypeScript application.
2. **README.md** with setup/run instructions and a concise explanation of the solution.
3. **Design notes** describing visual decisions, interaction behavior, trade-offs, unfinished work, and potential next steps.
4. **Working local build** that can be run by the evaluator.

### 12.2 Optional deliverables

- Live deployed preview link.
- A few screenshots or a short demo recording.
- Figma frames or sketches.

These are optional supporting materials; the working implementation is the primary deliverable.

### 12.3 Recommended README sections

- Project title and one-paragraph summary.
- Features implemented.
- Technology stack.
- Prerequisites.
- Installation instructions.
- Development command.
- Production build command.
- Test/lint commands, if configured.
- Design choices and interaction model.
- State-management approach.
- Trade-offs and intentionally unfinished items.
- What would be improved next.
- Live preview link, if deployed.

### 12.4 Submission channel and deadline

The supplied exercise brief does **not** specify an exact deadline, a submission portal, or a required delivery channel. Confirm those details with the recruiter. A Git repository link plus a live preview is a reasonable proposed format, but it should not be treated as a confirmed requirement.

## 13. Time and scope management

The brief suggests approximately 3–4 hours. Prioritize the required interaction flow and stable state model over optional features.

### Suggested schedule

| Time | Work |
|---|---|
| 0:00–0:30 | Scaffold app, define types, seed data, establish visual tokens. |
| 0:30–1:15 | Build table, view switcher, and contact row interactions. |
| 1:15–2:00 | Build board columns/cards and empty-state handling. |
| 2:00–2:45 | Build details panel, draft state, Save, Cancel, close behavior. |
| 2:45–3:15 | Verify synchronization, missing data, focus, and narrow layout. |
| 3:15–3:45 | Run build, write README, document trade-offs, final review. |

If time is short, defer search, filters, drag-and-drop, animation, local-storage persistence, and automated test setup before compromising the core requirements.

## 14. Risks and mitigations

| Risk | Mitigation |
|---|---|
| Table and board drift out of sync | Use one canonical contact collection and derive both views from it. |
| Cancel accidentally commits edits | Keep a separate draft and commit only on Save. |
| View resets after closing the panel | Store active view independently from panel visibility. |
| Duplicate contacts after repeated saves | Update by stable ID instead of appending. |
| Empty board column appears broken | Render all four columns and provide an explicit empty state. |
| Missing data harms visual polish | Normalize optional values at render time and use a consistent placeholder. |
| Scope expands beyond the time limit | Finish all P0 requirements before optional features. |
| Submission is delayed by tooling/deployment | Ensure the local app and README are complete first; deployment is optional. |

## 15. Design trade-offs and future improvements

### 15.1 Recommended trade-offs for this exercise

- **In-memory state instead of a backend:** appropriate for the brief and keeps the implementation focused. Data resets on refresh unless optional local storage is added.
- **Shared details panel:** avoids duplicated editing logic and ensures the same workflow from both views.
- **No drag-and-drop initially:** stage changes through the details panel satisfy the required workflow with less interaction complexity.
- **Limited table columns:** preserves scanability; the details panel contains all fields.
- **One empty stage:** makes the board's empty state explicit and testable.
- **Small component architecture:** keeps the code readable without overengineering a 3–4 hour prototype.

### 15.2 Possible future improvements

If this were extended beyond the evaluation:
- Add search, filters, sorting, and saved view preferences.
- Add keyboard shortcuts and more complete focus trapping for the panel.
- Add drag-and-drop with accessible alternative controls.
- Add automated component and interaction tests.
- Persist records through an API and database.
- Add loading, failure, and optimistic-update states for remote operations.
- Add schema validation and explicit error feedback.
- Support create/delete flows and undo.
- Add responsive mobile layouts.
- Add design tokens and visual regression checks.

## 16. Definition of done

The prototype is ready to submit when all of the following are true:

- [ ] All P0 functional requirements are implemented.
- [ ] One shared dataset powers both views.
- [ ] Table and board render the same contacts consistently.
- [ ] Stage and Notes can be edited and saved from either entry point.
- [ ] Cancel discards changes.
- [ ] Closing the panel preserves the current view.
- [ ] Empty-stage and missing-information states are handled.
- [ ] Keyboard focus and narrower desktop behavior are usable.
- [ ] No duplicate/stale records appear after repeated edits or view switches.
- [ ] The app runs locally from the README instructions.
- [ ] The production build succeeds.
- [ ] The README explains design choices, trade-offs, and unfinished work.
- [ ] The submission deadline and channel have been confirmed with the recruiter.

---

## Appendix A — Implementation decision summary

**Recommended product shape:** a single “Contacts” page with a compact header, Table / Board switch, one main view at a time, and a reusable details panel.

**Recommended state flow:**  
`Mock data → canonical contacts state → Table / Board derived views → selected contact draft → Save commits / Cancel discards`.

**Core principle:** the interface must never maintain independent saved datasets for the table and board. All visible views must reflect the same canonical contacts state.

**Submission note:** this SRS is an implementation plan based on the supplied exercise brief. It does not imply that Alpha has specified a deadline or submission channel beyond the details in that brief.
"""

output_path = "/mnt/data/alpha_contact_table_board_SRS.md"
pypandoc.convert_text(content, "md", format="md", outputfile=output_path, extra_args=["--standalone"])
print(f"Created: {output_path}")
print(f"Characters: {len(content):,}")
