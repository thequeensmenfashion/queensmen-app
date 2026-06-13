import { useEffect, useState } from "react";
import API from "../api/api";
import AdminNavbar from "../components/AdminNavbar";

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  // const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");
  const [models, setModels] = useState([]);
  useEffect(() => {
    let ignore = false;

    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError("");

        const { data } = await API.get("/api/bookings");
       const { data: modelData } = await API.get("/api/models");

       const loadedModels = Array.isArray(modelData)
         ? modelData
         : modelData.models || modelData.data || [];

       if (!ignore) {
         setBookings(data.bookings || []);
         setModels(loadedModels);
       }
      } catch (error) {
        console.error("Fetch bookings error:", error);

        if (!ignore) {
          setError(
            error.response?.data?.message ||
              "Something went wrong while loading bookings.",
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchBookings();

    return () => {
      ignore = true;
    };
  }, []);

  const handleDelete = async (bookingId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this booking request?",
    );

    if (!confirmDelete) return;

    try {
      setDeletingId(bookingId);

      await API.delete(`/api/bookings/${bookingId}`);

      setBookings((prev) =>
        prev.filter((booking) => booking._id !== bookingId),
      );
    } catch (error) {
      console.error("Delete booking error:", error);

      alert(
        error.response?.data?.message ||
          "Something went wrong while deleting this booking.",
      );
    } finally {
      setDeletingId(null);
    }
  };

  // const getStatusClass = (status) => {
  //   if (status === "Approved") {
  //     return "bg-green-50 text-green-700 ring-green-200";
  //   }

  //   if (status === "Declined") {
  //     return "bg-red-50 text-red-700 ring-red-200";
  //   }

  //   if (status === "Reviewed") {
  //     return "bg-blue-50 text-blue-700 ring-blue-200";
  //   }

  //   return "bg-yellow-50 text-yellow-700 ring-yellow-200";
  // };

  const pendingCount = bookings.filter(
    (booking) => booking.status === "Pending",
  ).length;

  const updateBookingStatus = async (id, status, adminNotes = "") => {
    try {
      const { data } = await API.patch(`/api/bookings/${id}/status`, {
        status,
        adminNotes,
      });

      setBookings((prev) =>
        prev.map((booking) => (booking._id === id ? data.booking : booking)),
      );
    } catch (error) {
      console.error("Update booking status error:", error);

      alert(
        error.response?.data?.message ||
          "Something went wrong while updating booking.",
      );
    }
  };
  const handleAssignModels = async (bookingId, modelIds) => {
    try {
      const { data } = await API.patch(
        `/api/bookings/${bookingId}/assign-models`,
        {
          modelIds,
        },
      );

      setBookings((prev) =>
        prev.map((booking) =>
          booking._id === bookingId ? data.booking : booking,
        ),
      );
    } catch (error) {
      console.error("Assign models error:", error);

      alert(
        error.response?.data?.message ||
          "Something went wrong while assigning models.",
      );
    }
  };

  const getModelSchedule = (modelId) => {
    return bookings
      .filter((booking) =>
        (booking.assignedModels || []).some(
          (model) => String(model._id || model) === String(modelId),
        ),
      )
      .filter((booking) => booking.eventDate)
      .sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate));
  };

