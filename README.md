# ParcelX

ParcelX is a full-stack parcel tracking and courier logistics management system designed to simulate a real-world delivery platform. The system supports public parcel tracking, customer shipment requests, admin parcel management, staff parcel movement updates, driver delivery handling, QR parcel labels, map-based location viewing, reports, authentication, role-based access, and MySQL database integration.

## Project Overview

ParcelX manages the parcel lifecycle from shipment creation to delivery. A parcel can be created by a customer, admin, or staff member, assigned to a driver, moved between hubs, tracked through timeline events, and completed through driver delivery actions.

The system is divided into several portals:

- Public tracking page
- Customer portal
- Admin dashboard
- Staff panel
- Driver panel

## Main Features

### Public Features

- Public parcel tracking using tracking number
- Parcel status display
- Parcel tracking timeline
- Latest location display
- Estimated delivery information

### Customer Portal

- Customer login
- Customer dashboard
- Create shipment request
- View shipment history
- View shipment details
- View tracking timeline
- View shipment QR code

### Admin Dashboard

- Admin login
- Dashboard statistics
- Parcel management
- Parcel details page
- Printable parcel label
- Branch and hub management
- Driver management
- Driver assignment
- Reports and analytics
- CSV export
- Printable reports
- Notifications page

### Staff Panel

- Staff login
- Staff dashboard
- Scan or search parcel by tracking number
- Update parcel movement status
- Add tracking timeline events
- Register walk-in parcels

### Driver Panel

- Driver login
- View assigned parcels
- View delivery details
- Mark parcel as delivered
- Mark parcel as failed
- Proof of delivery interface

### Security and Access Control

- JWT authentication
- Role-based access control
- Password hashing with bcrypt
- Protected backend routes
- Angular route guards
- Authorization header interceptor
- Logout functionality

### Real-App Features

- QR code parcel label
- Printable shipping label
- Leaflet map with OpenStreetMap
- Tracking timeline
- CSV report export
- MySQL database integration
- Express.js REST API

## Tech Stack

### Frontend

- Angular
- TypeScript
- Tailwind CSS
- Angular Router
- Angular HttpClient

### Backend

- Node.js
- Express.js
- TypeScript
- MySQL2
- JWT
- bcryptjs
- dotenv
- CORS

### Database

- MySQL

## System Roles

| Role | Description |
|---|---|
| Admin | Manages parcels, branches, drivers, assignments, notifications, and reports |
| Staff | Scans parcels, registers walk-in parcels, and updates parcel movement |
| Driver | Views assigned parcels and updates delivery outcome |
| Customer | Creates shipments and views shipment history |

## Test Accounts

After running the user seed script, use these accounts:

| Role | Email | Password |
|---|---|---|
| Admin | admin@parcelx.com | Admin@123 |
| Staff | staff@parcelx.com | Staff@123 |
| Driver | driver@parcelx.com | Driver@123 |
| Customer | customer@parcelx.com | Customer@123 |

## Sample Tracking Numbers

```text
PXL202605120001
PXL202605120002
PXL202605120003
```

## Project Structure

```text
parcelx/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── scripts/
│   │   ├── services/
│   │   ├── types/
│   │   ├── utils/
│   │   ├── app.ts
│   │   └── server.ts
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
├── database/
│   └── parcelx_db.sql
│
├── screenshots/
│
├── src/
│   ├── app/
│   │   ├── core/
│   │   ├── features/
│   │   ├── layouts/
│   │   └── shared/
│   ├── styles.css
│   └── main.ts
│
├── README.md
├── LICENSE
├── angular.json
└── package.json
```

## Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/rabbitDLaLune/parcelX.git
cd parcelX
```

### 2. Install Frontend Dependencies

From the project root:

```bash
npm install
```

### 3. Install Backend Dependencies

```bash
cd backend
npm install
```

### 4. Create Backend Environment File

Create a `.env` file inside the `backend` folder:

```text
backend/.env
```

Use this template:

```env
PORT=5000
FRONTEND_URL=http://localhost:4200

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=parcelx_db

