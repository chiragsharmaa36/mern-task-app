import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import ProjectsList from "./pages/ProjectsList";
import ProjectDetail from "./pages/ProjectDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";

export default function App() {
  return (
    <div style={{ fontFamily: "Inter, system-ui, Arial", padding: 20 }}>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <h1 style={{ margin: 0 }}>MERN Task App — Demo</h1>
        <nav>
          <Link to="/" style={{ marginRight: 12 }}>
            Projects
          </Link>
          <Link to="/login" style={{ marginRight: 8 }}>
            Login
          </Link>
          <Link to="/register" style={{ marginRight: 8 }}>
            Register
          </Link>
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<ProjectsList />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
        </Routes>
      </main>
    </div>
  );
}
