# Campus Companion 🎓

**Campus Companion** is an all-in-one smart campus assistance platform built for students, faculty, and campus visitors. It provides real-time updates and interactive services to streamline everyday campus life.

---

## ✨ Key Highlights & Features

- 🪐 **Interactive 3D Campus Universe**: Built with **Three.js** and **React Three Fiber** running at 60 FPS on the GPU, featuring orbit controls, animated lighting, and 3D-anchored UI cards.
- 💎 **Central Diamond Nexus**: Central rotating 3D crystal diamond holding real-time campus pulse stats and quick-jump navigation.
- 🏢 **Study Space Availability**: Live monitoring of study halls, quiet zones, and computer labs with instant occupancy toggles.
- 🔍 **Lost & Found Hub**: Report lost items with timestamps and location details, and easily claim recovered belongings with transparent logging.
- 📅 **Campus Event Feed**: Discover upcoming workshops, hackathons, and cultural events with one-click calendar additions and smart recommendations.
- 🤖 **AI Campus Assistant**: Natural language query assistant providing real-time answers based on live room occupancy and lost property records.
- 📋 **Integrated Project Overview**: One-click in-app technical architecture and demo guide for hackathon presentations.
- 🔗 **Deep-Linked Tab Navigation**: Full search parameter sync (`?tab=spaces`, `?tab=lost`, etc.) for seamless linking across modules.

---

## 🛠️ Tech Stack

- **3D Graphics Engine**: Three.js, `@react-three/fiber`, `@react-three/drei`
- **Frontend**: React 19, TypeScript, Vite, React Router v7, Vanilla CSS Glassmorphism
- **Backend**: Node.js, Express 5, Socket.io (WebSockets), UUID, CORS
- **Documentation**: Full architecture details in [PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md)

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
