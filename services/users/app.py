from fastapi import FastAPI

app = FastAPI(title="users-service")

FAKE_USERS = [
    {"id": 1, "name": "Ada Lovelace"},
    {"id": 2, "name": "Grace Hopper"},
]


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
