import React, { useState, useEffect } from 'react';
import { projectService } from '../services/projectService';

export default function ProjectModal({ isOpen, onClose, projectToEdit, onSaveSuccess }) {
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    category: 'Web App',
    description: '',
    coverImage: '',
    techStack: '',
    liveUrl: '',
    githubUrl: '',
    publishStatus: 'draft',
    sortOrder: 0,
    featured: false,
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (projectToEdit) {
      setFormData({
        title: projectToEdit.title || '',
        subtitle: projectToEdit.subtitle || '',
        category: projectToEdit.category || 'Web App',
        description: projectToEdit.description || '',
        coverImage: projectToEdit.coverImage || '',
        techStack: projectToEdit.techStack ? projectToEdit.techStack.join(', ') : '',
        liveUrl: projectToEdit.liveUrl || '',
        githubUrl: projectToEdit.githubUrl || '',
        publishStatus: projectToEdit.publishStatus || 'draft',
        sortOrder: projectToEdit.sortOrder || 0,
        featured: Boolean(projectToEdit.featured),
      });
    } else {
      // Reset for new project
      setFormData({
        title: '',
        subtitle: '',
        category: 'Web App',
        description: '',
        coverImage: '',
        techStack: '',
        liveUrl: '',
        githubUrl: '',
        publishStatus: 'draft',
        sortOrder: 0,
        featured: false,
      });
    }
  }, [projectToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    // Convert comma-separated tech stack back to an array
    const formattedTechStack = formData.techStack
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const payload = {
      ...formData,
      techStack: formattedTechStack,
      sortOrder: Number(formData.sortOrder),
    };

    try {
      if (projectToEdit) {
        await projectService.updateProject(projectToEdit.id, payload);
      } else {
        await projectService.createProject(payload);
      }
      onSaveSuccess();
      onClose();
    } catch (err) {
      console.error('Failed to save project:', err);
      alert('Failed to save project. Check console for details.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-end">
      <div className="bg-slate-900 border-l border-slate-800 w-full max-w-lg h-full p-6 overflow-y-auto shadow-2xl flex flex-col justify-between">
        <div>
          {/* Modal Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <h2 className="text-lg font-bold text-white">
              {projectToEdit ? 'Edit Project' : 'Add New Project'}
            </h2>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white text-sm font-bold"
            >
              ✕
            </button>
          </div>

          {/* Form */}
          <form id="project-form" onSubmit={handleSubmit} className="space-y-4 py-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Project Title</label>
              <input
                type="text"
                required
                placeholder="e.g. E-Commerce Platform"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white outline-none focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white outline-none focus:border-amber-500"
                >
                  <option value="Web App">Web App</option>
                  <option value="Mobile App">Mobile App</option>
                  <option value="UI/UX Design">UI/UX Design</option>
                  <option value="Backend / API">Backend / API</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Publish Status</label>
                <select
                  value={formData.publishStatus}
                  onChange={(e) => setFormData({ ...formData, publishStatus: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white outline-none focus:border-amber-500"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Subtitle / Tagline</label>
              <input
                type="text"
                placeholder="A modern online store built for scale"
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Description</label>
              <textarea
                rows={3}
                placeholder="Detailed project summary..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Cover Image URL</label>
              <input
                type="url"
                placeholder="https://res.cloudinary.com/..."
                value={formData.coverImage}
                onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Tech Stack (comma separated)
              </label>
              <input
                type="text"
                placeholder="React, Firebase, Tailwind CSS, Node.js"
                value={formData.techStack}
                onChange={(e) => setFormData({ ...formData, techStack: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white outline-none focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Live URL</label>
                <input
                  type="url"
                  placeholder="https://example.com"
                  value={formData.liveUrl}
                  onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">GitHub URL</label>
                <input
                  type="url"
                  placeholder="https://github.com/..."
                  value={formData.githubUrl}
                  onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </form>
        </div>

        {/* Modal Footer */}
        <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-slate-400 hover:text-white text-xs font-semibold"
          >
            Cancel
          </button>
          <button
            form="project-form"
            type="submit"
            disabled={submitting}
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2 rounded-lg text-xs transition disabled:opacity-50"
          >
            {submitting ? 'Saving...' : projectToEdit ? 'Update Project' : 'Create Project'}
          </button>
        </div>
      </div>
    </div>
  );
}