const downloadBookingsCSV = () => {
  const escapeCSV = (value) => {
    const stringValue = String(value ?? "");
    return `"${stringValue.replaceAll('"', '""')}"`;
  };

  const headers = [
    "Full Name",
    "Email",
    "Phone",
    "Company",
    "Event Type",
    "Event Date",
    "Event Time",
    "Duration",
    "Location",
    "Models Needed",
    "Budget",
    "Status",
    "Admin Notes",
    "Message",
  ];

  const rows = bookings.map((booking) => [
    booking.fullName,
    booking.email,
    booking.phone,
    booking.company || "",
    booking.eventType || "",
    booking.eventDate ? new Date(booking.eventDate).toLocaleDateString() : "",
    booking.eventTime || "",
    booking.eventDuration || "",
    booking.location || "",
    booking.numberOfModels || "",
    booking.budget || "",
    booking.status || "Pending",
    booking.adminNotes || "",
    booking.message || "",
  ]);

  const csvContent = [headers, ...rows]
    .map((row) => row.map(escapeCSV).join(","))
    .join("\n");

  const blob = new Blob([csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `queensmen-bookings-${new Date()
    .toISOString()
    .slice(0, 10)}.csv`;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
};

  return (
    <div className="w-full overflow-x-hidden">
      <AdminNavbar />

      <main className="min-h-screen overflow-x-hidden bg-slate-50 px-4 py-10 text-black md:px-6 md:py-16">
        <div className="mx-auto max-w-7xl">
          {/* HEADER */}
          <section className="mb-10 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl">
            <p className="font-bold uppercase tracking-[0.25em] text-red-700">
              Admin Bookings
            </p>

            <div className="mt-4 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
              <div>
                <h1 className="text-3xl font-black text-slate-950 sm:text-4xl md:text-5xl">
                  Review <span className="text-red-700">Bookings</span>
                </h1>

                <p className="mt-4 max-w-2xl text-slate-600">
                  Review booking requests, update booking status, and manage
                  client event details.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <div className="rounded-full border border-slate-200 bg-slate-50 px-5 py-2 text-sm font-black text-slate-800 shadow-sm">
                  {bookings.length} Total
                </div>
                <button
                  type="button"
                  onClick={downloadBookingsCSV}
                  className="rounded-full bg-red-700 px-5 py-2 text-sm font-black text-white shadow-sm hover:bg-red-800"
                >
                  Download CSV
                </button>
                <div className="rounded-full border border-yellow-200 bg-yellow-50 px-5 py-2 text-sm font-black text-yellow-700 shadow-sm">
                  {pendingCount} Pending
                </div>
              </div>
            </div>
          </section>

          {/* LOADING */}
          {loading && (
            <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
              <p className="font-bold text-slate-600">Loading bookings...</p>
            </div>
          )}

          {/* ERROR */}
          {error && (
            <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700">
              <p className="font-bold">{error}</p>
            </div>
          )}

          {/* EMPTY */}
          {!loading && !error && bookings.length === 0 && (
            <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
              <h2 className="text-2xl font-black text-slate-950">
                No booking requests yet
              </h2>

              <p className="mt-3 text-slate-600">
                New booking requests will appear here.
              </p>
            </div>
          )}

          {/* BOOKINGS */}
          {!loading && !error && bookings.length > 0 && (
            <section className="grid gap-6">
              {bookings.map((booking) => (
                <article
                  key={booking._id}
                  className="w-full overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-4 shadow-xl md:p-6"
                >
                  <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
                    {/* LEFT SIDE */}
                    <div className="flex-1">
                      {/* TOP INFO */}
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="rounded-full bg-slate-100 px-4 py-2 text-xs font-black text-slate-600 ring-1 ring-slate-200">
                          Submitted{" "}
                          {booking.createdAt
                            ? new Date(booking.createdAt).toLocaleDateString()
                            : "recently"}
                        </span>
                      </div>

                      {/* NAME */}
                      <h2 className="mt-4 text-3xl font-black text-slate-950">
                        {booking.fullName}
                      </h2>

                      {/* STATUS BADGE */}
                      <div
                        className={`mt-3 inline-flex rounded-full px-4 py-2 text-xs font-black uppercase tracking-wide
                        ${
                          booking.status === "Approved"
                            ? "bg-green-100 text-green-700"
                            : booking.status === "Declined"
                              ? "bg-red-100 text-red-700"
                              : booking.status === "Completed"
                                ? "bg-blue-100 text-blue-700"
                                : booking.status === "Canceled"
                                  ? "bg-gray-200 text-gray-700"
                                  : "bg-yellow-100 text-yellow-700"
                        }
                      `}
                      >
                        {booking.status || "Pending"}
                      </div>

                      {/* STATUS SELECT */}
                      <div className="mt-4">
                        <select
                          value={booking.status || "Pending"}
                          onChange={(e) =>
                            updateBookingStatus(
                              booking._id,
                              e.target.value,
                              booking.adminNotes || "",
                            )
                          }
                          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-bold outline-none focus:border-red-700 sm:w-auto"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Approved">Approved</option>
                          <option value="Declined">Declined</option>
                          <option value="Completed">Completed</option>
                          <option value="Canceled">Canceled</option>
                        </select>
                      </div>

                      {/* ADMIN NOTES */}
                      <textarea
                        value={booking.adminNotes || ""}
                        onChange={(e) =>
                          updateBookingStatus(
                            booking._id,
                            booking.status || "Pending",
                            e.target.value,
                          )
                        }
                        placeholder="Admin notes..."
                        className="mt-4 min-h-[100px] w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-red-700"
                      />

                      {/* EVENT TYPE */}
                      <p className="mt-4 font-bold text-red-700">
                        {booking.eventType || "Event type not provided"}
                      </p>

                      {/* COMPANY */}
                      {booking.company && (
                        <p className="mt-1 text-sm font-semibold text-slate-500">
                          Company / Brand: {booking.company}
                        </p>
                      )}
                    </div>

                    {/* RIGHT SIDE */}
                    <div className="flex w-full flex-wrap gap-3 lg:w-auto">
                      <button
                        type="button"
                        disabled={deletingId === booking._id}
                        onClick={() => handleDelete(booking._id)}
                        className="rounded-full border border-red-700 px-4 py-2 text-xs font-black text-red-700 transition hover:bg-red-700 hover:text-white disabled:cursor-not-allowed disabled:opacity-60 md:px-5 md:py-3 md:text-sm"
                      >
                        {deletingId === booking._id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </div>

                  {/* DETAILS GRID */}
                  <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                      <p className="text-xs font-black uppercase tracking-widest text-red-700">
                        Email
                      </p>

                      <a
                        href={`mailto:${booking.email}`}
                        className="mt-2 block break-words font-bold text-slate-900 hover:text-red-700"
                      >
                        {booking.email}
                      </a>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                      <p className="text-xs font-black uppercase tracking-widest text-red-700">
                        Phone
                      </p>

                      <a
                        href={`tel:${String(booking.phone || "").replace(
                          /\D/g,
                          "",
                        )}`}
                        className="mt-2 block font-bold text-slate-900 hover:text-red-700"
                      >
                        {booking.phone || "Not provided"}
                      </a>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                      <p className="text-xs font-black uppercase tracking-widest text-red-700">
                        Event Date
                      </p>

                      <p className="mt-2 font-bold text-slate-900">
                        {booking.eventDate
                          ? new Date(booking.eventDate).toLocaleDateString()
                          : "Not provided"}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                      <p className="text-xs font-black uppercase tracking-widest text-red-700">
                        Event Time
                      </p>

                      <p className="mt-2 font-bold text-slate-900">
                        {booking.eventTime || "Not provided"}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                      <p className="text-xs font-black uppercase tracking-widest text-red-700">
                        Duration
                      </p>

                      <p className="mt-2 font-bold text-slate-900">
                        {booking.eventDuration || "Not provided"}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                      <p className="text-xs font-black uppercase tracking-widest text-red-700">
                        Models Needed
                      </p>

                      <p className="mt-2 font-bold text-slate-900">
                        {booking.numberOfModels || "Not provided"}
                      </p>
                    </div>
                  </div>

                  {/* SECOND GRID */}
                  <div className="mt-5 grid gap-4 md:grid-cols-2">
                    <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                      <p className="text-xs font-black uppercase tracking-widest text-red-700">
                        Location
                      </p>

                      <p className="mt-2 font-bold text-slate-900">
                        {booking.location || "Not provided"}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                      <p className="text-xs font-black uppercase tracking-widest text-red-700">
                        Budget
                      </p>

                      <p className="mt-2 font-bold text-slate-900">
                        {booking.budget || "Not provided"}
                      </p>
                    </div>
                  </div>
                  <div className="mt-5 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                    <p className="text-xs font-black uppercase tracking-widest text-red-700">
                      Assigned Models
                    </p>
                    <select
                      multiple
                      value={(booking.assignedModels || []).map(
                        (model) => model._id || model,
                      )}
                      onChange={(e) =>
                        handleAssignModels(
                          booking._id,
                          Array.from(e.target.selectedOptions).map(
                            (option) => option.value,
                          ),
                        )
                      }
                      className="mt-3 min-h-[140px] w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-bold outline-none focus:border-red-700"
                    >
                      {models.map((model) => (
                        <option key={model._id} value={model._id}>
                          {model.name}
                        </option>
                      ))}
                    </select>
                    <p className="mt-3 text-xs font-semibold text-slate-500">
                      Hold Ctrl or Command to select multiple models.
                    </p>
                    {(booking.assignedModels || []).length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {booking.assignedModels.map((model) => (
                          <span
                            key={model._id || model}
                            className="rounded-full bg-red-50 px-3 py-1 text-xs font-black text-red-700 ring-1 ring-red-200"
                          >
                            {model.name || "Assigned model"}
                          </span>
                        ))}
                      </div>
                    )}{" "}
                    {(booking.assignedModels || []).length > 0 && (
                      <div className="mt-4 grid gap-3">
                        {booking.assignedModels.map((model) => {
                          const modelId = model._id || model;
                          const schedule = getModelSchedule(modelId);

                          return (
                            <div
                              key={modelId}
                              className="rounded-2xl bg-white p-4 ring-1 ring-slate-200"
                            >
                              <span className="inline-flex rounded-full bg-red-50 px-3 py-1 text-xs font-black text-red-700 ring-1 ring-red-200">
                                {model.name ||
                                  model.fullName ||
                                  "Assigned model"}
                              </span>

                              <div className="mt-3">
                                <p className="text-xs font-black uppercase tracking-widest text-slate-500">
                                  Upcoming Schedule
                                </p>

                                {schedule.length === 0 ? (
                                  <p className="mt-2 text-sm font-semibold text-slate-500">
                                    No upcoming bookings found.
                                  </p>
                                ) : (
                                  <div className="mt-2 grid gap-2">
                                    {schedule.slice(0, 4).map((item) => (
                                      <p
                                        key={item._id}
                                        className="rounded-xl bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700"
                                      >
                                        {item.eventDate
                                          ? new Date(
                                              item.eventDate,
                                            ).toLocaleDateString()
                                          : "No date"}{" "}
                                        • {item.eventTime || "No time"} •{" "}
                                        {item.eventType || "Booking"} •{" "}
                                        {item.status || "Pending"}
                                      </p>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  {/* MESSAGE */}
                  {booking.message && (
                    <div className="mt-5 rounded-2xl border-l-4 border-red-700 bg-slate-50 p-5 ring-1 ring-slate-200">
                      <p className="text-xs font-black uppercase tracking-widest text-red-700">
                        Booking Details
                      </p>

                      <p className="mt-2 leading-7 text-slate-700">
                        {booking.message}
                      </p>
                    </div>
                  )}
                </article>
              ))}
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
