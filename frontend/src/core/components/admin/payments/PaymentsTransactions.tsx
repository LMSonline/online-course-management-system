import { useState } from 'react';
import { Search, Calendar, Download, Eye, MoreVertical, AlertCircle, CheckCircle, Clock, XCircle, RefreshCw } from 'lucide-react';
import type { Transaction, TransactionStatus} from './types'
import { types } from 'util';

export function PaymentsTransactions({ transactions, onSelectTransaction }: { transactions: Transaction[], onSelectTransaction: (t: Transaction) => void }) {
  const [filterStatus, setFilterStatus] = useState<'all' | TransactionStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTransactions = transactions.filter(t => {
    const matchesStatus = filterStatus === 'all' || t.status === filterStatus;
    const matchesSearch = searchQuery === '' ||
      t.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.transactionId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: TransactionStatus) => {
    const styles = {
      completed: 'bg-green-900/30 text-green-400 border-green-700',
      pending: 'bg-yellow-900/30 text-yellow-400 border-yellow-700',
      failed: 'bg-red-900/30 text-red-400 border-red-700',
      refunded: 'bg-gray-700 text-gray-300 border-gray-600'
    };
    const icons = {
      completed: <CheckCircle className="w-3 h-3" />,
      pending: <Clock className="w-3 h-3" />,
      failed: <XCircle className="w-3 h-3" />,
      refunded: <RefreshCw className="w-3 h-3" />
    };
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status]}`}>
        {icons[status]}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search by user, course, or transaction ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#12182b] border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#00ff00]"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="bg-[#12182b] border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#00ff00]"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-[#12182b] border border-gray-700 hover:border-[#00ff00] text-white rounded-lg transition-colors">
            <Calendar className="w-4 h-4" />
            Date Range
          </button>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-[#00ff00] hover:bg-[#00dd00] text-black rounded-lg font-medium transition-colors">
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Transactions Table */}
      <div className="bg-[#12182b] border border-gray-800 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#1a2237] border-b border-gray-800">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Transaction ID</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">User</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Course</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Instructor</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Amount</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Status</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Date</th>
              <th className="px-6 py-4 text-right text-sm font-medium text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {filteredTransactions.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-[#1a2237] transition-colors">
                <td className="px-6 py-4">
                  <span className="font-mono text-sm text-cyan-400">{transaction.transactionId}</span>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <p className="text-white font-medium">{transaction.user}</p>
                    <p className="text-xs text-gray-500">{transaction.userEmail}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-white">{transaction.course}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-gray-400">{transaction.instructor}</span>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <p className="text-white font-semibold">${transaction.amount}</p>
                    {transaction.status === 'completed' && (
                      <p className="text-xs text-gray-500">
                        Fee: ${transaction.platformFee} · Inst: ${transaction.instructorShare}
                      </p>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  {getStatusBadge(transaction.status)}
                </td>
                <td className="px-6 py-4">
                  <span className="text-gray-400 text-sm">{transaction.date}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onSelectTransaction(transaction)}
                      className="p-2 text-gray-400 hover:text-[#00ff00] hover:bg-gray-800 rounded transition-colors"
                      title="View details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:bg-gray-800 rounded transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredTransactions.length === 0 && (
        <div className="text-center py-12 bg-[#12182b] border border-gray-800 rounded-lg">
          <AlertCircle className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">No transactions found matching your filters</p>
        </div>
      )}
    </div>
  );
}
