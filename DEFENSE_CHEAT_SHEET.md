# CHEAT SHEET - Bảo Vệ Đồ Án Online Course Management System

## I. Chatbot Service – Kiến thức em cần nắm

### 1. High-level Summary

**Chatbot Service làm gì:**
- Trả lời câu hỏi về nội dung khóa học sử dụng RAG (Retrieval-Augmented Generation)
- Hỗ trợ nhiều intent khác nhau: Course Q&A, Generate Quiz, Summarize Lesson, Explain Code, Study Plan, Recommend Course
- Tích hợp với Recommendation Service để gợi ý khóa học qua chat
- Lưu trữ lịch sử conversation trong PostgreSQL
- Cung cấp analytics về usage patterns

**Các intent đã implement:**
1. **ASK_COURSE_QA** - Hỏi đáp về nội dung khóa học (RAG)
2. **ASK_GENERAL_QA** - Câu hỏi chung (không cần RAG)
3. **ASK_GENERATE_QUIZ** - Tạo câu hỏi trắc nghiệm
4. **ASK_SUMMARY** - Tóm tắt bài học
5. **ASK_EXPLAIN_CODE** - Giải thích code
6. **ASK_STUDY_PLAN** - Tạo kế hoạch học tập (có V2 với constraints)
7. **ASK_RECOMMEND** - Gợi ý khóa học (tích hợp với Recommendation Service)

### 2. Architecture & Components

**Main modules/classes:**
- **ChatService** - Orchestrator chính, điều phối intent detection và routing
- **NLUService** - Intent detection (hiện tại dùng keyword matching, TODO: fine-tuned classifier)
- **HandlerRegistry** - Registry pattern để map intent → handler
- **IntentHandler** (abstract base) - Strategy pattern cho các handlers
- **RetrievalService** - Hybrid search (vector + BM25)
- **VectorStore** (abstract) - Abstraction cho vector store backends
  - Implementations: `InMemoryVectorStore`, `FaissVectorStore`
- **LLMClient** (abstract) - Abstraction cho LLM providers
  - Implementations: `DummyLLMClient`, `Llama3Client`
- **IngestionService** - Orchestrates loading, chunking, embedding
- **AnalyticsService** - Thống kê sessions, messages, intents
- **ContextManager** - Quản lý sessions và messages trong DB

**Design patterns được sử dụng:**
- **Strategy Pattern**: IntentHandler implementations (mỗi intent có handler riêng)
- **Factory Pattern**: HandlerRegistry tạo handlers
- **Adapter Pattern**: LLMClient abstraction (Dummy/Llama3)
- **Repository Pattern**: ChatSessionRepository, ChatMessageRepository
- **Facade Pattern**: ChatService che giấu complexity của các components

### 3. APIs

| Method | Path | Description | Request Fields | Response Fields |
|--------|------|-------------|----------------|-----------------|
| POST | `/api/v1/chat/messages` | Gửi message, nhận reply | `session_id`, `user_id`, `text`, `current_course_id`, `debug`, `language`, `lesson_id`, `exam_date`, `free_days_per_week`, `completed_lessons`, `top_k`, `score_threshold` | `reply`, `debug` (nếu debug=true) |
| GET | `/api/v1/chat/sessions` | List sessions của user | `user_id` (query), `limit` | List of `SessionResponse` |
| GET | `/api/v1/chat/sessions/{session_id}` | Chi tiết session + messages | `session_id` (path) | `SessionDetailResponse` (session + messages) |
| GET | `/api/v1/chat/stats/user/{user_id}` | Thống kê user | `user_id` (path) | `num_sessions`, `num_messages`, `intent_distribution` |
| GET | `/api/v1/chat/stats/global` | Thống kê toàn hệ thống | - | `total_sessions`, `total_messages`, `top_intents`, `most_asked_courses`, `time_series` |
| GET | `/api/v1/chat/sessions/search` | Tìm kiếm sessions | `user_id`, `q` (query), `limit` | List of `SessionSearchResult` |
| POST | `/api/v1/admin/courses/{course_id}/reindex` | Re-index course content | `course_id` (path) | `course_id`, `chunks_ingested`, `status` |
| GET | `/api/v1/admin/courses/{course_id}/chunks` | List chunks của course | `course_id` (path) | `course_id`, `total_chunks`, `chunks[]` |
| DELETE | `/api/v1/admin/courses/{course_id}/chunks` | Xóa chunks của course | `course_id` (path) | `course_id`, `deleted_count`, `status` |
| GET | `/health` | Health check | - | `status`, `service` |

