// ============== Request DTOs ==============

/** Backend: ChapterRequest */
export interface ChapterRequest {
  title: string;
}

/** Backend: ChapterReorderRequest */
export interface ChapterReorderRequest {
  chapterIds: number[];
}

// ============== Response DTOs ==============

/** Backend: ChapterDto */
export interface ChapterResponse {
  id: number;
  title: string;
  orderIndex: number;
}
