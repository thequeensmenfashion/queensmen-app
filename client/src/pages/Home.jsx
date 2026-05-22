import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/api";

export default function Home() {
  const [featuredModels, setFeaturedModels] = useState([]);
  const [modelsLoading, setModelsLoading] = useState(true);
  const [modelsError, setModelsError] = useState("");

  const [settings, setSettings] = useState(null);
  const [settingsLoading, setSettingsLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    const fetchFeaturedModels = async () => {
      try {
        setModelsLoading(true);
        setModelsError("");

        const { data } = await API.get("/api/models/featured/list");

        if (!ignore) {
          setFeaturedModels(data.models || []);
        }
      } catch (error) {
        console.error("Fetch featured models error:", error);

        if (!ignore) {
          setModelsError("Featured models could not be loaded right now.");
        }
      } finally {
        if (!ignore) {
          setModelsLoading(false);
        }
      }
    };

    fetchFeaturedModels();

    return () => {
      ignore = true;
    };
  }, []);

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
        console.error("Fetch settings error:", error);

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
  const phone = settings?.phone || "(704) 555-1234";
  const email = settings?.email || "info@thequeensmen.com";
  const instagram = settings?.instagram || "";
  const facebook = settings?.facebook || "";
  const tiktok = settings?.tiktok || "";
  const logo = settings?.logo || "";
  const ownerPhoto = settings?.ownerPhoto || "";

  const heroDescription =
    settings?.heroDescription ||
    "The Queensmen are a set of exclusive professional male models. They represent classy and vintage Gentle Men with a touch of boldness.";

  const ownerTitle = settings?.ownerTitle || "The Vision Behind The QueensMen";

  const ownerBio =
    settings?.ownerBio ||
    "The QueensMen was created to showcase exclusive professional male models who carry themselves with class, vintage style, confidence, and bold character.";

  const ownerQuote =
    settings?.ownerQuote ||
    "Classy. Vintage. Bold. That is the standard of The QueensMen.";

  return (
    <main className="bg-white">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-white text-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_left,_rgba(185,28,28,0.12),_transparent_35%),radial-gradient(circle_at_right,_rgba(0,0,0,0.06),_transparent_30%)]" />

        <div className="relative mx-auto min-h-[82vh] max-w-7xl px-6 py-20">
          {settingsLoading && (
            <p className="mb-4 text-sm font-bold text-slate-500">
              Loading business settings...
            </p>
          )}

          <div className="flex flex-col items-start gap-8 md:flex-row md:items-center">
            {/* LOGO */}
            <div className="flex h-56 w-40 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-2 border-red-700 bg-white p-3 shadow-2xl md:h-64 md:w-44">
              {logo ? (
                <img
                  src={logo}
                  alt={`${businessName} logo`}
                  className="h-full w-full object-contain"
                />
              ) : (
                <span className="text-4xl font-black text-red-600 md:text-5xl">
                  QM
                </span>
              )}
            </div>

            {/* HEADING + CONTACT */}
            <div>
              <p className="mb-3 font-bold uppercase tracking-[0.35em] text-red-700">
                {tagline}
              </p>

              <h1 className="text-6xl font-black leading-none md:text-8xl lg:text-9xl">
                {businessName === "The QueensMen" ? (
                  <>
                    <span className="text-black">The </span>
                    <span className="text-red-700">Q</span>
                    <span className="text-black">ueensMen</span>
                  </>
                ) : (
                  <span className="text-black">{businessName}</span>
                )}
              </h1>

              <div className="mt-6 space-y-2 text-base font-semibold text-slate-700 md:text-lg">
                <p>
                  Phone:{" "}
                  <a
                    href={`tel:${phone.replace(/\D/g, "")}`}
                    className="text-black hover:text-red-700"
                  >
                    {phone}
                  </a>
                </p>

                <p>
                  Email:{" "}
                  <a
                    href={`mailto:${email}`}
                    className="text-black hover:text-red-700"
                  >
                    {email}
                  </a>
                </p>

                <p>
                  Social:{" "}
                  {instagram ? (
                    <a
                      href={instagram}
                      target="_blank"
                      rel="noreferrer"
                      className="text-black hover:text-red-700"
                    >
                      Instagram
                    </a>
                  ) : (
                    <span className="text-slate-500">Instagram</span>
                  )}{" "}
                  <span className="text-slate-400">|</span>{" "}
                  {facebook ? (
                    <a
                      href={facebook}
                      target="_blank"
                      rel="noreferrer"
                      className="text-black hover:text-red-700"
                    >
                      Facebook
                    </a>
                  ) : (
                    <span className="text-slate-500">Facebook</span>
                  )}{" "}
                  <span className="text-slate-400">|</span>{" "}
                  {tiktok ? (
                    <a
                      href={tiktok}
                      target="_blank"
                      rel="noreferrer"
                      className="text-black hover:text-red-700"
                    >
                      TikTok
                    </a>
                  ) : (
                    <span className="text-slate-500">TikTok</span>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* DESCRIPTION CARD */}
          <div className="mt-14 max-w-4xl rounded-[2rem] border border-slate-200 bg-white p-8 shadow-2xl">
            <p className="text-2xl font-semibold leading-10 text-slate-800 md:text-3xl">
              {heroDescription}
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/models"
                className="rounded-full bg-red-700 px-7 py-3 font-bold text-white shadow-lg hover:bg-red-800"
              >
                View Models
              </Link>

              <Link
                to="/book"
                className="rounded-full border border-black px-7 py-3 font-bold text-black hover:bg-black hover:text-white"
              >
                Book QueensMen
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* OWNER SECTION */}
      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-20 lg:grid-cols-2">
          <div className="overflow-hidden rounded-[2rem] bg-slate-100 shadow-xl">
            {ownerPhoto ? (
              <img
                src={ownerPhoto}
                alt={`Owner of ${businessName}`}
                className="h-[520px] w-full bg-slate-100 object-contain"
              />
            ) : (
              <div className="flex h-[520px] items-center justify-center bg-slate-100">
                <p className="font-bold text-slate-500">
                  Owner photo not added yet
                </p>
              </div>
            )}
          </div>

          <div>
            <p className="font-bold uppercase tracking-[0.25em] text-red-700">
              Meet The Owner
            </p>

            <h2 className="mt-3 text-4xl font-black text-slate-950 md:text-5xl">
              {ownerTitle}
            </h2>

            <p className="mt-6 text-lg leading-8 text-slate-600">{ownerBio}</p>

            <div className="mt-8 rounded-2xl border-l-4 border-red-700 bg-slate-50 p-6">
              <p className="text-lg font-semibold italic text-slate-700">
                “{ownerQuote}”
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED MODELS */}
      <section className="mx-auto max-w-7xl bg-white px-6 py-20">
        <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="font-bold uppercase tracking-[0.25em] text-red-700">
              Featured Talent
            </p>

            <h2 className="mt-2 text-4xl font-black text-black">
              Meet The QueensMen
            </h2>
          </div>

          <Link
            to="/models"
            className="font-bold text-red-700 hover:text-red-800"
          >
            View all models →
          </Link>
        </div>

        {modelsLoading && (
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 text-center">
            <p className="font-bold text-slate-600">
              Loading featured models...
            </p>
          </div>
        )}

        {modelsError && (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700">
            <p className="font-bold">{modelsError}</p>
          </div>
        )}

        {!modelsLoading && !modelsError && featuredModels.length === 0 && (
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 text-center">
            <h3 className="text-2xl font-black text-slate-950">
              No featured models yet
            </h3>

            <p className="mt-3 text-slate-600">
              Mark models as Featured in the admin dashboard to show them here.
            </p>
          </div>
        )}

        {!modelsLoading && !modelsError && featuredModels.length > 0 && (
          <div className="grid gap-6 md:grid-cols-3">
            {featuredModels.map((model) => (
              <Link
                to={`/models/${model._id}`}
                key={model._id}
                className="group overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-2xl"
              >
                {model.image ? (
                  <img
                    src={model.image}
                    alt={model.name}
                    className="h-96 w-full bg-slate-100 object-contain transition duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-96 items-center justify-center bg-slate-100">
                    <p className="font-bold text-slate-500">No image added</p>
                  </div>
                )}

                <div className="p-5 text-black">
                  <h3 className="text-xl font-black text-slate-950">
                    {model.name}
                  </h3>

                  <p className="mt-1 text-red-700">{model.category}</p>

                  <p className="mt-2 text-sm text-slate-500">
                    {model.location}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* INFO CARDS */}
      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-20 md:grid-cols-3">
          <div className="rounded-3xl bg-slate-50 p-8 shadow ring-1 ring-slate-200">
            <h3 className="text-2xl font-black text-slate-950">
              Classy Presence
            </h3>

            <p className="mt-3 text-slate-600">
              Professional male models with polished style and refined energy.
            </p>
          </div>

          <div className="rounded-3xl bg-slate-50 p-8 shadow ring-1 ring-slate-200">
            <h3 className="text-2xl font-black text-slate-950">
              Vintage Gentlemen
            </h3>

            <p className="mt-3 text-slate-600">
              A brand built around timeless fashion, confidence, and bold
              character.
            </p>
          </div>

          <div className="rounded-3xl bg-slate-50 p-8 shadow ring-1 ring-slate-200">
            <h3 className="text-2xl font-black text-slate-950">Event Ready</h3>

            <p className="mt-3 text-slate-600">
              Available for fashion shows, shoots, brand campaigns, and upscale
              events.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
