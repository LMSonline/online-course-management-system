-- Migration: Add quiz_question_id to quiz_attempt_answers table
-- Purpose: Link answers to QuizQuestion for accurate grading with custom points
-- Date: 2026-01-13

-- Add quiz_question_id column (nullable to support existing data)
ALTER TABLE quiz_attempt_answers
ADD COLUMN quiz_question_id BIGINT NULL;

-- Add foreign key constraint
ALTER TABLE quiz_attempt_answers
ADD CONSTRAINT fk_quiz_attempt_answer_quiz_question
FOREIGN KEY (quiz_question_id) REFERENCES quiz_questions(id) ON DELETE SET NULL;

-- Add index for performance
CREATE INDEX idx_quiz_attempt_answers_quiz_question_id
ON quiz_attempt_answers(quiz_question_id);

-- Optional: Backfill existing data
-- This will set quiz_question_id for existing answers by matching question_id
-- Note: This assumes quiz_attempt -> quiz relationship and quiz_questions exist

UPDATE quiz_attempt_answers qaa
SET quiz_question_id = (
    SELECT qq.id
    FROM quiz_questions qq
    INNER JOIN quiz_attempts qa ON qa.quiz_id = qq.quiz_id
    WHERE qa.id = qaa.quiz_attempt_id
      AND qq.question_id = qaa.question_id
    LIMIT 1
)
WHERE quiz_question_id IS NULL
  AND quiz_attempt_id IS NOT NULL
  AND question_id IS NOT NULL;

-- Verify the migration
SELECT
    COUNT(*) as total_answers,
    COUNT(quiz_question_id) as answers_with_quiz_question,
    COUNT(*) - COUNT(quiz_question_id) as answers_without_quiz_question
FROM quiz_attempt_answers;

