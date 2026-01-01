import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="catalog-service")

FAKE_CATALOG = [
    {"id": "sku-1", "name": "Laptop", "price": 1499.0},
    {"id": "sku-2", "name": "Headset", "price": 199.0},
    {"id": "sku-3", "name": "Monitor", "price": 329.0},
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


@app.get("/catalog")
async def list_catalog():
    return {"items": FAKE_CATALOG}


@app.post("/catalog")
async def create_item(item: dict):
    record = {"id": item.get("id"), **item}
    FAKE_CATALOG.append(record)
    return record
