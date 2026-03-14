// Storage — thin localStorage wrapper
const Storage = {
  // Parse and return the stored value, or null if missing/corrupt
  get(key) {
    try {
      return JSON.parse(localStorage.getItem(key));
    } catch {
      return null;
    }
  },

  // Stringify and persist the value; warn on quota errors but continue
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      if (err instanceof DOMException && err.name === 'QuotaExceededError') {
        console.warn('Storage quota exceeded — changes will not persist.', err);
      }
    }
  },

  // Remove the key from localStorage
  remove(key) {
    localStorage.removeItem(key);
  },
};

// GreetingWidget — clock, date, greeting, and custom name
const GreetingWidget = {
  // Returns greeting string based on hour (0-23)
  _getGreeting(hour) {
    if (hour >= 5 && hour <= 11) return 'Good Morning Nehemiah';
    if (hour >= 12 && hour <= 16) return 'Good Afternoon Nehemiah';
    if (hour >= 17 && hour <= 20) return 'Good Evening Nehemiah';
    return 'Good Night Nehemiah';
  },

  // Returns time string "HH:MM:SS" from a Date object
  _formatTime(date) {
    const hh = String(date.getHours()).padStart(2, '0');
    const mm = String(date.getMinutes()).padStart(2, '0');
    const ss = String(date.getSeconds()).padStart(2, '0');
    return `${hh}:${mm}:${ss}`;
  },

  // Returns date string like "Monday, March 14, 2026" from a Date object
  _formatDate(date) {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  },

  // Updates #clock, #date, #greeting-text DOM elements
  render(userName) {
    const now = new Date();
    const greeting = this._getGreeting(now.getHours());
    const fullGreeting = userName ? `${greeting}, ${userName}` : greeting;

    document.getElementById('clock').textContent = this._formatTime(now);
    document.getElementById('date').textContent = this._formatDate(now);
    document.getElementById('greeting-text').textContent = fullGreeting;
  },

  // Called every second by setInterval
  _tick() {
    this.render(this._userName);
  },

  // Reads tld_username from Storage, starts 1000ms interval
  init() {
    this._userName = Storage.get('tld_username') || '';
    this.render(this._userName);
    setInterval(() => this._tick(), 1000);
  },
};

// FocusTimer — Pomodoro 25-minute countdown timer
const FocusTimer = {
  _remaining: 1500,  // seconds (25 * 60)
  _intervalId: null, // reference to active setInterval, or null

  // Returns "MM:SS" string from total seconds
  _formatTime(totalSeconds) {
    const mm = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
    const ss = String(totalSeconds % 60).padStart(2, '0');
    return `${mm}:${ss}`;
  },

  // Updates #timer-display with current remaining time
  render() {
    document.getElementById('timer-display').textContent = this._formatTime(this._remaining);
  },

  // Shows completion message in #timer-message
  _notifyComplete() {
    document.getElementById('timer-message').textContent = '🎉 Session complete! Take a break.';
  },

  // Decrements remaining, renders, stops + notifies at 0
  _tick() {
    this._remaining -= 1;
    this.render();
    if (this._remaining === 0) {
      this.stop();
      this._notifyComplete();
    }
  },

  // Starts countdown if not already running
  start() {
    if (this._intervalId !== null) return;
    this._intervalId = setInterval(() => this._tick(), 1000);
  },

  // Pauses countdown, retains remaining time
  stop() {
    clearInterval(this._intervalId);
    this._intervalId = null;
  },

  // Stops countdown and resets remaining to 1500
  reset() {
    clearInterval(this._intervalId);
    this._intervalId = null;
    this._remaining = 1500;
    document.getElementById('timer-message').textContent = '';
    this.render();
  },

  // Renders initial 25:00, binds button click events
  init() {
    this.render();
    document.getElementById('btn-start').addEventListener('click', () => this.start());
    document.getElementById('btn-stop').addEventListener('click', () => this.stop());
    document.getElementById('btn-reset').addEventListener('click', () => this.reset());
  },
};

// TodoList — task CRUD with localStorage persistence and duplicate prevention
const TodoList = {
  _tasks: [], // in-memory task array

  // Returns error string if label is invalid, or null if valid
  _validate(label) {
    if (!label || label.trim().length === 0) return 'Task cannot be empty.';
    return null;
  },

  // Returns true if label matches an existing task (case-insensitive), excluding task with excludeId
  _isDuplicate(label, excludeId = null) {
    const normalized = label.trim().toLowerCase();
    return this._tasks.some(
      (t) => t.text.toLowerCase() === normalized && t.id !== excludeId
    );
  },

  // Writes current _tasks array to localStorage
  _save() {
    Storage.set('tld_tasks', this._tasks);
  },

  // Returns a <li> DOM element for a single task
  _renderItem(task) {
    const li = document.createElement('li');
    li.className = 'task-item';
    if (task.done) li.classList.add('done');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.done;
    checkbox.addEventListener('click', () => this._toggleComplete(task.id));

    const span = document.createElement('span');
    span.textContent = task.text;

    const editBtn = document.createElement('button');
    editBtn.className = 'btn-edit';
    editBtn.textContent = 'Edit';
    editBtn.addEventListener('click', () => {
      const newLabel = prompt('Edit task:', task.text);
      if (newLabel !== null) this._edit(task.id, newLabel);
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn-delete';
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => this._delete(task.id));

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);

    return li;
  },

  // Rebuilds #task-list from _tasks array
  render() {
    const list = document.getElementById('task-list');
    list.innerHTML = '';
    this._tasks.forEach((task) => list.appendChild(this._renderItem(task)));
  },

  // Validates, duplicate-checks, creates task, saves, renders
  _add(label) {
    const error = this._validate(label);
    if (error) {
      document.getElementById('task-error').textContent = error;
      return;
    }
    if (this._isDuplicate(label)) {
      document.getElementById('task-error').textContent = 'Task already exists.';
      return;
    }
    this._tasks.push({ id: Date.now().toString(), text: label.trim(), done: false });
    this._save();
    this.render();
    document.getElementById('task-error').textContent = '';
  },

  // Validates, duplicate-checks (excluding self), updates task text, saves, renders
  _edit(id, newLabel) {
    const error = this._validate(newLabel);
    if (error) {
      document.getElementById('task-error').textContent = error;
      return;
    }
    if (this._isDuplicate(newLabel, id)) {
      document.getElementById('task-error').textContent = 'Task already exists.';
      return;
    }
    const task = this._tasks.find((t) => t.id === id);
    if (task) {
      task.text = newLabel.trim();
      this._save();
      this.render();
      document.getElementById('task-error').textContent = '';
    }
  },

  // Toggles task.done, saves, renders
  _toggleComplete(id) {
    const task = this._tasks.find((t) => t.id === id);
    if (task) {
      task.done = !task.done;
      this._save();
      this.render();
    }
  },

  // Removes task by id, saves, renders
  _delete(id) {
    this._tasks = this._tasks.filter((t) => t.id !== id);
    this._save();
    this.render();
  },

  // Loads tasks from Storage, renders, binds #task-form submit
  init() {
    this._tasks = Storage.get('tld_tasks') || [];
    this.render();
    document.getElementById('task-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const input = document.getElementById('task-input');
      this._add(input.value);
      input.value = '';
    });
  },
};

