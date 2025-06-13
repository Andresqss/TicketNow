# notification_service/publisher.py

import asyncio, json, os
from aio_pika import connect_robust, Message

RABBIT_URL = os.getenv("RABBIT_URL")

async def publish():
    connection = await connect_robust(RABBIT_URL)
    channel = await connection.channel()
    # routing_key igual al nombre del exchange para fanout
    await channel.default_exchange.publish(
        Message(body=json.dumps({
            "type": "reservation",
            "guest_email": "prueba@correo.com",
            "variables": {"name":"María","event":"Concierto","date":"2025-06-20"}
        }).encode()),
        routing_key="reservation.created"
    )
    await connection.close()
    print("Mensaje publicado ✅")

if __name__ == "__main__":
    asyncio.run(publish())
