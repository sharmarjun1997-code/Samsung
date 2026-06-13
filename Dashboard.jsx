import React, { useEffect, useState, useMemo } from "react";

const GRADIENTS = [
  "from-pink-500 to-rose-500",
  "from-purple-500 to-indigo-500",
  "from-blue-500 to-cyan-500",
  "from-green-500 to-emerald-500",
  "from-orange-500 to-amber-500",
];

const COMPANIES = ["Acme Corp", "Globex", "Initech", "Umbrella Inc", "Hooli", "Stark Industries", "Wayne Enterprises", "Wonka Co"];

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all"); // all | online | recent

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("https://randomuser.me/api/?results=12");
      if (!res.ok) throw new Error("Network response was not ok");
      const data = await res.json();
      const enriched = data.results.map((u, i) => ({
        id: u.login.uuid,
        name: `${u.name.first} ${u.name.last}`,
        email: u.email,
        phone: u.phone,
        country: u.location.country,
        picture: u.picture.thumbnail,
        company: COMPANIES[i % COMPANIES.length],
        online: Math.random() > 0.4,
        addedMinutesAgo: Math.floor(Math.random() * 120),
        gradient: GRADIENTS[i % GRADIENTS.length],
        initials: `${u.name.first[0]}${u.name.last[0]}`.toUpperCase(),
      }));
      setUsers(enriched);
    } catch (err) {
      setError(err.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filtered = useMemo(() => {
    let result = users;
    if (filter === "online") result = result.filter((u) => u.online);
    if (filter === "recent") result = result.filter((u) => u.addedMinutesAgo <= 30);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.company.toLowerCase().includes(q)
      );
    }
    return result;
  }, [users, search, filter]);

  const stats = useMemo(() => {
    const total = filtered.length;
    const active = filtered.filter((u) => u.online).length;
    const orgs = new Set(filtered.map((u) => u.company)).size;
    const countries = new Set(filtered.map((u) => u.country)).size;
    return { total, active, orgs, countries };
  }, [filtered]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white p-4 sm:p-6 lg:p-8">
      <header className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">UserHub Explorer</h1>
        <p className="text-slate-400 text-sm mt-1">Live directory powered by RandomUser API</p>
      </header>

      {/* Stats Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <StatTile label="Total Users" value={stats.total} color="from-blue-500 to-cyan-400" />
        <StatTile label="Active Sessions" value={stats.active} color="from-green-500 to-emerald-400" />
        <StatTile label="Organizations" value={stats.orgs} color="from-purple-500 to-pink-400" />
        <StatTile label="Countries" value={stats.countries} color="from-orange-500 to-amber-400" />
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Search by name, email, or company..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 backdrop-blur"
        />
        <div className="flex gap-2">
          <FilterBtn active={filter === "all"} onClick={() => setFilter("all")}>All Users</FilterBtn>
          <FilterBtn active={filter === "online"} onClick={() => setFilter("online")}>Online Only</FilterBtn>
          <FilterBtn active={filter === "recent"} onClick={() => setFilter("recent")}>Recently Added</FilterBtn>
        </div>
      </div>

      {/* Content */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin" />
          <p className="mt-4 text-slate-400">Fetching users...</p>
        </div>
      )}

      {error && !loading && (
        <div className="bg-red-500/10 border border-red-400/30 rounded-xl p-6 text-center">
          <p className="text-red-300 font-medium mb-3">⚠️ {error}. Showing fallback content.</p>
          <button
            onClick={fetchUsers}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-sm font-medium transition"
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((u) => (
            <UserCard key={u.id} user={u} />
          ))}
          {filtered.length === 0 && (
            <p className="col-span-full text-center text-slate-400 py-10">No users match your filters.</p>
          )}
        </div>
      )}
    </div>
  );
}

function StatTile({ label, value, color }) {
  return (
    <div className={`bg-gradient-to-br ${color} rounded-xl p-4 shadow-lg`}>
      <p className="text-2xl sm:text-3xl font-bold">{value}</p>
      <p className="text-xs sm:text-sm opacity-90 mt-1">{label}</p>
    </div>
  );
}

function FilterBtn({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition whitespace-nowrap ${
        active ? "bg-indigo-500 text-white" : "bg-white/10 text-slate-300 hover:bg-white/20"
      }`}
    >
      {children}
    </button>
  );
}

function UserCard({ user }) {
  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4 hover:scale-[1.02] hover:shadow-xl hover:border-white/30 transition-all duration-200">
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${user.gradient} flex items-center justify-center font-bold text-sm shrink-0`}>
          {user.initials}
        </div>
        <div className="min-w-0">
          <p className="font-semibold truncate">{user.name}</p>
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span className={`w-2 h-2 rounded-full ${user.online ? "bg-green-400" : "bg-slate-500"}`} />
            {user.online ? "Online" : "Offline"}
          </div>
        </div>
      </div>
      <div className="space-y-1 text-xs text-slate-300">
        <p className="truncate">✉️ {user.email}</p>
        <p>📱 {user.phone}</p>
        <p>🏢 {user.company}</p>
        <p>🌍 {user.country}</p>
      </div>
    </div>
  );
}
