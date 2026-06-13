import React, { useEffect, useState, useMemo } from "react";

const GRADIENTS = [
  "from-pink-500 to-rose-500",
  "from-purple-500 to-indigo-500",
  "from-blue-500 to-cyan-500",
  "from-green-500 to-emerald-500",
  "from-orange-500 to-amber-500",
  "from-teal-500 to-cyan-400",
  "from-violet-500 to-purple-400",
  "from-red-500 to-orange-400",
];

const COMPANIES = [
  "Acme Corp",
  "Globex Inc",
  "Initech",
  "Umbrella Ltd",
  "Hooli",
  "Stark Industries",
  "Wayne Enterprises",
  "Wonka Co",
  "Dunder Mifflin",
  "Pied Piper",
  "Massive Dynamic",
  "Cyberdyne Systems",
];

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("https://randomuser.me/api/?results=12&seed=samsung");
      if (!res.ok) throw new Error("Failed to connect to API");
      const data = await res.json();
      const enriched = data.results.map((u, i) => ({
        id: u.login.uuid,
        name: `${u.name.first} ${u.name.last}`,
        email: u.email,
        phone: u.phone,
        country: u.location.country,
        city: u.location.city,
        picture: u.picture.medium,
        company: COMPANIES[i % COMPANIES.length],
        online: Math.random() > 0.45,
        addedMinutesAgo: Math.floor(Math.random() * 120),
        gradient: GRADIENTS[i % GRADIENTS.length],
        initials: `${u.name.first[0]}${u.name.last[0]}`.toUpperCase(),
      }));
      setUsers(enriched);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filtered = useMemo(() => {
    let result = [...users];
    if (filter === "online") result = result.filter((u) => u.online);
    if (filter === "recent") result = result.filter((u) => u.addedMinutesAgo <= 30);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.company.toLowerCase().includes(q) ||
          u.country.toLowerCase().includes(q)
      );
    }
    return result;
  }, [users, search, filter]);

  const stats = useMemo(() => ({
    total: filtered.length,
    active: filtered.filter((u) => u.online).length,
    orgs: new Set(filtered.map((u) => u.company)).size,
    countries: new Set(filtered.map((u) => u.country)).size,
  }), [filtered]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white px-4 py-6 sm:px-6 lg:px-8">

      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          UserHub{" "}
          <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            Explorer
          </span>
        </h1>
        <p className="text-slate-400 mt-1 text-sm">
          Live user directory powered by RandomUser API
        </p>
      </header>

      {/* Stats Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <StatTile label="Total Users" value={stats.total} icon="👥" color="from-blue-600 to-cyan-500" />
        <StatTile label="Active Sessions" value={stats.active} icon="🟢" color="from-green-600 to-emerald-500" />
        <StatTile label="Organizations" value={stats.orgs} icon="🏢" color="from-violet-600 to-purple-500" />
        <StatTile label="Countries" value={stats.countries} icon="🌍" color="from-orange-600 to-amber-500" />
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
          <input
            type="text"
            placeholder="Search by name, email, company or country..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent backdrop-blur transition"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["all", "online", "recent"].map((f) => (
            <FilterBtn key={f} active={filter === f} onClick={() => setFilter(f)}>
              {f === "all" ? "All Users" : f === "online" ? "🟢 Online" : "🕐 Recently Added"}
            </FilterBtn>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="w-14 h-14 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400 text-sm animate-pulse">Fetching users from API...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-500/10 border border-red-400/30 rounded-2xl p-8 text-center max-w-md mx-auto">
          <p className="text-4xl mb-3">⚠️</p>
          <p className="text-red-300 font-semibold mb-1">Failed to load users</p>
          <p className="text-red-400 text-sm mb-4">{error}</p>
          <button
            onClick={fetchUsers}
            className="px-5 py-2 bg-red-500 hover:bg-red-600 rounded-xl text-sm font-semibold transition-all"
          >
            Retry
          </button>
        </div>
      )}

      {/* User Grid */}
      {!loading && !error && (
        <>
          <p className="text-slate-400 text-xs mb-4">
            Showing {filtered.length} of {users.length} users
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((u) => (
              <UserCard key={u.id} user={u} />
            ))}
            {filtered.length === 0 && (
              <div className="col-span-full text-center py-16">
                <p className="text-4xl mb-3">🔍</p>
                <p className="text-slate-400">No users match your search or filters.</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function StatTile({ label, value, icon, color }) {
  return (
    <div className={`bg-gradient-to-br ${color} rounded-2xl p-4 shadow-lg`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xl">{icon}</span>
      </div>
      <p className="text-3xl font-bold">{value}</p>
      <p className="text-xs opacity-90 mt-1 font-medium">{label}</p>
    </div>
  );
}

function FilterBtn({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-150 whitespace-nowrap ${
        active
          ? "bg-indigo-500 text-white shadow-md shadow-indigo-500/30"
          : "bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}

function UserCard({ user }) {
  return (
    <div className="group bg-white/8 backdrop-blur-md border border-white/10 rounded-2xl p-4 hover:scale-[1.02] hover:shadow-2xl hover:border-white/25 hover:bg-white/12 transition-all duration-200 cursor-default">
      {/* Avatar + Status */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative shrink-0">
          <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${user.gradient} flex items-center justify-center font-bold text-sm text-white shadow-lg`}>
            {user.initials}
          </div>
          <span
            className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-slate-800 ${
              user.online ? "bg-green-400" : "bg-slate-500"
            }`}
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-sm truncate">{user.name}</p>
          <p className="text-xs text-slate-400 mt-0.5">
            {user.online ? "🟢 Online now" : `⚫ ${user.addedMinutesAgo}m ago`}
          </p>
        </div>
      </div>

      {/* Info */}
      <div className="space-y-1.5 text-xs">
        <InfoRow icon="✉️" text={user.email} truncate />
        <InfoRow icon="📱" text={user.phone} />
        <InfoRow icon="🏢" text={user.company} />
        <InfoRow icon="📍" text={`${user.city}, ${user.country}`} />
      </div>

      {/* Badge */}
      <div className="mt-3 pt-3 border-t border-white/10">
        <span className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium ${
          user.online ? "bg-green-500/20 text-green-300" : "bg-slate-500/20 text-slate-400"
        }`}>
          {user.online ? "Active" : "Inactive"}
        </span>
      </div>
    </div>
  );
}

function InfoRow({ icon, text, truncate }) {
  return (
    <div className="flex items-center gap-2 text-slate-300">
      <span className="shrink-0">{icon}</span>
      <span className={truncate ? "truncate" : ""}>{text}</span>
    </div>
  );
}
