// Generic API response
export interface ApiResponse<T> {
  success: boolean;
  status: number;
  message?: string;
  code?: string;
  data?: T|null;
  timestamp?: string;
  meta?: ApiMeta;
}

export interface ApiMeta {
  author?: string;
  license?: string;
  version?: string;
}

export interface PageResponse<T> {
  items: T[];
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}


export interface SpringPage<T> {
  content: T[];
   page: number;
  size: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}