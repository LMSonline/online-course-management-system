"""Hardcoded demo responses for chatbot service in DEMO_MODE."""

from typing import Dict, Any, Optional


def get_demo_chat_response(
    text: str, 
    debug: bool = False,
    exam_date: str | None = None,
    free_days_per_week: int | None = None,
    completed_lessons: list[str] | None = None,
) -> tuple[str, Optional[Dict[str, Any]]]:
    """
    Generate a demo chat response based on text content.
    
    Args:
        text: User's message text
        debug: Whether to include debug info
        exam_date: ISO format date for study plan
        free_days_per_week: Number of free days per week for study plan
        completed_lessons: List of completed lesson IDs
        
    Returns:
        Tuple of (reply_text, debug_info_dict or None)
    """
    text_lower = text.lower()
    
    # Quiz generation
    if "quiz" in text_lower or "trắc nghiệm" in text_lower or "câu hỏi" in text_lower:
        reply = """Đây là 5 câu trắc nghiệm về Python Basics:

1. Python là ngôn ngữ lập trình:
   A. Compiled
   B. Interpreted ✓
   C. Assembly
   D. Machine code

2. Cách khai báo biến trong Python:
   A. var x = 5
   B. int x = 5
   C. x = 5 ✓
   D. declare x = 5

3. Kiểu dữ liệu nào sau đây là immutable trong Python?
   A. List
   B. Dictionary
   C. Tuple ✓
   D. Set

4. Hàm nào dùng để in ra màn hình trong Python?
   A. print() ✓
   B. echo()
   C. console.log()
   D. System.out.println()

5. Vòng lặp for trong Python có thể lặp qua:
   A. Chỉ số lặp
   B. Chỉ chuỗi
   C. Bất kỳ iterable nào ✓
   D. Chỉ list"""
        
        debug_info = None
        if debug:
            debug_info = {
                "chunks": [
                    {
                        "course_id": "course_python_basic",
                        "lesson_id": "lesson_001",
                        "section": None,
                        "score": 0.95,
                        "text_preview": "Python Basics - Introduction to programming concepts..."
                    }
                ]
            }
        
        return reply, debug_info
    
    # Study plan
    if "kế hoạch" in text_lower or "plan" in text_lower or "lịch học" in text_lower:
        # Format exam date if provided
        exam_date_str = "31/12/2024"  # default
        if exam_date:
            try:
                from datetime import datetime
                dt = datetime.fromisoformat(exam_date.replace('Z', '+00:00'))
                exam_date_str = dt.strftime("%d/%m/%Y")
            except:
                exam_date_str = exam_date
        
        # Format free days
        free_days = free_days_per_week if free_days_per_week else 5
        
        # Format completed lessons
        completed_str = "lesson_001 (Introduction to Python)"  # default
        if completed_lessons and len(completed_lessons) > 0:
            completed_str = ", ".join(completed_lessons)
        elif not completed_lessons:
            completed_str = "Chưa có bài nào hoàn thành"
        
        reply = f"""Kế hoạch học tập cá nhân hóa cho khóa Python Basics:

**Thông tin:**
- Ngày thi: {exam_date_str}
- Số ngày rảnh mỗi tuần: {free_days} ngày
- Bài đã hoàn thành: {completed_str}

**Lộ trình học (4 tuần):**

**Tuần 1: Cơ bản về Python** ({free_days} ngày/tuần)
- Ngày 1: Biến và kiểu dữ liệu (lesson_002)
- Ngày 2: Toán tử và biểu thức
- Ngày 3: Cấu trúc điều khiển - if/else (lesson_003)
- Ngày 4: Vòng lặp for và while
- Ngày 5: Ôn tập tuần 1

**Tuần 2: Cấu trúc dữ liệu** ({free_days} ngày/tuần)
- Ngày 1: List và Tuple (lesson_004)
- Ngày 2: Dictionary và Set (lesson_005)
- Ngày 3: Xử lý chuỗi (String) (lesson_006)
- Ngày 4: List comprehension
- Ngày 5: Bài tập tổng hợp

**Tuần 3: Hàm và Module** ({free_days} ngày/tuần)
- Ngày 1: Định nghĩa và gọi hàm (lesson_007)
- Ngày 2: Tham số, return, scope (lesson_008)
- Ngày 3: Lambda và higher-order functions
- Ngày 4: Module và import (lesson_009)
- Ngày 5: Dự án nhỏ

**Tuần 4: Lập trình hướng đối tượng** ({free_days} ngày/tuần)
- Ngày 1: Class và Object (lesson_010)
- Ngày 2: Inheritance (lesson_011)
- Ngày 3: Polymorphism và Encapsulation
- Ngày 4: Exception handling (lesson_012)
- Ngày 5: Ôn tập và chuẩn bị thi

**Lưu ý:** {'Bạn đã hoàn thành ' + completed_str + ', nên có thể bắt đầu từ bài tiếp theo. ' if completed_lessons and len(completed_lessons) > 0 else ''}Hãy dành thời gian ôn tập trước ngày thi!

Chúc bạn học tốt và đạt kết quả cao! 🎓"""
        
        return reply, None
    
    # General Python question (RAG response)
    if "python" in text_lower or "là gì" in text_lower or "what is" in text_lower:
        reply = """Dựa trên nội dung khóa học Python Basics, em có thể giải thích như sau:

**Python là gì?**

Python là một ngôn ngữ lập trình cấp cao, được thiết kế bởi Guido van Rossum và phát hành lần đầu vào năm 1991. Python được thiết kế với triết lý "đọc được như mã giả" (readable as pseudocode), nhấn mạnh tính dễ đọc và đơn giản.

**Đặc điểm nổi bật:**
- **Cú pháp đơn giản**: Python sử dụng indentation (thụt lề) để định nghĩa code blocks, giúp code dễ đọc hơn so với các ngôn ngữ khác
- **Interpreted language**: Python là ngôn ngữ thông dịch, không cần compile trước khi chạy
- **Dynamic typing**: Không cần khai báo kiểu dữ liệu trước, Python tự động xác định kiểu

**Ứng dụng thực tế:**
- **Web Development**: Django, Flask để xây dựng web applications
- **Data Science**: NumPy, Pandas cho phân tích dữ liệu
- **Machine Learning**: TensorFlow, scikit-learn cho AI/ML
- **Automation**: Scripting và tự động hóa các tác vụ
- **Scientific Computing**: Tính toán khoa học và nghiên cứu

**Tại sao nên học Python?**
Python rất phù hợp cho người mới bắt đầu vì cú pháp đơn giản, nhưng cũng đủ mạnh mẽ cho các dự án enterprise. Cộng đồng Python rất lớn với nhiều thư viện và tài liệu hỗ trợ.

Trong khóa Python Basics này, chúng ta sẽ học từ những khái niệm cơ bản nhất như biến, kiểu dữ liệu, đến các chủ đề nâng cao hơn như lập trình hướng đối tượng."""
        
        debug_info = None
        if debug:
            debug_info = {
                "chunks": [
                    {
                        "course_id": "course_python_basic",
                        "lesson_id": "lesson_001",
                        "section": "Introduction",
                        "score": 0.92,
                        "text_preview": "Welcome to Python Basics! Python is a high-level programming language known for its simplicity and readability..."
                    },
                    {
                        "course_id": "course_python_basic",
                        "lesson_id": "lesson_001",
                        "section": "What is Python",
                        "score": 0.88,
                        "text_preview": "Python is an interpreted, high-level programming language. It was created by Guido van Rossum..."
                    }
                ]
            }
        
        return reply, debug_info
    
    # Default response
    reply = """Xin chào! Tôi là trợ lý học tập AI của hệ thống. Tôi có thể giúp bạn:

- Trả lời câu hỏi về nội dung khóa học
- Tạo câu hỏi trắc nghiệm để ôn tập
- Tạo kế hoạch học tập cá nhân hóa
- Giải thích code và khái niệm lập trình
- Gợi ý khóa học phù hợp

Hãy thử hỏi tôi về Python, hoặc yêu cầu tạo quiz, hoặc kế hoạch học tập!"""
    
    return reply, None


