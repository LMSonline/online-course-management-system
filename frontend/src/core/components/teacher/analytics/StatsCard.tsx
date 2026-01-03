"use client";

import { LucideIcon } from "lucide-react";

interface StatsCardProps {
    title: string;
    value: string | number;
    change?: string;
    changeLabel?: string;
    icon: LucideIcon;
    iconColor: string;
    iconBgColor: string;
}

export const StatsCard = ({
    title,
    value,
    change,
    changeLabel,
    icon: Icon,
    iconColor,
    iconBgColor,
}: StatsCardProps) => {
    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 ${iconBgColor} rounded-xl`}>
                    <Icon className={`w-6 h-6 ${iconColor}`} />
                </div>
                {change && (
                    <span className={`text-xs font-semibold ${iconColor}`}>
                        {change}
                    </span>
                )}
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">{title}</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                {value}
            </p>
            {changeLabel && (
                <p className={`text-xs ${iconColor}`}>
                    {changeLabel}
                </p>
            )}
        </div>
    );
};
