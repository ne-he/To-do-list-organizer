# Requirements Document

## Introduction

A standalone daily dashboard web application built with HTML, CSS, and Vanilla JavaScript. The application helps users organize their day by combining a time-aware greeting, a Pomodoro focus timer, a persistent to-do list, and a quick links manager — all stored in the browser's Local Storage with no backend required.

## Glossary

- **Dashboard**: The single-page web application rendered by `index.html`
- **Greeting_Widget**: The UI component that displays the current time, date, and a time-of-day greeting
- **Focus_Timer**: The Pomodoro countdown timer component (25-minute sessions)
- **Todo_List**: The task management component that supports add, edit, complete, and delete operations
- **Quick_Links**: The component that stores and displays user-defined favorite website shortcuts
- **Local_Storage**: The browser's `localStorage` API used for all data persistence
- **Task**: A single to-do item with a text label and a completion state
- **Link**: A user-defined record containing a display label and a URL
- **Theme**: The visual color scheme of the Dashboard, either light or dark
- **User_Name**: An optional custom name stored in Local Storage and shown in the greeting

---

## Requirements

### Requirement 1: Time and Date Greeting

**User Story:** As a user, I want to see the current time, date, and a contextual greeting when I open the dashboard, so that I immediately know what time of day it is and feel welcomed.

#### Acceptance Criteria

1. THE Greeting_Widget SHALL display the current date in a human-readable format (e.g., "Monday, July 14, 2025").
2. THE Greeting_Widget SHALL display the current time updated every second.
3. WHEN the local hour is between 05:00 and 11:59, THE Greeting_Widget SHALL display the greeting "Good Morning".
4. WHEN the local hour is between 12:00 and 16:59, THE Greeting_Widget SHALL display the greeting "Good Afternoon".
5. WHEN the local hour is between 17:00 and 20:59, THE Greeting_Widget SHALL display the greeting "Good Evening".
6. WHEN the local hour is between 21:00 and 04:59, THE Greeting_Widget SHALL display the greeting "Good Night".
7. WHERE a User_Name is stored in Local_Storage, THE Greeting_Widget SHALL append the User_Name to the greeting (e.g., "Good Morning, Alex").

---

### Requirement 2: Focus Timer (Pomodoro)

**User Story:** As a user, I want a 25-minute countdown timer with Start, Stop, and Reset controls, so that I can use the Pomodoro technique to stay focused.

#### Acceptance Criteria

1. THE Focus_Timer SHALL initialize with a countdown value of 25 minutes and 00 seconds (25:00).
2. WHEN the user activates the Start control, THE Focus_Timer SHALL begin counting down one second per second and update the displayed time every second.
3. WHILE the Focus_Timer is counting down, THE Focus_Timer SHALL display the remaining time in MM:SS format.
4. WHEN the user activates the Stop control, THE Focus_Timer SHALL pause the countdown and retain the current remaining time.
5. WHEN the user activates the Reset control, THE Focus_Timer SHALL stop any active countdown and reset the displayed time to 25:00.
6. WHEN the countdown reaches 00:00, THE Focus_Timer SHALL stop automatically and notify the user that the session is complete (e.g., via a browser alert or visible message).
7. IF the Start control is activated while the Focus_Timer is already counting down, THEN THE Focus_Timer SHALL ignore the activation and continue the current countdown.

---

### Requirement 3: To-Do List

**User Story:** As a user, I want to add, edit, complete, and delete tasks that persist across page refreshes, so that I can track my daily work without losing progress.

#### Acceptance Criteria

1. WHEN the user submits a non-empty task label, THE Todo_List SHALL add a new Task with a completion state of false and display it in the list.
2. IF the user submits an empty or whitespace-only task label, THEN THE Todo_List SHALL reject the submission and display an inline validation message.
3. WHEN the user activates the complete control on a Task, THE Todo_List SHALL toggle the Task's completion state and update the visual style to distinguish completed tasks from incomplete tasks.
4. WHEN the user activates the edit control on a Task, THE Todo_List SHALL allow the user to modify the Task's label and save the updated label on confirmation.
5. WHEN the user activates the delete control on a Task, THE Todo_List SHALL remove the Task from the list permanently.
6. WHEN the Dashboard loads, THE Todo_List SHALL read all Tasks from Local_Storage and render them in the order they were saved.
7. WHEN any Task is added, edited, completed, or deleted, THE Todo_List SHALL write the updated Task collection to Local_Storage.
8. WHERE the duplicate-prevention option is enabled, THE Todo_List SHALL reject a new Task whose label exactly matches (case-insensitive) an existing Task label and display an inline validation message.

