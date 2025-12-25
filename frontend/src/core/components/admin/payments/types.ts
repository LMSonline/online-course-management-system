export type TransactionStatus = 'completed' | 'pending' | 'failed' | 'refunded';
export type TransactionType = 'enrollment' | 'refund' | 'revenue_share';

export interface Transaction {
  id: string;
  user: string;
  userEmail: string;
  course: string;
  instructor: string;
  amount: number;
  platformFee: number;
  instructorShare: number;
  status: TransactionStatus;
  type: TransactionType;
  date: string;
  paymentMethod: string;
  transactionId: string;
}
