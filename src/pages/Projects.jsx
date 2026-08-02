import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  subscribeToProjects,
  createProject,
  updateProject,
  setProjectPublishStatus,
  deleteProject,
} from "../services/projectService";
import {
  FolderKanban,
  Plus,
  Edit3,
  Trash2,
  Globe,
  GitBranch,
  Eye,
  EyeOff,
  Star,
  X,
  CheckCircle2,
} from "lucide-react";

const emptyProjectForm = {
  title: "",
  slug: "",
  description: "",
  longDescription: "",
  publishStatus: "draft", // draft, published, archived
  featured: false,
  sortOrder: 0,
  tags: "",
  demoLink: "",
  githubLink: "",
  imageUrl: "",
  imageAlt: "",
};

const Projects = () => {
  const { currentUser } = useAuth();
  const [projects, setProjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(emptyProjectForm);
  const [submitting, setSubmitting] = useState(false);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const unsubscribe = subscribeToProjects((data) => {
      setProjects(data);
    });
    return () => unsubscribe();
  }, []);

  const handleOpenCreateModal = () => {
    setEditingId(null);
    setFormData(emptyProjectForm);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (proj) => {
    setEditingId(proj.id);
    setFormData({
      title: proj.title || "",
      slug: proj.slug || "",
      description: proj.description || "",
      longDescription: proj.longDescription || "",
      publishStatus: proj.publishStatus || "draft",
      featured: proj.featured || false,
      sortOrder: proj.sortOrder || 0,
      tags: Array.isArray(proj.tags) ? proj.tags.join(", ") : proj.tags || "",
      demoLink: proj.demoLink || "",
      githubLink: proj.githubLink || "",
      imageUrl: proj.imageUrl || "",
      imageAlt: proj.imageAlt || "",
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    // Format tags array from comma-separated string
    const formattedTags =
      typeof formData.tags === "string"
        ? formData.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : formData.tags;

    // Generate slug from title if empty
    const slug =
      formData.slug ||
      formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

    const payload = {
      ...formData,
      slug,
      tags: formattedTags,
      sortOrder: Number(formData.sortOrder) || 0,
    };

    try {
      if (editingId) {
        await updateProject(editingId, payload, currentUser.uid);
      } else {
        await createProject(payload, currentUser.uid);
      }
      setIsModalOpen(false);
      setFormData(emptyProjectForm);
    } catch (err) {
      console.error("Failed to save project:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleTogglePublish = async (proj) => {
    const nextStatus =
      proj.publishStatus === "published" ? "draft" : "published";
    await setProjectPublishStatus(proj.id, nextStatus, currentUser.uid);
  };

  const handleDelete = async (proj) => {
    if (window.confirm(`Are you sure you want to delete "${proj.title}"?`)) {
      await deleteProject(proj.id, proj.title, currentUser.uid);
    }
  };

  const filteredProjects = projects.filter((p) => {
    if (filter === "published") return p.publishStatus === "published";
    if (filter === "draft") return p.publishStatus === "draft";
    if (filter === "featured") return p.featured === true;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <FolderKanban className="w-6 h-6 text-brand-accent" /> Projects CMS
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Manage portfolio cards, case studies, and live demo links
          </p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="flex items-center gap-2 px-4 py-2 bg-brand-accent hover:bg-sky-400 text-slate-950 font-semibold rounded-lg text-sm transition"
        >
          <Plus className="w-4 h-4" /> Add New Project
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-brand-border pb-3">
        {[
          { id: "all", label: `All (${projects.length})` },
          { id: "published", label: "Published" },
          { id: "draft", label: "Drafts" },
          { id: "featured", label: "Featured" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              filter === tab.id
                ? "bg-brand-accent/20 text-brand-accent border border-brand-accent/30"
                : "text-slate-400 hover:bg-brand-card"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Projects Grid / Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.length === 0 ? (
          <div className="col-span-full bg-brand-card border border-brand-border rounded-xl p-8 text-center text-slate-500">
            No projects found in this category. Click "Add New Project" to
            create one.
          </div>
        ) : (
          filteredProjects.map((proj) => (
            <div
              key={proj.id}
              className="bg-brand-card border border-brand-border rounded-xl overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Project Image Preview */}
                <div className="h-40 bg-slate-900 relative overflow-hidden flex items-center justify-center border-b border-brand-border">
                  {proj.imageUrl ? (
                    <img
                      src={proj.imageUrl}
                      alt={proj.imageAlt || proj.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-xs text-slate-600 font-mono">
                      No Image Uploaded
                    </span>
                  )}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    {proj.featured && (
                      <span
                        className="p-1 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded"
                        title="Featured Project"
                      >
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                      </span>
                    )}
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                        proj.publishStatus === "published"
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          : "bg-slate-700 text-slate-300"
                      }`}
                    >
                      {proj.publishStatus}
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-5 space-y-2">
                  <h3 className="font-bold text-white text-base leading-snug">
                    {proj.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2">
                    {proj.description}
                  </p>

                  {/* Tags */}
                  {Array.isArray(proj.tags) && proj.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {proj.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] bg-brand-border/60 text-slate-300 px-2 py-0.5 rounded font-mono"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-4 border-t border-brand-border flex items-center justify-between bg-brand-dark/30">
                <div className="flex items-center gap-2">
                  {proj.demoLink && (
                    <a
                      href={proj.demoLink}
                      target="_blank"
                      rel="noreferrer"
                      className="text-slate-400 hover:text-brand-accent transition"
                    >
                      <Globe className="w-4 h-4" />
                    </a>
                  )}
                  {proj.githubLink && (
                    <a
                      href={proj.githubLink}
                      target="_blank"
                      rel="noreferrer"
                      className="text-slate-400 hover:text-white transition"
                    >
                      <GitBranch className="w-4 h-4" />
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleTogglePublish(proj)}
                    title={
                      proj.publishStatus === "published"
                        ? "Unpublish"
                        : "Publish"
                    }
                    className="p-1.5 text-slate-400 hover:text-white hover:bg-brand-border rounded transition"
                  >
                    {proj.publishStatus === "published" ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => handleOpenEditModal(proj)}
                    className="p-1.5 text-slate-400 hover:text-brand-accent hover:bg-brand-border rounded transition"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(proj)}
                    className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-brand-border rounded transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create / Edit Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-brand-card border border-brand-border rounded-xl max-w-2xl w-full p-6 space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-brand-border pb-3">
              <h2 className="text-lg font-bold text-white">
                {editingId ? "Edit Project" : "Add New Project"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="Recipe Planner App"
                    className="w-full px-3 py-2 bg-brand-dark border border-brand-border rounded-lg text-sm text-white focus:outline-none focus:border-brand-accent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Slug (URL string)
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({ ...formData, slug: e.target.value })
                    }
                    placeholder="recipe-planner-app"
                    className="w-full px-3 py-2 bg-brand-dark border border-brand-border rounded-lg text-sm text-white focus:outline-none focus:border-brand-accent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Short Description *
                </label>
                <textarea
                  required
                  rows={2}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Brief summary for project cards..."
                  className="w-full px-3 py-2 bg-brand-dark border border-brand-border rounded-lg text-sm text-white focus:outline-none focus:border-brand-accent"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) =>
                      setFormData({ ...formData, tags: e.target.value })
                    }
                    placeholder="React, Tailwind, Node.js"
                    className="w-full px-3 py-2 bg-brand-dark border border-brand-border rounded-lg text-sm text-white focus:outline-none focus:border-brand-accent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Publish Status
                  </label>
                  <select
                    value={formData.publishStatus}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        publishStatus: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-brand-dark border border-brand-border rounded-lg text-sm text-white focus:outline-none focus:border-brand-accent"
                  >
                    <option value="draft">Draft (Dashboard only)</option>
                    <option value="published">
                      Published (Visible on Portfolio)
                    </option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Live Demo URL
                  </label>
                  <input
                    type="url"
                    value={formData.demoLink}
                    onChange={(e) =>
                      setFormData({ ...formData, demoLink: e.target.value })
                    }
                    placeholder="https://my-app.vercel.app"
                    className="w-full px-3 py-2 bg-brand-dark border border-brand-border rounded-lg text-sm text-white focus:outline-none focus:border-brand-accent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    GitHub Repo URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={formData.githubLink}
                    onChange={(e) =>
                      setFormData({ ...formData, githubLink: e.target.value })
                    }
                    placeholder="https://github.com/..."
                    className="w-full px-3 py-2 bg-brand-dark border border-brand-border rounded-lg text-sm text-white focus:outline-none focus:border-brand-accent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Cover Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, imageUrl: e.target.value })
                    }
                    placeholder="https://res.cloudinary.com/..."
                    className="w-full px-3 py-2 bg-brand-dark border border-brand-border rounded-lg text-sm text-white focus:outline-none focus:border-brand-accent"
                  />
                </div>
                <div className="flex items-center gap-4 pt-6">
                  <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) =>
                        setFormData({ ...formData, featured: e.target.checked })
                      }
                      className="w-4 h-4 rounded border-brand-border bg-brand-dark text-brand-accent focus:ring-0"
                    />
                    <span>Feature on homepage</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-brand-border pt-4 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-brand-border/40 hover:bg-brand-border text-slate-300 text-sm font-semibold rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-brand-accent hover:bg-sky-400 text-slate-950 text-sm font-semibold rounded-lg transition disabled:opacity-50"
                >
                  {submitting
                    ? "Saving..."
                    : editingId
                      ? "Update Project"
                      : "Create Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
