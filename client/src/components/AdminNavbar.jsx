import { Link, NavLink, useNavigate } from "react-router-dom";

export default function AdminNavbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    navigate("/admin/login");
  };

  const navLinkClass = ({ isActive }) =>
    isActive
      ? "rounded-full bg-red-700 px-4 py-2 text-sm font-black text-white shadow"
      : "rounded-full px-4 py-2 text-sm font-black text-slate-700 hover:bg-slate-100 hover:text-red-700";

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 text-black shadow-sm backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-4 xl:flex-row xl:items-center xl:justify-between">
        {/* BRAND */}
        <Link to="/admin" className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-red-700 bg-white shadow-sm">
            <span className="text-xl font-black text-red-700">Q</span>
          </div>

          <div>
            <p className="text-xl font-black leading-tight">
              The <span className="text-red-700">Q</span>ueensMen
            </p>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
              Admin Panel
            </p>
          </div>
        </Link>

        {/* NAV LINKS */}
        <nav className="flex flex-wrap items-center gap-2">
          <NavLink to="/admin" end className={navLinkClass}>
            Dashboard
          </NavLink>

          <NavLink to="/admin/models" className={navLinkClass}>
            Models
          </NavLink>

          <NavLink to="/admin/flyers" className={navLinkClass}>
            Flyers
          </NavLink>

          <NavLink to="/admin/applications" className={navLinkClass}>
            Applications
          </NavLink>

          <NavLink to="/admin/bookings" className={navLinkClass}>
            Bookings
          </NavLink>

          <NavLink to="/admin/messages" className={navLinkClass}>
            Messages
          </NavLink>

          <NavLink to="/admin/settings" className={navLinkClass}>
            Settings
          </NavLink>

          <Link
            to="/"
            className="rounded-full border border-slate-300 px-4 py-2 text-sm font-black text-slate-900 hover:border-black hover:bg-black hover:text-white"
          >
            View Site
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-full border border-red-700 px-4 py-2 text-sm font-black text-red-700 hover:bg-red-700 hover:text-white"
          >
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
}