### 4. Data & Ingestion

**Data sources được hỗ trợ:**
1. **LMS Database** - Load từ PostgreSQL (courses, lessons, chapters)
2. **Markdown** - `.md`, `.markdown` files
3. **HTML** - `.html`, `.htm` files
4. **PDF** - `.pdf` files
5. **Transcripts** - `.srt`, `.vtt`, `.txt` (video transcripts)
6. **JSONL** - `data/course_videos.jsonl` (video course data)

**Ingestion pipeline:**
1. **Loader** - Chọn loader phù hợp dựa trên source (Factory pattern)
2. **Chunker** - Chia nhỏ content:
   - `FixedSizeChunker` - Chia theo kích thước cố định (chunk_size, chunk_overlap)
   - `SemanticChunker` - Chia theo headings/sections (tốt cho Markdown/HTML)
3. **Embedding** - Generate embeddings bằng `EmbeddingModel` (all-MiniLM-L6-v2)
4. **Storage** - Lưu vào VectorStore (FAISS hoặc InMemory)

**JSONL Dataset Schema (`data/course_videos.jsonl`):**
```json
{
  "id": "video_001",
  "course_id": "course_python_basic",
  "course_title": "Python Basics",
  "lesson_id": "lesson_001",
  "lesson_title": "Introduction to Python",
  "video_id": "video_001",
  "video_title": "What is Python?",
  "video_url": "https://...",
  "language": "en",
  "difficulty": "BEGINNER",
  "duration_sec": 600,
  "content_type": "video_transcript",
  "text": "Welcome to Python Basics!...",  // Main content for RAG
  "tags": ["python", "programming", "beginner"],
  "skills": ["programming", "coding", "logic"],
  "topics": ["programming-languages", "syntax", "basics"],
  "source": "lms_db",
  "created_at": "2024-01-15T10:00:00Z",
  "updated_at": "2024-01-15T10:00:00Z"
}
```

**CLI commands:**
- `python -m app.cli ingest-lms [course_id]` - Ingest từ LMS DB
- `python -m app.cli ingest-folder --path <path> --course-id <id>` - Ingest từ files/folders
- `python -m app.cli eval-rag` - Evaluate RAG retrieval quality
- `python -m app.cli show-config` - Show configuration

### 5. RAG & LLM Integration

**Retrieval process:**
1. **Vector Search** - Tìm top-k chunks bằng cosine similarity trên embeddings
2. **BM25** (optional) - Keyword-based search trên text
3. **Hybrid** - Kết hợp vector + BM25 với weight `HYBRID_ALPHA` (default 0.6)
4. **Filtering** - Filter theo `course_id`, `lesson_id`, `section` nếu có
5. **Score threshold** - Lọc chunks có score thấp

**LLM Integration:**
- **Abstraction**: `LLMClient` interface
- **Providers**:
  - `DummyLLMClient` - Echo prompt (default, không cần API key)
  - `Llama3Client` - Gọi Llama3 API (Groq, Fireworks, etc.) - cần API key
- **Fallback mechanism**: Nếu primary LLM fail → fallback về DummyLLMClient
- **Configuration**: `LLM_PROVIDER` env var (dummy/llama3)

**Intent → Handler mapping:**
- `NLUService.detect_intent()` - Keyword matching (TODO: fine-tuned classifier)
- `HandlerRegistry.get_handler()` - Map intent → handler instance
- Mỗi handler implement `IntentHandler.handle()` method

### 6. Config & Runtime

**Port:** `8003` (default)

**Environment variables:**
- `ENV` - Environment (dev/test/prod)
- `CHAT_DB_*` / `LMS_DB_*` - Database connection
- `LLM_PROVIDER` - dummy | llama3
- `LLAMA3_API_BASE`, `LLAMA3_API_KEY`, `LLAMA3_MODEL_NAME` - Nếu dùng llama3
- `VECTOR_STORE_BACKEND` - inmemory | faiss
- `VECTOR_STORE_DIR` - Path cho FAISS persistence
- `SEARCH_MODE` - vector | bm25 | hybrid
- `HYBRID_ALPHA` - Weight cho vector vs BM25 (0.6 default)
- `CHUNK_SIZE`, `CHUNK_OVERLAP` - Chunking parameters
- `RS_BASE_URL` - Recommendation Service URL

