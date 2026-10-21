# ServiConnect — Full-Stack MERN Service Marketplace

A production-style, full-stack service marketplace connecting **customers** with **verified local service professionals** (electricians, plumbers, AC technicians, cleaners, tutors, photographers, and more).

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite + Tailwind CSS |
| Backend | Node.js + Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT (httpOnly cookie + Bearer token) |
| Real-time | Socket.IO |
| File Uploads | Multer |
| Payment | Cash on Delivery (COD) |
| Maps / Geo | Haversine formula (no API key needed) |

---

## 📂 Project Structure

```
service-marketplace/
├── client/               # React frontend (Vite)
│   └── src/
│       ├── components/   # UI + Layout + Landing sections
│       ├── context/      # Auth, Socket, Toast, Notification
│       ├── hooks/        # Custom React hooks
│       ├── pages/        # All route pages
│       └── services/     # Axios API service
├── server/               # Express backend
│   ├── controllers/      # Business logic
│   ├── middleware/       # auth, roles, upload, errorHandler
│   ├── models/           # Mongoose schemas
│   ├── routes/           # Express routers
│   ├── seed/             # Database seeder
│   ├── socket/           # Socket.IO handler
│   └── utils/            # jwt, response, notifications, availability
└── package.json          # Root: concurrently dev script
```

---

## ⚡ Quick Start

### 1. Prerequisites
- Node.js ≥ 18
- MongoDB Atlas account (free tier works)

### 2. Clone & Install

```bash
git clone <repo-url>
cd service-marketplace
npm run install-all
```

### 3. Configure Environment

**Server** — edit `server/.env`:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/serviconnect
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

**Client** — edit `client/.env`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

### 4. Seed the Database

```bash
npm run seed
```

This creates:
- 1 Admin, 5 Customers, 8 Providers
- 10 Service Categories
- Sample services, bookings, reviews, payments

### 5. Run Development Servers

```bash
npm run dev
```

Opens:
- Frontend: **http://localhost:5173**
- Backend API: **http://localhost:5000**

---

## 🔑 Demo Credentials

| Role | Email | Password |
|---|---|---|
| 👑 Admin | admin@serviconnect.in | Admin@123 |
| 🙋 Customer | priya@example.com | Customer@123 |
| 🔧 Provider | rahul@acrepairs.in | Provider@123 |

---

## ✨ Features

### For Customers
- Browse & search verified service professionals
- Filter by category, rating, price, city
- 5-step booking wizard (service → date → time slot → address → confirm)
- Real-time chat with providers
- View, cancel, and review bookings
- Save favourite professionals
- Notifications for booking updates

### For Providers
- Onboarding wizard (bio, location, categories)
- Accept / Reject booking requests
- Update booking status (In Progress → Completed)
- Manage services with pricing
- Set weekly availability & slot duration
- Calendar view of all bookings
- Earnings dashboard with payment history
- Real-time chat with customers

### For Admins
- Platform-wide stats dashboard
- Approve / Reject provider applications
- Manage all users (activate/deactivate)
- View all bookings and reviews
- Manage service categories

---

## 🔌 API Overview

| Resource | Endpoint |
|---|---|
| Auth | `POST /api/auth/register`, `/login`, `/logout` |
| Users | `PUT /api/users/profile`, `/avatar`, `/favourites/:id` |
| Providers | `GET /api/providers`, `/providers/:id`, `/providers/me` |
| Services | `GET /api/services`, `POST /api/services` |
| Bookings | `POST /api/bookings`, `GET /api/bookings/provider` |
| Reviews | `POST /api/reviews`, `GET /api/reviews/provider/:id` |
| Messages | `GET /api/messages/conversations` |
| Payments | `GET /api/payments/earnings` |
| Admin | `GET /api/admin/stats`, `/admin/users`, `/admin/approvals` |

---

## 🏗️ Build for Production

```bash
npm run build
```

Outputs optimized static files to `client/dist/`.

---

## 📝 License

MIT
