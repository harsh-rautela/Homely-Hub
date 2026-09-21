# 🏡 Homely Hub

Homely Hub is a full-stack vacation rental / property booking platform (Airbnb-style) built with the **MERN stack**. Hosts can list properties, guests can search, filter, and book stays with secure online payments, and an integrated **AI assistant** (via Groq) generates property descriptions and personalized trip itineraries.

---

## ✨ Features

**Guests**
- Browse and search property listings with filters for city, dates, guest count, price range, property type, room type, and amenities
- Paginated listings with an interactive map view (Leaflet)
- View detailed property pages with image galleries, amenities, and availability
- Book a stay and pay securely online via **Razorpay**
- View booking history and individual booking details
- AI-powered **Trip Planner** that generates a day-by-day itinerary based on destination, budget, duration, and interests

**Hosts**
- List a new property with images (uploaded to **ImageKit**), pricing, amenities, and address
- AI-assisted property description generator (via Groq LLM) from structured property details
- View and manage properties they've listed

**Account & Auth**
- Email/password signup and login with JWT-based authentication (HTTP-only cookies)
- Forgot password / reset password flow with transactional emails (Nodemailer + Mailgen)
- Profile management, password updates, and avatar upload

---

## 🛠️ Tech Stack

### Frontend
| Category | Technology |
|---|---|
| Framework | React 18 (Vite) |
| Routing | React Router v6 |
| State Management | Redux Toolkit + React Redux |
| Forms | TanStack React Form |
| UI Components | Ant Design (antd), Lucide Icons |
| Maps | Leaflet / React-Leaflet |
| HTTP Client | Axios |
| Animations | GSAP |
| Notifications | React Hot Toast |
| Date Handling | Moment.js, React Datepicker |

### Backend
| Category | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express 5 |
| Database | MongoDB (Mongoose ODM) |
| Authentication | JWT + bcrypt, HTTP-only cookies |
| File/Image Storage | ImageKit |
| Payments | Razorpay |
| AI | Groq SDK (LLM-powered description & trip planning) |
| Email | Nodemailer + Mailgen |
| Logging | Morgan |
| Validation | Validator.js |

---

## 📂 Project Structure

```
project/
├── Frontend/                  # React + Vite client
│   ├── src/
│   │   ├── components/        # Feature-based components (home, user, accomodation, propertyListing,
│   │   │                       #   myBookings, payment, aiTripPlanner)
│   │   ├── store/              # Redux Toolkit slices & async actions
│   │   │   ├── User/
│   │   │   ├── Property/
│   │   │   ├── PropertyDetails/
│   │   │   ├── Accomodation/
│   │   │   └── Booking/
│   │   ├── utils/axios.js     # Centralized Axios instance
│   │   ├── css/                # Component-level stylesheets
│   │   └── App.jsx             # Route definitions
│   └── vite.config.js          # Dev proxy -> backend on :4000
│
└── backend/                    # Express + MongoDB API
    └── src/
        ├── Models/             # Mongoose schemas (User, Property, Booking)
        ├── controllers/        # Route handlers (auth, property, booking, trip)
        ├── routes/             # Express routers
        ├── ai/                 # Groq client, description generator, trip planner
        └── utils/              # DB connection, ImageKit, Razorpay, mail, JWT, query features
```

---

## 🔌 API Overview

