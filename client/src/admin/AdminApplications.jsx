import { useEffect, useState } from "react";
import API from "../api/api";
import AdminNavbar from "../components/AdminNavbar";

export default function AdminApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    const fetchApplications = async () => {
      try {
        setLoading(true);
        setError("");

        const { data } = await API.get("/api/applications");

        if (!ignore) {
          setApplications(data.applications || []);
        }
      } catch (error) {
        console.error("Fetch applications error:", error);

        if (!ignore) {
          setError(
            error.response?.data?.message ||
              "Something went wrong while loading applications.",
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchApplications();

    return () => {
      ignore = true;
    };
  }, []);

  const handleStatusChange = async (applicationId, status) => {
    try {
      setUpdatingId(applicationId);

      const { data } = await API.patch(
        `/api/applications/${applicationId}/status`,
        { status },
      );

      setApplications((prev) =>
        prev.map((application) =>
          application._id === applicationId ? data.application : application,
        ),
      );
    } catch (error) {
      console.error("Update application status error:", error);

      alert(
        error.response?.data?.message ||
          "Something went wrong while updating application status.",
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (applicationId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this application?",
    );

    if (!confirmDelete) return;

    try {
      setDeletingId(applicationId);

      await API.delete(`/api/applications/${applicationId}`);

      setApplications((prev) =>
        prev.filter((application) => application._id !== applicationId),
      );
    } catch (error) {
      console.error("Delete application error:", error);

      alert(
        error.response?.data?.message ||
          "Something went wrong while deleting this application.",
      );
    } finally {
      setDeletingId(null);
    }
  };

  const getStatusClass = (status) => {
    if (status === "Accepted") {
      return "bg-green-50 text-green-700 ring-green-200";
    }

    if (status === "Rejected") {
      return "bg-red-50 text-red-700 ring-red-200";
    }

    if (status === "Reviewed") {
      return "bg-blue-50 text-blue-700 ring-blue-200";
    }

    return "bg-yellow-50 text-yellow-700 ring-yellow-200";
  };

  const pendingCount = applications.filter(
    (application) => application.status === "Pending",
  ).length;

  return (
    <>
      <AdminNavbar />

      <main className="min-h-screen bg-slate-50 px-6 py-16 text-black">
        <div className="mx-auto max-w-7xl">
          {/* HEADER */}
          <section className="mb-10 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl">
            <p className="font-bold uppercase tracking-[0.25em] text-red-700">
              Admin Applications
            </p>

            <div className="mt-4 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
              <div>
                <h1 className="text-4xl font-black text-slate-950 md:text-5xl">
                  Review <span className="text-red-700">Applications</span>
                </h1>

                <p className="mt-4 max-w-2xl text-slate-600">
                  Review model applications, update statuses, and manage
                  applicant details. Accepted or rejected applicants will
                  receive a status email.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <div className="rounded-full border border-slate-200 bg-slate-50 px-5 py-2 text-sm font-black text-slate-800 shadow-sm">
                  {applications.length} Total
                </div>

                <div className="rounded-full border border-yellow-200 bg-yellow-50 px-5 py-2 text-sm font-black text-yellow-700 shadow-sm">
                  {pendingCount} Pending
                </div>
              </div>
            </div>
          </section>

          {/* STATES */}
          {loading && (
            <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
              <p className="font-bold text-slate-600">
                Loading applications...
              </p>
            </div>
          )}

          {error && (
            <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700">
              <p className="font-bold">{error}</p>
            </div>
          )}

          {!loading && !error && applications.length === 0 && (
            <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
              <h2 className="text-2xl font-black text-slate-950">
                No applications yet
              </h2>

              <p className="mt-3 text-slate-600">
                New model applications will show here after someone submits the
                public application form.
              </p>
            </div>
          )}

          {/* LIST */}
          {!loading && !error && applications.length > 0 && (
            <section className="grid gap-6">
              {applications.map((application) => (
                <article
                  key={application._id}
                  className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl"
                >
                  <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <span
                          className={`rounded-full px-4 py-2 text-xs font-black uppercase tracking-wide ring-1 ${getStatusClass(
                            application.status,
                          )}`}
                        >
                          {application.status || "Pending"}
                        </span>

                        <span className="rounded-full bg-slate-100 px-4 py-2 text-xs font-black text-slate-600 ring-1 ring-slate-200">
                          Submitted{" "}
                          {application.createdAt
                            ? new Date(
                                application.createdAt,
                              ).toLocaleDateString()
                            : "recently"}
                        </span>
                      </div>

                      <h2 className="mt-4 text-3xl font-black text-slate-950">
                        {application.fullName}
                      </h2>

                      <p className="mt-2 font-bold text-red-700">
                        {application.location || "Location not provided"}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <select
                        value={application.status || "Pending"}
                        disabled={updatingId === application._id}
                        onChange={(e) =>
                          handleStatusChange(application._id, e.target.value)
                        }
                        className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-black text-slate-900 outline-none focus:border-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Reviewed">Reviewed</option>
                        <option value="Accepted">Accepted</option>
                        <option value="Rejected">Rejected</option>
                      </select>

                      <button
                        type="button"
                        disabled={deletingId === application._id}
                        onClick={() => handleDelete(application._id)}
                        className="rounded-full border border-red-700 px-5 py-3 text-sm font-black text-red-700 hover:bg-red-700 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {deletingId === application._id
                          ? "Deleting..."
                          : "Delete"}
                      </button>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                      <p className="text-xs font-black uppercase tracking-widest text-red-700">
                        Email
                      </p>
                      <a
                        href={`mailto:${application.email}`}
                        className="mt-2 block break-words font-bold text-slate-900 hover:text-red-700"
                      >
                        {application.email}
                      </a>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                      <p className="text-xs font-black uppercase tracking-widest text-red-700">
                        Phone
                      </p>
                      <a
                        href={`tel:${String(application.phone || "").replace(
                          /\D/g,
                          "",
                        )}`}
                        className="mt-2 block font-bold text-slate-900 hover:text-red-700"
                      >
                        {application.phone || "Not provided"}
                      </a>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                      <p className="text-xs font-black uppercase tracking-widest text-red-700">
                        Age
                      </p>
                      <p className="mt-2 font-bold text-slate-900">
                        {application.age || "Not provided"}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                      <p className="text-xs font-black uppercase tracking-widest text-red-700">
                        Height
                      </p>
                      <p className="mt-2 font-bold text-slate-900">
                        {application.height || "Not provided"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-4 md:grid-cols-2">
                    <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                      <p className="text-xs font-black uppercase tracking-widest text-red-700">
                        Experience
                      </p>
                      <p className="mt-2 font-bold text-slate-900">
                        {application.experience || "Not provided"}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                      <p className="text-xs font-black uppercase tracking-widest text-red-700">
                        Availability
                      </p>
                      <p className="mt-2 font-bold text-slate-900">
                        {application.availability || "Not provided"}
                      </p>
                    </div>
                  </div>

                  {(application.instagram || application.portfolio) && (
                    <div className="mt-5 grid gap-4 md:grid-cols-2">
                      <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                        <p className="text-xs font-black uppercase tracking-widest text-red-700">
                          Instagram
                        </p>

                        {application.instagram ? (
                          <a
                            href={
                              application.instagram.startsWith("http")
                                ? application.instagram
                                : `https://instagram.com/${application.instagram.replace(
                                    "@",
                                    "",
                                  )}`
                            }
                            target="_blank"
                            rel="noreferrer"
                            className="mt-2 block break-words font-bold text-slate-900 hover:text-red-700"
                          >
                            {application.instagram}
                          </a>
                        ) : (
                          <p className="mt-2 font-bold text-slate-900">
                            Not provided
                          </p>
                        )}
                      </div>

                      <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                        <p className="text-xs font-black uppercase tracking-widest text-red-700">
                          Portfolio
                        </p>

                        {application.portfolio ? (
                          <a
                            href={application.portfolio}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-2 block break-words font-bold text-slate-900 hover:text-red-700"
                          >
                            View Portfolio
                          </a>
                        ) : (
                          <p className="mt-2 font-bold text-slate-900">
                            Not provided
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {application.message && (
                    <div className="mt-5 rounded-2xl border-l-4 border-red-700 bg-slate-50 p-5 ring-1 ring-slate-200">
                      <p className="text-xs font-black uppercase tracking-widest text-red-700">
                        Message
                      </p>

                      <p className="mt-2 leading-7 text-slate-700">
                        {application.message}
                      </p>
                    </div>
                  )}
                </article>
              ))}
            </section>
          )}
        </div>
      </main>
    </>
  );
}
