import { useEffect, useState } from "react";
import API from "../api/api";

export default function BookModel() {
  const [formData, setFormData] = useState({
    fullName: "",
    company: "",
    email: "",
    phone: "",
    eventType: "",
    eventDate: "",
    location: "",
    numberOfModels: "",
    budget: "",
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
        console.error("Fetch booking settings error:", error);

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
      company: "",
      email: "",
      phone: "",
      eventType: "",
      eventDate: "",
      location: "",
      numberOfModels: "",
      budget: "",
      message: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      await API.post("/api/bookings", formData);

      setSuccess("Booking request submitted successfully!");

      resetForm();

      setTimeout(() => {
        setSuccess("");
      }, 5000);
    } catch (error) {
      console.error("Booking submit error:", error);

      setError(
        error.response?.data?.message ||
          "Something went wrong while submitting your booking request.",
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
              Loading Booking Form
            </p>

            <p className="mt-3 text-slate-500">
              Preparing the booking details...
            </p>
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
            Booking Request
          </p>

          <h1 className="mt-4 text-5xl font-black text-slate-950 md:text-7xl">
            Book{" "}
            {businessName === "The QueensMen" ? (
              <>
                The <span className="text-red-700">Q</span>ueensMen
              </>
            ) : (
              businessName
            )}
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
            Request professional male models for fashion shows, photoshoots,
            brand campaigns, luxury events, promotional appearances, and private
            showcases.
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-[1fr_1.4fr]">
        {/* SIDE INFO */}
        <aside className="grid gap-6">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 shadow-xl">
            <p className="font-bold uppercase tracking-[0.25em] text-red-700">
              Booking Info
            </p>

            <h2 className="mt-3 text-3xl font-black text-slate-950">
              Request Talent
            </h2>

            <p className="mt-4 leading-7 text-slate-600">
              Submit your booking request and the team will review your event
              details, requested date, location, and model needs.
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
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
            <h3 className="text-2xl font-black text-slate-950">
              Booking Services
            </h3>

            <div className="mt-5 grid gap-4">
              <div className="rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-200">
                <h4 className="font-black text-red-700">Fashion Shows</h4>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Book models for runway events, showcases, and designer
                  presentations.
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-200">
                <h4 className="font-black text-red-700">Photoshoots</h4>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Hire talent for editorial shoots, brand visuals, campaigns,
                  and creative projects.
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-200">
                <h4 className="font-black text-red-700">Brand Events</h4>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Bring bold, classy presence to launches, mixers, promotions,
                  and luxury experiences.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border-l-4 border-red-700 bg-slate-50 p-6 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm font-semibold leading-6 text-slate-600">
              After submitting, the owner can review your request in the admin
              dashboard and follow up by email or phone.
            </p>
          </div>
        </aside>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-slate-200 bg-white p-8 text-black shadow-2xl"
        >
          <h2 className="text-3xl font-black text-slate-950">Booking Form</h2>

          <p className="mt-2 text-slate-600">
            Fill out the event details below so the team can review your
            request.
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
                placeholder="Client name"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Company / Brand
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-red-700"
                placeholder="Optional"
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
                placeholder="Client email"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Phone *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-red-700"
                placeholder="Client phone"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Event Type *
              </label>
              <select
                name="eventType"
                value={formData.eventType}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-red-700"
              >
                <option value="">Select event type</option>
                <option value="Fashion Show">Fashion Show</option>
                <option value="Photoshoot">Photoshoot</option>
                <option value="Brand Campaign">Brand Campaign</option>
                <option value="Promotional Event">Promotional Event</option>
                <option value="Private Event">Private Event</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Event Date *
              </label>
              <input
                type="date"
                name="eventDate"
                value={formData.eventDate}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-red-700"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Event Location *
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-red-700"
                placeholder="City, State or venue"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Number of Models Needed *
              </label>
              <input
                type="number"
                name="numberOfModels"
                value={formData.numberOfModels}
                onChange={handleChange}
                min="1"
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-red-700"
                placeholder="Example: 3"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Budget Range
              </label>
              <select
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-red-700"
              >
                <option value="">Select budget range</option>
                <option value="$250 - $500">$250 - $500</option>
                <option value="$500 - $1,000">$500 - $1,000</option>
                <option value="$1,000 - $2,500">$1,000 - $2,500</option>
                <option value="$2,500+">$2,500+</option>
                <option value="Not Sure Yet">Not Sure Yet</option>
              </select>
            </div>
          </div>

          <div className="mt-5">
            <label className="mb-2 block text-sm font-bold text-slate-700">
              Booking Details
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="6"
              className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-red-700"
              placeholder="Tell us about the event, wardrobe needs, model style, time frame, and any special requests..."
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
            {loading ? "Submitting..." : "Submit Booking Request"}
          </button>

          <p className="mt-4 text-center text-sm text-slate-500">
            {businessName} will review your request and follow up.
          </p>
        </form>
      </section>
    </main>
  );
}
