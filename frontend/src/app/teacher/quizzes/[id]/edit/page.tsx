"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Button from "@/core/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/core/components/ui/Card";
import Input from "@/core/components/ui/Input";
import Badge from "@/core/components/ui/Badge";
import Checkbox from "@/core/components/ui/Checkbox";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/core/components/ui/Tabs";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/core/components/ui/AlertDialog";
import {
    useQuizById,
    useRemoveQuestionFromQuiz,
    useAddQuestionsToQuiz,
    useQuestionBanksByTeacher,
    useQuestionsByBank,
} from "@/hooks/teacher";
import { useTeacherId } from "@/hooks/useProfile";
import {
    Plus,
    Search,
    Library,
    FileQuestion,
    ArrowLeft,
    CheckCircle2,
    Circle,
} from "lucide-react";

export default function QuizEditPage() {
    const params = useParams();
    const router = useRouter();
    const quizId = Number(params.id);
    const teacherId = useTeacherId();

    const [activeTab, setActiveTab] = useState("current");
    const [selectedBankId, setSelectedBankId] = useState<number | null>(null);
    const [selectedQuestionIds, setSelectedQuestionIds] = useState<number[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [deletingQuestionId, setDeletingQuestionId] = useState<number | null>(null);

    // API Hooks
    const { data: quiz, isLoading: quizLoading } = useQuizById(quizId);
    const { data: questionBanks = [] } = useQuestionBanksByTeacher(teacherId ?? null);
    const { data: bankQuestions = [] } = useQuestionsByBank(selectedBankId);
    const removeQuestionMutation = useRemoveQuestionFromQuiz(quizId);
    const addQuestionsMutation = useAddQuestionsToQuiz(quizId);

    const handleRemoveQuestion = async () => {
        if (deletingQuestionId) {
            await removeQuestionMutation.mutateAsync(deletingQuestionId);
            setDeletingQuestionId(null);
        }
    };

    const handleAddQuestionsFromBank = async () => {
        if (selectedQuestionIds.length > 0) {
            await addQuestionsMutation.mutateAsync({
                questionIds: selectedQuestionIds,
            });
            setSelectedQuestionIds([]);
            setActiveTab("current");
        }
    };

    const toggleQuestionSelection = (questionId: number) => {
        setSelectedQuestionIds((prev) =>
            prev.includes(questionId)
                ? prev.filter((id) => id !== questionId)
                : [...prev, questionId]
        );
    };

    const filteredBankQuestions = bankQuestions.filter((q) =>
        q.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getQuestionTypeBadge = (type: string) => {
        const typeConfig = {
            MULTIPLE_CHOICE: { className: "bg-blue-100 text-blue-800", label: "Multiple Choice" },
            MULTI_SELECT: { className: "bg-purple-100 text-purple-800", label: "Multi Select" },
            TRUE_FALSE: { className: "bg-green-100 text-green-800", label: "True/False" },
            SHORT_ANSWER: { className: "bg-yellow-100 text-yellow-800", label: "Short Answer" },
            ESSAY: { className: "bg-orange-100 text-orange-800", label: "Essay" },
        };
        const config = typeConfig[type as keyof typeof typeConfig];
        return config ? <Badge className={config.className}>{config.label}</Badge> : null;
    };

    if (quizLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!quiz) {
        return (
            <div className="container mx-auto py-8">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Quiz not found</h1>
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
                    <p className="text-muted-foreground">
                        Quiz Builder - Manage questions for this quiz
                    </p>
                </div>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                    <TabsTrigger value="current">
                        <FileQuestion className="h-4 w-4 mr-2" />
                        Current Questions ({quiz.totalQuestions || 0})
                    </TabsTrigger>
                    <TabsTrigger value="bank">
                        <Library className="h-4 w-4 mr-2" />
                        Question Bank
                    </TabsTrigger>
                </TabsList>

                {/* Current Questions Tab */}
                <TabsContent value="current" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Questions in this Quiz</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {!quiz.totalQuestions || quiz.totalQuestions === 0 ? (
                                <div className="text-center py-12">
                                    <FileQuestion className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                    <h3 className="text-lg font-medium mb-2">No questions yet</h3>
                                    <p className="text-muted-foreground mb-4">
                                        Add questions from your question bank to get started
                                    </p>
                                    <Button onClick={() => setActiveTab("bank")}>
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Questions
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <p className="text-sm text-muted-foreground">
                                        This quiz currently has {quiz.totalQuestions} question(s).
                                    </p>
                                    <Button onClick={() => setActiveTab("bank")}>
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add More Questions
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Question Bank Tab */}
                <TabsContent value="bank" className="space-y-4">
                    {/* Select Question Bank */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Select Question Bank</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {questionBanks.length === 0 ? (
                                <div className="text-center py-8">
                                    <Library className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                                    <p className="text-muted-foreground mb-4">
                                        No question banks found. Create one first.
                                    </p>
                                    <Button onClick={() => router.push("/teacher/question-banks")}>
                                        Manage Question Banks
                                    </Button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {questionBanks.map((bank) => (
                                        <Card
                                            key={bank.id}
                                            className={`cursor-pointer transition-colors ${selectedBankId === bank.id
                                                ? "border-primary bg-primary/5"
                                                : "hover:bg-muted/50"
                                                }`}
                                            onClick={() => setSelectedBankId(bank.id)}
                                        >
                                            <CardHeader className="p-4">
                                                <div className="flex items-start gap-3">
                                                    <Library className="h-5 w-5 mt-0.5" />
                                                    <div className="flex-1">
                                                        <CardTitle className="text-base">{bank.name}</CardTitle>
                                                        {bank.description && (
                                                            <p className="text-sm text-muted-foreground mt-1">
                                                                {bank.description}
                                                            </p>
                                                        )}
                                                    </div>
                                                    {selectedBankId === bank.id && (
                                                        <CheckCircle2 className="h-5 w-5 text-primary" />
                                                    )}
                                                </div>
                                            </CardHeader>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Questions from Selected Bank */}
                    {selectedBankId && (
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>Select Questions to Add</CardTitle>
                                    {selectedQuestionIds.length > 0 && (
                                        <Button onClick={handleAddQuestionsFromBank}>
                                            <Plus className="h-4 w-4 mr-2" />
                                            Add {selectedQuestionIds.length} Question(s)
                                        </Button>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Search */}
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search questions..."
                                        value={searchTerm}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                                        className="pl-9"
                                    />
                                </div>

                                {/* Questions List */}
                                {filteredBankQuestions.length === 0 ? (
                                    <div className="text-center py-8 text-muted-foreground">
                                        {searchTerm
                                            ? "No questions match your search"
                                            : "No questions in this bank"}
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {filteredBankQuestions.map((question) => (
                                            <Card
                                                key={question.id}
                                                className="cursor-pointer hover:bg-muted/50 transition-colors"
                                                onClick={() => toggleQuestionSelection(question.id)}
                                            >
                                                <CardContent className="p-4">
                                                    <div className="flex items-start gap-3">
                                                        <Checkbox
                                                            checked={selectedQuestionIds.includes(question.id)}
                                                            onChange={() => toggleQuestionSelection(question.id)}
                                                        />
                                                        <div className="flex-1">
                                                            <div className="flex items-start gap-2 mb-2">
                                                                {getQuestionTypeBadge(question.type)}
                                                                <Badge variant="outline">{question.maxPoints} pts</Badge>
                                                            </div>
                                                            <p className="text-sm">{question.content}</p>
                                                            {question.answerOptions && question.answerOptions.length > 0 && (
                                                                <div className="mt-2 space-y-1">
                                                                    {question.answerOptions.map((option) => (
                                                                        <div
                                                                            key={option.id}
                                                                            className="text-xs text-muted-foreground flex items-center gap-2"
                                                                        >
                                                                            {option.isCorrect ? (
                                                                                <CheckCircle2 className="h-3 w-3 text-green-500" />
                                                                            ) : (
                                                                                <Circle className="h-3 w-3" />
                                                                            )}
                                                                            {option.content}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>
            </Tabs>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deletingQuestionId !== null} onOpenChange={(open) => !open && setDeletingQuestionId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Remove Question from Quiz</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to remove this question from the quiz?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleRemoveQuestion} className="bg-red-500">
                            Remove
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
