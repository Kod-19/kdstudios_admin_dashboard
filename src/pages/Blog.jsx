import React, { useState, useEffect } from 'react';
import { blogService } from '../services/blogService';
import BlogModal from '../components/BlogModal';

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  // Modal controls
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const data = await blogService.getAllPosts();
      setPosts(data);
    } catch (err) {
      console.error('Error loading blog posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setSelectedPost(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (post) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const nextStatus = await blogService.togglePublishStatus(id, currentStatus);
      setPosts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, publishStatus: nextStatus } : p))
      );
    } catch (err) {
      alert('Failed to update post status');
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete post "${title}"?`)) return;
    try {
      await blogService.deletePost(id);
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert('Failed to delete post');
    }
  };

  const filteredPosts = posts.filter((p) => {
    if (filter === 'published') return p.publishStatus === 'published';
    if (filter === 'draft') return p.publishStatus === 'draft';
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Blog & Articles CMS</h1>
          <p className="text-slate-400 text-sm">Write articles, studio updates, and technical notes.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2 rounded-lg text-sm transition self-start sm:self-auto"
        >
          + Write New Post
        </button>
      </div>

      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        {['all', 'published', 'draft'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`capitalize px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              filter === status
                ? 'bg-slate-800 text-amber-400 border border-slate-700'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            {status} ({status === 'all' ? posts.length : posts.filter((p) => p.publishStatus === status).length})
          </button>
        ))}
      </div>

      {loading ? (
        <div className="p-8 text-center text-slate-400">Loading blog posts...</div>
      ) : filteredPosts.length === 0 ? (
        <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-xl">
          <p className="text-slate-400 text-sm">No blog posts found for this filter.</p>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/60 text-slate-400 uppercase font-mono border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Article</th>
                  <th className="py-3.5 px-4">Tags</th>
                  <th className="py-3.5 px-4">Read Time</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-slate-800/30 transition">
                    <td className="py-3 px-4 font-medium text-white flex items-center gap-3">
                      {post.coverImage ? (
                        <img
                          src={post.coverImage}
                          alt=""
                          className="w-12 h-10 rounded object-cover border border-slate-800 bg-slate-950 shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-10 rounded bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-500 font-mono text-[10px] shrink-0">
                          BLOG
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-white text-sm line-clamp-1">{post.title}</p>
                        <p className="text-slate-400 text-[11px] line-clamp-1">{post.excerpt || post.slug}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {post.tags?.slice(0, 3).map((tag, idx) => (
                          <span key={idx} className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[10px] border border-slate-700">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-400 font-mono">{post.readTime || '3 min'}</td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggleStatus(post.id, post.publishStatus)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition ${
                          post.publishStatus === 'published'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                            : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
                        }`}
                      >
                        {post.publishStatus === 'published' ? '● Published' : '○ Draft'}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(post)}
                        className="text-slate-400 hover:text-amber-400 font-medium text-xs px-2 py-1 rounded transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(post.id, post.title)}
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
      )}

      {/* Slide-over Blog Modal */}
      <BlogModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        postToEdit={selectedPost}
        onSaveSuccess={loadPosts}
      />
    </div>
  );
}