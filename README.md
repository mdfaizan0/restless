# Restless ⚡

A modern, feature-rich API testing tool built with React and Node.js, designed to provide a seamless experience for testing and managing HTTP requests.

## Summary

**Restless** is a powerful API testing platform that combines an intuitive Hoppscotch-inspired interface with robust backend capabilities. It enables developers to build, test, and organize API requests with features like real-time response viewing, request history tracking, and collection management. All data is securely stored using Supabase, ensuring your API workflows are accessible across sessions.

## Live Demo

Demo available here - [Link](https://restless-ten.vercel.app/)

## Features

### 🚀 Request Builder

- **URL Input & Method Selection** - Support for GET, POST, PUT, PATCH, DELETE, HEAD, and OPTIONS methods
- **Method Badges** - Color-coded HTTP method indicators for quick identification
- **Query Parameters Editor** - Add, edit, toggle, and remove query parameters with a clean UI
- **Headers Editor** - Manage custom headers with enable/disable toggles
- **Authentication UI** - Dedicated interface for adding authentication headers
- **CodeMirror JSON Editor** - Advanced JSON body editor with syntax highlighting, auto-completion, bracket matching, and prettify functionality
- **Request Validation** - Automatic JSON validation before sending requests

### 📊 Response Viewer

- **Multi-Tab Interface** - Switch between JSON, Raw, and Headers views
- **JSON Viewer** - Syntax-highlighted JSON responses with copy-to-clipboard functionality
- **Raw Viewer** - Plain text response display for non-JSON content
- **Binary Download** - Automatic detection and download support for binary responses (images, PDFs, etc.)
- **Status Bar** - Display response status code, duration, and size
- **Performance Metrics** - Real-time request duration tracking

### 📚 Collections

- **Create Collections** - Organize requests into named collections
- **CRUD Operations** - Full create, read, update, and delete support for collections and items
- **Save to Collection** - Quick-save current requests to any collection
- **Collection Items Management** - Edit, delete, and reorder saved requests
- **Click to Load** - Instantly load saved requests into the builder

### 🕐 History

- **Automatic Tracking** - All requests are automatically saved to history
- **History List** - View recent requests with method, URL, and timestamp
- **Click to Restore** - Load any historical request back into the builder
- **Delete History** - Remove individual history entries
- **Clear All** - Bulk delete all history items

### 🎨 User Interface

- **Hoppscotch-like Design** - Clean, modern, and minimalistic interface
- **Dark Theme** - Pitch-black aesthetic with accent colors
- **Resizable Sidebar** - Adjustable sidebar width (220px - 420px)
- **Smooth Animations** - Framer Motion-powered transitions and micro-interactions
- **Responsive Layout** - Three-column layout optimized for various screen sizes
- **Tailwind CSS v4** - Modern utility-first styling

### 🔧 Backend & Integration

- **Supabase Integration** - Cloud-based storage for history and collections
- **Proxy Server** - Built-in proxy to handle CORS and external API requests
- **User UID System** - Local user identification for data isolation
- **RESTful API** - Clean backend architecture with Express.js

## Tech Stack

### Frontend

- **React 19** - Modern UI library with hooks
- **Vite** - Lightning-fast build tool and dev server
- **Tailwind CSS v4** - Utility-first CSS framework
- **Framer Motion** - Animation library for smooth transitions
- **CodeMirror 6** - Advanced code editor component
- **Prism.js** - Syntax highlighting for response viewer
- **@supabase/supabase-js** - Supabase client library

### Backend

- **Node.js** - JavaScript runtime
- **Express.js v5** - Web application framework
- **Supabase** - Backend-as-a-Service for database and storage
- **node-fetch** - HTTP client for proxy requests
- **CORS** - Cross-origin resource sharing middleware
- **dotenv** - Environment variable management

### Development Tools

- **ESLint** - Code linting and quality checks
- **Nodemon** - Auto-restart development server

## Screenshots
- Home
![home](./public/screenshots/home.png)
- Request-Response
![request-response](./public/screenshots/request-response.png)
- Collections
![collections](./public/screenshots/collections.png)
- History
![history](./public/screenshots/history.png)

## Installation

Follow these steps to set up Restless locally:

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Supabase account (free tier available)

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/restless.git
cd restless
```

### 2. Install Dependencies

**Backend:**

```bash
cd backend
npm install
```

**Frontend:**

```bash
cd frontend
npm install
```

### 3. Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

```env
PORT=5000
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

**How to get Supabase credentials:**

1. Sign up at [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Project Settings → API
4. Copy the Project URL and API keys

### 4. Start the Backend Server

```bash
cd backend
npm run dev
```

The backend server will start on `http://localhost:5000`

### 5. Start the Frontend Development Server

```bash
cd frontend
npm run dev
```

The frontend will start on `http://localhost:5173` (or another port if 5173 is busy)

### 6. Access the Application

Open your browser and navigate to the URL shown in the terminal (typically `http://localhost:5173`)

---

**Built with ⚡ by the Faizan**
