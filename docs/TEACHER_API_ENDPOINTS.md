# Teacher API Endpoints - Assessment & Assignment Modules

This document provides a comprehensive overview of all API endpoints related to teacher business logic for the Assessment and Assignment modules. These endpoints are essential for building the teacher-facing UI.

## Table of Contents

- [Assessment Module](#assessment-module)
  - [Quiz Management](#quiz-management)
  - [Question Management](#question-management)
  - [Question Bank Management](#question-bank-management)
  - [Quiz Results & Statistics](#quiz-results--statistics)
- [Assignment Module](#assignment-module)
  - [Assignment Management](#assignment-management)
  - [Submission Management](#submission-management)
  - [Submission File Management](#submission-file-management)

---

## Assessment Module

### Quiz Management

#### 1. Create Independent Quiz

**Endpoint:** `POST /api/v1/quizzes`  
**Access:** Teacher Only  
**Description:** Creates a quiz that exists independently (not linked to any lesson yet). Follows the Association pattern where quizzes can be reused across multiple lessons.

**Request Body:**

```typescript
{
  title: string;
  description?: string;
  instructions?: string;
  quizType: "PRACTICE" | "GRADED" | "FINAL";
  timeLimit?: number; // in minutes
  passingScore?: number;
  maxAttempts?: number;
  shuffleQuestions?: boolean;
  showCorrectAnswers?: boolean;
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
}
```

**Response:** `QuizResponse`

**Frontend Service Method:** `assessmentService.createIndependentQuiz(payload)`

---

#### 2. Get All Independent Quizzes

**Endpoint:** `GET /api/v1/quizzes`  
**Access:** Teacher Only  
**Description:** Retrieves all independent quizzes (quiz library/pool) available for linking to lessons.

**Response:** `QuizResponse[]`

**Frontend Service Method:** `assessmentService.getAllIndependentQuizzes()`

---

#### 3. Link Quiz to Lesson

**Endpoint:** `POST /api/v1/lessons/{lessonId}/quizzes/{quizId}`  
**Access:** Teacher Only  
**Description:** Links an existing independent quiz to a specific lesson, allowing quiz reusability across multiple lessons.

**Path Parameters:**

- `lessonId`: number
- `quizId`: number

**Response:** `QuizResponse`

**Frontend Service Method:** `assessmentService.linkQuizToLesson(lessonId, quizId)`

---

#### 4. Unlink Quiz from Lesson

**Endpoint:** `DELETE /api/v1/lessons/{lessonId}/quizzes/{quizId}`  
**Access:** Teacher Only  
**Description:** Unlinks a quiz from a lesson. The quiz becomes independent again and can be linked to other lessons.

**Path Parameters:**

- `lessonId`: number
- `quizId`: number

**Response:** `void`

**Frontend Service Method:** `assessmentService.unlinkQuizFromLesson(lessonId, quizId)`

---

#### 5. Create Quiz (Convenience Method)

**Endpoint:** `POST /api/v1/lessons/{lessonId}/quizzes`  
**Access:** Teacher Only  
**Description:** Creates a quiz and immediately links it to a lesson. This is a convenience method for quick creation during lesson editing. Internally calls `createIndependentQuiz()` + `linkQuizToLesson()`.

**Path Parameters:**

- `lessonId`: number

**Request Body:** Same as Create Independent Quiz

**Response:** `QuizResponse`

**Frontend Service Method:** `assessmentService.createQuiz(lessonId, payload)`

---

#### 6. Get Quizzes by Lesson

**Endpoint:** `GET /api/v1/lessons/{lessonId}/quizzes`  
**Access:** Public  
**Description:** Retrieves all quizzes linked to a specific lesson.

**Path Parameters:**

- `lessonId`: number

**Response:** `QuizResponse[]`

**Frontend Service Method:** `assessmentService.getQuizzesByLesson(lessonId)`

---

#### 7. Get Quiz by ID

**Endpoint:** `GET /api/v1/quizzes/{id}`  
**Access:** Public  
**Description:** Retrieves a specific quiz by its ID.

**Path Parameters:**

- `id`: number

**Response:** `QuizResponse`

**Frontend Service Method:** `assessmentService.getQuizById(id)`

---

#### 8. Update Quiz

**Endpoint:** `PUT /api/v1/quizzes/{id}`  
**Access:** Teacher Only  
**Description:** Updates an existing quiz.

**Path Parameters:**

- `id`: number

**Request Body:** Same as Create Independent Quiz

**Response:** `QuizResponse`

**Frontend Service Method:** `assessmentService.updateQuiz(id, payload)`

---

#### 9. Delete Quiz

**Endpoint:** `DELETE /api/v1/quizzes/{id}`  
**Access:** Teacher Only  
**Description:** Deletes a quiz. Returns the deleted quiz data.

**Path Parameters:**

- `id`: number

**Response:** `QuizResponse`

**Frontend Service Method:** `assessmentService.deleteQuiz(id)`

---

#### 10. Add Questions to Quiz

**Endpoint:** `POST /api/v1/quizzes/{id}/add-questions`  
**Access:** Teacher Only  
**Description:** Adds existing questions to a quiz by providing question IDs.

**Path Parameters:**

- `id`: number (Quiz ID)

**Request Body:**

```typescript
{
  questionIds: number[];
}
```

**Response:** `QuizResponse`

**Frontend Service Method:** `assessmentService.addQuestionsToQuiz(id, payload)`

---

#### 11. Remove Question from Quiz

**Endpoint:** `DELETE /api/v1/quizzes/{id}/questions/{questionId}`  
**Access:** Teacher Only  
**Description:** Removes a specific question from a quiz.

**Path Parameters:**

- `id`: number (Quiz ID)
- `questionId`: number

**Response:** `void`

**Frontend Service Method:** `assessmentService.removeQuestionFromQuiz(quizId, questionId)`

---

#### 12. Clone Quiz

**Endpoint:** `POST /api/v1/quizzes/{id}/clone`  
**Access:** Teacher Only  
**Description:** Creates a copy of an existing quiz and links it to a target lesson.

**Path Parameters:**

- `id`: number (Quiz ID)

**Query Parameters:**

- `targetLessonId`: number

**Response:** `QuizResponse`

**Frontend Service Method:** `assessmentService.cloneQuiz(id, targetLessonId)`

---

#### 13. Reorder Questions

**Endpoint:** `PUT /api/v1/quizzes/{id}/reorder-questions`  
**Access:** Teacher Only  
**Description:** Changes the order of questions in a quiz.

**Path Parameters:**

- `id`: number (Quiz ID)

**Request Body:** `number[]` (Array of question IDs in desired order)

**Response:** `void`

**Frontend Service Method:** `assessmentService.reorderQuestions(id, questionIdsInOrder)`

---

#### 14. Get Question Count

**Endpoint:** `GET /api/v1/quizzes/{id}/question-count`  
**Access:** Public  
**Description:** Returns the total number of questions in a quiz.

**Path Parameters:**

- `id`: number (Quiz ID)

**Response:** `number`

**Frontend Service Method:** `assessmentService.getQuestionCount(id)`

---

#### 15. Update Time Limit

**Endpoint:** `PUT /api/v1/quizzes/{id}/time-limit`  
**Access:** Teacher Only  
**Description:** Updates the time limit for a quiz.

**Path Parameters:**

- `id`: number (Quiz ID)

**Query Parameters:**

- `timeLimitMinutes`: number

**Response:** `QuizResponse`

**Frontend Service Method:** `assessmentService.updateTimeLimit(id, timeLimitMinutes)`

---

#### 16. Update Passing Score

**Endpoint:** `PUT /api/v1/quizzes/{id}/passing-score`  
**Access:** Teacher Only  
**Description:** Updates the passing score for a quiz.

**Path Parameters:**

- `id`: number (Quiz ID)

**Query Parameters:**

- `passingScore`: number

**Response:** `QuizResponse`

**Frontend Service Method:** `assessmentService.updatePassingScore(id, passingScore)`

---

#### 17. Add Questions from Bank

**Endpoint:** `POST /api/v1/quizzes/{id}/add-from-bank`  
**Access:** Teacher Only  
**Description:** Adds questions to a quiz from a question bank. Can optionally specify the number of questions to add.

**Path Parameters:**

- `id`: number (Quiz ID)

**Query Parameters:**

- `questionBankId`: number
- `count?`: number (Optional: number of questions to add)

**Response:** `QuizResponse`

**Frontend Service Method:** `assessmentService.addQuestionsFromBank(id, questionBankId, count)`

---

#### 18. Remove All Questions

**Endpoint:** `DELETE /api/v1/quizzes/{id}/questions`  
**Access:** Teacher Only  
**Description:** Removes all questions from a quiz.

**Path Parameters:**

- `id`: number (Quiz ID)

**Response:** `void`

**Frontend Service Method:** `assessmentService.removeAllQuestions(id)`

---

#### 19. Update Max Attempts

**Endpoint:** `PUT /api/v1/quizzes/{id}/max-attempts`  
**Access:** Teacher Only  
**Description:** Updates the maximum number of attempts allowed for a quiz.

**Path Parameters:**

- `id`: number (Quiz ID)

**Query Parameters:**

- `maxAttempts`: number

**Response:** `QuizResponse`

**Frontend Service Method:** `assessmentService.updateMaxAttempts(id, maxAttempts)`

---

### Question Management

#### 20. Create Question

**Endpoint:** `POST /api/v1/question-banks/{bankId}/questions`  
**Access:** Teacher Only  
**Description:** Creates a new question in a specific question bank.

**Path Parameters:**

- `bankId`: number

**Request Body:**

```typescript
{
  content: string;
  type: "MULTIPLE_CHOICE" | "MULTI_SELECT" | "TRUE_FALSE" | "SHORT_ANSWER" | "ESSAY";
  metadata?: string; // JSON string for additional data
  maxPoints?: number;
  answerOptions?: Array<{
    content: string;
    correct: boolean;
    orderIndex?: number;
  }>;
}
```

**Response:** `QuestionResponse`

**Frontend Service Method:** `assessmentService.createQuestion(bankId, payload)`

---

#### 21. Get Questions by Bank

**Endpoint:** `GET /api/v1/question-banks/{bankId}/questions`  
**Access:** Teacher Only  
**Description:** Retrieves all questions in a specific question bank.

**Path Parameters:**

- `bankId`: number

**Response:** `QuestionResponse[]`

**Frontend Service Method:** `assessmentService.getQuestionsByBank(bankId)`

---

#### 22. Get Question by ID

**Endpoint:** `GET /api/v1/questions/{id}`  
**Access:** Teacher Only  
**Description:** Retrieves a specific question by its ID.

**Path Parameters:**

- `id`: number

**Response:** `QuestionResponse`

**Frontend Service Method:** `assessmentService.getQuestionById(id)`

---

#### 23. Update Question

**Endpoint:** `PUT /api/v1/questions/{id}`  
**Access:** Teacher Only  
**Description:** Updates an existing question.

**Path Parameters:**

- `id`: number

**Request Body:** Same as Create Question

**Response:** `QuestionResponse`

**Frontend Service Method:** `assessmentService.updateQuestion(id, payload)`

---

#### 24. Delete Question

**Endpoint:** `DELETE /api/v1/questions/{id}`  
**Access:** Teacher Only  
**Description:** Deletes a question.

**Path Parameters:**

- `id`: number

**Response:** `void`

**Frontend Service Method:** `assessmentService.deleteQuestion(id)`

---

#### 25. Manage Answer Options

**Endpoint:** `POST /api/v1/questions/{id}/answer-options`  
**Access:** Teacher Only  
**Description:** Manages (add/update/remove) answer options for a question.

**Path Parameters:**

- `id`: number (Question ID)

**Request Body:**

```typescript
Array<{
  content: string;
  correct: boolean;
  orderIndex?: number;
}>;
```

**Response:** `QuestionResponse`

**Frontend Service Method:** `assessmentService.manageAnswerOptions(questionId, payload)`

---

#### 26. Search Questions

**Endpoint:** `GET /api/v1/question-banks/{bankId}/questions/search`  
**Access:** Teacher Only  
**Description:** Searches for questions within a question bank by keyword.

**Path Parameters:**

- `bankId`: number

**Query Parameters:**

- `keyword`: string

**Response:** `QuestionResponse[]`

**Frontend Service Method:** `assessmentService.searchQuestions(bankId, keyword)`

---

#### 27. Get Questions by Type

**Endpoint:** `GET /api/v1/question-banks/{bankId}/questions/by-type`  
**Access:** Teacher Only  
**Description:** Retrieves questions of a specific type from a question bank.

**Path Parameters:**

- `bankId`: number

**Query Parameters:**

- `type`: QuestionType ("MULTIPLE_CHOICE" | "MULTI_SELECT" | "TRUE_FALSE" | "SHORT_ANSWER" | "ESSAY")

**Response:** `QuestionResponse[]`

**Frontend Service Method:** `assessmentService.getQuestionsByType(bankId, type)`

---

#### 28. Clone Question

**Endpoint:** `POST /api/v1/questions/{id}/clone`  
**Access:** Teacher Only  
**Description:** Creates a copy of a question and adds it to a target question bank.

**Path Parameters:**

- `id`: number (Question ID)

**Query Parameters:**

- `targetBankId`: number

**Response:** `QuestionResponse`

**Frontend Service Method:** `assessmentService.cloneQuestion(id, targetBankId)`

---

#### 29. Bulk Delete Questions

**Endpoint:** `DELETE /api/v1/questions/bulk`  
**Access:** Teacher Only  
**Description:** Deletes multiple questions at once.

**Request Body:** `number[]` (Array of question IDs)

**Response:** `void`

**Frontend Service Method:** `assessmentService.bulkDeleteQuestions(questionIds)`

---

#### 30. Update Max Points

**Endpoint:** `PUT /api/v1/questions/{id}/max-points`  
**Access:** Teacher Only  
**Description:** Updates the maximum points for a question.

**Path Parameters:**

- `id`: number (Question ID)

**Query Parameters:**

- `maxPoints`: number

**Response:** `QuestionResponse`

**Frontend Service Method:** `assessmentService.updateMaxPoints(id, maxPoints)`

---

#### 31. Get Question Count by Bank

**Endpoint:** `GET /api/v1/question-banks/{bankId}/questions/count`  
**Access:** Teacher Only  
**Description:** Returns the total number of questions in a question bank.

**Path Parameters:**

- `bankId`: number

**Response:**

```typescript
{
  count: number;
}
```

**Frontend Service Method:** `assessmentService.getQuestionCountByBank(bankId)`

---

#### 32. Check if Question is In Use

**Endpoint:** `GET /api/v1/questions/{id}/in-use`  
**Access:** Teacher Only  
**Description:** Checks if a question is currently being used in any quizzes.

**Path Parameters:**

- `id`: number (Question ID)

**Response:**

```typescript
{
  inUse: boolean;
}
```

**Frontend Service Method:** `assessmentService.checkQuestionInUse(id)`

---

#### 33. Get Quizzes Using Question

**Endpoint:** `GET /api/v1/questions/{id}/quizzes`  
**Access:** Teacher Only  
**Description:** Returns a list of quiz IDs that are using this question.

**Path Parameters:**

- `id`: number (Question ID)

**Response:**

```typescript
{
  quizIds: number[];
}
```

**Frontend Service Method:** `assessmentService.getQuizzesUsingQuestion(id)`

---

### Question Bank Management

#### 34. Create Question Bank

**Endpoint:** `POST /api/v1/teachers/{teacherId}/question-banks`  
**Access:** Teacher Only  
**Description:** Creates a new question bank for a teacher.

**Path Parameters:**

- `teacherId`: number

**Request Body:**

```typescript
{
  name: string;
  description?: string;
}
```

**Response:** `QuestionBankResponse`

**Frontend Service Method:** `assessmentService.createQuestionBank(teacherId, payload)`

---

#### 35. Get Question Banks by Teacher

**Endpoint:** `GET /api/v1/teachers/{teacherId}/question-banks`  
**Access:** Teacher Only  
**Description:** Retrieves all question banks owned by a specific teacher.

**Path Parameters:**

- `teacherId`: number

**Response:** `QuestionBankResponse[]`

**Frontend Service Method:** `assessmentService.getQuestionBanksByTeacher(teacherId)`

---

#### 36. Get Question Bank by ID

**Endpoint:** `GET /api/v1/question-banks/{id}`  
**Access:** Teacher Only  
**Description:** Retrieves a specific question bank by its ID.

**Path Parameters:**

- `id`: number

**Response:** `QuestionBankResponse`

**Frontend Service Method:** `assessmentService.getQuestionBankById(id)`

---

#### 37. Update Question Bank

**Endpoint:** `PUT /api/v1/question-banks/{id}`  
**Access:** Teacher Only  
**Description:** Updates an existing question bank.

**Path Parameters:**

- `id`: number

**Request Body:** Same as Create Question Bank

**Response:** `QuestionBankResponse`

**Frontend Service Method:** `assessmentService.updateQuestionBank(id, payload)`

---

#### 38. Delete Question Bank

**Endpoint:** `DELETE /api/v1/question-banks/{id}`  
**Access:** Teacher Only  
**Description:** Deletes a question bank.

**Path Parameters:**

- `id`: number

**Response:** `void`

**Frontend Service Method:** `assessmentService.deleteQuestionBank(id)`

---

#### 39. Get All Question Banks

**Endpoint:** `GET /api/v1/question-banks`  
**Access:** Teacher Only  
**Description:** Retrieves all question banks in the system (useful for admins or shared question banks).

**Response:** `QuestionBankResponse[]`

**Frontend Service Method:** `assessmentService.getAllQuestionBanks()`

---

#### 40. Search Question Banks

**Endpoint:** `GET /api/v1/question-banks/search`  
**Access:** Teacher Only  
**Description:** Searches for question banks by keyword.

**Query Parameters:**

- `keyword`: string

**Response:** `QuestionBankResponse[]`

**Frontend Service Method:** `assessmentService.searchQuestionBanks(keyword)`

---

#### 41. Clone Question Bank

**Endpoint:** `POST /api/v1/question-banks/{id}/clone`  
**Access:** Teacher Only  
**Description:** Creates a copy of a question bank for another teacher.

**Path Parameters:**

- `id`: number (Question Bank ID)

**Query Parameters:**

- `targetTeacherId`: number

**Response:** `QuestionBankResponse`

**Frontend Service Method:** `assessmentService.cloneQuestionBank(id, targetTeacherId)`

---

### Quiz Results & Statistics

#### 42. Get Quiz Results

**Endpoint:** `GET /api/v1/quizzes/{id}/results`  
**Access:** Teacher Only  
**Description:** Retrieves all quiz attempt results for a specific quiz.

**Path Parameters:**

- `id`: number (Quiz ID)

**Response:** `QuizAttemptResponse[]`

**Frontend Service Method:** `assessmentService.getQuizResults(id)`

---

#### 43. Get Quiz Statistics

**Endpoint:** `GET /api/v1/quizzes/{id}/statistics`  
**Access:** Teacher Only  
**Description:** Retrieves statistical data for a quiz including average scores, passing rates, etc.

**Path Parameters:**

- `id`: number (Quiz ID)

**Response:**

```typescript
{
  quizId: number;
  quizTitle: string;
  totalAttempts: number;
  totalStudents: number;
  completedAttempts: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  passingRate: number;
  averageTimeSpent?: number;
}
```

**Frontend Service Method:** `assessmentService.getQuizStatistics(id)`

---

## Assignment Module

### Assignment Management

#### 44. Create Independent Assignment

**Endpoint:** `POST /api/v1/assignments`  
**Access:** Teacher Only  
**Description:** Creates an assignment that exists independently (not linked to any lesson yet). Follows the Association pattern where assignments can be reused across multiple lessons.

**Request Body:**

```typescript
{
  title: string;
  description?: string;
  instructions?: string;
  dueDate?: string; // ISO datetime string
  maxScore?: number;
  allowLateSubmission?: boolean;
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
}
```

**Response:** `AssignmentResponse`

**Frontend Service Method:** `assignmentService.createIndependentAssignment(payload)`

---

#### 45. Get All Independent Assignments

**Endpoint:** `GET /api/v1/assignments`  
**Access:** Teacher Only  
**Description:** Retrieves all independent assignments (assignment library/pool) available for linking to lessons.

**Response:** `AssignmentResponse[]`

**Frontend Service Method:** `assignmentService.getAllIndependentAssignments()`

---

#### 46. Link Assignment to Lesson

**Endpoint:** `POST /api/v1/lessons/{lessonId}/assignments/{assignmentId}`  
**Access:** Teacher Only  
**Description:** Links an existing independent assignment to a specific lesson, allowing assignment reusability across multiple lessons.

**Path Parameters:**

- `lessonId`: number
- `assignmentId`: number

**Response:** `AssignmentResponse`

**Frontend Service Method:** `assignmentService.linkAssignmentToLesson(lessonId, assignmentId)`

---

#### 47. Unlink Assignment from Lesson

**Endpoint:** `DELETE /api/v1/lessons/{lessonId}/assignments/{assignmentId}`  
**Access:** Teacher Only  
**Description:** Unlinks an assignment from a lesson. The assignment becomes independent again and can be linked to other lessons.

**Path Parameters:**

- `lessonId`: number
- `assignmentId`: number

**Response:** `void`

**Frontend Service Method:** `assignmentService.unlinkAssignmentFromLesson(lessonId, assignmentId)`

---

#### 48. Create Assignment (Convenience Method)

**Endpoint:** `POST /api/v1/lessons/{lessonId}/assignments`  
**Access:** Teacher Only  
**Description:** Creates an assignment and immediately links it to a lesson. This is a convenience method for quick creation during lesson editing. Internally calls `createIndependentAssignment()` + `linkAssignmentToLesson()`.

**Path Parameters:**

- `lessonId`: number

**Request Body:** Same as Create Independent Assignment

**Response:** `AssignmentResponse`

**Frontend Service Method:** `assignmentService.createAssignment(lessonId, payload)`

---

#### 49. Get Assignments by Lesson

**Endpoint:** `GET /api/v1/lessons/{lessonId}/assignments`  
**Access:** Student or Teacher  
**Description:** Retrieves all assignments linked to a specific lesson.

**Path Parameters:**

- `lessonId`: number

**Response:** `AssignmentResponse[]`

**Frontend Service Method:** `assignmentService.getAssignmentsByLesson(lessonId)`

---

#### 50. Get Assignment by ID

**Endpoint:** `GET /api/v1/assignments/{id}`  
**Access:** Student or Teacher  
**Description:** Retrieves a specific assignment by its ID.

**Path Parameters:**

- `id`: number

**Response:** `AssignmentResponse`

**Frontend Service Method:** `assignmentService.getAssignmentById(id)`

---

#### 51. Update Assignment

**Endpoint:** `PUT /api/v1/assignments/{id}`  
**Access:** Teacher Only  
**Description:** Updates an existing assignment.

**Path Parameters:**

- `id`: number

**Request Body:** Same as Create Independent Assignment

**Response:** `AssignmentResponse`

**Frontend Service Method:** `assignmentService.updateAssignment(id, payload)`

---

#### 52. Delete Assignment

**Endpoint:** `DELETE /api/v1/assignments/{id}`  
**Access:** Teacher Only  
**Description:** Deletes an assignment.

**Path Parameters:**

- `id`: number

**Response:** `void`

**Frontend Service Method:** `assignmentService.deleteAssignment(id)`

---

#### 53. Get Assignment Submissions

**Endpoint:** `GET /api/v1/assignments/{id}/submissions`  
**Access:** Teacher Only  
**Description:** Retrieves all submissions for a specific assignment.

**Path Parameters:**

- `id`: number (Assignment ID)

**Response:** `SubmissionResponse[]`

**Frontend Service Method:** `assignmentService.getAssignmentSubmissions(id)`

---

#### 54. Get Assignment Statistics

**Endpoint:** `GET /api/v1/assignments/{id}/statistics`  
**Access:** Teacher Only  
**Description:** Retrieves statistical data for an assignment including submission rates, average scores, etc.

**Path Parameters:**

- `id`: number (Assignment ID)

**Response:**

```typescript
{
  assignmentId: number;
  assignmentTitle: string;
  totalStudents: number;
  submittedCount: number;
  gradedCount: number;
  averageScore?: number;
  highestScore?: number;
  lowestScore?: number;
  onTimeSubmissions: number;
  lateSubmissions: number;
  submissionRate: number;
}
```

**Frontend Service Method:** `assignmentService.getAssignmentStatistics(id)`

---

#### 55. Clone Assignment

**Endpoint:** `POST /api/v1/assignments/{id}/clone`  
**Access:** Teacher Only  
**Description:** Creates a copy of an existing assignment and links it to a target lesson.

**Path Parameters:**

- `id`: number (Assignment ID)

**Query Parameters:**

- `targetLessonId`: number

**Response:** `AssignmentResponse`

**Frontend Service Method:** `assignmentService.cloneAssignment(id, targetLessonId)`

---

#### 56. Get Late Submissions

**Endpoint:** `GET /api/v1/assignments/{id}/late-submissions`  
**Access:** Teacher Only  
**Description:** Retrieves all late submissions for a specific assignment.

**Path Parameters:**

- `id`: number (Assignment ID)

**Response:** `SubmissionResponse[]`

**Frontend Service Method:** `assignmentService.getLateSubmissions(id)`

---

#### 57. Get Pending Submissions

**Endpoint:** `GET /api/v1/assignments/{id}/pending-submissions`  
**Access:** Teacher Only  
**Description:** Retrieves all pending (ungraded) submissions for a specific assignment.

**Path Parameters:**

- `id`: number (Assignment ID)

**Response:** `SubmissionResponse[]`

**Frontend Service Method:** `assignmentService.getPendingSubmissions(id)`

---

#### 58. Get Assignments by Type

**Endpoint:** `GET /api/v1/lessons/{lessonId}/assignments/by-type`  
**Access:** Student or Teacher  
**Description:** Retrieves assignments of a specific type from a lesson.

**Path Parameters:**

- `lessonId`: number

**Query Parameters:**

- `type`: AssignmentType ("HOMEWORK" | "PROJECT" | "LAB" | "EXAM" | "OTHER")

**Response:** `AssignmentResponse[]`

**Frontend Service Method:** `assignmentService.getAssignmentsByType(lessonId, type)`

---

#### 59. Extend Due Date

**Endpoint:** `PUT /api/v1/assignments/{id}/extend-due-date`  
**Access:** Teacher Only  
**Description:** Extends the due date of an assignment.

**Path Parameters:**

- `id`: number (Assignment ID)

**Query Parameters:**

- `newDueDate`: string (ISO datetime string)

**Response:** `AssignmentResponse`

**Frontend Service Method:** `assignmentService.extendDueDate(id, newDueDate)`

---

### Submission Management

#### 60. Get Submissions by Assignment

**Endpoint:** `GET /api/v1/assignments/{assignmentId}/submissions`  
**Access:** Teacher Only  
**Description:** Retrieves all submissions for a specific assignment (same as #53, alternative endpoint pattern).

**Path Parameters:**

- `assignmentId`: number

**Response:** `SubmissionResponse[]`

**Frontend Service Method:** `assignmentService.getSubmissionsByAssignment(assignmentId)`

---

#### 61. Get Submission by ID

**Endpoint:** `GET /api/v1/submissions/{id}`  
**Access:** Student or Teacher  
**Description:** Retrieves a specific submission by its ID.

**Path Parameters:**

- `id`: number

**Response:** `SubmissionResponse`

**Frontend Service Method:** `assignmentService.getSubmissionById(id)`

---

#### 62. Grade Submission

**Endpoint:** `POST /api/v1/submissions/{id}/grade`  
**Access:** Teacher Only  
**Description:** Grades a submission with a score and optional feedback.

**Path Parameters:**

- `id`: number (Submission ID)

**Request Body:**

```typescript
{
  score: number;
  feedback?: string;
}
```

**Response:** `SubmissionResponse`

**Frontend Service Method:** `assignmentService.gradeSubmission(id, payload)`

---

#### 63. Add Feedback to Submission

**Endpoint:** `POST /api/v1/submissions/{id}/feedback`  
**Access:** Teacher Only  
**Description:** Adds feedback to a submission without grading.

**Path Parameters:**

- `id`: number (Submission ID)

**Request Body:**

```typescript
{
  feedback: string;
}
```

**Response:** `SubmissionResponse`

**Frontend Service Method:** `assignmentService.feedbackSubmission(id, payload)`

---

#### 64. Bulk Grade Submissions

**Endpoint:** `POST /api/v1/submissions/bulk-grade`  
**Access:** Teacher Only  
**Description:** Grades multiple submissions at once with the same score and optional feedback.

**Request Body:** `number[]` (Array of submission IDs)

**Query Parameters:**

- `score`: number
- `feedback?`: string (Optional)

**Response:** `SubmissionResponse[]`

**Frontend Service Method:** `assignmentService.bulkGradeSubmissions(submissionIds, score, feedback)`

---

#### 65. Reject Submission

**Endpoint:** `POST /api/v1/submissions/{id}/reject`  
**Access:** Teacher Only  
**Description:** Rejects a submission with feedback.

**Path Parameters:**

- `id`: number (Submission ID)

**Query Parameters:**

- `feedback`: string

**Response:** `SubmissionResponse`

**Frontend Service Method:** `assignmentService.rejectSubmission(id, feedback)`

---

#### 66. Get Submissions by Status

**Endpoint:** `GET /api/v1/assignments/{assignmentId}/submissions/by-status`  
**Access:** Teacher Only  
**Description:** Retrieves submissions filtered by status.

**Path Parameters:**

- `assignmentId`: number

**Query Parameters:**

- `status`: SubmissionStatus ("DRAFT" | "SUBMITTED" | "GRADED" | "RETURNED" | "LATE")

**Response:** `SubmissionResponse[]`

**Frontend Service Method:** `assignmentService.getSubmissionsByStatus(assignmentId, status)`

---

#### 67. Get Late Submissions by Student

**Endpoint:** `GET /api/v1/students/{studentId}/late-submissions`  
**Access:** Teacher Only  
**Description:** Retrieves all late submissions for a specific student across all assignments.

**Path Parameters:**

- `studentId`: number

**Response:** `SubmissionResponse[]`

**Frontend Service Method:** `assignmentService.getLateSubmissionsByStudent(studentId)`

---

#### 68. Get Best Submission

**Endpoint:** `GET /api/v1/assignments/{assignmentId}/students/{studentId}/best-submission`  
**Access:** Student or Teacher  
**Description:** Retrieves the best scoring submission for a student on a specific assignment.

**Path Parameters:**

- `assignmentId`: number
- `studentId`: number

**Response:** `SubmissionResponse`

**Frontend Service Method:** `assignmentService.getBestSubmission(assignmentId, studentId)`

---

#### 69. Regrade Submission

**Endpoint:** `POST /api/v1/submissions/{id}/regrade`  
**Access:** Teacher Only  
**Description:** Regrades a previously graded submission with a new score and optional feedback.

**Path Parameters:**

- `id`: number (Submission ID)

**Query Parameters:**

- `score`: number
- `feedback?`: string (Optional)

**Response:** `SubmissionResponse`

**Frontend Service Method:** `assignmentService.regradeSubmission(id, score, feedback)`

---

#### 70. Get Passing Rate

**Endpoint:** `GET /api/v1/assignments/{assignmentId}/passing-rate`  
**Access:** Teacher Only  
**Description:** Returns the percentage of students who passed the assignment.

**Path Parameters:**

- `assignmentId`: number

**Response:**

```typescript
{
  passingRate: number;
}
```

**Frontend Service Method:** `assignmentService.getPassingRate(assignmentId)`

---

#### 71. Export Submissions

**Endpoint:** `GET /api/v1/assignments/{assignmentId}/submissions/export`  
**Access:** Teacher Only  
**Description:** Exports all submissions for an assignment (useful for downloading grades).

**Path Parameters:**

- `assignmentId`: number

**Response:** `SubmissionResponse[]`

**Frontend Service Method:** `assignmentService.exportSubmissions(assignmentId)`

---

### Submission File Management

#### 72. Get Submission Files

**Endpoint:** `GET /api/v1/submissions/{submissionId}/files`  
**Access:** Student or Teacher  
**Description:** Retrieves all files attached to a submission.

**Path Parameters:**

- `submissionId`: number

**Response:** `SubmissionFileResponse[]`

**Frontend Service Method:** `assignmentService.getSubmissionFiles(submissionId)`

---

#### 73. Get File Download URL

**Endpoint:** `GET /api/v1/submissions/{submissionId}/files/{fileId}/download`  
**Access:** Student or Teacher  
**Description:** Gets a download URL for a specific submission file.

**Path Parameters:**

- `submissionId`: number
- `fileId`: number

**Response:**

```typescript
{
  downloadUrl: string;
}
```

**Frontend Service Method:** `assignmentService.getFileDownloadUrl(submissionId, fileId)`

---

#### 74. Get File Count

**Endpoint:** `GET /api/v1/submissions/{submissionId}/files/count`  
**Access:** Student or Teacher  
**Description:** Returns the number of files attached to a submission.

**Path Parameters:**

- `submissionId`: number

**Response:**

```typescript
{
  count: number;
}
```

**Frontend Service Method:** `assignmentService.getFileCount(submissionId)`

---

## UI Implementation Guidelines

### Quiz Management UI

1. **Quiz Library Page**

   - Use endpoint #2 to display all independent quizzes
   - Provide search/filter functionality
   - Show quiz status (DRAFT, PUBLISHED, ARCHIVED)
   - Enable quick actions: Edit, Delete, Clone, Link to Lesson

2. **Create/Edit Quiz Form**

   - Use endpoint #1 for creation, #8 for updates
   - Include all quiz configuration options (time limit, passing score, etc.)
   - Provide question management interface
   - Use endpoints #10, #11, #17, #18 for question operations

3. **Quiz Results Dashboard**
   - Use endpoint #42 for detailed attempt results
   - Use endpoint #43 for statistical overview
   - Display charts for score distribution, passing rates, etc.
   - Enable filtering by student, date range, attempt number

### Question Bank UI

1. **Question Bank Library**

   - Use endpoint #39 to list all banks
   - Use endpoint #40 for search functionality
   - Show question count per bank (endpoint #31)
   - Enable cloning between teachers (endpoint #41)

2. **Question Management Interface**
   - Use endpoint #21 to list questions in a bank
   - Use endpoints #26, #27 for filtering
   - Show question usage status (endpoints #32, #33)
   - Bulk operations support (endpoint #29)

### Assignment Management UI

1. **Assignment Library Page**

   - Use endpoint #45 to display all independent assignments
   - Show assignment status and metadata
   - Enable quick actions: Edit, Delete, Clone, Link to Lesson

2. **Grading Interface**

   - Use endpoint #53 to list all submissions
   - Use endpoint #56 for late submissions view
   - Use endpoint #57 for pending grading queue
   - Implement bulk grading using endpoint #64
   - Display submission files using endpoints #72, #73

3. **Assignment Analytics Dashboard**
   - Use endpoint #54 for statistical overview
   - Use endpoint #70 for passing rate
   - Display submission timeline
   - Show grade distribution charts

### Best Practices

1. **Loading States**: Always show loading indicators when fetching data
2. **Error Handling**: Display user-friendly error messages
3. **Confirmation Dialogs**: Require confirmation for destructive actions (delete, bulk operations)
4. **Pagination**: Implement pagination for large lists (submissions, quizzes)
5. **Real-time Updates**: Consider using WebSockets for real-time submission notifications
6. **Accessibility**: Ensure all teacher interfaces are keyboard navigable and screen reader friendly

---

## Related Documentation

- [API Inventory](./API_INVENTORY.md) - Complete list of all system APIs
- [Endpoint to Contract Map](./ENDPOINT_TO_CONTRACT_MAP.md) - Detailed API contracts
- [Frontend Services](../frontend/src/services/) - Frontend service implementations

---

**Last Updated:** January 12, 2026  
**Version:** 1.0
