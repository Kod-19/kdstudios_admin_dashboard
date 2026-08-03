import React, { useState, useEffect } from 'react';
import { clientsService } from '../services/clientsService';
import ClientModal from '../components/ClientModal';

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal controls
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    setLoading(true);
    try {
      const data = await clientsService.getAllClients();
      setClients(data);
    } catch (err) {
      console.error('Error loading clients:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setSelectedClient(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (client) => {
    setSelectedClient(client);
    setIsModalOpen(true);
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await clientsService.updateClientStatus(id, newStatus);
      setClients((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
      );
    } catch (err) {
      alert('Failed to update client status');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete client record for "${name}"?`)) return;
    try {
      await clientsService.deleteClient(id);
      setClients((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      alert('Failed to delete client');
    }
  };

  const filteredClients = clients.filter((c) => {
    const matchesSearch =
      c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.company?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalClientsCount = clients.length;
  const leadsCount = clients.filter((c) => c.status === 'lead').length;
  const activeCount = clients.filter((c) => c.status === 'active').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Clients & Leads CRM</h1>
          <p className="text-slate-400 text-sm">Manage client relationships, inquiry leads, and project contracts.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2 rounded-lg text-sm transition self-start sm:self-auto"
        >
          + Add Client
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
          <span className="text-xs font-semibold uppercase text-slate-400">Total Clients</span>
          <p className="text-2xl font-extrabold text-white mt-2">{totalClientsCount}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
          <span className="text-xs font-semibold uppercase text-slate-400">Active Pipeline</span>
          <p className="text-2xl font-extrabold text-emerald-400 mt-2">{activeCount}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
          <span className="text-xs font-semibold uppercase text-slate-400">New Leads</span>
          <p className="text-2xl font-extrabold text-amber-400 mt-2">{leadsCount}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-between items-center bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <input
          type="text"
          placeholder="Search by name, email, or company..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-72 bg-slate-950 border border-slate-800 text-white text-xs px-3 py-2 rounded-lg outline-none focus:border-amber-500"
        />
        <div className="flex gap-2 w-full sm:w-auto flex-wrap">
          {['all', 'lead', 'active', 'completed', 'archived'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`capitalize text-xs font-semibold px-3 py-1.5 rounded-lg transition ${
                statusFilter === st
                  ? 'bg-slate-800 text-amber-400 border border-slate-700'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="p-8 text-center text-slate-400">Loading client directory...</div>
      ) : filteredClients.length === 0 ? (
        <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-xl">
          <p className="text-slate-400 text-sm">No clients found matching your filter.</p>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/60 text-slate-400 uppercase font-mono border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Client / Company</th>
                  <th className="py-3.5 px-4">Contact</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Total Value</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredClients.map((client) => (
                  <tr key={client.id} className="hover:bg-slate-800/30 transition">
                    <td className="py-3 px-4">
                      <p className="font-semibold text-white text-sm">{client.name}</p>
                      <p className="text-slate-400 text-[11px]">{client.company || 'Individual Client'}</p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-slate-200">{client.email || '—'}</p>
                      <p className="text-slate-400 text-[11px] font-mono">{client.phone || ''}</p>
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={client.status || 'lead'}
                        onChange={(e) => handleStatusChange(client.id, e.target.value)}
                        className="bg-slate-950 border border-slate-700 text-slate-300 text-[11px] px-2 py-1 rounded font-semibold capitalize outline-none focus:border-amber-500"
                      >
                        <option value="lead">Lead</option>
                        <option value="active">Active</option>
                        <option value="completed">Completed</option>
                        <option value="archived">Archived</option>
                      </select>
                    </td>
                    <td className="py-3 px-4 font-bold text-emerald-400">
                      GHS {(client.totalSpentGhs || 0).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(client)}
                        className="text-slate-400 hover:text-amber-400 font-medium text-xs px-2 py-1 rounded transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(client.id, client.name)}
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

      {/* Slide-over Client Modal */}
      <ClientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        clientToEdit={selectedClient}
        onSaveSuccess={loadClients}
      />
    </div>
  );
}