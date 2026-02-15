# 🚀 Kaizen Intelligence (JR_42)

A Full-Stack Smart PCB Inventory & Production Automation System

🔗 GitHub Repository:  
https://github.com/RijuMishra/JR_42

---

## 📌 Project Overview

Kaizen Intelligence is a full-stack production and inventory automation system built to manage PCB components, automate stock deduction during manufacturing, and generate real-time analytics insights.

This system integrates:

Frontend → Backend API → PostgreSQL Database

All production logic, stock validation, and shortage analytics are handled at backend service level.

---

## 🧠 Tech Stack

### Frontend
- React.js
- Axios
- Tailwind CSS
- Vercel (Deployment)

### Backend
- Node.js
- Express.js
- JWT Authentication
- PostgreSQL
- Render (Deployment)

### Database
- PostgreSQL (Supabase Hosted)

---

## 🏗 System Architecture

User → React Frontend → Express API → PostgreSQL (Supabase)

All communication is handled through REST APIs.

JWT Middleware protects sensitive routes such as:
- Production Entry
- Analytics Dashboard
- Shortage Analysis

Relational integrity is maintained using Foreign Keys:
- pcb_components
- production_entries
- consumption_history

---

## ✨ Core Features

### 1️⃣ Component Inventory Management
- Add / Edit / Delete components
- Track stock levels
- Monthly requirement tracking
- Stock validation logic

---

### 2️⃣ PCB – Component Mapping (BOM Management)
- Define Bill of Materials per PCB
- Map required component quantities
- Stored using relational schema

---

### 3️⃣ Production Entry – Automation Engine
When production is recorded:
- BOM validation occurs
- Stock is checked
- Components are deducted automatically
- Consumption history is logged

No manual stock calculation required.

---

### 4️⃣ Shortage & Analytics Dashboard
- Shortage percentage calculation
- Inventory health status
- Low stock alerts
- Fulfillment distribution
- Predictive procurement indicators

All analytics are calculated dynamically using SQL aggregation queries.

---

### 5️⃣ Import / Export Module
- Bulk Excel import
- Inventory export reports
- Structured reporting for procurement

---

### 6️⃣ Authentication & Security
- JWT-based authentication
- Protected API routes
- Secure environment variables
- Role-based user management

---

## 🗄 Database Structure

Tables Used:

- users
- components
- pcbs
- pcb_components
- production_entries
- consumption_history

Relational Mapping:

pcb_components → Links PCBs and Components  
production_entries → Records manufacturing  
consumption_history → Logs deduction events  

Foreign key constraints ensure data integrity.

---

## 🔧 Installation & Setup

### 📦 Prerequisites

Make sure you have installed:

- Node.js (v18+ recommended)
- npm or yarn
- Git
- PostgreSQL (local) OR Supabase account
- VS Code

---

### 🔹 Clone Repository

```bash
git clone https://github.com/RijuMishra/JR_42.git
cd JR_42
```

---

### 🔹 Backend Setup

```bash
cd backend
npm install
```

Create `.env` file inside backend folder:

```
PORT=10000
DATABASE_URL=your_postgres_connection_string
JWT_SECRET=your_secret_key
```

Run backend:

```bash
npm start
```

Server runs at:

```
http://localhost:10000
```

---

### 🔹 Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at:

```
http://localhost:5173
```

---

## 🌐 Deployment

Backend → Render  
Frontend → Vercel  
Database → Supabase PostgreSQL  

Environment variables must be configured in Render dashboard.

---

## 🔐 Security Implementation

- JWT token validation middleware
- Protected production routes
- Authenticated analytics endpoints
- Environment-based secret storage

---

## ⚙️ Core Backend Logic Flow

Production Entry →
Validate BOM →
Check Inventory →
Deduct Components →
Record History →
Update Analytics

This ensures:
- No negative inventory
- Accurate stock tracking
- Complete traceability

---

## 📊 Analytics Logic

Shortage is calculated using:

- SUM(quantity_required)
- Stock comparison
- GREATEST() SQL function
- Percentage calculation
- Threshold-based stock health classification

---

## 📈 Future Scope

- Predictive procurement AI
- Role-based admin dashboard
- Real-time alert system
- Cloud storage integration

---

## 👨‍💻 Author

Developed as a Full-Stack Production & Inventory Automation System  
Project Name: JR_42