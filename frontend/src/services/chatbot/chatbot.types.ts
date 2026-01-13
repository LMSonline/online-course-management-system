export interface ChatSendRequest {
  text: string;
  session_id?: string;
  user_id?: string;
  current_course_id?: string;
  language?: string;
  lesson_id?: string;
}

export interface ChatSendResponse {
  reply: string;
  session_id: string;
}