// QuickLinks — favorite website links with localStorage persistence
const QuickLinks = {
  _links: [], // in-memory links array

  // Returns error string if label or url is invalid, or null if valid
  _validate(label, url) {
    if (!label || label.trim().length === 0) return 'Link name cannot be empty.';
    if (!url || url.trim().length === 0) return 'URL cannot be empty.';
    return null;
  },

  // Prepends "https://" if no protocol is present
  _normalizeUrl(url) {
    if (!/^https?:\/\//i.test(url)) return 'https://' + url;
    return url;
  },

  // Writes current _links array to localStorage
  _save() {
    Storage.set('tld_links', this._links);
  },

  // Returns a <li class="link-item"> DOM element for a single link
  _renderItem(link) {
    const li = document.createElement('li');
    li.className = 'link-item';

    const a = document.createElement('a');
    a.href = link.url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.textContent = link.label;

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn-delete';
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => this._delete(link.id));

    li.appendChild(a);
    li.appendChild(deleteBtn);

    return li;
  },

  // Rebuilds #link-list from _links array
  render() {
    const list = document.getElementById('link-list');
    list.innerHTML = '';
    this._links.forEach((link) => list.appendChild(this._renderItem(link)));
  },

  // Validates, normalizes URL, creates link, saves, renders
  _add(label, url) {
    const error = this._validate(label, url);
    if (error) {
      document.getElementById('link-error').textContent = error;
      return;
    }
    const normalizedUrl = this._normalizeUrl(url.trim());
    this._links.push({ id: Date.now().toString(), label: label.trim(), url: normalizedUrl });
    this._save();
    this.render();
    document.getElementById('link-error').textContent = '';
  },

  // Removes link by id, saves, renders
  _delete(id) {
    this._links = this._links.filter((l) => l.id !== id);
    this._save();
    this.render();
  },

  // Loads links from Storage, renders, binds #link-form submit
  init() {
    this._links = Storage.get('tld_links') || [];
    this.render();
    document.getElementById('link-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const labelInput = document.getElementById('link-label');
      const urlInput = document.getElementById('link-url');
      this._add(labelInput.value, urlInput.value);
      labelInput.value = '';
      urlInput.value = '';
    });
  },
};

// Settings — theme toggle and custom name management
const Settings = {
  // Adds or removes "dark" class on <body> and updates toggle button icon
  _applyTheme(theme) {
    if (theme === 'dark') {
      document.body.classList.add('dark');
      document.getElementById('theme-toggle').textContent = '☀️';
    } else {
      document.body.classList.remove('dark');
      document.getElementById('theme-toggle').textContent = '🌙';
    }
  },

  // Flips theme between "light" and "dark", saves to Storage, applies
  _toggleTheme() {
    const current = Storage.get('tld_theme') || 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    Storage.set('tld_theme', next);
    this._applyTheme(next);
  },

  // Trims name; if empty removes tld_username; otherwise saves and updates greeting
  _saveName(name) {
    const trimmed = name.trim();
    if (trimmed === '') {
      Storage.remove('tld_username');
      GreetingWidget._userName = '';
    } else {
      Storage.set('tld_username', trimmed);
      GreetingWidget._userName = trimmed;
    }
    GreetingWidget.render(GreetingWidget._userName);
  },

  // Returns stored name or empty string
  _loadName() {
    return Storage.get('tld_username') || '';
  },

  // Loads theme + username, applies theme, binds #theme-toggle and #name-save
  init() {
    const theme = Storage.get('tld_theme') || 'light';
    this._applyTheme(theme);

    const name = this._loadName();
    if (name) {
      document.getElementById('name-input').value = name;
    }

    document.getElementById('theme-toggle').addEventListener('click', () => this._toggleTheme());
    document.getElementById('name-save').addEventListener('click', () => {
      this._saveName(document.getElementById('name-input').value);
    });
  },
};

// DashboardApp — orchestrator that initializes all modules
const DashboardApp = {
  init() {
    GreetingWidget.init();
    FocusTimer.init();
    TodoList.init();
    QuickLinks.init();
    Settings.init();
  },
};

// Start the app when the DOM is ready
document.addEventListener('DOMContentLoaded', () => DashboardApp.init());
