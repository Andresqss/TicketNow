import os
import json
import asyncio
from datetime import datetime

from fastapi import FastAPI
from motor.motor_asyncio import AsyncIOMotorClient
from aio_pika import connect_robust, IncomingMessage

# 1) Cargar variables de entorno
MONGO_URL      = os.getenv("MONGO_URL")
RABBIT_URL     = os.getenv("RABBIT_URL")

# 2) Inicializar FastAPI y MongoDB
app = FastAPI()
mongo_client = AsyncIOMotorClient(MONGO_URL)
db = mongo_client.db_notification

# 3) Función de manejo de mensajes
async def handle_message(msg: IncomingMessage):
    async with msg.process():
        payload = msg.body.decode()
        print(f"[x] Mensaje recibido: {payload}")  # por ahora solo logueamos

# 4) Listener de RabbitMQ
async def rabbit_listener():
    print("→ Conectando a RabbitMQ…")
    connection = await connect_robust(RABBIT_URL)
    channel = await connection.channel()
    queue = await channel.declare_queue("notifications", durable=True)

    # Vincula la cola a tus exchanges:
    await queue.bind("reservation.created")
    await queue.bind("event.created")

    print("→ Suscrito a reservation.created y event.created, esperando mensajes…")
    await queue.consume(handle_message, no_ack=False)

# 5) Startup / Shutdown
@app.on_event("startup")
async def startup():
    app.state.rabbit_task = asyncio.create_task(rabbit_listener())

@app.on_event("shutdown")
async def shutdown():
    app.state.rabbit_task.cancel()
    mongo_client.close()

# 6) Health check
@app.get("/health")
async def health():
    return {"status": "ok", "time": datetime.utcnow()}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "notification_service.main:app",
        host=os.getenv("HOST", "0.0.0.0"),
        port=int(os.getenv("PORT", 8001)),
        reload=True
    )