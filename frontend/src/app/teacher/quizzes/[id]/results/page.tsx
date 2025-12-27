"use client";

import { useRouter, useParams } from "next/navigation";
import { useQuizById, useQuizStatistics, useQuizResults } from "@/hooks/teacher";
import { ArrowLeft, Download, TrendingUp, Users, Award, Clock, Target } from "lucide-react";
import Button from "@/core/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/core/components/ui/Card";
import Table, {
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/core/components/ui/Table";
import Badge from "@/core/components/ui/Badge";
import { formatDistanceToNow } from "date-fns";

export default function QuizResultsPage() {
    const router = useRouter();
    const params = useParams();
    const quizId = Number(params.id);

    // API Hooks
    const { data: quiz, isLoading: quizLoading } = useQuizById(quizId);
    const { data: statistics, isLoading: statsLoading } = useQuizStatistics(quizId);
    const { data: results, isLoading: resultsLoading } = useQuizResults(quizId);

    const isLoading = quizLoading || statsLoading || resultsLoading;

    const exportToCSV = () => {
        if (!results) return;

        const headers = [
            "Student Name",
            "Student Code",
            "Attempts",
            "Best Score",
            "Last Attempt",
            "Status",
        ];

        const rows = results.studentResults.map((student) => [
            student.studentName,
            student.studentCode || "",
            student.attempts.toString(),
            student.bestScore?.toFixed(1) || "",
            student.lastAttemptAt || "",
            student.passed ? "Passed" : "Failed",
        ]);

        const csvContent = [
            headers.join(","),
            ...rows.map((row) => row.join(",")),
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `quiz-${quizId}-results.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!quiz || !results) {
        return (
            <div className="container mx-auto py-8">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">No results found</h1>
                    <Button onClick={() => router.back()}>Go Back</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={() => router.back()}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div className="flex-1">
                    <h1 className="text-3xl font-bold">{quiz.title}</h1>
                    <p className="text-muted-foreground">Quiz Results & Analytics</p>
                </div>
                <Button onClick={exportToCSV} variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                </Button>
            </div>

            {/* Statistics Cards */}
            {statistics && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Attempts</CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{statistics.totalAttempts}</div>
                            <p className="text-xs text-muted-foreground">
                                {statistics.completedAttempts} completed
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {statistics.averageScore.toFixed(1)}%
                            </div>
                            <p className="text-xs text-muted-foreground">
                                High: {statistics.highestScore}% / Low: {statistics.lowestScore}%
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Passing Rate</CardTitle>
                            <Award className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">
                                {statistics.passingRate.toFixed(1)}%
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {quiz.passingScore}% required to pass
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Students</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{statistics.totalStudents}</div>
                            <p className="text-xs text-muted-foreground">
                                {statistics.averageTimeSpent
                                    ? `Avg time: ${Math.round(statistics.averageTimeSpent / 60)} min`
                                    : "No time data"}
                            </p>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Student Results Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Student Results</CardTitle>
                </CardHeader>
                <CardContent>
                    {results.studentResults.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            <Users className="h-12 w-12 mx-auto mb-4" />
                            <p>No student submissions yet</p>
                        </div>
                    ) : (
                        <div className="border rounded-lg">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Student</TableHead>
                                        <TableHead>Student Code</TableHead>
                                        <TableHead>Attempts</TableHead>
                                        <TableHead>Best Score</TableHead>
                                        <TableHead>Last Attempt</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {results.studentResults.map((student) => (
                                        <TableRow key={student.studentId}>
                                            <TableCell className="font-medium">{student.studentName}</TableCell>
                                            <TableCell>{student.studentCode || "-"}</TableCell>
                                            <TableCell>{student.attempts}</TableCell>
                                            <TableCell className="font-medium">
                                                {student.bestScore !== undefined && student.bestScore !== null
                                                    ? `${student.bestScore.toFixed(1)}%`
                                                    : "-"}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {student.lastAttemptAt
                                                    ? formatDistanceToNow(new Date(student.lastAttemptAt), {
                                                        addSuffix: true,
                                                    })
                                                    : "-"}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={student.passed ? "default" : "destructive"}
                                                    className={
                                                        student.passed
                                                            ? "bg-green-100 text-green-800 hover:bg-green-200"
                                                            : ""
                                                    }
                                                >
                                                    {student.passed ? "Passed" : "Failed"}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
