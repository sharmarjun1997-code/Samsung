import React, { useState } from "react";
import Dashboard from "./components/Dashboard.jsx";
import ContactForm from "./components/ContactForm.jsx";

export default function App() {
  const [view, setView] = useState("dashboard");

  return (
    <div className="min-h-screen">
      {/* Top Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-white/10 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white">
              S
            </div>
            <span className="text-white font-semibold text-sm hidden sm:inline">
              Samsung Case Study
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setView("dashboard")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                view === "dashboard"
                  ? "bg-indigo-500 text-white shadow-md"
                  : "bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white"
              }`}
            >
              UserHub Dashboard
            </button>
            <button
              onClick={() => setView("form")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                view === "form"
                  ? "bg-indigo-500 text-white shadow-md"
                  : "bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white"
              }`}
            >
              Contact Form
            </button>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <div className="pt-14">
        {view === "dashboard" ? <Dashboard /> : <ContactForm />}
      </div>
    </div>
  );
}
