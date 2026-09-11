# Campus Companion 🎓

**Campus Companion** is an all-in-one smart campus assistance platform built for students, faculty, and campus visitors. It provides real-time updates and interactive services to streamline everyday campus life.

---

## ✨ Features

- 🔍 **Lost & Found Tracker**: Report lost items with timestamps and location details, and easily claim recovered belongings.
- 🏢 **Study Space Availability**: Live monitoring of study halls, quiet zones, and computer labs to find open workspace quickly.
- 📅 **Campus Event Feed**: Discover upcoming workshops, hackathons, and cultural events with one-click calendar additions and smart recommendations.
- 🤖 **Campus Assistant Chat**: Real-time natural language query assistant for instant answers on room availability, lost items, and event schedules.
- 💎 **Liquid Glass UI**: Glassmorphic dashboard interface powered by `@samasante/liquid-glass`.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Liquid Glass
- **Backend**: Node.js, Express, Socket.io, UUID, CORS

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Gautam369-web/Campus-Life-Student-Experience.git
   cd Campus-Life-Student-Experience
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

1. **Start the backend server** (runs on port 5000):
   ```bash
   node server.js
   ```

2. **Start the frontend development server** (runs on port 3000):
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:3000`.

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/lost` | List all reported lost items |
| `POST` | `/api/lost` | Report a newly lost item |
| `PATCH` | `/api/lost/:id` | Update status of a lost item (e.g., mark claimed) |
| `GET` | `/api/spaces` | Get current study room occupancy status |
| `PATCH` | `/api/spaces/:id` | Update study room status |
| `GET` | `/api/events` | Get list of upcoming campus events |
| `POST` | `/api/events` | Add a new campus event |
| `GET` | `/api/events/recommend` | Get recommended upcoming events |
| `POST` | `/api/chat` | Query the campus assistant |
