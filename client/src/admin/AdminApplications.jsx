import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";

import API from "../api/api";
import AdminNavbar from "../components/AdminNavbar";
export default function AdminApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        setError("");

        const { data } = await API.get("/api/applications");

        setApplications(data.applications || []);
      } catch (error) {
        console.error("Fetch applications error:", error);

        setError(
          error.response?.data?.message ||
            "Something went wrong while loading applications.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);
  const handleStatusUpdate = async (applicationId, newStatus) => {
    try {
      setUpdatingId(applicationId);

      const { data } = await API.patch(
        `/api/applications/${applicationId}/status`,
        {
          status: newStatus,
        },
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
          "Something went wrong while updating the status.",
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
        "Something went wrong while deleting the application.",
    );
  } finally {
    setDeletingId(null);
  }
};

const downloadApplicationsCSV = () => {
  const escapeCSV = (value) => {
    const stringValue = String(value ?? "");
    return `"${stringValue.replaceAll('"', '""')}"`;
  };

  const headers = [
    "Full Name",
    "Email",
    "Phone",
    "Location",
    "Age",
    "Height",
    "Experience",
    "Availability",
    "Instagram",
    "Portfolio",
    "Profile Image",
    "Status",
    "Message",
  ];

  const rows = applications.map((application) => [
    application.fullName,
    application.email,
    application.phone,
    application.location,
    application.age || "",
    application.height || "",
    application.experience || "",
    application.availability || "",
    application.instagram || "",
    application.portfolio || "",
    application.profileImage || "",
    application.status || "Pending",
    application.message || "",
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
  link.download = `queensmen-applications-${new Date()
    .toISOString()
    .slice(0, 10)}.csv`;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
};

 return (
   <>
     <AdminNavbar />

     <main className="min-h-screen overflow-x-hidden bg-slate-50 px-4 py-10 text-black md:px-6 md:py-16">
       <div className="mx-auto max-w-7xl">
         {/* HEADER */}
         <section className="mb-10 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl md:p-8">
           <p className="font-bold uppercase tracking-[0.25em] text-red-700">
             Admin Applications
           </p>

           <div className="mt-4 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
             <div>
               <h1 className="text-3xl font-black text-slate-950 sm:text-4xl md:text-5xl">
                 Review <span className="text-red-700">Applications</span>
               </h1>

               <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600 md:text-base">
                 Review model applications, contact applicants, and update their
                 status.
               </p>
             </div>
             <button
               type="button"
               onClick={downloadApplicationsCSV}
               className="rounded-full bg-red-700 px-5 py-2 text-sm font-black text-white shadow-sm hover:bg-red-800"
             >
               Download CSV
             </button>
             <div className="rounded-full border border-slate-200 bg-slate-50 px-5 py-2 text-sm font-black text-slate-800 shadow-sm">
               {applications.length} Total
             </div>
           </div>
         </section>

         {/* LOADING */}
         {loading && (
           <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
             <p className="font-bold text-slate-600">Loading applications...</p>
           </div>
         )}

         {/* ERROR */}
         {error && (
           <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700">
             <p className="font-bold">{error}</p>
           </div>
         )}

         {/* EMPTY */}
         {!loading && !error && applications.length === 0 && (
           <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
             <h2 className="text-2xl font-black text-slate-950">
               No applications yet
             </h2>

             <p className="mt-3 text-slate-600">
               New model applications will appear here.
             </p>
           </div>
         )}

         {/* LIST */}
         {!loading && !error && applications.length > 0 && (
           <section className="grid gap-6">
             {applications.map((application) => (
               <article
                 key={application._id}
                 className="w-full overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-4 shadow-xl md:p-6"
               >
                 <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
                   <div className="flex-1">
                     <div className="flex flex-wrap items-center gap-3">
                       <span
                         className={`rounded-full px-4 py-2 text-xs font-black uppercase tracking-wide ${
                           application.status === "Accepted"
                             ? "bg-green-100 text-green-700"
                             : application.status === "Rejected"
                               ? "bg-red-100 text-red-700"
                               : application.status === "Reviewed"
                                 ? "bg-blue-100 text-blue-700"
                                 : "bg-yellow-100 text-yellow-700"
                         }`}
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

                     <h2 className="mt-4 text-2xl font-black text-slate-950 md:text-3xl">
                       {application.fullName}
                     </h2>

                     <p className="mt-2 text-sm font-bold text-red-700">
                       {application.experience || "Experience not provided"}
                     </p>
                   </div>
                   {application.profileImage && (
                     <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-4 ring-1 ring-slate-200">
                       <p className="mb-3 text-xs font-black uppercase tracking-widest text-red-700">
                         Profile Photo
                       </p>

                       <img
                         src={application.profileImage}
                         alt={application.fullName}
                         className="h-80 w-full rounded-xl bg-white object-contain"
                       />
                     </div>
                   )}
                   <div className="flex w-full flex-wrap gap-3 lg:w-auto">
                     <a
                       href={`mailto:${application.email}`}
                       className="rounded-full bg-red-700 px-4 py-2 text-xs font-black text-white transition hover:bg-red-800 md:px-5 md:py-3 md:text-sm"
                     >
                       Email
                     </a>

                     <a
                       href={`tel:${String(application.phone || "").replace(
                         /\D/g,
                         "",
                       )}`}
                       className="rounded-full border border-slate-300 px-4 py-2 text-xs font-black text-slate-900 transition hover:border-red-700 hover:text-red-700 md:px-5 md:py-3 md:text-sm"
                     >
                       Call
                     </a>

                     <button
                       type="button"
                       disabled={deletingId === application._id}
                       onClick={() => handleDelete(application._id)}
                       className="rounded-full border border-red-700 px-4 py-2 text-xs font-black text-red-700 transition hover:bg-red-700 hover:text-white disabled:cursor-not-allowed disabled:opacity-60 md:px-5 md:py-3 md:text-sm"
                     >
                       {deletingId === application._id
                         ? "Deleting..."
                         : "Delete"}
                     </button>
                   </div>
                 </div>

                 <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
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
                       Location
                     </p>

                     <p className="mt-2 font-bold text-slate-900">
                       {application.location || "Not provided"}
                     </p>
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

                   <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                     <p className="text-xs font-black uppercase tracking-widest text-red-700">
                       Instagram
                     </p>

                     <p className="mt-2 break-words font-bold text-slate-900">
                       {application.instagram || "Not provided"}
                     </p>
                   </div>
                 </div>

                 {application.portfolio && (
                   <div className="mt-5 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                     <p className="text-xs font-black uppercase tracking-widest text-red-700">
                       Portfolio / Photo Link
                     </p>

                     <a
                       href={application.portfolio}
                       target="_blank"
                       rel="noreferrer"
                       className="mt-2 block break-words font-bold text-slate-900 hover:text-red-700"
                     >
                       {application.portfolio}
                     </a>
                   </div>
                 )}

                 {application.message && (
                   <div className="mt-5 rounded-2xl border-l-4 border-red-700 bg-slate-50 p-5 ring-1 ring-slate-200">
                     <p className="text-xs font-black uppercase tracking-widest text-red-700">
                       Message
                     </p>

                     <p className="mt-2 whitespace-pre-line leading-7 text-slate-700">
                       {application.message}
                     </p>
                   </div>
                 )}

                 <div className="mt-5 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                   <p className="text-xs font-black uppercase tracking-widest text-red-700">
                     Update Status
                   </p>

                   <div className="mt-3 flex flex-wrap gap-2">
                     {["Pending", "Reviewed", "Accepted", "Rejected"].map(
                       (status) => (
                         <button
                           key={status}
                           type="button"
                           disabled={updatingId === application._id}
                           onClick={() =>
                             handleStatusUpdate(application._id, status)
                           }
                           className={`rounded-full px-4 py-2 text-xs font-black transition disabled:cursor-not-allowed disabled:opacity-60 ${
                             application.status === status
                               ? "bg-red-700 text-white"
                               : "border border-slate-300 text-slate-900 hover:border-red-700 hover:text-red-700"
                           }`}
                         >
                           {updatingId === application._id
                             ? "Updating..."
                             : status}
                         </button>
                       ),
                     )}
                   </div>
                 </div>
               </article>
             ))}
           </section>
         )}
       </div>
     </main>
   </>
 );
}
