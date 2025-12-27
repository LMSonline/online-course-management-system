import { TrendingUp, TrendingDown, Users, BookOpen, Star, DollarSign } from "lucide-react";

interface AnalyticsCardProps {
    title: string;
    value: string | number;
    change?: string;
    changeType?: 'increase' | 'decrease' | 'neutral';
    icon: React.ReactNode;
    iconBgColor: string;
}

const AnalyticsCard = ({ title, value, change, changeType, icon, iconBgColor }: AnalyticsCardProps) => {
    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600 transition-all duration-300 shadow-sm hover:shadow-md">
            <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg ${iconBgColor}`}>
                    {icon}
                </div>
                {change && (
                    <div className={`flex items-center gap-1 text-sm font-medium ${changeType === 'increase' ? 'text-green-500 dark:text-green-400' :
                        changeType === 'decrease' ? 'text-red-500 dark:text-red-400' :
                            'text-slate-500 dark:text-slate-400'
                        }`}>
                        {changeType === 'increase' && <TrendingUp className="w-4 h-4" />}
                        {changeType === 'decrease' && <TrendingDown className="w-4 h-4" />}
                        {change}
                    </div>
                )}
            </div>
            <div className="space-y-1">
                <p className="text-slate-600 dark:text-slate-400 text-sm">{title}</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
            </div>
        </div>
    );
};

interface AnalyticsCardsProps {
    totalCourses: number;
    publishedCourses: number;
    totalStudents?: number;
    totalRevenue?: number;
    averageRating?: number;
    totalReviews?: number;
    monthlyGrowth?: {
        students?: string;
        revenue?: string;
    };
}

export const AnalyticsCards = ({
    totalCourses,
    publishedCourses,
    totalStudents = 0,
    totalRevenue = 0,
    averageRating = 0,
    totalReviews = 0,
    monthlyGrowth
}: AnalyticsCardsProps) => {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const formatNumber = (num: number) => {
        return new Intl.NumberFormat('en-US').format(num);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <AnalyticsCard
                title="Total Courses"
                value={totalCourses}
                change={`${publishedCourses} published`}
                changeType="neutral"
                icon={<BookOpen className="w-6 h-6 text-blue-400" />}
                iconBgColor="bg-blue-500/10"
            />

            <AnalyticsCard
                title="Total Students"
                value={formatNumber(totalStudents)}
                change={monthlyGrowth?.students}
                changeType={monthlyGrowth?.students ? 'increase' : undefined}
                icon={<Users className="w-6 h-6 text-purple-400" />}
                iconBgColor="bg-purple-500/10"
            />

            <AnalyticsCard
                title="Total Reviews"
                value={formatNumber(totalReviews)}
                change={averageRating > 0 ? `Avg rating: ${averageRating.toFixed(1)}` : undefined}
                changeType={averageRating >= 4.5 ? 'increase' : averageRating >= 3.5 ? 'neutral' : 'decrease'}
                icon={<Star className="w-6 h-6 text-yellow-400" />}
                iconBgColor="bg-yellow-500/10"
            />

            <AnalyticsCard
                title="Total Revenue"
                value={formatCurrency(totalRevenue)}
                change={monthlyGrowth?.revenue}
                changeType={monthlyGrowth?.revenue ? 'increase' : undefined}
                icon={<DollarSign className="w-6 h-6 text-green-400" />}
                iconBgColor="bg-green-500/10"
            />
        </div>
    );
};
