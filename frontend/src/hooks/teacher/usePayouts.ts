import { useState, useEffect } from "react";
import {
  PaymentTransaction,
  PayoutRequest,
  BankAccount,
  CreatePayoutRequestData,
  AvailableBalance,
  TransactionFilters,
  TransactionStatus,
  PayoutStatus,
} from "@/lib/teacher/financial/types";

// Mock data generators
const generateMockTransactions = (count: number = 20): PaymentTransaction[] => {
  const courses = [
    "Advanced React & Next.js Development",
    "Python for Data Science",
    "UI/UX Design Masterclass",
    "Node.js Backend Development",
    "Mobile App Development",
  ];

  const students = [
    { name: "Nguyễn Văn An", avatar: "https://i.pravatar.cc/150?img=1" },
    { name: "Trần Thị Bình", avatar: "https://i.pravatar.cc/150?img=2" },
    { name: "Lê Hoàng Cường", avatar: "https://i.pravatar.cc/150?img=3" },
    { name: "Phạm Thu Dung", avatar: "https://i.pravatar.cc/150?img=4" },
    { name: "Hoàng Minh Đức", avatar: "https://i.pravatar.cc/150?img=5" },
    { name: "Võ Thị Hoa", avatar: "https://i.pravatar.cc/150?img=6" },
    { name: "Đặng Quốc Huy", avatar: "https://i.pravatar.cc/150?img=7" },
    { name: "Bùi Thanh Lan", avatar: "https://i.pravatar.cc/150?img=8" },
  ];

  const transactions: PaymentTransaction[] = [];
  const now = new Date();

  for (let i = 0; i < count; i++) {
    const amount = Math.floor(Math.random() * 2000000) + 500000; // 500k - 2.5M
    const platformFeePercent = 0.3; // 30%
    const platformFee = Math.floor(amount * platformFeePercent);
    const netEarnings = amount - platformFee;

    const daysAgo = Math.floor(Math.random() * 90);
    const transactionDate = new Date(
      now.getTime() - daysAgo * 24 * 60 * 60 * 1000
    );

    const statuses: TransactionStatus[] = [
      TransactionStatus.SUCCESS,
      TransactionStatus.SUCCESS,
      TransactionStatus.SUCCESS,
      TransactionStatus.SUCCESS,
      TransactionStatus.REFUNDED,
    ];

    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const student = students[Math.floor(Math.random() * students.length)];
    const course = courses[Math.floor(Math.random() * courses.length)];

    transactions.push({
      id: i + 1,
      transactionDate: transactionDate.toISOString(),
      studentName: student.name,
      studentAvatar: student.avatar,
      courseName: course,
      courseId: Math.floor(Math.random() * 5) + 1,
      amount,
      platformFee,
      netEarnings: status === TransactionStatus.REFUNDED ? 0 : netEarnings,
      status,
      paymentMethod: ["Bank Transfer", "Credit Card", "Momo", "ZaloPay"][
        Math.floor(Math.random() * 4)
      ],
    });
  }

  return transactions.sort(
    (a, b) =>
      new Date(b.transactionDate).getTime() -
      new Date(a.transactionDate).getTime()
  );
};

const generateMockPayouts = (count: number = 10): PayoutRequest[] => {
  const payouts: PayoutRequest[] = [];
  const now = new Date();

  for (let i = 0; i < count; i++) {
    const daysAgo = Math.floor(Math.random() * 180) + 30; // 30-210 days ago
    const requestDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);

    const statuses = [
      PayoutStatus.COMPLETED,
      PayoutStatus.COMPLETED,
      PayoutStatus.PENDING,
    ];
    const status =
      i === 0
        ? PayoutStatus.PENDING
        : statuses[Math.floor(Math.random() * statuses.length)];

    let processedDate: string | undefined;
    let rejectReason: string | undefined;

    if (status === PayoutStatus.COMPLETED) {
      const processedDaysAfter = Math.floor(Math.random() * 7) + 3; // 3-10 days after request
      processedDate = new Date(
        requestDate.getTime() + processedDaysAfter * 24 * 60 * 60 * 1000
      ).toISOString();
    }

    if (status === PayoutStatus.REJECTED) {
      const reasons = [
        "Thông tin tài khoản ngân hàng không chính xác",
        "Số dư không đủ để xử lý",
        "Tài khoản ngân hàng đã bị khóa",
      ];
      rejectReason = reasons[Math.floor(Math.random() * reasons.length)];
      processedDate = new Date(
        requestDate.getTime() +
          Math.floor(Math.random() * 5 + 1) * 24 * 60 * 60 * 1000
      ).toISOString();
    }

    payouts.push({
      id: i + 1,
      requestDate: requestDate.toISOString(),
      amount: Math.floor(Math.random() * 20000000) + 5000000, // 5M - 25M
      transactionCode: `PO${requestDate.getFullYear()}${String(
        requestDate.getMonth() + 1
      ).padStart(2, "0")}${String(i + 1).padStart(4, "0")}`,
      status,
      processedDate,
      note: i % 3 === 0 ? "Rút tiền cuối tháng" : undefined,
      rejectReason,
    });
  }

  return payouts.sort(
    (a, b) =>
      new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime()
  );
};

