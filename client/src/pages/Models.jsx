import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/api";

export default function Models() {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    const fetchModels = async () => {
      try {
        setLoading(true);
        setError("");

        const { data } = await API.get("/api/models");

        if (!ignore) {
          setModels(data.models || []);
        }
      } catch (error) {
        console.error("Fetch models error:", error);

        if (!ignore) {
          setError(
            error.response?.data?.message ||
              "Something went wrong while loading models.",
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchModels();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <main className="bg-white text-black">
      {/* PAGE HEADER */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <p className="font-bold uppercase tracking-[0.25em] text-red-700">
            Talent Roster
          </p>

          <div className="mt-4 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <h1 className="text-5xl font-black md:text-6xl">
                Meet The <span className="text-red-700">Q</span>ueensMen
              </h1>

              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
                Browse professional male models available for runway,
                commercial, promotional, luxury brand, photoshoot, and event
                work.
              </p>
            </div>

            <Link
              to="/book"
              className="w-fit rounded-full bg-red-700 px-7 py-3 font-black text-white shadow-lg hover:bg-red-800"
            >
              Book Talent
            </Link>
          </div>
        </div>
      </section>

      {/* MODELS GRID */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h2 className="text-3xl font-black text-slate-950">
              Featured Talent
            </h2>

            <p className="mt-2 text-slate-600">
              Select a model to view more details or request a booking.
            </p>
          </div>

          <div className="rounded-full border border-slate-200 bg-slate-50 px-5 py-2 text-sm font-black text-slate-800 shadow-sm">
            {models.length} Models Available
          </div>
        </div>

        {loading && (
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 text-center">
            <p className="font-bold text-slate-600">Loading models...</p>
          </div>
        )}

        {error && (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700">
            <p className="font-bold">{error}</p>
          </div>
        )}

        {!loading && !error && models.length === 0 && (
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 text-center">
            <h2 className="text-2xl font-black text-slate-950">
              No models added yet
            </h2>

            <p className="mt-3 text-slate-600">
              Once the owner adds model profiles from the admin dashboard, they
              will show here.
            </p>
          </div>
        )}

        {!loading && !error && models.length > 0 && (
          <div className="grid items-stretch gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {models.map((model) => (
              <article
                key={model._id}
                className="flex overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-2xl"
              >
                <div className="flex w-full flex-col">
                  {/* IMAGE */}
                  <div className="relative flex h-[360px] items-center justify-center bg-slate-100">
                    {model.image ? (
                      <img
                        src={model.image}
                        alt={model.name}
                        className="h-96 w-full object-cover object-top"
                      />
                    ) : (
                      <p className="font-bold text-slate-500">No image added</p>
                    )}

                    <div className="absolute bottom-4 left-4 rounded-full bg-red-700 px-4 py-2 text-xs font-black uppercase tracking-wide text-white shadow">
                      {model.category}
                    </div>

                    {model.isFeatured && (
                      <div className="absolute right-4 top-4 rounded-full bg-black px-4 py-2 text-xs font-black uppercase tracking-wide text-white shadow">
                        Featured
                      </div>
                    )}
                  </div>

                  {/* CONTENT */}
                  <div className="flex flex-1 flex-col p-6 text-black">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-2xl font-black text-slate-950">
                          {model.name}
                        </h3>

                        <p className="mt-1 text-sm font-bold text-red-700">
                          {model.location}
                        </p>
                      </div>

                      {model.height && (
                        <div className="shrink-0 rounded-2xl bg-slate-950 px-3 py-2 text-sm font-black text-white">
                          {model.height}
                        </div>
                      )}
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {model.experience && (
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-700">
                          {model.experience}
                        </span>
                      )}

                      {model.portfolioImages?.length > 0 && (
                        <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-black text-red-700">
                          {model.portfolioImages.length} Portfolio Photos
                        </span>
                      )}
                    </div>

                    <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600">
                      {model.bio}
                    </p>

                    {/* BUTTONS STAY AT BOTTOM */}
                    <div className="mt-auto flex gap-3 pt-6">
                      <Link
                        to={`/models/${model._id}`}
                        className="flex-1 rounded-full border border-slate-300 px-4 py-3 text-center text-sm font-black text-slate-900 hover:border-red-700 hover:text-red-700"
                      >
                        View Profile
                      </Link>

                      <Link
                        to="/book"
                        className="flex-1 rounded-full bg-red-700 px-4 py-3 text-center text-sm font-black text-white hover:bg-red-800"
                      >
                        Book
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-5xl px-6 py-20 text-center">
          <p className="font-bold uppercase tracking-[0.25em] text-red-700">
            Need Talent?
          </p>

          <h2 className="mt-4 text-4xl font-black text-slate-950 md:text-5xl">
            Bring The <span className="text-red-700">Q</span>ueensMen to your
            next event.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            Submit a booking request and tell us what type of models, event,
            style, and presence you need.
          </p>

          <Link
            to="/book"
            className="mt-8 inline-flex rounded-full bg-red-700 px-8 py-4 font-black text-white shadow-lg hover:bg-red-800"
          >
            Request Booking
          </Link>
        </div>
      </section>
    </main>
  );
}
