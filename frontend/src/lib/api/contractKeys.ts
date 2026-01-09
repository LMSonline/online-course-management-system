/**
 * Contract Keys - Source of truth from ENDPOINT_TO_CONTRACT_MAP.md
 * 
 * DO NOT modify without updating backend/lms/docs/ENDPOINT_TO_CONTRACT_MAP.md
 * 
 * Generated: 2025-01-XX
 * Last Updated: 2025-12-25 (from backend docs)
 */

export const CONTRACT_KEYS = {
  // ============================================
  // AUTH - Authentication
  // ============================================
  AUTH_LOGIN: 'AUTH_LOGIN',
  AUTH_REGISTER: 'AUTH_REGISTER',
  AUTH_REFRESH: 'AUTH_REFRESH',
  AUTH_LOGOUT: 'AUTH_LOGOUT',
  AUTH_ME: 'AUTH_ME',

  // ============================================
  // ACCOUNT - Account management
  // ============================================
  ACCOUNT_GET_PROFILE: 'ACCOUNT_GET_PROFILE',
  ACCOUNT_UPDATE_PROFILE: 'ACCOUNT_UPDATE_PROFILE',
  ACCOUNT_UPLOAD_AVATAR: 'ACCOUNT_UPLOAD_AVATAR',

  // ============================================
  // STUDENT - Student operations
  // ============================================
  STUDENT_GET_ME: 'STUDENT_GET_ME',
  STUDENT_GET_BY_ID: 'STUDENT_GET_BY_ID',
  STUDENT_GET_COURSES: 'STUDENT_GET_COURSES',

  // ============================================
  // TEACHER - Teacher operations
  // ============================================
  TEACHER_GET_ME: 'TEACHER_GET_ME',
  TEACHER_GET_BY_ID: 'TEACHER_GET_BY_ID',
  TEACHER_GET_COURSES: 'TEACHER_GET_COURSES',
  TEACHER_GET_STATS: 'TEACHER_GET_STATS',
  TEACHER_GET_REVENUE: 'TEACHER_GET_REVENUE',

  // ============================================
  // COURSE - Course management
  // ============================================
  COURSE_CREATE: 'COURSE_CREATE',
  COURSE_GET_DETAIL: 'COURSE_GET_DETAIL',
  COURSE_GET_LIST: 'COURSE_GET_LIST',
  COURSE_UPDATE: 'COURSE_UPDATE',
  COURSE_DELETE: 'COURSE_DELETE',
  COURSE_OPEN_ACTION: 'COURSE_OPEN_ACTION',
  COURSE_CLOSE_ACTION: 'COURSE_CLOSE_ACTION',

  // ============================================
  // CATEGORY - Category management
  // ============================================
  CATEGORY_GET_TREE: 'CATEGORY_GET_TREE',
  CATEGORY_GET_BY_SLUG: 'CATEGORY_GET_BY_SLUG',
  CATEGORY_GET_BY_ID: 'CATEGORY_GET_BY_ID',
  CATEGORY_CREATE: 'CATEGORY_CREATE',
  CATEGORY_UPDATE: 'CATEGORY_UPDATE',
  CATEGORY_DELETE: 'CATEGORY_DELETE',

  // ============================================
  // ENROLLMENT - Enrollment management
  // ============================================
  ENROLLMENT_CREATE: 'ENROLLMENT_CREATE',
  ENROLLMENT_GET_STUDENT_LIST: 'ENROLLMENT_GET_STUDENT_LIST',
  ENROLLMENT_GET_COURSE_LIST: 'ENROLLMENT_GET_COURSE_LIST',
  ENROLLMENT_GET_DETAIL: 'ENROLLMENT_GET_DETAIL',
  ENROLLMENT_CANCEL_ACTION: 'ENROLLMENT_CANCEL_ACTION',

  // ============================================
  // PROGRESS - Progress tracking
  // ============================================
  PROGRESS_GET_STUDENT_OVERVIEW: 'PROGRESS_GET_STUDENT_OVERVIEW',
  PROGRESS_GET_COURSE: 'PROGRESS_GET_COURSE',
  PROGRESS_MARK_VIEWED_ACTION: 'PROGRESS_MARK_VIEWED_ACTION',
  PROGRESS_MARK_COMPLETED_ACTION: 'PROGRESS_MARK_COMPLETED_ACTION',

  // ============================================
  // REVIEW - Course reviews
  // ============================================
  REVIEW_CREATE: 'REVIEW_CREATE',
  REVIEW_GET_COURSE_LIST: 'REVIEW_GET_COURSE_LIST',
  REVIEW_UPDATE: 'REVIEW_UPDATE',
  REVIEW_DELETE: 'REVIEW_DELETE',
  REVIEW_GET_RATING_SUMMARY: 'REVIEW_GET_RATING_SUMMARY',

  // ============================================
  // RECOMMENDATION - Recommendations
  // ============================================
  RECOMMENDATION_GET: 'RECOMMENDATION_GET',
  RECOMMENDATION_SUBMIT_FEEDBACK_ACTION: 'RECOMMENDATION_SUBMIT_FEEDBACK_ACTION',

  // ============================================
  // COMMENT - Comments
  // ============================================
  COMMENT_CREATE_COURSE: 'COMMENT_CREATE_COURSE',
  COMMENT_CREATE_LESSON: 'COMMENT_CREATE_LESSON',
  COMMENT_GET_COURSE_LIST: 'COMMENT_GET_COURSE_LIST',
  COMMENT_GET_LESSON_LIST: 'COMMENT_GET_LESSON_LIST',
  COMMENT_UPDATE: 'COMMENT_UPDATE',
  COMMENT_DELETE: 'COMMENT_DELETE',

  // ============================================
  // NOTIFICATION - Notifications
  // ============================================
  NOTIFICATION_GET_LIST: 'NOTIFICATION_GET_LIST',
  NOTIFICATION_GET_UNREAD_COUNT: 'NOTIFICATION_GET_UNREAD_COUNT',
  NOTIFICATION_MARK_READ_ACTION: 'NOTIFICATION_MARK_READ_ACTION',
  NOTIFICATION_MARK_ALL_READ_ACTION: 'NOTIFICATION_MARK_ALL_READ_ACTION',
  NOTIFICATION_DELETE: 'NOTIFICATION_DELETE',

  // ============================================
  // QUIZ - Quizzes/Assessments
  // ============================================
  QUIZ_CREATE: 'QUIZ_CREATE',
  QUIZ_GET_BY_LESSON: 'QUIZ_GET_BY_LESSON',
  QUIZ_GET_BY_ID: 'QUIZ_GET_BY_ID',
  QUIZ_UPDATE: 'QUIZ_UPDATE',
  QUIZ_DELETE: 'QUIZ_DELETE',
  QUIZ_START_ACTION: 'QUIZ_START_ACTION',
  QUIZ_SUBMIT_ANSWER_ACTION: 'QUIZ_SUBMIT_ANSWER_ACTION',
  QUIZ_FINISH_ACTION: 'QUIZ_FINISH_ACTION',

  // ============================================
  // ASSIGNMENT - Assignments
  // ============================================
  ASSIGNMENT_CREATE: 'ASSIGNMENT_CREATE',
  ASSIGNMENT_GET_BY_LESSON: 'ASSIGNMENT_GET_BY_LESSON',
  ASSIGNMENT_GET_BY_ID: 'ASSIGNMENT_GET_BY_ID',
  ASSIGNMENT_UPDATE: 'ASSIGNMENT_UPDATE',
  ASSIGNMENT_DELETE: 'ASSIGNMENT_DELETE',

  // ============================================
  // SUBMISSION - Submissions
  // ============================================
  SUBMISSION_CREATE: 'SUBMISSION_CREATE',
  SUBMISSION_GET_BY_ASSIGNMENT: 'SUBMISSION_GET_BY_ASSIGNMENT',
  SUBMISSION_GET_BY_ID: 'SUBMISSION_GET_BY_ID',
  SUBMISSION_GRADE_ACTION: 'SUBMISSION_GRADE_ACTION',
  SUBMISSION_FEEDBACK_ACTION: 'SUBMISSION_FEEDBACK_ACTION',

  // ============================================
  // CHAPTER - Course chapters
  // ============================================
  CHAPTER_CREATE: 'CHAPTER_CREATE',
  CHAPTER_GET_LIST: 'CHAPTER_GET_LIST',
  CHAPTER_GET_DETAIL: 'CHAPTER_GET_DETAIL',
  CHAPTER_UPDATE: 'CHAPTER_UPDATE',
  CHAPTER_DELETE: 'CHAPTER_DELETE',
  CHAPTER_REORDER_ACTION: 'CHAPTER_REORDER_ACTION',

  // ============================================
  // LESSON - Lessons
  // ============================================
  LESSON_CREATE: 'LESSON_CREATE',
  LESSON_GET_BY_CHAPTER: 'LESSON_GET_BY_CHAPTER',
  LESSON_GET_BY_ID: 'LESSON_GET_BY_ID',
  LESSON_UPDATE: 'LESSON_UPDATE',
  LESSON_DELETE: 'LESSON_DELETE',
  LESSON_GET_VIDEO_UPLOAD_URL: 'LESSON_GET_VIDEO_UPLOAD_URL',
  LESSON_VIDEO_UPLOAD_COMPLETE_ACTION: 'LESSON_VIDEO_UPLOAD_COMPLETE_ACTION',
  LESSON_GET_VIDEO_STREAM_URL: 'LESSON_GET_VIDEO_STREAM_URL',

  // ============================================
  // RESOURCE - Lesson resources
  // ============================================
  RESOURCE_CREATE_LINK: 'RESOURCE_CREATE_LINK',
  RESOURCE_CREATE_FILE: 'RESOURCE_CREATE_FILE',
  RESOURCE_GET_BY_LESSON: 'RESOURCE_GET_BY_LESSON',
  RESOURCE_GET_BY_ID: 'RESOURCE_GET_BY_ID',
  RESOURCE_UPDATE: 'RESOURCE_UPDATE',
  RESOURCE_DELETE: 'RESOURCE_DELETE',

  // ============================================
  // FILE - File storage
  // ============================================
  FILE_UPLOAD: 'FILE_UPLOAD',
  FILE_GET_BY_ID: 'FILE_GET_BY_ID',
  FILE_GET_DOWNLOAD_URL: 'FILE_GET_DOWNLOAD_URL',
  FILE_DELETE: 'FILE_DELETE',

  // ============================================
  // TAG - Course tags
  // ============================================
  TAG_CREATE: 'TAG_CREATE',
  TAG_GET_LIST: 'TAG_GET_LIST',
  TAG_UPDATE: 'TAG_UPDATE',
  TAG_DELETE: 'TAG_DELETE',

  // ============================================
  // VERSION - Course versions
  // ============================================
  VERSION_CREATE: 'VERSION_CREATE',
  VERSION_GET_LIST: 'VERSION_GET_LIST',
  VERSION_GET_DETAIL: 'VERSION_GET_DETAIL',
  VERSION_SUBMIT_APPROVAL_ACTION: 'VERSION_SUBMIT_APPROVAL_ACTION',
  VERSION_APPROVE_ACTION: 'VERSION_APPROVE_ACTION',
  VERSION_REJECT_ACTION: 'VERSION_REJECT_ACTION',
  VERSION_PUBLISH_ACTION: 'VERSION_PUBLISH_ACTION',

  // ============================================
  // ADMIN - Admin operations
  // ============================================
  ADMIN_GET_USERS: 'ADMIN_GET_USERS',
  ADMIN_GET_USER_STATS: 'ADMIN_GET_USER_STATS',
  ADMIN_EXPORT_USERS_ACTION: 'ADMIN_EXPORT_USERS_ACTION',
  ADMIN_GET_DASHBOARD: 'ADMIN_GET_DASHBOARD',
  ADMIN_GET_STATISTICS: 'ADMIN_GET_STATISTICS',
  ADMIN_GET_REVENUE_REPORT: 'ADMIN_GET_REVENUE_REPORT',
  ADMIN_GET_AUDIT_LOGS: 'ADMIN_GET_AUDIT_LOGS',
  ADMIN_SEARCH_AUDIT_LOGS: 'ADMIN_SEARCH_AUDIT_LOGS',
  ADMIN_EXPORT_AUDIT_LOGS_ACTION: 'ADMIN_EXPORT_AUDIT_LOGS_ACTION',
  ADMIN_GET_SETTINGS: 'ADMIN_GET_SETTINGS',
  ADMIN_CREATE_SETTING: 'ADMIN_CREATE_SETTING',
  ADMIN_UPDATE_SETTING: 'ADMIN_UPDATE_SETTING',
  ADMIN_DELETE_SETTING: 'ADMIN_DELETE_SETTING',

  // ============================================
  // REPORT - Violation reports
  // ============================================
  REPORT_CREATE: 'REPORT_CREATE',
  REPORT_GET_MY_LIST: 'REPORT_GET_MY_LIST',
  REPORT_GET_ALL_LIST: 'REPORT_GET_ALL_LIST',
  REPORT_GET_DETAIL: 'REPORT_GET_DETAIL',
} as const;

export type ContractKey = typeof CONTRACT_KEYS[keyof typeof CONTRACT_KEYS];

/**
 * Helper to get contract key by domain and action
 * Example: getContractKey('COURSE', 'GET_LIST') => 'COURSE_GET_LIST'
 */
export function getContractKey(
  domain: string,
  verb: string,
  resource: string,
  suffix?: string
): ContractKey {
  const key = suffix
    ? `${domain}_${verb}_${resource}_${suffix}`
    : `${domain}_${verb}_${resource}`;
  
  const contractKey = Object.values(CONTRACT_KEYS).find(k => k === key);
  if (!contractKey) {
    throw new Error(`Contract key not found: ${key}`);
  }
  return contractKey;
}

