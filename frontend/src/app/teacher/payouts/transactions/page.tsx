"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
    Search,
    Filter,
    Calendar,
    Download,
    TrendingUp,
    Users,
    DollarSign,
    ArrowLeft,
    RefreshCw,
} from "lucide-react";
import { useTransactions } from "@/hooks/teacher/usePayouts";
import { TransactionStatus, TransactionFilters } from "@/lib/teacher/financial/types";

export default function TransactionsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCourse, setSelectedCourse] = useState<number | undefined>();
    const [selectedStatus, setSelectedStatus] = useState<TransactionStatus | undefined>();
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    // Build filters object
    const filters: TransactionFilters = useMemo(() => {
        return {
            search: searchQuery || undefined,
            courseId: selectedCourse,
            status: selectedStatus,
            startDate: startDate || undefined,
            endDate: endDate || undefined,
        };
    }, [searchQuery, selectedCourse, selectedStatus, startDate, endDate]);

    const { transactions, loading, total, refetch } = useTransactions(filters);

    // Get unique courses for filter dropdown
    const courses = useMemo(() => {
        const courseMap = new Map();
        transactions.forEach((t) => {
            if (!courseMap.has(t.courseId)) {
                courseMap.set(t.courseId, t.courseName);
            }
        });
        return Array.from(courseMap.entries()).map(([id, name]) => ({ id, name }));
    }, [transactions]);

    // Calculate statistics
    const stats = useMemo(() => {
        const successTransactions = transactions.filter((t) => t.status === TransactionStatus.SUCCESS);
        const totalEarnings = successTransactions.reduce((sum, t) => sum + t.netEarnings, 0);
        const totalAmount = successTransactions.reduce((sum, t) => sum + t.amount, 0);
        const totalFees = totalAmount - totalEarnings;

        return {
            totalTransactions: transactions.length,
            totalEarnings,
            totalFees,
            uniqueStudents: new Set(transactions.map((t) => t.studentName)).size,
        };
    }, [transactions]);

    // Format currency
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(amount);
    };

    // Format date
    const formatDate = (dateString: string) => {
        return new Intl.DateTimeFormat("vi-VN", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(new Date(dateString));
    };

    // Get status badge
    const getStatusBadge = (status: TransactionStatus) => {
        switch (status) {
            case TransactionStatus.SUCCESS:
                return (
                    <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs font-semibold rounded-full">
                        Thành Công
                    </span>
                );
            case TransactionStatus.FAILED:
                return (
                    <span className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs font-semibold rounded-full">
                        Thất Bại
                    </span>
                );
            case TransactionStatus.REFUNDED:
                return (
                    <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-xs font-semibold rounded-full">
                        Đã Hoàn Tiền
                    </span>
                );
            case TransactionStatus.PENDING:
                return (
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-semibold rounded-full">
                        Đang Xử Lý
                    </span>
                );
            default:
                return null;
        }
    };

    const handleClearFilters = () => {
        setSearchQuery("");
        setSelectedCourse(undefined);
        setSelectedStatus(undefined);
        setStartDate("");
        setEndDate("");
    };

    const handleExport = () => {
        // Mock export functionality
        alert("Xuất dữ liệu thành công! (Demo)");
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <div className="max-w-7xl mx-auto p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/teacher/payouts"
                            className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                                Lịch Sử Giao Dịch
                            </h1>
                            <p className="text-slate-600 dark:text-slate-400 mt-1">
                                Chi tiết các giao dịch mua khóa học từ học viên
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={refetch}
                            className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                            title="Làm mới"
                        >
                            <RefreshCw className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                        </button>
                        <button
                            onClick={handleExport}
                            className="px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-2"
                        >
                            <Download className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                            <span className="text-sm font-medium text-slate-900 dark:text-white">
                                Xuất Excel
                            </span>
                        </button>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-lg">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                                <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                            Tổng Giao Dịch
                        </p>
                        <p className="text-3xl font-bold text-slate-900 dark:text-white">
                            {stats.totalTransactions}
                        </p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-lg">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
                                <DollarSign className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                            </div>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                            Tổng Thu Nhập
                        </p>
                        <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                            {formatCurrency(stats.totalEarnings)}
                        </p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-lg">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-xl">
                                <DollarSign className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                            </div>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                            Phí Nền Tảng
                        </p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">
                            {formatCurrency(stats.totalFees)}
                        </p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-lg">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                                <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                            </div>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                            Học Viên
                        </p>
                        <p className="text-3xl font-bold text-slate-900 dark:text-white">
                            {stats.uniqueStudents}
                        </p>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Filter className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                            Bộ Lọc
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        {/* Search */}
                        <div className="lg:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Tìm Kiếm
                            </label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Tên học viên hoặc khóa học..."
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                        </div>

                        {/* Course Filter */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Khóa Học
                            </label>
                            <select
                                value={selectedCourse || ""}
                                onChange={(e) => setSelectedCourse(e.target.value ? Number(e.target.value) : undefined)}
                                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="">Tất cả khóa học</option>
                                {courses.map((course) => (
                                    <option key={course.id} value={course.id}>
                                        {course.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Status Filter */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Trạng Thái
                            </label>
                            <select
                                value={selectedStatus || ""}
                                onChange={(e) => setSelectedStatus(e.target.value as TransactionStatus || undefined)}
                                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="">Tất cả trạng thái</option>
                                <option value={TransactionStatus.SUCCESS}>Thành Công</option>
                                <option value={TransactionStatus.FAILED}>Thất Bại</option>
                                <option value={TransactionStatus.REFUNDED}>Đã Hoàn Tiền</option>
                                <option value={TransactionStatus.PENDING}>Đang Xử Lý</option>
                            </select>
                        </div>

                        {/* Date Range */}
                        <div className="lg:col-span-1 flex items-end">
                            <button
                                onClick={handleClearFilters}
                                className="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors font-medium"
                            >
                                Xóa Bộ Lọc
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Từ Ngày
                            </label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Đến Ngày
                            </label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Transactions Table */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg">
                    <div className="p-6 border-b border-slate-200 dark:border-slate-800">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                                    Danh Sách Giao Dịch
                                </h2>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                    Tìm thấy {total} giao dịch
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        {loading ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                            </div>
                        ) : transactions.length === 0 ? (
                            <div className="py-12 text-center">
                                <DollarSign className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                                <p className="text-slate-600 dark:text-slate-400">
                                    Không tìm thấy giao dịch nào
                                </p>
                            </div>
                        ) : (
                            <table className="w-full">
                                <thead className="bg-slate-50 dark:bg-slate-800">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">
                                            Thời Gian
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">
                                            Học Viên
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">
                                            Khóa Học
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">
                                            Giá Bán
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">
                                            Phí (30%)
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">
                                            Thực Nhận
                                        </th>
                                        <th className="px-6 py-3 text-center text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">
                                            Trạng Thái
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                                    {transactions.map((transaction) => (
                                        <tr
                                            key={transaction.id}
                                            className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${transaction.status === TransactionStatus.REFUNDED
                                                    ? "opacity-60"
                                                    : ""
                                                }`}
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm text-slate-600 dark:text-slate-400">
                                                    {formatDate(transaction.transactionDate)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    {transaction.studentAvatar && (
                                                        <img
                                                            src={transaction.studentAvatar}
                                                            alt={transaction.studentName}
                                                            className="w-10 h-10 rounded-full"
                                                        />
                                                    )}
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                                                            {transaction.studentName}
                                                        </p>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                                            {transaction.paymentMethod}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 max-w-xs">
                                                <p className="text-sm text-slate-900 dark:text-white line-clamp-2">
                                                    {transaction.courseName}
                                                </p>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <span className="text-sm font-medium text-slate-900 dark:text-white">
                                                    {formatCurrency(transaction.amount)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <span className="text-sm text-orange-600 dark:text-orange-400">
                                                    -{formatCurrency(transaction.platformFee)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <span
                                                    className={`text-sm font-bold ${transaction.status === TransactionStatus.REFUNDED
                                                            ? "text-red-600 dark:text-red-400 line-through"
                                                            : "text-emerald-600 dark:text-emerald-400"
                                                        }`}
                                                >
                                                    {formatCurrency(transaction.netEarnings)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                {getStatusBadge(transaction.status)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
