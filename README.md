# ⚡ EV GreenCharge

### Smart EV Charging & Green Energy Management Platform

**EV GreenCharge** is a smart electric-vehicle charging platform designed to make EV charging **simpler, smarter, greener, and more efficient**.

The platform helps EV drivers discover charging stations, check availability and pricing, manage vehicles, book charging slots, monitor charging sessions, view charging history, receive price alerts, and make environmentally conscious charging decisions.

It also provides dedicated dashboards for **charging-station operators** and **grid operators**.

---

## 🚀 Project Overview

EV GreenCharge is built as a full-stack application with:

* 📱 Mobile-first EV charging interface
* 🗺️ Charging station discovery and map
* 🔋 EV vehicle management
* ⚡ Smart charging
* 📅 Charging-slot booking
* 💰 Charging price information
* 🌱 Green-score and environmental information
* 📊 Charging history and activity
* 🔔 Notifications and price alerts
* 🏢 Charging-station operator dashboard
* ⚡ Grid-operator dashboard
* 🔐 Authentication and role-based access
* 🤖 AI-related backend capabilities
* 📱 Android application support

The project contains separate frontend, backend, and Android/Capacitor components.

---

# 🎯 Problem Statement

The growing adoption of electric vehicles creates several challenges for EV users:

* Finding nearby charging stations
* Knowing whether chargers are currently available
* Comparing charging prices
* Managing charging time efficiently
* Booking charging slots
* Tracking charging expenses
* Understanding the environmental impact of charging
* Managing multiple EVs
* Getting timely price and charging notifications

EV GreenCharge brings these capabilities together into a single platform.

---

# 💡 Our Solution

EV GreenCharge provides a centralized platform where users can:

1. Create an account and select their role.
2. Add and manage their EV.
3. Discover nearby charging stations.
4. View station details and charger availability.
5. Compare charging prices.
6. Book a charging slot.
7. Start and monitor charging sessions.
8. Track charging history and expenses.
9. View green/environmental scores.
10. Receive notifications and price alerts.

Operators can additionally manage stations and bookings, while grid operators receive a dedicated dashboard.

---

# ✨ Key Features

## 👤 Driver Features

### 🔐 Authentication

* Login
* Sign up
* Role-based access
* Protected application routes

### 🏠 Driver Dashboard

* Personalized home screen
* Charging overview
* Quick access to important charging functions

### 🗺️ Charging Station Map

* Locate charging stations
* View station information
* Access station details
* Find suitable charging locations

### 🔌 Station Details

Users can view information such as:

* Station name
* Address
* Available chargers
* Total chargers
* Charging power
* Connector information
* Price per kWh
* Availability status
* Operating status

### 🚗 Vehicle Management

Users can manage their EV information including:

* Vehicle brand
* Model
* Vehicle type
* Battery capacity
* Connector type
* Maximum charging power
* Current battery percentage
* Target battery percentage
* Primary vehicle

### 📅 Slot Booking

Drivers can:

* Select a charging station
* Select a charging time
* Select charging duration
* Select connector type
* View estimated charging cost
* Manage bookings

### ⚡ Smart Charging

The application provides a dedicated smart-charging workflow designed to help users make better charging decisions based on their charging requirements and preferences.

### 🔋 Charging Session

Users can monitor an active charging session including:

* Battery percentage
* Energy consumed
* Charging cost
* Charging progress
* Estimated completion
* Charging status

### 💰 Price & Green Score

Users can view charging-price information together with environmental/green indicators.

### 📊 Charging History

Users can review previous charging sessions and their details.

### 🔔 Notifications

The application supports notifications and price alerts for users.

---

# 🏢 Operator Features

Charging-station operators have access to a dedicated dashboard.

Operators can:

* View station information
* Manage charging stations
* Manage station pricing
* Monitor bookings
* View operational information
* Manage station-related activities

The application includes protected operator routes so normal drivers cannot access operator-only screens.

---

# ⚡ Grid Operator Features

A separate **Grid Operator** role is supported.

Grid operators have access to their own dashboard and can work with grid-related information.

The application uses role-based routing to distinguish:

* Driver
* Operator
* Grid Operator

---

# 🧠 AI & Smart Features

