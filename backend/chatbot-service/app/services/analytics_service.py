"""Analytics service for chat conversations."""

from typing import Dict, List, Any
from datetime import datetime, timedelta
from app.infra.chat_repositories import ChatSessionRepository, ChatMessageRepository
from app.domain.enums import Intent


class AnalyticsService:
    """Service for computing chat analytics and statistics."""

    def __init__(
        self,
        session_repo: ChatSessionRepository,
        message_repo: ChatMessageRepository,
    ):
        self.session_repo = session_repo
        self.message_repo = message_repo

    async def get_user_stats(self, user_id: str) -> Dict[str, Any]:
        """
        Get statistics for a specific user.
        
        Returns:
            Dictionary with:
            - num_sessions: Total number of sessions
            - num_messages: Total number of messages
            - intent_distribution: Distribution of intents
        """
        # Get all sessions for user
        sessions = await self.session_repo.list_sessions(user_id)
        
        # Get all messages for user
        all_messages = []
        for session in sessions:
            messages = await self.message_repo.get_recent_messages(session.id, limit=10000)
            all_messages.extend(messages)
        
        # Count intents
        intent_counts: Dict[str, int] = {}
        for session in sessions:
            if session.last_intent:
                intent_counts[session.last_intent] = intent_counts.get(session.last_intent, 0) + 1
        
        return {
            "user_id": user_id,
            "num_sessions": len(sessions),
            "num_messages": len(all_messages),
            "intent_distribution": intent_counts,
        }

    async def get_global_stats(self) -> Dict[str, Any]:
        """
        Get global statistics across all users.
        
        Returns:
            Dictionary with:
            - total_sessions: Total number of sessions
            - total_messages: Total number of messages
            - top_intents: Most common intents
            - most_asked_courses: Most frequently asked about courses
            - time_series: Daily statistics
        """
        # Get all sessions (this is a simplified version - in production, use pagination)
        # For now, we'll use a sample approach
        all_sessions = await self._get_all_sessions_sample()
        
        # Count intents
        intent_counts: Dict[str, int] = {}
        course_counts: Dict[str, int] = {}
        daily_counts: Dict[str, int] = {}
        
        for session in all_sessions:
            # Intent distribution
            if session.last_intent:
                intent_counts[session.last_intent] = intent_counts.get(session.last_intent, 0) + 1
            
            # Course distribution
            if session.current_course_id:
                course_counts[session.current_course_id] = course_counts.get(session.current_course_id, 0) + 1
            
            # Daily counts
            if session.created_at:
                date_str = session.created_at.date().isoformat()
                daily_counts[date_str] = daily_counts.get(date_str, 0) + 1
        
        # Get top intents
        top_intents = sorted(
            intent_counts.items(), key=lambda x: x[1], reverse=True
        )[:10]
        
        # Get most asked courses
        most_asked_courses = sorted(
            course_counts.items(), key=lambda x: x[1], reverse=True
        )[:10]
        
        return {
            "total_sessions": len(all_sessions),
            "total_messages": sum(len(await self.message_repo.get_recent_messages(s.id, limit=10000)) for s in all_sessions),
            "top_intents": [{"intent": k, "count": v} for k, v in top_intents],
            "most_asked_courses": [{"course_id": k, "count": v} for k, v in most_asked_courses],
            "time_series": [
                {"date": k, "sessions": v} for k, v in sorted(daily_counts.items())
            ],
        }

    async def _get_all_sessions_sample(self) -> List:
        """Get a sample of all sessions (simplified - in production use pagination)."""
        # This is a placeholder - in production, implement proper pagination
        # For now, return empty list or implement a limited query
        return []

    async def search_sessions(
        self, user_id: str, query: str, limit: int = 20
    ) -> List[Dict[str, Any]]:
        """
        Search sessions by message content.
        
        Args:
            user_id: User ID to search within
            query: Search query
            limit: Maximum number of results
            
        Returns:
            List of matching sessions with preview messages
        """
        # Get all sessions for user
        sessions = await self.session_repo.list_sessions(user_id)
        
        results = []
        query_lower = query.lower()
        
        for session in sessions:
            # Get messages for this session
            messages = await self.message_repo.get_recent_messages(session.id, limit=100)
            
            # Check if any message contains the query
            matching_messages = [
                msg for msg in messages
                if query_lower in msg.text.lower()
            ]
            
            if matching_messages:
                results.append({
                    "session_id": session.id,
                    "created_at": session.created_at.isoformat() if session.created_at else None,
                    "current_course_id": session.current_course_id,
                    "last_intent": session.last_intent,
                    "matching_messages": [
                        {
                            "sender": msg.sender,
                            "text": msg.text[:200],  # Preview
                            "timestamp": msg.timestamp.isoformat() if msg.timestamp else None,
                        }
                        for msg in matching_messages[:3]  # Show up to 3 matches
                    ],
                })
        
        # Sort by relevance (number of matches) and limit
        results.sort(key=lambda x: len(x["matching_messages"]), reverse=True)
        return results[:limit]