---

### Requirement 4: Quick Links

**User Story:** As a user, I want to save and access my favorite website links from the dashboard, so that I can navigate to frequently used sites quickly.

#### Acceptance Criteria

1. WHEN the user submits a Link with a non-empty label and a valid URL, THE Quick_Links SHALL add the Link and display it as a clickable element.
2. IF the user submits a Link with an empty label or an empty URL, THEN THE Quick_Links SHALL reject the submission and display an inline validation message.
3. WHEN the user activates a Link, THE Quick_Links SHALL open the associated URL in a new browser tab.
4. WHEN the user activates the delete control on a Link, THE Quick_Links SHALL remove the Link from the list permanently.
5. WHEN the Dashboard loads, THE Quick_Links SHALL read all Links from Local_Storage and render them.
6. WHEN any Link is added or deleted, THE Quick_Links SHALL write the updated Link collection to Local_Storage.

---

### Requirement 5: Light / Dark Mode Toggle

**User Story:** As a user, I want to switch between a light and dark color scheme, so that I can use the dashboard comfortably in different lighting conditions.

#### Acceptance Criteria

1. THE Dashboard SHALL default to the light Theme on first load.
2. WHEN the user activates the theme toggle control, THE Dashboard SHALL switch the active Theme between light and dark.
3. WHEN the Dashboard loads, THE Dashboard SHALL read the previously saved Theme from Local_Storage and apply it before rendering content.
4. WHEN the Theme changes, THE Dashboard SHALL write the new Theme value to Local_Storage.

---

### Requirement 6: Custom Name in Greeting

**User Story:** As a user, I want to set a custom name that appears in my greeting, so that the dashboard feels personalized.

#### Acceptance Criteria

1. THE Dashboard SHALL provide an input control that allows the user to enter a User_Name.
2. WHEN the user saves a non-empty User_Name, THE Dashboard SHALL store the User_Name in Local_Storage and update the Greeting_Widget immediately.
3. IF the user saves an empty User_Name, THEN THE Dashboard SHALL remove the User_Name from Local_Storage and display the greeting without a name.
4. WHEN the Dashboard loads, THE Dashboard SHALL read the User_Name from Local_Storage and pass it to the Greeting_Widget before rendering.

---

### Requirement 7: Duplicate Task Prevention

**User Story:** As a user, I want the dashboard to prevent me from adding duplicate tasks, so that my to-do list stays clean and unambiguous.

#### Acceptance Criteria

1. WHEN the user submits a new Task label, THE Todo_List SHALL compare the label against all existing Task labels using a case-insensitive exact match.
2. IF a matching Task label already exists, THEN THE Todo_List SHALL reject the submission and display the message "Task already exists" inline near the input field.
3. WHEN the user edits an existing Task label, THE Todo_List SHALL apply the same duplicate check against all other Tasks, excluding the Task being edited.

---

### Requirement 8: Non-Functional Requirements

**User Story:** As a user, I want the dashboard to load fast, look clean, and work on any modern browser without installation, so that it is immediately usable.

#### Acceptance Criteria

1. THE Dashboard SHALL be implemented using only HTML, CSS, and Vanilla JavaScript with no external frameworks or backend dependencies.
2. THE Dashboard SHALL use Local_Storage as the sole persistence mechanism.
3. THE Dashboard SHALL render correctly on modern browsers (Chrome, Firefox, Safari, Edge — current stable versions).
4. THE Dashboard SHALL present a responsive layout that adapts to viewport widths from 320px to 1920px.
5. THE Dashboard SHALL organize JavaScript into modular functions, each annotated with a comment describing its purpose.
6. WHEN the Dashboard is deployed to GitHub Pages, THE Dashboard SHALL be accessible via a public URL without additional configuration.
