import { z } from "zod";
import { AssignmentType } from "@/services/assignment/assignment.types";

/**
 * Zod Schema for Assignment Request
 * Strictly maps to AssignmentRequest interface
 */
export const assignmentRequestSchema = z
  .object({
    title: z
      .string()
      .min(1, "Title is required")
      .max(200, "Title must be less than 200 characters"),

    assignmentType: z.enum(["PRACTICE", "HOMEWORK", "PROJECT", "FINAL_REPORT"]),

    description: z
      .string()
      .max(5000, "Description must be less than 5000 characters")
      .nullable()
      .optional(),

    totalPoints: z
      .number()
      .min(0, "Points must be at least 0")
      .max(1000, "Points must be less than 1000")
      .nullable()
      .optional(),

    timeLimitMinutes: z
      .number()
      .min(1, "Time limit must be at least 1 minute")
      .max(10080, "Time limit must be less than 7 days")
      .nullable()
      .optional(),

    maxAttempts: z
      .number()
      .min(1, "At least 1 attempt is required")
      .max(100, "Max attempts cannot exceed 100")
      .nullable()
      .optional(),

    startDate: z
      .string()
      .datetime({ message: "Invalid date format. Expected ISO 8601 format." })
      .nullable()
      .optional(),

    dueDate: z
      .string()
      .datetime({ message: "Invalid date format. Expected ISO 8601 format." })
      .nullable()
      .optional(),
  })
  .refine(
    (data) => {
      if (data.startDate) {
        return new Date(data.startDate) > new Date();
      }
      return true;
    },
    {
      message: "Start date must be in the future",
      path: ["startDate"],
    }
  )
  .refine(
    (data) => {
      if (data.dueDate) {
        return new Date(data.dueDate) > new Date();
      }
      return true;
    },
    {
      message: "Due date must be in the future",
      path: ["dueDate"],
    }
  )
  .refine(
    (data) => {
      if (data.startDate && data.dueDate) {
        return new Date(data.dueDate) > new Date(data.startDate);
      }
      return true;
    },
    {
      message: "Due date must be after start date",
      path: ["dueDate"],
    }
  );

/**
 * Zod Schema for Grading Submission
 * Strictly maps to GradeSubmissionRequest interface
 */
export const gradeSubmissionSchema = z.object({
  grade: z
    .number()
    .min(0, "Grade must be at least 0")
    .max(10, "Grade must be between 0 and 10"),

  feedback: z
    .string()
    .max(2000, "Feedback must be less than 2000 characters")
    .nullable()
    .optional(),
});

/**
 * Zod Schema for Feedback Only (without grading)
 * Strictly maps to FeedbackSubmissionRequest interface
 */
export const feedbackSubmissionSchema = z.object({
  feedback: z
    .string()
    .min(1, "Feedback is required")
    .max(2000, "Feedback must be less than 2000 characters"),
});

/**
 * Form Schema for Assignment (with coercion for form inputs)
 * This handles string-to-number conversion from form inputs
 */
export const assignmentFormSchema = z
  .object({
    title: z
      .string()
      .min(1, "Title is required")
      .max(200, "Title must be less than 200 characters"),

    assignmentType: z.enum(["PRACTICE", "HOMEWORK", "PROJECT", "FINAL_REPORT"]),

    description: z
      .string()
      .max(5000, "Description must be less than 5000 characters")
      .optional()
      .or(z.literal("")),

    totalPoints: z
      .string()
      .transform((val) => (val === "" ? null : Number(val)))
      .refine(
        (val) => val === null || (!isNaN(val) && val >= 0 && val <= 1000),
        {
          message: "Points must be between 0 and 1000",
        }
      )
      .nullable()
      .optional(),

    timeLimitMinutes: z
      .string()
      .transform((val) => (val === "" ? null : Number(val)))
      .refine(
        (val) => val === null || (!isNaN(val) && val >= 1 && val <= 10080),
        {
          message: "Time limit must be between 1 minute and 7 days",
        }
      )
      .nullable()
      .optional(),

    maxAttempts: z
      .string()
      .transform((val) => (val === "" ? null : Number(val)))
      .refine(
        (val) => val === null || (!isNaN(val) && val >= 1 && val <= 100),
        {
          message: "Max attempts must be between 1 and 100",
        }
      )
      .nullable()
      .optional(),

    startDate: z.date().nullable().optional(),

    dueDate: z.date().nullable().optional(),
  })
  .refine(
    (data) => {
      if (data.startDate) {
        return data.startDate > new Date();
      }
      return true;
    },
    {
      message: "Start date must be in the future",
      path: ["startDate"],
    }
  )
  .refine(
    (data) => {
      if (data.dueDate) {
        return data.dueDate > new Date();
      }
      return true;
    },
    {
      message: "Due date must be in the future",
      path: ["dueDate"],
    }
  )
  .refine(
    (data) => {
      if (data.startDate && data.dueDate) {
        return data.dueDate > data.startDate;
      }
      return true;
    },
    {
      message: "Due date must be after start date",
      path: ["dueDate"],
    }
  );

/**
 * Type inference from schemas
 */
export type AssignmentFormValues = z.infer<typeof assignmentFormSchema>;
export type GradeSubmissionValues = z.infer<typeof gradeSubmissionSchema>;
export type FeedbackSubmissionValues = z.infer<typeof feedbackSubmissionSchema>;

/**
 * Helper function to convert form values to API request
 * Handles Date to ISO string conversion
 */
export function assignmentFormToRequest(
  formValues: AssignmentFormValues
): z.infer<typeof assignmentRequestSchema> {
  return {
    title: formValues.title,
    assignmentType: formValues.assignmentType,
    description: formValues.description || null,
    totalPoints:
      typeof formValues.totalPoints === "number"
        ? formValues.totalPoints
        : null,
    timeLimitMinutes:
      typeof formValues.timeLimitMinutes === "number"
        ? formValues.timeLimitMinutes
        : null,
    maxAttempts:
      typeof formValues.maxAttempts === "number"
        ? formValues.maxAttempts
        : null,
    startDate: formValues.startDate ? formValues.startDate.toISOString() : null,
    dueDate: formValues.dueDate ? formValues.dueDate.toISOString() : null,
  };
}

/**
 * Helper function to convert API response to form values
 * Handles ISO string to Date conversion
 */
export function assignmentResponseToForm(
  response: any
): Partial<AssignmentFormValues> {
  return {
    title: response.title,
    assignmentType: response.assignmentType,
    description: response.description || "",
    totalPoints: response.totalPoints?.toString() || "",
    timeLimitMinutes: response.timeLimitMinutes?.toString() || "",
    maxAttempts: response.maxAttempts?.toString() || "",
    startDate: response.startDate ? new Date(response.startDate) : null,
    dueDate: response.dueDate ? new Date(response.dueDate) : null,
  };
}