Base path: `/api/v1/rent`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/user/signup` | Register a new user | Public |
| POST | `/user/login` | Log in | Public |
| GET | `/user/logout` | Log out | Public |
| GET | `/user/me` | Get current user | Protected |
| PATCH | `/user/updateMe` | Update profile | Protected |
| PATCH | `/user/updateMyPassword` | Change password | Protected |
| POST | `/user/forgotPassword` | Request password reset email | Public |
| PATCH | `/user/resetPassword/:token` | Reset password | Public |
| POST | `/user/generateDescription` | AI-generate a property description | Protected |
| POST | `/user/newAccommodation` | Create a new property listing | Protected |
| GET | `/user/myAccommodation` | Get listings created by the current user | Protected |
| GET | `/listing` | Get all properties (filter, search, paginate) | Public |
| GET | `/listing/:id` | Get a single property | Public |
| GET | `/user/booking` | Get current user's bookings | Protected |
| GET | `/user/booking/:bookingId` | Get a single booking's details | Protected |
| POST | `/user/booking/create-order` | Create a Razorpay order for a booking | Protected |
| POST | `/user/booking/verify-payment` | Verify Razorpay payment & confirm booking | Protected |
| POST | `/trip` | AI-generate a day-by-day trip itinerary | Public |

**Listing query parameters:** `minPrice`, `maxPrice`, `propertyType`, `roomType`, `amenities`, `city`, `guests`, `dateIn`, `dateOut`, `page`, `limit`

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- A MongoDB instance (local or Atlas)
- Accounts/API keys for: [ImageKit](https://imagekit.io/), [Razorpay](https://razorpay.com/), [Groq](https://groq.com/), and an SMTP provider (e.g. [Mailtrap](https://mailtrap.io/) for testing)

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd project
```

### 2. Backend setup
```bash
cd backend
npm install
cp .env.example .env
```

Fill in `backend/.env`:
```env
PORT=4000
MONGO_URI=your_mongodb_connection_string

MAILTRAP_SMTP_HOST=
MAILTRAP_SMTP_PORT=
MAILTRAP_SMTP_USER=
MAILTRAP_SMTP_PASS=

IMAGEKIT_PUBLICKEY=
IMAGEKIT_PRIVATEKEY=
IMAGEKIT_URLENDPOINT=

GROQ_API_KEY=

JWT_SECRET=
JWT_EXPIRES_IN=
JWT_COOKIE_EXPIRES_IN=

RAZORPAY_KEY_ID=
RAZORPAY_SECRET_KEY=
```

Run the backend (defaults to `http://localhost:4000`):
```bash
npm run dev
```

### 3. Frontend setup
```bash
cd ../Frontend
npm install
cp .env.example .env
```

Fill in `Frontend/.env`:
```env
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

Run the frontend dev server:
```bash
npm run dev
```

The Vite dev server proxies `/api` requests to `http://localhost:4000`, so no CORS configuration is needed in development. Open the URL Vite prints (typically `http://localhost:5173`).

### 4. Build for production
```bash
cd Frontend
npm run build
```

---

## 🔐 Environment Variables Reference

| Variable | Used By | Purpose |
|---|---|---|
| `MONGO_URI` | Backend | MongoDB connection string |
| `JWT_SECRET`, `JWT_EXPIRES_IN`, `JWT_COOKIE_EXPIRES_IN` | Backend | Auth token signing & expiry |
| `IMAGEKIT_PUBLICKEY`, `IMAGEKIT_PRIVATEKEY`, `IMAGEKIT_URLENDPOINT` | Backend | Property/avatar image uploads |
| `RAZORPAY_KEY_ID`, `RAZORPAY_SECRET_KEY` | Backend | Payment order creation & verification |
| `GROQ_API_KEY` | Backend | AI description & trip planning |
| `MAILTRAP_SMTP_*` | Backend | Transactional email delivery |
| `VITE_RAZORPAY_KEY_ID` | Frontend | Razorpay checkout widget |

> ⚠️ Never commit real `.env` files. Only `.env.example` files are tracked in version control.

---

## 🗺️ Roadmap Ideas
- Host dashboard with booking calendar & revenue analytics
- Reviews and ratings for properties
- Wishlist / saved properties
- Admin moderation panel for listings

---

## 📄 License

This project is currently available for educational and development purposes.

Add a LICENSE file to the repository if you intend to distribute the project under a specific open-source license.

👨‍💻 Author

Harsh Rautela

GitHub:
https://github.com/harsh-rautela

Project:
https://github.com/harsh-rautela/Homely-Hub
