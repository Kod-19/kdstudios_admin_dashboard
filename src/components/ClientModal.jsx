import React, { useState, useEffect } from 'react';
import { clientsService } from '../services/clientsService';

export default function ClientModal({ isOpen, onClose, clientToEdit, onSaveSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    status: 'lead',
    notes: '',
    totalSpentGhs: 0,
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (clientToEdit) {
      setFormData({
        name: clientToEdit.name || '',
        email: clientToEdit.email || '',
        phone: clientToEdit.phone || '',
        company: clientToEdit.company || '',
        status: clientToEdit.status || 'lead',
        notes: clientToEdit.notes || '',
        totalSpentGhs: clientToEdit.totalSpentGhs || 0,
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        status: 'lead',
        notes: '',
        totalSpentGhs: 0,
      });
    }
  }, [clientToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (clientToEdit) {
        await clientsService.updateClient(clientToEdit.id, formData);
      } else {
        await clientsService.createClient(formData);
      }
      onSaveSuccess();
      onClose();
    } catch (err) {
      console.error('Failed to save client:', err);
      alert('Failed to save client record.');
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
              {clientToEdit ? 'Edit Client Record' : 'Add New Client / Lead'}
            </h2>
            <button onClick={onClose} aria-label="Close client form" className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-sm font-bold">
              X
            </button>
          </div>

          <form id="client-form" onSubmit={handleSubmit} className="space-y-4 py-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Full Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Kwame Mensah"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white outline-none focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="client@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Phone Number</label>
                <input
                  type="text"
                  placeholder="+233 24 000 0000"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white outline-none focus:border-amber-500 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Company / Organization</label>
                <input
                  type="text"
                  placeholder="e.g. TechCorp Ltd"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white outline-none focus:border-amber-500"
                >
                  <option value="lead">Lead</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Total Revenue Value (GHS)</label>
              <input
                type="number"
                min="0"
                placeholder="5000"
                value={formData.totalSpentGhs}
                onChange={(e) => setFormData({ ...formData, totalSpentGhs: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white outline-none focus:border-amber-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Internal Notes</label>
              <textarea
                rows={3}
                placeholder="Project preferences, key requirements, meeting notes..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white outline-none focus:border-amber-500"
              />
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
            form="client-form"
            type="submit"
            disabled={submitting}
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2 rounded-lg text-xs transition disabled:opacity-50"
          >
            {submitting ? 'Saving...' : clientToEdit ? 'Update Client' : 'Add Client'}
          </button>
        </div>
      </div>
    </div>
  );
}
