import os

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="users-service")

FAKE_USERS = [
    {"id": 1, "name": "Ada Lovelace"},
    {"id": 2, "name": "Grace Hopper"},
    {"id": 3, "name": "Alan Turing"},
]

allowed_origins = [
    origin.strip()
    for origin in os.getenv("ALLOWED_ORIGINS", "*").split(",")
    if origin.strip()
]

allow_credentials = "*" not in allowed_origins

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins or ["*"],
    allow_credentials=allow_credentials,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.get("/users")
async def list_users():
    return {"users": FAKE_USERS}


@app.post("/users")
async def create_user(user: dict):
    new_id = max(u["id"] for u in FAKE_USERS) + 1 if FAKE_USERS else 1
    record = {"id": new_id, **user}
    FAKE_USERS.append(record)
    return record


@app.delete("/users/{user_id}")
async def delete_user(user_id: int):
    for index, user in enumerate(FAKE_USERS):
        if user["id"] == user_id:
            return FAKE_USERS.pop(index)
    raise HTTPException(status_code=404, detail="User not found")
