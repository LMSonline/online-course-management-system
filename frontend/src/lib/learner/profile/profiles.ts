// Type definitions for learner profile APIs
// Chuẩn hóa tuyệt đối theo backend

export interface StudentProfile {
  id: number;
  username: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  phone?: string;
  birthday?: string;
  gender?: 'male' | 'female' | 'other';
  address?: string;
  joinedAt: string;
  status: 'active' | 'inactive' | 'banned';
}

export interface StudentProfileResponse {
  profile: StudentProfile;
}
