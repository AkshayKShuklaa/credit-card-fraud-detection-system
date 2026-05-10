import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, AlertTriangle, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../services/api';
import { toast } from 'react-toastify';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  
  // New transaction modal state
  const [showModal, setShowModal] = useState(false);
  const [newTx, setNewTx] = useState({ cardNumber: '', amount: '', merchant: '', location: '' });

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/transactions?page=${page}&size=10`);
      setTransactions(res.data.content);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      toast.error('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [page]);

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/transactions', {
        ...newTx,
        amount: parseFloat(newTx.amount)
      });
      toast.success(res.data.isFraud ? 'Alert! Fraudulent transaction detected!' : 'Transaction approved successfully');
      setShowModal(false);
      setNewTx({ cardNumber: '', amount: '', merchant: '', location: '' });
      fetchTransactions(); // Refresh list
    } catch (error) {
      toast.error('Failed to process transaction');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-white">Transactions Management</h1>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="input-field pl-9 py-2 text-sm w-full"
            />
          </div>
          <button className="btn-primary py-2 flex items-center gap-2" onClick={() => setShowModal(true)}>
            <Plus className="w-4 h-4" />
            <span>New Simulation</span>
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-dark-900 border-b border-dark-700 text-xs uppercase tracking-wider text-gray-400">
                <th className="p-4 font-medium">Transaction ID</th>
                <th className="p-4 font-medium">Date & Time</th>
                <th className="p-4 font-medium">Merchant</th>
                <th className="p-4 font-medium">Card Number</th>
                <th className="p-4 font-medium text-right">Amount</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Fraud Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-700">
              {loading ? (
                <tr><td colSpan="7" className="p-8 text-center text-gray-500">Loading...</td></tr>
              ) : transactions.length === 0 ? (
                <tr><td colSpan="7" className="p-8 text-center text-gray-500">No transactions found.</td></tr>
              ) : (
                transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-dark-900/50 transition-colors">
                    <td className="p-4 text-sm text-gray-300">#{tx.id.toString().padStart(6, '0')}</td>
                    <td className="p-4 text-sm text-gray-300">{new Date(tx.transactionDate).toLocaleString()}</td>
                    <td className="p-4 text-sm font-medium text-white">{tx.merchant}</td>
                    <td className="p-4 text-sm text-gray-400">**** **** **** {tx.cardNumber.slice(-4)}</td>
                    <td className="p-4 text-sm font-medium text-white text-right">${tx.amount.toFixed(2)}</td>
                    <td className="p-4">
                      {tx.isFraud ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-accent-danger/10 text-accent-danger border border-accent-danger/20">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          Fraud
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-accent-success/10 text-accent-success border border-accent-success/20">
                          <CheckCircle className="w-3.5 h-3.5" />
                          Valid
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-dark-900 rounded-full overflow-hidden border border-dark-700">
                          <div 
                            className={`h-full ${tx.fraudScore > 0.65 ? 'bg-accent-danger' : tx.fraudScore > 0.3 ? 'bg-accent-warning' : 'bg-accent-success'}`}
                            style={{ width: `${Math.min(tx.fraudScore * 100, 100)}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium text-gray-400">{(tx.fraudScore * 100).toFixed(1)}%</span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-4 border-t border-dark-700 flex items-center justify-between">
          <span className="text-sm text-gray-400">
            Showing page {page + 1} of {totalPages || 1}
          </span>
          <div className="flex items-center gap-2">
            <button 
              disabled={page === 0} 
              onClick={() => setPage(p => p - 1)}
              className="p-1 rounded-lg border border-dark-700 text-gray-400 hover:bg-dark-700 hover:text-white disabled:opacity-50"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              disabled={page >= totalPages - 1} 
              onClick={() => setPage(p => p + 1)}
              className="p-1 rounded-lg border border-dark-700 text-gray-400 hover:bg-dark-700 hover:text-white disabled:opacity-50"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Add Transaction Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="card w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-200">
            <h2 className="text-xl font-bold text-white mb-4">Simulate Transaction</h2>
            <form onSubmit={handleAddTransaction} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Card Number</label>
                <input required type="text" className="input-field" placeholder="1234567890123456" value={newTx.cardNumber} onChange={e => setNewTx({...newTx, cardNumber: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Amount ($)</label>
                <input required type="number" step="0.01" className="input-field" placeholder="99.99" value={newTx.amount} onChange={e => setNewTx({...newTx, amount: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Merchant</label>
                <input required type="text" className="input-field" placeholder="Amazon.com" value={newTx.merchant} onChange={e => setNewTx({...newTx, merchant: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Location</label>
                <input required type="text" className="input-field" placeholder="New York, NY" value={newTx.location} onChange={e => setNewTx({...newTx, location: e.target.value})} />
              </div>
              <div className="flex gap-3 pt-4 border-t border-dark-700">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2 rounded-lg font-medium text-gray-400 hover:bg-dark-700 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 btn-primary py-2">Process</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;
