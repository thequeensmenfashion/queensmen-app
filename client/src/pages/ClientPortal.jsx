import { useState } from "react";
import API from "../api/api";

export default function ClientPortal() {
  const [email, setEmail] = useState("");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");
      setSearched(false);

      const { data } = await API.get(
        `/api/client/bookings/${email}`,
      );

      setBookings(data.bookings || []);
      setSearched(true);
    } catch (error) {
      console.error("Client portal error:", error);

      setError(
        error.response?.data?.message ||
          "Something went wrong while loading bookings.",
      );
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (status) => {
    if (status === "Approved") {
      return "bg-green-100 text-green-700";
    }

    if (status === "Declined") {
      return "bg-red-100 text-red-700";
    }

    if (status === "Completed") {
      return "bg-blue-100 text-blue-700";
    }

    if (status === "Canceled") {
      return "bg-gray-200 text-gray-700";
    }

    return "bg-yellow-100 text-yellow-700";
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12 text-black md:px-6">
      <div className="mx-auto max-w-5xl">
        {/* HERO */}
        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl">
          <p className="font-bold uppercase tracking-[0.25em] text-red-700">
            Client Portal
          </p>

          <h1 className="mt-4 text-4xl font-black text-slate-950 md:text-5xl">
            View Your <span className="text-red-700">Bookings</span>
          </h1>

          <p className="mt-4 max-w-2xl text-slate-600">
            Enter the email used during booking to view your booking requests,
            statuses, assigned models, and event details.
          </p>

          <form
            onSubmit={handleSearch}
            className="mt-8 flex flex-col gap-4 md:flex-row"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your booking email"
              className="flex-1 rounded-2xl border border-slate-300 bg-white px-5 py-4 outline-none focus:border-red-700"
            />

            <button
              type="submit"
              disabled={loading}
              className="rounded-2xl bg-red-700 px-8 py-4 font-black text-white hover:bg-red-800 disabled:opacity-60"
            >
              {loading ? "Loading..." : "Search"}
            </button>
          </form>

          {error && (
            <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700">
              {error}
            </div>
          )}
        </section>

        {/* RESULTS */}
        {searched && (
          <section className="mt-8 grid gap-6">
            {bookings.length === 0 ? (
              <div className="rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-xl">
                <h2 className="text-2xl font-black text-slate-950">
                  No bookings found
                </h2>

                <p className="mt-3 text-slate-600">
                  No booking requests were found for that email address.
                </p>
              </div>
            ) : (
              bookings.map((booking) => (
                <article
                  key={booking._id}
                  className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl"
                >
                  <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
                    <div>
                      <div
                        className={`inline-flex rounded-full px-4 py-2 text-xs font-black uppercase tracking-wide ${getStatusClass(
                          booking.status,
                        )}`}
                      >
                        {booking.status || "Pending"}
                      </div>

                      <h2 className="mt-4 text-3xl font-black text-slate-950">
                        {booking.eventType || "Booking"}
                      </h2>

                      <p className="mt-2 font-semibold text-slate-600">
                        {booking.eventDate
                          ? new Date(
                              booking.eventDate,
                            ).toLocaleDateString()
                          : "No date"}{" "}
                        • {booking.eventTime || "No time"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-2xl bg-slate-50 p-4">
                      <p className="text-xs font-black uppercase tracking-widest text-red-700">
                        Location
                      </p>

                      <p className="mt-2 font-bold text-slate-900">
                        {booking.location || "Not provided"}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-4">
                      <p className="text-xs font-black uppercase tracking-widest text-red-700">
                        Models Needed
                      </p>

                      <p className="mt-2 font-bold text-slate-900">
                        {booking.numberOfModels || "N/A"}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-4">
                      <p className="text-xs font-black uppercase tracking-widest text-red-700">
                        Budget
                      </p>

                      <p className="mt-2 font-bold text-slate-900">
                        {booking.budget || "N/A"}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-4">
                      <p className="text-xs font-black uppercase tracking-widest text-red-700">
                        Duration
                      </p>

                      <p className="mt-2 font-bold text-slate-900">
                        {booking.eventDuration || "N/A"}
                      </p>
                    </div>
                  </div>

                  {/* ASSIGNED MODELS */}
                  {(booking.assignedModels || []).length > 0 && (
                    <div className="mt-6">
                      <p className="text-xs font-black uppercase tracking-widest text-red-700">
                        Assigned Models
                      </p>

                      <div className="mt-3 flex flex-wrap gap-2">
                        {booking.assignedModels.map((model) => (
                          <span
                            key={model._id}
                            className="rounded-full bg-red-50 px-4 py-2 text-xs font-black text-red-700"
                          >
                            {model.name || model.fullName || "Model"}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ADMIN NOTES */}
                  {booking.adminNotes && (
                    <div className="mt-6 rounded-2xl border-l-4 border-red-700 bg-slate-50 p-5">
                      <p className="text-xs font-black uppercase tracking-widest text-red-700">
                        Admin Notes
                      </p>

                      <p className="mt-2 leading-7 text-slate-700">
                        {booking.adminNotes}
                      </p>
                    </div>
                  )}
                </article>
              ))
            )}
          </section>
        )}
      </div>
    </main>
  );
}
