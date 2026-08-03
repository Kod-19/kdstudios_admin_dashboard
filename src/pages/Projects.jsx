import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { projectService } from "../services/projectService";
import ProjectModal from "../components/ProjectModal";

export default function Projects({ initialMode = null }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const location = useLocation();

  // Modal controls
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    if (initialMode === "create" || location.pathname.endsWith("/new")) {
      setSelectedProject(null);
      setIsModalOpen(true);
    }
  }, [initialMode, location.pathname]);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const data = await projectService.getAllProjects();
      setProjects(data);
    } catch (err) {
      console.error("Error loading projects:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setSelectedProject(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const nextStatus = await projectService.togglePublishStatus(
        id,
        currentStatus,
      );
      setProjects((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, publishStatus: nextStatus } : p,
        ),
      );
    } catch (err) {
      alert("Failed to update publish status");
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      await projectService.deleteProject(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert("Failed to delete project");
    }
  };

  const filteredProjects = projects.filter((p) => {
    if (filter === "published") return p.publishStatus === "published";
    if (filter === "draft") return p.publishStatus === "draft";
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Projects CMS</h1>
          <p className="text-slate-400 text-sm">
            Manage your portfolio showcase items and live project status.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2 rounded-lg text-sm transition self-start sm:self-auto"
        >
          + Add New Project
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        {["all", "published", "draft"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`capitalize px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              filter === status
                ? "bg-slate-800 text-amber-400 border border-slate-700"
                : "text-slate-400 hover:text-white hover:bg-slate-900"
            }`}
          >
            {status} (
            {status === "all"
              ? projects.length
              : projects.filter((p) => p.publishStatus === status).length}
            )
          </button>
        ))}
      </div>

      {/* Projects List */}
      {loading ? (
        <div className="p-8 text-center text-slate-400">
          Loading portfolio projects...
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-xl">
          <p className="text-slate-400 text-sm">
            No projects found for this status.
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-3 md:hidden">
            {filteredProjects.map((project) => (
              <article
                key={project.id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4"
              >
                <div className="flex gap-3">
                  {project.coverImage ? (
                    <img
                      src={project.coverImage}
                      alt=""
                      className="w-16 h-16 rounded-lg object-cover border border-slate-800 bg-slate-950 shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-500 font-mono text-[10px] shrink-0">
                      N/A
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-white text-sm break-words">
                      {project.title}
                    </p>
                    <p className="text-slate-400 text-xs mt-1 line-clamp-2">
                      {project.subtitle || project.description}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-2">
                      {project.category || "Uncategorized"}
                    </p>
                  </div>
                </div>

                {project.techStack?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {project.techStack.slice(0, 4).map((tech, idx) => (
                      <span
                        key={idx}
                        className="bg-slate-800 text-slate-300 px-2 py-1 rounded text-[10px] border border-slate-700"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between gap-3 border-t border-slate-800/70 pt-3">
                  <button
                    onClick={() =>
                      handleToggleStatus(project.id, project.publishStatus)
                    }
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition ${
                      project.publishStatus === "published"
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                        : "bg-slate-800 text-slate-400 border-slate-700"
                    }`}
                  >
                    {project.publishStatus === "published"
                      ? "Published"
                      : "Draft"}
                  </button>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEdit(project)}
                      className="text-slate-300 hover:text-amber-400 font-medium text-xs px-3 py-2 rounded-lg bg-slate-800/70 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(project.id, project.title)}
                      className="text-red-300 hover:text-red-200 font-medium text-xs px-3 py-2 rounded-lg bg-red-500/10 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="hidden md:block bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/60 text-slate-400 uppercase font-mono border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Project</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Tech Stack</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredProjects.map((project) => (
                  <tr
                    key={project.id}
                    className="hover:bg-slate-800/30 transition"
                  >
                    <td className="py-3 px-4 font-medium text-white flex items-center gap-3">
                      {project.coverImage ? (
                        <img
                          src={project.coverImage}
                          alt=""
                          className="w-10 h-10 rounded object-cover border border-slate-800 bg-slate-950 shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-500 font-mono text-[10px] shrink-0">
                          N/A
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-white text-sm">
                          {project.title}
                        </p>
                        <p className="text-slate-400 text-[11px] truncate max-w-xs">
                          {project.subtitle || project.description}
                        </p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-300">
                      {project.category}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {project.techStack?.slice(0, 3).map((tech, idx) => (
                          <span
                            key={idx}
                            className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[10px] border border-slate-700"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() =>
                          handleToggleStatus(project.id, project.publishStatus)
                        }
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition ${
                          project.publishStatus === "published"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"
                            : "bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700"
                        }`}
                      >
                        {project.publishStatus === "published"
                          ? "● Published"
                          : "○ Draft"}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(project)}
                        className="text-slate-400 hover:text-amber-400 font-medium text-xs px-2 py-1 rounded transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(project.id, project.title)}
                        className="text-slate-500 hover:text-red-400 font-medium text-xs px-2 py-1 rounded transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          </div>
        </>
      )}

      {/* Slide-over Project Form Modal */}
      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        projectToEdit={selectedProject}
        onSaveSuccess={loadProjects}
      />
    </div>
  );
}
