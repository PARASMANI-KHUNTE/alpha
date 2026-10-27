# SRS Traceability Matrix

| Requirement ID | Description | Implementation Location | Verification Method | Actual Result | Status |
|---------------|-------------|--------------------------|-------------------|---------------|--------|
| FR-01 | Initialize 8-12 contacts with unique IDs, valid stages | alpha-app/src/data/contacts.ts, alpha-app/src/hooks/useContacts.ts | Unit/integration tests; code inspection | 10 contacts initialized with unique IDs (c-001..c-010), all have valid stages. Qualified empty initially. | PASS |
| FR-02 | Table/Board view switcher | alpha-app/src/components/ViewSwitcher.tsx, alpha-app/src/App.tsx | Tests: switches between views; inspection | Tablist with Table/Board, aria-selected states. Panel stays open on view switch. | PASS |
| FR-03 | Render table with specified columns | alpha-app/src/components/ContactsTable.tsx | Tests confirm headers; inspection | Columns: Name, Email, Company, Stage, Owner, Labels. Missing values show em-dash. Rows clickable/keyboard accessible. | PASS |
| FR-04 | Render board with 4 columns, empty state | alpha-app/src/components/ContactsBoard.tsx, alpha-app/src/components/BoardColumn.tsx | Tests confirm columns + empty message | All stages rendered, counts shown, empty state for Qualified with Inbox icon. | PASS |
| FR-05 | Contact details panel displays all fields | alpha-app/src/components/ContactDetailsPanel.tsx | Tests verify all fields | All 8 fields represented. Panel closable, view preserved. | PASS |
| FR-06 | Edit Stage and Notes from panel | alpha-app/src/components/ContactDetailsPanel.tsx | Tests for editing | Stage select restricted to STAGES, Notes textarea. Works from both views. | PASS |
| FR-07 | Save commits changes, syncs views | alpha-app/src/hooks/useContacts.ts, alpha-app/src/App.tsx | Tests show sync and saved indicator | Immutable updates by ID, no duplicates. Table/board sync immediately. | PASS |
| FR-08 | Cancel discards changes | alpha-app/src/hooks/useContacts.ts | Test confirms cancel reverts | Cancel resets draft from selectedContact; canonical data unchanged. | PASS |
| FR-09 | Close panel preserves view, handles dirty state | alpha-app/src/App.tsx, alpha-app/src/components/ContactDetailsPanel.tsx | Tests confirm view preserved, confirm dialog, Escape | View preserved. Confirm dialog when dirty. Escape closes. Focus restoration implemented. | PASS |
| FR-10 | Handle missing optional data | alpha-app/src/utils/contactHelpers.ts | Tests show em-dashes and 'No labels' | displayValue returns '—' for null/empty. Empty labels show 'No labels'. | PASS |
| FR-11 | Single source of truth | alpha-app/src/hooks/useContacts.ts | Architecture inspection + tests | Single contacts array, all views derive from it. Immutable updates by ID. | PASS |
| FR-12 | Keyboard focus and accessibility | Components | Code inspection | ARIA roles, keyboard handlers, focus management, labels present. | PASS |
| FR-13 | Narrower desktop usability | Tailwind classes | Code inspection | overflow-x-auto on table/board, responsive widths on panel. | PASS |
