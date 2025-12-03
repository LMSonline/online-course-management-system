"""
Update online learning models (bandit, recommender weights) from interaction logs.

Usage:
    python -m app.scripts.update_online_model [--hours 24] [--min-interactions 10]
"""

import asyncio
import argparse
from app.online.update import OnlineUpdateService


async def main():
    """Main update function."""
    parser = argparse.ArgumentParser(description="Update online learning models")
    parser.add_argument("--hours", type=int, default=24, help="Hours to look back")
    parser.add_argument("--min-interactions", type=int, default=10, help="Minimum interactions required")
    args = parser.parse_args()
    
    service = OnlineUpdateService()
    
    print(f"Updating online models from last {args.hours} hours...")
    result = await service.update_from_interactions(
        hours=args.hours,
        min_interactions=args.min_interactions,
    )
    
    print(f"\nUpdate result:")
    print(f"  Status: {result['status']}")
    print(f"  Interactions processed: {result['interactions_processed']}")
    
    if result["status"] == "success":
        print(f"  Bandit updates: {result['bandit_updates']}")
        print(f"\nBandit statistics:")
        for arm, stats in result["bandit_stats"].items():
            print(f"  {arm}:")
            print(f"    Count: {stats['count']}")
            print(f"    Avg Reward: {stats['average_reward']:.3f}")
            print(f"    Total Reward: {stats['total_reward']:.3f}")


if __name__ == "__main__":
    asyncio.run(main())

