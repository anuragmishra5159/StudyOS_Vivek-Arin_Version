# 🎓 Mantessa

A full-stack study-oriented productivity workspace for students and learners. Combines task management, scheduling, note-taking, real-time collaboration, and creative tools in one platform.

Built with the **MERN Stack** (MongoDB, Express, React, Node.js) featuring a neumorphism-inspired UI with light/dark theme support.

---

## ✨ Features

### Dashboard
- Productivity stats — study hours, tasks completed, current streak, focus score
- Weekly activity chart (daily study minutes)
- Personalized greeting with pending task count
- Collapsible sidebar and right panel for a fluid layout

### Productivity Tools
- **📅 Calendar** — Month / Week / Day views, color-coded events, search and reminders
- **🧮 Calculator** — Scientific calculator with saved calculation history
- **📝 Sticky Notes** — Color-coded notes with categories (Personal / Study / Ideas / Work), masonry grid
- **📓 Notebooks** — Rich-text editor with code blocks, syntax highlighting, tagging, `.docx` import, and PDF export
- **🎨 Drawing Pad** — Canvas with pen / highlighter / eraser, adjustable brush, color palette, sketch saving
- **✅ Todo Lists** — Kanban board (To Do → In Progress → Completed) with priority levels and due dates
- **📚 Subjects** — Track subjects with chapters, task counts, and progress bars

### Real-Time Collaboration
- Share notebooks via link (`/shared/:id`)
- Live collaborative editing powered by Socket.IO
- Active user count displayed per notebook

### User Profile
- Editable username, email, and avatar on a dedicated **Edit Profile** page
- Social links — LinkedIn, GitHub, Reddit, Discord, Quora
- Avatar selection during signup and in profile settings

### Focus Timer
- Pomodoro-style timer with progress ring
- Live elapsed-time tracking
- Session history persisted to the database

### Other
- **AI Nudges** — Context-aware productivity tips based on activity
- **PDF Tools** — Built-in PDF viewer accessible from the right panel
- **Theme Toggle** — Light / dark mode

---

## 🏗️ Tech Stack

### Frontend

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + Vite 7 |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion 12 |
| Icons | Lucide React + React Icons |
| State | Zustand 5 (dashboard, focus, nudge, layout, theme) + React Context (auth) |
| Routing | React Router v7 |
| Real-time | Socket.IO Client 4 |
| PDF | pdfjs-dist, jsPDF, html2canvas |
| Doc Import | Mammoth (`.docx` → HTML) |

### Backend

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js + Express 5 |
| Database | MongoDB via Mongoose 9 |
| Auth | JWT (httpOnly cookies) + bcryptjs |
| Real-time | Socket.IO 4 |

### Data Models

`User` · `UserStat` · `Task` · `Event` · `Note` · `Notebook` · `Sketch` · `Subject` · `Calculation` · `FocusSession`

### API Endpoints

| Prefix | Resource |
|--------|----------|
| `/api/auth` | Register, Login, Logout, Profile, Social Links |
| `/api/dashboard` | Aggregated stats & weekly activity |
| `/api/tasks` | CRUD tasks with priority & status |
| `/api/events` | Calendar events |
| `/api/notes` | Sticky notes |
| `/api/notebooks` | Notebooks + shared collaboration |
| `/api/sketches` | Drawing pad sketches |
| `/api/subjects` | Academic subjects |
| `/api/calculator` | Calculation history |
| `/api/focus` | Focus sessions (start / stop / history) |
| `/api/local-save` | Local file persistence |

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)
- Git

### Setup

```bash
# Clone
git clone https://github.com/VivekChaurasiya95/StudyOS_Vivek.git
cd StudyOS_Vivek

# Install dependencies
cd client && npm install
cd ../server && npm install
```

Create `server/.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/mantessa
JWT_SECRET=your_secret_key
NODE_ENV=development
```

### Run

```bash
# Terminal 1 — Backend
cd server
npm run dev

# Terminal 2 — Frontend
cd client
npm run dev
```

Frontend runs on `http://localhost:5173`, backend on `http://localhost:5000`.

---

## 📂 Project Structure

```
├── client/
│   └── src/
│       ├── assets/avatar/           # User avatar images
│       ├── components/
│       │   ├── Sidebar.jsx          # Floating navigation dock
│       │   ├── RightPanel.jsx       # Focus timer, stats, profile, PDF tools
│       │   ├── NudgesPanel.jsx      # Productivity nudges
│       │   ├── ProfileLinksModal.jsx # Social links modal
│       │   ├── PdfTools.jsx         # PDF viewer
│       │   ├── Character.jsx        # Login page mascot
│       │   └── ProtectedRoute.jsx   # Auth guard
│       ├── context/
│       │   └── AuthContext.jsx      # Auth state & actions
│       ├── hooks/
│       │   └── useSocket.js         # Socket.IO hook
│       ├── store/
│       │   ├── dashboardStore.js    # Dashboard stats
│       │   ├── focusStore.js        # Focus timer state
│       │   ├── layoutStore.js       # UI layout state
│       │   ├── nudgeStore.js        # Nudge panel state
│       │   └── themeStore.js        # Dark / light theme
│       ├── pages/
│       │   ├── LandingPage.jsx      # Public landing page
│       │   ├── Login.jsx            # Login + Signup
│       │   ├── Dashboard.jsx        # Main hub
│       │   ├── EditProfile.jsx      # Profile editing page
│       │   ├── TodoList.jsx         # Kanban task board
│       │   ├── Calendar.jsx         # Event calendar
│       │   ├── Calculator.jsx       # Scientific calculator
│       │   ├── StickyNotes.jsx      # Quick notes
│       │   ├── Notepad.jsx          # Rich-text notebook editor
│       │   ├── SharedNotebook.jsx   # Real-time collaborative notebook
│       │   ├── DrawingPad.jsx       # Drawing canvas
│       │   └── Subjects.jsx         # Subject tracker
│       ├── index.css                # Tailwind theme & styles
│       ├── App.jsx                  # Routes
│       └── main.jsx                 # Entry point
│
├── server/
│   ├── controllers/                 # 10 route handlers
│   ├── middleware/
│   │   └── authMiddleware.js        # JWT verification
│   ├── models/                      # 10 Mongoose schemas
│   ├── routes/                      # 11 API routers
│   └── index.js                     # Express + Socket.IO entry
│
└── StudyOS_Data/
    └── notebooks/                   # Saved notebook JSON files
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -m 'Add YourFeature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a Pull Request
