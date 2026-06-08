# DZ Infotech Sales CRM

A production-ready Sales CRM built for the DZ Infotech sales team to manage contractor leads efficiently.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + Tailwind CSS + React Router |
| Backend | Node.js + Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |

---

## Project Structure

```
dz-crm/
├── backend/
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js      # Auth logic
│   │   ├── leadsController.js     # Leads CRUD
│   │   └── dashboardController.js # Dashboard stats
│   ├── middleware/
│   │   └── auth.js                # JWT middleware
│   ├── models/
│   │   ├── User.js                # User schema
│   │   └── Lead.js                # Lead schema
│   ├── routes/
│   │   ├── auth.js
│   │   ├── leads.js
│   │   └── dashboard.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── ui/
    │   │   │   ├── Badge.jsx       # Status & Priority badges
    │   │   │   ├── ConfirmDialog.jsx
    │   │   │   ├── EmptyState.jsx
    │   │   │   └── Loader.jsx
    │   │   ├── layout/
    │   │   │   ├── Layout.jsx      # Sidebar + mobile header
    │   │   │   └── ProtectedRoute.jsx
    │   │   ├── leads/
    │   │   │   └── LeadForm.jsx    # Shared add/edit form
    │   │   └── dashboard/
    │   │       ├── FollowUpCard.jsx
    │   │       └── StatCard.jsx
    │   ├── contexts/
    │   │   └── AuthContext.jsx
    │   ├── pages/
    │   │   ├── LoginPage.jsx
    │   │   ├── RegisterPage.jsx
    │   │   ├── DashboardPage.jsx
    │   │   ├── LeadsPage.jsx
    │   │   ├── AddLeadPage.jsx
    │   │   ├── LeadDetailPage.jsx
    │   │   ├── EditLeadPage.jsx
    │   │   └── NotFoundPage.jsx
    │   ├── services/
    │   │   └── api.js              # Axios instance + API calls
    │   ├── utils/
    │   │   └── constants.js        # Enums, colors, helpers
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── .env.example
    ├── package.json
    ├── vite.config.js
    └── tailwind.config.js
```

---

## Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)
- npm or yarn

---

## Installation & Setup

### 1. Clone / Download the project

```bash
cd dz-crm
```

### 2. Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

Edit `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/dz-crm
JWT_SECRET=your_very_secret_key_change_this
JWT_EXPIRE=7d
NODE_ENV=development
```

### 3. Setup Frontend

```bash
cd ../frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

Edit `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

---

## Running the Application

### Development Mode

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
# Server starts on http://localhost:5000
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
# App opens on http://localhost:5173
```

### First-Time Setup

1. Open http://localhost:5173
2. Click **Register** to create your account
3. Login and start adding leads!

---

## MongoDB Setup

### Option A: Local MongoDB
```bash
# Install MongoDB Community Edition
# Start MongoDB service
mongod --dbpath /data/db

# Use URI: mongodb://localhost:27017/dz-crm
```

### Option B: MongoDB Atlas (Cloud - Recommended for Production)
1. Create free cluster at https://cloud.mongodb.com
2. Get your connection string
3. Replace `MONGODB_URI` in `.env`

---

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login user |
| GET | /api/auth/me | Get current user |

### Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/dashboard | Stats + today's follow-ups |

### Leads
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/leads | Get leads (search, filter, paginate) |
| GET | /api/leads/:id | Get single lead |
| POST | /api/leads | Create lead |
| PUT | /api/leads/:id | Update lead |
| DELETE | /api/leads/:id | Delete lead |

**Lead Query Parameters:**
- `search` — search by company, contact, mobile, city
- `status` — filter by status
- `priority` — filter by priority
- `page` — page number (default: 1)
- `limit` — items per page (default: 20)
- `sortBy` — field to sort by
- `sortOrder` — asc | desc

---

## Production Build

### Build Frontend
```bash
cd frontend
npm run build
# Output: frontend/dist/
```

### Serve with Node.js (optional)
```bash
# In backend/server.js, you can add:
# app.use(express.static('../frontend/dist'))
```

---

## Deployment

### Backend (Railway / Render / VPS)
1. Set environment variables in your hosting platform
2. Set `NODE_ENV=production`
3. Set `FRONTEND_URL=https://yourdomain.com`
4. Deploy with `npm start`

### Frontend (Vercel / Netlify)
1. Build command: `npm run build`
2. Output directory: `dist`
3. Set `VITE_API_URL=https://your-backend-url.com/api`

---

## Features

- ✅ JWT Authentication with secure password hashing
- ✅ Lead pipeline: New → Contacted → Interested → Demo → Won
- ✅ Today's Follow-ups dashboard (auto-detected)
- ✅ Priority badges: Cold / Warm / Hot
- ✅ Communication tracking (Video, Brochure, Proposal)
- ✅ Search, filter, sort, paginate leads
- ✅ Mobile-first responsive design
- ✅ Fast update workflow optimized for 30+ calls/day
- ✅ Color-coded status badges
- ✅ Overdue follow-up highlighting

---

## Support

DZ Infotech Internal CRM — built for the sales team.
