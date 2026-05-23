import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import API from "../api/api";

export default function AdminNavbar() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [contentOpen, setContentOpen] = useState(false);
  const [requestsOpen, setRequestsOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);

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

  const closeAllMenus = () => {
    setMenuOpen(false);
    setContentOpen(false);
    setRequestsOpen(false);
    setAdminOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    closeAllMenus();
    navigate("/admin/login");
  };

  const navLinkClass = ({ isActive }) =>
    isActive
      ? "rounded-full bg-red-700 px-4 py-2 text-sm font-black text-white shadow"
      : "rounded-full px-4 py-2 text-sm font-black text-slate-700 hover:bg-slate-100 hover:text-red-700";

  const dropdownLinkClass = ({ isActive }) =>
    isActive
      ? "block rounded-xl bg-red-700 px-4 py-3 text-sm font-black text-white"
      : "block rounded-xl px-4 py-3 text-sm font-black text-slate-700 hover:bg-slate-100 hover:text-red-700";

  const Dropdown = ({ label, open, setOpen, children }) => (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="rounded-full px-4 py-2 text-sm font-black text-slate-700 hover:bg-slate-100 hover:text-red-700"
      >
        {label} {open ? "▲" : "▼"}
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-3 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl">
          {children}
        </div>
      )}
    </div>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 text-black shadow-sm backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
        {/* BRAND */}
        <Link
          to="/admin"
          onClick={closeAllMenus}
          className="flex items-center gap-3"
        >
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
            <p className="text-lg font-black leading-tight md:text-xl">
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

        {/* DESKTOP NAV */}
        <nav className="hidden items-center gap-2 lg:flex">
          <NavLink to="/admin" end className={navLinkClass}>
            Dashboard
          </NavLink>

          <Dropdown label="Content" open={contentOpen} setOpen={setContentOpen}>
            <NavLink
              to="/admin/models"
              onClick={closeAllMenus}
              className={dropdownLinkClass}
            >
              Models
            </NavLink>

            <NavLink
              to="/admin/flyers"
              onClick={closeAllMenus}
              className={dropdownLinkClass}
            >
              Flyers
            </NavLink>

            <NavLink
              to="/admin/settings"
              onClick={closeAllMenus}
              className={dropdownLinkClass}
            >
              Settings
            </NavLink>
          </Dropdown>

          <Dropdown
            label="Requests"
            open={requestsOpen}
            setOpen={setRequestsOpen}
          >
            <NavLink
              to="/admin/applications"
              onClick={closeAllMenus}
              className={dropdownLinkClass}
            >
              Applications
            </NavLink>

            <NavLink
              to="/admin/bookings"
              onClick={closeAllMenus}
              className={dropdownLinkClass}
            >
              Bookings
            </NavLink>

            <NavLink
              to="/admin/messages"
              onClick={closeAllMenus}
              className={dropdownLinkClass}
            >
              Messages
            </NavLink>
          </Dropdown>

          <Dropdown label="Admin" open={adminOpen} setOpen={setAdminOpen}>
            <NavLink
              to="/admin/users"
              onClick={closeAllMenus}
              className={dropdownLinkClass}
            >
              Admins
            </NavLink>

            <NavLink
              to="/admin/change-password"
              onClick={closeAllMenus}
              className={dropdownLinkClass}
            >
              Password
            </NavLink>

            <NavLink
              to="/admin/system-check"
              onClick={closeAllMenus}
              className={dropdownLinkClass}
            >
              System Check
            </NavLink>
          </Dropdown>

          <Link
            to="/"
            onClick={closeAllMenus}
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

        {/* MOBILE BUTTON */}
        <button
          type="button"
          onClick={() => setMenuOpen((prev) => !prev)}
          className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-black text-slate-900 lg:hidden"
        >
          {menuOpen ? "Close" : "Menu"}
        </button>
      </div>

      {/* MOBILE NAV */}
      {menuOpen && (
        <nav className="border-t border-slate-200 bg-white px-6 py-5 shadow-lg lg:hidden">
          <div className="grid gap-3">
            <NavLink
              to="/admin"
              end
              onClick={closeAllMenus}
              className={dropdownLinkClass}
            >
              Dashboard
            </NavLink>

            <div className="rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-200">
              <p className="mb-2 text-xs font-black uppercase tracking-widest text-red-700">
                Content
              </p>

              <NavLink
                to="/admin/models"
                onClick={closeAllMenus}
                className={dropdownLinkClass}
              >
                Models
              </NavLink>

              <NavLink
                to="/admin/flyers"
                onClick={closeAllMenus}
                className={dropdownLinkClass}
              >
                Flyers
              </NavLink>

              <NavLink
                to="/admin/settings"
                onClick={closeAllMenus}
                className={dropdownLinkClass}
              >
                Settings
              </NavLink>
            </div>

            <div className="rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-200">
              <p className="mb-2 text-xs font-black uppercase tracking-widest text-red-700">
                Requests
              </p>

              <NavLink
                to="/admin/applications"
                onClick={closeAllMenus}
                className={dropdownLinkClass}
              >
                Applications
              </NavLink>

              <NavLink
                to="/admin/bookings"
                onClick={closeAllMenus}
                className={dropdownLinkClass}
              >
                Bookings
              </NavLink>

              <NavLink
                to="/admin/messages"
                onClick={closeAllMenus}
                className={dropdownLinkClass}
              >
                Messages
              </NavLink>
            </div>

            <div className="rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-200">
              <p className="mb-2 text-xs font-black uppercase tracking-widest text-red-700">
                Admin
              </p>

              <NavLink
                to="/admin/users"
                onClick={closeAllMenus}
                className={dropdownLinkClass}
              >
                Admins
              </NavLink>

              <NavLink
                to="/admin/change-password"
                onClick={closeAllMenus}
                className={dropdownLinkClass}
              >
                Password
              </NavLink>

              <NavLink
                to="/admin/system-check"
                onClick={closeAllMenus}
                className={dropdownLinkClass}
              >
                System Check
              </NavLink>
            </div>

            <Link
              to="/"
              onClick={closeAllMenus}
              className="rounded-full border border-slate-300 px-4 py-3 text-center text-sm font-black text-slate-900 hover:border-black hover:bg-black hover:text-white"
            >
              View Site
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full border border-red-700 px-4 py-3 text-sm font-black text-red-700 hover:bg-red-700 hover:text-white"
            >
              Logout
            </button>
          </div>
        </nav>
      )}
    </header>
  );
}