// Hooks
export const useTransactions = (filters?: TransactionFilters) => {
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 600));

      let data = generateMockTransactions(50);

      // Apply filters
      if (filters) {
        if (filters.search) {
          const search = filters.search.toLowerCase();
          data = data.filter(
            (t) =>
              t.studentName.toLowerCase().includes(search) ||
              t.courseName.toLowerCase().includes(search)
          );
        }

        if (filters.courseId) {
          data = data.filter((t) => t.courseId === filters.courseId);
        }

        if (filters.status) {
          data = data.filter((t) => t.status === filters.status);
        }

        if (filters.startDate) {
          data = data.filter(
            (t) => new Date(t.transactionDate) >= new Date(filters.startDate!)
          );
        }

        if (filters.endDate) {
          data = data.filter(
            (t) => new Date(t.transactionDate) <= new Date(filters.endDate!)
          );
        }
      }

      setTransactions(data);
      setTotal(data.length);
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [
    filters?.search,
    filters?.courseId,
    filters?.status,
    filters?.startDate,
    filters?.endDate,
  ]);

  return { transactions, loading, total, refetch: fetchTransactions };
};

export const usePayouts = () => {
  const [payouts, setPayouts] = useState<PayoutRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPayouts = async () => {
    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 600));

      const data = generateMockPayouts(15);
      setPayouts(data);
    } catch (error) {
      console.error("Failed to fetch payouts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayouts();
  }, []);

  return { payouts, loading, refetch: fetchPayouts };
};

export const useAvailableBalance = () => {
  const [balance, setBalance] = useState<AvailableBalance>({
    available: 0,
    pending: 0,
    minimumPayout: 500000, // 500k VND
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBalance = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 400));

      setBalance({
        available: Math.floor(Math.random() * 30000000) + 5000000, // 5M - 35M
        pending: Math.floor(Math.random() * 5000000), // 0 - 5M
        minimumPayout: 500000,
      });

      setLoading(false);
    };

    fetchBalance();
  }, []);

  return { balance, loading };
};

export const useCreatePayout = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPayout = async (
    data: CreatePayoutRequestData
  ): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Simulate validation
      if (data.amount < 500000) {
        throw new Error("Số tiền tối thiểu là 500,000 VNĐ");
      }

      // 90% success rate for demo
      if (Math.random() > 0.9) {
        throw new Error(
          "Có lỗi xảy ra khi xử lý yêu cầu. Vui lòng thử lại sau."
        );
      }

      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { createPayout, loading, error };
};

export const useBankAccounts = () => {
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAccounts = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 400));

      // Mock bank accounts
      setAccounts([
        {
          id: 1,
          bankName: "Vietcombank",
          accountNumber: "1234567890",
          accountHolderName: "NGUYEN VAN A",
          isDefault: true,
        },
        {
          id: 2,
          bankName: "Techcombank",
          accountNumber: "0987654321",
          accountHolderName: "NGUYEN VAN A",
          isDefault: false,
        },
      ]);

      setLoading(false);
    };

    fetchAccounts();
  }, []);

  return { accounts, loading };
};

export const usePayoutDetail = (payoutId: number) => {
  const [payout, setPayout] = useState<PayoutRequest | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 400));

      const allPayouts = generateMockPayouts(20);
      const found = allPayouts.find((p) => p.id === payoutId);

      if (found) {
        setPayout(found);
      }

      setLoading(false);
    };

    if (payoutId) {
      fetchDetail();
    }
  }, [payoutId]);

  return { payout, loading };
};