def get_demo_user_stats(user_id: str) -> Dict[str, Any]:
    """Return hardcoded user statistics."""
    return {
        "user_id": user_id,
        "num_sessions": 5,
        "num_messages": 23,
        "intent_distribution": {
            "ASK_COURSE_QA": 8,
            "ASK_GENERATE_QUIZ": 5,
            "ASK_STUDY_PLAN": 3,
            "ASK_GENERAL_QA": 4,
            "ASK_RECOMMEND": 3,
        }
    }


def get_demo_global_stats() -> Dict[str, Any]:
    """Return hardcoded global statistics."""
    return {
        "total_sessions": 127,
        "total_messages": 542,
        "top_intents": [
            {"intent": "ASK_COURSE_QA", "count": 198},
            {"intent": "ASK_GENERATE_QUIZ", "count": 95},
            {"intent": "ASK_STUDY_PLAN", "count": 67},
            {"intent": "ASK_GENERAL_QA", "count": 89},
            {"intent": "ASK_RECOMMEND", "count": 93},
        ],
        "most_asked_courses": [
            {"course_id": "course_python_basic", "count": 145},
            {"course_id": "course_ds_foundations", "count": 89},
            {"course_id": "course_java_basic", "count": 67},
            {"course_id": "course_web_dev", "count": 54},
        ],
        "time_series": [
            {"date": "2024-01-15", "sessions": 12},
            {"date": "2024-01-16", "sessions": 15},
            {"date": "2024-01-17", "sessions": 18},
            {"date": "2024-01-18", "sessions": 14},
        ]
    }

