import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [settings, setSettings] = useState(null);
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    const fetchSettings = async () => {
      try {
        setSettingsLoading(true);

        const { data } = await API.get("/api/settings");

        if (!ignore) {
          setSettings(data.settings || null);
        }
      } catch (error) {
        console.error("Fetch admin login settings error:", error);

        if (!ignore) {
          setSettings(null);
        }
      } finally {
        if (!ignore) {
          setSettingsLoading(false);
        }
      }
    };

    fetchSettings();

    return () => {
      ignore = true;
    };
  }, []);

  const businessName = settings?.businessName || "The QueensMen";
  const tagline = settings?.tagline || "Exclusive Professional Male Models";
  const logo = settings?.logo || "";

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const { data } = await API.post("/api/admin/login", formData);

      localStorage.setItem("adminToken", data.token);
      localStorage.setItem("adminUser", JSON.stringify(data.admin));

      navigate("/admin");
    } catch (error) {
      console.error("Admin login error:", error);

      setError(
        error.response?.data?.message ||
          "Login failed. Please check your email and password.",
      );

      setTimeout(() => {
        setError("");
      }, 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 text-black">
      <section className="flex min-h-screen items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-5 flex h-28 w-40 items-center justify-center overflow-hidden rounded-2xl border-2 border-red-700 bg-white p-2 shadow-xl">
              {settingsLoading ? (
                <span className="text-3xl font-black text-red-700">Q</span>
              ) : logo ? (
                <img
                  src={logo}
                  alt={`${businessName} logo`}
                  className="h-full w-full object-contain"
                />
              ) : (
                <span className="text-3xl font-black text-red-700">Q</span>
              )}
            </div>

            <p className="font-bold uppercase tracking-[0.25em] text-red-700">
              Admin Login
            </p>

            <h1 className="mt-3 text-4xl font-black text-slate-950">
              {businessName === "The QueensMen" ? (
                <>
                  The <span className="text-red-700">Q</span>ueensMen
                </>
              ) : (
                businessName
              )}
            </h1>

            <p className="mt-3 text-sm font-semibold text-slate-500">
              {tagline}
            </p>
          </div>

          <form
            onSubmit={handleLogin}
            className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-2xl"
          >
            <h2 className="text-3xl font-black text-slate-950">Sign in</h2>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Enter your admin email and password to manage the website.
            </p>

            <div className="mt-7 grid gap-5">
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Admin Email
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-red-700"
                  placeholder="owner@example.com"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Password
                </label>

                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  autoComplete="current-password"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-red-700"
                  placeholder="Enter password"
                />
              </div>
            </div>

            {error && (
              <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full rounded-full bg-red-700 px-6 py-4 font-black text-white shadow-lg hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Login to Dashboard"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/")}
              className="mt-4 w-full rounded-full border border-slate-300 px-6 py-3 font-black text-slate-950 hover:border-black hover:bg-black hover:text-white"
            >
              Back to Website
            </button>
          </form>

          <p className="mt-6 text-center text-xs font-semibold text-slate-500">
            Authorized admin access only.
          </p>
        </div>
      </section>
    </main>
  );
}
