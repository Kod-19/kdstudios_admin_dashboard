import React, { useState, useEffect } from 'react';
import { paymentsService } from '../services/paymentsService';

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedPayment, setSelectedPayment] = useState(null);

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    setLoading(true);
    try {
      const data = await paymentsService.getPayments();
      setPayments(data);
    } catch (err) {
      console.error('Failed to load payments', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter Logic
  const filteredPayments = payments.filter((payment) => {
    const matchesSearch = 
      payment.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      statusFilter === 'all' || payment.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Analytics Metrics
  const totalReceivedGhs = payments
    .filter(p => p.status === 'success' || p.status === 'verified')
    .reduce((acc, p) => acc + (p.amountGhs || 0), 0);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Payments & Revenue</h1>
          <p className="text-slate-400 text-sm">Monitor Paystack checkout transactions and client records.</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
          <span className="text-sm font-medium text-slate-400">Total Revenue</span>
          <p className="text-2xl font-bold text-emerald-400 mt-2">GHS {totalReceivedGhs.toLocaleString()}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
          <span className="text-sm font-medium text-slate-400">Total Transactions</span>
          <p className="text-2xl font-bold text-white mt-2">{payments.length}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
          <span className="text-sm font-medium text-slate-400">Pending Verification</span>
          <p className="text-2xl font-bold text-amber-400 mt-2">
            {payments.filter(p => p.status === 'pending' || p.status === 'success').length}
          </p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row gap-4 bg-slate-900 border border-slate-800 p-4 rounded-lg">
        <input
          type="text"
          placeholder="Search by reference or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-slate-950 border border-slate-800 text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:border-amber-500 flex-1"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-slate-950 border border-slate-800 text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:border-amber-500"
        >
          <option value="all">All Statuses</option>
          <option value="success">Success</option>
          <option value="verified">Verified</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      {/* Payments Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-400">Loading payment records...</div>
        ) : filteredPayments.length === 0 ? (
          <div className="p-8 text-center text-slate-400">No payment records found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950 text-slate-400 text-xs uppercase border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3">Reference</th>
                  <th className="px-4 py-3">Client Email</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Channel</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredPayments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/50">
                    <td className="px-4 py-3 font-mono text-xs text-amber-400">{p.reference}</td>
                    <td className="px-4 py-3">{p.email}</td>
                    <td className="px-4 py-3 font-semibold text-white">
                      {p.currency || 'GHS'} {p.amountGhs || (p.amountPesewas / 100)}
                    </td>
                    <td className="px-4 py-3 capitalize">{p.channel || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize ${
                        p.status === 'verified' || p.status === 'success'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : p.status === 'pending'
                          ? 'bg-amber-950 text-amber-400 border border-amber-800'
                          : 'bg-rose-950 text-rose-400 border border-rose-800'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-xs">
                      {p.createdAt?.toDate ? p.createdAt.toDate().toLocaleDateString() : '—'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => setSelectedPayment(p)}
                        className="text-xs bg-slate-800 hover:bg-slate-700 text-white px-2.5 py-1 rounded border border-slate-700"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Payment Detail Modal */}
      {selectedPayment && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-lg max-w-md w-full p-6 space-y-4">
            <h3 className="text-lg font-bold text-white">Payment Details</h3>
            
            <div className="space-y-2 text-sm text-slate-300">
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Reference</span>
                <span className="font-mono text-amber-400">{selectedPayment.reference}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Client Email</span>
                <span>{selectedPayment.email}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Amount</span>
                <span className="font-semibold text-white">
                  {selectedPayment.currency || 'GHS'} {selectedPayment.amountGhs}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Status</span>
                <span className="capitalize">{selectedPayment.status}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Linked Client ID</span>
                <span>{selectedPayment.clientId || 'Not linked'}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              {selectedPayment.status !== 'verified' && (
                <button
                  onClick={async () => {
                    await paymentsService.updateStatus(selectedPayment.id, 'verified');
                    setSelectedPayment(null);
                    loadPayments();
                  }}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-3 py-2 rounded font-medium"
                >
                  Mark as Verified
                </button>
              )}
              <button
                onClick={() => setSelectedPayment(null)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs px-3 py-2 rounded font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}