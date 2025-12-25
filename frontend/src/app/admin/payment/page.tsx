"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { PaymentsOverview } from "@/core/components/admin/payments/PaymentsOverview";
import { PaymentsTransactions } from "@/core/components/admin/payments/PaymentsTransactions";
import { PaymentsRefunds } from "@/core/components/admin/payments/PaymentsRefunds";
import { PaymentsRevenueShare } from "@/core/components/admin/payments/PaymentsRevenueShare";
import { PaymentsTransactionDetailModal } from "@/core/components/admin/payments/PaymentsTransactionDetailModal";
import type { Transaction } from "@/core/components/admin/payments/types";

export default function AdminPaymentsPage() {
  const [selectedTab, setSelectedTab] = useState<
    "overview" | "transactions" | "refunds" | "revenue-share"
  >("overview");
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  // Mock data - ĐÃ BỔ SUNG ĐẦY ĐỦ TRƯỜNG
  const stats = {
    totalRevenue: 18452.75,
    previousRevenue: 15892.5,
    pendingPayments: 1200,
    completedTransactions: 350,
    averageTransaction: 52.72,
    refundedAmount: 320,
    instructorRevenue: 14762.2,
    platformRevenue: 3690.55,
  };

  const monthlyRevenue = [
    { month: "Nov", revenue: 12000, transactions: 210 },
    { month: "Dec", revenue: 14000, transactions: 230 },
    { month: "Jan", revenue: 15500, transactions: 250 },
    { month: "Feb", revenue: 16800, transactions: 270 },
    { month: "Mar", revenue: 18452, transactions: 300 },
  ];

  const revenueByCategory = [
    { category: "Development", percentage: 40, amount: 5000, color: "bg-cyan-400" },
    { category: "Design", percentage: 24, amount: 3000, color: "bg-pink-400" },
    { category: "Data Science", percentage: 28, amount: 3500, color: "bg-yellow-400" },
    { category: "Marketing", percentage: 8, amount: 1000, color: "bg-green-400" },
  ];

  const transactions: Transaction[] = [
    {
      id: "1",
      user: "Alice Brown",
      userEmail: "alice@example.com",
      course: "React Mastery",
      instructor: "John Doe",
      amount: 99.99,
      platformFee: 9.99,
      instructorShare: 90.0,
      status: "completed",
      type: "enrollment",
      date: "2025-01-20",
      paymentMethod: "Credit Card",
      transactionId: "TXN001",
    },
    {
      id: "2",
      user: "Bob Wilson",
      userEmail: "bob@example.com",
      course: "Python Basics",
      instructor: "Jane Smith",
      amount: 49.99,
      platformFee: 4.99,
      instructorShare: 45.0,
      status: "completed",
      type: "enrollment",
      date: "2025-01-20",
      paymentMethod: "PayPal",
      transactionId: "TXN002",
    },
    {
      id: "3",
      user: "Carol Davis",
      userEmail: "carol@example.com",
      course: "UI/UX Design",
      instructor: "Mike Johnson",
      amount: 79.99,
      platformFee: 7.99,
      instructorShare: 72.0,
      status: "pending",
      type: "enrollment",
      date: "2025-01-19",
      paymentMethod: "Credit Card",
      transactionId: "TXN003",
    },
    {
      id: "4",
      user: "David Lee",
      userEmail: "david@example.com",
      course: "Data Science",
      instructor: "Anna Lee",
      amount: 129.99,
      platformFee: 12.99,
      instructorShare: 117.0,
      status: "refunded",
      type: "refund",
      date: "2025-01-18",
      paymentMethod: "Bank Transfer",
      transactionId: "TXN004",
    },
  ];

  // ĐÃ BỔ SUNG ĐẦY ĐỦ TRƯỜNG
  const topInstructors = [
    { name: "John Doe", courses: 5, students: 1200, revenue: 5000 },
    { name: "Jane Smith", courses: 3, students: 950, revenue: 7000 },
    { name: "Mike Johnson", courses: 2, students: 600, revenue: 3000 },
  ];

  const refundRequests = [
    {
      id: "1",
      transactionId: "4",
      user: "David Lee",
      amount: 129.99,
      status: "approved",
      requestDate: "2025-01-18",
      reason: "Course not as described",
      course: "Data Science",
    },
    {
      id: "2",
      transactionId: "3",
      user: "Carol Davis",
      amount: 79.99,
      status: "pending",
      requestDate: "2025-01-19",
      reason: "Technical issues",
      course: "UI/UX Design",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white p-8">
      <button
        onClick={() => window.history.back()}
        className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Dashboard
      </button>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Payments & Revenue Management
        </h1>
        <p className="text-gray-400">
          Monitor transactions, manage refunds, and configure revenue sharing
        </p>
      </div>
      <div className="flex items-center gap-4 border-b border-gray-800 mb-8">
        <button
          onClick={() => setSelectedTab("overview")}
          className={`px-4 py-3 font-medium transition-colors ${
            selectedTab === "overview"
              ? "text-[#00ff00] border-b-2 border-[#00ff00]"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setSelectedTab("transactions")}
          className={`px-4 py-3 font-medium transition-colors ${
            selectedTab === "transactions"
              ? "text-[#00ff00] border-b-2 border-[#00ff00]"
              : "text-gray-400 hover:text-white"
          }`}
        >
          All Transactions
        </button>
        <button
          onClick={() => setSelectedTab("refunds")}
          className={`px-4 py-3 font-medium transition-colors ${
            selectedTab === "refunds"
              ? "text-[#00ff00] border-b-2 border-[#00ff00]"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Refund Requests
        </button>
        <button
          onClick={() => setSelectedTab("revenue-share")}
          className={`px-4 py-3 font-medium transition-colors ${
            selectedTab === "revenue-share"
              ? "text-[#00ff00] border-b-2 border-[#00ff00]"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Revenue Share Config
        </button>
      </div>
      {selectedTab === "overview" && (
        <PaymentsOverview
          stats={stats}
          monthlyRevenue={monthlyRevenue}
          revenueByCategory={revenueByCategory}
          topInstructors={topInstructors}
        />
      )}
      {selectedTab === "transactions" && (
        <PaymentsTransactions
          transactions={transactions}
          onSelectTransaction={setSelectedTransaction}
        />
      )}
      {selectedTab === "refunds" && <PaymentsRefunds refundRequests={refundRequests} />}
      {selectedTab === "revenue-share" && <PaymentsRevenueShare stats={stats} />}
      {selectedTransaction && (
        <PaymentsTransactionDetailModal
          transaction={selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
        />
      )}
    </div>
  );
}