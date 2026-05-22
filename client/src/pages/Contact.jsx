import { useEffect, useState } from "react";
import API from "../api/api";

export default function Contact() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [settings, setSettings] = useState(null);
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
        console.error("Fetch contact settings error:", error);

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
  const phone = settings?.phone || "(704) 555-1234";
  const email = settings?.email || "info@thequeensmen.com";
  const instagram = settings?.instagram || "";
  const facebook = settings?.facebook || "";
  const tiktok = settings?.tiktok || "";

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      await API.post("/api/contact", formData);

      setSuccess("Message sent successfully!");

      resetForm();

      setTimeout(() => {
        setSuccess("");
      }, 5000);
    } catch (error) {
      console.error("Contact submit error:", error);

      setError(
        error.response?.data?.message ||
          "Something went wrong while sending your message.",
      );

      setTimeout(() => {
        setError("");
      }, 5000);
    } finally {
      setLoading(false);
    }
  };

  if (settingsLoading) {
    return (
      <main className="min-h-screen bg-white">
        <section className="flex min-h-screen items-center justify-center px-6">
          <div className="text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border-2 border-red-700 bg-white shadow-xl">
              <span className="text-3xl font-black text-red-700">Q</span>
            </div>

            <p className="font-bold uppercase tracking-[0.25em] text-red-700">
              Loading Contact Page
            </p>

            <p className="mt-3 text-slate-500">Preparing contact details...</p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="bg-white text-black">
      {/* HEADER */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <p className="font-bold uppercase tracking-[0.25em] text-red-700">
            Contact Us
          </p>

          <h1 className="mt-4 text-5xl font-black text-slate-950 md:text-7xl">
            Connect With{" "}
            {businessName === "The QueensMen" ? (
              <>
                The <span className="text-red-700">Q</span>ueensMen
              </>
            ) : (
              businessName
            )}
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
            Send a message about bookings, applications, events, flyers,
            collaborations, or general questions.
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-[1fr_1.4fr]">
        {/* CONTACT INFO */}
        <aside className="grid gap-6">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 shadow-xl">
            <p className="font-bold uppercase tracking-[0.25em] text-red-700">
              Contact Info
            </p>

            <h2 className="mt-3 text-3xl font-black text-slate-950">
              Reach {businessName}
            </h2>

            <p className="mt-4 leading-7 text-slate-600">
              Use the form or reach out directly. The team will review your
              message and respond as soon as possible.
            </p>

            <div className="mt-6 grid gap-4">
              <div className="rounded-2xl bg-white p-5 ring-1 ring-slate-200">
                <p className="text-xs font-black uppercase tracking-widest text-red-700">
                  Phone
                </p>

                <a
                  href={`tel:${phone.replace(/\D/g, "")}`}
                  className="mt-2 block text-lg font-black text-slate-950 hover:text-red-700"
                >
                  {phone}
                </a>
              </div>

              <div className="rounded-2xl bg-white p-5 ring-1 ring-slate-200">
                <p className="text-xs font-black uppercase tracking-widest text-red-700">
                  Email
                </p>

                <a
                  href={`mailto:${email}`}
                  className="mt-2 block break-words text-lg font-black text-slate-950 hover:text-red-700"
                >
                  {email}
                </a>
              </div>

              <div className="rounded-2xl bg-white p-5 ring-1 ring-slate-200">
                <p className="text-xs font-black uppercase tracking-widest text-red-700">
                  Socials
                </p>

                <div className="mt-3 flex flex-wrap gap-3">
                  {instagram ? (
                    <a
                      href={instagram}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full bg-black px-4 py-2 text-sm font-black text-white hover:bg-red-700"
                    >
                      Instagram
                    </a>
                  ) : (
                    <span className="rounded-full bg-slate-200 px-4 py-2 text-sm font-black text-slate-500">
                      Instagram
                    </span>
                  )}

                  {facebook ? (
                    <a
                      href={facebook}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full bg-black px-4 py-2 text-sm font-black text-white hover:bg-red-700"
                    >
                      Facebook
                    </a>
                  ) : (
                    <span className="rounded-full bg-slate-200 px-4 py-2 text-sm font-black text-slate-500">
                      Facebook
                    </span>
                  )}

                  {tiktok ? (
                    <a
                      href={tiktok}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full bg-black px-4 py-2 text-sm font-black text-white hover:bg-red-700"
                    >
                      TikTok
                    </a>
                  ) : (
                    <span className="rounded-full bg-slate-200 px-4 py-2 text-sm font-black text-slate-500">
                      TikTok
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border-l-4 border-red-700 bg-slate-50 p-6 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm font-semibold leading-6 text-slate-600">
              Messages submitted here will appear in the admin dashboard and
              send an email notification to the owner.
            </p>
          </div>
        </aside>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-slate-200 bg-white p-8 text-black shadow-2xl"
        >
          <h2 className="text-3xl font-black text-slate-950">Send a Message</h2>

          <p className="mt-2 text-slate-600">
            Fill out the form and someone will follow up.
          </p>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Full Name *
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-red-700"
                placeholder="Your full name"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-red-700"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-red-700"
                placeholder="Your phone number"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Subject
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-red-700"
                placeholder="Booking, application, event..."
              />
            </div>
          </div>

          <div className="mt-5">
            <label className="mb-2 block text-sm font-bold text-slate-700">
              Message *
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows="7"
              className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-red-700"
              placeholder="Write your message..."
            />
          </div>

          {error && (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="mt-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-bold text-green-700">
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded-full bg-red-700 px-6 py-4 font-black text-white shadow-lg hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Sending..." : "Send Message"}
          </button>

          <p className="mt-4 text-center text-sm text-slate-500">
            {businessName} will review your message and follow up.
          </p>
        </form>
      </section>
    </main>
  );
}
