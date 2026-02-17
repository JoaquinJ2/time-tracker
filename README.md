# ⏱️ Time Tracker

A modern work time tracking application built with React, TypeScript, and TailwindCSS. Track your work hours easily with a clean, intuitive interface.

![Time Tracker](./screenshot.png)

## ✨ Features

- **Clock In/Out** - Register your start and end times with a single click
- **Multiple Sessions** - Support for multiple work intervals per day
- **Automatic Calculation** - Total hours computed automatically
- **Daily Summary** - View all intervals for the current day
- **Weekly Chart** - Visual representation of hours worked over the last 7 days
- **Local Storage** - All data persists in your browser's localStorage (no backend required)

## 🛠️ Tech Stack

- **React** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **TailwindCSS** - Modern styling
- **Recharts** - Charts and graphs
- **date-fns** - Date manipulation
- **Lucide React** - Icons

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/JoaquinJ2/time-tracker.git

# Navigate to the project
cd time-tracker

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🚀 Usage

1. Click **"Entrar"** (Enter) to clock in and start tracking
2. Click **"Salir"** (Exit) to clock out and end the session
3. You can have multiple sessions in the same day
4. All data is automatically saved to localStorage
5. Refresh the page - your data will still be there

## 📱 Access

The app is running on port 5173. Access it at:
- Local: http://localhost:5173
- Network: http://YOUR_IP:5173

## 📂 Project Structure

```
src/
├── components/       # UI components
│   ├── ActionButtons.tsx
│   ├── EntriesList.tsx
│   ├── StatusCard.tsx
│   └── WeeklyChart.tsx
├── hooks/           # Custom React hooks
│   └── useTimeTracker.ts
├── types/           # TypeScript types
│   └── index.ts
├── utils/           # Utility functions
│   └── index.ts
├── App.tsx         # Main app component
└── main.tsx        # Entry point
```

## 📝 License

MIT
