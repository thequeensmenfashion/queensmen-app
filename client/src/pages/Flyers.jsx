import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/api";

export default function Flyers() {
  const [flyers, setFlyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedFlyer, setSelectedFlyer] = useState(null);

  useEffect(() => {
    let ignore = false;

    const fetchFlyers = async () => {
      try {
        setLoading(true);
        setError("");

        const { data } = await API.get("/api/flyers");

        if (!ignore) {
          setFlyers(data.flyers || []);
        }
      } catch (error) {
        console.error("Fetch flyers error:", error);

        if (!ignore) {
          setError(
            error.response?.data?.message ||
              "Something went wrong while loading flyers.",
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchFlyers();

    return () => {
      ignore = true;
    };
  }, []);

  const featuredFlyer = flyers[0];

  return (
    <main className="bg-white text-black">
      {/* PAGE HEADER */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <p className="font-bold uppercase tracking-[0.25em] text-red-700">
            Events & Announcements
          </p>

          <div className="mt-4 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <h1 className="text-5xl font-black md:text-6xl">
                Flyers & <span className="text-red-700">Events</span>
              </h1>

              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
                Stay updated with The QueensMen casting calls, showcases, brand
                events, tours, model opportunities, and exclusive announcements.
              </p>
            </div>

            <Link
              to="/contact"
              className="w-fit rounded-full bg-red-700 px-7 py-3 font-black text-white shadow-lg hover:bg-red-800"
            >
              Ask About Events
            </Link>
          </div>
        </div>
      </section>

      {/* LOADING */}
      {loading && (
        <section className="mx-auto max-w-7xl px-6 py-16">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 text-center">
            <p className="font-bold text-slate-600">Loading flyers...</p>
          </div>
        </section>
      )}

      {/* ERROR */}
      {error && (
        <section className="mx-auto max-w-7xl px-6 py-16">
          <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700">
            <p className="font-bold">{error}</p>
          </div>
        </section>
      )}

      {/* EMPTY */}
      {!loading && !error && flyers.length === 0 && (
        <section className="mx-auto max-w-7xl px-6 py-16">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 text-center">
            <h2 className="text-2xl font-black text-slate-950">
              No flyers posted yet
            </h2>

            <p className="mt-3 text-slate-600">
              When the owner adds flyers from the admin dashboard, they will
              show here.
            </p>
          </div>
        </section>
      )}

      {/* CONTENT */}
      {!loading && !error && flyers.length > 0 && (
        <>
          {/* FEATURED FLYER */}
          {featuredFlyer && (
            <section className="border-b border-slate-200 bg-slate-50">
              <div className="mx-auto grid max-w-7xl gap-8 px-6 py-14 lg:grid-cols-[1.1fr_1.4fr]">
                <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
                  <p className="font-bold uppercase tracking-[0.25em] text-red-700">
                    Latest Opportunity
                  </p>

                  <h2 className="mt-4 text-4xl font-black text-slate-950">
                    {featuredFlyer.title}
                  </h2>

                  <p className="mt-4 text-lg leading-8 text-slate-600">
                    {featuredFlyer.description}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-3 text-sm font-black">
                    {featuredFlyer.location && (
                      <span className="rounded-full border border-slate-300 bg-white px-4 py-2 text-slate-800">
                        {featuredFlyer.location}
                      </span>
                    )}

                    {featuredFlyer.type && (
                      <span className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-red-700">
                        {featuredFlyer.type}
                      </span>
                    )}

                    {featuredFlyer.date && (
                      <span className="rounded-full border border-slate-300 bg-white px-4 py-2 text-slate-800">
                        {new Date(featuredFlyer.date).toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  {featuredFlyer.tourDates &&
                    featuredFlyer.tourDates.length > 0 && (
                      <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                        <p className="text-sm font-black uppercase tracking-widest text-red-700">
                          Tour Dates
                        </p>

                        <div className="mt-4 grid gap-3">
                          {featuredFlyer.tourDates.map((stop, index) => (
                            <div
                              key={`${stop.city}-${stop.date}-${index}`}
                              className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200"
                            >
                              <p className="font-black text-slate-950">
                                {stop.city || "City not listed"} —{" "}
                                {stop.date
                                  ? new Date(stop.date).toLocaleDateString()
                                  : "No date"}
                              </p>

                              {stop.venue && (
                                <p className="mt-1 text-sm font-semibold text-slate-500">
                                  {stop.venue}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  <p className="mt-5 text-sm font-bold text-slate-500">
                    Click the flyer image to view it larger.
                  </p>

                  <div className="mt-8 flex flex-wrap gap-4">
                    <Link
                      to="/apply"
                      className="rounded-full bg-red-700 px-7 py-3 font-black text-white shadow-lg hover:bg-red-800"
                    >
                      Apply Now
                    </Link>

                    <Link
                      to="/contact"
                      className="rounded-full border border-slate-300 px-7 py-3 font-black text-slate-950 hover:border-black hover:bg-black hover:text-white"
                    >
                      Contact Us
                    </Link>
                  </div>
                </div>

                <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
                  {featuredFlyer.image ? (
                    <button
                      type="button"
                      onClick={() => setSelectedFlyer(featuredFlyer)}
                      className="block w-full cursor-zoom-in"
                    >
                      <img
                        src={featuredFlyer.image}
                        alt={featuredFlyer.title}
                        className="h-[520px] w-full bg-slate-100 object-contain"
                      />
                    </button>
                  ) : (
                    <div className="flex h-[520px] items-center justify-center bg-slate-100">
                      <p className="font-bold text-slate-500">
                        No flyer image added
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* FLYERS GRID */}
          <section className="mx-auto max-w-7xl px-6 py-16">
            <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div>
                <h2 className="text-3xl font-black text-slate-950">
                  Latest Flyers
                </h2>

                <p className="mt-2 text-slate-600">
                  View upcoming opportunities, showcases, tours, and special
                  announcements.
                </p>
              </div>

              <div className="rounded-full border border-slate-200 bg-slate-50 px-5 py-2 text-sm font-black text-slate-800 shadow-sm">
                {flyers.length} Active Flyers
              </div>
            </div>

            <div className="grid items-stretch gap-8 md:grid-cols-2 lg:grid-cols-3">
              {flyers.map((flyer) => (
                <article
                  key={flyer._id}
                  className="flex overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-2xl"
                >
                  <div className="flex w-full flex-col">
                    <div className="relative flex h-[430px] items-center justify-center bg-slate-100">
                      {flyer.image ? (
                        <button
                          type="button"
                          onClick={() => setSelectedFlyer(flyer)}
                          className="block h-full w-full cursor-zoom-in"
                        >
                          <img
                            src={flyer.image}
                            alt={flyer.title}
                            className="h-full w-full object-contain"
                          />
                        </button>
                      ) : (
                        <p className="font-bold text-slate-500">
                          No flyer image
                        </p>
                      )}

                      {flyer.type && (
                        <span className="absolute left-4 top-4 rounded-full bg-red-700 px-4 py-2 text-xs font-black uppercase tracking-wide text-white shadow">
                          {flyer.type}
                        </span>
                      )}

                      <span className="absolute bottom-4 right-4 rounded-full bg-black/85 px-4 py-2 text-xs font-black text-white shadow">
                        Click to Zoom
                      </span>
                    </div>

                    <div className="flex flex-1 flex-col p-6 text-black">
                      <h3 className="text-2xl font-black text-slate-950">
                        {flyer.title}
                      </h3>

                      <div className="mt-4 grid gap-2 text-sm font-bold text-slate-600">
                        {flyer.date && (
                          <p>
                            <span className="font-black text-red-700">
                              Date:
                            </span>{" "}
                            {new Date(flyer.date).toLocaleDateString()}
                          </p>
                        )}

                        {flyer.location && (
                          <p>
                            <span className="font-black text-red-700">
                              Location:
                            </span>{" "}
                            {flyer.location}
                          </p>
                        )}
                      </div>

                      {flyer.tourDates && flyer.tourDates.length > 0 && (
                        <div className="mt-4 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                          <p className="text-xs font-black uppercase tracking-widest text-red-700">
                            Tour Dates
                          </p>

                          <div className="mt-3 grid gap-3">
                            {flyer.tourDates.map((stop, index) => (
                              <div
                                key={`${stop.city}-${stop.date}-${index}`}
                                className="rounded-xl bg-white p-3 shadow-sm ring-1 ring-slate-200"
                              >
                                <p className="font-black text-slate-950">
                                  {stop.city || "City not listed"} —{" "}
                                  {stop.date
                                    ? new Date(stop.date).toLocaleDateString()
                                    : "No date"}
                                </p>

                                {stop.venue && (
                                  <p className="mt-1 text-sm font-semibold text-slate-500">
                                    {stop.venue}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <p className="mt-4 line-clamp-4 text-sm leading-6 text-slate-600">
                        {flyer.description}
                      </p>

                      <div className="mt-auto flex gap-3 pt-6">
                        <Link
                          to="/apply"
                          className="flex-1 rounded-full border border-slate-300 px-4 py-3 text-center text-sm font-black text-slate-900 hover:border-red-700 hover:text-red-700"
                        >
                          Apply
                        </Link>

                        <Link
                          to="/contact"
                          className="flex-1 rounded-full bg-red-700 px-4 py-3 text-center text-sm font-black text-white hover:bg-red-800"
                        >
                          Contact
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </>
      )}

      {/* CTA */}
      <section className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-5xl px-6 py-20 text-center">
          <p className="font-bold uppercase tracking-[0.25em] text-red-700">
            Stay Connected
          </p>

          <h2 className="mt-4 text-4xl font-black text-slate-950 md:text-5xl">
            Don’t miss the next QueensMen opportunity.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            Follow upcoming casting calls, fashion showcases, brand events,
            tours, and professional model opportunities.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to="/apply"
              className="rounded-full bg-red-700 px-8 py-4 font-black text-white shadow-lg hover:bg-red-800"
            >
              Apply to Model
            </Link>

            <Link
              to="/contact"
              className="rounded-full border border-slate-300 px-8 py-4 font-black text-slate-950 hover:border-black hover:bg-black hover:text-white"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* ZOOM MODAL */}
      {selectedFlyer && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 px-4 py-6">
          <button
            type="button"
            onClick={() => setSelectedFlyer(null)}
            className="absolute right-5 top-5 rounded-full bg-red-700 px-6 py-3 text-base font-black text-white shadow-2xl ring-4 ring-white/30 hover:bg-white hover:text-black"
          >
            ✕ Close
          </button>

          <div className="max-h-[90vh] w-full max-w-6xl overflow-auto rounded-3xl bg-white p-4 shadow-2xl">
            <img
              src={selectedFlyer.image}
              alt={selectedFlyer.title}
              className="mx-auto max-h-[82vh] w-full object-contain"
            />

            <div className="mt-4 flex flex-col justify-between gap-3 text-black md:flex-row md:items-center">
              <div>
                <h2 className="text-2xl font-black text-slate-950">
                  {selectedFlyer.title}
                </h2>

                <p className="mt-1 text-sm font-bold text-red-700">
                  Full flyer preview
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedFlyer(null)}
                className="w-fit rounded-full border border-red-700 px-5 py-2 text-sm font-black text-red-700 hover:bg-red-700 hover:text-white"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
