import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="orders-service")

FAKE_ORDERS = [
    {"id": 101, "item": "Keyboard", "quantity": 1},
    {"id": 102, "item": "Mouse", "quantity": 2},
    {"id": 103, "item": "Standing Desk", "quantity": 1},
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


@app.get("/orders")
async def list_orders():
    return {"orders": FAKE_ORDERS}


@app.post("/orders")
async def create_order(order: dict):
    new_id = max(o["id"] for o in FAKE_ORDERS) + 1 if FAKE_ORDERS else 1
    record = {"id": new_id, **order}
    FAKE_ORDERS.append(record)
    return record
