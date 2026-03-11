# StudyOS - Verification Walkthrough

## Completed Tasks (Phase 1)
- [x] Set up MERN stack environment (Client & Server)
- [x] Implemented Backend Authentication (Register/Login/Me)
- [x] Implemented Frontend Auth Context
- [x] Created Login Page with Lottie Character Animation
- [x] Created Dashboard Layout with Sidebar and Editor Placeholder

## How to Run

### Prerequisites
- Node.js installed
- MongoDB installed and running locally on port 27017

### 1. Start the Backend Server
Open a terminal in the `StudyOS/server` directory:
```bash
npm start
# or
npm run dev
```
You should see: `Server running on port 5000` and `MongoDB Connected`.

### 2. Start the Frontend Client
Open a new terminal in the `StudyOS/client` directory:
```bash
npm run dev
```
Access the application at `http://localhost:5173`.

## Verification Steps

### Login Page
1. Navigate to `http://localhost:5173`.
2. Verify you land on the Login/Register page.
3. Observe the character animation (placeholder text "Character: idle" or "typing").
4. Toggle between "Login" and "Register" modes.

### Authentication
1. **Register**: Fill in Username, Email, and Password. Click "Register".
2. You should be redirected to `/dashboard`.
3. Check browser dev tools > Application > Cookies to see the `jwt` cookie (httpOnly).

### Dashboard
1. Verify the layout:
   - **Left Sidebar**: Shows tool icons (Calendar, Calculator, etc.) and user profile summary at bottom.
   - **Header**: Shows title and timer.
   - **Main Area**: Shows the "Editorial Text Formatter" area.
   - **Right Panel** (on large screens): Shows session analytics.
2. Click "Logout" in the sidebar. You should be redirected back to `/login`.

## Troubleshooting
- If MongoDB connection fails, ensure MongoDB service is running.
- If frontend cannot connect to backend (CORS error), ensure backend is running on port 5000.
