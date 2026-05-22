import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import API from "../api/api";

export default function ModelDetails() {
  const { id } = useParams();

  const [model, setModel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    let ignore = false;

    const fetchModel = async () => {
      try {
        setLoading(true);
        setError("");

        const { data } = await API.get(`/api/models/${id}`);

        if (!ignore) {
          setModel(data.model);
        }
      } catch (error) {
        console.error("Fetch model details error:", error);

        if (!ignore) {
          setError(
            error.response?.data?.message ||
              "Something went wrong while loading this model profile.",
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchModel();

    return () => {
      ignore = true;
    };
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-white px-6 py-20 text-black">
        <div className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-slate-50 p-8 text-center">
          <p className="font-bold text-slate-600">Loading model profile...</p>
        </div>
      </main>
    );
  }

  if (error || !model) {
    return (
      <main className="min-h-screen bg-white px-6 py-20 text-black">
        <div className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-slate-50 p-8 text-center">
          <h1 className="text-5xl font-black text-slate-950">
            Model Not Found
          </h1>

          <p className="mt-4 text-slate-600">
            {error || "This model profile does not exist."}
          </p>

          <Link
            to="/models"
            className="mt-8 inline-flex rounded-full bg-red-700 px-7 py-3 font-black text-white hover:bg-red-800"
          >
            Back to Models
          </Link>
        </div>
      </main>
    );
  }

  const portfolioCount = model.portfolioImages?.length || 0;

  return (
    <main className="bg-white text-black">
      {/* HEADER */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <Link
                to="/models"
                className="font-black text-red-700 hover:text-red-800"
              >
                ← Back to Models
              </Link>

              <p className="mt-8 font-bold uppercase tracking-[0.25em] text-red-700">
                QueensMen Profile
              </p>

              <h1 className="mt-4 text-5xl font-black text-slate-950 md:text-7xl">
                {model.name}
              </h1>

              <p className="mt-4 text-xl font-bold text-slate-600">
                {model.category || "Professional Model"}
              </p>
            </div>

            <Link
              to="/book"
              className="w-fit rounded-full bg-red-700 px-8 py-4 font-black text-white shadow-lg hover:bg-red-800"
            >
              Book This Model
            </Link>
          </div>
        </div>
      </section>

      {/* PROFILE */}
      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-[1fr_1.1fr]">
        {/* MAIN IMAGE */}
        <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-100 shadow-xl">
          {model.image ? (
            <button
              type="button"
              onClick={() =>
                setSelectedImage({
                  src: model.image,
                  alt: model.name,
                  title: model.name,
                })
              }
              className="block w-full cursor-zoom-in"
            >
              <img
                src={model.image}
                alt={model.name}
                className="h-[650px] w-full bg-slate-100 object-contain"
              />
            </button>
          ) : (
            <div className="flex h-[650px] items-center justify-center bg-slate-100">
              <p className="font-bold text-slate-500">No image added</p>
            </div>
          )}
        </div>

        {/* DETAILS */}
        <div className="flex flex-col justify-center">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
            <p className="font-bold uppercase tracking-[0.25em] text-red-700">
              Model Details
            </p>

            <h2 className="mt-3 text-4xl font-black text-slate-950">
              Classy. Vintage. Bold.
            </h2>

            <p className="mt-6 text-lg leading-8 text-slate-600">
              {model.bio || "Bio coming soon."}
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-200">
                <p className="text-sm font-black uppercase tracking-widest text-red-700">
                  Location
                </p>
                <p className="mt-2 text-lg font-black text-slate-950">
                  {model.location || "Not provided"}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-200">
                <p className="text-sm font-black uppercase tracking-widest text-red-700">
                  Height
                </p>
                <p className="mt-2 text-lg font-black text-slate-950">
                  {model.height || "Not provided"}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-200">
                <p className="text-sm font-black uppercase tracking-widest text-red-700">
                  Experience
                </p>
                <p className="mt-2 text-lg font-black text-slate-950">
                  {model.experience || "Not provided"}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-200">
                <p className="text-sm font-black uppercase tracking-widest text-red-700">
                  Portfolio
                </p>
                <p className="mt-2 text-lg font-black text-slate-950">
                  {portfolioCount} photo{portfolioCount === 1 ? "" : "s"}
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border-l-4 border-red-700 bg-slate-50 p-5">
              <p className="text-sm font-black uppercase tracking-widest text-red-700">
                Available For
              </p>

              <p className="mt-2 leading-7 text-slate-600">
                {model.availability ||
                  "Booking details available upon request."}
              </p>
            </div>

            <p className="mt-5 text-sm font-bold text-slate-500">
              Click any image to view it larger.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/book"
                className="rounded-full bg-red-700 px-8 py-4 font-black text-white shadow-lg hover:bg-red-800"
              >
                Book This Model
              </Link>

              <Link
                to="/contact"
                className="rounded-full border border-slate-300 px-8 py-4 font-black text-slate-950 hover:border-black hover:bg-black hover:text-white"
              >
                Ask a Question
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* PORTFOLIO */}
      <section className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <p className="font-bold uppercase tracking-[0.25em] text-red-700">
            Portfolio
          </p>

          <h2 className="mt-3 text-4xl font-black text-slate-950">
            Portfolio Images
          </h2>

          <p className="mt-3 text-slate-600">
            Click any image to view it larger.
          </p>

          {portfolioCount > 0 ? (
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {model.portfolioImages.map((image, index) => (
                <div
                  key={`${image}-${index}`}
                  className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg"
                >
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedImage({
                        src: image,
                        alt: `${model.name} portfolio ${index + 1}`,
                        title: `${model.name} Portfolio ${index + 1}`,
                      })
                    }
                    className="block w-full cursor-zoom-in"
                  >
                    <img
                      src={image}
                      alt={`${model.name} portfolio ${index + 1}`}
                      className="h-80 w-full bg-slate-100 object-contain"
                    />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center">
              <h3 className="text-2xl font-black text-slate-950">
                More Photos Coming Soon
              </h3>

              <p className="mt-3 text-slate-600">
                Portfolio images will appear here once they are added from the
                admin dashboard.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="bg-white">
        <div className="mx-auto max-w-5xl px-6 py-20 text-center">
          <p className="font-bold uppercase tracking-[0.25em] text-red-700">
            Interested?
          </p>

          <h2 className="mt-4 text-4xl font-black text-slate-950 md:text-5xl">
            Book {model.name} for your next event.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            Submit a booking request with your event details, preferred date,
            location, and talent needs.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to="/book"
              className="rounded-full bg-red-700 px-8 py-4 font-black text-white shadow-lg hover:bg-red-800"
            >
              Request Booking
            </Link>

            <Link
              to="/models"
              className="rounded-full border border-slate-300 px-8 py-4 font-black text-slate-950 hover:border-black hover:bg-black hover:text-white"
            >
              View More Models
            </Link>
          </div>
        </div>
      </section>

      {/* ZOOM MODAL */}
      {selectedImage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 px-4 py-6">
          <button
            type="button"
            onClick={() => setSelectedImage(null)}
            className="absolute right-5 top-5 rounded-full bg-red-700 px-6 py-3 text-base font-black text-white shadow-2xl ring-4 ring-white/30 hover:bg-white hover:text-black"
          >
            ✕ Close
          </button>

          <div className="max-h-[90vh] w-full max-w-6xl overflow-auto rounded-3xl bg-white p-4 shadow-2xl">
            <img
              src={selectedImage.src}
              alt={selectedImage.alt}
              className="mx-auto max-h-[82vh] w-full object-contain"
            />

            <div className="mt-4 flex flex-col justify-between gap-3 text-black md:flex-row md:items-center">
              <div>
                <h2 className="text-2xl font-black text-slate-950">
                  {selectedImage.title}
                </h2>

                <p className="mt-1 text-sm font-bold text-red-700">
                  Full image preview
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedImage(null)}
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