JWT_SECRET=change_this_secret
JWT_EXPIRES_IN=1d
```

A safe example file is provided as:

```text
backend/.env.example
```

Do not upload the real `.env` file to GitHub.

### 5. Import Database

Open MySQL Workbench and run the SQL file:

```text
database/parcelx_db.sql
```

This will create the ParcelX database tables and sample data.

### 6. Seed Test Users

From the backend folder:

```bash
npm run seed:users
```

This creates test users with hashed passwords.

### 7. Run Backend API

From the backend folder:

```bash
npm run dev
```

Backend runs at:

```text
http://localhost:5000
```

Test the API health endpoint:

```text
http://localhost:5000/api/health
```

### 8. Run Angular Frontend

From the project root:

```bash
ng serve -o
```

Frontend runs at:

```text
http://localhost:4200
```

## Main Routes

### Public

```text
/
 /track
/login
/register
```

### Admin

```text
/admin/dashboard
/admin/parcels
/admin/parcels/add
/admin/parcels/:id
/admin/parcels/:id/label
/admin/branches
/admin/drivers
/admin/assign-driver
/admin/reports
/admin/notifications
```

### Staff

```text
/staff/dashboard
/staff/scan
/staff/update-movement
/staff/register-parcel
```

### Driver

```text
/driver/dashboard
/driver/parcels
/driver/parcels/:id
```

### Customer

```text
/customer/dashboard
/customer/create-shipment
/customer/shipments
/customer/shipments/:id
```

## API Endpoints

### Auth

```text
POST /api/auth/login
GET  /api/auth/me
```

### Tracking

```text
GET /api/tracking/:trackingNumber
```

### Parcels

```text
GET  /api/parcels
POST /api/parcels
GET  /api/parcels/:id
POST /api/parcels/:id/status
POST /api/parcels/:id/assign-driver
POST /api/parcels/:id/delivered
POST /api/parcels/:id/failed
```

### Reports

```text
GET /api/reports/summary
GET /api/reports/parcels
GET /api/reports/revenue
GET /api/reports/drivers
```

## Database Tables

The main database tables include:

- users
- branches
- drivers
- parcels
- tracking_events

## Parcel Status Flow

ParcelX supports the following parcel status values:

```text
CREATED
PENDING_PICKUP
PICKED_UP
ARRIVED_ORIGIN_HUB
DEPARTED_ORIGIN_HUB
ARRIVED_SORTING_HUB
IN_TRANSIT
ARRIVED_DESTINATION_HUB
ASSIGNED_TO_DRIVER
OUT_FOR_DELIVERY
DELIVERED
DELIVERY_FAILED
RETURNED_TO_HUB
RETURNED_TO_SENDER
CANCELLED
```

## Typical System Flow

```text
Customer/Admin/Staff creates shipment
↓
Tracking number is generated
↓
Parcel status starts as CREATED
↓
Staff updates parcel movement
↓
Parcel moves between branches/hubs
↓
Admin or staff assigns parcel to driver
↓
Driver delivers parcel
↓
Driver marks parcel as delivered or failed
↓
Customer/public user tracks parcel timeline
```

## Running the Project

Use two terminals.

### Terminal 1: Backend

```bash
cd backend
npm run dev
```

### Terminal 2: Frontend

```bash
ng serve -o
```

## Build Commands

### Frontend Build

```bash
ng build
```

### Backend Build

```bash
cd backend
npm run build
npm start
```

## Notes

- The backend `.env` file is required for database connection and JWT authentication.
- Passwords are stored as bcrypt hashes.
- JWT tokens are stored in localStorage during login.
- Angular sends the JWT token using the Authorization header.
- Public parcel tracking does not require login.
- Admin, staff, driver, and customer pages are protected using route guards.
- The report module supports CSV export and print view.
- Leaflet and OpenStreetMap are used for the map feature.

## License

This project is licensed under the MIT License. See the `LICENSE` file for more details.
