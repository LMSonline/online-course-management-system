"""Hardcoded demo responses for recommendation service in DEMO_MODE."""

from typing import List, Dict, Any
from app.domain.models import Course, RecommendedCourse


def get_demo_home_recommendations(user_id: str, explain: bool = False, strategy: str | None = None) -> List[Course] | List[RecommendedCourse]:
    """
    Return hardcoded course recommendations.
    
    Args:
        user_id: User ID (ignored in demo mode)
        explain: Whether to include explanations
        strategy: Strategy name (echoed in reason if explain=True)
        
    Returns:
        List of Course or RecommendedCourse objects
    """
    # Adjust recommendations based on strategy for demo
    if strategy == "popularity":
        # Reorder to show popular courses first
        strategy_text = " (using popularity-based strategy)"
        courses = [
            Course(
                id="course_python_basic",
                title="Python Basics",
                description="Learn Python programming from scratch. Cover variables, data types, control structures, and functions.",
                level="beginner",
                tags=["python", "programming", "beginner"],
            ),
            Course(
                id="course_ds_foundations",
                title="Data Science Foundations",
                description="Introduction to data science with Python. Learn pandas, numpy, and data visualization.",
                level="intermediate",
                tags=["data-science", "python", "pandas"],
            ),
            Course(
                id="course_web_dev",
                title="Web Development with Flask",
                description="Build web applications using Flask framework. Learn routing, templates, and database integration.",
                level="intermediate",
                tags=["web-development", "flask", "python"],
            ),
            Course(
                id="course_ml_intro",
                title="Introduction to Machine Learning",
                description="Get started with machine learning using scikit-learn. Learn classification, regression, and model evaluation.",
                level="intermediate",
                tags=["machine-learning", "ai", "scikit-learn"],
            ),
            Course(
                id="course_sql_basics",
                title="SQL for Data Analysis",
                description="Master SQL queries for data analysis. Learn joins, aggregations, and window functions.",
                level="beginner",
                tags=["sql", "database", "data-analysis"],
            ),
        ]
    elif strategy == "two_tower":
        strategy_text = " (using two-tower collaborative filtering)"
        courses = [
            Course(
                id="course_python_basic",
                title="Python Basics",
                description="Learn Python programming from scratch. Cover variables, data types, control structures, and functions.",
                level="beginner",
                tags=["python", "programming", "beginner"],
            ),
            Course(
                id="course_ds_foundations",
                title="Data Science Foundations",
                description="Introduction to data science with Python. Learn pandas, numpy, and data visualization.",
                level="intermediate",
                tags=["data-science", "python", "pandas"],
            ),
            Course(
                id="course_ml_intro",
                title="Introduction to Machine Learning",
                description="Get started with machine learning using scikit-learn. Learn classification, regression, and model evaluation.",
                level="intermediate",
                tags=["machine-learning", "ai", "scikit-learn"],
            ),
            Course(
                id="course_web_dev",
                title="Web Development with Flask",
                description="Build web applications using Flask framework. Learn routing, templates, and database integration.",
                level="intermediate",
                tags=["web-development", "flask", "python"],
            ),
            Course(
                id="course_sql_basics",
                title="SQL for Data Analysis",
                description="Master SQL queries for data analysis. Learn joins, aggregations, and window functions.",
                level="beginner",
                tags=["sql", "database", "data-analysis"],
            ),
        ]
    elif strategy == "content":
        strategy_text = " (using content-based similarity)"
        courses = [
            Course(
                id="course_ds_foundations",
                title="Data Science Foundations",
                description="Introduction to data science with Python. Learn pandas, numpy, and data visualization.",
                level="intermediate",
                tags=["data-science", "python", "pandas"],
            ),
            Course(
                id="course_ml_intro",
                title="Introduction to Machine Learning",
                description="Get started with machine learning using scikit-learn. Learn classification, regression, and model evaluation.",
                level="intermediate",
                tags=["machine-learning", "ai", "scikit-learn"],
            ),
            Course(
                id="course_python_basic",
                title="Python Basics",
                description="Learn Python programming from scratch. Cover variables, data types, control structures, and functions.",
                level="beginner",
                tags=["python", "programming", "beginner"],
            ),
            Course(
                id="course_web_dev",
                title="Web Development with Flask",
                description="Build web applications using Flask framework. Learn routing, templates, and database integration.",
                level="intermediate",
                tags=["web-development", "flask", "python"],
            ),
            Course(
                id="course_sql_basics",
                title="SQL for Data Analysis",
                description="Master SQL queries for data analysis. Learn joins, aggregations, and window functions.",
                level="beginner",
                tags=["sql", "database", "data-analysis"],
            ),
        ]
    else:  # hybrid or default
        strategy_text = f" (using hybrid strategy)" if strategy == "hybrid" else " (using default hybrid strategy)"
        courses = [
            Course(
                id="course_python_basic",
                title="Python Basics",
                description="Learn Python programming from scratch. Cover variables, data types, control structures, and functions.",
                level="beginner",
                tags=["python", "programming", "beginner"],
            ),
            Course(
                id="course_ds_foundations",
                title="Data Science Foundations",
                description="Introduction to data science with Python. Learn pandas, numpy, and data visualization.",
                level="intermediate",
                tags=["data-science", "python", "pandas"],
            ),
            Course(
                id="course_web_dev",
                title="Web Development with Flask",
                description="Build web applications using Flask framework. Learn routing, templates, and database integration.",
                level="intermediate",
                tags=["web-development", "flask", "python"],
            ),
            Course(
                id="course_ml_intro",
                title="Introduction to Machine Learning",
                description="Get started with machine learning using scikit-learn. Learn classification, regression, and model evaluation.",
                level="intermediate",
                tags=["machine-learning", "ai", "scikit-learn"],
            ),
            Course(
                id="course_sql_basics",
                title="SQL for Data Analysis",
                description="Master SQL queries for data analysis. Learn joins, aggregations, and window functions.",
                level="beginner",
                tags=["sql", "database", "data-analysis"],
            ),
        ]
    
    if explain:
        reasons = [
            f"You recently interacted with Python videos and are at beginner level{strategy_text}.",
            f"Recommended next step after Python Basics{strategy_text}.",
            f"Builds on your Python knowledge for web development{strategy_text}.",
            f"Natural progression from Data Science Foundations{strategy_text}.",
            f"Essential skill for data analysis and complements your Python learning{strategy_text}.",
        ]
        
        return [
            RecommendedCourse(
                course=course,
                score=0.9 - (i * 0.1),
                reason=reason
            )
            for i, (course, reason) in enumerate(zip(courses, reasons))
        ]
    
    return courses