**Settings class:** `app.core.settings.Settings` (pydantic-settings)
- Support `.env.dev`, `.env.test`, `.env.prod` files
- Auto-select based on `ENV` variable

---

## II. Recommendation Service – Kiến thức em cần nắm

### 1. High-level Summary

**Recommendation Service làm gì:**
- Gợi ý khóa học cá nhân hóa cho người dùng
- Sử dụng nhiều thuật toán: Two-Tower (deep learning), Popularity-based, Content-based, Hybrid
- Hỗ trợ online learning với epsilon-greedy bandit để tự động chọn strategy tốt nhất
- Tracking interactions (views, clicks, enrolls) để cải thiện recommendations
- Cung cấp analytics về CTR, strategy distribution, popular courses

**Recommendations cho:**
- Trang Home (`/recommendations/home`) - Top-k courses cho user
- Similar courses (`/recommendations/similar/{course_id}`) - Khóa học tương tự

**Tích hợp với Chatbot Service:**
- Chatbot có thể gọi Recommendation Service qua `RecommendHandler`
- User có thể hỏi "gợi ý khóa học" trong chat

### 2. Recommender Algorithms Implemented

**BaseRecommender** (abstract base class):
- Interface: `get_home_recommendations()`, `get_similar_courses()`

**Implementations:**

1. **TwoTowerRecommender**
   - Deep learning model với user tower và item tower
   - Collaborative filtering dựa trên interaction history
   - Sử dụng FAISS index cho fast similarity search
   - Cần trained model (`two_tower_model.pt`)

2. **PopularityRecommender**
   - Dựa trên số lượng interactions (views, clicks, enrolls)
   - Không cần model, chỉ cần count từ database
   - Good for cold-start users

3. **ContentBasedRecommender**
   - TF-IDF + cosine similarity trên course metadata
   - Sử dụng tags, skills, topics từ course data
   - Không cần interaction history

4. **HybridRecommender**
   - Kết hợp 3 strategies trên với configurable weights
   - Default weights: Two-Tower (0.5), Popularity (0.3), Content (0.2)
   - Normalize weights để tổng = 1.0
   - Score combination: weighted sum của rankings

**Bandit/Online Learning:**
- **EpsilonGreedyBandit** - Multi-armed bandit cho strategy selection
  - `epsilon` (default 0.1) - Exploration rate
  - Exploit: chọn strategy có reward cao nhất
  - Explore: random selection
  - Update rewards từ interactions (enroll > click > view)
- **OnlineUpdateService** - Periodically update bandit từ interaction logs
  - Fetch recent interactions từ DB
  - Compute rewards
  - Update bandit policy
  - Save state to `bandit_state.json`

**RecommenderFactory:**
- Factory pattern để tạo recommender instances
- Cache recommenders để reuse
- Default strategy từ `DEFAULT_RECOMMENDER` setting

### 3. APIs

| Method | Path | Description | Key Input Params | Response Shape |
|--------|------|-------------|------------------|----------------|
| GET | `/api/v1/recommendations/home` | Home page recommendations | `user_id` (query), `explain` (bool), `strategy` (optional) | `List[Course]` hoặc `RecommendationResponse` (nếu explain=true) |
| GET | `/api/v1/recommendations/similar/{course_id}` | Similar courses | `course_id` (path) | `List[Course]` |
| GET | `/api/v1/recommendations/stats/user/{user_id}` | User statistics | `user_id` (path) | `num_recommendations`, `num_clicks`, `num_enrolls`, `ctr`, `top_categories` |
| GET | `/api/v1/recommendations/stats/global` | Global statistics | - | `global_ctr`, `most_popular_courses[]`, `strategy_distribution[]`, `daily_stats[]` |
| GET | `/admin/recommendations/models` | Model information | - | `models_loaded[]`, `embedding_dim`, `num_indexed_items`, `model_checkpoints[]` |
| POST | `/admin/recommendations/reindex` | Rebuild FAISS index | - | `status`, `message` |
| GET | `/health` | Health check | - | `status`, `service` |

### 4. Data & Features

**Item data (Courses):**
- Load từ `InMemoryCourseRepository` (có thể load từ JSONL dataset)
- Course metadata: `id`, `title`, `description`, `level`, `tags`, `skills`, `topics`
- Embeddings: Pre-computed từ Two-Tower model (`item_embeddings.npy`)
- FAISS index: `items.faiss` cho fast ANN search