The backend contains a dedicated AI API module and configuration for AI-related functionality.

The backend architecture also supports external service/API configuration for areas such as:

* AI services
* Weather information
* Maps
* Grid information
* Renewable-energy information

These integrations are controlled through environment variables rather than hard-coded credentials.

---

# 🏗️ Technology Stack

## Frontend

| Technology    | Purpose                       |
| ------------- | ----------------------------- |
| React         | User interface                |
| Vite          | Development/build tool        |
| React Router  | Application routing           |
| Tailwind CSS  | Styling                       |
| Framer Motion | Animations                    |
| Leaflet       | Maps                          |
| Recharts      | Charts and data visualization |
| Three.js      | 3D/visual experiences         |
| Lucide React  | Icons                         |
| Capacitor     | Android application support   |

The frontend uses React 18 and Vite.

---

## Backend

| Technology | Purpose                    |
| ---------- | -------------------------- |
| Node.js    | Runtime                    |
| TypeScript | Backend development        |
| Express.js | REST API                   |
| Prisma     | Database ORM               |
| PostgreSQL | Relational database        |
| Redis      | Caching/background support |
| JWT        | Authentication             |
| bcryptjs   | Password hashing           |
| Zod        | Validation                 |
| Swagger    | API documentation          |
| Helmet     | Security                   |
| CORS       | Cross-origin communication |

The backend package configuration confirms Express, Prisma, PostgreSQL support, Redis, JWT, Swagger, Helmet and validation tooling.

---

## 📱 Android

The project uses **Capacitor** to package the web application as an Android application.

Application configuration:

```text
App Name: EV GreenCharge
App ID: com.tetrasquad.evgreencharge
Web Directory: dist
```

The Capacitor configuration points Android to the built Vite `dist` directory.

---

# 🏛️ System Architecture

```text
                    ┌─────────────────────┐
                    │      EV DRIVER      │
                    └──────────┬──────────┘
                               │
                               ▼
                 ┌──────────────────────────┐
                 │     React Frontend       │
                 │      Vite + Tailwind     │
                 └────────────┬─────────────┘
                              │
                              │ REST API
                              ▼
                 ┌──────────────────────────┐
                 │     Express Backend      │
                 │       TypeScript         │
                 └────────────┬─────────────┘
                              │
              ┌───────────────┼────────────────┐
              │               │                │
              ▼               ▼                ▼
        ┌──────────┐    ┌──────────┐    ┌─────────────┐
        │PostgreSQL│    │  Redis   │    │ External    │
        │ + Prisma │    │          │    │ APIs/AI     │
        └──────────┘    └──────────┘    └─────────────┘
                             
                             
                 ┌──────────────────────────┐
                 │        Capacitor         │
                 │       Android App        │
                 └──────────────────────────┘
```

---

# 📂 Project Structure

```text
HACKOUT-PROJECT-TETRASQUAD/
│
├── android/                 # Android / Capacitor project
│
├── backend/                 # Backend API
│   ├── prisma/              # Prisma schema & seed
│   ├── src/
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Authentication/security middleware
│   │   ├── jobs/            # Background jobs
│   │   ├── docs/            # Swagger documentation
│   │   ├── database/        # Database configuration
│   │   └── ...
│   ├── package.json
│   └── .env.example
│
├── src/                     # React frontend
│   ├── components/
│   ├── context/
│   ├── pages/
│   │   └── mobile/
│   ├── ...
│
├── dist/                    # Production frontend build
│
├── package.json
├── capacitor.config.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

The repository currently contains separate `android`, `backend`, `src`, and `dist` directories along with the Vite, Tailwind, and Capacitor configuration files.

---

# 📱 Application Screens

The application contains a mobile-oriented flow with screens/routes including:

1. Splash Screen
2. Login / Sign Up
3. Home Dashboard
4. Charging Station Map
5. Station Details
6. Driver Bookings
7. Smart Charging
8. Charging Session
9. Price & Green Score
10. Charging History
11. Notifications
12. Operator Dashboard
13. Grid Operator Dashboard
14. Station Management
15. Profile & Settings
16. Vehicle Management

These routes and screens are implemented in the main React application.

---

# 🔐 Role-Based Access

EV GreenCharge supports multiple user roles.

### Driver

```text
Login
   ↓