def get_demo_user_stats(user_id: str) -> Dict[str, Any]:
    """Return hardcoded user statistics."""
    return {
        "user_id": user_id,
        "num_recommendations": 15,
        "num_clicks": 3,
        "num_enrolls": 1,
        "ctr": 20.0,
        "top_categories": ["programming", "data-science", "web-development"],
    }


def get_demo_global_stats() -> Dict[str, Any]:
    """Return hardcoded global statistics."""
    return {
        "global_ctr": 12.5,
        "most_popular_courses": [
            {"course_id": "course_python_basic", "count": 1245},
            {"course_id": "course_ds_foundations", "count": 892},
            {"course_id": "course_web_dev", "count": 678},
            {"course_id": "course_ml_intro", "count": 534},
            {"course_id": "course_sql_basics", "count": 456},
        ],
        "strategy_distribution": [
            {"strategy": "hybrid", "count": 2341},
            {"strategy": "two_tower", "count": 1234},
            {"strategy": "popularity", "count": 567},
            {"strategy": "content", "count": 234},
        ],
        "daily_stats": [
            {"date": "2024-01-15", "views": 234, "clicks": 28, "enrolls": 5},
            {"date": "2024-01-16", "views": 267, "clicks": 32, "enrolls": 7},
            {"date": "2024-01-17", "views": 289, "clicks": 38, "enrolls": 6},
            {"date": "2024-01-18", "views": 312, "clicks": 41, "enrolls": 8},
        ]
    }