**User features:**
- `UserFeatureEncoder` - Encode user_id thành feature vector
- Deterministic encoding (không cần user metadata phức tạp)
- Feature dim: `USER_FEATURE_DIM` (default 16)

**Item features:**
- `ItemFeatureEncoder` - Encode course metadata thành feature vector
- Sử dụng: level, tags, skills, topics
- Feature dim: `ITEM_FEATURE_DIM` (default 32)

**Interaction logs:**
- Stored in `user_course_events` table (PostgreSQL)
- Event types: `view`, `click`, `enroll`
- Source: `home`, `chatbot`, `similar`
- Metadata: JSON field chứa `strategy` (which recommender was used)

**Embeddings generation:**
- Two-Tower model training → generate item embeddings
- Export script: `export_item_embeddings.py`
- Build FAISS index từ embeddings
- Save: `item_embeddings.npy`, `item_ids.txt`, `items.faiss`

### 5. Training & Online Update

**Training scripts:**

1. **`train_two_tower.py`**
   - Usage: `python -m app.scripts.train_two_tower --config configs/two_tower.yaml`
   - Loads interactions từ PostgreSQL
   - Trains PyTorch model
   - Saves: `two_tower_model.pt`, `item_embeddings.npy`

2. **`export_item_embeddings.py`**
   - Usage: `python -m app.scripts.export_item_embeddings`
   - Load trained model
   - Compute embeddings cho tất cả courses
   - Build FAISS index
   - Save: `item_embeddings.npy`, `item_ids.txt`, `items.faiss`

3. **`update_online_model.py`**
   - Usage: `python -m app.scripts.update_online_model --hours 24 --min-interactions 10`
   - Fetch recent interactions từ DB
   - Compute rewards (enroll=1.0, click=0.5, view=0.1)
   - Update bandit policy
   - Save: `bandit_state.json`

**CLI commands:**
- `python -m app.cli train-two-tower --epochs 10 --batch-size 32` - Train model
- `python -m app.cli export-embeddings` - Export embeddings + build index
- `python -m app.cli eval-two-tower` - Evaluate model
- `python -m app.cli rebuild-index` - Rebuild FAISS index
- `python -m app.cli show-config` - Show configuration

**Online update process:**
1. `OnlineUpdateService.update_from_interactions()` - Fetch interactions từ DB
2. Compute rewards từ event types
3. Update `EpsilonGreedyBandit` với rewards
4. Save bandit state
5. Bandit tự động chọn strategy tốt nhất cho requests tiếp theo

### 6. Config & Runtime

**Port:** `8002` (default)

**Environment variables:**
- `ENV` - Environment (dev/test/prod)
- `RS_DB_*` / `LMS_DB_*` - Database connection
- `RS_MODELS_DIR` - Directory cho model files
- `EMBEDDING_DIM` - Embedding dimension (default 64)
- `USER_FEATURE_DIM` - User feature dim (default 16)
- `ITEM_FEATURE_DIM` - Item feature dim (default 32)
- `DEFAULT_RECOMMENDER` - two_tower | popularity | content | hybrid (default: hybrid)
- `HYBRID_WEIGHTS_TWO_TOWER` - Weight cho Two-Tower (default 0.5)
- `HYBRID_WEIGHTS_POPULARITY` - Weight cho Popularity (default 0.3)
- `HYBRID_WEIGHTS_CONTENT` - Weight cho Content (default 0.2)
- `BANDIT_EPSILON` - Exploration rate (default 0.1)

**Settings class:** `app.core.settings.Settings` (pydantic-settings)
- Support `.env.dev`, `.env.test`, `.env.prod` files

---

## III. Q&A Cheat Sheet cho phần hỏi đáp với thầy

### Q1: "Chatbot này khác gì so với gọi thẳng LLM?"

**Trả lời:**
- "Chatbot của em sử dụng RAG (Retrieval-Augmented Generation), khác với gọi thẳng LLM ở chỗ: trước khi gọi LLM, hệ thống sẽ tìm kiếm nội dung liên quan từ vector store dựa trên câu hỏi của user, sau đó đưa nội dung đó vào context cho LLM. Nhờ vậy, câu trả lời sẽ bám sát tài liệu khóa học thay vì chỉ dựa vào kiến thức của LLM."
- "Ngoài ra, hệ thống còn có intent detection để route đến các handler chuyên biệt như GenerateQuiz, StudyPlan, ExplainCode, mỗi handler có logic riêng phù hợp với từng use case."

### Q2: "Tại sao chọn kiến trúc Two-Tower cho recommendation?"

