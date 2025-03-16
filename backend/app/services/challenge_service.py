from ..utils.database import challenges_collection
from ..models.challenge import Challenge, ChallengeResponse
from ..services.user_service import get_user_by_username, get_user_by_id

async def create_challenge(creator_username: str) -> Challenge:
    user = await get_user_by_username(creator_username)
    if not user:
        return None
    
    challenge = Challenge(creator_id=str(user.id))
    result = await challenges_collection.insert_one(challenge.dict(by_alias=True, exclude_none=True))
    
    created_challenge = await challenges_collection.find_one({"_id": result.inserted_id})
    return Challenge(**created_challenge)

async def get_challenge_by_id(challenge_id: str) -> ChallengeResponse:
    challenge = await challenges_collection.find_one({"challenge_id": challenge_id})
    if not challenge:
        return None
    
    creator = await get_user_by_id(challenge["creator_id"])
    if not creator:
        return None
    
    return ChallengeResponse(
        challenge_id=challenge["challenge_id"],
        creator={
            "username": creator.username,
            "score": creator.score,
            "correct_answers": creator.correct_answers,
            "total_attempts": creator.total_attempts
        }
    )