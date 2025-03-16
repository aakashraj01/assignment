from fastapi import APIRouter, HTTPException
from ..models.challenge import Challenge, ChallengeResponse
from ..services import challenge_service

router = APIRouter()

@router.post("", response_model=Challenge)
async def create_challenge(creator_username: str):
    challenge = await challenge_service.create_challenge(creator_username)
    if not challenge:
        raise HTTPException(status_code=404, detail="User not found")
    
    return challenge

@router.get("/{challenge_id}", response_model=ChallengeResponse)
async def get_challenge(challenge_id: str):
    challenge = await challenge_service.get_challenge_by_id(challenge_id)
    if not challenge:
        raise HTTPException(status_code=404, detail="Challenge not found")
    
    return challenge