Driver Dashboard
   ↓
Map / Stations / Vehicles / Booking / Charging
```

### Operator

```text
Login
   ↓
Operator Dashboard
   ↓
Station Management / Bookings
```

### Grid Operator

```text
Login
   ↓
Grid Operator Dashboard
```

The frontend implements protected routes for authenticated users as well as separate guards for Driver, Operator, and Grid Operator roles.

---

# 🗄️ Database

The backend uses **PostgreSQL** with **Prisma ORM**.

The database schema includes entities for:

* Users
* Vehicles
* Charging Networks
* Charging Stations
* Station Pricing
* Station Availability
* Hospitals
* Saved Stations
* User Preferences
* Price Alerts
* Notifications
* Charging Sessions
* Bookings
* Payment Methods

This provides a foundation for managing the complete EV-charging workflow.

---

# 🔌 Backend API

The backend exposes REST APIs under `/api`.

Available API modules include:

```text
/api/auth
/api/profile
/api/vehicles
/api/stations
/api/networks
/api/hospitals
/api/pricing
/api/ai
/api/activity
/api/alerts
/api/saved-stations
/api/notifications
```

The backend also provides:

```text
GET /health
```

and interactive Swagger documentation:

```text
/api-docs
```

The API architecture includes security middleware, rate limiting, request logging, centralized error handling, and Swagger documentation.

---

# ⚙️ Installation

## 1. Clone the Repository

```bash
git clone https://github.com/dhrumilkanani47-dev/HACKOUT-PROJECT-TETRASQUAD.git
```

```bash
cd HACKOUT-PROJECT-TETRASQUAD
```

---

# 💻 Frontend Setup

## 2. Install Frontend Dependencies

```bash
npm install
```

## 3. Start Frontend Development Server

```bash
npm run dev
```

Vite will start the development server.

Open the URL displayed in the terminal, normally:

```text
http://localhost:5173
```

---

# 🖥️ Backend Setup

Open another terminal:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

---

## 4. Configure Environment Variables

Create:

```text
backend/.env
```

Use the following structure:

```env
PORT=5000
NODE_ENV=development

DATABASE_URL="postgresql://postgres:postgres@localhost:5432/evgreencharge"

JWT_SECRET="your_secure_jwt_secret"
JWT_EXPIRES_IN="7d"

REDIS_URL="redis://localhost:6379"

DEMO_MODE=true

AI_API_KEY=""
WEATHER_API_KEY=""
MAP_API_KEY=""
GRID_API_KEY=""
RENEWABLE_API_KEY=""

DEFAULT_TIMEZONE="Asia/Kolkata"
```

The repository already provides an `.env.example` containing the expected database, JWT, Redis, demo-mode, API-key and timezone configuration.

> ⚠️ Never commit your real `.env` file or API keys to GitHub.

---

# 🗃️ Database Setup

Make sure PostgreSQL is running.

Create the database:

```text
evgreencharge
```

Then from the backend directory:

```bash
npm run prisma:generate
```

Push the Prisma schema:

```bash
npm run prisma:push
```

Seed demo data:

```bash
npm run prisma:seed
```

---

# ▶️ Start Backend

From:

```text
backend/
```

run:

```bash
npm run dev
```

The backend runs on:

```text
http://localhost:5000
```

Health check:

```text
http://localhost:5000/health
```

Swagger API documentation:

```text
http://localhost:5000/api-docs
```

The server connects to PostgreSQL before starting its HTTP service and also starts background jobs for station telemetry and price-alert processing.

---

# 📱 Android Application

The project supports Android through Capacitor.

First build the frontend:

```bash
npm run build
```

Then synchronize Capacitor:

```bash
npx cap sync android
```

Or use the project script:

```bash
npm run android:sync
```

Open the Android project:

```bash
npx cap open android
```

Or:

```bash
npm run android:open
```

Then build/run the application using Android Studio.

---

# 🧪 Testing

Backend tests can be executed using:

```bash
npm run test:backend
```

From the root project, this runs the backend test suite configured in the repository.

---

# 🛠️ Available Scripts

## Root Project

| Command                | Description                       |
| ---------------------- | --------------------------------- |
| `npm run dev`          | Start frontend development server |
| `npm run dev:backend`  | Start backend development server  |
| `npm run build`        | Build frontend                    |
| `npm run preview`      | Preview production build          |
| `npm run test:backend` | Run backend tests                 |
| `npm run seed:backend` | Seed backend database             |
| `npm run android:sync` | Build and sync Android            |
| `npm run android:open` | Open Android project              |

These commands are defined in the root `package.json`.

---

# 🔒 Security

The backend includes several security mechanisms:

* Helmet security headers
* CORS configuration
* JWT authentication
* Password hashing
* API rate limiting
* Input validation
* Centralized error handling
* Request IDs and structured logging
* Environment-based secrets

Sensitive values should always be stored in environment variables.

---

# 🌱 Environmental Impact

EV GreenCharge is designed around the idea that EV charging should not only be convenient but also environmentally responsible.

The platform stores charging-session information such as:

* Energy consumed
* Charging price
* Energy mix
* Green score
* Carbon estimate
* CO₂ avoided

This allows the platform to provide users with a better understanding of the environmental impact associated with their charging activity.

---

# 📊 Example User Flow

```text
Open EV GreenCharge
        ↓
    Splash Screen
        ↓
    Login / Sign Up
        ↓
   Driver Dashboard
        ↓
 Find Charging Station
        ↓
  View Station Details
        ↓
   Select Charging Slot
        ↓
      Book Slot
        ↓
  Start Charging Session
        ↓
 Monitor Charging Progress
        ↓
 View Cost + Green Score
        ↓
  Charging History
