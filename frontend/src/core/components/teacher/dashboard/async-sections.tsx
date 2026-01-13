import { StatsRow } from "@/core/components/teacher/dashboard/StatsRow";
import { QuickSections } from "@/core/components/teacher/dashboard/QuickSections";
import { TeachingTasks } from "@/core/components/teacher/dashboard/TeachingTasks";
import { CoursesPerformanceTable } from "@/core/components/teacher/dashboard/CoursesPerformanceTable";
import { RecentReviews } from "@/core/components/teacher/dashboard/RecentReviews";
import { RevenueChart } from "@/core/components/teacher/dashboard/RevenueChart";
import { EnrollmentsChart } from "@/core/components/teacher/dashboard/EnrollmentsChart";
import { userService } from "@/services/user";
import { courseService } from "@/services/courses";
import { TEACHER_DASHBOARD_MOCK } from "@/lib/teacher/dashboard/types";

async function getStatsData() {
    try {
        const courses = await courseService.getMyCourses(0, 100);
        return {
            totalStudents: 0,
            totalCourses: courses.totalItems || 0,
            monthlyRevenue: 0,
            avgRating: 0,
        };
    } catch (error) {
        console.error("Failed to fetch stats:", error);
        // Return mock data on error to prevent UI crash
        return TEACHER_DASHBOARD_MOCK.overview;
    }
}

async function getChartData() {
    try {
        return {
            revenue: TEACHER_DASHBOARD_MOCK.revenueHistory,
            enrollments: TEACHER_DASHBOARD_MOCK.enrollmentByCourse,
        };
    } catch (error) {
        console.error("Failed to fetch chart data:", error);
    }
    return {
        revenue: TEACHER_DASHBOARD_MOCK.revenueHistory,
        enrollments: TEACHER_DASHBOARD_MOCK.enrollmentByCourse,
    };
}

async function getQuickSectionsData() {
    return {
        sections: TEACHER_DASHBOARD_MOCK.quickSections,
        tasks: TEACHER_DASHBOARD_MOCK.tasks,
        reviews: TEACHER_DASHBOARD_MOCK.reviews,
    };
}

async function getCoursesData() {
    try {
        const response = await courseService.getMyCourses(0, 10);
        // If no courses, return empty array instead of mock
        if (!response.items || response.items.length === 0) {
            return [];
        }
        return response.items.map(course => ({
            id: course.id.toString(),
            title: course.title,
            category: course.categoryName || "Uncategorized",
            level: (course.difficulty || "BEGINNER") as "Beginner" | "Intermediate" | "Advanced",
            students: 0,
            rating: 0,
            completionRate: 0,
            revenue: 0,
            status: course.isClosed ? "Private" : "Published" as "Published" | "Draft" | "Private",
            lastUpdated: new Date().toISOString(),
        }));
    } catch (error) {
        console.error("Failed to fetch courses:", error);
        // Return empty array on error - this indicates user might not have courses yet
        // or there's an auth issue
        return [];
    }
}

export async function DashboardStatsSection() {
    const stats = await getStatsData();
    return <StatsRow overview={stats} />;
}

export async function DashboardChartsSection() {
    const { revenue, enrollments } = await getChartData();

    return (
        <div className="grid gap-4 lg:grid-cols-2">
            <RevenueChart data={revenue} />
            <EnrollmentsChart data={enrollments} />
        </div>
    );
}

export async function DashboardQuickSection() {
    const { sections, tasks, reviews } = await getQuickSectionsData();

    return (
        <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)]">
            <QuickSections sections={sections} />
            <div className="space-y-4">
                <TeachingTasks tasks={tasks} />
                <RecentReviews reviews={reviews} />
            </div>
        </div>
    );
}

export async function DashboardTableSection() {
    const courses = await getCoursesData();
    return <CoursesPerformanceTable courses={courses} />;
}