def get_demo_similar_courses(course_id: str) -> List[Course]:
    """
    Return a list of demo 'similar courses' for the given course_id.
    Data should be consistent with the rest of the demo (Python, DS, ML).
    
    Args:
        course_id: The course ID to find similar courses for
        
    Returns:
        List of Course objects that are similar to the given course_id
    """
    # Define all available courses for similarity matching
    all_courses = {
        "course_python_basic": Course(
            id="course_python_basic",
            title="Python Basics",
            description="Learn Python programming from scratch. Cover variables, data types, control structures, and functions.",
            level="beginner",
            tags=["python", "programming", "beginner"],
        ),
        "course_ds_foundations": Course(
            id="course_ds_foundations",
            title="Data Science Foundations",
            description="Introduction to data science with Python. Learn pandas, numpy, and data visualization.",
            level="intermediate",
            tags=["data-science", "python", "pandas"],
        ),
        "course_web_dev": Course(
            id="course_web_dev",
            title="Web Development with Flask",
            description="Build web applications using Flask framework. Learn routing, templates, and database integration.",
            level="intermediate",
            tags=["web-development", "flask", "python"],
        ),
        "course_ml_intro": Course(
            id="course_ml_intro",
            title="Introduction to Machine Learning",
            description="Get started with machine learning using scikit-learn. Learn classification, regression, and model evaluation.",
            level="intermediate",
            tags=["machine-learning", "ai", "scikit-learn"],
        ),
        "course_sql_basics": Course(
            id="course_sql_basics",
            title="SQL for Data Analysis",
            description="Master SQL queries for data analysis. Learn joins, aggregations, and window functions.",
            level="beginner",
            tags=["sql", "database", "data-analysis"],
        ),
    }
    
    # Define similarity mappings based on course_id
    similarity_map = {
        "course_python_basic": [
            "course_ds_foundations",  # Python-related
            "course_web_dev",  # Uses Python
            "course_ml_intro",  # Python ecosystem
            "course_sql_basics",  # Beginner level, complementary
        ],
        "course_ds_foundations": [
            "course_python_basic",  # Prerequisite
            "course_ml_intro",  # Natural progression
            "course_sql_basics",  # Data-related
            "course_web_dev",  # Python ecosystem
        ],
        "course_web_dev": [
            "course_python_basic",  # Prerequisite
            "course_ds_foundations",  # Python ecosystem
            "course_sql_basics",  # Database knowledge
            "course_ml_intro",  # Python ecosystem
        ],
        "course_ml_intro": [
            "course_ds_foundations",  # Prerequisite
            "course_python_basic",  # Foundation
            "course_sql_basics",  # Data-related
            "course_web_dev",  # Python ecosystem
        ],
        "course_sql_basics": [
            "course_ds_foundations",  # Data-related
            "course_python_basic",  # Beginner level
            "course_web_dev",  # Database knowledge
            "course_ml_intro",  # Data-related
        ],
    }
    
    # Get similar course IDs, or use default list if course_id not found
    similar_ids = similarity_map.get(course_id, [
        "course_python_basic",
        "course_ds_foundations",
        "course_web_dev",
        "course_ml_intro",
    ])
    
    # Return Course objects, excluding the target course itself
    similar_courses = [
        all_courses[cid] for cid in similar_ids 
        if cid in all_courses and cid != course_id
    ]
    
    # Return 3-4 courses (limit to 4 max)
    return similar_courses[:4]


def get_demo_model_info() -> Dict[str, Any]:
    """Return hardcoded model information."""
    return {
        "models_loaded": [
            "two_tower_model.pt",
            "item_embeddings.npy",
            "item_ids.txt",
            "items.faiss",
        ],
        "embedding_dim": 64,
        "num_indexed_items": 42,
        "model_checkpoints": [
            {
                "name": "two_tower_model.pt",
                "size_bytes": 2457600,
                "modified": 1705320000.0,
            }
        ]
    }

