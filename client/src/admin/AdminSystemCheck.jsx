import { useEffect, useState } from "react";
import API from "../api/api";
import AdminNavbar from "../components/AdminNavbar";

export default function AdminSystemCheck() {
  const [checks, setChecks] = useState({
    token: false,
    adminUser: false,
    backend: false,
    settings: false,
    dashboard: false,
  });

  const [details, setDetails] = useState({
    adminName: "",
    adminEmail: "",
    backendMessage: "",
    settingsMessage: "",
    dashboardMessage: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    const runChecks = async () => {
      try {
        setLoading(true);

        const token = localStorage.getItem("adminToken");
        const adminUser = JSON.parse(localStorage.getItem("adminUser") || "{}");

        const newChecks = {
          token: Boolean(token),
          adminUser: Boolean(adminUser?.email),
          backend: false,
          settings: false,
          dashboard: false,
        };

        const newDetails = {
          adminName: adminUser?.name || "Not found",
          adminEmail: adminUser?.email || "Not found",
          backendMessage: "",
          settingsMessage: "",
          dashboardMessage: "",
        };

        try {
          const { data } = await API.get("/api/health");
          newChecks.backend = true;
          newDetails.backendMessage =
            data.message || "Backend connected successfully.";
        } catch (error) {
          console.error("Backend health check failed:", error);
          newDetails.backendMessage = "Backend health check failed.";
        }

        try {
          const { data } = await API.get("/api/settings");
          newChecks.settings = true;
          newDetails.settingsMessage = data.settings
            ? "Settings loaded successfully."
            : "Settings route works, but no settings were returned.";
        } catch (error) {
          console.error("Settings check failed:", error);
          newDetails.settingsMessage = "Settings check failed.";
        }

        try {
          const { data } = await API.get("/api/dashboard/stats");
          newChecks.dashboard = true;
          newDetails.dashboardMessage = data.stats
            ? "Dashboard stats loaded successfully."
            : "Dashboard route works, but no stats were returned.";
        } catch (error) {
          console.error("Dashboard check failed:", error);
          newDetails.dashboardMessage =
            error.response?.data?.message || "Dashboard stats check failed.";
        }

        if (!ignore) {
          setChecks(newChecks);
          setDetails(newDetails);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    runChecks();

    return () => {
      ignore = true;
    };
  }, []);

  const CheckCard = ({ title, passed, message }) => (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-black text-slate-950">{title}</h2>

        <span
          className={`rounded-full px-4 py-2 text-xs font-black uppercase tracking-wide ${
            passed
              ? "bg-green-50 text-green-700 ring-1 ring-green-200"
              : "bg-red-50 text-red-700 ring-1 ring-red-200"
          }`}
        >
          {passed ? "Passed" : "Failed"}
        </span>
      </div>

      <p className="mt-3 text-sm font-semibold leading-6 text-slate-600">
        {message}
      </p>
    </div>
  );

  return (
    <>
      <AdminNavbar />

      <main className="min-h-screen bg-slate-50 px-6 py-16 text-black">
        <div className="mx-auto max-w-5xl">
          <section className="mb-10 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl">
            <p className="font-bold uppercase tracking-[0.25em] text-red-700">
              Admin Safety
            </p>

            <h1 className="mt-4 text-4xl font-black text-slate-950 md:text-5xl">
              System <span className="text-red-700">Check</span>
            </h1>

            <p className="mt-4 max-w-2xl text-slate-600">
              Use this page to confirm the admin login, backend, settings, and
              dashboard stats are working.
            </p>
          </section>

          {loading ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
              <p className="font-bold text-slate-600">
                Running system checks...
              </p>
            </div>
          ) : (
            <section className="grid gap-6">
              <CheckCard
                title="Admin Token"
                passed={checks.token}
                message={
                  checks.token
                    ? "Admin token exists in local storage."
                    : "Admin token was not found. Log out and log back in."
                }
              />

              <CheckCard
                title="Admin User"
                passed={checks.adminUser}
                message={`Name: ${details.adminName} | Email: ${details.adminEmail}`}
              />

              <CheckCard
                title="Backend Connection"
                passed={checks.backend}
                message={details.backendMessage}
              />

              <CheckCard
                title="Business Settings"
                passed={checks.settings}
                message={details.settingsMessage}
              />

              <CheckCard
                title="Dashboard Stats"
                passed={checks.dashboard}
                message={details.dashboardMessage}
              />
            </section>
          )}
        </div>
      </main>
    </>
  );
}