**Trả lời:**
- "Two-Tower architecture phù hợp cho recommendation vì nó tách riêng user embedding và item embedding, cho phép tính toán nhanh bằng cách pre-compute item embeddings và dùng FAISS index cho approximate nearest neighbor search."
- "Kiến trúc này scalable hơn so với matrix factorization truyền thống, và có thể kết hợp với các thuật toán khác như Popularity và Content-based trong Hybrid recommender để tận dụng ưu điểm của từng phương pháp."

### Q3: "Hệ thống em hỗ trợ cá nhân hóa như thế nào?"

**Trả lời:**
- "Hệ thống cá nhân hóa ở 2 mức: mức model và mức strategy. Ở mức model, Two-Tower model học từ interaction history của user để tạo user embedding riêng. Ở mức strategy, hệ thống dùng epsilon-greedy bandit để tự động chọn strategy tốt nhất (two_tower, popularity, content, hoặc hybrid) dựa trên phản hồi của user."
- "Ngoài ra, Hybrid recommender kết hợp nhiều signals: collaborative filtering (Two-Tower), trending courses (Popularity), và content similarity (Content-based) để đảm bảo recommendations phù hợp với từng user."

### Q4: "Dữ liệu khóa học được lưu và ingest ra sao?"

**Trả lời:**
- "Dữ liệu khóa học được ingest từ nhiều nguồn: LMS database (PostgreSQL), Markdown files, HTML, PDF, video transcripts, và JSONL files. Ingestion pipeline gồm 3 bước: Loader chọn nguồn phù hợp, Chunker chia nhỏ content (fixed-size hoặc semantic), và Embedding model tạo vector embeddings."
- "Sau đó, embeddings được lưu vào vector store (FAISS hoặc InMemory). Mỗi chunk có metadata như course_id, lesson_id, section để có thể filter khi retrieval. Hệ thống hỗ trợ re-indexing qua admin API khi có cập nhật nội dung."

### Q5: "Nếu dữ liệu lớn lên 10 lần thì kiến trúc hiện tại có chịu được không?"

**Trả lời:**
- "Về vector store, hiện tại em dùng FAISS với in-memory index, nếu dữ liệu lớn lên 10 lần thì có thể cần chuyển sang FAISS với on-disk persistence hoặc dùng vector database chuyên dụng như Pinecone, Weaviate."
- "Về recommendation, Two-Tower model với FAISS index có thể scale tốt vì item embeddings được pre-compute và search rất nhanh. Tuy nhiên, nếu số user tăng nhiều, có thể cần sharding hoặc distributed training. Hiện tại architecture đã có sẵn abstraction (BaseRecommender, VectorStore) nên dễ dàng swap implementation."

### Q6: "Nếu LLM down thì hệ thống xử lý thế nào?"

**Trả lời:**
- "Hệ thống có fallback mechanism: nếu primary LLM (Llama3) fail, sẽ tự động fallback về DummyLLMClient. Code trong `ChatService._safe_generate()` có try-catch để handle exceptions."
- "Ngoài ra, nếu cả primary và fallback đều fail, hệ thống sẽ trả về message lỗi thân thiện thay vì crash. Trong production, có thể thêm retry logic hoặc circuit breaker pattern."

### Q7: "Hệ thống recommendation này có học từ hành vi người dùng không?"

**Trả lời:**
- "Có, hệ thống có 2 cơ chế học: offline training và online learning. Offline training: Two-Tower model được train từ interaction logs (views, clicks, enrolls) trong database, sau đó generate item embeddings."
- "Online learning: Epsilon-greedy bandit tự động cập nhật dựa trên phản hồi gần đây. Script `update_online_model.py` fetch interactions trong 24h gần nhất, compute rewards (enroll=1.0, click=0.5, view=0.1), và update bandit policy để chọn strategy tốt nhất."

### Q8: "Làm sao đảm bảo recommendations không bị bias về popular courses?"

**Trả lời:**
- "Hệ thống dùng Hybrid recommender kết hợp 3 strategies với weights có thể config. Mặc định: Two-Tower (0.5), Popularity (0.3), Content (0.2). Nếu muốn giảm bias về popularity, có thể tăng weight cho Two-Tower hoặc Content-based."
- "Ngoài ra, Content-based recommender không phụ thuộc vào popularity mà dựa trên similarity về tags, skills, topics, nên sẽ đa dạng hóa recommendations."

