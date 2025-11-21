# 📌 MERN Project Management App
A full-stack project and task management system built with **MongoDB, Express, React, Node.js**, with **JWT Authentication**, user roles, project/task CRUD APIs, and a Vite React client.

## 🚀 Features

### 🔐 Authentication
- Register new users (Admin / Project Manager / Team Member)
- Login with JWT
- Protected routes
- `GET /api/auth/me`

### 📁 Project Management
- Create Projects
- Assign manager
- Add/remove project members
- View projects
- View single project with tasks

### 📝 Task Management
- Create tasks
- Assign tasks
- Update status
- Filter tasks

### 👥 User Management
- User roles
- Managers & team members
- Projects assigned
- Direct reports

## 🧱 Tech Stack
- **Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT, bcrypt
- **Frontend:** React (Vite), React Router, Axios, Context API

## 📂 Folder Structure
mern-task-app/
├── server/
└── client/

## 🔧 Installation & Setup

### Backend
cd server  
npm install

Create `.env`:
MONGO_URI=...
JWT_SECRET=...
JWT_EXPIRES=7d
PORT=5000

npm start

### Frontend
cd client  
npm install  

Create `.env`:
VITE_API_URL=http://localhost:5000/api

npm run dev

## 🌍 Deployment
Backend → Render  
Frontend → Vercel  
https://mern-task-app-two.vercel.app/
