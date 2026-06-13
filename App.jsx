import React, { useState } from "react";
import Dashboard from "./Dashboard";
import ContactForm from "./ContactForm";

export default function App() {
  const [view, setView] = useState("dashboard");

  return (
    <div>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/90 backdrop-blur text-white flex gap-2 p-3 text-sm">
        <button
          onClick={() => setView("dashboard")}
          className={`px-3 py-1.5 rounded-lg ${view === "dashboard" ? "bg-indigo-500" : "bg-white/10"}`}
        >
          UserHub Dashboard
        </button>
        <button
          onClick={() => setView("form")}
          className={`px-3 py-1.5 rounded-lg ${view === "form" ? "bg-indigo-500" : "bg-white/10"}`}
        >
          Contact Form
        </button>
      </nav>
      <div className="pt-12">
        {view === "dashboard" ? <Dashboard /> : <ContactForm />}
      </div>
    </div>
  );
}