### Q9: "Intent detection hiện tại dùng gì? Có chính xác không?"

**Trả lời:**
- "Hiện tại em dùng keyword matching trong `NLUService.detect_intent()`. Code có TODO comment là sẽ thay bằng fine-tuned classifier trong tương lai."
- "Keyword matching đơn giản nhưng đủ cho demo. Trong production, em sẽ dùng transformer model như BERT fine-tuned trên dataset intent classification để tăng độ chính xác."

### Q10: "RAG retrieval dùng phương pháp gì? Có tối ưu không?"

**Trả lời:**
- "Hệ thống hỗ trợ 3 modes: vector-only, BM25-only, và hybrid. Hybrid mode kết hợp vector similarity (semantic) và BM25 (keyword) với weight `HYBRID_ALPHA` (default 0.6 cho vector, 0.4 cho BM25)."
- "Hybrid search tốt hơn vì vector search tốt cho semantic similarity, còn BM25 tốt cho exact keyword matching. Code trong `RetrievalService.retrieve()` normalize cả 2 scores rồi combine theo weight."

### Q11: "Hệ thống có support multi-language không?"

**Trả lời:**
- "Hiện tại code có field `language` trong `DocumentChunk` và có thể filter theo language khi retrieval. Tuy nhiên, embedding model (all-MiniLM-L6-v2) chủ yếu support English."
- "Để support tiếng Việt tốt hơn, em có thể thay embedding model bằng multilingual model như multilingual-MiniLM hoặc paraphrase-multilingual. Chat endpoint cũng có parameter `language` hint để có thể customize prompt cho LLM."

### Q12: "Làm sao đánh giá chất lượng recommendations?"

**Trả lời:**
- "Hệ thống có analytics endpoints để track CTR (click-through rate), số enrollments, và strategy distribution. Có thể so sánh performance của các strategies khác nhau."
- "Về offline evaluation, có script `eval-two-tower.py` để compute metrics như Recall@K, Precision@K, NDCG@K trên test set. Tuy nhiên, metrics quan trọng nhất là business metrics như CTR và enrollment rate từ production data."

### Q13: "Study Plan handler làm gì? Có gì đặc biệt?"

**Trả lời:**
- "Có 2 versions: StudyPlanHandler (basic) và StudyPlanV2Handler (enhanced). V2 handler nhận thêm constraints như `exam_date`, `free_days_per_week`, `completed_lessons` để tạo lộ trình học cá nhân hóa."
- "Handler này lấy danh sách lessons từ course, filter những lesson đã hoàn thành, rồi phân bổ theo timeline dựa trên exam date và số ngày rảnh. Sau đó dùng LLM để format thành kế hoạch học tập dễ đọc."

### Q14: "Vector store dùng gì? Có persistent không?"

**Trả lời:**
- "Hệ thống có abstraction `VectorStore` với 2 implementations: `InMemoryVectorStore` (cho dev/test, không persistent) và `FaissVectorStore` (persistent trên disk)."
- "FAISS store lưu embeddings và index vào `VECTOR_STORE_DIR`, nên khi restart service, data vẫn còn. Code có method `add_documents()` và `retrieve_for_course()` để thao tác với store."

### Q15: "Nếu muốn thêm intent mới thì làm thế nào?"

**Trả lời:**
- "Rất dễ nhờ Strategy pattern: em chỉ cần tạo class mới kế thừa `IntentHandler`, implement method `handle()`, rồi register vào `HandlerRegistry`."
- "Ví dụ: nếu muốn thêm intent ASK_TRANSLATE, em tạo `TranslateHandler`, thêm vào enum `Intent`, update `NLUService.detect_intent()` để detect keyword, và register handler trong `HandlerRegistry.__init__()`. Không cần sửa code ở các nơi khác."

---

## Lưu ý khi trả lời

1. **Bám sát code thực tế** - Chỉ nói những gì đã implement, không hứa hẹn features chưa có
2. **Thừa nhận limitations** - Nếu có phần chưa hoàn chỉnh (như NLU keyword matching), nói rõ và đề xuất cải thiện
3. **Nhấn mạnh architecture** - Design patterns, abstractions, scalability considerations
4. **Show understanding** - Giải thích tại sao chọn approach này, trade-offs
5. **Tự tin nhưng khiêm tốn** - "Em đã implement X, phần Y đã có sẵn architecture, nếu có thêm thời gian sẽ triển khai tiếp"

Chúc em bảo vệ thành công! 🎓

