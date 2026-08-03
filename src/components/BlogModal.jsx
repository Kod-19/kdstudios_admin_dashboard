import React, { useState, useEffect } from 'react';
import { blogService } from '../services/blogService';

export default function BlogModal({ isOpen, onClose, postToEdit, onSaveSuccess }) {
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    coverImage: '',
    tags: '',
    readTime: '3 min read',
    publishStatus: 'draft',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (postToEdit) {
      setFormData({
        title: postToEdit.title || '',
        slug: postToEdit.slug || '',
        excerpt: postToEdit.excerpt || '',
        content: postToEdit.content || '',
        coverImage: postToEdit.coverImage || '',
        tags: postToEdit.tags ? postToEdit.tags.join(', ') : '',
        readTime: postToEdit.readTime || '3 min read',
        publishStatus: postToEdit.publishStatus || 'draft',
      });
    } else {
      setFormData({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        coverImage: '',
        tags: '',
        readTime: '3 min read',
        publishStatus: 'draft',
      });
    }
  }, [postToEdit, isOpen]);

  if (!isOpen) return null;

  // Auto-generate URL slug from title if empty
  const handleTitleChange = (e) => {
    const title = e.target.value;
    const generatedSlug = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

    setFormData((prev) => ({
      ...prev,
      title,
      slug: prev.slug && postToEdit ? prev.slug : generatedSlug,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const formattedTags = formData.tags
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter((t) => t.length > 0);

    const payload = {
      ...formData,
      tags: formattedTags,
    };

    try {
      if (postToEdit) {
        await blogService.updatePost(postToEdit.id, payload);
      } else {
        await blogService.createPost(payload);
      }
      onSaveSuccess();
      onClose();
    } catch (err) {
      console.error('Failed to save blog post:', err);
      alert('Failed to save article.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-stretch justify-end">
      <div className="bg-slate-900 sm:border-l border-slate-800 w-full sm:max-w-lg h-dvh p-4 sm:p-6 overflow-y-auto shadow-2xl flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <h2 className="text-lg font-bold text-white">
              {postToEdit ? 'Edit Article' : 'Write New Article'}
            </h2>
            <button onClick={onClose} aria-label="Close article form" className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-sm font-bold">
              X
            </button>
          </div>

          <form id="blog-form" onSubmit={handleSubmit} className="space-y-4 py-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Article Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Building Scalable Microservices"
                value={formData.title}
                onChange={handleTitleChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white outline-none focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">URL Slug</label>
                <input
                  type="text"
                  required
                  placeholder="building-scalable-microservices"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white outline-none focus:border-amber-500 font-mono text-[11px]"
                />
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
              <label className="block text-slate-300 font-semibold mb-1">Excerpt / Short Teaser</label>
              <textarea
                rows={2}
                placeholder="Brief summary displayed on list views..."
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Content (Markdown or Plaintext)</label>
              <textarea
                rows={6}
                required
                placeholder="Write article body content here..."
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white outline-none focus:border-amber-500 font-mono text-[11px]"
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Tags (comma separated)</label>
                <input
                  type="text"
                  placeholder="react, system-design, cloud"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Est. Read Time</label>
                <input
                  type="text"
                  placeholder="5 min read"
                  value={formData.readTime}
                  onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </form>
        </div>

        <div className="sticky bottom-0 -mx-4 sm:-mx-6 -mb-4 sm:-mb-6 mt-4 border-t border-slate-800 bg-slate-900/95 p-4 sm:p-6 flex flex-col-reverse sm:flex-row justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-slate-400 hover:text-white text-xs font-semibold"
          >
            Cancel
          </button>
          <button
            form="blog-form"
            type="submit"
            disabled={submitting}
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2 rounded-lg text-xs transition disabled:opacity-50"
          >
            {submitting ? 'Saving...' : postToEdit ? 'Update Article' : 'Publish Article'}
          </button>
        </div>
      </div>
    </div>
  );
}
