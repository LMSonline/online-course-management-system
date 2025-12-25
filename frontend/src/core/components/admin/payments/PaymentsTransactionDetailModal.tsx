import { XCircle, CheckCircle, Clock, RefreshCw } from 'lucide-react';
import type { Transaction } from './types';

export function PaymentsTransactionDetailModal({ transaction, onClose }: { transaction: Transaction, onClose: () => void }) {
  // ...copy phần Transaction Detail Modal từ prompt, nhận transaction và onClose qua props...
  // ...getStatusBadge logic có thể copy từ PaymentsTransactions hoặc tách ra file utils nếu dùng chung...
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>
          <XCircle size={24} />
        </button>
        <h2>Transaction Detail</h2>
        <div>
          <p><strong>ID:</strong> {transaction.id}</p>
          <p><strong>Amount:</strong> {transaction.amount}</p>
          <p><strong>Status:</strong> {transaction.status}</p>
          <p><strong>Date:</strong> {transaction.date}</p>
          {/* Add more transaction fields as needed */}
        </div>
      </div>
    </div>
  );
}