```

---

# 🧩 Backend Flow

```text
React / Android Client
          ↓
       REST API
          ↓
      Express.js
          ↓
 ┌────────┼──────────┐
 ↓        ↓          ↓
Auth   Business   Validation
         Logic
          ↓
       Prisma
          ↓
      PostgreSQL
```

Additional services such as Redis, AI, weather, map, grid and renewable-energy APIs can be connected through environment-based configuration.

---

# 🚧 Current Limitations

The project is actively developed, and some integrations may require additional configuration before production deployment.

In particular:

* External API keys must be configured.
* PostgreSQL must be configured locally or on a server.
* Redis must be available where required.
* Production authentication/security configuration should be reviewed.
* Real payment gateway integration should be configured before production use.
* Real-time station data depends on available external/provider integrations.

---

# 🔮 Future Scope

Potential future improvements include:

* 🔋 Real-time charger telemetry
* 🤖 Advanced AI charging recommendations
* 📈 Electricity-price forecasting
* 🌦️ Weather-aware charging recommendations
* ⚡ Renewable-energy-aware charging
* 💳 Production payment gateway integration
* 🛰️ Real-time GPS/navigation integration
* 🔔 Push notifications
* 📊 Advanced operator analytics
* 🏢 Multi-network charging support
* ☁️ Cloud deployment
* 🔐 Advanced authentication such as OTP/passkeys
* 📱 Production-ready Android release
* 🌍 Expansion to additional regions

---

# 🏆 Hackathon Highlights

### Why EV GreenCharge?

**For Drivers**

> Find → Compare → Book → Charge → Track

**For Operators**

> Manage → Monitor → Optimize

**For Grid Operators**

> Observe → Analyze → Coordinate

**For the Environment**

> Charge Smarter → Reduce Impact → Go Greener

---

# 👥 Team

## Tetra Squad

**Project:** HACKOUT-PROJECT-TETRASQUAD

Built as a hackathon project focused on improving the EV charging experience through a unified digital platform.

---

# 📜 License

This project is currently maintained as a hackathon/project repository.

Before using the project commercially or redistributing it, add an appropriate license and review the licensing requirements for all third-party dependencies and assets.

---

# ⭐ Support the Project

If you find EV GreenCharge useful:

⭐ Star the repository
🍴 Fork the repository
🐛 Report issues
💡 Suggest improvements
🤝 Contribute to the project

---

# 🔗 Repository

**GitHub:**
https://github.com/dhrumilkanani47-dev/HACKOUT-PROJECT-TETRASQUAD

---

## ⚡ EV GreenCharge

### *Charge Smart. Drive Green. Build the Future.*

---
