# Course Videos Dataset

This document describes the `course_videos.jsonl` dataset used for RAG ingestion and content-based recommendation.

## Overview

The `course_videos.jsonl` file contains structured course video content in JSON Lines format, where each line is a JSON object representing a video with transcript, metadata, and tags.

**Location**: `data/course_videos.jsonl`

## Schema

Each line in the JSONL file is a JSON object with the following fields:

### Required Fields

- `id` (string): Unique identifier for the video record (e.g., "video_001")
- `course_id` (string): Course identifier (e.g., "course_python_basic")
- `course_title` (string): Full title of the course
- `lesson_id` (string): Lesson identifier within the course
- `lesson_title` (string): Title of the lesson
- `video_id` (string): Video identifier (typically same as `id`)
- `video_title` (string): Title of the video
- `text` (string): **Main content** - transcript or key text content for RAG
- `source` (string): Source of the data (e.g., "lms_db", "jsonl")

### Metadata Fields

- `video_url` (string): URL to the video file
- `language` (string): Language code (e.g., "en", "vi")
- `difficulty` (string): Difficulty level - "BEGINNER", "INTERMEDIATE", or "ADVANCED"
- `duration_sec` (integer): Video duration in seconds
- `start_time_sec` (integer): Start time in seconds (0 for full video)
- `end_time_sec` (integer): End time in seconds (same as duration for full video)
- `content_type` (string): Type of content (e.g., "video_transcript")

### Tagging Fields

- `tags` (array of strings): Topic tags (e.g., ["python", "programming", "beginner"])
- `skills` (array of strings): Skills covered (e.g., ["programming", "data-analysis"])
- `topics` (array of strings): Subject topics (e.g., ["data-structures", "algorithms"])

### Timestamp Fields

- `created_at` (string): ISO 8601 timestamp when record was created
- `updated_at` (string): ISO 8601 timestamp when record was last updated

## Example Record

```json
{
  "id": "video_001",
  "course_id": "course_python_basic",
  "course_title": "Python Basics",
  "lesson_id": "lesson_001",
  "lesson_title": "Introduction to Python",
  "video_id": "video_001",
  "video_title": "What is Python?",
  "video_url": "https://example.com/videos/python-basics/intro.mp4",
  "language": "en",
  "difficulty": "BEGINNER",
  "duration_sec": 600,
  "start_time_sec": 0,
  "end_time_sec": 600,
  "content_type": "video_transcript",
  "text": "Welcome to Python Basics! Python is a high-level programming language...",
  "tags": ["python", "programming", "beginner", "introduction"],
  "skills": ["programming", "coding", "logic"],
  "topics": ["programming-languages", "syntax", "basics"],
  "source": "lms_db",
  "created_at": "2024-01-15T10:00:00Z",
  "updated_at": "2024-01-15T10:00:00Z"
}
```

## Generating the Dataset

### From LMS Database

Use the export script to generate the JSONL file from the LMS Postgres database:

```bash
# Export all videos
python -m app.scripts.export_course_videos_jsonl --output data/course_videos.jsonl

# Export videos for a specific course
python -m app.scripts.export_course_videos_jsonl --output data/course_videos.jsonl --course-id course_python_basic

# Export only videos longer than 60 seconds
python -m app.scripts.export_course_videos_jsonl --output data/course_videos.jsonl --min-duration 60
```

The script:
1. Connects to LMS Postgres using environment variables (`LMS_DB_*`)
2. Queries `lessons` table (filtering for `type = 'VIDEO'`)
3. Joins with `courses`, `course_versions`, `chapters`, and `tags` tables
4. Extracts transcript text (from lesson description or transcript table)
5. Infers `skills` and `topics` from tags and course content
6. Writes JSONL file

### Manual Creation

You can also create the JSONL file manually by writing one JSON object per line:

```bash
echo '{"id": "video_001", "course_id": "course_1", ...}' >> data/course_videos.jsonl
echo '{"id": "video_002", "course_id": "course_1", ...}' >> data/course_videos.jsonl
```

## Usage in RAG Ingestion (Chatbot Service)

The JSONL dataset is automatically loaded by the `JSONLLoader` in the ingestion pipeline:

```bash
# Ingest from JSONL file
python -m app.cli ingest-folder --path data/course_videos.jsonl

# Or use the ingestion service directly
python -m app.scripts.ingest_from_folder --path data/course_videos.jsonl
```

The loader:
1. Reads each line as a JSON object
2. Extracts `text` field as the main content
3. Uses metadata fields (`course_id`, `lesson_id`, `tags`, etc.) for vector store metadata
4. Chunks the text using the configured chunking strategy
5. Generates embeddings and stores in the vector store

**Metadata Propagation**: All fields from the JSONL record are preserved in the vector store metadata, allowing filtering and retrieval by:
- `course_id`
- `lesson_id`
- `video_id`
- `tags`, `skills`, `topics`
- `difficulty`
- `language`

## Usage in Content-Based Recommendation

The recommendation service can load courses from the JSONL dataset:

```python
from app.infra.dataset_loader import load_course_videos_dataset

# Load dataset
dataset = load_course_videos_dataset("data/course_videos.jsonl")

# Get courses as Course objects
courses = dataset.to_courses()

# Get course text content for TF-IDF
text = dataset.get_course_text_content("course_python_basic")

# Get course tags
tags = dataset.get_course_tags("course_python_basic")
```

The `ContentBasedRecommender` uses:
- Course text content (aggregated from all video transcripts)
- Tags, skills, and topics for similarity computation
- Metadata (difficulty, language) for filtering

## Integration Points

### Chatbot Service

1. **Ingestion Pipeline**: `app/ingestion/loaders/jsonl_loader.py`
   - Loads JSONL files
   - Extracts text and metadata
   - Integrates with `IngestionService`

2. **CLI**: `app/cli.py`
   - `ingest-folder` command supports JSONL files

3. **Scripts**: `app/scripts/export_course_videos_jsonl.py`
   - Exports from LMS DB to JSONL format

### Recommendation Service

1. **Dataset Loader**: `app/infra/dataset_loader.py`
   - `CourseVideoDataset` class for loading and querying JSONL
   - Methods to extract course text, tags, and metadata
   - Conversion to `Course` objects

2. **Content-Based Recommender**: `app/recommenders/content_based_recommender.py`
   - Can use JSONL dataset to build TF-IDF vectors
   - Uses course text and tags for similarity

## Best Practices

1. **Keep JSONL Updated**: Regenerate the dataset when course content changes
2. **Transcript Quality**: Ensure `text` field contains meaningful transcript content
3. **Tag Consistency**: Use consistent tag naming conventions across courses
4. **Metadata Completeness**: Fill all metadata fields for better filtering and retrieval
5. **File Size**: For large datasets, consider splitting into multiple JSONL files

## Future Enhancements

- Support for video segments (multiple records per video with timestamps)
- Multi-language support with language-specific fields
- Integration with transcript extraction services
- Automatic tag inference from video content
- Support for video thumbnails and preview URLs

