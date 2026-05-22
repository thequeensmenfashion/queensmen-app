import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import API from "../api/api";

export default function AdminNavbar() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    let ignore = false;

    const fetchSettings = async () => {
      try {
        const { data } = await API.get("/api/settings");

        if (!ignore) {
          setSettings(data.settings || null);
        }
      } catch (error) {
        console.error("Fetch admin navbar settings error:", error);

        if (!ignore) {
          setSettings(null);
        }
      }
    };

    fetchSettings();

    return () => {
      ignore = true;
    };
  }, []);

  const businessName = settings?.businessName || "The QueensMen";
  const logo = settings?.logo || "";

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
          {logo ? (
            <div className="flex h-14 w-24 items-center justify-center overflow-hidden rounded-xl border border-red-700 bg-white p-1 shadow-sm">
              <img
                src={logo}
                alt={`${businessName} logo`}
                className="h-full w-full object-contain"
              />
            </div>
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-red-700 bg-white shadow-sm">
              <span className="text-xl font-black text-red-700">Q</span>
            </div>
          )}

          <div>
            <p className="text-xl font-black leading-tight">
              {businessName === "The QueensMen" ? (
                <>
                  The <span className="text-red-700">Q</span>ueensMen
                </>
              ) : (
                businessName
              )}
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
          <NavLink to="/admin/change-password" className={navLinkClass}>
            Password
          </NavLink>
          <NavLink to="/admin/system-check" className={navLinkClass}>
            System
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
