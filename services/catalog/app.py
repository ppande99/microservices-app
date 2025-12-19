from fastapi import FastAPI

app = FastAPI(title="catalog-service")

FAKE_CATALOG = [
    {"id": "sku-1", "name": "Laptop", "price": 1499.0},
    {"id": "sku-2", "name": "Headset", "price": 199.0},
]


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
