import { useEffect, useState } from 'react';
import { paymentService } from '../services/paymentsService';

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const loadPayments = async () => {
    setLoading(true);
    try {
      const data = await paymentService.getAllPayments();
      setPayments(data);
    } catch (err) {
      console.error('Error loading payments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = paymentService.subscribeToPayments(
      (data) => {
        setPayments(data);
        setLoading(false);
      },
      () => {
        loadPayments();
      }
    );

    return () => unsubscribe();
  }, []);

  const handleStatusChange = async (id, currentStatus) => {
    const nextStatus = currentStatus === 'success' ? 'verified' : 'success';
    try {
      await paymentService.updatePaymentStatus(id, nextStatus);
      setPayments((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: nextStatus } : p))
      );
    } catch {
      alert('Failed to update status');
    }
  };

  // Aggregated Stats
  const totalRevenue = payments.reduce((acc, curr) => {
    if (curr.status === 'success' || curr.status === 'verified') {
      const amt = curr.amountGhs || (curr.amountPesewas ? curr.amountPesewas / 100 : 0);
      return acc + Number(amt || 0);
    }
    return acc;
  }, 0);

  const filteredPayments = payments.filter((p) => {
    const matchesSearch =
      p.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Payments & Revenue</h1>
          <p className="text-slate-400 text-sm">Monitor Paystack checkouts and verify incoming transactions.</p>
        </div>
      </div>

      {/* Revenue Stats Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
          <span className="text-xs font-semibold uppercase text-slate-400">Total Collected</span>
          <p className="text-2xl font-extrabold text-emerald-400 mt-2">
            GHS {totalRevenue.toLocaleString()}
          </p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
          <span className="text-xs font-semibold uppercase text-slate-400">Total Transactions</span>
          <p className="text-2xl font-extrabold text-white mt-2">{payments.length}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
          <span className="text-xs font-semibold uppercase text-slate-400">Successful Paystack Checkouts</span>
          <p className="text-2xl font-extrabold text-amber-400 mt-2">
            {payments.filter((p) => p.status === 'success' || p.status === 'verified').length}
          </p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-center bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <input
          type="text"
          placeholder="Search by reference or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-72 bg-slate-950 border border-slate-800 text-white text-xs px-3 py-2 rounded-lg outline-none focus:border-amber-500"
        />
        <div className="flex gap-2 w-full sm:w-auto">
          {['all', 'success', 'verified'].map((st) => (
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

      {/* Transactions Table */}
      {loading ? (
        <div className="p-8 text-center text-slate-400">Loading payment history...</div>
      ) : filteredPayments.length === 0 ? (
        <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-xl">
          <p className="text-slate-400 text-sm">No payment records found.</p>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/60 text-slate-400 uppercase font-mono border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Paystack Reference</th>
                  <th className="py-3.5 px-4">Client Email</th>
                  <th className="py-3.5 px-4">Amount</th>
                  <th className="py-3.5 px-4">Channel</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredPayments.map((p) => {
                  const amount = p.amountGhs || (p.amountPesewas ? p.amountPesewas / 100 : 0);
                  return (
                    <tr key={p.id} className="hover:bg-slate-800/30 transition">
                      <td className="py-3 px-4 font-mono text-white font-medium">
                        {p.reference || p.id}
                      </td>
                      <td className="py-3 px-4 text-slate-300">{p.email || 'N/A'}</td>
                      <td className="py-3 px-4 text-emerald-400 font-bold">
                        GHS {Number(amount).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-slate-400 uppercase font-mono text-[10px]">
                        {p.channel || 'Paystack'}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            p.status === 'verified'
                              ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          }`}
                        >
                          {p.status || 'success'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleStatusChange(p.id, p.status)}
                          className="text-slate-400 hover:text-amber-400 font-medium text-xs px-2 py-1 rounded transition"
                        >
                          Toggle Verify
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
