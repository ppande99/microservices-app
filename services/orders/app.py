from fastapi import FastAPI

app = FastAPI(title="orders-service")

FAKE_ORDERS = [
    {"id": 101, "item": "Keyboard", "quantity": 1},
    {"id": 102, "item": "Mouse", "quantity": 2},
]


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
