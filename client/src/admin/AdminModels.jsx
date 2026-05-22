import { useEffect, useState } from "react";
import API from "../api/api";
import ImageUpload from "../components/ImageUpload";
import AdminNavbar from "../components/AdminNavbar";

export default function AdminModels() {
  const [models, setModels] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    location: "",
    height: "",
    experience: "",
    availability: "",
    bio: "",
    image: "",
    portfolioImages: [],
    isFeatured: false,
    isActive: true,
  });

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let ignore = false;

    const fetchModels = async () => {
      try {
        setLoading(true);
        setError("");

        const { data } = await API.get("/api/models/admin/all");

        if (!ignore) {
          setModels(data.models || []);
        }
      } catch (error) {
        console.error("Fetch admin models error:", error);

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

  const resetForm = () => {
    setFormData({
      name: "",
      category: "",
      location: "",
      height: "",
      experience: "",
      availability: "",
      bio: "",
      image: "",
      portfolioImages: [],
      isFeatured: false,
      isActive: true,
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const addPortfolioImage = (imageUrl) => {
    setFormData((prev) => ({
      ...prev,
      portfolioImages: [...prev.portfolioImages, imageUrl],
    }));
  };

  const removePortfolioImage = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      portfolioImages: prev.portfolioImages.filter(
        (_, index) => index !== indexToRemove,
      ),
    }));
  };

  const startEdit = (model) => {
    setEditingId(model._id);

    setFormData({
      name: model.name || "",
      category: model.category || "",
      location: model.location || "",
      height: model.height || "",
      experience: model.experience || "",
      availability: model.availability || "",
      bio: model.bio || "",
      image: model.image || "",
      portfolioImages: model.portfolioImages || [],
      isFeatured: model.isFeatured || false,
      isActive: model.isActive ?? true,
    });

    setSuccess("");
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    resetForm();
    setError("");
    setSuccess("");
  };

  const handleSubmitModel = async (e) => {
    e.preventDefault();

    try {
      setCreating(true);
      setError("");
      setSuccess("");

      if (editingId) {
        const { data } = await API.put(`/api/models/${editingId}`, formData);

        setModels((prev) =>
          prev.map((model) => (model._id === editingId ? data.model : model)),
        );

        setSuccess("Model profile updated successfully!");
        setEditingId(null);
      } else {
        const { data } = await API.post("/api/models", formData);

        setModels((prev) => [data.model, ...prev]);

        setSuccess("Model profile created successfully!");
      }

      resetForm();

      setTimeout(() => {
        setSuccess("");
      }, 5000);
    } catch (error) {
      console.error("Submit model error:", error);

      setError(
        error.response?.data?.message ||
          "Something went wrong while saving the model profile.",
      );

      setTimeout(() => {
        setError("");
      }, 5000);
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (modelId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this model profile?",
    );

    if (!confirmDelete) return;

    try {
      setDeletingId(modelId);

      await API.delete(`/api/models/${modelId}`);

      setModels((prev) => prev.filter((model) => model._id !== modelId));
    } catch (error) {
      console.error("Delete model error:", error);

      alert(
        error.response?.data?.message ||
          "Something went wrong while deleting the model profile.",
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      <AdminNavbar />

      <main className="min-h-screen bg-slate-50 px-6 py-16 text-black">
        <div className="mx-auto max-w-7xl">
          {/* HEADER */}
          <section className="mb-10 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl">
            <p className="font-bold uppercase tracking-[0.25em] text-red-700">
              Admin Models
            </p>

            <div className="mt-4 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
              <div>
                <h1 className="text-4xl font-black text-slate-950 md:text-5xl">
                  Manage <span className="text-red-700">Models</span>
                </h1>

                <p className="mt-4 max-w-2xl text-slate-600">
                  Add, edit, feature, hide, and manage QueensMen model profiles
                  with main photos and portfolio images.
                </p>
              </div>

              <div className="rounded-full border border-slate-200 bg-slate-50 px-5 py-2 text-sm font-black text-slate-800 shadow-sm">
                {models.length} Total Models
              </div>
            </div>
          </section>

          <section className="grid gap-10 xl:grid-cols-[1fr_1.25fr]">
            {/* FORM */}
            <form
              onSubmit={handleSubmitModel}
              className="rounded-[2rem] border border-slate-200 bg-white p-6 text-black shadow-xl"
            >
              <div className="rounded-3xl bg-slate-50 p-5 ring-1 ring-slate-200">
                <p className="text-sm font-black uppercase tracking-[0.2em] text-red-700">
                  {editingId ? "Editing Mode" : "Create Mode"}
                </p>

                <h2 className="mt-2 text-3xl font-black text-slate-950">
                  {editingId ? "Edit Model Profile" : "Add New Model"}
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Upload a main image and optional portfolio photos. Use
                  Active/Public to show or hide the model on the public site.
                </p>
              </div>

              <div className="mt-6 grid gap-5">
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-red-700"
                    placeholder="Example: Malik Stone"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Category *
                  </label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-red-700"
                    placeholder="Runway / Editorial"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Location *
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-red-700"
                    placeholder="Charlotte, NC"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      Height
                    </label>
                    <input
                      type="text"
                      name="height"
                      value={formData.height}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-red-700"
                      placeholder="6'1&quot;"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      Experience
                    </label>
                    <input
                      type="text"
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-red-700"
                      placeholder="Professional"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Available For
                  </label>
                  <input
                    type="text"
                    name="availability"
                    value={formData.availability}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-red-700"
                    placeholder="Fashion Shows, Photoshoots, Brand Events"
                  />
                </div>

                {/* MAIN IMAGE */}
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-sm font-black uppercase tracking-[0.2em] text-red-700">
                    Main Image
                  </p>

                  <div className="mt-4 grid gap-4">
                    <ImageUpload
                      label="Upload Main Model Image"
                      onUpload={(imageUrl) =>
                        setFormData((prev) => ({
                          ...prev,
                          image: imageUrl,
                        }))
                      }
                    />

                    <div>
                      <label className="mb-2 block text-sm font-bold text-slate-700">
                        Main Image URL
                      </label>
                      <input
                        type="url"
                        name="image"
                        value={formData.image}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-red-700"
                        placeholder="https://..."
                      />
                    </div>

                    {formData.image && (
                      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                        <img
                          src={formData.image}
                          alt="Model preview"
                          className="h-80 w-full bg-slate-100 object-contain"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* PORTFOLIO IMAGES */}
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-sm font-black uppercase tracking-[0.2em] text-red-700">
                    Portfolio Images
                  </p>

                  <p className="mt-1 text-sm text-slate-600">
                    Upload extra photos for this model’s detail page.
                  </p>

                  <div className="mt-4">
                    <ImageUpload
                      label="Upload Portfolio Image"
                      onUpload={addPortfolioImage}
                    />
                  </div>

                  {formData.portfolioImages.length > 0 && (
                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                      {formData.portfolioImages.map((imageUrl, index) => (
                        <div
                          key={`${imageUrl}-${index}`}
                          className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                        >
                          <img
                            src={imageUrl}
                            alt={`Portfolio ${index + 1}`}
                            className="h-52 w-full bg-slate-100 object-contain"
                          />

                          <button
                            type="button"
                            onClick={() => removePortfolioImage(index)}
                            className="w-full bg-red-700 px-4 py-3 text-sm font-black text-white hover:bg-red-800"
                          >
                            Remove Image
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Bio *
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    required
                    rows="5"
                    className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-red-700"
                    placeholder="Write a short professional model bio..."
                  />
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex flex-wrap gap-5">
                    <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                      <input
                        type="checkbox"
                        name="isFeatured"
                        checked={formData.isFeatured}
                        onChange={handleChange}
                        className="h-4 w-4"
                      />
                      Featured on Homepage
                    </label>

                    <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                      <input
                        type="checkbox"
                        name="isActive"
                        checked={formData.isActive}
                        onChange={handleChange}
                        className="h-4 w-4"
                      />
                      Active/Public
                    </label>
                  </div>
                </div>

                {error && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-bold text-green-700">
                    {success}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={creating}
                  className="rounded-full bg-red-700 px-6 py-4 font-black text-white shadow-lg hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {creating
                    ? editingId
                      ? "Updating..."
                      : "Creating..."
                    : editingId
                      ? "Update Model Profile"
                      : "Create Model Profile"}
                </button>

                {editingId && (
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="rounded-full border border-slate-300 px-6 py-4 font-black text-slate-900 hover:border-black hover:bg-black hover:text-white"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
            </form>

            {/* MODELS LIST */}
            <section>
              {loading && (
                <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                  <p className="font-bold text-slate-600">Loading models...</p>
                </div>
              )}

              {!loading && models.length === 0 && (
                <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                  <h2 className="text-2xl font-black text-slate-950">
                    No models yet
                  </h2>

                  <p className="mt-3 text-slate-600">
                    Add the first model profile using the form.
                  </p>
                </div>
              )}

              {!loading && models.length > 0 && (
                <div className="grid gap-6">
                  {models.map((model) => (
                    <article
                      key={model._id}
                      className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white text-black shadow-xl"
                    >
                      {model.image ? (
                        <img
                          src={model.image}
                          alt={model.name}
                          className="h-96 w-full bg-slate-100 object-contain"
                        />
                      ) : (
                        <div className="flex h-96 items-center justify-center bg-slate-100">
                          <p className="font-bold text-slate-500">
                            No image added
                          </p>
                        </div>
                      )}

                      <div className="p-6">
                        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                          <div>
                            <p className="text-sm font-black uppercase tracking-[0.2em] text-red-700">
                              {model.isActive ? "Active" : "Hidden"}
                              {model.isFeatured ? " • Featured" : ""}
                            </p>

                            <h2 className="mt-2 text-3xl font-black text-slate-950">
                              {model.name}
                            </h2>

                            <p className="mt-1 font-bold text-red-700">
                              {model.category}
                            </p>
                          </div>

                          <div className="flex flex-wrap gap-3">
                            <button
                              type="button"
                              onClick={() => startEdit(model)}
                              className="rounded-full bg-black px-5 py-3 text-sm font-black text-white hover:bg-red-700"
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              disabled={deletingId === model._id}
                              onClick={() => handleDelete(model._id)}
                              className="rounded-full border border-red-700 px-5 py-3 text-sm font-black text-red-700 hover:bg-red-700 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {deletingId === model._id
                                ? "Deleting..."
                                : "Delete"}
                            </button>
                          </div>
                        </div>

                        <div className="mt-5 grid gap-4 md:grid-cols-3">
                          <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                            <p className="text-xs font-black uppercase tracking-widest text-red-700">
                              Location
                            </p>
                            <p className="mt-2 font-bold text-slate-900">
                              {model.location || "Not provided"}
                            </p>
                          </div>

                          <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                            <p className="text-xs font-black uppercase tracking-widest text-red-700">
                              Height
                            </p>
                            <p className="mt-2 font-bold text-slate-900">
                              {model.height || "Not provided"}
                            </p>
                          </div>

                          <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                            <p className="text-xs font-black uppercase tracking-widest text-red-700">
                              Experience
                            </p>
                            <p className="mt-2 font-bold text-slate-900">
                              {model.experience || "Not provided"}
                            </p>
                          </div>
                        </div>

                        {model.portfolioImages &&
                          model.portfolioImages.length > 0 && (
                            <div className="mt-5 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                              <p className="text-xs font-black uppercase tracking-widest text-red-700">
                                Portfolio Images
                              </p>

                              <p className="mt-2 text-sm font-bold text-slate-700">
                                {model.portfolioImages.length} image
                                {model.portfolioImages.length === 1
                                  ? ""
                                  : "s"}{" "}
                                added
                              </p>

                              <div className="mt-4 grid grid-cols-3 gap-3">
                                {model.portfolioImages
                                  .slice(0, 3)
                                  .map((imageUrl, index) => (
                                    <img
                                      key={`${imageUrl}-${index}`}
                                      src={imageUrl}
                                      alt={`${model.name} portfolio ${
                                        index + 1
                                      }`}
                                      className="h-28 w-full rounded-xl bg-slate-100 object-contain ring-1 ring-slate-200"
                                    />
                                  ))}
                              </div>
                            </div>
                          )}

                        <p className="mt-5 leading-7 text-slate-600">
                          {model.bio}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </section>
        </div>
      </main>
    </>
  );
}
